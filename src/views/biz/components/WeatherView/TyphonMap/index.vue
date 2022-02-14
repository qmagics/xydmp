<template>
    <div class="typhon-map">
        <div class="map-main" ref="map" @mouseenter.capture="onMapMouseenter"></div>

        <app-panel class="typhon-map__legend" width="1.7rem" height="5.2rem">
            <div class="legend-title">气象图例</div>
            <div class="legend-group">
                <div class="legend-group__title">预报台</div>
                <div class="legend-group__content">
                    <div class="typhon-map-legend-item" v-for="i in YubaotaiList" :key="i.label">
                        <span class="color-line">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32.25 6">
                                <line
                                    class="cls-1"
                                    :style="{ stroke: i.color }"
                                    y1="0.5"
                                    x2="3"
                                    y2="0.5"
                                />
                                <line
                                    class="cls-2"
                                    :style="{ stroke: i.color }"
                                    x1="7.86"
                                    y1="0.5"
                                    x2="26.82"
                                    y2="0.5"
                                />
                                <line
                                    class="cls-1"
                                    :style="{ stroke: i.color }"
                                    x1="29.25"
                                    y1="0.5"
                                    x2="32.25"
                                    y2="0.5"
                                />
                            </svg>
                        </span>
                        <span class="text">{{ i.label }}</span>
                    </div>
                </div>
            </div>
            <div class="legend-group">
                <div class="legend-group__title">台风等级</div>
                <div class="legend-group__content">
                    <div class="typhon-map-legend-item" v-for="i in RankList" :key="i.label">
                        <span class="color-circle" :style="{ backgroundColor: i.color }"></span>
                        <span class="text">{{ i.label }}</span>
                    </div>
                </div>
            </div>
        </app-panel>
    </div>
</template>

<script lang="ts" setup>
import { useStore } from '@/store';
import { TyphonObject } from '@/types/biz';
import { onMounted, ref, toRefs, watch } from 'vue';
import useLMap from './hooks/useInitLMap';

const map = ref();
const store = useStore();

const { initMap, renderTyohoon } = useLMap(map);

onMounted(() => {
    initMap(() => {
        if (store.state.WeatherView.currentTyphonObject) {
            renderTyohoon(store.state.WeatherView.currentTyphonObject as TyphonObject);
        }

        watch(() => store.state.WeatherView.currentTyphonObject, (tf) => {
            if (tf) {
                renderTyohoon(tf as TyphonObject);
            }
        })
    })
});

const onMapMouseenter = (e: MouseEvent) => {
    const el = e.target as HTMLElement;

    /** 台风路径关键点位鼠标交互逻辑 */
    if (el.classList.contains('tf-key-point')) {
        const scale = 1.5;
        const oldTransform = el.style.transform;
        const newTransform = `${oldTransform} scale(${scale})`;
        const oldMargin = el.style.marginLeft; //marginLeft 同 marginTop
        const newMargin = parseFloat(oldMargin) * scale + "px";

        el.style.transform = newTransform;
        el.style.marginLeft = el.style.marginTop = newMargin;

        const elOnLeave = () => {
            el.style.transform = oldTransform;
            el.style.marginLeft = el.style.marginTop = oldMargin;
            el.removeEventListener("mouseleave", elOnLeave);
        }

        el.addEventListener("mouseleave", elOnLeave);
    }
}

const YubaotaiList = ref([
    {
        label: "中国",
        color: 'rgb(255,60,78)'
    },
    {
        label: "中国香港",
        color: 'rgb(254,189,0)'
    },
    {
        label: "中国台湾",
        color: 'rgb(255,0,254)'
    },
    {
        label: "日本",
        color: 'rgb(36,188,0)'
    },
    {
        label: "美国",
        color: 'rgb(4,250,247)'
    }
]);

const RankList = [
    {
        label: "热带低压",
        color: 'rgb(106,184,44)'
    },
    {
        label: "热带风暴",
        color: 'rgb(40,108,181)'
    },
    {
        label: "强热带风暴",
        color: 'rgb(241,236,55)'
    },
    {
        label: "台风",
        color: 'rgb(245,167,28)'
    },
    {
        label: "强台风",
        color: 'rgb(187,125,180)'
    },
    {
        label: "超强台风",
        color: 'rgb(231,20,26)'
    }
]

</script>

<style lang="scss">
.typhon-map {
    position: fixed;
    background-color: rgba(64, 224, 208, 0.486);
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    .map-main {
        width: 100%;
        height: 100%;
    }

    .tf-key-point {
        border-radius: 50%;
        box-shadow: 0 0 2px 1px rgba(59, 60, 61, 0.9);
        transition: all 0.1s ease;
    }
    .leaflet-popup-close-button {
        right: 0.07rem !important;
        top: 0.05rem !important;
    }
    .leaflet-popup-content-wrapper {
        background: rgba(22, 39, 64, 0.9);
        color: #fff;
    }
    .leaflet-popup-tip {
        background: rgba(22, 39, 64, 0.9);
    }

    .typhone_info {
        width: 300px;
        height: 184px;

        &.is--yuce {
            height: 152px;
        }

        .info_title {
            font-size: 0.14rem;
            height: 0.2rem;
            // background: red;
            small {
                color: rgba(255, 255, 255, 0.8);
                font-weight: normal;
            }
        }

        .info_list {
            height: calc(100% - 0.2rem);
            padding-top: 0.1rem;
            overflow-y: auto;
            li {
                padding: 0.05rem 0;
                display: flex;
                font-size: 0.14rem;
                border-bottom: 0.01rem solid rgba(255, 255, 255, 0.1);
                &:last-child {
                    border-bottom: none;
                }
                span {
                    width: 80px;
                    color: rgba(255, 255, 255, 0.7);
                }
                p {
                    flex: 1;
                    margin: 0;
                    padding: 0;
                }
            }
        }
    }

    .leaflet-tooltip {
        $bgcolor: rgba(129, 156, 202, 0.589);
        background: $bgcolor;
        border: none;
        border-radius: 4px;
        color: rgb(230, 236, 243);
        font-weight: bold;
        font-size: 15px;
        padding: 6px 16px;
        &:before {
            border-right-color: $bgcolor;
        }
    }
}
.typhon-map__legend {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    z-index: 999;
    --app-panel-padding: 0.2rem;

    .legend-title {
        font-size: 0.18rem;
        margin-bottom: 0.15rem;
    }

    .legend-group {
        margin-top: 0.05rem;
        &__title {
            background-color: rgb(19, 39, 58);
            padding: 0.08rem 0.16rem;
            font-size: 0.15rem;
        }
        &__content {
            padding: 0.1rem 0;
            .typhon-map-legend-item {
                display: flex;
                padding: 0.05rem 0;
                align-items: center;
                .color-line {
                    width: 0.3rem;
                    margin: 0 0.1rem;
                    svg {
                        .cls-1,
                        .cls-2 {
                            fill: none;
                            stroke-miterlimit: 10;
                        }
                        .cls-2 {
                            stroke-dasharray: 5.83 4.86;
                        }
                    }
                }
                .color-circle {
                    width: 0.1rem;
                    height: 0.1rem;
                    border-radius: 50%;
                    margin: 0 0.1rem;
                }
                .text {
                }
            }
        }
    }
}
</style>