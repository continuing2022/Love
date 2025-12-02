<template>
  <div class="love-mask" v-if="isOpen">
    <!-- 弹幕容器 -->
    <div class="barrage-container">
      <TransitionGroup name="barrage">
        <div
          v-for="msg in messages"
          :key="msg.id"
          class="love-item"
          :style="{
            top: msg.position.top + '%',
            left: msg.position.left + '%',
            backgroundColor: msg.color,
          }"
        >
          {{ msg.text }}
        </div>
      </TransitionGroup>
    </div>

    <!-- 结束提示 -->
    <div v-if="showCloseBtn" class="close-panel">
      <div class="close-title animate-pulse">❤️ 这就是我爱你的100个理由 ❤️</div>

      <button @click="closeBarrage" class="close-btn animate-bounce">
        收下这份爱 💝
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from "vue";
import reasons from "../data/reasons.json";
import colors from "../data/colors.json";

const isOpen = ref(false);
const messages = ref([]);
const showCloseBtn = ref(false);

const isMobile = ref(false);
let timer = null;
let index = 0;
let prevBodyOverflow = "";

// 随机位置
const getRandomPos = () => {
  if (isMobile.value) {
    return {
      top: 10 + Math.random() * 65, // 避免顶部被挡
      left: 5 + Math.random() * 60, // 手机屏幕窄 → 左右范围缩小
    };
  } else {
    return {
      top: 5 + Math.random() * 80,
      left: 5 + Math.random() * 80,
    };
  }
};

// 开始弹幕
const startBarrage = () => {
  prevBodyOverflow = document.body.style.overflow || "";
  document.body.style.overflow = "hidden";

  isMobile.value = window.innerWidth <= 640;

  isOpen.value = true;
  messages.value = [];
  showCloseBtn.value = false;
  index = 0;

  let delay = 800;
  const minDelay = 100;
  const maxDelay = 800;
  const speedUpPoint = 10;
  const slowDownPoint = 90;

  const addMessage = () => {
    if (index < reasons.length) {
      messages.value.push({
        id: Date.now() + Math.random(),
        text: reasons[index],
        color: colors[Math.floor(Math.random() * colors.length)],
        position: getRandomPos(),
      });

      index++;

      // 动态速度变化
      if (index <= speedUpPoint) {
        delay = maxDelay - ((maxDelay - minDelay) / speedUpPoint) * index;
      } else if (index <= slowDownPoint) {
        delay = minDelay;
      } else {
        const p = (index - slowDownPoint) / (reasons.length - slowDownPoint);
        delay = minDelay + (maxDelay - minDelay) * p;
      }

      timer = setTimeout(addMessage, delay);
    } else {
      setTimeout(() => (showCloseBtn.value = true), 1000);
    }
  };

  addMessage();
};

// 关闭
const closeBarrage = () => {
  isOpen.value = false;
  messages.value = [];
  showCloseBtn.value = false;
  index = 0;

  if (timer) clearTimeout(timer);
  timer = null;

  document.body.style.overflow = prevBodyOverflow || "";
};

// 清理
onUnmounted(() => {
  if (timer) clearTimeout(timer);
  document.body.style.overflow = prevBodyOverflow || "";
});

// 暴露给父组件调用
defineExpose({ startBarrage });
</script>

<style scoped>
/* 蒙层 */
.love-mask {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  height: 100dvh; /* iOS Safari 修复 */
  overflow: hidden; /* 禁止 iOS 弹动拖拽 */
  z-index: 100000;
}

/* 弹幕容器 */
.barrage-container {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

/* 单条弹幕 */
.love-item {
  position: absolute;
  width: clamp(120px, 28vw, 200px);
  padding: 8px 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: clamp(12px, 3.5vw, 16px);
  font-weight: 500;
  white-space: nowrap;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  animation: fadeIn 0.5s ease-in-out;
  color: #fff;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  touch-action: manipulation;
}

/* 关闭区域 */
.close-panel {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.close-title {
  color: #fff;
  font-size: 1.875rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
}

.close-btn {
  padding: 1.25rem 2.5rem;
  background: linear-gradient(to right, #ec4899, #ef4444);
  color: #fff;
  font-size: 1.25rem;
  font-weight: bold;
  border-radius: 9999px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transition: all 0.3s;
}

/* 动画 */
.animate-pulse {
  animation: pulse 2s infinite;
}

.animate-bounce {
  animation: bounce 1s infinite;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.5);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* 响应式优化 */
@media (max-width: 640px) {
  .love-item {
    width: 75vw;
    font-size: 15px;
    padding: 12px 14px;
  }

  .close-title {
    font-size: 1.5rem;
    padding: 0 20px;
  }

  .close-btn {
    padding: 16px 30px;
    font-size: 18px;
  }
}
</style>
