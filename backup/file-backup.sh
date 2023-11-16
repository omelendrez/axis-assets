days=-180
extension="tar.gz"

rm *.$extension

echo "Backup started..."

echo

echo "Generate files list to compress"

echo

folder_group="exports"

echo "$folder_group"
while read f; do

  echo " - $f"

  find "./../$folder_group/$f" -mtime $days $(printf "! -name %s " $(cat skip_files)) -not -path "./../$folder_group/$f" -and -not -path "./../$folder_group/$f/csv" >"$folder_group-$f"

done <"$folder_group-folders-list"

folder_group="uploads"

echo

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

  tar -cjf "$folder_group-$f.$extension" -T "$folder_group-$f"

done <"$folder_group-folders-list"

folder_group="uploads"

echo

echo "$folder_group"

while read f; do

  echo " - $f"

  tar -cjf "$folder_group-$f.$extension" -T "$folder_group-$f"

done <"$folder_group-folders-list"

echo
echo "Pushing files to GitHub repository."
echo

git add .
git commit -m "Add backup files as of  $(date +"%d/%m/%Y %H:%M") "
git push

echo

echo "Backup process complete"
