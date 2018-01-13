var express = require('express');
var app = express();
var https = require('https');
var fs = require('fs');
var bodyParser = require('body-parser');

// Allow max 200Mbits data
app.use(bodyParser.urlencoded({extended: true, limit: '200mb'}));
app.use(bodyParser.json({limit: '200mb'}));

// Database on MongoDB
var taxiDB = require('./db.js').taxiDB;

// HTTPS server port 
const PORT = 18080;
// HTTPS server cert sample files
const httpsOptions = {
  key: fs.readFileSync('./cert/key.pem'),
  cert: fs.readFileSync('./cert/cert.pem'),
  requestCert: true,
  rejectUnauthorized: false,
  ca: [ fs.readFileSync('./cert/cert.pem') ]
}

const REGISTRATION = 'registration';

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

// This API path is just for confirming that client certification works OK
app.get('/client/certtest', (req, res) => {
    const cert = req.connection.getPeerCertificate()
    if (req.client.authorized) {
        var doc = {message: 'Hello ' + cert.subject.CN + '!'};
        sendResp(res, false, doc);
    } else {
        if (cert.subject) {
          sendResp(res, true, {status: 403, reason: 'You cert is invalid'});
        } else {
          var doc = {result: 'You need to provide a client cert'};
          sendResp(res, true,
              {status: 401, reason: 'You need to provie a client cert'}
          );
        }
    }
});

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
  var name = req.params.name;
  taxiDB.deleteDriverStatus(name, (err, doc) => sendResp(res, err, doc));
});

app.get('/taxies', (req, res) => {
  taxiDB.getTaxies((err, docs) => sendResp(res, err, docs));
});

app.put('/sync/registration', (req, res) => {
  taxiDB.putRegistrationData(req.body, (err, doc)  => sendResp(res, err, doc));
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

https.createServer(httpsOptions, app).listen(PORT, () => {
  console.log('API server listening on port ' + PORT);
});

