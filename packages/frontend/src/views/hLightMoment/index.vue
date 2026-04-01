<template>
    <div class="hl-container">
        <!-- <header class="hl-header">
            <h3>球员高光集锦</h3>
            <p class="hl-sub">展示球员的进球/得分高光，支持播放与下载</p>
        </header> -->

        <div class="hl-list">
            <TransitionGroup name="moment" class="list">
                <div class="hl-card" v-for="(h, idx) in highlightsList" :key="h.highlight.id ?? idx">
                    <div class="thumb" @click="open(h)">
                        <div class="poster"
                            :style="{ backgroundImage: `url(${h.highlight.imagePath || defaultThumb})` }">
                            <div class="play-icon">▶</div>
                        </div>
                    </div>
                    <div class="meta">
                        <div class="title">{{ h.highlight.playerId }}号 {{ h.highlight.currentScore }}分</div>
                        <!-- <div class="info">{{ h.playerName }} ·{{ h.highlight.currentScore }}分</div> -->
                        <!-- {{ formatTime(h.time) }} -->
                        <!-- <div class="actions">
                        <button class="btn" @click="open(h)">播放</button>
                        <button class="btn link" :href="h.videoUrl" :download="downloadName(h)" target="_blank"
                            rel="noreferrer">下载</button>
                    </div> -->
                    </div>
                </div>
            </TransitionGroup>
        </div>
        <Transition name="modal-fade">
            <div v-if="active" class="modal" @click.self="close">
                <div class="modal-body">
                    <div class="modal-header">
                        <div class="modal-title">
                            {{ active.playerName }} {{ active.highlight.currentScore }} 分
                            <button class="edit-btn" @click="openEditModal">编辑</button>
                        </div>
                        <div class="modal-download">
                            <a class="btn" :href="active.highlight.videoPath" :download="downloadName(active)"
                                target="_blank" rel="noreferrer">下载原片</a>
                        </div>
                        <button class="close" @click="close">✕</button>
                    </div>
                    <div class="modal-content">
                        <video ref="videoEl" :src="active.highlight.videoPath" controls controlsList="nodownload"
                            autoplay playsinline></video>
                    </div>
                </div>
            </div>
        </Transition>

        <!-- 编辑弹框 -->
        <Transition name="modal-fade">
            <div v-if="showEditModal" class="modal" @click.self="closeEditModal">
                <div class="edit-modal-body">
                    <div class="modal-header">
                        <div class="modal-title">编辑信息</div>
                        <button class="close" @click="closeEditModal">✕</button>
                    </div>
                    <div class="edit-content">
                        <div class="form-group">
                            <label>球员编号</label>
                            <input type="text" v-model="editForm.playerName" class="edit-input" />
                        </div>
                        <div class="form-group">
                            <label>得分</label>
                            <input type="text" placeholder="请输入得分(1-3分)" v-model="editForm.currentScore"
                                class="edit-input" />
                        </div>
                        <div class="edit-actions">
                            <button class="btn cancel" @click="closeEditModal">取消</button>
                            <button class="btn save" @click="saveEdit">保存</button>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import video1 from "@assets/video/11月25日.mp4";
import video2 from "@assets/video/11月25日(1).mp4";
import video3 from "@assets/video/11月25日(2).mp4";
import video4 from "@assets/video/11月25日(3).mp4";
import video5 from "@assets/video/11月25日(4).mp4";
import thumb1 from "@assets/thumb/thumb1.png";
import thumb2 from "@assets/thumb/thumb2.png";
import thumb3 from "@assets/thumb/thumb3.png";
import thumb4 from "@assets/thumb/thumb4.png";
import thumb5 from "@assets/thumb/thumb5.png";

const props = defineProps({
    highlights: {
        type: Array,
        default: null,
    },
});

const defaultThumb =
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360"><rect width="100%" height="100%" fill="%2300253f"/><text x="50%" y="50%" fill="%23a6d8ff" font-size="24" text-anchor="middle" dy="8">No Thumbnail</text></svg>';


const sample = ref([
    {
        highlight: {
            id: 1,
            playerId: 101,
            videoPath: video1,
            imagePath: thumb1,
            currentScore: 3,
            createTime: "2025-12-03T13:08:33.967Z",
            updateTime: "2025-12-03T13:08:33.967Z"
        },
        playerName: '张三'
    },
    {
        highlight: {
            id: 2,
            playerId: 102,
            videoPath: video2,
            imagePath: thumb2,
            currentScore: 2,
            createTime: "2025-12-03T13:08:33.967Z",
            updateTime: "2025-12-03T13:08:33.967Z"
        },
        playerName: '李四'
    },
    {
        highlight: {
            id: 3,
            playerId: 103,
            videoPath: video3,
            imagePath: thumb3,
            currentScore: 1,
            createTime: "2025-12-03T13:08:33.967Z",
            updateTime: "2025-12-03T13:08:33.967Z"
        },
        playerName: '王五'
    },
    {
        highlight: {
            id: 4,
            playerId: 104,
            videoPath: video4,
            imagePath: thumb4,
            currentScore: 3,
            createTime: "2025-12-03T13:08:33.967Z",
            updateTime: "2025-12-03T13:08:33.967Z"
        },
        playerName: '赵六'
    },
    {
        highlight: {
            id: 5,
            playerId: 105,
            videoPath: video5,
            imagePath: thumb5,
            currentScore: 5,
            createTime: "2025-12-03T13:08:33.967Z",
            updateTime: "2025-12-03T13:08:33.967Z"
        },
        playerName: '孙七'
    }
])
const highlightsList = computed(() => (props.highlights && props.highlights.length ? props.highlights : sample.value));

const active = ref(null);
const videoEl = ref(null);
// 编辑弹框相关变量
const showEditModal = ref(false);
const editForm = ref({
    playerName: "",
    currentScore: "",
});

// 打开编辑弹框
function openEditModal() {
    if (!active.value) return;
    // 初始化表单值
    editForm.value.playerName = active.value.playerName;
    editForm.value.currentScore = active.value.highlight.currentScore;
    showEditModal.value = true;
}

// 关闭编辑弹框
function closeEditModal() {
    showEditModal.value = false;
}

// 保存编辑内容
function saveEdit() {
    if (active.value) {
        active.value.playerName =
            editForm.value.playerName.trim() || active.value.playerName;
        active.value.highlight.currentScore =
            editForm.value.currentScore.trim() || active.value.highlight.currentScore;
    }
    closeEditModal();
}

function open(h) {
    active.value = h;
    setTimeout(() => {
        if (videoEl.value && videoEl.value.play)
            videoEl.value.play().catch(() => { });
    }, 50);
}

function close() {
    if (videoEl.value && videoEl.value.pause) videoEl.value.pause();
    active.value = null;
}

function downloadName(h) {
    const name = (h.playerName || "player") + "-" + (h.title || "highlight");
    return name.replace(/[^a-zA-Z0-9-_\.\u4e00-\u9fa5]/g, "_") + ".mp4";
}

function formatTime(t) {
    if (!t) return "";
    if (typeof t === "string" && t.includes(":")) return t;
    const s = Number(t || 0);
    const hh = Math.floor(s / 3600);
    const mm = Math.floor((s % 3600) / 60);
    const ss = Math.floor(s % 60);
    return [hh, mm, ss].map((n) => String(n).padStart(2, "0")).join(":");
}

const updateMomentList = (data) => {
    if (props.highlights && props.highlights.length) {
        props.highlights.unshift(data);
        if (props.highlights.length > 4) {
            props.highlights.pop();
        }
    } else {
        sample.value.pop();
        sample.value.unshift(data);
        console.log("高光列表已更新", sample.value);
    };
}

// 显式暴露方法供父组件调用
defineExpose({
    updateMomentList
});

// 新增：用于监听键盘事件
const handleEscKey = (event) => {
    if (event.key === "Escape") {
        if (showEditModal.value) {
            closeEditModal();
        } else if (active.value) {
            close();
        }
    }
};

onMounted(() => {
    document.addEventListener("keydown", handleEscKey);
});

onUnmounted(() => {
    document.removeEventListener("keydown", handleEscKey);
});
</script>

<style lang="scss" scoped>
.hl-container {
    width: calc(100% - 10px);
    height: calc(100% - 5px);
    margin: 0 auto;
    color: #eaf6ff;
    font-family: Microsoft YaHei, Arial, sans-serif;
    align-items: center;
}

.hl-list {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: repeat(1, minmax(220px, 1fr));
    gap: 12px;
    padding: 4px;

    .moment-move {
        transition: all 0.6s ease-in-out;
    }


    /* 1. 声明过渡效果 */
    .moment-move,
    .moment-enter-active,
    .moment-leave-active {
        transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
    }

    /* 2. 声明进入和离开的状态 */
    .moment-enter-from,
    .moment-leave-to {
        opacity: 0;
        transform: scaleY(0.01) translate(30px, 0);
    }

    /* 3. 确保离开的项目被移除出了布局流
      以便正确地计算移动时的动画效果。 */
    .moment-leave-active {
        position: absolute;
    }


    .hl-card {
        background: linear-gradient(90deg, rgba(72, 134, 181, 0.3), rgba(21, 87, 129, 0.3));
        //  background: #000;
        padding: 8px;
        border-radius: 8px;
        display: flex;
        gap: 8px;
        align-items: flex-start;

        .thumb {
            height: 100%;
            flex: 0 0 60%;
            cursor: pointer;

            .poster {
                width: 100%;
                height: 100%;
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
    }

    .meta {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100%;
        gap: 6px;
        font-size: 15px;

        .title {
            font-weight: 600;
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
    z-index: 999;
}

.modal-body {
    width: min(1000px, 95%);
    height: min(600px, 95%);
    background: linear-gradient(45deg, #136aff, #3d5869);
    border-radius: 8px;
    overflow: hidden;

    .modal-header {
        display: flex;
        justify-content: space-around;
        align-items: center;
        justify-content: center;
        padding: 8px 12px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.03);

        .modal-title {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 24px;
            font-weight: 700;
            color: #eaf6ff;

            .edit-btn {
                background: #0077ff;
                color: white;
                border: none;
                border-radius: 4px;
                padding: 4px 8px;
                cursor: pointer;
                font-size: 14px;
                height: 30px;
            }
        }

        .modal-download {
            display: flex;
            align-items: center;
            flex: 1;
            gap: 12px;
            color: #cfeeff;

            .btn {
                margin-left: auto;
                background: #0077ff;
                color: #fff;
                padding: 6px 10px;
                border-radius: 4px;
                border: none;
                font-size: 15px;
                cursor: pointer;
                text-decoration: none;
                display: inline-block;
            }
        }
    }

    .modal-content {
        display: flex;
        justify-content: center;
        padding: 5px;

        video {
            width: 96%;
            // height: 10%;
            border-radius: 6px;
        }
    }

}

.edit-modal-body {
    width: min(500px, 90%);
    background: linear-gradient(180deg, #021029, #04213a);
    border-radius: 8px;
    overflow: hidden;
}

.modal .close {
    background: transparent;
    border: none;
    color: #eaf6ff;
    font-size: 18px;
    cursor: pointer;
}





/* 编辑弹框样式 */
.edit-content {
    padding: 20px;
}

.form-group {
    margin-bottom: 16px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    color: #9fc6ff;
    font-size: 14px;
}

.edit-input {
    width: 100%;
    padding: 10px;
    border-radius: 4px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.05);
    color: #eaf6ff;
    font-size: 16px;
    box-sizing: border-box;
}

.edit-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
}

.edit-actions .btn {
    padding: 8px 16px;
    border-radius: 4px;
    border: none;
    cursor: pointer;
    font-size: 14px;
}

.edit-actions .cancel {
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #cfeeff;
}

.edit-actions .save {
    background: #0077ff;
    color: white;
}

/* 动画 */
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

@media (max-width: 720px) {
    .hl-list {
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    }

    .thumb {
        flex: 0 0 120px;
    }

    .poster {
        width: 120px;
        height: 68px;
    }

    .modal-content {
        flex-direction: column;
    }

    .modal-content video {
        width: 100%;
    }
}
</style>
