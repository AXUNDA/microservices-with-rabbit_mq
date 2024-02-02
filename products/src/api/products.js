const ProductService = require("../services/product-service");

const UserAuth = require("./middlewares/auth");
const { PublishCustomerEvent, PublishShoppingEvent } = require("../utils");

module.exports = (app) => {
  const service = new ProductService();

  app.post("/product/create", async (req, res, next) => {
    try {
      const { name, desc, type, unit, price, available, supplier, banner } =
        req.body;
      // validation
      const { data } = await service.CreateProduct({
        name,
        desc,
        type,
        unit,
        price,
        available,
        supplier,
        banner,
      });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get("/category/:type", async (req, res, next) => {
    const type = req.params.type;

    try {
      const { data } = await service.GetProductsByCategory(type);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get("/:id", async (req, res, next) => {
    const productId = req.params.id;

    try {
      const { data } = await service.GetProductDescription(productId);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  app.post("/ids", async (req, res, next) => {
    try {
      const { ids } = req.body;
      const products = await service.GetSelectedProducts(ids);
      return res.status(200).json(products);
    } catch (err) {
      next(err);
    }
  });

  app.put("/wishlist", UserAuth, async (req, res, next) => {
    const { _id } = req.user;
    const { data } = service.getProductPayload(
      _id,
      { productId: req.body._id },
      "ADD_TO_WISHLIST"
    );

    try {
      PublishCustomerEvent(data);
      //   const product = await service.GetProductById(req.body._id);
      //   const wishList = await customerService.AddToWishlist(_id, product);
      return res.status(200).json(data.data.product);
    } catch (err) {}
  });

  app.delete("/wishlist/:id", UserAuth, async (req, res, next) => {
    const { _id } = req.user;
    const productId = req.params.id;

    try {
      const { data } = service.getProductPayload(
        _id,
        { productId },
        "REMOVE_FROM_WISHLIST"
      );
      PublishCustomerEvent(data);
      // const product = await service.GetProductById(productId);
      // const wishlist = await customerService.AddToWishlist(_id, product);
      return res.status(200).json(data.data.product);
    } catch (err) {
      next(err);
    }
  });

  app.put("/cart", UserAuth, async (req, res, next) => {
    const { _id } = req.user;
    const { productId, qty } = req.body;

    try {
      const { data } = service.getProductPayload(
        _id,
        { productId, qty },
        "ADD_TO_CART"
      );
      PublishCustomerEvent(data);
      PublishShoppingEvent(data);
      const response = {
        product: data.data.product,
        unit: data.data.qty,
      };
      // const product = await service.GetProductById(_id);

      // const result = await customerService.ManageCart(
      //   req.user._id,
      //   product,
      //   qty,
      //   false
      // );

      return res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  });

  app.delete("/cart/:id", UserAuth, async (req, res, next) => {
    const { _id } = req.user;
    const { productId } = req.body;

    try {
      const { data } = service.getProductPayload(
        _id,
        { productId, qty },
        "REMOVE_FROM_CART"
      );
      PublishCustomerEvent(data);
      PublishShoppingEvent(data);
      const response = {
        product: data.data.product,
        unit: data.data.qty,
      };
      // const product = await service.GetProductById(req.params.id);
      // const result = await customerService.ManageCart(_id, product, 0, true);
      return res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  });

  //get Top products and category
  app.get("/", async (req, res, next) => {
    //check validation
    try {
      const { data } = await service.GetProducts();
      return res.status(200).json(data);
    } catch (error) {
      next(err);
    }
  });
};
