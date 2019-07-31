const express = require('express');
var app = express();
const hbs = require('hbs');
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/views'));

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

//404 page
// app.get('*', (req, res) => {
//     res.status(404);
//     res.render('404.hbs', {
//         title: '404',
//         error: 'Page does not exist.'
//     });
// });

//start server
app.use(express.static(__dirname));
var server = app.listen(process.env.PORT || 8000, () => {
    console.log('server is listening on port', server.address().port);
});
