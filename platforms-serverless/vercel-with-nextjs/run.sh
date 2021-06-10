#!/bin/sh

set -eu

export PRISMA_TELEMETRY_INFORMATION='e2e-tests platforms vercel-with-nextjs build'
yarn
export VERCEL_PROJECT_ID=$VERCEL_WITH_NEXTJS_PROJECT_ID
export VERCEL_ORG_ID=$VERCEL_WITH_NEXTJS_ORG_ID
echo "VERCEL_PROJECT_ID: $VERCEL_PROJECT_ID"
echo "VERCEL_ORG_ID: $VERCEL_ORG_ID"

# checks whether PRISMA_FORCE_NAPI has length equal to zero
if [[ -z "${PRISMA_FORCE_NAPI+x}" ]]; then
  yarn -s vercel --token=$VERCEL_TOKEN --prod --scope=prisma --confirm 1> deployment-url.txt
else
  yarn -s vercel --token=$VERCEL_TOKEN --env PRISMA_FORCE_NAPI=true --build-env PRISMA_FORCE_NAPI=true --prod --scope=prisma --confirm 1> deployment-url.txt
fi

echo ''
cat deployment-url.txt
DEPLOYED_URL=$( tail -n 1 deployment-url.txt )
echo ''
echo "Deployed to ${DEPLOYED_URL}"

sleep 15
