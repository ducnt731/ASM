const express = require('express');
const router = require.Router();

reouter.get('/addCart',(req,res) => {
    const id = req.query.id;
    //lay biet card trong Session [Co the chua co gia trij hoac co gia trij]
    let myCart = req.session.get('cart');
})

var products = [];
router.get('buy',(req,res) => {
    products.push({'id':1,'name':'laptop'});
    products.push({'id':2,'name':'book'});
    products.push({'id':3,'name':'phone'});
    res.render('buy',{'products':products});
})

module.exports = router;