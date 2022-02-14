<template>
    <el-dialog custom-class="blur-dialog list-editor" width="9rem" v-model="dlgVisible">
        <app-panel width="100%" height="7.6rem">
            <div class="list-editor__header">
                <div class="title">
                    <yw-icon name="yw-icon-edit"></yw-icon>&nbsp;调度方案设置
                </div>
                <app-title-line></app-title-line>
            </div>
            <div class="list-editor__toolbar">
                <div class="toolbar-searchbar">
                    <el-input
                        class="input--theme-dark"
                        v-model="query.Key"
                        size="mini"
                        placeholder="请输入方案编码 / 方案名称"
                    ></el-input>
                    <el-button @click="refreshTable" size="mini" type="primary">搜索</el-button>
                </div>
                <div class="toolbar-actions">
                    <el-button size="mini" type="primary" @click="addRow">
                        <yw-icon name="yw-icon-add"></yw-icon>
                    </el-button>
                </div>
            </div>
            <div class="list-editor__body">
                <el-table
                    class="table--theme-dark table--linear-border table--no-hover-bg"
                    height="100%"
                    :data="tableData"
                    v-loading="loading"
                    highlight-current-row
                    ref="tableRef"
                    @current-change="handleCurrentRowChange"
                >
                    <el-table-column prop="Code" min-width="150" align="center">
                        <template #header>
                            <i style="color:red;">*&nbsp;</i>调度方案编码
                        </template>
                        <template #="{ row }">
                            <el-input class="input--theme-dark" v-model="row.Code" size="mini"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column prop="Name" min-width="150" align="center">
                        <template #header>
                            <i style="color:red;">*&nbsp;</i>调度方案名称
                        </template>
                        <template #="{ row }">
                            <el-input class="input--theme-dark" v-model="row.Name" size="mini"></el-input>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column label="操作" min-width="100" align="center">
                        <template #="{ row }">
                            <el-button type="primary" size="mini" @click="genPlan(row)">生成计划</el-button>
                        </template>
                    </el-table-column>-->
                    <el-table-column label="状态" min-width="100" align="center">
                        <template #="{ row }">
                            <span class="color-success" v-if="row.CreateShipDispatchTaskMark">已生成</span>
                            <span class="color-warning" v-else>未生成</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="生成时间" min-width="100" align="center">
                        <template #="{ row }">
                            <span>{{$filters.time(row.CreateShipDispatchTaskTime)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" min-width="100" align="center">
                        <template #="{ row, $index }">
                            <div class="icon-btns">
                                <el-tooltip content="删除">
                                    <yw-icon name="yw-icon-delete" @click="delRow(row, $index)"></yw-icon>
                                </el-tooltip>

                                <el-tooltip content="生成计划">
                                    <yw-icon name="yw-icon-gen" @click="genPlan(row)"></yw-icon>
                                </el-tooltip>

                                <el-tooltip content="保存">
                                    <yw-icon name="yw-icon-save" @click="saveRow(row)"></yw-icon>
                                </el-tooltip>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="list-editor__footer">
                <div class="footer-pager">
                    <el-pagination
                        class="pagination--theme-dark"
                        :page-size="pager.pageSize"
                        :pager-count="pager.pagerCount"
                        :layout="pager.layout"
                        :total="pager.total"
                        v-model:current-page="pager.pageIndex"
                        @current-change="onPagerCurrentChange"
                    ></el-pagination>
                </div>
                <div>
                    <el-button type="primary" size="mini" @click="confirm">确认</el-button>
                    <el-button type="info" size="mini" @click="cancel">取消</el-button>
                </div>
            </div>
        </app-panel>
    </el-dialog>
</template>

<script lang="ts">
import DispatchApi from '@/api/DispatchApi';
import { useStore } from '@/store';
import { MutationTypes } from '@/store/modules/dispatch/mutation-types';
import { DispatchSchemeDetail } from '@/store/modules/dispatch/state';
import { $confirm, $message } from '@/utils';
import { computed, defineComponent, onBeforeUnmount, onMounted, reactive, ref, toRefs, watch } from 'vue';

export default defineComponent({
    props: {
        visible: Boolean
    },
    emits: ['update:visible'],
    setup(props, { emit }) {
        const store = useStore();

        // 查询参数
        const query = reactive({
            Key: "",
        });

        // 分页管理
        const pager = reactive({
            pageSize: 10,
            pagerCount: 6,
            layout: "prev, pager, next",
            pageIndex: 1,
            total: 0
        });
        const onPagerCurrentChange = () => {
            search();
        }

        // 表格loading
        const loading = ref(false);

        // 搜索条件
        const searchParams = computed(() => {
            return {
                ...query,
                pageSize: pager.pageSize,
                pageIndex: pager.pageIndex
            }
        })

        // 表格数据
        const tableData = ref<any[]>([]);

        // 表格实例
        const tableRef = ref();

        // 全局调度方案列表数据
        const DispatchSchemeList = computed(() => store.state.Dispatch.DispatchSchemeList);

        // 监听全局调度方案列表数据
        watch(DispatchSchemeList, list => {
            tableData.value = list;
        }, { deep: true, immediate: true });

        // 生成计划
        const genPlan = (row: DispatchSchemeDetail) => {
            // alert("生成计划")
        }

        // 删除行 
        const delRow = async (row: any, index: number) => {
            const ShipDispatchSchemeId = row.ShipDispatchSchemeId;

            // 删除数据库项
            if (ShipDispatchSchemeId) {
                $confirm(`是否确认删除方案【${row.Name}】？`).then(async () => {
                    try {
                        loading.value = true;
                        const { bl, msg } = await DispatchApi.deleteShipDispatchScheme({ ShipDispatchSchemeId });
                        if (bl) {
                            $message(msg);
                            refreshTable();
                        }
                    } finally {
                        loading.value = false;
                    }
                })
            }
            // 删除本地项
            else {
                tableData.value.splice(index, 1);
            }
        }

        // 校验行
        const validateRow = (row: any) => {
            if (row.Name === '' || row.Name === null) {
                $message('方案名称不得为空');
                return false;
            }

            if (row.Code === '' && row.Code === null) {
                $message('方案编码不得为空');
                return false;
            }

            return true;
        }

        // 新增行 
        const addRow = (index: number = tableData.value.length - 1) => {
            const newRow: any = {
                Name: "",
                Code: "",
            }
            tableData.value.splice(index, 0, newRow);
        }

        // 保存行
        const saveRow = async (row: any) => {

            const passed = validateRow(row);

            if (!passed) return;

            // update
            if (row.ShipDispatchSchemeId) {
                try {
                    loading.value = true;
                    const { bl, msg } = await DispatchApi.updateShipDispatchScheme(row);

                    if (bl) {
                        $message(msg);
                        refreshTable();
                    }
                } finally {
                    loading.value = false;
                }
            }

            // add
            else {
                try {
                    loading.value = true;
                    const { bl, msg } = await DispatchApi.addShipDispatchScheme(row);

                    if (bl) {
                        $message(msg);
                        refreshTable();
                    }
                } finally {
                    loading.value = false;
                }
            }
        }

        // 弹窗是否显示
        const dlgVisible = computed({
            get: () => props.visible,
            set: v => emit('update:visible', v)
        });

        // 初始化
        const init = () => {
            // 刷新表格
            refreshTable();

            //  重置newShipDispatchSchemeToSet
            const { CurrentShipDispatchSchemeId, CurrentShipDispatchSchemeName, CurrentShipDispatchSchemeCode } = store.state.Dispatch;
            newShipDispatchSchemeToSet.value = {
                ShipDispatchSchemeId: CurrentShipDispatchSchemeId,
                Name: CurrentShipDispatchSchemeName,
                Code: CurrentShipDispatchSchemeCode
            };
        }

        // 重置
        const reset = () => {
            pager.total = 0;
            pager.pageIndex = 1;
        }

        // 搜索
        const search = async () => {
            try {
                loading.value = true;
                const { bl, data, msg } = await DispatchApi.getSchedulingSchemeList(searchParams.value);

                const { rows, total } = data;

                if (bl) {
                    tableData.value = rows;
                    pager.total = total as number;
                }
            } finally {
                loading.value = false;
            }
        }

        // 刷新
        const refreshTable = () => {
            pager.pageIndex = 1;
            search();
        }


        // 新设置的当前调度方案对象
        const newShipDispatchSchemeToSet = ref({
            ShipDispatchSchemeId: store.state.Dispatch.CurrentShipDispatchSchemeId,
            Name: store.state.Dispatch.CurrentShipDispatchSchemeName,
            Code: store.state.Dispatch.CurrentShipDispatchSchemeCode
        });

        // 表格当前选中项变更 
        const handleCurrentRowChange = (row: any) => {
            if (row && row.ShipDispatchSchemeId) {
                const { Name, Code, ShipDispatchSchemeId } = row;

                newShipDispatchSchemeToSet.value.ShipDispatchSchemeId = ShipDispatchSchemeId;
                newShipDispatchSchemeToSet.value.Name = Name;
                newShipDispatchSchemeToSet.value.Code = Code;
            }
        }

        // 确认
        const confirm = () => {
            const { ShipDispatchSchemeId, Name, Code } = newShipDispatchSchemeToSet.value;
            store.commit(MutationTypes.DISPATCH__SET_SHIP_DISPATCH_SCHEME_ID, ShipDispatchSchemeId);
            store.commit(MutationTypes.DISPATCH__SET_SHIP_DISPATCH_SCHEME_NAME, Name);
            store.commit(MutationTypes.DISPATCH__SET_SHIP_DISPATCH_SCHEME_CODE, Code);

            dlgVisible.value = false;
        }

        // 取消
        const cancel = () => {
            dlgVisible.value = false;
        }

        // 监听窗口开关
        // watch(dlgVisible, val => {
        //     if (val === true) {
        //         init();
        //     } else {
        //         reset();
        //     }
        // });
        onMounted(() => {
            init();
        });
        onBeforeUnmount(() => {
            reset();
        });

        // 监听CurrentShipDispatchSchemeId变化，自动选中表格行
        watch([() => store.state.Dispatch.CurrentShipDispatchSchemeId, tableData], ([id]) => {
            const currentRow = tableData.value.find(i => id === i.ShipDispatchSchemeId);

            if (currentRow) {
                tableRef.value.setCurrentRow(currentRow);
            }
        }, { deep: true });

        return {
            query,
            dlgVisible,
            tableData,
            genPlan,
            delRow,
            addRow,
            pager,
            confirm,
            cancel,
            refreshTable,
            saveRow,
            loading,
            onPagerCurrentChange,
            handleCurrentRowChange,
            tableRef
        }
    }
});
</script>

<style lang="scss">
$headerHeight: 0.4rem;
$toolbarHeight: 0.4rem;
$footerHeight: 0.5rem;

.list-editor {
    margin-top: 1rem;

    &__header {
        height: $headerHeight;

        .title {
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 0.17rem;
            font-weight: bold;
        }
    }

    &__toolbar {
        height: $toolbarHeight;
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        padding: 0 0.1rem;

        .toolbar {
            &-searchbar {
                display: flex;
                .el-input {
                    width: 3rem;
                }
                .el-button {
                    margin-left: 0.1rem;
                }
            }
            &-actions {
            }
        }
    }

    &__body {
        height: calc(
            100% - #{$toolbarHeight} - #{$headerHeight} - #{$footerHeight}
        );
        overflow-y: auto;
    }

    &__footer {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        height: $footerHeight;

        .footer-pager {
            .el-pagination {
                display: flex;
                align-items: center;
            }
        }
    }

    .icon-btns {
        font-size: 0.16rem;
        .yw-icon {
            margin: 0 0.05rem;
            cursor: pointer;
        }
    }
}
</style>