const express = require('express')
const router = express.Router()

router.get('/addCart',(req,res)=>{
    const id = req.query.id
    //lay biet cart trong Session[ co the bang null hoac co gia tri]
    let myCart = req.session["cart"]
    if(myCart ==null){//day la lan dau tien add sp vao Cart
        var dict = {}
        dict[id] = 1 // 1: so luong la 1
        console.log('Ban da mua sp dau tien: '+ id)
        req.session["cart"] = dict
    }else{//da mua it nhat 1 sp
        var dict = req.session["cart"]
        var oldProduct = dict[id]
        //kiem tra sp dang mua co trong Cart chua
        if(oldProduct == null)
            dict[id] = 1 // chua co: cho so luong =1
        else{
            const oldQuantity = parseInt(oldProduct) //lay so luong cu
            dict[id] = oldQuantity + 1 //da co: so luong tang them 1
        }
        //cap nhat gio hang bang tu dien
        req.session["cart"] = dict
    }
    //chuyen gia tri tu kieu Dictionary sang Array
    let spDaMua = []
    //neu khach hang da mua it nhat 1 sp
    const dict2 = req.session["cart"]
    for (var key in dict2) {
        const productName = products.find(p=>p.id==key).name
        spDaMua.push({ masp: key,'name':productName, 'soLuong': dict2[key] })
    }
    res.render('myCart',{'cart':spDaMua})

})

//global scope
var products = []
router.get('/buy',(req,res)=>{    
    products = []
    products.push({'id':1,'name':'laptop'})
    products.push({'id':2,'name':'book'})
    products.push({'id':3,'name':'phone'})
    res.render('buy',{'products':products})
})

module.exports = router;