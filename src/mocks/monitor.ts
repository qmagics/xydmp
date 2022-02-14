import { MockItem } from './interface';
import Mock from 'mockjs';

const mocks: MockItem[] = [
    {
        url: '/api/Kanban/GetMonitorList',
        type: 'get',
        response: (req) => {
            console.log('req1',req)
            return {
                status: 200,
                bl: true,
                data: Mock.mock({
                    'rows|20-50': [
                        {
                            'Id': "@guid",
                            'Name': '@ctitle(8, 20)',
                        }
                    ]
                }),
                msg: "操作成功"
            }
        }
    },
    {
        url: '/api/Kanban/GetMonitorCategory',
        type: 'get',
        response: (req) => {
            console.log('req2',req)
            return {
                status: 200,
                bl: true,
                data: Mock.mock({
                    'rows|20': [
                        {
                            'Id': "@guid",
                            'Name': '@ctitle(5, 8)',
                            'Children|0-5': [
                                {
                                    'Id': "@guid",
                                    'Name': '@ctitle(5, 8)',
                                    'Children|0-10': [
                                        {
                                            'Id': "@guid",
                                            'Name': '@ctitle(5, 8)',
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }),
                msg: "操作成功"
            }
        }
    },
]

export default mocks;