# api server

A simple REST API server for managing taxi drivers.

## REST API spec

### Taxi driver status

```
PUT /drivers/{name}
Create/update driver
```
Request body (PUT)

|Name        |type   |Description                                   |
|------------|-------|----------------------------------------------|
|deviceId    |String |Authentication device ID                      |
|carId       |String |Vehicle ID                                    |
|result      |String |Authentication result: "SUCCESS" or "FAILURE" |
|timestamp   |String |Epoch time (aka Unix time)                    |

```
GET /drivers/{name}
Show driver details
```
Response body (200 OK)

(Same the above)

```
GET /drivers
List drivers
```
Response body (200 OK)

|Name        |type         |Description                                   |
|------------|-------------|----------------------------------------------|
|drivers     |String array |List of driver names                          |

```
DELETE /drivers/{name}
Delete driver
```

### Binary data synchronization

```
PUT /sync
Upload binary data to be shared by other vehicles
```
Request body (PUT)

|Name        |type   |Description                                   |
|------------|-------|----------------------------------------------|
|data        |String |Binary data encoded in BASE64                 |

```
GET /sync
Download binary data
```
Response body (200 OK)

|Name        |type   |Description                                   |
|------------|-------|----------------------------------------------|
|data        |String |Binary data encoded in BASE64                 |

```
GET /sync/timestamp
Show time at the latest upload
```
