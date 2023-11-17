extension="bz2"

curdir=$(pwd)

echo "Showing zipped files (not extracting! just viewing!)"

echo

while read root; do

  while read folder; do

    echo "$root/$folder"

    cd ../$root/$folder

    tar -tvjf "/$curdir/compressed-files/$root-$folder.$extension"

    cd $curdir

  done <"folders-lists/$root-folders-list.txt"

done <"folders-lists/root-folders-list.txt"

echo "Remove backup files"

echo

echo "Showing zipped files (not extracting! just viewing!)"
