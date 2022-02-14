import { useStore } from "@/store";
import { computed, reactive } from "vue";
import { cameraFlyTo, getShipFromStoreById } from "../Map3d/utils";
import { RowClickEventHandlers } from "./util";

export default () => {
    const store = useStore();

    // 厂房
    const table1 = reactive({
        data: computed(() => store.state.BaseInfo.BuildingList),
        typeMap: {
            "1": "success",
            "2": "warning",
            "3": "danger",
        } as any,
        getStatusObj(CurrentStatus: any) {
            return {
                type: this.typeMap[CurrentStatus],
            }
        }
    });

    // 码头
    const table2 = reactive({
        data: computed(() => store.state.BaseInfo.WharfList),
        typeMap: {
            "1": "success",
            "2": "warning",
            "3": "danger",
        } as any,
        getStatusObj(CurrentStatus: any) {
            return {
                type: this.typeMap[CurrentStatus],
            }
        }
    });

    // 船坞
    const table3 = reactive({
        data: computed(() => store.state.BaseInfo.DockList),
        typeMap: {
            "1": "success",
            "2": "warning",
            "3": "danger",
        } as any,
        getStatusObj(CurrentStatus: any) {
            return {
                type: this.typeMap[CurrentStatus],
            }
        }
    });

    // 船只
    const table4 = reactive({
        data: computed(() => store.state.BaseInfo.ShipAllList),
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

    // 锚地
    const table5 = reactive({
        data: computed(() => store.state.BaseInfo.AnchorageList)
    });

    // 设备
    const table6 = reactive({
        data: computed(() => store.state.BaseInfo.CraneList),
        typeMap: {
            "1": "success",
            "2": "warning",
            "3": "danger",
        } as any,
        getStatusObj(CurrentStatus: any) {
            return {
                type: this.typeMap[CurrentStatus],
            }
        }
    });

    // 监控
    const table7 = reactive({
        data: computed(() => store.state.BaseInfo.CameraList),
        typeMap: {
            "1": "success",
            "2": "warning",
            "3": "danger",
        } as any,
        getStatusObj(CurrentStatus: any) {
            return {
                type: this.typeMap[CurrentStatus],
            }
        }
    });

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
        table4,
        table5,
        table6,
        table7,
    }
}