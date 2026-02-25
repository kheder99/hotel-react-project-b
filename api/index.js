import { app, connectDB } from "../index";

export default async function handler(req, res) {
  // اتصل بقاعدة البيانات مع caching
  await connectDB();

  // استخدم Express app لمعالجة الطلب
  return app(req, res);
}
