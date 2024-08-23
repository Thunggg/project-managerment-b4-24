const Product = require("../../models/product.model");

// [GET] /products/
module.exports.index = async (req, res) => {
  const products = await Product
  .find({
    status: "active",
    deleted: false
  })
  .sort({
    position: "desc"
  });

  for(const product of products){
    product.priceNew = ((1 - product.discountPercentage / 100) * product.price).toFixed(0);
  }

  res.render("client/pages/products/index", {
    pageTitle: "Danh sách sản phẩm",
    products: products
  });
}