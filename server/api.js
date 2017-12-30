var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
var taxiDB = require('./db.js').taxiDB;

const PORT = 18080;

function sendResp(res, err, doc) {
  if (err) {
    res.status(doc.status).send(doc.reason);
  } else {
    if (doc) {
      res.send(doc);
    } else {
      res.send();
    }
  }
}

// REST API

app.put('/drivers/:name', (req, res) => {
  var name = req.params.name;
  var s = req.body;
  s.name = name;
  taxiDB.putDriverStatus(s, (err, doc) => sendResp(res, err, doc));
});

app.get('/drivers/:name', (req, res) => {
  var name = req.params.name;
  taxiDB.getDriverStatus(name, (err, doc) => sendResp(res, err, doc));
});

app.get('/drivers', (req, res) => {
  taxiDB.getDrivers((err, docs) => sendResp(res, err, docs));
});

app.delete('/drivers/:name', (req, res) => {
  taxiDB.deleteDriverStatus(name, (err, doc) => sendResp(res, err, doc));
});

app.get('/taxies', (req, res) => {
  taxiDB.getTaxies((err, docs) => sendResp(res, err, docs));
});

app.put('/sync/registration', (req, res) => {
  var d = {}
  d.type = REGISTRATION;
  d.data = req.body;
  taxiDB.putRegistrationData(d, (err, doc)  => sendResp(res, err, doc));
});

app.get('/sync/registration', (req, res) => {
  taxiDB.getRegistrationData((err, doc) => sendResp(res, err, doc));
});

app.get('/sync/registration/timestamp', (req, res) => {
  taxiDB.getRegistrationDataTimestamp((err, doc) => sendResp(res, err, doc));
});

app.delete('/sync/registration', (req, res) => {
  taxiDB.deleteRegistrationData((err, doc) => sendResp(res, err, doc));
});

app.post('/db/drop', (req, res) => {
  taxiDB.postDropDatabase((err, doc) => sendResp(res, err, doc));
});

// Listen on PORT

app.listen(PORT, () => {
  console.log('API server listening on port ' + PORT);
});

