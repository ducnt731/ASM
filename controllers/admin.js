const express = require('express')
const async = require('hbs/lib/async')
const bcrypt = require('bcrypt')
const { ObjectId } = require('mongodb')
const router = express.Router()
const {insertObject,getOrder, checkCategory, getAllDocumentsFromCollection, deleteDocumentById, updateCollection, getDocumentById,getCustomer} = require('../databaseHandler')

router.use(express.urlencoded({ extended: true }))
router.use(express.static('public'))

router.get('/viewprofile', async (req, res) => {
    const collectionName = "Users"
    const results = await getCustomer(collectionName)
    res.render('viewprofile', { users: results })
})

router.get('/delete', async (req, res) => {
    const id = req.query.id
    //ham xoa user dua tren id
    const collectionName = "Users"
    await deleteDocumentById(collectionName, id)
    res.redirect('viewprofile')// return viewprofile page
})

router.post('/editCustomer',async (req,res) =>{
    const fullnameInput = req.body.txtFullName
    const addressInput = req.body.txtAddress
    const phoneInput = req.body.txtPhone
    const gmailInput = req.body.txtGmail
    //ham update
    const id = req.body.txtId
    const myquery = { _id: ObjectId(id) }
    const newvalues = {$set: {
            fullName: fullnameInput,
            Address: addressInput,
            Phone: phoneInput,
            Gmail: gmailInput
        }
    }
    console.log(newvalues)
    console.log(id)
    const collectionName = "Users"
    await updateCollection(collectionName, myquery, newvalues)
    res.redirect('viewprofile')
})

router.get('/editCustomer', async (req, res) => {
    const id = req.query.id
    //lay information old of user before edit
    const productToEdit = await getDocumentById("Users", id)
    //hien thi ra de sua
    res.render("editCustomer", { users: productToEdit,id:id })
})

// Ham manage category

router.get('/category', async (req, res) => {
    const collectionName = "Category"
    const results = await getAllDocumentsFromCollection(collectionName)
    res.render('category',{category:results})
})

router.get('/addCategory', async (req, res) => {
    res.render('addCategory')
})

router.post('/addCategory', async (req, res) => {
    const nameInput = req.body.txtName
    const descriptionInput = req.body.txtDescription
    const check = await dbHandler.checkCategory(nameInput)
    if (nameInput.length == 0){
        const errorMessage = "The loai phai co ten!";
        const oldValues = {description:descriptionInput}
        res.render('addProduct',{errorName:errorMessage})
        console.log("1")
        return;
    } else if (descriptionInput.length == 0){
        const errorMessage = "The loai phai co mieu ta!";
        const oldValues = {name:nameInput}
        res.render('addProduct',{errorDescription:errorMessage,oldValues:oldValues})
        console.log("2")
        return;
    } else if (check==1) {
        const errorMessage = "The loai nay da co!"
        const oldValues = {description:descriptionInput}
        res.render('addProduct',{errorDuplicate:errorMessage,oldValues:oldValues})
        console.log("3")
        return;
    }
    else {
        const newC = {name:nameInput,description:descriptionInput}
        const collectionName = "Category"
        await insertObject(collectionName,newC)   
        res.redirect('category')
    }
})

router.post('/editCategory', async (req, res) => {
    const nameInput = req.body.txtName
    const descriptionInput = req.body.txtDescription
    const id = req.body.txtId
    const myquery = { _id: ObjectId(id) }
    const newvalues = { $set: {name: nameInput,description: descriptionInput} }
    const collectionName = "Category"
    await updateCollection(collectionName, myquery, newvalues)
    res.redirect('category')
})

router.get('/editCategory', async (req, res) => {
    const id = req.query.id
    const collectionName = "Category"
    const categoryToEdit = await getDocumentById(collectionName, id)
    res.render('editCategory',{category:categoryToEdit})
})

router.get('/deleteCategory', async (req, res) => {
    const id = req.query.id
    const collectionName = "Category"
    await deleteDocumentById(collectionName, id)
    res.redirect('category')
})

// Ham manage product
router.post('/editProduct',async (req,res)=>{
    const nameInput = req.body.txtName
    const categoryInput = req.body.txtCategory
    const priceInput = req.body.txtPrice
    const picURLInput = req.body.txtPicURL
    const quantityInput = req.body.txtQuantity
    const authorInput = req.body.txtAuthor
    const descriptionInput = req.body.txtDescription
    //
    const id = req.body.txtId
    const myquery = { _id: ObjectId(id) }
    const newvalues = { $set: {name: nameInput, category: categoryInput, price: priceInput, picURL: picURLInput, qunatity:quantityInput,picURL:picURLInput,author: authorInput,description: descriptionInput} }
    const collectionName = "Products"
    await updateCollection(collectionName, myquery, newvalues)
    res.redirect('product')
})

router.get('/editProduct',async (req,res)=>{
    const id = req.query.id
    const collectionName = "Products"
    const productToEdit = await getDocumentById(collectionName, id)
    res.render('editProduct',{product:productToEdit})
})
router.get('/adminHome', async(req,res)=>{
    const collectionName = "Products"
    const results = await getAllDocumentsFromCollection(collectionName)
    res.render('adminHome',{products:results})
})

router.get('/addProduct', (req,res)=>{
    res.render('addProduct')
})

router.get('/deleteProduct',async (req,res)=>{
    const id = req.query.id
    const collectionName = "Products"
    await deleteDocumentById(collectionName, id)
    res.redirect('product')
})

router.get('/product',async (req,res)=>{
    const collectionName = "Products"
    const results = await getAllDocumentsFromCollection(collectionName)
    res.render('product',{products:results})
})

router.post('/addProduct',async (req,res)=>{
    const nameInput = req.body.txtName
    const categoryInput = req.body.txtCategory
    const priceInput = req.body.txtPrice
    const picURLInput = req.body.txtPicURL
    const quantityInput = req.body.txtQuantity
    const authorInput = req.body.txtAuthor
    const descriptionInput = req.body.txtDescription

    const check = await dbHandler.checkCategory(categoryInput)
    if (nameInput.length == 0){
        const errorMessage = "Sach phai co ten!";
        const oldValues = {category: categoryInput, price: priceInput, quantity: quantityInput, picURL: picURLInput, author: authorInput, description: descriptionInput}
        res.render('addProduct',{errorName:errorMessage})
        console.log("a")
        return;
    } else if (priceInput.length == 0){
        const errorMessage = "Sach phai co gia!";
        const oldValues = {name: nameInput, category: categoryInput, quantity: quantityInput, picURL: picURLInput, author: authorInput, description: descriptionInput}
        res.render('product',{errorPrice:errorMessage,oldValues:oldValues})
        console.log("b")
        return;
    } else if(isNaN(priceInput)== true){
        const errorMessage = "Gia phai la so!"
        const oldValues = {name:nameInput, category: categoryInput, quantity: quantityInput, picURL: picURLInput, author: authorInput, description: descriptionInput}
        res.render('addProduct',{errorPriceNaN:errorMessage,oldValues:oldValues})
        console.log("c")
        return;
    } else if (picURLInput.length == 0 ) {
        const errorMessage = "San pham phai co anh!"
        const oldValues = {name:nameInput,category: categoryInput,price:priceInput,quantity:quantityInput,picURL:picURLInput,author:authorInput,description:descriptionInput}
        res.render('addProduct',{errorLink:errorMessage,oldValues:oldValues})
        console.log("d")
        return;
    } else if (quantityInput.length == 0) {
        const errorMessage = "San pham phai co so luong!"
        const oldValues = {name:nameInput,category: categoryInput,price:priceInput,picURL:picURLInput,author:authorInput,description:descriptionInput}
        res.render('addProduct',{errorQuantity:errorMessage,oldValues:oldValues})
        console.log("e")
        
    } else if (isNaN(quantityInput)){
        const errorMessage = "So luong phai la so!"
        const oldValues = {name:nameInput,category: categoryInput,price:priceInput,quantity:quantityInput,picURL:picURLInput,author:authorInput,description:descriptionInput}
        res.render('addProduct',{errorQuantityNaN:errorMessage,oldValues:oldValues})
        console.log("f")
        return;
    } else if (descriptionInput.length == 0){
        const errorMessage = "Sach phai co mieu ta!";
        const oldValues = {name:nameInput,category: categoryInput,price:priceInput,quantity:quantityInput,picURL:picURLInput,author:authorInput}
        res.render('addProduct',{errorDescription:errorMessage,oldValues:oldValues})
        console.log("g")
        return;
    } else if (check == -1){
        const errorMessage = "The loai nay khong co!";
        const oldValues = {name:nameInput,category: categoryInput,price:priceInput,quantity:quantityInput,picURL:picURLInput,author:authorInput,description:descriptionInput}
        res.render('addProduct',{errorNotFindCategory:errorMessage,oldValues:oldValues})
        console.log("h")
        return;
    }
    else {
        const newP = {name:nameInput,category: categoryInput,price:Number.parseFloat(priceInput),quantity:Number.parseInt(quantityInput),picURL:picURLInput,author:authorInput,description:descriptionInput}
        const collectionName = "Products"
        await insertObject(collectionName,newP)   
        res.redirect('product')
    }
    
})

//Ham manage Order
router.get('/viewOrder', async (req, res) => {
    const collectionName = "Order"
    const results = await getAllDocumentsFromCollection(collectionName)
    res.render('viewOrder', { orders: results })
})

router.get('/deleteOrder', async (req, res) => {
    const id = req.query.id
    //ham xoa user dua tren id
    const collectionName = "Order"
    await deleteDocumentById(collectionName, id)
    res.redirect('viewOrder')// return viewprofile page
})

router.get('/editOrder', async (req, res) => {
    const id = req.query.id
    //lay information old of ofer before edit
    const productToEdit = await getDocumentById("Order", id)
    //hien thi ra de sua
    res.render("editorder", { orders: productToEdit,id:id })
})

router.post('/editOrder',async (req,res) =>{
    const statusInput = req.body.txtstatus
    //ham update
    const id = req.body.txtId
    const myquery = { _id: ObjectId(id) }
    const newvalues = {$set: {
        status: statusInput,
        }
    }
    console.log(statusInput)
    console.log(newvalues)
    console.log(id)
    
    const collectionName = "Order"
    await updateCollection(collectionName, myquery, newvalues)
    res.redirect('viewOrder')
})
router.get('/orderDetail', async (req, res) => {
    const idOrder = req.query.id
    const dbo = await getDatabase();
    const collectionName = 'Order'
    const order = await dbo.collection(collectionName).findOne({ _id: ObjectId(idOrder) });

    const carts = order.cart

    var cart
    for (var i = 0; i < books.length; i++) {
        cart = await dbo.collection('Book').findOne({ _id: ObjectId(books[i].productId) });
        books[i].productId = book;
        books[i].status = order.status
        books[i].price = books[i].quantity * books[i].price
        books[i].date = order.date
    }
    console.log(books)
    var totalBill =  order.totalBill
    res.render("orderDetail", { books: books, totalBill: totalBill })
})



module.exports = router;