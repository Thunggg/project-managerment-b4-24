const express = require("express");
const router = express.Router();

const controller = require("../../controller/client/rooms-chat.controller");

router.get("/", controller.index);

module.exports = router;