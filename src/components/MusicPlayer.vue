<template>
  <div v-if="music.state.visible" class="music-player" @click.stop>
    <div class="player-inner">
      <div class="left">
        <div class="icon">🎧</div>
        <div class="info">
          <div class="title">{{ music.state.title || "纯音乐（示例）" }}</div>
          <div class="src">{{ displaySrc }}</div>
        </div>
      </div>
      <div class="controls">
        <button class="btn" @click="music.toggle">
          {{ music.state.playing ? "▮▮" : "▶" }}
        </button>
        <button class="btn close" @click="close">✕</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useMusic } from "../composables/useMusic";

const music = useMusic();

const close = () => {
  music.pause();
  music.close();
};

const displaySrc = computed(() => {
  if (!music.state.src) return "";
  // show just filename for cleanliness
  try {
    const parts = music.state.src.split("/");
    return parts[parts.length - 1];
  } catch (e) {
    return music.state.src;
  }
});
</script>

<style scoped>
.music-player {
  position: fixed;
  top: 18px;
  right: 18px;
  z-index: 20000;
}
.player-inner {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.95);
  color: #ff2e8a;
  border-radius: 18px;
  padding: 10px 14px;
  box-shadow: 0 8px 30px rgba(255, 105, 180, 0.15);
  border: 2px solid rgba(255, 182, 193, 0.5);
  min-width: 220px;
}
.left {
  display: flex;
  align-items: center;
  gap: 10px;
}
.icon {
  font-size: 22px;
}
.info {
  display: flex;
  flex-direction: column;
  min-width: 120px;
}
.title {
  font-weight: 700;
  font-size: 14px;
}
.src {
  font-size: 12px;
  color: #ff69b4;
  opacity: 0.8;
}
.controls {
  display: flex;
  gap: 8px;
  align-items: center;
}
.btn {
  background: linear-gradient(135deg, #ff69b4, #ff1493);
  color: white;
  border: none;
  padding: 6px 10px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 700;
}
.btn.close {
  background: transparent;
  color: #ff69b4;
  border: 1px solid rgba(255, 182, 193, 0.6);
}
</style>
