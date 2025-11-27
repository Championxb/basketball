<template>
    <div class="home">
        <!--    向下数字流-->
        <bgAnimate></bgAnimate>
        <!--    粒子效果-->
        <bgAnimate2></bgAnimate2>
        <!-- <CheckButton @update:items="handleVenueChange"></CheckButton> -->
        <Header class="wow fadeInDown header" name="篮球场馆智能监控平台"></Header>
        <div class="container">
            <div class="wrapper_center">
                <VideoPlay />
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
import VideoPlay from "@views/videoPlay/index.vue";
import ScoreBoard from "@/views/scoreBoard/index.vue";
import HlightMoment from "@/views/hLightMoment/index.vue";
import TDCourt from "@/views/tDCourt/index.vue";
import CheckButton from "@/components/checkButton/index.vue";
// import Header from "@/components/header/header.vue";
// import Border from "@/components/border/border.vue";
// import Monitor from "@/views/monitor/index.vue";

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
    .header{
        z-index: 4;
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
            // height: calc(23%);
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
