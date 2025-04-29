export default {
    data() {
        return {
            authorInfo: {},
            articles: [],
            searchKeyword: '',
            currentPage: 1,
            pageSize: 5,
            pageSizeOptions: [5, 10, 20],
            currentTheme: localStorage.getItem('theme') || 'theme-blue',
            dialogVisible: false,
            confirmDialogVisible: false,
            articleToDelete: null,
            editMode: false,
            form: {
                title: '',
                content: ''
            },
            rules: {
                title: [{ required: true, message: '请输入文章标题', trigger: 'blur' }],
                content: [{ required: true, message: '请输入文章内容', trigger: 'blur' }]
            },
            openMenus: {
                function: true,
                theme: true
            },
            dropdownOpen: false,
            username: '',
        };
    },
    computed: {
        filteredArticles() {
            if (!this.searchKeyword) return this.articles;
            const keyword = this.searchKeyword.toLowerCase();
            return this.articles.filter(article => 
                article.title.toLowerCase().includes(keyword) ||
                article.content.toLowerCase().includes(keyword)
            );
        },
        displayArticles() {
            const start = (this.currentPage - 1) * this.pageSize;
            const end = start + this.pageSize;
            return this.filteredArticles.slice(start, end);
        },
        totalPages() {
            return Math.ceil(this.filteredArticles.length / this.pageSize);
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
        dialogTitle() {
            return this.editMode ? '编辑文章' : '新增文章';
        }
    },
    methods: {
        toggleSubmenu(menu) {
            this.openMenus[menu] = !this.openMenus[menu];
        },
        
        navigateTo(route) {
            if (route === 'home') {
                this.$router.push('/home');
            } else {
                console.log(`导航到: ${route}`);
            }
        },
        
        changeTheme(theme) {
            this.currentTheme = `theme-${theme}`;
            localStorage.setItem('theme', this.currentTheme);
        },
        
        goBack() {
            this.$router.push('/article-management');
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
        
        async fetchAuthorInfo() {
            // 获取URL中的作者用户名
            const username = this.$route.params.username;
            
            // 尝试从sessionStorage获取作者信息
            const authorFromSession = sessionStorage.getItem('selectedAuthor');
            if (authorFromSession) {
                this.authorInfo = JSON.parse(authorFromSession);
                // 强制设置余额为500
                this.authorInfo.balance = 500;
                
                // 如果缓存信息中没有余额或出生日期，从API获取完整信息
                if (this.authorInfo && (!this.authorInfo.balance || !this.authorInfo.birthDate)) {
                    await this.fetchCompleteUserInfo(username);
                }
                return;
            }
            
            // 如果没有缓存，则从API获取完整信息
            await this.fetchCompleteUserInfo(username);
        },
        
        // 获取完整的用户信息
        async fetchCompleteUserInfo(username) {
            try {
                const response = await fetch(`http://localhost:8080/api/user/detail?username=${username}`);
                const result = await response.json();
                if (result.code === 200) {
                    // 合并原有信息和新获取的信息
                    this.authorInfo = {
                        ...this.authorInfo,
                        ...result.data,
                        balance: 500, // 强制余额为500
                        birthDate: result.data.birthDate || '' // 确保birthDate字段存在
                    };
                } else {
                    this.$message.error(result.message);
                }
            } catch (error) {
                console.error('获取用户详细信息失败：', error);
                this.$message.error('获取用户详细信息失败，请稍后重试');
            }
        },
        
        async fetchArticles() {
            const username = this.$route.params.username;
            try {
                const response = await fetch(`http://localhost:8080/api/article/author/${username}`);
                const result = await response.json();
                if (result.code === 200) {
                    this.articles = result.data || [];
                } else {
                    this.$message.error(result.message);
                }
            } catch (error) {
                console.error('获取文章列表失败：', error);
                this.$message.error('获取文章列表失败，请稍后重试');
            }
        },
        
        previewContent(content) {
            if (!content) return '';
            // 截取前50个字符作为预览
            return content.length > 50 ? content.substring(0, 50) + '...' : content;
        },
        
        handleAdd() {
            this.editMode = false;
            this.dialogVisible = true;
            this.form = {
                title: '',
                content: ''
            };
        },
        
        handleEdit(article) {
            this.editMode = true;
            this.dialogVisible = true;
            this.form = {
                id: article.id,
                title: article.title,
                content: article.content
            };
        },
        
        handleDelete(article) {
            this.articleToDelete = article;
            this.confirmDialogVisible = true;
        },
        
        async confirmDelete() {
            if (!this.articleToDelete) return;
            
            try {
                const response = await fetch(`http://localhost:8080/api/article/delete/${this.articleToDelete.id}`, {
                    method: 'DELETE'
                });
                const result = await response.json();
                if (result.code === 200) {
                    this.$message.success('删除文章成功！');
                    this.confirmDialogVisible = false;
                    this.fetchArticles(); // 刷新文章列表
                } else {
                    this.$message.error('删除文章失败：' + result.message);
                }
            } catch (error) {
                console.error('删除文章失败：', error);
                this.$message.error('删除文章失败，请稍后重试');
            }
        },
        
        cancelDelete() {
            this.confirmDialogVisible = false;
            this.articleToDelete = null;
        },
        
        async submitForm() {
            this.$refs.articleForm.validate(async (valid) => {
                if (valid) {
                    const username = this.$route.params.username;
                    const formData = {
                        ...this.form,
                        authorUsername: username
                    };
                    
                    try {
                        const url = this.editMode 
                            ? 'http://localhost:8080/api/article/update'
                            : 'http://localhost:8080/api/article/add';
                        
                        const method = this.editMode ? 'PUT' : 'POST';
                        
                        const response = await fetch(url, {
                            method: method,
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(formData)
                        });
                        
                        const result = await response.json();
                        if (result.code === 200) {
                            this.$message.success(this.editMode ? '更新文章成功！' : '新增文章成功！');
                            this.dialogVisible = false;
                            this.fetchArticles(); // 刷新文章列表
                        } else {
                            this.$message.error(result.message || (this.editMode ? '更新文章失败！' : '新增文章失败！'));
                        }
                    } catch (error) {
                        console.error(this.editMode ? '更新文章错误：' : '添加文章错误：', error);
                        this.$message.error(this.editMode ? '更新文章失败，请稍后重试。' : '添加文章失败，请稍后重试。');
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
        
        handleSearch() {
            this.currentPage = 1; // 重置到第一页
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
            
            if (currentFirstItem >= this.filteredArticles.length) {
                this.currentPage = 1;
            }
        },
        
        formatDate(dateString) {
            if (!dateString) return '未设置';
            const date = new Date(dateString);
            return date.toLocaleDateString('zh-CN');
        },
        
        toggleDropdown() {
            this.dropdownOpen = !this.dropdownOpen;
        },
        
        closeDropdownOnOutsideClick(event) {
            const dropdown = document.querySelector('.user-dropdown');
            if (dropdown && !dropdown.contains(event.target)) {
                this.dropdownOpen = false;
            }
        },
    },
    mounted() {
        this.fetchAuthorInfo();
        this.fetchArticles();
        
        // 加载主题
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            this.currentTheme = savedTheme;
        }
        
        // 加载用户信息
        try {
            const userInfo = JSON.parse(localStorage.getItem('user') || '{}');
            this.username = userInfo.username || '';
        } catch (e) {
            console.error('获取用户信息失败', e);
        }
        
        // 添加点击外部关闭下拉菜单的事件监听
        document.addEventListener('click', this.closeDropdownOnOutsideClick);
    },
    beforeUnmount() {
        // 移除事件监听
        document.removeEventListener('click', this.closeDropdownOnOutsideClick);
    }
}; 