import { number } from "echarts";

interface SWParam {
    x: number;
    y: number;
    z: number;
    a: number;
    sx: number;
    sy: number;
    id: string;
    name: string;
}

export interface Ship {
    ShipRepairProjectId: string;

    swparam: SWParam;

    /** 三维模型地址 */
    swurl: string;

    [key: string]: any;
}

export interface ShipMap {
    [key: string]: Ship;
}

/** 三维坐标对象 */
export interface D3Position {
    x: number;
    y: number;
    z: number;
}

/** Css坐标对象 */
export interface CssPosition {
    left: number;
    top: number;
    bottom?: number;
    right?: number;
}