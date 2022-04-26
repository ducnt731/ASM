const express = require('express')
const app = express()
const {ObjectId} = require('mongodb')
const dbHandler = require("./databaseHandler")
const bcrypt = require("bcrypt")
const session = require('express-session')
app.use(session({ secret: '124447yd@@$%%#', cookie: { maxAge: 60000 }, saveUninitialized: false, resave: false }))

const {insertObject,getUser, FindAllDocumentsByName, FindDocumentsById, getAllDocumentsFromCollection, deleteDocumentById, updateCollection, getDocumentById} = require('./databaseHandler')

//su dung HBS: =>res.render('....')
app.set('view engine', 'hbs')
//lay du lieu tu cac Form: textbox, combobox...
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.get('/adminHome',(req,res)=>{
    res.render('adminHome',{userInfo:req.session.User})
})
const adminController = require('./controllers/admin')
//tat ca cac dia chi co chua admin: localhost:5000/admin/... => goi controller admin
app.use('/admin', adminController)

const customerController = require('./controllers/customer')
const res = require('express/lib/response')
app.use('/customer', customerController)

app.post('/editProduct',async (req,res)=>{
    const nameInput = req.body.txtName
    const priceInput = req.body.txtPrice
    const picURLInput = req.body.txtPicURL
    const quantityInput = req.body.txtQuantity
    const authorInput = req.body.txtAuthor
    const id = req.body.txtId
    const myquery = { _id: ObjectId(id) }
    const newvalues = { $set: {name: nameInput, price: priceInput,qunatity:quantityInput,picURL:picURLInput,author: authorInput} }
    const collectionName = "Products"
    await updateCollection(collectionName, myquery, newvalues)
    res.redirect('/product')
})

app.get('/editProduct',async (req,res)=>{
    const id = req.query.id
    const collectionName = "Products"
    const productToEdit = await getDocumentById(collectionName, id)
    res.render('editProduct',{product:productToEdit})
})
app.get('/adminHome',(req,res)=>{
    res.render('adminHome')
})

app.get('/addProduct',async (req,res)=>{
    res.render('addProduct')
})

app.get('/deleteProduct',async (req,res)=>{
    const id = req.query.id
    const collectionName = "Products"
    await deleteDocumentById(collectionName, id)
    res.redirect('/product')
})

app.get('/product',async (req,res)=>{
    const collectionName = "Products"
    const results = await getAllDocumentsFromCollection(collectionName)
    res.render('product',{products:results})
})

app.get('/',async (req,res)=>{
    const collectionName = "Products"
    const results = await getAllDocumentsFromCollection(collectionName)
    res.render('home',{products:results})
})

app.post('/addProduct',async (req,res)=>{
    const nameInput = req.body.txtName
    const priceInput = req.body.txtPrice
    const picURLInput = req.body.txtPicURL
    const quantityInput = req.body.txtQuantity
    const authorInput = req.body.txtAuthor
    if (nameInput.length == 0){
        const errorMessage = "San pham phai co ten!";
        const oldValues = {price:priceInput,quantity:quantityInput,picURL:picURLInput,author:authorInput}
        res.render('addProduct',{errorName:errorMessage})
        console.log("a")
        return;
    } else if (priceInput.length == 0){
        const errorMessage = "San pham phai co gia!";
        const oldValues = {name:nameInput,quantity:quantityInput,picURL:picURLInput,author:authorInput}
        res.render('product',{errorPrice:errorMessage,oldValues:oldValues})
        console.log("b")
        return;
    } else if(isNaN(priceInput)== true){
        const errorMessage = "Gia phai la so!"
        const oldValues = {name:nameInput,price:priceInput,quantity:quantityInput,picURL:picURLInput,author:authorInput}
        res.render('addProduct',{errorPriceNaN:errorMessage,oldValues:oldValues})
        console.log("c")
        return;
    } else if (picURLInput.length == 0 ) {
        const errorMessage = "San pham phai co anh!"
        const oldValues = {name:nameInput,price:priceInput,quantity:quantityInput,picURL:picURLInput,author:authorInput}
        res.render('addProduct',{errorLink:errorMessage,oldValues:oldValues})
        console.log("d")
        return;
    } else if (quantityInput.length == 0) {
        const errorMessage = "San pham phai co so luong!"
        const oldValues = {name:nameInput,price:priceInput,quantity:quantityInput,picURL:picURLInput,author:authorInput}
        res.render('addProduct',{errorQuantity:errorMessage,oldValues:oldValues})
        console.log("e")
        
    } else if (isNaN(quantityInput)){
        const errorMessage = "So luong phai la so!"
        const oldValues = {name:nameInput,price:priceInput,quantity:quantityInput,picURL:picURLInput,author:authorInput}
        res.render('addProduct',{errorQuantityNaN:errorMessage,oldValues:oldValues})
        console.log("g")
        return;
    }
    else {
        const newP = {name:nameInput,price:Number.parseFloat(priceInput),quantity:quantityInput,picURL:picURLInput,author:authorInput}
        const collectionName = "Products"
        await insertObject(collectionName,newP)   
        res.redirect('/product')
    }
    
})

app.get("/login", (req, res)=>{
    res.render('login')
})

app.get("/logout", (req, res) => {
    req.session.user = null
    res.redirect("/")
})

app.post("/login", async(req, res) => {
    const userName = req.body.txtName;
    const pass = req.body.txtPassword;
    const user = await dbHandler.checkUserLogin(userName)
    if (user == -1) {
    res.render("login", { errorMsg: "Not found UserName!!" })
    } else {
    const validPass = await bcrypt.compare(pass, user.password)
    if (validPass) {
        const role = await dbHandler.checkUserRole(userName)
        if (role == -1) {
        res.render("login", { errorMsg: "Login failed!" })
        } else {
        if (req.body.Role == role) {
            req.session.user = {
            userName: userName,
            role: role
            }
            console.log("Login with: ")
            console.log(req.session.user)
            req.session["cart"] = null;
            if (role == "Customer") {
            res.redirect('/')
            } else {
            res.redirect("/adminHome")
            }
        } else {
            res.render("login", { errorMsg: "Not auth!!" })
        }
        }
    } else {
        res.render("login", { errorMsg: "Incorrect password!!" })
    }
    }
})

app.get('/infoProducts', async (req,res)=>{
    const id = req.query.id
    const results = await FindDocumentsById("Products", id)
    res.render('infoProducts', {products : results})

}) 

app.get('/register', (req, res)=>{
    res.render('register')
})

app.post("/register", async (req, res) => {
    const userName = req.body.txtName;
    const mail = req.body.txtGmail;
    const phone = req.body.txtPhone;
    const pass = req.body.txtPassword;
    const rePass = req.body.txtRePass;
    const role = req.body.Role;
    const fullName = req.body.txtFullName;
    const address = req.body.txtAddress
    const hashPass = await bcrypt.hash(pass, 10);
    const existedUser = await dbHandler.checkUserLogin(userName);
    if (existedUser == -1) {
    const validPass = await bcrypt.compare(rePass, hashPass);
        if (validPass) {
        const newUser = {
        userName: userName,
        Gmail: mail,
        fullName: fullName,
        Phone: phone,
        role: role,
        Address: address,
        password: hashPass,
        }
        await dbHandler.insertObject("Users", newUser);
        res.render("login");
    } else {
        res.render("register", { errorMsg: "Password is not match" });
    }
    } else {
    res.render("register", { errorMsg: "Username already used" });
    }
})

app.get('/', async(req,res)=>{
    // const searchInputH = req.query.txtSearchHome
    const collectionName = "Products"
    const results = await getAllDocumentsFromCollection(collectionName)
    // const resultSearch = await FindAllDocumentsByName(searchInputH)
    res.render('home', {products:results})
    res.render('home', { userInfo:req.session.user})
    //2.hien thu du lieu qua HBS
    // if(searchInputH == null)
    // {         
    //     res.render('home', {products:results, userI:req.session.user})       
    // }else{   
    //     if(resultSearch.length != 0)
    //     {                 
    //         res.render('home', {products : resultSearch, userI:req.session.user})
    //     }else {
    //         const messageSH = " Khong tim thay"
    //         res.render('home', {products: results, messSH : messageSH, userI:req.session.user})
    //     }
    // }
})

app.post('/buy',requiresLoginCustomer, async (req,res)=>{
    const id = req.body.txtId
    customer = req.session.user
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
app.get('/remove', async (req,res)=>{
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

function requiresLoginCustomer(req,res,next){
    if(req.session.user){
        return next()
    }else{
        res.redirect('/login')
    }
}

app.get('/myCart',requiresLoginCustomer, async (req,res)=>{
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
app.post('/order', requiresLoginCustomer,async (req, res) => {
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

const PORT = process.env.PORT || 5000
app.listen(PORT)
console.log("Server is running! " + PORT)