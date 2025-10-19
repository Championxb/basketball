# Monorepo 前后端项目

这是一个使用monorepo管理的前后端项目，前端采用Vite和Vue3，后端使用Node.js和Koa框架，包管理器采用pnpm。

## 项目结构

```
.
├── packages/
│   ├── frontend/         # 前端项目 (Vue3 + Vite)
│   │   ├── src/          # 源代码
│   │   │   ├── api/      # API请求模块
│   │   │   ├── assets/   # 静态资源
│   │   │   ├── components/# 组件
│   │   │   └── ...       # 其他目录
│   │   └── ...           # 配置文件等
│   │
│   └── backend/          # 后端项目 (Node.js + Koa)
│       ├── src/          # 源代码
│       │   ├── config/   # 配置文件
│       │   ├── controllers/# 控制器
│       │   ├── middlewares/# 中间件
│       │   ├── routes/   # 路由
│       │   ├── services/ # 服务层
│       │   └── utils/    # 工具函数
│       └── ...           # 配置文件等
│
├── pnpm-workspace.yaml   # pnpm工作区配置
├── package.json          # 根项目配置
└── README.md             # 项目说明
```

## 安装依赖

首先确保已安装pnpm：

```bash
npm install -g pnpm
```

然后安装所有依赖：

```bash
pnpm install
```

## 开发

### 启动前端开发服务器

```bash
pnpm dev:frontend
```

### 启动后端开发服务器

```bash
pnpm dev:backend
```

### 同时启动前后端开发服务器

```bash
pnpm dev
```

## 构建

### 构建前端

```bash
pnpm build:frontend
```

### 构建后端

```bash
pnpm build:backend
```

### 构建所有项目

```bash
pnpm build
```

## 前后端通信

前端通过API模块与后端通信，API基地址默认为`http://localhost:3000`。前端使用axios进行API请求，已配置请求拦截器和响应拦截器。

## 技术栈

### 前端
- Vue 3
- Vite
- JavaScript
- Axios - HTTP客户端

### 后端
- Node.js
- Koa - Web框架
- koa-router - 路由管理
- koa-bodyparser - 请求体解析
- koa-cors - 跨域资源共享
- dotenv - 环境变量管理

## 后端项目结构说明

### 目录结构
- `config/`: 配置文件，集中管理应用配置
- `controllers/`: 控制器层，处理HTTP请求和响应
- `middlewares/`: 中间件层，处理请求前后的通用逻辑
- `routes/`: 路由层，定义API路由
- `services/`: 服务层，处理业务逻辑
- `utils/`: 工具类，提供通用功能

### API端点
- `/` - 获取欢迎信息
- `/hello` - 获取Hello信息
- `/api/user` - 获取用户信息
- `/api/products` - 获取产品列表

## 前端项目结构说明

### 主要组件
- `HelloApi.vue` - 展示与后端API通信的示例组件

### API模块
- 使用axios创建实例
- 配置请求拦截器和响应拦截器
- 封装GET、POST、PUT、DELETE等请求方法

## 开发注意事项

1. 前端API地址在`packages/frontend/src/api/index.js`中配置
2. 后端端口在`packages/backend/.env`中配置
3. 开发时确保前后端服务都已启动
4. 后端API可以在`routes`目录下添加新的路由
5. 前端可以在`api/index.js`中添加新的API接口