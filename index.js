const Koa = require("koa");

const Router = require("koa-router");
const logger = require("koa-logger");
const koaBody = require("koa-body");

const send_request = require('request')

// const fs = require("fs");
// const path = require("path");
// const { init: initDB, Counter } = require("./db");

// const homePage = fs.readFileSync(path.join(__dirname, "index.html"), "utf-8");

const router = new Router();

// 首页
router.get("/", async (ctx) => {
  ctx.body = { code: 0, data: {} };//homePage;
});

// 小程序调用，获取微信 Open ID
router.get("/api/wx_openid", async (ctx) => {
  if (ctx.request.headers["x-wx-source"]) {
    ctx.body = req.headers["x-wx-openid"];
  }
});

// 发送模板消息
router.post("/api/kw_template_send", async (ctx) => {
  let np = new Promise((resolve, reject) => {
    send_request({
      method: 'POST',
      url: 'https://api.weixin.qq.com/cgi-bin/message/template/send',
      body: JSON.stringify(ctx.request.body)
    },function (error, response) {
      console.log('接口返回内容', response.body)
      resolve(JSON.parse(response.body))
    })
  })
  
  np.then((body) => {
      ctx.body = body
  })
});

const app = new Koa();
app.use(koaBody()).use(logger()).use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 80;
app.listen(port, () => {
  console.log("启动成功", port);
});

// async function bootstrap() {
//   await initDB();
//   app.listen(port, () => {
//     console.log("启动成功", port);
//   });
// }
// bootstrap();
