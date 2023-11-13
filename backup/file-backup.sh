rm *.gz

folder_group="exports"

echo "$folder_group"
while read p; do
  echo " - $p"
  tar -czf "$folder_group-$p.tar.gz" --exclude="*.gitignore" "./../$folder_group/$p"
done < $folder_group-folders-list.txt

folder_group="uploads"

echo "$folder_group"
while read p; do
  echo " - $p"
  tar -czf "$folder_group-$p.tar.gz" --exclude="*.gitignore" "./../$folder_group/$p"
done < $folder_group-folders-list.txt

git add .
git commit -m "Add files backup"
git push


