const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");//
const wrapAsync = require("../utils/wrapAsync.js");//
const ExpressError = require("../utils/ExpressError.js");//
const {listingSchema} = require("../schema.js");//
const {validateListing,isLoggedIn, isOwner} = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

router.route("/")
.get(wrapAsync(listingController.index)) //Index Route
.post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.create)); //create route

//New route
router.get("/new",isLoggedIn,listingController.renderNewForm);


//trendings route
router.get("/trendings",(req,res)=>{
    res.send("You are in trendings page");
});
//rooms route
router.get("/rooms",(req,res)=>{
    res.send("You are in rooms page");
});
//iconic cities route
router.get("/cities",(req,res)=>{
    res.send("You are in cities page");
});
//mountains route
router.get("/mountains",(req,res)=>{
    res.send("You are in mountains page");
});
//castles route
router.get("/castles",(req,res)=>{
    res.send("You are in castles page");
});
//pools route
router.get("/pools",(req,res)=>{
    res.send("You are in pools page");
});
//camping route
router.get("/camping",(req,res)=>{
    res.send("You are in camping page");
});
//farms route
router.get("/farms",(req,res)=>{
    res.send("You are in farms page");
});
//arctic route
router.get("/arctic",(req,res)=>{
    res.send("You are in arctic page");
});
//boats route
router.get("/boats",(req,res)=>{
    res.send("You are in boats page");
});
//beach route
router.get("/beach",(req,res)=>{
    res.send("You are in beach page");
});


router.route("/:id")
.get(wrapAsync(listingController.show)) // show route
.put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.update)) //update route
.delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.destroy)); //delete route

//Edit Route
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.renderEdit));
module.exports = router;
