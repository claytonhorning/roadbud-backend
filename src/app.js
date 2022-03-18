const express = require('express');
const http = require('http');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const multer = require('multer');

require('./config/database');

const emailSubscriptionApi = require('./routes/emailSubscription.routes');

const port = process.env.PORT || 3000;
const app = express();

app.use(helmet());
app.use(bodyParser.json({ limit: '100mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
app.use(
  multer({
    limits: { fieldSize: 25 * 1024 * 1024 },
    dest: 'uploads/',
  }).fields([
    { name: 'file', maxCount: 1 },
    { name: 'video', maxCount: 1 },
  ])
);

// parse application/json
// Add headers
app.use((req, res, next) => {
  const allowedOrigins = [
    'http://localhost:3000/',
    'http://localhost:3000',
    'http://www.roadbud.app/',
    'https://www.roadbud.app/',
  ];
  const { origin } = req.headers;
  if (allowedOrigins.indexOf(origin) > -1) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  // Website you wish to allow to connect

  // Request methods you wish to allow
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  );

  // Request headers you wish to allow
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

app.use(express.json());
app.use(emailSubscriptionApi);

app.all('*', (req, res) => {
  res.status(200).send({ message: 'Hello, world! Version 0' });
});

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server is up on port : ${port}`);
});
