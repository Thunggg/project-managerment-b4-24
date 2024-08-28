const Account = require("../../models/account.model");
const md5 = require("md5");
const systemConfig = require("../../config/system");

// [GET] /admin/auth/login
module.exports.login = async (req, res) => {
    res.render("admin/pages/auth/login", {
      pageTitle: "Đăng nhập"
    });
}

// [POST] /admin/auth/login
module.exports.loginPost = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const account = await Account.findOne({
        email: email,
        deleted: false
    });

    if (!account){
        req.flash("error", "Email Không tồn tại!");
        res.redirect("back");
        return;
    }

    if(md5(password) != account.password) {
        req.flash("error", "Sai mật khẩu!");
        res.redirect("back");
        return;
    }
    
    if(account.status != "active") {
        req.flash("error", "Tài khoản đang bị khóa!");
        res.redirect("back");
        return;
    }

    req.flash("success", "đăng nhập thành công!");
    
    res.cookie("token", account.token);
    res.redirect(`/${systemConfig.prefixAdmin}/dashboard`);

    // res.send("OK");
}

// [GET] /admin/auth/out
module.exports.logout = async (req, res) => {
    res.clearCookie("token");

    res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
}