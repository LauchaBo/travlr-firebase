
const functions = require('firebase-functions');
var admin = require('firebase-admin');
var firebase = require ('firebase')

var db = admin.firestore();
var validator = require('validator');

exports.create = functions.https.onRequest((req, res) => {
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
      return
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
      return
    })
    .catch(error => {
      console.log('Error logging in user:', error)
      res.status(500).send(error)
    })
  }
)

exports.getData = functions.https.onRequest((req, res) => {
  db.collection('users').doc(req.body.uid).get()
    .then(snapshot => {
      if (!snapshot.exists) {
        console.log('No such document!');
        res.status(404).send('Document not found.')
      } else {
        console.log('Document data:', snapshot.data());
        res.status(200).send(snapshot.data())
      }
      return
    })
    .catch(error => {
      res.status(500).send(error)
    })
})
