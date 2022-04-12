const express = require('express')
const app = express()

const session = require('express-session')
app.use(session({ secret: '124447yd@@$%%#', cookie: { maxAge: 60000 }, saveUninitialized: false, resave: false }))

//su dung HBS: =>res.render('....')
app.set('view engine', 'hbs')
//lay du lieu tu cac Form: textbox, combobox...
app.use(express.urlencoded({ extended: true }))

app.get('/',(req,res)=>{
    res.render('home',{userInfo:req.session.User})
    //res.render('home')
})

const adminController = require('./controllers/admin')
//tat ca cac dia chi co chua admin: localhost:5000/admin/... => goi controller admin
app.use('/admin', adminController)


const customerController = require('./controllers/customer')
app.use('/customer', customerController)


const PORT = process.env.PORT || 5000
app.listen(PORT)
console.log("Server is running! " + PORT)