#!/bin/sh

set -eux

yarn set version berry
yarn ts-node ./script.ts
