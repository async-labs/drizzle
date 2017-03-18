#!/bin/bash

echo ""
read -p "Do you wish to install required nodejs libraries? (y/n) " RESP

if [ "$RESP" = "y" ]; then
  echo -e "INSTALLING widget/package.json"
  cd widget && meteor npm install
  echo -e "INSTALLING widget/package.json                                         DONE"

  echo -e "INSTALLING widgetFile/package.json"
  cd ../widgetFile && npm install
  cd ../
  echo -e "INSTALLING widgetFile/package.json                                       DONE"
else
  echo -e "INSTALLING required nodejs libraries ...                             SKIP"
fi


#
# widgetFile/settings.json create
#
echo ""
read -p "Do you wish to create widgetFile/settings.json? (y/n) " RESP

if [ "$RESP" = "y" ]; then
    echo "{
  \"API_URL\": \"http://localhost:8051\"
}"> ./widgetFile/settings.json

    echo -e "CREATING widgetFile/settings.json ...                                  DONE"
else
    echo -e "CREATING widgetFile/settings.json ...                                  SKIP"
fi
