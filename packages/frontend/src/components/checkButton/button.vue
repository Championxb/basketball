<template>
    <button class="btn" :class="{ checked: isChecked }" :style="{ backgroundImage: `url(${currentIcon})` }"
        @click="toggle" type="button">
        <span class="label">{{ label }}</span>
    </button>
</template>

<script setup>
import { computed } from "vue";
import uncheckedUrl from "./assets/unchecked.svg";
import checkedUrl from "./assets/checked.svg";

const props = defineProps({
    label: {
        type: String,
        default: "",
    },
    checked: {
        type: Boolean,
        default: false,
    },
});
const emit = defineEmits(["toggle"]);

const isChecked = computed(() => !!props.checked);
const currentIcon = computed(() =>
    isChecked.value ? checkedUrl : uncheckedUrl
);

function toggle() {
    emit("toggle");
}
</script>

<style lang="scss" scoped>
.btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 120px;
    /* 可根据需求调整 */
    height: 40px;
    /* 与 wrapper 对齐 */
    background-position: center center;
    background-repeat: no-repeat;
    background-size: contain;
    /* 保证完整显示 */
    cursor: pointer;
    color: #fff;
    font-size: 18px;
    line-height: 18px;
    //   background-color: transparent; /* 避免背景颜色遮盖图片 */

    .label {
        position: relative;
        z-index: 2;
        /* 给文字一个轻微的阴影以提升可读性 */
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
    }

    transition: transform 0.5s ease;
}

.checked {
    /* checked 状态下按钮整体轻微浮起或变化 */

    transform: translateY(-4px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}
</style>
