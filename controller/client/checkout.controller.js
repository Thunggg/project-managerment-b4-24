const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const Order = require("../../models/order.model");

// [GET] /checkout/
module.exports.index = async (req, res) => {
  
    const cart = await Cart.findOne({
        _id: req.cookies.cartId
    });

    cart.totalPrice = 0; // tổng tiền

    if(cart.products.length > 0){
        for(product of cart.products){

            const productInfo = await Product.findOne({
                _id: product.productId,
                deleted: false,
                status: "active"
            }).select("title thumbnail slug price discountPercentage");

            productInfo.priceNew = ((1 - productInfo.discountPercentage/100) * 100).toFixed(0);
            product.productInfo = productInfo;
            product.totalPrice = productInfo.priceNew * product.quantity;
            cart.totalPrice += product.totalPrice;
        }
    }

    res.render("client/pages/checkout/index", {
        pageTitle: "Đặt hàng",
        cartDetail: cart
    });
};

// [POST] /checkout/order
module.exports.orderPost = async (req, res) => {
  
    const cartId = req.cookies.cartId;
    const userInfo = req.body;
    const orderData = {
        userInfo: userInfo,
        products: []
    }

    const cart = await Cart.findOne({
        _id: cartId
    });

    for(const item of cart.products){
        const productInfo = await Product.findOne({
            _id: item.productId
        });

        orderData.products.push({
            productId: productInfo.id,
            price: productInfo.price,
            discountPercentage: productInfo.discountPercentage,
            quantity: item.quantity
        });
    }
    const order = new Order(orderData);
    await order.save();
    
    await Cart.updateOne({
        _id: cartId
    },{
        products: []
    });

    res.redirect(`/checkout/success/${order.id}`);
};