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


// ------------------------[tối ưu phần button status]------------------------
 const filterStatus = [
    {
        label: "tất cả",
        value: ""
    },
    {
        label: "hoạt động",
        value: "active"
    },
    {
        label: "dừng hoạt động",
        value: "inactive"
    }
 ];
// ---------------------------------------------------------------------------  

// ------------------------[phân trang]------------------------
const pagination = {
    currentPage: 1,
    limitItem: 4
};

if(req.query.page){
    pagination.currentPage = parseInt(req.query.page);
}

pagination.skip = (pagination.currentPage - 1) * pagination.limitItem;

const countProducts = await Product.countDocuments(find);

pagination.totalPage = Math.ceil(countProducts / pagination.limitItem);

// -------------------------------------------------------------- 
    const products = await Product
    .find(find)
    .limit(pagination.limitItem)
    .skip(pagination.skip);

    res.render('admin/pages/products/index',{
        pageTitle: "trang quản lý sản phẩm",
        products: products,
        keyword: keyword,
        filterStatus: filterStatus,
        pagination: pagination
    });
}