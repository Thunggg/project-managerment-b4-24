const Role = require("../../models/role.model");

// [GET] /admin/products/create
module.exports.index = async (req, res) => {

    const records = await Role.find({
        deleted: false
    });

    res.render('admin/pages/roles/index',{
        pageTitle: "Thêm mới sản phẩm",
        records: records
    });
}
