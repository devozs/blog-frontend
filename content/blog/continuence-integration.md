---
order: 2
title: 'Continuences Integration!'
description: 'Test, Build, Containerize and Push!'
img: 'img/ci.png'
tags: [CI, Test, Build, Docker, ContainerRegistry, GitHub]
---

::InfoBox{type=""}
[Show Me The Code!](https://github.com/devozs/blog-frontend)
::

## Guidelines

In the forthcoming blog post, we'll explore the deployment of a Nuxt 3 (Vue 3) application running on a Node.js environment. Our focus will be on setting up a comprehensive CI pipeline, encompassing tasks such as testing, building, Docker containerization, and pushing an image to a container registry.

To achieve this, I've used [GitHub Actions](https://github.com/features/actions) as the CI workflow. Nevertheless, it's important to highlight that you have the flexibility to opt for different tools according to your requirements, whether it's Jenkins, Gitlab CI, or any other CI solution that aligns with your preferences.


::InfoBox{type="warning"}
Container Registry Prepeartion!

#details
I've chosen to use GitHub Packages as the container registry to store the application image. However, it's essential to note that you have the flexibility to opt for alternative container registries such as Docker Hub, Azure Container Registry, and others if you prefer.[More information can be found here](https://github.com/features/packages)
::

## Dockerfile

As previously mentioned, we're working with a Node.js application, which is why we're using the node:17 parent image.

In the following lines, we'll be copying the necessary files into the container, exposing a container port, and configuring the entry point to run the server.
```docker
FROM node:17-alpine

RUN mkdir -p /usr/src/nuxt-app
WORKDIR /usr/src/nuxt-app
COPY . .

RUN npm ci && npm cache clean --force
RUN npm run build

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

EXPOSE 3000

ENTRYPOINT ["node", ".output/server/index.mjs"]
```

## CI Workflow
We are using GitHub Action for the CI pipeline implementation.

GitHub search workflow yamls under the repository location: ***.github/workflows***.
We've created a workflow named ***buildAndPush.yaml***
::InfoBox{type="code"}
Full buildAndPush.yaml

#details
```yaml
name: Blog Frontend - Test, Build and Push

on:
  workflow_dispatch:
  push:
    branches:
      - 'main'
jobs:
  test:
    runs-on: ubuntu-latest
    
    permissions:
      contents: read
      pull-requests: write

    steps:
    - uses: actions/checkout@v3

    - name: 'Install Node'
      uses: actions/setup-node@v3
      with:
        node-version: '17'

    - name: 'Install Deps'
      run: |
        npm install
        npm run build

    - name: 'Test'
      run: npx vitest --coverage

    - name: 'Report Coverage'
      if: always() # Also generate the report if tests are failing
      uses:  davelosert/vitest-coverage-report-action@v2

  build-push:
    needs: test
    env:
      REGISTRY: ghcr.io/devozs
      IMAGE: blog-frontend
    runs-on: ubuntu-latest
    steps:
      - name: "Checkout GitHub Action"
        uses: actions/checkout@v3

      - name: Generate build ID
        id: prep
        run: |
            branch=${GITHUB_REF##*/}
            sha=${GITHUB_SHA::8}
            ts=$(date +%s)
            echo "BUILD_ID=${branch}-${sha}-${ts}" >> $GITHUB_OUTPUT
      - name: Set up QEMU
        uses: docker/setup-qemu-action@v2

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: "Build"
        run: |
          docker build -f Dockerfile . -t ${{ env.IMAGE }}:${{ steps.prep.outputs.BUILD_ID }}

      - name: Log in to the Container registry
        uses: docker/login-action@v2
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: "Docker Push"
        run: |
          docker tag ${{ env.IMAGE }}:${{ steps.prep.outputs.BUILD_ID }} ${{ env.REGISTRY }}/${{ env.IMAGE }}:${{ steps.prep.outputs.BUILD_ID }}
          docker push ${{ env.REGISTRY }}/${{ env.IMAGE }}:${{ steps.prep.outputs.BUILD_ID }}
```
::

### Setup Action
We've breaken our pipline into two main parts (jobs in GitHub Action terminology): ***test*** and ***build-push***.
- test: We've implemented simple unit and component tests in this example. These tests are included to demonstrate where and how to place tests before proceeding to the build phase.
- build-push: In this phase, we build the container using the Dockerfile described in the previous section and push it to the GitHub registry. This job stars running only after a succesful complition of test phase.

### Unit / Compoenent Tests
Basic testing implementation helps demonstrate a separate phase before triggering the build-push phase. This prevents images from being pushed into the registry in case the tests fail or are invalid.

::InfoBox{type="warning"}
This is just an example; in a real-case scenario, there should be many more meaningful funtional and non-functional tests!
::

```yaml
    - name: 'Install Deps'
      run: |
        npm install
        npm run build

    - name: 'Test'
      run: npx vitest --coverage

    - name: 'Report Coverage'
      if: always() # Also generate the report if tests are failing
      uses:  davelosert/vitest-coverage-report-action@v2
```

### Build Docker
We are using the branch name, commit SHA, and timestamp to compose the image tag (we'll use this later as part of the continuous deployment tutorial).

::InfoBox{type="error"}
Don't use your Docker credentials as plain text! 
#details
Keep the username and passwords as secrets or use another method to ensure they are not visible as plain text in your pipeline (I've used GitHub secrets).
::

We are building the image using the ***docker build*** command against the Dockerfile mentioned above and tagging it with ***-t*** using the tagging logic described earlier.


```bash
      - name: "Build"
        run: |
          docker build -f Dockerfile . -t ${{ env.IMAGE }}:${{ steps.prep.outputs.BUILD_ID }}
```

### Push to Registry

Login is required for GitHub Packages access with write permissions since we are pushing an image to the registry.

Then we use the images created in the previous step, tag them with the GitHub Container Registry prefix and/or the organization (ghcr.io/devozs) using the ***docker tag*** command, and finally push them into the registry with ***docker push***.

```bash
      - name: "Build"
        run: |
          docker build -f Dockerfile . -t ${{ env.IMAGE }}:${{ steps.prep.outputs.BUILD_ID }}

      - name: Log in to the Container registry
        uses: docker/login-action@v2
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: "Docker Push"
        run: |
          docker tag ${{ env.IMAGE }}:${{ steps.prep.outputs.BUILD_ID }} ${{ env.REGISTRY }}/${{ env.IMAGE }}:${{ steps.prep.outputs.BUILD_ID }}
          docker push ${{ env.REGISTRY }}/${{ env.IMAGE }}:${{ steps.prep.outputs.BUILD_ID }}
```

## Validation

Verify that the image exists in GitHub Packages (or any other container registry you are working with) with the relevant tag.
![Alt text](/content/blog-frontend-image.png "blog-frontend image in Github Registry")
