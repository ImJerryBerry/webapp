<!-- Register.vue -->

<template>
  <div class="register-container">
    <h2 class="main-title">注册新用户</h2>
    <!-- 头像上传部分 -->
    <div class="register-avatar">
      <h3>请上传头像</h3>
      <div class="avatar-upload" @click="triggerFileInput">
        <input type="file" ref="fileInput" @change="handleAvatarUpload" style="display:none" />
        <!-- 如果有头像，显示预览；没有则显示“点击上传头像” -->
        <span v-if="!avatar">点击上传头像</span>
        <img v-if="avatar" :src="avatar" alt="头像预览" class="avatar-preview" />
      </div>
    </div>
    <!-- 注册表单部分 -->
    <div class="register-form">
      <form @submit.prevent="submitForm">
        <input type="text" v-model="formData.username" placeholder="用户名" />
        <input type="password" v-model="formData.password" placeholder="密码" />
        <input type="email" v-model="formData.email" placeholder="邮箱" />
        <input type="date" v-model="formData.birthDate" placeholder="出生日期" />
        <div class="button-group">
          <button class="register-button" type="submit">注册</button>
          <router-link to="/login">
            <button class="return-login-button" type="button">返回登录</button>
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
// 引入外部 JavaScript 文件
import registerMethods from "@/assets/js/register.js";

export default {
  name: "Register",
  data() {
    return {
      avatar: null, // 头像
      formData: {
        username: "",
        password: "",
        email: "",
        birthDate: ""
      }
    };
  },
  methods: {
    ...registerMethods.methods, // 合并外部方法
  }
};
</script>

<style scoped>
@import "@/assets/styles/register.css";
</style>
