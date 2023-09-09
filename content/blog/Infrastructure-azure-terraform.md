---
order: 1
title: 'Infrastructure As Code!'
description: 'Use Azure AKS and Terraform!'
img: 'img/infra.png'
tags: [IaC, Infra, Azure, AKS, Terraform]
---

::InfoBox{type=""}
[Show Me The Code!](https://github.com/devozs/blog-deployment/tree/main/infra/terraform/azure)
::

## Guidelines

In the upcoming blog post, we will establish the foundational infrastructure that will be pivotal throughout the remaining CI & CD tutorials.

For this purpose, I've opted to utilize Azure Kubernetes Service (AKS) and Terraform. However, it's worth noting that you have the flexibility to choose from a variety of providers, including GCP, EKS, or any other Kubernetes service that suits your needs.

::InfoBox{type="warning"}
Persisting Terraform State!

#details
I'm utilizing Azure Blob Storage as the backend for storing the Terraform state, but it's important to mention that you have the option to select an alternative backend or even forgo state persistence altogether.[More information can be found here](https://developer.hashicorp.com/terraform/language/settings/backends/configuration)
::

## Terraform

We are about to buildthe following:
- Simple AKS
- Terrafor will create for us two resource groups:
  - one to hold AKS itself (and other resources like key vault for example if being used)
  - the second for node pools, load balancer, volumes etc.
- We have devided it into two node pools:
  - System PODs (only_critical_addons_enabled)
  - Management PODs (our application).

More information about Terraform and AKS can be found [Here](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/kubernetes_cluster)

Update azure/aks/variables.tf and azure/environment/dev/backend.conf files.
::InfoBox{type="warning"}
Cloud provide CLI init
#details
Before executing Terraform CLI make sure to login to init the relevant provider (i.e. az login, gcloud init etc.) depends on the backend you are using.
::

```bash
cd infra/terraform/azure
terraform -chdir='aks' init -backend-config=../environment/dev/backend.conf -reconfigure
terraform -chdir='aks' plan -var-file=../environment/dev/.tfvars
terraform -chdir='aks' apply -var-file=../environment/dev/.tfvars
```

## Azure Kubernetes Service
If everything went well at the prevois step you should have a working AKS.
Go to Azure portal and search for AKS instances or use the Azure CLI and kubectl.

```bash
az aks list

[
  {
    "aadProfile": null,
    "addonProfiles": null,
    "agentPoolProfiles": [
      {}
    ]
  }
  ...
]
```
```bash
kubectl get nodes -owide

NAME                                 STATUS   ROLES   AGE   VERSION   INTERNAL-IP    EXTERNAL-IP   OS-IMAGE             KERNEL-VERSION      CONTAINER-RUNTIME
aks-management-41779884-vmss000001   Ready    agent   15s   v1.26.6   10.224.0.100   <none>        Ubuntu 22.04.3 LTS   5.15.0-1042-azure   containerd://1.7.1+azure-1
aks-system-18952855-vmss000000       Ready    agent   29h   v1.26.6   10.224.0.4     <none>        Ubuntu 22.04.3 LTS   5.15.0-1042-azure   containerd://1.7.1+azure-1

```

## Validation
We`ll be a simple web application just to test a POD deployment.
[Here is a useful implementation](https://github.com/stefanprodan/podinfo)

```bash
kubectl apply -k github.com/stefanprodan/podinfo/kustomize

service/podinfo created
deployment.apps/podinfo created
horizontalpodautoscaler.autoscaling/podinfo created

```
Check the PODs are running
```bash
kubectl get pod

NAME                       READY   STATUS    RESTARTS   AGE
podinfo-6c77b54bb8-9vgd2   1/1     Running   0          25m
podinfo-6c77b54bb8-cnnc8   1/1     Running   0          25m

```
Remove the podinfo resources
```bash
kubectl delete -k github.com/stefanprodan/podinfo/kustomize

service "podinfo" deleted
deployment.apps "podinfo" deleted
horizontalpodautoscaler.autoscaling "podinfo" deleted

kubectl get pod                                            
No resources found in default namespace.
```


## Cleanup Resource
```bash
cd infra/terraform/azure
terraform -chdir='aks' destroy -var-file=../environment/dev/.tfvars
```
Also remember to delete BlobStorage or any other backend that you have used for the Terraform state and any other resource that you have created manualy.
