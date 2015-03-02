#!/bin/sh
sed -e 's/"version": "[a-f0-9]*"/"version": "HASH"/;s/"date": "[-+: 0-9]*"/"date": "CDATE"/'

