const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware");
const Listing = require("../models/listing");
const Booking = require("../models/bookings");
const moment = require("moment"); 


router.get("/", isLoggedIn, async (req, res) => {
    try {
        const userId = req.user._id;

        const userListings = await Listing.find({ owner: userId }).select('_id');
        const userHasListings = userListings.length > 0;
        const userListingIds = userListings.map(l => l._id);

        let dashboardData = {
            user: { 
                username: req.user.username,
                email: req.user.email,
                phone: req.user.phone,
                profilePicture: req.user.profilePicture,
            },
            userHasListings,
            bookings: [], 
        };

        if (userHasListings) {
            const receivedBookings = await Booking.find({ listing: { $in: userListingIds } })
                .populate('user', 'username')
                .populate('listing', 'title') 
                .sort({ createdAt: -1 });

            dashboardData.bookings = receivedBookings.slice(0, 10); 

            dashboardData.totalListings = userListingIds.length;
            dashboardData.totalReceivedBookings = receivedBookings.length;
            dashboardData.totalEarnings = receivedBookings
                .filter(b => b.status === 'Booked' || b.status === 'Completed')
                .reduce((sum, b) => sum + b.totalPrice, 0);

            const twelveMonthsAgo = moment().subtract(11, 'months').startOf('month');
            const monthLabels = Array(12).fill(0).map((_, i) => moment().subtract(11 - i, 'months').format('MMM \'YY'));
            const monthEarnings = Array(12).fill(0);
            
            receivedBookings
                .filter(b => (b.status === 'Booked' || b.status === 'Completed') && moment(b.createdAt).isAfter(twelveMonthsAgo))
                .forEach(booking => {
                    const monthIndex = moment(booking.createdAt).diff(twelveMonthsAgo, 'months');
                    if (monthIndex >= 0 && monthIndex < 12) {
                        monthEarnings[monthIndex] += booking.totalPrice;
                    }
                });

            const statusCounts = receivedBookings.reduce((acc, booking) => {
                const status = booking.status.toLowerCase();
                if (status.includes('book')) acc.booked++;
                else if (status.includes('pend')) acc.pending++;
                else if (status.includes('cancel')) acc.cancelled++;
                return acc;
            }, { booked: 0, pending: 0, cancelled: 0 });

            dashboardData.chartData = {
                monthlyEarnings: { labels: monthLabels, data: monthEarnings },
                bookingStatus: { 
                    labels: ['Booked', 'Pending', 'Cancelled'], 
                    data: [statusCounts.booked, statusCounts.pending, statusCounts.cancelled] 
                }
            };

        } else {
            const myBookings = await Booking.find({ user: userId })
                .populate('listing', 'title')
                .sort({ createdAt: -1 });
            dashboardData.bookings = myBookings;
        }

        res.status(200).json(dashboardData);

    } catch (err) {
        console.error("Error loading dashboard data:", err);
        res.status(500).json({ message: "An error occurred while loading your dashboard." });
    }
});

module.exports = router;