const express = require('express');
const router = express.Router();
const dbHandler = require('../databaseHandler');

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
    const result = await dbHandler.getAll("Feedback");
    const arr = [];
    result.forEach(e => {
        if (req.query.name === e.name) {
            arr.push(e)
        }
    })
    res.render("feedback", { query: req.query.name, list: arr }); //lay id cua sach truyen vao form
})

router.post("/feedback", (req, res) => {
    const obj = {
        ...req.body, //copy all element of req.body
        username: req.session.user.userName, 
        time: new Date().toISOString(),
    };
    dbHandler.insertObject("Feedback", obj)
    res.redirect("/");
})

router.get("/viewProfile", async (req, res) => {
  const user = await dbHandler.getUser(req.session.user.name);
  res.render("profile", { user: user });
});

router.get("/updateProfile", async (req, res) => {
  const user = await dbHandler.getUser(req.session.user.name);
  res.render("UpDateProfile", { user: user });
});

router.post("/updateProfile", async (req, res) => {
  const phone = req.body.txtPhone;
  const fullName = req.body.txtName;
  const email = req.body.txtEmail;
  const user = await dbHandler.getUser(req.session.user.name);
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
  res.redirect("/shoppingCart/viewProfile");
});

router.post("/UpdateSt", async (req, res) => {
  const id = req.query.id;
  const status = req.body.status;
  const UpdateSt = dbHandler.getDocumentById(id, status, "Customer Order");
  UpdateSt["Status"] = status;
  const newSt = {
    $set: {
      user: UpdateSt.user,
      books: UpdateSt.books,
      totalPrice: UpdateSt.totalPrice,
      time: UpdateSt.time,
      Status: UpdateSt.Status,
    },
  };
  console.log(newSt);
  await dbHandler.updateDocument(id, newSt, " Customer Order");
  res.redirect("/shoppingCart/Purchase");
});


router.get("/updateMyProfile", async (req, res) => {
  const user = await dbHandler.getUser(req.session.user.name);
  res.render("updateMyProfile", { user: user });
});

router.post("/updateMyProfile", async (req, res) => {
  const phone = req.body.txtPhone;
  const fullName = req.body.txtName;
  const email = req.body.txtEmail;
  const user = await dbHandler.getUser(req.session.user.name);
  const updateValue = {
    $set: {
      userName: user.userName,
      email: email,
      Name: fullName,
      phone: phone,
      role: user.role,
      password: user.password,
    }
  }
  await dbHandler.updateDocument(user._id, updateValue, "Users")
  res.render("updateMyProfile");
});

module.exports = router;
