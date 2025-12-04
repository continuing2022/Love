<template>
  <div>
    <router-view />
    <MusicPlayer />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import MusicPlayer from "./components/MusicPlayer.vue";
</script>

<style>
* {
  margin: 0px;
  padding: 0px;
  box-sizing: border-box;
}
</style>
