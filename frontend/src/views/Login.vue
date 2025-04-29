<!-- Login.vue -->

<template>
  <div class="login-container">
    <h2 class="main-title">登录</h2>
    <!-- 其他方式登录 -->
    <div class="social-login">
      <button class="qq"><img src="../assets/icon/qq.png" class="icon">QQ登录</button>
      <button class="wechat"><img src="../assets/icon/wechat.png" class="icon">微信登录</button>
      <button class="alipay"><img src="../assets/icon/alipay.png" class="icon">支付宝登录</button>
    </div>
    <!-- 账号密码登录 -->
    <div class="manual-login">
      <input type="text" v-model="username" placeholder="用户名">
      <input type="password" v-model="password" placeholder="密码">
      <button class="manual-button" @click="handleLogin">登录</button>
    </div>
    <div class="footer">
      <router-link to="/register">注册</router-link> | <router-link to="/change-password">修改密码</router-link>
    </div>
  </div>
</template>

<script>
// 引入外部的 JavaScript 文件
import loginMethods from "@/assets/js/login.js";

export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: ''
    };
  },
  methods: {
    ...loginMethods.methods  // 合并外部的 login.js 中的方法
  }
};
</script>

<style scoped>
@import "@/assets/styles/login.css";
</style>
