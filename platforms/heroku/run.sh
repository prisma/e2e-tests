#!/bin/sh

set -eux

# When PRISMA_CLIENT_ENGINE_TYPE is set to binary, overwrite existing schema file with one that sets the engineType to `binary`
if [ "$PRISMA_CLIENT_ENGINE_TYPE" == "binary" ]; then
  echo "Using Binary enabled schema"
  cp ./prisma/schema-with-binary.prisma ./prisma/schema.prisma
else
  echo "Using Node-API enabled schema"
  cp ./prisma/schema-with-node-api.prisma ./prisma/schema.prisma
fi

export PRISMA_TELEMETRY_INFORMATION='e2e-tests platforms heroku build'
yarn install
yarn prisma generate

git config --global user.email "prismabots@gmail.com"
git config --global user.name "Prismo"

git init
git remote add heroku "https://ignored_user:`heroku auth:token`@git.heroku.com/e2e-platforms-heroku.git" || git remote set-url heroku "https://ignored_user:`heroku auth:token`@git.heroku.com/e2e-platforms-heroku.git" || true
git add .
git commit -m "push to heroku"
git push heroku master --force
rm -rf .git
