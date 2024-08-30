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

// show-alert
const showAlert = document.querySelector("[show-alert]");
if(!showAlert.textContent){
    showAlert.classList.add("hidden"); // nếu thông báo rỗng thì ẩn luôn
}

if(showAlert) {
  let time = showAlert.getAttribute("show-alert") || 3000;
  time = parseInt(time);

  setTimeout(() => {
    showAlert.classList.add("hidden");
  }, time);
}
// End show-alert