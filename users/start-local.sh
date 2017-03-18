#!/bin/bash

cd widget/
MONGO_URL=mongodb://demodb:demodb@ds043366-a0.mlab.com:43366,ds043366-a1.mlab.com:43366/paywall-demo?replicaSet=rs-ds043366 meteor --port 8051 --settings local-settings.json & pid=$!
PID_LIST+=" $pid";


cd ../publisher/
python -m SimpleHTTPServer 8060 & pid=$!
PID_LIST+=" $pid";


cd ../widgetFile/
gulp & pid=$!
PID_LIST+=" $pid";

trap "kill $PID_LIST" SIGINT

echo "Parallel processes have started";

wait $PID_LIST

echo
echo "All processes have completed";
