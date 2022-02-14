import { useStore } from "@/store";
import { watch } from 'vue';
import { Ship } from "../types";

export default () => {
    const store = useStore();
    const ShipState = store.state.D3ModelStateMap.Ship;

    const boat_parent_entity = viewer.entities.add(new zccity.Entity());
    boat_parent_entity.show = ShipState.showWidgets;

    const gif: string[] = [];

    // 内部维护一个船舶模型列表
    let temp_models: any = [];

    /** 根据store.state.ShipList数据批量渲染船只 */
    function render3dShips() {
        const shipList = store.state.ShipList;

        // renderShip(shipList[0]);
        // return;

        shipList.forEach((ship, index) => {
            renderShip(ship);

            // const renderParams = {
            //     ...ship.swparam,
            //     id: ship.ShipRepairProjectId,
            //     url: "/big-screen/IMG/ship.gif",
            //     pname: boat_parent_entity,
            //     scale: 0.08,
            //     image: gif,

            //     x: Number(ship.swparam.x),
            //     y: Number(ship.swparam.y),
            //     a: Number(ship.swparam.a),
            //     z: Number(ship.swparam.z),
            //     sx: Number(ship.swparam.sx) || 0.7111111111111111,
            //     sy: Number(ship.swparam.sy) || 0.7916666666666666,

            //     // x: 122.14690120731473 + index * 0.002,
            //     // y: 29.801245340161174 + index * 0.003,
            //     // z: 13,
            //     // sx: 0.7111111111111111,
            //     // sy: 0.7916666666666666,
            //     // a: 0,
            // }
            // console.log(renderParams.x,
            //     renderParams.y,
            //     renderParams.z,
            //     renderParams.a,
            //     renderParams.sx,
            //     renderParams.sx)

            // // // console.log(ship.swparam.x, ship.swparam.y);

            // try {
            //     const model = zccityTool.addModel(ship.swurl, renderParams, { showIcon: ShipState.showIcon, showLabel: ShipState.showLabel });
            //     // console.log(model)
            //     if (model) {
            //         temp_models.push(model);
            //     }
            // } catch (error) {
            //     // console.log(error);
            // }


            // zccityTool.addModel('/3d/model/boat/jizhuangxiangchuan.gltf', {
            //     a: 0,
            //     id: renderParams.id,
            //     name: "努尔↵ 速度：0",
            //     sx: 0.7111111111111111,
            //     sy: 0.7916666666666666,
            //     x: (122.14690120731473 + index * 0.001),
            //     y: 29.801245340161174,
            //     z: 13,
            //     pname: boat_parent_entity,
            //     image: gif,
            //     url: './big-screen/IMG/wharf.gif',
            //     scale: 0.08
            // });
        })
    }

    /** 销毁全部3d船只 */
    function removeShips() {
        temp_models.forEach((model: any) => {
            zccityTools.prototype.delModel(model);
        });
        temp_models = [];
    }

    /** 根据id销毁3d船只 */
    function removeShipById(id: string) {
        const model = temp_models.find((i: any) => i.id === id);

        if (model) {
            zccityTools.prototype.delModel(model);
            temp_models.splice(temp_models.indexOf(model), 1);
            return model;
        }
    }

    /** 更新3d船只 */
    function updateShip(ship: Ship) {
        const removedShip = removeShipById(ship.ShipRepairProjectId);

        if (removedShip) {
            renderShip(ship);
        }
    }

    /** 渲染单个3d船只 */
    function renderShip(ship: Ship) {
        const renderParams = {
            ...ship.swparam,
            id: ship.ShipRepairProjectId,
            url: "/big-screen/IMG/ship.gif",
            pname: boat_parent_entity,
            scale: 0.08,
            image: gif,

            x: Number(ship.swparam.x),
            y: Number(ship.swparam.y),
            a: Number(ship.swparam.a),
            z: Number(ship.swparam.z),
            sx: Number(ship.swparam.sx) || 1,
            sy: Number(ship.swparam.sy) || 1,
        }

        // console.log(renderParams);

        try {
            const model = zccityTool.addModel(ship.swurl, renderParams, { showIcon: ShipState.showIcon, showLabel: ShipState.showLabel });
            if (model) {
                temp_models.push(model);
            }
        } catch (error) {
        }
    }

    // 监听船只模型分类的状态
    watch(() => store.state.D3ModelStateMap.Ship.showWidgets, (val) => {
        boat_parent_entity.show = val;
    });

    // 全局工具类
    window.RenderShipTools = {
        render3dShips,
        removeShips,
        removeShipById,
        updateShip,
        renderShip,
    }

    return {
        render3dShips,
        removeShips
    }
}