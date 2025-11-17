<template>
    <div class="video-container">
        <div id="xgplayer"></div>
        <!-- <video ref="videoPlayer" autoplay muted loop controls>
            <source :src="videoSrc" type="video/mp4" />
            您的浏览器不支持 video 标签。
        </video> -->
    </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { SimplePlayer } from 'xgplayer';
import 'xgplayer/dist/index.min.css';
import Start from 'xgplayer/es/plugins/start'
import PC from 'xgplayer/es/plugins/pc'
import Mobile from 'xgplayer/es/plugins/mobile'
import Progress from 'xgplayer/es/plugins/progress'
import Time from 'xgplayer/es/plugins/time'
import Play from 'xgplayer/es/plugins/play'
import Error from 'xgplayer/es/plugins/error'
import Fullscreen from 'xgplayer/es/plugins/fullscreen'

import FlvPlugin from "xgplayer-flv";
import API from '@api'

const videoPlayer = ref(null);
const stream = ref('')
const iceTwoDimPush = API.iceTwoDimPush
const iceTwoDimClose = API.iceTwoDimClose

const getStream = async () => {
    try {
        const res = await iceTwoDimPush()
        // console.log('API响应:', res)
        stream.value = res.data
        initPlayer(stream.value)
    } catch (error) {
        console.error('获取流地址失败:', error)
    }
}
const closeStream = async () => {
    try {
        const res = await iceTwoDimClose()
        console.log(res.data)
    } catch (error) {
        console.error('关闭流失败:', error)
    }
}

const initPlayer = (url) => {
    // 确保容器存在
    const container = document.getElementById('xgplayer-container')
    if (!container) {
        console.error('播放器容器未找到')
        return
    }
    // 清理之前的播放器实例
    if (videoPlayer.value) {
        videoPlayer.value.destroy()
    }
    // 创建新的播放器实例
    videoPlayer.value = new SimplePlayer({
        id: 'xgplayer',
        url: url,
        plugins: [FlvPlugin, Start, PC, Mobile, Play, Error, Fullscreen],
        width: '100%',
        height: '100%',
        autoplayMuted: true,
        autoplay: true,
        flv: {
            retryCount: 10, // 重试 3 次，默认值
            retryDelay: 1000, // 每次重试间隔 1 秒，默认值
            loadTimeout: 10000, // 请求超时时间为 10 秒，默认值
            targetLatency: 5, // 直播目标延迟，默认 5 秒
            maxLatency: 10, // 直播允许的最大延迟，默认 10 秒
            disconnectTime: 0, // 直播断流时间，默认 0 秒，（独立使用时等于 maxLatency）
        },
    })
}

onMounted(() => {
    getStream()
});
onUnmounted(() => {
    if (videoPlayer.value) {
        videoPlayer.value.destroy();
        closeStream()
    }
});
</script>
<style scoped>
.video-container {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;

    #xgplayer {
        width: calc(100% - 20px);
        height: calc(100% - 20px);
        /* min-width: 600px;
        min-height: 400px; */
        background: transparent;
    }
}
</style>