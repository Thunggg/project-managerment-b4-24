const Product = require("../../models/product.model");

// [GET] /admin/products
module.exports.index = async (req, res) => {
    const find = {
        deleted: false
    };

    if(req.query.status){
        find.status = req.query.status;
    }
// ------------------------[tìm kiếm]------------------------
    let keyword = "";
    if(req.query.keyword){
        keyword = req.query.keyword;
        const regex = new RegExp(req.query.keyword, "i");
        find.title = regex;
    }
// ----------------------------------------------------------


    const products = await Product.find(find);

    res.render('admin/pages/products/index',{
        pageTitle: "trang quản lý sản phẩm",
        products: products,
        keyword: keyword
    });
}