<template>
  <div class="home-container" :class="currentTheme">
    <!-- 左侧菜单 -->
    <div class="sidebar">
      <div class="menu-item" @click="navigateTo('home')">首页</div>

      <!-- 功能菜单 -->
      <div class="menu-group">
        <div class="menu-title" @click="toggleSubmenu('function')">
          功能菜单
          <span class="arrow" :class="{ 'arrow-down': openMenus.function }">▶</span>
        </div>
        <div class="submenu" v-show="openMenus.function">
          <div class="submenu-item active" @click="$router.push('/user-management')">联系人管理</div>
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
        <!-- 用户管理内容 -->
        <div class="user-management">
          <h2 class="page-title">联系人管理</h2>
          
          <!-- 操作区 -->
          <div class="operation-area">
            <div class="left-operations">
              <button class="add-btn" @click="handleAdd">
                <i class="plus-icon">+</i> 新增联系人
              </button>
            </div>
            <div class="right-operations">
              <input type="text" v-model="searchKeyword" placeholder="请输入姓名或地址">
              <button class="search-btn" @click="handleSearch">搜索</button>
            </div>
          </div>

          <!-- 表格区域 -->
          <div class="table-container">
            <table class="user-table">
              <thead>
                <tr>
                  <th>序号</th>
                  <th>日期</th>
                  <th>姓名</th>
                  <th>省份</th>
                  <th>城市</th>
                  <th>地址</th>
                  <th>邮编</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(user, index) in displayUsers" :key="user.id">
                  <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
                  <td>{{ user.date }}</td>
                  <td>{{ user.name }}</td>
                  <td>{{ user.province }}</td>
                  <td>{{ user.city }}</td>
                  <td>{{ user.address }}</td>
                  <td>{{ user.zipCode }}</td>
                  <td class="operation-cell">
                    <button class="edit-btn" @click="handleEdit(user)">编辑</button>
                    <button class="delete-btn" @click="handleDelete(user)">删除</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- 分页区域 -->
          <div class="pagination">
              <div class="pagination-info">
                  <span>共 {{ filteredUsers.length }} 条</span>
                  <div class="page-size-selector">
                      <span>每页显示：</span>
                      <select v-model="pageSize" @change="handlePageSizeChange">
                          <option v-for="size in pageSizeOptions" :key="size" :value="size">{{ size }}条</option>
                      </select>
                  </div>
              </div>
              
              <div class="pagination-buttons">
                  <button :disabled="currentPage === 1" @click="handlePrevPage">
                      <span>&lt;</span>
                  </button>
                  
                  <span 
                      v-for="page in pageNumbers" 
                      :key="page" 
                      class="page-number" 
                      :class="{ 'current-page': page === currentPage }"
                      @click="goToPage(page)">
                      {{ page }}
                  </span>
                  
                  <button :disabled="currentPage === totalPages" @click="handleNextPage">
                      <span>&gt;</span>
                  </button>
              </div>
          </div>
        </div>

        <!-- 新增/编辑用户对话框 -->
        <el-dialog :title="dialogTitle" v-model="dialogVisible" width="500px">
          <el-form :model="form" :rules="rules" ref="userForm" label-width="100px">
            <el-form-item label="* 日期" prop="date">
              <el-date-picker 
                v-model="form.date" 
                type="date" 
                placeholder="选择日期"
                value-format="YYYY-MM-DD">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="姓名" prop="name">
              <el-input v-model="form.name" placeholder="请输入姓名"></el-input>
            </el-form-item>
            <el-form-item label="省份" prop="province">
              <el-select v-model="form.province" placeholder="请选择省份" style="width: 100%" @change="handleProvinceChange">
                <el-option v-for="province in provinces" :key="province" :label="province" :value="province"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="城市" prop="city">
              <el-select v-model="form.city" placeholder="请选择城市" style="width: 100%" :disabled="!form.province">
                <el-option v-for="city in cities" :key="city" :label="city" :value="city"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="地址">
              <el-input v-model="form.address" placeholder="请输入详细地址"></el-input>
            </el-form-item>
            <el-form-item label="邮编" prop="zipCode">
              <el-input v-model="form.zipCode" placeholder="请输入邮编"></el-input>
            </el-form-item>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="cancelForm">取消</el-button>
              <el-button type="primary" @click="submitForm">确定</el-button>
            </span>
          </template>
        </el-dialog>
        
        <!-- 删除确认对话框 -->
        <el-dialog
          title="确认删除"
          v-model="confirmDialogVisible"
          width="420px">
          <div style="padding: 10px 0;">
            确定要删除用户"{{ userToDelete ? userToDelete.name : '' }}"吗？此操作不可恢复。
          </div>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="cancelDelete">取消</el-button>
              <el-button type="danger" @click="confirmDelete">确定删除</el-button>
            </span>
          </template>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import homeJs from "@/assets/js/home.js";
import userManagementJs from "@/assets/js/userManagement.js";
import { themeManager } from "@/utils/themeManager.js";

export default {
    name: "UserManagement",
    mixins: [homeJs, userManagementJs, themeManager],
    mounted() {
        this.fetchUsers();
    }
};
</script>

<style scoped>
@import "@/assets/styles/home.css";
@import "@/assets/styles/userManagement.css";

/* 使用深度选择器覆盖 Element Plus 样式 */
:deep(.el-dialog__header) {
  background-color: transparent !important;
  padding: 20px !important;
  border-bottom: 1px solid #ebeef5 !important;
}

:deep(.el-dialog__title) {
  color: #333 !important;
  font-weight: bold !important;
}

:deep(.el-dialog__footer) {
  background-color: transparent !important;
  padding: 10px 20px 20px !important;
  border-top: 1px solid #ebeef5 !important;
}

/* 删除确认对话框样式 */
:deep(.el-button--danger) {
  background-color: #f56c6c !important;
  border-color: #f56c6c !important;
  color: white !important;
}

:deep(.el-button--danger:hover) {
  background-color: #f78989 !important;
  border-color: #f78989 !important;
}

/* 添加固定顶部菜单样式 */
.top-menu {
  position: sticky !important;
  top: 0 !important;
  z-index: 100 !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
}

/* 调整主内容区域，添加适当的内边距 */
.content-wrapper {
  padding-top: 10px !important;
}
</style>
