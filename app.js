const express = require('express')
const app = express()
const session = require('express-session')

app.use(session({ secret: '124447yd@@$%%#', cookie: { maxAge: 60000 }, saveUninitialized: false, resave: false }))
app.set('view engine','hbs') // khai bao su dung hbs : res, render,...
app.use(express.urlencoded({extended:true})) // lay du lieu tu cac form text box, combo box,...
app.use(express.static('public')) // Lay du lieu tu folder public de thiet lap giao dien

app.get('/',(req,res)=>{
    res.render('home', {userInfo:req.session.User})
})

app.post('/edit',async (req,res)=>{
    const nameInput = req.body.txtName
    const priceInput = req.body.txtPrice
    const picURLInput = req.body.txtPicURL
    const id = req.body.txtId
    
    const myquery = { _id: ObjectId(id) }
    const newvalues = { $set: {name: nameInput, price: priceInput,picURL:picURLInput } }
    const collectionName = "Products"
    await updateCollection(collectionName, myquery, newvalues)
    res.redirect('/view')
})

app.get('/edit',async (req,res)=>{
    const id = req.query.id
    const collectionName = "Products"
    const productToEdit = await getDocumentById(collectionName, id)
    res.render('edit',{product:productToEdit})
})
app.get('/',(req,res)=>{
    res.render('index')
})

app.get('/product',async (req,res)=>{
    res.render('product')
})

app.get('/delete',async (req,res)=>{
    const id = req.query.id
    const collectionName = "Products"
    await deleteDocumentById(collectionName, id)
    res.redirect('/view')
})

app.get('/view',async (req,res)=>{
    const collectionName = "Products"
    const results = await getAllDocumentsFromCollection(collectionName)
    res.render('view',{products:results})
})

app.post('/product',async (req,res)=>{
    const nameInput = req.body.txtName
    const priceInput = req.body.txtPrice
    const picURLInput = req.body.txtPicURL
    const colorInput = req.body.txtColor


    if (nameInput.length == 0){
        const errorMessage = "San pham phai co ten!";
        const oldValues = {price:priceInput,color: colorInput,picURL:picURLInput}
        res.render('product',{errorName:errorMessage})
        console.log("a")
        return;
    } else if (priceInput.length == 0){
        const errorMessage = "San pham phai co gia!";
        const oldValues = {name:nameInput,color: colorInput,picURL:picURLInput}
        res.render('product',{errorPrice:errorMessage,oldValues:oldValues})
        console.log("b")
        return;
    } else if(isNaN(priceInput)== true){
        const errorMessage = "Gia phai la so!"
        const oldValues = {name:nameInput,price:priceInput,color: colorInput,picURL:picURLInput}
        res.render('product',{errorPriceNaN:errorMessage,oldValues:oldValues})
        console.log("c")
        return;
    } else if (picURLInput.length == 0 ) {
        const errorMessage = "San pham phai co anh!"
        const oldValues = {name:nameInput,price:priceInput,color: colorInput,picURL:picURLInput}
        res.render('product',{errorLink:errorMessage,oldValues:oldValues})
        console.log("d")
        return;
    } else if (colorInput.length < 3) {
        const errorMessage = "Mau cua san pham phai co hon 3 ki tu"
        const oldValues = {name:nameInput,price:priceInput,color: colorInput,picURL:picURLInput}
        res.render('product',{errorColor:errorMessage,oldValues:oldValues})
        console.log("e")
    }    else {
        const newP = {name:nameInput,price:Number.parseFloat(priceInput),color:colorInput,picURL:picURLInput}
        const collectionName = "Products"
        await insertObjectToCollection(collectionName,newP)   
        res.redirect('/view')
    }
    
})

app.get('/shopping',(req, res) => {
    res.render('showproducts')
})

const adminController = require('./controllers/admin')
app.use('/admin', adminController) //cac request co chua /admin se di den controller admin

const customerController = require('./controllers/customer')
app.use('/customer', customerController) 

const PORT = process.env.PORT || 5000
app.listen(PORT)
console.log("Server is running! " + PORT)