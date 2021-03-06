# REST API server for managing taxi drivers

## Motivation

I sometimes use taxi. I have noticed that taxi drivers are aging. They require health monitoring even during driving taxi.

## Sensor network for managing taxi drivers

```
 [Driver]---[sensor]---[taxi]---wireless connectivity---[API server][MongoDB]
  name      deviceId   CarId                                 |
                                                             +------[Management client]
```

Example of sensor devices:
- Driver authentication sensor (e.g., fingerprint authentication)
- Driver health monitoring (e.g., doppler sensor for sensing heat beat etc)
- Taxi tracking (GPS)

In the first release, the API server supports driver authentication sensor only.

## Architecture

System:
![vpn](./doc/vpn.jpg)

[OpenVPN setup tips](./doc/openvpn.md)

API Server:
```
    --- REST --- [[app.js]--[db.js(mongoose-based)]--[MongoDB]]
```
## Implementation

- [API Server](./server)
- [Unit test(API client)](./unittest)

## Schema (data model)

```
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
```

## REST API spec

### TAXI DRIVER STATUS MANAGEMENT

#### PUT /drivers/{name}
```
PUT /drivers/{name}
Create/update driver status
```
Request body (PUT)

|Name        |type   |Description                                   |
|------------|-------|----------------------------------------------|
|deviceId    |String |Authentication device ID                      |
|carId       |String |Vehicle ID                                    |
|result      |String |Authentication result: "SUCCESS" or "FAILURE" |

Example
```
PUT /drivers/Michael
{
  "deviceId": "device1",
  "carId": "taxi1",
  "result": "SUCCESS"
}
```

#### GET /drivers/{name}
```
GET /drivers/{name}
Show driver status details
```
Response body (200 OK)

|Name        |type   |Description                                   |
|------------|-------|----------------------------------------------|
|name        |String |Driver name                                   |
|deviceId    |String |Authentication device ID                      |
|carId       |String |Vehicle ID                                    |
|result      |String |Authentication result: "SUCCESS" or "FAILURE" |
|timestamp   |Number |Epoch time (aka Unix time) at the last PUT    |

Note: For example, epoch time can be obtained by typing the following command on Linux: 
```
pi@raspberrypi:~ $ date +%s
1514509935
```

Example
```
GET /driviers/Michael
{
  "name": "Michael",
  "deviceId": "device1",
  "carId": "taxi1",
  "result": "SUCCESS",
  "timestamp": 1514509809
}
```

#### GET /drivers
```
GET /drivers
List driver names
```
Response body (200 OK)

List of driver name and timestamp at the last PUT.

Example
```
{
  "Jacob": {"timestamp": 1514509472},
  "Michael": {"timestamp": 1514509359},
  "Joshua": {"timestamp": 1514509127}
}
```

#### DELETE /drivers/{name}
```
DELETE /drivers/{name}
Delete driver
```

### TAXI STATUS MANAGEMENT

This operation is the heart of the API service.

#### GET /taxies
```
GET /taxies
List taxies and their drivers
```
Response body (200 OK)

List of driver name and timestamp at the last PUT

Example
```
{
  "taxi1": {"name": "Jacob", "result": "SUCCESS", "timestamp": 1514509472},
  "taxi2": {"name": "Michael", "result": "SUCCESS", "timestamp": 1514509359},
  "taxi3": {"name": "Joshua", "result": "FAILURE", "timestamp": 1514509127}
}
```

### BINARY DATA SYNCHRONIZATION

#### PUT /sync/registration
```
PUT /sync/registration
Upload binary data to be shared by other vehicles
```
Request body (PUT)

|Name        |type   |Description                                   |
|------------|-------|----------------------------------------------|
|data        |String |Binary data encoded in BASE64                 |

Example
```
{
  "data": "<base64-encoded binary data>
}
```

#### GET /sync/registration
```
GET /sync/registration
Download binary data
```
Response body (200 OK)

|Name        |type   |Description                                   |
|------------|-------|----------------------------------------------|
|data        |String |Binary data encoded in BASE64                 |
|timestamp   |String |Epoch time (aka Unix time)                    |

Example
```
{
  "data": "<base64-encoded binary data>",
  "timestamp": 1514509935
}
```

#### GET /sync/registration/timestamp
```
GET /sync/registration/timestamp
Show time at the latest upload
```
|Name        |type   |Description                                   |
|------------|-------|----------------------------------------------|
|timestamp   |String |Epoch time (aka Unix time)                    |

Example
```
{
  "timestamp": 1514509935
}
```

### DATABASE MANAGEMENT
```
POST /db/drop
Drop database
```

## Mongoose data schema structure

```
taxi
  |
  +-- Drivers
  |
  +-- Sync
```

For exaple, on mongo CLI,
```
> use taxi
> db.Drivers.find()
{ "_id" : ObjectId("5a46cf55c9b85847f010d1ed"), "name" : "driver1", "__v" : 0, "timestamp" : 1514593114, "result" : "SUCCESS", "carId" : "taxi3", "deviceId" : "device3" }
```

## TODO

- Support change notifications: MQTT over WebSocket.

