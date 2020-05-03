## https://www.aparat.com/v/hP3x0
### Prepare Master
1. Update packages.  
```
yum update -y
```  
2. Set hostname  
```
nano /etc/hostname
```  
3. Add your hostname  
```
nano /etc/hosts
```  
4. Config private interface, set name  
```
cd /etc/sysconfig/network-scripts/
```  
5. Disable swap
```
swapoff -a
cat /etc/fstab
```  
6. Disable SELinux and firewalld  
```
sestatus
systemctl stop firewalld
systemctl disable firewalld
```
```
reboot
```
7.Install Docker (check that works with systemd)  
```
yum install docker -y
```
7.1. Added proxy to docker if needed  
```
mkdir -p /etc/systemd/system/docker.service.d/
nano /etc/systemd/system/docker.service.d/http-proxy.conf
```  
```
[Service]
Environment="HTTP_PROXY=socks5://127.0.0.1:1080"
```  
7.2. Added proxy for yum if needed 
    
```
nano /etc/yum.conf
proxy=socks5://localhost:1080
```  
### Install Kubernetes packages
[Installing kubeadm, Official link](https://kubernetes.io/docs/setup/independent/install-kubeadm/)  
8. Letting iptables see bridged traffic
```
nano /usr/lib/sysctl.d/00-system.conf
```
```
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
```
```
sysctl --system
```
9.  Add kubernetes repo
```
cat <<EOF > /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://packages.cloud.google.com/yum/repos/kubernetes-el7-x86_64
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://packages.cloud.google.com/yum/doc/yum-key.gpg https://packages.cloud.google.com/yum/doc/rpm-package-key.gpg
EOF
```
10. Install kube[X]
```
yum install -y kubelet kubeadm kubectl --disableexcludes=kubernetes
```
11. Enable kubelet
```
systemctl enable kubelet
```
### Initial Cluster
[Creating a single control-plane cluster with kubeadm, Official link](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/)  
12. Use kubeadm
```
kubeadm init --pod-network-cidr=10.244.0.0/16 --apiserver-advertise-address=[MASTER NODE IP]
```
#### Attention to the result and save commands
13. Edit kubelet file
```
nano /etc/sysconfig/kubelet
```
```
KUBELET_EXTRA_ARGS=--address=[MASTER NODE IP] --node-ip=[MASTER NODE IP] --runtime-cgroups=/sys/fs/cgroup/systemd/system.slice --kubelet-cgroups=/sys/fs/cgroup/systemd/system.slice
```
14. Edit kubelet config  
Add **cgroupDriver: systemd**
```
nano /var/lib/kubelet/config.yaml
```
15. Check flannel
```
mkdir -p /etc/cni/net.d/
nano /etc/cni/net.d/10-flannel.conflist
```
16. Restart kubelet
```
systemctl daemon-reload
systemctl restart kubelet
systemctl status kubelet
```
17. Check node, do it on master
```
kubectl get nodes
```

#### Don't forget to stop and disable networkManager
```
systemctl stop NetworkManager
systemctl disable NetworkManager
```
