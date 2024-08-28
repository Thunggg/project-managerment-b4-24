const systemConfig = require("../../config/system");
const Account = require("../../models/account.model");

module.exports.requireAuth = (req, res, next) => {
    if(!req.cookies.token){
        res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
        return;
    }

    const account = Account.findOne({
        deleted: false,
        token: req.cookies.token
    });

    if(!account){
        res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
        return;
    }

    next();
}