<template>
  <div class="home-container" :class="currentTheme">
    <!-- 左侧菜单 -->
    <div class="sidebar">
      <div class="menu-item active" @click="navigateTo('home')">首页</div>

      <!-- 功能菜单 -->
      <div class="menu-group">
        <div class="menu-title" @click="toggleSubmenu('function')">
          功能菜单
          <span class="arrow" :class="{ 'arrow-down': openMenus.function }">▶</span>
        </div>
        <div class="submenu" v-show="openMenus.function">
          <div class="submenu-item" @click="$router.push('/user-management')">联系人管理</div>
          <div class="submenu-item" @click="$router.push('/article-management')">文章管理</div>
        </div>
      </div>

      <!-- 主题切换 -->
      <div class="menu-group">
        <div class="menu-title" @click="toggleSubmenu('theme')">
          主题切换
          <span class="arrow" :class="{ 'arrow-down': openMenus.theme }">▶</span>
        </div>
        <div class="submenu" v-show="openMenus.theme">
          <div class="submenu-item" @click="changeTheme('blue')">蓝色风格</div>
          <div class="submenu-item" @click="changeTheme('yellow')">黄色风格</div>
        </div>
      </div>

      <div class="menu-item" @click="navigateTo('nav3')">导航三</div>
      <div class="menu-item" @click="navigateTo('nav4')">导航四</div>
    </div>

    <!-- 右侧内容区 -->
    <div class="main-content">
      <!-- 顶部菜单区域 -->
      <div class="top-menu">
        <div class="menu-left">
          <span class="home" @click="navigateTo('home')">首页</span>
        </div>
        <div class="menu-right">
          <div class="user-dropdown">
            <div 
              class="user-dropdown-toggle" 
              :class="{ 'open': dropdownOpen }" 
              @click="toggleDropdown">
              <span class="username-display">{{ username }} 用户</span>
              <span class="dropdown-arrow">▼</span>
            </div>
            <div class="dropdown-menu" :class="{ 'open': dropdownOpen }">
              <div class="dropdown-item danger" @click="handleLogout">退出登录</div>
            </div>
          </div>
        </div>
      </div>

      <div class="content-wrapper">
        <div class="content-left">
          <div class="welcome-section">
            <div class="avatar-container">
              <img :src="avatarUrl" alt="用户头像" class="avatar" />
            </div>
          </div>
        </div>
        <div class="content-right">
          <div class="user-info-container">
            <h2 class="section-title">用户基本信息</h2>
            <div class="info-item">
              <span class="info-label">用户名：</span>
              <span class="info-value">{{ username }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">邮箱：</span>
              <span class="info-value">{{ email }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">余额：</span>
              <span class="info-value">¥{{ balance }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">生日：</span>
              <span class="info-value">{{ birthDate || '暂无数据' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import homeJs from "@/assets/js/home.js";
import { themeManager } from "@/utils/themeManager.js";

export default {
    mixins: [homeJs, themeManager],
    mounted() {
        this.changeTheme(this.currentTheme.replace('theme-', ''));
    }
};
</script>

<style scoped>
@import "@/assets/styles/home.css";
</style>
