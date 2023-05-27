var express = require('express');
var router = express.Router();

const users = [{
  id: 1,
  name: "Richard Hendricks",
  email: "richard@piedpiper.com",
},
  {
    id: 2,
    name: "Bertram Gilfoyle",
    email: "gilfoyle@piedpiper.com",
  },
];

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send(users);
});

module.exports = router;
