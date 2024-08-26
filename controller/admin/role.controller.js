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

// [GET] /admin/roles/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;

        const record = await Role.findOne({
            deleted: false,
            _id: id
        });
        
        res.render("admin/pages/roles/edit", {
            pageTitle: "Chỉnh sửa nhóm quyền",
            record: record
        });

    } catch (error) {
        res.redirect(`/${systemConfig.prefixAdmin}/roles`);
    }
};

// [GET] /admin/roles/edit/:id
module.exports.editPatch = async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;

        await Role.updateOne({
            _id: id,
            deleted: false
        }, data);

        req.flash("success", "Cập nhật thành công!");
        res.redirect("back");

    } catch (error) {
        res.redirect(`/${systemConfig.prefixAdmin}/roles`);
    }
};