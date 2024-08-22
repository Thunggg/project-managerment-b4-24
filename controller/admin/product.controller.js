const Product = require("../../models/product.model");

// [GET] /admin/products
module.exports.index = async (req, res) => {

    const products = await Product.find({
        status: "active",
        deleted: false
    });


    res.render('admin/pages/products/index',{
        pageTitle: "trang quản lý sản phẩm",
        products: products
    });
}