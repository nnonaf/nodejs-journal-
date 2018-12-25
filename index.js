require('dotenv').config();

var { isNumber, isString } = require('lodash');
var express = require('express');
var app = express();
var path = require('path');
var expressWs = require('express-ws')(app);
var bodyParser = require('body-parser');
var cors = require('cors');
var useragent = require('express-useragent');
var cookieParser = require('cookie-parser')
// var fileUpload = require('express-fileupload');

var requestIp = require('request-ip');
// var seeder = require('./seeder');
var routes = require('./routes');
// var tasks = require('./tasks');
var mung = require('express-mung');
var { filterProperties } = require('./data/utils');
// app.use(express.static(__dirname + '/public'));

app.use("/", express.static(__dirname + "/public"));
// app.disable('x-powered-by')

app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');
app.set('view engine', 'ejs');
// app.use(express.static(path.join(__dirname, 'public')));


app.use(useragent.express());
app.use(requestIp.mw());
app.use(cors());

app.options("/*", cors());

app.use(bodyParser.urlencoded({
  extended: true
}));




app.use(bodyParser.json());
app.use(cookieParser())

const PORT = process.env.PORT;


//middleware to access response body object
app.use(mung.json(
  function transform(body, req, res) {
    if (isNumber(body)) {
      return res.json(body);
    }
    if (isString(body)) {
      return res.json(body);
    }
    // do something with body
    if (req.user && req.user.isAdmin) {
      return filterProperties(body, (data) => false);
    }
    return filterProperties(body, (data) => {
      if (req.user && data.user && data.user._id) {
        return req.user.id !== String(data.user._id);
      } else if (req.user && data.user) {
        return req.user.id !== String(data.user);
      } else if (req.user && data._id) {
        return req.user.id !== String(data._id);
      }
      return true;
    }, ['password', 'isAdmin', 'documents', 'email', 'contact', 'firstName', 'lastName'], ['password']);
  }
));


// **************** Route definitions start from here *********************
//home



app.get('/login', routes.login.get);
app.get('/signup', routes.user.get);
app.post('/login', routes.auth.login);

//user autentication

app.use(function (req, res, next) {
  if (req.cookies.name === 'undefined') {
    res.redirect('/login')
  }

  next()
})


app.get('/', routes.home.get);


// login

// app.all('/login', routes.auth.login);

// user end points
app.post('/users', routes.user.post);
app.put('/users/:id', routes.auth.verify, routes.user.put);



//settings
app.get('/settings', routes.user.get);





// start web server
console.log(`listening on ${PORT}`);
app.listen(PORT);

module.exports = app;