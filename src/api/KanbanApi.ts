import { RequestResponse } from "@/types/request";
import request from "@/utils/request";
import BaseApi from "./BaseApi";
import { StaticModelType } from "./KanbanApi.type";

const api = new BaseApi();

export default Object.assign(api, {
    /** 获取基本信息 */
    getBasicInformation(params?: any): Promise<RequestResponse> {
        return request({
            url: "/api/Kanban/GetBasicInformation",
            method: "get",
            params: {
                ...params
            }
        })
    },

    /** 获取船只列表 */
    getShipList(params?: any): Promise<RequestResponse> {
        return request({
            url: "/api/Kanban/GetShipList",
            method: "get",
            params: {
                ...params
            }
        })
    },

    /**
     * 获取船只详情
     * @param ShipRepairProjectId 船只ID
     * @param params 
     * @returns 
     */
    getShipDetail(ShipRepairProjectId: string, params?: any): Promise<any> {
        return request({
            url: "/api/Kanban/GetShipDetail",
            method: "get",
            params: {
                ShipRepairProjectId,
                ...params
            }
        })
    },

    /** 项目情况总览 */
    getProjectOverview(params?: any): Promise<RequestResponse> {
        return request({
            url: "/api/Kanban/GetProjectOverview",
            method: "get",
            params: {
                ...params
            }
        })
    },

    /** 厂区设备数量统计 */
    getMainEquipmentDistribution(params?: any): Promise<RequestResponse> {
        return request({
            url: "/api/Kanban/GetMainEquipmentDistribution",
            method: "get",
            params: {
                ...params
            }
        })
    },

    /** 本年度船只修理情况 */
    getShipRepair(params?: any): Promise<RequestResponse> {
        return request({
            url: "/api/Kanban/GetShipRepair",
            method: "get",
            params: {
                ...params
            }
        })
    },

    /** 当前船只停靠情况 */
    getShipDockingStatus(params?: any): Promise<RequestResponse> {
        return request({
            url: "/api/Kanban/GetShipDockingStatus",
            method: "get",
            params: {
                ...params,
            }
        })
    },

    /** 各码头船速监控 */
    getXXXXXX(params?: any): Promise<RequestResponse> {
        return request({
            url: "/api/Kanban/XXXXXX",
            method: "get",
            params: {
                ...params
            }
        })
    },

    /** 每日重大安全风险管控 */
    getDailySafetyRisk(params?: any): Promise<RequestResponse> {
        return request({
            url: "/api/Kanban/GetDailySafetyRisk",
            method: "get",
            params: {
                ...params,
            }
        })
    },

    /** 每日能耗情况统计 */
    getDailyEnergyConsumption(params?: any): Promise<RequestResponse> {
        return request({
            url: "/api/Kanban/GetDailyEnergyConsumption",
            method: "get",
            params: {
                ...params
            }
        })
    },

    /** 船坞坞期情况 */
    getDockPeriod(params?: any): Promise<RequestResponse> {
        return request({
            url: "/api/Kanban/GetDockPeriod",
            method: "get",
            params: {
                ...params
            }
        })
    },

    /** 获取模型列表数据 */
    getModelList(type: StaticModelType, params?: any): Promise<RequestResponse> {
        return request({
            url: "/api/Kanban/GetModelList",
            method: "get",
            params: {
                ...params,
                Type: type
            }
        })
    },

    /** 今日员工出勤情况 */
    getEmployeeAttendance(params?: any): Promise<RequestResponse> {
        return request({
            url: "/api/Kanban/GetEmployeeAttendance",
            method: "get",
            params: {
                ...params
            }
        })
    },

    /** 作业出勤情况 */
    getJobAttendanceDetails(params?: any): Promise<RequestResponse> {
        return request({
            url: "/api/Kanban/GetJobAttendanceDetails",
            method: "get",
            params: {
                ...params
            }
        })
    },

    /** 获取潮汐信息 */
    getTide(params?: any): Promise<RequestResponse> {
        return request({
            url: "/api/Kanban/GetTide",
            method: "get",
            params: {
                ...params
            }
        })
    },

    /** 获取天气信息 */
    getWeather(params?: any): Promise<RequestResponse> {
        return request({
            url: "/api/Kanban/GetWeather",
            method: "get",
            params: {
                ...params
            }
        })
    },

    /** 获取历史台风 */
    GetTyphoonHistory(params?: any): Promise<RequestResponse> {
        return request({
            url: "/api/Kanban/GetTyphoonHistory",
            method: "get",
            params: {
                ...params
            }
        })
    },

    /** 获取当前台风 */
    getNewestTyphoon(params?: any): Promise<RequestResponse> {
        return request({
            url: "/api/Kanban/GetNewestTyphoon",
            method: "get",
            params: {
                ...params
            }
        })
    },

    /** 靠泊测量 */
    getRanging(params?: any) {
        return request({
            url: "/api/Kanban/Ranging",
            method: "get",
            params: {
                ...params
            }
        })
    },

    /** 每日重大安全风险管控（第一层）*/
    getDailySafetyRiskFirst(params?: any) {
        return request({
            url: "/api/Kanban/GetDailySafetyRiskFirst",
            method: "get",
            params
        })
    },
    /** 每日重大安全风险管控（第二层）*/
    getDailySafetyRiskSecond(Type?: string) {
        return request({
            url: "/api/Kanban/GetDailySafetyRiskSecond",
            method: "get",
            params: {
                Type
            }
        })
    },
    /** 每日重大安全风险管控（第三层）*/
    getDailySafetyRiskThird(Id: string) {
        return request({
            url: "/api/Kanban/GetDailySafetyRiskThird",
            method: "get",
            params: {
                Id
            }
        })
    },

    /** 获取字典表风险类型 */
    getDictionaryRiskType(){
        return request({
            url: "/api/Kanban/GetDictionaryRiskType",
            method: "get"
        })
    }

    // export function getRanging({ Dis, Angle1, Angle2 }) {
    //     return http.get(`${baseApi}?optionType=Ranging&Dis=${Dis}&Angle1=${Angle1}&Angle2=${Angle2}`);
    // }

})