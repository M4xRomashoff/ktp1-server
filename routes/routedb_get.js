var express = require('express');
var connection = require('./dbconfig')
var router = express.Router();
const fs = require('fs');

/* GET home page. */
const fileName = "C:\\tempall.txt";



router.get('/get_ktp_all', (req, res) => {
  connection.query('SELECT * FROM ktp_all', (error, result) => {
    if (error) {
      res.send('error to fetch test all records', error)
    } else {
      res.send(result)
    }
  })
});

router.get('/get_ktp_date/:date', (req, res) => {
  const date = req?.params?.date;
  const sql= 'SELECT * FROM ktp_all WHERE DATE(date_time) = "'+date+'"';
  console.log('sql',sql);
  connection.query(sql, (error, result) => {
    if (error) {
      res.send('error to fetch test all records', error)
    } else {
      res.send(result)
    }
  })
});

router.get('/get_ktp_range/:date', (req, res) => {
  const dateA = (req?.params?.date).split(',')[0];
  const dateZ = (req?.params?.date).split(',')[1];
  const sql= 'SELECT * FROM ktp_all WHERE  date_time BETWEEN "' + dateA + '" AND "'+ dateZ + '" ;';

  connection.query(sql, (error, result) => {
    if (error) {
      res.send('error to fetch test all records', error)
    } else {
      res.send(result)
    }
  })
});



router.get('/get_ktp_all_file', (req, res) => {

  //
  // fs.appendFile("C:\\tempall.txt", 'Hello content!', function (err) {
  //   if (err) throw err;
  //   console.log('Saved!');
  // });

  connection.query('SELECT * FROM ktp_all',
      function(err, rows, fields){ if(err)   {
        throw err;
      }else{

        var fite = 'КТП 23 \t КТП 24 \t КТП 27 \t КТП 26 \t  Дата и время '+ '\n';
        for (var i in rows) {
          fite += rows[i].temperature1 + '\t' + rows[i].temperature2 + '\t'
                + rows[i].temperature3 + '\t' + rows[i].temperature4 + '\t' + rows[i].date_time + '\n';
        }

        fs.writeFile( fileName, fite, function (err) {
          if (err) throw err;
        });
        console.log('Saved!');
        const rs = fs.createReadStream(fileName);
        //res.setHeader("Content-Disposition", "attachment; dball.txt");
        res.setHeader("Content-Disposition", "attachment;"+fileName);
        rs.pipe(res);
        console.log('file sent..');

      }
    })

});


router.get('/create', (req, res) => {
  //const data = req.body;
  const data =
  {
    "id":2,
    "firstname" : "steve",
     "lastname" : "jobs",
     "roll_number" : 30
  }

  connection.query('INSERT INTO k1 SET ?', data, (error, result, fields) => {
    if (error) throw error;
    res.send(result);
  })
});

router.put('/update/:id', (req, res) => {
  const data = [req.body.firstname, req.body.lastname, req.body.roll_number, req.params.id];
  connection.query('UPDATE student SET firstname = ?, lastname = ?, roll_number = ? WHERE id = ?', data, (error, result, fields) => {
    if (error) throw error;
    res.send(result);
  })
});

router.delete('/delete/:id', (req, res) => {
  const id = req.params.id;
  connection.query('DELETE FROM student WHERE id =' + id, (error, result) => {
    if (error) throw error;
    res.send(result);
  });
});

module.exports = router;

