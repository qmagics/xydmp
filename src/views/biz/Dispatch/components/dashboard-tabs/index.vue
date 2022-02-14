<template>
    <div :class="['dashboard-tabs', { 'is--has-active-tab': isHasActiveTab }]">
        <div class="dashboard-tabs__labels">
            <div
                :class="['tab-label', { 'is--active': i.value === modelValue }]"
                v-for="i in displayLabelItems"
                :key="i.value"
                @click="onLabelClick(i)"
            >
                <span class="tab-label__bg">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        xmlns:xlink="http://www.w3.org/1999/xlink"
                        viewBox="0 0 231.5 54.99"
                    >
                        <defs>
                            <linearGradient
                                id="DashboardTabs_linear-gradient"
                                x1="24.25"
                                y1="80.68"
                                x2="196.53"
                                y2="-18.79"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop offset="0" stop-color="#fff" stop-opacity="0" />
                                <stop offset="0.02" stop-color="#fff" stop-opacity="0.13" />
                                <stop offset="0.06" stop-color="#fff" stop-opacity="0.31" />
                                <stop offset="0.09" stop-color="#fff" stop-opacity="0.47" />
                                <stop offset="0.13" stop-color="#fff" stop-opacity="0.62" />
                                <stop offset="0.17" stop-color="#fff" stop-opacity="0.74" />
                                <stop offset="0.22" stop-color="#fff" stop-opacity="0.83" />
                                <stop offset="0.27" stop-color="#fff" stop-opacity="0.91" />
                                <stop offset="0.33" stop-color="#fff" stop-opacity="0.96" />
                                <stop offset="0.41" stop-color="#fff" stop-opacity="0.99" />
                                <stop offset="0.56" stop-color="#fff" />
                                <stop offset="0.83" stop-color="#fff" stop-opacity="0.36" />
                                <stop offset="1" stop-color="#fff" stop-opacity="0" />
                            </linearGradient>
                        </defs>
                        <path
                            style="fill: none;stroke-miterlimit: 10;stroke: url(#DashboardTabs_linear-gradient);"
                            d="M231.5,42.28H89c-19.83,0-25.75-6.66-29.43-19.61A30.06,30.06,0,0,0,.65,33.57a29.63,29.63,0,0,0,12.09,21"
                        />
                        <path
                            style="fill: none;stroke-miterlimit: 10;stroke: url(#DashboardTabs_linear-gradient);"
                            d="M231.5,42.28H89c-19.83,0-25.75-6.66-29.43-19.61A30.06,30.06,0,0,0,.65,33.57a29.63,29.63,0,0,0,12.09,21"
                        />
                    </svg>
                </span>
                <span class="tab-label__icon">
                    <yw-icon :name="i.icon"></yw-icon>
                </span>
                <span class="tab-label__title">
                    <span class="tab-label__text">{{ i.label }}</span>
                    <yw-icon class="tab-label__arrow" name="el-icon-arrow-right"></yw-icon>
                </span>
            </div>
        </div>
        <div class="dashboard-tabs__content" v-show="isHasActiveTab">
            <div class="tab-content__bg">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 1923.76 300.22"
                >
                    <defs>
                        <linearGradient
                            id="tab-content__bg_linear-gradient"
                            x1="963.32"
                            y1="300.22"
                            x2="963.32"
                            y2="1.5"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop offset="0" stop-color="#0d0d0f" stop-opacity="0.4" />
                            <stop offset="0.66" stop-color="#0d0d0f" stop-opacity="0.66" />
                            <stop offset="1" stop-color="#0d0d0f" />
                        </linearGradient>
                    </defs>
                    <g>
                        <path
                            class="cls-1"
                            d="M2.88,32.77v2.68A28.16,28.16,0,0,0,31,63.51H41.7A23.38,23.38,0,0,1,65.07,87l-.81,141.18c0,19.07,11.5,29.19,31.84,29.19l574.16-.12c19.92.37,32.7,10.54,41.1,24.37,8.67,11.58,17,18,34.61,18.63h446.54c14.32-2.69,21-8.22,27.94-17.44,5.46-10.69,19.79-25.37,39.63-25.58l663.68.1V2.61L34.05,1.5A31.15,31.15,0,0,0,2.88,32.77Z"
                        />
                        <path
                            class="cls-2"
                            d="M1920.76,253.33H1253.58S1227,255.49,1216,276s-30,19.35-30,19.35H741s-19.13,1.26-30.13-19.23S673,253.33,673,253.33l-582.47.12a25.22,25.22,0,0,1-25.24-25.22V83.15A24.1,24.1,0,0,0,41.16,59H28.6A24.66,24.66,0,0,1,3.93,34.38h0a29,29,0,0,1,29-29H1920.76"
                        />
                        <path
                            class="cls-3"
                            d="M1920.58,256.44h-667s-23.73,2.7-34.73,23.19S1186,299.46,1186,299.46H741s-22.54.22-33.54-20.27S673,256.46,673,256.46l-584.75.12a27,27,0,0,1-27-27V85.88a23.05,23.05,0,0,0-23-23H27A26.53,26.53,0,0,1,.5,36.35V32.44A31.94,31.94,0,0,1,32.44.5H1920.76"
                        />
                    </g>
                </svg>
            </div>
            <!-- <div class="tab-content__inner"> -->
                <slot></slot>
            <!-- </div> -->
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, provide, reactive, ref, toRefs } from "vue";
import { DashboardTabItemProxy, DashboardTabsProvideContext, DASHBOARD_TABS_PROVIDE_KEY } from "./tokens";

interface TabItem {
    label: string;
    icon: string;
    value: string | number;
}

export default defineComponent({
    name: "DashboardTabs",

    props: {
        modelValue: String,
        items: {
            type: Array as PropType<TabItem[]>,
            default: () => []
        },
    },

    emits: ['update:modelValue', 'change'],

    setup(props, { emit }) {
        const tabItems = ref<TabItem[]>([]);

        const displayLabelItems = computed(() => {
            const items = tabItems.value;
            const value = props.modelValue;
            const deselectedItems: TabItem[] = [];
            let selectedItem = undefined;
            items.forEach(item => {
                if (item.value === value) {
                    selectedItem = item;
                }
                else {
                    deselectedItems.push(item);
                }
            });

            if (selectedItem) {
                deselectedItems.unshift(selectedItem);
            }

            return deselectedItems;
        });

        const isHasActiveTab = computed(() => !!props.modelValue);

        const onLabelClick = (item: TabItem) => {
            emit('update:modelValue', item.value);
            emit('change', item.value);
        }

        const addTabItem = (itemProxy: DashboardTabItemProxy) => {
            const { value, label, icon } = itemProxy;
            const item = {
                value,
                label,
                icon
            }
            tabItems.value.push(item);
        }

        const delTabItem = (itemProxy: DashboardTabItemProxy) => {
            const { value } = itemProxy;
            tabItems.value = tabItems.value.filter(i => i.value !== value);
        }

        provide(
            DASHBOARD_TABS_PROVIDE_KEY,
            reactive({
                ...toRefs(props),
                addTabItem,
                delTabItem
            }) as unknown as DashboardTabsProvideContext
        )

        return {
            displayLabelItems,
            onLabelClick,
            isHasActiveTab
        }
    }
})
</script>

<style lang="scss">
$labelItemWidth: 2.8rem;
$labelItemHeight: 0.54rem;
$innerHeight: $labelItemHeight * 0.7;

.dashboard-tabs {
    height: 100%;
    position: relative;
    &__content {
        height: 100%;
        width: 100%;
        background: rgba(28, 76, 110, 0.6);
        border-top-left-radius: 0.24rem;
        position: absolute;
        left: 0;
        top: 0;

        .tab-content__bg {
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            svg {
                width: 100%;
                transform: scaleY(0.82) translateY(-0.02rem);
                transform-origin: top;
                .cls-1 {
                    opacity: 0.7;
                    fill: url(#tab-content__bg_linear-gradient);
                }
                .cls-2,
                .cls-3 {
                    fill: none;
                    stroke: #fff;
                    stroke-miterlimit: 10;
                }
                .cls-2 {
                    opacity: 0.5;
                }
                .cls-3 {
                    opacity: 0.8;
                }
            }
        }
        .tab-content__inner{
        }
    }

    &__labels {
        // position: absolute;
        // left: 0;
        // top: 0;
        .tab-label {
            position: relative;
            width: $labelItemWidth;
            height: $labelItemHeight;
            margin-bottom: 0.1rem;
            cursor: pointer;
            z-index: 1;
            &__bg {
                $bgHeight: $innerHeight;
                position: absolute;
                left: #{$labelItemHeight/2};
                top: 0;
                height: $bgHeight;
                width: 80%;
                border-bottom-right-radius: $labelItemHeight;
                background-color: rgba(13, 29, 46, 0.8);
                transition: all 0.2s ease;
                svg {
                    width: $labelItemWidth - 0.7rem;
                    height: $labelItemHeight;
                    transform: translate3d(-0.272rem, -0.06rem, 0);
                    position: relative;
                    z-index: 1;
                }

                &::before {
                    content: "";
                    position: absolute;
                    left: 0;
                    width: 40%;
                    height: 0.04rem;
                    top: -0.02rem;
                    background-color: rgb(95, 190, 255);
                }
            }
            &__icon {
                width: $labelItemHeight;
                height: $labelItemHeight;
                border-radius: 50%;
                background-color: rgb(34, 48, 59);
                border: 0.03rem solid rgb(34, 48, 59);
                display: inline-flex;
                align-items: center;
                justify-content: center;
                box-shadow: inset 0 0 0 0.02rem rgb(143, 149, 155);
                font-size: 0.22rem;
                position: relative;
                transition: all 0.2s ease;
                z-index: 1;
                transform: translateY(-0.02rem) scale(1);

                &::before {
                    content: "";
                    position: absolute;
                    left: -0.03rem;
                    top: -0.03rem;
                    bottom: -0.03rem;
                    right: -0.03rem;
                    box-shadow: inset 0 0 0.12rem 0.05rem rgb(11, 118, 201);
                    border-radius: 50%;
                    transform: scale(0);
                    opacity: 0;
                }
                .yw-icon {
                    position: relative;
                    z-index: 1;
                }
            }
            &__title {
                z-index: 1;
                height: $innerHeight;
                line-height: $innerHeight;
                position: absolute;
                left: 0.9rem;
                top: 0;
                width: calc(100% - 0.9rem);
                font-size: 0.15rem;
                letter-spacing: 0.01rem;
                color: rgba(255, 255, 255, 0.9);

                .tab-label__arrow {
                    position: absolute;
                    right: 0.65rem;
                    top: 50%;
                    transform: translate3d(0, -50%, 0);
                    font-size: 0.16rem;
                }
            }
            &:hover {
                .tab-label__bg {
                    background-color: rgba(13, 29, 46, 1);
                }
            }
            &.is--active {
                .tab-label__icon {
                    &::before {
                        transform: scale(1);
                        opacity: 1;
                    }
                }
                .tab-label__bg {
                    display: block;
                }
                .tab-label__title {
                    display: block;
                }
                .tab-label__arrow {
                    display: none;
                }
            }
        }
    }

    &.is--has-active-tab {
        .tab-label:not(.is--active) {
            .tab-label__icon {
                transform: translateY(-0.02rem) scale(0.8);
            }
            .tab-label__bg,
            .tab-label__title {
                display: none;
            }
        }
    }
}
</style>