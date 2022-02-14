/**
 * 请求状态
 */
export enum RequestState {
    /** 请求被取消 */
    REQUEST_CANCELED = "REQUEST_CANCELED"
}

/**
 * 带有abort方法的Promise对象
 */
export interface PromiseWithAbort<T = any> extends Promise<T> {

    /**
     * 中止发起的请求
     * @param msg 请求状态
     */
    abort?(msg?: RequestState): void
}

/**
 * 请求参数对象
 */
export type RequestParams = Record<string | number, any>;

/**
 * ViewModel
 */
export type ViewModel = Record<string | number, any>;

/**
 * 请求返回结果数据
 */
export interface ResponseData<T = any[]> {
    bl: boolean;

    rows: T;

    msg: string;

    code?: string;

    total?: number;
}

/**
 * 请求返回结果
 */
export interface RequestResponse<T = any[]> {

    /** 请求是否成功 */
    bl: boolean

    /** 请求返回消息 */
    msg: string

    /** 请求返回数据 */
    data: ResponseData<T>
}