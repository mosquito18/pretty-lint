# pretty-lint

## 主要步骤
1. 获取用户使用的框架语言和类型type、已经包管理工具manager
2. 获取type对应的需要装的packages包，以及相应的eslint配置
3. 将通用的eslint commonPackages和 type packages拼接
4. eslint 配置拼接
5. 根据manager安装所有packages
6. 获取项目中vite.config.ts 内容
7. 通过babel.parseSync转成ast结构
    7.1 import如果存在vite-plugin-eslint，就不处理了
    7.2 import列表添加vite-plugin-eslint导入，以及其他相关eslint npm包导入
    7.3 plugins添加vite-plugin-eslint
    7.4 babel.transformFromAstSync将ast转为code
8. exec 执行install操作
9. 将修改的文件分别写入.eslintrc.json、.prettierrc.json、.eslintignore、vite.config.ts中

## 学习的知识
1. `yarn create` 

package.json
```
  "bin": {
    "create-pretty-lint": "lib/main.js"
  },
```

本地调试
先`npm link`,再 `npm create pretty-lint`

2. `babel.parseSync`和`babel.transformFromAstSync` code转ast再转回code

* 查看代码的完整 AST: https://astexplorer.net/
* AST节点：https://github.com/babel/babel/blob/main/packages/babel-parser/ast/spec.md#objectexpression
* Babel 插件通关秘籍： https://juejin.cn/book/6946117847848321055

3. 几种文件路径处理方法

- 3.1 `import.meta.url`: 当前代码所在的文件路径 -> file:///Users/edz/workspace/@mosquito/pretty-lint/lib/utils.js

- 3.2
```
import { fileURLToPath } from 'url';
fileURLToPath(import.meta.url)
//  /Users/edz/workspace/@mosquito/pretty-lint/lib/utils.js
```

- 3.3 `path.dirname(fileURLToPath(import.meta.url))`: /Users/edz/workspace/@mosquito/pretty-lint/lib

- 3.4 
```
fs.readdirSync(path.join(__dirname, 'templates')).forEach((template) => {
    const { name } = path.parse(path.join(__dirname, 'templates', template));
    OPTIONS.push(name);
  });
```

- 3.5 `process.cwd()`


## TODO

Eslint 规范整理