=========================================================
                   RIDE BOOKING APP (2025)
=========================================================

PROJECT OVERVIEW:
-----------------
This is a full-stack transportation and ride-booking application. It allows users to book rides, track their transportation in real-time, and make online payments. The app is built using React Native for both mobile and web applications, integrating Stripe for secure payments, AWS Secrets Manager for storing sensitive data, and NeonDB (PostgreSQL) as the database. The app also features extensive testing with Jest for unit tests and Detox for end-to-end mobile testing.

KEY FEATURES:
-------------
- User Registration and Authentication
- Ride Booking and Real-Time Tracking
- Secure Payment Integration via Stripe
- AWS Secrets Manager for Secure Data Management
- Database Storage with NeonDB (PostgreSQL)
- Cross-Platform Mobile App built with React Native
- Unit Testing with Jest and End-to-End Testing with Detox

TECHNOLOGIES USED:
-----------------
Frontend:
- React Native (for mobile apps)
- React.js (for web app)
- Redux (state management)

Backend:

- Stripe API for payment integration
- AWS SDK for interaction with AWS Secrets Manager

Database:
- NeonDB (PostgreSQL)
- Sequelize ORM for database interactions


Testing:
- Jest (for unit testing)
- Detox (for end-to-end testing)

HOW TO RUN THE PROJECT LOCALLY:
------------------------------
1. Clone the Repository:
   $ git clone https://github.com/AliAlhadiAk/ZipPay.git
 

2. Install Dependencies:

   Frontend (React Native):
   $ cd mobile
   $ npm install

 

3. Set Up Environment Variables:
   - Create a `.env` file in both the `mobile` and `server` directories.
   - Add the following environment variables:

   Frontend (.env for React Native):
   -----------------------------------
   STRIPE_PUBLISHABLE_KEY=your-stripe-public-key
   AWS_SECRET_ARN=your-aws-secret-arn

   Backend (.env for API):
   --------------------------------
   STRIPE_SECRET_KEY=your-stripe-secret-key
   AWS_SECRET_ARN=your-aws-secret-arn
   NEON_DB_URL=your-neon-db-connection-url

4. Configure AWS Secrets Manager:
   - Log into your AWS Console and create a new secret to store your sensitive data like Stripe keys and database credentials.
   - Make sure your backend accesses the secrets securely through the AWS SDK.



6. Run the Frontend App:
   For Android:
   $ cd mobile
   $ npx react-native run-android

   For iOS:
   $ cd mobile
   $ npx react-native run-ios

7. Run Tests:
   Unit Tests (Jest):
   $ npm test

   End-to-End Tests (Detox):
   $ detox test

KEY FEATURES IN DETAIL:
----------------------
1. Stripe Payment Integration:
   - Stripe is used for secure payment processing. The backend creates a payment intent and the client-side handles the client secret.
   - Example for creating a payment intent:

  

2. AWS Secrets Manager Integration:
   - Secrets Manager is used to securely store Stripe API keys, database credentials, and other sensitive data. This ensures secure access without hardcoding sensitive information in the codebase.



TESTING & QUALITY ASSURANCE:
---------------------------
1. Jest (Unit Testing):
   - The app has unit tests for core functionality such as payment processing, ride booking logic, and API route handling.

2. Detox (End-to-End Testing):
   - Detox is used to test the mobile app, simulating real user interactions to ensure a smooth user experience on both Android and iOS.

DEPLOYMENT:
-----------
- Mobile App: Publish the React Native app to the Google Play Store and Apple App Store.


CONCLUSION:
-----------
This project demonstrates a full-stack solution that integrates payment systems (Stripe), secure data management (AWS Secrets Manager), and real-time ride tracking. By leveraging modern technologies such as **React Native**, **AWS**, **NeonDB**, and **Stripe**, the app delivers a secure and efficient platform for transportation and ride-booking services.

CONTACT & CONNECT:
-------------------
If you have any questions or want to connect further:

- LinkedIn Profile: [LinkedIn URL]
- GitHub Profile: https://github.com/AliAlhadiAk
- Email: alialhadiabokhalil@gmail.com

=========================================================
