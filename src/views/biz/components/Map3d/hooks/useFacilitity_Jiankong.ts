import KanbanApi from "@/api/KanbanApi";
import { useStore } from "@/store";
import { ref, watch } from "vue";
import { LABEL_STYLE, MODEL_ICON_GIF_MAP } from "../d3config";

export default (viewer: any) => {
    const store = useStore();
    const JiankongState = store.state.D3ModelStateMap.Jiankong;
    const jk_parent_entity = viewer.entities.add(new zccity.Entity());
    jk_parent_entity.show = JiankongState.showWidgets;

    // 监控列表
    const jiankonglist = ref<any[]>([]);

    // 渲染
    const render = () => {
        jiankonglist.value.forEach(jiankong => {
            const { Name, Lat, Lng, Area, BId, Height } = jiankong;

            // 添加模型
            const model = zccity.Model.loadGltf({
                url: '/3d/model/equipment/JIANKONG.gltf',
                modelMatrix: zccity.Matrix4.fromTranslation(zccity.Cartesian3.fromDegrees(Lat, Lng, 5)),
                position: zccity.Cartesian3.fromDegrees(Lat, Lng, Height),
                id: BId,
                scale: 1,
                minimumPixelSize: 1,
            });
            viewer.scene.primitives.add(model);

            // 添加挂件
            viewer.entities.add({
                id: BId,
                parent: jk_parent_entity,
                position: zccity.Cartesian3.fromDegrees(Lat, Lng, (jiankong.Height + 3.5)),
                billboard: {
                    image: MODEL_ICON_GIF_MAP.Jiankong,
                    disableDepthTestDistance: Number.POSITIVE_INFINITY,
                    heightReference: zccity.HeightReference.RELATIVE_TO_GROUND,
                    scale: 0.08,
                    show: JiankongState.showIcon,
                },
                label: {
                    ...LABEL_STYLE,
                    show: JiankongState.showLabel,
                    text: Name
                }
            });
        })
    }

    // 刷新
    const refresh = async () => {
        // 获取模型数据
        const { data } = await KanbanApi.getModelList("BizDsCamera");

        // 解析数据
        jiankonglist.value = data.rows.map(i => {
            return {
                ...i,
                Lat: Number(i.Lat),
                Lng: Number(i.Lng),
                Height: Number(i.Height)
            }
        });

        render();
    }

    // 监听挂件状态
    watch(() => store.state.D3ModelStateMap.Jiankong.showWidgets, (val) => {
        jk_parent_entity.show = val;
    });

    // 默认执行一次
    refresh();
}