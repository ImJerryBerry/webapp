<template>
  <div class="index-container" :class="currentTheme">
    <div class="content-box">
      <!-- 第一排按钮 -->
      <div class="button-row">
        <router-link to="/login" class="action-button">登录</router-link>
        <router-link to="/register" class="action-button">注册</router-link>
        <router-link to="/change-password" class="action-button">修改密码</router-link>
      </div>
      
      <!-- 第二排按钮 -->
      <div class="button-row">
        <router-link to="/home" class="action-button">进入主页</router-link>
        <a href="http://localhost:8080/test.html" class="action-button" target="_blank">API测试页面</a>
      </div>
      
    </div>
  </div>
</template>

<script>
import { themeManager } from "@/utils/themeManager.js";

export default {
  name: "Index",
  mixins: [themeManager],
  data() {
    return {
      currentTheme: localStorage.getItem('theme') || 'blue'
    }
  },
  mounted() {
    // 主题初始化
    document.body.className = this.currentTheme;
  }
}
</script>

<style scoped>
.index-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
  font-family: 'PingFang SC', 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

.content-box {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 700px;
  padding: 40px;
  text-align: center;
}

.title {
  font-size: 2.5rem;
  margin-bottom: 15px;
  color: #333;
}

.subtitle {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 40px;
}

.button-row {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 30px;
}

.action-button {
  display: inline-block;
  padding: 14px 24px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  min-width: 120px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* 主题相关样式 */
.blue .action-button {
  background-color: #1976d2;
  color: white;
}

.blue .action-button:hover {
  background-color: #1565c0;
  transform: translateY(-3px);
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
}

.yellow .action-button {
  background-color: #ff9800;
  color: white;
}

.yellow .action-button:hover {
  background-color: #f57c00;
  transform: translateY(-3px);
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
}

.footer {
  margin-top: 40px;
  font-size: 0.9rem;
  color: #999;
}

/* 响应式调整 */
@media (max-width: 600px) {
  .content-box {
    padding: 30px 20px;
  }
  
  .button-row {
    flex-direction: column;
    gap: 15px;
  }
  
  .action-button {
    width: 100%;
  }
  
  .title {
    font-size: 2rem;
  }
}
</style>
