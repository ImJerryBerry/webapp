export default {
    data() {
        return {
            authors: [],
            currentPage: 1,
            pageSize: 5,
            pageSizeOptions: [5, 10, 20],
            openMenus: {
                function: true,  // 默认打开
                theme: true     // 默认打开
            },
            chartOption: {
                title: {
                    text: '用户发表文章统计',
                    left: 'left'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    },
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: [],
                    axisLabel: {
                        interval: 0,
                        rotate: 0
                    }
                },
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value} 篇'  // 这里是关键，在每个数值后添加"篇"
                    },
                },
                series: [
                    {
                        name: '文章数',
                        type: 'bar',
                        data: [],
                        itemStyle: {
                            color: function(params) {
                                // 生成不同的柱状图颜色
                                var colorList = ['#c23531','#2f4554','#61a0a8','#d48265','#91c7ae','#749f83','#ca8622'];
                                return colorList[params.dataIndex % colorList.length];
                            }
                        }
                    }
                ]
            }
        };
    },
    computed: {
        totalPages() {
            return Math.ceil(this.authors.length / this.pageSize);
        },
        displayAuthors() {
            const start = (this.currentPage - 1) * this.pageSize;
            const end = start + this.pageSize;
            return this.authors.slice(start, end);
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
        }
    },
    methods: {
        async fetchAuthors() {
            try {
                const response = await fetch('http://localhost:8080/api/article/authors');
                const result = await response.json();
                if (result.code === 200) {
                    // 直接使用后端返回的数据，不进行额外排序
                    this.authors = result.data || [];
                    this.updateChartData();
                } else {
                    this.$message.error(result.message);
                }
            } catch (error) {
                console.error('获取作者列表错误：', error);
                this.$message.error("获取作者列表失败，请稍后重试。");
            }
        },
        
        updateChartData() {
            // 获取当前页的作者数据
            const currentAuthors = this.displayAuthors;
            
            // 更新图表数据
            const names = currentAuthors.map(author => author.username);
            const counts = currentAuthors.map(author => author.articleCount || 0);
            
            this.chartOption = {
                ...this.chartOption,
                xAxis: {
                    ...this.chartOption.xAxis,
                    data: names
                },
                series: [
                    {
                        ...this.chartOption.series[0],
                        data: counts
                    }
                ]
            };
        },
        
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
        
        manageArticles(author) {
            // 存储选中的作者信息到sessionStorage，以便在文章管理页面获取
            sessionStorage.setItem('selectedAuthor', JSON.stringify(author));
            this.$router.push(`/author-articles/${author.username}`);
        },
        
        handlePrevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.updateChartData();
            }
        },
        
        handleNextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
                this.updateChartData();
            }
        },
        
        goToPage(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
                this.updateChartData();
            }
        },
        
        handleWindowResize() {
            // 强制 ECharts 重新渲染以适应新窗口大小
            if (this.$refs.chart) {
                this.$refs.chart.resize();
            }
        },
        
        handlePageSizeChange() {
            const currentFirstItem = (this.currentPage - 1) * this.pageSize;
            
            if (currentFirstItem >= this.authors.length) {
                this.currentPage = 1;
            }
            this.updateChartData();
        }
    },
    mounted() {
        this.fetchAuthors();
        
        // 从localStorage获取主题设置
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            this.currentTheme = savedTheme;
        }
        
        // 添加窗口大小变化监听器
        window.addEventListener('resize', this.handleWindowResize);
    },
    beforeUnmount() {
        // 移除事件监听器
        window.removeEventListener('resize', this.handleWindowResize);
    }
}; 