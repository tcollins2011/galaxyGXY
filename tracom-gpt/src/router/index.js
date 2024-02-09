import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/home.vue'; // Import your component

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  // Add more routes here
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
