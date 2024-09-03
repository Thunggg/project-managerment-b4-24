const express = require("express");
const router = express.Router();

const controller = require("../../controller/client/chat.controller");

const chatMiddleware = require("../../middlewares/client/chat.middleware");

router.get(
  "/:roomChatId",
  chatMiddleware.isAccess,
  controller.index
);

module.exports = router;