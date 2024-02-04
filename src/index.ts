import express from 'express';
import AuthController from './auth/authController';
import UserController from './user/userController';
import ProductController from './product/productController';
import ProductModel from './product/productModel';
import OrderController from './order/orderController';
import EmailController from './email/emailController';

var bodyParser = require('body-parser');
var cors = require('cors');

var admin = require("firebase-admin");

var serviceAccount = require("../key/kombet-floris-firebase-adminsdk.json");
const firebaseApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://kombet-floris.appspot.com"
});

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true , limit: '50mb'}));
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req: any, res: any) => {
  res.send('The sedulous hyena ate the antelope!');
});

app.get('/api/v1/product/:id', async (req: any, res: any) => {
  const productController = new ProductController(firebaseApp);
  const product = await productController.getProductById(req.params.id);

  res.status(200).send(product);
});

app.get('/api/v1/category/papan-bunga', async (req: any, res: any) => {
  const productController = new ProductController(firebaseApp);
  const products = await productController.getProducts("papan-bunga");

  res.status(200).send(products);
});

app.get('/api/v1/category/bouquet', async (req: any, res: any) => {
  const productController = new ProductController(firebaseApp);
  const products = await productController.getProducts("bouquet");

  res.status(200).send(products);
});

app.get('/api/v1/category/money-cake', async (req: any, res: any) => {
  const productController = new ProductController(firebaseApp);
  const products = await productController.getProducts("money-cake");

  res.status(200).send(products);
});

app.get('/api/v1/category/snack-tower', async (req: any, res: any) => {
  const productController = new ProductController(firebaseApp);
  const products = await productController.getProducts("snack-tower");

  res.status(200).send(products);
});

app.get('/api/v1/users', async (req: any, res: any) => {
  try{
    const userController = new UserController(firebaseApp);

    const users = await userController.getAllUsers();

    res.status(200).send(users);
  }
  catch(err: any){
    res.status(400).send(err.message);
  }
});

app.post('/api/v1/register', async (req: any, res: any) => {
  try{
    const authController = new AuthController(firebaseApp);

    const { email, password, confirmPassword } = req.body;

    const verifyRegisterRequest = authController
    .verifyRegisterRequest({ email, password, confirmPassword });

    const token = await authController.register(verifyRegisterRequest);

    res.status(200).send(
      {
        token: token
      }
    );
  }
  catch(err: any){
    res.status(400).send(err.message);
  }
});

app.get('/api/v1/orders', async (req: any, res: any) => {
  try{
    const orderController = new OrderController(firebaseApp);

    const orders = await orderController.getOrders();

    res.status(200).send(orders);
  }
  catch(err: any){
    res.status(400).send(err.message);
  }
});

app.get('/api/v1/order/:id/print', async (req: any, res: any) => {
  try{
    const PDFDocument = require('pdfkit');

    const orderController = new OrderController(firebaseApp);

    const order = await orderController.printOrder(req.params.id) as any;

    const doc = new PDFDocument();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=download.pdf');

    doc.pipe(res);

    doc.fontSize(25).text('Order ID: ' + order.id);
    doc.fontSize(15).text('Name: ' + order.address.name);
    doc.fontSize(15).text('Email: ' + order.address.email);
    doc.fontSize(15).text('Address: ' + order.address.address);
    doc.fontSize(15).text('Day: ' + order.address.day);
    doc.fontSize(15).text('Time: ' + order.address.time);
    doc.fontSize(20).text('Products');

    order.products.forEach((product: any) => {
      doc.fontSize(15).text(product.name + ' - ' + product.quantity);
    });

    doc.end();
  }
  catch(err: any){
    res.status(400).send(err.message);
  }
});

app.patch('/api/v1/order/:id', async (req: any, res: any) => {
  try{
    const orderController = new OrderController(firebaseApp);
    const emailController = new EmailController();

    const order = await orderController.updateOrder(req.params.id, req.body.status) as any;
    await emailController
    .sendEmailOrderStatus(
      order.address.email,
      order.address,
      order.products,
      req.body.status
    );

    res.status(200).send(order);
  }
  catch(err: any){
    res.status(400).send(err.message);
  }
});

app.post('/api/v1/make-order', async (req: any, res: any) => {
  try{
    const data = JSON.parse(req.body.data);
    const orderController = new OrderController(firebaseApp);
    const emailController = new EmailController();
    const [id, email, address, products] = await orderController.makeOrder(data);
    await emailController.sendEmailOrder(id, email, address, products);

    res.status(200).send(
      {
        order: "success"
      }
    );
  }
  catch(err: any){
    res.status(400).send(err.message);
  }
});

app.post('/api/v1/login', async (req: any, res: any) => {
  try{
    const authController = new AuthController(firebaseApp);

    const { email, password } = req.body;

    const verifyLoginRequest = authController
    .verifyLoginRequest({ email, password });

    const token = await authController.login(verifyLoginRequest);

    res.status(200).send(
      {
        token: token
      }
    );
  }
  catch(err: any){
    res.status(400).send(err.message);
  }
});

app.post('/api/v1/category/papan-bunga/add-product', async (req: any, res: any) => {
  const productController = new ProductController(firebaseApp);
  productController.saveProduct(
    new ProductModel(
      {
        name: req.body.name,
        variants: JSON.parse(req.body.variants),
        images: JSON.parse(req.body.images),
        description: req.body.description
      }
    ),
    "papan-bunga");

    res.status(200).send(
      {
        message: "success"
      }
    );
});

app.post('/api/v1/category/bouquet/add-product', async (req: any, res: any) => {
  const productController = new ProductController(firebaseApp);
  productController.saveProduct(
    new ProductModel(
      {
        name: req.body.name,
        variants: JSON.parse(req.body.variants),
        images: JSON.parse(req.body.images),
        description: req.body.description
      }
    ),
    "bouquet");

    res.status(200).send(
      {
        message: "success"
      }
    );
});

app.post('/api/v1/category/money-cake/add-product', async (req: any, res: any) => {
  const productController = new ProductController(firebaseApp);
  productController.saveProduct(
    new ProductModel(
      {
        name: req.body.name,
        variants: JSON.parse(req.body.variants),
        images: JSON.parse(req.body.images),
        description: req.body.description
      }
    ),
    "money-cake");

    res.status(200).send(
      {
        message: "success"
      }
    );
});

app.post('/api/v1/category/snack-tower/add-product', async (req: any, res: any) => {
  const productController = new ProductController(firebaseApp);
  productController.saveProduct(
    new ProductModel(
      {
        name: req.body.name,
        variants: JSON.parse(req.body.variants),
        images: JSON.parse(req.body.images),
        description: req.body.description
      }
    ),
    "snack-tower");

    res.status(200).send(
      {
        message: "success"
      }
    );
});

app.delete('/api/v1/category/papan-bunga/delete-product', async (req: any, res: any) => {
  const productController = new ProductController(firebaseApp);
  productController.deleteProduct(req.body.id, "papan-bunga");

  res.status(200).send(
    {
      message: "success"
    }
  );
});

app.delete('/api/v1/category/bouquet/delete-product', async (req: any, res: any) => {
  const productController = new ProductController(firebaseApp);
  productController.deleteProduct(req.body.id, "bouquet");

  res.status(200).send(
    {
      message: "success"
    }
  );
});

app.delete('/api/v1/category/money-cake/delete-product', async (req: any, res: any) => {
  const productController = new ProductController(firebaseApp);
  productController.deleteProduct(req.body.id, "money-cake");

  res.status(200).send(
    {
      message: "success"
    }
  );
});

app.delete('/api/v1/category/snack-tower/delete-product', async (req: any, res: any) => {
  const productController = new ProductController(firebaseApp);
  productController.deleteProduct(req.body.id, "snack-tower");

  res.status(200).send(
    {
      message: "success"
    }
  );
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});