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
/////////////////////////////////////
router.get('/viewprofile', async (req, res) => {
    const collectionName = "Users"
    const results = await getAllDocumentsFromCollection(collectionName)
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

///////////////////////////

module.exports = router;