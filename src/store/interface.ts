import { BaseInfoVM } from '@/api/KanbanApi.type';
import { User } from '@/service/user/user.interface';
import { ChartView, MonitorView, PopBlock, WeatherView } from '@/types/biz';
import { D3Position, Ship, ShipMap } from '@/views/biz/components/Map3d/types';
import { Store } from 'vuex'
import Map3dStateTypes from './modules/map3d/interface';
import ModuleModalTypes from './modules/modal/interface';
import { DispatchStoreModuleTypes } from './modules/dispatch/interface';

// 3d模型类型
export type D3ModelType = 'Ship' | 'Maodi' | 'Matou' | 'Building' | 'Chuanwu' | 'Jiankong' | 'Menji' | 'Langzhuang' | 'Longmendiao';

// 全局船舶模式
export enum GlobalShipMode {
    // 实时模式
    REALTIME,

    // 调度模式
    DISPATCH
}

export default interface RootStateTypes {
    GlobalShipMode: GlobalShipMode,
    BaseInfo: BaseInfoVM,
    ShipMap: ShipMap,
    ShipList: Ship[],
    CurrentShip?: Ship,
    // 调度模式下使用
    ShipToolbar: {
        visible: boolean,
        d3Position?: D3Position
    },
    // 实时模式下使用
    ShipInfoPanel: {
        visible: boolean
    },

    /** 码头列表 */
    MatouList: any[],

    /** 船坞列表 */
    ChuanwuList: any[],

    /** 建筑列表 */
    BuildingList: any[],

    /** 门机列表 */
    MenjiList: any[],

    D3ModelStateMap: {
        [key in D3ModelType]: {
            showWidgets: boolean, // 控制整体挂件的显示与否
            showLabel: boolean,
            showIcon: boolean,
            [key: string]: any
        }
    },
    User?: User,
    PopBlock: PopBlock,
    ChartView: ChartView,
    WeatherView: WeatherView,
    TideHeight: number,
    MonitorView: MonitorView
}

export interface AllStateTypes extends RootStateTypes {
    modal: ModuleModalTypes;
    map3d: Map3dStateTypes;
    Dispatch: DispatchStoreModuleTypes
}

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $store: Store<AllStateTypes>
    }
}