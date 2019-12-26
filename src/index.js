import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';

import login from './routes/login';
import register from './routes/register';

const app = express();
app.use(morgan('combine'));
app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://localhost/stocks', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

// for dev purposes only
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('we are connected');
});

app.use('/api/login', login);
app.use('/api/register', register);

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(process.env.PORT || 8081, () => console.log('running on localhost:8081'));
