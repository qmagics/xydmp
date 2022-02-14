import { TOKEN_KEY } from '@/utils/auth';
import Cookies from 'js-cookie';
import { MockItem } from './interface';

const MOCK_USERS = [
    {
        Account: "admin",
        Password: "1"
    },
    {
        Account: "qmagics",
        Password: "123456"
    }
]

const userMocks: MockItem[] = [
    // {
    //     url: '/api/login',
    //     type: 'post',
    //     response: (req) => {
    //         const { Account, Password } = JSON.parse(req.body);

    //         const user = MOCK_USERS.find(i => i.Account === Account && i.Password === Password);

    //         Cookies.set(TOKEN_KEY, "11111")

    //         if (user) {
    //             return {
    //                 status: 200,
    //                 bl: true,
    //                 msg: "登录成功"
    //             }
    //         }
    //         else {
    //             return {
    //                 status: 200,
    //                 bl: false,
    //                 msg: "账号或密码不存在"
    //             }
    //         }
    //     }
    // }
]

export default userMocks;