# Web应用平台 (WebApp)

这是一个基于 Vue.js 前端和 Spring Boot 后端的全栈 Web 应用程序。该平台提供用户认证、文章管理、联系人管理等功能，采用现代化的 UI 设计和响应式布局，支持多主题切换。

## 项目结构

项目分为前端和后端两个部分:

### 前端 (Vue.js)

```
frontend/
├── public/           # 静态资源文件夹
├── src/
│   ├── assets/       # 资源文件
│   │   ├── js/       # JavaScript 业务逻辑
│   │   ├── styles/   # CSS 样式文件
│   │   └── pc.json   # 省市数据
│   ├── components/   # 可复用组件
│   ├── router/       # 路由配置
│   ├── utils/        # 工具函数
│   ├── views/        # 页面组件
│   ├── App.vue       # 根组件
│   └── main.js       # 应用入口
├── index.html        # HTML 模板
├── package.json      # 依赖管理
└── vite.config.js    # Vite 配置
```

### 后端 (Spring Boot)

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/example/webapp/
│   │   │   ├── config/       # 配置类
│   │   │   ├── controller/   # 控制器
│   │   │   ├── dao/          # 数据访问层
│   │   │   ├── entity/       # 实体类
│   │   │   ├── service/      # 服务层
│   │   │   │   └── impl/     # 服务实现
│   │   │   ├── utils/        # 工具类
│   │   │   └── WebApplication.java  # 应用入口
│   │   └── resources/
│   │       ├── mapper/       # MyBatis映射文件
│   │       ├── static/       # 静态资源
│   │       └── application.yml  # 应用配置
└── pom.xml           # Maven依赖管理
```

## 功能特性

### 用户管理
- 用户注册与登录
- 密码修改
- 用户信息展示

### 文章管理
- 文章列表展示
- 添加/编辑/删除文章
- 作者文章统计与图表展示
- 文章搜索功能

### 联系人管理
- 联系人列表展示
- 添加/编辑/删除联系人
- 省市级联选择
- 联系人搜索功能

### UI/UX
- 响应式设计，适配各种屏幕尺寸
- 蓝色/黄色主题切换
- 动态分页
- 用户友好的交互界面

## 技术栈

### 前端
- **框架**: Vue.js 3.5
- **构建工具**: Vite 6.2
- **UI组件**: Element Plus 2.9
- **路由**: Vue Router 4.5
- **HTTP客户端**: Axios 1.8
- **图表**: ECharts 5.6

### 后端
- **框架**: Spring Boot 3.2
- **数据库**: MySQL 8.0
- **ORM**: MyBatis 3.0
- **项目管理**: Maven

## 开始使用

### 前端启动

```bash
# 安装依赖
cd frontend
npm install

# 开发模式运行
npm run dev

# 构建生产版本
npm run build
```

### 后端启动

```bash
# 编译并运行
cd backend
mvn spring-boot:run
```

### 数据库配置

在运行后端前，请确保已创建 MySQL 数据库 `WebDB`，配置信息位于 `backend/src/main/resources/application.yml`：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/WebDB
    username: root
    password: 12345678
```

## 数据库表结构

项目使用以下主要数据表：

- **userT**: 用户信息表
- **articles**: 文章信息表
- **users**: 联系人信息表

## 浏览器兼容性

- Chrome (推荐)
- Firefox
- Edge
- Safari

