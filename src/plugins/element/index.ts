import { App, Plugin } from 'vue';
import ElementPlus from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import './index.css';
import './var.scss';
import './reset.scss';

const p: Plugin = {
    install(app: App) {
        app.use(ElementPlus, {
            // componentPrefix: 'arco'
            locale: zhCn
        });
    }
}

export default p;