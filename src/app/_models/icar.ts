export interface ICar {
    name: string,
    price: number,
    km: number,
    image: string

}

export interface ICarResponse extends ICar {
    id: number;
}
