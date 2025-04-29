export default {
    data() {
        return {
            formData: {
                username: "",
                oldPassword: "",
                newPassword: "",
                confirmNewPassword: ""
            }
        };
    },
    methods: {
        async validateUsername(username) {
            try {
                const response = await fetch(`http://localhost:8080/api/user/check?username=${username}`);
                const result = await response.json();
                return result.code === 200;
            } catch (error) {
                console.error('验证用户名错误：', error);
                this.$message.error("验证用户名失败，请稍后重试。");
                return false;
            }
        },

        async submitChangePassword() {
            if (!await this.validateForm()) {
                return;
            }
            
            try {
                const response = await fetch(`http://localhost:8080/api/user/password?username=${this.formData.username}&oldPassword=${this.formData.oldPassword}&newPassword=${this.formData.newPassword}`, {
                    method: 'PUT'
                });

                const result = await response.json();
                
                if (result.code === 200) {
                    this.$message.success("密码修改成功！");
                    this.$router.push('/login');
                } else {
                    this.$message.error(result.message);
                }
            } catch (error) {
                console.error('修改密码错误：', error);
                this.$message.error("修改密码失败，请稍后重试。");
            }
        },

        async validateForm() {
            const { username, oldPassword, newPassword, confirmNewPassword } = this.formData;

            if (!username || !oldPassword || !newPassword || !confirmNewPassword) {
                this.$message.warning("请输入所有字段！");
                return false;
            }


            if (newPassword !== confirmNewPassword) {
                this.$message.warning("两次输入密码不一致！");
                return false;
            }

            // 验证用户名是否存在
            if (!await this.validateUsername(username)) {
                this.$message.error("用户名不存在！");
                return false;
            }

            return true;
        }
    }
};
