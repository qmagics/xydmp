type Response = {
    status: number,
    data?: any
    bl?: boolean
    isSuccess?: boolean
}

type RequestType = 'get' | 'post' | 'delete' | 'put' | 'patch';

export interface MockItem {
    url: string
    type: RequestType
    response: (config?: any) => Response

}