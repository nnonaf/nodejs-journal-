var mongoose = require('mongoose');

var host = process.env.DB_HOST;
var port = process.env.DB_PORT;
var user = process.env.DB_USER;
var pass = process.env.DB_PASSWORD;
var dbname = process.env.DB_NAME;
var uri = process.env.DB_URI;

mongoose.Promise = global.Promise;

var Schema = mongoose.Schema;
if (uri) {
  mongoose
    .connect(uri,{ useNewUrlParser: true })
    .then(() => {
      console.log('connection established');
    })
    .catch((err) => {
      console.log(err);
    });
} else {
  mongoose
    .connect(`mongodb://${host}:${port}/${dbname}`, {
      user,
      pass
    })
    .then(() => {
      console.log('connection established');
    })
    .catch((err) => {
      console.log(err);
    });
}

var User = mongoose.model('User', require('./user')(Schema));
var Customer = mongoose.model('Customer', require('./customer')(Schema));
var Journal = mongoose.model('Journal', require('./journal')(Schema));
var Transaction = mongoose.model('Transaction', require('./transaction')(Schema));






module.exports = {
  User,
  Customer,
  Journal,
  Transaction

};