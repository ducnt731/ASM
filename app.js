const express = require('express')
const app = express()
const {ObjectId} = require('mongodb')
const dbHandler = require("./databaseHandler")
const bcrypt = require("bcrypt")
const session = require('express-session')
app.use(session({ secret: '124447yd@@$%%#', cookie: { maxAge: 60000 }, saveUninitialized: false, resave: false }))

const {insertObject,getUser, FindAllDocumentsByName, getAllDocumentsFromCollection, deleteDocumentById, updateCollection, getDocumentById} = require('./databaseHandler')

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
    const user = await dbHandler.checkUserLogin(userName);
    if (user == -1) {
    res.render("login", { errorMsg: "Not found UserName!!" });
    } else {
    const validPass = await bcrypt.compare(pass, user.password);
    if (validPass) {
        const role = await dbHandler.checkUserRole(userName);
        if (role == -1) {
        res.render("login", { errorMsg: "Login failed!" });
        } else {
        if (req.body.Role == role) {
            const customer = await dbHandler.getUser(userName, user.mail)
            req.session.user = {
            userName: userName,
            role: role,
            gmail: customer.mail,
            };
            console.log("Login with: ");
            console.log(req.session.user);
            req.session["cart"] = null;
            if (role == "Customer") {
            res.redirect("/");
            } else {
            res.redirect("/adminHome");
            }
        } else {
            res.render("login", { errorMsg: "Not auth!!" });
        }
        }
    } else {
        res.render("login", { errorMsg: "Incorrect password!!" });
    }
    }
})

app.get('/allProducts', async (req,res)=>{
    customer = req.session["Customer"]
    const searchInputH = req.query.txtSearchHome
    const collectionName = "Products"
    const results = await getAllDocumentsFromCollection(collectionName)
    const resultSearch = await FindAllDocumentsByName(searchInputH)
    //2.hien thu du lieu qua HBS
    if(searchInputH == null)
    {         
        res.render('home', {products: results, customerI: customer})       
    }else{   
        if(resultSearch.length != 0)
        {                 
            res.render('home', {products : resultSearch, customerI: customer})
        }else {
            const messageSH = " Khong tim thay"
            res.render('allProducts', {products: results, messSH : messageSH, customerI: customer})
        }
    }   
    
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
        gmail: mail,
        Name: fullName,
        phone: phone,
        role: role,
        Address: address,
        password: hashPass,
        };
        await dbHandler.insertObject("Users", newUser);
        res.render("login");
    } else {
        res.render("register", { errorMsg: "Password is not match" });
    }
    } else {
    res.render("register", { errorMsg: "Username already used" });
    }
})

app.get('/',async (req,res)=>{
    const collectionName = "Products"
    const results = await getAllDocumentsFromCollection(collectionName)
    res.render('home',{products:results})
})

app.get('/', (req,res)=>{
    res.render('home')
})

const PORT = process.env.PORT || 5000
app.listen(PORT)
console.log("Server is running! " + PORT)