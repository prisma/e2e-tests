# Yarn workspaces

Tests `yarn` using yarn's workspace functionality, using a top-level lockfile
and a Prisma sub-project.

## How to run this locally

### Environment variables

The environment variable `PACKAGERS_YARN_WORKSPACES_PG_URL` should point to a postgres database.
In CI, it uses our internal e2e test database using `packagers-yarn-workspaces` as database URL.
Please check our internal 1Password for a ready-to-use environment variable or 
set up your own database and set the environment variable accordingly.

### Run tests

```shell script
sh run.sh
```
