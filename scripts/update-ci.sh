#! /bin/sh

set -eu

mkdir -p ~/.ssh
echo "$SSH_KEY" > ~/.ssh/id_rsa
chmod 600 ~/.ssh/id_rsa
ssh-keyscan github.com >> ~/.ssh/known_hosts

git config --global user.email "prismabots@gmail.com"
git config --global user.name "Prismo"

git remote add github "git@github.com:$GITHUB_REPOSITORY.git"
git fetch github "$1"
git reset --hard "github/$1"
git checkout "github/$1"

OLD_VERSION=$(cat .github/prisma-version.txt)
NEW_VERSION=$OLD_VERSION
TIME_START=$(date +%s)

while [ "$NEW_VERSION" = "$OLD_VERSION" ]
do
  # GitHub Actions workflow runs every 5 minutes, exit after 4 minutes
  if [ $(($(date +%s) - $TIME_START)) -gt 240 ]
  then
    echo "Exited after no new version was found after 4 minutes."
    exit 0
  fi

  NEW_VERSION=$(npm show prisma@$1 version)
done

echo "New version $NEW_VERSION was found and will be used for the update."

git fetch github "dev"
git reset --hard "github/dev"

pnpm run update-all "$NEW_VERSION"

git commit -am "chore: update to prisma@$NEW_VERSION"
git push github "HEAD:refs/heads/$1" --force
