const express = require('express')
const res = require('express/lib/response')
const async = require('hbs/lib/async')
const {insertObject, checkUserRole, USER_TABLE_NAME} = require('../databaseHandler')
const router = express.Router()

//neu request la: /admin/register
router.get('/register',(req,res)=>{
    res.render('register')
})

//neu request la: /admin/login
router.get('/login', (req,res)=> {
    res.render('login')
})

router.post('/register', (req,res)=>{
    const name = req.body.txtName
    const role = req.body.Role
    const pass = req.body.txtPassword
    const objectToInsert = {
        userName: name,
        role: role,
        password: pass
    }
    //goi ham insert: bang User, new user trong objectToInsert
    insertObject(USER_TABLE_NAME, objectToInsert)
    res.render('home')//quay ve home
})

//Kiem tra thong tin login
router.post('/login', async(req,res)=>{
    const name = req.body.txtName
    const pass = req.body.txtPassword
    const role = await checkUserRole(name,pass)
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
        res.redirect('/')
    }
})
module.exports = router;