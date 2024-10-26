#Voting System - Group Project Submission

Project Overview
This project is a university election management system created using React and Firebase. It enables students to vote for candidates in real-time, with votes stored and tracked in Firebase Firestore. The system includes functionality for managing elections, candidates, and user votes.

Project Details
Group Number: Group_15 

Technologies Used
Front-End Framework: React (Version: 18.x)
Database: Firebase Firestore (NoSQL)
Authentication: Firebase Authentication (for user sign-in and access control)
Hosting: Firebase Hosting
Storage: Firebase Storage (for candidate images)

Firebase Project Setup Instructions
Firebase Setup:
Go to Firebase Console and create a new project or select an existing one.
Enable Firestore for storing collections (elections, candidates, votes).
Enable Firebase Storage for storing candidate images.
Enable Firebase Authentication if required for user access control.
Firestore Database Structure
Collection: elections

This collection holds information about each election in the system.

Document ID: Unique ID for each election (e.g., election2024).
Fields:
name (String): The name of the election (e.g., "Student Council Election 2024").
date (Timestamp): The date and time of the election.
active (Boolean): Indicates if the election is currently active. Only one election should be active at any time.
Collection: candidates

This collection holds information about each candidate running in an election.

Document ID: Unique ID for each candidate (e.g., candidate123).
Fields:
name (String): The candidate’s full name.
party (String): The candidate’s political party or affiliation.
photoUrl (String): URL pointing to the candidate’s photo stored in Firebase Storage.
votes (Integer): The current vote count for the candidate.
category (String): The position the candidate is running for (e.g., "President").
Collection: votes

This collection tracks individual votes submitted by users.

Document ID: Unique ID for each vote record (generated automatically).
Fields:
electionId (String): The ID of the election associated with the vote.
candidateId (String): The ID of the candidate who received the vote.
userId (String): The ID of the user who submitted the vote (optional, if tracking individual voters).
timestamp (Timestamp): The date and time when the vote was submitted.
Firebase Storage Structure
Bucket: candidate_images

This bucket holds the profile images of each candidate, which are uploaded and retrieved by their photoUrl in the candidates collection.

Folder Structure:
candidate_images/<electionId>/<candidateId>.jpg (e.g., candidate_images/election2024/candidate123.jpg)

Project Configuration
Firebase Configuration:
In the src directory, create a firebaseConfig.js file or use environment variables to securely store Firebase credentials.
Example Configuration:
javascript
Copy code
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

Running the Project
Install Dependencies: Run npm install to install all necessary packages.
Start the Application: Use npm start to run the app locally.
Access: Open http://localhost:3000 in a web browser to view the app.
Hosting and Deployment
Firebase Hosting:
Run firebase login and firebase init hosting to set up Firebase Hosting.
Use firebase deploy to deploy the application.
