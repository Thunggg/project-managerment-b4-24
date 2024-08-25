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

// [GET] /products/:slug
module.exports.detail = async (req, res) => {
  
  const slug = req.params.slug;
  
  const product = await Product.findOne({
    slug: slug,
    deleted: false,
    status: "active"
  });

  if(product){
    res.render("client/pages/products/detail", {
      pageTitle: "Chi tiết sản phẩm",
      product: product
    });
  }
  else{
    res.redirect("back");
  }  
}