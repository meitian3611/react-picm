# icm-app

门户（Portal）管理系统前端，基于 Vite + React + TypeScript。

## 技术栈

| 类别 | 选型 |
| --- | --- |
| 框架 | React 19 + TypeScript |
| 构建 | Vite |
| UI | Ant Design 6 |
| 路由 | react-router-dom 7 |
| 状态管理 | Zustand |
| 请求 | Axios（封装于 `src/apis/request`） |
| Mock | json-server（`db.json`） |

## 快速开始

```bash
npm install          # 安装依赖

npm run server       # 启动 mock 服务（端口 3300）
npm run dev          # 启动前端服务（端口 6006，自动代理 /api 到 3300）
```

开发时需两个终端分别运行 `server` 与 `dev`。

## 常用命令

| 命令 | 说明 |
| --- | --- |
| `npm run dev` | 启动开发服务器（http://localhost:6006） |
| `npm run server` | 启动 json-server mock 服务（http://localhost:3300） |
| `npm run build` | 类型检查 + 生产构建（输出 `dist/`） |
| `npm run lint` | ESLint 检查 |
| `npm run preview` | 预览生产构建产物 |

## 目录结构

```
src/
├── apis/           # 请求层：axios 封装、拦截器、模块化 API
├── components/     # 通用组件（Portal 布局组件等）
├── hooks/          # 自定义 hooks（菜单展开/选中逻辑等）
├── pages/          # 页面（按业务模块分目录）
├── router/         # 路由配置（懒加载）
├── store/          # Zustand store（按模块分片）
├── types/          # 全局类型定义
└── utils/          # 工具函数
```

## 开发约定

- 路径别名：`@/` 指向 `src/`。
- 后端统一响应格式：`{ code, data, message }`，业务成功码 `code === 0`（见 `src/apis/constants.ts`）。
- 接口统一在 `src/apis/modules/` 下按模块声明，页面通过 `@/apis` 调用。
- 新增页面：在 `src/pages/` 建目录 → 在 `src/router/index.tsx` 注册路由 → 在 `db.json` 补充 mock 数据。

## Mock 说明

接口数据由 `db.json` 提供（`npm run server`），字段结构与后端约定一致；接入真实后端时，修改 `vite.config.ts` 中的代理目标即可，业务代码无需改动。
