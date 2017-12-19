#!/usr/bin/env bash

DOCKER_DYNAMODB_IMAGE="dwmkerr/dynamodb"
DOCKER_TERRAFORM_IMAGE="hashicorp/terraform:full"
DOCKER_HOST_PORT=8008

# Check if Terraform is installed. We won't need this if we get the Terraform container talking to the DynamoDB container
IS_TERRAFORM_INSTALLED=`which terraform`
if [ -z "${IS_TERRAFORM_INSTALLED}" ]; then
    echo "No terraform installation found. Please install Terraform either via 'brew install terraform' or via https://www.terraform.io/downloads.html"
    exit 1
fi

if [[ "$(docker images -q ${DOCKER_DYNAMODB_IMAGE} 2> /dev/null)" == "" ]]; then
  # do something
  echo "Docker image ${DOCKER_DYNAMODB_IMAGE} not found locally"
  docker pull ${DOCKER_DYNAMODB_IMAGE}
fi

if [[ "$(docker images -q ${DOCKER_TERRAFORM_IMAGE} 2> /dev/null)" == "" ]]; then
  # do something
  echo "Docker image ${DOCKER_TERRAFORM_IMAGE} not found locally"
  docker pull ${DOCKER_TERRAFORM_IMAGE}
fi

export AWS_SECRET_ACCESS_KEY=`whoami`-secret
export AWS_ACCESS_KEY_ID=`whoami`

echo "AWS_ACCESS_KEY_ID = ${AWS_ACCESS_KEY_ID}"
echo "AWS_SECRET_ACCESS_KEY = ${AWS_SECRET_ACCESS_KEY}"


DATA_MOUNT_DIR=${HOME}/docker/mounts/dynamodb

if [ ! -d "${DATA_MOUNT_DIR}" ]; then
  # Control will enter here if $DIRECTORY doesn't exist.
  # Create a mount directory under user's home to store DB files
  echo "Creating ${DATA_MOUNT_DIR}"
  mkdir -p ${DATA_MOUNT_DIR}
fi

DOCKER_CONTAINER_NAME=`whoami`-local-dynamodb

echo "DOCKER_CONTAINER_NAME = ${DOCKER_CONTAINER_NAME}"

if [ ! "$(docker ps -q -f name=${DOCKER_CONTAINER_NAME})" ]; then
    if [ "$(docker ps -aq -f status=exited -f name=${DOCKER_CONTAINER_NAME})" ]; then
        # cleanup
        echo "Docker container '${DOCKER_CONTAINER_NAME}' exists, but exited. Cleaning up"
        docker rm ${DOCKER_CONTAINER_NAME}
    fi

    echo "Launching docker container ${DOCKER_CONTAINER_NAME}"
    # run your container
    docker run -d --name ${DOCKER_CONTAINER_NAME} -v ${DATA_MOUNT_DIR}:/data -p ${DOCKER_HOST_PORT}:8000 ${DOCKER_DYNAMODB_IMAGE} -dbPath /data
fi

TERRAFORM_MOUNT_DIR=${HOME}/docker/mounts/terraform
if [ ! -d "${TERRAFORM_MOUNT_DIR}" ]; then
  # Control will enter here if $DIRECTORY doesn't exist.
  # Create a mount directory under user's home to store local Terraform state
  echo "Creating ${TERRAFORM_MOUNT_DIR}"
  mkdir -p ${TERRAFORM_MOUNT_DIR}
fi

echo "Copying Terraform files to ${TERRAFORM_MOUNT_DIR}"
cp -rf terraform/*.tf ${TERRAFORM_MOUNT_DIR}

cd ${TERRAFORM_MOUNT_DIR}

echo "Initializing Terraform state"
export TF_VAR_aws_access_key=${AWS_ACCESS_KEY_ID}
export TF_VAR_db_port=${DOCKER_HOST_PORT}
terraform init
#docker run --net=host -i -t -e AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID} -e AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY} \
#-e TF_VAR_db_port=${DOCKER_HOST_PORT} -e TF_VAR_aws_access_key=${AWS_ACCESS_KEY} -v ${TERRAFORM_MOUNT_DIR}:/app/ -w /app/ ${DOCKER_TERRAFORM_IMAGE} init

echo "Planning Terraform deploy"
terraform plan
#docker run --net=host -i -t -e AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID} -e AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY} \
#-e TF_VAR_db_port=${DOCKER_HOST_PORT} -e TF_VAR_aws_access_key=${AWS_ACCESS_KEY} -v ${TERRAFORM_MOUNT_DIR}:/app/ -w /app/ ${DOCKER_TERRAFORM_IMAGE} plan

echo "Applying Terraform plan"
terraform apply
#docker run --net=host -i -t -e AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID} -e AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY} \
#-e TF_VAR_db_port=${DOCKER_HOST_PORT} -e TF_VAR_aws_access_key=${AWS_ACCESS_KEY} -v ${TERRAFORM_MOUNT_DIR}:/app/ -w /app/ ${DOCKER_TERRAFORM_IMAGE} apply

