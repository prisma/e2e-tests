# Serverless Lambda

AWS Lambda using the serverless framework.

## How to run this locally

### Install the serverless CLI

```shell script
curl -o- -L https://slss.io/install | bash
```

Fore more information, check [the official docs](https://serverless.com/framework/docs/getting-started/).

### Authenticate

- `AWS_DEFAULT_REGION`: The AWS region name. In Prisma's case, this is `eu-central-1`.
- `AWS_ROLE`: The aws role, e.g. `arn:aws:iam::<id>:role/service-role/<role-id>`.
- `AWS_SECRET_ACCESS_KEY`: The AWS secret.
- `AWS_ACCESS_KEY_ID`: The AWS access key id.

Check 1Password for the values for our e2e account.

### Environment variables

The environment variable `SERVERLESS_LAMBDA_PG_URL` should point to a postgres database.
In CI, it uses our internal e2e test database using `platform-serverless-lambda` as database URL.
Please check our internal 1Password E2E vault for a ready-to-use environment variable or  
set up your own database and set the environment variable accordingly.

### Run rests

```shell script
sh run.sh
```
