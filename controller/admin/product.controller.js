const Product = require("../../models/product.model");
const systemConfig = require("../../config/system");

const paginationHelper = require("../../helpers/pagination.helper");

const ProductCategory = require("../../models/product-category.model");
const createTreeHelper = require("../../helpers/createTree.helper");
const Account = require("../../models/account.model");

var moment = require('moment'); // thư viện này dùng để format ngày tháng năm (có thể format giờ phút giây)

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

// ------------------------[sort]------------------------
const sort = {}

if(req.query.sortValue && req.query.sortKey){
    sort[req.query.sortValue] = req.query.sortKey
}
else{
    sort["position"] = "desc";
}
// -------------------------------------------------------------- 

    const products = await Product
    .find(find)
    .limit(pagination.limitItem)
    .skip(pagination.skip)
    .sort(sort);

    for(item of products){
        
        // Tìm người tạo
        if(item.createdBy){
            const account = await Account.findOne({
                _id: item.createdBy,
                deleted: false
            });

            if(account){
                item.createdByFullName = account.fullName;
            }

        } else{
            item.createdByFullName = "";
        }
        item.createdAtFormat = moment(item.createdAt).format("DD/MM/YY HH:mm:ss");

        //Tìm người chỉnh sửa
        if(item.updatedBy){
            const account = await Account.findOne({
                _id: item.updatedBy,
                deleted: false
            });

            if(account){
                item.updatedByFullName = account.fullName;
            }

        } else{
            item.updatedByFullName = "";
        }
        item.updatedAtFormat = moment(item.updateAt).format("DD/MM/YY HH:mm:ss");
    }



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
    
    if(res.locals.role.permissions.includes("products_edit")){
        try {
            const {id, statusChange} = req.params;
    
            await Product.updateOne({
                _id: id
            }, {
                status: statusChange
            });
    
            req.flash('success', 'Cập nhật trạng thái thành công!');
            
            res.json({
                code: 200
            });
        } catch (error) {
            res.redirect(`/${systemConfig.prefixAdmin}/products`);
        }
    } else{
        res.send(`403`);
    }

    
}

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {

    if(res.locals.role.permissions.includes("products_edit")){
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

        req.flash('success', 'Cập nhật sản phẩm thành công!');


        res.json({
            code: 200
        });


    } else{
        res.send(`403`);
    }

    
}

// [PATCH] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
    if(res.locals.role.permissions.includes("products_delete")){
        try {
            const id = req.params.id;
    
            await Product.updateOne({
                _id: id
            }, {
                deleted: true
            });
    
            req.flash('success', 'Xóa sản phẩm thành công!');
    
            res.json({
                code: 200
            });
        } catch (error) {
            res.redirect(`/${systemConfig.prefixAdmin}/products`);
        }
    } else{
        res.send(`403`);
    }
    
}

// [PATCH] /admin/products/change-position/:id
module.exports.changePosition = async (req, res) => {
    if(res.locals.role.permissions.includes("products_edit")){

        try {
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
        } catch (error) {
            res.redirect(`/${systemConfig.prefixAdmin}/products`);
        }

    } else{
        res.send(`403`);
    }
    
}

// [GET] /admin/products/create
module.exports.create = async (req, res) => {
    const categories = await ProductCategory.find({
        deleted: false
    });
    const newCategories = createTreeHelper(categories);

    res.render('admin/pages/products/create',{
        pageTitle: "Thêm mới sản phẩm",
        categories: newCategories
    });
}

// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {
    if(res.locals.role.permissions.includes("products_create")){

        req.body.price = parseInt(req.body.price);
        req.body.discountPercentage = parseInt(req.body.discountPercentage);
        req.body.stock = parseInt(req.body.stock);

        
        // if(req.file.filename){ do đã up lên cloudiary nên ko cần nữa
        //     req.body.thumbnail = `/uploads/${req.file.filename}`;
        // }
        
        if(req.body.position){
            req.body.position = parseInt(req.body.position);
        } else{
            let countProduct = await Product.countDocuments({});
            req.body.position = countProduct + 1;
        }

        req.body.createdBy = res.locals.account.id;

        // console.log(req.body.createdBy);

        const newProduct = new Product(req.body);
        await newProduct.save();


        res.redirect(`/${systemConfig.prefixAdmin}/products`);

    } else{
        res.send(`403`);
    }
    

}

// [GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {

    try{
        const id = req.params.id;
        const product = await Product.findOne({
            _id: id,
            deleted: false
        });

        const categories = await ProductCategory.find({
            deleted: false
        });

        const newCategories = createTreeHelper(categories);

        if(product){
            res.render('admin/pages/products/edit',{
                pageTitle: "Chỉnh sửa sản phẩm",
                product: product,
                categories: newCategories
            });
        }
        else{
            res.redirect(`/${systemConfig.prefixAdmin}/products`);
        }
    }
    catch(error){
        res.redirect(`/${systemConfig.prefixAdmin}/products`);
    }
}

// [PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
    if(res.locals.role.permissions.includes("products_edit")){

        try {
            const id = req.params.id;
    
            // if(req.file && req.file.filename){ do đã up lên cloudiary nên ko cần nữa
            //     req.body.thumbnail = `/uploads/${req.file.filename}`;
            // }
    
            req.body.price = parseInt(req.body.price);
            req.body.discountPercentage = parseInt(req.body.discountPercentage);
            req.body.stock = parseInt(req.body.stock);
    
            if(req.body.position){
                req.body.position = parseInt(req.body.position);
            } else{
                let countProduct = await Product.countDocuments({});
                req.body.position = countProduct + 1;
            }
    
            req.body.updatedBy = res.locals.account.id;

            await Product.updateOne({
                _id: id,
                deleted: false
            }, req.body);
    
            req.flash("success", "Cập nhật sản phẩm thành công!");
    
    
        } catch (error) {
            req.flash("error", "Cập nhật sản phẩm thất bại");
        }
    
        res.redirect("back");

    } else{
        res.send(`403`);
    }
    
}

// [GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {

    try {
        const id = req.params.id;
        
        const product = await Product.findOne({
            _id: id,
            deleted: false
        });

        if(product){
            res.render('admin/pages/products/detail',{
                pageTitle: "trang chi tiết sản phẩm",
                product: product
            });
        }
        else{
            res.redirect(`/${systemConfig.prefixAdmin}/products`);
        }
        
    } catch (error) {
        res.redirect(`/${systemConfig.prefixAdmin}/products`);
    }
}