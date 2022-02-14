import { ref, Ref, computed, ComputedRef } from "vue"
import { store } from "@/store";
import { BaseInfoVM } from "@/api/KanbanApi.type";

interface TopItem {
    label?: string;
    value?: ComputedRef;
    bizType?: 'Matou' | 'Maodi' | 'Chuanwu' | 'Kaihang';
}

export default (data: Ref<BaseInfoVM>) => {
    const topLeftItems = ref<TopItem[]>([
        {
            label: "员工情况",
            value: computed(() => data.value.EmployeeCount),
        },
        {
            label: "今日出勤",
            value: computed(() => data.value.Attendance),
        },
    ]);

    const topRightItems = ref<TopItem[]>([
        {
            label: "码头",
            value: computed(() => data.value.BerthWharfCount),
            bizType: "Matou"
        },
        {
            label: "锚点",
            value: computed(() => data.value.BerthAnchorageCount),
            bizType: "Maodi"
        },
        {
            label: "船坞",
            value: computed(() => data.value.BerthDockCount),
            bizType: "Chuanwu"
        },
    ]);

    const onTopItemClick = (item?: TopItem) => {
        store.dispatch("openPopBlock", { type: 'Berth', activePanelTab: item?.bizType || 'Matou' });
    }

    return {
        topLeftItems,
        topRightItems,
        onTopItemClick
    }
}