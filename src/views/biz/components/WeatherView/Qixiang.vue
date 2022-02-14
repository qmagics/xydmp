<template>
    <div class="Qixiang">
        <app-title-box>气象信息</app-title-box>
        <app-chart-box height="3.2rem" v-loading="loading">
            <ul class="daily-weather">
                <li
                    :class="['daily-weather__item', { 'is--today': index === 0 }]"
                    v-for="(i,index) in dailyWeatherList"
                    :key="index"
                >
                    <!-- <pre>{{ i }}</pre> -->
                    <div class="item-time">
                        <b>{{ i.dayName }}</b>
                        <span>{{ i.date }}</span>
                    </div>
                    <div class="item-weather-icon">
                        <svg-icon :name="i.weatherIcon"></svg-icon>
                    </div>
                    <div class="item-weather-temperature" v-if="index === 0">
                        <span>{{ i.temperature }}</span>
                        <small v-if="i.temperature">℃</small>
                    </div>
                    <div class="item-weather-temperature-range">{{ i.temperatureRangeText }}</div>
                    <div class="item-weather-name">{{ i.weatherName }}</div>
                </li>
            </ul>
            <div class="other-props">
                <div
                    :class="['other-props__item', `is--type-${i.type}`]"
                    v-for="i in otherPropsList"
                >
                    <yw-icon class="icon" :name="i.icon"></yw-icon>
                    <div class="props">
                        <span class="label">{{ i.label }}</span>
                        <b class="value">
                            <span class="content">{{ i.value }}</span>
                            <span class="unit">{{ i.unit }}</span>
                        </b>
                    </div>
                </div>
            </div>
        </app-chart-box>
    </div>
</template>
<script lang="ts">
import KanbanApi from "@/api/KanbanApi";
import { useStore } from "@/store";
import { computed, defineComponent, onMounted, reactive, ref } from "vue";
import { WeatherIconMap } from './weather';

interface DailyWeatherItem {
    day: string;
    date: string;
    weatherIcon: string;
    temperature?: string;
    temperatureRangeText: string;
    weatherName: string;
    fengli?: string;
    fengxiang?: string;
    jiangshui?: string;
    nengjiandu?: string;
    dayName?: string;
}

/** 转换后端气象数据 */
function parseWeatherInfo(htmlStr: string) {

    const tableStr = JSON.parse(htmlStr).html;

    const div = document.createElement("div");
    div.innerHTML = tableStr;

    const table = div.querySelector("table") as HTMLTableElement;
    const theadRows = Array.from((table.tHead as HTMLTableSectionElement).rows);
    const tbodyRows = Array.from(table.tBodies[0].rows);

    // console.log(theadRows);
    // console.log(tbodyRows);

    const map: any = {};

    Array.from(theadRows[0].cells).forEach((cell, index) => {
        if (index > 0) {
            const fengxiang = tbodyRows[0].cells[index].querySelector("img")?.alt;
            const fengli = tbodyRows[0].cells[index].querySelector("span")?.innerText;
            const tianqi = tbodyRows[1].cells[index].querySelector("span")?.innerText;
            const qiwen = tbodyRows[2].cells[index].querySelector("span")?.innerText;
            const jiangshui = tbodyRows[3].cells[index].querySelector("span")?.innerText;
            const nengjiandu = tbodyRows[4].cells[index].querySelector("span")?.innerText;


            const timeKey = cell.innerHTML.replace('日', '-').replace('时', '');
            map[timeKey] = {
                fengxiang,
                fengli,
                tianqi,
                qiwen,
                qiwen_range: [' - ', ' - '],
                jiangshui,
                nengjiandu
            }
        }
    });

    return map;
}

/** 获取气温区间 */
function getTemperatureRange(date: string, map: any) {
    console.log('date', date)
    const tempArr = Object.keys(map).filter(key => key.startsWith(date)).map((key: string) => parseInt(map[key].qiwen));
    return `${Math.min.apply(null, tempArr)} ~ ${Math.max.apply(null, tempArr)}℃`;
}

/** 设置后三天天气信息 */
function getDay3Weather(date: string | number, map: any): any[] {
    function parseValue(w: any, n = 0, date: string) {
        const obj = {
            temperature: w.qiwen,
            temperatureRangeText: getTemperatureRange(date, map),
            weatherIcon: WeatherIconMap[w.tianqi],
            weatherName: w.tianqi,
            fengli: w.fengli,
            fengxiang: w.fengxiang,
            nengjiandu: w.nengjiandu,
            dayName: new Date().addDays(n).format('w')
        };

        return obj;
    }
    function getNextDateString(plusN: number) {
        let d: any = new Date().addDays(plusN).getDate();
        return (d < 10 ? '0' : '') + d;
    }
    let w1: any, w2: any, w3: any;
    // date = Number(date);
    const d1 = getNextDateString(1),
        d2 = getNextDateString(2),
        d3 = getNextDateString(3);

    Object.entries(map).forEach(([key, value]: [string, any]) => {
        if (!w1 && key.startsWith(d1)) {
            w1 = parseValue(value, 1, d1);
        }
        if (!w2 && key.startsWith(d2)) {
            w2 = parseValue(value, 2, d2);
        }
        if (!w3 && key.startsWith(d3)) {
            w3 = parseValue(value, 3, d3);
        }
    });

    return [w1 || {}, w2 || {}, w3 || {}];
}

export default defineComponent({
    setup() {
        const store = useStore();
        const loading = ref(false);
        const dailyWeatherList = ref<DailyWeatherItem[]>([
            {
                day: "",
                date: "",
                weatherIcon: "",
                temperatureRangeText: "",
                temperature: "",
                weatherName: "",
            },
            {
                day: "",
                date: "",
                weatherIcon: '',
                temperatureRangeText: "",
                weatherName: "",
                dayName: ""
            },
            {
                day: "",
                date: "",
                weatherIcon: '',
                temperatureRangeText: "",
                weatherName: "",
                dayName: ""
            },
            {
                day: "",
                date: "",
                weatherIcon: '',
                temperatureRangeText: "",
                weatherName: "",
                dayName: ""
            },
        ]);
        const otherPropsList = ref<any[]>([
            {
                icon: "yw-icon-wendu",
                label: "温度",
                type: "wendu",
                value: computed(() => dailyWeatherList.value[0].temperature || '-'),
                unit: "℃"
            },
            {
                icon: "yw-icon-jiangshui",
                label: "降水",
                type: "jiangshui",
                value: computed(() => dailyWeatherList.value[0].jiangshui || '-'),
                unit: "mm"
            },
            {
                icon: "yw-icon-fengsu",
                label: "风速",
                type: "fengsu",
                value: computed(() => dailyWeatherList.value[0].fengli || '-'),
                unit: "级"
            },
            {
                icon: "yw-icon-fengxiang",
                label: "风向",
                value: computed(() => dailyWeatherList.value[0].fengxiang || '-'),
                type: "fengxiang",
            },
            {
                icon: "yw-icon-nengjiandu",
                label: "能见度",
                type: "nengjiandu",
                value: computed(() => dailyWeatherList.value[0].nengjiandu || '-'),
                unit: "m"
            },
            {
                icon: "yw-icon-langgao",
                label: "潮高",
                type: "chaogao",
                value: computed(() => store.state.TideHeight || '-'),
                unit: "m"
            }
        ]);

        const getData = async () => {
            loading.value = true;
            try {
                const { data, bl } = await KanbanApi.getWeather();
                if (bl) {
                    const info24: any = parseWeatherInfo(data.rows[0].Info24);
                    const info72: any = parseWeatherInfo(data.rows[0].Info72);
                    const info: any = { ...info24, ...info72 };
                    // console.log('info', info);

                    // 获取今日气象数据
                    const timeKey = new Date().format("dd-HH");
                    const w = info[timeKey];

                    if (w) {
                        // 设置今日气象数据
                        dailyWeatherList.value[0].temperature = w.qiwen;
                        dailyWeatherList.value[0].temperatureRangeText = getTemperatureRange(timeKey.slice(0, -3), info);
                        dailyWeatherList.value[0].weatherIcon = WeatherIconMap[w.tianqi];
                        dailyWeatherList.value[0].weatherName = w.tianqi;
                        dailyWeatherList.value[0].fengli = w.fengli;
                        dailyWeatherList.value[0].fengxiang = w.fengxiang;
                        dailyWeatherList.value[0].nengjiandu = w.nengjiandu;

                        // 设置后三日气象数据
                        const date = timeKey.slice(0, -3);
                        const [w1, w2, w3] = getDay3Weather(date, info);
                        // console.log([w1, w2, w3]);
                        dailyWeatherList.value[1] = w1;
                        dailyWeatherList.value[2] = w2;
                        dailyWeatherList.value[3] = w3;

                    }
                }
            } finally {
                loading.value = false;
            }
        }

        onMounted(() => {
            getData();
        });

        return {
            dailyWeatherList,
            otherPropsList,
            loading
        }
    },
});
</script>

<style lang="scss">
.Qixiang {
    .daily-weather {
        height: 1.6rem;
        display: flex;
        padding: 0.1rem 0;
        // background-color: rgba(174, 0, 255, 0.11);
        &__item {
            position: relative;
            @include lineBorder(right, 100%, rgba(255, 255, 255, 0.3));
            padding: 0.05rem 0.1rem;
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            &.is--today {
                // display: flex;
                .item-time {
                    display: none;
                }
                .item-weather-icon {
                    // background: rgba(255, 230, 0, 0.288);
                    line-height: 0;
                    padding: 0;
                    height: 0.45rem;
                    overflow: hidden;
                    // transform: translate3d(0, -0.05rem, 0);

                    .svg-icon {
                        width: 100%;
                        height: 100%;
                    }
                }
                .item-weather-temperature {
                }
                .item-weather-temperature-range {
                    // background: rgba(51, 87, 153, 0.219);
                    overflow: hidden;
                    height: 0.22rem;
                    line-height: 0.22rem;
                }
                .item-weather-name {
                    // background: rgba(51, 153, 110, 0.219);
                }
            }

            .item-time {
                display: flex;
                flex-direction: column;
                align-items: center;
                font-size: 0.13rem;
                b {
                    font-weight: normal;
                    padding-bottom: 0.03rem;
                    color: rgba(255, 255, 255, 0.9);
                }
                span {
                    color: rgba(255, 255, 255, 0.5);
                    font-size: 0.12rem;
                }
            }
            .item-weather-icon {
                padding: 0.1rem 0;
                font-size: 0.34rem;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .item-weather-temperature {
                letter-spacing: 0.02rem;
                height: 0.3rem;
                line-height: 0.3rem;
                overflow: hidden;
                text-align: center;
                transform: translate3d(0, -0.1rem, 0);
                // background: rgba(102, 51, 153, 0.219);
                transform: none;
                font-size: 0.3rem;

                small {
                    font-size: 0.14rem;
                    vertical-align: top;
                    display: inline-block;
                    transform: translate3d(0.02rem, -0.06rem, 0);
                }
            }
            .item-weather-temperature-range {
                display: flex;
                flex-direction: column;
                align-items: center;
                font-size: 0.13rem;
                padding-bottom: 0.03rem;
                color: rgba(255, 255, 255, 0.9);
            }
            .item-weather-name {
                display: flex;
                flex-direction: column;
                align-items: center;
                font-size: 0.12rem;
                color: rgba(255, 255, 255, 0.5);
            }
        }
    }
    .other-props {
        height: 1.4rem;
        margin: 0.1rem 0;
        display: flex;
        flex-flow: row wrap;
        background-color: rgba(0, 0, 0, 0.2);
        padding: 0.16rem 0;
        border-radius: 0.12rem;
        &__item {
            width: 33.3333%;
            display: flex;
            align-items: center;
            justify-content: space-around;
            position: relative;
            margin-bottom: 0.2rem;
            padding: 0 0.08rem;
            @include lineBorder(right, 80%, rgba(255, 255, 255, 0.3));

            &.is--type-fengxiang {
                .props {
                    .value {
                        font-size: 0.14rem;
                    }
                }
            }

            &.is--type-qiya {
                .props {
                    .value {
                        font-size: 0.16rem;
                    }
                }
            }

            &:nth-child(3n) {
                &::after {
                    display: none;
                }
            }
            .icon {
                font-size: 0.3rem;
                background-image: -webkit-linear-gradient(
                    135deg,
                    rgba(29, 142, 233, 1),
                    rgba(72, 187, 254, 1)
                );
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
            .props {
                display: flex;
                flex-direction: column;
                // align-items: center;
                justify-content: center;
                // background-color: rosybrown;
                width: 70%;
                padding-left: 0.05rem;
                .label {
                    color: rgba(255, 255, 255, 0.7);
                    padding-bottom: 0.04rem;
                }
                .value {
                    font-size: 0.18rem;
                    height: 0.2rem;
                    @include text-clamp(1);
                    .unit {
                        font-size: 0.12rem;
                        font-weight: normal;
                        margin-left: 0.02rem;
                        color: rgba(255, 255, 255, 0.8);
                        display: inline-block;
                        transform: scale(0.8);
                    }
                }
            }
        }
        // background-color: rgba(128, 255, 0, 0.11);
    }
}
</style>
