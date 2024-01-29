import { getFirestore } from "firebase-admin/firestore";
import UserModel from "./userModel";

export default class UserController {
    firestore : FirebaseFirestore.Firestore;

    constructor(firebaseApp: any) {
        this.firestore = getFirestore(firebaseApp);
    }

    public async getUserById(id: string): Promise<UserModel> {
        const userRef = this.firestore.collection('users').doc(id);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            throw new Error('User does not exist');
        }

        const user = userDoc.data() as UserModel;

        const userModel = new UserModel({
            id: userDoc.id,
            email: user.email,
            password: user.password,
            createdAt: user.createdAt,
            banned: user.banned,
            isAdmin: user.isAdmin
        });

        return userModel;
    }

    public async getAllUsers() {
        const usersRef = this.firestore.collection('users');
        const usersDoc = await usersRef.get();

        if (usersDoc.empty) {
            throw new Error('No users found');
        }

        const users: 
        {
            id: string,
            email: string,
            createdAt: Date,
            banned: boolean,
        }[] = [];

        usersDoc.forEach(userDoc => {
            const user = userDoc.data();
            users.push({
                id: userDoc.id,
                email: user.email,
                createdAt: user.createdAt,
                banned: user.banned
            });
        });

        return users;
    }

    public async banUser(id: string): Promise<void> {
        const userRef = this.firestore.collection('users').doc(id);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            throw new Error('User does not exist');
        }

        await userRef.update({
            banned: true
        });
    }

    public async unbanUser(id: string): Promise<void> {
        const userRef = this.firestore.collection('users').doc(id);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            throw new Error('User does not exist');
        }

        await userRef.update({
            banned: false
        });
    }
}