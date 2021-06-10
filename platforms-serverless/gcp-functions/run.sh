#!/bin/sh

set -eux

# just make sure this variable is set because gcloud expects it to be set
echo "$GCP_FUNCTIONS_ACCOUNT"

# When PRISMA_FORCE_NAPI is set, overwrite existing schema file with one that enables the napi preview feature
if [[ -z "${PRISMA_FORCE_NAPI+x}" ]]; then
  mv prisma/schema-with-napi.prisma prisma/schema.prisma
fi

yarn install

yarn prisma generate

yarn tsc

func="e2e-test-$(date "+%Y-%m-%d-%H%M%S")"
echo "$func" > func-tmp.txt

# checks whether PRISMA_FORCE_NAPI has length equal to zero
if [[ -z "${PRISMA_FORCE_NAPI+x}" ]]; then
  gcloud functions deploy "$func" --runtime nodejs10 --trigger-http --entry-point=handler --allow-unauthenticated --verbosity debug --set-env-vars GCP_FUNCTIONS_PG_URL=$GCP_FUNCTIONS_PG_URL,PRISMA_TELEMETRY_INFORMATION='e2e-tests platforms azure functions linux gcp functions env'
else
  gcloud functions deploy "$func" --runtime nodejs10 --trigger-http --entry-point=handler --allow-unauthenticated --verbosity debug --set-env-vars GCP_FUNCTIONS_PG_URL=$GCP_FUNCTIONS_PG_URL,PRISMA_TELEMETRY_INFORMATION='e2e-tests platforms azure functions linux gcp functions env',PRISMA_FORCE_NAPI='true',DEBUG='prisma*'
fi

