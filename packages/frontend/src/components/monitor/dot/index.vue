<template>
  <div class="dots-container">
    <span class="dot dot1"></span>
    <span class="dot dot2"></span>
    <span class="dot dot3"></span>
    <span class="dot dot4"></span>
    <span class="dot dot5"></span>
    <span class="dot dot6"></span>
  </div>
</template>

<script>
import { gsap } from "gsap";

export default {
  name: "AnimatedDots",
  mounted() {
    this.initDotsAnimation();
  },
  methods: {
    initDotsAnimation() {
      const dots = this.$el.querySelectorAll('.dot');
      const tl = gsap.timeline({ repeat: -1 });

      dots.forEach((dot, index) => {
        tl.to(dot, {
          opacity: 1,
          duration: 0.5,
          ease: "power2.inOut"
        }, index * 0.3)
            .to(dot, {
              opacity: 0.2,
              duration: 0.5,
              ease: "power2.inOut"
            }, index * 0.3 + 0.8);
      });

      tl.to({}, { duration: 1 });
    }
  }
}
</script>

<style scoped lang="scss">
.dots-container {
  position: relative; /* 可根据需求调整定位 */
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 6px;
  z-index: 9999;

  .dot {
    width: 6px;
    height: 6px;
    background-color: #17ffd7;
    opacity: 0.2;
    border-radius: 1px;
  }
}
</style>
