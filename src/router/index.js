import { createRouter, createWebHistory } from "vue-router";


// 路由信息
let routes = [
  {
    path: "/welcome-page",
    name: 'welcome-page',
    component: () => import("../module/welcome-page.vue"),
  },
  {
    path: "/front-web",
    name: 'front-web',
    component: () => import("@/module/front-web.vue"),
  },
  {
    path: "/model-tab",
    name: 'model-tab',
    component: () => import("@/module/show-tab.vue"),
  }
];

// 路由器
const router = createRouter({
  history: createWebHistory(), // History模式
  routes,
});

export default router;

