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
var bodyParser = require('body-parser');
var admin = require("firebase-admin");
var serviceAccount = require("../key/kombet-floris-firebase-adminsdk.json");
const firebaseApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const app = (0, express_1.default)();
const port = 3000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.get('/', (req, res) => {
    res.send('The sedulous hyena ate the antelope!');
});
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
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
