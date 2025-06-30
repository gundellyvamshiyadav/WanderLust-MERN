# WanderLust-MERN

WanderLust-MERN is a full-stack travel booking and listing platform built with the MERN stack (MongoDB, Express.js, React.js, Node.js). This project is a showcase of modern web development, integrating advanced features like online payments, maps, filterable listings, reviews, and real-time notifications.

---

## ✨ Features

- **User Authentication & Authorization**  
  Register, login, session management with Passport.js and JWT.

- **Property Listings**  
  - CRUD operations for travel listings, images stored on Cloudinary.
  - Geocoding via OpenStreetMap Nominatim API.
  - Location coordinates shown with interactive maps (Leaflet & react-leaflet).

- **Booking System**  
  - Book listings, view booking history, and dashboard analytics.
  - Real-time payment & booking status updates.

- **Payments Integration**  
  - **Cashfree Payment Gateway**: Secure, real-time payment processing for bookings.

- **Reviews & Ratings**  
  - Authenticated users can post, manage, and delete reviews with a 1–5 star scale.

- **Email Communication**  
  - **Nodemailer**: Automated emails for contact/support and host communication via Gmail SMTP.

- **Advanced Filtering**  
  - Dynamic, multi-category filters with scrollable filter bar and amenities.

- **Interactive Maps**  
  - Live map previews of listing locations using Leaflet, OpenStreetMap tiles, and custom markers.

- **Admin & User Dashboards**  
  - Analytics (monthly earnings, bookings, etc.) with Chart.js.
  - User dashboard for managing listings, bookings, and profile.

- **Support & Contact**  
  - Contact form with Nodemailer integration for support requests.

- **Notifications**  
  - Real-time UI notifications for actions (booking, payment, errors).

---

## 🚀 Tech Stack & Major Libraries

### Frontend

- **React.js** (with Vite)
- **React Router DOM** (routing)
- **Bootstrap 5** (UI framework)
- **Leaflet & react-leaflet** (interactive maps)
- **Axios** (API requests)
- **Cashfree JS SDK** (payment integration)
- **Chart.js & react-chartjs-2** (analytics)
- **FontAwesome** (icons)
- **Context API** (auth, notifications)
- **Custom CSS** (responsive & theme)

### Backend

- **Node.js** & **Express.js** (RESTful API)
- **MongoDB** (Atlas cloud, with Mongoose ODM)
- **Passport.js** & **passport-local-mongoose** (authentication)
- **Cloudinary** & **Multer** (image upload/storage)
- **Nodemailer** (email sending)
- **Cashfree Payment Gateway** (payment APIs)
- **Joi** (input validation)
- **Express-session & connect-mongo** (session storage)
- **CORS, dotenv, axios, method-override** (utilities)
- **Moment.js** (date/time analytics)
- **EJS** (legacy support for server-side rendering, minimal)

---

## 📍 3rd Party APIs & Integrations

- **OpenStreetMap/Nominatim API**: Geocoding for addresses.
- **Cashfree Payment Gateway**: Booking payment flow.
- **Cloudinary**: Storing uploaded images.
- **Gmail SMTP (Nodemailer)**: Sending support/contact/host emails.

---

## 🗂️ Folder Structure

```
WanderLust-MERN/
├── client/         # React frontend (Vite, src/pages, src/components, assets, context)
├── server/         # Express backend (routes, controllers, models, config)
├── public/         # Static files
├── .env.example    # Example environment config
```

---

## 🛠️ Getting Started

### Prerequisites

- Node.js (v14+)
- npm
- MongoDB Atlas or local instance
- Cloudinary account (for images)
- Cashfree developer account (for payments)
- Gmail account (for Nodemailer)

### Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/gundellyvamshiyadav/WanderLust-MERN.git
   cd WanderLust-MERN
   ```

2. **Install dependencies**
   ```bash
   cd client
   npm install
   cd ../server
   npm install
   ```

3. **Configure environment variables**

   - Copy `.env.example` to `.env` in `/server` and set:
     ```
     ATLASDB_URL=your_mongodb_atlas_connection
     SECRET=your_session_secret
     CLOUDINARY_CLOUD_NAME=your_cloud_name
     CLOUDINARY_API_KEY=your_api_key
     CLOUDINARY_API_SECRET=your_api_secret
     EMAIL_USER=your_gmail_address
     EMAIL_PASS=your_gmail_app_password
     CASHFREE_APP_ID=your_cashfree_app_id
     CASHFREE_SECRET_KEY=your_cashfree_secret
     CASHFREE_MODE=TEST
     CASHFREE_API_URL=https://sandbox.cashfree.com/pg
     FRONTEND_URL=http://localhost:5173
     ```

---

### Running Locally

**Start the frontend:**
```bash
cd client
npm run dev
```

**Start the backend:**
```bash
cd server
nodemon app.js
# or
node app.js
```
- The frontend runs on [http://localhost:5173](http://localhost:5173)
- The backend runs on [http://localhost:8080](http://localhost:8080)

---

## 🎯 Key Functionalities & Libraries Used

- **Authentication:** Passport.js, express-session, JWT, bcrypt
- **Payments:** Cashfree (server + client integration)
- **Maps:** Leaflet, react-leaflet, OpenStreetMap
- **Image Upload:** Multer, Cloudinary
- **Email:** Nodemailer (contact/support & host inquiry)
- **Analytics:** Chart.js, moment.js
- **Reviews:** CRUD with user verification
- **Filters:** Custom JS & React (filter bar, amenities, price, etc.)
- **Notifications:** React context, toasts, and alert UI
- **UI/UX:** Bootstrap, FontAwesome, custom responsive CSS
- **API/HTTP:** Axios for all requests

---

## 🤝 Contributing

Contributions, ideas, and feedback are welcome! Please open an issue or pull request.

---

## 👤 Author

Created and maintained by [Gundelly Vamshi Yadav](https://github.com/gundellyvamshiyadav).

---
