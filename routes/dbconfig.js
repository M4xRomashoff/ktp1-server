const mysql = require('mysql');
const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'twenty23',
    //password : 'Twenty22!',
    database : 'ktp'
});

connection.connect((error) => {
    if(error){
        console.log('database connection fail', error);
    }
});

module.exports = connection;