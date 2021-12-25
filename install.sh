#!/bin/bash

# install node_modules for zone-mta
cd ./zone-mta
npm install
npm audit fix
cd ..

# install node_modules for wildduck
cd ./wildduck
npm install
npm audit fix
cd ..

# install node_modules for api
cd ./wildduck
npm install
npm audit fix
cd ..
