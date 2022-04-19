const express = require('express')
const async = require('hbs/lib/async')
const router = express.Router()
const {insertObject, checkUserRole,USER_TABLE_NAME, getAllDocumentsFromCollection, deleteDocumentById, updateCollection, getDocumentById} = require('../databaseHandler')

//neu request la: /admin/register
router.get('/register',(req,res)=>{
    res.render('register')
})

//kiem tra thong tin login
router.post('/login',async (req,res)=>{
    const name = req.body.txtName
    const pass= req.body.txtPassword
    const role =await checkUserRole(name,pass)
    if (role=="-1"){
        res.render('login')
        return
    }else{
        console.log("You are a/an: " +role)
        req.session["User"] = {
            'userName': name,
            'role': role //admin hoac staff
        }
        //res.render('home',{userInfo:req.session.User})
        res.redirect('/adminHome')
    }

})

router.get('/login',(req,res)=>{
    res.render('login')
})

router.post('/register',(req,res)=>{
    const name = req.body.txtName
    const role = req.body.Role
    const pass= req.body.txtPassword

    const objectToInsert = {
        userName: name,
        role:role,
        password: pass
    }
    //goi ham insert: bang Users, new user trong objectToInsert
    insertObject(USER_TABLE_NAME,objectToInsert)
    res.render('home')
})

// router.post('/edit',async (req,res)=>{
//     const nameInput = req.body.txtName
//     const priceInput = req.body.txtPrice
//     const picURLInput = req.body.txtPicURL
//     const quantityInput = req.body.txtQuantity
//     const authorInput = req.body.txtAuthor

//     const id = req.body.txtId
    
//     const myquery = { _id: ObjectId(id) }
//     const newvalues = { $set: {name: nameInput, price: priceInput,qunatity:quantityInput,picURL:picURLInput,author: authorInput} }
//     const collectionName = "Products"
//     await updateCollection(collectionName, myquery, newvalues)
//     res.redirect('/product')
// })

// router.get('/edit',async (req,res)=>{
//     const id = req.query.id
//     const collectionName = "Products"
//     const productToEdit = await getDocumentById(collectionName, id)
//     res.render('editProduct',{product:productToEdit})
// })
// router.get('/',(req,res)=>{
//     res.render('home')
// })

// router.get('/addProduct',async (req,res)=>{
//     res.render('addProduct')
// })

// router.get('/deleteProduct',async (req,res)=>{
//     const id = req.query.id
//     const collectionName = "Products"
//     await deleteDocumentById(collectionName, id)
//     res.redirect('/product')
// })

// router.get('/product',async (req,res)=>{
//     const collectionName = "Products"
//     const results = await getAllDocumentsFromCollection(collectionName)
//     res.render('product',{products:results})
// })

// router.post('/addProduct',async (req,res)=>{
//     const nameInput = req.body.txtName
//     const priceInput = req.body.txtPrice
//     const picURLInput = req.body.txtPicURL
//     const quantityInput = req.body.txtQuantity
//     const authorInput = req.body.txtAuthor


//     if (nameInput.length == 0){
//         const errorMessage = "San pham phai co ten!";
//         const oldValues = {price:priceInput,quantity:quantityInput,picURL:picURLInput,author:authorInput}
//         res.render('addProduct',{errorName:errorMessage})
//         console.log("a")
//         return;
//     } else if (priceInput.length == 0){
//         const errorMessage = "San pham phai co gia!";
//         const oldValues = {name:nameInput,quantity:quantityInput,picURL:picURLInput,author:authorInput}
//         res.render('product',{errorPrice:errorMessage,oldValues:oldValues})
//         console.log("b")
//         return;
//     } else if(isNaN(priceInput)== true){
//         const errorMessage = "Gia phai la so!"
//         const oldValues = {name:nameInput,price:priceInput,quantity:quantityInput,picURL:picURLInput,author:authorInput}
//         res.render('addProduct',{errorPriceNaN:errorMessage,oldValues:oldValues})
//         console.log("c")
//         return;
//     } else if (picURLInput.length == 0 ) {
//         const errorMessage = "San pham phai co anh!"
//         const oldValues = {name:nameInput,price:priceInput,quantity:quantityInput,picURL:picURLInput,author:authorInput}
//         res.render('addProduct',{errorLink:errorMessage,oldValues:oldValues})
//         console.log("d")
//         return;
//     } else if (quantityInput.length == 0) {
//         const errorMessage = "San pham phai co so luong!"
//         const oldValues = {name:nameInput,price:priceInput,quantity:quantityInput,picURL:picURLInput,author:authorInput}
//         res.render('addProduct',{errorQuantity:errorMessage,oldValues:oldValues})
//         console.log("e")
        
//     } else if (isNaN(quantityInput)){
//         const errorMessage = "So luong phai la so!"
//         const oldValues = {name:nameInput,price:priceInput,quantity:quantityInput,picURL:picURLInput,author:authorInput}
//         res.render('addProduct',{errorQuantityNaN:errorMessage,oldValues:oldValues})
//         console.log("g")
//         return;
//     }
//     else {
//         const newP = {name:nameInput,price:Number.parseFloat(priceInput),quantity:quantityInput,picURL:picURLInput,author:authorInput}
//         const collectionName = "Products"
//         await insertObject(collectionName,newP)   
//         res.redirect('/product')
//     }
    
// })


module.exports = router;