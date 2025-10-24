
# WebApp 部署指南

本文提供从本地开发到生产部署的完整流程，包括环境准备、数据库初始化、配置修改、启动及常见问题。

项目功能、界面设计等内容可参考：[CSDN](https://blog.csdn.net/qq_37603183/article/details/153831600?spm=1011.2415.3001.10575&sharefrom=mp_manage_link)

## 项目简介

- **前端**：Vue 3 + Vite，UI 使用 Element Plus，图表使用 ECharts。
- **后端**：Spring Boot 3 + MyBatis + MySQL。
- **功能**：
  - 用户注册/登录、修改密码、个人信息展示
  - 联系人管理（增删改查、搜索、分页、省市级联）
  - 文章管理（作者列表、作者文章管理、图表可视化、分页）
  - 主题切换（蓝色/黄色）

## 目录结构

```bash
webapp-main/
├── frontend/                  # 前端项目（Vue + Vite）
│   ├── src/
│   │   ├── views/             # 页面
│   │   ├── assets/            # 样式、图标、pc.json、省市数据、业务 JS
│   │   └── utils/             # 主题管理等
│   ├── package.json
│   └── vite.config.js         # Dev 代理已指向后端 8080
└── backend/                   # 后端项目（Spring Boot）
    ├── src/main/java/com/example/webapp
    │   ├── controller/        # REST 接口
    │   ├── service/impl/      # 业务实现
    │   ├── dao/               # MyBatis DAO
    │   ├── entity/            # 实体
    │   ├── config/CorsConfig  # 跨域配置（默认允许 5173/8080）
    │   └── WebApplication.java
    ├── src/main/resources
    │   ├── mapper/            # MyBatis XML（表名字段权威来源）
    │   ├── static/test.html   # 后端静态测试页
    │   └── application.yml    # 端口、数据源配置
    └── pom.xml
```

## 数据库初始化

后端默认连接 `WebDB` 数据库，并使用以下三张表。按顺序执行以下 SQL。

- **创建库**

```sql
CREATE DATABASE IF NOT EXISTS WebDB
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_general_ci;
```

- **用户表 userT**（用于账号注册/登录与作者统计）

```sql
USE WebDB;

CREATE TABLE IF NOT EXISTS userT (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(100),
  birth_date DATE NULL,
  avatar LONGTEXT,                 -- 保存 Base64 头像字符串更安全
  article_count INT NOT NULL DEFAULT 0,
  INDEX idx_username (username)
);
```

- **文章表 articles**

```sql
CREATE TABLE IF NOT EXISTS articles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  author_username VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  content LONGTEXT,
  create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_author (author_username),
  CONSTRAINT fk_articles_user
    FOREIGN KEY (author_username) REFERENCES userT(username)
    ON UPDATE CASCADE ON DELETE CASCADE
);
```

- **联系人表 users**（联系人管理页面的数据表）

```sql
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  date DATE NOT NULL,
  name VARCHAR(100) NOT NULL,
  province VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  address VARCHAR(255),
  zip_code VARCHAR(20) NOT NULL
);
```

## 后端配置与启动（Spring Boot）

- **修改配置文件**：`./backend/src/main/resources/application.yml`

```yaml
server:
  port: 8080

spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/WebDB?useUnicode=true&characterEncoding=utf-8&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
    username: root
    password: 12345678

mybatis:
  mapper-locations: classpath:mapper/*.xml
  type-aliases-package: com.example.webapp.entity
```

- **启动方式**

```bash
cd backend
mvn spring-boot:run
```

  - 启动验证：
    - 打开后端测试页：`http://localhost:8080/test.html`
    - 健康检查：访问任一接口，如 `GET http://localhost:8080/api/user/list`（首次为空）


## 前端配置与启动（Vue 3 + Vite）

- **安装依赖与启动开发服务器**

  ```bash
  cd frontend
  npm install
  npm run dev
  ```

- 默认运行在 `http://localhost:5173`，并通过 `vite.config.js` 的代理将 `/api` 指向后端 `http://localhost:8080`（仅对以 `/api` 开头的请求生效）。
