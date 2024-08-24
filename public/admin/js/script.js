// ---------------------------------------------button status---------------------------------------------

const listButtonStatus = document.querySelectorAll("[button-status]");
if(listButtonStatus.length > 0){
    let url = new URL(window.location.href);

    listButtonStatus.forEach(button => {
        button.addEventListener("click", () => {
            const status = button.getAttribute("button-status");
            
            if(status){
                url.searchParams.set("status", status);
            }
            else{
                url.searchParams.delete("status");
            }

            //fix bug chọn quá số trang khi bấm nào các nút status 
            url.searchParams.set("page", 1);
            

            window.location.href = url.href;
        });
    });

    // Thêm class active khi người dùng chọn
    const statusCurrent = url.searchParams.get("status") || "";
    const buttonCurrent = document.querySelector(`[button-status="${statusCurrent}"]`);
    buttonCurrent.classList.add("active");
}


// ---------------------------------------------[form search]---------------------------------------------
// fix lỗi khi bấm vào các nút button status rồi tìm kiếm thì bị reset lại thanh tìm kiếm
const formSearch = document.querySelector("[form-search]");

if(formSearch){
    formSearch.addEventListener("submit", (event) => {
        event.preventDefault();
        
        let url = new URL(window.location.href);

        const keyword = event.target.elements.keyword.value;

        if(keyword){
            url.searchParams.set("keyword", keyword);
        }
        else{
            url.searchParams.delete("keyword");
        }

        //fix bug chọn quá số trang khi bấm nào các nút status 
        url.searchParams.set("page", 1);

        window.location.href = url;
    });
}

// ---------------------------------------------[Pagination]---------------------------------------------
const listButtonPagination = document.querySelectorAll("[button-pagination]");
if(listButtonPagination.length > 0){
    listButtonPagination.forEach(button => {
    
        let url = new URL(window.location.href);
    
        button.addEventListener("click", () => {
            const page = button.getAttribute("button-pagination");

            url.searchParams.set("page", page);
    
            window.location.href = url;
        });
    });
}


// ---------------------------------------------[button change status]---------------------------------------------
const listButtonChangeStatus = document.querySelectorAll("[button-change-status]");
if(listButtonChangeStatus.length > 0){
    listButtonChangeStatus.forEach(button => {
        button.addEventListener("click", () => {
            const link = button.getAttribute("link");
            
            fetch(link, {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                },
              })
            .then(res => res.json())
            .then(data => {
                if(data.code == 200){
                    window.location.reload();
                }
            })
        });
    });
}

// ---------------------------------------------[Check item]---------------------------------------------
const inputCheckAll = document.querySelector("input[name='checkAll']");
if(inputCheckAll){
    const listInputCheckItem = document.querySelectorAll("input[name='checkItem']");

    // bắt sự kiện cho nút check all
    inputCheckAll.addEventListener("click", () => {
        listInputCheckItem.forEach(button => {
            button.checked = inputCheckAll.checked;
        });
    });

    // bắt sự kiện cho nút check item
    listInputCheckItem.forEach(button => {
        button.addEventListener("click", () => {
            const countButtonItemChecked = document.querySelectorAll("input[name='checkItem']:checked");
            if(countButtonItemChecked.length == listInputCheckItem.length){
                inputCheckAll.checked = true;
            }
            else{
                inputCheckAll.checked = false;
            }
        });
    });
}

// ---------------------------------------------[Box Actions]---------------------------------------------
const boxActions = document.querySelector("[box-actions]");
if(boxActions){
    const button = boxActions.querySelector("button");
    button.addEventListener("click", () => {
        const select = boxActions.querySelector("select");
        const status = select.value; // trạng thái cần cập nhật 
        const ids = []; // id các sản phẩm cần cập nhật

        const listInputCheckItem = document.querySelectorAll("input[name='checkItem']:checked");
        listInputCheckItem.forEach(button => {
            ids.push(button.value);
        });
        
        if(status != "" && ids.length > 0){
            const dataChangeMulti = {
                ids: ids,
                status: status
            };

            const link = boxActions.getAttribute("box-actions");

            fetch(link, {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(dataChangeMulti),
              })
            .then(res => res.json())
            .then(data => {
                if(data.code == 200){
                    window.location.reload();
                }
            })
        }else{
            alert("Hành động và checkItem phải được chọn!");
        }

    });
}

// ---------------------------------------------[xóa bán ghi]---------------------------------------------
const listButtonDelete = document.querySelectorAll("button[button-delete]");
if(listButtonDelete.length > 0){
    listButtonDelete.forEach(button => {
        button.addEventListener("click", () => {

            const link = button.getAttribute("button-delete");

            fetch(link, {
                method: "PATCH"
              })
            .then(res => res.json())
            .then(data => {
                if(data.code == 200){
                    window.location.reload();
                }
            })
        });
    });

}

// ---------------------------------------------[thay đổi vị trí]---------------------------------------------
const listInputPosition = document.querySelectorAll("input[name='position']");
listInputPosition.forEach(button => {
    button.addEventListener("change", () => {
        const link = button.getAttribute("link");
        const position = button.value;
        
        fetch(link, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
                position: position
            }),
          })
        .then(res => res.json())
        .then(data => {
            // console.log(data);
        })
    });
});
// -----------------------------------------------------------------------------------------------------------

// show-alert
const showAlert = document.querySelector("[show-alert]");
if(showAlert) {
  let time = showAlert.getAttribute("show-alert") || 3000;
  time = parseInt(time);

  setTimeout(() => {
    showAlert.classList.add("hidden");
  }, time);
}
// End show-alert

// Upload Image
const uploadImage = document.querySelector("div[upload-image]");
if(uploadImage){
    const uploadImageInput = uploadImage.querySelector("[upload-image-input]");
    const uploadImagePreview = uploadImage.querySelector("[upload-image-preview]");

    uploadImageInput.addEventListener("change", () => {
        const file = uploadImageInput.files[0]; 
        if(file){
            uploadImagePreview.src = URL.createObjectURL(file);
        }
    });
}
// END Upload Image