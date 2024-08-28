const Account = require("../../models/account.model");

// [GET] /admin/profile
module.exports.index = async (req, res) => {
    res.render('admin/pages/profile/index',{
        pageTitle: "Thông tin cá nhân"
    });
}