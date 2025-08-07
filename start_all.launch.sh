#!/bin/bash

kill_process_on_port() {
    lsof -i :$1 | awk 'NR!=1 {print $2}' | xargs kill -9
}

cd ~/web
node server.js &

roslaunch rplidar_ros rplidar.launch &

sleep 4


roslaunch hector_slam_launch tutorial.launch &

sleep 4

roslaunch rosbridge_server rosbridge_websocket.launch &

sleep 2

wait
