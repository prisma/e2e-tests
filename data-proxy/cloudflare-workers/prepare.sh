#!/usr/bin/env bash

export PRISMA_TELEMETRY_INFORMATION='e2e-tests data-proxy cloudflare-workers build'

source ../../utils/crypto/envVars.sh CF_ACCOUNT_ID CF_API_TOKEN CF_DATA_PROXY_URL

# we add the data proxy URL into the configuration file directly
echo "CF_DATA_PROXY_URL=\"$CF_DATA_PROXY_URL\"" >> wrangler.toml

# we tell prisma to generate with the dataproxy runtime enabled
export PRISMA_CLIENT_ENGINE_TYPE=dataproxy