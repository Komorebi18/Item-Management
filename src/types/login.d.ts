/**
 * 基础类型
 */
export interface Common<T>{
    code: number;
    msg: string;
    data: T;
}
/**
 * 用户信息
 */
export interface useInformation {
    adminId: number;
    username: string;
    permissions: string[];
    token: string;
}

