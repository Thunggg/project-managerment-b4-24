const Cart = require("../../models/cart.model");

module.exports.cartId = (req, res, next) => {
    if(!req.cookies.cartId){
        const cart = new Cart();
        cart.save();

        const date = 365 * 24 * 60 * 60 * 1000;

        res.cookie(
            "cartId", 
            cart.id, 
            {
                expires: new Date(Date.now() +  date)
            });
    
    }
    next();
}