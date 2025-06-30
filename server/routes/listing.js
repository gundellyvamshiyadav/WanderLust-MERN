const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require('multer');
const { storage } = require('../config/cloudConfig.js');
const upload = multer({ storage });


router.route("/")
    .get(wrapAsync(listingController.index)) 
    .post(
        isLoggedIn, 
        upload.single('image'), 
        validateListing, 
        wrapAsync(listingController.createListing) 
    );

router.route("/:id")
    .get(wrapAsync(listingController.showListing)) 
    .put(
        isLoggedIn, 
        isOwner, 
        upload.single('image'), 
        validateListing, 
        wrapAsync(listingController.updateListing) 
    )
    .delete(
        isLoggedIn, 
        isOwner, 
        wrapAsync(listingController.destroyListing) 
    );

router.post("/:id/contact", isLoggedIn, wrapAsync(listingController.sendHostEmail));

module.exports = router;