import { store } from '@/store';
import { ActionType } from '@/store/ActionType';
import { GlobalShipMode } from '@/store/interface';
import { getShipFromStoreById } from './utils';
import { nextTick } from 'vue';
import { MODEL_ICON_GIF_MAP, WALL_STYLE } from './d3config';

// 门机环线配置项目
const MENGJI_BOUND_LIST = [
    {
        dis: 30,
        weight: 50,
        color: '#6495ED'
    },
    {
        dis: 62,
        weight: 30,
        color: '#B0E0E6'
    },
    {
        dis: 70,
        weight: 50,
        color: '#E9967A'
    },
    {
        dis: 80,
        weight: 50,
        color: '#9F1818'
    },
    {
        dis: 90,
        weight: 50,
        color: '#5B9723'
    },
    {
        dis: 98,
        weight: 50,
        color: '#238297'
    }
] as const;

/** 选中的对象是门机 */
export function isMenji(pick: any) {
    const index = store.state.MenjiList.findIndex(i => i.id === pick?.id?.id);
    return index >= 0;
}

/** 获取轮廓属性 */
export function getOutlineProps() {
    return {
        color: zccity.Color.YELLOW,
        bold: 6
    };
}

/** 根据点位生成选中对象 */
export function getPickedObjByPosition(position: any): D3Object {
    const viewer = (window as any).viewer;

    const pick = viewer.scene.pick(position);

    const obj = new D3Object();
    obj.pick = pick;

    // console.log('点击', pick);

    if (zccity.defined(pick) && pick.id) {
        let entity = null, id = null, image = '', gltfUrl = '';


        // 选中的对象有对应模型
        if (pick.id.model) {
            // console.log('model:', pick.id.model);

            entity = pick.id.model;
            id = pick.id.id;

            // const pmPosition = zccity.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, pick.id.position._value);
            obj.d3Position = pick.id.position._value;
        }
        // 选中对象无模型
        else {
            // console.log('primitive:', pick.primitive);
            const guid = typeof pick.id === 'string' ? pick.id : pick.id.id;

            id = guid;
            entity = viewer.scene.primitives._primitives.find((x: any) => x.id === guid);
            image = pick.primitive.image;

            // const pmPosition = zccity.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, pick.primitive.position);
            obj.d3Position = pick.primitive.position;
        }

        obj.id = id;
        obj.entity = entity;
        obj.image = image;

        if (entity && entity.userData) {
            obj.gltfUrl = entity.userData.url;
        }
    }

    return obj;
}

/**
 * 3d封装对象
 */
export class D3Object {
    constructor() {

    }

    /** 二维坐标 */
    cssPosition: any = null;

    /** 三维坐标 */
    d3Position: any = null;

    pick: any = null;

    /** 3D实体 */
    entity: any = null;

    /** id */
    id: string = "";

    /** image */
    image: string = '';

    /** gltfUrl */
    gltfUrl: string = '';

    /** 不包含3d实体 */
    get isEmpty(): boolean {
        return !this.isNotEmpty;
    }

    /** 包含3d实体 */
    get isNotEmpty(): boolean {
        return !!this.entity;
    }

    /** 清除高亮状态 */
    setInactive() {
        this.entity.silhouetteSize = 0;

        // 销毁所有门机环线
        zccityTool.delBound();

        store.commit(ActionType.TOGGLE_SHIP_TOOLBAR, false);
        store.commit(ActionType.TOGGLE_SHIP_INFO_PANEL, false);

        // 如果当前对象是船舶
        if (this.isShip) {
            this.handleDeSelectShip();
        }
    }

    /** 设置为高亮状态 */
    setActive() {
        // 移除选中墙
        viewer.entities.removeById('wall');

        // 如果是建筑类的对象(码头/船坞/厂房)
        if (this.isBuildingLike) {
            this.handleSelectBuildingLike();
            return;
        }

        // 设置对象选中轮廓
        const outlineProps = getOutlineProps();
        try {
            this.entity.silhouetteColor = outlineProps.color;
            this.entity.silhouetteSize = outlineProps.bold;
        } catch (e) { }

        // 如果选中的是门机，显示环线
        if (isMenji(this.pick)) {
            zccityTool.delBound();
            const BoundList = this.getBoundList();
            zccityTool.showBound(this.pick, BoundList, {
                height: 40,
                color: '#B0E0E6'
            });
            return;
        }

        // 如果当前对象是船舶
        if (this.isShip) {
            this.handleSelectShip();
        }
    }

    /** 获取吊机环线数据 */
    getBoundList() {
        let arr:any = [];
        try {
            const mengji = store.state.MenjiList.find(i => i.id === this.id);
            if (mengji) {
                arr = mengji.list;
            }
        } catch {

        }

        return arr;
    }

    /** 处理选中建筑类对象 */
    handleSelectBuildingLike() {
        const { ChuanwuList, MatouList, BuildingList } = store.state;
        const list_to_search = [...ChuanwuList, ...MatouList, ...BuildingList];

        const found = list_to_search.find(i => i.BId === this.id);
        if (found) {
            const { Area } = found;
            viewer.entities.add({
                id: 'wall',
                name: 'qiang',
                wall: {
                    ...WALL_STYLE,
                    positions: zccity.Cartesian3.fromDegreesArrayHeights(Area)
                }
            })
        }
    }

    /** 对象是建筑类 */
    get isBuildingLike(): boolean {
        const img = this.image;
        return img === MODEL_ICON_GIF_MAP.Building ||
            img === MODEL_ICON_GIF_MAP.Chuanwu ||
            img === MODEL_ICON_GIF_MAP.Matou;
    }

    /** 对象是船舶 */
    get isShip(): boolean {
        const ship = getShipFromStoreById(this.id);
        return !!ship;
    }

    /** 处理船舶选中逻辑 */
    handleSelectShip() {
        const ship = getShipFromStoreById(this.id);

        store.commit(ActionType.SET_CURRENT_SHIP, ship);

        // 实时模式
        if (store.state.GlobalShipMode === GlobalShipMode.REALTIME) {
            store.commit(ActionType.TOGGLE_SHIP_INFO_PANEL, false);
            nextTick(() => {
                store.commit(ActionType.TOGGLE_SHIP_INFO_PANEL, true);
            });
        }
        // 调度模式
        else if (store.state.GlobalShipMode === GlobalShipMode.DISPATCH) {

            store.commit(ActionType.TOGGLE_SHIP_TOOLBAR, true);
            store.commit(ActionType.SET_SHIP_TOOLBAR_D3_POSITION, this.d3Position);
        }
    }

    /** 处理船舶取消选中逻辑 */
    handleDeSelectShip() {

    }
}