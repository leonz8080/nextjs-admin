export interface RequestModel<T = unknown> {
    url: string;
    adminId: number;
    permissions: string[];
    data: T;
}

export interface ResponseModel<T = unknown> {
    result: number;
    message: string;
    data?: T;
}

export interface PageModel<T = unknown> {
    total: number, 
    pageIndex: number, 
    list: T[]
}

export interface AdminModel {
    id: number;
    avatar: string;
    name: string;
    email: string;
    tele: string;
    address: string;
    password: string;
    roles: number[];
}

export interface UserModel {
    id: number;
    avatar: string;
    name: string;
    level: string;
    expiration: string;
    isValid: number;
    remark: string;
    status: string;
}

export interface EasyQueryModel {
    name: string,
    params?: Record<string, string | number>
}

export interface EasyQueryResModel {
    result: number,
    message?: string,
    data?: number | string | Record<string, string | number> | Record<string, string | number>[]
}

export interface RoleModel {
    id: number;
    name: string;
    permissions?: string[];
}

export interface ProfileModel {
    avatar: string;
    name: string;
    email: string;
    tele: string;
    address: string;
}

export interface NoticeModel {
    id: number;
    avatar: string;
    title: string;
    content: string;
    status: number;
    createAt: string;
}