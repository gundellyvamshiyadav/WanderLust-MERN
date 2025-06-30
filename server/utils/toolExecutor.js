const Listing = require("../models/listing.js");
const Booking = require("../models/bookings.js");

const formatPrice = (price) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(price);


async function searchListingsTool(query, category, budget) {
    try {
        const searchCriteria = {};
        if (query) searchCriteria.$text = { $search: query };
        if (category) searchCriteria.category = { $regex: new RegExp(category, 'i') };
        if (budget) searchCriteria.price = { $lte: budget };

        const listings = await Listing.find(searchCriteria).limit(5);
        if (listings.length === 0) return "I couldn't find any listings matching your criteria. Maybe try a different search?";
        
        const listingsSummary = listings.map(l => `- ${l.title} in ${l.location} [${l.category}] for ${formatPrice(l.price)}/night.`).join("\n");
        return `I found a few places that might interest you:\n${listingsSummary}`;
    } catch (error) {
        console.error("ERROR in searchListingsTool:", error.message);
        return "An internal error occurred while searching.";
    }
}

async function getListingDetailsTool(title) {
    try {
        const listing = await Listing.findOne({ title: { $regex: new RegExp(title, 'i') } }).populate({ path: 'reviews', populate: { path: 'author', select: 'username' } });
        if (!listing) return `I couldn't find a listing named "${title}".`;
        
        let reviewsSummary = 'No reviews yet.';
        if (listing.reviews.length > 0) {
            const latestReview = listing.reviews[listing.reviews.length - 1];
            reviewsSummary = `${listing.reviews.length} reviews. The latest one from ${latestReview.author.username} says: "${latestReview.comment}" (${latestReview.rating}/5 stars).`;
        }
        return `Details for "${listing.title}":\n- Location: ${listing.location}\n- Price: ${formatPrice(listing.price)}/night\n- Description: ${listing.description}\n- Reviews: ${reviewsSummary}`;
    } catch (error) {
        console.error("ERROR in getListingDetailsTool:", error.message);
        return "An internal error occurred while fetching details.";
    }
}

async function checkAvailabilityTool(title, startDate, endDate) {
    try {
        const listing = await Listing.findOne({ title: { $regex: new RegExp(title, 'i') } });
        if (!listing) return `I couldn't find a listing named "${title}".`;

        const conflictingBooking = await Booking.findOne({
            listing: listing._id,
            $or: [{ fromDate: { $lt: new Date(endDate) }, toDate: { $gt: new Date(startDate) } }],
        });
        
        return conflictingBooking ? `I'm sorry, "${title}" is not available for those dates.` : `Good news! "${title}" is available. Would you like a link to book it?`;
    } catch (error) {
        console.error("ERROR in checkAvailabilityTool:", error.message);
        return "An internal error occurred while checking availability.";
    }
}

async function startBookingTool(title) {
    try {
        const listing = await Listing.findOne({ title: { $regex: new RegExp(title, 'i') } });
        if (!listing) return `I could not find a listing with that title.`;
        return `[ACTION_URL]/listings/${listing._id}`;
    } catch (error) {
        console.error("ERROR in startBookingTool:", error.message);
        return "An internal error occurred while preparing your booking.";
    }
}

async function getMyBookingsTool(userId) {
    try {
        if (!userId) return "You'll need to be logged in to see your bookings.";
        const bookings = await Booking.find({ user: userId }).populate("listing", "title location");
        if (bookings.length === 0) return "You don't have any bookings yet.";

        const bookingsSummary = bookings.map(b => `- "${b.listing.title}" from ${b.fromDate.toLocaleDateString()} to ${b.toDate.toLocaleDateString()}. Status: ${b.status}.`).join("\n");
        return `I found your bookings:\n${bookingsSummary}`;
    } catch (error) {
        console.error("ERROR in getMyBookingsTool:", error.message);
        return "An internal error occurred while fetching your bookings.";
    }
}

async function executeTool(functionCall, userId) {
  const { name, args } = functionCall;
  
  switch(name) {
    case "searchListings": return await searchListingsTool(args.query, args.category, args.budget);
    case "getListingDetails": return await getListingDetailsTool(args.title);
    case "checkAvailability": return await checkAvailabilityTool(args.title, args.startDate, args.endDate);
    case "startBooking": return await startBookingTool(args.title);
    case "getMyBookings": return await getMyBookingsTool(userId);
    default: return `Unknown tool: ${name}`;
  }
}

module.exports = { executeTool };