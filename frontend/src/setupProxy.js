const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api/v1/chatbot',
    createProxyMiddleware({
      target: 'http://localhost:3001',
      changeOrigin: true,
      secure: false,
      // pathRewrite: {
      //   '^/api/chatbot': '/api/chatbot',
      // },
      headers: {
        Connection: 'keep-alive'
      }
    })
  );
};

