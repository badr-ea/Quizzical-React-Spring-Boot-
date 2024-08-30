echo "Switching to branch main"
git checkout main

echo "Building app..."
npm run build

echo "Adding changes to git"
git add .

echo "Committing changes"
git commit -m "Build and deployment commit"

echo "Pushing changes to remote repository"
git push origin main

echo "Deploying files to server..."
scp -P 27102 -r build/* badr@54.38.179.233:/var/www/html/react/

echo "Done"