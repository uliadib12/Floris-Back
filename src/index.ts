import express from 'express';

var admin = require("firebase-admin");

var serviceAccount = require("../key/kombet-floris-firebase-adminsdk.json");
const firebaseApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();
const port = 3000;

app.get('/', (req: any, res: any) => {
  res.send('The sedulous hyena ate the antelope!');
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});