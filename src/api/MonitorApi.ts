import { RequestResponse } from "@/types/request";
import request from "@/utils/request";
import BaseApi from "./BaseApi";

const api = new BaseApi();

const baseUrl = '/api/Kanban';

export default Object.assign(api, {

    /** 获取监控列表 */
    getMonitorList(params?: any): Promise<RequestResponse> {
        return request({
            url: `${baseUrl}/GetMonitoring`,
            method: "get",
            params
        })
    },


    /** 获取监控分类 */
    getMonitorCategory(params?: any): Promise<RequestResponse> {
        // return request({
        //     url: `${baseUrl}/GetMonitorCategory`,
        //     method: "get",
        //     params
        // })

        // {
        //     label: "全部",
        //     value: "0"
        // },
        // {
        //     label: "船坞",
        //     value: "1"
        // },
        // {
        //     label: "码头",
        //     value: "2"
        // },
        // {
        //     label: "厂区外围",
        //     value: "3"
        // },
        // {
        //     label: "厂房",
        //     value: "4"
        // },
        // {
        //     label: "道路",
        //     value: "5"
        // },
        return Promise.resolve({
            data: {
                rows: [
                    {
                        Id: "00",
                        Name: "监控分类",
                        Children: [
                            {
                                Id: "0",
                                Name: "全部"
                            },
                            {
                                Id: "1",
                                Name: "船坞"
                            },
                            {
                                Id: "2",
                                Name: "码头"
                            },
                            {
                                Id: "3",
                                Name: "厂区外围"
                            },
                            {
                                Id: "4",
                                Name: "厂房"
                            },
                            {
                                Id: "5",
                                Name: "道路"
                            }
                        ]
                    }
                ],
                bl: true,
                msg: ''
            },
            bl: true,
            msg: ''
        })
    }
})