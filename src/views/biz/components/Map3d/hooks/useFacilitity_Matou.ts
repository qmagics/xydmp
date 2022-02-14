import KanbanApi from "@/api/KanbanApi";
import { useStore } from "@/store";
import { ActionType } from "@/store/ActionType";
import { computed, ref, watch } from "vue";
import { LABEL_STYLE, MODEL_ICON_GIF_MAP } from "../d3config";
// console.dir(zccity.Cartesian3)

export default (viewer: any) => {
    const store = useStore();
    const MatouState = store.state.D3ModelStateMap.Matou;
    const mt_parent_entity = viewer.entities.add(new zccity.Entity());
    mt_parent_entity.show = MatouState.showWidgets;

    // 码头列表
    // const matoulist = ref<any[]>([]);
    const matoulist = computed({
        get: () => store.state.MatouList,
        set: (val: any[]) => store.commit(ActionType.SET_MATOU_LIST, val)
    });

    // 渲染
    const render = () => {
        matoulist.value.forEach((matou: any) => {
            const { Name, Lat, Lng, Area, BId } = matou;
            viewer.entities.add({
                parent: mt_parent_entity,
                id: BId,
                position: zccity.Cartesian3.fromDegrees(Lat, Lng, 20),
                billboard: {
                    image: MODEL_ICON_GIF_MAP.Matou,
                    disableDepthTestDistance: Number.POSITIVE_INFINITY,
                    heightReference: zccity.HeightReference.RELATIVE_TO_GROUND,
                    scale: 0.08,
                    show: MatouState.showIcon,
                },
                label: {
                    ...LABEL_STYLE,
                    show: MatouState.showLabel,
                    text: Name
                }
            });

        })
    }

    // 刷新
    const refresh = async () => {
        // 获取模型数据
        const { data } = await KanbanApi.getModelList("BizDsWharf");

        // 解析数据
        matoulist.value = data.rows.map(i => {
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
    watch(() => store.state.D3ModelStateMap.Matou.showWidgets, (val) => {
        mt_parent_entity.show = val;
    });

    // 默认执行一次
    refresh();
}