export default class OrderModel {
    id: string;
    userId: string | undefined;
    address: {
        name: string;
        email: string;
        phone: string;
        address: string;
        day: string;
        time: string;
    };
    prducts: {
        productId: string;
        name: string;
        quantity: number;
        price: number;
        additionalInfo: string;
        variant: string;
    }[];

    constructor(id: string, userId: string | undefined, address: { name: string; email: string; phone: string; address: string; day: string; time: string; }, prducts: { productId: string; name: string; quantity: number; price: number; additionalInfo: string; variant: string; }[]) {
        this.id = id;
        this.userId = userId;
        this.address = address;
        this.prducts = prducts;
    }
}