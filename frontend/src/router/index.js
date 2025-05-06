import { createRouter, createWebHistory } from 'vue-router'

// 导入组件
import Index from '../views/Index.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import ChangePwd from '../views/ChangePwd.vue'
import Home from '../views/Home.vue'
import HomeOld from '../views/Home-old.vue'
import UserManagement from '../views/UserManagement.vue'
import ArticleManagement from '../views/ArticleManagement.vue'
import AuthorArticles from '../views/AuthorArticles.vue'

// 路由配置
const routes = [
    {
        path: '/',
        name: 'Index',
        component: Index,
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
    },
    {
        path: '/register',
        name: 'Register',
        component: Register,
    },
    {
        path: '/change-password',
        name: 'ChangePwd',
        component: ChangePwd,
    },
    {
        path: '/home',
        name: 'Home',
        component: Home,
    },
    {
        path: '/home-old',
        name: 'HomeOld',
        component: HomeOld,
    },
    {
        path: '/user-management',
        name: 'UserManagement',
        component: UserManagement,
    },
    {
        path: '/article-management',
        name: 'ArticleManagement',
        component: ArticleManagement,
    },
    {
        path: '/author-articles/:username',
        name: 'AuthorArticles',
        component: AuthorArticles,
    },
]

// 创建并导出路由实例
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})

export default router
