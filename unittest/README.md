# Unit test with Python requests package

Python: v3.5.2

Since Python is a popular language in the area of Artificial Intelligence (AI) and Computer Vision, I assume that the user of this API server use Python on IoT GW to develop a client program.

This example use ["requests"](http://docs.python-requests.org/en/master/) package as REST client.

## Use case

A small taxi company owns three taxies: taxi1, taxi2 and taxi3. The company hires six drivers: Jacob, Michael, Joshua, Matthew, Emily and Madison.

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
