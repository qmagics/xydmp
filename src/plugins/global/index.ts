import { App, Plugin } from 'vue';
import { time, date } from '@/filters/index';
import drag from "@/directives/drag";
import initSize from "@/directives/initSize";
import SvgIcon from '@/components/base/SvgIcon/index.vue';
import YwIcon from '@/components/base/YwIcon';
import AppPanel from '@/components/AppPanel/index.vue';
import AppTitleLine from '@/components/AppTitleLine/index.vue';
import AppTitleBox from '@/components/AppTitleBox/index.vue';
import AppChartBox from '@/components/AppChartBox/index.vue';
import AppSwitchs from '@/components/AppSwitchs/index.vue';
import AppCornerbox from '@/components/AppCornerbox/index.vue';
import AppSpeedDashboard from '@/components/AppSpeedDashboard/index.vue';
import AppLv from '@/components/AppLv/index.vue';

const p: Plugin = {
    install(app: App) {

        // components
        app.component(SvgIcon.name, SvgIcon)
        app.component(YwIcon.name, YwIcon)
        app.component(AppPanel.name, AppPanel)
        app.component(AppTitleLine.name, AppTitleLine)
        app.component(AppTitleBox.name, AppTitleBox)
        app.component(AppChartBox.name, AppChartBox)
        app.component(AppSwitchs.name, AppSwitchs)
        app.component(AppCornerbox.name, AppCornerbox)
        app.component(AppSpeedDashboard.name, AppSpeedDashboard)
        app.component(AppLv.name, AppLv)

        // directives
        app.directive("drag", drag);
        app.directive("initSize", initSize);

        // filters
        app.config.globalProperties.$filters = {
            time,
            date
        }
    }
}

export default p;