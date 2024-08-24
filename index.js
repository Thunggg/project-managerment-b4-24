const express = require('express');
require('dotenv').config() // file .env
const bodyParser = require('body-parser'); // dùng để chuyển đổi dữ liệu (được gửi từ FE qua phần body) sang js
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();

// --------------[in ra thông báo (express-flash, phải khai báo trước khiu tạo router trong file này)]-----------------
app.use(cookieParser('HHKALKS'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());
// -------------------------------------------------------------------------------------------------------------------

// --------------[kết nối database]-----------------
const database = require("./config/database");
database.connect();
// ---------------------------------------------


// --------------[kết nối database]-----------------
const systemConfig = require("./config/system");
app.locals.prefixAdmin = systemConfig.prefixAdmin
// ---------------------------------------------

const port = process.env.PORT;

app.use(express.static('public')); // nhúng file tĩnh
app.use(bodyParser.urlencoded({ extended: false })); // dùng để lấy dữ liệu từ form thông qua phần body mà ông Fe gửi lên
app.use(bodyParser.json());// dùng để chuyển đổi dữ liệu (được gửi từ FE qua phần body) sang js

// --------------[khởi tạo pug]-----------------
app.set("views", "./views");
app.set("view engine", "pug");
// ---------------------------------------------



const routeClient = require("./routes/client/index.route"); //route cuả client
routeClient.index(app);

const routeAdmin = require("./routes/admin/index.route"); //route cuả admin
routeAdmin.index(app);


app.listen(port, () => {
    console.log('dang chạy cổng 3000')
});