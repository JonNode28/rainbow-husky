docker build -t rainbow-husky-build-image .
docker tag rainbow-husky-build-image 519396255280.dkr.ecr.eu-west-1.amazonaws.com/rainbow-husky-ecr-863f7ee

aws ecr get-login-password --region eu-west-1 | docker login --username AWS --password-stdin 519396255280.dkr.ecr.eu-west-1.amazonaws.com/rainbow-husky-ecr-863f7ee

docker push 519396255280.dkr.ecr.eu-west-1.amazonaws.com/rainbow-husky-ecr-863f7ee
