const express = require("express"),
    app = express(),
    bodyparser = require("body-parser"),
    flash = require("connect-flash"),
    passport = require("passport"),
    LocalStratergy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    mongoose = require("./db/mongoose"),
    methodoverride = require("method-override"),
    User = require("./models/user"),
    Meme = require("./models/meme"),
    userRouter = require("./routers/user"),
    memeRouter = require("./routers/memes"),
    otherRouter = require("./routers/quiz")

//require('dotenv').config();

const port = process.env.PORT || 3004

app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
//"mongodb+srv://varun51:gotilla@123@cluster0-ovdbs.mongodb.net/Entertainment"
app.use(flash())
app.use(methodoverride("_method"))

app.use(require("express-session")({
    secret: process.env.SECURITY_KEY,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error")
    res.locals.success = req.flash("success")
    res.locals.info = req.flash("info")
    next();
});

app.use("/", userRouter)
app.use("/", memeRouter)
app.use("/", otherRouter)


app.listen(port, () => {
    console.log("Entertainment app started");
});