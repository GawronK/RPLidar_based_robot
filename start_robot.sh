#!/bin/bash

kill_process_on_port() {
    lsof -i :$1 | awk 'NR!=1 {print $2}' | xargs kill -9
}

cd ~/web
python3 motor_control.py &

cd ~/web
python3 -m http.server 8000 &

cd ~/web
node server.js &
