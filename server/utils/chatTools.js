// server/utils/chatTools.js

const tools = [
  {
    functionDeclarations: [
      {
        name: "getFaqAnswer",
        description: "Answers common questions from a database. MUST BE USED for any general informational query like 'What is Wanderlust?', 'Who is the creator?', 'How do I cancel?', 'What is the payment policy?', etc.",
        parameters: {
          type: "OBJECT",
          properties: {
            question: {
              type: "STRING",
              description: "The user's question, summarized into keywords. For example, for 'Hey can you tell me what wanderlust is', use 'what is wanderlust'.",
            },
          },
          required: ["question"],
        },
      },
      {
        name: "searchListings",
        description: "Searches for listings. Use for any request to find a place. Can filter by keywords, category (e.g., 'Mountains', 'Castles', 'Beach'), and/or budget.",
        parameters: {
          type: "OBJECT",
          properties: {
            query: {
              type: "STRING",
              description: "General search keywords like 'cozy cabin' or 'apartment near the city center'.",
            },
            category: {
              type: "STRING",
              // --- ENHANCEMENT: Added list of categories to help the AI ---
              description: `A specific category to filter by. Must be one of: "Trending", "Rooms", "Iconic cities", "Mountains", "Castles", "Amazing pools", "Camping", "Farms", "Arctic", "Domes", "Boats".`,
            },
            budget: {
              type: "NUMBER",
              description: "Optional maximum price per night for the listing.",
            }
          },
          // Note: No parameters are strictly required, allowing for broad searches like "show me everything"
        },
      },
      // ... other tool declarations are unchanged ...
      {
        name: "getListingDetails",
        description: "Fetches detailed information about a SINGLE, specific listing AFTER the user has identified it by name from a search. Use this when the user asks for 'more details', 'amenities', or 'the description' of a specific place.",
        parameters: {
          type: "OBJECT",
          properties: {
            title: {
              type: "STRING",
              description: "The exact title of the listing, e.g., 'Historic Canal House'.",
            },
          },
          required: ["title"],
        },
      },
      {
        name: "checkAvailability",
        description: "Checks if a specific listing is available for a given date range. Use this when the user asks about booking or availability and provides specific dates.",
        parameters: {
          type: "OBJECT",
          properties: {
            title: { type: "STRING", description: "The title of the listing to check." },
            startDate: { type: "STRING", description: "The check-in date in YYYY-MM-DD format." },
            endDate: { type: "STRING", description: "The check-out date in YYYY-MM-DD format." },
          },
          required: ["title", "startDate", "endDate"],
        },
      },
      {
        name: "startBooking",
        description: "Generates a booking link for a user to finalize their reservation for a specific listing. Call this ONLY after confirming availability and when the user confirms they want to book.",
        parameters: {
          type: "OBJECT",
          properties: {
            title: { type: "STRING", description: "The title of the listing to book." },
          },
          required: ["title"],
        },
      },
      {
        name: "getMyBookings",
        description: "Retrieves a list of the current user's past and upcoming bookings. Use this when a logged-in user asks 'where are my bookings?', 'my trips', or similar questions.",
        parameters: {
          type: "OBJECT",
          properties: {},
        },
      },
      {
        name: "getHelpInfo",
        description: "Provides information about how the Wanderlust website works. Use this for questions about policies or features.",
        parameters: {
          type: "OBJECT",
          properties: {
            topic: {
              type: "STRING",
              description: "The topic to get help on. Must be one of: 'cancellation', 'support', 'privacy', 'payment', 'adding_listing', 'leaving_review'.",
            },
          },
          required: ["topic"],
        },
      },
    ],
  },
];

module.exports = tools;
