# api server

A simple REST API server for managing taxi drivers.

## REST API spec

### Taxi driver status

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
|timestamp   |String |Epoch time (aka Unix time) at the last PUT    |

#### GET /drivers
```
GET /drivers
List driver names
```
Response body (200 OK)

|Name        |type         |Description                                   |
|------------|-------------|----------------------------------------------|
|drivers     |String array |List of driver names                          |

#### DELETE /drivers/{name}
```
DELETE /drivers/{name}
Delete driver
```

### Binary data synchronization

#### POST /sync
```
PUT /sync
Upload binary data to be shared by other vehicles
```
Request body (PUT)

|Name        |type   |Description                                   |
|------------|-------|----------------------------------------------|
|data        |String |Binary data encoded in BASE64                 |

#### GET /sync
```
GET /sync
Download binary data
```
Response body (200 OK)

|Name        |type   |Description                                   |
|------------|-------|----------------------------------------------|
|data        |String |Binary data encoded in BASE64                 |

#### GET /sync/timestamp
```
GET /sync/timestamp
Show time at the latest upload
```
|Name        |type   |Description                                   |
|------------|-------|----------------------------------------------|
|timestamp   |String |Epoch time (aka Unix time)                    |
