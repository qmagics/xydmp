import router from './router'
import getPageTitle from './utils/getPageTitle'
import { RouteLocationNormalized } from 'vue-router'
import { getToken } from './utils/auth'
// import NProgress from 'nprogress'
// import 'nprogress/nprogress.css'
import { store } from './store'

// NProgress.configure({
//     showSpinner: false,
// })

const whiteList: string[] = ['/login', '/', '/404', '/overview', '/projects', '/dispatch'];

// 转场动画
router.beforeEach((to, from, next) => {
    const toDepth = to.params.routeMode;
    if (toDepth === "push") {
        to.meta.transitionName = "slide-left";
    } else if (toDepth === "pop") {
        to.meta.transitionName = "slide-right";
    }
    next();
    return true;
});

router.beforeEach(async (to: RouteLocationNormalized & { meta: any }, from: any, next: Function) => {
    // 转场动画
    const toDepth = to.params.routeMode;
    if (toDepth === "push") {
        to.meta.transitionName = "slide-left";
    } else if (toDepth === "pop") {
        to.meta.transitionName = "slide-right";
    }

    // start progress bar
    // NProgress.start();

    // set the page title
    document.title = getPageTitle(to.meta.title)

    // user token
    let token = getToken();

    // mock
    // token = "aa";

    // has token
    if (token) {
        if (to.path === '/login') {
            next({ path: '/' })
        }
        else {

            // 获取用户信息
            if (!store.state.User) {
                store.dispatch("getUserInfo");
            }

            // judge if user has permission
            const authed = true;

            // has permission
            if (authed) {
                next();
            }
            // has no permission
            else {
                // try to get auth

                // succeed
                try {
                    // ...

                    next({ ...to, replace: true })
                }

                // failed
                catch (error) {
                    // remove token
                    // ...

                    // go to login page to re-login
                    next(`/login?redirect=${to.path}`)
                    // NProgress.done()
                }

                // 跳转
                next({ ...to, replace: true })
            }
        }
    }

    // has no token
    else {

        // to.path in whiteList
        if (whiteList.includes(to.path)) {
            next()
        }

        // to.path not in whiteList
        else {
            next(`/login?redirect=${to.path}`)
            // NProgress.done()
        }
    }
})

// router.afterEach(() => {
//     NProgress.done();
// })