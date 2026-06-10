export interface User {
    email: string;
    lastname: string;
    firstname: string;
    role: string;

}

export interface ApiAuthResponse {
    message: string;
    user: User;
}

export interface UserCaseAdmin {
    email: string;
    lastname: string;
    firstname: string;
}

