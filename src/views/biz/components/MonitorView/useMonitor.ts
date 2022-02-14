import MonitorApi from "@/api/MonitorApi";
import { useStore } from "@/store";
import { ActionType } from "@/store/ActionType";
import { reactive, ref } from "vue";

interface MonitorItem {
    CameraId: string;
    Name: string;
    Bitstream: string;
}

interface MonitorCategoryItem {
    Name: string;
}

/** 监控逻辑 */
export default (initialQuery?: Record<string, any>) => {
    const store = useStore();
    const loading = ref(false);

    // 监控列表数据
    const monitorList = ref<MonitorItem[]>([]);

    // 查询条件
    const query = reactive(initialQuery || { Key: '' });

    // 刷新监控数据
    const refresh = async () => {
        try {
            loading.value = true;
            const { data } = await MonitorApi.getMonitorList(query);
            monitorList.value = data.rows;
        } finally {
            loading.value = false;
        }
    }

    // 切换面板大小
    const changeSize = (size: string) => {
        store.commit(ActionType.SET_MONITOR_VIEW_SIZE, size);
    }

    // 切换面板开关
    const handleClose = () => {
        store.commit(ActionType.SET_MONITOR_VIEW_TOGGLE, false)
    }

    return {
        refresh,
        query,
        handleClose,
        changeSize,
        monitorList,
        loading
    }
}

/** 监控分类逻辑 */
export const useMonitorCategory = () => {
    const loading = ref(false);

    // 监控分类数据
    const monitorCategoryList = ref<MonitorCategoryItem[]>([]);

    // 刷新监控分类数据
    const refresh = async () => {
        try {
            loading.value = true;

            const { data } = await MonitorApi.getMonitorCategory();
            monitorCategoryList.value = data.rows;
        } finally {
            loading.value = false;
        }
    }

    return {
        monitorCategoryList,
        loading,
        refresh
    }
}