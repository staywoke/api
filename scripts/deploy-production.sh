#!/bin/bash

ssh -i id_6b807e557c63097610e78edbac36506f staywoke@67.205.176.176 << EOF

echo -e "\n\033[38;5;34m✓ StayWoke › Automated Deployment\033[0m\n"

export API_NODE_ENV=production

echo -e "\n\033[38;5;34m✓ StayWoke › Updating Repository\033[0m\n"

cd /staywoke/www/api.staywoke.org/html/
git checkout --force master
git pull

echo -e "\n\033[38;5;34m✓ StayWoke › Update NPM Package\033[0m\n"

npm install --no-optional

echo -e "\n\033[38;5;34m✓ StayWoke › Migrate Database\033[0m\n"

npm run migrate

echo -e "\n\033[38;5;34m✓ StayWoke › Seed Database\033[0m\n"

npm run seed

echo -e "\n\033[38;5;34m✓ StayWoke › Update Elasticsearch\033[0m\n"

npm run elasticsearch:delete
npm run elasticsearch:create
npm run elasticsearch:update

echo -e "\n\033[38;5;34m✓ StayWoke › Generate Documentation\033[0m\n"

npm run docs:clean
npm run docs

echo -e "\n\033[38;5;34m✓ StayWoke › Deployment Complete\033[0m\n"

EOF