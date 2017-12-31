# REST API server for managing taxi drivers

Node.js version: v8.9.3
MongoDB version: v2.6.10

[REFERENCE]
- [MongoDB](https://www.mongodb.com/)
- [Express](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs)
- [Mongoose](http://mongoosejs.com/docs/)


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
```
                                           Taxi
[Driver]--- sensor interface ---[Auth. device][board PC]--- REST ---[API server(app.js and db.js)]
                                                                       |  |
[Driver]--- sensor interface ---[Auth. device][board PC]--- REST ------+  |
                                                                          |
[Driver]--- sensor interface ---[Auth. device][board PC]--- REST ---------+
```

API Server:
```
    --- REST --- [[app.js]--[db.js(mongoose-based)]--[MongoDB]]
```
## Implementation

- [API Server](./server)
- [Unit test](./unittest)

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
{
  "deviceId": "auth-device-1",
  "carId": "taxi-1",
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
{
  "deviceId": "auth-device-1",
  "carId": "taxi-1",
  "result": "FAILURE",
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
  "driver1": {"timestamp": 1514509472},
  "driver2": {"timestamp": 1514509359},
  "driver3": {"timestamp": 1514509127}
}
```

#### DELETE /drivers/{name}
```
DELETE /drivers/{name}
Delete driver
```

### TAXI STATUS MANAGEMENT

This operation is the heart of the API service.

TODO: GPS-based taxi tracking and WebSocket support for pushing data to the client in real time.

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
  "taxi1": {"name": "driver1", "result": "SUCCESS", "timestamp": 1514509472},
  "taxi2": {"name": "driver2", "result": "SUCCESS", "timestamp": 1514509359},
  "taxi3": {"name": "driver3", "result": "FAILURE", "timestamp": 1514509127}
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

