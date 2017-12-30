import pprint
import requests
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

s1 = {'carId': 'taxi1',
    'deviceId': 'device1',
    'result': 'SUCCESS'}

class TestSequence(unittest.TestCase):

    def setUp(self):
        r = _post('/db/drop')

    def test_drop(self):
        r = _post('/db/drop')
        self.assertEqual(r.status_code, 200)

    def test_put_driver(self):
        r = _put('/drivers/driver1', s1)
        self.assertEqual(r.status_code, 200)

    def test_get_driver(self):
        r = _put('/drivers/driver1', s1)
        self.assertEqual(r.status_code, 200)
        r = _get('/drivers/driver1')
        _pprint(r)
        self.assertEqual(r.status_code, 200)
        rs = r.json()
        self.assertEqual(rs['name'], 'driver1')
        self.assertTrue(rs['timestamp'] > 0)

if __name__ == '__main__':
    unittest.main(verbosity=2)

