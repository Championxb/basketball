<template>
    <div class="hl-container">
        <!-- <header class="hl-header">
            <h3>球员高光集锦</h3>
            <p class="hl-sub">展示球员的进球/得分高光，支持播放与下载</p>
        </header> -->

        <div class="hl-list">
            <div class="hl-card" v-for="(h, idx) in highlightsList" :key="h.id ?? idx">
                <div class="thumb" @click="open(h)">
                    <div class="poster" :style="{ backgroundImage: `url(${h.thumbnail || defaultThumb})` }">
                        <div class="play-icon">▶</div>
                    </div>
                </div>
                <div class="meta">
                    <div class="title">{{ h.title }}</div>
                    <div class="info">{{ h.playerName }} · {{ formatTime(h.time) }}</div>
                    <!-- <div class="actions">
                        <button class="btn" @click="open(h)">播放</button>
                        <button class="btn link" :href="h.videoUrl" :download="downloadName(h)" target="_blank"
                            rel="noreferrer">下载</button>
                    </div> -->
                </div>
            </div>
        </div>
        <Transition name="modal-fade">
            <div v-if="active" class="modal" @click.self="close">
                <div class="modal-body">
                    <div class="modal-header">
                        <div class="modal-title">{{ active.title }} — {{ active.playerName }}</div>
                        <button class="close" @click="close">✕</button>
                    </div>
                    <div class="modal-content">
                        <video ref="videoEl" :src="active.videoUrl" controls controlsList="nodownload" autoplay
                            playsinline></video>
                        <div class="modal-info">
                            <p>{{ active.description }}</p>
                            <div class="meta-row">时间：{{ formatTime(active.time) }}</div>
                            <a class="btn" :href="active.videoUrl" :download="downloadName(active)" target="_blank"
                                rel="noreferrer">下载原片</a>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps({
    // highlights: [{ id, playerName, time (ISO or seconds), title, description, thumbnail, videoUrl }]
    highlights: {
        type: Array,
        default: null,
    },
});

const defaultThumb = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360"><rect width="100%" height="100%" fill="%2300253f"/><text x="50%" y="50%" fill="%23a6d8ff" font-size="24" text-anchor="middle" dy="8">No Thumbnail</text></svg>';

const sample = [
    {
        id: 1,
        playerName: '张三',
        time: '00:02:34',
        title: '张三 关键三分',
        description: '第四节最后两分钟，张三在弧顶命中关键三分。',
        thumbnail: '',
        videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    },
    {
        id: 2,
        playerName: '李四',
        time: '00:10:12',
        title: '李四 空中接力',
        description: '团队配合，空中接力完成暴扣。',
        thumbnail: '',
        videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    },
    {
        id: 3,
        playerName: '王五',
        time: '00:15:45',
        title: '王五 快攻上篮',
        description: '抢断后快速反击，上篮得分。',
        thumbnail: '',
        videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    },
    {
        id: 4,
        playerName: '赵六',
        time: '00:20:30',
        title: '赵六 后撤步三分',
        description: '后撤步创造空间，命中三分球。',
        thumbnail: '',
        videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    }
];

const highlightsList = computed(() => (props.highlights && props.highlights.length ? props.highlights : sample));

const active = ref(null);
const videoEl = ref(null);

function open(h) {
    active.value = h;
    // play will auto via autoplay attribute; ensure video element reloads when active changes
    setTimeout(() => {
        if (videoEl.value && videoEl.value.play) videoEl.value.play().catch(() => { });
    }, 50);
}

function close() {
    if (videoEl.value && videoEl.value.pause) videoEl.value.pause();
    active.value = null;
}

function downloadName(h) {
    // create a sensible filename
    const name = (h.playerName || 'player') + '-' + (h.title || 'highlight');
    return name.replace(/[^a-zA-Z0-9-_\.\u4e00-\u9fa5]/g, '_') + '.mp4';
}


function formatTime(t) {
    if (!t) return '';
    // if already looks like HH:MM:SS return; if number assume seconds
    if (typeof t === 'string' && t.includes(':')) return t;
    const s = Number(t || 0);
    const hh = Math.floor(s / 3600);
    const mm = Math.floor((s % 3600) / 60);
    const ss = Math.floor(s % 60);
    return [hh, mm, ss].map(n => String(n).padStart(2, '0')).join(':');
}

// 新增：用于监听键盘事件
const handleEscKey = (event) => {
    if (event.key === 'Escape' && active.value) {
        close(); // 如果按下了 ESC 且弹窗是打开的，则关闭
    }
};

// 组件挂载时监听键盘
onMounted(() => {
    document.addEventListener('keydown', handleEscKey);
});

// 组件卸载时移除监听，防止内存泄漏
onUnmounted(() => {
    document.removeEventListener('keydown', handleEscKey);
});
</script>

<style lang="scss" scoped>
.hl-container {
    width: calc(100% - 10px);
    height: calc(100% - 5px);
    margin: 0 auto;
    color: #eaf6ff;
    font-family: Microsoft YaHei, Arial, sans-serif;
    // display: flex;
    // flex-direction: column;
    align-items: center;
    // background: #eb1212;
}

.hl-header {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-bottom: 12px
}

.hl-header h3 {
    margin: 0;
    font-size: 18px
}

.hl-sub {
    margin: 0;
    color: #9fc6ff;
    font-size: 13px
}

.hl-list {
    width: 100%;
    // height: 100%;
    display: grid;
    grid-template-columns: repeat(2, minmax(220px, 1fr));
    gap: 12px;
    padding: 4px;

    .hl-card {
        background: linear-gradient(90deg, rgba(72, 134, 181, 0.3), rgba(21, 87, 129, 0.3));
        // background: #000;
        padding: 8px;
        border-radius: 8px;
        display: flex;
        gap: 8px;
        align-items: flex-start;

        .thumb {
            // background: #000;
            flex: 0 0 180px;
            cursor: pointer;

            .poster {
                width: 160px;
                height: 90px;
                background: rgba(0, 0, 0, 0.5);
                background-size: cover;
                background-position: center;
                border-radius: 6px;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;

                .play-icon {
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    background: rgba(0, 0, 0, 0.5);
                    padding: 6px 10px;
                    border-radius: 6px;
                    color: #fff;
                    font-weight: 700
                }
            }

        }

        .meta {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            // align-items: center;
            width: 100%;
            height: 100%;
            gap: 6px;

            .title {
                font-weight: 600
            }

            .info {
                font-size: 13px;
                color: #9fc6ff
            }

            .actions {
                display: flex;
                gap: 8px;
                // margin-top: auto;

                .btn {
                    background: #0077ff;
                    color: #fff;
                    padding: 6px 10px;
                    border-radius: 4px;
                    border: none;
                    cursor: pointer;
                    text-decoration: none
                }

                .btn.link {
                    background: transparent;
                    border: 1px solid rgba(255, 255, 255, 0.06);
                    color: #cfeeff
                }
            }
        }
    }
}

/* modal */
.modal {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999
}

.modal-body {
    width: min(1600px, 95%);
    background: linear-gradient(180deg, #021029, #04213a);
    border-radius: 8px;
    overflow: hidden
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.03)
}

.modal-title {
    font-size: 25px;
    font-weight: 700;
    color: #eaf6ff
}

.modal .close {
    background: transparent;
    border: none;
    color: #eaf6ff;
    font-size: 18px;
    cursor: pointer
}

.modal-content {
    display: flex;
    gap: 12px;
    padding: 12px;
    font-size: 20px;
}

.modal-content video {
    width: 60%;
    height: auto;
    border-radius: 6px;
    // background: #000
}

.modal-info {
    flex: 1;
    gap: 12px;
    padding: 8px;
    color: #cfeeff;

    .btn {
        background: #0077ff;
        color: #fff;
        padding: 6px 10px;
        border-radius: 4px;
        border: none;
        cursor: pointer;
        text-decoration: none;
        display: inline-block;
        margin-top: 12px;
    }
}

.meta-row {
    margin-top: 8px;
    color: #9fc6ff
}

// Modal 进入/离开动画
.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: all 0.3s ease-in-out;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
}

.modal-fade-enter-to,
.modal-fade-leave-from {
    opacity: 1;
    transform: scale(1) translateY(0);
}

@media (max-width:720px) {
    .hl-list {
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr))
    }

    .thumb {
        flex: 0 0 120px
    }

    .poster {
        width: 120px;
        height: 68px
    }

    .modal-content {
        flex-direction: column
    }

    .modal-content video {
        width: 100%
    }
}
</style>
