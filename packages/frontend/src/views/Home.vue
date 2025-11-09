<template>
    <div class="home">
        <!--    向下数字流-->
        <bgAnimate></bgAnimate>
        <!--    粒子效果-->
        <bgAnimate2></bgAnimate2>
        <CheckButton></CheckButton>
        <Header class="wow fadeInDown" name="篮球场馆智能监控平台"></Header>
        <div class="container">
            <div class="wrapper-left">
                <div class="item1">
                    <Border name="场馆监控" icon="icon-changguanxinxi" type="min" :delay="0.2" :duration="0.5">
                        <Monitor />
                    </Border>
                </div>
            </div>
            <div class="wrapper-right">
                <div class="item1">
                    <Border name="二维球场" icon="icon-changguanxinxi" type="min" :delay="0.3" :duration="0.5">
                        <!-- <Monitor /> -->
                    </Border>
                </div>
                <div class="item1">
                    <Border name="得分看板" icon="icon-changguanxinxi" type="min" :delay="0.5" :duration="0.5">
                        <ScoreBoard />
                    </Border>
                </div>
                <div class="item1">
                    <Border name="高光时刻" icon="icon-changguanxinxi" type="min" :delay="0.7" :duration="0.5">
                        <HlightMoment />
                    </Border>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import WOW from "wow.js";
import ScoreBoard from "@/views/scoreBoard/index.vue";
import HlightMoment from "@/views/hLightMoment/index.vue";
// import CheckButton from "@/components/checkButton/index.vue";
// import Header from "@/components/header/header.vue";
// import Border from "@/components/border/border.vue";
// import Monitor from "@/views/monitor/index.vue";
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
        justify-content: space-between;
        align-items: flex-start;
        flex-wrap: nowrap;
        flex-direction: row;
        align-content: flex-start;
        position: absolute;
        top: 100px;
        z-index: 100;

        .wrapper-left {
            height: 100%;
            width: calc(50% - 10px);
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
                height:100%;
                // height: calc(100% - 8px);   
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

        .wrapper-right {
            // margin-right: 20px;
            height: 100%;
            width: calc(50% - 10px);
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
                height: calc(33.33% - 8px);
                width: 100%;
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
