const express = require("express");
const router = express.Router();

const controller = require("../../controller/client/chat.controller");

router.get("/", controller.index);

module.exports = router;