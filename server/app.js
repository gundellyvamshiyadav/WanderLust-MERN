if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const cors = require("cors");

// --- Models ---
const User = require("./models/user.js");

// --- Routers ---
const listingRouter = require("./routes/listing.js");
const reviewRouter =require("./routes/review.js");
const userRouter = require("./routes/user.js");
const bookingRouter = require("./routes/bookings.js");
const contactRouter = require("./routes/contact");
const dashboardRouter = require("./routes/dashboard");
const chatRouter = require('./routes/chat');

const corsOptions = {
  origin: [
    'http://localhost:5173',                         // For your local development
    'https://wanderlust-mern-client.onrender.com'    // For your deployed frontend
  ],
  credentials: true, 
  methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// --- Database Connection ---
const dbUrl = process.env.ATLASDB_URL;
if (!dbUrl) {
  console.error("Error: ATLASDB_URL is not defined.");
  process.exit(1);
}
main().catch(err => console.log("MONGO CONNECTION ERROR", err));
async function main() {
  await mongoose.connect(dbUrl);
  console.log("MongoDB connected successfully.");
}

// --- Session and Authentication Configuration ---
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: { secret: process.env.SECRET || "this-is-a-super-secret-key" },
  touchAfter: 24 * 3600,
});
store.on("error", (err) => console.error("SESSION STORE ERROR:", err));

app.set("trust proxy", 1); // Necessary for Render deployment

app.use(session({
  store,
  secret: process.env.SECRET || "this-is-a-super-secret-key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    // +++ THESE ARE THE CRUCIAL LINES FOR PRODUCTION +++
    sameSite: 'none', // Allows cross-site cookie sending
    secure: true      // Requires HTTPS, which Render provides
  },
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// --- API Routes ---
app.use("/api/listings", listingRouter);
app.use("/api/listings/:id/reviews", reviewRouter);
app.use("/api/users", userRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/contact", contactRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/chat", chatRouter);

// --- Error Handling Middleware ---
app.use((err, req, res, next) => {
  console.error("An error occurred:", err.stack);
  const statusCode = err.status || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({ success: false, message });
});

// --- Server Startup ---
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



/* if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const cors = require("cors");
const axios = require("axios"); 

// --- Models ---
const User = require("./models/user.js");

// --- Routers ---
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const bookingRouter = require("./routes/bookings.js");
const contactRouter = require("./routes/contact");
const dashboardRouter = require("./routes/dashboard");
const chatRouter = require('./routes/chat');

// --- Middleware Configuration ---
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// --- Database Connection ---
const dbUrl = process.env.ATLASDB_URL;
if (!dbUrl) {
  console.error("Error: ATLASDB_URL is not defined in the .env file.");
  process.exit(1);
}
async function main() {
  try {
    await mongoose.connect(dbUrl, {
      tlsAllowInvalidCertificates: true,
    });
    console.log("MongoDB connected successfully.");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
}
main();

// --- Session and Authentication Configuration ---
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: { secret: process.env.SECRET || "this-is-a-super-secret-key" },
  touchAfter: 24 * 3600,
});
store.on("error", (err) => console.error("SESSION STORE ERROR:", err));

app.use(session({
  store,
  secret: process.env.SECRET || "this-is-a-super-secret-key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// --- API Routes ---
app.use("/api/listings", listingRouter);
app.use("/api/listings/:id/reviews", reviewRouter);
app.use("/api/users", userRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/contact", contactRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/chat", chatRouter);
-
app.use((err, req, res, next) => {
  console.error("An error occurred:", err.stack);
  const statusCode = err.status || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({ message });
});

// --- Server Startup ---
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); */
