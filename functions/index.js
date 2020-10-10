var admin = require('firebase-admin');
// var user = require('./user')
// const serviceAccount = require('D:/UADE/PFI/Travlr/service-key.json');

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  // credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://travlr-61d7f.firebaseio.com'
});

var firebase = require ('firebase')
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

// Function imports
const middleware = require('./middleware')
const auth = require('./auth')
const user = require('./user')

exports.middleware = middleware
exports.auth = auth
exports.user = user

// DB TEST
const functions = require('firebase-functions');

exports.dbTest = functions.https.onRequest((req, res) => {
  admin.firestore().collection('users').doc('testtt').set({ test: 'test' })
  res.status(200).send('Todo ok')
})
