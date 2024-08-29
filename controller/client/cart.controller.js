const Product = require("../../models/product.model");
const Cart = require("../../models/cart.model");

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