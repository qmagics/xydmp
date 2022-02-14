import { createRouter, createWebHashHistory } from 'vue-router'
import routes from './routes';

const router = createRouter({
    history: createWebHashHistory(),
    routes,
    // scrollBehavior
})

export default router;