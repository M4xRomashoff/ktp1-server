var express = require('express');
var connection = require('./dbconfig')
var router = express.Router();

/* GET home page. */



router.get('/get_ktp_all', (req, res) => {
  connection.query('SELECT * FROM ktp_all', (error, result) => {
    if (error) {
      res.send('error to fetch test all records', error)
    } else {
      res.send(result)
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

