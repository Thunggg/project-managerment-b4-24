const Role = require("../../models/role.model");
var md5 = require('md5'); // mã hóa mật khẩu
const Account = require("../../models/account.model");

const systemConfig = require("../../config/system");
const generateHelper = require("../../helpers/generate.helper");

// [GET] /admin/accounts
module.exports.index = async (req, res) => {
    const records = await Account.find({
      deleted: false
    });
  
    for (const record of records) {
      const role = await Role.findOne({
        _id: record.role_id,
        deleted: false
      });
  
      record.roleTitle = role.title;
    }
    

    res.render("admin/pages/accounts/index", {
      pageTitle: "Tài khoản admin",
      records: records
    });
}

// [GET] /admin/account/create
module.exports.create = async (req, res) => {

    const roles = await Role.find({
        deleted: false
    }).select("title");

    res.render('admin/pages/accounts/create',{
        pageTitle: "Tài khoản admin",
        roles: roles
    });
}

// [POST] /admin/account/create
module.exports.createPost = async (req, res) => {

    req.body.password = md5(req.body.password);
    req.body.token = generateHelper.generateRandomString(30);
    
    const account = new Account(req.body);
    await account.save();

    res.redirect(`/${systemConfig.prefixAdmin}/accounts`);

}

// [GET] /admin/accounts/edit/:id
module.exports.edit = async (req, res) => {
  
  const id = req.params.id;

  const account = await Account.findOne({
    _id: id,
    deleted: false
  });
  
  const roles = await Role.find({
    deleted: false
  }).select("title");


  res.render("admin/pages/accounts/edit", {
    pageTitle: "Tài khoản admin",
    account: account,
    roles: roles
  });
}

// [PATCH] /admin/accounts/edit/:id
module.exports.editPatch = async (req, res) => {
  
  const id = req.params.id;
  if(req.body.password == ""){
    delete req.body.password;
  } else{
    req.body.password = md5(req.body.password);
  }

  const account = await Account.updateOne({
    _id: id,
    deleted: false
  }, req.body);

  req.flash("success", "Cập nhật thành công!");

  res.redirect("back");
}