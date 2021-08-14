if(process.env.NODE_ENV !== "production"){
    require("dotenv").config();
}
const express = require("express");
const path = require("path");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const campgroundsRoutes = require("./routes/campgrounds.js")
const reviewsRoutes = require("./routes/reviews.js")
const usersRoutes = require("./routes/users.js")
const ExpressError = require("./utilities/ExpressError");
const session = require("express-session");
const flash = require("connect-flash");
const LocalStrategy = require("passport-local");
const passport = require("passport");
const User = require("./models/user.js")


app.engine("ejs", ejsMate);

app.use(methodOverride("_method"));

app.set("views",path.join(__dirname, "views"));

app.use(express.json());

app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname,"public")));

app.listen(3000, ()=>{
    console.log("Serving from port 3000");
})

app.use(express.urlencoded({extended:true}));

const sessionOptions = {
    secret : "SecretString", 
    resave : false, 
    saveUninitialized : true,
    cookie: {
        expires: Date.now() + 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7,
        httpOnly: true
    }    
}

app.use(session(sessionOptions));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser()); 

mongoose.connect('mongodb://localhost:27017/yelpCamp', {
    useNewUrlParser: true,
    useCreateIndex:true, 
    useUnifiedTopology:true,
    useFindAndModify: false
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

app.use("", (req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.user = req.user;
    next();
})

app.get("/", (req,res)=>{
    res.render("./campgrounds/home.ejs");
})


app.use("/campgrounds", campgroundsRoutes);
app.use("/campgrounds/:id/reviews", reviewsRoutes);
app.use("/users", usersRoutes);

app.all("*", (req,res, next)=>{
    next(new ExpressError("Page not Found!!", 404));
})

app.use( (err,req,res,next) => {
    const {status = 500} = err;
    if(!err.message) err.message = "Oh no something went wrong!!!";
    res.status(status).render("Error.ejs", {err});
})