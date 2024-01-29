import express from 'express';
import AuthController from './auth/authController';
import UserController from './user/userController';
import ProductController from './product/productController';
import ProductModel from './product/productModel';

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

app.post('/api/v1/category/bunga-papan/money-cake', async (req: any, res: any) => {
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

app.post('/api/v1/category/bunga-papan/snack-tower', async (req: any, res: any) => {
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

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});