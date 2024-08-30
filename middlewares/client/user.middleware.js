const User = require("../../models/user.model");

module.exports.infoUser = async (req, res, next) => {
    if(req.cookies.tokenUser){
        const user = await User.findOne({
            tokenUser: req.cookies.tokenUser
        });

        if(user) {
            res.locals.user = user;
        }
    }  

    next();
}

module.exports.requireAuth = async (req, res, next) => {
    if(!req.cookies.tokenUser){
        res.redirect("/user/login");
        return;
    }  

    const user = await User.findOne({
        tokenUser: req.cookies.tokenUser,
        status: "active"
    });

    if(!user){
        res.redirect("/user/login");
        return;
    }

    next();
}