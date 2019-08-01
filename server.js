const express = require('express');
var app = express();
const hbs = require('hbs');
const bodyParser = require('body-parser');
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/views'));
const firebase = require('firebase');
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
    var email = request.body.email;
    var password1 = request.body.password1;
    var password2 = request.body.password2;
    var name = request.body.name;
    cur_user = email;


    if (password1 === password2)
    {
        firebase.auth().createUserWithEmailAndPassword(email, password1)
        .then(function(){
            db.collection(email).add({
                Name: 'Demo User',
                Email: 'Demo email',
                Balance: 0
            })
            .then(function(docRef) {
                console.log("Document written with ID: ", docRef.id);
            })
            .catch(function(error) {
                console.error("Error adding document: ", error);
            });



            db.collection('all_users').add({
              Name: name,
              Email: email,
            })
            .then(function(docRef) {
              console.log("Document written with ID: ", docRef.id);
            })
            .catch(function(error) {
              console.error("Error adding document: ", error);
            });


            response.render('user.hbs', {
              list: 'No contacts found'
            });
        })
        .catch(function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorMessage);
        });
    }
});


app.post('/retUser', (request, response) => {
    var email = request.body.email;
    var password1 = request.body.password1;
    cur_user = email;

    // console.log('email:' + email + 'Pass' + password1);

          firebase.auth().signInWithEmailAndPassword(email, password1)
          .then(function() {
            var list = ''
            firebase.firestore().collection(cur_user).get().then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                list += doc.data().Name;
                console.log('Friend: '+doc.data().Name)
              });
            });
            console.log(list);
            response.render('user.hbs', {
              list: list
            });
          })
          .catch(function(error){
              res.render('login.hbs', {
                  message: error.message
              });
            console.log("Error with code:", error.code, "\nWith message:", error.message);
          });

});



app.post('/search', (request, response) => {
  var flag = 0
  var result = ''
  var email = request.body.user_name
  var docRef = firebase.firestore().collection("all_users").doc()
  firebase.firestore().collection("all_users").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      console.log(email);
      console.log(doc.data().Email);
      if(email == doc.data().Email)
      {
        console.log("FUCK");
        db.collection(cur_user).add({
          Name: doc.data().Name,
          Email: doc.data().Email,
          Balance: 0
        }).then(function(docRef) {
          result = doc.data().Name + 'has been added to your contacts.';
          flag = 1;
        }).catch(function(error) {
          console.error("Error adding document: ", error);
        });
      }
      });
    });
  // if(flag === 0)
  // {
  //   result = 'Sorry the user cannot be found'
  // }
  var list = []
  firebase.firestore().collection(cur_user).get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      list.push(doc.data().Name)
    });
  });
  console.log(list);


  response.render('user.hbs', {
    list: list,
    result: result
  });
});

//start server
app.use(express.static(__dirname));
var server = app.listen(process.env.PORT || 8000, () => {
    console.log('server is listening on port', server.address().port);
});
