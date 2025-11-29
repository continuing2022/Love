<template>
  <div class="home">
    <!-- 欢迎屏幕 -->
    <div v-if="showWelcome" class="welcome-screen">
      <div class="welcome-content">
        <div class="love-letter">
          <div class="letter-header">致我最爱的人</div>
          <div class="letter-body">
            <p class="letter-line">当我遇见你的那一刻</p>
            <p class="letter-line">世界突然变得色彩斑斓</p>
            <p class="letter-line">每一天都是新的开始</p>
            <p class="letter-line">每一刻都值得珍藏</p>
          </div>
          <div class="letter-signature">永远爱你的 {{ yourName }}</div>
        </div>
        <button class="enter-button" @click="enterSite">
          <span class="button-text">开启我们的回忆</span>
          <span class="button-icon">❤️</span>
        </button>
      </div>
      <div class="floating-hearts">
        <div
          v-for="i in 15"
          :key="i"
          class="floating-heart"
          :style="getHeartStyle(i)"
        >
          ♥
        </div>
      </div>
    </div>
    <!-- 主导航页面 -->
    <div v-if="!showWelcome" class="main-nav">
      <div class="nav-header">
        <h1 class="site-title">我们的小世界</h1>
        <p class="site-subtitle">记录每一个温暖的瞬间</p>
      </div>

      <div class="nav-grid">
        <!-- 时间轴卡片 -->
        <div class="nav-card timeline-card" @click="goToTimeline">
          <div class="card-icon">📅</div>
          <h3 class="card-title">时光之旅</h3>
          <p class="card-desc">回顾我们的每一个重要时刻</p>
          <div class="card-hover-effect"></div>
        </div>

        <!-- 照片墙卡片 -->
        <div class="nav-card gallery-card" @click="showComingSoon('照片墙')">
          <div class="card-icon">📸</div>
          <h3 class="card-title">回忆相册</h3>
          <p class="card-desc">珍藏我们的美好瞬间</p>
          <div class="card-hover-effect"></div>
        </div>

        <!-- 爱的理由卡片 -->
        <div class="nav-card reasons-card" @click="showReasonLove">
          <div class="card-icon">💕</div>
          <h3 class="card-title">爱的理由</h3>
          <p class="card-desc">100个爱你的理由</p>
          <div class="card-hover-effect"></div>
        </div>

        <!-- 留言板卡片 -->
        <div class="nav-card message-card" @click="showComingSoon('留言板')">
          <div class="card-icon">💌</div>
          <h3 class="card-title">情话留言</h3>
          <p class="card-desc">写下想对你说的话</p>
          <div class="card-hover-effect"></div>
        </div>

        <!-- 未来计划卡片 -->
        <div class="nav-card future-card" @click="showComingSoon('未来计划')">
          <div class="card-icon">🌟</div>
          <h3 class="card-title">未来憧憬</h3>
          <p class="card-desc">我们想一起做的事</p>
          <div class="card-hover-effect"></div>
        </div>

        <!-- 音乐盒卡片 -->
        <div class="nav-card music-card" @click="showComingSoon('音乐盒')">
          <div class="card-icon">🎵</div>
          <h3 class="card-title">爱的旋律</h3>
          <p class="card-desc">属于我们的歌单</p>
          <div class="card-hover-effect"></div>
        </div>
      </div>

      <div class="love-counter">
        <div class="counter-label">我们在一起已经</div>
        <div class="counter-value">{{ daysCount }}</div>
        <div class="counter-unit">天</div>
      </div>
    </div>

    <!-- 即将推出提示 -->
    <div v-if="showComingSoonModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-icon">🚀</div>
        <h3 class="modal-title">{{ comingSoonFeature }}</h3>
        <p class="modal-text">这个功能正在用心准备中...</p>
        <p class="modal-subtext">敬请期待更多惊喜 ✨</p>
        <button class="modal-button" @click="closeModal">好的</button>
      </div>
    </div>
    <ReasonLove ref="loveRef" />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import ReasonLove from "./ReasonLove.vue";
const router = useRouter(); //路由
const loveRef = ref(null);

const yourName = ref("小明"); // 修改为你的名字
const startDate = new Date("2024-01-01"); // 修改为你们在一起的日期

const showWelcome = ref(true);
const showComingSoonModal = ref(false);
const comingSoonFeature = ref("");

// 计算在一起的天数
const daysCount = computed(() => {
  const today = new Date();
  const diffTime = Math.abs(today - startDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// 进入网站
const enterSite = () => {
  showWelcome.value = false;
};

// 前往时间轴
const goToTimeline = () => {
  // 路由跳转到时间轴页面
  router.push({ name: "Timeline" });
};

// 显示即将推出
const showComingSoon = (feature) => {
  comingSoonFeature.value = feature;
  showComingSoonModal.value = true;
};

const showReasonLove = () => {
  loveRef.value.startBarrage();
};
// 关闭模态框
const closeModal = () => {
  showComingSoonModal.value = false;
};

// 生成随机的心形样式
const getHeartStyle = (index) => {
  return {
    left: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 5}s`,
    animationDuration: `${8 + Math.random() * 4}s`,
    fontSize: `${20 + Math.random() * 20}px`,
    opacity: 0.3 + Math.random() * 0.4,
  };
};
</script>

<style scoped>
.home {
  min-height: 100vh;
  background: #000;
  color: #fff;
  font-family: "Microsoft YaHei", "PingFang SC", Arial, sans-serif;
}

/* 欢迎屏幕 */
.welcome-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  overflow: hidden;
}

.welcome-content {
  text-align: center;
  z-index: 2;
  animation: fadeInUp 1s ease;
}

.love-letter {
  background: rgba(255, 255, 255, 0.95);
  padding: 50px 60px;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 500px;
  margin: 0 auto 40px;
  animation: letterOpen 1s ease;
}

.letter-header {
  font-size: 28px;
  font-weight: bold;
  color: #764ba2;
  margin-bottom: 30px;
  border-bottom: 2px solid #764ba2;
  padding-bottom: 15px;
}

.letter-body {
  margin: 30px 0;
}

.letter-line {
  font-size: 18px;
  color: #333;
  margin: 15px 0;
  line-height: 1.8;
  animation: fadeIn 1s ease;
  animation-fill-mode: backwards;
}

.letter-line:nth-child(1) {
  animation-delay: 0.5s;
}
.letter-line:nth-child(2) {
  animation-delay: 0.8s;
}
.letter-line:nth-child(3) {
  animation-delay: 1.1s;
}
.letter-line:nth-child(4) {
  animation-delay: 1.4s;
}

.letter-signature {
  font-size: 20px;
  color: #764ba2;
  font-style: italic;
  margin-top: 30px;
  text-align: right;
}

.enter-button {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border: none;
  padding: 18px 50px;
  font-size: 20px;
  color: white;
  border-radius: 50px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0 auto;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(245, 87, 108, 0.4);
  animation: pulse 2s ease infinite;
}

.enter-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(245, 87, 108, 0.6);
}

.button-icon {
  font-size: 24px;
  animation: heartbeat 1.5s ease infinite;
}

.floating-hearts {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.floating-heart {
  position: absolute;
  color: rgba(255, 255, 255, 0.6);
  animation: floatUp 10s linear infinite;
}

@keyframes floatUp {
  0% {
    bottom: -10%;
    transform: translateX(0) rotate(0deg);
  }
  50% {
    transform: translateX(20px) rotate(180deg);
  }
  100% {
    bottom: 110%;
    transform: translateX(0) rotate(360deg);
  }
}

@keyframes letterOpen {
  0% {
    transform: scale(0.8) rotateX(-90deg);
    opacity: 0;
  }
  100% {
    transform: scale(1) rotateX(0deg);
    opacity: 1;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 主导航页面 */
.main-nav {
  min-height: 100vh;
  padding: 80px 20px;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
}

.nav-header {
  text-align: center;
  margin-bottom: 80px;
  animation: fadeInUp 1s ease;
}

.site-title {
  font-size: 56px;
  font-weight: bold;
  background: linear-gradient(135deg, #fff 0%, #ffd6e8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 20px;
}

.site-subtitle {
  font-size: 24px;
  color: rgba(255, 255, 255, 0.7);
  letter-spacing: 2px;
}

.nav-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.nav-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 40px 30px;
  text-align: center;
  cursor: pointer;
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;
  animation: fadeInUp 0.8s ease;
  animation-fill-mode: backwards;
}

.nav-card:nth-child(1) {
  animation-delay: 0.1s;
}
.nav-card:nth-child(2) {
  animation-delay: 0.2s;
}
.nav-card:nth-child(3) {
  animation-delay: 0.3s;
}
.nav-card:nth-child(4) {
  animation-delay: 0.4s;
}
.nav-card:nth-child(5) {
  animation-delay: 0.5s;
}
.nav-card:nth-child(6) {
  animation-delay: 0.6s;
}

.nav-card:hover {
  transform: translateY(-10px);
  border-color: rgba(255, 214, 232, 0.5);
  box-shadow: 0 20px 40px rgba(255, 214, 232, 0.3);
}

.card-hover-effect {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
  transition: left 0.5s ease;
}

.nav-card:hover .card-hover-effect {
  left: 100%;
}

.card-icon {
  font-size: 64px;
  margin-bottom: 20px;
  filter: drop-shadow(0 5px 15px rgba(255, 214, 232, 0.5));
}

.card-title {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #fff;
}

.card-desc {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
}

/* 爱的计数器 */
.love-counter {
  text-align: center;
  margin-top: 80px;
  padding: 40px;
  animation: fadeInUp 1s ease 0.8s backwards;
}

.counter-label {
  font-size: 20px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 20px;
}

.counter-value {
  font-size: 72px;
  font-weight: bold;
  background: linear-gradient(135deg, #ffd6e8 0%, #ffb6d9 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 10px;
  animation: countUp 2s ease;
}

.counter-unit {
  font-size: 32px;
  color: #ffd6e8;
}

@keyframes countUp {
  from {
    opacity: 0;
    transform: scale(0.5);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* 时间轴页面 */
.timeline-page {
  position: relative;
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

/* 模态框 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 50px 60px;
  border-radius: 20px;
  text-align: center;
  max-width: 400px;
  animation: scaleIn 0.3s ease;
}

.modal-icon {
  font-size: 72px;
  margin-bottom: 20px;
}

.modal-title {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 15px;
  color: white;
}

.modal-text {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 10px;
}

.modal-subtext {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 30px;
}

.modal-button {
  background: white;
  color: #764ba2;
  border: none;
  padding: 12px 40px;
  border-radius: 25px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.modal-button:hover {
  transform: scale(1.05);
  box-shadow: 0 5px 20px rgba(255, 255, 255, 0.3);
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes heartbeat {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}
</style>
