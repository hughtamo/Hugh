const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    createProxyMiddleware("/analyze", {
      target: "https://naveropenapi.apigw.ntruss.com/sentiment-analysis/v1",
      changeOrigin: true,
    })
  );
};
