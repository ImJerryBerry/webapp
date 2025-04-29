// register.js
export default {
    data() {
        return {
            avatar: null,
            formData: {
                username: "",
                password: "",
                email: "",
                birthDate: ""
            }
        }
    },
    methods: {
        triggerFileInput() {
            this.$refs.fileInput.click();
        },

        handleAvatarUpload(event) {
            const file = event.target.files[0];
            if (file) {
                if (file.size > 2 * 1024 * 1024) {  // 限制文件大小为2MB
                    this.$message.warning("图片大小不能超过2MB！");
                    return;
                }
                
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.avatar = e.target.result;
                    this.formData.avatar = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        },

        async submitForm() {
            if (this.validateForm(this.formData)) {
                try {
                    const userData = {
                        username: this.formData.username,
                        password: this.formData.password,
                        email: this.formData.email,
                        birthDate: this.formData.birthDate,
                        avatar: this.avatar
                    };

                    const response = await fetch('http://localhost:8080/api/user/register', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(userData)
                    });

                    const result = await response.json();
                    
                    if (result.code === 200) {
                        this.$message.success("注册成功！");
                        this.$router.push('/login');
                    } else {
                        // 显示后端返回的具体错误信息
                        this.$message.error(result.message || "注册失败！");
                    }
                } catch (error) {
                    console.error('注册错误：', error);
                    this.$message.error("注册失败，请稍后重试。");
                }
            }
        },

        validateForm(formData) {
            const { username, password, email, birthDate } = formData;

            if (!username || !password || !email || !birthDate) {
                this.$message.warning("用户名、密码、邮箱和出生日期不能为空！");
                return false;
            }

            if (!this.avatar) {
                this.$message.warning("请上传头像！");
                return false;
            }

            const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
            if (!emailPattern.test(email)) {
                this.$message.warning("请输入有效的电子邮箱！");
                return false;
            }

            return true;
        }
    }
};
