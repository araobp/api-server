# api server

A simple REST API server for managing taxi drivers.

## REST API spec

### Taxi driver status

```
PUT /drivers/{name}
Create/update driver
```
JSON data format

|Name        |type   |Description                                   |
|------------|-------|----------------------------------------------|
|deviceId    |String |Authentication device ID                      |
|carId       |String |Vehicle ID                                    |
|result      |String |Authentication result: "SUCCESS" or "FAILURE" |
|timestamp   |String |Epoch time (aka Unix time)                    |

GET /drivers/{name}
Show driver details

GET /drivers
List drivers

DELETE /drivers/{name}
Delete driver

PUT /sync

