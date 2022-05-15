var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bcrypt = require('bcrypt');
var mongoose = require('mongoose');
var apiRouter = require('./routers/api');
const  dbURI = "mongodb+srv://zain:cmX84A6ragK4h0XI@cluster0.yoddb.mongodb.net/hotels?retryWrites=true&w=majority";
//const dbURI = "mongodb://localhost:27017/hotels";
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
const dbConn = mongoose.connection;

dbConn.on("error", (err) => { console.error(err) });
dbConn.once("open", () => { console.log("DB started successfully") });


var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(passport.initialize());
// app.use(passport.session());


app.use('/api', apiRouter);



app.listen(process.env.PORT || '3000', console.log("listining to port 3000"));
