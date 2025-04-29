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
          <div class="submenu-item" @click="$router.push('/user-management')">联系人管理</div>
          <div class="submenu-item active" @click="$router.push('/article-management')">文章管理</div>
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

    <!-- 右侧内容区域 -->
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
        <div class="author-articles">
          <!-- 作者信息 -->
          <div class="content-wrapper">
            <div class="content-left">
              <div class="welcome-section">
                <div class="avatar-container">
                  <img :src="authorInfo.avatar || '/default-avatar.png'" alt="作者头像" class="avatar" />
                </div>
                <button class="avatar-back-btn" @click="goBack">
                  <i class="back-icon">←</i> 返回作者列表
                </button>
              </div>
            </div>
            <div class="content-right">
              <div class="user-info-container">
                <h2 class="section-title">作者基本信息</h2>
                <div class="info-item">
                  <span class="info-label">用户名：</span>
                  <span class="info-value">{{ authorInfo.username }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">邮箱：</span>
                  <span class="info-value">{{ authorInfo.email || '未设置' }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">余额：</span>
                  <span class="info-value">¥500</span>
                </div>
                <div class="info-item">
                  <span class="info-label">生日：</span>
                  <span class="info-value">{{ formatDate(authorInfo.birthDate) || '暂无数据' }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 文章管理 -->
          <div class="articles-management">
            
            <!-- 操作区 -->
            <div class="operation-area">
              <div class="left-operations">
                <button class="add-btn" @click="handleAdd">
                  <i class="plus-icon">+</i> 新增文章
                </button>
              </div>
              <div class="right-operations">
                <input type="text" v-model="searchKeyword" placeholder="请输入标题或内容">
                <button class="search-btn" @click="handleSearch">搜索</button>
              </div>
            </div>

            <!-- 表格区域 -->
            <div class="table-container">
              <table class="articles-table">
                <thead>
                  <tr>
                    <th width="10%">序号</th>
                    <th width="25%">文章标题</th>
                    <th width="40%">文章内容</th>
                    <th width="25%">操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(article, index) in displayArticles" :key="article.id">
                    <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
                    <td>{{ article.title }}</td>
                    <td>{{ previewContent(article.content) }}</td>
                    <td class="operation-cell">
                      <button class="edit-btn" @click="handleEdit(article)">编辑</button>
                      <button class="delete-btn" @click="handleDelete(article)">删除</button>
                    </td>
                  </tr>
                  <tr v-if="displayArticles.length === 0">
                    <td colspan="4" style="text-align: center; padding: 20px;">暂无文章数据</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- 分页区域 -->
            <div class="pagination">
              <div class="pagination-info">
                <span>共 {{ filteredArticles.length }} 条</span>
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
          
          <!-- 新增/编辑文章对话框 -->
          <el-dialog :title="dialogTitle" v-model="dialogVisible" width="650px">
            <el-form :model="form" :rules="rules" ref="articleForm" label-width="80px">
              <el-form-item label="标题" prop="title">
                <el-input v-model="form.title" placeholder="请输入文章标题"></el-input>
              </el-form-item>
              <el-form-item label="内容" prop="content">
                <el-input 
                  v-model="form.content" 
                  type="textarea" 
                  :rows="10"
                  placeholder="请输入文章内容">
                </el-input>
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
              确定要删除文章"{{ articleToDelete ? articleToDelete.title : '' }}"吗？此操作不可恢复。
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
  </div>
</template>

<script>
import { themeManager } from "@/utils/themeManager.js";
import authorArticlesJs from "@/assets/js/authorArticles.js";

export default {
  name: "AuthorArticles",
  mixins: [authorArticlesJs, themeManager]
};
</script>

<style scoped>
@import "@/assets/styles/home.css";
@import "@/assets/styles/authorArticles.css";

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

:deep(.el-button--danger) {
  background-color: #f56c6c !important;
  border-color: #f56c6c !important;
  color: white !important;
}

:deep(.el-button--danger:hover) {
  background-color: #f78989 !important;
  border-color: #f78989 !important;
}
</style> 