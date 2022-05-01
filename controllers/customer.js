const express = require('express');
const router = express.Router();
const dbHandler = require('../databaseHandler');
const {getHistory,getOder,insertObject,USER_TABLE_NAME, getAllDocumentsFromCollection, deleteDocumentById, updateCollection, getDocumentById,getCustomer} = require('../databaseHandler')


// Middleware
router.use((req, res, next) => {
    if (req.session.user == null) {
        res.redirect("/login");
    } else {
        if (req.session.user.role == 'Customer') {
            next()
        }
        else {
            res.redirect("/admin")
        }
    }
})

router.get("/feedback", async (req, res) => {
    const result = await dbHandler.getAllFeedback("Feedback");
    const arr = [];
    result.forEach(e => {
        if (req.query.name === e.name) {
            arr.push(e)
        }
    })
    res.render("feedback", { query: req.query.name, list: arr }); //lay id cua sach truyen vao form
})

router.post("/feedback", (req, res) => {
  const feedback = req.body.txtFeedback
    const obj = {
      ...req.body, //copy all element of req.body
      username: req.session.user.userName, 
      time: new Date().toISOString(),
      Feedback: feedback
    };
    dbHandler.insertObject("Feedback", obj)
    res.redirect("/");
})

router.get("/myprofile", async (req, res) => {
  const user = await dbHandler.getUser(req.session.user.userName);
  res.render("myprofile", { user: user });
});

router.get("/updateProfile", async (req, res) => {
  const user = await dbHandler.getUser(req.session.user.userName);
  res.render("UpDateProfile", { user: user });
});

router.post("/updateProfile", async (req, res) => {
  const phone = req.body.txtPhone;
  const fullName = req.body.txtName;
  const email = req.body.txtEmail;
  const user = await dbHandler.getUser(req.session.user.userName);
  const updateValue = {
    $set: {
      userName: user.userName,
      email: email,
      Name: fullName,
      phone: phone,
      role: user.role,
      password: user.password,
    },
  }
  await dbHandler.updateDocument(user._id, updateValue, "Users");
  res.redirect("/customer/viewProfile");
});

// router.post("/UpdateSt", async (req, res) => {
//   const id = req.query.id;
//   const status = req.body.status;
//   const UpdateSt = dbHandler.getDocumentById(id, status, "Customer Order");
//   UpdateSt["Status"] = status;
//   const newSt = {
//     $set: {
//       user: UpdateSt.user,
//       books: UpdateSt.books,
//       totalPrice: UpdateSt.totalPrice,
//       time: UpdateSt.time,
//       Status: UpdateSt.Status,
//     },
//   };
//   console.log(newSt);
//   await dbHandler.updateDocument(id, newSt, " Customer Order");
//   res.redirect("/shoppingCart/Purchase");
// });


router.get("/updateMyProfile", async (req, res) => {
  console.log(req.session.user.userName)
  
  const user = await dbHandler.getUser(req.session.user.userName);
  console.log(user)
  res.render("updateMyProfile", { userInfo: user });
});

router.post("/updateMyProfile", async (req, res) => {
  const phone = req.body.txtPhone;
  const fullName = req.body.txtFullName;
  const email = req.body.txtEmail;
  const user = await dbHandler.getUser(req.session.user.userName);

  const updateValue = {
    $set: {
      Gmail: email,
      fullName: fullName,
      Phone: phone,
      role: user.role,
      password: user.password,
    }
  }
  await dbHandler.updateDocument(user, updateValue, "Users")
  res.redirect("updateMyProfile");
});

router.get('/purchasehistory', async (req, res) => {
  const collectionName = "Order"
  const name = req.session.user.userName 
  const results = await getHistory(collectionName, name)
  res.render('purchasehistory', { orders: results })
})


router.get('/deletemyorder', async (req, res) => {
  const id = req.query.id
  //ham xoa user dua tren id
  const collectionName = "Order"
  await deleteDocumentById(collectionName, id)
  res.redirect('purchasehistory')// return viewprofile page
})
module.exports = router;
