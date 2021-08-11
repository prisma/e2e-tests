#!/bin/sh

set -eux

# just make sure this variable is set because gcloud expects it to be set
echo "$GCP_FUNCTIONS_ACCOUNT"


# When PRISMA_CLIENT_ENGINE_TYPE is set to `binary`, overwrite existing schema file with one that sets the engineType to 'binary'
if [ "$PRISMA_CLIENT_ENGINE_TYPE" == "binary" ]; then
  cp ./prisma/schema-with-binary.prisma ./prisma/schema.prisma
else
  # use the default schema at prisma/schema.prisma file
  true
fi

yarn install

yarn prisma generate

yarn tsc

func="e2e-test-$(date "+%Y-%m-%d-%H%M%S")"
echo "$func" > func-tmp.txt

gcloud functions deploy "$func" --runtime nodejs12 --trigger-http --entry-point=handler --allow-unauthenticated --verbosity debug --set-env-vars DATABASE_URL=$DATABASE_URL,PRISMA_TELEMETRY_INFORMATION='e2e-tests platforms azure functions linux gcp functions env'
