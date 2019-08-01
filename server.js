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


// const a = require('firebase/storage');
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
// var db = firebase.firestore();

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

app.post('/newUser', (request, response) => {
    var email = request.body.email;
    var password1 = request.body.password1;
    var password2 = request.body.password2;

    console.log('email:' + email + 'Pass' + password1);

    if (password1 === password2) {
        firebase.auth().createUserWithEmailAndPassword(email, password1)
        .then(function() {
          response.render('user.hbs', {
          })
        })
        .catch(function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorMessage);
        });
    }
});
//start server
app.use(express.static(__dirname));
var server = app.listen(process.env.PORT || 8000, () => {
    console.log('server is listening on port', server.address().port);
});
