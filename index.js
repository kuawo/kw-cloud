const Koa = require("koa");
const Router = require("koa-router");
const logger = require("koa-logger");
const bodyParser = require("koa-bodyparser");
const fs = require("fs");
const request = require('request')
const path = require("path");
const { init: initDB, Counter } = require("./db");

const router = new Router();

const homePage = fs.readFileSync(path.join(__dirname, "index.html"), "utf-8");

// 首页
router.get("/", async (ctx) => {
  ctx.body = homePage;
});

// 更新计数
router.post("/api/count", async (ctx) => {
  const { request } = ctx;
  const { action } = request.body;
  if (action === "inc") {
    await Counter.create();
  } else if (action === "clear") {
    await Counter.destroy({
      truncate: true,
    });
  }

  ctx.body = {
    code: 0,
    data: await Counter.count(),
  };
});

// 获取计数
router.get("/api/count", async (ctx) => {
  const result = await Counter.count();

  ctx.body = {
    code: 0,
    data: result,
  };
});

// 小程序调用，获取微信 Open ID
router.get("/api/wx_openid", async (ctx) => {
  if (ctx.request.headers["x-wx-source"]) {
    ctx.body = req.headers["x-wx-openid"];
  }
});


router.get("/api/wx_template_send", async (ctx) => {
  ctx.body = new Promise((resolve, reject) => {
    request({
      method: 'POST',
      url: 'https://api.weixin.qq.com/cgi-bin/message/template/send',
      body: JSON.stringify({
        "touser": 'oQlTZ6YQBpv89Rwk_68HwDQbMOjI', // 可以从请求的header中直接获取 req.headers['x-wx-openid'] 
        "template_id":"YxhlD55nccE7mA4TxVuNjF80I4hRchT_hZ0LxSByPho",
//         "url":"http://weixin.qq.com/download",  
//         "miniprogram":{
//            "appid":"xiaochengxuappid12345",
//            "pagepath":"index?foo=bar"
//         },          
        "data":{
             "first": {
                 "value":"恭喜你购买成功！",
                 "color":"#173177"
             },
             "keyword1":{
                 "value":"巧克力",
                 "color":"#173177"
             },
             "keyword2": {
                 "value":"39.8元",
                 "color":"#173177"
             },
             "keyword3": {
                 "value":"2014年9月22日",
                 "color":"#173177"
             },
             "remark":{
                 "value":"欢迎再次购买！",
                 "color":"#173177"
             }
        }
      })
    },function (error, response) {
      console.log('接口返回内容', response.body)
      resolve(JSON.parse(response.body))
    })
  })
});

const app = new Koa();
app
  .use(logger())
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods());

const port = process.env.PORT || 80;
async function bootstrap() {
  await initDB();
  app.listen(port, () => {
    console.log("启动成功", port);
  });
}
bootstrap();
