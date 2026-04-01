<template>
    <div class="score-board">
        <header class="header">
            <!-- <button class="test-btn" @click="testAnimation">测试动画</button> -->
            <!-- <div class="title">球员得分信息</div> -->
            <div class="summary">
                <div>总得分：<strong style="color: #2a9cf3;  font-size: 20px;">{{ totalPoints }}</strong></div>
                <!-- <div>场上人数：<strong style="color: #2a9cf3;  font-size: 20px;">{{ playersList.length }}</strong></div> -->
                <div>最高分：<strong style="color: #2a9cf3;  font-size: 20px;">{{ topScore }}</strong></div>
            </div>
            <!-- <div class="controls">
                <label>排序：
                    <select v-model="sortBy">
                        <option value="points">得分</option>
                        <option value="number">号码</option>
                        <option value="name">姓名</option>
                    </select>
                </label>
            </div> -->
        </header>

        <div class="table">
            <div class="row head">
                <!-- <div class="cell num">#</div> -->
                <div class="cell name">球员ID</div>
                <div class="cell stat">得分</div>
                <!-- <div class="cell stat">篮板</div> -->
                <!-- <div class="cell stat">助攻</div> -->
                <div class="cell pct">得分占比</div>
            </div>
            <!-- <vue-seamless-scroll class="list" :data="sortedPlayers" direction="top" :steep="0.3" roller :distance="10"> -->
            <transition-group name="bubble" class="list">
                <div class="row content" v-for="(p, idx) in sortedPlayers" :key="p.id ?? idx"
                    :class="{ highlight: p.points === topScore }">
                    <div class="cell num">{{ p.playerId ?? idx + 1 }}号</div>
                    <div class="cell name">{{ p.name }}</div>
                    <div class="cell stat">{{ p.points }}</div>
                    <!-- <div class="cell stat">{{ p.rebounds ?? 0 }}</div> -->
                    <!-- <div class="cell stat">{{ p.assists ?? 0 }}</div> -->
                    <div class="cell pct">
                        <div class="bar">
                            <div class="fill" :style="{ width: percent(p) + '%' }"></div>
                        </div>
                        <div class="percent-text">{{ percent(p) }}%</div>
                    </div>
                </div>
            </transition-group>
            <!-- </vue-seamless-scroll> -->
        </div>
    </div>
</template>

<script setup>
import { computed, reactive, toRefs, ref } from 'vue';

const props = defineProps({
    // 支持传入 players 数组：[{ id, number, name, points, rebounds, assists }]
    players: {
        type: Array,
        default: () => null,
    },
});

// 使用响应式数据以便测试动画效果
const testPlayers = ref([
    { id: 1, number: 7, name: '张三', points: 1, rebounds: 8, assists: 5 },
    { id: 2, number: 9, name: '李四', points: 1, rebounds: 6, assists: 7 },
    { id: 3, number: 11, name: '王五', points: 1, rebounds: 10, assists: 4 },
    { id: 4, number: 15, name: '赵六', points: 1, rebounds: 3, assists: 2 },
]);

const currentIndex = ref(0)
// 测试方法：随机增加某个球员的得分
function testAnimation() {
    const players = testPlayers.value

    // 先重置所有人的分数为 1（可选，如果你想让他们每次都从同一起跑线）
    // 如果你希望保持他们之前的分数，只提升当前球员，则不用这步
    // for (const p of players) {
    //   p.points = 1
    // }

    // 方案：我们让当前球员的分数明显高于其他人（比如其他人保持 1，他设为 10）
    const basePoints = 1       // 其他球员的分数
    const topPoints = 10       // 当前“得分王”的分数（你可以设为更高的值，或动态计算）

    // 先将所有球员设为 basePoints（比如 1），你也可以注释掉这步，看效果差异
    for (const p of players) {
        p.points = basePoints
    }

    // 计算倒序中的索引：比如总共有 4 个球员，倒序第 0 个是 id:4，第 1 个是 id:3 ...
    const reverseIndex = currentIndex.value

    // 真实的数组索引 = 总长度 - 1 - reverseIndex
    const playerIndex = players.length - 1 - reverseIndex

    // 边界保护（其实不会越界，因为 reverseIndex < players.length）
    if (playerIndex >= 0 && playerIndex < players.length) {
        const targetPlayer = players[playerIndex]
        targetPlayer.points = topPoints  // 让他成为最高分
    }

    // 更新 currentIndex，指向下一个（倒序中的下一个）
    currentIndex.value++

    // 如果已经轮完一轮（比如 4 个球员都当过一次最高分），重置为 0，从最后一个开始
    if (currentIndex.value >= players.length) {
        currentIndex.value = 0
    }
}

const state = reactive({
    sortBy: 'points',
});

const playersList = computed(() => {
    return props.players && Array.isArray(props.players) && props.players.length
        ? props.players
        : testPlayers.value;
});

const totalPoints = computed(() => playersList.value.reduce((s, p) => s + (p.points || 0), 0));
const topScore = computed(() => Math.max(...playersList.value.map(p => p.points || 0)));

function percent(p) {
    if (!totalPoints.value) return 0;
    return Math.round(((p.points || 0) / totalPoints.value) * 100);
}

const sortedPlayers = computed(() => {
    const arr = [...playersList.value];
    if (state.sortBy === 'points') {
        arr.sort((a, b) => (b.points || 0) - (a.points || 0));
    } else if (state.sortBy === 'number') {
        arr.sort((a, b) => (a.number || 0) - (b.number || 0));
    } else if (state.sortBy === 'name') {
        arr.sort((a, b) => String(a.name).localeCompare(String(b.name)));
    }
    return arr;
});

// expose for template
const { sortBy } = toRefs(state);
</script>

<style lang="scss" scoped>
.score-board {
    // height: calc(100% - 5px);
    max-width: calc(80% - 20px);
    margin: 0 auto;
    background: linear-gradient(180deg, rgba(2, 18, 34, 0.6), rgba(6, 30, 50, 0.35));
    border-radius: 8px;
    color: #eaf6ff;
    box-shadow: 0 6px 30px rgba(0, 0, 0, 0.5);
    overflow: hidden;
    font-family: 'Microsoft YaHei', Arial, sans-serif;

    .header {
        display: flex;
        justify-content: center;
        align-items: center;
        // padding: 0px 20px;
        // border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        // background: #000;

        .title {
            font-size: 20px;
            font-weight: 700;
        }

        .summary {
            display: flex;
            gap: 18px;
            font-size: 18px;
            color: #9fc6ff;
            padding: 10px 0;
        }

        .controls {
            font-size: 16px;
            padding: 8px 20px;
            // border-bottom: 1px solid rgba(255, 255, 255, 0.03);
            background: linear-gradient(180deg, rgba(255, 255, 255, 0.01), transparent);
        }
    }

    .controls select {
        font-size: 16px;
        padding: 6px 8px;
        background: rgba(255, 255, 255, 0.03);
        color: #eaf6ff;
        border: 1px solid rgba(255, 255, 255, 0.06);
        border-radius: 4px;
    }

    .controls select option {
        color: #eaf6ff;
        font-size: 16px;
        background-color: #1a365d;
    }

    .test-btn {
        padding: 8px 16px;
        background: linear-gradient(135deg, #0077ff, #3bb0ff);
        color: white;
        border: none;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(0, 119, 255, 0.3);
    }

    .test-btn:hover {
        background: linear-gradient(135deg, #0066dd, #2aa0ee);
        box-shadow: 0 6px 16px rgba(0, 119, 255, 0.4);
        transform: translateY(-1px);
    }

    .test-btn:active {
        transform: translateY(0);
    }

    .table {
        height: 100%;
        padding: 0px 10px;
        font-size: 16px;
        margin-bottom: 10px;

        .list {
            padding: 0;
            // height: calc(100% - 95px);
            overflow: hidden;
            position: relative;
        }

        /* 冒泡排序动画效果 */
        .bubble-move {
            transition: all 0.6s ease-in-out;
        }

        // .bubble-enter-active,
        // .bubble-leave-active {
        //     transition: all 0.5s ease;
        // }

        // .bubble-enter-from {
        //     opacity: 0;
        //     transform: translateY(30px);
        // }

        // .bubble-leave-to {
        //     opacity: 0;
        //     transform: translateY(-30px);
        // }

        /* 1. 声明过渡效果 */
        .bubble-move,
        .bubble-enter-active,
        .bubble-leave-active {
            transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
        }

        /* 2. 声明进入和离开的状态 */
        .bubble-enter-from,
        .bubble-leave-to {
            opacity: 0;
            transform: scaleY(0.01) translate(30px, 0);
        }

        /* 3. 确保离开的项目被移除出了布局流
      以便正确地计算移动时的动画效果。 */
        .bubble-leave-active {
            position: absolute;
        }


        /* 为新的第一名添加特殊高亮动画 */
        .row.content.highlight {
            background: linear-gradient(90deg, rgba(0, 120, 255, 0.08), rgba(0, 180, 255, 0.03));
            box-shadow: 0 6px 18px rgba(0, 120, 255, 0.06);
            animation: bubble-top 1s ease-out;
        }

        @keyframes bubble-top {
            0% {
                // transform: scale(1);
                background: linear-gradient(90deg, rgba(0, 120, 255, 0.08), rgba(0, 180, 255, 0.03));
            }

            50% {
                // transform: scale(1.05);
                background: linear-gradient(90deg, rgba(0, 120, 255, 0.2), rgba(0, 180, 255, 0.15));
            }

            100% {
                // transform: scale(1);
                background: linear-gradient(90deg, rgba(0, 120, 255, 0.08), rgba(0, 180, 255, 0.03));
            }
        }

        .row {
            display: flex;
            align-items: center;
            padding: 5px 8px;
            border-radius: 6px;
            margin-bottom: 8px;
        }

        .row.head {
            font-weight: 600;
            color: #bfe4ff;
            background: linear-gradient(90deg, rgba(255, 255, 255, 0.02), transparent);
        }

        .row.content {
            // height: 20px;
            margin-bottom: 0px;
        }

        .row.content.highlight {
            background: linear-gradient(90deg, rgba(0, 120, 255, 0.08), rgba(0, 180, 255, 0.03));
            box-shadow: 0 6px 18px rgba(0, 120, 255, 0.06);
        }

        .cell {
            padding: 0 12px;
        }

        .cell.num {
            // width: 48px;
             width: 80px;
            text-align: center
        }

        .cell.name {
            flex: 1;
        }

        .cell.stat {
            // border-radius: 0px;
            width: 84px;
            text-align: center
        }

        .cell.pct {
            width: 100px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .bar {
            flex: 1;
            height: 8px;
            background: rgba(255, 255, 255, 0.06);
            border-radius: 4px;
            overflow: hidden;

            .fill {
                height: 100%;
                background: linear-gradient(90deg, #3bb0ff, #0077ff);
            }

        }

        .percent-text {
            width: 40px;
            text-align: right;
            // font-size: 12px;
            color: #cfeeff
        }

    }

}


@media (max-width: 980px) {
    .score-board {
        width: calc(100% - 24px);
        // margin: 12px
    }

    .cell.pct {
        width: 140px
    }
}
</style>
