<template>
  <div class="container">
    <h1>欢迎来到首页</h1>
  </div>
</template>
<style lang="scss" scoped>
@keyframes gradientFlow {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
.container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Orbitron", sans-serif;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);

  background: linear-gradient(-45deg, #3a1c71, #d76d77, #2ebf91, #00c9ff);
  background-size: 400% 400%;
  animation: gradientFlow 10s ease infinite;
}
</style>
