// 导入省市数据
import provinceCity from '@/assets/pc.json'

export default {
    name: "UserManagement",
    data() {
        return {
            users: [],
            searchKeyword: '',
            currentPage: 1,
            pageSize: 5,
            pageSizeOptions: [5, 10, 20],
            totalUsers: 0,
            currentTheme: localStorage.getItem('theme') || 'theme-blue',
            dialogVisible: false,
            provinces: Object.keys(provinceCity),
            citiesMap: provinceCity,
            form: {
                date: new Date().toISOString().split('T')[0],
                name: '',
                province: '',
                city: '',
                address: '',
                zipCode: ''
            },
            rules: {
                name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
                province: [{ required: true, message: '请选择省份', trigger: 'change' }],
                city: [{ required: true, message: '请选择城市', trigger: 'change' }],
                zipCode: [{ required: true, message: '请输入邮编', trigger: 'blur' }]
            },
            editMode: false, // 新增标记，用于区分新增和编辑模式
            confirmDialogVisible: false, // 新增确认对话框
            userToDelete: null, // 记录要删除的用户
            dropdownOpen: false, // 控制下拉菜单显示状态
        };
    },
    computed: {
        totalPages() {
            return Math.ceil(this.filteredUsers.length / this.pageSize);
        },
        filteredUsers() {
            if (!this.searchKeyword) return this.users;
            const keyword = this.searchKeyword.toLowerCase();
            return this.users.filter(user => 
                user.name.toLowerCase().includes(keyword) ||
                user.address.toLowerCase().includes(keyword)
            );
        },
        displayUsers() {
            const start = (this.currentPage - 1) * this.pageSize;
            const end = start + this.pageSize;
            return this.filteredUsers.slice(start, end);
        },
        pageNumbers() {
            const pages = [];
            const maxVisiblePages = 5;
            let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
            let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);
            
            if (endPage - startPage + 1 < maxVisiblePages) {
                startPage = Math.max(1, endPage - maxVisiblePages + 1);
            }
            
            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }
            return pages;
        },
        cities() {
            if (!this.form.province) return [];
            return this.citiesMap[this.form.province] || [];
        },
        dialogTitle() {
            return this.editMode ? '编辑联系人' : '新增联系人';
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
        async fetchUsers() {
            try {
                const response = await fetch('http://localhost:8080/api/managed-user/list');
                const result = await response.json();
                if (result.code === 200) {
                    this.users = result.data;
                } else {
                    this.$message.error(result.message);
                }
            } catch (error) {
                console.error('获取用户列表错误：', error);
                this.$message.error("获取用户列表失败，请稍后重试。");
            }
        },
        showAddDialog() {
            this.editMode = false;
            this.dialogVisible = true;
            
            // 使用日期的简短格式，只保留 YYYY-MM-DD
            const today = new Date();
            const formattedDate = today.toISOString().split('T')[0];
            
            this.form = {
                date: formattedDate, // 只使用日期部分
                name: '',
                province: '',
                city: '',
                address: '',
                zipCode: ''
            };
        },
        showEditDialog(user) {
            this.editMode = true;
            this.dialogVisible = true;
            
            let formattedDate = user.date;
            if (formattedDate && formattedDate.includes('T')) {
                formattedDate = formattedDate.split('T')[0];
            }
            
            this.form = {
                id: user.id,
                date: formattedDate,
                name: user.name,
                province: user.province,
                city: user.city,
                address: user.address || '',
                zipCode: user.zipCode
            };
        },
        handleProvinceChange() {
            this.form.city = '';
        },
        async submitForm() {
            this.$refs.userForm.validate(async (valid) => {
                if (valid) {
                    try {
                        // 确保日期格式正确，只保留 YYYY-MM-DD 部分
                        if (this.form.date && this.form.date.includes('T')) {
                            this.form.date = this.form.date.split('T')[0];
                        }
                        
                        const url = this.editMode 
                            ? 'http://localhost:8080/api/managed-user/update'
                            : 'http://localhost:8080/api/managed-user/add';
                        
                        const method = this.editMode ? 'PUT' : 'POST';
                        
                        const response = await fetch(url, {
                            method: method,
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(this.form)
                        });
                        
                        const result = await response.json();
                        if (result.code === 200) {
                            this.$message.success(this.editMode ? '更新用户成功！' : '新增用户成功！');
                            this.dialogVisible = false;
                            this.fetchUsers();
                        } else {
                            this.$message.error(result.message || (this.editMode ? '更新用户失败！' : '新增用户失败！'));
                        }
                    } catch (error) {
                        console.error(this.editMode ? '更新用户错误：' : '添加用户错误：', error);
                        this.$message.error(this.editMode ? '更新用户失败，请稍后重试。' : '添加用户失败，请稍后重试。');
                    }
                } else {
                    this.$message.warning('请完善表单信息！');
                    return false;
                }
            });
        },
        cancelForm() {
            this.dialogVisible = false;
        },
        handleAdd() {
            this.showAddDialog();
        },
        handleEdit(user) {
            this.showEditDialog(user);
        },
        showDeleteConfirm(user) {
            this.userToDelete = user;
            this.confirmDialogVisible = true;
        },
        async handleDelete(user) {
            this.showDeleteConfirm(user);
        },
        async confirmDelete() {
            if (this.userToDelete) {
                try {
                    const response = await fetch(`http://localhost:8080/api/managed-user/delete/${this.userToDelete.id}`, {
                        method: 'DELETE'
                    });
                    const result = await response.json();
                    if (result.code === 200) {
                        this.$message.success('删除用户成功！');
                        this.confirmDialogVisible = false;
                        this.fetchUsers();
                    } else {
                        this.$message.error('删除用户失败：' + result.message);
                    }
                } catch (error) {
                    console.error('删除用户错误：', error);
                    this.$message.error('删除用户失败，请稍后重试。');
                }
            }
        },
        cancelDelete() {
            this.confirmDialogVisible = false;
            this.userToDelete = null;
        },
        handleSearch() {
            this.currentPage = 1;
        },
        handlePrevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
            }
        },
        handleNextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
            }
        },
        goToPage(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
            }
        },
        handlePageSizeChange() {
            const currentFirstItem = (this.currentPage - 1) * this.pageSize;
            
            if (currentFirstItem >= this.filteredUsers.length) {
                this.currentPage = 1;
            }
        },
        async searchUsers() {
            if (!this.searchKeyword) {
                this.fetchUsers();
                return;
            }
            
            try {
                const response = await fetch(`http://localhost:8080/api/managed-user/search?keyword=${encodeURIComponent(this.searchKeyword)}`);
                const result = await response.json();
                if (result.code === 200) {
                    this.users = result.data;
                } else {
                    this.$message.error('搜索失败：' + result.message);
                }
            } catch (error) {
                console.error('搜索用户错误：', error);
                this.$message.error('搜索失败，请稍后重试。');
            }
        },
        // 添加切换下拉菜单的方法
        toggleDropdown() {
            this.dropdownOpen = !this.dropdownOpen;
        },
        // 添加点击外部关闭下拉菜单的方法
        closeDropdownOnOutsideClick(event) {
            const dropdown = document.querySelector('.user-dropdown');
            if (dropdown && !dropdown.contains(event.target)) {
                this.dropdownOpen = false;
            }
        },
    },
    mounted() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            this.currentTheme = savedTheme;
        }
        this.fetchUsers();
        
        // 添加点击外部关闭下拉菜单的事件监听
        document.addEventListener('click', this.closeDropdownOnOutsideClick);
    },
    beforeUnmount() {
        // 移除事件监听
        document.removeEventListener('click', this.closeDropdownOnOutsideClick);
    }
};