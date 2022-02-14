<template>
    <div class="C10">
        <app-title-box @click="refresh">船坞坞期情况</app-title-box>
        <app-chart-box height="1.9rem" v-loading="loading">
            <div class="C10__left">
                <div class="item">
                    <div class="item__title">月平均坞期</div>
                    <app-corner-box class="item__box box1" height=".44rem">
                        <yw-icon name="yw-icon-a14" class="icon-shadow-young"></yw-icon>
                        <b>
                            {{ vm.MonthAvg }}
                            <small>h</small>
                        </b>
                    </app-corner-box>
                </div>
                <div class="item">
                    <div class="item__title">累计平均坞期</div>
                    <app-corner-box class="item__box box2" height=".44rem">
                        <yw-icon name="yw-icon-a13" class="icon-shadow-blue"></yw-icon>
                        <b>
                            {{ vm.TotalAvg }}
                            <small>h</small>
                        </b>
                    </app-corner-box>
                </div>
            </div>
            <div class="C10__right" v-loading="barLoading">
                <div class="chart-title">各船坞月平均坞期情况</div>
                <div class="chart-bar" ref="barRef"></div>
            </div>
        </app-chart-box>
    </div>
</template>
<script lang="ts">
import KanbanApi from "@/api/KanbanApi";
import useChartResize from "@/hooks/useChartResize";
import echarts, { EChartsOption } from "@/plugins/echarts";
import { linearColorReverse } from "@/plugins/echarts/linearColors";
import { defineComponent, ref, computed, onMounted, reactive } from "vue";

const useBar = () => {
    const barLoading = ref(false);
    const barRef = ref();
    let bar: any = null;

    const options: EChartsOption = {
        color: linearColorReverse,
        tooltip: {
            trigger: "axis",
            appendToBody: true,
        },
        grid: {
            left: "0%",
            right: "0%",
            bottom: "0%",
            top: "15%",
            containLabel: true
        },
        xAxis: {
            type: 'category',
            // data: ['1号船坞', '2号船坞', '3号船坞', '4号船坞'],
            data: [],
            axisTick: {
                show: false,
            },
            axisLine: {
                lineStyle: {
                    width: 2,
                    color: "90,111,133",
                },
            },
            axisLabel: {
                color: "rgb(168,174,189)",
            },
        },
        yAxis: {
            type: 'value',
            splitLine: {
                lineStyle: {
                    type: [8, 5],
                    dashOffset: 5,
                    width: 1,
                    color: "rgb(255,255,255,.1)",
                },
            },
            axisLine: {
                show: true,
                lineStyle: {
                    width: 2,
                    color: "90,111,133",
                },
            },
            axisLabel: {
                color: "rgb(168,174,189)",
            },
        },
        series: [
            {
                // data: [120, 200, 150, 80].map((i, index) => ({ value: i, itemStyle: { color: linearColorReverse[index] } })),
                data: [].map((i, index) => ({ value: i, itemStyle: { color: linearColorReverse[index] } })),
                type: 'bar',
                itemStyle: {
                    borderRadius: [20, 20, 0, 0]
                },
                label: {
                    show: true,
                    position: "top",
                    color: "rgba(255,255,255,.8)",
                    textBorderColor: "transparent"
                },
                barWidth: "26%",
                barMaxWidth: 20,
            }
        ]
    };

    const initBar = () => {
        bar = echarts.init(barRef.value);
        bar.setOption(options);
        useChartResize(bar);
    };

    const refreshBar = (barData: any[]) => {
        options.xAxis.data = barData.map(i => i.Name);
        options.series[0].data = barData.map((i, index) => ({ value: i.Value, itemStyle: { color: linearColorReverse[index] } }));
        bar.setOption(options);
    };

    onMounted(() => {
        initBar();
    });

    return {
        barLoading,
        barRef,
        bar,
        refreshBar,
    };
};

export default defineComponent({
    setup() {
        const loading = ref(false);
        const vm = ref<any>({});

        const {
            barLoading,
            barRef,
            refreshBar } = useBar();

        /** 获取数据 */
        const getData = async () => {
            loading.value = true;
            try {
                const { data } = await KanbanApi.getDockPeriod();
                vm.value = data.rows[0];
                refreshBar(vm.value.List);
            } finally {
                loading.value = false;
            }
        };

        onMounted(async () => {
            getData();
        });

        return {
            barRef,
            loading,
            barLoading,
            refresh: getData,
            vm,
        };
    },
});
</script>
<style lang="scss">
.C10 {
    .app-chart-box {
        padding: 0 0.1rem;
        padding-top: 0.14rem;
        display: flex;
        justify-content: space-between;
    }

    &__left {
        // background: rgba(255, 0, 0, 0.123);
        width: 1.2rem;
        padding-right: 0.1rem;
        .item {
            margin-bottom: 0.24rem;
            &__title {
                font-size: 0.13rem;
                color: rgba(255, 255, 255, 0.8);
                height: 0.2rem;
                line-height: 0.2rem;
                margin-bottom: 0.05rem;
            }
            &__box {
                --corner-size: 0.02rem;
                --corner-border-width: 0.016rem;
                --corner-border-color: rgb(97, 150, 193);
                padding: 0 0.1rem;

                &.box1 {
                    background-color: rgba(15, 97, 97, 0.45);
                }
                &.box2 {
                    background-color: rgba(21, 63, 102, 0.45);
                }

                .app-corner-box__inner {
                    display: flex;
                    justify-content: space-around;
                    align-items: center;
                }

                .yw-icon {
                    font-size: 0.2rem;
                }
                b {
                    font-size: 0.2rem;
                    @include text-clamp(1);
                    small {
                        font-weight: normal;
                        font-size: 70%;
                        margin-left: -0.04rem;
                    }
                }
            }
        }
    }

    &__right {
        flex: 1;

        .chart-title {
            height: 0.24rem;
            line-height: 0.24rem;
            font-size: 0.15rem;
            color: rgba(255, 255, 255, 0.8);
        }
        .chart-bar {
            // background: rgba(128, 255, 0, 0.116);
            width: 100%;
            height: calc(100% - 0.24rem);
        }
    }
}
</style>
