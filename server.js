const express = require("express");
const firebase = require("firebase");
const bodyParser = require("body-parser");
const hbs = require("hbs");

const port = process.env.PORT || 8000;
const path = require("path");

var app = express();

app.use(express.static(path.join(__dirname, "/public")));

/*
app.set('view engine', 'hbs');
app.use('/', express.static(__dirname));

//HBS
hbs.registerPartials(path.join(__dirname, '/views/partials'));
*/

//Body Parser

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

/**
 * Firebase Stuff
 */
var cur_user;

const a = require("firebase/storage");
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

/**
 * Endpoints
 */
app.get("/", (request, response) => {
  response.render("index.hbs", {
    title: "Landing Page"
  });
});

app.get("/signup", (request, response) => {
  response.render("signup.hbs", {
    title: "Sign Up"
  });
});

app.get("/signin", (request, response) => {
  response.render("signin.hbs", {
    title: "Sign In"
  });
});

app.get("/addGrp", (req, res) => {
  res.render("addGrp.hbs", {
    title: "Add Group",
    user: firebase.auth().currentUser.email
  });
});

app.post("/newUser", (request, response) => {
  /* Function to add a new user */
  var email = request.body.email;
  var password1 = request.body.password1;
  var password2 = request.body.password2;
  var name = request.body.name;
  cur_user = email;

  if (password1 === password2) {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password1) // firebase Authentication
      .then(function() {
        /* Add the user to the "users" table*/
        db.collection("users")
          .add({
            Name: name,
            Email: email,
            UID: firebase.auth().currentUser.uid,
            Groups: []
          })
          .then(function(docRef) {
            console.log("Document written with ID: ", docRef.id);
            var uid = firebase.auth().currentUser.uid;
            console.log(uid);

            /* If firebase Authentication is successful, make a table for the user.
          The name of the table is the user's email. This table represents the
          user's contact list. Add a demo user to this table.*/
            db.collection("balances")
              .doc(uid)
              .set({
                placeholder: "you need contacts"
              })
              .then(function(docRef) {
                // console.log("Document written with ID: ", docRef.id);
              })
              .catch(function(error) {
                console.error("Error adding document: ", error);
              });
          })
          .catch(function(error) {
            console.error("Error adding document: ", error);
          });

        //Now render the custom page created for the user
        response.render("user.hbs", {});
      })
      .catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage);
      });
  }
});

// Function for Signing in the returning users
app.post("/retUser", (request, response) => {
  var email = request.body.email;
  var password1 = request.body.password1;
  cur_user = email; // The current user variable maintains the email of the
  // user signing for further functions

  firebase
    .auth()
    .signInWithEmailAndPassword(email, password1) // firebase sign in
    .then(function() {
      email = firebase.auth().currentUser.email; // get logged in user's email
      response.render("user.hbs", {
        user: email
      });
    })
    .catch(function(error) {
      response.render("login.hbs", {
        message: error.message
      });
      console.log(
        "Error with code:",
        error.code,
        "\nWith message:",
        error.message
      );
    });
});

// Function to add new people in the contact list
app.post("/search", (request, response) => {
  var flag = 0;
  var result = "";

  // console.log('Got email: '+email);
  // var docRef = firebase.firestore().collection("users").doc()
  firebase
    .firestore()
    .collection("users")
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        var email = request.body.user_name; // Get the email of the user to addeds

        if (email == doc.data().Email) {
          // If a matching email is found in the database
          var uid1 = firebase.auth().currentUser.uid;
          var uid2 = doc.data().UID;

          db.collection("balances")
            .doc(uid1)
            .update({
              // adding the found user to contacts
              [uid2]: 0
            })
            .then(function(docRef) {
              result = doc.data().Name + "has been added to your contacts.";
              flag = 1;
            })
            .catch(function(error) {
              console.error("Error adding document: ", error);
            });

          db.collection("balances")
            .doc(uid2)
            .update({
              // adding the found user to contacts
              [uid1]: 0
            })
            .then(function(docRef) {
              result = doc.data().Name + "has been added to your contacts.";
              flag = 1;
            })
            .catch(function(error) {
              console.error("Error adding document: ", error);
            });
        }
      });

      // email = firebase.auth().currentUser.email;  // get logged in user's email

      response.render("user.hbs", {
        // user: email,
        result: result
      });
    });
});

app.post("/addGrp", (request, response) => {
  var name = request.body.grp_name;
  var cur_user = firebase.auth().currentUser.Email;

  db.collection("groups")
    .add({
      Group_name: name,
      Member1: firebase.auth().currentUser.uid
    })
    .then(function(docRef) {
      console.log("Document written with ID: ", docRef.id);
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });

  db.collection("users")
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        if (doc.data().Email === cur_user) {
          console.log(doc.data());
        }
      });
    });
  // db.collection('users').doc(firebase.auth().currentUser.uid).update({
  //
  // })

  response.render("user.hbs");
});

//start server
app.use(express.static(__dirname));
var server = app.listen(process.env.PORT || 8000, () => {
  console.log("server is listening on port", server.address().port);
});
