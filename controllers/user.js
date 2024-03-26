const User = require("../models/user");
module.exports.renderSignUpForm = (req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signup = async (req,res,next)=>{
    try{
        let {username , email , password} = req.body;
        let user1 = new User({username ,email});
        let registeredUser = await User.register(user1,password);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","User registered successfully");
            res.redirect("/listings");
        });       
    }
    catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
};
module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs");
};

module.exports.login = async (req,res)=>{
    req.flash("success","Welcome back to Wanderlust!");
    let urlRedirect = res.locals.redirectUrl || "/listings" ;
    res.redirect(urlRedirect);
};

module.exports.logout = (req,res,next)=>[
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        else{
            req.flash("success","You are logged out");
            res.redirect("/listings");
        }
    })
];