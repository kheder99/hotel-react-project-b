// const dbURI = "mongodb://localhost:27017/hotels";
require("dotenv").config();
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const bcrypt = require("bcrypt");
var mongoose = require("mongoose");
var apiRouter = require("./routers/api");
const cors = require("cors");

const dbURI = process.env.MONGODB_URI;
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}
async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
      .then((m) => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
// mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
// const dbConn = mongoose.connection;

// dbConn.on("error", (err) => {
//   console.error(err);
// });
// dbConn.once("open", () => {
//   console.log("DB started successfully");
// });

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
// app.use(passport.initialize());
// app.use(passport.session());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true,
  }),
);

app.use("/api", apiRouter);
//thats for container
// app.listen(process.env.PORT || "3000", console.log("listining to port 3000"));

app.use((req, res, next) => {
  res.status(404).send({ error: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: "Internal Server Error" });
});

// =====================
// START SERVER (Local dev only)
// =====================
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  connectDB().then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`),
    );
  });
}

//thats for serverless functions (vercel)
module.exports = { app, connectDB };
// var createError = require('http-errors');
// var express = require('express');
// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');
// const bcrypt = require('bcrypt');
// var mongoose = require('mongoose');
// var apiRouter = require('./routers/api');
// var cors = require('cors')
// // const  dbURI = "mongodb+srv://zain:cmX84A6ragK4h0XI@cluster0.yoddb.mongodb.net/hotels?retryWrites=true&w=majority";
// // const  dbURI = "mongodb+srv://khederibrahem99:0SGZwIPqRJEL9Q2C@cluster0.l7jdw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// const dbURI = "mongodb+srv://khederibrahem99:vDb0cs4dBpk4AWzP@cluster0.l7jdw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// //const dbURI = "mongodb://localhost:27017/hotels";
// mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
// const dbConn = mongoose.connection;

// dbConn.on("error", (err) => { console.error(err) });
// dbConn.once("open", () => { console.log("DB started successfully") });

// var app = express();
// app.use(cors())
// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
// // app.use(passport.initialize());
// // app.use(passport.session());

// app.use('/api', apiRouter);

// app.listen(process.env.PORT || '3000', console.log("listining to port 3000"));
