import { useStore } from "@/store";
import { ActionType } from "@/store/ActionType";
import { computed, nextTick, ref } from "vue";

interface ToolItem {
    icon: string;
    label: string;
    value: "chart" | "monitor" | "draw" | "measure" | "weather";
    active?: any;
    handler?: Function;
    children?: any[]
}

export default () => {
    const store = useStore();

    const chartBtnHandler = () => {
        store.commit(ActionType.SET_CHART_VIEW_TOGGLE);

        // 互斥
        if (store.state.WeatherView.visible) {
            store.commit(ActionType.SET_WEATHER_VIEW_TOGGLE);
            nextTick(() => {
                if (store.state.WeatherView.visible === false) {
                    store.commit(ActionType.SET_TYPHON_PATH_TOGGLE, false);
                }
            });
        }
    }

    const weatherBtnHandler = () => {
        store.commit(ActionType.SET_WEATHER_VIEW_TOGGLE);
        nextTick(() => {
            if (store.state.WeatherView.visible === false) {
                store.commit(ActionType.SET_TYPHON_PATH_TOGGLE, false);
            }
        });

        // 互斥
        if (store.state.ChartView.visible) {
            store.commit(ActionType.SET_CHART_VIEW_TOGGLE);
        }
    }

    const tools = ref<ToolItem[]>([
        {
            label: "图表",
            icon: "yw-icon-chart-bar",
            value: "chart",
            active: computed(() => {
                return store.state.ChartView.visible
            }),
            handler: chartBtnHandler
        },
        {
            label: "监控",
            icon: "yw-icon-monitor",
            value: "monitor",
            active: computed(() => store.state.MonitorView.visible),
            handler() {
                store.commit(ActionType.SET_MONITOR_VIEW_TOGGLE);
            }
        },
        {
            label: "绘制",
            icon: "yw-icon-pen",
            value: "draw",
            active: false,
            children: [
                {
                    label: "绘制圆",
                    icon: "yw-icon-t-1",
                    value: "drawCircle",
                },
                {
                    label: "绘制多边形",
                    icon: "yw-icon-t-2",
                    value: "drawPolygon",
                },
                {
                    label: "绘制点",
                    icon: "yw-icon-t-3",
                    value: "drawPoint",
                },
                {
                    label: "绘制线",
                    icon: "yw-icon-t-5",
                    value: "drawLine",
                },
                {
                    label: "清除绘制",
                    icon: "yw-icon-t-4",
                    value: "drawClean",
                }
            ],
            handler() {
                this.active = !this.active;

                if (this.active) {
                    const measureBtn = tools.value.find(i => i.value === 'measure');
                    measureBtn!.active = false;
                }
            }
        },
        {
            label: "测量",
            icon: "yw-icon-ruler",
            value: "measure",
            active: false,
            children: [
                {
                    label: "靠泊测距",
                    icon: "yw-icon-angle",
                    value: "measureBerthing",
                },
                {
                    label: "测距",
                    icon: "yw-icon-t-6",
                    value: "measureDistance",
                },
                {
                    label: "测面",
                    icon: "yw-icon-t-7",
                    value: "measurePolygon",
                },
                {
                    label: "三角测量",
                    icon: "yw-icon-t-8",
                    value: "measureTriangulation",
                },
                {
                    label: "清除测距",
                    icon: "yw-icon-t-4",
                    value: "measureClean",
                }
            ],
            handler() {
                this.active = !this.active;

                if (this.active) {
                    const drawBtn = tools.value.find(i => i.value === 'draw');
                    drawBtn!.active = false;
                }
            }
        },
        {
            label: "天气",
            icon: "yw-icon-cloudy",
            value: "weather",
            active: computed(() => {
                return store.state.WeatherView.visible
            }),
            handler: weatherBtnHandler
        }
    ]);

    const onToolItemClick = (item: ToolItem) => {
        if (item.handler) {
            item.handler && item.handler.call(item, item.active);
        }
        else {
            item.active = !item.active;
        }
    }

    return {
        tools,
        onToolItemClick
    }
}