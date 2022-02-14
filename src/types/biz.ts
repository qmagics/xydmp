/**
 * 右下角气泡块
 */
export interface PopBlock {
    /**
     * 类型
     * Facilities：设施
     * Ships：船只
     */
    type: "Facilities" | "Ships";

    // 是否可见
    visible: boolean;

    // 面板是否可见
    panelVisible: boolean;

    // 面板当前选中的Tab标签页
    activePanelTab: string
}

/**
 * 图表视图层
 */
export interface ChartView {
    // 是否可见
    visible: boolean;
}

/**
 * 气象视图层
 */
export interface WeatherView {
    // 是否可见
    visible: boolean;

    // 台风路径图是否可见
    typhonMapVisible: boolean;

    /** 台风地图中心点 */
    typhonMapCenter: [number, number];

    /** 台风地图缩放级别 */
    typhonMapZoom: number;

    // 当前台风描述对象
    currentTyphonObject?: TyphonObject,
}

/**
 * 监控视图层
 */
export interface MonitorView {
    // 是否可见
    visible: boolean;

    // 大小
    size: 'mini' | 'max',

    // // 当前选中页签
    // currentTab: string
}

/** 台风描述对象 */
export interface TyphonObject {
    /** 台风id */
    tfid: string;

    /** 预警等级 */
    warnlevel: string;

    /** 台风名字 */
    name: string;

    /** 台风英文名 */
    enname: string;

    /** 中心lat */
    centerlat: string;

    /** 中心lat */
    centerlng: string;

    /** 开始时间 */
    starttime: string;

    /** 结束时间 */
    endtime: string;

    /** 点位路径 */
    points: TFPoint[];
}

/** 台风点 */
export interface TFPoint {
    lat: string;
    lng: string;
    movedirection: string;
    movespeed: string;
    power: string;
    pressure: string;
    radius7: string;
    radius10: string;
    radius12: string;
    speed: string;
    strong: string;
    time: string;
    forecast: TFForecastItem[];
}

/** 台风预测信息 */
export interface TFForecastItem {
    tm: string;
    forecastpoints: Forecastpoint[];
}

/** 台风预测点位信息 */
export interface Forecastpoint {
    lat: string;
    lng: string;
    power: string;
    pressure: string;
    speed: string;
    strong: string;
    time: string;
}