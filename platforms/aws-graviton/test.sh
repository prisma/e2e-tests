#!/bin/sh

set -eux

if [ "$PRISMA_CLIENT_ENGINE_TYPE" == "binary" ]; then
  echo "Node-API: Disabled"
  ssh -i ./server-key.pem ec2-user@54.72.209.131 -tt "
    cd /home/ec2-user/aws-graviton/$GITHUB_JOB/$GITHUB_RUN_ID/$PRISMA_CLIENT_ENGINE_TYPE;
    export PRISMA_CLIENT_ENGINE_TYPE=\"binary\"
    pnpm test;
    "
else
  echo "Node-API: Enabled"
  ssh -i ./server-key.pem ec2-user@54.72.209.131 -tt "
    cd /home/ec2-user/aws-graviton/$GITHUB_JOB/$GITHUB_RUN_ID/$PRISMA_CLIENT_ENGINE_TYPE;
    export PRISMA_CLIENT_ENGINE_TYPE=\"library\"
    pnpm test;
    "
fi
