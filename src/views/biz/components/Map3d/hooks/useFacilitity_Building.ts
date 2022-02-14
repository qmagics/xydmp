import KanbanApi from "@/api/KanbanApi";
import { useStore } from "@/store";
import { ActionType } from "@/store/ActionType";
import { computed, ref, watch } from "vue";
import { LABEL_STYLE, MODEL_ICON_GIF_MAP } from "../d3config";

export default (viewer: any) => {
    const store = useStore();
    const BuildingState = store.state.D3ModelStateMap.Building;
    const building_parent_entity = viewer.entities.add(new zccity.Entity());
    building_parent_entity.show = BuildingState.showWidgets;

    // 建筑列表
    // const buildinglist = ref<any[]>([]);
    const buildinglist = computed({
        get: () => store.state.BuildingList,
        set: (val: any[]) => store.commit(ActionType.SET_BUILDING_LIST, val)
    });

    // 渲染
    const render = () => {
        buildinglist.value.forEach(building => {
            const { Name, Lat, Lng, Area, BId } = building;
            viewer.entities.add({
                id: BId,
                parent: building_parent_entity,
                position: zccity.Cartesian3.fromDegrees(Lat, Lng, 20),
                billboard: {
                    image: MODEL_ICON_GIF_MAP.Building,
                    disableDepthTestDistance: Number.POSITIVE_INFINITY,
                    heightReference: zccity.HeightReference.RELATIVE_TO_GROUND,
                    scale: 0.08,
                    show: BuildingState.showIcon,
                },
                label: {
                    ...LABEL_STYLE,
                    show: BuildingState.showLabel,
                    text: Name
                }
            });
        });
    }

    // 刷新
    const refresh = async () => {
        // 获取模型数据
        const { data } = await KanbanApi.getModelList("BizDsHouse");

        // 解析数据
        buildinglist.value = data.rows.map(i => {
            let Area = [];
            try {
                Area = JSON.parse(i.Area);
            } catch (error) {
            }

            return {
                ...i,
                Area,
                Lat: Number(i.Lat),
                Lng: Number(i.Lng),
            }
        });

        render();
    }

    // 监听挂件状态
    watch(() => store.state.D3ModelStateMap.Building.showWidgets, (val) => {
        building_parent_entity.show = val;
    });

    // 默认执行一次
    refresh();
}