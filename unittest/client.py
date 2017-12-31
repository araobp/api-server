import pprint
import requests
import base64
import unittest

URL = 'http://localhost:18080{}'

def _post(path):
    return requests.post(URL.format(path))

def _put(path, body):
    return requests.put(URL.format(path), body)

def _get(path):
    return requests.get(URL.format(path))

def _delete(path):
    return requests.delete(URL.format(path))

def _pprint(resp):
    print(resp.status_code)
    if resp.status_code == 200:
        try:
            pprint.pprint(resp.json())
        except:
            print(resp.text)
    else:
        print(resp.text)

with open('./gps.jpg', 'rb') as f:
    # read image data and convert it into Base64 string 
    b64data = base64.b64encode(f.read()).decode('utf-8')

shift1_taxi1_jacob = {'carId': 'taxi1',
    'deviceId': 'device1',
    'result': 'SUCCESS'}

shift1_taxi2_micahel = {'carId': 'taxi2',
    'deviceId': 'device2',
    'result': 'SUCCESS'}

shift1_taxi3_joshua = {'carId': 'taxi3',
    'deviceId': 'device3',
    'result': 'SUCCESS'}

shift2_taxi1_matthew = {'carId': 'taxi1',
    'deviceId': 'device4',
    'result': 'SUCCESS'}
  
shift2_taxi2_unauthorized = {'carId': 'taxi2',
    'deviceId': 'device5',
    'result': 'FAILURE'}

shif2_taxi3_madison = {'carId': 'taxi3',
    'deviceId': 'device6',
    'result': 'SUCCESS'}

shift3_taxi1_unauthorized = {'carId': 'taxi1',
    'deviceId': 'device1',
    'result': 'FAILURE'}
  
shift3_taxi2_emily = {'carId': 'taxi2',
    'deviceId': 'device5',
    'result': 'SUCCESS'}

shif3_taxi3_michael = {'carId': 'taxi3',
    'deviceId': 'device2',
    'result': 'SUCCESS'}

class TestSequence(unittest.TestCase):
 
    def setUp(self):
        r = _post('/db/drop')

    def test_drop(self):
        r = _post('/db/drop')
        self.assertEqual(r.status_code, 200)

    def test_put_driver(self):
        r = _put('/drivers/driver1', shift1_taxi1_jacob)
        self.assertEqual(r.status_code, 200)

    def test_get_driver(self):
        r = _put('/drivers/driver1', shift1_taxi1_jacob)
        self.assertEqual(r.status_code, 200)
        r = _get('/drivers/driver1')
        #_pprint(r)
        self.assertEqual(r.status_code, 200)
        rs = r.json()
        self.assertEqual(rs['name'], 'driver1')
        self.assertTrue(rs['timestamp'] > 0)

    def test_put_registration_data(self):
        r = _put('/sync/registration', {'data': b64data})
        self.assertEqual(r.status_code, 200)
        r = _get('/sync/registration')
        self.assertEqual(r.status_code, 200)
        rs = r.json()
        self.assertEqual(rs['data'], b64data)
        # save the file to confirm that the image file is OK 
        with open('gps_.jpg', 'wb') as f:
            f.write(base64.b64decode(rs['data']))

    def test_put_registration_data(self):
        r = _put('/sync/registration', {'data': b64data})
        self.assertEqual(r.status_code, 200)

    def test_get_registration_data(self):
        r = _put('/sync/registration', {'data': b64data})
        self.assertEqual(r.status_code, 200)
        r = _get('/sync/registration')
        self.assertEqual(r.status_code, 200)
        rs = r.json()
        self.assertEqual(rs['data'], b64data)
        # save the file to confirm that the image file is OK 
        with open('gps_.jpg', 'wb') as f:
            f.write(base64.b64decode(rs['data']))

if __name__ == '__main__':
    unittest.main(verbosity=2)

