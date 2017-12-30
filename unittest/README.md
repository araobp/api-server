# Unit test with Python requests package

Python: v3.5.2

Since Python is a popular language in the area of Artificial Intelligence (AI) and Computer Vision, I assume that the user of this API server use Python on IoT GW to develop a client program.

This example use ["requests"](http://docs.python-requests.org/en/master/) package as REST client.

## Use case

A small taxi company owns three taxies: taxi1, taxi2 and taxi3. The company hires six drivers: Jacob, Michael, Joshua, Matthew, Emily and Madison.

The company installs some nifty sensor devices on each taxies to detect that those taxies are driven by those authorized drivers.

However, the company finds out that those taxies are driven by unauthorized persons sometimes.

### Shift 1

|Car ID|Device ID|Driver               |
|------|---------|---------------------|
|Taxi1 |sensor1  |Jacob                |
|Taxi2 |sensor2  |Michael              |
|Taxi3 |sensor3  |Joshua               |

### Shift 2

|Car ID|Device ID|Driver               |
|------|---------|---------------------|
|Taxi1 |sensor4  |Matthew              |
|Taxi2 |sensor5  |(Unauthorized driver)|
|Taxi3 |sensor6  |Madison              |

### Shift 3

|Car ID|Device ID|Driver               |
|------|---------|---------------------|
|Taxi1 |sensor1  |(Unauthorized driver)|
|Taxi2 |sensor5  |Emily                |
|Taxi3 |sensor2  |Michael              |
