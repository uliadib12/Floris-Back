export default class VariantModel {
    name: string
    price: number
    stock: number
    size: string

    constructor({
        name = '',
        price = 0,
        stock = 0,
        size = ''
    } : {
        name?: string,
        price?: number,
        stock?: number,
        size?: string
    }) {
        this.name = name;
        this.price = price;
        this.stock = stock;
        this.size = size;
    }
}