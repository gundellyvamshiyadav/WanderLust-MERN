const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to perform this action." });
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id);

        if (!listing) {
            return res.status(404).json({ message: "Listing not found." });
        }

        if (!listing.owner.equals(req.user._id)) {
            return res.status(403).json({ message: "You do not have permission to modify this listing." });
        }
        next();
    } catch (error) {
        next(error);
    }
};

module.exports.isReviewAuthor = async (req, res, next) => {
    try {
        const { id, reviewId } = req.params; 
        const review = await Review.findById(reviewId);
        
        if (!review) {
            return res.status(404).json({ message: "Review not found." });
        }
        
        if (!review.author.equals(req.user._id)) {
            return res.status(403).json({ message: "You are not the author of this review." });
        }
        next();
    } catch (error) {
        next(error);
    }
};

module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body); 
    if (error) {
        const errmsg = error.details.map((e) => e.message).join(", ");
        throw new ExpressError(400, errmsg);
    } else {
        next();
    }
};


module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body.review); 
    if (error) {
        const errmsg = error.details.map((e) => e.message).join(", ");
        throw new ExpressError(400, errmsg);
    } else {
        next();
    }
};

module.exports.optionalAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        res.locals.currUser = req.user;
    }
    next();
};