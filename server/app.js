const dotenv = require('dotenv');
dotenv.config({ path: __dirname + '/.env' });
const path = require('path');
const express = require('express');
const cors = require('cors');
const CventService = require('./controller/CventService');



const bodyParser = require('body-parser');
global.appRootDir = path.resolve(__dirname);
const app = express();
app.use(express.json({ limit: '50mb' })); // Adjust limit as needed




const timeout = require('connect-timeout');
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(timeout(2000000000));


app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));


app.use(express.static(path.join(__dirname, '../build')));

app.post('/api/customers',CventService.customer);
app.post('/api/orders',CventService.order);


app.use(function (err, req, res, next) {
	console.log('err==', err);
	return res.status(err.status || 500).send({ status: false, err });
});
module.exports = app;
