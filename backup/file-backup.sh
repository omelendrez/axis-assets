rm *.gz

days=-180

echo "Backup started..."
echo

echo "Generate files list to compress"

echo

folder_group="exports"

echo "$folder_group"
while read f; do

  echo " - $f"

  find "./../$folder_group/$f" -mtime $days $(printf "! -name %s " $(cat skip_files)) -not -path "./../$folder_group/$f" -and -not -path "./../$folder_group/$f/csv" >"$folder_group-$f"

done <$folder_group-folders-list

folder_group="uploads"

echo "$folder_group"

while read f; do

  echo " - $f"

  find "./../$folder_group/$f" -mtime $days $(printf "! -name %s " $(cat skip_files)) -not -path "./../$folder_group/$f" >"$folder_group-$f"

done <"$folder_group-folders-list"

echo

echo "Compress selected files"
echo
folder_group="exports"

echo "$folder_group"

while read f; do

  echo " - $f"

  while read l; do

    tar -cjf "$folder_group-$f.tar.gz" "$l"

  done <"$folder_group-$f"

done <"$folder_group-folders-list"

folder_group="uploads"

echo "$folder_group"

while read f; do

  echo " - $f"

  while read l; do

    tar -cjf "$folder_group-$f.tar.gz" "$l"

  done <"$folder_group-$f"

done <"$folder_group-folders-list"

echo
echo "Pushing files to GitHub repository."
echo

git add .
git commit -m "Add backup files as of $(date +"%d/%m/%Y")"
git push

echo "Backup process complete"
