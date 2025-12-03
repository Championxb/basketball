<template>
  <div class="hl-container">
    <div class="hl-list">
      <div
        class="hl-card"
        v-for="(h, idx) in highlightsList"
        :key="h.id ?? idx"
      >
        <div class="thumb" @click="open(h)">
          <div
            class="poster"
            :style="{ backgroundImage: `url(${h.thumbnail || defaultThumb})` }"
          >
            <div class="play-icon">▶</div>
          </div>
        </div>
        <div class="meta">
          <div class="title">{{ h.title_id }} {{ h.title_score }}</div>
        </div>
      </div>
    </div>
    <Transition name="modal-fade">
      <div v-if="active" class="modal" @click.self="close">
        <div class="modal-body">
          <div class="modal-header">
            <div class="modal-title">
              {{ active.title_id }} {{ active.title_score }}
              <button class="edit-btn" @click="openEditModal">编辑</button>
            </div>
            <div class="modal-download">
              <a
                class="btn"
                :href="active.videoUrl"
                :download="downloadName(active)"
                target="_blank"
                rel="noreferrer"
                >下载原片</a
              >
            </div>
            <button class="close" @click="close">✕</button>
          </div>
          <div class="modal-content">
            <video
              ref="videoEl"
              :src="active.videoUrl"
              controls
              controlsList="nodownload"
              autoplay
              playsinline
            ></video>
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
              <input
                type="text"
                v-model="editForm.title_id"
                class="edit-input"
              />
            </div>
            <div class="form-group">
              <label>得分</label>
              <input
                type="text"
                placeholder="请输入得分(1-3分)"
                v-model="editForm.title_score"
                class="edit-input"
              />
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

const sample = [
  {
    id: 1,
    playerName: "张三",
    time: "00:02:34",
    title_id: "1号球员",
    title_score: "1分",
    thumbnail: thumb1,
    videoUrl: video1,
  },
  {
    id: 2,
    playerName: "李四",
    time: "00:10:12",
    title_id: "3号球员",
    title_score: "3分",
    description: "团队配合，空中接力完成暴扣。",
    thumbnail: thumb2,
    videoUrl: video2,
  },
  {
    id: 3,
    playerName: "王五",
    time: "00:15:45",
    title_id: "3号球员",
    title_score: "3分",
    description: "抢断后快速反击，上篮得分。",
    thumbnail: thumb3,
    videoUrl: video3,
  },
];

const highlightsList = computed(() =>
  props.highlights && props.highlights.length ? props.highlights : sample
);

const active = ref(null);
const videoEl = ref(null);
// 编辑弹框相关变量
const showEditModal = ref(false);
const editForm = ref({
  title_id: "",
  title_score: "",
});

// 打开编辑弹框
function openEditModal() {
  if (!active.value) return;
  // 初始化表单值
  editForm.value.title_id = active.value.title_id;
  editForm.value.title_score = active.value.title_score;
  showEditModal.value = true;
}

// 关闭编辑弹框
function closeEditModal() {
  showEditModal.value = false;
}

// 保存编辑内容
function saveEdit() {
  if (active.value) {
    active.value.title_id =
      editForm.value.title_id.trim() || active.value.title_id;
    active.value.title_score =
      editForm.value.title_score.trim() || active.value.title_score;
  }
  closeEditModal();
}

function open(h) {
  active.value = h;
  setTimeout(() => {
    if (videoEl.value && videoEl.value.play)
      videoEl.value.play().catch(() => {});
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
  height: 70%;
  display: grid;
  grid-template-columns: repeat(1, minmax(220px, 1fr));
  gap: 12px;
  padding: 4px;

  .hl-card {
    background: linear-gradient(
      90deg,
      rgba(72, 134, 181, 0.3),
      rgba(21, 87, 129, 0.3)
    );
    padding: 8px;
    border-radius: 8px;
    display: flex;
    gap: 8px;
    align-items: flex-start;

    .thumb {
      height: 100%;
      flex: 0 0 120px;
      cursor: pointer;

      .poster {
        width: 120px;
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
          font-weight: 700;
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
  height: min(700px, 95%);
  background: linear-gradient(180deg, #021029, #04213a);
  border-radius: 8px;
  overflow: hidden;
}

.edit-modal-body {
  width: min(500px, 90%);
  background: linear-gradient(180deg, #021029, #04213a);
  border-radius: 8px;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
}

.modal-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 25px;
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

.modal .close {
  background: transparent;
  border: none;
  color: #eaf6ff;
  font-size: 18px;
  cursor: pointer;
}

.modal-content {
  display: flex;
  justify-content: center;
  gap: 12px;
  padding: 12px;
  font-size: 20px;
}

.modal-content video {
  width: 95%;
  height: 10%;
  border-radius: 6px;
}

.modal-download {
  display: flex;
  align-items: center;
  flex: 1;
  gap: 12px;
  padding: 8px;
  color: #cfeeff;

  .btn {
    margin-left: auto;
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
