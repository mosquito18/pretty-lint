# pretty-lint

主要步骤
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