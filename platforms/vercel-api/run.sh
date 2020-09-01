#!/bin/sh

set -eu

export PRISMA_TELEMETRY_INFORMATION='e2e-tests platforms vercel-api build'
yarn
export VERCEL_PROJECT_ID=$VERCEL_API_PROJECT_ID
export VERCEL_ORG_ID=$VERCEL_API_ORG_ID
echo "VERCEL_PROJECT_ID: $VERCEL_PROJECT_ID"
echo "VERCEL_ORG_ID: $VERCEL_ORG_ID"
yarn vercel --token=$VERCEL_TOKEN --prod --scope=prisma --confirm
sleep 15
