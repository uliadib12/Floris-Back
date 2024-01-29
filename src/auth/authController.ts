import { getFirestore } from "firebase-admin/firestore";
import UserModel from "./userModel";

export default class AuthController {
    firestore : FirebaseFirestore.Firestore;

    constructor(firebaseApp: any) {
        this.firestore = getFirestore(firebaseApp);
    }

    public async login({ email, password }
        : { email: string, password: string })
    {
        const emailExists = await this.checkIfEmailExists(email);

        if (!emailExists) {
            throw new Error('Email does not exist');
        }

        const userRef = this.firestore.collection('users').where('email', '==', email);
        const userDoc = await userRef.get();

        if (userDoc.empty) {
            throw new Error('Email does not exist');
        }

        const user = userDoc.docs[0].data();

        if (!this.comparePassword(password, user.password)) {
            throw new Error('Password is incorrect');
        }

        const userModel = new UserModel({
            id: userDoc.docs[0].id,
            email: user.email,
            password: user.password,
            createdAt: user.createdAt,
            banned: user.banned,
            isAdmin: user.isAdmin
        });

        return userModel.createToken();
    }

    public async register({ email, password }
        : { email: string, password: string })
        : Promise<string>
    {
        const emailExists = await this.checkIfEmailExists(email);

        if (emailExists) {
            throw new Error('Email already exists');
        }

        const hashedPassword = this.hashPassword(password);

        const user = await this.createUser({ email, password: hashedPassword });

        return user.createToken();
    }

    public verifyLoginRequest({ email, password } : { email: string, password: string })
    {
        if (!email || !password) {
            throw new Error('Email and password are required');
        }

        if(!email.includes('@')) {
            throw new Error('Email must be a valid email address');
        }

        if (password.length < 6) {
            throw new Error('Password must be at least 6 characters');
        }

        return { email, password };
    }

    public verifyRegisterRequest({ email, password , confirmPassword } : { email: string, password: string, confirmPassword: string })
    { 
        if (!email || !password || !confirmPassword) {
            throw new Error('Email, password and confirm password are required');
        }

        if(!email.includes('@')) {
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

    private async createUser({ email, password }
        : { email: string, password: string })
        : Promise<UserModel>
    {
        const userRef = this.firestore.collection('users');
        const newUser = await userRef.add({
            email,
            password,
            createdAt: new Date(),
            banned: false,
            isAdmin: false
        });

        const userDoc = await newUser.get();
        const user = userDoc.data() as UserModel;

        return new UserModel({
            id: userDoc.id,
            email: user.email,
            password: user.password,
            createdAt: user.createdAt,
            banned: user.banned,
            isAdmin: user.isAdmin
        });
    }

    private async checkIfEmailExists(email: string): Promise<boolean> {
        const emailRef = this.firestore.collection('users').where('email', '==', email);
        const emailDoc = await emailRef.get();

        if (emailDoc.empty) {
            return false;
        }

        return true;
    }

    public hashPassword(password: string): string {
        const bcrypt = require('bcrypt');
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(password, salt);

        return hash;
    }

    public comparePassword(password: string, hash: string): boolean {
        const bcrypt = require('bcrypt');

        return bcrypt.compareSync(password, hash);
    }

    public verifyToken(token: string): any {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        return decoded;
    }
}