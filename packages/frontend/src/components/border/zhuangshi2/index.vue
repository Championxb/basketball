<template>
  <!-- 添加三个菱形方块 -->
  <div class="diamonds-container">
    <div class="diamond diamond1" ref="diamond1"></div>
    <div class="diamond diamond2" ref="diamond2"></div>
    <div class="diamond diamond3" ref="diamond3"></div>
  </div>
</template>

<script>

import gsap from 'gsap'

export default {
  name: "item1",
  data() {
    return {
    }
  },
  mounted() {
    this.animateDiamonds();
  },
  methods: {
    animateDiamonds() {
      // 第一个菱形动画
      gsap.to(this.$refs.diamond1, {
        y: -5,
        duration: 1.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // 第二个菱形动画（延迟0.4秒）
      gsap.to(this.$refs.diamond2, {
        y: -5,
        duration: 1.2,
        delay: 0.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // 第三个菱形动画（延迟0.8秒）
      gsap.to(this.$refs.diamond3, {
        y: -5,
        duration: 1.2,
        delay: 0.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }
  }
}
</script>

<style lang="scss" scoped>
/* 菱形容器样式 */
.diamonds-container {
  display: flex;
  margin-left: auto;
  align-items: center;
  position: relative;

  .diamond {
    transform: scale(0.6); /* 缩小到50% */
  }

  .diamond1 {
    background: url("./assets/dot1.png") no-repeat;
    width: 44px;
    height: 39px;
    background-size: 100% 100%;
  }

  .diamond2 {
    background: url("./assets/dot2.png") no-repeat;
    width: 44px;
    height: 39px;
    background-size: 100% 100%;
    margin-left: -25px;
    margin-right: -25px;
  }

  .diamond3 {
    background: url("./assets/dot3.png") no-repeat;
    width: 44px;
    height: 39px;
    background-size: 100% 100%;
  }
}
</style>
