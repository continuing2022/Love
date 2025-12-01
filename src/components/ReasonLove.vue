<template>
  <!-- 只在打开时显示弹窗 -->
  <div class="Love" v-if="isOpen">
    <!-- 弹幕容器 -->
    <div class="absolute inset-0 overflow-hidden">
      <!-- 弹幕内容 -->
      <TransitionGroup name="barrage">
        <div
          v-for="msg in messages"
          :key="msg.id"
          class="love-item"
          :style="{
            position: 'absolute',
            top: msg.position.top + '%',
            left: msg.position.left + '%',
            backgroundColor: msg.color,
            color: '#fff',
            textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
          }"
        >
          {{ msg.text }}
        </div>
      </TransitionGroup>
    </div>

    <!-- 结束提示 -->
    <div v-if="showCloseBtn" class="text-center">
      <div
        class="animate-pulse"
        style="
          color: white;
          font-size: 1.875rem;
          font-weight: bold;
          margin-bottom: 1.5rem;
        "
      >
        ❤️ 这就是我爱你的100个理由 ❤️
      </div>

      <button
        @click="closeBarrage"
        class="animate-bounce"
        style="
          padding: 1.25rem 2.5rem;
          background: linear-gradient(to right, #ec4899, #ef4444);
          color: white;
          font-size: 1.25rem;
          font-weight: bold;
          border-radius: 9999px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
            0 10px 10px -5px rgba(0, 0, 0, 0.04);
          transition: all 0.3s;
        "
      >
        收下这份爱 💝
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted, onMounted } from "vue";
import reasons from "../data/reasons.json";
import colors from "../data/colors.json";

const isOpen = ref(false);
const messages = ref([]);
const showCloseBtn = ref(false);

// 移动端检测（可响应窗口尺寸变化）
const isMobile = ref(false);
let resizeHandler = null;

let index = 0;
let timer = null;
let prevBodyOverflow = "";

// 生成随机位置,避免重叠
const getRandomPos = () => ({
  // 对移动端和桌面端使用稍微不同的分布
  top: Math.random() * (isMobile.value ? 70 : 80) + 5, // 5% - ~75/85%
  left: Math.random() * (isMobile.value ? 70 : 80) + 5,
});

// 保持消息不自动消失（消息将一直保留，直到用户点击关闭）

// 启动弹幕
const startBarrage = () => {
  // 开始播放爱的理由弹幕

  // 记录并锁定页面滚动，避免背景滚动影响移动体验
  prevBodyOverflow = document.body.style.overflow || "";
  document.body.style.overflow = "hidden";

  // 更新移动端标记
  isMobile.value = window.innerWidth <= 640;

  // 重置状态
  isOpen.value = true;
  messages.value = [];
  showCloseBtn.value = false;
  index = 0;

  // 速度控制参数
  let delay = 800; // 初始延迟
  const minDelay = 100; // 最快速度
  const maxDelay = 800; // 最慢速度
  const speedUpPoint = 30; // 前30个加速
  const slowDownPoint = 80; // 80个后减速

  const addMessage = () => {
    if (index < reasons.length) {
      // 添加新消息
      const id = Date.now() + Math.random();
      messages.value.push({
        id,
        text: reasons[index],
        color: colors[Math.floor(Math.random() * colors.length)],
        position: getRandomPos(),
      });

      // 不再自动移除消息 — 保持所有已添加的消息直到用户关闭弹幕
      // 如果未来需要限制内存，可在此处加入按需回收策略

      index++;

      // 动态调整速度
      if (index <= speedUpPoint) {
        // 前30个:从慢到快
        delay = maxDelay - ((maxDelay - minDelay) / speedUpPoint) * index;
      } else if (index <= slowDownPoint) {
        // 中间40个:保持最快速度
        delay = minDelay;
      } else {
        // 最后30个:从快到慢
        const slowProgress =
          (index - slowDownPoint) / (reasons.length - slowDownPoint);
        delay = minDelay + (maxDelay - minDelay) * slowProgress;
      }

      // 继续下一个
      timer = setTimeout(addMessage, delay);
    } else {
      // 全部显示完毕,延迟显示关闭按钮
      setTimeout(() => {
        showCloseBtn.value = true;
      }, 1000);
    }
  };

  // 开始添加消息
  addMessage();
};

// 关闭弹幕
const closeBarrage = () => {
  isOpen.value = false;
  messages.value = [];
  showCloseBtn.value = false;
  index = 0;

  if (timer) {
    clearTimeout(timer);
    timer = null;
  }

  // 关闭时恢复页面滚动

  // 恢复页面滚动
  document.body.style.overflow = prevBodyOverflow || "";
};

// 组件卸载时清理
onUnmounted(() => {
  if (timer) {
    clearTimeout(timer);
  }
  // 恢复滚动并清理 resize 监听
  document.body.style.overflow = prevBodyOverflow || "";
  if (resizeHandler) window.removeEventListener("resize", resizeHandler);
});

// 对外暴露方法
defineExpose({
  startBarrage,
});
</script>

<style scoped>
.love-item {
  width: clamp(120px, 28vw, 200px);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: clamp(12px, 3.5vw, 16px);
  font-weight: 500;
  white-space: nowrap;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  animation: fadeIn 0.5s ease-in-out;
  padding: 8px 10px;
  touch-action: manipulation;
}
.Love {
  z-index: 100000;
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
}
/* 弹幕进入动画 */
.barrage-enter-active {
  animation: barrageIn 0.5s ease-out;
}

@keyframes barrageIn {
  from {
    opacity: 0;
    transform: scale(0.5) rotate(-10deg);
  }
  to {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}

/* 整体淡入淡出 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 按钮缩放动画 */
.scale-enter-active {
  animation: scaleIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* 脉动效果 */
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* 弹跳效果 */
@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-bounce {
  animation: bounce 1s infinite;
}
.text-center {
  z-index: 10002;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
}

@media (max-width: 640px) {
  .love-item {
    width: 70vw;
    font-size: 16px;
    padding: 12px 14px;
  }

  .text-center {
    padding: 0 20px;
  }

  .text-center button {
    padding: 16px 28px !important;
    font-size: 18px !important;
  }
}
</style>
