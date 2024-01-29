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
class UserController {
    constructor(firebaseApp) {
        this.firestore = (0, firestore_1.getFirestore)(firebaseApp);
    }
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRef = this.firestore.collection('users').doc(id);
            const userDoc = yield userRef.get();
            if (!userDoc.exists) {
                throw new Error('User does not exist');
            }
            const user = userDoc.data();
            return {
                id: userDoc.id,
                email: user.email,
                createdAt: user.createdAt,
                banned: user.banned
            };
        });
    }
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const usersRef = this.firestore.collection('users');
            const usersDoc = yield usersRef.get();
            if (usersDoc.empty) {
                throw new Error('No users found');
            }
            const users = [];
            usersDoc.forEach(userDoc => {
                const user = userDoc.data();
                users.push({
                    id: userDoc.id,
                    email: user.email,
                    createdAt: user.createdAt.toDate(),
                    banned: user.banned
                });
            });
            return users;
        });
    }
    banUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRef = this.firestore.collection('users').doc(id);
            const userDoc = yield userRef.get();
            if (!userDoc.exists) {
                throw new Error('User does not exist');
            }
            yield userRef.update({
                banned: true
            });
        });
    }
    unbanUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRef = this.firestore.collection('users').doc(id);
            const userDoc = yield userRef.get();
            if (!userDoc.exists) {
                throw new Error('User does not exist');
            }
            yield userRef.update({
                banned: false
            });
        });
    }
}
exports.default = UserController;
