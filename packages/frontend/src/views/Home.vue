<template>
  <div class="container">
    <!-- <img src="@assets/header.svg" alt="" /> -->
    <Header class="header" />
    <div class="wrapper">
      <div class="box">
        <Border :width="400" :height="350" />
        <Border :width="400" :height="350" />
        <!-- <Border :width="200" :height="350" /> -->
      </div>
      <div class="box">
        <Border :width="400" :height="350" />
        <Border :width="400" :height="350" />
        <!-- <Border :width="200" :height="350" /> -->
      </div>
    </div>
  </div>
</template>
<script setup>
import Header from "@/components/header.vue";
import Border from "@/components/border.vue";
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
  font-size: font(32);
  text-shadow: 0 0 10px rgba(230, 237, 207, 0.5);

  // background: linear-gradient(-45deg, #3a1c71, #d76d77, #2ebf91, #00c9ff);
  // background: rgba(42, 61, 189, 0.5);
  background-size: 400% 400%;
  animation: gradientFlow 10s ease infinite;
  display: flex;
  flex-direction: column;

  // overflow: hidden;
  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background: #000;
    flex: 1 1 auto;
    min-height: 0;
    .box {
      width: 98%;
      height: 98%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      background: #dc1212;
    }
  }
}
</style>
