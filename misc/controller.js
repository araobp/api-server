var taxiDB = require('./db.js').taxiDB;

var s = {name: 'driver1',
  deviceId: 'device3',
  carId: 'taxi3',
  result: 'SUCCESS'
};

taxiDB.putDriverStatus(s, function(err) {
  if (err) console.log('INTERNAL SERVER ERROR');
});

taxiDB.getDriverStatus('driver1', function(err, doc) {
  if (err) {
    console.log('INTERNAL SERVER ERROR');
  } else {
    console.log(doc);
  }
});


