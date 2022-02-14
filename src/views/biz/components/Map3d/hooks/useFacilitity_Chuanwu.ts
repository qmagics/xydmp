import KanbanApi from "@/api/KanbanApi";
import { useStore } from "@/store";
import { ActionType } from "@/store/ActionType";
import { computed, ref, watch } from "vue";
import { LABEL_STYLE, MODEL_ICON_GIF_MAP } from "../d3config";

export default (viewer: any) => {
    const store = useStore();
    const ChuanwuState = store.state.D3ModelStateMap.Chuanwu;
    const chuanwu_parent_entity = viewer.entities.add(new zccity.Entity());
    chuanwu_parent_entity.show = ChuanwuState.showWidgets;

    // 船坞列表
    // const chuanwulist = ref<any[]>([]);
    const chuanwulist = computed({
        get: () => store.state.ChuanwuList,
        set: (val: any[]) => store.commit(ActionType.SET_CHUANWU_LIST, val)
    });

    // 渲染
    const render = () => {
        chuanwulist.value.forEach(chuanwu => {
            const { Name, Lat, Lng, Area, BId } = chuanwu;
            viewer.entities.add({
                id: BId,
                parent: chuanwu_parent_entity,
                position: zccity.Cartesian3.fromDegrees(Lat, Lng, 20),
                billboard: {
                    image: MODEL_ICON_GIF_MAP.Chuanwu,
                    disableDepthTestDistance: Number.POSITIVE_INFINITY,
                    heightReference: zccity.HeightReference.RELATIVE_TO_GROUND,
                    scale: 0.08,
                    show: ChuanwuState.showIcon,
                },
                label: {
                    ...LABEL_STYLE,
                    show: ChuanwuState.showLabel,
                    text: Name,
                }
            });
        });
    }

    // 刷新
    const refresh = async () => {
        // 获取模型数据
        const { data } = await KanbanApi.getModelList("BizDsDock");

        // 解析数据
        chuanwulist.value = data.rows.map(i => {
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
    watch(() => store.state.D3ModelStateMap.Chuanwu.showWidgets, (val) => {
        chuanwu_parent_entity.show = val;
    });

    // 默认执行一次
    refresh();
}