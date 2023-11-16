extension="tar.gz"

echo "Restore started..."

echo

echo "Extracting backup files"

echo

folder_group="exports"

echo "$folder_group"

while read p; do

  echo " - $p"

  tar -Pxjf "$folder_group-$p.$extension"

done <"$folder_group-folders-list"

folder_group="uploads"

echo

echo "$folder_group"

while read p; do

  echo " - $p"

  tar -Pxjf "$folder_group-$p.$extension"

done <"$folder_group-folders-list"

echo

echo "Remove backup files"

rm *.$extension

echo

echo "Restore process complete"
