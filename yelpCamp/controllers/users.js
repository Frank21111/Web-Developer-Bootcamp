const User = require("../models/user.js");
const flash = require("connect-flash");

module.exports.newUser = async(req,res,next)=>{
    try{
        const {username, email, password} = req.body;
        const newUser = new User({username, email});
        await User.register(newUser, password);
        //Lo que hace esto es logear al usuario que se registro sin que el lo tenga que hacer manualmente
        req.login(newUser, err => {
            if(err) return next(err)
            req.flash("success", "Welcome to yelpCamp!! :)");
            res.redirect("/campgrounds");
        });   
    }catch(error){
        req.flash("error", error.message);
        res.redirect("/users/register")
    }
}

module.exports.login = (req,res)=>{
    req.flash("success", "Welcome Back") 
    const redirectUrl = req.session.originalUrl || (req.originUrl || "/campgrounds");
    delete req.session.originalUrl;
    return res.redirect(`${redirectUrl}`);
}

module.exports.logout = (req,res)=>{
    req.logout();
    req.flash("success", "Sayhonara!!")
    res.redirect("/campgrounds");

}