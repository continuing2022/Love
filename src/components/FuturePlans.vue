<template>
  <div class="wishlist-container">
    <button class="fp-back-button" @click="goBack">← 返回</button>
    <!-- 标题区域 -->
    <div class="wishlist-header">
      <h2 class="wishlist-title">未来憧憬 <span>我们想一起做的事</span></h2>
    </div>

    <!-- 新增事项表单 -->
    <div class="add-form">
      <input
        v-model="newItem"
        type="text"
        placeholder="添加我们想一起做的事..."
        class="add-input"
      />
      <button @click="addWishItem" class="add-btn">添加</button>
      <button @click="exportJSON" class="add-btn" style="background: #ffc0d9">
        导出 JSON
      </button>
    </div>

    <!-- 事项列表（分三列布局） -->
    <div class="wishlist-grid">
      <div
        class="wishlist-column"
        v-for="(column, idx) in columnedWishes"
        :key="idx"
      >
        <div
          class="wish-item"
          :class="{ completed: item.isDone }"
          v-for="item in column"
          :key="item.id"
        >
          <label class="item-checkbox">
            <input type="checkbox" v-model="item.isDone" />
            <span class="checkbox-icon">
              {{ item.isDone ? "✅" : "○" }}
            </span>
          </label>
          <span class="item-content">{{ item.content }}</span>
          <button class="delete-btn" @click="deleteWishItem(item.id)">
            删除
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import plansJson from "../data/plans.json";

// 使用 plans.json 作为初始数据；运行时的修改会保存到 localStorage
const STORAGE_KEY = "plansData";

const wishItems = ref([]);
const newItem = ref("");

// 初始化：优先使用 localStorage，其次使用导入的 plans.json
const loadInitial = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      wishItems.value = JSON.parse(saved);
      return;
    } catch (e) {
      console.warn("无法解析本地存储的计划数据，回退到 plans.json", e);
    }
  }
  // deep clone imported JSON to avoid accidental mutation of module value
  wishItems.value = JSON.parse(JSON.stringify(plansJson));
};

onMounted(loadInitial);

const router = useRouter();
const goBack = () => router.back();

// 分三列展示
const columnedWishes = computed(() => {
  const columns = [[], [], []];
  wishItems.value.forEach((item, idx) => columns[idx % 3].push(item));
  return columns;
});

// 新增/删除
const addWishItem = () => {
  if (!newItem.value.trim()) return;
  wishItems.value.push({
    id: Date.now(),
    content: newItem.value.trim(),
    isDone: false,
  });
  newItem.value = "";
};

const deleteWishItem = (id) => {
  wishItems.value = wishItems.value.filter((i) => i.id !== id);
};

// 持久化到 localStorage
watch(
  wishItems,
  (val) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(val));
  },
  { deep: true }
);

// 导出为 JSON 文件，方便手动同步回仓库
const exportJSON = () => {
  const dataStr = JSON.stringify(wishItems.value, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "plans.export.json";
  a.click();
  URL.revokeObjectURL(url);
};
</script>
<style scoped>
/* 全局容器 */
.wishlist-container {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
  font-family: "微软雅黑", sans-serif;
}

/* 标题区域 */
.wishlist-header {
  text-align: center;
  margin-bottom: 2rem;
}
.wishlist-title {
  font-size: 2rem;
  color: #ff69b4; /* 樱花粉主色 */
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}
.wishlist-title span {
  font-size: 1.2rem;
  color: #ff85c1;
}

/* 新增表单 */
.add-form {
  display: flex;
  gap: 0.5rem;
  max-width: 600px;
  margin: 0 auto 2rem;
}
.add-input {
  flex: 1;
  padding: 0.8rem 1rem;
  border: 2px solid #ffc4dd;
  border-radius: 15px;
  font-size: 1rem;
  color: #ff69b4;
}
.add-input::placeholder {
  color: #ffb3d9;
}
.add-btn {
  padding: 0.8rem 1.5rem;
  background: linear-gradient(135deg, #ff69b4 0%, #ff1493 100%);
  color: white;
  border: none;
  border-radius: 15px;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.2s;
}
.add-btn:hover {
  transform: translateY(-2px);
}

/* 列表网格（三列） */
.wishlist-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.wishlist-column {
  display: flex;
  flex-direction: column;
}

/* 事项项 */
.wish-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1rem 1.2rem;
  font-size: 1rem;
  background: linear-gradient(135deg, #fff0f6, #ffe5f0);
  border: 2px solid #ffc4dd;
  border-radius: 15px;
  margin-bottom: 0.8rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(255, 105, 180, 0.15);
}

.wish-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(255, 105, 180, 0.25);
}

/* 未完成事项 - 高亮显示 */
.wish-item:not(.completed) {
  background: linear-gradient(135deg, #ff69b4 0%, #ff1493 100%);
  border-color: #ff85c1;
  color: #fff;
  font-weight: 600;
}

.wish-item:not(.completed) .item-content {
  color: #fff;
}

.wish-item:not(.completed) .checkbox-icon {
  color: #fff;
  font-size: 1.4rem;
}

/* 已完成事项 - 置暗显示 */
.wish-item.completed {
  background: linear-gradient(135deg, #ffb3d9, #ffc4dd);
  border-color: rgba(255, 196, 221, 0.5);
  opacity: 0.6;
}

.wish-item.completed .item-content {
  color: #999;
}

.delete-btn {
  margin-left: auto;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #ffc4dd;
  color: #ff69b4;
  padding: 6px 12px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.wish-item:not(.completed) .delete-btn {
  background: rgba(255, 255, 255, 0.95);
  border-color: #fff;
  color: #ff69b4;
}

.wish-item.completed .delete-btn {
  background: rgba(255, 192, 217, 0.3);
  border-color: rgba(255, 196, 221, 0.6);
  color: #ccc;
}

.delete-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(255, 105, 180, 0.2);
}

/* 返回按钮样式 */
.fp-back-button {
  position: fixed;
  top: 18px;
  left: 18px;
  z-index: 2000;
  background: linear-gradient(135deg, #fff0f6, #ffc4dd);
  border: 1px solid #ffc4dd;
  color: #c81d66;
  padding: 8px 12px;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(255, 105, 180, 0.15);
  cursor: pointer;
}
.fp-back-button:hover {
  transform: translateY(-2px);
}

/* 复选框样式 */
.item-checkbox {
  display: flex;
  align-items: center;
  cursor: pointer;
}
.item-checkbox input {
  display: none; /* 隐藏原生复选框 */
}
.checkbox-icon {
  font-size: 1.3rem;
  color: #ff69b4;
  transition: transform 0.2s;
}

.wish-item:not(.completed) .checkbox-icon {
  color: #fff;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.item-checkbox:hover .checkbox-icon {
  transform: scale(1.2);
}

/* 响应式适配 */
@media (max-width: 768px) {
  .wishlist-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 480px) {
  .wishlist-grid {
    grid-template-columns: 1fr;
  }
  .add-form {
    flex-direction: column;
  }
}
</style>
