export default {
    data() {
        return {
            username: '',
            password: ''
        };
    },
    methods: {
        async handleLogin() {
            if (!this.username || !this.password) {
                this.$message.warning("请输入用户名和密码！");
                return;
            }

            try {
                const response = await fetch(`http://localhost:8080/api/user/login?username=${this.username}&password=${this.password}`, {
                    method: 'POST'
                });
                const result = await response.json();
                
                if (result.code === 200) {
                    // 登录成功，保存用户信息
                    localStorage.setItem('user', JSON.stringify(result.data));
                    this.$message.success("登录成功！");
                    this.$router.push('/home');
                } else {
                    this.$message.error(result.message || "用户名或密码错误！");
                }
            } catch (error) {
                this.$message.error("登录失败：" + error.message);
            }
        }
    }
};
