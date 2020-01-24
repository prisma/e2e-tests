#!/bin/sh

set -eu

mkdir -p ~/.ssh
echo "$SSH_KEY_NETLIFY_ZISHI" > ~/.ssh/id_rsa
chmod 600 ~/.ssh/id_rsa
ssh-keyscan github.com >> ~/.ssh/known_hosts

git config --global user.email "prismabots@gmail.com"
git config --global user.name "Prismo"

git init
git remote add origin "git@github.com:divyenduz/netlify-zishi.git" 
git add .
git commit -m "push to netlify"
git push origin master --force
rm -rf .git

sleep 240 # Enough time for the netlify build to go through
sh test.sh
