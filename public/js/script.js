// Cập nhật số lượng sản phẩm trong giỏ hàng
const listInputQuantity = document.querySelectorAll("table[cart] input[name='quantity']");
if(listInputQuantity.length > 0){
    listInputQuantity.forEach(button => {
        button.addEventListener("change", () => {
            const productId = button.getAttribute("product-id");
            const quantity = button.value;
            
            if(productId && quantity){
                window.location.href = `/cart/update/${productId}/${quantity}`;
            }

        });
    });
}
// Hết Cập nhật số lượng sản phẩm trong giỏ hàng