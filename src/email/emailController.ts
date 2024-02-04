import OrderModel from "../order/orderModel";

export default class EmailController {
    sgMail: any;

    constructor() {
        require('dotenv').config();

        this.sgMail = require('@sendgrid/mail');
        this.sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    }
    
    sendEmailOrder = async (id:string ,email: string, address: any, products: any) => {
        const msg = {
            to: email,
            from: 'adib_ulinuha_el_majid@teknokrat.ac.id', // Use the email address or domain you verified above
            subject: 'Your order has been received',
            html: `
            <h1>Your order has been received</h1>
            <p>Address: ${address.address}</p>
            <p>Day: ${address.day}</p>
            <p>Time: ${address.time}</p>
            <h2>Products</h2>
            <ul>
                ${products.map((product: any) => `<li>${product.name} - ${product.quantity}</li>`).join('')}
            </ul>
            `
        };
        
        try {
            await this.sgMail.send(msg);
            await this.sendEmailOrderToAdmin(id, email, address, products);
        }
        catch (err: any) {
            throw new Error(err.message);
        }
    }

    sendEmailOrderToAdmin = async (id:string ,email: string, address: any, products: any) => {
        const msg = {
            to: 'adib_ulinuha_el_majid@teknokrat.ac.id',
            from: 'adib_ulinuha_el_majid@teknokrat.ac.id',
            subject: 'New order has been received',
            html: `
            <h1>New order has been received</h1>
            <p>Order ID: ${id}</p>
            <p>Email: ${email}</p>
            <p>Address: ${address.address}</p>
            <p>Day: ${address.day}</p>
            <p>Time: ${address.time}</p>
            <h2>Products</h2>
            <ul>
                ${products.map((product: any) => `<li>${product.name} - ${product.quantity}</li>`).join('')}
            </ul>
            `
        };

        try {
            await this.sgMail.send(msg);
        }
        catch (err: any) {
            throw new Error(err.message);
        }
    }

    sendEmailOrderStatus = async (email: string, address: any, products: any, status: string) => {
        const msg = {
            to: email,
            from: 'adib_ulinuha_el_majid@teknokrat.ac.id',
            subject: `Your order has been ${status}`,
            html: `
            <h1>Your order has been ${status}</h1>
            <p>Address: ${address.address}</p>
            <p>Day: ${address.day}</p>
            <p>Time: ${address.time}</p>
            <h2>Products</h2>
            <ul>
                ${products.map((product: any) => `<li>${product.name} - ${product.quantity}</li>`).join('')}
            </ul>
            `
        };

        try {
            await this.sgMail.send(msg);
        }
        catch (err: any) {
            throw new Error(err.message);
        }
    }
            
}