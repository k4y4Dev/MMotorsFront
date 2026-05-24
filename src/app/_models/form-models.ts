export interface LoginFormModel {
    username: string;
    password: string;
}

export interface RegisterFormModel {
    username: string;
    password: string;
    lastname: string;
    firstname: string;
    role: string;
}


export interface CarFormModel {
    name: string;
    price: number;
    km: number;
    image: string;
}

export interface FilterFormModel{
    km: number,
    price: number,
    trade?: string

}