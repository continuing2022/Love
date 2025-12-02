<template>
  <div v-if="!isLoggedIn" class="login-container">
    <!-- 背景装饰 -->
    <div class="bg-decoration">
      <div class="floating-heart" style="left: 10%; animation-delay: 0s">
        💕
      </div>
      <div class="floating-heart" style="left: 20%; animation-delay: 2s">
        💖
      </div>
      <div class="floating-heart" style="left: 80%; animation-delay: 1s">
        💗
      </div>
      <div class="floating-heart" style="left: 90%; animation-delay: 3s">
        💝
      </div>
    </div>

    <div class="login-box">
      <div class="login-header">
        <div class="title-decoration">✨</div>
        <h1 class="login-title">送给宝宝酱的网站</h1>
        <div class="title-decoration">✨</div>
      </div>

      <p class="login-subtitle">记录我们的每一个甜蜜瞬间</p>

      <form
        @submit.prevent="handleLogin"
        :class="['login-form', shake ? 'shake' : '']"
      >
        <div class="input-group">
          <div class="input-icon">👤</div>
          <input
            type="text"
            placeholder="请输入账号"
            v-model="username"
            class="login-input"
            autocomplete="off"
          />
        </div>

        <div class="input-group">
          <div class="input-icon">🔒</div>
          <input
            type="password"
            placeholder="请输入密码"
            v-model="password"
            class="login-input"
            autocomplete="off"
          />
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <button type="submit" class="login-button">
          <span>进入我们的小世界</span>
          <span class="button-icon">💝</span>
        </button>
      </form>

      <div class="login-footer">
        <p class="hint-text">💌 专属于我们的甜蜜回忆</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// 状态定义（从localStorage初始化，实现刷新不丢失）
const username = ref("");
const password = ref("");
const error = ref("");
const shake = ref(false);
const isLoggedIn = ref(localStorage.getItem("isLoggedIn") === "true");

// 写死的账号密码
const CORRECT_USERNAME = "111";
const CORRECT_PASSWORD = "111";

// 组件挂载时：如果已登录，直接跳转到主页
onMounted(() => {
  if (isLoggedIn.value) {
    router.push("/home");
  }
});

// 登录处理函数
const handleLogin = () => {
  if (
    username.value === CORRECT_USERNAME &&
    password.value === CORRECT_PASSWORD
  ) {
    error.value = "";
    isLoggedIn.value = true;

    // 关键：将登录状态存入localStorage（持久化）
    localStorage.setItem("isLoggedIn", "true");

    // 登录成功提示 + 跳转到主页
    setTimeout(() => {
      router.push("/home"); // 跳转到主页，不会触发无限重定向
    }, 500);
  } else {
    error.value = "账号或密码错误哦 🥺";
    shake.value = true;

    // 500ms后取消抖动效果
    setTimeout(() => {
      shake.value = false;
    }, 500);
  }
};
</script>

<style scoped>
/* 样式保持不变，和之前提供的一致 */
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ffb3d9 0%, #ff85c1 50%, #ffa6d5 100%);
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.bg-decoration {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.floating-heart {
  position: absolute;
  font-size: 30px;
  animation: floatUp 6s ease-in-out infinite;
  opacity: 0.6;
}

@keyframes floatUp {
  0% {
    transform: translateY(100vh) rotate(0deg);
    opacity: 0;
  }
  50% {
    opacity: 0.6;
  }
  100% {
    transform: translateY(-100px) rotate(360deg);
    opacity: 0;
  }
}

.login-box {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 30px;
  padding: 50px 40px;
  box-shadow: 0 20px 60px rgba(255, 105, 180, 0.3),
    0 0 0 1px rgba(255, 182, 193, 0.2);
  max-width: 450px;
  width: 100%;
  position: relative;
  z-index: 1;
  animation: slideIn 0.6s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-header {
  text-align: center;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
}

.title-decoration {
  font-size: 28px;
  animation: twinkle 2s ease-in-out infinite;
}

@keyframes twinkle {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(0.8);
  }
}

.login-title {
  font-size: 32px;
  font-weight: bold;
  background: linear-gradient(135deg, #ff69b4 0%, #ff1493 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  letter-spacing: 1px;
}

.login-subtitle {
  text-align: center;
  color: #ff69b4;
  font-size: 16px;
  margin-bottom: 35px;
  font-weight: 500;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.shake {
  animation: shake 0.5s;
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-10px);
  }
  75% {
    transform: translateX(10px);
  }
}

.input-group {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 20px;
  font-size: 20px;
  z-index: 1;
  pointer-events: none;
}

.login-input {
  width: 100%;
  padding: 16px 20px 16px 55px;
  border: 2px solid #ffc4dd;
  border-radius: 15px;
  font-size: 16px;
  transition: all 0.3s ease;
  background: #fff;
  color: #ff69b4;
  font-weight: 500;
}

.login-input::placeholder {
  color: #ffb3d9;
}

.login-input:focus {
  outline: none;
  border-color: #ff69b4;
  box-shadow: 0 0 0 4px rgba(255, 105, 180, 0.1);
  transform: translateY(-2px);
}

.error-message {
  background: linear-gradient(135deg, #ffe5ec 0%, #ffd4e5 100%);
  color: #ff1493;
  padding: 12px 20px;
  border-radius: 12px;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  border: 2px solid #ffb3d9;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-button {
  background: linear-gradient(135deg, #ff69b4 0%, #ff1493 100%);
  color: white;
  border: none;
  padding: 16px 30px;
  border-radius: 15px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 105, 180, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
}

.login-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 25px rgba(255, 105, 180, 0.5);
}

.login-button:active {
  transform: translateY(-1px);
}

.button-icon {
  font-size: 20px;
  animation: heartbeat 1.5s ease-in-out infinite;
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

.login-footer {
  margin-top: 30px;
  text-align: center;
}

.hint-text {
  color: #ffb3d9;
  font-size: 14px;
  margin: 0;
}

@media (max-width: 480px) {
  .login-box {
    padding: 40px 30px;
  }

  .login-title {
    font-size: 26px;
  }

  .login-subtitle {
    font-size: 14px;
  }
}
</style>
