export interface ICar {
    name: string,
    price: number,
    km: number,
    image: string
    trade: string

}

export interface ICarResponse extends ICar {
    id: number;
}

export interface PaginatedCarResponse {
    cars: ICarResponse[],
    total: number,
    skip: number,
    limit: number,
    has_more: boolean

}
