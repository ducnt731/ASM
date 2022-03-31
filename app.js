const express = require('express')
const app = express()
const session = require('express-session')

app.use(session({ secret: '124447yd@@$%%#', cookie: { maxAge: 60000 }, saveUninitialized: false, resave: false }))
app.set('view engine','hbs') // khai bao su dung hbs : res, render,...
app.use(express.urlencoded({extended:true})) // lay du lieu tu cac form text box, combo box,...

app.get('/',(req,res)=>{
    res.render('home', {userInfo:req.session.User})
})

const adminController = require('./controllers/admin')
app.use('/admin', adminController) //cac request co chua /admin se di den controller admin
const PORT = process.env.PORT || 6886
app.listen(PORT)
console.log("Server is running! " + PORT)