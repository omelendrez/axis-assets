extension=".tar.gz"

folder_group="exports"

echo "$folder_group"

while read p; do

  echo " - $p"

  tar -Pxjf "$folder_group-$p$extension"

done <"$folder_group-folders-list"

folder_group="uploads"

echo "$folder_group"

while read p; do

  echo " - $p"

  tar -Pxjf "$folder_group-$p$extension"

done <"$folder_group-folders-list"

rm $extension
