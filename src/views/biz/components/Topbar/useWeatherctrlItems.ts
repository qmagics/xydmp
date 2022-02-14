import { ref } from "vue";

/**
 * 天气控制项
 */
interface WeatherItem {
    /** 显示标签 */
    label: string;
    /** 控制值（3d引擎使用） */
    value: 'day' | 'night' | 'rain' | 'snow';
    /** 显示图标 */
    icon: string;
    /** 是否开启中 */
    active: boolean;
    handler?: (newIsActive: boolean) => void
}

export default () => {
    // {
    //     label: "夜晚",
    //     value: "night",
    //     icon: "yw-icon-moon",
    //     active: false,
    // },
    const weatherctrlItems = ref<WeatherItem[]>([
        {
            label: "晴天",
            value: "day",
            icon: "yw-icon-sun-outline",
            active: true,
            handler() {
                zccityTool.weatherClear();
                weatherctrlItems.value[1].active = false;
                weatherctrlItems.value[2].active = false;
            }
        },

        {
            label: "雨天",
            value: "rain",
            icon: "yw-icon-rain",
            active: false,
            handler(newIsActive) {
                if (newIsActive) {
                    zccityTool.weatherClear();
                    zccityTool.rain();
                    weatherctrlItems.value[0].active = false;
                    weatherctrlItems.value[2].active = false;
                }
                else {
                    zccityTool.weatherClear();
                    weatherctrlItems.value[0].active = true;
                    weatherctrlItems.value[2].active = false;
                }
            }
        },
        {
            label: "雪天",
            value: "snow",
            icon: "yw-icon-snow",
            active: false,
            handler(newIsActive) {
                if (newIsActive) {
                    zccityTool.weatherClear();
                    zccityTool.snow();
                    weatherctrlItems.value[0].active = false;
                    weatherctrlItems.value[1].active = false;
                }
                else {
                    weatherctrlItems.value[0].active = true;
                    weatherctrlItems.value[1].active = false;
                    zccityTool.weatherClear();
                }
            }
        },
    ]);

    const onWeatherctrlItemClick = (item: WeatherItem) => {
        if (item.active) return;
        item.active = !item.active;

        item.handler && item.handler(item.active);
    };

    return {
        weatherctrlItems,
        onWeatherctrlItemClick,
    }
}