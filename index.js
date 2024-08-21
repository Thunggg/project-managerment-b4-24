require('dotenv').config() // file .env

const express = require('express');
const app = express();
const port = process.env.PORT;

app.use(express.static('public')); // nhúng file tĩnh

const routeClient = require("./routes/client/index.route"); //route cuả client

// --------------[khởi tạo pug]-----------------
app.set("views", "./views");
app.set("view engine", "pug");
// ---------------------------------------------

routeClient.index(app);

app.listen(port, () => {
    console.log('dang chạy cổng 3000')
});