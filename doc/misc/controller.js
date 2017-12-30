var taxiDB = require('./db.js').taxiDB;

// Sample objects

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

var s4 = {name: 'driver4',
  deviceId: 'device3',
  carId: 'taxi1',
  result: 'FAILURE'
};

var d1 = {type: 'registration',
  data: 'ABC123'
};

var d2 = {type: 'registration',
  data: 'DEF456'
};

taxiDB.putDriverStatus(s1, function(err) {
  if (err) console.log('INTERNAL SERVER ERROR');
});

taxiDB.putDriverStatus(s2, function(err) {
  if (err) console.log('INTERNAL SERVER ERROR');
});

/*
taxiDB.putDriverStatus(s3, function(err) {
  if (err) console.log('INTERNAL SERVER ERROR');
});
*/

taxiDB.putDriverStatus(s4, function(err) {
  if (err) console.log('INTERNAL SERVER ERROR');
});

taxiDB.getDriverStatus('driver1', function(err, doc) {
  if (err) {
    console.log('INTERNAL SERVER ERROR');
  } else {
    console.log(doc);
  }
});

taxiDB.getDrivers( (err, docs) => {
  if (err) {
    console.log('INTERNAL SERVER ERROR');
  } else {
    console.log(docs);
  }
});

taxiDB.getTaxies( (err, docs) => {
  if (err) {
    console.log('INTERNAL SERVER ERROR');
  } else {
    console.log(docs);
  }
});

taxiDB.deleteDriverStatus('driver4', (err) => {
  if (err) {
    console.log('INTERNAL SERVER ERROR');
  }
});

taxiDB.getTaxies( (err, docs) => {
  if (err) {
    console.log('INTERNAL SERVER ERROR');
  } else {
    console.log(docs);
  }
});

taxiDB.putRegistrationData(d1, (err) => {
  if (err) {
    console.log('INTERNAL SERVER ERROR');
  }
});

taxiDB.putRegistrationData(d2, (err) => {
  if (err) {
    console.log('INTERNAL SERVER ERROR');
  }
});

taxiDB.getRegistrationDataTimestamp( (err, doc) => {
  if (err) {
    console.log('INTERNAL SERVER ERROR');
  } else {
    console.log(doc);
  }
});

taxiDB.getRegistrationData( (err, doc) => {
  if (err) {
    console.log('INTERNAL SERVER ERROR');
  } else {
    console.log(doc);
  }
});

taxiDB.deleteRegistrationData( (err) => {
  if (err) {
    console.log('INTERNAL SERVER ERROR');
  }
});
