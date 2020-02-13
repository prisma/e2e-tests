#!/bin/sh

set -eux

func="$1"

yarn install
yarn tsc
yarn prisma2 generate

# use a new function name in index.js since Google reads function names from js files
# however, we need to use different functions for each deploy to prevent clashes
sed -i'.bak' "s/__FIREBASE_FUNCTION_NAME__/$func/g" index.js
