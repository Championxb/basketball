<template>
    <div class="home">
        <!--    向下数字流-->
        <bgAnimate></bgAnimate>
        <!--    粒子效果-->
        <bgAnimate2></bgAnimate2>
        <!-- <CheckButton @update:items="handleVenueChange"></CheckButton> -->
        <Header class="wow fadeInDown header" name="篮球赛事实时分析系统"></Header>
        <!-- 视频选择器 -->
        <VideoSelector @video-changed="handleVideoChanged" />
        <!-- 截图按钮 -->
        <!-- <button class="screenshot-btn" @click="handleScreenshot">截图</button> -->

        <!-- 新增：弹出文本框按钮 -->
        <!-- <button class="text-output-btn" @click="toggleTextOutput">分析</button>  -->

        <!-- 欢迎弹窗 -->
        <transition name="modal">
            <div v-if="showWelcomePopup" class="welcome-popup">
                <div class="welcome-popup-inner">
                    <h2>欢迎使用篮球赛事实时分析系统</h2>
                    <p>点击下方按钮开始体验精彩赛事分析</p>
                    <div class="welcome-popup-actions">
                        <button @click="closeWelcomePopup" class="welcome-confirm">开始体验</button>
                    </div>
                </div>
            </div>
        </transition>

        <!-- 新增：弹出文本框组件 -->
        <transition name="slide-down">
            <div v-if="showTextOutput" class="text-output-container">
                <div class="text-output-content">
                    <div class="text-output-header">
                        <h3>智能分析</h3>
                        <button class="close-output-btn" @click="toggleTextOutput">×</button>
                    </div>
                    <div class="text-output-body">
                        <div ref="textOutputRef" class="text-output-area">
                            <p v-for="(line, index) in outputLines" :key="index">{{ line }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </transition>

        <!-- 截图动画容器 -->
        <div ref="screenshotAnimationContainer" class="screenshot-animation-container"></div>
        <!-- 悬浮缩略图列表 -->
        <div class="screenshot-thumbnails" v-if="screenshots.length > 0">
            <!-- @click="handleThumbnailClick(screenshot, index)" -->

            <div v-for="(screenshot, index) in screenshots" :key="screenshot.id" class="screenshot-thumbnail"
                @click="showPop(index + 1)" :style="{ right: `${index * 160 + 20}px`, bottom: '20px' }"
                :data-index="index" :ref="el => setThumbnailRef(el, index)">
                <img :src="screenshot.url" :alt="`截图 ${index + 1}`" />
                <button class="close-btn" @click.stop="removeScreenshot(screenshot.id)">×</button>
            </div>
        </div>
        <!-- 全屏查看模态框 -->
        <transition name="modal">
            <div v-if="showFullScreenScreenshot" class="fullscreen-modal" @click="closeFullScreenView">
                <div class="fullscreen-content" @click.stop>
                    <transition name="image">
                        <img :src="currentScreenshot?.url" :alt="'全屏截图'" />
                    </transition>
                    <button class="fullscreen-close-btn" @click="closeFullScreenView">关闭</button>
                </div>
            </div>
        </transition>
        <Pop ref="popRef" :pop-width="'1000px'" :pop-height="'600px'">
            <div class="popVideoContainer">
                <video ref="videoPlayer" autoplay muted loop controls>
                    <source :src="videoSrc" type="video/mp4" />
                    您的浏览器不支持 video 标签。
                </video>
            </div>
        </Pop>
        <div id="container" class="container">
            <div class="wrapper_center">
                <VideoPlay />
                <!-- <Monitor /> -->
            </div>
            <div class="wrapper_tdCourt" v-draggable @dblclick="changeSize">
                <div class="item1">
                    <!-- <Border ref="venueMonitorRef" name="场馆监控" :key="currentVenueIndex" icon="icon-changguanxinxi"
                        type="min" :delay="0.2" :duration="0.5">
                        <TDCourt />
                    </Border> -->
                    <TDCourt />
                </div>
            </div>
            <div class="wrapper_scoreBoard" v-draggable>
                <div class="item1">
                    <!-- <Border ref="scoreBoardRef" name="得分看板" :key="currentVenueIndex" icon="icon-changguanxinxi"
                        type="min" :delay="0.3" :duration="0.5">
                        <ScoreBoard />
                    </Border> -->
                    <ScoreBoard :players="playersList" />
                </div>
            </div>

            <div class="wrapper-hlightMoment" v-draggable>
                <div class="item1">
                    <Border ref="hlightMomentRef" name="高光时刻" :key="currentVenueIndex" icon="icon-changguanxinxi"
                        type="min" :delay="0.7" :duration="0.5">
                        <HlightMoment ref="momentRef" :highlights="highlightMoments"
                            @update:highlights="highlightMoments = $event" />
                    </Border>
                    <!-- <HlightMoment /> -->
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, provide, reactive } from "vue";
import WOW from "wow.js";
import gsap from "gsap";
import html2canvas from 'html2canvas';
import VideoPlay from "@views/videoPlay/index.vue";
import ScoreBoard from "@/views/scoreBoard/index.vue";
import HlightMoment from "@/views/hLightMoment/index.vue";
import TDCourt from "@/views/tDCourt/index.vue";
import Pop from "@/components/monitor/pop/pop.vue";
import CheckButton from "@components/checkButton/index.vue";
import VideoSelector from "@/components/videoSelector/index.vue";
// import Header from "@/components/header/header.vue";
// import Border from "@/components/border/border.vue";
import { getAllHighlight, getPlayerScore } from '@/api/player.js';
import { manager as danmakuManager } from '@/utils/danmaku.js';
import { genTTS } from '@/api/tts.js';
import { useSSE } from '@/composables/useSSE'
import videoMp4 from "@assets/video/11月25日.mp4"
import thumb2 from "@assets/thumb/thumb2.png";

const { sseData, connectSSE, disconnectSSE } = useSSE(9)

const momentRef = ref(null);
const popRef = ref(null);
const videoPlayer = ref(null);
const videoSrc = ref("");

// 处理视频切换事件
const handleVideoChanged = (videoName) => {
    console.log('视频已切换至:', videoName);
    // 可以在这里添加额外的处理逻辑，比如更新视频标题等
};

// 新增：文本输出相关状态和引用
const showTextOutput = ref(false);
const textOutputRef = ref(null);
const outputLines = ref(['The video shows a man playing basketball on a court.', 'He is wearing a white shirt and black shorts.']);

// 欢迎弹窗相关状态
const showWelcomePopup = ref(true);

// 新增：控制视频和弹幕初始化的状态
const isUserInteracted = ref(false);

// 新增：篮球解说弹幕列表
const basketballCommentaryDanmaku = ref([
    '好球！这个二分球太精彩了！',
    '防守很积极，成功抢断！',
    '篮板球保护得很好！',
    '配合默契，传球流畅！',
    '快攻反击，一气呵成！',
    '这个战术布置得非常到位！',
    '球员们的体力保持得不错！'
]);

// 新增：弹幕索引和播放控制
let danmakuIndex = 0;
let danmakuIntervalTimer = null;

// 关闭欢迎弹窗的函数
const closeWelcomePopup = () => {
    showWelcomePopup.value = false;
    // 标记用户已交互
    isUserInteracted.value = true;
    // 初始化弹幕
    // initDanmaku();
    // 关闭弹窗后触发TTS播放，解决自动播放需要交互的问题
    playTTS();
};

async function playTTS(text = "欢迎使用篮球赛事 实时分析系统", voice_type = 'zh_male_taocheng_uranus_bigtts') {
    try {
        const res = await genTTS({
            text,
            voice_type
        });
        // 停掉上一个正在播放的 TTS
        try {
            if (window.currentTTS && typeof window.currentTTS.pause === 'function') {
                window.currentTTS.pause();
                window.currentTTS.remove();
            }
        } catch (e) { /* 忽略错误 */ }

        // base64数据
        const rawBase64 = res.data;
        // 将base64转换为二进制数据
        const binary = atob(rawBase64);
        const len = binary.length;
        //将二进制数据转换为字节数组
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binary.charCodeAt(i);
        }

        // 创建Blob并播放
        const audioBlob = new Blob([bytes], { type: 'audio/mpeg' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.autoplay = true;

        // 播放音频
        try {
            await audio.play();
        } catch (err) {
            console.warn('自动播放被浏览器阻止，尝试使用备用方式:', err);
            // 如果自动播放失败，使用用户手势触发的方式
            setTimeout(() => {
                audio.play().catch(() => {
                    audio.controls = true;
                    audio.style.position = 'fixed';
                    audio.style.bottom = '10px';
                    audio.style.left = '10px';
                    audio.style.zIndex = 2000;
                    audio.style.width = '300px';
                    document.body.appendChild(audio);
                });
            }, 300);
        }

        // 音频结束后清理资源
        audio.addEventListener('ended', () => {
            URL.revokeObjectURL(audioUrl);
            try {
                audio.remove();
            } catch (e) { }
        });

        window.currentTTS = audio;
    } catch (err) {
        console.error('生成语音失败:', err);
    }
}

const showPop = (index) => {
    videoSrc.value = videoMp4;
    popRef.value.getShow();
    // 等待 Pop 弹出后再播放视频
    // 注意：由于Pop组件有1秒的动画时间，需要等待showInner变为true且插槽内容渲染完成
    setTimeout(() => {
        nextTick(() => {
            // console.log(pvc.value);
            // 此时pvc.value应该已经可以访问
            videoPlayer.value?.play();
        });
    }, 1100); // 设置稍长于动画时间的延迟

}
// 获取高光集锦
const highlightMoments = reactive([]);
const getHighlightMoment = async () => {
    try {
        const res = (await getAllHighlight()).data || [];
        //取后五个
        highlightMoments.splice(0, highlightMoments.length, ...res.slice(-5));
        // highlightMoments.splice(0, highlightMoments.length, ...res.slice()); 
        //遍历数组，修改videopath
        highlightMoments.forEach(moment => {
            moment.highlight.imagePath = moment.highlight.imagePath.replace("http://192.168.207.237:5003/", "");
            // moment.highlight.imagePath = moment.highlight.imagePath.replace("5003", "8006");
            moment.highlight.videoPath = moment.highlight.videoPath.replace("http://192.168.207.237:5003/", "");
            // moment.highlight.videoPath = moment.highlight.videoPath.replace("5003", "8006");
        });
        console.log('高光集锦数据:', highlightMoments);
    } catch (error) {
        console.error('获取高光集锦失败:', error);
    }
}
//得分榜
const playersList = ref([]);
const getPlayerScoreBoard = async () => {
    try {
        const res = (await getPlayerScore()).data || [];
        console.log('得分榜数据:', res);
        playersList.value = res;
    } catch (error) {
        console.error('获取得分榜失败:', error);
    }
}
// 截图相关状态和函数
const screenshots = ref([]);
const showFullScreenScreenshot = ref(false);
const currentScreenshot = ref(null);
// 截图动画容器引用
const screenshotAnimationContainer = ref(null);

// 新增：切换文本输出框显示/隐藏的函数
const toggleTextOutput = () => {
    showTextOutput.value = !showTextOutput.value;
    // 当显示时，确保滚动到底部
    if (showTextOutput.value) {
        nextTick(() => {
            if (textOutputRef.value) {
                textOutputRef.value.scrollTop = textOutputRef.value.scrollHeight;
            }
        });

        // 如果输出区域为空，自动开始模拟输出
        if (outputLines.value.length === 0) {
            startOutputSimulation();
        }
    }
};

// 处理截图按钮点击事件
const handleScreenshot = async () => {
    // 禁用按钮防止重复点击
    const screenshotBtn = document.querySelector('.screenshot-btn');
    const originalText = screenshotBtn.innerText;
    screenshotBtn.innerText = '截图中...';
    // screenshotBtn.disabled = true;

    // 隐藏截图按钮和所有已有的缩略图，避免截图中包含它们
    const originalDisplay = screenshotBtn.style.display;
    // screenshotBtn.style.display = 'none';

    const thumbnails = document.querySelectorAll('.screenshot-thumbnail');
    thumbnails.forEach(thumb => {
        thumb.style.display = 'none';
    });

    // 等待DOM更新
    await nextTick();
    console.log('开始截图处理');

    try {
        // // 使用html2canvas截取整个页面
        // const screenshot = await html2canvas(document.body, {
        //     scale: 1.5, // 提高质量
        //     useCORS: true, // 允许跨域图片
        //     logging: false, // 禁用日志
        //     allowTaint: true, // 允许污染的画布
        //     backgroundColor: '#ffffff', // 确保背景色正确
        //     ignoreElements: (element) => {
        //         // 忽略特定元素
        //         return element.classList.contains('screenshot-btn') ||
        //             element.classList.contains('screenshot-thumbnail');
        //     }
        // });

        // // 将Canvas转换为图片URL
        // const imgData = screenshot.toDataURL('image/png');

        const imgData = thumb2;

        // 创建截图对象
        const screenshotObj = {
            id: Date.now(),
            url: imgData,
            timestamp: new Date().toLocaleString()
        };

        // 添加到截图数组中
        screenshots.value.push(screenshotObj);

        // 等待DOM更新，确保新添加的缩略图已经渲染
        await nextTick();

        // 执行截图动画
        if (screenshotAnimationContainer.value) {
            // 创建临时图片元素用于动画
            const tempImg = document.createElement('img');
            tempImg.src = imgData;
            tempImg.className = 'screenshot-animation-image';
            tempImg.style.opacity = '0';
            screenshotAnimationContainer.value.appendChild(tempImg);

            // 等待图片加载完成
            tempImg.onload = () => {
                // 获取新添加的缩略图位置（应该是最后一个）
                const newThumbnail = document.querySelector(`.screenshot-thumbnail[data-index="${screenshots.value.length - 1}"]`);
                if (newThumbnail) {
                    const thumbnailRect = newThumbnail.getBoundingClientRect();

                    // 使用gsap执行动画：从全屏显示缩小到右下角缩略图位置
                    gsap.fromTo(tempImg,
                        {
                            opacity: 1,
                            width: '100vw',
                            height: '100vh',
                            left: '0%',
                            top: '0%',
                            x: 0,
                            y: 0,
                            position: 'fixed',
                            zIndex: 9999,
                            objectFit: 'contain'
                        },
                        {
                            opacity: 1,
                            width: thumbnailRect.width + 'px',
                            height: thumbnailRect.height + 'px',
                            left: '100%',
                            top: '100%',
                            x: -thumbnailRect.width - 20,
                            y: -thumbnailRect.height - 20,
                            duration: 0.8,
                            ease: 'power2.in',
                            onComplete: () => {
                                // 动画完成后移除临时图片
                                if (tempImg.parentNode) {
                                    tempImg.parentNode.removeChild(tempImg);
                                }
                            }
                        }
                    );
                } else {
                    // 如果缩略图不存在，直接清理
                    if (tempImg.parentNode) {
                        tempImg.parentNode.removeChild(tempImg);
                    }
                }
            };
        }

        // 恢复UI元素显示
        screenshotBtn.style.display = originalDisplay;
        thumbnails.forEach(thumb => {
            thumb.style.display = 'block';
        });

        console.log('截图成功，尺寸:', screenshot.width, 'x', screenshot.height);
        console.log('缩略图数量:', screenshots.value.length);

    } catch (error) {
        console.error('截图失败:', error);
        // 恢复UI元素显示
        const screenshotBtn = document.querySelector('.screenshot-btn');
        screenshotBtn.style.display = '';
        const thumbnails = document.querySelectorAll('.screenshot-thumbnail');
        thumbnails.forEach(thumb => {
            thumb.style.display = 'block';
        });
    } finally {
        // 恢复按钮状态
        const screenshotBtn = document.querySelector('.screenshot-btn');
        screenshotBtn.innerText = originalText;
        screenshotBtn.disabled = false;
    }
};

// 缩略图引用数组
const thumbnailRefs = ref([]);
// 动画容器引用
const animationContainer = ref(null);

// 设置缩略图引用
const setThumbnailRef = (el, index) => {
    if (el) {
        thumbnailRefs.value[index] = el;
    }
};

// 处理缩略图点击事件
const handleThumbnailClick = (screenshot, index) => {
    // 使用现有的screenshotAnimationContainer进行动画
    if (!screenshotAnimationContainer.value) return;

    // 创建临时图片元素
    const tempImg = document.createElement('img');
    tempImg.src = screenshot.url;
    tempImg.className = 'screenshot-animation-image';
    tempImg.style.opacity = '0';
    screenshotAnimationContainer.value.appendChild(tempImg);

    // 等待图片加载完成
    tempImg.onload = () => {
        // 获取当前缩略图元素
        const thumbnail = document.querySelector(`.screenshot-thumbnail[data-index="${index}"]`);
        if (!thumbnail) {
            // 如果找不到缩略图，直接清理临时图片
            if (tempImg.parentNode) {
                tempImg.parentNode.removeChild(tempImg);
            }
            return;
        }

        // 获取缩略图位置
        const thumbnailRect = thumbnail.getBoundingClientRect();

        // 全屏显示动画
        gsap.fromTo(tempImg,
            {
                opacity: 1,
                width: thumbnailRect.width + 'px',
                height: thumbnailRect.height + 'px',
                left: '100%',
                top: '100%',
                x: -thumbnailRect.width - 20,
                y: -thumbnailRect.height - 20,
                duration: 0.8,
                ease: 'power2.in',
            },
            {
                opacity: 1,
                width: '90vw',
                height: '90vh',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                x: 0,
                y: 0,
                position: 'fixed',
                zIndex: 9999,
                objectFit: 'contain',
                onComplete: () => {
                    // 短暂停留后移除临时图片，不再做缩小动画
                    setTimeout(() => {
                        gsap.to(tempImg, {
                            opacity: 0,
                            duration: 0.3,
                            ease: 'power2.in',
                            onComplete: () => {
                                // 动画完成后移除临时图片
                                if (tempImg.parentNode) {
                                    tempImg.parentNode.removeChild(tempImg);
                                }
                            }
                        });
                    }, 1500); // 显示1.5秒后淡出
                }
            }
        );
    };
};

// 移除截图
const removeScreenshot = (id) => {
    let res = screenshots.value.find(s => s.id === id);
    const data = {
        highlight: {
            id: Date.now().toString().slice(-2), // 使用时间戳作为唯一ID
            videoPath: videoMp4,
            imagePath: res.url,
            currentScore: 3,         // 例如：这个高光得了3分
            createTime: res.timestamp.split(" ")[1],
            updateTime: res.timestamp.split(" ")[1],
        },
        playerName: "测试玩家",
    }
    momentRef.value.updateMomentList(data);
    console.log('删除截图:', data);
    screenshots.value = screenshots.value.filter(s => s.id !== id);
};

// 创建播放器状态管理
const isPlaying = ref(true); // 默认播放状态
const updatePlayState = (playing) => {
    isPlaying.value = playing;
};

// 提供给子组件
provide('playerState', {
    isPlaying,
    updatePlayState,
    isUserInteracted
});

let timer = null
// 新增：初始化弹幕的函数
const initDanmaku = () => {
    //弹幕管理器
    const danmakuContainer = document.getElementById('container');
    // 挂载，开始渲染
    danmakuManager.mount(danmakuContainer);
    danmakuManager.startPlaying();
    danmakuManager.setArea({
        y: {
            start: '20%',
            end: '50%',
        },
        x: {
            start: '0%',
            end: '100%',
        },
    });

    // 清除之前可能存在的定时器
    if (danmakuIntervalTimer) {
        clearInterval(danmakuIntervalTimer);
    }

    // 间隔8秒播放一条弹幕和对应的语音（给语音播放留足够时间）
    danmakuIntervalTimer = setInterval(async () => {
        // 获取当前弹幕内容
        const danmakuContent = basketballCommentaryDanmaku.value[danmakuIndex];

        // 添加弹幕
        danmakuManager.unshift(danmakuContent);

        // 播放对应内容的语音
        await playTTS(danmakuContent);

        // 更新索引，循环播放
        danmakuIndex = (danmakuIndex + 1) % basketballCommentaryDanmaku.value.length;
    }, 8000);
};

onMounted(() => {
    const wow = new WOW({});
    wow.init();
    getHighlightMoment();
    getPlayerScoreBoard();
    // 欢迎弹窗会在页面加载时自动显示，用户点击关闭后会触发playTTS()
    // playTTS()内部会处理音频授权逻辑
    // setInterval(() => {
    //      playTTS();
    // }, 3000);
    if (timer) clearInterval(timer);
    timer = setInterval(() => {
        getHighlightMoment();
        getPlayerScoreBoard();
    }, 10000); // 每10秒获取一次得分榜数据

    connectSSE(9);
});
onUnmounted(() => {
    disconnectSSE();
    clearInterval(timer);
    if (danmakuIntervalTimer) {
        clearInterval(danmakuIntervalTimer);
    }
});
</script>

<style lang="scss" scoped>
.home {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    // background: url("@assets/bg/bg1.jpg") no-repeat;
    background: rgba(68, 90, 114, 0.9);
    background-size: 100% 100%;

    .header {
        z-index: 4;
    }

    // 截图动画容器样式
    .screenshot-animation-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 9998;
        pointer-events: none;
    }

    // 截图动画图片样式
    .screenshot-animation-image {
        position: fixed;
        object-fit: contain;
        pointer-events: none;
    }

    // 截图按钮样式
    .screenshot-btn {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
        padding: 10px 20px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;

        &:hover {
            background-color: #45a049;
        }
    }

    // 新增：文本输出按钮样式
    .text-output-btn {
        position: fixed;
        top: 70px;
        left: 20px;
        z-index: 1000;
        padding: 10px 15px;
        background-color: #2196F3;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;

        &:hover {
            background-color: #1976D2;
        }
    }

    /* 欢迎弹窗样式 */
    .welcome-popup {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2000;
    }

    .welcome-popup-inner {
        background-color: rgba(33, 150, 243, 0.95);
        padding: 40px;
        border-radius: 10px;
        text-align: center;
        max-width: 500px;
        box-shadow: 0 5px 25px rgba(2, 184, 250, 0.4), 0 0 30px rgba(2, 184, 250, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .welcome-popup-inner h2 {
        color: #ffffff;
        margin-bottom: 20px;
        font-size: 30px;
        text-shadow: 0 0 10px rgba(2, 184, 250, 0.8);
        font-family: 'MyFont', Arial, sans-serif;
    }

    .welcome-popup-inner p {
        color: rgba(255, 255, 255, 0.9);
        margin-bottom: 30px;
        font-size: 16px;
        text-shadow: 0 0 8px rgba(2, 184, 250, 0.5);
    }

    .welcome-popup-actions {
        display: flex;
        justify-content: center;
    }

    .welcome-confirm {
        padding: 12px 30px;
        background-color: rgba(76, 175, 80, 0.9);
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
        transition: all 0.3s ease;
        text-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
    }

    .welcome-confirm:hover {
        background-color: rgba(76, 175, 80, 1);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3), 0 0 15px rgba(76, 175, 80, 0.5);
        transform: translateY(-2px);
    }

    /* 弹窗动画效果 - 由大变小并逐渐透明 */
    .modal-enter-active {
        transition: all 0.5s ease;
    }

    .modal-leave-active {
        transition: all 1s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }

    /* 进入时：从大尺寸和透明状态变为正常大小和不透明 */
    .modal-enter-from {
        opacity: 0;
    }

    .modal-enter-from .welcome-popup-inner {
        transform: scale(1.3);
    }

    /* 离开时：从正常大小和不透明状态变为小尺寸和透明 */
    .modal-leave-to {
        opacity: 0;
        transform: scale(0.8);
    }

    .modal-leave-to .welcome-popup-inner {
        transform: scale(0.6);
        /* 内部元素额外缩放 */
        transition: transform 1s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }

    // 新增：文本输出容器样式
    .text-output-container {
        position: fixed;
        top: 120px;
        left: 20px;
        width: 400px;
        max-height: 250px;
        z-index: 999;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        border-radius: 8px;
        overflow: hidden;
    }

    .text-output-content {
        background-color: rgba(89, 125, 167, 0.85);
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    .text-output-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 15px;
        background-color: rgba(33, 150, 243, 0.9);
        color: white;
    }

    .text-output-header h3 {
        margin: 0;
        font-size: 16px;
    }

    .close-output-btn {
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;

        &:hover {
            background-color: rgba(255, 255, 255, 0.2);
        }
    }

    .text-output-body {
        flex: 1;
        padding: 0;
        overflow: hidden;
    }

    .text-output-area {
        height: 400px;
        padding: 15px;
        overflow-y: auto;
        color: #fff;
        font-family: monospace;
        font-size: 14px;
        line-height: 1.5;
    }

    .text-output-area p {
        margin: 5px 0;
        white-space: pre-wrap;
        word-break: break-all;
    }

    // 滚动条样式
    .text-output-area::-webkit-scrollbar {
        width: 8px;
    }

    .text-output-area::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
    }

    .text-output-area::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.3);
        border-radius: 4px;
    }

    .text-output-area::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.5);
    }

    // 悬浮缩略图样式
    .screenshot-thumbnails {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 999;
    }

    .screenshot-thumbnail {
        position: fixed;
        width: 150px;
        height: 100px;
        background-color: white;
        border: 2px solid #ddd;
        border-radius: 8px;
        overflow: hidden;
        cursor: pointer;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        animation: slideIn 0.5s ease-out;
        opacity: 0.9;

        &:hover {
            transform: scale(1.1) translateY(-5px);
            opacity: 1;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            z-index: 1001;
        }

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.5s ease;
        }

        &:hover img {
            transform: scale(1.05);
        }

        .close-btn {
            position: absolute;
            top: 5px;
            right: 5px;
            width: 20px;
            height: 20px;
            background-color: rgba(255, 0, 0, 0.7);
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            font-size: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: all 0.3s ease;
        }

        &:hover .close-btn {
            opacity: 1;
        }
    }

    // 缩略图出现动画
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(50px) scale(0.8);
        }

        to {
            opacity: 0.9;
            transform: translateY(0) scale(1);
        }
    }

    // 新增：下滑动画
    .slide-down-enter-active,
    .slide-down-leave-active {
        transition: all 0.3s ease;
        transform-origin: top right;
    }

    .slide-down-enter-from {
        opacity: 0;
        transform: translateY(-10px) scaleY(0.95);
    }

    .slide-down-leave-to {
        opacity: 0;
        transform: translateY(-10px) scaleY(0.95);
    }

    // 保留原容器样式以避免CSS错误
    .container {
        width: 100%;
        height: calc(100% - 100px);
        height: 100%;
        padding: 10px 20px 20px 20px;
        position: relative;
        display: flex;
        // 纵向排列
        flex-direction: column;
        justify-content: space-between;
        // flex-direction: row;
        // justify-content: space-between;
        // align-items: flex-start;
        flex-wrap: nowrap;
        // flex-direction: row;
        align-content: flex-start;
        position: absolute;
        // top: 100px;
        top: 0;
        z-index: 3;

        .wrapper_center {
            // background: rgba(214, 11, 11, 0.5);
            position: fixed;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
        }

        .wrapper_tdCourt {
            height: 324px;
            width: 576px;
            // min-height: 28%;
            // min-width: 25%;
            position: absolute;
            bottom: 20px;
            left: 50px;
            border-radius: 50px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: nowrap;
            flex-direction: column;
            align-content: flex-start;
            pointer-events: initial;
            opacity: 0.5;
            // resize: both;
            // overflow: auto;
            z-index: 10;

            // background: rgba(212, 24, 24, 0.5);
            .item1 {
                position: relative;
                height: 100%;
                width: 100%;
            }
        }

        .wrapper_scoreBoard {
            // margin-right: 20px;
            height: calc(23%);
            width: calc(28%);
            position: absolute;
            left: calc(50% - 15%);
            bottom: 60px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: nowrap;
            flex-direction: column;
            align-content: flex-start;
            pointer-events: initial;
            z-index: 10;

            .item1 {
                position: relative;
                height: calc(100% - 5px);
                width: 100%;
            }
        }

        .wrapper-hlightMoment {
            height: calc(70%);
            width: calc(15%);
            position: fixed;
            right: 20px;
            top: calc(50% - 30%);
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: nowrap;
            flex-direction: row;
            align-content: flex-start;
            z-index: 100;
            cursor: pointer;

            .item1 {
                position: relative;
                height: 100%;
                width: 100%;
            }
        }


        .wrapper_top {
            width: 100%;
            height: calc(75%);
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: nowrap;
            flex-direction: row;
            align-content: flex-start;
        }

        .homeMainc {
            height: 100%;
            width: calc(52% - 40px);
            position: relative;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: nowrap;
            flex-direction: column;
            align-content: flex-start;

            .item0 {
                position: relative;
                width: 100%;
                height: calc(33.33% - 10px);
            }

            .item1 {
                position: relative;
                width: 100%;
                height: calc(33.33% - 10px);
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-wrap: nowrap;
                flex-direction: row;
                align-content: flex-start;
                pointer-events: initial;

                .item1Inner {
                    width: calc(50% - 10px);
                    height: 100%;
                    position: relative;
                }
            }
        }
    }
}

.homeMain2 {
    position: fixed;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: nowrap;
    flex-direction: row;
    align-content: flex-start;
}
</style>

<style>
/* 非scoped样式，确保能应用到被teleport移动的popVideoContainer */
.popVideoContainer {
    width: 100% !important;
    height: 100% !important;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

/* 确保覆盖Pop组件中slot容器的默认背景色 */
.popWinMainInner .slot {
    background: transparent !important;
}

.popVideoContainer video {
    max-width: 100%;
    max-height: 100%;
    width: 100%;
    height: 100%;
    position: relative;
}
</style>
