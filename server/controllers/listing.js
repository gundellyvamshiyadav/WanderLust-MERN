const Listing = require("../models/listing.js");
const axios = require("axios");
const nodemailer = require('nodemailer');

const geocodeLocation = async (location, country) => {
    const query = `${location.trim()}, ${country.trim()}`;
    try {
        const geoResponse = await axios.get("https://nominatim.openstreetmap.org/search", {
            params: {
                q: query,
                format: "json",
                limit: 1,
                addressdetails: 1,
            },
            headers: {
                'User-Agent': 'WanderlustCloneApp/1.0 (your-email@example.com)' 
            },
            timeout: 5000,
        });

        if (geoResponse.data && geoResponse.data.length > 0) {
            return {
                type: "Point",
                coordinates: [
                    parseFloat(geoResponse.data[0].lon),
                    parseFloat(geoResponse.data[0].lat)
                ]
            };
        }
        return null;
    } catch (e) {
        console.error(`Geocoding failed for "${query}":`, e.message);
        return null;
    }
};

module.exports.index = async (req, res) => {
    const { category, search } = req.query;
    let query = {};
    if (search && search.trim()) {
        const searchRegex = new RegExp(search.trim(), "i");
        query.$or = [
            { title: searchRegex },
            { location: searchRegex },
            { country: searchRegex },
        ];
    }
    if (category) {
        query.category = category;
    }
    const allListings = await Listing.find(query).sort({ createdAt: -1 });
    res.status(200).json(allListings);
};

module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({ path: "reviews", populate: { path: "author", select: "username" } })
        .populate("owner", "username email");

    if (!listing) {
        return res.status(404).json({ message: "Listing not found." });
    }
    res.status(200).json(listing);
};

module.exports.createListing = async (req, res) => {
    const { location, country, ...listingData } = req.body;
    if (!location || !country) {
        return res.status(400).json({ message: "Location and country are required." });
    }
    if (!req.file) {
        return res.status(400).json({ message: "Listing image is required." });
    }
    const geometry = await geocodeLocation(location, country);
    if (!geometry) {
        return res.status(400).json({ message: `Could not find coordinates for: ${location}, ${country}. Please provide a more specific location.` });
    }
    const newListing = new Listing({
        ...listingData,
        location,
        country,
        geometry,
        owner: req.user._id,
        image: { url: req.file.path, filename: req.file.filename }
    });
    await newListing.save();
    res.status(201).json(newListing);
};

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    const { location, country, ...listingData } = req.body;

    const existingListing = await Listing.findById(id);
    if (!existingListing) {
        return res.status(404).json({ message: "Listing not found" });
    }
    let geometry = existingListing.geometry;
    if (location && country && (location !== existingListing.location || country !== existingListing.country)) {
        const newGeometry = await geocodeLocation(location, country);
        if (newGeometry) {
            geometry = newGeometry;
        }
    }
    const updatedData = {
        ...listingData,
        location: location || existingListing.location,
        country: country || existingListing.country,
        geometry
    };
    if (req.file) {
        updatedData.image = { url: req.file.path, filename: req.file.filename };
    }
    const updatedListing = await Listing.findByIdAndUpdate(id, updatedData, { new: true });
    res.status(200).json(updatedListing);
};

module.exports.destroyListing = async (req, res) => {
    const { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    if (!deletedListing) {
        return res.status(404).json({ message: "Listing not found." });
    }
    res.status(200).json({ message: "Listing deleted successfully." });
};

module.exports.sendHostEmail = async (req, res) => {
    const { id } = req.params;
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ message: "A message is required." });
    }

    const listing = await Listing.findById(id).populate('owner');
    if (!listing || !listing.owner) {
        return res.status(404).json({ message: "Could not find the listing's owner." });
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });

    const mailOptions = {
        from: `Wanderlust Platform <${process.env.EMAIL_USER}>`,
        to: listing.owner.email,
        replyTo: req.user.email,
        subject: `Inquiry about your listing: "${listing.title}"`,
        html: `
            <p>A guest has an inquiry about your listing "${listing.title}".</p>
            <p><strong>From:</strong> ${req.user.username}</p>
            <p><strong>Guest's Email:</strong> <a href="mailto:${req.user.email}">${req.user.email}</a></p>
            <p><strong>Message:</strong></p>
            <blockquote style="border-left: 2px solid #ccc; padding-left: 1em; margin-left: 1em; font-style: italic;">${message}</blockquote>
        `
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Your message has been sent successfully." });
};

// NOTE: All controller functions related to rendering EJS templates
// (e.g., rendernew, editListing, renderContactForm, renderSupportForm)
// have been removed as this logic is now handled by React components.
// The main "Support" email logic has also been moved to the `routes/contact.js` file.