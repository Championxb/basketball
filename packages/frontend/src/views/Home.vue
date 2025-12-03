<template>
    <div class="home">
        <!--    向下数字流-->
        <bgAnimate></bgAnimate>
        <!--    粒子效果-->
        <bgAnimate2></bgAnimate2>
        <!-- <CheckButton @update:items="handleVenueChange"></CheckButton> -->
        <Header class="wow fadeInDown header" name="篮球场馆智能监控平台"></Header>
        <!-- 截图按钮 -->
        <button class="screenshot-btn" @click="handleScreenshot">截图</button>

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
        <div class="container">
            <div class="wrapper_center">
                <!-- <VideoPlay /> -->
                <!-- <Monitor /> -->
            </div>
            <div class="wrapper_tdCourt" v-draggable @dblclick="changeSize">
                <div class="item1">
                    <!-- <Border ref="venueMonitorRef" name="场馆监控" :key="currentVenueIndex" icon="icon-changguanxinxi"
                        type="min" :delay="0.2" :duration="0.5">
                        <TDCourt />
                    </Border> -->
                    <!-- <TDCourt /> -->
                </div>
            </div>
            <div class="wrapper_scoreBoard" v-draggable>
                <div class="item1">
                    <!-- <Border ref="scoreBoardRef" name="得分看板" :key="currentVenueIndex" icon="icon-changguanxinxi"
                        type="min" :delay="0.3" :duration="0.5">
                        <ScoreBoard />
                    </Border> -->
                    <ScoreBoard />
                </div>
            </div>

            <div class="wrapper-hlightMoment" v-draggable>
                <div class="item1">
                    <Border ref="hlightMomentRef" name="高光时刻" :key="currentVenueIndex" icon="icon-changguanxinxi"
                        type="min" :delay="0.7" :duration="0.5">
                        <HlightMoment ref="momentRef" :highlights="highlightMoments" />
                    </Border>
                    <!-- <HlightMoment /> -->
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, nextTick, provide, reactive } from "vue";
import WOW from "wow.js";
import gsap from "gsap";
import html2canvas from 'html2canvas';
import VideoPlay from "@views/videoPlay/index.vue";
import ScoreBoard from "@/views/scoreBoard/index.vue";
import HlightMoment from "@/views/hLightMoment/index.vue";
import TDCourt from "@/views/tDCourt/index.vue";
import Pop from "@/components/monitor/pop/pop.vue";
import CheckButton from "@components/checkButton/index.vue";
// import Header from "@/components/header/header.vue";
// import Border from "@/components/border/border.vue";
import { getAllHighlight } from '@/api/highLight.js';
import videoMp4 from "@assets/video/11月25日.mp4"

const momentRef = ref(null);
const popRef = ref(null);
const videoPlayer = ref(null);
const videoSrc = ref("");

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
        highlightMoments.splice(0, highlightMoments.length, ...res.slice(0, 5));
    } catch (error) {
        console.error('获取高光集锦失败:', error);
    }
}


// 截图相关状态和函数
const screenshots = ref([]);
const showFullScreenScreenshot = ref(false);
const currentScreenshot = ref(null);
// 截图动画容器引用
const screenshotAnimationContainer = ref(null);

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
        // 使用html2canvas截取整个页面
        const screenshot = await html2canvas(document.body, {
            scale: 1.5, // 提高质量
            useCORS: true, // 允许跨域图片
            logging: false, // 禁用日志
            allowTaint: true, // 允许污染的画布
            backgroundColor: '#ffffff', // 确保背景色正确
            ignoreElements: (element) => {
                // 忽略特定元素
                return element.classList.contains('screenshot-btn') ||
                    element.classList.contains('screenshot-thumbnail');
            }
        });

        // 将Canvas转换为图片URL
        const imgData = screenshot.toDataURL('image/png');

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
            id: 33,
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
    updatePlayState
});

onMounted(() => {
    const wow = new WOW({});
    wow.init();
    getHighlightMoment();
});
</script>

<style lang="scss" scoped>
.home {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: url("@assets/bg/bg1.jpg") no-repeat;
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
            bottom: 20px;
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
