#!/bin/bash

HASH=`git log --pretty=format:%h  HEAD^..HEAD`
CDATE=`git log --pretty=format:%ci  HEAD^..HEAD`

m4 -d -DHASH="${HASH}" -DCDATE="${CDATE}" 
