import { RequestParams, RequestResponse, ViewModel } from "@/types/request";
import request from "@/utils/request";
import BaseApi from "./BaseApi";
import { buildXApi } from "./utils";

export interface XApiOptions {
    /** 根路径 */
    baseUrl: string;
}

export interface ApiOptions extends XApiOptions {
    /** 主键 */
    primaryKey: string;
}

export default class Api extends BaseApi {

    /** 根路径 */
    private _baseUrl: string;

    /** 主键 */
    private _primaryKey: string;

    /** 跨模块Api */
    public xApi;

    constructor(options: ApiOptions) {
        super();

        const { baseUrl, primaryKey } = options;

        this._baseUrl = baseUrl;
        this._primaryKey = primaryKey;

        // build xApi
        this.xApi = buildXApi(this._baseUrl);

        // handle this
        this.getList = this.getList.bind(this);
        this.getDetail = this.getDetail.bind(this);
        this.getDetailBulk = this.getDetailBulk.bind(this);
        this.create = this.create.bind(this);
        this.createBulk = this.createBulk.bind(this);
        this.delete = this.delete.bind(this);
        this.deleteBulk = this.deleteBulk.bind(this);
        this.update = this.update.bind(this);
        this.updateBulk = this.updateBulk.bind(this);
        this.patch = this.patch.bind(this);
        this.patchBulk = this.patchBulk.bind(this);
    }

    /**
     * 获取列表
     * @param params 查询参数 
     */
    getList(params: RequestParams): Promise<RequestResponse> {
        return request({
            url: `${this._baseUrl}/Get`,
            method: 'get',
            params
        })
    }

    /**
     * 获取详情
     * @param id 主键
     * @param params 查询参数 
     */
    getDetail(id: string, params: RequestParams): Promise<RequestResponse> {
        return request({
            url: `${this._baseUrl}/GetDetail`,
            method: 'get',
            params: {
                ...params,
                [this._primaryKey]: id
            }
        })
    }

    /**
     * 批量获取详情
     * @param idList 
     */
    getDetailBulk(idList: string[]): Promise<RequestResponse> {
        return request({
            url: `${this._baseUrl}BulkRead`,
            method: 'get',
            params: idList
        })
    }

    /**
     * 获取树
     * @param params 查询参数 
     */
    getTree(params: RequestParams): Promise<RequestResponse> {
        return request({
            url: `${this._baseUrl}Tree`,
            method: 'get',
            params: {
                Nature: 1,
                ...params
            }
        })
    }

    /**
     * 创建
     * @param data 数据模型
     */
    create(data: ViewModel): Promise<RequestResponse> {
        return request({
            url: `${this._baseUrl}/Post`,
            method: 'post',
            data
        })
    }

    /**
     * 批量创建 
     * @param data 数据模型[]
     */
    createBulk(data: ViewModel[]): Promise<RequestResponse> {
        return request({
            url: `${this._baseUrl}Bulk`,
            method: 'post',
            data
        })
    }

    /**
     * 删除
     * @param id 主键
     */
    delete(id: string): Promise<RequestResponse> {
        return request({
            url: `${this._baseUrl}/Delete`,
            method: 'delete',
            data: {
                [this._primaryKey]: id
            }
        })
    }

    /**
     * 批量删除
     * @param idList 
     */
    deleteBulk(idList: string[]): Promise<RequestResponse> {
        return request({
            url: `${this._baseUrl}Bulk`,
            method: 'delete',
            data: idList
        })
    }

    /**
     * 更新
     * @param data 
     */
    update(data: ViewModel): Promise<RequestResponse> {
        return request({
            url: `${this._baseUrl}/Put`,
            method: 'put',
            data
        })
    }

    /**
     * 批量更新
     * @param data 数据模型[]
     */
    updateBulk(data: ViewModel) {
        return request({
            url: `${this._baseUrl}Bulk`,
            method: 'put',
            data
        })
    }

    /**
     * 变更
     * @param data 数据模型
     */
    patch(data: ViewModel) {
        return request({
            url: `${this._baseUrl}/Patch`,
            method: 'patch',
            data
        })
    }

    /**
     * 批量变更
     * @param data 数据模型[]
     */
    patchBulk(data: ViewModel) {
        return request({
            url: `${this._baseUrl}Bulk`,
            method: 'patch',
            data
        })
    }
}

//new Api({ baseUrl: "/", primaryKey: "a" }).xApi