const express = require('express');
const router = express.Router();

const Controller = require("../../controller/client/product.controller");

router.get('/', Controller.index);

router.get("/:slug", Controller.detail);

module.exports = router;