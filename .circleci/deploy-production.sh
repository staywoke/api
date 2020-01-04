#!/usr/bin/env bash

cat >> ~/.ssh/config  << EOF
VerifyHostKeyDNS yes
StrictHostKeyChecking no
EOF

ssh -T staywoke@api.staywoke.org << EOF

echo -e "\n\033[38;5;34m✓ StayWoke › Starting Production Deployment\033[0m\n"

export API_NODE_ENV=production

echo -e "\n\033[38;5;34m✓ StayWoke › Updating Production Repository\033[0m\n"

cd /var/www/api.staywoke.org/html

git fetch --tags

if [ -n "$(git describe --tags $(git rev-list --tags --max-count=1))" ]; then
    echo -e "\n\033[38;5;34m✓ StayWoke › Preparing to Upgrade to $(git describe --tags $(git rev-list --tags --max-count=1))\033[0m\n"

    git reset --hard
    git stash
    git checkout $(git describe --tags $(git rev-list --tags --max-count=1))

    echo -e "\n\033[38;5;34m✓ StayWoke › Update NPM Packages\033[0m\n"

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
else
  echo -e "\n\033[38;5;34m✓ StayWoke › No Tagged Release\033[0m\n"
fi

echo -e "\n\033[38;5;34m✓ StayWoke › Production Deployment Complete\033[0m\n"

EOF