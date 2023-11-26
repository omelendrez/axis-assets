#!/bin/bash

counter=1
limit=50

for file in $(git status --short | grep -v "??" | cut -d " " -f 3); do
  if [[ $c -gt $limit ]]; then
    exit 1
  fi
  echo $file
  git add $file

  ((c++))
done
