#!/bin/bash

set -eu
shopt -s inherit_errexit || true

export CI=true

dir=$1
project=$2
set +u
matrix=$3
set -u

# In platforms/firebase-functions, the file exists in /functions sub-directory, so we can't hardcode the package.json path
pjson_path=$(find $dir/$project -name "package.json" ! -path "*/node_modules/*" | head -n 1)
bash .github/scripts/print-version.sh $pjson_path

cd .github/slack/
yarn install
cd ../..

root=$(pwd)

echo ""
echo ""
echo "-----------------------------"
echo "running $dir/$project"

cd "$dir/$project"

if [ -f "prepare.sh" ]; then
  echo "-----------------------------"
  echo ""
  echo "prepare script found, executing $dir/$project/prepare.sh"
  echo ""

  bash prepare.sh

  echo ""
  echo "finished prepare.sh"
  echo ""
  echo "-----------------------------"
fi

echo ""
echo ""
echo "-----------------------------"
echo "executing $dir/$project/run.sh"
set +e
bash run.sh
code=$?
set -e

if [ $code -eq 0 ]; then
  echo "-----------------------------"
  echo ""
  echo "run.sh was successful (code $code), running $dir/$project/test.sh..."
  echo ""

  if [ ! -f "test.sh" ]; then
    echo "$dir/$project/test.sh does not exist, please create it"
    exit 1
  fi

  set +e
  bash test.sh
  code=$?
  set -e

  echo ""
  echo "finished test.sh (code $code)"
  echo ""
  echo "-----------------------------"
fi

if [ -f "finally.sh" ]; then
  echo "-----------------------------"
  echo ""
  echo "finally script found, executing $dir/$project/finally.sh"
  echo ""

  bash finally.sh

  echo ""
  echo "finished finally.sh"
  echo ""
  echo "-----------------------------"
fi

echo "$dir/$project done"

cd "$root"

if [ "$GITHUB_REF" = "refs/heads/dev" ] || [ "$GITHUB_REF" = "refs/heads/integration" ] || [ "$GITHUB_REF" = "refs/heads/patch-dev" ] || [ "$GITHUB_REF" = "refs/heads/latest" ]; then
  (cd .github/slack/ && yarn install --silent)

  branch="${GITHUB_REF##*/}"
  sha="$(git rev-parse HEAD | cut -c -7)"
  short_sha="$(echo "$sha" | cut -c -7)"
  commit_link="\`<https://github.com/prisma/e2e-tests/commit/$sha|$branch@$short_sha>\`"
  workflow_link="<https://github.com/prisma/e2e-tests/actions/runs/$GITHUB_RUN_ID|$project $matrix>"

  export webhook="$SLACK_WEBHOOK_URL"
  version="$(cat .github/prisma-version.txt)"
  sha="$(git rev-parse HEAD | cut -c -7)"

  emoji=":warning:"
  if [ $code -eq 0 ]; then
    emoji=":white_check_mark:"
  fi

  echo "notifying slack channel"
  node .github/slack/notify.js "prisma@$version: ${emoji} $workflow_link ran (via $commit_link)"

  if [ $code -ne 0 ]; then
    export webhook="$SLACK_WEBHOOK_URL_FAILING"
    echo "notifying failing slack channel"
    node .github/slack/notify.js "prisma@$version: ${emoji} $workflow_link failed (via $commit_link)"
  fi
fi

echo "exitting with code $code"
exit $code
