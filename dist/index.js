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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = __importDefault(require("./auth/authController"));
const userController_1 = __importDefault(require("./user/userController"));
const productController_1 = __importDefault(require("./product/productController"));
const productModel_1 = __importDefault(require("./product/productModel"));
var bodyParser = require('body-parser');
var cors = require('cors');
var admin = require("firebase-admin");
var serviceAccount = require("../key/kombet-floris-firebase-adminsdk.json");
const firebaseApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "gs://kombet-floris.appspot.com"
});
const app = (0, express_1.default)();
const port = 3000;
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json());
app.use(cors());
app.get('/', (req, res) => {
    res.send('The sedulous hyena ate the antelope!');
});
app.get('/api/v1/category/papan-bunga', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productController = new productController_1.default(firebaseApp);
    const products = yield productController.getProducts("papan-bunga");
    res.status(200).send(products);
}));
app.get('/api/v1/category/bouquet', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productController = new productController_1.default(firebaseApp);
    const products = yield productController.getProducts("bouquet");
    res.status(200).send(products);
}));
app.get('/api/v1/category/money-cake', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productController = new productController_1.default(firebaseApp);
    const products = yield productController.getProducts("money-cake");
    res.status(200).send(products);
}));
app.get('/api/v1/category/snack-tower', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productController = new productController_1.default(firebaseApp);
    const products = yield productController.getProducts("snack-tower");
    res.status(200).send(products);
}));
app.get('/api/v1/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userController = new userController_1.default(firebaseApp);
        const users = yield userController.getAllUsers();
        res.status(200).send(users);
    }
    catch (err) {
        res.status(400).send(err.message);
    }
}));
app.post('/api/v1/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authController = new authController_1.default(firebaseApp);
        const { email, password, confirmPassword } = req.body;
        const verifyRegisterRequest = authController
            .verifyRegisterRequest({ email, password, confirmPassword });
        const token = yield authController.register(verifyRegisterRequest);
        res.status(200).send({
            token: token
        });
    }
    catch (err) {
        res.status(400).send(err.message);
    }
}));
app.post('/api/v1/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authController = new authController_1.default(firebaseApp);
        const { email, password } = req.body;
        const verifyLoginRequest = authController
            .verifyLoginRequest({ email, password });
        const token = yield authController.login(verifyLoginRequest);
        res.status(200).send({
            token: token
        });
    }
    catch (err) {
        res.status(400).send(err.message);
    }
}));
app.post('/api/v1/category/papan-bunga/add-product', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productController = new productController_1.default(firebaseApp);
    productController.saveProduct(new productModel_1.default({
        name: req.body.name,
        variants: JSON.parse(req.body.variants),
        images: JSON.parse(req.body.images),
        description: req.body.description
    }), "papan-bunga");
    res.status(200).send({
        message: "success"
    });
}));
app.post('/api/v1/category/bouquet/add-product', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productController = new productController_1.default(firebaseApp);
    productController.saveProduct(new productModel_1.default({
        name: req.body.name,
        variants: JSON.parse(req.body.variants),
        images: JSON.parse(req.body.images),
        description: req.body.description
    }), "bouquet");
    res.status(200).send({
        message: "success"
    });
}));
app.post('/api/v1/category/money-cake/add-product', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productController = new productController_1.default(firebaseApp);
    productController.saveProduct(new productModel_1.default({
        name: req.body.name,
        variants: JSON.parse(req.body.variants),
        images: JSON.parse(req.body.images),
        description: req.body.description
    }), "money-cake");
    res.status(200).send({
        message: "success"
    });
}));
app.post('/api/v1/category/snack-tower/add-product', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productController = new productController_1.default(firebaseApp);
    productController.saveProduct(new productModel_1.default({
        name: req.body.name,
        variants: JSON.parse(req.body.variants),
        images: JSON.parse(req.body.images),
        description: req.body.description
    }), "snack-tower");
    res.status(200).send({
        message: "success"
    });
}));
app.delete('/api/v1/category/papan-bunga/delete-product', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productController = new productController_1.default(firebaseApp);
    productController.deleteProduct(req.body.id, "papan-bunga");
    res.status(200).send({
        message: "success"
    });
}));
app.delete('/api/v1/category/bouquet/delete-product', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productController = new productController_1.default(firebaseApp);
    productController.deleteProduct(req.body.id, "bouquet");
    res.status(200).send({
        message: "success"
    });
}));
app.delete('/api/v1/category/money-cake/delete-product', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productController = new productController_1.default(firebaseApp);
    productController.deleteProduct(req.body.id, "money-cake");
    res.status(200).send({
        message: "success"
    });
}));
app.delete('/api/v1/category/snack-tower/delete-product', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productController = new productController_1.default(firebaseApp);
    productController.deleteProduct(req.body.id, "snack-tower");
    res.status(200).send({
        message: "success"
    });
}));
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
