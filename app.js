
//c:\ktp-server\bin>node www   запустить сервер


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

let temp1 ='NULL';
let temp2 ='NULL';

function isFloat(n) {
    return parseFloat(n.match(/^-?\d*(\.\d+)?$/))>0;
}
function check_data1(text){

    let newText ='unit_A_temperature NULL unit_B_temperature NULL';
    let blancAr=newText.split(' ');
    let resAr = text.split(' ');
    if (resAr.length === 4){
       if (resAr[0] === 'unit_A_temperature' && isFloat(resAr[1])) blancAr[1] = resAr[1];
       if (resAr[2] === 'unit_B_temperature' && isFloat(resAr[3])) blancAr[3] = resAr[3];
    newText = blancAr[0]+' '+blancAr[1]+' '+blancAr[2]+' '+blancAr[3];
    }
    return newText;
}

function check_data2(text){

    let newText ='unit_C_temperature NULL unit_D_temperature NULL';
    let blancAr=newText.split(' ');
    let resAr = text.split(' ');
    if (resAr.length === 4){
        if (resAr[0] === 'unit_C_temperature' && isFloat(resAr[1])) blancAr[1] = resAr[1];
        if (resAr[2] === 'unit_D_temperature' && isFloat(resAr[3])) blancAr[3] = resAr[3];
        newText = blancAr[0]+' '+blancAr[1]+' '+blancAr[2]+' '+blancAr[3];
    }
    return newText;
}
function save_data1(str_data){
  let ar=str_data.split(' ');
  temp1 = ar[1];
  temp2 = ar[3];
  // console.log('INSERT INTO ktp_all (temperature1, temperature2 ) ' + 'VALUES (' +ar[1] +', ' + ar[3] + ');')
  // connection.query('INSERT INTO ktp_all (temperature1, temperature2 ) ' +
  //     'VALUES (' +ar[1] +', ' + ar[3] + ');',
  //     (error, result) => {
  //     if (error) {
  //       console.log('db error ', error)
  //     } else {
  //       console.log('db updated !')
  //     }
  // })
}

function save_data2(str_data){
    let ar=str_data.split(' ');
    console.log('fetching and saving 2', temp1,' ',temp2,' ',ar[1],' ',ar[3]);

    sql = 'INSERT INTO ktp_all (temperature1, temperature2, temperature3, temperature4 ) '
        + 'VALUES (' +temp1 +', ' + temp2 + ', ' +ar[1] +', ' + ar[3] + ');';
    console.log()
    connection.query(sql,
        (error, result) => {
            if (error) {
                console.log('db error ', error)
            } else {
                console.log('db updated !')
            }
        })
}
function save_data(str_data){
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
//cron.schedule('*/5 * * * *', function() {  // время запросов с датчиков каждые 5 мин
cron.schedule('* * * * *', function() {  // время запросов с датчиков каждую мин
//cron.schedule('*/2 * * * *', function() {  // время запросов с датчиков каждые 2 мин

  fetch('http://192.168.0.66:80')
      .then(res => res.text())
      .then(text => {console.log(text);
        save_data1(check_data1(text))})
      .catch(err => console.log('fetch error',err));
    fetch('http://192.168.0.25:80')
        .then(res => res.text())
        .then(text => {console.log(text);
            save_data2(check_data2(text))})
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
