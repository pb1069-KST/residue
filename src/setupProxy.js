const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/API",
    createProxyMiddleware({
      target: "http://localhost:3001",
      changeOrigin: false,
      // pathRewrite: {
      //   "^/API": "", // '/API' 경로를 제거합니다
      // },
    })
  );

  app.use(
    "/AUTH",
    createProxyMiddleware({
      target: "http://localhost:3002",
      changeOrigin: false,
      // pathRewrite: {
      //   "^/AUTH": "", // '/AUTH' 경로를 제거합니다
      // },
    })
  );
};
