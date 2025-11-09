<template>
  <div :class="['titleBodyCom', { titleBodyCom2: props.type !== 'min' }]">
    <titlebgAnimate v-if="props.type == 'min'"></titlebgAnimate>
    <titlebgBigAnimate v-else></titlebgBigAnimate>
    <div class="rightBottom" v-if="props.showDecoration">
      <zhuagnshi2></zhuagnshi2>
    </div>
    <div class="icons">
      <i v-if="props.icon" :class="props.icon"></i>
    </div>
    <div class="itemTitle">
      <span
          class="text"
          v-for="(char, index) in titleArray"
          :key="index"
          :style="{ '--delay': index * 0.1 + 's' }"
      >
        {{ char }}
      </span>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue'
import zhuagnshi2 from './zhuangshi2/index.vue'
import titlebgAnimate from './titlebgAnimate/index.vue'
import titlebgBigAnimate from './titlebgBigAnimate/index.vue'
// 定义 props
const props = defineProps({
  name: {
    type: String,
    default: '',
  },
  showDecoration: {
    type: Boolean,
    default: true,
  },
  icon: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'min',
  },
})

// 文字数组拆分
const titleArray = computed(() => props.name.split(''))
</script>

<style lang="scss" scoped>
.titleBodyCom {
  width: calc(100% - 20px);
  margin-left: 10px;
  position: relative;
  height: 35px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: nowrap;
  flex-direction: row;
  z-index: 1;
  align-content: flex-start;
  // background: url("./assets/titlebg.png") no-repeat;
  //background-size: 100% 100%;

  .icon {
    margin-left: 15px;
    width: 30px;
  }

  .itemTitle {
    height: 35px;
    position: relative;
    width: 100%;
    margin-left: 10px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: nowrap;
    flex-direction: row;
    align-content: flex-start;

    .iconMain {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: nowrap;
      flex-direction: row;
      align-content: flex-start;
      margin-right: 10px;
    }

    .text {
      opacity: 0;
      transform: translateY(1em);
      animation: appear 0.5s forwards;
      animation-delay: var(--delay);
      font-family: DingTalkJinBuTi;
      font-weight: 400;
      font-size: 20px;
      color: #fbffff;
    }
  }

  // 右上角拐角样式
  .corner-top-right {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 2;

    .corner-horizontal {
      width: 6px;
      height: 1px;
      background-color: #FFD700; // 明黄色
      position: absolute;
      top: 0;
      right: 0;
    }

    .corner-vertical {
      width: 1px;
      height: 6px;
      background-color: #FFD700; // 明黄色
      position: absolute;
      top: 0;
      right: 0;
    }
  }

  // 左下角拐角样式
  .corner-bottom-left {
    position: absolute;
    bottom: 2px;
    left: 0;
    z-index: 2;

    .corner-horizontal {
      width: 6px;
      height: 1px;
      background-color: #FFD700; // 明黄色
      position: absolute;
      bottom: 0;
      left: 0;
    }

    .corner-vertical {
      width: 1px;
      height: 6px;
      background-color: #FFD700; // 明黄色
      position: absolute;
      bottom: 0;
      left: 0;
    }
  }

  @keyframes appear {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
}

.titleBodyCom2 {
  background: url("./assets/titlebgBig.png") no-repeat;
  background-size: 100% 100%;
}

.dot1 {
  position: absolute;
  left: 60%;
  top: 10%;

  img {
    width: 6px;
    height: 6px;
  }
}

.dot2 {
  position: absolute;
  left: 80%;
  top: 30%;

  img {
    width: 6px;
    height: 6px;
  }
}

.rightBottom {
  position: absolute;
  right: 5px;
  top: 0%;
}

.icons {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
  flex-direction: row;
  align-content: flex-start;
  width: 30px;
  margin-left: 10px;

  i {
    font-size: 20px;
    // 渐变色
    background: linear-gradient(to bottom, #fff, #09c3dc); // 上橙下粉为例
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: transparent;
  }
}
</style>
