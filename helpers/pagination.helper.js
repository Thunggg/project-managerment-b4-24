const Product = require("../models/product.model");

module.exports = async (req, find) => {
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

    return pagination;
}