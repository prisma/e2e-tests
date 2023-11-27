#!/bin/sh

set -eu

export PRISMA_TELEMETRY_INFORMATION='ecosystem-tests driver-adapters neon-http-vercel-nextjs-edgemw'

pnpm install

export VERCEL_ORG_ID=$VERCEL_ORG_ID
export VERCEL_PROJECT_ID=$DRIVER_ADAPTERS_NEON_HTTP_VERCEL_NEXTJS_EDGEMW_PROJECT_ID

echo "VERCEL_ORG_ID: $VERCEL_ORG_ID"
echo "VERCEL_PROJECT_ID: $VERCEL_PROJECT_ID"

pnpm vercel deploy \
--prod --yes --force \
--token=$VERCEL_TOKEN \
--build-env DEBUG="prisma:*" \
--env DRIVER_ADAPTERS_NEON_HTTP_VERCEL_NEXTJS_EDGEMW_DATABASE_URL=$DRIVER_ADAPTERS_NEON_HTTP_VERCEL_NEXTJS_EDGEMW_DATABASE_URL \
--scope=$VERCEL_ORG_ID 1> deployment-url.txt

echo ''
cat deployment-url.txt
DEPLOYED_URL=$( tail -n 1 deployment-url.txt )
echo ''
echo "Deployed to ${DEPLOYED_URL}"