import pprint
import requests

URL = 'http://localhost:18080{}'

s1 = {'carId': 'taxi7',
      'deviceId': 'device9',
      'result': 'SUCCESS'}

def _pprint(resp):
    if resp.status_code == 200:
        pprint.pprint(resp.json())
    else:
        print(resp.text)

def main():

    resp = requests.get(URL.format('/drivers/driver1'))
    _pprint(resp)

    resp = requests.put(URL.format('/drivers/driver5'))

    resp = requests.get(URL.format('/drivers/driver5'))
    _pprint(resp)

    resp = requests.get(URL.format('/drivers'))
    _pprint(resp)

    resp = requests.get(URL.format('/taxies'))
    _pprint(resp)

if __name__ == '__main__':
    main()

