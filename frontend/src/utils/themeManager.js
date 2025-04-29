export const themeManager = {
    data() {
        return {
            currentTheme: localStorage.getItem('theme') || 'theme-blue'
        }
    },
    methods: {
        changeTheme(theme) {
            this.currentTheme = `theme-${theme}`;
            localStorage.setItem('theme', this.currentTheme);
        }
    },
    mounted() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            this.currentTheme = savedTheme;
        }
    }
}