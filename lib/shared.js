import * as babel from '@babel/core';
import { blankLine, eslintImport, eslintPluginCall } from './ast.js';

export const commonPackages = [
  'eslint',
  'prettier',
  'eslint-plugin-prettier',
  'eslint-config-prettier',
  'vite-plugin-eslint',
];

export const eslintConfig = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  overrides: [],
};

export const prettierConfig = {
  trailingComma: 'es5',
  tabWidth: 2,
  semi: true,
  singleQuote: true,
};

export const eslintIgnore = ['node_modules', 'dist'];


export function viteEslint(code) {
  const ast = babel.parseSync(code, {
    sourceType: 'module',
    comments: false,
  });

  const { program } = ast;

  const importList = program.body
    .filter((body) => {
      return body.type === 'ImportDeclaration';
    })
    .map((body) => {
      // 删除 import 行尾注释
      delete body.trailingComments;
      return body;
    });

  if (importList.find((body) => body.source.value === 'vite-plugin-eslint')) {
    return code
  }

  const nonImportList = program.body.filter((body) => {
    return body.type !== 'ImportDeclaration';
  });

  const exportStatement = program.body.find(
    (body) => body.type === 'ExportDefaultDeclaration'
  );

  // NOTE: 判断当前声明的类型是否为 函数调用表达式
  if (exportStatement.declaration.type === 'CallExpression') {
    // NOTE: 取出函数调用表达式的入参
    const [argument] = exportStatement.declaration.arguments;

    // NOTE: 判断入参的类型是否为对象表达式
    if (argument.type === 'ObjectExpression') {

      // NOTE: 取出对象表达式的 plugins 属性
      const plugin = argument.properties.find(
        ({ key }) => {
          return key.name === 'plugins'
        }
      );

      if (plugin) {
        // NOTE: 把 vite-plugin-eslint 插件加入到 plugins 属性中
        plugin.value.elements.push(eslintPluginCall);
      }
    }
  }

  importList.push(eslintImport);
  importList.push(blankLine);
  program.body = importList.concat(nonImportList);

  ast.program = program;

  // NOTE: 将 AST 转换为代码
  return babel.transformFromAstSync(ast, code, { sourceType: 'module' }).code;
}