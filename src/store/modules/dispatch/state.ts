export enum DispatchMode {
    /** 停靠方案  */
    BERTH_SCHEME = 'BERTH_SCHEME',

    /** 调度方案 */
    DIAPATCH_SCHEME = 'DIAPATCH_SCHEME',

    /** 调度计划 */
    DISPATCH_PLAN = 'DISPATCH_PLAN',
}

/** 船舶调度方案详情 */
export type DispatchSchemeDetail = DispatchSchemeDetailItem[];

/** 船舶三维参数 */
export interface SWparam {
    x: string
    y: string
    z: string
    a: string
    sx: string
    sy: string
    id: string
    name: string
}

/** 船舶调度方案详情 - 项 */
export interface DispatchSchemeDetailItem {
    // ShipName: string;
    // ShipId: string;
    Pic: string;
    // From: string;
    // To: string;
    // State: string;
    swurl: string;

    ShipDispatchSchemeDetailsId?: string;
    DispatchShipId: string;
    EstimateDispatchStartTime: string;
    EstimateDispatchEndTime: string;
    Type: '1' | '2';

    //（1码头 2.船坞 3.锚地 4.协作船厂 5.航行 6.开航）字典表
    BeforeBerthPositionCategory: string;

    BeforeBerthPosition: string;
    BeforeBerthPositionName: string;
    BeforeBerthDirection: string;
    BeforeBowOffsetDistance: string;
    BeforeBerthGear: string;
    BeforeBerthGearName: string;

    AfterBerthPositionCategory: string;
    AfterBerthPosition: string;
    AfterBerthPositionName: string;
    AfterBerthDirection: string;
    AfterBowOffsetDistance: string;
    AfterBerthGear: string;
    AfterBerthGearName: string;

    DisabledMark: boolean;
    Remarks: string;
    SchedulingStatus: string;
    CnName: string;
    EnName: string;
    BeforeSWparam: SWparam;
    AfterSWparam: SWparam;

    // 按船只显示模式下有list
    list?: DispatchSchemeDetailItem[];


    // "ShipDispatchSchemeDetailsId": "e1cec22d-06f8-4a9f-af18-e94c481ccd24",
    // "DispatchShipId": "c67481bc-24a4-4d96-9295-c19555b5d5ed",
    // "CnName": "米霖2号",
    // "EnName": "Magellan 2",
    // "BeforeBerthPositionCategory": "1",
    // "BeforeBerthPosition": "6d06553a-bf7a-43e3-90a7-8bd238162555",
    // "BeforeBerthGear": "bd59b775-5c38-49c3-8368-3cf23e0c2c3c",
    // "BeforeBerthDirection": "左靠",
    // "BeforeBowOffsetDistance": null,
    // "BeforeSWparam": {
    //   "x": "0",
    //   "y": "0",
    //   "z": 0,
    //   "a": 0,
    //   "sx": 1,
    //   "sy": 1,
    //   "id": "c67481bc-24a4-4d96-9295-c19555b5d5ed",
    //   "name": "米霖2号"
    // },
    // "AfterBerthPositionCategory": "1",
    // "AfterBerthPosition": "1e4de0b3-ff09-4ccd-ab9d-d785ac5b6dd3",
    // "AfterBerthGear": "481f5670-5794-49d6-b6b6-981915241cdb",
    // "AfterBerthDirection": "左靠",
    // "AfterBowOffsetDistance": null,
    // "AfterSWparam": {
    //   "x": 122.11535338700868,
    //   "y": 29.79162658061942,
    //   "z": 0,
    //   "a": 209.6,
    //   "sx": 1,
    //   "sy": 1,
    //   "id": "c67481bc-24a4-4d96-9295-c19555b5d5ed",
    //   "name": "米霖2号"
    // },
    // "EstimateDispatchStartTime": "2022-01-20T07:10:00",
    // "EstimateDispatchEndTime": "2022-01-20T07:30:00",
    // "Type": "1",
    // "BeforeBerthPositionName": "1号坞坞门口",
    // "BeforeBerthGearName": "1",
    // "AfterBerthPositionName": "物资码头",
    // "AfterBerthGearName": "1",
    // "SchedulingStatus": "1"
}

export interface DispatchStateTypes {
    /** 调度模式 */
    Mode: DispatchMode | '';

    /** 窗口大小 */
    Size: 'mini' | 'max';

    /** 调度方案列表 */
    DispatchSchemeList: DispatchSchemeDetail[];

    /** 当前选中的调度方案详情Id */
    CurrentShipDispatchSchemeId?: string;
    /** 当前选中的调度方案详情Name */
    CurrentShipDispatchSchemeName?: string;
    /** 当前选中的调度方案详情Code */
    CurrentShipDispatchSchemeCode?: string;

    /** DispatchScheme查询参数 */
    DispatchSchemeQuery: {
        Category: string;
        DateTimes: string;
    };

    /** 当前选中的调度方案详情 */
    CurrentDispatchSchemeDetail?: DispatchSchemeDetail;

    /** 当前选中的调度方案详情 - 项 */
    CurrentDispatchSchemeDetailItem?: DispatchSchemeDetailItem;
}

export const state: DispatchStateTypes = {
    Mode: '',

    Size: 'mini',

    DispatchSchemeList: [],

    CurrentShipDispatchSchemeId: undefined,
    CurrentShipDispatchSchemeName: '',
    CurrentShipDispatchSchemeCode: '',

    CurrentDispatchSchemeDetail: undefined,

    CurrentDispatchSchemeDetailItem: undefined,

    DispatchSchemeQuery: {
        Category: '1',
        DateTimes: new Date().stringify()
    }
}