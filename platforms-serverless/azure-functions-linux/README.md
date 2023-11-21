# Azure Functions Linux

Tests Azure Functions in a Linux environment.

## Notes

Logs are not streamed to the CLI or CI for Azure Functions, so you'll have to log in to their portal and check the logs manually. You can also set up the Azure VS Code extension which is able to stream logs.

## How to run this locally

### Install the Azure CLI

- [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)

(The Azure Functions Core Tools are installed via Npm)

### Login

If you have a root login and you're on a local system where a browser can be opened interactively, you can run this:

```shell script
az login
```

#### Service Principal 

Without login for Azure, you can use a service principal.

(It was initially created with `sh rbac.sh`.)

```shell script
az login --service-principal -u "$AZURE_SP_NAME" -p "$AZURE_SP_PASSWORD" --tenant "$AZURE_SP_TENANT"
```

AZURE_SP_NAME = the name of the service principal  
AZURE_SP_PASSWORD = the secret
AZURE_SP_TENANT = An Azure internal ID, visible in Azure Portal

Note: Client secret lifetime is limited (docs say: two years or less.)

##### Maintining the Service Principal

You can create new secrets for the service principal in Azure Portal under "App regristrations": https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationMenuBlade/~/Overview/appId/e6204f1a-d757-465f-9ddd-8d50a05c09c2/isMSAApp~/false

### Prepare

To create a function on your own account, run `sh create.sh` first.

### Cleaning up 

If you see an error like `ERROR: Number of sites in server farm 'WestEuropeLinuxDynamicPlan' exceeds the maximum allowed for 'Dynamic' SKU.`
You will need to delete old functions that failed and were not automatically cleaned up.

This is a very entertaining thing to do, you will meet a 🦥 API and party of rate limits 😉

```sh
az login

# List all functions ids
az functionapp list --resource-group prisma-e2e-linux --query "[].id" --output tsv

# Note that the following command will work in `fish` terminal specifically
fish

# This is a all-in-one command
# 1. It will find the ids of all functions
# 2. It will try to delete them and probably fail with a rate-limit error
# 3. This will be repeated every 1000 seconds until you stop it.
#
# Make sure to change the query year accordingly
watch -n 1000 az functionapp delete --verbose --ids (az functionapp list --resource-group prisma-e2e-linux --output tsv --query "[?contains(@.name, '-2023-')==`true`].id")
```
