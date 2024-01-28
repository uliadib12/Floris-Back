const express = require('express');

const app = express();
const port = 3000;

app.get('/', (req: any, res: any) => {
  res.send('Test Baru Lagi');
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});