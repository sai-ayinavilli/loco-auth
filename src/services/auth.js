// auth.js - Authentication Service using Appwrite with Brevo email integration

import { Client, Account, ID, Databases } from 'appwrite';

// Initialize Appwrite Client
const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1') // Replace with your Appwrite endpoint
  .setProject('680a15a400024f3eb17e'); // Replace with your project ID

const account = new Account(client);
const databases = new Databases(client);

// Database and Collection IDs
const DATABASE_ID = '680a15e900160234d5f8';
const USERS_COLLECTION_ID = '680dd95d0015417ec15b';
const OTP_COLLECTION_ID = '680a84370017cb9da7f1';

// Helper function to generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Register user and send verification OTP
export const registerUser = async (email, password, name) => {
  try {
    // Create user account
    const user = await account.create(
      ID.unique(),
      email,
      password,
      name
    );
    
    // Generate OTP
    const otp = generateOTP();
    
    // Store OTP in database with expiration (10 minutes)
    const expiryTime = new Date();
    expiryTime.setMinutes(expiryTime.getMinutes() + 10);
    
    await databases.createDocument(
      DATABASE_ID,
      OTP_COLLECTION_ID,
      ID.unique(),
      {
        userId: user.$id,
        email: email,
        otp: otp,
        verified: false,
        expiresAt: expiryTime.toISOString()
      }
    );
    
    // Create user document in users collection (unverified)
    await databases.createDocument(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      user.$id,
      {
        email: email,
        name: name,
        verified: false,
        createdAt: new Date().toISOString()
      }
    );
    
    // Send OTP to user's email
    await sendVerificationEmail(email, otp, name);
    
    return { success: true, userId: user.$id };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: error.message };
  }
};

// Function to send verification email with OTP using Brevo
export const sendVerificationEmail = async (email, otp, name) => {
  try {
    // Call Appwrite Function to send email via Brevo
    const response = await client.functions.createExecution(
      '680ddd7f00387d1392d1', // Replace with your function ID
      JSON.stringify({
        to: email,
        from: 'support@locoai.tech',
        subject: 'Verify Your Email - LocoAI',
        name: name,
        otp: otp
      })
    );
    
    if (!response.responseStatusCode === 200 || !response.response.success) {
      throw new Error(response.response?.message || 'Failed to send email');
    }
    
    return { success: true };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error: error.message };
  }
};

