import KanbanApi from "@/api/KanbanApi";
import { ref } from "vue";
// import { useStore } from "@/store";

export default (viewer: any, zccityTool: any) => {

    // const store = useStore();
    // const LangzhuangState = store.state.D3ModelStateMap.Langzhuang;

    // 缆桩列表
    const langzhuanglist = ref<any[]>([]);

    // 渲染
    const render = () => {
        //添加揽桩1
        var lz1_parent_entity = viewer.entities.add(new zccity.Entity());
        var entityLZ = viewer.entities.add({
            model: {
                uri: '/3d/model/equipment/lanzhuang1.gltf',
                minimumPixelSize: 1,
                maximumScale: 1
            }
        });

        langzhuanglist.value.forEach(lanzhuang => {
            lanzhuang.pname = lz1_parent_entity;
            zccityTool.addPackage(lanzhuang, entityLZ)
        })
    }

    // 刷新
    const refresh = async () => {
        // 获取模型数据
        const { data } = await KanbanApi.getModelList("BizDsBitt");

        // 解析数据
        langzhuanglist.value = data.rows.map(i => {
            return {
                ...i,
                id: i.Name,
                lat: Number(i.Lat),
                lng: Number(i.Lng),
                height: Number(i.Height),
                heading: Number(i.Heading)
            }
        });

        render();
    }

    // 默认执行一次
    refresh();
}