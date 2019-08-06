const express = require('express');
const firebase = require('firebase');
const hbs = require('hbs');
const bodyParser = require('body-parser');

var app = express();

app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/views'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

var cur_user;


const a = require('firebase/storage');
var config = {
  apiKey: "AIzaSyADqxirXJzsVOo2b-U_Bb1wfAcDgRMmcNw",
  authDomain: "jsplit-34d67.firebaseapp.com",
  databaseURL: "https://jsplit-34d67.firebaseio.com",
  projectId: "jsplit-34d67",
  storageBucket: "",
  messagingSenderId: "515865367088",
  appId: "1:515865367088:web:e455c8fdb0435044"
};

var fb = firebase.initializeApp(config);
var db = firebase.firestore();

//home page
app.get('/', (req, res) => {
  res.render('index.hbs', {
    title: 'Home'
  });
});

app.get('/signup', (req, res) => {
  res.render('signup.hbs', {
    title: 'Sign Up'
  });
});

app.get('/signin', (req, res) => {
  res.render('signin.hbs', {
    title: 'Sign IN'
  });
});

app.post('/newUser', (request, response) => {
  /* Function to add a new user */
  var email = request.body.email;
  var password1 = request.body.password1;
  var password2 = request.body.password2;
  var name = request.body.name;
  cur_user = email;


  if (password1 === password2) {
    firebase.auth().createUserWithEmailAndPassword(email, password1)  // firebase Authentication
      .then(function () {
        /* If firebase Authentication is successful, make a table for the user.
        The name of the table is the user's email. This table represents the
        user's contact list. Add a demo user to this table.*/
        db.collection(email).add({
            Name: 'Demo User',
            Email: 'Demo email',
            Balance: 0
          })
          .then(function (docRef) {
            console.log("Document written with ID: ", docRef.id);
          })
          .catch(function (error) {
            console.error("Error adding document: ", error);
          });


          /* Add the user to the "all_users" table*/
        db.collection('all_users').add({
            Name: name,
            Email: email,
          })
          .then(function (docRef) {
            console.log("Document written with ID: ", docRef.id);
          })
          .catch(function (error) {
            console.error("Error adding document: ", error);
          });


          //Now render the custom page created for the user
        response.render('user.hbs', {
        });
      })
      .catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage);
      });
  }
});


// Function for Signing in the returning users
app.post('/retUser', (request, response) => {
  var email = request.body.email;
  var password1 = request.body.password1;
  cur_user = email;  // The current user variable maintains the email of the
                    // user signing for further functions

  firebase.auth().signInWithEmailAndPassword(email, password1)  // firebase sign in
    .then(function () {
      email = firebase.auth().currentUser.email;  // get logged in user's email
      response.render('user.hbs', {
        user: email
      });
    })
    .catch(function (error) {
      response.render('login.hbs', {
        message: error.message
      });
      console.log("Error with code:", error.code, "\nWith message:", error.message);
    });

});



// Function to add new people in the contact list
app.post('/search', (request, response) => {
  var flag = 0
  var result = ''

  // console.log('Got email: '+email);
  var docRef = firebase.firestore().collection("all_users").doc()
  firebase.firestore().collection("all_users").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      var email = request.body.user_name  // Get the email of the user to addeds

      if (email == doc.data().Email)  // If a matching email is found in the database
      {
        db.collection(cur_user).add({
          // adding the found user to contacts
          Name: doc.data().Name,
          Email: doc.data().Email,
          Balance: 0
        }).then(function (docRef) {
          result = doc.data().Name + 'has been added to your contacts.';
          flag = 1;
        }).catch(function (error) {
          console.error("Error adding document: ", error);
        });
      }
    });
  });

  email = firebase.auth().currentUser.email;  // get logged in user's email

  response.render('user.hbs', {
    user: email,
    result: result
  });
});

//start server
app.use(express.static(__dirname));
var server = app.listen(process.env.PORT || 8000, () => {
  console.log('server is listening on port', server.address().port);
});
