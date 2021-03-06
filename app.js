const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const socket = require('socket.io');
const Bank = require('./server/models/Bank');
const bankController = require('./server/controllers/bank.controller');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config');

const app = express();

mongoose.connect(`mongodb://${process.env.NAME}:${process.env.PASSWORD}@ds161144.mlab.com:61144/ifsc`, { useNewUrlParser: true });

// mongoose.connect('mongodb://localhost/razorpay-ifsc', (err) => {
//   console.log('connected to mongodb');
// });

mongoose.connection.once('open', () => {
  console.log('connected to database');
});

// Setting view for apps
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, './server/views'));

// Set image path
app.use('/images', express.static(path.join(__dirname, './client/src/images')));

// Essential middleware
app.use(bodyParser.json());
app.use(cors());

// Webpack config
if (process.env.NODE_ENV === 'development') {
  console.log('in webpack hot middleware');
  const compiler = webpack(webpackConfig);
  app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath,
  }));
}

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/banks', bankController.setBank);

// require('./server/boostarp')();

const PORT = process.env.PORT || 8001

const server = app.listen(PORT, () => {
  console.log(`server is running at ${PORT}`);
});

const io = socket(server);

io.on('connection', (socket) => {
  socket.on('bankQuery', (bankQuery) => {
    if (bankQuery === '') {
      socket.emit('queryResult', []);
    } else {
      Bank.find({$or: [
        { BANK: new RegExp(bankQuery, 'i') },
        { CITY: new RegExp(bankQuery, 'i') },
        { ADDRESS: new RegExp(bankQuery, 'i') },
      ]})
        .limit(5)
        .exec((err, data) => {
          socket.emit('queryResult', data);
        });
    }
  });
});
