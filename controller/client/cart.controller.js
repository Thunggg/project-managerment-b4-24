const Product = require("../../models/product.model");
const Cart = require("../../models/cart.model");

// [GET] /cart
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

    // res.send("OK");
    res.render('client/pages/cart/index.pug',{
        pageTitle: "Giỏ hàng",
        cartDetail: cart
    });

}

// [POST] /cart/add/:productId
module.exports.addPost = async (req, res) => {

    const cartId = req.cookies.cartId;
    const productId = req.params.productId;
    const quantity = parseInt(req.body.quantity);


    const cart = await Cart.findOne({
        _id: cartId
    });

    const existProductInCart = cart.products.find(
        item => item.productId == productId
    );

    if(existProductInCart){
        // Nếu trong giỏ hàng đã tồn tại sản phẩm này thì cập nhật lại sản phẩm này trong giỏ hàng
        await Cart.updateOne({
            _id: cartId,
            "products.productId": productId
        }, {
            $set: {
                'products.$.quantity': quantity + existProductInCart.quantity
            }
        });

    } else{
        
        // Nếu trong giỏ hàng chưa có sản phẩm này thì thêm sản phẩm này vào giỏ hàng

        await Cart.updateOne({
            _id: cartId
        },{
            $push: {
                products: {
                    productId: productId,
                    quantity: quantity
                }
            }
        });
    }

    res.redirect("back");
}

// [GET] /cart/delete/:productId
module.exports.delete = async (req, res) => {

    await Cart.updateOne(
        {
            _id: req.cookies.cartId
        },
        {
            "$pull": {
                products: {
                    productId: req.params.productId
                }
            }
        }
    );

    res.redirect("back");

}

// [GET] /cart/update/:productId/:quantity
module.exports.update = async (req, res) => {

    const cartId = req.cookies.cartId;
    const productId = req.params.productId;
    const quantity = req.params.quantity;

    await Cart.updateOne({
        _id: cartId,
        "products.productId": productId
    },{
        '$set':{
            'products.$.quantity': quantity
        }
    });

    res.redirect("back");

}