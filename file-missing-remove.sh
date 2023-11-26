#!/bin/bash

folder=$(basename $(pwd))

# ls -1 | grep -v -x -f ../$folder.txt | xargs -0 -P 0 rm -f

# Exit if the directory isn't found.

for i in *; do
  if ! grep -qxFe "$i" ../$folder.txt; then
    echo "Deleting: $i"
    # the next line is commented out.  Test it.  Then uncomment to removed the files
    rm "$i"
  fi
done
