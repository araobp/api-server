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
  result: String
});

var Drivers = mongoose.model('Drivers', driversSchema);

var d = new Drivers({name: "driver1",
  deviceId: "deviec1",
  carId: "taxi1",
  result: "SUCCESS"});

console.log(d.name);

d.save(function(err, d) {
  if (err) return console.error(err);
});

