<template>
  <div class="timeline-wrapper">
    <!-- 返回按钮 -->
    <div class="back-button" @click="onBack">← 返回</div>

    <!-- 开场动画 -->
    <div class="intro-screen">
      <div class="intro-text">我们的故事</div>
      <div class="intro-subtitle">从2024到现在 · 每一步都有你</div>
    </div>

    <!-- 进度条 -->
    <div class="progress-bar" :style="{ width: progress + '%' }"></div>

    <!-- 时间线 -->
    <div class="timeline-line"></div>

    <!-- 滚动提示 -->
    <div class="scroll-hint">↓ 向下滚动，开启我们的时光之旅 ↓</div>

    <!-- 时间轴容器 -->
    <div class="timeline-container" ref="containerRef">
      <div
        v-for="(item, index) in timelineData"
        :key="index"
        class="timeline-section"
        :class="{ active: activeIndex === index }"
        ref="sectionRefs"
      >
        <div
          class="background-image"
          :style="{ background: item.background }"
        ></div>
        <div class="section-overlay"></div>
        <div class="timeline-dot"></div>
        <div class="timeline-content">
          <div class="date">{{ item.date }}</div>
          <div class="title">{{ item.title }}</div>
          <div class="description">{{ item.description }}</div>
        </div>

        <!-- 爱心动画 -->
        <div
          v-for="heart in hearts.filter((h) => h.sectionIndex === index)"
          :key="heart.id"
          class="heart"
          :style="{
            left: heart.left,
            top: heart.top,
            animationDelay: heart.delay,
          }"
        >
          ♥
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import timelineDataRaw from "../data/timeline.json";
import { useRouter } from "vue-router";

const router = useRouter();
// 时间轴数据
const timelineData = ref(timelineDataRaw);

// 状态
const activeIndex = ref(-1);
const progress = ref(0);
const hearts = ref([]);
const containerRef = ref(null);
const sectionRefs = ref([]);

// 爱心相关
let heartId = 0;
let lastHeartTime = 0;

// 自动滚动相关
let autoScrollTimer = null;
let userInteractionTimer = null;
let isAutoScrolling = false;
const AUTO_SCROLL_DELAY = 3000;
const AUTO_SCROLL_SPEED = 0.5;

// 返回主页
const onBack = () => {
  router.push({ name: "Home", params: { show: false } });
};
// 创建爱心
const createHearts = (sectionIndex) => {
  const now = Date.now();
  if (now - lastHeartTime < 800) return;
  lastHeartTime = now;

  for (let i = 0; i < 3; i++) {
    setTimeout(() => {
      const heart = {
        id: heartId++,
        sectionIndex,
        left: 20 + Math.random() * 60 + "%",
        top: "70%",
        delay: Math.random() * 0.5 + "s",
      };
      hearts.value.push(heart);

      setTimeout(() => {
        const index = hearts.value.findIndex((h) => h.id === heart.id);
        if (index > -1) hearts.value.splice(index, 1);
      }, 3500);
    }, i * 200);
  }
};

// 自动滚动
const startAutoScroll = () => {
  if (autoScrollTimer) return;

  isAutoScrolling = true;
  autoScrollTimer = setInterval(() => {
    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight;

    if (window.scrollY >= maxScroll) {
      stopAutoScroll();
      return;
    }

    window.scrollBy({
      top: AUTO_SCROLL_SPEED,
      behavior: "auto",
    });
  }, 8);
};

const stopAutoScroll = () => {
  if (autoScrollTimer) clearInterval(autoScrollTimer);
  autoScrollTimer = null;
  isAutoScrolling = false;
};

// 重置交互倒计时
const resetUserInteraction = () => {
  stopAutoScroll();

  if (userInteractionTimer) clearTimeout(userInteractionTimer);

  userInteractionTimer = setTimeout(() => {
    startAutoScroll();
  }, AUTO_SCROLL_DELAY);
};

// 滚动处理
const handleScroll = () => {
  const scrollPos = window.scrollY + window.innerHeight / 2;
  const totalHeight =
    document.documentElement.scrollHeight - window.innerHeight;

  progress.value = (window.scrollY / totalHeight) * 100;

  sectionRefs.value.forEach((section, index) => {
    if (!section) return;
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;

    if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
      if (activeIndex.value !== index) {
        activeIndex.value = index;
        if (Math.random() > 0.7) createHearts(index);
      }
    }
  });

  if (!isAutoScrolling) resetUserInteraction();
};

// 用户交互检测
const handleUserInteraction = () => {
  resetUserInteraction();
};

onMounted(() => {
  nextTick(() => {
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("wheel", handleUserInteraction);
    window.addEventListener("touchstart", handleUserInteraction);
    window.addEventListener("keydown", handleUserInteraction);
    window.addEventListener("mousemove", handleUserInteraction);

    resetUserInteraction();
  });
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
  window.removeEventListener("wheel", handleUserInteraction);
  window.removeEventListener("touchstart", handleUserInteraction);
  window.removeEventListener("keydown", handleUserInteraction);
  window.removeEventListener("mousemove", handleUserInteraction);

  stopAutoScroll();
  if (userInteractionTimer) clearTimeout(userInteractionTimer);
});
</script>

<style scoped>
.timeline-wrapper {
  font-family: "Microsoft YaHei", "PingFang SC", Arial, sans-serif;
  overflow-x: hidden;
  background: #000;
  color: #fff;
  min-height: 100vh;
}

.timeline-container {
  position: relative;
  width: 100%;
}

.timeline-section {
  height: 100vh;
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  opacity: 0;
  transition: opacity 1.2s ease, transform 1.5s ease;
  transform: scale(1.15);
}

.timeline-section.active .background-image {
  opacity: 0.35;
  transform: scale(1);
}

.timeline-content {
  position: relative;
  z-index: 10;
  text-align: center;
  padding: 50px;
  max-width: 900px;
  opacity: 0;
  transform: translateY(60px);
  transition: all 1s ease;
  transition-delay: 0.3s;
}

.timeline-section.active .timeline-content {
  opacity: 1;
  transform: translateY(0);
}

.date {
  font-size: 28px;
  font-weight: 300;
  margin-bottom: 15px;
  color: rgba(255, 255, 255, 0.7);
  letter-spacing: 2px;
}

.title {
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 30px;
  background: linear-gradient(135deg, #fff 0%, #ffd6e8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.description {
  font-size: 22px;
  line-height: 2;
  color: rgba(255, 255, 255, 0.95);
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.8);
  max-width: 800px;
  margin: 0 auto;
}

.timeline-line {
  position: fixed;
  left: 50%;
  top: 0;
  width: 3px;
  height: 100vh;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(255, 214, 232, 0.3) 10%,
    rgba(255, 214, 232, 0.8) 50%,
    rgba(255, 214, 232, 0.3) 90%,
    transparent 100%
  );
  z-index: 5;
  transform: translateX(-50%);
}

.timeline-dot {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 16px;
  height: 16px;
  background: #fff;
  border: 4px solid #ffd6e8;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  z-index: 15;
  box-shadow: 0 0 15px rgba(255, 214, 232, 0.6);
  transition: all 0.4s ease;
}

.timeline-section.active .timeline-dot {
  width: 24px;
  height: 24px;
  background: #ffd6e8;
  box-shadow: 0 0 35px rgba(255, 214, 232, 1), 0 0 50px rgba(255, 182, 217, 0.5);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
  }
}

.scroll-hint {
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
  animation: bounce 2s infinite;
  font-size: 15px;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 1px;
}

@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateX(-50%) translateY(0);
  }
  40% {
    transform: translateX(-50%) translateY(-12px);
  }
  60% {
    transform: translateX(-50%) translateY(-6px);
  }
}

.heart {
  position: absolute;
  color: #ffd6e8;
  font-size: 24px;
  opacity: 0;
  animation: float 3.5s ease-in-out;
  pointer-events: none;
}

@keyframes float {
  0% {
    opacity: 1;
    transform: translateY(0) scale(0) rotate(0deg);
  }
  50% {
    opacity: 1;
    transform: translateY(-120px) scale(1.2) rotate(180deg);
  }
  100% {
    opacity: 0;
    transform: translateY(-250px) scale(0.3) rotate(360deg);
  }
}

.section-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(
    circle at center,
    transparent 0%,
    rgba(0, 0, 0, 0.4) 50%,
    rgba(0, 0, 0, 0.8) 100%
  );
  z-index: 8;
}

.progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, #ffd6e8, #ffb6d9, #ffd6e8);
  z-index: 100;
  transition: width 0.3s ease;
}

.intro-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeOut 1s ease 2s forwards;
}

@keyframes fadeOut {
  to {
    opacity: 0;
    visibility: hidden;
  }
}

.intro-text {
  font-size: 56px;
  font-weight: bold;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #fff 0%, #ffd6e8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: introSlide 1s ease;
}

.intro-subtitle {
  font-size: 24px;
  color: rgba(255, 255, 255, 0.9);
  animation: introSlide 1s ease 0.3s backwards;
}

@keyframes introSlide {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.back-button {
  position: fixed;
  top: 30px;
  left: 30px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 12px 24px;
  border-radius: 25px;
  cursor: pointer;
  font-size: 16px;
  z-index: 1000;
  transition: all 0.3s ease;
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateX(-5px);
}
</style>
