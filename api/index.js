const rootModule = require("../index.js");
const app = rootModule.app;
const connectDB = rootModule.connectDB;

async function handler(req, res) {
  // اتصل بقاعدة البيانات مع caching
  await connectDB();

  // استخدم Express app لمعالجة الطلب
  return app(req, res);
}

module.exports = handler;
module.exports.default = handler;
