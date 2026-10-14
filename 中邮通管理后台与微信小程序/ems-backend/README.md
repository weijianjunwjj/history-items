<p align="center">
  <a href="https://github.com/zclzone/vue-naive-admin">
    <img alt="Vue Naive Admin Logo" width="200" src="./src/assets/images/logo.png">
  </a>
</p>
<p align="center">
  <a href="./LICENSE"><img alt="MIT License" src="https://badgen.net/github/license/zclzone/vue-naive-admin"/></a>
</p>

<p align='center'>
  <b>中文</b> | 
  <a href="https://github.com/zclzone/vue-naive-admin/blob/main/README.EN.md">English</a>
</p>

### 简介

[Vue Naive Admin](https://github.com/zclzone/vue-naive-admin) 是一个 **开源免费且允许商用** 的后台管理模板，基于 `Vue3、Vite4、Pinia、Unocss 和 Naive UI` 等前端最新技术栈。相较于其他比较流行的后台管理模板，此项目更加简洁、轻量，风格清新，上手成本非常低，非常适合中小型项目或者个人项目。

### 功能

- 🍒 集成 [Naive UI](https://www.naiveui.com)
- 🍑 集成登陆、注销及权限验证
- 🍐 集成多环境配置，dev、测试、生产环境
- 🍎 集成 `eslint + prettier`，代码约束和格式化统一
- 🍌 集成 `husky + commitlint`，代码提交规范化
- 🍉 集成 `mock` 接口服务，dev 环境和发布环境都支持，可动态配置是否启用 mock 服务，不启用时不会加载 mock 包，减少打包体积
- 🍍 集成 `pinia`，vuex 的替代方案，轻量、简单、易用
- 📦 集成 `unplugin` 插件，自动导入，解放双手，开发效率直接起飞
- 🤹 集成 `iconify` 图标，支持自定义 svg 图标, 优雅使用 icon
- 🍇 集成 `unocss`，antfu 开源的原子 css 解决方案，非常轻量

### 预览

[https://template.qszone.com](https://template.qszone.com)

[https://template.isme.top](https://template.isme.top)

[https://base.isme.top](https://base.isme.top)

### 文档

项目文档: [Vue Naive Admin Docs](https://zclzone.github.io/vue-naive-admin-docs)

从 0 到 1 搭建后台: [从 0 到 1，带你搭建 Vite+Vue3+Pinia+Naive UI 后台](https://juejin.cn/column/7093180796424421384)

如何安装 pnpm: [安装 pnpm](docs/安装pnpm.md)

如何使用图标: [使用图标](docs/使用图标.md)

如何使用 unocss: [保熟的 UnoCSS 使用指北，优雅使用 antfu 大佬的原子化 CSS](https://juejin.cn/post/7142466784971456548)

### 快速开始

```shell
# 推荐配置git autocrlf 为 false（本项目规范使用lf换行符，此配置是为防止git自动将源文件转换为crlf）
# 不清楚为什么要这样做的请参考这篇文章：https://www.freesion.com/article/4532642129
git config --global core.autocrlf false

# 克隆项目
git clone https://github.com/zclzone/vue-naive-admin.git

# 进入项目目录
cd vue-naive-admin

# 安装依赖(建议使用pnpm: https://pnpm.io/zh/installation)
npm i -g pnpm # 装了可忽略
pnpm i # 或者 npm i

# 启动
pnpm dev
```

### 构建发布

```shell
# 构建测试环境
pnpm build:test

# 构建github pages环境
pnpm build:github

# 构建生产环境
pnpm build
```

### 其他指令

```shell
# eslint代码格式检查
pnpm lint

# 代码检查并修复
pnpm lint:fix

# 预览发布包效果（需先执行构建指令）
pnpm preview

# 提交代码（husky+commitlint）
pnpm cz
```

### 目录说明

```
Vue Naive Admin
|-- .github                             // github相关，如推送github仓库后自动部署gh pages
|-- .husky                              // git commit钩子
|-- .vscode                             // vscode编辑器相关
|   |-- extensions.json                 // 插件推荐
|   |-- settings.json                   // 项目级别的vscode配置，优先级大于全局vscode配置
|-- build                               // 构建相关配置
|   |-- constant.js                     // 构建相关的常量
|   |-- utils.js                        // 构建相关的工具方法
|   |-- config
|   |   |-- define.js                   // 注入全局常量，启动或打包后将添加到window中
|   |   |-- proxy.js                    // 代理配置
|   |-- plugin
|   |   |-- html.js                     // vite-plugin-html插件，用于注入变量或者html标签
|   |   |-- mock.js                     // vite-plugin-mock插件，处理mock
|   |   |-- unplugin.js                 // unplugin相关插件，包含DefineOptions和自动导入
|   |-- script                          // 打包完成后执行的一些node脚本（不重要）
|       |-- build-cname.js              // 自动生成cname
|-- mock                                // mock
|   |-- utils.js                        // mock请求需要用到的工具方法
|   |-- api                             // mock接口
|-- public                              // 公共资源，文件夹下的文件会在打包后会直接加到dist根目录下
|-- settings                            // 项目配置
|   |-- proxy-config.js                 // 代理配置文件
|   |-- theme.json                      // 主题配置项，主题色等
|-- src
|   |-- api                             // 公共api
|   |-- assets                          // 静态资源
|   |   |-- images                      // 图片
|   |   |-- svg                         // svg图标
|   |-- components                      // 全局组件
|   |   |-- common                      // 公共组件
|   |   |-- icon                        // icon相关组件
|   |   |-- page                        // 页面组件
|   |   |-- query-bar                   // 查询选项
|   |   |-- table                       // 封装的表格组件
|   |-- composables                     // 封装的组合式函数
|   |-- layout                          // 布局相关组件
|   |   |-- components
|   |       |-- AppMain.vue             // 主体内容
|   |       |-- header                  // 头部
|   |       |-- sidebar                 // 侧边菜单栏
|   |       |-- tags                    // 多页签栏
|   |-- router                          // 路由
|   |   |-- guard                       // 路由守卫
|   |   |-- routes                      // 路由列表
|   |-- store                           // 状态管理（pinia）
|   |   |-- modules                     // 模块
|   |       |-- app                     // 管理页面重新加载、折叠菜单栏和keepAlive等
|   |       |-- permission              // 权限相关，管理权限菜单
|   |       |-- tags                    // 管理多页签
|   |       |-- user                    // 用户模块，管理用户信息、登录登出
|   |-- styles                          // 样式
|   |-- utils                           // 封装的工具方法
|   |   |-- auth                        // 权限相关，如token、跳转登录页等
|   |   |-- common                      // 通用
|   |   |-- http                        // 封装axios
|   |   |-- storage                     // 封装localStorage和sessionStorage
|   |-- views                           // 页面
|   |   |-- demo                        // 示例
|   |   |-- error-page                  // 错误页
|   |   |-- login                       // 登录页
|   |   |-- workbench                   // 首页
|   |-- App.vue
|   |-- main.js
|-- .cz-config.js                       // git提交配置
|-- .editorconfig                       // 编辑器配置
|-- .env                                // 环境文件，所有环境都会载入
|-- .env.development                    // 开发环境文件
|-- .env.production                     // 生产环境文件
|-- .env.test                           // 测试环境文件
|-- .eslintignore                       // eslint忽略
|-- .eslintrc.js                        // eslint配置
|-- .gitignore                          // git忽略
|-- .prettierignore                     // prettier格式化忽略
|-- commitlint.config.js                // commitlint规范配置
|-- index.html
|-- jsconfig.json                       // js配置
|-- LICENSE                             // 协议
|-- package.json                        // 依赖描述文件
|-- pnpm-lock.yaml                      // 依赖锁定文件
|-- prettier.config.js                  // prettier格式化配置
|-- README.md                           // 项目描述文档（英文）
|-- README.zh-CN.md                     // 项目描述文档（中文）
|-- unocss.config.js                    // unocss配置
|-- vite.config.js                      // vite配置
```

### TS 版本: Qs Admin

#### 源码

- github: [https://github.com/zclzone/qs-admin](https://github.com/zclzone/qs-admin)
- gitee: [https://gitee.com/zclzone/qs-admin-ts](https://gitee.com/zclzone/qs-admin-ts)

#### 预览

- [https://admin.qszone.com](https://admin.qszone.com)
- [https://zclzone.github.io/qs-admin](https://zclzone.github.io/qs-admin)

### 使用该项目的开源项目

- [gin-vue-blog](https://github.com/szluyu99/gin-vue-blog): Golang 全栈博客项目, 博客后台的前端基于 vue-naive-admin，对接真实后端服务，实现了后端控制路由等特性。
