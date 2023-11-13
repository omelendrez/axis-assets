@echo off


for /f  %%f in (exports-folders-list.txt) do (
  echo %%f
    tar -czf "exports-%%f.tar.gz" --exclude="*.gitignore" "\webserver\tolmann\axis-assets\exports\%%f"
)


for /f  %%f in (uploads-folders-list.txt) do (
  echo %%f
    tar -czf "uploads-%%f.tar.gz" --exclude="*.gitignore" "\webserver\tolmann\axis-assets\uploads\%%f"
)
pause
