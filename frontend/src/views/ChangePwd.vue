<!-- ChangePwd.vue -->

<template>
  <div class="change-password-container">
    <h2 class="main-title">修改密码</h2>
    <div class="change-password-form">
      <form @submit.prevent="submitChangePassword">
        <div class="form-group">
          <div class="left-column">
            <input type="text" v-model="formData.username" placeholder="用户名" required />
            <input type="password" v-model="formData.oldPassword" placeholder="旧密码" required />
          </div>
          <div class="right-column">
            <input type="password" v-model="formData.newPassword" placeholder="新密码" required />
            <input type="password" v-model="formData.confirmNewPassword" placeholder="确认新密码" required />
          </div>
        </div>
        <div class="button-group">
          <button class="reset-password-button" type="submit">重置密码</button>
          <router-link to="/login" class="return-login-button">返回登录</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import changePwdMethods from "@/assets/js/changePwd.js";
export default {
  name: "ChangePwd",
  data() {
    return {
      formData: {
        username: "",
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: ""
      }
    };
  },
  methods: {
    ...changePwdMethods.methods, // 复用外部方法
  }
};
</script>

<style scoped>
@import "@/assets/styles/changePwd.css";
</style>