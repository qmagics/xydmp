import KanbanApi from "@/api/KanbanApi";
import { useStore } from "@/store";
import { ActionType } from "@/store/ActionType";
import { watch, shallowRef, computed } from "vue";
import { MODEL_ICON_GIF_MAP } from "../d3config";

export default (viewer: any, zccityTool: any) => {
    const store = useStore();
    const MenjiState = store.state.D3ModelStateMap.Menji;

    const mj_parent_entity = viewer.entities.add(new zccity.Entity());
    mj_parent_entity.show = MenjiState.showWidgets;

    const entitym = viewer.entities.add({
        model: {
            uri: '/3d/model/equipment/menji.gltf',
            minimumPixelSize: 1.15,
            maximumScale: 1.15
        }
    });

    // 门机列表
    // const menjilist = shallowRef<any[]>([]);
    const menjilist = computed({
        get: () => store.state.MenjiList,
        set: (val: any[]) => store.commit(ActionType.SET_MENJI_LIST, val)
    });

    // 渲染
    const render = () => {
        menjilist.value.forEach(menji => {
            zccityTool.addMenJi(menji, entitym, {
                showWidgets: MenjiState.showWidgets,
                showIcon: MenjiState.showIcon,
                showLabel: MenjiState.showLabel,
            });
        })
    }

    // 刷新
    const refresh = async () => {
        // 获取数据
        const { data } = await KanbanApi.getModelList("BizDsCrane");

        // 解析数据
        menjilist.value = data.rows.filter(i => i.BId).map(i => {
            let line = [];
            try {
                line = JSON.parse(i.Area);
            } catch (error) {
            }

            return {
                metadata: i,
                name: i.Name,
                id: i.BId,
                pname: mj_parent_entity,
                url: MODEL_ICON_GIF_MAP.Menji,
                line,
                scale: 0.08,
                type: "equip",
                lat: Number(i.Lat),
                lng: Number(i.Lng),
                heading: Number(i.Heading),
                height: Number(i.Height),
                list:i.list
            }
        });

        render();
    }

    // 监听挂件状态
    watch(() => store.state.D3ModelStateMap.Menji.showWidgets, (val) => {
        mj_parent_entity.show = val;
    });

    // 启用门机拖拽
    zccityTool.moveEquip();

    //默认执行一次
    refresh();
}