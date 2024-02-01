#!/bin/sh

set -eux

export DEBUG="*"
export RUST_BACKTRACE=full

# We want to make sure this runs on M1, so we check the architecture
node m1.js

pnpm install
pnpm prisma generate
