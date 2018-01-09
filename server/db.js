var mongoose = require('mongoose');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
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
  data: String,
  timestamp: Number
});

const REGISTRATION = 'registration';
const INTERNAL_SERVER_ERROR = {status: 500, reason: 'Internal Server Error'};
const NOT_FOUND = {status: 404, reason: 'Not found'};

var Drivers = mongoose.model('Drivers', driversSchema);
var Sync = mongoose.model('Sync', syncSchema);

function getTimestamp() {
  return Math.round( new Date().getTime() / 1000 );
}

exports.taxiDB = {

  ///// Schema: Drivers /////

  // CRUD Create/Update operation
  putDriverStatus: function(s, callback) {
    s.timestamp = getTimestamp();
    Drivers.findOneAndUpdate({'name': s.name}, s, {upsert: true}, (err, doc) => {
      if (err) {
        callback(true, INTERNAL_SERVER_ERROR);
      } else {
        callback(false);
      }
    });
  },

  // CRUD Read operation
  getDriverStatus: function(name, callback) {
    Drivers.findOne({'name': name}, (err, doc) => {
      if (err) {
        callback(true, INTERNAL_SERVER_ERROR);
      } else {
        if (doc) {
          doc = doc.toObject();
          delete doc._id;
          delete doc.__v;
          callback(false, doc);
        } else {
          callback(true, NOT_FOUND);
        }
      }
    });
  },

  // CRUD Read operation
  getDrivers: function(callback) {
    Drivers.find({}, (err, docs) => {
      if (err) {
        callback(true, INTERNAL_SERVER_ERROR);
      } else {
        var drivers = {};
        docs.forEach(it => { drivers[it.name] = {timestamp: it.timestamp} });
        callback(false, drivers);
      }
    });
  },

  // CRUD Delete operation
  deleteDriverStatus: function(name, callback) {
    Drivers.findOneAndRemove({'name': name}, (err, name) => {
      if (err) {
        callback(true, INTERNAL_SERVER_ERROR);
      } else {
        callback(false);
      }
    });
  },

  // CRUD Read operation
  getTaxies: function(callback) {
    var taxies = {}; 
    Drivers.find({}, (err, docs) => {
      if (err) {
        callback(true, INTERNAL_SERVER_ERROR);
      } else {
        docs.forEach(it => {
          if (it.carId in taxies) {
            var taxi = taxies[it.carId];
            var lastTime = taxi.timestamp;
            if (it.timestamp > lastTime) {
              taxi.name = it.name;
              taxi.timestamp = it.timestamp;
              taxi.result = it.result;
            }
          } else {
            taxies[it.carId] = {
              name: it.name,
              timestamp: it.timestamp,
              result: it.result
            };
          }
        });
        callback(false, taxies);
      }
    });
  },

  ///// Schema: Sync /////

  // CURD Create/Update operation
  putRegistrationData: function(d, callback) {
    d.type = REGISTRATION;
    d.timestamp = getTimestamp();
    Sync.findOneAndUpdate({'type': REGISTRATION}, d, {upsert: true}, (err, doc) => {
      if (err) {
        callback(true, INTERNAL_SERVER_ERROR);
      } else {
        callback(false);
      }
    });
  },

  // CRUD Read operation
  getRegistrationData: function(callback) {
    Sync.findOne({'type': REGISTRATION}, (err, doc) => {
      if (err) {
        callback(true, INTERNAL_SERVER_ERROR);
      } else {
        doc = doc.toObject();
        delete doc._id;
        delete doc.__v;
        delete doc.type;
        callback(false, doc);
      }
    });
  },

  // CRUD Read operation
  getRegistrationDataTimestamp: function(callback) {
    Sync.findOne({'type': REGISTRATION}, (err, doc) => {
      if (err) {
        callback(true, INTERNAL_SERVER_ERROR);
      } else {
        callback(false, {timestamp: doc.timestamp});
      }
    });
  },

  // CRUD Delete operation
  deleteRegistrationData: function(callback) {
    Sync.findOneAndRemove({'type': REGISTRATION}, (err, type) => {
      if (err) {
        callback(true, INTERNAL_SERVER_ERROR);
      } else {
        callback(false);
      }
    });
  },

  ///// Database management /////
  postDropDatabase: function(callback) {
    db.dropDatabase(err => {
      if (err) {
        callback(true, INTERNAL_SERVER_ERROR);
      } else {
        callback(false);
      }
    });
  }

};
