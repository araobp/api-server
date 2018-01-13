import pprint
import requests
import base64
import time
import unittest

URL = 'https://localhost:18080{}'
headers = {'Content-type': 'application/json'}

# Self-signed HTTPS server cert
CERT = './cert/cert.pem'

def _post(path):
    return requests.post(URL.format(path), verify=CERT)

def _put(path, body):
    return requests.put(URL.format(path), json=body,
            headers=headers, verify=CERT)

def _get(path):
    return requests.get(URL.format(path), verify=CERT)

def _delete(path):
    return requests.delete(URL.format(path), verify=CERT)

def _pprint(resp, comment=None):
    print()
    if comment:
        print(comment)

    print('status code: {}'.format(resp.status_code))

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

shift1_taxi2_michael = {'carId': 'taxi2',
    'deviceId': 'device2',
    'result': 'SUCCESS'}

shift1_taxi3_joshua = {'carId': 'taxi3',
    'deviceId': 'device3',
    'result': 'SUCCESS'}

shift2_taxi1_matthew = {'carId': 'taxi1',
    'deviceId': 'device4',
    'result': 'SUCCESS'}
  
shift2_taxi2_unauthorized1 = {'carId': 'taxi2',
    'deviceId': 'device5',
    'result': 'FAILURE'}

shift2_taxi3_madison = {'carId': 'taxi3',
    'deviceId': 'device6',
    'result': 'SUCCESS'}

shift3_taxi1_unauthorized2 = {'carId': 'taxi1',
    'deviceId': 'device1',
    'result': 'FAILURE'}
  
shift3_taxi2_emily = {'carId': 'taxi2',
    'deviceId': 'device5',
    'result': 'SUCCESS'}

shift3_taxi3_michael = {'carId': 'taxi3',
    'deviceId': 'device2',
    'result': 'SUCCESS'}

class TestSequence(unittest.TestCase):
 
    def setUp(self):
        r = _post('/db/drop')

    def test_drop(self):
        r = _post('/db/drop')
        self.assertEqual(r.status_code, 200)

    def test_put_driver_shift1(self):
        r = _put('/drivers/Jacob', shift1_taxi1_jacob)
        self.assertEqual(r.status_code, 200)

        r = _put('/drivers/Michael', shift1_taxi2_michael)
        self.assertEqual(r.status_code, 200)

        r = _put('/drivers/Joshua', shift1_taxi3_joshua)
        self.assertEqual(r.status_code, 200)

    def test_put_get_shift1(self):
        r = _put('/drivers/Jacob', shift1_taxi1_jacob)
        r = _put('/drivers/Michael', shift1_taxi2_michael)
        r = _put('/drivers/Joshua', shift1_taxi3_joshua)

        r = _get('/drivers/Jacob')
        _pprint(r, 'GET /drivers/Jacob')
        self.assertEqual(r.status_code, 200)
        rs = r.json()
        self.assertEqual(rs['name'], 'Jacob')
        self.assertTrue(rs['timestamp'] > 0)
        del rs['name']
        del rs['timestamp']
        self.assertEqual(rs, shift1_taxi1_jacob)

        r = _get('/drivers/Michael')
        self.assertEqual(r.status_code, 200)
        rs = r.json()
        self.assertEqual(rs['name'], 'Michael')
        self.assertTrue(rs['timestamp'] > 0)
        del rs['name']
        del rs['timestamp']
        self.assertEqual(rs, shift1_taxi2_michael)

        r = _get('/drivers/Joshua')
        self.assertEqual(r.status_code, 200)
        rs = r.json()
        self.assertEqual(rs['name'], 'Joshua')
        self.assertTrue(rs['timestamp'] > 0)
        del rs['name']
        del rs['timestamp']
        self.assertEqual(rs, shift1_taxi3_joshua)

    def test_put_get_shift2(self):
        r = _put('/drivers/Jacob', shift1_taxi1_jacob)
        r = _put('/drivers/Michael', shift1_taxi2_michael)
        r = _put('/drivers/Joshua', shift1_taxi3_joshua)

        time.sleep(1.1)
        r = _put('/drivers/Matthew', shift2_taxi1_matthew)
        r = _put('/drivers/Unauthorized person 1', shift2_taxi2_unauthorized1)
        r = _put('/drivers/Madison', shift2_taxi3_madison)

        r = _get('/drivers/Jacob')
        self.assertEqual(r.status_code, 200)
        rs = r.json()
        self.assertEqual(rs['name'], 'Jacob')
        self.assertTrue(rs['timestamp'] > 0)
        del rs['name']
        del rs['timestamp']
        self.assertEqual(rs, shift1_taxi1_jacob)

        r = _get('/drivers/Unauthorized person 1')
        self.assertEqual(r.status_code, 200)
        rs = r.json()
        self.assertEqual(rs['name'], 'Unauthorized person 1')
        self.assertTrue(rs['timestamp'] > 0)
        del rs['name']
        del rs['timestamp']
        self.assertEqual(rs, shift2_taxi2_unauthorized1)

    def test_put_get_shift3(self):
        r = _put('/drivers/Jacob', shift1_taxi1_jacob)
        r = _put('/drivers/Michael', shift1_taxi2_michael)
        r = _get('/drivers/Michael')
        rs = r.json()
        n1 = rs['name']
        t1 = rs['timestamp']
        r = _put('/drivers/Joshua', shift1_taxi3_joshua)

        time.sleep(1.1)
        r = _put('/drivers/Matthew', shift2_taxi1_matthew)
        r = _put('/drivers/Unauthorized person 1', shift2_taxi2_unauthorized1)
        r = _put('/drivers/Madison', shift2_taxi3_madison)

        time.sleep(1.1)
        r = _put('/drivers/Unauthorized person 2', shift3_taxi1_unauthorized2)
        r = _put('/drivers/Emily', shift3_taxi2_emily)
        r = _put('/drivers/Michael', shift3_taxi3_michael)
        r = _get('/drivers/Michael')
        rs = r.json()
        n2 = rs['name']
        t2 = rs['timestamp']
        self.assertEqual(n1, n2)
        self.assertTrue(t2 > t1)

        # GET /drivers
        r = _get('/drivers')
        _pprint(r, 'GET /drivers')
        rs = r.json()
        self.assertEqual(len(rs), 8)
        self.assertEqual(rs['Michael']['timestamp'], t2)

        # GET /taxies
        r = _get('/taxies')
        _pprint(r, 'GET /taxies')
        rs = r.json()
        taxi1 = rs['taxi1']
        taxi2 = rs['taxi2']
        taxi3 = rs['taxi3']
        self.assertEqual(taxi1['name'], 'Unauthorized person 2')
        self.assertEqual(taxi1['result'], 'FAILURE')
        self.assertEqual(taxi2['name'], 'Emily')
        self.assertEqual(taxi2['result'], 'SUCCESS')
        self.assertEqual(taxi3['name'], 'Michael')
        self.assertEqual(taxi3['result'], 'SUCCESS')

        # DELETE /drivers/Unauthorized person 2
        r = _delete('/drivers/Unauthorized person 2')
        r = _get('/drivers/Unauthorized person 2')
        self.assertEqual(r.status_code, 404)
        r = _get('/drivers')
        _pprint(r, 'GET /drivers')
        rs =r.json()
        self.assertFalse('Unauthorized person 2' in rs)

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

    def test_get_registration_data_timestamp(self):
        r = _put('/sync/registration', {'data': b64data})
        self.assertEqual(r.status_code, 200)
        r = _get('/sync/registration/timestamp')
        _pprint(r, 'GET /sync/registration/timestamp')
        self.assertEqual(r.status_code, 200)
        t1 = r.json()['timestamp']

        time.sleep(1.1)
        r = _put('/sync/registration', {'data': b64data})
        self.assertEqual(r.status_code, 200)
        r = _get('/sync/registration/timestamp')
        self.assertEqual(r.status_code, 200)
        t2 = r.json()['timestamp']

        self.assertTrue(t2 > t1)

if __name__ == '__main__':
    unittest.main(verbosity=2, warnings='ignore')

