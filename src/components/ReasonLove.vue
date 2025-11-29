<template>
  <div
    class="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center p-4"
  >
    <!-- 弹幕层 -->
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50"
    >
      <!-- 弹幕内容 -->
      <div
        v-for="msg in messages"
        :key="msg.id"
        class="absolute px-4 py-2 rounded-lg shadow-lg text-sm font-medium whitespace-nowrap animate-fade-in"
        :style="{
          top: msg.position.top + '%',
          left: msg.position.left + '%',
          backgroundColor: msg.color,
          color: '#fff',
          textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
          animation: 'fadeIn 0.5s ease-in-out',
        }"
      >
        {{ msg.text }}
      </div>

      <!-- 结束提示 -->
      <div
        v-if="showCloseBtn"
        class="fixed inset-0 flex items-center justify-center z-60"
      >
        <div class="text-center animate-bounce">
          <div class="text-white text-2xl font-bold mb-4">
            ❤️ 这就是我爱你的100个理由 ❤️
          </div>
          <button
            @click="closeBarrage"
            class="px-8 py-4 bg-white text-pink-600 text-xl font-bold rounded-full shadow-2xl hover:bg-pink-50 transform hover:scale-110 transition-all duration-300"
          >
            收下这份爱 💝
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from "vue";
import reasons from "../data/reasons.json";
import colors from "../data/colors.json";
// import { useRouter } from "vue-router";

// const router = useRouter();
const isOpen = ref(false);
const messages = ref([]);
const showCloseBtn = ref(false);

let index = 0;
let timer = null;

const getRandomPos = () => ({
  top: Math.random() * 70 + 5,
  left: Math.random() * 80 + 5,
});

// 启动
const startBarrage = () => {
  isOpen.value = true;
  messages.value = [];
  showCloseBtn.value = false;
  index = 0;

  let delay = 800;
  const minDelay = 100;
  const maxDelay = 800;
  const speedUpPoint = 30;
  const slowDownPoint = 70;

  const addMessage = () => {
    if (index < reasons.length) {
      messages.value.push({
        id: Date.now() + Math.random(),
        text: reasons[index],
        color: colors[Math.floor(Math.random() * colors.length)],
        position: getRandomPos(),
      });

      index++;

      // 动态速度
      if (index <= speedUpPoint) {
        delay = maxDelay - ((maxDelay - minDelay) / speedUpPoint) * index;
      } else if (index <= slowDownPoint) {
        delay = minDelay;
      } else {
        const slowProgress =
          (index - slowDownPoint) / (reasons.length - slowDownPoint);
        delay = minDelay + (maxDelay - minDelay) * slowProgress;
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
  // router.push({ name: "Home" });
  clearTimeout(timer);
};

onUnmounted(() => clearTimeout(timer));

// 对外暴露方法（必须在 startBarrage 定义之后）
defineExpose({
  startBarrage,
});
</script>

<style>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
