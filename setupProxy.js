const proxy = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    proxy("/AUTH", {
      target: "http://localhost:3002/",
      changeOrigin: false,
    })
  );
  app.use(
    proxy("/API", {
      target: "http://localhost:3001/",
      changeOrigin: false,
    })
  );
};
