#!/bin/bash

cd widget/
MONGO_URL=mongodb://127.0.0.1:27017/zenmarket meteor --port 8051 --settings local-settings.json & pid=$!
PID_LIST+=" $pid";


cd ../publisher/
python -m SimpleHTTPServer 8060 & pid=$!
PID_LIST+=" $pid";


cd ../widgetFile/
python -m SimpleHTTPServer 8070 & pid=$!
PID_LIST+=" $pid";

gulp & pid=$!
PID_LIST+=" $pid";

trap "kill $PID_LIST" SIGINT

echo "Parallel processes have started";

wait $PID_LIST

echo
echo "All processes have completed";
