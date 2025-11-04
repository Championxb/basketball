<template>
  <div class="container">
    <!-- <img src="@assets/header.svg" alt="" /> -->
    <Header />
    <div class="wrapper">
      <h1>欢迎来到首页</h1>
      <div class="box"></div>
    </div>
  </div>
</template>
<script setup>
import Header from "@/components/header.vue";
</script>
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
  width: 100vw;
  height: 100vh;
  font-family: "Orbitron", sans-serif;
  font-size: font(32px);
  text-shadow: 0 0 10px rgba(230, 237, 207, 0.5);

  background: linear-gradient(-45deg, #3a1c71, #d76d77, #2ebf91, #00c9ff);
  background: rgb(173, 172, 211);
  background-size: 400% 400%;
  animation: gradientFlow 10s ease infinite;

  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    .box {
      width: vw(200px);
      height: vh(200px);
      background-color: rgba(255, 255, 255, 0.2);
    }
  }
}
</style>
