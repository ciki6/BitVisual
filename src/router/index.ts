import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const pages = import.meta.glob('../pages/**/*.vue');

const routes: RouteRecordRaw[] = Object.keys(pages).map((filePath) => {
  const path = filePath
    .replace('../pages', '')
    .replace(/\.vue$/, '')
    .replace(/\/index$/, '/')
    .replace(/\/\[/, '/:')
    .replace(/\]/, '');

  return {
    path: path === '' ? '/' : path,
    component: pages[filePath], 
  };
});

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
