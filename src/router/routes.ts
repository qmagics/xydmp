import { RouteRecordRaw } from 'vue-router';

const constantRoutes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'Index',
        component: () => import("@/views/Index.vue"),
        redirect: "overview",
        children: [
            // biz pages
            {
                path: '/overview',
                name: 'Overview',
                component: () => import('@/views/biz/Overview/index.vue')
            },
            {
                path: '/projects',
                name: 'Projects',
                component: () => import('@/views/biz/Projects/index.vue')
            },
            {
                path: '/dispatch',
                name: 'Dispatch',
                component: () => import('@/views/biz/Dispatch/index.vue')
            },
        ]
    },


    // login page
    {
        path: '/login',
        component: () => import('@/views/common/login/index.vue')
    },

    // 404 page
    {
        path: '/404',
        component: () => import('@/views/common/error-page/404.vue'),
    },

    // 401 page
    {
        path: '/401',
        component: () => import('@/views/common/error-page/401.vue'),
    },

    // *
    {
        path: "/:pathMatch(.*)*",
        redirect: '/404',
    }
]

export default constantRoutes;