<template>
  <div class="home">
    <!-- 主导航页面 -->
    <div class="main-nav">
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

    <!-- 爱的理由组件 -->
    <ReasonLove ref="loveRef" />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import ReasonLove from "./ReasonLove.vue";

const router = useRouter();
const loveRef = ref(null);

const startDate = new Date("2024-01-01"); // 修改为你们在一起的日期

const showComingSoonModal = ref(false);
const comingSoonFeature = ref("");

// 计算在一起的天数
const daysCount = computed(() => {
  const today = new Date();
  const diffTime = Math.abs(today - startDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// 前往时间轴
const goToTimeline = () => {
  router.push({ name: "Timeline" });
};

// 显示即将推出
const showComingSoon = (feature) => {
  comingSoonFeature.value = feature;
  showComingSoonModal.value = true;
};

// 显示爱的理由弹幕
const showReasonLove = () => {
  // 直接调用子组件的方法
  loveRef.value?.startBarrage();
};

// 关闭模态框
const closeModal = () => {
  showComingSoonModal.value = false;
};
</script>

<style scoped>
.home {
  min-height: 100vh;
  background: linear-gradient(135deg, #ffb3d9 0%, #ff85c1 50%, #ffa6d5 100%);
  color: #fff;
  font-family: "Microsoft YaHei", "PingFang SC", Arial, sans-serif;
  position: relative;
  overflow: hidden;
}

/* 添加可爱的背景装饰 */
.home::before {
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
}

@keyframes float {
  from {
    transform: translate(0, 0);
  }
  to {
    transform: translate(-50px, -50px);
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
  padding: 60px 20px 80px;
  position: relative;
  z-index: 1;
}

.nav-header {
  text-align: center;
  margin-bottom: 60px;
  animation: fadeInUp 1s ease;
}

.site-title {
  font-size: 56px;
  font-weight: bold;
  color: #fff;
  text-shadow: 0 2px 10px rgba(255, 182, 193, 0.5),
    0 0 30px rgba(255, 182, 193, 0.3);
  margin-bottom: 15px;
  letter-spacing: 2px;
}

.site-subtitle {
  font-size: 22px;
  color: rgba(255, 255, 255, 0.95);
  letter-spacing: 3px;
  text-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.nav-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.nav-card {
  background: rgba(255, 255, 255, 0.95);
  border: 3px solid transparent;
  border-radius: 25px;
  padding: 45px 30px;
  text-align: center;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  animation: fadeInUp 0.8s ease;
  animation-fill-mode: backwards;
  box-shadow: 0 8px 25px rgba(255, 105, 180, 0.15),
    0 0 0 1px rgba(255, 182, 193, 0.1);
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
  transform: translateY(-12px) scale(1.02);
  border-color: #ffb3d9;
  background: #fff;
  box-shadow: 0 20px 50px rgba(255, 105, 180, 0.35),
    0 0 0 3px rgba(255, 182, 193, 0.5);
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
    rgba(255, 182, 193, 0.2),
    transparent
  );
  transition: left 0.6s ease;
}

.nav-card:hover .card-hover-effect {
  left: 100%;
}

.card-icon {
  font-size: 72px;
  margin-bottom: 20px;
  filter: drop-shadow(0 4px 12px rgba(255, 105, 180, 0.3));
  transition: transform 0.3s ease;
}

.nav-card:hover .card-icon {
  transform: scale(1.15) rotate(5deg);
  animation: bounce 0.6s ease;
}

@keyframes bounce {
  0%,
  100% {
    transform: scale(1.15) rotate(5deg) translateY(0);
  }
  50% {
    transform: scale(1.15) rotate(5deg) translateY(-10px);
  }
}

.card-title {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 12px;
  background: linear-gradient(135deg, #ff69b4 0%, #ff1493 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transition: all 0.3s ease;
}

.nav-card:hover .card-title {
  transform: scale(1.05);
}

.card-desc {
  font-size: 16px;
  color: #ff69b4;
  line-height: 1.6;
  font-weight: 500;
}

/* 爱的计数器 */
.love-counter {
  text-align: center;
  margin-top: 70px;
  padding: 50px 40px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 30px;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  border: 2px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(255, 105, 180, 0.2);
  animation: fadeInUp 1s ease 0.8s backwards;
}

.counter-label {
  font-size: 22px;
  color: #fff;
  margin-bottom: 20px;
  font-weight: 500;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.counter-value {
  font-size: 80px;
  font-weight: bold;
  color: #fff;
  text-shadow: 0 4px 15px rgba(255, 105, 180, 0.5),
    0 0 40px rgba(255, 182, 193, 0.4);
  margin-bottom: 10px;
  animation: countUp 2s ease, pulse 2s ease infinite;
}

.counter-unit {
  font-size: 32px;
  color: #fff;
  font-weight: 600;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
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

/* 模态框 */
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

.modal-content {
  background: linear-gradient(135deg, #fff 0%, #ffeff5 100%);
  padding: 50px 60px;
  border-radius: 30px;
  text-align: center;
  max-width: 420px;
  border: 3px solid #ffb3d9;
  box-shadow: 0 20px 60px rgba(255, 105, 180, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  animation: scaleIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.modal-icon {
  font-size: 80px;
  margin-bottom: 25px;
  animation: bounce 1s ease infinite;
}

.modal-title {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 15px;
  background: linear-gradient(135deg, #ff69b4 0%, #ff1493 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.modal-text {
  font-size: 18px;
  color: #ff69b4;
  margin-bottom: 8px;
  font-weight: 500;
}

.modal-subtext {
  font-size: 16px;
  color: #ffb3d9;
  margin-bottom: 35px;
}

.modal-button {
  background: linear-gradient(135deg, #ff69b4 0%, #ff1493 100%);
  color: white;
  border: none;
  padding: 14px 50px;
  border-radius: 25px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 105, 180, 0.4);
}

.modal-button:hover {
  transform: scale(1.08);
  box-shadow: 0 6px 25px rgba(255, 105, 180, 0.5);
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

/* 响应式设计 */
@media (max-width: 768px) {
  .site-title {
    font-size: 42px;
  }

  .site-subtitle {
    font-size: 18px;
  }

  .nav-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .counter-value {
    font-size: 60px;
  }
}
</style>
