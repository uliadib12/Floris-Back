import express from 'express';
import AuthController from './auth/authController';
import UserController from './user/userController';

var bodyParser = require('body-parser');

var admin = require("firebase-admin");

var serviceAccount = require("../key/kombet-floris-firebase-adminsdk.json");
const firebaseApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req: any, res: any) => {
  res.send('The sedulous hyena ate the antelope!');
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

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});