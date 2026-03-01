const rootModule = require("../index.js");
const app = rootModule.app;
const connectDB = rootModule.connectDB;

// #region agent log
fetch("http://127.0.0.1:7760/ingest/3f9c3337-dab9-4ddc-a905-eaadd0d240fd",{method:"POST",headers:{"Content-Type":"application/json","X-Debug-Session-Id":"7e3d18"},body:JSON.stringify({sessionId:"7e3d18",runId:"pre-fix",hypothesisId:"H2",location:"api/index.js:module-init",message:"API module initialized",data:{appType:typeof app,connectDBType:typeof connectDB},timestamp:Date.now()})}).catch(()=>{});
// #endregion

async function handler(req, res) {
  // #region agent log
  fetch("http://127.0.0.1:7760/ingest/3f9c3337-dab9-4ddc-a905-eaadd0d240fd",{method:"POST",headers:{"Content-Type":"application/json","X-Debug-Session-Id":"7e3d18"},body:JSON.stringify({sessionId:"7e3d18",runId:"pre-fix",hypothesisId:"H4",location:"api/index.js:handler-entry",message:"Serverless handler invoked",data:{method:req?.method || null,url:req?.url || null},timestamp:Date.now()})}).catch(()=>{});
  // #endregion
  // اتصل بقاعدة البيانات مع caching
  await connectDB();

  // استخدم Express app لمعالجة الطلب
  return app(req, res);
}

module.exports = handler;
module.exports.default = handler;
