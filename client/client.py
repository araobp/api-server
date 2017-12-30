import pprint
import requests

URL = 'http://localhost:18080{}'

s1 = {'carId': 'taxi7',
      'deviceId': 'device9',
      'result': 'SUCCESS'}

def main():

    resp = requests.get(URL.format('/drivers/driver1'))
    pprint.pprint(resp.json())

    resp = requests.put(URL.format('/drivers/driver5'))

    resp = requests.get(URL.format('/drivers/driver5'))
    pprint.pprint(resp.json())

    resp = requests.get(URL.format('/drivers'))
    pprint.pprint(resp.json())

    resp = requests.get(URL.format('/taxies'))
    pprint.pprint(resp.json())

if __name__ == '__main__':
    main()

