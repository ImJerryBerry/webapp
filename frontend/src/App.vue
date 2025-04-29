<template>
  <div id="app" :class="currentTheme">
    <div class="app-background">
      <main>
        <router-view @theme-changed="handleThemeChange"/>
      </main>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
/* 全局样式 */
#app {
  font-family: Arial, sans-serif;
  text-align: center;
}

.app-background {
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
}

header {
  background: #007bff;
  padding: 10px;
  color: white;
}

nav a {
  color: white;
  text-decoration: none;
  margin: 0 10px;
}

nav a:hover {
  text-decoration: underline;
}

main {
  height: 100%;
  width: 100%;
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
}
</style>
