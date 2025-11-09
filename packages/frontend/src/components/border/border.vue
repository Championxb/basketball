<template>
  <div class="pageItemBody">
    <div
      class="pageItemBodyInner"
      :class="{ 'big-bg': type !== 'min' }"
      ref="inner"
      v-if="show"
    >
      <titleCom
        :type="type"
        :showDecoration="showDecoration"
        :icon="icon"
        :name="name"
      />
      <!-- 主题部分 -->
      <div class="itemMain">
        <slot></slot>
      </div>
      <!-- 图片背景 -->
      <div class="bgImg"></div>
    </div>
    <!-- 向下展开的背景 -->
    <div class="bg" ref="bgRef" v-if="!show"></div>
  </div>
</template>

<script setup>
import gsap from "gsap";
import titleCom from "./titleCom.vue";
import { ref, onMounted, nextTick } from "vue";

const props = defineProps({
  name: {
    type: String,
    default: "",
  },
  icon: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "min",
  },
  showDecoration: {
    type: Boolean,
    default: true,
  },
  delay: {
    type: Number,
    default: 0,
  },
  duration: {
    type: Number,
    default: 0.5,
  },
});
const show = ref(false);
const inner = ref(null);
const bgRef = ref(null);
onMounted(() => {
  gsap.to(bgRef.value, {
    height: "100%",
    delay: props.delay,
    duration: props.duration,
    ease: "none",
    onComplete: () => {
      setTimeout(() => {
        show.value = true; // 显示内容
        nextTick(() => {
          // 等待 DOM 更新
          if (inner.value) {
            // 安全访问
            gsap.to(inner.value, {
              opacity: 1,
              duration: 1,
            });
          }
        });
      }, 100);
    },
  });
});
</script>

<style lang="scss" scoped>
.pageItemBody {
  width: 100%;
  position: relative;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: nowrap;
  flex-direction: column;
  z-index: 1;
  align-content: flex-start;
  border-radius: 5px;

  .pageItemBodyInner {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-wrap: nowrap;
    flex-direction: column;
    z-index: 1;
    align-content: flex-start;
    opacity: 0;
    background: url("./assets/itembg.png") no-repeat;
    background-size: 100% 100%;

    &.big-bg {
      background: url("./assets/itembgBig.png") no-repeat;
      background-size: 100% 100%;
    }

    .bgImg {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 0;
      width: 100%;
      height: 100%;
    }

    .itemMain {
      position: relative;
      width: 100%;
      height: calc(100% - 45px);
      margin-top: 5px;
      z-index: 10;
    }
  }
  .bg {
    height: 0%; /* 初始高度为 0% */
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    background: linear-gradient(
      to bottom,
      rgba(#56a7c5, 0) 0%,
      rgba(#13a9d6, 1) 100%
    );
  }
}
</style>
