import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("../components/Home.vue"),
  },
  {
    path: "/home",
    redirect: "/", // /home 重定向到 /，实现两者等效
  },
  {
    path: "/timeline",
    name: "Timeline",
    component: () => import("../components/Timeline.vue"),
  },
  {
    path: "/Login",
    name: "Login",
    component: () => import("../components/Login.vue"),
  },
  {
    path: "/futurePlan",
    name: "FuturePlan",
    component: () => import("../components/FuturePlans.vue"),
  },
  {
    path: "/loveMessages",
    name: "LoveMessages",
    component: () => import("../components/LoveMessages.vue"),
  },
  // no-op
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});
// 全局前置守卫：除登录页外所有页面需登录
router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const publicPages = ["Login"]; // 可在此扩展更多公开页

  if (!isLoggedIn && !publicPages.includes(to.name)) {
    // 未登录访问非公开页 -> 跳转到登录页
    next({ name: "Login" });
  } else {
    next();
  }
});

export default router;
