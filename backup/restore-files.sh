extension="tar.gz"

curdir=$(pwd)

echo "Restore started..."

echo

echo "Extracting backup files"

echo

root="exports"

echo "$root"

cd /

while read folder; do

  echo " - $folder"

  # tar -tvzf "$root-$folder.$extension"
  tar -Pxf "$curdir/$root-$folder.$extension"

done <"$curdir/$root-folders-list"

cd $curdir

root="uploads"

echo

echo "$root"

cd /

while read folder; do

  echo " - $folder"

  # tar -tvzf "$root-$folder.$extension"
  tar -Pxf "$curdir/$root-$folder.$extension"

done <"$curdir/$root-folders-list"

cd $curdir

echo

echo "Remove backup files"

rm *.$extension

echo

echo "Restore process complete"
