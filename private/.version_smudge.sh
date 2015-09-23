#!/bin/bash

HASH=`git log --pretty=format:%h  HEAD^..HEAD|head -n1`
CDATE=`git log --pretty=format:%ci  HEAD^..HEAD|head -n1`

m4 -d -DHASH="${HASH}" -DCDATE="${CDATE}" -DBUILDNUMBER="${CI_BUILD_ID}"
