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
        <div class="article-management">
          <h2 class="page-title">文章管理</h2>
          
          <div class="article-dashboard">
            <!-- 左侧作者列表 -->
            <div class="author-list-container">
              <h3>作者列表</h3>
              <div class="table-container">
                <table class="author-table">
                  <thead>
                    <tr>
                      <th>序号</th>
                      <th>作者姓名</th>
                      <th>文章数量</th>
                      <th>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(author, index) in displayAuthors" :key="author.username">
                      <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
                      <td>{{ author.username }}</td>
                      <td>{{ author.articleCount || 0 }}</td>
                      <td>
                        <button class="manage-btn" @click="manageArticles(author)">
                          进入文章管理
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <!-- 分页区域 -->
              <div class="pagination">
                <div class="pagination-info">
                  <span>共 {{ authors.length }} 条</span>
                  <div class="page-size-selector">
                    <span>每页显示:</span>
                    <select v-model="pageSize" @change="handlePageSizeChange">
                      <option v-for="size in pageSizeOptions" :key="size" :value="size">{{ size }}条</option>
                    </select>
                  </div>
                </div>
                <div class="pagination-buttons">
                  <button @click="handlePrevPage" :disabled="currentPage === 1">&lt;</button>
                  <div v-for="page in pageNumbers" :key="page" 
                       @click="goToPage(page)" 
                       :class="['page-number', { 'current-page': page === currentPage }]">
                    {{ page }}
                  </div>
                  <button @click="handleNextPage" :disabled="currentPage === totalPages">&gt;</button>
                </div>
              </div>
            </div>
            
            <!-- 右侧图表 -->
            <div class="chart-container">
              <h3>作者发布文章统计图表</h3>
              <div class="echarts-container">
                <v-chart class="chart" ref="chart" :option="chartOption" autoresize />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import homeJs from "@/assets/js/home.js";
import articleManagementJs from "@/assets/js/articleManagement.js";
import { themeManager } from "@/utils/themeManager.js";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart } from "echarts/charts";
import { GridComponent, TooltipComponent, TitleComponent, LegendComponent } from "echarts/components";
import VChart from "vue-echarts";

use([
  CanvasRenderer,
  BarChart,
  GridComponent,
  TooltipComponent,
  TitleComponent,
  LegendComponent
]);

export default {
  name: "ArticleManagement",
  components: {
    VChart
  },
  mixins: [homeJs, articleManagementJs, themeManager]
};
</script>

<style scoped>
@import "@/assets/styles/home.css";
@import "@/assets/styles/articleManagement.css";

.chart {
  height: 400px;
  width: 100%;
}

/* 添加额外的响应式样式 */
@media (max-width: 768px) {
  .chart {
    height: 300px;
  }
  
  .content-wrapper {
    padding: 10px 0;
  }
  
  .article-management {
    padding: 0 10px;
  }
}

/* 增强表格在小屏幕上的可用性 */
@media (max-width: 480px) {
  .author-table {
    font-size: 12px;
  }
  
  .manage-btn {
    padding: 4px 6px;
    font-size: 12px;
  }
}

.home-container .sidebar .submenu .submenu-item.active {
  background-color: var(--menu-hover) !important;
  font-weight: bold !important;
}
</style> 