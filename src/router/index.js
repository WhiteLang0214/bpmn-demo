import { createRouter, createWebHashHistory } from 'vue-router';

const Layout = import(/* webpackChunkName: "views" */ '../views/layout.vue');
const Home = import(/* webpackChunkName: "views" */ '../views/home.vue');
const About = import(/* webpackChunkName: "views" */ '../views/About/index.vue');
const Process = import(/* webpackChunkName: "views" */ '../views/process/process.vue');

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      redirect: "/home",
      component: Layout,
      children: [
        {
          path: "/home",
          component: Home
        },
        {
          path: "/process",
          component: Process
        },
        {
          path: "/about",
          component: About
        }
      ]
    }
  ],
  // 是否应该禁止尾部斜杠。默认为假
  strict: false,
  // 页面滚动到顶部
  scrollBehavior: () => ({ left: 0, top: 0 }),
})
export default router;