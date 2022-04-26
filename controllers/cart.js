const express = require("express");
const async = require("hbs/lib/async");
const dbHandler = require("../databaseHandler");
const router = express.Router();
router.use(express.static("public"));

router.use((req, res, next) => {
console.log(req.session);
const { user } = req.session;
if (user) {
    if (user.role == "Customer") {
    next("route");
    } else {
    res.sendStatus(404);
    }
} else {
    res.redirect("/login");
}
})

router.post('/buy', async(req,res)=>{
    const id = req.body.txtId
    customer = req.session["Customer"]
    const results = await FindDocumentsById("Products", id)
    let cart = req.session["cart"]
    //chua co gio hang trong session, day se la sp dau tien
    if(!cart){
        let dict = {
            user: customer.name,
            // id: customer._id,
            cart: [],
        }
            results.qty = 1;
            results.subtotal = results.price * results.qty;
            dict.cart.push(results);
            req.session["cart"] = dict;
            console.log(dict)
    }else{
        dict = req.session["cart"]
        //kiem tra book co trong dict k
        //https://stackoverflow.com/questions/7364150/find-object-by-id-in-an-array-of-javascript-objects
        // Phương thức findIndex() trả về chỉ số của phần tử đầu tiên trong mảng đáp ứng chức năng kiểm tra được cung cấp. Nếu không, -1 được trả về.
        var oldBook = dict.cart.findIndex((book) => book._id == results._id);
        if (oldBook == -1) {
            results.qty = 1;
            results.subtotal = results.price * results.qty;
            dict.cart.push(results);
        } else {
            const oBook = dict.cart[oldBook];
            oBook.qty += 1;
            oBook.subtotal = oBook.price * oBook.qty;
        }
        req.session["cart"] = dict
        console.log(dict)
    }
    res.redirect('/')
})
router.get('/remove', async (req,res)=>{
    dict = req.session["cart"]
    const id = req.body.txtId
    for(var i = 0; i < dict.cart.length; i++){
        if(dict.cart._id == id){
            console.log(dict.cart._id)
            dict.cart.splice(i,1)
            return res.redirect('cart')
        }
    }    
})
router.get('/Cart', async (req,res)=>{
    let quantity = 0;
    let ship = 0;
    let total = 0;
    let totalC = 0;
    const dict = req.session["cart"]
    for(var i = 0; i < dict.cart.length; i++){
        quantity += dict.cart[i].qty
        total += dict.cart[i].subtotal
    }
    if(quantity == 0)
    {
        ship = 0
    }else if(quantity < 10){
        ship = 10
    }else{
        ship = 5
    }

    totalC = total + ship
    res.render('Cart',{cart: dict, quantity: quantity, ship: ship, total: total, totalC: totalC})

})
router.post('/order',async (req, res) => {
    const cart = req.session["cart"]
    // var today = new Date();
    // var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()+ " -- "+ today.getDay()+"/"+ today.getMonth()+"/"+today.getFullYear();
    var today = new Date();
    var date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    console.log(dateTime)
    const newO = {cart: cart, time: dateTime, status:"Waiting for the goods"}
    insertObject("Order",newO)
    req.session["cart"] = null;
    res.redirect('/')
})
module.exports = router;
