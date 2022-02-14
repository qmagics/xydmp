import { BaseInfoVM } from "@/api/KanbanApi.type";
import { FacilityType } from "@/service/facility/facility.interface";
import { store, useStore } from "@/store";
import { ActionType } from "@/store/ActionType";
import { ref, Ref, ComputedRef, computed } from "vue";

interface BottomItem {
    icon: string;
    value?: ComputedRef;
    active: boolean;
    bizType?: FacilityType;
    handler?: (newIsActive: boolean) => void;
}

export default (data: Ref<BaseInfoVM>) => {

    const store = useStore();

    // 底部中间项
    const bottomCenterItem = ref<BottomItem>({
        icon: "yw-icon-ship",
        active: false,
        value: computed(() => data.value.ShipAllCount),
        bizType: "Chuanzhi",
        handler: (newIsActive) => {
            store.commit(ActionType.SET_MODEL_STATE, { name: "Ship", key: "showWidgets", value: newIsActive });
        }
    });

    // 底部左侧项
    const bottomLeftItems = ref<BottomItem[]>([
        {
            icon: "yw-icon-chejian",
            bizType: "Changfang",
            value: computed(() => data.value.BuildingCount),
            active: false,
            handler: (newIsActive) => {
                store.commit(ActionType.SET_MODEL_STATE, { name: "Building", key: "showWidgets", value: newIsActive });
            }
        },
        {
            icon: "yw-icon-ship-stop",
            bizType: "Matou",
            value: computed(() => data.value.WharfCount),
            active: false,
            handler: (newIsActive) => {
                store.commit(ActionType.SET_MODEL_STATE, { name: "Matou", key: "showWidgets", value: newIsActive });
            }
        },
        {
            icon: "yw-icon-ship-chuanwu",
            bizType: "Chuanwu",
            value: computed(() => data.value.DockCount),
            active: false,
            handler: (newIsActive) => {
                store.commit(ActionType.SET_MODEL_STATE, { name: "Chuanwu", key: "showWidgets", value: newIsActive });
            }
        }
    ]);

    // 底部右侧项
    const bottomRightItems = ref<BottomItem[]>([
        {
            icon: "yw-icon-maodi",
            bizType: "Maodi",
            value: computed(() => data.value.AnchorageCount),
            active: false,
            handler: (newIsActive) => {
                store.commit(ActionType.SET_MODEL_STATE, { name: "Maodi", key: "showWidgets", value: newIsActive });
            }
        },
        {
            icon: "yw-icon-diaoji",
            bizType: "Shebei",
            value: computed(() => data.value.CraneCount),
            active: false,
            handler: (newIsActive) => {
                store.commit(ActionType.SET_MODEL_STATE, { name: "Menji", key: "showWidgets", value: newIsActive });
            }
        },
        {
            icon: "yw-icon-monitor",
            bizType: "Jiankong",
            value: computed(() => data.value.CameraCount),
            active: false,
            handler: (newIsActive) => {
                store.commit(ActionType.SET_MODEL_STATE, { name: "Jiankong", key: "showWidgets", value: newIsActive });
            }
        }
    ]);

    // 取消所有项的高亮状态
    // const setAllItemsInactived = () => {
    //     bottomLeftItems.value.forEach(i => {
    //         i.active = false;
    //     });
    //     bottomRightItems.value.forEach(i => {
    //         i.active = false;
    //     });
    //     bottomCenterItem.value.active = false;
    // };

    // 项点击事件
    const onBottomItemClick = (item: BottomItem) => {
        if (item.active) {
            item.active = false;
        }
        else {
            // 需要互斥的话，执行这个方法
            // setAllItemsInactived();
            item.active = true;
        }

        if (item.active) {
            // 打开右下角气泡面板，并设置当前显示的bizType
            store.dispatch("openPopBlock", { type: 'Facilities', activePanelTab: item.bizType });

            // 显示对应三维模型的label
        }
        else {
            /** 全都处于未点亮状态，则关闭PopBlock */
            if ([...bottomLeftItems.value, bottomCenterItem.value, ...bottomRightItems.value].every(i => i.active === false)) {
                store.dispatch("closePopBlock");
            }
        }

        // 点击事件处理,传入变更后的状态
        item.handler && item.handler(item.active);
    };

    return {
        bottomCenterItem,
        bottomLeftItems,
        bottomRightItems,
        onBottomItemClick
    }
}