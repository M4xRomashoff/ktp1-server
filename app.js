var createError = require('http-errors');
var cors = require('cors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');

var indexRouter = require('./routes/index');
var dbRouter = require('./routes/routedb_get');
var usersRouter = require('./routes/users');
var app = express();
var connection = require('./routes/dbconfig')

const cron = require('node-cron');
const fetch = require('node-fetch');




function save_data1(str_data){
  let ar=str_data.split(' ');
  ar[1]="NULL";
  console.log('fetching and saving');
  connection.query('INSERT INTO ktp_all (temperature1, temperature2 ) ' +
      'VALUES (' +ar[1] +', ' + ar[3] + ');',
      (error, result) => {
      if (error) {
        console.log('db error ', error)
      } else {
        console.log('db updated !')
      }
  })
}

function save_data2(str_data){
  let ar=str_data.split(' ');

  connection.query('INSERT INTO ktp_all (temperature3, temperature4 ) ' +
      'VALUES (' +ar[1] +', ' + ar[3] + ');',
      (error, result) => {
        if (error) {
          console.log('db error ', error)
        } else {
          console.log('db updated !')
        }
      })
}
cron.schedule('5 * * * * ', function() {  // время запросов с датчиков

  fetch('http://192.168.0.66:80')
      .then(res => res.text())
      .then(text => {console.log(text);
        save_data1(text)})
      .catch(err => console.log('fetch error',err));
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(cors());


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true,}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/db', dbRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
