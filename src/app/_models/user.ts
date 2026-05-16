export interface User {
    email: string
}

export interface ApiAuthResponse {
    message: string;
    user: User;
}