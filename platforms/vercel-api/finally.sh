#!/bin/sh

set -eu

yarn vercel logs e2e-vercel-api.vercel.app --token=$VERCEL_TOKEN --scope=prisma
