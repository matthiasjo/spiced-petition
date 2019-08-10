#!/bin/sh
node /opt/beeDocker/index.js
/usr/sbin/crond -f -d 0
