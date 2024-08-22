require('dotenv').config() // file .env

const express = require('express');
const app = express();
const port = process.env.PORT;

app.use(express.static('public')); // nhúng file tĩnh

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



app.listen(port, () => {
    console.log('dang chạy cổng 3000')
});