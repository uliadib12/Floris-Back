import { getFirestore } from "firebase-admin/firestore";
import ProductController from "../product/productController";

export default class OrderController {
    firestore: FirebaseFirestore.Firestore;
    productController: ProductController;

    constructor(firebaseApp: any) {
        this.firestore = getFirestore(firebaseApp);
        this.productController = new ProductController(firebaseApp);
    }

    public getOrders = async () => {
        try {
            const ordersRef = this.firestore.collection('orders');
            const ordersSnapshot = await ordersRef.get();

            const orders =  ordersSnapshot.docs.map((doc: any) => {
                return {
                    id: doc.id,
                    ...doc.data(),
                    createAt: doc.data().createAt = doc.data().createAt.toDate()
                }
            });

            orders.sort((a: any, b: any) => b.createAt - a.createAt);

            return orders;
        }
        catch (err: any) {
            throw new Error(err.message);
        }
    }

    public printOrder = async (id: string) => {
        try {
            const orderRef = this.firestore.collection('orders').doc(id);
            const orderDoc = await orderRef.get();

            if (!orderDoc.exists) {
                throw new Error('Order does not exist');
            }
            
            return {
                id: orderDoc.id,
                ...orderDoc.data(),
            }
        }
        catch (err: any) {
            throw new Error(err.message);
        }
    }

    public makeOrder = async (order: any) => {
        try {
            const validateOrder = await this.validateOrder(order);
            const orderRef = this.firestore.collection('orders');
            const orderDoc = await orderRef.add(
                {
                    address: validateOrder.address,
                    products: validateOrder.products,
                    payment: validateOrder.payment,
                    status: 'pending',
                    createAt: new Date()
                }
            )

            return [orderDoc.id, validateOrder.address.email, validateOrder.address, validateOrder.products]
        }
        catch (err: any) {
            throw new Error(err.message);
        }
    }

    public updateOrder = async (id: string, status: string) => {
        try {
            const orderRef = this.firestore.collection('orders').doc(id);
            const orderDoc = await orderRef.get();

            if (!orderDoc.exists) {
                throw new Error('Order does not exist');
            }

            await orderRef.update({ status });

            return {
                id: orderDoc.id,
                ...orderDoc.data(),
            }
        }
        catch (err: any) {
            throw new Error(err.message);
        }
    }

    private validateOrder = async (order: any) => {
        const { address, products, payment } = order;

        if (!address) {
            throw new Error('Address is required');
        }

        if (!products) {
            throw new Error('Products is required');
        }

        if (!payment) {
            throw new Error('Payment is required');
        }

        const productsValidated = await Promise.all(products.map(async (product: any) => {
            const productData = await this.productController.getProductById(product.id) as any;

            if (!productData) {
                throw new Error('Product not found');
            }
            
            const variant = productData.variants.find((variant: any) => variant.name === product.variantName);

            return {
                productId: product.id,
                name: productData.name,
                quantity: product.quantity,
                price: variant.price,
                additionalInfo: product.additionalInfo,
                variant: variant.name
            };
        }));
        
        return {
            address,
            products: productsValidated,
            payment
        };
    }
}