const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const serviceAccount = require("../chatapp-d63d5-firebase-adminsdk-edgnn-8cf393203d.json");

// Initialize Firebase Admin SDK
const app = initializeApp({
  credential: cert(serviceAccount),
});

// Initialize Firestore and get a reference to the service
const db = getFirestore(app);

module.exports = db;
