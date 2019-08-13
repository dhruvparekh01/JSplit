const test = require("firebase-functions-test")(
  {
    databaseURL: "https://jsplit-34d67.firebaseio.com",
    projectId: "jsplit-34d67",
    storageBucket: "jsplit-34d67.appspot.com"
  },
  "serviceAccountKey.json"
);
const firebase = require("firebase");
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
var assert = require("assert");

/*
describe("User Signup Tests", function() {
  var email = "55testynewuser@testing.ohyes";
  var password = "testing123";
  var name = "Tester Jim";

  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(function() {
      db.collection("users")
        .doc(firebase.auth().currentUser.uid)
        .set({
          Name: name,
          Email: email,
          UID: firebase.auth().currentUser.uid,
          Groups: []
        });
    });
  it("should return username", function() {
    assert.equals(Error, Error);
  });
});
*/

// testing out some tests
describe("Array", function() {
  describe("#indexOf()", function() {
    it("should return -1 when the value is not present", function() {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
});

describe("Basic Mocha String Test", function() {
  it("should return number of charachters in a string", function() {
    assert.equal("Hello".length, 5);
  });
  it("should return first charachter of the string", function() {
    assert.equal("Hello".charAt(0), "H");
  });
});

describe("Jimbob is the best Bob", function() {
  it("should return yes", function() {
    assert.equal("yes", "yes");
  });
});
