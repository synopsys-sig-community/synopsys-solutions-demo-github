
const bodyParser = require('body-parser');
const express = require('express');
const pino = require('pino');
const expPino = require('express-pino-logger');

const map = require("collections/map");
const random = require('random');
var sprintf = require('sprintf-js').sprintf


const logger = pino({
    level: 'info',
    prettyPrint: false,
    useLevelLabels: true
});
const expLogger = expPino({
    logger: logger
});


const app = express();

app.use(expLogger);

app.use((req, res, next) => {
    res.set('Timing-Allow-Origin', '*');
    res.set('Access-Control-Allow-Origin', '*');
    next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// stock status product by SKU
app.get('/product/:sku/stock', (req, res) => {
	stock = inventory.get(req.params.sku, null);
	if(stock == null) {
		stock = random.int(min = 0, max = 10);
		inventory.set(req.params.sku, stock);
	}

	jsonObj = [];
	resp = {};
	resp ["sku"] = req.params.sku;
	resp ["stock"] = stock;
	jsonObj.push(resp);
	res.json(jsonObj);
});

// products delivery date
app.get('/product/:sku/delivery', (req, res) => {
	stock = inventory.get(req.params.sku, null);
	if(stock == null) {
		stock = random.int(min = 0, max = 10);
		inventory.set(req.params.sku, stock);
	}


	now = Date.now();
	shippingDate = now;

	if (stock == 0) {
		shippingDate = delivery.get(req.params.sku, null);
		if (shippingDate == null) {
			leadTime = random.int(min = 0, max = 60);
			shippingDate.setDate(shippingDate.getDate() + leadTime);
		}
	} 

	delivery.set (req.params.sku, shippingDate);

	shippingDateVal = new Date(shippingDate);

	jsonObj = [];
	resp = {};
	resp ["sku"] = req.params.sku;
	resp ["delivery"] = shippingDateVal.toDateString();
	jsonObj.push(resp);
	res.json(jsonObj);
});

var inventory = new map();
var delivery = new map()

// fire it up!
const port = process.env.INVENTORY_SERVER_PORT || '8080';
app.listen(port, () => {
    logger.info('Started on port', port);
});

