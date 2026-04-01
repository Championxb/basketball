<template>
    <div class="video-container">
        <div id="xgplayer-container"></div>
        <!-- <video ref="videoPlayer" autoplay muted loop controls>
            <source :src="videoSrc" type="video/mp4" />
            您的浏览器不支持 video 标签。
        </video> -->
    </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted, inject } from "vue";
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

// 注入播放器状态管理
const { isPlaying, updatePlayState, isUserInteracted = ref(false) } = inject('playerState') || { isPlaying: ref(true), updatePlayState: () => { }, isUserInteracted: ref(false) };
import API from '@api'
import { watch } from 'vue'

const videoPlayer = ref(null);
const stream = ref('')
const icePush = API.icePush
const iceClose = API.iceClose

const getStream = async () => {
    try {
        const res = await icePush()
        // console.log('API响应:', res)
        stream.value = res.data
        initPlayer(stream.value)
    } catch (error) {
        console.error('获取流地址失败:', error)
    }
}
const closeStream = async () => {
    try {
        const res = await iceClose()
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
        id: 'xgplayer-container',
        url: url,
        plugins: [FlvPlugin, Start, PC, Mobile, Play, Error, Fullscreen],
        width: '100%',
        height: '100%',
        autoplayMuted: false,
        autoplay: false,
        flv: {
            retryCount: 10, // 重试 3 次，默认值
            retryDelay: 1000, // 每次重试间隔 1 秒，默认值
            loadTimeout: 10000, // 请求超时时间为 10 秒，默认值
            targetLatency: 5, // 直播目标延迟，默认 5 秒
            maxLatency: 10, // 直播允许的最大延迟，默认 10 秒
            disconnectTime: 0, // 直播断流时间，默认 0 秒，（独立使用时等于 maxLatency）
        },
        inactive: 500,
        // leavePlayerTime:500,
    })

    // 添加播放状态监听
    videoPlayer.value.on('play', () => {
        updatePlayState(true);
    });

    videoPlayer.value.on('pause', () => {
        updatePlayState(false);
    });
}

onMounted(() => {
    getStream()
});

// 监听用户交互状态变化，当用户点击开始体验后才开始播放视频
watch(() => isUserInteracted.value, (newVal) => {
    if (newVal && videoPlayer.value) {
        // 用户已交互，开始播放视频
        videoPlayer.value.play().catch(err => {
            console.error('自动播放失败:', err);
        });
    }
});

// 监听全局播放状态变化
watch(() => isPlaying.value, (newState) => {
    if (videoPlayer.value) {
        // 避免重复触发事件导致循环更新
        const currentState = !videoPlayer.value.paused;
        if (currentState !== newState) {
            if (newState) {
                videoPlayer.value.play();
            } else {
                videoPlayer.value.pause();
            }
        }
    }
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
}

#xgplayer-container {
    /* width: calc(100% - 20px);
    height: calc(100% - 20px); */
    width: 100%;
    height: 100%;
    min-width: 600px;
    min-height: 400px;
    background: transparent;
}
</style>