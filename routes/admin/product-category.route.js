const express = require("express");
const router = express.Router();
const multer  = require('multer'); // dùng để upload ảnh
const validate = require("../../validates/admin/product-category.validate");
const upload = multer();
const uploadCloud = require("../../middlewares/uploadCloud.middleware");
const controller = require("../../controller/admin/product-category.controller");

router.get("/", controller.index);

router.get("/create", controller.create);

router.post(
    "/create",
    upload.single('thumbnail'),
    uploadCloud.uploadSingle,
    validate.createPost,
    controller.createPost
);


module.exports = router;