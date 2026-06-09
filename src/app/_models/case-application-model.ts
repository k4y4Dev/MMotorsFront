import { ICarResponse } from "./icar"
import { UserCaseAdmin } from "./user"

export interface ActiveCaseResponse {
    id: number,
    user_id: number,
    car: ICarResponse,
    status: string,
    created_at: Date,
    updated_at: Date

}

export interface ActiveCaseResponseAdmin {
    id: number,
    user: UserCaseAdmin,
    car: ICarResponse,
    status: string,
    created_at: Date,
    updated_at: Date

}

export interface CaseUserSummary {
    case_id: number,
    email: string,
    lastname: string,
    firstname: string,
    status: string,
    created_at: Date
}

export interface  CarCaseSummary {

    car: ICarResponse
    pending_count: number,
    cases: [CaseUserSummary]
}

