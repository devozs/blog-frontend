---
order: 3
title: 'Continuences Deployment!'
description: 'Use FluxCD, the GitOps way!'
img: 'img/cd.png'
tags: [CD, Deployment, FluxCD]
---

::InfoBox{type=""}
[Show me the Code!](https://github.com/devozs/blog-deployment/tree/main/gitops)
::

## Guidelines

In the previous tutorials, we set up the infrastructure (AKS via Terraform) and created a continuous integration workflow that builds a Node.js web application, containerizes it, and pushes the image to a container registry. In the upcoming blog post, we will implement continuous deployment with some GitOps characteristics, using this web application and AKS as our foundation.

The key GitOps principles we aim to illustrate include:
- Storing deployment manifests in a Git repository.
- Reconciling, pulling and applying changes within Kubernetes, rather than externally pushing changes into Kubernetes from a CD pipeline.
- listen to new image versions and update the relevant manifet with the updated tag.


To accomplish this, we'll leverage FluxCD as our chosen GitOps tool. Within FluxCD, we will make use of several automation capabilities, including image policies, image automation, and more.

::InfoBox{type="warning"}
Make sure to install [FluxCD CLI and other prerequisites ](https://fluxcd.io/flux/installation/)
::

## Repository Structure

There are several ways to structure FluxCD repository [More information can be found here](https://fluxcd.io/flux/guides/repository-structure/).
For the sake of simplicity in this tutorial, we will utilize a monorepo approach, consolidating all Kubernetes manifests within a single Git repository.

This is what our repository looks like (made small changes in compare to FluxCD monorepo. Later on, after the setup and bootstraping, we will delve into various kustomizations and their correlation with the repository structure

High level structure:
```bash
├── apps
│   ├── base
│   └── dev
├── infrastructure
│   ├── config
│   └── controllers
└── clusters
    └── dev
```

## Bootstraping Flux

::InfoBox{type="code"}
Make sure you are using the right kubectl context!

#details
For example in case you are using Azure AKS:
```bash 
az aks get-credentials --resource-group rg-k8s-dev --name aks-dev
```
::

Verify cluster readiness:
```bash 
flux check --pre

► checking prerequisites
✔ Kubernetes 1.25.12 >=1.20.6-0
✔ prerequisites checks passed
```

::InfoBox{type="warning"}
Make to create and set [GITHUB_TOKEN ](https://fluxcd.io/flux/installation/bootstrap/github/)
#details
Or if you are using different Git server follow the [bootstrap documentation](https://fluxcd.io/flux/installation/bootstrap/)
::

```bash 
export GITHUB_TOKEN=<YOUR_PAT>
```

Start the bootstrap (Flux will create the repository for you incase it doesnt exists):
```bash 
flux bootstrap github --read-write-key --owner=<YOUR_ORG> --repository=blog-deployment --branch=main --path=gitops/clusters/dev --components-extra=image-reflector-controller,image-automation-controller

    Message:
    ► connecting to github.com
    ► cloning branch "main" from Git repository "https://github.com/devozs/blog-deployment.git"
    ✔ cloned repository
    ► generating component manifests
    ✔ generated component manifests
    ✔ committed sync manifests to "main" ("e65db7e29d592c016a8f82271a577e6b6c0b2935")
    ► pushing component manifests to "https://github.com/devozs/blog-deployment.git"
    ► installing components in "flux-system" namespace
    ✔ installed components
    ✔ reconciled components
    ► determining if source secret "flux-system/flux-system" exists
    ► generating source secret
    ✔ public key: ecdsa-sha2-nistp384 AAAAE2VjZHNhLXNoYTItbmlzdHAzODQAAAAIbmlzdHAzODQAAABhBNOHqQkmVLEVGXn9IiiOAuHkv8/Je0lFGdrCJAccUHYalIDiDOF9CKFxLFXvpTtIePVS3kshJRnfNKfwFVqYdEWTP0xHm7KXSv4dwZZgf011FdYBv4JSSujIhv8m31qu1A==
    ✔ configured deploy key "flux-system-main-flux-system-./gitops/clusters/dev" for "https://github.com/devozs/blog-deployment"
    ► applying source secret "flux-system/flux-system"
    ✔ reconciled source secret
    ► generating sync manifests
    ✔ generated sync manifests
    ✔ committed sync manifests to "main" ("9e14f895a4916fad884ffbe564c049e72f1ecd58")
    ► pushing sync manifests to "https://github.com/devozs/blog-deployment.git"
    ► applying sync manifests
    ✔ reconciled sync configuration
    ◎ waiting for Kustomization "flux-system/flux-system" to be reconciled
    ✔ Kustomization reconciled successfully
    ► confirming components are healthy
    ✔ helm-controller: deployment ready
    ✔ image-automation-controller: deployment ready
    ✔ image-reflector-controller: deployment ready
    ✔ kustomize-controller: deployment ready
    ✔ notification-controller: deployment ready
    ✔ source-controller: deployment ready
    ✔ all components are healthy
```

### Verify Flux PODs
The following pods should be running on ***flux-system*** namespace
```bash
kubectl get pod -n flux-system

NAME                                           READY   STATUS    RESTARTS   AGE
helm-controller-69dbf9568-tp4x6                1/1     Running   0          2m5s
image-automation-controller-6bbc947558-h82k6   1/1     Running   0          2m5s
image-reflector-controller-7c49fdc68f-skrjs    1/1     Running   0          2m5s
kustomize-controller-77bf676476-cj5rr          1/1     Running   0          2m5s
notification-controller-7bb6d7684d-k9s9l       1/1     Running   0          2m5s
source-controller-5996567c74-kt5nt             1/1     Running   0          2m5s
```

### Exploring Flux Kustomizations
Flux manage the deployment and its dependencies using a kustomization resource.
To watch the kustomizations list and thier status:
```bash
flux get kustomizations

NAME             	REVISION          	SUSPENDED	READY	MESSAGE                              
apps             	main@sha1:45260107	False    	True 	Applied revision: main@sha1:45260107	
flux-system      	main@sha1:45260107	False    	True 	Applied revision: main@sha1:45260107	
infra-configs    	main@sha1:45260107	False    	True 	Applied revision: main@sha1:45260107	
infra-controllers	main@sha1:45260107	False    	True 	Applied revision: main@sha1:45260107	
```
You can also get kustomizations CRD using the kubectl CLI:
```bash
kubectl get kustomizations -n flux-system 

NAME                AGE   READY   STATUS
apps                28h   True    Applied revision: main@sha1:45260107f70f9618872e50d4a196126a92ef715c
flux-system         36h   True    Applied revision: main@sha1:45260107f70f9618872e50d4a196126a92ef715c
infra-configs       28h   True    Applied revision: main@sha1:45260107f70f9618872e50d4a196126a92ef715c
infra-controllers   28h   True    Applied revision: main@sha1:45260107f70f9618872e50d4a196126a92ef715c

```

## Secrets
In this tutorial, I haven't utilized a secret manager like Azure Key Vault. Instead, I've employed a secret YAML file and ensured that it's not committed to GitHub by including it in the ***.gitignore*** file.

::InfoBox{type="error"}
Make sure not to put your kubernetes secrets in Git
#details
For testing purpuse you can add them to gitignore. Permenant solution would be to use key vault or other solution like sealed-secrets ([works well with FluxCD](https://fluxcd.io/flux/guides/sealed-secrets/))
::

### Docker Pull Secret
Docker pull secret is being used in two ways:
- Pull the blog-frontend image from Github registry
- FluxCD uses it to fetch new tags from Github registry
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: cr-secret
  namespace: flux-system
type: kubernetes.io/dockerconfigjson
data:
  .dockerconfigjson: <PUT_YOURS>
---
apiVersion: v1
kind: Secret
metadata:
  name: cr-secret
  namespace: blog
type: kubernetes.io/dockerconfigjson
data:
  .dockerconfigjson: <PUT_YOURS>
```

### TLS Cert Secret
You might want to use cert-mnagaer or manually use your own certificate or free one like Let's Encrypt.

I havent implemented cert-manager and simply created ***cert-secret*** that you`ll have to replace and apply the below yaml.
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: cert-secret
  namespace: flux-system
type: kubernetes.io/tls
data:
  tls.crt: <PUT_YOURS>
  tls.key: <PUT_YOURS>
---
apiVersion: v1
kind: Secret
metadata:
  name: cert-secret
  namespace: blog
type: kubernetes.io/tls
data:
  tls.crt: <PUT_YOURS>
  tls.key: <PUT_YOURS>
```

## Validation

Once the reconciliation is completed we can check the rest of the deployment.
```bash
kubectl get pod -n blog

NAME                             READY   STATUS    RESTARTS   AGE
blog-frontend-647c656d49-7q6x4   1/1     Running   0          79m

```
## The FluxCD Magic 🪄
We are using two powerful Flux capabilities:
- Listen to new images in a certian repository and given pattern
```yaml
apiVersion: image.toolkit.fluxcd.io/v1beta1
kind: ImagePolicy
metadata:
  name: blog-frontend
  namespace: flux-system
spec:
  imageRepositoryRef:
    name: blog-frontend
  filterTags:
    pattern: '^main-[a-f0-9]+-(?P<ts>[0-9]+)'
    extract: '$ts'
  policy:
    numerical:
      order: asc
```
```yaml
apiVersion: image.toolkit.fluxcd.io/v1beta1
kind: ImageRepository
metadata:
  name: blog-frontend
  namespace: flux-system
spec:
  image: blog-frontend
  interval: 1m0s
  secretRef:
    name: DOCKER_SECRET
```

```bash
flux get image policy    
NAME         	LATEST IMAGE                                         	READY	MESSAGE                                                                                                               
blog-frontend	ghcr.io/devozs/blog-frontend:main-0292a018-1694284510	True 	Latest image tag for 'ghcr.io/devozs/blog-frontend' updated from main-18c2d24e-1694278211 to main-0292a018-1694284510

flux get image repository   
NAME         	LAST SCAN                	SUSPENDED	READY	MESSAGE                        
blog-frontend	2023-09-09T22:50:26+03:00	False    	True 	successful scan: found 15 tags	

```
- Update the resolved image tag in the relevant Kubernetes yaml (directly to the Deployment YAML or vie Kustomization YAML)
```yaml
apiVersion: image.toolkit.fluxcd.io/v1beta1
kind: ImageUpdateAutomation
metadata:
  name: image-update-automation
  namespace: flux-system
spec:
  interval: 1m10s
  sourceRef:
    kind: GitRepository
    name: flux-system
  git:
    checkout:
      ref:
        branch: main
    commit:
      author:
        email: fluxcdbot@users.noreply.github.com
        name: fluxcdbot
      messageTemplate: '{{range .Updated.Images}}{{println .}}{{end}}'
    push:
      branch: main
  update:
    path: ./gitops/clusters/dev
    strategy: Setters
```
```bash
flux get image update    
NAME                   	LAST RUN                 	SUSPENDED	READY	MESSAGE                                                      
image-update-automation	2023-09-09T22:52:13+03:00	False    	True 	no updates made; last commit d984f3e at 2023-09-09T18:37:57Z	
```
It will cause an update on ***./gitops/clusters/dev/kustomization.yaml*** by the placeholder ***{"$imagepolicy": "flux-system:blog-frontend:tag"}***
```yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ../base
patches:
  - path: patches/blog-frontend-image-policy.yaml
    target:
      group: image.toolkit.fluxcd.io
      version: v1beta1
      kind: ImagePolicy
      namespace: flux-system
      name: blog-frontend
  - path: patches/blog-frontend-image-repository.yaml
    target:
      group: image.toolkit.fluxcd.io
      version: v1beta1
      kind: ImageRepository
      namespace: flux-system
      name: blog-frontend
  - path: patches/image-update-automation.yaml
    target:
      group: image.toolkit.fluxcd.io
      version: v1beta1
      kind: ImageUpdateAutomation
      namespace: flux-system
images:
  - name: blog-frontend
    newName: ghcr.io/devozs/blog-frontend
    newTag: main-18c2d24e-1694278211 # {"$imagepolicy": "flux-system:blog-frontend:tag"}

```

## Access the application UI

You can either set a ***port-forward*** to the ***blog-frontend*** service or add a DNS record with envoy ***Load Balancer EXTERNAL-IP***.

### port-forward
```bash
kubectl port-forward -n blog service/blog-frontend 3000:3000

Forwarding from 127.0.0.1:3000 -> 3000
Forwarding from [::1]:3000 -> 3000

```

### contour
As part of the deployment we are also using [Contour](https://projectcontour.io/) as ingress controller.

Once the services are deployed you can get envoy ***Load Balancer EXTERNAL-IP***. for example: 20.xx.xx.224 and add a DNS A record in your domain provider.

```bash
kubectl get services -n projectcontour 

NAME      TYPE           CLUSTER-IP     EXTERNAL-IP    PORT(S)                      AGE
contour   ClusterIP      10.0.89.98     <none>         8001/TCP                     24h
envoy     LoadBalancer   10.0.253.112   20.xx.xx.224   80:30395/TCP,443:31965/TCP   24h

```
