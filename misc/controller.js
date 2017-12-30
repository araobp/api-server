var taxiDB = require('./db.js').taxiDB;

var s1 = {name: 'driver1',
  deviceId: 'device3',
  carId: 'taxi3',
  result: 'SUCCESS'
};

var s2 = {name: 'driver2',
  deviceId: 'device2',
  carId: 'taxi2',
  result: 'FAILURE'
};

var s3 = {name: 'driver3',
  deviceId: 'device1',
  carId: 'taxi1',
  result: 'SUCCESS'
};

taxiDB.putDriverStatus(s1, function(err) {
  if (err) console.log('INTERNAL SERVER ERROR');
});

taxiDB.putDriverStatus(s2, function(err) {
  if (err) console.log('INTERNAL SERVER ERROR');
});

taxiDB.putDriverStatus(s3, function(err) {
  if (err) console.log('INTERNAL SERVER ERROR');
});

taxiDB.getDriverStatus('driver1', function(err, doc) {
  if (err) {
    console.log('INTERNAL SERVER ERROR');
  } else {
    console.log(doc);
  }
});


