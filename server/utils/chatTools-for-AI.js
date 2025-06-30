const toolConfig = {
    searchListings: {
        description: "Searches the Wanderlust database for property listings. Use this when a user wants to find a place to stay. Can filter by keywords, category, or budget. All parameters are optional.",
        parameters: { type: "OBJECT", properties: { query: { type: "STRING", description: "The location or keywords to search for (e.g., 'malibu', 'beachfront paradise')." }, category: { type: "STRING", description: "A specific category like 'Cabin', 'Beach', 'Trending', etc." }, budget: { type: "NUMBER", description: "The maximum price per night." } } }
    },
    getListingDetails: {
        description: "Fetches detailed information about a SINGLE, specific listing after it has been found.",
        parameters: { type: "OBJECT", properties: { title: { type: "STRING" } }, required: ["title"] }
    },
    checkAvailability: {
        description: "Checks if a specific listing is available for a given date range.",
        parameters: { type: "OBJECT", properties: { title: { type: "STRING" }, startDate: { type: "STRING" }, endDate: { type: "STRING" } }, required: ["title", "startDate", "endDate"] }
    },
    startBooking: {
        description: "Generates a booking link for a user to finalize their reservation.",
        parameters: { type: "OBJECT", properties: { title: { type: "STRING" } }, required: ["title"] }
    },
    getMyBookings: {
        description: "Retrieves a list of the current user's bookings. Only works if the user is logged in.",
        parameters: { type: "OBJECT", properties: {} }
    }
};

const tools = [
    {
        type: "function",
        function: toolConfig.searchListings
    },
    {
        type: "function",
        function: toolConfig.getListingDetails
    },
    {
        type: "function",
        function: toolConfig.checkAvailability
    },
    {
        type: "function",
        function: toolConfig.startBooking
    },
    {
        type: "function",
        function: toolConfig.getMyBookings
    }
].map(tool => ({
    type: "function",
    function: {
        name: Object.keys(toolConfig).find(key => toolConfig[key] === tool.function),
        description: tool.function.description,
        parameters: tool.function.parameters
    }
}));

const openAITools = Object.keys(toolConfig).map(toolName => ({
    type: "function",
    function: {
        name: toolName,
        description: toolConfig[toolName].description,
        parameters: toolConfig[toolName].parameters
    }
}));

module.exports = openAITools;