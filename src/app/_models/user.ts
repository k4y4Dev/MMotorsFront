import { DocLink } from "./doc-link-model";

export interface User {
    email: string;
    lastname: string;
    firstname: string;
    role: string;

}

export interface ApiAuthResponse {
    message: string;
    user: UserProfile;
}

export interface UserCaseAdmin {
    email: string;
    lastname: string;
    firstname: string;
}

export interface UserProfile extends User {
    id: number,
    doc_links: [DocLink],
}

