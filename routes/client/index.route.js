module.exports.index = (app) => {
    app.get('/', (req, res) => {
        res.render("client/pages/home/index.pug");
      });
      
      app.get('/product', (req, res) => {
          res.render('client/pages/products/index.pug')
      });
      
}