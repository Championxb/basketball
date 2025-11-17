<template>
    <div class="wrapper">
        <!-- <div class="btn" v-for="(item, idx) in localItems" :key="'bg-' + idx" :style="{ '--delay': idx * 0.1 + 's' }"> </div> -->
        <Button class="btn" v-for="(item, idx) in localItems" :key="idx" :label="item.name" :checked="item.checked"
            @toggle="onToggle(idx)" :style="{ '--delay': idx * 0.1 + 's' }" />
    </div>
</template>

<script setup>
import { ref, watch } from "vue";
import Button from "./button.vue";

const props = defineProps({
    items: {
        type: Array,
        default: () => [
            { name: "场地a", key: 0, checked: true },
            { name: "场地b", key: 1, checked: false },
            { name: "场地c", key: 2, checked: false },
            { name: "场地d", key: 3, checked: false },
        ],
    },
});
const emit = defineEmits(["update:items"]);

// 本地可变副本，避免直接修改 props
const localItems = ref(props.items.map((i) => ({ ...i })));
watch(
    () => props.items,
    (v) => {
        localItems.value = (v || []).map((i) => ({ ...i }));
    },
    { deep: true }
);

function onToggle(index) {
    localItems.value = localItems.value.map((item, i) => ({
        ...item,
        checked: i === index, // 只有当前点击的为 true，其余全部 false
    }));
    // 向外发射更新副本，父组件可使用 v-model:items 或监听
    emit("update:items", JSON.parse(JSON.stringify(localItems.value)));
}
</script>

<style lang="scss" scoped>
.wrapper {
    position: fixed;
    top: 58px;
    left: 20px;
    display: flex;
    gap: 10px;
    align-items: center;

    /* 背景容器可选，删除背景以便按钮自己的背景可见 */
    /* background: #ec0b0b; */
    // .btn {
    //     opacity: 0;
    //     transform: translateY(1em);
    //     animation: appear 0.8s forwards;
    //     animation-delay: var(--delay);
    //     font-family: DingTalkJinBuTi;
    //     font-weight: 400;
    //     font-size: 20px;
    //     color: #fbffff;
    // }
}

@keyframes appear {
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
