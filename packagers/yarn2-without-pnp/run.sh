#!/bin/sh

set -eu

yarn set version berry

# To avoid this error 
# YN0028: │ The lockfile would have been modified by this install, which is explicitly forbidden.
YARN_ENABLE_IMMUTABLE_INSTALLS=0 yarn install

yarn prisma generate
