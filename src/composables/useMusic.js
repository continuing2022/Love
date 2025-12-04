import { ref, reactive } from "vue";

const visible = ref(false);
const playing = ref(false);
const title = ref("");
const src = ref("");

let audio = null;

function ensureAudio() {
  if (!audio) {
    audio = new Audio();
    audio.loop = true;
    audio.addEventListener("play", () => (playing.value = true));
    audio.addEventListener("pause", () => (playing.value = false));
    audio.addEventListener("ended", () => (playing.value = false));
  }
}

export function useMusic() {
  const open = ({ trackSrc = "", trackTitle = "" } = {}) => {
    ensureAudio();
    if (trackSrc) {
      if (src.value !== trackSrc) {
        src.value = trackSrc;
        audio.src = trackSrc;
      }
    }
    if (trackTitle) title.value = trackTitle;
    visible.value = true;
  };

  const close = () => {
    visible.value = false;
  };

  const play = async () => {
    ensureAudio();
    try {
      await audio.play();
      playing.value = true;
    } catch (e) {
      // play might be blocked by browser autoplay policy; user interaction required
      playing.value = false;
    }
  };

  const pause = () => {
    if (audio) audio.pause();
  };

  const toggle = async () => {
    if (playing.value) pause();
    else await play();
  };

  const setTrack = ({ trackSrc = "", trackTitle = "" } = {}) => {
    ensureAudio();
    if (trackSrc) {
      src.value = trackSrc;
      audio.src = trackSrc;
    }
    if (trackTitle) title.value = trackTitle;
  };

  const state = reactive({ visible, playing, title, src });

  // 音频使用全局单例，不在组件卸载时自动销毁，确保路由切换时继续播放。

  return {
    state,
    open,
    close,
    play,
    pause,
    toggle,
    setTrack,
  };
}
