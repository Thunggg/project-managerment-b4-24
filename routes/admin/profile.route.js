const express = require("express");
const router = express.Router();

const controller = require("../../controller/admin/profile.controller");


router.get('/', controller.index);

module.exports = router;