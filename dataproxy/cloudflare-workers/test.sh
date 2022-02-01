#!/bin/sh

set -eu

DEPLOYMENT_URL=$(cat deployment-url.txt | grep -Eo "(https.*)\.workers\.dev$" --color=never)

export DEPLOYMENT_URL

echo $DEPLOYMENT_URL

yarn test
