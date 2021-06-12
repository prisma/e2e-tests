#!/bin/sh

set -eu

echo "Sync: Syncing code to EC2"

echo "Sync: Removing local node_modules"
rm -rf ./code/node_modules

echo "Sync: Create remote folder"
ssh -tt -i ./server-key.pem administrator@207.254.29.83 'mkdir /Users/administrator/e2e-tests/$GITHUB_JOB/$GITHUB_RUN_ID'

echo "Sync: Copying new code to unique folder"
scp -i ./server-key.pem -rp ./code administrator@207.254.29.83:/Users/administrator/e2e-tests/$GITHUB_JOB/$GITHUB_RUN_ID

echo "sync-to-remote done"
