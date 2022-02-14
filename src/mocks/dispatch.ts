import { MockItem } from './interface';
import Mock from 'mockjs';

const mocks: MockItem[] = [
    {
        url: '/api/Kanban/GetDispatchSchemaDetailList',
        type: 'get',
        response: (req) => {
            return {
                status: 200,
                bl: true,
                data: Mock.mock({
                    'rows|5-20': [
                        {
                            'Name': '@ctitle(5,10)',
                            'Id': '@guid',
                            'Items|5-20': [
                                {
                                    'ShipId': "@guid",
                                    'ShipName': '@ctitle(3, 10)',
                                    'ShipPic': '@url',
                                    'From': '@ctitle(8)',
                                    'To': '@ctitle(8)',
                                    'State': "@pick(['primary','success','secondary'])"
                                }
                            ]
                        }
                    ]
                }),
                msg: "操作成功"
            }
        }
    }
]

export default mocks;

