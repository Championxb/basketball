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

        <!-- 悬浮缩略图列表 -->
        <div class="screenshot-thumbnails" v-if="screenshots.length > 0">
            <div v-for="(screenshot, index) in screenshots" :key="screenshot.id" class="screenshot-thumbnail"
                @click="handleThumbnailClick(screenshot)" :style="{ right: `${index * 160 + 20}px`, bottom: '20px' }"
                :data-index="index">
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
        <div class="container">
            <div class="wrapper_center">
                <!-- <VideoPlay /> -->
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
                    <ScoreBoard />
                </div>
            </div>

            <div class="wrapper-hlightMoment" v-draggable>
                <div class="item1">
                    <Border ref="hlightMomentRef" name="高光时刻" :key="currentVenueIndex" icon="icon-changguanxinxi"
                        type="min" :delay="0.7" :duration="0.5">
                        <HlightMoment />
                    </Border>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, nextTick, provide } from "vue";
import WOW from "wow.js";
import gsap from "gsap";
import html2canvas from "html2canvas";
import VideoPlay from "@views/videoPlay/index.vue";
import ScoreBoard from "@/views/scoreBoard/index.vue";
import HlightMoment from "@/views/hLightMoment/index.vue";
import TDCourt from "@/views/tDCourt/index.vue";
import CheckButton from "@components/checkButton/index.vue";
// import Header from "@/components/header/header.vue";
// import Border from "@/components/border/border.vue";
// import Monitor from "@/views/monitor/index.vue";

// 截图相关状态和函数
const screenshots = ref([]);
const showFullScreenScreenshot = ref(false);
const currentScreenshot = ref(null);

// 处理截图按钮点击事件
const handleScreenshot = async () => {
    try {
        // 禁用按钮防止重复点击
        const screenshotBtn = document.querySelector('.screenshot-btn');
        const originalText = screenshotBtn.textContent;
        screenshotBtn.textContent = '截图中...';
        screenshotBtn.disabled = true;
        
        // 隐藏截图按钮和所有已有的缩略图，避免截图中包含它们
        const originalDisplay = screenshotBtn.style.display;
        screenshotBtn.style.display = 'none';
        
        const thumbnails = document.querySelectorAll('.screenshot-thumbnail');
        thumbnails.forEach(thumb => {
            thumb.style.display = 'none';
        });
        
        // 等待DOM更新
        await nextTick();
        
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
        
        // 恢复UI元素显示
        screenshotBtn.style.display = originalDisplay;
        thumbnails.forEach(thumb => {
            thumb.style.display = 'block';
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
        
        console.log('截图成功，尺寸:', screenshot.width, 'x', screenshot.height);
        console.log('缩略图数量:', screenshots.value.length);
        
    } catch (error) {
        console.error('截图失败:', error);
        // 可以在这里添加用户提示，如alert或其他UI反馈
    } finally {
        // 恢复按钮状态
        const screenshotBtn = document.querySelector('.screenshot-btn');
        screenshotBtn.textContent = '截图';
        screenshotBtn.disabled = false;
    }
};

// 处理缩略图点击事件
const handleThumbnailClick = (screenshot) => {
    currentScreenshot.value = screenshot;
    showFullScreenScreenshot.value = true;
};

// 关闭全屏查看
const closeFullScreenView = () => {
    showFullScreenScreenshot.value = false;
    currentScreenshot.value = null;
};

// 移除截图
const removeScreenshot = (id) => {
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

// 当前选中的场馆索引
const currentVenueIndex = ref(0);
// 组件唯一key，用于强制重新创建组件
const componentKeys = ref({
    venueMonitor: Date.now(),
    tdCourt: Date.now() + 1,
    scoreBoard: Date.now() + 2,
    hlightMoment: Date.now() + 3,
});

const courtDrag = ref(null);
const venueMonitorRef = ref(null);
const tdCourtRef = ref(null);
const scoreBoardRef = ref(null);
const hlightMomentRef = ref(null);

const bgScreen = ref(null);
// const changeSize = () => {
//     gsap.to(bgScreen.value, {
//         height: "100vh",
//         width: "100vw",
//         position: 'fixed',
//         delay: 0.2,
//         top: 0,
//         left: 0,
//         duration: 1,
//         ease: "none",
//     });
// }

const handleVenueChange = (items) => {
    // 获取当前选中的场馆索引
    const selectedIndex = items.findIndex((item) => item.checked);
    if (selectedIndex !== currentVenueIndex.value) {
        currentVenueIndex.value = selectedIndex;
        // 执行切换动画
        performSwitchAnimation(selectedIndex);
    }
};

const performSwitchAnimation = (venueIndex) => {
    // 场馆监控：从右往左切出，再左往右切入
    if (venueMonitorRef.value) {
        venueMonitorRef.value.slideOutRight(() => {
            // 切出完成后，模拟加载新内容
            setTimeout(() => {
                venueMonitorRef.value.slideInLeft();
            }, 300);
        });
    }

    // 二维球场：从左往右切出，再右往右切入
    if (tdCourtRef.value) {
        tdCourtRef.value.slideOutLeft(() => {
            setTimeout(() => {
                tdCourtRef.value.slideInRight();
            }, 300);
        });
    }

    // 得分看板：从左往右切出，再右往右切入
    if (scoreBoardRef.value) {
        scoreBoardRef.value.slideOutLeft(() => {
            setTimeout(() => {
                scoreBoardRef.value.slideInRight();
            }, 300);
        });
    }

    // 高光时刻：从上往下切入，再从下往上切入
    if (hlightMomentRef.value) {
        hlightMomentRef.value.slideOutTop(() => {
            setTimeout(() => {
                hlightMomentRef.value.slideInBottom();
            }, 300);
        });
    }
};

onMounted(() => {
    const wow = new WOW({});
    wow.init();
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

    // 全屏查看模态框样式
    .fullscreen-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
    }

    .fullscreen-content {
        position: relative;
        max-width: 90%;
        max-height: 90%;
        background-color: white;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);

        img {
            max-width: 100%;
            max-height: calc(100vh - 100px);
            display: block;
        }

        .fullscreen-close-btn {
            position: absolute;
            top: 10px;
            right: 10px;
            padding: 10px 20px;
            background-color: #f44336;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            opacity: 0.8;
            transition: all 0.3s ease;

            &:hover {
                background-color: #d32f2f;
                opacity: 1;
                transform: scale(1.05);
            }
        }
    }

    // 模态框动画
    .modal-enter-active,
    .modal-leave-active {
        transition: opacity 0.3s ease;
    }

    .modal-enter-from,
    .modal-leave-to {
        opacity: 0;
    }

    // 图片动画
    .image-enter-active,
    .image-leave-active {
        transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .image-enter-from {
        transform: scale(0.8) translateY(20px);
        opacity: 0;
    }

    .image-leave-to {
        transform: scale(0.8) translateY(-20px);
        opacity: 0;
    }

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
            height: calc(60%);
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
