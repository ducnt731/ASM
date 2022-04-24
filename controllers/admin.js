const express = require('express')
const async = require('hbs/lib/async')
const bcrypt = require('bcrypt')
const router = express.Router()
const {insertObject,USER_TABLE_NAME, FindDocumentsByGmail, getAllDocumentsFromCollection, deleteDocumentById, updateCollection, getDocumentById} = require('../databaseHandler')

// router.get('/register',(req,res)=>{
//     res.render('register')
// })
// router.post("/register", async (req, res) => {
//     const userName = req.body.txtUser;
//     const mail = req.body.txtMail;
//     const phone = req.body.txtPhone;
//     const pass = req.body.txtPass;
//     const rePass = req.body.txtRePass;
//     const role = req.body.Role;
//     const fullName = req.body.txtName;
//     const address = req.body.txtAddress
//     const hashPass = await bcrypt.hash(pass, 10);
//     const existedUser = await dbHandler.checkUserLogin(userName);
//     if (existedUser == -1) {
//     const validPass = await bcrypt.compare(rePass, hashPass);
//         if (validPass) {
//         const newUser = {
//         userName: userName,
//         gmail: mail,
//         Name: fullName,
//         phone: phone,
//         role: role,
//         Address: address,
//         password: hashPass,
//         };
//         await dbHandler.insertObject("Users", newUser);
//         res.render("register");
//     } else {
//         res.render("register", { errorMsg: "Password is not match" });
//     }
//     } else {
//     res.render("register", { errorMsg: "Username already used" });
//     }
// })

router.get('/viewprofile', async (req, res) => {
    const collectionName = "Users"
    const results = await getAllDocumentsFromCollection(collectionName)
    res.render('viewprofile', { users: results })
})

router.post('/edit',async (req,res)=>{
    const nameInput = req.body.txtName
    const priceInput = req.body.txtPrice
    const picURLInput = req.body.txtPicURL
    const quantityInput = req.body.txtQuantity
    const authorInput = req.body.txtAuthor
    const id = req.body.txtId
    const myquery = { _id: ObjectId(id) }
    const newvalues = { $set: {name: nameInput, price: priceInput, qunatity:quantityInput,picURL:picURLInput,author: authorInput} }
    const collectionName = "Products"
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

router.get('/edit',async (req,res)=>{
    const id = req.query.id
    const collectionName = "Products"
    const productToEdit = await getDocumentById(collectionName, id)
    res.render('editProduct',{product:productToEdit})
})

router.get('/addProduct',async (req,res)=>{
    res.render('addProduct')
})

router.get('/deleteProduct',async (req,res)=>{
    const id = req.query.id
    const collectionName = "Products"
    await deleteDocumentById(collectionName, id)
    res.redirect('/product')
})

router.get('/product',async (req,res)=>{
    const collectionName = "Products"
    const results = await getAllDocumentsFromCollection(collectionName)
    res.render('product',{products:results})
})

router.post('/addProduct',async (req,res)=>{
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
router.get('/editCustomer', async (req, res) => {
    const id = req.query.id
    //lay information old of user before edit
    const productToEdit = await getDocumentById("Users", id)
    //hien thi ra de sua
    res.render("editCustomer", { users: productToEdit,id:id })
})

module.exports = router;