var mongoose = require('mongoose');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('DB connected');
});

mongoose.connect('mongodb://localhost/taxi');

var driversSchema = mongoose.Schema({
  name: {type: String, unique: true},
  deviceId: String,
  carId: String,
  result: String,
  timestamp: Number
});

var syncSchema = mongoose.Schema({
  type: {type: String, unique: true},
  data: String
});

const REGISTRATION = 'registration';

var Drivers = mongoose.model('Drivers', driversSchema);
var Sync = mongoose.model('Sync', syncSchema);

var timestamp = Math.round( new Date().getTime() / 1000 );

function getTimestamp() {
  return Math.round( new Date().getTime() / 1000 );
}

var d1 = {name: "driver1",
  deviceId: "device1",
  carId: "taxi1",
  result: "SUCCESS",
  timestamp: timestamp
};

var d2 = {name: 'driver1',
  deviceId: 'device2',
  carId: 'taxi2',
  result: 'FAILURE',
  timestamp: timestamp}; 

var s1 = {type: REGISTRATION, data: "ABC123"};
var s2 = {type: REGISTRATION, data: "DEF456"};

console.log('name: ' + d1.name);
console.log('name: ' + d2.name);

// Create or Update
Drivers.findOneAndUpdate({'name': d1.name}, d1, {upsert: true}, function(err, doc) {
    if (err) console.log(err);
  }
);
Drivers.findOneAndUpdate({'name': d2.name}, d2, {upsert: true}, function(err, doc) {
    if (err) console.log(err);
  }
);

Sync.findOneAndUpdate({'type': REGISTRATION}, s1, {upsert: true}, function(err, doc) {
    if (err) console.log(err);
  }
);
Sync.findOneAndUpdate({'type': REGISTRATION}, s2, {upsert: true}, function(err, doc) {
    if (err) console.log(err);
  }
);

exports.taxiDB = {

  // CRUD Create or Update operation
  putDriverStatus: function(s, callback) {
    s.timestamp = getTimestamp();
    Drivers.findOneAndUpdate({'name': s.name}, s, {upsert: true}, function(err, doc) {
      if (err) {
        callback(true);
      } else {
        callback(false);
      }
    });
  },

  // CRUD Read operation
  getDriverStatus: function(name, callback) {
    Drivers.findOne({'name': name}, function(err, doc) {
      if (err) {
        callback(true, null);
      } else {
        doc = doc.toObject();
        delete doc._id;
        delete doc.__v;
        callback(false, doc);
      }
    });
  },

  // CRUD Delete operation
  deleteDriverStatus: function(name, callback) {
    Drivers.findOneAndRemove({'name': name}, function(err, name) {
      if (err) {
        callback(true);
      } else {
        callback(false);
      }
    });
  }
};
