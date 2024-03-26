if(process.env.NODE_ENV!="production"){
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingsRoute = require("./routes/listing.js");
const reviewsRoute = require("./routes/reviews.js");
const userRoute = require("./routes/user.js");


const dbUrl = process.env.ATLASDB_URL;
async function main(){
    await mongoose.connect(dbUrl);
}
main()
.then((res)=>{
    console.log("connected successfully");
})
.catch((err)=>{
    console.log(err);
})
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"public")));


const store = MongoStore.create({
    mongoUrl : dbUrl,
    crypto : {
        secret : process.env.SECRET,
    },
    touchAfter : 24 * 3600,
}) 
store.on("error",()=>{
    console.log("ERROR IN MONGO"); 
})
const sessionOptions = {
    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true ,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000 , //in milliseconds
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true,
    }
}


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
//static methods
passport.serializeUser(User.serializeUser()); //store user info into session
passport.deserializeUser(User.deserializeUser()); //to remove user from session

app.use((req,res,next)=>{
    res.locals.success =req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});
//Using the listings routes using app.use()
app.use("/listings",listingsRoute);
app.use("/listings/:id/reviews",reviewsRoute);
app.use("/",userRoute);


//apart from the routes given above if the user goes to another route we'll print a custom error
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"));
});
//Handling async errors
app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went wrong"} = err;
    res.status(statusCode).render("error.ejs",{message});
    // res.status(statusCode).send(message);
});

// //ROOT 
// app.get("/",(req,res)=>{
//     res.send("I am root");
// });

app.listen(8080,()=>{
    console.log("Server listening to port 8080");
});