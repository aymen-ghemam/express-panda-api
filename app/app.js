// load env variables
require('../config/envs');
const cors = require('../config/cors');
const errors = require('../config/errors');

// this is a stream used to write logs of HTTP requests with morgan
const accessLogStream = require('../config/accessLogStream');

// uncaughtException
process.on('uncaughtException', err => {
    console.log(err.name, err.message);
    console.error(err.stack);
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    //process.exit(1);

});



const express = require('express');

// helmet add several headers for security
const helmet = require('helmet');
const logger = require('morgan');
// const loggerBody = require('morgan-body');

// import my routes
const panda = require('./routes/panda');
const category = require('./routes/category');

const bodyParser = require('body-parser');
const mongoose = require('../config/db');


const app = express();


// helmet middleware
app.use(helmet());
app.disable('x-powered-by');

// cors middleware
app.use(cors.corsHeaders);

// connection to mongodb
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

// create an access log file
app.use(logger('combined', { stream: accessLogStream }));
app.use(logger('combined'));



// bodyParser middleware to send data as application/json or application/x-www-form-urlencoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// logger for the body data
// loggerBody(app,{noColors:true})

// API context
const context = process.env.CONTEXT;
// for public resources
app.use(`/${context}/public`,express.static('app/public'));

// endpoints
app.use(`/${context}/panda`, panda);
app.use(`/${context}/category`, category);




// express doesn't consider not found 404 as an error so we need to handle 404 explicitly
app.use(errors.notFound);

// handle other errors
app.use(errors.handleOthers(context));

process.on('unhandledRejection', err => {
    console.log(err.name, err.message);
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    //process.exit(1);
});
module.exports  = app;
