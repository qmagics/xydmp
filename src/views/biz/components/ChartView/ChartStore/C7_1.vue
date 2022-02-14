<template>
    <app-panel class="C7_1" show-close @close="$emit('close')">
        <div class="container">
            <el-table
                :data="table.data"
                height="100%"
                class="table--theme-dark table--linear-border"
                v-loading="table.loading"
                @row-click="onRowClick"
            >
                <el-table-column prop="ShipName" label="船名" :width="120" show-overflow-tooltip></el-table-column>
                <el-table-column prop="Title" label="风险标题" show-overflow-tooltip></el-table-column>
                <el-table-column prop="RiskDate" label="风险日期" :width="150" show-overflow-tooltip>
                    <template #="{ row }">{{ $filters.time(row.RiskDate) }}</template>
                </el-table-column>
            </el-table>
        </div>

        <template #around>
            <div class="around-tabs">
                <el-tabs
                    v-model="currentTabValue"
                    type="card"
                    tab-position="left"
                    @tab-click="getTableData"
                >
                    <el-tab-pane
                        v-for="tab in tabItems"
                        :key="tab.Type"
                        :label="tab.TypeName"
                        :name="tab.Type"
                    ></el-tab-pane>
                </el-tabs>
            </div>
        </template>
    </app-panel>

    <el-dialog custom-class="blur-dialog C7_1-detail-dlg" v-model="dlg.visible" width="7rem">
        <app-panel height="7rem" show-close @close="dlg.visible = false">
            <el-form label-width="100px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="关联船舶">
                            <el-input disabled :model-value="dlg.vm.ShipName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="风险标题">
                            <el-input disabled :model-value="dlg.vm.Title"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="填报人">
                            <el-input disabled :model-value="dlg.vm.Reporter"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="风险日期">
                            <el-input disabled :model-value="$filters.time(dlg.vm.RiskDate)"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col>
                        <el-form-item label="风险内容">
                            <div class="html-content" v-html="dlg.vm.Content"></div>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col>
                        <el-form-item label="解决措施">
                            <div class="html-content" v-html="dlg.vm.Solutions"></div>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </app-panel>
    </el-dialog>
</template>
<script lang="ts">
import { defineComponent, ref, PropType, computed, onMounted, reactive, getCurrentInstance, watch } from "vue";
import AppTabs, { TabItem } from "@/components/AppTabs/index.vue";
import KanbanApi from "@/api/KanbanApi";

export default defineComponent({
    props: {
        item: {
            type: Object,
            required: true
        }
    },
    components: {
        AppTabs,
    },
    emits: ['close'],
    setup(props) {

        // tabs标签页
        const tabItems = ref<any[]>([]);
        const currentTabValue = ref((props.item as any).Type);
        const getTabItems = async () => {
            const { bl, msg, data } = await KanbanApi.getDictionaryRiskType();
            if (bl) {
                tabItems.value = data.rows;
            }
        }

        // 表格数据
        const table = reactive({
            data: [],
            loading: false,
        });
        const getTableData = async () => {
            try {
                table.loading = true;
                const { bl, msg, data } = await KanbanApi.getDailySafetyRiskSecond(currentTabValue.value);
                if (bl) {
                    table.data = data.rows as any;
                }
            } finally {
                table.loading = false;
            }
        }

        // 刷新
        const init = async () => {
            table.data = [];
            currentTabValue.value = props.item.Type;
            await getTabItems();
            getTableData();
        }

        // 行点击展示详情 
        const onRowClick = async (row: any) => {
            try {
                table.loading = true;
                const { Id } = row;
                const { bl, data } = await KanbanApi.getDailySafetyRiskThird(Id);
                if (bl) {
                    dlg.vm = data.rows[0];
                    table.loading = false;
                    dlg.visible = true;
                }
            } finally {
                table.loading = false;
            }
        }
        const dlg = reactive({
            visible: false,
            vm: null as any,
        })

        // 监听
        watch(() => props.item, () => {
            init();
        });

        onMounted(() => {
            init();
        });

        return {
            onRowClick,
            table,
            tabItems,
            currentTabValue,
            getTableData,
            dlg
        }
    }
});
</script>

<style lang="scss">
$aroundTabsWidth: 0.36rem;
$itemWidth: 0.3rem;
.C7_1 {
    height: 6rem;
    width: calc(100% - #{$aroundTabsWidth});
    float: right;
    .container {
        height: 100%;

        tr {
            cursor: pointer;
        }
    }

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
.C7_1-detail-dlg {
    padding: 0.2rem;
    .app-panel__bg {
        background-color: rgb(41, 75, 107);
    }

    .el-form-item {
        &__label {
            color: #fff;
        }
        &__content {
            color: rgb(189, 194, 205);
            .html-content {
                padding-top: 0.1rem;
                p {
                    line-height: 1.5;
                }
            }
        }
        .el-input__inner {
            background: transparent !important;
            border: none;
            color: rgb(189, 194, 205);
        }
    }
}
</style>
