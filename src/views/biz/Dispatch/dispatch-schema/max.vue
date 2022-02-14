<template>
    <div class="dispatch-schema--max">
        <div class="dispatch-schema--max__header">
            <div class="header-title">
                <app-title-line width="3rem"></app-title-line>
                <div class="header-title__inner">
                    <yw-icon name="yw-icon-exchange"></yw-icon>船舶调度方案
                </div>
                <app-title-line width="3rem"></app-title-line>
            </div>
            <div class="header-tools">
                <yw-icon name="yw-icon-min" @click="handleMini" style="margin-right:.2rem;"></yw-icon>
                <app-btn icon="yw-icon-close" @click="handleClose">关闭</app-btn>
            </div>
        </div>
        <div class="dispatch-schema--max__toolbar">
            <div class="toolbar-left">
                <el-radio-group
                    size="mini"
                    v-model="Category"
                    class="radio-theme--dark"
                    @change="refresh"
                >
                    <el-radio-button label="1">按单次调度</el-radio-button>
                    <el-radio-button label="2">按船只</el-radio-button>
                </el-radio-group>
            </div>
            <div class="toolbar-right">
                <el-input
                    class="input--theme-dark"
                    size="small"
                    :model-value="CurrentShipDispatchSchemeName"
                >
                    <template #suffix>
                        <yw-icon name="yw-icon-cog" class="suffix-icon" @click="openListEditor"></yw-icon>
                    </template>
                </el-input>
                <el-date-picker
                    class="input--theme-dark"
                    size="small"
                    v-model="DateTimes"
                                type="datetime"
                                format="YYYY-MM-DD HH:mm"

                    @change="refresh"
                ></el-date-picker>
                <div class="action-btns">
                    <span class="action-btn">
                        <yw-icon name="yw-icon-add" @click="addItem"></yw-icon>
                    </span>
                    <span class="action-btn">
                        <yw-icon name="yw-icon-wheel" @click="editItem"></yw-icon>
                    </span>
                    <span class="action-btn" @click="deleteItem">
                        <yw-icon name="yw-icon-delete"></yw-icon>
                    </span>
                </div>
            </div>
        </div>
        <div class="dispatch-schema--max__body" v-loading="loading">
            <div v-show="!loading">
                <template v-if="Category === '1'">
                    <item-single
                        size="large"
                        width="4rem"
                        height="1.4rem"
                        v-for="i in displayList"
                        :key="i.ShipDispatchSchemeDetailsId"
                        :item="i"
                        :status="i.SchedulingStatus"
                        :active="i.ShipDispatchSchemeDetailsId === CurrentDetailItem?.ShipDispatchSchemeDetailsId"
                        @click="onSingleItemClick(i)"
                    ></item-single>
                </template>
                <template v-else-if="Category === '2'">
                    <item-ship
                        v-for="i in displayList"
                        :key="i.ShipDispatchSchemeDetailsId"
                        :item="i"
                        :active-fn="(item: any) => item.ShipDispatchSchemeDetailsId === CurrentDetailItem?.ShipDispatchSchemeDetailsId"
                        @item-click="onShipItemClick"
                    ></item-ship>
                </template>
            </div>
        </div>
        <div class="dispatch-schema--max__footer">
            <app-legend
                :items="[
                    { color: 'rgb(113,128,137)', label: '历史调度' },
                    { color: 'rgb(91,214,144)', label: '最近一次调度' },
                    { color: 'rgb(36,128,221)', label: '待调度' },
                ]"
            ></app-legend>
        </div>
    </div>
    <!-- 调度内容编辑 -->
    <item-editor
        v-if="itemEditorVisible"
        v-model:visible="itemEditorVisible"
        :mode="itemEditorMode"
        @submit-success="onItemEditorSubmitSuccess"
    ></item-editor>

    <!-- 调度方案编辑 -->
    <detail-editor v-if="listEditorVisible" v-model:visible="listEditorVisible"></detail-editor>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive } from "vue";
import { useDispatchSchema } from "./useDispatchSchema";
import AppBtn from '@/components/AppBtn/index.vue';
import itemShip from "./item-ship.vue";
import ItemSingle from "./item-single.vue";
import ItemEditor from './item-editor.vue';
import DetailEditor from './list-editor.vue';
import AppLegend from '@/components/AppLegend/index.vue';

export default defineComponent({
    components: {
        AppLegend,
        AppBtn,
        itemShip,
        ItemSingle,
        ItemEditor,
        DetailEditor
    },
    setup() {
        // const query = reactive({
        //     Category: "1",
        //     DateTimes: new Date().stringify()
        // });
        const {
            query,
            handleClose,
            changeSize,
            refresh,
            loading,
            displayList,
            CurrentShipDispatchSchemeName,
            CurrentDetailItem,
            onSingleItemClick,
            onShipItemClick,
            itemEditorVisible, addItem, editItem, deleteItem, itemEditorMode, onItemEditorSubmitSuccess,
            listEditorVisible, openListEditor
        } = useDispatchSchema();
        const handleMini = () => {
            changeSize('mini');
        }

        return {
            ...query,
            handleMini,
            handleClose,
            refresh,
            loading,
            displayList,
            CurrentShipDispatchSchemeName,
            CurrentDetailItem,
            onSingleItemClick,
            onShipItemClick,
            itemEditorVisible, addItem, editItem, deleteItem, itemEditorMode, onItemEditorSubmitSuccess,
            listEditorVisible, openListEditor
        }
    }
});
</script>

<style lang="scss">
$videoBoxWidth: 2.52rem;
$videoBoxHeight: 1.6rem;
$leftWidth: 2.6rem;

$headerHeight: 0.8rem;
$toolbarHeight: 0.6rem;
$footerHeight: 0.6rem;
$bodyHeight: calc(100% - #{$headerHeight + $toolbarHeight + $footerHeight});
$contentPadding: 0 0.3rem;

.dispatch-schema--max {
    position: fixed;
    z-index: 6;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    background: rgba(2, 20, 43, 0.8);

    &__header {
        height: $headerHeight;
        padding: 0.3rem 0.4rem 0 $leftWidth;
        display: flex;
        align-items: center;
        justify-content: right;
        .header-title {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            width: 3rem;
            text-align: center;
            &::before {
                content: "";
                position: absolute;
                top: 0.05rem;
                bottom: 0.05rem;
                left: 0;
                right: 0;
                background-image: linear-gradient(
                    to right,
                    rgba(0, 0, 0, 0) 0%,
                    rgba(0, 0, 0, 0.8) 50%,
                    rgba(0, 0, 0, 0) 100%
                );
            }
            .app-title-line {
                height: 0.1rem;
            }
            &__inner {
                font-size: 0.19rem;
                font-weight: 600;
                letter-spacing: 0.02rem;
                z-index: 1;
                position: relative;
                .yw-icon {
                    margin-right: 0.05rem;
                }
            }
        }
        .header-tools {
            .yw-icon {
                width: 0.36rem;
                height: 0.28rem;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                border-radius: 0.03rem;
                transition: background-color 0.1s ease;
                font-size: 0.18rem;
                cursor: pointer;

                &:hover {
                    background: rgba(255, 255, 255, 0.1);
                }
                &:active {
                    background: rgba(255, 255, 255, 0.15);
                }
            }
        }
    }

    &__toolbar {
        height: $toolbarHeight;
        // background-color: rgba(0, 255, 213, 0.322);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: $contentPadding;

        .toolbar-left {
            display: flex;
        }
        .toolbar-right {
            display: flex;
            align-items: center;

            .el-input,
            .el-date-picker {
                width: 2rem;
                margin-right: 0.1rem;
            }

            .action-btns {
                display: flex;
                align-items: center;
                justify-content: space-around;
                height: 100%;
                .action-btn {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    padding: 0 0.3rem;

                    &:after {
                        content: "";
                        position: absolute;
                        right: 0;
                        top: 50%;
                        transform: translateY(-50%);
                        background-color: rgb(126, 139, 167);
                        height: 80%;
                        width: 0.01rem;
                    }

                    &:last-child {
                        &::after {
                            display: none;
                        }
                    }

                    .yw-icon {
                        font-size: 0.22rem;
                        cursor: pointer;
                        position: relative;
                        color: rgb(210, 212, 215);

                        &::after {
                            content: "";
                            position: absolute;
                            left: 50%;
                            top: 50%;
                            transform: translate(-50%, -50%);
                            width: 0;
                            height: 0;
                            border-radius: 50%;
                            background-color: rgba(255, 255, 255, 0.15);
                            opacity: 0;
                            transition: all 0.15s ease;
                        }

                        &:hover {
                            color: #fff;
                            &::after {
                                opacity: 1;
                                width: 180%;
                                height: 180%;
                            }
                        }
                    }
                }
            }
        }
    }

    &__body {
        padding-right: 0.2rem;
        height: $bodyHeight;
        // background-color: rgba(238, 130, 238, 0.356);
        overflow-y: auto;
        padding: $contentPadding;

        .item-single,
        .item-ship {
            float: left;
            margin-right: 0.15rem;
            margin-bottom: 0.15rem;
        }
    }

    &__footer {
        height: $footerHeight;
        // background-color: rgba(0, 255, 21, 0.219);
        padding: $contentPadding;
        display: flex;
        justify-content: right;
        padding-right: 0.3rem;
    }
}
</style>