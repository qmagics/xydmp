import { RequestResponse } from "@/types/request";
import request from "@/utils/request";
import BaseApi from "./BaseApi";
import TF from '@/mocks/TF.json';

const api = new BaseApi();

const baseUrl = 'http://typhoon.zjwater.gov.cn/Api/TyphoonInfo';

export default Object.assign(api, {
    /**
     * 根据编码获取台风列表
     * @param code 台风编码 格式为:yyyy[台风序号] 例如:202118 => 表示2021年第18号台风
     * @returns 
     */
    getTyphonListByCode(code: string) {
        return request({
            method: "get",
            url: `${baseUrl}/${code}`
        })
    },

    /** 获取历史台风列表 */
    getHistoryTyphonList(year: number = new Date().getFullYear()) {
        // const requests = new Array(20).fill('').map((i, index) => {
        //     return this.getTyphonListByCode(`${year}${index + 1}`);
        // });

        return new Promise(async (resolve, reject) => {
            // const result_arr = await Promise.all(requests);
            // console.log(result_arr);

            resolve({
                data: {
                    rows: TF
                },
                total: TF.length
            })
        });
    },

    /** 获取当前台风列表 */
    getCurrentTyphonList() {
        return new Promise(async (resolve, reject) => {
            resolve({
                data: {
                    rows: TF
                },
                total: TF.length
            })
        });
    },
})