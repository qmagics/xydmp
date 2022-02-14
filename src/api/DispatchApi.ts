import { DispatchSchemeDetail, DispatchSchemeDetailItem } from "@/store/modules/dispatch/state";
import { RequestResponse } from "@/types/request";
import request from "@/utils/request";
import BaseApi from "./BaseApi";

const api = new BaseApi();

const baseUrl = '/api/Kanban';

export default Object.assign(api, {

    /** 获取调度方案列表  */
    getSchedulingSchemeList(params?: any): Promise<RequestResponse> {
        return request({
            url: `${baseUrl}/GetSchedulingSchemeList`,
            method: "get",
            params
        });
    },

    /** 获取调度方案详情 */
    getShipDispatchSchemeDetails(params: {
        ShipDispatchSchemeId: string,
        Category: '1' | '2' | string,
        DateTimes: string
    }): Promise<RequestResponse> {
        return request({
            url: `${baseUrl}/GetShipDispatchSchemeDetails`,
            method: "get",
            params
        });
    },

    /** 删除调度方案 */
    deleteShipDispatchScheme(data: {
        ShipDispatchSchemeId: string
    }): Promise<RequestResponse> {
        return request({
            url: `${baseUrl}/DeleteShipDispatchScheme`,
            method: "delete",
            data
        });
    },

    /** 修改调度方案 */
    updateShipDispatchScheme(data: DispatchSchemeDetail): Promise<RequestResponse> {
        return request({
            url: `${baseUrl}/UpdateShipDispatchScheme`,
            method: "put",
            data
        });
    },

    /** 新增调度方案 */
    addShipDispatchScheme(data: DispatchSchemeDetail): Promise<RequestResponse> {
        return request({
            url: `${baseUrl}/AddShipDispatchScheme`,
            method: "post",
            data
        });
    },

    /** 新增调度内容 */
    addSchedulingContent(data: DispatchSchemeDetailItem): Promise<RequestResponse> {
        return request({
            url: `${baseUrl}/AddSchedulingContent`,
            method: "post",
            data
        });
    },

    /** 修改调度内容 */
    updateSchedulingContent(data: DispatchSchemeDetailItem): Promise<RequestResponse> {
        return request({
            url: `${baseUrl}/UpdateSchedulingContent`,
            method: "put",
            data
        });
    },

    /** 删除调度内容 */
    deleteSchedulingContent(data: {
        ShipDispatchSchemeDetailsId: string
    }): Promise<RequestResponse> {
        return request({
            url: `${baseUrl}/DeleteSchedulingContent`,
            method: "delete",
            data
        });
    },

    /** 获取船舶列表 */
    getDispatchShipList(params?: any) {
        return request({
            url: `${baseUrl}/GetDispatchShipList`,
            method: "get",
            params
        });
    },

    /** 获取停靠位置 */
    getBerthPositionList(params: {
        BeforeBerthPositionCategory?: '1' | '2' | '3' | '4',
        AfterBerthPositionCategory?: '1' | '2' | '3' | '4',
    }) {
        return request({
            url: `${baseUrl}/GetBerthPositionList`,
            method: "get",
            params
        });
    }
})