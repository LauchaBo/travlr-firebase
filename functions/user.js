
const functions = require('firebase-functions');
var admin = require('firebase-admin');
var firebase = require ('firebase')
var middleware = require('./middleware')
const express = require('express');

var db = admin.firestore();
var validator = require('validator');

const app = express();

app.use(middleware.validateToken)

app.get('/getUser', (req, res) => {
  db.collection('users').doc(req.user.user_id).get()
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

app.put('/editUser', (req, res) => {
  db.collection('users').doc(req.user.user_id).set(req.body, { merge: true })
    .then(() => {
      res.status(200).send(req.body)
      return
    })
    .catch(error => {
      res.status(500).send(error)
    })
})

exports.user = functions.https.onRequest(app);
