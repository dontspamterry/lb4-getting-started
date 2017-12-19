#!/bin/bash

DOCKER_DYNAMODB_IMAGE="dwmkerr/dynamodb"
DOCKER_TERRAFORM_IMAGE="hashicorp/terraform"

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
  mkdir -p ${HOME}/docker/mounts/dynamodb/data
fi

DOCKER_CONTAINER_NAME=`whoami`-local-dynamodb

echo "DOCKER_CONTAINER_NAME = ${DOCKER_CONTAINER_NAME}"

if [ ! "$(docker ps -q -f name=${DOCKER_CONTAINER_NAME})" ]; then
    if [ "$(docker ps -aq -f status=exited -f name=${DOCKER_CONTAINER_NAME})" ]; then
        # cleanup
        echo "Docker container ${DOCKER_CONTAINER_NAME} exists, but exitted. Cleaning up"
        docker rm ${DOCKER_CONTAINER_NAME}
    fi

    echo "Launching docker container ${DOCKER_CONTAINER_NAME}"
    # run your container
    docker run -d --name ${DOCKER_CONTAINER_NAME} -v ${DATA_MOUNT_DIR}:/data -p 8008:8000 ${DOCKER_DYNAMODB_IMAGE} -dbPath /data
fi

