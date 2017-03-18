#!/bin/bash

MONGO_URL=mongodb://demodb:demodb@ds043366-a0.mlab.com:43366,ds043366-a1.mlab.com:43366/paywall-demo?replicaSet=rs-ds043366 meteor --port 8021 --settings local-settings.json
