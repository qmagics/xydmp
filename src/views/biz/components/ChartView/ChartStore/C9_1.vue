<template>
    <app-panel class="C9_1" width="100%" height="8rem" show-close @close="$emit('close')">
        <div class="C9_1__header">
            <div class="title" @click="refresh">
                <yw-icon name="yw-icon-a12"></yw-icon>
                <span>作业出勤详情</span>
            </div>
            <app-title-line></app-title-line>
        </div>

        <div class="C9_1__body">
            <el-table
                :data="table.data"
                class="table--theme-dark"
                border
                size="mini"
                stripe
                height="100%"
                v-loading="loading"
                :summary-method="getSummaries"
                show-summary
            >
                <el-table-column prop="Name" width="100">
                    <template #="{ row }">
                        <b>{{ row.Name }}</b>
                    </template>
                </el-table-column>
                <el-table-column
                    v-for="i in table.columns"
                    :key="i.prop"
                    width="100"
                    :prop="i.prop"
                    :label="i.label"
                    align="center"
                >
                    <template #="{ row }">
                        <span class="color-success">{{ row[i.prop]?.Count ?? '-' }}</span>
                        /{{ row[i.prop]?.Total ?? '-' }}
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </app-panel>
</template>

<script lang="ts">
import KanbanApi from '@/api/KanbanApi';
import { defineComponent, onMounted, reactive, ref } from 'vue';

interface Column {
    label: string;
    prop: string;
}

export default defineComponent({
    emits: ['close'],
    setup(props, { emit }) {
        const loading = ref(false);
        const onClose = () => {
            emit("close")
        }

        const table = reactive({
            data: [] as any[],
            columns: [] as Column[],
            all: {} as any
        });

        /** 获取数据 */
        const getData = async () => {
            loading.value = true;
            try {
                const { data } = await KanbanApi.getJobAttendanceDetails();

                const { Columns, List, All } = data.rows[0];

                table.columns = Columns.map((i: any) => {
                    return {
                        label: i.Name,
                        prop: i.Code
                    }
                });
                table.all = All[0];
                table.data = List;
            } finally {
                loading.value = false;
            }

            // mock
            // setTimeout(() => {
            //     // 接口数据格式
            //     const colNum = 10, rowNum = 5;
            //     const data = {
            //         "List": Array.from("0".repeat(rowNum)).map((i, index) => {
            //             const obj: any = {
            //                 "Name": `轮机组${index + 1}`,
            //             }
            //             for (let i = 0; i < rowNum; i++) {
            //                 obj[`F${i + 1}`] = { "Count": 2, "Total": 10 }
            //             }

            //             return obj;
            //         }),
            //         "Columns": Array.from("0".repeat(colNum)).map((i, index) => {
            //             return {
            //                 "Code": `F${index + 1}`,
            //                 "Name": `蓝色海洋${index + 1}`
            //             }
            //         }),
            //         // "Columns": [
            //         //     {
            //         //         "Code": "F1",
            //         //         "Name": "爱莎"
            //         //     },
            //         //     {
            //         //         "Code": "F2",
            //         //         "Name": "蓝色海洋"
            //         //     }
            //         // ],
            //         "All": Array.from("0".repeat(colNum)).reduce((pre: any, cur, index) => {
            //             // return {
            //             //     "Code": `F${index + 1}`,
            //             //     "Name": `蓝色海洋${index + 1}`
            //             // }
            //             pre[`F${index + 1}`] = {
            //                 Count: 10,
            //                 Total: 12,
            //             };

            //             return pre;

            //         }, {})
            //         // "All": {
            //         //     "F1": { "Count": 2, "Total": 10 },
            //         //     "F2": { "Count": 4, "Total": 6 },
            //         // }
            //     };
            //     console.log(JSON.stringify(data));
            //     table.columns = data.Columns.map(i => {
            //         return {
            //             label: i.Name,
            //             prop: i.Code
            //         }
            //     });
            //     table.all = data.All;
            //     table.data = data.List;

            //     console.log(table);

            //     loading.value = false;
            // }, 1000);
        }

        const getSummaries = () => {
            const arr = ['#'];

            table.columns.forEach((c, index) => {
                let str = '';
                const obj = table.all[c.prop];
                if (obj) {
                    str = `${obj.Count}/${obj.Total}`;
                }
                arr.push(str);
            });

            return arr;
        }

        onMounted(() => {
            getData();
        });

        return {
            getSummaries,
            loading,
            table,
            onClose,
            refresh: getData
        }
    }
})
</script>

<style lang="scss">
$headerHeight: 0.5rem;
.C9_1 {
    &__header {
        height: $headerHeight;

        .title {
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            font-size: 0.15rem;
            .yw-icon {
                margin-right: 0.05rem;
            }
        }
    }
    &__body {
        height: calc(100% - #{$headerHeight});
        .el-table {
            --el-table-header-background-color: rgb(23, 31, 36);
        }
    }
}
</style>