<template>
    <div class="score-board">
        <header class="header">
            <!-- <div class="title">球员得分信息</div> -->
            <div class="summary">
                <div>总得分：<strong>{{ totalPoints }}</strong></div>
                <div>场上人数：<strong>{{ playersList.length }}</strong></div>
                <div>最高分：<strong>{{ topScore }}</strong></div>
            </div>
            <div class="controls">
                <label>排序：
                    <select v-model="sortBy">
                        <option value="points">得分</option>
                        <option value="number">号码</option>
                        <option value="name">姓名</option>
                    </select>
                </label>
            </div>
        </header>

        <div class="table">
            <div class="row head">
                <div class="cell num">#</div>
                <div class="cell name">球员</div>
                <div class="cell stat">得分</div>
                <div class="cell stat">篮板</div>
                <div class="cell stat">助攻</div>
                <div class="cell pct">得分占比</div>
            </div>
            <vue-seamless-scroll class="list" :data="sortedPlayers" direction="top" :steep="0.3" roller :distance="10">
                <div class="row" v-for="(p, idx) in sortedPlayers" :key="p.id ?? idx"
                    :class="{ highlight: p.points === topScore }">
                    <div class="cell num">{{ p.number ?? idx + 1 }}</div>
                    <div class="cell name">{{ p.name }}</div>
                    <div class="cell stat">{{ p.points }}</div>
                    <div class="cell stat">{{ p.rebounds ?? 0 }}</div>
                    <div class="cell stat">{{ p.assists ?? 0 }}</div>
                    <div class="cell pct">
                        <div class="bar">
                            <div class="fill" :style="{ width: percent(p) + '%' }"></div>
                        </div>
                        <div class="percent-text">{{ percent(p) }}%</div>
                    </div>
                </div>
            </vue-seamless-scroll>
        </div>

        <!-- <footer class="sb-footer">
            <div class="note">数据来源：示例数据 / 可通过 props 传入实时数据</div>
        </footer> -->
    </div>
</template>

<script setup>
import { computed, reactive, toRefs } from 'vue';

const props = defineProps({
    // 支持传入 players 数组：[{ id, number, name, points, rebounds, assists }]
    players: {
        type: Array,
        default: () => null,
    },
});

// 如果未传入 props.players，使用本地示例数据，便于独立预览
const samplePlayers = [
    { id: 1, number: 7, name: '张三', points: 24, rebounds: 8, assists: 5 },
    { id: 2, number: 9, name: '李四', points: 17, rebounds: 6, assists: 7 },
    { id: 3, number: 11, name: '王五', points: 30, rebounds: 10, assists: 4 },
    { id: 4, number: 15, name: '赵六', points: 12, rebounds: 3, assists: 2 },
    { id: 5, number: 23, name: '钱七', points: 8, rebounds: 2, assists: 1 },
];

const state = reactive({
    sortBy: 'points',
});

const playersList = computed(() => {
    return props.players && Array.isArray(props.players) && props.players.length
        ? props.players
        : samplePlayers;
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
    height: calc(100% - 5px);
    max-width: calc(100% - 20px);
    margin: 0 auto;
    background: linear-gradient(180deg, rgba(2, 18, 34, 0.9), rgba(6, 30, 50, 0.35));
    border-radius: 8px;
    color: #eaf6ff;
    box-shadow: 0 6px 30px rgba(0, 0, 0, 0.5);
    overflow: hidden;
    font-family: 'Microsoft YaHei', Arial, sans-serif;

    .header {
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding: 0px 20px;
        // border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        // background: #000;

        .title {
            font-size: 20px;
            font-weight: 700;
        }

        .summary {
            display: flex;
            gap: 18px;
            font-size: 16px;
            color: #9fc6ff
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

    .table {
        height: 100%;
        padding: 0px 16px;
        font-size: 16px;
        // background: #db0707;
        .list {
            padding: 0;
            height: calc(100% - 95px);
            overflow: hidden;
        }
        .row {
            display: flex;
            align-items: center;
            padding: 5px 8px;
            border-radius: 6px;
            margin-bottom: 8px
        }

        .row.head {
            font-weight: 600;
            color: #bfe4ff;
            background: linear-gradient(90deg, rgba(255, 255, 255, 0.02), transparent);

        }

        .cell {
            padding: 0 12px;
        }

        .cell.num {
            width: 48px;
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
            font-size: 12px;
            color: #cfeeff
        }

        .row.highlight {
            background: linear-gradient(90deg, rgba(0, 120, 255, 0.08), rgba(0, 180, 255, 0.03));
            box-shadow: 0 6px 18px rgba(0, 120, 255, 0.06)
        }

        .sb-footer {
            padding: 10px 16px;
            font-size: 12px;
            color: #8fbfe6;
            background: rgba(0, 0, 0, 0.02);
            border-top: 1px solid rgba(255, 255, 255, 0.02)
        }

        .note {
            opacity: 0.8
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
