
folder_group="exports"

echo "$folder_group"
while read p; do
  echo " - $p"

 tar -Pxzf "$folder_group-$p.tar.gz"

done < $folder_group-folders-list.txt

folder_group="uploads"

echo "$folder_group"
while read p; do
  echo " - $p"
   tar -Pxzf "$folder_group-$p.tar.gz"
done < $folder_group-folders-list.txt



