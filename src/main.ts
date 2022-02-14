import './global';
import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import { store, key } from '@/store'
import modal from '@/plugins/modal';
import element from '@/plugins/element';
import global from '@/plugins/global';
import './styles/index.scss';
// import "//at.alicdn.com/t/font_2903226_jgu9pctx9xi.js";
import '@/styles/iconfont/iconfont';

// 隐藏三维
if (process.env.NODE_ENV === 'development') {
    // import('@/mocks');
    // const style = document.createElement("style");
    // style.innerHTML = `.cesium-widget canvas {display:none}`;
    // document.head.appendChild(style);
}

const app = createApp(App);

app.use(global)
app.use(store, key)
app.use(element)
app.use(modal, { store })
app.use(router)

import './permission';

app.mount('#app');

declare var window: any;
window.app = app;