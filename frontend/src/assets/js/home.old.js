export default {
    name: "Home",
    data() {
        return {
            username: '',
            avatarUrl: '',
            openMenus: {
                function: true,  // 修改为 true，默认打开
                theme: true      // 修改为 true，默认打开
            },
            weekDays: ['日', '一', '二', '三', '四', '五', '六'],
            currentYear: new Date().getFullYear(),
            currentMonth: new Date().getMonth() + 1
        };
    },
    computed: {
        calendarDays() {
            const days = [];
            const today = new Date();
            const firstDay = new Date(this.currentYear, this.currentMonth - 1, 1);
            const lastDay = new Date(this.currentYear, this.currentMonth, 0);

            const prevMonthDays = firstDay.getDay(); // 计算前面空白格数
            const totalDays = lastDay.getDate();

            // 上个月的天数填充
            const prevMonthLastDate = new Date(this.currentYear, this.currentMonth - 1, 0).getDate();
            for (let i = prevMonthDays; i > 0; i--) {
                days.push({ date: prevMonthLastDate - i + 1, currentMonth: false, isToday: false });
            }

            // 当前月份的天数
            for (let i = 1; i <= totalDays; i++) {
                days.push({
                    date: i,
                    currentMonth: true,
                    isToday: i === today.getDate() &&
                        this.currentMonth === today.getMonth() + 1 &&
                        this.currentYear === today.getFullYear()
                });
            }

            // 计算当前已经填充了多少天
            let totalFilledDays = days.length;
            let nextMonthDays = 0;

            // 如果当前天数不是 7 的倍数，填充下个月天数，确保总天数为 35 或 42
            if (totalFilledDays % 7 !== 0) {
                nextMonthDays = 7 - (totalFilledDays % 7);
            }

            // 追加下个月的天数
            for (let i = 1; i <= nextMonthDays; i++) {
                days.push({ date: i, currentMonth: false, isToday: false });
            }

            return days;
        }
    },
    methods: {
        navigateTo(route) {
            if (route === 'home') {
                this.$router.push('/home');
            } else {
                console.log(`导航到: ${route}`);
            }
        },

        handleLogout() {
            if (confirm('是否退出登录？')) {
                // 这里可以添加登出逻辑，比如清除用户信息等
                this.$router.push('/login');
            }
        },

        toggleSubmenu(menu) {
            this.openMenus[menu] = !this.openMenus[menu];
        },

        changeTheme(theme) {
            this.currentTheme = `theme-${theme}`;
            localStorage.setItem('theme', this.currentTheme); // 保存主题到本地存储
        },

        previousMonth() {
            if (this.currentMonth === 1) {
                this.currentMonth = 12;
                this.currentYear--;
            } else {
                this.currentMonth--;
            }
        },

        nextMonth() {
            if (this.currentMonth === 12) {
                this.currentMonth = 1;
                this.currentYear++;
            } else {
                this.currentMonth++;
            }
        },

        goToToday() {
            const today = new Date();
            this.currentYear = today.getFullYear();
            this.currentMonth = today.getMonth() + 1;
        }
    },
    mounted() {
        // 组件加载时从本地存储获取主题
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            this.currentTheme = savedTheme;
        }
        // 从 localStorage 获取用户信息
        const userInfo = JSON.parse(localStorage.getItem('user'));
        if (userInfo) {
            this.username = userInfo.username;
            this.avatarUrl = userInfo.avatar || '/default-avatar.png';  // 使用默认头像作为备选
        }
    }
}
