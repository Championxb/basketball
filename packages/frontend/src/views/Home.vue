<template>
    <div class="home">
        <!--    向下数字流-->
        <bgAnimate></bgAnimate>
        <!--    粒子效果-->
        <bgAnimate2></bgAnimate2>
        <CheckButton @update:items="handleVenueChange"></CheckButton>
        <Header class="wow fadeInDown" name="篮球场馆智能监控平台"></Header>
        <div class="container">
            <div class="wrapper_top">
                <div class="wrapper-left" draggable="true">
                    <div class="item1">
                        <Border ref="venueMonitorRef" name="场馆监控" :key="currentVenueIndex"icon="icon-changguanxinxi" type="min" :delay="0.2" :duration="0.5">
                            <!-- <Monitor /> -->
                            <VideoPlay />
                        </Border>
                    </div>
                </div>
                <div class="wrapper-right">
                    <div class="item1">
                        <Border ref="tdCourtRef" name="二维球场" :key="currentVenueIndex" icon="icon-changguanxinxi" type="min" :delay="0.3" :duration="0.5">
                            <TDCourt />
                        </Border>
                    </div>
                    <div class="item1">
                        <Border ref="scoreBoardRef" name="得分看板" :key="currentVenueIndex" icon="icon-changguanxinxi" type="min" :delay="0.5" :duration="0.5">
                            <ScoreBoard />
                        </Border>
                    </div>
                </div>
            </div>
            <div class="wrapper_bottom">
                <div class="wrapper-hlightMoment">
                    <div class="item1">
                        <Border ref="hlightMomentRef" name="高光时刻" :key="currentVenueIndex" icon="icon-changguanxinxi" type="min" :delay="0.7" :duration="0.5">
                            <HlightMoment />
                        </Border>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import WOW from "wow.js";
import VideoPlay from "@views/videoPlay/index.vue";
import ScoreBoard from "@/views/scoreBoard/index.vue";
import HlightMoment from "@/views/hLightMoment/index.vue";
import TDCourt from "@/views/tDCourt/index.vue";
import CheckButton from "@/components/checkButton/index.vue";
// import Header from "@/components/header/header.vue";
// import Border from "@/components/border/border.vue";
// import Monitor from "@/views/monitor/index.vue";

// 当前选中的场馆索引
const currentVenueIndex = ref(0);
// 组件唯一key，用于强制重新创建组件
const componentKeys = ref({
    venueMonitor: Date.now(),
    tdCourt: Date.now() + 1,
    scoreBoard: Date.now() + 2,
    hlightMoment: Date.now() + 3
});

const venueMonitorRef = ref(null);
const tdCourtRef = ref(null);
const scoreBoardRef = ref(null);
const hlightMomentRef = ref(null);

const handleVenueChange = (items) => {
    // 获取当前选中的场馆索引
    const selectedIndex = items.findIndex(item => item.checked);
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
    background: url("@assets/bg/bg.png") no-repeat;
    background-size: 100% 100%;

    .container {
        width: 100%;
        height: calc(100% - 100px);
        padding: 10px 20px 20px 20px;
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
        top: 100px;
        z-index: 100;

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

        .wrapper_bottom {
            width: 100%;
            height: calc(25% - 10px);
      
            // display: flex;
            // justify-content: space-between;
            // align-items: center;
            // flex-wrap: nowrap;
            // flex-direction: row;
            // align-content: flex-start;
            // background: #000;
            .wrapper-hlightMoment {
                height: 100%;
                width: 100%;
                position: relative;
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-wrap: nowrap;
                flex-direction: row;
                align-content: flex-start;

                .item1 {
                    position: relative;
                    height: 100%;
                    width: 100%;
                }
            }
        }

        .wrapper-left {
            height: calc(100%);
            width: calc(70%);
            position: relative;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: nowrap;
            flex-direction: column;
            align-content: flex-start;
            pointer-events: initial;

            .item1 {
                position: relative;
                height: 100%;
                // height: calc(100% - 8px);   
                width: 100%;
            }
        }

        .wrapper-right {
            // margin-right: 20px;
            height: calc(100%);
            width: calc(30% - 10px);
            position: relative;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: nowrap;
            flex-direction: column;
            align-content: flex-start;
            pointer-events: initial;

            .item1 {
                position: relative;
                height: calc(50% - 5px);
                width: 100%;
            }
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
