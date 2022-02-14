<template>
    <app-panel class="C2_1" show-close @close="$emit('close')" height="6rem">
        <template v-for="i in list">
            <div class="box-item" v-show="i.Id === currentTabValue">
                <div class="box-item__title">
                    <div class="title-text">{{ currentTab?.Name }}</div>
                    <app-title-line></app-title-line>
                </div>
                <div class="box-item__body">
                    <div class="grid-item" v-for="j in i.EquipDetailList">
                        <div class="grid-item__title" :title="j.Location">{{ j.Location }}</div>
                        <div class="grid-item__body">{{ j.Count }}</div>
                    </div>
                </div>
            </div>
        </template>

        <template #around>
            <div class="around-tabs">
                <el-tabs v-model="currentTabValue" type="card" tab-position="left">
                    <el-tab-pane
                        v-for="tab in tabItems"
                        :key="tab.value"
                        :label="tab.label"
                        :name="tab.value"
                    ></el-tab-pane>
                </el-tabs>
            </div>
            <!-- <app-tabs class="around-tabs" :items="tabItems" v-model="currentTabValue"></app-tabs> -->
        </template>
    </app-panel>
</template>
<script lang="ts">
import { defineComponent, ref, PropType, computed, onMounted, reactive, getCurrentInstance } from "vue";
import AppTabs, { TabItem } from "@/components/AppTabs/index.vue";
import { Item } from './C2.vue';

export default defineComponent({
    props: {
        currentTab: [String, Number],
        list: {
            type: Array as PropType<Item[]>,
            default: () => []
        },
    },
    components: {
        AppTabs,
    },
    emits: ['close'],
    setup(props) {
        // tabs标签页
        const tabItems = computed(() => {
            return props.list.map(i => {
                return {
                    label: i.Name,
                    value: i.Id
                }
            })
        });

        const currentTabValue = ref(props.currentTab);

        const currentTab = computed(() => {
            return props.list.find(i => i.Id === currentTabValue.value);
        });

        return {
            tabItems,
            currentTab,
            currentTabValue
        }
    }
});
</script>

<style lang="scss">
$aroundTabsWidth: 0.36rem;
$itemWidth: 0.3rem;
.C2_1 {
    // height: 100%;
    width: calc(100% - #{$aroundTabsWidth});
    float: right;

    .around-tabs {
        position: absolute;
        left: -#{$aroundTabsWidth};
        width: $aroundTabsWidth;
        top: 50%;
        height: 100%;
        transform: translateY(-50%);
        display: flex;
        justify-content: flex-end;

        &:before {
            content: "";
            width: 0.01rem;
            height: 5rem;
            position: absolute;
            right: -0.01rem;
            background-image: linear-gradient(
                to bottom,
                rgba(255, 255, 255, 0) 0%,
                rgba(255, 255, 255, 1) 50%,
                rgba(255, 255, 255, 0) 100%
            );
        }

        .el-tabs {
            width: $aroundTabsWidth;
            height: 100%;

            &__header {
                border-bottom: none;
            }

            &__nav-wrap {
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                border: none;
            }

            &__item {
                width: $itemWidth;
                height: auto;
                padding: 0.2rem 0.05rem;
                line-height: 1.2;
                background-color: rgb(27, 44, 72);
                color: rgb(164, 171, 182);
                border-color: rgb(139, 146, 166) !important;
                border-width: 0.01rem 0 0.01rem 0.02rem !important;
                border-style: solid !important;
                border-top-left-radius: 0.08rem;
                border-bottom-left-radius: 0.08rem;
                transition: none;

                &.is-active {
                    width: $aroundTabsWidth;
                    padding-left: 0.1rem;
                    padding-right: 0.1rem;
                    // padding-right: 0.055rem;
                    // transform: translateX(-0.1rem);
                    background-image: linear-gradient(
                        to right,
                        #12587d,
                        #1b2c48
                    );
                    // box-shadow:inset 10px 0 10px 0 rgba(10,192,252);
                    color: #fff;

                    &:before,
                    &:after {
                        position: absolute;
                        left: 50%;
                        transform: translateX(-50%);
                        content: "";
                        background-color: rgba(255, 255, 255, 0.5);
                        width: 0.02rem;
                        height: 0.1rem;
                    }
                    &::before {
                        top: 0.05rem;
                    }
                    &::after {
                        bottom: 0.05rem;
                    }
                }
            }
            &__nav {
                white-space: normal;
                border: none !important;
                display: flex;
                flex-direction: column;
                align-items: flex-end;
            }

            &__nav-prev,
            &__nav-next {
                background-color: rgb(35, 65, 112);
                color: #fff;
                width: $itemWidth !important;
                height: 0.22rem !important;
                line-height: 0.22rem !important;
                padding: 0 !important;
                border-radius: 0.04rem;

                &:hover {
                    background-color: rgb(68, 102, 156);
                }
            }
        }
    }

    .box-item {
        height: 100%;
        &__title {
            display: flex;
            flex-direction: column;
            align-items: center;
            color: rgba(255, 255, 255, 0.9);
            height: 0.4rem;
            .title-text {
                font-size: 0.16rem;
            }
            .yw-icon {
                font-size: 95%;
                margin-right: 0.03rem;
            }
        }

        &__body {
            height: calc(100% - 0.5rem);
            overflow-x: hidden;
            overflow-y: auto;
            padding: 0.2rem 0.2rem;

            .grid-item {
                float: left;
                height: 0.8rem;
                width: 1.04rem;
                margin: 0 0.1rem 0.1rem 0;
                border: 1px solid rgba(255, 255, 255, 0.3);
                border-radius: 0.06rem;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                color: rgba(255, 255, 255, 0.7);
                box-shadow: 0.03rem 0.03rem 0.06rem rgba(0, 0, 0, 0.2);
                &__title {
                    flex: none;
                    height: 0.3rem;
                    line-height: 0.3rem;
                    text-align: center;
                    background: rgba(0, 0, 0, 0.4);
                    @include text-clamp(1);
                }
                &__body {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.17rem;
                    background: rgba(4, 14, 34, 0.1);
                }
            }
        }
    }
}
</style>
