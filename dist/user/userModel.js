"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jwt = require('jsonwebtoken');
require('dotenv').config();
class UserModel {
    constructor({ id, email, password, createdAt, banned, isAdmin }) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.createdAt = createdAt;
        this.banned = banned;
        this.isAdmin = isAdmin;
    }
    createToken() {
        return jwt.sign({
            id: this.id,
            email: this.email,
        }, process.env.JWT_SECRET, {
            expiresIn: 86400 // expires in 24 hours
        });
    }
}
exports.default = UserModel;
