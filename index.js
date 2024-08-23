require('dotenv').config() // file .env

const express = require('express');
const app = express();
const port = process.env.PORT;
const bodyParser = require('body-parser'); // dùng để chuyển đổi dữ liệu (được gửi từ FE qua phần body) sang js

app.use(express.static('public')); // nhúng file tĩnh
app.use(bodyParser.json());// dùng để chuyển đổi dữ liệu (được gửi từ FE qua phần body) sang js


const routeClient = require("./routes/client/index.route"); //route cuả client
routeClient.index(app);

const routeAdmin = require("./routes/admin/index.route"); //route cuả admin
routeAdmin.index(app);

// --------------[khởi tạo pug]-----------------
app.set("views", "./views");
app.set("view engine", "pug");
// ---------------------------------------------

// --------------[kết nối database]-----------------
const database = require("./config/database");
database.connect();
// ---------------------------------------------

// --------------[kết nối database]-----------------
const systemConfig = require("./config/system");
app.locals.prefixAdmin = systemConfig.prefixAdmin
// ---------------------------------------------


app.listen(port, () => {
    console.log('dang chạy cổng 3000')
});