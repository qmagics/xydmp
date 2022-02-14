import KanbanApi from "@/api/KanbanApi";
import { useStore } from "@/store";
import { ref, watch } from "vue";
import { LABEL_STYLE, MODEL_ICON_GIF_MAP } from "../d3config";

export default (viewer: any) => {
    const store = useStore();
    const MaodiState = store.state.D3ModelStateMap.Maodi;
    const mao_parent_entity = viewer.entities.add(new zccity.Entity());
    mao_parent_entity.show = MaodiState.showWidgets;

    // 锚地列表
    const maolist = ref<any[]>([]);

    // 渲染
    const render = () => {
        maolist.value.forEach(mao => {
            const { Name, Lat, Lng, Area, BId, Height } = mao;

            // 添加模型
            const model = zccity.Model.loadGltf({
                url: '/3d/model/equipment/mao.gltf',
                modelMatrix: zccity.Matrix4.fromTranslation(zccity.Cartesian3.fromDegrees(Lat, Lng, 0)),
                position: zccity.Cartesian3.fromDegrees(Lat, Lng, 0),
                id: BId,
                scale: 1,
                minimumPixelSize: 16,
            });
            viewer.scene.primitives.add(model);

            // 添加挂件
            viewer.entities.add({
                id: BId,
                parent: mao_parent_entity,
                position: zccity.Cartesian3.fromDegrees(Lat, Lng, 10),
                billboard: {
                    image: MODEL_ICON_GIF_MAP.Mao,
                    disableDepthTestDistance: Number.POSITIVE_INFINITY,
                    heightReference: zccity.HeightReference.RELATIVE_TO_GROUND,
                    scale: 0.08,
                    show: MaodiState.showIcon,
                },
                label: {
                    ...LABEL_STYLE,
                    show: MaodiState.showLabel,
                    text: Name,
                }
            });
        })
    }

    // 刷新
    const refresh = async () => {
        // 获取模型数据
        const { data } = await KanbanApi.getModelList("BizDsAnchorage");

        // 解析数据
        maolist.value = data.rows.map(i => {
            return {
                ...i,
                Lat: Number(i.Lat),
                Lng: Number(i.Lng),
                Height: Number(i.Height),
                Name: i.Anchor_Point
            }
        });

        render();
    }

    // 监听挂件状态
    watch(() => store.state.D3ModelStateMap.Maodi.showWidgets, (val) => {
        mao_parent_entity.show = val;
    });

    // 默认执行一次
    refresh();
}