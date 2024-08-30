// [GET] /chat/
module.exports.index = async (req, res) => {

    _io.on("connection", (socket) => {
        console.log("Có 1 người dùng kết nối", socket.id);
    });


    res.render("client/pages/chat/index", {
        pageTitle: "Chat"
    });
    
};