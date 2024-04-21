import datetime
import time
import socketio
from tgtg import TgtgClient
import sys
import json
import os
from dotenv import load_dotenv


load_dotenv()  # take environment variables from .env.

client = TgtgClient(access_token=os.environ.get("ACCESS_TOKEN"), refresh_token=os.environ.get("REFRESH_TOKEN"), user_id=os.environ.get("USER_ID"), cookie=os.environ.get("COOKIE"))

sio = socketio.Client()
sio.connect('http://localhost:8484')

enabled = True

while True:
    now = datetime.datetime.now()
    if(now.hour == 15 and now.minute <= 30):
        sio.emit('python-reset-message', 'reset')
    elif(now.hour >= 16 and now.hour < 22 and enabled):
        try:
            print("Waiting for server")
            response = client.get_items()
        except Exception as e:
            print('Error getting items: {}'.format(e))
            pass
        sio.emit('python-message', response)
        #print("response sent")
        str = '{}:{} response sent'.format(now.hour, now.minute)
        print(str)
        sleep_time = 60 * 1 #check every 1 min
    else:
        #print("Not the time yet! Sleeping...")
        str = '{}:{} is not the time yet! Sleeping...'.format(now.hour, now.minute)
        print(str)
        sleep_time = 60 * 30 #30 min
    time.sleep(sleep_time)
