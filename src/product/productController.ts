import { getFirestore } from "firebase-admin/firestore";
import { Storage, getStorage } from 'firebase-admin/storage';
import ProductModel from "./productModel";

export default class ProductController {
    firestore: FirebaseFirestore.Firestore;
    storage: Storage;

    constructor(firebaseApp: any) {
        this.firestore = getFirestore(firebaseApp);
        this.storage = getStorage();
    }

    public async getProductById(id: string) {
        const productRef = this.firestore.collection('products').doc(id);
        const productDoc = await productRef.get();

        return {
            id: productDoc.id,
            ...productDoc.data()
        };
    }

    public async getProducts(type: string) {
        const productRef = this.firestore.collection(type);
        const productsDoc = await productRef.get();
        const products: any[] = [];

        productsDoc.forEach((doc) => {
            products.push({
                id: doc.id,
                ...doc.data()
            });
        });

        return products;
    }

    public async saveProduct(product: ProductModel, type: string) {
        const imageUrls = await this.saveImageToStorage(product);

        const productId = await this.saveProductToFirestore(product, imageUrls);
        await this.saveProductToFirestoreWithId(product, imageUrls, productId, type);
    }

    public base64ToImage(base64: string) {
        const base64Data = base64.replace(/^data:image\/\w+;base64,/, '');
        const image = Buffer.from(base64Data, 'base64');
        return image;
    }

    private async saveProductToFirestore(product: ProductModel, imageUrls: string[]) {
        const productRef = this.firestore.collection('products');

        const productDoc = await productRef.add({
            name: product.name,
            variants: product.variants,
            images: imageUrls,
            description: product.description
        });

        return productDoc.id;
    }

    private async saveProductToFirestoreWithId(product: ProductModel, imageUrls: string[], id: string, type: string) {
        const productRef = this.firestore.collection(type).doc(id);

        const productDoc = await productRef?.set({
            name: product.name,
            variants: product.variants,
            images: imageUrls,
            description: product.description
        });

        return id;
    }

    private async saveImageToStorage(product: ProductModel) {
        const images = product.images;
        if(!images){
            return [];
        }

        const imageUrls: string[] = [];

        for (let i = 0; i < images.length; i++) {
            const image = images[i];
            const imageBuffer = this.base64ToImage(image);
            const imageFileName = `${product.name}-${i}.${image.split(';')[0].split('/')[1]}`;
            const bucket = this.storage.bucket();
            const file = bucket.file(`products/${imageFileName}`);
            await file.save(imageBuffer);
            const imageUrl = await file.getSignedUrl({
                action: 'read',
                expires: '03-09-2491'
            });
            imageUrls.push(imageUrl[0]);
        }

        return imageUrls;
    }

    public async deleteProduct(id: string, type: string) {
        const productRef = this.firestore.collection('products').doc(id);
        await productRef.delete();

        const productTypeRef = this.firestore.collection(type).doc(id);
        await productTypeRef.delete();
    }
}