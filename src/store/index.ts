import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'
import modal from './modules/modal';
import Dispatch from './modules/dispatch';

import { AllStateTypes, GlobalShipMode } from './interface';
import RootStateTypes from '@/store/interface';
import { User } from '@/service/user/user.interface';
import { getInfo } from '@/service/user';
import { MonitorView, PopBlock, TyphonObject } from '@/types/biz';
import { ActionType } from './ActionType';
import { isNotEmpty } from '@/utils';
import { BaseInfoVM } from '@/api/KanbanApi.type';
import { D3Position, Ship, ShipMap } from '@/views/biz/components/Map3d/types';
import { D3ModelType } from '@/store/interface';

export const key: InjectionKey<Store<AllStateTypes>> = Symbol();

export const store = createStore<RootStateTypes>({
    modules: {
        // app,
        Dispatch,
        modal,
        // map3d,
    },
    state: {
        // 用户信息
        User: undefined,

        // 当前模式
        GlobalShipMode: GlobalShipMode.REALTIME,

        // 船舶信息映射表
        ShipMap: {},

        // 船舶列表
        ShipList: [],

        // 当前船只
        CurrentShip: undefined,

        // 船舶工具栏
        ShipToolbar: {
            d3Position: undefined,
            visible: false,
        },

        // 船舶信息面板
        ShipInfoPanel: {
            visible: false
        },

        // 码头列表
        MatouList: [],
        // 船坞列表
        ChuanwuList: [],
        // 厂房列表
        BuildingList: [],
        //门机列表
        MenjiList: [],

        // 各类三维模型状态引射表
        D3ModelStateMap: {
            Ship: {
                showLabel: true,
                showIcon: true,
                showWidgets: false,
            },
            Maodi: {
                showLabel: true,
                showIcon: true,
                showWidgets: false,
            },
            Matou: {
                showLabel: true,
                showIcon: true,
                showWidgets: false,
            },
            Chuanwu: {
                showLabel: true,
                showIcon: true,
                showWidgets: false,
            },
            Jiankong: {
                showLabel: true,
                showIcon: true,
                showWidgets: false,
            },
            Menji: {
                showLabel: true,
                showIcon: true,
                showWidgets: false,
            },
            Langzhuang: {
                showLabel: true,
                showIcon: true,
                showWidgets: false,
            },
            Longmendiao: {
                showLabel: true,
                showIcon: true,
                showWidgets: false,
            },
            Building: {
                showLabel: true,
                showIcon: true,
                showWidgets: false,
            }
        },

        // 看板基础信息
        BaseInfo: {
            EmployeeCount: 0,
            Attendance: 0,
            BerthWharfCount: 0,
            BerthWharfList: [],
            BerthDockCount: 0,
            BerthDockList: [],
            BerthAnchorageCount: 0,
            BerthAnchorageList: [],
            ShipAllCount: 0,
            ShipAllList: [],
            SailCount: 0,
            BuildingCount: 0,
            WharfCount: 0,
            DockCount: 0,
            RepairproCount: 0,
            AnchorageCount: 0,
            CraneCount: 0,
            CameraCount: 0,
            BuildingList: [],
            WharfList: [],
            DockList: [],
            AnchorageList: [],
            CraneList: [],
            CameraList: []
        },

        // 右下角悬浮框状态
        PopBlock: {
            type: "Facilities",
            visible: false,
            panelVisible: false,
            activePanelTab: ""
        },

        // 图表视图层
        ChartView: {
            visible: false,
        },

        // 气象视图层
        WeatherView: {
            visible: false,
            typhonMapVisible: false,
            currentTyphonObject: undefined,
            typhonMapZoom: 5,
            typhonMapCenter: [120.759069, 28.632267]
        },

        // 潮高
        TideHeight: 0,

        // 监控视图层
        MonitorView: {
            visible: false,
            size: "mini",
        }
    },
    mutations: {
        SET_USER: (state, user: User) => {
            state.User = user;
        },

        // GlobalShipMode
        [ActionType.SET_GLOBAL_SHIP_MODE]: (state, payload: GlobalShipMode) => {
            state.GlobalShipMode = payload;
        },

        // ModelState
        [ActionType.SET_MODEL_STATE]: (state, payload: { name: D3ModelType, key: string, value: any }) => {
            const { name, key, value } = payload;
            console.log(name, key, value);
            state.D3ModelStateMap[name][key] = value;
        },

        // Ship
        [ActionType.SET_SHIP_MAP]: (state, payload: ShipMap) => {
            state.ShipMap = payload;
        },
        [ActionType.SET_SHIP_LIST]: (state, payload: Ship[]) => {
            state.ShipList = payload;
        },
        [ActionType.SET_CURRENT_SHIP]: (state, payload: Ship) => {
            state.CurrentShip = payload;
        },

        // ShipInfoPanel
        [ActionType.TOGGLE_SHIP_INFO_PANEL]: (state, payload?: boolean) => {
            if (isNotEmpty(payload)) {
                state.ShipInfoPanel.visible = payload as boolean;
            }
            else {
                state.ShipInfoPanel.visible = !state.ShipInfoPanel.visible;
            }
        },

        // ShipToolbar
        [ActionType.TOGGLE_SHIP_TOOLBAR]: (state, payload?: boolean) => {
            if (isNotEmpty(payload)) {
                state.ShipToolbar.visible = payload as boolean;
            }
            else {
                state.ShipToolbar.visible = !state.ShipToolbar.visible;
            }
        },
        [ActionType.SET_SHIP_TOOLBAR_D3_POSITION]: (state, payload: D3Position) => {
            state.ShipToolbar.d3Position = payload;
        },

        // 船坞列表
        [ActionType.SET_CHUANWU_LIST]: (state, payload: any) => {
            state.ChuanwuList = payload;
        },

        // 建筑列表
        [ActionType.SET_BUILDING_LIST]: (state, payload: any) => {
            state.BuildingList = payload;
        },

        // 码头列表
        [ActionType.SET_MATOU_LIST]: (state, payload: any) => {
            state.MatouList = payload;
        },

        // 门机列表
        [ActionType.SET_MENJI_LIST]: (state, payload: any) => {
            state.MenjiList = payload;
        },

        // Baseinfo
        [ActionType.SET_BASE_INFO]: (state, payload: BaseInfoVM) => {
            state.BaseInfo = payload;
        },

        // PopBlock
        Set_PopBlock_Type: (state, type: PopBlock['type']) => {
            state.PopBlock.type = type;
        },
        Set_PopBlock_Visible: (state, visible: boolean) => {
            state.PopBlock.visible = visible;
        },
        Set_PopBlock_PanelVisible: (state, visible: boolean) => {
            state.PopBlock.panelVisible = visible;
        },
        Set_PopBlock_ActivePanelTab: (state, value: string) => {
            state.PopBlock.activePanelTab = value;
        },

        // ChartView
        [ActionType.SET_CHART_VIEW_TOGGLE](state, payload?: boolean) {
            state.ChartView.visible = isNotEmpty(payload) ? payload as boolean : !state.ChartView.visible;
        },

        // WeatherView
        [ActionType.SET_WEATHER_VIEW_TOGGLE](state, payload?: boolean) {
            state.WeatherView.visible = payload ?? !state.WeatherView.visible;
        },
        [ActionType.SET_TYPHON_PATH_TOGGLE](state, payload?: boolean) {
            state.WeatherView.typhonMapVisible = payload ?? !state.WeatherView.typhonMapVisible;
        },
        [ActionType.SET_CURRENT_TYPHON_OBJECT](state, payload: TyphonObject) {
            state.WeatherView.currentTyphonObject = payload;
        },


        // SET_TIDE_HEIGHT
        [ActionType.SET_TIDE_HEIGHT](state, payload: number) {
            state.TideHeight = payload;
        },


        // MonitorView
        [ActionType.SET_MONITOR_VIEW_TOGGLE](state, payload?: boolean) {
            state.MonitorView.visible = payload ?? !state.MonitorView.visible;
        },
        [ActionType.SET_MONITOR_VIEW_SIZE](state, payload: MonitorView['size']) {
            state.MonitorView.size = payload;
        },
        // [ActionType.SET_MONITOR_VIEW_CURRENT_TAB](state, payload: string) {
        //     state.MonitorView.currentTab = payload;
        // }

    },
    actions: {
        getUserInfo: ({ commit }) => {
            return getInfo().then((res) => {
                if (res.bl) {
                    const user = res.data.rows;
                    commit("SET_USER", user);
                }
            })
        },

        /**
         * 打开右下角悬浮框
         */
        openPopBlock: ({ commit }, params: { type: PopBlock['type'], activePanelTab: string }) => {
            commit("Set_PopBlock_Type", params.type);
            commit("Set_PopBlock_ActivePanelTab", params.activePanelTab);
            commit("Set_PopBlock_Visible", true);
        },
        /**
         * 关闭右下角悬浮框
         */
        closePopBlock: ({ commit }) => {
            commit("Set_PopBlock_Type", '');
            commit("Set_PopBlock_Visible", false);
        }
    },
    getters: {
        User: state => state.User,
        PopBlock: state => state.PopBlock,
    }
})

export function useStore<T = AllStateTypes>() {
    return baseUseStore<T>(key);
}