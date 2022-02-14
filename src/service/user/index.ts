import { store } from "@/store";
import request from "@/utils/request";
import { PasswordUser, User } from "./user.interface";

/**
 * 用户登录 
 * @param data 
 */
export function login(data: { Account: string, Password: string, Token?: string }) {
    return request({
        url: '/api/login',
        method: 'post',
        data
    });
}

/**
 * 获取登录用户信息
 */
export function getInfo() {
    return request({
        url: '/api/loginuser/get',
        method: 'get'
    })
}


/**
 * 登出
 */
export function logout() {
    return request({
        url: '/api/login',
        method: 'delete'
    })
}

/**
 * 修改登录用户密码
 * @returns 
 */
export function updatePassword(data: PasswordUser) {
    return request({
        url: '/api/UserPassword',
        method: 'put',
        data
    })
}

/**
 * 修改登录用户基本信息
 * @returns 
 */
export function updateBaseInfo(data: User) {
    return request({
        url: '/api/UserBase',
        method: 'put',
        data
    })
}

/**
 * 修改登录用户基本信息
 * @returns 
 */
export function updateLoginUser(user: User) {

    user.UserId = store.state.User?.UserId;

    if (!user.UserId) {
        return Promise.reject("用户Id不存在");
    }

    return request({
        url: '/api/loginuser/patch',
        method: 'patch',
        data: user
    }).then(res => {
        if (res.bl) {
            return getInfo();
        }
    })
}