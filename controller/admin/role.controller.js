const Role = require("../../models/role.model");
const systemConfig = require("../../config/system");

// [GET] /admin/roles
module.exports.index = async (req, res) => {

    const records = await Role.find({
        deleted: false
    });

    res.render('admin/pages/roles/index',{
        pageTitle: "Thêm mới nhóm quyền",
        records: records
    });
}

// [GET] /admin/roles/create
module.exports.create = async (req, res) => {
    res.render("admin/pages/roles/create", {
      pageTitle: "Tạo mới nhóm quyền",
    });
};

// [GET] /admin/roles/create
module.exports.createPost = async (req, res) => {

    const records = new Role(req.body);
    records.save();

    res.redirect(`/${systemConfig.prefixAdmin}/roles`);
};