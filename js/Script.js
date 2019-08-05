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


function showContacts(email)
{
  var user = email.trim();
  console.log(user);
  db.collection(user).get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      document.getElementById('contacts').innerHTML += doc.data().Name + '\n';
    });
  });
}
