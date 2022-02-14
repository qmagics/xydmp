import { App, Plugin } from 'vue';
import ArcoVue from '@arco-design/web-vue';
import '@arco-design/web-vue/dist/arco.css';

const p: Plugin = {
    install(app: App) {
        app.use(ArcoVue, {
            // 用于改变使用组件时的前缀名称
            // componentPrefix: 'arco'
        });
    }
}

export default p;