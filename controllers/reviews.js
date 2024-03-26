const Listing = require("../models/listing");
const Review = require("../models/reviews");
module.exports.createReview = async (req,res)=>{
    let { id } = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success","Review Created");
    res.redirect(`/listings/${listing._id}`); 
};

module.exports.destroyReview = async(req,res)=>{
    let {id , reviewId } = req.params;
    let listing = await Listing.findById(id);
    await Listing.findByIdAndUpdate(id,{$pull : {reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted");
    res.redirect(`/listings/${listing._id}`);
};