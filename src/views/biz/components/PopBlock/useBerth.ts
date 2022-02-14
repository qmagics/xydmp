import { useStore } from "@/store";
import { reactive, ref, computed } from "vue";
import { RowClickEventHandlers } from "./util";

export default () => {
    const store = useStore();

    // 码头
    const table1 = reactive({
        data: computed(() => store.state.BaseInfo.BerthWharfList),
        typeMap: {
            "1": "danger",
            "2": "warning",
            "3": "success",
        } as any,
        getStatusObj(CurrentStatus: any) {
            return {
                type: this.typeMap[CurrentStatus],
            }
        }
    });

    // 锚点
    const table2 = reactive({
        data: computed(() => store.state.BaseInfo.BerthAnchorageList),
        typeMap: {
            "1": "danger",
            "2": "warning",
            "3": "success",
        } as any,
        getStatusObj(CurrentStatus: any) {
            return {
                type: this.typeMap[CurrentStatus],
            }
        }
    });

    // 船坞
    const table3 = reactive({
        data: computed(() => store.state.BaseInfo.BerthDockList),
        typeMap: {
            "1": "danger",
            "2": "warning",
            "3": "success",
        } as any,
        getStatusObj(CurrentStatus: any) {
            return {
                type: this.typeMap[CurrentStatus],
            }
        }
    });

    // 开航
    // const table4 = reactive({
    //     data: ref([

    //     ]),
    //     statusMap: {
    //         "1": {
    //             type: "success",
    //             text: "使用中 "
    //         },
    //         "2": {
    //             type: "warning",
    //             text: "停用 "
    //         }
    //     } as any
    // });

    // 表格行点击
    const onRowClick = (row: any, type: string) => {
        if (!type) return;

        const handler = RowClickEventHandlers[type];

        if (handler) {
            handler(row);
        }
    }

    return {
        onRowClick,
        table1,
        table2,
        table3,
        // table4,
    }
}