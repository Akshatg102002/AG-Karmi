/**
 * =============================================================================
 * SECURE BACKEND USER DELETION FUNCTION (EXAMPLE)
 * =============================================================================
 * This file is an example of a serverless function that securely deletes a
 * Firebase user and their associated data from Firestore. This is a privileged
 * operation that MUST be handled on a backend using the Firebase Admin SDK.
 *
 * HOW TO USE THIS:
 * 1.  Set up Firebase Cloud Functions in your project.
 * 2.  Install the required dependencies: `npm install firebase-admin firebase-functions`
 * 3.  Deploy this function.
 * 4.  This function creates an API endpoint at `/api/delete-user` that your
 *     frontend application can call.
 * =============================================================================
 */

const admin = require('firebase-admin');
const functions = require('firebase-functions');

// Initialize the Admin SDK. Your service account credentials will be
// automatically available in the Cloud Functions environment.
admin.initializeApp();

exports.deleteUser = functions.https.onRequest(async (req, res) => {
  // Allow CORS for your frontend application
  res.set('Access-Control-Allow-Origin', '*'); // In production, restrict this to your domain
  res.set('Access-Control-Allow-Methods', 'POST');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    // Pre-flight request
    res.status(204).send('');
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  try {
    const { uid } = req.body;
    if (!uid) {
      return res.status(400).send({ message: 'User ID (uid) is required.' });
    }

    const db = admin.firestore();

    // 1. Delete Firebase Auth user
    await admin.auth().deleteUser(uid);

    // 2. Delete user document from 'users' collection
    const userDocRef = db.collection('users').doc(uid);
    await userDocRef.delete();

    // 3. Find and delete the associated employee document (if it exists)
    const employeeQuery = db.collection('employees').where('userId', '==', uid).limit(1);
    const employeeSnapshot = await employeeQuery.get();
    if (!employeeSnapshot.empty) {
      const employeeDoc = employeeSnapshot.docs[0];
      await employeeDoc.ref.delete();
    }

    console.log(`Successfully deleted user ${uid} and all associated data.`);
    return res.status(200).send({ message: 'User deleted successfully.' });

  } catch (error) {
    console.error('Error deleting user:', error);
    if (error.code === 'auth/user-not-found') {
        return res.status(404).send({ message: 'User not found in Firebase Authentication.' });
    }
    return res.status(500).send({ message: 'Failed to delete user.' });
  }
});
