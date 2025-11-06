<template>
  <div class="border" :style="styleVars">
    <div class="dialog">
      <span class="dialog-rect"></span>
      <div class="box"></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  width: { type: Number, default: 200 },
  height: { type: Number, default: 350 },
});

const styleVars = computed(() => {
  const vars = {};
  vars["--dynamic-width-vw"] = pxToVw(props.width);
  vars["--dynamic-height-vh"] = pxToVh(props.height);
  return vars;
});
const pxToVw = (px) => `${(px / 1920) * 100}vw`;
const pxToVh = (px) => `${(px / 1080) * 100}vh`;
</script>

<style lang="scss" scoped>
.border {
  display: inline-block;
  /* 渐变边框色 */
  --line-bg: linear-gradient(
    180deg,
    rgba(138, 203, 255, 1),
    rgba(41, 106, 143, 1),
    rgb(40, 100, 190)
  );

  /* 内容背景色 */
  --content-bg: linear-gradient(181deg, #021734 0%, #22133d 100%);

  .dialog {
    position: relative;
    font-size: vw(20);
    text-shadow: 0 vw(10) vw(12) #001025;
  }

  .box {
    width: var(--dynamic-width-vw);
    height: var(--dynamic-height-vh);
    background: var(--line-bg);
    border-radius: vw(6);
    position: relative;
    z-index: 1;
    // overflow: hidden;
    // resize: both;
    // min-width: 250px;
    // min-height: 100px;
  }

  .box::after {
    content: "";
    width: calc(100% - vw(4));
    height: calc(100% - vw(4));
    position: absolute;
    background: var(--content-bg);
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: -1;
    border-radius: vw(4);
  }

  .dialog-rect {
    width: 80%;
    height: 90%;
    position: absolute;
    right: vw(-8);
    bottom: vw(-8);
    border-radius: vw(6);
    background: #66b5f3;
    clip-path: polygon(
      0 0,
      calc(100% - vw(10)) 0,
      100% vw(10),
      100% 100%,
      vw(10) 100%,
      0 calc(100% - vw(10))
    );
  }

  .dialog-rect::after {
    content: "";
    position: absolute;
    width: calc(100% - vw(3));
    height: calc(100% - vw(3));
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: -1;
    background: #093258;
    border-radius: vw(4);
    clip-path: polygon(
      0 0,
      calc(100% - vw(10)) 0,
      100% vw(10),
      100% 100%,
      vw(10) 100%,
      0 calc(100% - vw(10))
    );
  }

  .dialog::after {
    content: "";
    border: vw(3) solid #32c5ff;
    width: 40%;
    height: 70%;
    position: absolute;
    left: vw(-1);
    top: vw(-1);
    z-index: 1;
    border-right: none;
    border-bottom: none;
    border-radius: vw(6) vw(0) vw(0) vw(0);
  }
}
</style>
