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
const firestore_1 = require("firebase-admin/firestore");
const userModel_1 = __importDefault(require("../user/userModel"));
class AuthController {
    constructor(firebaseApp) {
        this.firestore = (0, firestore_1.getFirestore)(firebaseApp);
    }
    login({ email, password }) {
        return __awaiter(this, void 0, void 0, function* () {
            const emailExists = yield this.checkIfEmailExists(email);
            if (!emailExists) {
                throw new Error('Email does not exist');
            }
            const userRef = this.firestore.collection('users').where('email', '==', email);
            const userDoc = yield userRef.get();
            if (userDoc.empty) {
                throw new Error('Email does not exist');
            }
            const user = userDoc.docs[0].data();
            if (!this.comparePassword(password, user.password)) {
                throw new Error('Password is incorrect');
            }
            const userModel = new userModel_1.default({
                id: userDoc.docs[0].id,
                email: user.email,
                password: user.password,
                createdAt: user.createdAt,
                banned: user.banned,
                isAdmin: user.isAdmin
            });
            return userModel.createToken();
        });
    }
    register({ email, password }) {
        return __awaiter(this, void 0, void 0, function* () {
            const emailExists = yield this.checkIfEmailExists(email);
            if (emailExists) {
                throw new Error('Email already exists');
            }
            const hashedPassword = this.hashPassword(password);
            const user = yield this.createUser({ email, password: hashedPassword });
            return user.createToken();
        });
    }
    verifyLoginRequest({ email, password }) {
        if (!email || !password) {
            throw new Error('Email and password are required');
        }
        if (!email.includes('@')) {
            throw new Error('Email must be a valid email address');
        }
        if (password.length < 6) {
            throw new Error('Password must be at least 6 characters');
        }
        return { email, password };
    }
    verifyRegisterRequest({ email, password, confirmPassword }) {
        if (!email || !password || !confirmPassword) {
            throw new Error('Email, password and confirm password are required');
        }
        if (!email.includes('@')) {
            throw new Error('Email must be a valid email address');
        }
        if (password.length < 6) {
            throw new Error('Password must be at least 6 characters');
        }
        if (password !== confirmPassword) {
            throw new Error('Password and confirm password must match');
        }
        return { email, password };
    }
    createUser({ email, password }) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRef = this.firestore.collection('users');
            const newUser = yield userRef.add({
                email,
                password,
                createdAt: new Date(),
                banned: false,
                isAdmin: false
            });
            const userDoc = yield newUser.get();
            const user = userDoc.data();
            return new userModel_1.default({
                id: userDoc.id,
                email: user.email,
                password: user.password,
                createdAt: user.createdAt,
                banned: user.banned,
                isAdmin: user.isAdmin
            });
        });
    }
    checkIfEmailExists(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const emailRef = this.firestore.collection('users').where('email', '==', email);
            const emailDoc = yield emailRef.get();
            if (emailDoc.empty) {
                return false;
            }
            return true;
        });
    }
    hashPassword(password) {
        const bcrypt = require('bcrypt');
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(password, salt);
        return hash;
    }
    comparePassword(password, hash) {
        const bcrypt = require('bcrypt');
        return bcrypt.compareSync(password, hash);
    }
    verifyToken(token) {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    }
}
exports.default = AuthController;
