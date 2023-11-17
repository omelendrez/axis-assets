days=-180
extension="tar.gz"

rm *.$extension

echo "Backup started..."

while read root; do

  while read folder; do

    echo " - $folder"

    tar -Pcj --file="$root-$folder.$extension" -T "$root-$folder"

  done <"$root-folders-list.txt"

done <"root-folders-list.txt"

echo

echo
echo "Pushing files to GitHub repository."
echo

git add .
git commit -m "Add backup files as of  $(date +"%d/%m/%Y %H:%M") "
git push

echo

echo "Backup process complete"
