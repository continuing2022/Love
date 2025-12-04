<template>
  <div class="love-messages-container">
    <!-- 返回 -->
    <button class="back-button" @click="goBack">← 返回</button>

    <!-- 标题区域 -->
    <div class="header">
      <Heart class="header-icon" size="48" />
      <h1 class="title">情话留言</h1>
      <p class="subtitle">记录我们之间的甜蜜时刻</p>
    </div>

    <!-- 添加按钮 -->
    <button class="add-button" @click="showInput = !showInput">
      <Plus size="24" />
      <span>写下新的情话</span>
    </button>

    <!-- 输入框 -->
    <div v-if="showInput" class="input-container">
      <textarea
        v-model="newMessage"
        placeholder="写下你想说的话..."
        class="message-input"
        rows="3"
      ></textarea>

      <div class="input-actions">
        <button class="cancel-btn" @click="showInput = false">取消</button>
        <button class="submit-btn" @click="addMessage">发送 💕</button>
      </div>
    </div>

    <!-- 留言网格 -->
    <div class="messages-grid">
      <div
        v-for="(msg, index) in messages"
        :key="msg.id"
        class="message-card"
        :style="{ animationDelay: index * 0.1 + 's' }"
        @click="selectedMessage = msg"
      >
        <div class="card-content">
          <Heart class="card-icon" size="20" />
          <p class="message-text">{{ msg.text }}</p>
        </div>
        <div class="card-footer">
          <span class="message-date">
            {{ formatDate(msg.timestamp) }}
          </span>
        </div>
      </div>
    </div>

    <!-- 模态框 -->
    <div
      v-if="selectedMessage"
      class="modal-overlay"
      @click="selectedMessage = null"
    >
      <div class="modal-content" @click.stop>
        <button class="modal-close" @click="selectedMessage = null">
          <X size="24" />
        </button>

        <Heart class="modal-icon" size="60" />
        <p class="modal-text">{{ selectedMessage.text }}</p>
        <p class="modal-date">
          {{ formatDateTime(selectedMessage.timestamp) }}
        </p>

        <button
          class="delete-button"
          @click="deleteMessage(selectedMessage.id)"
        >
          删除这条留言
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Heart, Plus, X } from "lucide-vue-next";

const messages = ref([]);
const newMessage = ref("");
const showInput = ref(false);
const selectedMessage = ref(null);

const fetchMessages = async () => {
  try {
    const res = await fetch("/api/messages");
    if (!res.ok) throw new Error("failed to load");
    messages.value = await res.json();
  } catch (e) {
    console.error(e);
    messages.value = [];
  }
};

onMounted(() => {
  fetchMessages();
});

const addMessage = async () => {
  const text = newMessage.value.trim();
  if (!text) return;
  try {
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) throw new Error("failed to save");
    const created = await res.json();
    messages.value.push(created);
    newMessage.value = "";
    showInput.value = false;
  } catch (e) {
    console.error(e);
    alert("保存失败，请查看终端日志");
  }
};

const deleteMessage = async (id) => {
  try {
    const res = await fetch(`/api/messages/${id}`, { method: "DELETE" });
    if (res.status === 204) {
      messages.value = messages.value.filter((m) => m.id !== id);
      selectedMessage.value = null;
    } else {
      const txt = await res.text();
      console.error("delete failed", res.status, txt);
      alert("删除失败");
    }
  } catch (e) {
    console.error(e);
    alert("删除失败，请查看终端日志");
  }
};

const goBack = () => {
  window.history.back();
};

const formatDate = (ts) => new Date(ts).toLocaleDateString("zh-CN");
const formatDateTime = (ts) => new Date(ts).toLocaleString("zh-CN");
</script>

<style scoped>
.love-messages-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #ffb3d9 0%, #ff85c1 50%, #ffa6d5 100%);
  padding: 2rem;
  position: relative;
  overflow: hidden;
}

.love-messages-container::before {
  content: "";
  position: absolute;
  width: 200%;
  height: 200%;
  background-image: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.15) 1px,
      transparent 1px
    ),
    radial-gradient(circle, rgba(255, 182, 193, 0.1) 1px, transparent 1px);
  background-size: 50px 50px, 80px 80px;
  background-position: 0 0, 40px 40px;
  animation: float 20s linear infinite;
  z-index: 0;
}

@keyframes float {
  from {
    transform: translate(0, 0);
  }
  to {
    transform: translate(-50px, -50px);
  }
}

.back-button {
  position: fixed;
  top: 30px;
  left: 30px;
  background: rgba(255, 255, 255, 0.95);
  border: 2px solid #ffb3d9;
  color: #ff69b4;
  padding: 12px 28px;
  border-radius: 25px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  z-index: 1000;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 105, 180, 0.2);
}

.back-button:hover {
  background: #fff;
  transform: translateX(-5px);
  box-shadow: 0 6px 20px rgba(255, 105, 180, 0.3);
}

.header {
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
  z-index: 1;
  animation: fadeInDown 0.8s ease;
}

.header-icon {
  color: #fff;
  filter: drop-shadow(0 4px 12px rgba(255, 105, 180, 0.5));
  animation: pulse 2s ease infinite;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.title {
  font-size: 3rem;
  font-weight: bold;
  color: #fff;
  margin: 1rem 0 0.5rem;
  text-shadow: 0 2px 10px rgba(255, 182, 193, 0.5);
}

.subtitle {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.95);
  letter-spacing: 2px;
}

.add-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 auto 2rem;
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.95);
  border: 2px solid #fff;
  border-radius: 25px;
  color: #ff69b4;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 105, 180, 0.2);
  position: relative;
  z-index: 1;
}

.add-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 25px rgba(255, 105, 180, 0.3);
  background: #fff;
}

.input-container {
  max-width: 600px;
  margin: 0 auto 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 8px 25px rgba(255, 105, 180, 0.2);
  position: relative;
  z-index: 1;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message-input {
  width: 100%;
  padding: 1rem;
  border: 2px solid #ffc4dd;
  border-radius: 15px;
  font-size: 1rem;
  color: #ff69b4;
  resize: vertical;
  font-family: inherit;
}

.message-input:focus {
  outline: none;
  border-color: #ff85c1;
}

.input-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  justify-content: flex-end;
}

.cancel-btn,
.submit-btn {
  padding: 0.7rem 1.5rem;
  border: none;
  border-radius: 15px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn {
  background: #f0f0f0;
  color: #999;
}

.cancel-btn:hover {
  background: #e0e0e0;
}

.submit-btn {
  background: linear-gradient(135deg, #ff69b4 0%, #ff1493 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(255, 105, 180, 0.3);
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 105, 180, 0.4);
}

.messages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.message-card {
  background: rgba(255, 255, 255, 0.95);
  border: 3px solid transparent;
  border-radius: 20px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 25px rgba(255, 105, 180, 0.15);
  animation: slideUp 0.6s ease backwards;
  position: relative;
  overflow: hidden;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 182, 193, 0.3),
    transparent
  );
  transition: left 0.6s ease;
}

.message-card:hover::before {
  left: 100%;
}

.message-card:hover {
  transform: translateY(-10px) scale(1.02);
  border-color: #ffb3d9;
  background: #fff;
  box-shadow: 0 20px 50px rgba(255, 105, 180, 0.35);
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.card-icon {
  color: #ff69b4;
  filter: drop-shadow(0 2px 6px rgba(255, 105, 180, 0.3));
}

.message-text {
  font-size: 1.1rem;
  color: #ff69b4;
  line-height: 1.6;
  font-weight: 500;
  margin: 0;
}

.card-footer {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 182, 193, 0.3);
}

.message-date {
  font-size: 0.9rem;
  color: #ffb3d9;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(255, 105, 180, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  background: linear-gradient(135deg, #fff 0%, #ffeff5 100%);
  padding: 3rem;
  border-radius: 30px;
  text-align: center;
  max-width: 500px;
  border: 3px solid #ffb3d9;
  box-shadow: 0 20px 60px rgba(255, 105, 180, 0.4);
  animation: scaleIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  position: relative;
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.7) rotate(-5deg);
  }
  to {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 105, 180, 0.1);
  border: none;
  color: #ff69b4;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.modal-close:hover {
  background: rgba(255, 105, 180, 0.2);
  transform: rotate(90deg);
}

.modal-icon {
  color: #ff69b4;
  margin-bottom: 1.5rem;
  filter: drop-shadow(0 4px 12px rgba(255, 105, 180, 0.5));
  animation: pulse 2s ease infinite;
}

.modal-text {
  font-size: 1.5rem;
  color: #ff69b4;
  line-height: 1.8;
  margin: 1.5rem 0;
  font-weight: 500;
}

.modal-date {
  font-size: 1rem;
  color: #ffb3d9;
  margin-bottom: 2rem;
}

.delete-button {
  background: linear-gradient(135deg, #ff6b9d, #ff1493);
  color: white;
  border: none;
  padding: 0.8rem 2rem;
  border-radius: 20px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 105, 180, 0.3);
}

.delete-button:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 25px rgba(255, 105, 180, 0.5);
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .title {
    font-size: 2rem;
  }

  .messages-grid {
    grid-template-columns: 1fr;
  }

  .modal-content {
    margin: 1rem;
    padding: 2rem;
  }
}
</style>
