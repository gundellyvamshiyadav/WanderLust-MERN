const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        filename: String,
        url: String,
    },
    price: {
        type: Number,
    },
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
        },
    },
    category: {
        type: String,
        enum: [
            "Trending", "Rooms", "Iconic cities", "Mountains", "Castles",
            "Amazing pools", "Camping", "Farms", "Arctic", "Domes",
            "Boats", "Lakes", "Tree city", "Beach", "Wineyards",
            "Deserts", "Islands", "Urban", "Eco-friendly", "Ski", "Historical"
        ],
        required: true
    },
    bookings: [
        {
            type: Schema.Types.ObjectId,
            ref: "Booking"
        }
    ],
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing && listing.reviews.length) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;