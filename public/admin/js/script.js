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

            window.location.href = url.href;
        });
    });

    // Thêm class active khi người dùng chọn
    const statusCurrent = url.searchParams.get("status") || "";
    const buttonCurrent = document.querySelector(`[button-status="${statusCurrent}"]`);
    buttonCurrent.classList.add("active");
}

// -------------------------------------------------------------------------------------------------------

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

        window.location.href = url;
    });
}
// -------------------------------------------------------------------------------------------------------

