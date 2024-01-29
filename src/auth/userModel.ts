var jwt = require('jsonwebtoken');
require('dotenv').config();

export default class UserModel {
    id: string;
    email: string;
    password: string;
    createdAt: Date;
    banned: boolean;
    isAdmin: boolean;

    constructor(
        {
            id,
            email,
            password,
            createdAt,
            banned,
            isAdmin
        }: {
            id: string,
            email: string,
            password: string,
            createdAt: Date,
            banned: boolean,
            isAdmin: boolean
        }
    )
    {
        this.id = id;
        this.email = email;
        this.password = password;
        this.createdAt = createdAt;
        this.banned = banned;
        this.isAdmin = isAdmin;
    }

    public createToken(): string {
        return jwt.sign({ 
            id: this.id,
            email: this.email,
        }, process.env.JWT_SECRET, {
           expiresIn: 86400 // expires in 24 hours
        });
     }
}