#!/bin/sh

set -eu

npx ts-node ../../utils/fetch-retry-and-confirm-version.ts --url https://e2e-buildpack-pgbouncer.herokuapp.com/ --prisma-version $(sh ../../utils/prisma_version.sh)
