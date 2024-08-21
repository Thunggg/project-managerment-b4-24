const express = require('express')
const app = express()
const port = 3000

// --------------[khởi tạo pug]-----------------
app.set("views", "./views");
app.set("view engine", "pug");
// ---------------------------------------------

app.get('/', (req, res) => {
  res.render("client/pages/home/index.pug");
});

app.get('/product', (req, res) => {
    res.render('client/pages/products/index.pug')
});

app.listen(port, () => {
    console.log('dang chạy cổng 3000')
});