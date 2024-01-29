"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const firestore_1 = require("firebase-admin/firestore");
const storage_1 = require("firebase-admin/storage");
class ProductController {
    constructor(firebaseApp) {
        this.firestore = (0, firestore_1.getFirestore)(firebaseApp);
        this.storage = (0, storage_1.getStorage)();
    }
    getProducts(type) {
        return __awaiter(this, void 0, void 0, function* () {
            const productRef = this.firestore.collection(type);
            const productsDoc = yield productRef.get();
            const products = [];
            productsDoc.forEach((doc) => {
                products.push(Object.assign({ id: doc.id }, doc.data()));
            });
            return products;
        });
    }
    saveProduct(product, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const imageUrls = yield this.saveImageToStorage(product);
            const productId = yield this.saveProductToFirestore(product, imageUrls);
            yield this.saveProductToFirestoreWithId(product, imageUrls, productId, type);
        });
    }
    base64ToImage(base64) {
        const base64Data = base64.replace(/^data:image\/png;base64,/, "");
        const image = Buffer.from(base64Data, 'base64');
        return image;
    }
    saveProductToFirestore(product, imageUrls) {
        return __awaiter(this, void 0, void 0, function* () {
            const productRef = this.firestore.collection('products');
            const productDoc = yield productRef.add({
                name: product.name,
                variants: product.variants,
                images: imageUrls,
                description: product.description
            });
            return productDoc.id;
        });
    }
    saveProductToFirestoreWithId(product, imageUrls, id, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const productRef = this.firestore.collection(type).doc(id);
            const productDoc = yield (productRef === null || productRef === void 0 ? void 0 : productRef.set({
                name: product.name,
                variants: product.variants,
                images: imageUrls,
                description: product.description
            }));
            return id;
        });
    }
    saveImageToStorage(product) {
        return __awaiter(this, void 0, void 0, function* () {
            const images = product.images;
            if (!images) {
                return [];
            }
            const imageUrls = [];
            for (let i = 0; i < images.length; i++) {
                const image = images[i];
                const imageBuffer = this.base64ToImage(image);
                const imageFileName = `${product.name}-${i}.png`;
                const bucket = this.storage.bucket();
                const file = bucket.file(`products/${imageFileName}`);
                yield file.save(imageBuffer, {
                    metadata: {
                        contentType: 'image/png'
                    }
                });
                const imageUrl = yield file.getSignedUrl({
                    action: 'read',
                    expires: '03-09-2491'
                });
                imageUrls.push(imageUrl[0]);
            }
            return imageUrls;
        });
    }
}
exports.default = ProductController;
