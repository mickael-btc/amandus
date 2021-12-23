#!/bin/bash

# install node_modules for zone-mta
cd ./zone-mta
npm install
npm audit fix

# go to root folder
cd ..


