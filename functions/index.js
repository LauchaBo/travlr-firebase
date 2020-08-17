// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access Cloud Firestore.
var admin = require("firebase-admin");
// var user = require('./user')

// TODO delete if not used
// var serviceAccount = require("D:/UADE/PFI/Travlr/service-key.json");

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://travlr-61d7f.firebaseio.com"
});

// TODO Remove example functions after other functions are coded
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

// Take the text parameter passed to this HTTP endpoint and insert it into 
// Cloud Firestore under the path /messages/:documentId/original
exports.addMessage = functions.https.onRequest(async (req, res) => {
  // Grab the text parameter.
  const original = req.query.text;
  // Push the new message into Cloud Firestore using the Firebase Admin SDK.
  const writeResult = await admin.firestore().collection('messages').add({original: original});
  // Send back a message that we've succesfully written the message
  res.json({result: `Message with ID: ${writeResult.id} added.`});
});

// Listens for new messages added to /messages/:documentId/original and creates an
// uppercase version of the message to /messages/:documentId/uppercase
exports.makeUppercase = functions.firestore.document('/messages/{documentId}')
    .onCreate((snap, context) => {
      // Grab the current value of what was written to Cloud Firestore.
      const original = snap.data().original;

      // Access the parameter `{documentId}` with `context.params`
      functions.logger.log('Uppercasing', context.params.documentId, original);
      
      const uppercase = original.toUpperCase();
      
      // You must return a Promise when performing asynchronous tasks inside a Functions such as
      // writing to Cloud Firestore.
      // Setting an 'uppercase' field in Cloud Firestore document returns a Promise.
      return snap.ref.set({uppercase}, {merge: true});
    });

// USER.JS
var validator = require('validator');

exports.createUser = functions.https.onRequest((req, res) => {
  console.log(req.body)
  console.log(req.body.email)
  if (!validator.isEmail(req.body.email)) {
    throw new Error('Wrong email, queen');
  }
  // const user = {
  //   email: request.email,
  //   emailVerified: false,
  //   password: request.password,
  //   firstName: request.firstName,
  //   lastName: request.lastName,
  //   disabled: false
  // }
  // admin.auth().createUser(user)
  //   .then(userRecord => {
  //     // See the UserRecord reference doc for the contents of userRecord.
  //     console.log('Successfully created new user:', userRecord.uid);
  //     return response.json(userRecord)
  //   })
  //   .catch(error => {
  //     console.log('Error creating new user:', error);
  //   });
  //   return user;
  }
)

// signup de fede --BORRAR--
exports.signUp = (req, res, next) => {
  if (!req.body.firstName) {
    throw errors.badRequestError('Please add first name');
  }
  if (!req.body.lastName) {
    throw errors.badRequestError('Please add last name');
  }
  if (!req.body.email || !req.body.email.endsWith('@garompa.com.ar')) {
    throw errors.badRequestError('Email must be part of desired domain');
  }
  if (!req.body.password || !req.body.password.lenght >= 8 || !req.body.password.match(passwordRegex)) {
    throw errors.badRequestError('Invalid password');
  }
  const user = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: bcryptService.encrypt(req.body.password)
  };
  userService
    .signUp(user)
    .then(u => res.send(u))
    .catch(next);
};
