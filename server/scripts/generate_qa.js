require("dotenv").config();
const mongoose = require("mongoose");
const QA = require("../models/qa.js");

const categories = [
  "Trending", "Rooms", "Iconic cities", "Mountains", "Castles", "Amazing pools",
  "Camping", "Farms", "Arctic", "Domes", "Boats", "Lakes", "Tree city", "Beach",
  "Vineyards", "Deserts", "Islands", "Urban", "Eco-friendly", "Ski", "Historical"
];

const qaTemplates = {
  General: [
    { q: "What is Wanderlust?", a: "Wanderlust is a platform to browse, book, and list unique accommodations worldwide, from castles to eco-friendly stays." },
    { q: "Who created Wanderlust?", a: "Wanderlust was created by Gundelly Vamshi Yadav." },
    { q: "What types of properties are on Wanderlust?", a: "You can find Trending, Rooms, Iconic cities, Mountains, Castles, Amazing pools, Camping, Farms, Arctic, Domes, Boats, Lakes, Tree city, Beach, Vineyards, Deserts, Islands, Urban, Eco-friendly, Ski, and Historical listings." },
    { q: "How do I contact Wanderlust support?", a: "Visit /support or email support@wanderlust.com." },
    { q: "Is browsing Wanderlust free?", a: "Yes, browsing is free; booking requires payment based on the listing’s price." }, 
  ],
  User: [
    { q: "How do I sign up for Wanderlust?", a: "Click 'Sign Up,' enter your email, username, and password, then verify your email." },
    { q: "Do I need an account to browse listings?", a: "No, but you need an account to book or list properties." },
    { q: "How do I log in to Wanderlust?", a: "Click 'Log In' and enter your username and password." },
    { q: "What if I forget my password?", a: "Use the 'Forgot Password' link to reset it via email." },
  ],
  Listings: [
    { q: "How do I search for listings?", a: "Enter a location, category, or budget in the search bar to find listings." },
    { q: "Can I find {category} listings?", a: "Yes, search for '{category}' in the category filter." },
    { q: "What is a listing on Wanderlust?", a: "A listing is a property available for booking, with details like title, price, location, and category." },
  ],
  Reviews: [
    { q: "How do I leave a review?", a: "After your stay, go to the listing’s page and submit a comment and rating (1–5)." },
    { q: "What is the rating scale for reviews?", a: "Ratings range from 1 (lowest) to 5 (highest)." },
  ],
  Bookings: [
    { q: "How do I book a listing?", a: "Select a listing, choose dates, enter guest details, and submit payment." },
    { q: "What details are needed for a booking?", a: "Listing, user, from/to dates, number of guests, full name, phone, and optional notes." },
  ],
  Technical: [
    { q: "Why is Wanderlust slow?", a: "Check your internet or contact support for server issues." },
    { q: "What technology powers Wanderlust?", a: "It uses MongoDB, Mongoose, and Passport, developed by Gundelly Vamshi Yadav." },
  ],
  AboutCreator: [
    { q: "Who is Gundelly Vamshi Yadav?", a: "Gundelly Vamshi Yadav is the creator and lead developer of Wanderlust." },
    { q: "What inspired Gundelly Vamshi Yadav to create Wanderlust?", a: "To make unique accommodations accessible worldwide." },
  ],
  EdgeCases: [
    { q: "Can I book a {category} for a wedding?", a: "Search for '{category}' and contact the owner for event permissions." },
    { q: "What if a listing is booked for my dates?", a: "Search for similar listings or adjust your dates." },
  ],
};

async function generateQA() {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.ATLASDB_URL, {
        tlsAllowInvalidCertificates: true,
      });
      console.log("Connected to MongoDB Atlas for Q&A generation");
    }

    let qaList = [];
    let id = 1;

    for (let i = 0; i < 300; i++) {
      const template = qaTemplates.General[i % qaTemplates.General.length];
      qaList.push({ question: `General Q${id}: ${template.q}`, answer: template.a, category: "General" });
      id++;
    }
    for (let i = 0; i < 400; i++) {
      const template = qaTemplates.User[i % qaTemplates.User.length];
      qaList.push({ question: `User Q${id}: ${template.q}`, answer: template.a, category: "User" });
      id++;
    }
    for (let i = 0; i < 280; i++) {
      const template = qaTemplates.Listings[i % qaTemplates.Listings.length];
      qaList.push({ question: `Listings Q${id}: ${template.q}`, answer: template.a, category: "Listings" });
      id++;
    }
    for (let category of categories) {
      for (let i = 0; i < 20; i++) {
        const template = qaTemplates.Listings[1];
        qaList.push({
          question: `Listings Q${id}: ${template.q.replace("{category}", category)}`,
          answer: template.a.replace("{category}", category),
          category: "Listings",
        });
        id++;
      }
    }
    for (let i = 0; i < 400; i++) {
      const template = qaTemplates.Reviews[i % qaTemplates.Reviews.length];
      qaList.push({ question: `Reviews Q${id}: ${template.q}`, answer: template.a, category: "Reviews" });
      id++;
    }

    for (let i = 0; i < 700; i++) {
      const template = qaTemplates.Bookings[i % qaTemplates.Bookings.length];
      qaList.push({ question: `Bookings Q${id}: ${template.q}`, answer: template.a, category: "Bookings" });
      id++;
    }
    for (let i = 0; i < 200; i++) {
      const template = qaTemplates.Technical[i % qaTemplates.Technical.length];
      qaList.push({ question: `Technical Q${id}: ${template.q}`, answer: template.a, category: "Technical" });
      id++;
    }
    for (let i = 0; i < 100; i++) {
      const template = qaTemplates.AboutCreator[i % qaTemplates.AboutCreator.length];
      qaList.push({ question: `AboutCreator Q${id}: ${template.q}`, answer: template.a, category: "AboutCreator" });
      id++;
    }
    for (let i = 0; i < 80; i++) {
      const template = qaTemplates.EdgeCases[i % qaTemplates.EdgeCases.length];
      qaList.push({ question: `EdgeCases Q${id}: ${template.q}`, answer: template.a, category: "EdgeCases" });
      id++;
    }
    for (let category of categories) {
      for (let i = 0; i < 5; i++) {
        const template = qaTemplates.EdgeCases[0];
        qaList.push({
          question: `EdgeCases Q${id}: ${template.q.replace("{category}", category)}`,
          answer: template.a.replace("{category}", category),
          category: "EdgeCases",
        });
        id++;
      }
    }

    await QA.deleteMany({});
    await QA.insertMany(qaList);
    console.log(`Inserted ${qaList.length} Q&A pairs into MongoDB Atlas`);
    mongoose.connection.close();
  } catch (error) {
    console.error("Error generating Q&A:", error);
    mongoose.connection.close();
  }
}

generateQA();