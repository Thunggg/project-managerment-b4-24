const User = require("../../models/user.model");
const ForgotPassword = require("../../models/forgot-password.model");

const md5 = require("md5");
const generateHelper = require("../../helpers/generate.helper"); 

// [GET] /user/register
module.exports.register = async (req, res) => {
    res.render("client/pages/user/register", {
      pageTitle: "Đăng ký tài khoản",
    });
};

// [POST] /user/register
module.exports.registerPost = async (req, res) => {

    const exitUser = await User.findOne({
        email: req.body.email
    });

    if(exitUser){
        req.flash("error", "Email đã tồn tại");
        res.redirect("back");
        return;
    }

    const userData = {
        fullName: req.body.fullName,
        email: req.body.email,
        password:  md5(req.body.password),
        tokenUser: generateHelper.generateRandomString(30)
    };

    const user = new User(userData);
    await user.save();

    res.cookie("tokenUser", user.tokenUser);

    req.flash("success", "Đăng ký tài khoản thành công!");
    res.redirect("/");
};

// [GET] /user/login
module.exports.login = async (req, res) => {
    res.render("client/pages/user/login", {
      pageTitle: "Đăng nhập",
    });
};

// [POST] /user/login
module.exports.loginPost = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({
        email: email,
        deleted: false
    });

    if(!user){
        req.flash("error", "Email không tồn tại");
        res.redirect("back");
        return;
    }

    if(md5(password) != user.password){
        req.flash("error", "Sai mật khẩu");
        res.redirect("back");
        return;
    }

    if(user.status != "active") {
        req.flash("error", "Tài khoản đang bị khóa!");
        res.redirect("back");
        return;
    }

    res.cookie("tokenUser", user.tokenUser);

    req.flash("success", "Đăng nhập thành công!");
    res.redirect("/");
};

// [GET] /user/logout
module.exports.logout = async (req, res) => {
    res.clearCookie("tokenUser");
    res.redirect("/user/login");
};

// [GET] /user/password/forgot
module.exports.forgotPassword = async (req, res) => {
    res.render("client/pages/user/forgot-password", {
        pageTitle: "Quên mật khẩu",
    });
};

// [POST] /user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {

    // Bước 1: kiểm tra xem có tồn tại email hay không nếu tồn tại thì thêm vào database + mã otp
    const email = req.body.email;

    const user = await User.findOne({
        email: email,
        deleted: false  
    });

    if(!user){
        req.flash("error", "Email không tồn tại!");
        res.redirect("back");
        return;
    }

    const otp = generateHelper.generateRandomNumber(6);
    
    const ForgotPasswordData = {
        email: email, 
        otp: otp,
        expireAt: Date.now() + 3*60*1000
    };

    const forgotPassword = new ForgotPassword(ForgotPasswordData);
    await forgotPassword.save();

    // Việc 2: Gửi mã OTP qua email của user (Tạm thời coi như xong, làm sau)

    res.redirect(`/user/password/otp?email=${email}`);
};

// [GET] /user/password/otp
module.exports.otpPassword = async (req, res) => {
    const email = req.query.email;

    res.render("client/pages/user/otp-password", {
        pageTitle: "Xác thực otp",
        email: email
    });
};


// [POST] /user/password/otp
module.exports.otpPasswordPost = async (req, res) => {
    const result = await ForgotPassword.findOne({
        otp: req.body.otp
    });

    if(!result){
        req.flash("error", "Mã otp không hợp lệ!");
        res.redirect("back");
        return;
    }

    const user = await User.findOne({
        email: req.body.email
    });

    res.cookie("tokenUser", user.tokenUser);

    res.redirect("/user/password/reset");
};

// [GET] /user/password/reset
module.exports.resetPassword = async (req, res) => {
    res.render("client/pages/user/reset-password", {
      pageTitle: "Đổi mật khẩu mới"
    });
};

// [PATCH] /user/password/reset
module.exports.resetPasswordPatch = async (req, res) => {
    const password = req.body.password;
    const tokenUser = req.cookies.tokenUser;

    await User.updateOne({
        tokenUser: tokenUser,
        deleted: false
      }, {
        password: md5(password)
      });

      res.redirect("/");
};