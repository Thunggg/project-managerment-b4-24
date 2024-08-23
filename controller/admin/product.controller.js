const Product = require("../../models/product.model");

const paginationHelper = require("../../helpers/pagination.helper");

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
const pagination = await paginationHelper(req, find);

// -------------------------------------------------------------- 
    const products = await Product
    .find(find)
    .limit(pagination.limitItem)
    .skip(pagination.skip)
    .sort({
        position: "desc"
    });

    res.render('admin/pages/products/index',{
        pageTitle: "trang quản lý sản phẩm",
        products: products,
        keyword: keyword,
        filterStatus: filterStatus,
        pagination: pagination
    });
}

// [PATCH] /admin/products/change-status/:statusChange/:id
module.exports.changeStatus = async (req, res) => {
    
    const {id, statusChange} = req.params;
    
    const product = await Product.findOne({
        _id: id,
        deleted: false
    });

    await Product.updateOne({
        _id: id
    }, {
        status: statusChange
    });

    res.json({
        code: 200
    });
}

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {

    const {ids, status} = req.body;

    switch (status){
        case "active":
        case "inactive":
            await Product.updateMany({
                _id: ids
            },{
                status: status
            });
            break;
        case "delete":
            await Product.updateMany({
                _id: ids
            },{
                deleted: true
            });
            break;
        default:
            break;
    }

    res.json({
        code: 200
    });
}

// [PATCH] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {

    const id = req.params.id;


    await Product.updateOne({
    _id: id
  }, {
    deleted: true
  });

    res.json({
        code: 200
    });
}

// [PATCH] /admin/products/change-position/:id
module.exports.changePosition = async (req, res) => {

    const id = req.params.id;
    const position = req.body.position;

    await Product.updateOne({
        _id: id
    },{
        position: req.body.position
    });

    res.json({
        code: 200
    });
}