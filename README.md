🍽️ Restaurant Reservation & Review Platform – Backend

This is the backend of a Restaurant Reservation and Review Platform built using Node.js, Express, and MongoDB. It provides APIs for managing restaurants, reservations, reviews, payments, and user authentication.

🚀 Features
🔐 Authentication & Authorization

User registration and login

Secure password hashing using bcrypt

JWT-based authentication

Role-based access (User, Restaurant Owner, Admin)

🧾 Reservation Management

Create reservations (date, time, party size)

Prevent double bookings with availability checks

Update or cancel reservations

Fetch user-specific reservations

⭐ Reviews System

Add reviews with ratings and comments

Upload images for reviews

Edit and delete reviews

Restaurant owners can respond to reviews

🏪 Restaurant Management

Create and manage restaurant listings

Add details:

Name, description

Location

Cuisine types

Price range

Upload restaurant images using Cloudinary

🔍 Search & Filtering

Search restaurants by:

Cuisine

Location

Price range

Advanced filtering support

⏱️ Real-Time Availability Logic

Time-slot based reservation system

Dynamic availability calculation

Prevent overbooking

💳 Payment Integration

Secure payments using Stripe

Payment intent creation

Reservation confirmation after payment

☁️ File Uploads

Image uploads handled via:

Multer

Cloudinary storage

📧 Email Notifications

Send emails using Nodemailer

Reservation confirmations

Cancellation updates

🛠️ Admin Features

Manage users, restaurants, and reviews

Monitor reservations

Moderate platform activity

🧑‍💻 Tech Stack

Backend Framework: Express.js (v5)

Database: MongoDB (Mongoose)

Authentication: JWT + bcrypt

File Upload: Multer + Cloudinary

Payments: Stripe

Email Service: Nodemailer