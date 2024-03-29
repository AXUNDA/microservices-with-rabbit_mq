const ProductService = require("../services/product-service");

module.exports = (app) => {
  const service = new ProductService();
  app.use("/app-events", (req, res, next) => {
    const { payload } = req.body;
    service.SubscribeEvents(payload);
    console.log("========= Product service received event");
    return res.status(200).json(payload);
  });
};
