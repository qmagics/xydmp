<template>
    <div class="tide-view">
        <div class="liquid" ref="liquidRef" @click="toggleBox(true)"></div>
        <transition name="tide-slide">
            <div class="box" v-show="showBox">
                <div class="left">
                    <div class="title">当天潮汐变化情况统计</div>
                    <ul>
                        <li v-for="(i, index) in chaoList" :key="index">
                            <yw-icon :name="i.icon"></yw-icon>
                            <span class="text-primary">{{ i.name }}</span>
                            <span class="text-info">{{ i.time }}</span>
                            <span class="text-info">{{ i.value }}m</span>
                        </li>
                    </ul>
                </div>
                <div class="center">
                    <div ref="lineRef" class="chart"></div>
                </div>
                <div class="right"></div>
                <div class="close-btn" @click="toggleBox(false)">
                    <yw-icon name="yw-icon-close"></yw-icon>
                </div>
            </div>
        </transition>
    </div>
</template>

<script lang="ts">
import "echarts-liquidfill";
import echarts, { EChartsOption } from '@/plugins/echarts';
import { linearColorReverse } from '@/plugins/echarts/linearColors';

const useLineChart = (lineRef: Ref) => {
    let line: any = null;

    const option: EChartsOption = {
        tooltip: {
            trigger: "axis",
            appendToBody: true,
            axisPointer: {
                type: "cross",
                label: {
                    backgroundColor: "rgba(0,0,0,.3)",
                },
            },
        },
        grid: {
            top: "30%",
            left: "5%",
            right: "5%",
            bottom: "0%",
            containLabel: true,
        },
        xAxis: [
            {
                type: "category",
                boundaryGap: false,
                data: (function () {
                    const arr = [];

                    for (let i = 0; i < 24; i++) {
                        arr.push(i + "");
                    }
                    return arr;
                })(),
                axisLabel: {
                    color: "rgb(202,231,255)",
                },
                axisTick: {
                    show: false,
                },
            },
        ],
        yAxis: [
            {
                name: "潮高(m)",
                type: "value",
                nameTextStyle: {
                    color: "rgb(202,231,255)",
                    fontSize: 12,
                },
                axisLabel: {
                    color: "rgb(202,231,255)",
                    fontSize: 12,
                },
                axisTick: {
                    show: false,
                },
                axisLine: {
                    lineStyle: {
                        color: "rgb(67,108,139)",
                    },
                },
                splitLine: {
                    lineStyle: {
                        color: "rgba(103,134,154,.7)",
                        type: "dashed",
                    },
                },
            },
        ],
        series: [
            {
                name: "潮高",
                type: "line",
                color: "rgb(59,148,255)",
                areaStyle: {
                    color: linearColorReverse[0]
                },
                smooth: true,
                data: [],
            },
        ],
    };

    const refresh = (data?: any) => {
        const obj = data.detail[0];
        const arr = [];

        if (obj) {
            for (let i = 0; i < 24; i++) {
                arr.push(obj["h" + i]);
            }

            option.series[0].data = arr;
            line.setOption(option);
        }
    };

    onMounted(() => {
        line = echarts.init(lineRef.value);
        // refresh();
    });

    return {
        refresh,
        resize: () => {
            line && line.resize();
        }
    }
}

const useLiquid = (liquidRef: Ref) => {
    let liquid: any = null;
    const store = useStore();

    const option: EChartsOption = {
        backgroundColor: "",

        graphic: [
            {
                type: "text",
                z: 100,
                left: "center",
                bottom: "30%",
                style: {
                    fill: "#fff",
                    text: "当前潮高",
                },
            },
        ],

        series: [
            {
                type: "liquidFill",
                radius: "60%",
                center: ["50%", "50%"],
                data: [],
                backgroundStyle: {
                    borderWidth: 0,
                    //borderColor: 'red',
                    color: "transparent",
                },
                itemStyle: {
                    color: "rgb(18,97,214)",
                },
                outline: {
                    show: true,
                    borderDistance: 3,
                    itemStyle: {
                        color: "none",
                        borderColor: "rgb(26,110,211)",
                        borderWidth: 3,
                        shadowBlur: 20,
                        shadowColor: "rgba(0, 0, 0, 0.25)",
                    },
                },

                label: {
                    normal: {
                        formatter: "1.2m",
                        textStyle: {
                            fontSize: 20,
                            color: "#fff",
                        },
                    },
                },
            },
        ],
    };

    const refresh = (data?: any) => {
        let value = 0;
        const currentHour = new Date().getHours();

        try {
            value = data.detail[0]["h" + currentHour];
            // 设置当前潮高
            store.commit(ActionType.SET_TIDE_HEIGHT, value);

            option.series[0].data = [value / 10];
            option.series[0].label.normal.formatter = `${value}m`;
            liquid.setOption(option);
        } catch (error) {
            console.log(error);
        }


    };

    onMounted(() => {
        liquid = echarts.init(liquidRef.value);
    });

    return {
        refresh,
        resize: () => {
            liquid && liquid.resize();
        }
    }
}
</script>

<script lang="ts" setup>
import { nextTick, onMounted, Ref, ref, watch } from 'vue';
import KanbanApi from "@/api/KanbanApi";
import { isNotEmpty } from "@/utils";
import { useStore } from "@/store";
import { ActionType } from "@/store/ActionType";

const loading = ref(false);

const showBox = ref(false);
const toggleBox = (v?: boolean) => {
    showBox.value = v ?? !showBox.value;
};

const lineRef = ref();
const liquidRef = ref();

const { refresh: refreshLine, resize: resizeLine } = useLineChart(lineRef);
const { refresh: refreshLiquid, resize: resizeLiquid } = useLiquid(liquidRef);

const chaoList = ref([
    {
        icon: "-",
        name: "-",
        time: "-",
        value: 0
    },
    {
        icon: "-",
        name: "-",
        time: "-",
        value: 0
    },
    {
        icon: "-",
        name: "-",
        time: "-",
        value: 0
    },
    {
        icon: "-",
        name: "-",
        time: "-",
        value: 0
    }
]);

const refreshList = (data: any) => {
    function getNameIcon(h1: any, h2: any) {
        const GAO = { name: '潮高', icon: 'yw-icon-high' }, DI = { name: '潮低', icon: 'yw-icon-low' }, PING = { name: "-", icon: "yw-icon-pin" };
        if (isNotEmpty(h1)) {
            if (isNotEmpty(h2)) {
                return h1 > h2 ? GAO : DI
            }
            else {
                return GAO;
            }
        }
        else {
            if (isNotEmpty(h2)) {
                return DI;
            }
            else {
                return PING
            }
        }
    }
    const { tide_time1, tide_height1, tide_time2, tide_height2, tide_time3, tide_height3, tide_time4, tide_height4 } = data.overview[0];
    const item_1 = {
        time: tide_time1,
        value: tide_height1,
        ...getNameIcon(tide_height1, tide_height2)
    }
    const item_2 = {
        time: tide_time2,
        value: tide_height2,
        ...getNameIcon(tide_height2, tide_height1)
    }
    const item_3 = {
        time: tide_time3,
        value: tide_height3,
        ...getNameIcon(tide_height3, tide_height4)
    }
    const item_4 = {
        time: tide_time4,
        value: tide_height4,
        ...getNameIcon(tide_height4, tide_height3)
    }
    chaoList.value = [item_1, item_2, item_3, item_4];
}

const refresh = async () => {
    loading.value = true;
    try {
        const { data } = await KanbanApi.getTide();
        const vm = data.rows[0];
        refreshLine(vm);
        refreshLiquid(vm);
        refreshList(vm);
    } finally {
        loading.value = false;
    }
}

const resize = () => {
    resizeLine();
    refreshLiquid();
}

onMounted(() => {
    refresh();
});

watch(showBox, (val) => {
    if (val) {
        nextTick(() => {
            resize();
            refresh();
        });
    }
});
             </script>

<style lang="scss" scoped>
.tide-view {
    z-index: 2;
    position: fixed;
    right: 0.1rem;
    top: 50%;
    background: rgba(255, 0, 0, 0.178);
    // width: 6.5rem;
    height: 1.4rem;
    transform: translateX(0);
}
.box {
    background: rgba(23, 30, 39, 0.8);
    border: 0.01rem solid rgb(41, 114, 162);
    border-radius: 0.08rem;
    box-shadow: inset 0 0 0.08rem 0.06rem rgb(8, 61, 96);
    overflow: hidden;
    display: flex;
    width: 6.5rem;
    height: 1.4rem;
    position: absolute;
    right: 0;
    padding: 0.1rem 0.2rem;
    justify-content: space-around;
}

.box .left {
    width: 1.8rem;
    // background: rgba(255, 0, 0, 0.322);
}

.box .left .title {
    font-size: 0.16rem;
    font-weight: bold;
    margin-bottom: 0.05rem;
}

.box .left ul {
    display: flex;
    flex-direction: column;
    align-items: left;
    justify-content: space-around;
    height: calc(100% - 0.2rem);
    li {
        font-size: 0.12rem;
        .yw-icon {
            font-size: 0.12rem;
            margin-right: 0.05rem;
            color: $colorPrimaryLight;
        }

        span {
            display: inline-block;
            margin-right: 0.2rem;
            &:last-child {
                margin-right: 0;
            }
        }
    }
}

.box .center {
    height: 100%;
    width: calc(100% - 3rem);
    // background: rgba(0, 38, 255, 0.26);
    .chart {
        width: 100%;
        height: 100%;
    }
}

.box .right {
    border-left: 0.01rem solid rgb(55, 86, 110);
    width: 1.2rem;
    // background: rgba(0, 255, 76, 0.26);
}

.box .close-btn {
    position: absolute;
    z-index: 2;
    right: 0.15rem;
    top: 0.1rem;
    cursor: pointer;

    &:before {
        content: "";
        position: absolute;
        opacity: 0;
        left: 50%;
        top: 50%;
        transform: translate3d(-50%, -50%, 0);
        background: rgba(124, 187, 247, 0.2);
        border-radius: 50%;
        width: 0.22rem;
        height: 0.22rem;
        transition: all 0.1s ease;
    }
}
.box .close-btn:hover {
    &:before {
        opacity: 1;
    }
}

.box .close-btn .yw-icon {
    color: rgb(184, 228, 255) !important;
    font-size: 0.12rem;
}

.liquid {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 1.4rem;
    height: 1.4rem;
    z-index: 1;
}

// @keyframes tide-slide {

// }

.tide-slide-enter-active {
    transition: all 0.3s ease-out;
}

.tide-slide-leave-active {
    transition: all 0.3s ease-out;
}

.tide-slide-enter-from,
.tide-slide-leave-to {
    transform: translateX(100%);
}
</style>