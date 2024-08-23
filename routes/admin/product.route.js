const express = require('express');
const router = express.Router();

const controller = require("../../controller/admin/product.controller");

router.get('/', controller.index);

router.get("/change-status/:statusChange/:id", controller.changeStatus);

module.exports = router;