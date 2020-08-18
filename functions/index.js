/* eslint-disable promise/always-return */
// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access Cloud Firestore.
var admin = require('firebase-admin');
// var user = require('./user')
const serviceAccount = require('D:/UADE/PFI/Travlr/service-key.json');

// Initialize Admin SDK
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  // credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://travlr-61d7f.firebaseio.com'
});

var firebase = require ('firebase')
// Initialize default app
// Retrieve your own options values by adding a web app on
// https://console.firebase.google.com
firebase.initializeApp({
  projectId: 'travlr-61d7f',
  appId: '1:86329584280:web:19ac31cf1bccce32313eed',
  databaseURL: 'https://travlr-61d7f.firebaseio.com',
  storageBucket: 'travlr-61d7f.appspot.com',
  locationId: 'us-east1',
  apiKey: 'AIzaSyC3LO_w5TGOUYTG4hLASD6fR7Y1zGRPH7I',
  authDomain: 'travlr-61d7f.firebaseapp.com',
  messagingSenderId: '86329584280',
  measurementId: 'G-NFSKTEG1GC'
});

// TODO Remove example functions after other functions are coded
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info('Hello logs!', {structuredData: true});
  response.send('Hello from Firebase!');
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
var db = admin.firestore();
var validator = require('validator');

exports.createUser = functions.https.onRequest((req, res) => {
  errors = []
  if (!req.body.email || !validator.isEmail(req.body.email) || validator.isEmpty(req.body.email)) {
    errors.push({code: 'invalid', field: 'email', message: 'Invalid email'})
  }
  if (!req.body.firstName ||validator.isEmpty(req.body.firstName)) {
    errors.push({code: 'required', field: 'firstName', message: 'First name is required'})
  }
  if (!req.body.lastName ||validator.isEmpty(req.body.lastName)) {
    errors.push({code: 'required', field: 'lastName', message: 'First name is required'})
  }
  if (errors.length > 0) {
    res.status(400).send(errors)
  }
  const user = {
    email: req.body.email,
    emailVerified: false,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    disabled: false,
    photoURL: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
  }
  admin.auth().createUser(user)
    .then(userRecord => {
      console.log('Successfully created new user:', userRecord.uid)
      delete user.password
      db.collection('users').doc(userRecord.uid).set(user)
      res.status(200).send(user)
    })
    .catch(error => {
      console.log('Error creating new user:', error)
      res.status(500).send(error)
    });
  }
)

exports.logIn = functions.https.onRequest((req, res) => {
  errors = []
  if (!req.body.email || !validator.isEmail(req.body.email) || validator.isEmpty(req.body.email)) {
    errors.push({code: 'invalid', field: 'email', message: 'Invalid email'})
  }
  if (errors.length > 0) {
    res.status(400).send(errors)
  }
  firebase.auth().signInWithEmailAndPassword(req.body.email, req.body.password)
    .then(userCredentials => {
      console.log('Successfully logged in:', userCredentials)
      res.status(200).send(userCredentials)
    })
    .catch(error => {
      console.log('Error logging in user:', error)
      res.status(500).send(error)
    })
  }
)

// Middleware
// app.use((err, req, res, next) => {
//   console.error(err.message); // Log error message in our server's console
//   if (!err.statusCode) err.statusCode = 500; // If err has no specified error code, set error code to 'Internal Server Error (500)'
//   res.status(err.statusCode).send(err.message); // All HTTP requests must have a response, so let's send back an error with its status code and message
// });

// app.get((req, res, next) => {
//   let err = new Error('Page Not Found');
//   err.statusCode = 404;
//   next(err);
// });













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
