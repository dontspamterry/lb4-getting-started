# Provisioning Scripts

### provision-db.sh

##### Pre-requisites
* Install Docker
* Install Terraform. `TODO`: Use official hashicorp/terraform docker image instead, but this approach will require docker
networking setup to enable access to the DynamoDB container from the Terraform container

##### Execution
`$ ./provision-db.sh`

* utilizes your username to establish isolated location for DynamoDB and Terraform files
* DynamoDB files mounted at ${HOME}/docker/mounts/dynamodb
* Terraform files copied to and executed from ${HOME}/docker/mounts/terraform
* installs dwmkerr/dynamodb image and launches a container listening on host port 8008
* executes Terraform against this container to create the DynamoDB tables

**NOTE:** The DynamoDB docker image does not appear API-complete. When the Terraform plan is applied, you will
see `UnknownOperationException` for each of the tables being provisioned. Not sure what this unknown operation
is, but if you list the tables against the DynamoDB container, you will see that the tables are, in fact, created.
You can list the tables by bringing up the local DynamoDB shell at http://localhost:8008. Under the gear icon
in the upper-right corner, set the `Access Key Id` to be your username. To list the Dynamo tables, execute the
following JavaScript:

```aidl
var params = {};
console.log("Listing tables");
dynamodb.listTables(params, function(err, data) {
    if (err) ppJson(err); // an error occurred
    else ppJson(data); // successful response
});
```

You can also list the table via the AWS CLI, but you'll need to ensure your access key id is properly set and you use
http://localhost:8008 as your endpoint-url.

