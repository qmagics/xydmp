<template>
    <dispatch-tab-item
        class="dispatch-schema--mini"
        :value="TabItemValue"
        label="船舶调度方案"
        icon="yw-icon-exchange"
    >
        <div class="dispatch-schema--mini__header">
            <div class="header-left">
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
            <div class="header-right">
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
                                format="YYYY-MM-DD HH:mm"
                                type="datetime"
                    v-model="DateTimes"
                    @change="refresh"
                ></el-date-picker>
                <yw-icon name="icon-btn yw-icon-max" @click="handleMax"></yw-icon>
                <yw-icon name="icon-btn yw-icon-close" @click="handleClose"></yw-icon>
            </div>
        </div>
        <div class="dispatch-schema--mini__body" v-loading="loading">
            <div v-show="!loading">
                <app-scroll-list>
                    <template v-if="Category === '1'">
                        <item-single
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
                </app-scroll-list>
            </div>
        </div>
        <template #actions>
            <div class="dispatch-schema--mini__actions dispatch-tab-actions">
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
        </template>
        <template #footer>
            <div class="dispatch-schema--mini__footer">
                <app-legend
                    :items="[
                        { color: 'rgb(113,128,137)', label: '历史调度' },
                        { color: 'rgb(91,214,144)', label: '最近一次调度' },
                        { color: 'rgb(36,128,221)', label: '待调度' },
                    ]"
                ></app-legend>
            </div>
        </template>
    </dispatch-tab-item>

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
import { DispatchMode } from "@/store/modules/dispatch/state";
import { computed, defineComponent, onMounted, reactive, toRefs, watch } from "vue";
import DispatchTabItem from '../components/dashboard-tabs/item.vue';
import AppLegend from '@/components/AppLegend/index.vue';
import { useDispatchSchema } from "./useDispatchSchema";
import AppScrollList from '@/components/AppScrollList/index.vue';
import itemShip from "./item-ship.vue";
import ItemSingle from "./item-single.vue";
import ItemEditor from './item-editor.vue';
import DetailEditor from './list-editor.vue';

export default defineComponent({
    components: {
        AppLegend,
        DispatchTabItem,
        AppScrollList,
        itemShip,
        ItemSingle,
        ItemEditor,
        DetailEditor
    },
    setup() {
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

        const handleMax = () => changeSize('max');

        return {
            ...query,
            handleClose,
            handleMax,
            TabItemValue: DispatchMode.DIAPATCH_SCHEME,
            refresh,
            displayList,
            loading,
            onSingleItemClick,
            onShipItemClick,

            CurrentDetailItem,
            CurrentShipDispatchSchemeName,

            itemEditorVisible,
            addItem, editItem, deleteItem, itemEditorMode, onItemEditorSubmitSuccess,

            listEditorVisible,
            openListEditor
        }
    }
})
</script>

<style lang="scss">
$headerHeight: 0.48rem;
.dispatch-schema--mini {
    &__header {
        height: $headerHeight;
        padding: 0 0.1rem 0 2rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .header-left {
        }
        .header-right {
            display: flex;
            align-items: center;

            .el-input,
            .el-date-picker {
                width: 2rem;
                margin-right: 0.1rem;
            }
            .el-button {
                margin-right: 0.1rem;
            }

            .icon-btn {
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
    &__body {
        height: calc(100% - #{$headerHeight});
        .item-single,
        .item-ship {
            float: left;
            margin-right: 0.1rem;
        }
    }
    &__actions {
    }
    &__footer {
        display: flex;
        align-items: center;
        justify-content: right;
        height: 100%;
        padding-right: 0.3rem;
    }
}
</style>


