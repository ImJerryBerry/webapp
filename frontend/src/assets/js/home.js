export default {
    name: "Home",
    data() {
        return {
            username: '',
            avatarUrl: '',
            email: '',
            balance: 500,
            birthDate: '',
            openMenus: {
                function: true,
                theme: true
            },
            dropdownOpen: false
        };
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
            try {
                this.$confirm('是否确认退出登录？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    localStorage.removeItem('user');
                    this.$message.success('已安全退出');
                    this.$router.push('/login');
                });
            } catch {
                // 用户取消退出，不做任何操作
            }
        },

        toggleSubmenu(menu) {
            this.openMenus[menu] = !this.openMenus[menu];
        },

        changeTheme(theme) {
            this.currentTheme = `theme-${theme}`;
            localStorage.setItem('theme', this.currentTheme);
        },

        toggleDropdown() {
            this.dropdownOpen = !this.dropdownOpen;
        },

        closeDropdownOnOutsideClick(event) {
            const dropdown = document.querySelector('.user-dropdown');
            if (dropdown && !dropdown.contains(event.target)) {
                this.dropdownOpen = false;
            }
        }
    },
    mounted() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            this.currentTheme = savedTheme;
        }
        
        const userInfo = JSON.parse(localStorage.getItem('user'));
        if (userInfo) {
            this.username = userInfo.username;
            this.avatarUrl = userInfo.avatar || '/default-avatar.png';
            this.email = userInfo.email;
            // 格式化日期显示
            if (userInfo.birthDate) {
                const date = new Date(userInfo.birthDate);
                this.birthDate = date.toLocaleDateString('zh-CN');
            }
        }
        
        document.addEventListener('click', this.closeDropdownOnOutsideClick);
    },
    beforeUnmount() {
        document.removeEventListener('click', this.closeDropdownOnOutsideClick);
    }
};
