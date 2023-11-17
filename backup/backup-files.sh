days=-180
extension="bz2"
curdir=$(pwd)

rm compressed-files/*.$extension

echo "Backup started..."

while read root; do

  while read folder; do

    echo " - $folder"

    cd ../$root/$folder

    tar --create --bzip2 --file="/$curdir/compressed-files/$root-$folder.$extension" --exclude-from="$curdir/skip_files" --newer-mtime="60 days ago" .

    cd $curdir

  done <"folders-lists/$root-folders-list.txt"

done <"folders-lists/root-folders-list.txt"

echo

echo
echo "Pushing files to GitHub repository."
echo

git add .
git commit -m "Add backup files as of  $(date +"%d/%m/%Y %H:%M") "
git push

echo

echo "Backup process complete"
