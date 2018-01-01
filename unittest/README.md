# Unit test with Python requests package

Python: v3.5.2

Since Python is a popular language in the area of Artificial Intelligence (AI) and Computer Vision, I assume that the user of this API server use Python on IoT GW to develop a client program.

This example use ["requests"](http://docs.python-requests.org/en/master/) package as REST client.

## Use case

A small taxi company owns three taxies: taxi1, taxi2 and taxi3. The company hires six drivers: Jacob, Michael, Joshua, Matthew, Emily and Madison.

```
 [Driver]---[sensor]---[taxi]---wireless connectivity---[API server][MongoDB]
  name      deviceId   CarId                                 |
                                                             +------[Management client]
```

### Shift 1

|Car ID|Device ID|Driver                 |
|------|---------|-----------------------|
|Taxi1 |device1  |Jacob                  |
|Taxi2 |device2  |Michael                |
|Taxi3 |device3  |Joshua                 |

### Shift 2

|Car ID|Device ID|Driver                 |
|------|---------|-----------------------|
|Taxi1 |device4  |Matthew                |
|Taxi2 |device5  |(Unauthorized person 1)|
|Taxi3 |device6  |Madison                |

### Shift 3

|Car ID|Device ID|Driver                 |
|------|---------|-----------------------|
|Taxi1 |device1  |(Unauthorized person 2)|
|Taxi2 |device5  |Emily                  |
|Taxi3 |device2  |Michael                |

## Unittest result
```
$ ubuntu:~/api-server/unittest$ ./run.sh
test_drop (__main__.TestSequence) ... ok
test_get_registration_data (__main__.TestSequence) ... ok
test_get_registration_data_timestamp (__main__.TestSequence) ...
GET /sync/registration/timestamp
status code: 200
{'timestamp': 1514765153}
ok
test_put_driver_shift1 (__main__.TestSequence) ... ok
test_put_get_shift1 (__main__.TestSequence) ...
GET /drivers/Jacob
status code: 200
{'carId': 'taxi1',
 'deviceId': 'device1',
 'name': 'Jacob',
 'result': 'SUCCESS',
 'timestamp': 1514765155}
ok
test_put_get_shift2 (__main__.TestSequence) ... ok
test_put_get_shift3 (__main__.TestSequence) ...
GET /drivers
status code: 200
{'Emily': {'timestamp': 1514765158},
 'Jacob': {'timestamp': 1514765156},
 'Joshua': {'timestamp': 1514765156},
 'Madison': {'timestamp': 1514765157},
 'Matthew': {'timestamp': 1514765157},
 'Michael': {'timestamp': 1514765158},
 'Unauthorized person 1': {'timestamp': 1514765157},
 'Unauthorized person 2': {'timestamp': 1514765158}}

GET /taxies
status code: 200
{'taxi1': {'name': 'Unauthorized person 2',
           'result': 'FAILURE',
           'timestamp': 1514765158},
 'taxi2': {'name': 'Emily', 'result': 'SUCCESS', 'timestamp': 1514765158},
 'taxi3': {'name': 'Michael', 'result': 'SUCCESS', 'timestamp': 1514765158}}

GET /drivers
status code: 200
{'Emily': {'timestamp': 1514765158},
 'Jacob': {'timestamp': 1514765156},
 'Joshua': {'timestamp': 1514765156},
 'Madison': {'timestamp': 1514765157},
 'Matthew': {'timestamp': 1514765157},
 'Michael': {'timestamp': 1514765158},
 'Unauthorized person 1': {'timestamp': 1514765157}}
ok
test_put_registration_data (__main__.TestSequence) ... ok

----------------------------------------------------------------------
Ran 8 tests in 5.056s

OK
```
