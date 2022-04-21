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


module.exports = router;