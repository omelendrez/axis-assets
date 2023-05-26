echo "======= Updating axis-assets server ======="
cd axis-assets
git pull
npm ci
cd ..

echo .
echo "======= Updating axis-backend server ======="
cd axis-backend
git pull
npm ci
cd ..

echo .
echo "======= Updating axis-data-conversion server ======="
cd axis-data-conversion
git pull
npm ci
cd ..

echo "======= Updating axis-frontend app ======="
cd axis-frontend
git pull
npm ci
npm run build
cd ..
echo "Done!"
