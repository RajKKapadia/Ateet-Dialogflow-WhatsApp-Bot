const express = require('express');
require('dotenv').config();

const webApp = express();

const { API_PORT } = process.env;
const PORT = API_PORT || 5000;

webApp.use(express.urlencoded({ extended: true }));
webApp.use(express.json());
webApp.use((req, res, next) => {
    console.log(`Path ${req.path} with Method ${req.method}`);
    next();
});

const homeRoute = require('./routes/homeRoute');
const twilioRoute = require('./routes/twilioRoute');
const dialogflowRoute = require('./routes/dialogflowRoute');

webApp.use('/', homeRoute.router);
webApp.use('/twilio', twilioRoute.router);
webApp.use('/dialogflow', dialogflowRoute.router);

webApp.listen(PORT, () => {
    console.log(`Mongodb connected and Server is running at ${PORT}.`);
});
