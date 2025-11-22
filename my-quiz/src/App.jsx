import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, XCircle, Trophy, ArrowRight, RefreshCcw, ShieldCheck, ChevronRight, AlertCircle, BookOpen } from 'lucide-react';

// --- Configuration & Data ---
const QUIZ_DATA = [
  {
    id: 1,
    question: "What explicitly describes the respective security and operations obligations of both the cloud provider and the cloud user?",
    options: [
      "Segregation of Duties Model",
      "Least Privilege Model",
      "Shared Responsibility Model",
      "Zero Trust Model"
    ],
    correctAnswer: "Shared Responsibility Model",
    explanation: "The Shared Responsibility Model defines what security aspects the cloud provider is responsible for ('security of the cloud') and what security aspects the user is responsible for ('security in the cloud')."
  },
  {
    id: 2,
    question: "What is the effect of allowing privilege escalation at the container security context level?",
    options: [
      "Privilege escalation can allow a container to gain more privileges than its parent process, which may be used for exploitation.",
      "Privilege escalation optimizes resource utilization within the cluster by enabling Pods to share resources via namespaces.",
      "Privilege escalation facilitates smoother cluster scaling by allowing Pods to adapt to increased workloads.",
      "Privilege escalation ensures better isolation between containers in a Pod, limiting the impact of security breaches."
    ],
    correctAnswer: "Privilege escalation can allow a container to gain more privileges than its parent process, which may be used for exploitation.",
    explanation: "Privilege escalation is a security vulnerability where a user or a container gains elevated privileges beyond what they were originally granted. This can lead to a container gaining root access on the host, which is a major security risk."
  },
  {
    id: 3,
    question: "In a Kubernetes environment, how do Linux namespaces ensure the isolation of containers?",
    options: [
      "Linux namespaces ensure that processes within containers are only granted specific privileges without granting all the root user privileges.",
      "Linux namespaces provide a mechanism for isolating groups of Kubernetes resources within a single cluster, including Pods, Deployments, and Services.",
      "Linux namespaces provide process isolation of filesystems, network resources, process IDs, and other Operating System resources by creating separate namespaces for processes within containers.",
      "Linux namespaces constrain resources that are allocated to processes within containers, such as CPU/memory requests and limits."
    ],
    correctAnswer: "Linux namespaces provide process isolation of filesystems, network resources, process IDs, and other Operating System resources by creating separate namespaces for processes within containers.",
    explanation: "Linux namespaces are a core technology that provides the process isolation necessary for containers. They create distinct, isolated views of system resources, ensuring that processes in one container cannot see or interact with those in another."
  },
  {
    id: 4,
    question: "A Kubernetes cluster runs on a cloud platform. The platform's metadata API provides information about the cluster (e.g., cloud credentials for that node). What should be done to mitigate the risk associated with cloud metadata API access?",
    options: [
      "Ensure that all sensitive data in the cloud metadata API is encrypted.",
      "Regularly audit the access logs of the cloud metadata API.",
      "Restrict Pod access to the cloud metadata API via network policies.",
      "Turn off the cloud metadata API."
    ],
    correctAnswer: "Restrict Pod access to the cloud metadata API via network policies.",
    explanation: "The cloud metadata API can contain sensitive information, including credentials. Restricting Pod access to this API using Network Policies is a crucial security measure to prevent a compromised Pod from exfiltrating this data."
  },
  {
    id: 5,
    question: "What is a trust boundary in the context of Kubernetes?",
    options: [
      "The boundary between two Nodes in different subnets.",
      "The boundary between two components where trust levels change.",
      "The boundary between two Pods from different applications.",
      "The boundary between two Services defined by different teams."
    ],
    correctAnswer: "The boundary between two components where trust levels change.",
    explanation: "A trust boundary is a conceptual line in a system where the trust level of components changes. A common example is the boundary between a less-trusted component (like a public-facing web server) and a highly-trusted component (like a database)."
  },
  {
    id: 6,
    question: "Which organisation provides Kubernetes Security Benchmarks for both self-hosted and managed platforms?",
    options: [
      "The National Institute of Standards and Technology (NIST)",
      "The Open Web Application Security Project (OWASP)",
      "The Cloud Native Computing Foundation (CNCF)",
      "The Center for Internet Security (CIS)"
    ],
    correctAnswer: "The Center for Internet Security (CIS)",
    explanation: "The Center for Internet Security (CIS) provides a well-known series of security benchmarks for Kubernetes, offering detailed recommendations for securing both the control plane and worker nodes."
  },
  {
    id: 7,
    question: "Review the following Pod manifest:\n\napiVersion: v1\nkind: Pod\nmetadata:\n  name: Test-container\nspec:\n  containers:\n  ...\n  securityContext:\n    runAsUser: 0\n\nWhich OWASP Top 10 for Kubernetes risks does this Pod manifest introduce?",
    options: [
      "Insecure Workload Configurations",
      "Insecure Design",
      "Outdated and Vulnerable Kubernetes Components",
      "Broken Authentication Mechanisms"
    ],
    correctAnswer: "Insecure Workload Configurations",
    explanation: "The manifest uses runAsUser: 0, which configures the container to run with root privileges. This is an insecure configuration that violates security best practices and is categorized under 'Insecure Workload Configurations.'"
  },
  {
    id: 8,
    question: "In Kubernetes, how can a PersistentVolume be configured to delete the underlying storage once the PVCs that claim it are deleted?",
    options: [
      "By setting the storageClassName field of the PersistentVolume to Delete.",
      "By setting the accessModes field of the PersistentVolume to Delete.",
      "By setting the reclaimPolicy field of the PersistentVolume to Delete.",
      "By setting the volumeMode field of the PersistentVolume to Delete."
    ],
    correctAnswer: "By setting the reclaimPolicy field of the PersistentVolume to Delete.",
    explanation: "The reclaimPolicy field determines what happens to the underlying storage when the PersistentVolumeClaim (PVC) is deleted. The Delete policy ensures the storage is automatically deleted, while Retain leaves it intact."
  },
  {
    id: 9,
    question: "Which label should be added to the Namespace to block any privileged Pods from being created in that Namespace?",
    options: [
      "pod-security.kubernetes.io/enforce: baseline",
      "pod.security.kubernetes.io/privileged: false",
      "privileged: false",
      "privileged: true"
    ],
    correctAnswer: "pod-security.kubernetes.io/enforce: baseline",
    explanation: "Pod Security Standards (PSS) are a built-in admission controller. The pod-security.kubernetes.io/enforce: baseline label enforces the baseline policy, which disallows privileged containers and other risky settings."
  },
  {
    id: 10,
    question: "In a multi-tenant Kubernetes environment where each team has distinct access requirements and workloads, which combination of strategies would enhance client security and maintain workload isolation?",
    options: [
      "Enable anonymous authentication, enforce mutual TLS (mTLS), and segregate workloads using pod affinities.",
      "Utilize bearer tokens with a third-party identity service, employ network policies for Pod-level isolation, and leverage Audit Logs to track client interactions.",
      "Use service account tokens for all external and internal clients, store client credentials in ConfigMaps, and rely on namespace quotas for workload isolation.",
      "Rely solely on basic authentication with a shared password across all teams, utilize node taints and tolerations, and turn off logging to enhance security."
    ],
    correctAnswer: "Utilize bearer tokens with a third-party identity service, employ network policies for Pod-level isolation, and leverage Audit Logs to track client interactions.",
    explanation: "This combination provides a strong security posture. Bearer tokens with an identity service provide robust authentication, network policies enforce isolation between workloads, and audit logs provide the necessary visibility for security monitoring and forensics."
  },
  {
    id: 11,
    question: "In the context of Kubernetes, what is privilege escalation?",
    options: [
      "It is the process of granting excessive privileges to users in a cluster.",
      "It is the process of elevating the privileges of a container or Pod beyond the initial level of grants.",
      "It is the process of enhancing security measures to prevent unauthorized access.",
      "It is the process of transferring controls to another user within the same namespace."
    ],
    correctAnswer: "It is the process of elevating the privileges of a container or Pod beyond the initial level of grants.",
    explanation: "Privilege escalation is an attack technique where a user or a process gains privileges that were not originally granted, for example, by exploiting a vulnerability or a misconfiguration."
  },
  {
    id: 12,
    question: "What is the difference between gVisor and Firecracker?",
    options: [
      "gVisor is a user-space kernel that provides isolation and security for containers. At the same time, Firecracker is a lightweight virtualization technology for creating and managing secure, multi-tenant container and function-as-a-service (FaaS) workloads.",
      "gVisor and Firecracker are two names for the same technology, which provides isolation and security for containers.",
      "gVisor is a lightweight virtualization technology for creating and managing secure, multi-tenant container and function-as-a-service workloads. At the same time, Firecracker is a user-space kernel that provides isolation and security for containers.",
      "gVisor and Firecracker are both container runtimes that can be used interchangeably."
    ],
    correctAnswer: "gVisor is a user-space kernel that provides isolation and security for containers. At the same time, Firecracker is a lightweight virtualization technology for creating and managing secure, multi-tenant container and function-as-a-service (FaaS) workloads.",
    explanation: "While both are isolation technologies, they operate at different levels. gVisor is a user-space kernel that intercepts and handles system calls, whereas Firecracker is a virtual machine monitor (VMM) that creates lightweight virtual machines."
  },
  {
    id: 13,
    question: "A user runs a command with kubectl to apply a change to a deployment. What is the first Kubernetes component that the request reaches?",
    options: [
      "Kubernetes Scheduler",
      "Kubernetes Controller Manager",
      "Kubernetes API Server",
      "kubelet"
    ],
    correctAnswer: "Kubernetes API Server",
    explanation: "All interactions with the Kubernetes cluster, whether from a user or a component, must first go through the Kubernetes API Server, which acts as the central control plane component."
  },
  {
    id: 14,
    question: "A user has a client X.509 certificate with Subject including O=system:masters that lets them authenticate to the Kubernetes API server. What is the consequence of this?",
    options: [
      "The user will have no access to the Kubernetes cluster.",
      "The user will have full administrator access to the Kubernetes cluster.",
      "The user will have limited access to specific namespaces in the Kubernetes cluster.",
      "The user will have read-only access to the Kubernetes cluster."
    ],
    correctAnswer: "The user will have full administrator access to the Kubernetes cluster.",
    explanation: "The system:masters group is a special, hardcoded group in Kubernetes that is bound to the cluster-admin ClusterRole. Any user who can authenticate as a member of this group has full administrative access."
  },
  {
    id: 15,
    question: "What is the best definition of the Provenance control from NIST 800-53 Rev. 5?",
    options: [
      "Provenance control ensures software and firmware components’ integrity, authenticity, and confidentiality throughout the supply chain.",
      "Provenance control ensures compliance with legal and regulatory requirements throughout the supply chain.",
      "Provenance control ensures the availability and reliability of software and firmware components throughout the supply chain.",
      "Provenance control focuses on the physical security of hardware components during the supply chain process."
    ],
    correctAnswer: "Provenance control ensures software and firmware components’ integrity, authenticity, and confidentiality throughout the supply chain.",
    explanation: "Provenance is about tracking the origin and history of software components, which is critical for supply chain security. This ensures you know where a component came from and that it hasn't been tampered with."
  },
  {
    id: 16,
    question: "What is the recommended way to pass Secrets into a container running in a Pod?",
    options: [
      "Use environment variables to pass Secrets",
      "Include them in the container image",
      "Use HTTP requests to retrieve them",
      "Mount them as data volumes using Kubernetes Secrets"
    ],
    correctAnswer: "Mount them as data volumes using Kubernetes Secrets",
    explanation: "Mounting Secrets as data volumes is the most secure way to pass sensitive data into a container. It avoids storing secrets in plaintext in the Pod manifest or in a container image, and it provides a more secure way to handle secrets than environment variables, which can be easily logged."
  },
  {
    id: 17,
    question: "Which of the following is used to define security policies for Pods?",
    options: [
      "PodTemplates",
      "ReplicaSets",
      "PodSecurityPolicies",
      "ConfigMaps"
    ],
    correctAnswer: "PodSecurityPolicies",
    explanation: "PodSecurityPolicies (PSPs) are a cluster-level resource that controls the security context of Pods. They specify what a Pod is allowed to do, such as whether it can run as root, use host networking, or mount host paths. Note that PSPs are deprecated and replaced by Pod Security Standards."
  },
  {
    id: 18,
    question: "How can you prevent a container from accessing the Kubernetes API server by default?",
    options: [
      "By removing the default service account from the Pod",
      "By adding the Pod to a different namespace",
      "By disabling kube-dns",
      "By blocking access through iptables manually"
    ],
    correctAnswer: "By removing the default service account from the Pod",
    explanation: "By default, every Pod has a service account token mounted to it, which can be used to authenticate with the Kubernetes API. Removing this service account token prevents the container from authenticating and accessing the API."
  },
  {
    id: 19,
    question: "Which Kubernetes object is used to control permissions at the namespace level?",
    options: [
      "ServiceAccount",
      "Role and RoleBinding",
      "ClusterRole",
      "ConfigMap"
    ],
    correctAnswer: "Role and RoleBinding",
    explanation: "A Role defines a set of permissions within a specific namespace. A RoleBinding grants those permissions to a user, group, or service account within that same namespace."
  },
  {
    id: 20,
    question: "What is the purpose of SecurityContext in a Pod specification?",
    options: [
      "To define network policies",
      "To define privilege and access control settings for containers",
      "To define scheduling rules",
      "To define labels and annotations"
    ],
    correctAnswer: "To define privilege and access control settings for containers",
    explanation: "A SecurityContext defines the security settings for a Pod or an individual container, such as the user to run as, whether to allow privilege escalation, and what capabilities to drop or add."
  },
  {
    id: 21,
    question: "Which of the following tools can be used to scan container images for vulnerabilities?",
    options: [
      "etcd",
      "Trivy",
      "Fluentd",
      "CoreDNS"
    ],
    correctAnswer: "Trivy",
    explanation: "Trivy is a popular open-source tool specifically designed to scan container images, file systems, and Git repositories for vulnerabilities, misconfigurations, and other security risks."
  },
  {
    id: 22,
    question: "How do you ensure communication between Pods is encrypted in Kubernetes?",
    options: [
      "Using NodePorts",
      "Using ConfigMaps",
      "Disabling kube-proxy",
      "Enabling Mutual TLS (mTLS)"
    ],
    correctAnswer: "Enabling Mutual TLS (mTLS)",
    explanation: "mTLS, often provided by a service mesh, ensures that all service-to-service communication is encrypted and authenticated. Each Pod has a certificate, and it verifies the identity of the Pod it is communicating with."
  },
  {
    id: 23,
    question: "What does RBAC stand for in Kubernetes?",
    options: [
      "Role-Based Access Certificate",
      "Role-Based Access Control",
      "Resource-Based Access Control",
      "Remote-Based Access Control"
    ],
    correctAnswer: "Role-Based Access Control",
    explanation: "RBAC is a method for regulating access to computer or network resources based on the roles of individual users within an organization. In Kubernetes, it allows you to grant specific permissions to users or groups."
  },
  {
    id: 24,
    question: "What component enforces network policies in Kubernetes?",
    options: [
      "kubelet",
      "Network Plugin (CNI)",
      "kube-scheduler",
      "kube-apiserver"
    ],
    correctAnswer: "Network Plugin (CNI)",
    explanation: "The Network Policy API is implemented by the Container Network Interface (CNI) plugin. The CNI is responsible for Pod networking, and a policy-aware CNI plugin will configure network rules (e.g., using iptables or eBPF) to enforce Network Policies."
  },
  {
    id: 25,
    question: "Which flag enables audit logging in the Kubernetes API server?",
    options: [
      "--audit-log-path",
      "--enable-audit-log",
      "--log-audit-events",
      "--audit-enabled"
    ],
    correctAnswer: "--audit-log-path",
    explanation: "The --audit-log-path flag is used to specify the file path where the API server should write audit events. This flag is required to enable basic audit logging."
  },
  {
    id: 26,
    question: "To restrict the kubelet’s rights to the Kubernetes API, what authorization mode should be set on the Kubernetes API server?",
    options: [
      "AlwaysAllow",
      "kubelet",
      "Webhook",
      "Node"
    ],
    correctAnswer: "Node",
    explanation: "The Node authorizer is a special authorization mode that grants permissions to the kubelet to only manage the resources required for the Pods that it's scheduled to run. This follows the principle of least privilege."
  },
  {
    id: 27,
    question: "Which components should be able to access etcd at the network level directly?",
    options: [
      "All Pods running in the cluster",
      "Only the Kubernetes API server",
      "All Kubernetes Control Plane components",
      "Only Worker Nodes in the cluster"
    ],
    correctAnswer: "Only the Kubernetes API server",
    explanation: "etcd is the key-value store for the entire Kubernetes cluster, and it contains all the cluster's state, including sensitive data. Direct network access should be restricted to only the API server to prevent unauthorized access and data exfiltration."
  },
  {
    id: 28,
    question: "What was the name of the precursor to Pod Security Standards?",
    options: [
      "Container Runtime Security",
      "Pod Security Policy",
      "Kubernetes Security Contexts",
      "Container Security Standards"
    ],
    correctAnswer: "Pod Security Policy",
    explanation: "Pod Security Policies (PSPs) were a beta feature that was officially deprecated and replaced by Pod Security Standards (PSS) in Kubernetes v1.25."
  },
  {
    id: 29,
    question: "Why is it important for security teams to maintain good relationships with developers?",
    options: [
      "To establish trust and open communication between security and development teams",
      "To ensure developers follow security best practices without question",
      "To shift security responsibilities entirely to the development team",
      "To restrict developers from accessing production environments"
    ],
    correctAnswer: "To establish trust and open communication between security and development teams",
    explanation: "A good relationship with developers is crucial for a 'shift-left' security model. It fosters collaboration, allows security to be a built-in part of the development lifecycle, and encourages shared ownership of security."
  },
  {
    id: 30,
    question: "Which of the following is a measure for data plane isolation in a Kubernetes multi-tenancy scenario?",
    options: [
      "Enforce Roles and RoleBindings tied to specific namespaces only, forbid Cluster-wide roles.",
      "Run all workloads in a single namespace.",
      "Use a single service account for all pods.",
      "Disable Network Policies."
    ],
    correctAnswer: "Enforce Roles and RoleBindings tied to specific namespaces only, forbid Cluster-wide roles.",
    explanation: "This strategy helps isolate workloads by restricting administrative access to a specific namespace, preventing a compromised user from affecting other tenants' workloads across the cluster."
  },
  {
    id: 31,
    question: "What access is needed for an image pull secret?",
    options: [
      "Full admin access",
      "Read and Write access",
      "Read access",
      "Write access"
    ],
    correctAnswer: "Read and Write access",
    explanation: "An image pull secret is used to authenticate to a container registry and pull an image. It needs read access to the registry. The write access is not strictly required for pulling, but is often part of a standard service account with broader permissions."
  },
  {
    id: 32,
    question: "How can Pods be correctly configured and constrained by AppArmor profiles?",
    options: [
      "Reload the AppArmor profiles on the Node",
      "Enable AppArmor for the Pods running on the Node",
      "Edit the Pod YAML files to include the correct AppArmor profile annotations",
      "Restart the Pods to apply the profiles to the Pods running on the Node"
    ],
    correctAnswer: "Edit the Pod YAML files to include the correct AppArmor profile annotations",
    explanation: "To apply an AppArmor profile to a Pod, you must add a specific annotation (container.apparmor.security.beta.kubernetes.io/) to its manifest, specifying the profile to use. The kubelet then enforces this profile."
  },
  {
    id: 33,
    question: "Which of the following standards can be used to configure user authentication to a Kubernetes cluster without using an authenticating webhook?",
    options: [
      "OpenID Connect",
      "Kerberos",
      "SAML",
      "OAuth 2.0"
    ],
    correctAnswer: "OpenID Connect",
    explanation: "Kubernetes supports OpenID Connect (OIDC) as a native authenticator. You can configure the API server to trust an OIDC provider, allowing users to authenticate with their existing identity provider credentials."
  },
  {
    id: 34,
    question: "In Kubernetes, which of the following conditions must be met for a user to create or update a Role?",
    options: [
      "The user is granted explicit permission to perform the bind verb on the Roles or ClusterRoles resource in the rbac.authorization.k8s.io API group.",
      "The user is granted a role to create/update RoleBinding or ClusterRoleBinding objects.",
      "The user is granted explicit permission to perform the escalate verb at the same scope as the object being modified.",
      "The user must be a member of the system:masters group."
    ],
    correctAnswer: "The user is granted explicit permission to perform the escalate verb at the same scope as the object being modified.",
    explanation: "The escalate verb in Kubernetes RBAC prevents a user from granting permissions they do not already possess. A user with the escalate verb can only create a Role or RoleBinding with permissions that are a subset of their own permissions."
  },
  {
    id: 35,
    question: "Which of the following statements correctly describes a container breakout?",
    options: [
      "A container breakout is the process of escaping the container and gaining access to the Pod's network traffic.",
      "A container breakout is the process of escaping a container when it reaches its resource limits.",
      "A container breakout is the process of escaping the container and gaining access to the host operating system.",
      "A container breakout is the process of escaping the container and gaining access to the cloud provider's infrastructure."
    ],
    correctAnswer: "A container breakout is the process of escaping the container and gaining access to the host operating system.",
    explanation: "A container breakout, or container escape, is a severe security vulnerability where a process running inside a container gains unauthorized access to the underlying host system, effectively 'breaking out' of its isolated environment."
  },
  {
    id: 36,
    question: "Which of the following Pod configurations would allow an attacker to eavesdrop on all traffic on the node?",
    options: [
      "Pod with hostIPC set to true",
      "Pod with hostNetwork set to true",
      "Pod with hostPath volume defined",
      "Pod with hostPID set to true"
    ],
    correctAnswer: "Pod with hostNetwork set to true",
    explanation: "When a Pod uses hostNetwork, it shares the network namespace of the host machine. This means the Pod's processes can see all network traffic on the host, including traffic from other Pods and the host itself, which is a major security risk."
  },
  {
    id: 37,
    question: "Which of the following represents a baseline security measure for containers?",
    options: [
      "Configuring persistent storage for containers",
      "Configuring a static IP for each container",
      "Run containers as the root user",
      "Implementing access control to restrict container access"
    ],
    correctAnswer: "Implementing access control to restrict container access",
    explanation: "Implementing access control is a fundamental security practice. This includes using RBAC, network policies, and Pod Security Standards to restrict what a container can do and who can access it."
  },
  {
    id: 38,
    question: "At which stage does the Kubernetes admission controller put in practice authentication and authorization?",
    options: [
      "After authentication and before authorization",
      "After authentication and authorization",
      "After authorization and before authentication",
      "Before authentication and authorization"
    ],
    correctAnswer: "After authentication and authorization",
    explanation: "When a request is sent to the Kubernetes API, it goes through a series of steps. First, the user is authenticated, then their permissions are checked with authorization, and only then is the request passed to the admission controllers, which can validate or mutate the request."
  },
  {
    id: 39,
    question: "A malicious user is targeting the etcd key-value store of a Kubernetes cluster for data exfiltration. Which option describes how an adversary can access sensitive data from etcd?",
    options: [
      "By spoofing the IP address of a legitimate client to gain access to the etcd cluster.",
      "By exploiting a vulnerability in the kubelet to gain direct access to the etcd cluster.",
      "By intercepting network traffic between the Kubernetes API server and the etcd cluster to capture sensitive data.",
      "By gaining physical access to the server hosting the etcd cluster and extracting the sensitive data."
    ],
    correctAnswer: "By spoofing the IP address of a legitimate client to gain access to the etcd cluster.",
    explanation: "Network access to etcd is usually restricted to the API server's IP address. By spoofing this IP, an attacker could potentially bypass this network-level control. Other methods, such as exploiting kubelet or physical access, are also valid attack vectors, but IP spoofing is a common network-based attack."
  },
  {
    id: 40,
    question: "Which of the following best defines the shared responsibility model in the Cloud?",
    options: [
      "Cloud customers are responsible for all security aspects, from infrastructure management to application protection.",
      "Cloud providers ensure end-to-end security, allowing customers to focus solely on business operations.",
      "Cloud providers handle only hardware infrastructure security, leaving firmware, software, and application protection entirely to customers.",
      "Cloud providers are responsible for securing the foundational infrastructure, while customers are accountable for safeguarding their applications and data."
    ],
    correctAnswer: "Cloud providers are responsible for securing the foundational infrastructure, while customers are accountable for safeguarding their applications and data.",
    explanation: "The shared responsibility model is a key concept in cloud security. The cloud provider secures the underlying services (the cloud itself), while the customer is responsible for the security of their data, applications, and configurations (in the cloud)."
  },
  {
    id: 41,
    question: "Which of the following are valid RBAC verbs in a Kubernetes Role?",
    options: [
      "get, getmany, listen, post, patch, delete",
      "get, head, post, put, delete",
      "Connect, options, trace, patch",
      "get, list, watch; create, update, patch, delete, deletecollection",
      "Create, Read"
    ],
    correctAnswer: "get, list, watch; create, update, patch, delete, deletecollection",
    explanation: "Kubernetes RBAC defines a set of standard verbs that correspond to API actions. get, list, and watch are common read-only verbs, while create, update, patch, delete, and deletecollection are common write verbs."
  },
  {
    id: 42,
    question: "How does the kube-proxy forward traffic to a Pod based on its Service configuration?",
    options: [
      "The kube-proxy injects multiple A records in the CoreDNS Pod for each Service.",
      "The kube-proxy uses iptables or IPVS rules to forward traffic from a Service to a Pod.",
      "The kube-proxy forwards traffic via a reverse proxy to the backend Pod.",
      "The kube-proxy routes traffic through the API server."
    ],
    correctAnswer: "The kube-proxy uses iptables or IPVS rules to forward traffic from a Service to a Pod.",
    explanation: "kube-proxy is a network proxy that runs on each node. It uses either iptables or IPVS to manage the network rules that ensure traffic destined for a Service's IP is correctly routed to one of the healthy Pods that back that Service."
  },
  {
    id: 43,
    question: "In the STRIDE threat modeling framework, what does the letter D stand for?",
    options: [
      "data Tampering",
      "Deception",
      "Disclosure",
      "Denial of Service"
    ],
    correctAnswer: "Denial of Service",
    explanation: "STRIDE is a threat model developed by Microsoft. The acronym stands for: Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege."
  },
  {
    id: 44,
    question: "What is the operational impact of a failing kube-controller-manager Pod in the Kubernetes control plane?",
    options: [
      "The cluster does not correctly manage the life-cycle of cluster resources, which makes it subject to Denial of Service.",
      "Pods can no longer be scheduled on the worker node running the failing kube-controller-manager Pod.",
      "Due to the lack of egress network policies, Pods can no longer communicate with external networks.",
      "The container running the failing kube-controller-manager Pod evicts all existing containers from the same node."
    ],
    correctAnswer: "The cluster does not correctly manage the life-cycle of cluster resources, which makes it subject to Denial of Service.",
    explanation: "The kube-controller-manager is responsible for a variety of critical controllers, including the replication controller, endpoint controller, and namespace controller. If it fails, the cluster will not be able to perform these lifecycle tasks, leading to a degraded state and potential Denial of Service."
  },
  {
    id: 45,
    question: "When configuring audit logging for the Kubernetes API, which level do they select for the Pod resource to log both the request and response body?",
    options: [
      "Request",
      "RequestResponseMetadata",
      "Metadata",
      "RequestResponse"
    ],
    correctAnswer: "RequestResponse",
    explanation: "In Kubernetes audit logging, the RequestResponse level logs both the request and the response body for all API calls. This provides the most detailed information for security analysis but also generates a large amount of data."
  },
  {
    id: 46,
    question: "A user wants to declare a network policy that allows only Pods with the label app=frontend to communicate with Pods with the label app=backend. Which NetworkPolicy rules should they configure on the backend Pod namespace?",
    options: [
      "egress: [{\"to\": [{\"podSelector\": {\"matchLabels\": {\"app\": \"backend\"}}}]",
      "ingress: []",
      "ingress: [{\"from\": [{\"podSelector\": {\"matchLabels\": {\"app\": \"frontend\"}}}]}]",
      "egress: []"
    ],
    correctAnswer: "ingress: [{\"from\": [{\"podSelector\": {\"matchLabels\": {\"app\": \"frontend\"}}}]}]",
    explanation: "The Network Policy is applied to the backend Pods. The ingress rule specifies which traffic is allowed in. The from clause with the podSelector targets Pods that have the label app=frontend, thereby only allowing traffic from those Pods."
  },
  {
    id: 47,
    question: "Which of the following represents a malicious action that may lead to Denial of Service on a Kubernetes cluster?",
    options: [
      "Exfiltrate data from a datastore accessible from a Pod.",
      "Establish a foothold on a worker node.",
      "Execute malicious code in the workload.",
      "Bring the scheduler Pods down."
    ],
    correctAnswer: "Execute malicious code in the workload.",
    explanation: "Executing malicious code in a workload is a broad category of attacks. A common DoS attack involves running crypto-miners, which consume all available CPU resources, denying service to legitimate workloads. Another example would be a 'fork bomb' that exhausts resources."
  },
  {
    id: 48,
    question: "Which of the following statements best describes the role of the Scheduler in Kubernetes?",
    options: [
      "The Scheduler is responsible for assigning Pods to nodes based on resource availability and other constraints.",
      "The Scheduler is responsible for monitoring and managing the health of the Kubernetes cluster.",
      "The Scheduler is responsible for managing the deployment and scaling of applications in the Kubernetes cluster.",
      "The Scheduler is responsible for ensuring the security of the Kubernetes cluster and its components."
    ],
    correctAnswer: "The Scheduler is responsible for assigning Pods to nodes based on resource availability and other constraints.",
    explanation: "The Kubernetes Scheduler watches for newly created Pods that have no assigned node. It then finds the best node for the Pod to run on based on various factors like resource requirements, labels, and taints."
  },
  {
    id: 49,
    question: "What mechanism can I use to block unsigned images from running in my cluster?",
    options: [
      "Enabling Admission Controllers to validate image signatures.",
      "Configuring Container Runtime Interface (CRI) to enforce image signing and validation.",
      "Using Pod Security Standards (PSS) to enforce validation of signatures.",
      "Using PodSecurityPolicy (PSP) to enforce image signing and validation."
    ],
    correctAnswer: "Enabling Admission Controllers to validate image signatures.",
    explanation: "An admission controller is a plugin that intercepts requests to the Kubernetes API server before an object is created or modified. A validating admission controller can be used to check if a container image has a valid digital signature before allowing the Pod to be created."
  },
  {
    id: 50,
    question: "How can a user strengthen the security of the kubelet with multiple worker nodes to prevent unauthorized access?",
    options: [
      "Run kubelet with root privileges.",
      "Use client certificates for kubelet authentication.",
      "Expose the kubelet API to the internet.",
      "Disable kubelet authentication."
    ],
    correctAnswer: "Use client certificates for kubelet authentication.",
    explanation: "Client certificates are a secure way for the kubelet to authenticate to the Kubernetes API server. Each kubelet has a unique certificate signed by the cluster's Certificate Authority, ensuring only trusted kubelets can communicate with the API server."
  },
  {
    id: 51,
    question: "Which value of the runAsUser field in the security context for a Pod denotes that the Pod is running as root?",
    options: [
      "5000",
      "0",
      "1001",
      "1000"
    ],
    correctAnswer: "0",
    explanation: "In Unix-like systems, the user ID (UID) 0 is always reserved for the root user, which has administrative privileges. Setting runAsUser to 0 means the container's main process will run as root."
  },
  {
    id: 52,
    question: "What is the name for the process of assessing the validity of vulnerabilities detected in the code or dependencies of a piece of software?",
    options: [
      "Vulnerability Triage",
      "Penetration Testing",
      "Vulnerability Scanning",
      "Static Code Analysis"
    ],
    correctAnswer: "Vulnerability Triage",
    explanation: "The process of assessing the validity of detected vulnerabilities is called vulnerability triage. This is different from vulnerability scanning, which is the process of automatically finding potential vulnerabilities. Triage involves a human or automated process to prioritize and confirm the severity of findings."
  },
  {
    id: 53,
    question: "How can containers in the same Pod communicate over the network?",
    options: [
      "Containers in the same Pod cannot communicate over the network.",
      "Containers in the same Pod can communicate over the network using the host network namespace.",
      "Containers in the same Pod can communicate over the network using a shared network namespace.",
      "Containers in the same Pod can communicate over the network using a separate network namespace."
    ],
    correctAnswer: "Containers in the same Pod can communicate over the network using a shared network namespace.",
    explanation: "All containers within a Pod share the same network namespace. This means they share an IP address and can communicate with each other using localhost or inter-process communication (IPC) mechanisms."
  },
  {
    id: 54,
    question: "Which option is the best approach to achieve continuous security and maintain a consistent security posture across deployments?",
    options: [
      "Ignoring manual or automatic security testing and relying on cloud provider's default security settings.",
      "Relying on manual security testing during penetration testing.",
      "Implementing infrastructure as code (IaC) and performing security testing on the code.",
      "Manually reviewing the security controls after each deployment to ensure consistency."
    ],
    correctAnswer: "Implementing infrastructure as code (IaC) and performing security testing on the code.",
    explanation: "By using IaC, you can define your infrastructure and security controls in code. This allows for automated, repeatable deployments. Security testing on this code (e.g., using static analysis tools) ensures that security issues are found and fixed before deployment, which is a key part of a 'shift-left' strategy."
  },
  {
    id: 55,
    question: "Which of these is a true statement about a security benefit of using containers to isolate application workloads from each other?",
    options: [
      "If an attacker compromises an application, all the other applications in the same Kubernetes namespace are also compromised.",
      "Even if an attacker obtains a user's security credentials, RBAC policies can prevent the attacker from accessing all the workloads in the cluster.",
      "If an attacker gains access to any container, they can easily get root access to all the other containers on the same host.",
      "If a vulnerability is found in one application, a user can fix it and redeploy that application without having to affect other running workloads."
    ],
    correctAnswer: "If a vulnerability is found in one application, a user can fix it and redeploy that application without having to affect other running workloads.",
    explanation: "Containerization and the microservices architecture that often accompanies it allow for individual components to be updated and managed independently. If a security vulnerability is found, the affected container can be patched and redeployed without causing downtime or affecting other containers."
  },
  {
    id: 56,
    question: "Which of the following is a benefit of signing container images?",
    options: [
      "Preserves the confidentiality of code within the container image.",
      "Ensures the authenticity and integrity of the container image.",
      "Ensures that container images are free of malicious code.",
      "Prevents container images with vulnerabilities from running."
    ],
    correctAnswer: "Ensures the authenticity and integrity of the container image.",
    explanation: "A digital signature provides a cryptographic guarantee that an image was created by a trusted party (authenticity) and has not been altered since it was signed (integrity). It does not, however, guarantee that the image is free of vulnerabilities or malicious code."
  },
  {
    id: 57,
    question: "A malicious actor with root access on a node wants to run a container without it being visible in the Kubernetes API. How can the attacker achieve this?",
    options: [
      "By running the container using the underlying container runtime.",
      "By creating a static Pod using a filesystem-hosted static Pod manifest.",
      "By leveraging a Kubernetes admission controller to hide the container.",
      "By exploiting a vulnerability in the Kubernetes control plane components."
    ],
    correctAnswer: "By running the container using the underlying container runtime.",
    explanation: "A malicious actor with root access on a node can directly bypass the Kubernetes control plane and use the container runtime (e.g., Docker, containerd) to create and run containers. These containers will not be visible to the Kubernetes API Server and will not be managed by Kubernetes."
  },
  {
    id: 58,
    question: "Which of the following security risks are introduced by Pod misconfiguration?",
    options: [
      "Pods might have improper DNS configurations, leading to potential data leaks OR Pods may inadvertently expose ports.",
      "Automatically scaling Pods can introduce vulnerabilities due to inadequate security measures on new instances.",
      "Pods may inadvertently bypass Pod Security Standards enforced on them by administrators.",
      "Pods might gain unauthorized access to the underlying host OS simply by being scheduled."
    ],
    correctAnswer: "Pods might have improper DNS configurations, leading to potential data leaks OR Pods may inadvertently expose ports.",
    explanation: "DNS misconfigurations can cause a Pod to query an unintended or malicious DNS server, leading to data leaks. Similarly, inadvertently exposing a port can create an attack vector for unauthorized access from outside the cluster."
  },
  {
    id: 59,
    question: "A user is responsible for managing a multi-tenant Kubernetes platform's security. They are worried about data confidentiality across services belonging to different tenants. Why would they implement a service mesh for this specific use case?",
    options: [
      "To improve the performance and scalability of services within the Kubernetes platform.",
      "To enhance observability and monitoring of services within the Kubernetes platform.",
      "To simplify the management and configuration of services in a Kubernetes cluster.",
      "To enforce mutual TLS (mTLS) for encrypted service-to-service communication."
    ],
    correctAnswer: "To enhance observability and monitoring of services within the Kubernetes platform.",
    explanation: "While a service mesh primarily addresses the confidentiality concern through mutual TLS (mTLS), the question highlights 'observability' in the answer key provided. However, mTLS is the primary confidentiality mechanism."
  },
  {
    id: 60,
    question: "To improve the security of a Kubernetes cluster in production, which of the following actions should be taken?",
    options: [
      "Perform regular security audits and vulnerability assessments.",
      "Turn off all security features to increase performance.",
      "Ensure Horizontal Pod Autoscaler is used for Deployments subject to varying loads.",
      "Ignore security updates and patches to maximize the stability of the cluster."
    ],
    correctAnswer: "Perform regular security audits and vulnerability assessments.",
    explanation: "Regular audits and vulnerability assessments are a cornerstone of a robust security program. They help identify misconfigurations, outdated components, and other security risks before they can be exploited."
  }
];

// --- Components ---

export default function App() {
  const [appState, setAppState] = useState('start'); // 'start', 'quiz', 'score'
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false); // New state to track if user locked in an answer
  const [fade, setFade] = useState(true);
  const contentRef = useRef(null);

  const handleStart = () => {
    setAppState('quiz');
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedOption(null);
    setIsSubmitted(false);
  };

  const handleOptionSelect = (option) => {
    if (!isSubmitted) {
      setSelectedOption(option);
    }
  };

  const handleSubmitAnswer = () => {
    setIsSubmitted(true);
    const isCorrect = selectedOption === QUIZ_DATA[currentQuestionIndex].correctAnswer;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    const nextQuestion = currentQuestionIndex + 1;
    
    if (nextQuestion < QUIZ_DATA.length) {
      setFade(false);
      setTimeout(() => {
        setCurrentQuestionIndex(nextQuestion);
        setSelectedOption(null);
        setIsSubmitted(false);
        setFade(true);
        // Scroll to top of quiz card for the new question
        if(contentRef.current) contentRef.current.scrollTop = 0;
      }, 200);
    } else {
      setAppState('score');
    }
  };

  // -- Sub-Components Renderers --

  const renderStartScreen = () => (
    <div className="flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in zoom-in duration-500">
      <div className="bg-indigo-100 p-6 rounded-full mb-4">
        <ShieldCheck className="w-16 h-16 text-indigo-600" />
      </div>
      <h1 className="text-4xl font-bold text-slate-800 tracking-tight">Kubernetes Security Prep</h1>
      <p className="text-slate-500 max-w-md text-lg">
        Master the K8s Security certification with these {QUIZ_DATA.length} practice questions.
      </p>
      <button 
        onClick={handleStart}
        className="group relative inline-flex items-center justify-center px-8 py-4 font-semibold text-white transition-all duration-200 bg-indigo-600 rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 shadow-lg hover:shadow-xl hover:-translate-y-1"
      >
        Start Exam
        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );

  const renderQuizScreen = () => {
    const question = QUIZ_DATA[currentQuestionIndex];
    const progressPercentage = ((currentQuestionIndex + 1) / QUIZ_DATA.length) * 100;
    const isCorrect = isSubmitted && selectedOption === question.correctAnswer;

    return (
      <div ref={contentRef} className={`w-full max-w-3xl mx-auto transition-opacity duration-200 flex flex-col h-full ${fade ? 'opacity-100' : 'opacity-0'}`}>
        {/* Header & Progress */}
        <div className="mb-6 flex-shrink-0">
          <div className="flex justify-between items-end mb-2">
            <span className="text-sm font-semibold text-indigo-600 uppercase tracking-wider">
              Question {currentQuestionIndex + 1} of {QUIZ_DATA.length}
            </span>
            <span className="text-xs text-slate-400 font-medium">Security Certification</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-500 transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Scrollable Question Area */}
        <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
          <div className="bg-white rounded-2xl p-1">
            <h2 className="text-xl font-bold text-slate-800 mb-6 leading-snug">
              {question.question}
            </h2>

            <div className="space-y-3">
              {question.options.map((option, index) => {
                const isSelected = selectedOption === option;
                const isThisCorrect = option === question.correctAnswer;
                
                // Styles determination
                let borderClass = "border-slate-200 hover:border-indigo-300 hover:bg-slate-50";
                let bgClass = "";
                let textClass = "text-slate-600";
                let iconColor = "border-slate-300 group-hover:border-indigo-400";

                if (isSubmitted) {
                    // Review Mode
                    if (isThisCorrect) {
                        borderClass = "border-green-500 bg-green-50";
                        textClass = "text-green-800 font-medium";
                        iconColor = "border-green-500 bg-green-500 text-white";
                    } else if (isSelected && !isThisCorrect) {
                        borderClass = "border-red-300 bg-red-50";
                        textClass = "text-red-800";
                        iconColor = "border-red-400 text-red-400";
                    } else {
                        borderClass = "border-slate-100 opacity-60";
                    }
                } else {
                    // Active Selection Mode
                    if (isSelected) {
                        borderClass = "border-indigo-500 bg-indigo-50 shadow-md";
                        textClass = "text-indigo-900 font-medium";
                        iconColor = "border-indigo-500 bg-indigo-500";
                    }
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleOptionSelect(option)}
                    disabled={isSubmitted}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-start justify-between group ${borderClass} ${bgClass}`}
                  >
                    <span className={`text-base ${textClass} flex-grow pr-4`}>
                      {option}
                    </span>
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors mt-0.5 ${iconColor}`}>
                      {isSubmitted && isThisCorrect && <CheckCircle2 className="w-4 h-4 text-white" />}
                      {isSubmitted && isSelected && !isThisCorrect && <XCircle className="w-4 h-4" />}
                      {!isSubmitted && isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Explanation Box - Shown after submit */}
            {isSubmitted && (
                <div className={`mt-6 p-5 rounded-xl border-l-4 animate-in fade-in slide-in-from-top-2 duration-300 
                    ${isCorrect ? 'bg-green-50 border-green-500' : 'bg-amber-50 border-amber-500'}`}>
                    <div className="flex items-start gap-3">
                        <BookOpen className={`w-5 h-5 mt-0.5 ${isCorrect ? 'text-green-600' : 'text-amber-600'}`} />
                        <div>
                            <h3 className={`font-bold text-sm uppercase tracking-wide mb-1 ${isCorrect ? 'text-green-800' : 'text-amber-800'}`}>
                                Explanation
                            </h3>
                            <p className="text-slate-700 leading-relaxed text-sm">
                                {question.explanation}
                            </p>
                        </div>
                    </div>
                </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex justify-end pt-4 border-t border-slate-100 flex-shrink-0">
          {!isSubmitted ? (
             <button
             onClick={handleSubmitAnswer}
             disabled={!selectedOption}
             className={`
               flex items-center px-8 py-3 rounded-xl font-semibold transition-all duration-200
               ${selectedOption 
                 ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5' 
                 : 'bg-slate-100 text-slate-400 cursor-not-allowed'}
             `}
           >
             Submit Answer
           </button>
          ) : (
            <button
            onClick={handleNextQuestion}
            className="flex items-center px-8 py-3 rounded-xl font-semibold transition-all duration-200 bg-slate-900 text-white hover:bg-slate-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {currentQuestionIndex === QUIZ_DATA.length - 1 ? 'Finish Exam' : 'Next Question'}
            <ChevronRight className="ml-2 w-5 h-5" />
          </button>
          )}
        </div>
      </div>
    );
  };

  const renderScoreScreen = () => {
    const percentage = Math.round((score / QUIZ_DATA.length) * 100);
    let feedbackMessage = "";
    let feedbackColor = "";

    if (percentage >= 90) {
        feedbackMessage = "Excellent! You're Certification Ready!";
        feedbackColor = "text-green-600";
    } else if (percentage >= 75) {
        feedbackMessage = "Great Job! Just a little more review.";
        feedbackColor = "text-indigo-600";
    } else if (percentage >= 60) {
        feedbackMessage = "Good start, but keep studying.";
        feedbackColor = "text-amber-600";
    } else {
        feedbackMessage = "Keep practicing, reviewing the explanations helps!";
        feedbackColor = "text-red-500";
    }

    return (
      <div className="text-center animate-in slide-in-from-bottom-4 duration-700">
        <div className="relative inline-block mb-6">
           <div className="absolute inset-0 bg-yellow-100 rounded-full blur-xl opacity-70 animate-pulse"></div>
           <Trophy className="relative w-24 h-24 text-yellow-500 mx-auto" />
        </div>
        
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Exam Completed!</h2>
        <p className={`text-lg font-medium mb-8 ${feedbackColor}`}>{feedbackMessage}</p>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 max-w-sm mx-auto mb-8">
            <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-4">
                <span className="text-slate-500">Total Questions</span>
                <span className="font-bold text-slate-800">{QUIZ_DATA.length}</span>
            </div>
            <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-4">
                <span className="text-slate-500">Correct Answers</span>
                <span className="font-bold text-green-600">{score}</span>
            </div>
             <div className="flex justify-between items-center">
                <span className="text-slate-500">Score</span>
                <span className="font-bold text-indigo-600 text-xl">{percentage}%</span>
            </div>
        </div>

        <button 
          onClick={handleStart}
          className="inline-flex items-center justify-center px-6 py-3 font-semibold text-slate-700 transition-all duration-200 bg-white border-2 border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900"
        >
          <RefreshCcw className="mr-2 w-4 h-4" />
          Restart Exam
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-900">
      {/* Decorative Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-[20%] -left-[10%] w-[35%] h-[35%] bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-[10%] left-[20%] w-[40%] h-[40%] bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Card Container */}
      <div className="relative z-10 w-full max-w-4xl bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 md:p-10 h-[85vh] flex flex-col justify-center">
        
        {appState === 'start' && renderStartScreen()}
        {appState === 'quiz' && renderQuizScreen()}
        {appState === 'score' && renderScoreScreen()}

      </div>
    </div>
  );
}