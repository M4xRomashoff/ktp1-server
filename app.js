
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
let temp3 ='NULL';
let temp4 ='NULL';

function isFloat(n) {
    return parseFloat(n.match(/^-?\d*(\.\d+)?$/))>0;
}

function check_data4(text){

   // 'unit_A_temperature NULL unit_B_temperature NULL unit_C_temperature NULL unit_D_temperature NULL'
    let resAr = text.split(' ');
    if (resAr.length === 8){
        if (resAr[0] === 'unit_A_temperature' && isFloat(resAr[1])) temp1 = resAr[1];
        if (resAr[2] === 'unit_B_temperature' && isFloat(resAr[3])) temp2 = resAr[3];
        if (resAr[4] === 'unit_C_temperature' && isFloat(resAr[5])) temp3 = resAr[5];
        if (resAr[6] === 'unit_D_temperature' && isFloat(resAr[3])) temp4 = resAr[7];
    }
    return 'ok';
}

// function check_data1(text){
//
//     let newText ='unit_A_temperature NULL unit_B_temperature NULL';
//     let blancAr=newText.split(' ');
//     let resAr = text.split(' ');
//     if (resAr.length === 4){
//         if (resAr[0] === 'unit_A_temperature' && isFloat(resAr[1])) blancAr[1] = resAr[1];
//         if (resAr[2] === 'unit_B_temperature' && isFloat(resAr[3])) blancAr[3] = resAr[3];
//         newText = blancAr[0]+' '+blancAr[1]+' '+blancAr[2]+' '+blancAr[3];
//     }
//     return newText;
// }

// function check_data2(text){
//     //console.log('text',text);
//     //resAr [ 'no_data_C', 'NULL', '', 'unit_D_temperature', '40.50' ]
//
//     let newText ='unit_C_temperature NULL unit_D_temperature NULL';
//     let blancAr=newText.split(' ');
//     let resAr = text.split(' ');
//     //console.log('resAr',resAr);
//     if (resAr.length === 4){
//         if (resAr[0] === 'unit_C_temperature' && isFloat(resAr[1])) blancAr[1] = resAr[1];
//         if (resAr[2] === 'unit_D_temperature' && isFloat(resAr[3])) blancAr[3] = resAr[3];
//         newText = blancAr[0]+' '+blancAr[1]+' '+blancAr[2]+' '+blancAr[3];
//     }
//     return newText;
// }
// function prep_data1(str_data){
//     let ar=str_data.split(' ');
//     temp1 = ar[1];
//     temp2 = ar[3];
// }
//
// function prep_data2(str_data){
//     let ar=str_data.split(' ');
//     temp3 = ar[1];
//     temp4 = ar[3];
// }
function save_data_all(){

    console.log('fetching and saving all', temp1,' ',temp2,' ',temp3,' ',temp4);

    sql = 'INSERT INTO ktp_all (temperature1, temperature2, temperature3, temperature4 ) '
        + 'VALUES (' +temp1 +', ' + temp2 + ', ' + temp3 +', ' + temp4+ ');';

    connection.query(sql,
        (error, result) => {
            if (error) {
                console.log('db error ', error)
            } else {
                console.log('db updated !');
                temp1 = 'NULL';
                temp2 = 'NULL';
                temp3 = 'NULL';
                temp4 = 'NULL';
            }
        })
}

//ron.schedule('*/5 * * * *', function() {  // время запросов с датчиков каждые 5 мин
cron.schedule('* * * * *', function() {  // время запросов с датчиков каждую мин
//cron.schedule('*/2 * * * *', function() {  // время запросов с датчиков каждые 2 мин

    fetch('http://192.168.60.176:49152')
        .then(res => res.text())
        .then(text => {console.log(text);
            let res = check_data4(text);
        save_data_all();})
        .catch(err => {console.log('fetch error',err);
        save_data_all();});

    // fetch('http://192.168.60.176:80')
    //     .then(res => res.text())
    //     .then(text => {console.log(text);
    //         prep_data2(check_data2(text));
    //         save_data_all();})
    //     .catch(err => {console.log('fetch error',err);
    //         const textEmpty ='unit_C_temperature NULL unit_D_temperature NULL';
    //         prep_data2(check_data2(textEmpty));
    //         save_data_all();});
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
