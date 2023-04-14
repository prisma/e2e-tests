#!/bin/sh

set -eux

VERSION=$(cat ../../.github/prisma-version.txt)

# we remove the lockfile to make sure that the install works without it
# when no lockfile is found in a project, we will use npm for installs
# currently, the root lockfile interferes with the detection, remove it
rm ../../pnpm-lock.yaml
rm package-lock.json

# global instead instead
npm install -g prisma@$VERSION
prisma generate
