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
// #region agent log
fetch("http://127.0.0.1:7760/ingest/3f9c3337-dab9-4ddc-a905-eaadd0d240fd",{method:"POST",headers:{"Content-Type":"application/json","X-Debug-Session-Id":"7e3d18"},body:JSON.stringify({sessionId:"7e3d18",runId:"pre-fix",hypothesisId:"H1",location:"index.js:module-init",message:"Root module initialized",data:{nodeEnv:process.env.NODE_ENV || null,hasModuleExports:typeof module !== "undefined"},timestamp:Date.now()})}).catch(()=>{});
// #endregion
async function connectDB() {
  // #region agent log
  fetch("http://127.0.0.1:7760/ingest/3f9c3337-dab9-4ddc-a905-eaadd0d240fd",{method:"POST",headers:{"Content-Type":"application/json","X-Debug-Session-Id":"7e3d18"},body:JSON.stringify({sessionId:"7e3d18",runId:"pre-fix",hypothesisId:"H3",location:"index.js:connectDB-entry",message:"connectDB invoked",data:{hasCachedConn:Boolean(cached.conn),hasCachedPromise:Boolean(cached.promise)},timestamp:Date.now()})}).catch(()=>{});
  // #endregion
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

async function serverlessHandler(req, res) {
  // #region agent log
  fetch("http://127.0.0.1:7760/ingest/3f9c3337-dab9-4ddc-a905-eaadd0d240fd",{method:"POST",headers:{"Content-Type":"application/json","X-Debug-Session-Id":"7e3d18"},body:JSON.stringify({sessionId:"7e3d18",runId:"post-fix",hypothesisId:"H1",location:"index.js:serverless-handler",message:"Root serverless handler invoked",data:{method:req?.method || null,url:req?.url || null},timestamp:Date.now()})}).catch(()=>{});
  // #endregion
  await connectDB();
  return app(req, res);
}

//thats for serverless functions (vercel)

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
module.exports = serverlessHandler;
module.exports.default = serverlessHandler;
module.exports.app = app;
module.exports.connectDB = connectDB;
