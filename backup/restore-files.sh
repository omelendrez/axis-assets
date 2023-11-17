extension="gz"

curdir=$(pwd)

echo "Restore started..."

echo

echo "Extracting backup files"

while read root; do

  while read folder; do

    echo "$root/$folder"

    cd ../$root/$folder

    tar --extract --verbose --file="/$curdir/compressed-files/$root-$folder.$extension"

    cd $curdir

  done <"folders-lists/$root-folders-list.txt"

done <"folders-lists/root-folders-list.txt"

echo

echo "Restore process complete"
