var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
var taxiDB = require('./db.js').taxiDB;

const PORT = 18080;

function sendResp(res, err, doc) {
  if (err) {
    res.status(500).send('Internal Server Error');
  } else {
    if (doc != null) {
      res.send(doc);
    } else {
      res.send();
    }
  }
}

app.put('/drivers/:name', (req, res) => {
  var name = req.params.name;
  var s = req.body;
  s.name = name;
  taxiDB.putDriverStatus(s, err => {
    sendResp(res, err);
  });
});

app.get('/drivers/:name', (req, res) => {
  var name = req.params.name;
  taxiDB.getDriverStatus(name, (err, doc) => {
    sendResp(res, err, doc);
  });
});

app.get('/drivers', (req, res) => {
  taxiDB.getDrivers((err, docs) => {
    sendResp(res, err, docs);
  });
});

app.get('/taxies', (req, res) => {
  taxiDB.getTaxies((err, docs) => {
    sendResp(res, err, docs);
  });
});


app.listen(PORT, () => {
  console.log('API server listening on port ' + PORT);
});


