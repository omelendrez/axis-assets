days=-180
extension="tar.gz"

rm *.$extension

echo "Backup started..."

echo

echo "Generate files list to compress"

echo

root="exports"

echo "$root"
while read folder; do

  echo " - $folder"

  cd ..

  find "$(pwd)/$root/$folder" -mtime $days $(printf "! -name %s " $(cat backup/skip_files)) -not -path "$root/$folder" -and -not -path "$root/$folder/csv" >"backup/$root-$folder"

  cd backup

done <"$root-folders-list"

root="uploads"

echo

echo "$root"

while read folder; do

  echo " - $folder"

  cd ..

  find "$(pwd)/$root/$folder" -mtime $days $(printf "! -name %s " $(cat backup/skip_files)) -not -path "$root/$folder" >"backup/$root-$folder"

  cd backup

done <"$root-folders-list"

echo

echo "Compress selected files"

echo

root="exports"

echo "$root"

while read folder; do

  echo " - $folder"

  tar -Pcz --file="$root-$folder.$extension" -T "$root-$folder"

done <"$root-folders-list"

echo

root="uploads"

echo

echo "$root"

while read folder; do

  echo " - $folder"

  tar -Pcz --file="$root-$folder.$extension" -T "$root-$folder"

done <"$root-folders-list"

echo
echo "Pushing files to GitHub repository."
echo

git add .
git commit -m "Add backup files as of  $(date +"%d/%m/%Y %H:%M") "
git push

echo

echo "Backup process complete"
