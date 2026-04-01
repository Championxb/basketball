<template>
    <div class="video-selector">
        <el-select v-model="selectedVideo" placeholder="选择视频" class="select-video" @change="handleVideoChange"
            size="small">
            <el-option v-for="video in videoList" :key="video" :label="video" :value="video" />
        </el-select>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { iceVideoList, iceChangeVideo } from '@/api/ice.js';

const emit = defineEmits(['videoChanged']);

// 视频列表
const videoList = ref([]);
// 当前选中的视频
const selectedVideo = ref('');
// 加载状态
const loading = ref(false);

// 加载视频列表
const loadVideoList = async () => {
    loading.value = true;
    try {
        const res = await iceVideoList();
        // 假设接口返回的是字符串列表
        if (res.data && Array.isArray(res.data)) {
            videoList.value = res.data;
            // 如果有视频，默认选择第一个
            if (res.data.length > 0) {
                selectedVideo.value = res.data[0];
            }
        }
    } catch (error) {
        console.error('获取视频列表失败:', error);
    } finally {
        loading.value = false;
    }
};

// 处理视频切换
const handleVideoChange = async (videoName) => {
    if (!videoName) return;

    try {
        await iceChangeVideo(videoName);
        emit('videoChanged', videoName);
    } catch (error) {
        console.error('切换视频失败:', error);
    }
};

// 组件挂载时加载视频列表
onMounted(() => {
    loadVideoList();
});
</script>

<style lang="scss">
/* 全局样式覆盖，确保Element Plus样式被正确覆盖 */
.video-selector {
    // position: fixed;
    // top: 110px;
    // left: 20px;
    z-index: 1000;

    .select-video {
        width: 180px !important;
        font-family: 'Orbitron', 'DIN', Arial, sans-serif !important;
        font-weight: 500 !important;
    }

    /* 选择器主体 */
    .select-video .el-select__wrapper {
        background: linear-gradient(135deg, rgba(0, 10, 30, 0.95), rgba(0, 30, 60, 0.95)) !important;
        border: 2px solid #02d5fa !important;
        border-radius: 6px !important;
        box-shadow: 0 0 20px rgba(2, 213, 250, 0.4),
            inset 0 0 20px rgba(2, 213, 250, 0.1),
            0 0 0 1px rgba(2, 213, 250, 0.2) !important;
        backdrop-filter: blur(15px) !important;
        padding: 0 12px !important;
        height: 54px !important;
        font-size: 20px !important;
        
        &:focus-within {
            box-shadow: 0 0 30px rgba(2, 213, 250, 0.6),
                inset 0 0 30px rgba(2, 213, 250, 0.2),
                0 0 0 2px rgba(2, 213, 250, 0.8) !important;
            border-color: #02d5fa !important;
            // animation: pulse 2s ease-in-out infinite !important;
        }
    }
}
</style>