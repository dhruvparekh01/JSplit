const express = require("express");
const firebase = require("firebase");
const bodyParser = require("body-parser");
const hbs = require("hbs");

const port = process.env.PORT || 8000;
const path = require("path");

var app = express();

app.use(express.static(path.join(__dirname, "/public")));

var admin = require("firebase-admin");

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

app.get("/group/:page", (request, response) => {
  const id = request.params.page;
  console.log(id);

  db.collection('groups').doc(id).get()  // get the group that the url is pointing to
  .then(doc => {
    if (!doc.exists)
    {
      response.render("404.hbs");  // if the group does not exists, show a 404 page
    }
    else
    {
      var member_ids = doc.data().Members;  // get the array of group members (consists of their uids)
      var members = {};  // an object to return to the client containing all the group members' name and uids
      // var i;
      // var a = this;
      // console.log("This is "+a);

      for(i=0;i<member_ids.length;i++)  // for loop to get the corresponding name sof all the members in the group based on their ids
      {
        var ref = db.collection('users');

        var queryRef = ref.where('UID', '==', member_ids[i]);  // query to get user whose uid is the same as member_ids[i]

        // var fuck="";

        // function setVar(v1, v2)
        // {
        //   a.members[v1] = v2;
        //   console.log(members);
        // }

        queryRef.get()
        .then(snapshot => {
          snapshot.forEach(doc =>{
            console.log(doc.id, '=>', doc.data());  // got all the details of the current group member
            // TODO get this info into the members variable which is in the outer scope
            // setVar(doc.data().Name, doc.id);
          })
        })
      }
      console.log(members);  // members is empty for now
      response.render("test.hbs", {
        grp: doc.data().Group_name,
        member: members
      })
    }
  })

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
        db.collection("users").doc(firebase.auth().currentUser.uid)
          .set({
            Name: name,
            Email: email,
            UID: firebase.auth().currentUser.uid,
            Groups: []
          });
          // .then(function(docRef) {
          //   console.log("Document written with ID: ", docRef.id);
          //   // var uid = docRef.id;
          //   // db.collection("users").doc(docRef.id).update({
          //   //   UID: uid
          //   })

            /* If firebase Authentication is successful, make a table for the user.
          The name of the table is the user's email. This table represents the
          user's contact list. Add a demo user to this table.*/
            db.collection("balances")
              .doc(firebase.auth().currentUser.uid)
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
      }
      // .catch(function(error) {
      //   var errorCode = error.code;
      //   var errorMessage = error.message;
      //   console.log(errorMessage);

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
      db.collection("users")
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            if (doc.data().Email === email) {
              const grps = doc.data().Groups;  // an array of group ids that the authenticated user is associated with
              var grpNames = {};  // a dictionary that will store the group names and ids of the current user
              var i;

              //TODO following is a very unoptimized code... optimize it
              db.collection("groups")
                .get()
                .then(querySnapshot => {
                  querySnapshot.forEach(doc => {
                    for(i=0;i<grps.length;i++)
                    {
                      if(grps[i] === doc.id)
                      {
                        // var object = {};
                        grpNames[doc.data().Group_name] = doc.id;
                        // console.log(object);
                        // grpNames.push(object);
                      }
                    }
                  })
                  // the above code populated the dictionary of group name: group id pairs

                  response.render("user.hbs", {
                    user: email,
                    groups: grpNames
                  });
                })
            }
          });
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
      Members: [firebase.auth().currentUser.uid]
    })
    .then(function(docRef) {
      console.log("Document written with ID: ", docRef.id);
      var grpid = docRef.id;
      // refresh page to get new group?
      // setTimeout(res.redirect(req.originalUrl, 2000));

      db.collection("users")  // update the users table, add the new group to the groups array of the current user
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            // console.log(doc.data().Name)
            if (doc.data().Email === firebase.auth().currentUser.email) {
              const new_arr = doc.data().Groups;
              new_arr.push(grpid);
              db.collection("users")
                .doc(doc.id)
                .update({
                  Groups: new_arr
                });
              console.log(doc.data().Groups);
              // response.render("user.hbs", {
              //   groups: doc.data().Groups
              // });
            }
          });
        });
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });
  // db.collection('users').doc(firebase.auth().currentUser.uid).update({
  //
  // })
});

//start server
app.use(express.static(__dirname));
var server = app.listen(process.env.PORT || 8000, () => {
  console.log("server is listening on port", server.address().port);
});
