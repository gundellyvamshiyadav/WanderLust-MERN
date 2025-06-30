if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

module.exports = {
  cashfreeAppId: process.env.CASHFREE_APP_ID,
  cashfreeSecretKey: process.env.CASHFREE_SECRET_KEY,
  cashfreeMode: process.env.CASHFREE_MODE || "TEST", // Default to TEST if not specified
  cashfreeApiUrl: process.env.CASHFREE_API_URL || "https://api.cashfree.com/pg", // Default Cashfree API endpoint
};