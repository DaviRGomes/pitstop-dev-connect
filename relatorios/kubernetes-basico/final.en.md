# Kubernetes Basics: from zero to autoscaling, hands on the keyboard

> Based on lessons 1–8 (Thiago Adriano / FIAP), plus a bonus stage on a professional application.

This guide teaches Kubernetes from scratch, in eight stages and a bonus, with every exercise running on a Minikube cluster on your own machine. You start by understanding why an orchestrator exists and how to talk to the cluster through kubectl; then you study the anatomy of the cluster and Pods, Services and ConfigMaps, ReplicaSets and Deployments, persistent volumes, probes and the HPA. In the bonus stage, you put these pieces together in a deployment of a real Docker Hub image and decide which of them the app needs and which stay out. Before the stages, the next section introduces the F1 lens of the guide: a general comparison that shows the same system working inside a Formula 1 team.

Each stage depends only on what was explained before it and includes a small exercise that proves you understood. Kubernetes is learned by running things and by making mistakes on purpose, so do not skip the "Hands-on" blocks.

**How to use this guide:** keep a terminal open next to the text. All commands were designed for Minikube, which you install in Stage 01. When an example shows the expected output, compare it with yours. Pod names, IPs and timings will vary; the structure of the output is what matters. When an output is shortened, it is marked with `(...)`.

**Organize your files by stage.** Create one folder for each stage (`etapa03/`, `etapa04/`, `etapa05/` and so on) and save the YAMLs inside it. This is necessary because the name `deployment.yaml` repeats in Stages 05, 08 and 09, and `service.yaml` and `hpa.yaml` repeat in Stages 08 and 09, and working in a single folder would make one file overwrite the previous one. Run the commands from inside the stage folder. At the end of each stage there is a cleanup step; run it before moving on, so that old objects do not interfere with the following exercises.

## The F1 lens of this guide

A Formula 1 team arrives at a Grand Prix weekend with two cars, a garage in the pit lane and a few dozen people with clearly separated roles. On the pit wall (the gantry facing the track) sit the strategist and the engineers who decide: what each car should do, when to stop, which target to chase. In the garage are the mechanics, organized in one crew per car, each with a chief mechanic. They do not decide strategy: they assemble, adjust and repair the cars according to what the pit wall defined. The cars, on the track, are the units that actually do the work. The regulations limit each team to two cars per race, and that limit will show up a few times as the point where the comparison stops holding.

Nobody on the pit wall touches the car. Information flows through two channels: the team radio and intercom, which carry orders and questions, and the telemetry, hundreds of sensors that continuously transmit the state of each car. To enter that channel you have to be on the team's frequency and hold a credential. Everything the team knows and decides is recorded on the data servers: the weekend plan, the versions of each part, the history of each car. Whoever wants to know how a car is doing consults that record through the official channel, instead of walking to the garage to ask.

The car itself is described by a specification sheet: chassis, power unit (the car's engine, which combines the combustion engine and the electrical part that recovers and returns energy), aerodynamic package, each component with its version. Two cars assembled from the same sheet are equivalent, and a chassis destroyed in a crash is replaced by another one assembled from the same sheet. The chassis is disposable; the specification is what remains. Separate from it there is the parameter sheet (engine maps, energy modes, targets), which changes the car's behavior without swapping any part. What the radio and the timing call is the car's race number, never the serial number of the chassis underneath it.

It is the same division of labor that Kubernetes makes: the control plane decides like the pit wall, the nodes execute like the garages, the Pods run like the cars, each Pod comes out of a manifest the way the car comes out of the specification sheet, and everything that is known and ordered goes through a single channel, like the radio and the telemetry. In this guide, you take the place of the person who writes the plan and talks to the pit wall over the radio.

One fixed rule holds for the whole guide: each assembled chassis is a Pod. Swapping the chassis means creating a new Pod, with another serial number (another IP), while the race number (the Service) stays the same. Restarting a system that shut down inside the car, without swapping the chassis, is restarting a container inside the same Pod.

The table below translates each technical term in the guide into an everyday idea, with no F1 and no jargon. You do not need to memorize it; come back to it whenever a term shows up in the text.

| Technical term | In plain words |
|---|---|
| Cluster | A group of computers working together as if they were one. |
| Control plane (master node) | The management: it decides what runs on each computer and checks that everything matches what was asked, but it does not do the work itself. |
| Worker node | One of the computers that actually does the work. |
| API Server | The service desk: every request and every question goes through it. |
| kubectl | The app you use to talk to the service desk. |
| kubeconfig | The address of the service desk and your access badge, kept in a file. |
| Imperative and declarative | Giving an order on the spot ("do this now") or writing down how things should end up. |
| Events | The time-stamped history of what happened to each item. |
| etcd | The official notebook where everything that was requested, and the current state of each thing, is written down. |
| kubelet | The supervisor on each computer, who looks after what runs there. |
| kube-proxy | The contact list on each computer, which knows where to forward each call. |
| Virtual machine | A whole computer simulated inside another one, with its own operating system: complete, but heavy. |
| Host kernel | The core of the computer's system, shared by every program running on it. |
| Container image | A sealed recipe with a version number: followed anywhere, it always gives the same result. |
| Container | The program prepared from the recipe, running apart from the others; it can be restarted without touching the rest. |
| Pod | The smallest box the system manages: one or more programs that always travel together. If the box is replaced, it is a different box, with a different address. |
| Second container in the Pod | A helper program inside the same box, like a recorder that logs what the main one does. |
| Pod IP | The box's address, which changes when the box is replaced. |
| Namespace | Separate folders inside the same system, each with its own list of items. |
| Label | A sticker on an item, used to find all items of the same kind at once. |
| Annotation | A sticky note on an item, written for people to read; it is not used for searching. |
| YAML manifest | The filled-in form that describes what you want, kept so it can be reused. |
| Desired state | A standing request, like "always keep 3 running", that the system works on its own to maintain. |
| Minikube | A workbench version of the system that runs on your own computer for studying. |
| Service | A fixed service number that forwards the call to whoever is available, even when the people change. |
| ClusterIP, NodePort, LoadBalancer | An internal-only extension; the same extension opened on every computer for outside callers; a published public number. |
| ConfigMap | The settings sheet kept apart from the program, read when the program starts. |
| Secret | The same kind of sheet, for passwords and keys, kept with more care. |
| ReplicaSet | The rule "always N copies running": if one disappears, another is created. |
| Deployment | The one in charge of versions: it swaps versions carefully and keeps the history of earlier ones. |
| Rolling update | Swapping the version one copy at a time, without closing the service. |
| Rollback | Going back to the previous version, the one that worked. |
| emptyDir | A temporary scratch pad, thrown away together with the box. |
| hostPath | A drawer in one specific computer: it is only useful to whoever is on that computer. |
| PVC | The request for space to store data ("I need 1 GB"). |
| PV | The actual storage space that fulfills that request. |
| StorageClass | The menu of storage types that can be created when someone asks. |
| restartPolicy | The rule that restarts, on its own, a program that crashed, in the same box. |
| Probes | Routine questions asked every few seconds to find out whether the program is fine. |
| Liveness, readiness, startup | "Are you alive?" (if not, restart); "can you serve?" (if not, stay out of the service); "have you finished starting?" (until then, the other questions wait). |
| HPA | Automatic adjustment of the number of copies to match demand, always between a minimum and a maximum. |
| metrics-server | The usage meter that feeds that adjustment; without it, there are no numbers to decide with. |
| resources.requests | The declared reservation of resources; usage percentages are calculated from it. |

### Where the comparison stops

The comparison helps fix the division of roles, but it is not a perfect equivalence. These are the points where F1 stops applying for each stage:

- **Stage 01:** a team replaces a car in hours, between sessions, and the regulations fix the number at two cars; Kubernetes creates a new Pod in seconds, at any moment, and the limit on quantity is only what the cluster can handle.
- **Stage 02:** the F1 radio is voice, interpreted by people; the Kubernetes API is a rigid HTTP protocol, in which every request has a method, a path and a response code, with no room for interpretation.
- **Stage 03:** the systems of a car are physically integrated and designed together, while the containers of a Pod are independent processes that can be swapped one by one in the specification without touching the others.
- **Stage 04:** a race number points to a single car, while the Service distributes requests among several replicas at the same time; load balancing has no equivalent in F1.
- **Stage 05:** in F1, a car is replaced between sessions, in hours, and the regulations limit the team to two cars; the ReplicaSet replaces in seconds, at any moment, and keeps whatever number of replicas is declared.
- **Stage 06:** in F1, the car's data is transmitted or downloaded to the servers, that is, a copy exists; the PVC copies nothing, the Pod writes directly to the external volume, and if the PVC is deleted with the `Delete` policy the data goes with it.
- **Stage 07:** in F1, restarting a system on track involves the driver and almost always costs the session; in Kubernetes, the kubelet restarts the container in seconds, with nobody's intervention, and the Pod remains the same Pod, with the RESTARTS counter going up.
- **Stage 08:** at a GP the team races with exactly two cars, by regulation; the HPA, which adds or removes replicas according to load, only has a parallel in an imaginary operation with no limit on cars, and this is the stage where the comparison strays furthest from real F1.
- **Stage 09:** in an F1 car the driver changes maps and modes from the steering wheel in the middle of a lap, and the new value applies at once; in Kubernetes, an environment variable read from a ConfigMap only changes when the Pod is recreated.

---

## Stage 01: Why Kubernetes exists

### The problem

Picture the e-commerce site of a mid-sized company. For eleven months it receives a predictable volume of visits. In the week of Black Friday, traffic multiplies several times over. If you size the servers for everyday traffic, the site goes down at the peak. If you size them for the peak, you pay for idle machines all year. The infrastructure needs to grow and shrink with demand.

There is a second, less visible problem. The developer runs the application on their own machine, QA tests on another one, and production is a third. Any difference in library version, operating system or configuration produces the classic "it works on my machine". Keeping dev, test and production identical by hand is a constant source of bugs.

Every software project runs into these two problems: keeping environments equal and scaling when demand changes. Kubernetes automates the solution to both.

### The concept

The piece common to both solutions is the **container**.

A virtual machine (VM) carries virtualized hardware and a complete operating system: it takes up gigabytes and takes minutes to start. A container shares the kernel of the host operating system and carries only the files, binaries and libraries the app needs: it takes up megabytes and starts in seconds. A **container image** packages that whole environment and can be run identically anywhere, which solves the "it works on my machine" problem.

Containers solve the environment problem and create another one. With dozens or hundreds of them, someone has to create them, destroy them, watch the health of each one and recreate whatever fails. Doing that manually does not scale. **Kubernetes (K8s)** is the **orchestrator** that takes over these tasks.

The central idea of Kubernetes is the **desired state**. You do not run a sequence of orders ("start this container, then that one"). You declare the result you want ("I want 3 copies of this application running") and Kubernetes continuously compares what exists with what was declared, correcting any difference. If one of the copies disappears at 3 a.m. (the Pod is deleted or the node it was running on goes down), the cluster notices that there are 2 copies instead of 3 and creates the missing one, without anyone waking up. When what fails is only the process inside the container, another mechanism reacts, one you will clearly tell apart in Stage 07.

![Three columns: traditional deployment, with apps directly on the operating system; virtualized deployment, with a hypervisor and one operating system per virtual machine; container deployment, with a container runtime on a single operating system.](/guides/kubernetes/etapa01-evolucao-deploy.svg "From left to right: apps directly on the server, one VM with its own operating system for each app, and containers sharing the same operating system. | Diagram: kubernetes.io, The Kubernetes Authors, CC BY 4.0")

### Key concepts

- **Container**: an isolated process that shares the host kernel and carries only what the app needs. Much lighter than a VM.
- **Image**: an immutable package with the app's environment. The container is an image in execution.
- **Horizontal scaling**: more copies of the application sharing the load (this is what K8s automates). Vertical scaling is giving more CPU and RAM to the same machine.
- **Cluster and node**: K8s organizes machines (nodes) into a cluster, which is treated as a single platform.
- **Pod**: the group of containers that K8s manages as a unit. It is the smallest managed unit (details in Stage 03).
- **Namespace**: a logical separation of resources inside the cluster. When you indicate none, the namespace used is `default`.
- **kubectl**: a command-line tool that talks to the cluster's REST API (details in Stage 02).
- **Minikube**: a 1-node K8s cluster running on your machine. Built for study, it is the lab of this guide.
- **Desired state**: you declare what you want, and K8s makes it happen and keeps it that way. If something goes down, it recreates it.

### Worked example: setting up the lab

```sh
# 1. Install Docker Desktop (docker.com). On Linux, use Docker
#    Engine (docs.docker.com/engine/install). Confirm:
$ docker -v
Docker version 27.x

# 2. Install kubectl (kubernetes.io/docs/tasks/tools) and confirm.
#    Use --client: there is no cluster yet, so only the client
#    version can be queried (without --client, kubectl would try to talk
#    to a nonexistent server and print a connection error)
$ kubectl version --client
Client Version: v1.30.x
Kustomize Version: v5.x

# 3. Install Minikube (minikube.sigs.k8s.io/docs/start) and start the cluster:
$ minikube start
😄  minikube v1.33 on Windows 11
✨  Using the docker driver
🏄  Done! kubectl is now configured to use "minikube"

# 4. Confirm the cluster is up:
$ kubectl get nodes
NAME       STATUS   ROLES           AGE   VERSION
minikube   Ready    control-plane   1m    v1.30.x

# 5. Empty cluster = success:
$ kubectl get pods
No resources found in default namespace.

# 6. Now that the cluster exists, the full version shows client and server:
$ kubectl version --output=yaml
clientVersion:
  (...)
serverVersion:
  (...)
```

The first run of `minikube start` downloads the cluster image and takes a few minutes. This is normal.

### Essential commands

- `minikube start`: starts the local 1-node cluster.
- `minikube stop`: stops the cluster without deleting anything.
- `kubectl version --client`: shows the kubectl version, with no cluster needed.
- `kubectl get nodes`: lists the nodes and the status of each one.
- `kubectl get pods`: lists the pods in the current namespace.

### Hands-on

The smallest possible exercise: prove that the lab is alive.

1. Run `minikube start` and wait for the "Done!".
2. Run `kubectl get nodes`. **Observe** the `minikube` node with `STATUS Ready`. If `NotReady` appears, wait 1 minute and repeat.
3. Run `kubectl get pods`. **Observe** `No resources found in default namespace.` An empty, ready cluster is the starting point of the next stage.
4. Bonus: run `minikube stop` and then `kubectl get nodes`. **Observe** the connection error message (the cluster does not respond). Start it again with `minikube start`. Now you know what "cluster down" looks like in the terminal.

### Tip

If `minikube start` fails, the most common cause is Docker Desktop not being open. On Linux, the equivalent is the stopped service: `sudo systemctl start docker`. Start Docker first and try again.

### Takeaway

> A container is a light, replicable environment; Kubernetes maintains the desired state of those containers: you declare what you want, and it guarantees it.

---

## Stage 02: kubectl and the API, how you command the cluster

### The problem

The cluster is up (Stage 01), but you still do not know how to talk to it. Imagine that the checkout service stopped responding at 2 a.m. and you are on call. You need to find out which pods exist, what state they are in, what the app is printing and, if necessary, get inside the container to investigate. None of this can depend on physical access to the machine where the container runs.

### The concept

Everything in Kubernetes goes through the **REST API** of the master node (the *control plane*). `kubectl` is the client of that API: each command you type becomes an HTTP request (GET, POST, PUT or DELETE) against the cluster.

The path of a command is this:

1. You type `kubectl get pods`.
2. kubectl reads the **kubeconfig** file, which holds the API Server address, the credentials and the current cluster context. Minikube fills in this file by itself on `minikube start`.
3. kubectl sends a `GET` to the API Server (for the `default` namespace, the path is `/api/v1/namespaces/default/pods`).
4. The response comes back and kubectl formats it in the terminal.

The API is divided into groups. The "core" group holds the fundamental resources (pods, services, replicasets); other groups handle security, storage and autoscaling. Since it is plain REST, any language (Python, Go, Java, C#) can call it, which opens room for automation.

There are two ways of working with kubectl:

- **Imperative**: you give the direct order, as in `kubectl run nginx --image=nginx`. It is fast and good for tests.
- **Declarative**: you write a YAML file that describes the desired state and run `kubectl apply -f file.yaml`. It is the dominant mode in real projects, because the file can be versioned in Git, reviewed and reapplied.

In this guide we start with the imperative way, which is faster to learn, and move to the declarative way in Stage 03.

![In the terminal, kubectl get pods reads the kubeconfig, with the API Server address and credentials, and sends GET /api/v1/namespaces/default/pods to the API Server, in the control plane, which reads etcd; the response comes back as JSON and kubectl formats it. Below, the imperative mode with kubectl run and the declarative mode with kubectl apply -f.](/guides/kubernetes/etapa02-kubectl-api.en.svg "Every kubectl command becomes an HTTP request to the API. The kubeconfig says where to send it and with which credentials, and `-v=6` shows the request that was made. | Diagram: made for this guide")

### Key concepts

- **API Server**: the cluster's front door; it receives every request, validates it and executes it.
- **kubeconfig**: a file with the cluster address, credentials and current context.
- **Imperative vs. declarative**: giving step-by-step orders versus describing the final state.
- **Events**: history of events for an object (image pulled, container created, failure). It appears at the end of `describe`.
- **Everyday verbs**:
  - `get`: queries resources and the status of each one (`get pods`, `get svc`, `get nodes`).
  - `create` / `run` / `apply`: create resources. `run` creates an imperative pod; `apply -f` applies a YAML.
  - `delete`: removes. Be careful, it can affect whoever depends on the resource.
  - `describe`: shows the configuration and the Events section. It is the first stop when something gets stuck.
  - `logs`: shows what the container is printing. It is the main source of information when debugging.
  - `exec`: runs a command inside the container, for example a shell.

### Worked example: the life cycle of a Pod

```sh
# Creates a pod named "nginx" from the nginx:1.14.2 image on Docker Hub
$ kubectl run nginx --image=nginx:1.14.2 --port=80
pod/nginx created

# Follow until the status becomes Running (the first state is ContainerCreating)
$ kubectl get pods
NAME    READY   STATUS    RESTARTS   AGE
nginx   1/1     Running   0          30s

# Details + events (see the "Pulling image" line in the Events section)
$ kubectl describe pod nginx
Name:         nginx
(...)
Events:
  Type    Reason     Age   From               Message
  Normal  Scheduled  35s   default-scheduler  Successfully assigned default/nginx to minikube
  Normal  Pulling    34s   kubelet            Pulling image "nginx:1.14.2"
  Normal  Pulled     20s   kubelet            Successfully pulled image "nginx:1.14.2"
  Normal  Created    20s   kubelet            Created container nginx
  Normal  Started    20s   kubelet            Started container nginx

# What the container is printing (nginx writes the access log to standard
# output, so it only shows lines after requests arrive)
$ kubectl logs nginx

# Opens a shell inside the container (type "exit" to leave).
# Note: after this command you are INSIDE the container and the prompt
# becomes "# ". The lines below that start with "# " (ls and exit) are not
# comments: they are commands typed in the container's shell.
$ kubectl exec -it nginx -- /bin/sh
# ls /usr/share/nginx/html
50x.html  index.html
# exit

# Back in your terminal (prompt "$"). Cleanup:
$ kubectl delete pod nginx
pod "nginx" deleted
```

If the status stays at `ImagePullBackOff`, the cluster could not download the image. Check the image name and tag and your internet connection.

To see the HTTP request behind a command, raise kubectl's log level. The exact format changes from version to version, but you should find a line with the method, the API path and the status:

```sh
$ kubectl get pods -v=6
(...) GET https://192.168.49.2:8443/api/v1/namespaces/default/pods?limit=500 200 OK in 12 milliseconds
NAME    READY   STATUS    RESTARTS   AGE
nginx   1/1     Running   0          2m
```

### Essential commands

- `kubectl run nginx --image=nginx:1.14.2 --port=80`: creates an imperative pod.
- `kubectl get pods`: lists the pods and their status.
- `kubectl describe pod <name>`: details and Events (troubleshooting).
- `kubectl logs <name>`: container output.
- `kubectl exec -it <name> -- /bin/sh`: shell inside the container.
- `kubectl delete pod <name>`: removes the pod.
- `kubectl get pods -v=6`: shows the HTTP request that kubectl made.

### Hands-on

Run the complete cycle and provoke your first error on purpose.

1. Run the sequence from the example (`run`, `get`, `describe`, `logs`, `delete`). **Observe** the `Events` section of `describe`: the lines `Pulling image`, `Created container` and `Started container` tell the pod's story in order.
2. Create a deliberately broken pod: `kubectl run quebrado --image=nginx:versao-que-nao-existe`.
3. Run `kubectl get pods`. **Observe** the status `ErrImagePull`, which soon becomes `ImagePullBackOff`.
4. Run `kubectl describe pod quebrado`. **Observe** in the Events the message saying the image was not found. You have just practiced the real debugging flow.
5. Run `kubectl get pods -v=6` and **observe** the line with `GET .../api/v1/namespaces/default/pods`. This is the command translated into HTTP.
6. Clean up: `kubectl delete pod quebrado`.

### Tip

Memorize the debugging flow: `get pods` (what is the status?), then `describe pod` (what do the Events say?), then `logs` (what does the app say?). This sequence solves most problems.

### Takeaway

> Everything in K8s is a call to the REST API, kubectl is the client of that API, and when something gets stuck the path is always get, describe, logs.

---

## Stage 03: The anatomy of the cluster and its smallest unit, the Pod

### The problem

In Stage 02 you created a pod with an imperative command. It works, but there are two gaps. First, you do not know what exactly was created or where inside the cluster. Second, if tomorrow you need to recreate that same pod in another environment, you will only have your memory of the command you typed. On top of that, imagine a team with 40 pods in the same cluster (checkout, catalog, payment, search). How do you list only the checkout ones? We need to understand the pieces of the cluster, describe objects in versionable files and group them by criteria that Kubernetes itself can use.

### The concept

A **cluster** is a group of machines (**nodes**) working together, with well-defined roles:

- The **master node** (control plane) manages the cluster and decides where to run the Pods.
- The **worker nodes** run the Pods and the other resources.
- **etcd** is the distributed database that stores the configuration and state of everything in the cluster.
- The **kubelet** is the agent that runs on each node and manages the Pods of that node.
- **kube-proxy** forwards network traffic to the right Pod.
- The **API Server** is the front door, through which everything kubectl does passes (Stage 02).

The **Pod** is the smallest unit that Kubernetes manages: an envelope with one or more containers that share network and storage. Four facts about Pods:

1. A Pod represents a running process and can have more than one container, all sharing the same IP and the same volumes.
2. **Pods are ephemeral.** They are born and die all the time, and you must never count on a specific Pod existing tomorrow. This sentence is the root of Stages 04, 05 and 06.
3. Each Pod receives an internal cluster IP.
4. Pods are described in YAML.

To organize many objects there are **labels** and **annotations**. Labels are key-value pairs used to **identify and select** objects: it is by label that a Service finds its Pods (Stage 04) and that a Deployment knows which Pods are its own (Stage 05). Annotations are free-form metadata (author, documentation link, audit data) that **do not take part in selection**; they are for people and tools to read. This difference is a classic exam question.

![Diagram of a cluster: on the left, the control plane with kube-api-server, etcd, scheduler, controller manager and cloud-controller-manager; on the right, two nodes, each with kubelet, kube-proxy, container runtime and Pods.](/guides/kubernetes/etapa03-arquitetura-cluster.svg "The control plane decides and stores the state (API Server, etcd, scheduler, controller manager); each node runs the Pods with kubelet and kube-proxy. The cloud-controller-manager only exists in cloud clusters. | Diagram: kubernetes.io, The Kubernetes Authors, CC BY 4.0")

![Four Pods with different IPs: the first with one container, the second with one container and a volume, the third with two containers and a volume, the fourth with several containers and volumes.](/guides/kubernetes/etapa03-pods.svg "Each Pod has its own IP. Inside it, one or more containers share that IP and the declared volumes. | Diagram: kubernetes.io, The Kubernetes Authors, CC BY 4.0")

### Key concepts

- **Master node**: manages the cluster and decides where to run the Pods.
- **Worker node**: runs the Pods and other resources.
- **etcd**: distributed database with the cluster's configuration and state.
- **kubelet**: agent on each node that manages the local Pods.
- **kube-proxy**: forwards network traffic to the right Pods.
- **API Server**: front door for everything kubectl does.
- **Pod**: one or more containers with shared network and volumes; ephemeral.
- **Label**: key-value pair to identify and select objects.
- **Annotation**: free-form metadata for documentation, with no role in selection.
- **Manifest**: YAML file that describes an object. Every manifest has `apiVersion`, `kind`, `metadata` and `spec`.

### Worked example: the first YAML

Create the `etapa03/` folder and save the manifest below in it as `meu-pod.yaml`. This is the skeleton you need to know by heart.

```yaml
apiVersion: v1                # K8s API version for this object
kind: Pod                     # the TYPE of object created
metadata:                     # data ABOUT the object
  name: meu-pod
  labels:                     # labels: key-value pairs to SELECT
    app: myapp
    ambiente: estudo
  annotations:                # annotations: free-form metadata (docs)
    autor: "Davi Gomes"
spec:                         # the SPECIFICATION: what runs inside
  containers:
    - name: meu-container
      image: nginx:1.14.2
      ports:
        - containerPort: 80
```

Every K8s object follows this skeleton: `apiVersion` + `kind` + `metadata` + `spec`. What changes from one object to another is the value of `kind` and the content of `spec`; the rest is always the same. Whoever masters this skeleton can read any manifest.

```sh
# Applies the YAML (declarative)
$ kubectl apply -f meu-pod.yaml
pod/meu-pod created

# Lists showing the labels
$ kubectl get pods --show-labels
NAME      READY   STATUS    RESTARTS   AGE   LABELS
meu-pod   1/1     Running   0          20s   ambiente=estudo,app=myapp

# Filters by label: the central mechanism of K8s
$ kubectl get pods -l app=myapp
NAME      READY   STATUS    RESTARTS   AGE
meu-pod   1/1     Running   0          1m

# Adds a label to a pod that already exists
$ kubectl label pod meu-pod time=devops
pod/meu-pod labeled
```

The `-l` filter looks simple, but Services, ReplicaSets and Deployments find "their" Pods exactly this way, by **label selector**. The next stages depend on this mechanism.

### Essential commands

- `kubectl apply -f file.yaml`: creates or updates from the YAML.
- `kubectl get pods --show-labels`: lists showing the labels.
- `kubectl get pods -l app=myapp`: filters by label.
- `kubectl label pod <name> key=value`: adds a label to an existing pod.
- `kubectl delete -f file.yaml`: removes what the file created.

### Hands-on

1. Save the YAML above as `etapa03/meu-pod.yaml` and apply it with `kubectl apply -f meu-pod.yaml`.
2. Run `kubectl get pods --show-labels`. **Observe** the two labels in the last column.
3. Run `kubectl get pods -l app=myapp` and then `kubectl get pods -l app=outra-coisa`. **Observe**: the first finds the pod, the second answers `No resources found in default namespace.` This is the selection mechanism in action.
4. Add a label on the fly with `kubectl label pod meu-pod time=devops` and confirm with `--show-labels`.
5. Do not delete the pod now: it will be the target of the Service in the next stage, and its cleanup is at the end of Stage 04. If you deleted it, apply the YAML again. This is the advantage of the declarative way: the file recreates the identical object.

### Tip

Labels are operational selection (K8s uses them). Annotations are documentation (people use them). To record the author of a Pod, use an annotation; to group the Pods of an application, use a label.

### Takeaway

> Every K8s object is apiVersion + kind + metadata + spec, and labels are the mechanism by which everything in the cluster finds everything else.

---

## Stage 04: Services and ConfigMaps, a fixed address and external configuration

### The problem

From Stage 03, Pods are ephemeral and each new Pod is born with a different IP. Now imagine the front end of an e-commerce site calling the orders API. Today the API is at IP `10.244.0.5`. Tomorrow the Pod dies, is recreated and becomes `10.244.0.9`. If the front end has the old IP written in its code, it breaks at every recreation. How does anyone talk to Pods reliably if the address keeps changing?

There is a second problem. Every service needs configuration (ports, URLs of other services, flags). If these values live inside the container image, every change forces a rebuild and a republish of the image. Changing a URL should not require a new build.

### The concept

**Problem 1: the Service.** The Service is a stable entry point that finds the Pods by label and balances traffic among them. The flow is:

1. A request arrives at the Service, which has a fixed IP and name.
2. The Service selects the Pods by **label selector** (the mechanism from Stage 03).
3. Traffic is distributed in a balanced way among the healthy replicas.

The Service name becomes an **internal hostname** of the cluster. If the Service is called `auth-service`, any Pod in the cluster can reach `http://auth-service`, even if the Pods behind it change IP repeatedly.

There are three types of Service:

- **ClusterIP** (the default): internal IP, reachable only from inside the cluster. It serves communication between services (for example, API to database).
- **NodePort**: opens a fixed port (from 30000 to 32767) on every node. Access from outside is done through `node-IP:port`. It is the way to expose something on Minikube.
- **LoadBalancer**: provisions an external load balancer with a public IP. It is the type used in production in the cloud (AWS, GCP, Azure).

**Problem 2: the ConfigMap.** The ConfigMap stores configuration in an object separate from the container. You inject it into the Pod in three ways:

- **environment variables** (the most common, via `envFrom`);
- **mounted files** (great for long configurations);
- **command-line arguments**.

When the configuration changes, you update the ConfigMap and the image stays the same, with no rebuild. But pay attention to one detail: **environment variables are read when the container starts**. Updating the ConfigMap does not change the variables of a Pod that is already running; the Pod needs to be recreated to see the new values (you will see this happen in practice in Stage 09). ConfigMaps mounted as files, on the other hand, are usually updated inside the Pod after some time, without recreating it, but the app needs to reread the file to use the new value.

![A Service with selector app=A routes traffic to three Pods labeled app: A, managed by a Deployment and a ReplicaSet; a Pod labeled app: B is left out.](/guides/kubernetes/etapa04-service-labels.svg "The Service finds the Pods by the selector `app=A`, not by IP. The Pod with `app: B` gets no traffic from this Service. Deployment and ReplicaSet are covered in Stage 05. | Diagram: kubernetes.io, The Kubernetes Authors, CC BY 4.0")

### Key concepts

- **Service**: stable address (IP and name) that selects Pods by label and balances traffic.
- **selector**: the key-value pair that links the Service to the Pods; it must match the label of the Pods.
- **port / targetPort / nodePort**: `port` is where the Service listens; `targetPort` is the container port that receives; `nodePort` is the port exposed on the node (only for the NodePort type).
- **ClusterIP**: internal access only. **NodePort**: external access through a node port. **LoadBalancer**: external access through a public IP in the cloud.
- **Endpoints**: the list of Pod IPs the Service is actually using; empty when no Pod matches the selector.
- **ConfigMap**: object with key-value configuration pairs, separate from the image.
- **envFrom**: injects all the keys of a ConfigMap as environment variables (read only when the container is created).
- **Secret**: sibling of the ConfigMap, meant for passwords and keys.

### Worked example: look at the selector

Create the `etapa04/` folder and save this stage's manifests in it.

```yaml
# app.yaml: save the Service in this file
apiVersion: v1
kind: Service
metadata:
  name: meu-service            # becomes the internal hostname
spec:
  type: NodePort               # switch to ClusterIP (internal) or LoadBalancer (cloud)
  selector:                    # ← THE LINK: looks for Pods with this label
    app: myapp
  ports:
    - protocol: TCP
      port: 80                 # port the Service listens on
      targetPort: 80           # container port that receives
      nodePort: 30080          # port exposed on the node (NodePort only)
```

The Service `selector` matches the Pod label (`app: myapp`), exactly the `meu-pod` from Stage 03. This is how the Service knows where to send traffic.

```sh
$ kubectl apply -f app.yaml
service/meu-service created

$ kubectl get svc
NAME          TYPE        CLUSTER-IP    EXTERNAL-IP   PORT(S)        AGE
kubernetes    ClusterIP   10.96.0.1     <none>        443/TCP        1h
meu-service   NodePort    10.96.xx.xx   <none>        80:30080/TCP   10s

# Generates the access URL (on Windows/Docker, keep the terminal open: it is a tunnel)
$ minikube service meu-service --url
http://127.0.0.1:53412   ← open in the browser: nginx page
```

Now the ConfigMap, injected into a Pod as environment variables:

```yaml
# configmap-pod.yaml: both objects in the same file, separated by ---
# 1) The ConfigMap with the values...
apiVersion: v1
kind: ConfigMap
metadata:
  name: minha-config
data:
  MENSAGEM: "olá do configmap!"
  MODO: "estudo"
---
# 2) ...injected as environment variables into the Pod
apiVersion: v1
kind: Pod
metadata:
  name: pod-config
spec:
  containers:
    - name: app
      image: nginx:1.14.2
      envFrom:                 # injects ALL keys at once
        - configMapRef:
            name: minha-config
```

```sh
$ kubectl apply -f configmap-pod.yaml
configmap/minha-config created
pod/pod-config created

# Confirm the injection: the ConfigMap keys appear as variables
$ kubectl exec pod-config -- env
(...)
MENSAGEM=olá do configmap!
MODO=estudo
(...)
```

### Essential commands

- `kubectl get svc`: lists the Services.
- `minikube service <name> --url`: access URL for a NodePort.
- `kubectl get endpoints <service>`: lists the Pod IPs the Service is using.
- `kubectl get configmap`: lists the ConfigMaps.
- `kubectl exec <pod> -- env`: checks the injected environment variables.

### Hands-on

1. With the `meu-pod` from Stage 03 running (label `app: myapp`), save the Service YAML as `etapa04/app.yaml` and apply it.
2. Run `minikube service meu-service --url` and open the URL in the browser. **Observe** the nginx welcome page. You reached an ephemeral Pod through a stable address.
3. Test the link: delete the pod (`kubectl delete pod meu-pod`) and reload the browser. **Observe** that the page stops loading (the browser shows connection refused or timed out, depending on the system and the driver), since there is no Pod left with the label. Confirm the cause with `kubectl get endpoints meu-service`: the endpoints list is empty.
   ```sh
   $ kubectl get endpoints meu-service
   NAME          ENDPOINTS   AGE
   meu-service   <none>      5m
   ```
   Recreate the pod with `kubectl apply -f ../etapa03/meu-pod.yaml` and reload. Access is back without you touching the Service, and `kubectl get endpoints meu-service` shows an IP again (something like `10.244.0.7:80`).
4. Apply the ConfigMap and the pod (`kubectl apply -f configmap-pod.yaml`) and run `kubectl exec pod-config -- env`. **Observe** `MENSAGEM` and `MODO` in the list of variables.
5. Clean up the objects of this stage and the previous one:
   ```sh
   $ kubectl delete -f app.yaml -f configmap-pod.yaml -f ../etapa03/meu-pod.yaml
   service "meu-service" deleted
   configmap "minha-config" deleted
   pod "pod-config" deleted
   pod "meu-pod" deleted
   ```
   (The order of the lines may vary.) Also close the `minikube service` terminal, with Ctrl+C.

### Tip

Golden rule: expose the minimum. A database should be ClusterIP, invisible from outside. Only the system's entry point becomes NodePort or LoadBalancer. For passwords and keys, the safe sibling of the ConfigMap is the Secret.

### Takeaway

> A Service gives a fixed address to Pods that change (finding them by label); a ConfigMap takes configuration out of the image, but environment variables only change when the Pod is recreated.

---

## Stage 05: Self-healing and scaling with ReplicaSets and Deployments

### The problem

So far you have created Pods manually, which is fine for learning. In production, three situations break this model.

1. The only API Pod dies in the middle of the night (out of memory, hardware failure, bug). The site stays down until someone notices and recreates the Pod.
2. You need to release version 2.0 of the app without taking the service down during the swap.
3. Version 2.0 goes live with a serious bug and you need to go back to the previous one quickly. A deploy that broke on Friday at 6 p.m. cannot depend on improvisation.

### The concept

Two pieces solve this, one wrapping the other.

**ReplicaSet: guarantees the number of replicas.** You declare `replicas: 3` and it monitors the Pods by label selector. If a Pod disappears, the ReplicaSet notices that the count dropped and creates another in seconds, without anyone asking. This is **self-healing**, the desired state from Stage 01 maintained in practice. The ReplicaSet takes care of Pods that **disappear**. If what fails is only the process inside the container (a crash), the Pod still exists and whoever restarts the container is the kubelet, inside the same Pod; this separation is detailed in Stage 07.

**Deployment: manages versions.** It creates and manages the ReplicaSet under the hood and adds:

- **Rolling Update**: when you change the image, the Deployment brings up new replicas and shuts down the old ones gradually, and the service never goes down.
- **Rollback**: if the new version breaks, `kubectl rollout undo` returns to the previous one in seconds.
- **Manual scaling**: `kubectl scale --replicas=5` changes the number of replicas with one command.

Each version of the template has its own ReplicaSet. When the version changes, the Deployment creates a new ReplicaSet and shrinks the old one to zero. The name of a Pod reveals who it belongs to: in `nginx-fiap-7d4b9c-aaa`, the `7d4b9c` part identifies the ReplicaSet (the version), and the final suffix identifies the Pod. When the middle suffix changes in the middle of a rolling update, you are looking at Pods from a new ReplicaSet.

The ReplicaSet and Deployment YAMLs are almost identical, but day to day we nearly always use the Deployment, precisely because of version control.

![Rolling update, frame 1: a Service in front of four Pods of the old version, spread across three nodes, with the Deployment managing all of them.](/guides/kubernetes/etapa05-rolling-update-1.svg "1. Before the update: every Pod runs the old version behind the Service. | Diagram: kubernetes.io, The Kubernetes Authors, CC BY 4.0")
![Rolling update, frame 2: a Pod of the new version appears with a new IP, and an old Pod starts to leave.](/guides/kubernetes/etapa05-rolling-update-2.svg "2. A new Pod comes up with another IP; an old one starts to leave. | Diagram: kubernetes.io, The Kubernetes Authors, CC BY 4.0")
![Rolling update, frame 3: another Pod of the new version comes in with a new IP; old Pods are still serving.](/guides/kubernetes/etapa05-rolling-update-3.svg "3. The swap continues one Pod at a time, and the Service keeps serving with the ready Pods. | Diagram: kubernetes.io, The Kubernetes Authors, CC BY 4.0")
![Rolling update, frame 4: every Pod runs the new version, with new IPs, behind the same Service.](/guides/kubernetes/etapa05-rolling-update-4.svg "4. Done: every Pod is on the new version, and the Service address did not change. | Diagram: kubernetes.io, The Kubernetes Authors, CC BY 4.0")

### Key concepts

- **ReplicaSet**: keeps N replicas running at all times; if one goes down, another is born. It selects Pods by label selector.
- **Deployment**: manages ReplicaSets and the version history; it is the object you use in practice.
- **template**: the Pod mold embedded in the Deployment (it is the Pod skeleton from Stage 03).
- **Rolling Update**: gradual version swap, with no downtime.
- **Rollback**: return to a previous revision with `rollout undo`.
- **Revision**: each change to the Deployment template generates a revision in the history, and each revision corresponds to a ReplicaSet.

### Worked example: the complete Deployment and its life cycle

Create the `etapa05/` folder and save the manifest below in it as `deployment.yaml`.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-fiap
spec:
  replicas: 3                  # I want 3 copies, always
  selector:
    matchLabels:
      app: nginx-app           # I manage the Pods with this label...
  template:                    # ...and this is the "mold" of each Pod
    metadata:
      labels:
        app: nginx-app         # must match the selector ↑
    spec:
      containers:
        - name: nginx
          image: nginx:1.14.2  # changing this version triggers the rolling update
          ports:
            - containerPort: 80
```

The `template` is literally the Pod skeleton from Stage 03 inside the Deployment. Nothing here is new: the Deployment composes pieces you already know.

```sh
$ kubectl apply -f deployment.yaml
deployment.apps/nginx-fiap created
$ kubectl get pods
nginx-fiap-7d4b9c-aaa   1/1   Running
nginx-fiap-7d4b9c-bbb   1/1   Running
nginx-fiap-7d4b9c-ccc   1/1   Running

# The ReplicaSet that the Deployment created under the hood
# (the RS name is the prefix of the Pod names)
$ kubectl get rs
NAME                DESIRED   CURRENT   READY   AGE
nginx-fiap-7d4b9c   3         3         3       30s

# Kill a pod on purpose:
$ kubectl delete pod nginx-fiap-7d4b9c-aaa
pod "nginx-fiap-7d4b9c-aaa" deleted

# Look again: a NEW pod is already being born to keep the 3 replicas
$ kubectl get pods
nginx-fiap-7d4b9c-bbb   1/1   Running
nginx-fiap-7d4b9c-ccc   1/1   Running
nginx-fiap-7d4b9c-ddd   0/1   ContainerCreating   ← self-healing
```

In the outputs of this stage, the RESTARTS and AGE columns were omitted to fit on screen, and the name suffixes change on every run (the hashes in the example are illustrative).

```sh
# Rolling update: swaps the image
$ kubectl set image deployment/nginx-fiap nginx=nginx:1.16.1
deployment.apps/nginx-fiap image updated
$ kubectl rollout status deployment/nginx-fiap
deployment "nginx-fiap" successfully rolled out

# A new ReplicaSet took over; the old one is left with 0 replicas (but still
# exists, and it is what makes rollback possible)
$ kubectl get rs
NAME                DESIRED   CURRENT   READY   AGE
nginx-fiap-6b5d8f   3         3         3       20s
nginx-fiap-7d4b9c   0         0         0       2m

# Break it on purpose (an image that does not exist):
$ kubectl set image deployment/nginx-fiap nginx=nginx:nao-existe
$ kubectl get pods
nginx-fiap-6b5d8f-bbb   1/1   Running            ← old ones hold the service
nginx-fiap-9f8e2a-xyz   0/1   ImagePullBackOff   ← new ones stuck

# A third ReplicaSet appeared, with 1 Pod that never gets ready
$ kubectl get rs
NAME                DESIRED   CURRENT   READY   AGE
nginx-fiap-6b5d8f   3         3         3       1m
nginx-fiap-7d4b9c   0         0         0       3m
nginx-fiap-9f8e2a   1         1         0       15s

# Rollback: returns to the revision before the broken one (nginx:1.16.1)
$ kubectl rollout undo deployment/nginx-fiap
deployment.apps/nginx-fiap rolled back

# Recorded revisions (approximate format)
$ kubectl rollout history deployment/nginx-fiap
REVISION  CHANGE-CAUSE
1         <none>
3         <none>
4         <none>
```

K8s only shuts down the old Pods when the new ones are ready. Since the broken image never becomes ready, the old ones keep serving and the service stays up. A broken deploy does not take down what was already working.

Also note that `undo` goes back to the immediately previous revision, which here used `nginx:1.16.1`, and not to the original `nginx:1.14.2`. The restored revision gets a new number in the history (2 reappears as 4) and reuses its ReplicaSet (`6b5d8f`), while the ReplicaSet of the broken version (`9f8e2a`) goes back to 0 replicas.

### Essential commands

- `kubectl get rs`: lists the ReplicaSets (one per template version).
- `kubectl scale deployment <name> --replicas=5`: manual scaling.
- `kubectl set image deployment/<name> ctn=img:tag`: triggers a rolling update.
- `kubectl rollout status deployment/<name>`: follows the swap.
- `kubectl rollout history deployment/<name>`: lists the revisions.
- `kubectl rollout undo deployment/<name>`: performs the rollback.

### Hands-on

This is the central exercise of the guide. Take it calmly and observe each state.

1. Apply `deployment.yaml` and confirm the 3 pods `Running`. Also run `kubectl get rs` and **observe** the `nginx-fiap-<hash>` ReplicaSet with 3 replicas: the prefix of the Pod names is its name.
2. Delete a pod by hand (copy a real name from `kubectl get pods`) and run `kubectl get pods` again, quickly. **Observe** the replacement in `ContainerCreating`. You tried to violate the desired state and the cluster corrected it.
3. Run the rolling update to `nginx:1.16.1` and follow it with `kubectl rollout status`. **Observe** the success message. Run `kubectl get rs` and **observe** that there are now two ReplicaSets: the new one with 3 replicas and the old one with 0. This is why the suffix of the Pod names changed.
4. Break it on purpose with the image `nginx:nao-existe`. **Observe** in `kubectl get pods` the old pods `Running` holding the service and the new ones in `ImagePullBackOff`, and in `kubectl get rs` a third ReplicaSet with `READY 0`.
5. Run `kubectl rollout undo deployment/nginx-fiap` and confirm with `kubectl rollout history deployment/nginx-fiap`. **Observe** that the list goes 1, 3, 4: revision 2 became 4. Confirm the current image with `kubectl describe deployment nginx-fiap | grep Image`, which should show `nginx:1.16.1`. You did a rollback in one command.
6. Clean up: `kubectl delete -f deployment.yaml` (output: `deployment.apps "nginx-fiap" deleted`). The Deployment's ReplicaSets and Pods are removed along with it.

### Tip

Do the self-healing test at least once: apply the deployment, delete a pod by hand and watch the replacement be born. That is the moment when the "desired state" model stops being theory.

### Takeaway

> Nobody creates a standalone Pod in production: the Deployment guarantees N replicas (self-healing), swaps versions without downtime and goes back in one command, using one ReplicaSet per version.

---

## Stage 06: Volumes, data that outlives the Pod

### The problem

Pods are ephemeral, and Stage 05 showed how frequent that is: pods are recreated at every rolling update. For a stateless API this is great. For a database it is a disaster. Imagine the e-commerce PostgreSQL Pod being recreated during an update, and all the Black Friday orders disappearing with it, because they were written to the container's filesystem. Real data cannot live inside the container.

### The concept

Kubernetes solves this with a chain of four concepts: **Volume**, **PersistentVolume (PV)**, **PersistentVolumeClaim (PVC)** and **StorageClass (SC)**.

- The **PVC** is the storage *request*: "I want 1Gi, read and write by one node".
- The **PV** is the *real disk* that fulfills the request (NFS, AWS EBS, hostPath and others).
- The **StorageClass** describes *types* of disk (standard, fast SSD) and lets the cluster create PVs automatically when a PVC asks for them.

The Pod references only the PVC and does not need to know where the disk physically is. This separation lets the same Pod YAML run on Minikube and on AWS, changing only what fulfills the request. On Minikube, the `standard` StorageClass already provisions PVs automatically: you create the PVC and the PV appears.

The most common **volume types**:

- **emptyDir**: born empty together with the Pod and **dies with the Pod**. It serves for temporary files and for sharing data between containers of the same Pod.
- **hostPath**: mounts a directory of the node inside the container. It is useful in development and dangerous in production, because it ties the Pod to that node.
- **persistentVolumeClaim**: the right way for real data, which survives restarts and recreation of the Pod.

The PVC **access modes** define who can mount the volume:

- **ReadWriteOnce (RWO)**: read and write by a single node. It is the typical case for a database.
- **ReadOnlyMany (ROX)**: read-only, by several nodes. It serves static assets.
- **ReadWriteMany (RWX)**: read and write by several nodes. It requires NFS or an equivalent backend.

![pod-persistente mounts /dados from the PVC meu-pvc, which requests 1Gi in ReadWriteOnce and is Bound; the PVC is served by a PV created automatically by the standard StorageClass, and the data survives the Pod being recreated. Below, pod-efemero uses emptyDir, which starts empty and dies with the Pod.](/guides/kubernetes/etapa06-pvc.en.svg "The Pod only knows the PVC, the request. What serves it is the PV, created by Minikube's `standard` StorageClass. With `emptyDir`, the data lives only as long as the Pod exists. | Diagram: made for this guide")

### Key concepts

- **emptyDir**: temporary volume that lives and dies with the Pod.
- **hostPath**: node directory mounted in the container; ties the Pod to the node.
- **PVC (PersistentVolumeClaim)**: storage request made by the user.
- **PV (PersistentVolume)**: the disk that fulfills the request.
- **StorageClass**: storage profile that provisions PVs automatically.
- **Bound**: status indicating that the PVC was bound to a PV.
- **volumeMounts / volumes**: in the Pod, `volumes` declares the source and `volumeMounts` defines where it appears inside the container.

### Worked example: write, destroy, read back

Create the `etapa06/` folder and save this stage's manifests in it.

```yaml
# pvc.yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: meu-pvc
spec:
  accessModes:
    - ReadWriteOnce            # one node reads and writes (typical for a database)
  resources:
    requests:
      storage: 1Gi             # how much disk I want
# on Minikube, the "standard" StorageClass provisions the PV by itself
```

```yaml
# pod-com-pvc.yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-persistente
spec:
  containers:
    - name: app
      image: nginx:1.14.2
      volumeMounts:
        - name: dados
          mountPath: /dados    # where the volume appears in the container
  volumes:
    - name: dados
      persistentVolumeClaim:   # ← points to the PVC (instead of emptyDir)
        claimName: meu-pvc
```

```sh
$ kubectl apply -f pvc.yaml -f pod-com-pvc.yaml
persistentvolumeclaim/meu-pvc created
pod/pod-persistente created

# Bound = the PV was created and bound to the request
$ kubectl get pvc
NAME      STATUS   VOLUME         CAPACITY   ACCESS MODES
meu-pvc   Bound    pvc-3f2a1...   1Gi        RWO

# Write a file to the volume
$ kubectl exec pod-persistente -- sh -c "echo 'sobrevivi!' > /dados/teste.txt"

# DESTROY the pod (the PVC still exists)
$ kubectl delete pod pod-persistente
pod "pod-persistente" deleted

# Recreate the pod and read the file:
$ kubectl apply -f pod-com-pvc.yaml
pod/pod-persistente created
$ kubectl exec pod-persistente -- cat /dados/teste.txt
sobrevivi!            ← the Pod died, the data did not
```

To see the contrast, create a second manifest, `pod-emptydir.yaml`, with **another Pod name** and an `emptyDir` in place of the PVC. Do not edit `pod-com-pvc.yaml` and reapply it: the `spec` of an existing Pod cannot be changed (Kubernetes refuses the change of volumes), so the change only works if the Pod is deleted and created again, or if it is a new file and a new name, as here.

```yaml
# pod-emptydir.yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-efemero              # different name from pod-persistente
spec:
  containers:
    - name: app
      image: nginx:1.14.2
      volumeMounts:
        - name: dados
          mountPath: /dados      # same mount point as the previous example
  volumes:
    - name: dados
      emptyDir: {}               # born empty with the Pod and dies with the Pod
```

```sh
$ kubectl apply -f pod-emptydir.yaml
pod/pod-efemero created

# Write the file, destroy the Pod and recreate it from the same YAML
$ kubectl exec pod-efemero -- sh -c "echo 'vou sumir' > /dados/teste.txt"
$ kubectl delete pod pod-efemero
pod "pod-efemero" deleted
$ kubectl apply -f pod-emptydir.yaml
pod/pod-efemero created

# The file no longer exists: the emptyDir died together with the old Pod
$ kubectl exec pod-efemero -- cat /dados/teste.txt
cat: /dados/teste.txt: No such file or directory
command terminated with exit code 1
```

### Essential commands

- `kubectl get pvc`: lists the volume requests (`Bound` indicates success).
- `kubectl get pv`: lists the cluster's persistent disks.
- `kubectl delete pvc <name>`: removes the request. With Minikube's `standard` StorageClass, the corresponding PV is usually deleted along with it, data included (the default reclaim policy is `Delete`; check your cluster's with `kubectl get storageclass`).

### Hands-on

1. Apply the PVC and run `kubectl get pvc`. **Observe** the `STATUS Bound`: the request was fulfilled by an automatically created PV. Confirm with `kubectl get pv`.
2. Run the complete sequence from the example: write the file, delete the pod, recreate the pod, read the file. **Observe** the `sobrevivi!` come back. This is the PVC contract.
3. Contrast experiment: save `pod-emptydir.yaml` and repeat the sequence (write, delete, recreate, read). **Observe** the `No such file or directory` at the end: the file vanished. This is the difference between ephemeral and persistent, seen in practice.
4. Clean up, in this order: `kubectl delete pod pod-persistente pod-efemero` and then `kubectl delete pvc meu-pvc`. With the PVC deleted, `kubectl get pv` should be empty (the PV was removed along with it, as described above).

### Tip

Important data always sits behind a PVC. If data vanished after a restart or a recreation, it was almost certainly in `emptyDir` or in the container's own filesystem.

### Takeaway

> The PVC is the request, the PV is the disk, the StorageClass describes the disk types, and data that matters always lives behind a PVC.

---

## Stage 07: Probes, how the cluster knows your app is alive

### The problem

At 3 a.m., your app enters a deadlock. The process is still up, so as far as Kubernetes is concerned everything is `Running`, but no request is answered. The recovery mechanisms you have seen so far act when a process ends or when a Pod disappears; none of them sees a process that is alive but stuck. There is also a similar case: the app has just started, but it is still loading data and should not receive traffic, and the Service is already sending requests to it. Without extra information, the cluster cannot tell "running" from "working".

### The concept

Before probes, it is worth separating three situations that in everyday talk everyone calls "the app went down", because each one is handled by a different mechanism:

1. **The process inside the container ends** (a crash, out of memory, an unhandled exception). The Pod still exists and the one that reacts is the node's **kubelet**: it restarts the **container inside the same Pod**, according to the Pod's `restartPolicy` (the default is `Always`). The Pod's name and IP do not change, and the `RESTARTS` column goes up. This happens with no probe configured.
2. **The Pod disappears** (someone deleted it, the node went down). The whole Pod ceases to exist and the one that reacts is the **ReplicaSet** (Stage 05), which creates a **new Pod**, with a new name and IP. A standalone Pod, without a ReplicaSet or Deployment, does not come back.
3. **The process is still alive but stuck** (deadlock, infinite loop, exhausted dependency). Nothing ended and no Pod disappeared, so the two previous mechanisms do not notice. Only a **liveness probe** detects it, and when it fails the kubelet restarts the container, as in case 1.

**Probes** are health checks declared in the Pod manifest. The kubelet runs them periodically and acts according to the result.

There are three probes, and the most important point is what happens when each one **fails**:

- **Liveness** asks "is it alive?". If it fails, the kubelet **restarts the container** (inside the same Pod). It is for apps that hang and only come back with a restart.
- **Readiness** asks "is it ready to receive requests?". If it fails, the Pod **leaves the load balancer** (the Service stops sending traffic) **without being restarted**. It is for apps that load data before serving or that are temporarily unavailable.
- **Startup** asks "has it finished initializing?". While it runs, it **holds back the other probes**, preventing liveness from killing a slow app too early.

Each probe can check in three ways:

- **httpGet**: the kubelet makes a GET to an endpoint (for example `/health`) and expects a success status (200 OK). It is the most common. An error status, such as 404 or 500, counts as a failure.
- **tcpSocket**: tests whether the port accepts a connection. It serves services that do not speak HTTP.
- **exec**: runs a command inside the container; exit code 0 means healthy.

Good practices from the lesson: use all three probes together in production; use different endpoints for each probe; start with the default settings and adjust intervals only when the app asks for it; monitor probe failures (for example, with Prometheus), because they are the first sign of trouble.

![Three probes of the exemplo-probes Pod, run by the kubelet: livenessProbe on /health, which on failure makes the kubelet restart the container in the same Pod; readinessProbe on /ready, which on failure takes the Pod out of the Service without a restart; and startupProbe on /startup, which holds the other two until it passes.](/guides/kubernetes/etapa07-probes.en.svg "What matters is the consequence of each failure: liveness restarts, readiness takes the Pod out of traffic, startup delays the others. With no probe, the kubelet only restarts the container when the process exits. | Diagram: made for this guide")

### Key concepts

- **restartPolicy**: Pod policy for containers that end (default `Always`); it is what restarts a container that went down, with or without probes.
- **Liveness probe**: failed, the kubelet restarts the container.
- **Readiness probe**: failed, the Pod leaves the load balancer without restarting.
- **Startup probe**: until it passes, the others stay suspended.
- **httpGet / tcpSocket / exec**: the three checking mechanisms.
- **periodSeconds**: how many seconds apart the probe runs.
- **failureThreshold**: how many consecutive failures are tolerated before acting (the default is 3).
- **initialDelaySeconds**: how long to wait before the first check.

### Worked example: a Pod with the three probes

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: exemplo-probes
spec:
  containers:
    - name: app
      image: exemplo:latest
      ports:
        - containerPort: 80
      livenessProbe:           # failed → RESTARTS the container
        httpGet:
          path: /health
          port: 80
        periodSeconds: 10      # checks every 10s
        timeoutSeconds: 5
        failureThreshold: 3    # 3 consecutive failures → restarts (3 is the default)
      readinessProbe:          # failed → LEAVES the load balancer
        httpGet:
          path: /ready         # good practice: separate endpoint
          port: 80
        periodSeconds: 5
      startupProbe:            # holds the others until the app is up
        httpGet:
          path: /startup
          port: 80
        initialDelaySeconds: 120   # slow app: waits 2min
        periodSeconds: 30
```

This YAML is illustrative: the `exemplo:latest` image is fictitious. The runnable experiment comes next, and in Stage 09 you will see the probes working on a real image.

A caveat about the `startupProbe` in the example: `initialDelaySeconds: 120` is valid, but the most common way to give a slow app time is to multiply `failureThreshold` by `periodSeconds` (for example, 30 attempts every 10 seconds give up to 300 seconds). That way the startupProbe finishes as soon as the app responds, instead of always waiting a fixed delay.

### Worked example: a didactic sabotage (runnable)

Save the manifest in `etapa07/liveness-exec.yaml`. The idea is to use a busybox container that creates the file `/tmp/healthy`, lives 30 seconds "healthy", deletes the file and keeps running. The liveness probe runs `cat /tmp/healthy`: with the file present, the command exits with 0 (healthy); without the file, it fails. This is case 3 from the list above: the process is still alive (the `sleep 600`), but it stops being healthy.

```yaml
# liveness-exec.yaml
apiVersion: v1
kind: Pod
metadata:
  name: liveness-exec
spec:
  containers:
    - name: liveness
      image: busybox
      args:                         # the sabotage script:
        - /bin/sh
        - -c
        - touch /tmp/healthy; sleep 30; rm -f /tmp/healthy; sleep 600
      livenessProbe:
        exec:
          command:                  # probe: does the file exist? (exit 0 = healthy)
            - cat
            - /tmp/healthy
        initialDelaySeconds: 5     # waits 5s before the 1st check
        periodSeconds: 5           # checks every 5s
```

```sh
$ kubectl apply -f liveness-exec.yaml
pod/liveness-exec created

# Watch in real time (Ctrl+C to leave).
# Shortened output: each new line appears tens of seconds apart.
# The "(Ns ago)" part shows how long ago the last restart was,
# and not the interval between one restart and the next. The first
# restart shows up about 45s after the start; the following ones take
# longer, because the kubelet waits for the container to terminate before recreating it.
$ kubectl get pods -w
NAME            READY   STATUS    RESTARTS
liveness-exec   1/1     Running   0                ← right after the start
liveness-exec   1/1     Running   1 (2s ago)       ← about 45s later: automatic restart
liveness-exec   1/1     Running   2 (1s ago)       ← one cycle later, much later: and again...

# Investigate like a professional:
$ kubectl describe pod liveness-exec
Events:
  Warning  Unhealthy  Liveness probe failed: cat: /tmp/healthy: No such file
  Normal   Killing    Container liveness failed liveness probe, will be restarted
```

The timeline of the experiment: 30s healthy, the file is deleted, 3 consecutive failures (the default `failureThreshold`), the kubelet restarts the container. Since the script starts over from zero after the restart, the cycle repeats indefinitely, on purpose, so you can observe it. Note that the Pod is always the same (`liveness-exec`): what was restarted was the container.

Now, to see the difference from case 1, provoke a crash without any probe:

```sh
# A container that ends with an error 5 seconds after starting, without probes
$ kubectl run crash --image=busybox -- /bin/sh -c "sleep 5; exit 1"
pod/crash created

# The kubelet restarts the container by itself (restartPolicy Always), with
# ever longer intervals between attempts (approximate format)
$ kubectl get pods
NAME    READY   STATUS             RESTARTS      AGE
crash   0/1     CrashLoopBackOff   2 (20s ago)   50s

$ kubectl describe pod crash
(...)
    Last State:     Terminated
      Reason:       Error
      Exit Code:    1
(...)
# No "Liveness probe failed" event: there is no probe at all, and the
# container was restarted by the kubelet anyway.
```

### Essential commands

- `kubectl get pods -w`: follows changes in real time.
- `kubectl describe pod <name>`: the Events show probe failures; `Last State` shows why the previous container ended.

### Hands-on

1. Apply `liveness-exec.yaml` and run `kubectl get pods -w`. **Observe** the `RESTARTS` column go up by itself: the first restart appears about 45 seconds after the start (30s healthy plus 3 failures spaced 5s apart). Each increment is the kubelet restarting a container that stopped passing the check.
2. In another terminal, run `kubectl describe pod liveness-exec`. **Observe** in the Events the pair `Warning Unhealthy` followed by `Normal Killing`. Learn to recognize this pair: in production, it is the diagnosis of a failing probe.
3. Run the crash experiment (`kubectl run crash ...`) and compare. **Observe** that `RESTARTS` also goes up, but `describe` shows `Last State: Terminated` with `Exit Code: 1` and no `Liveness probe failed` event. This is case 1, handled by the kubelet without a probe; the one in step 2 is case 3, which only liveness solves.
4. Clean up: `kubectl delete pod liveness-exec crash`.

### Tip

`Running` does not mean healthy. An app can be running and stuck in a deadlock. This is exactly why probes exist.

### Takeaway

> A process that crashes is restarted by the kubelet, a Pod that disappears is recreated by the ReplicaSet, and a process that is alive but stuck is detected only by liveness: a failed liveness probe restarts the container, a failed readiness probe takes the Pod out of the load balancer without restarting, and a startup probe holds back both until the app finishes starting.

---

## Stage 08: HPA, automatic scaling based on metrics

### The problem

Go back to the e-commerce site from Stage 01: Black Friday has arrived. You already know how to scale manually with `kubectl scale --replicas=...` (Stage 05). Staying on call at the terminal adjusting replicas at every traffic peak, including at 2 a.m., is not viable. The cluster should measure the load and adjust the number of replicas by itself.

### The concept

The **Horizontal Pod Autoscaler (HPA)** monitors Pod metrics (CPU, memory and others) and adjusts the number of replicas between a minimum and a maximum that you define.

How it works: the HPA compares the current utilization of the Pods with the configured **target** (for example, keeping average CPU at 70%). If utilization goes above the target, it creates replicas, up to the maximum. If it drops, it removes replicas, down to the minimum, saving resources. The **scale down is deliberately slow** (about 5 minutes of stability) to avoid constant oscillation in the face of quick load variations.

Once an HPA controls a Deployment, it is the HPA that decides the number of replicas within the range `minReplicas` to `maxReplicas`. The `replicas` value written in the Deployment manifest holds only until the HPA acts: if it is above the floor and there is no load, the HPA reduces it after a few minutes (you will see this in Stage 09).

**Which metrics the HPA can use.** CPU and memory are read natively, through the metrics-server. The others require additional components installed in the cluster: custom metrics from your app (requests per second, queue size), external metrics (for example, coming from Prometheus) and disk I/O need a custom or external metrics adapter. Without that adapter, only CPU and memory are available. The right metric depends on the app's profile: a CPU-heavy app scales by CPU; one that consumes a lot of RAM scales by memory.

Two prerequisites are often forgotten:

1. The cluster needs the **metrics-server** to read CPU and memory. On Minikube: `minikube addons enable metrics-server`.
2. The container **must declare `resources.requests.cpu`**, because "70% CPU" means 70% **of what the Pod requested**. Without requests, the HPA shows `<unknown>` and does not scale.

![The Horizontal Pod Autoscaler adjusts the scale of a Deployment, which in turn manages Pods 1 to N.](/guides/kubernetes/etapa08-hpa.svg "The HPA does not create Pods: it changes the Deployment's replica count, and the Deployment creates or removes the Pods. (RC, in the diagram, is the old ReplicationController; in this guide the target is always a Deployment.) | Diagram: kubernetes.io, The Kubernetes Authors, CC BY 4.0")

### Key concepts

- **HPA**: controller that adjusts the number of replicas of a Deployment according to metrics.
- **metrics-server**: component that collects CPU and memory from the Pods; prerequisite of the HPA.
- **resources.requests**: amount of resource the container declares it needs; basis of the percentage calculation.
- **resources.limits**: ceiling of resource the container may consume.
- **millicore (m)**: CPU unit; `100m` equals 0.1 CPU.
- **minReplicas / maxReplicas**: floor and ceiling of replicas; the HPA works within that range.
- **averageUtilization**: average usage percentage, relative to `requests`, that the HPA tries to maintain.
- **Metrics adapter**: extra component needed for metrics other than CPU or memory.

### Worked example: Deployment, HPA, Service and load test

Create the `etapa08/` folder and save the three manifests in it (the names `deployment.yaml` and `service.yaml` also appear in Stage 09, hence the separation by folder).

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-hpa
spec:
  replicas: 1                  # starts with 1; the HPA takes over from here
  selector:
    matchLabels:
      app: nginx-hpa
  template:
    metadata:
      labels:
        app: nginx-hpa
    spec:
      containers:
        - name: nginx
          image: nginx:1.14.2
          resources:           # WITHOUT requests the HPA does not calculate %
            requests:
              cpu: "100m"      # 100 millicores = 0.1 CPU
            limits:
              cpu: "200m"
```

```yaml
# hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: nginx-hpa
spec:
  scaleTargetRef:              # WHAT the HPA controls
    apiVersion: apps/v1
    kind: Deployment
    name: nginx-hpa
  minReplicas: 1               # floor
  maxReplicas: 10              # ceiling
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70   # target: average CPU at 70%
```

So that the load generator can find the app by name, also create a ClusterIP Service called `nginx-hpa`, following the same pattern as Stage 04:

```yaml
# service.yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-hpa              # internal hostname used by the generator
spec:
  type: ClusterIP              # internal traffic only (golden rule of Stage 04)
  selector:
    app: nginx-hpa             # matches the label of the Deployment's pods
  ports:
    - port: 80
      targetPort: 80
```

```sh
# Prerequisite: metrics-server
$ minikube addons enable metrics-server
💡  metrics-server is an addon maintained by Kubernetes. (...)
🌟  The 'metrics-server' addon is enabled

$ kubectl apply -f deployment.yaml -f hpa.yaml -f service.yaml
deployment.apps/nginx-hpa created
horizontalpodautoscaler.autoscaling/nginx-hpa created
service/nginx-hpa created

# Generate load from inside the cluster:
$ kubectl run gerador --image=busybox -it --rm -- /bin/sh -c \
  "while true; do wget -q -O- http://nginx-hpa; done"

# In ANOTHER terminal, watch:
$ kubectl get hpa -w
NAME        TARGETS         MINPODS  MAXPODS  REPLICAS
nginx-hpa   cpu: 0%/70%     1        10       1
nginx-hpa   cpu: 152%/70%   1        10       1
nginx-hpa   cpu: 152%/70%   1        10       3    ← scaled by itself

# Raw metric that feeds the HPA (approximate format):
$ kubectl top pods
NAME                        CPU(cores)   MEMORY(bytes)
nginx-hpa-5d8f7b6c4-abcde   152m         3Mi

# Stop the load (Ctrl+C) and wait ~5min: the replicas shrink back.
```

In production, tools such as K6 and JMeter run this load test in a controlled way.

**Plan B, if TARGETS does not go above 70%.** Nginx serving a static page is too efficient and a single generator may not produce enough load. There are three ways out, from the simplest to the most faithful to the official Kubernetes tutorial:

1. Run 2 or 3 generators in parallel: repeat the `kubectl run` in other terminals, changing the name (`gerador2`, `gerador3`).
2. Reduce `requests.cpu` to `"50m"` in the Deployment and reapply. The same consumption now counts double in percentage.
3. Swap the image for `registry.k8s.io/hpa-example` (the php-apache from the official tutorial, which consumes CPU on every request and was made for this demonstration).

### Essential commands

- `minikube addons enable metrics-server`: prerequisite of the HPA.
- `kubectl get hpa -w`: follows the HPA reacting to the load.
- `kubectl top pods`: CPU and memory per pod.
- `kubectl autoscale deployment <n> --cpu-percent=70 --min=1 --max=10`: creates an HPA imperatively.

### Hands-on

The final experiment of this part, which joins Deployment, Service and HPA.

1. Enable the metrics-server and apply the three YAMLs (Deployment, HPA, Service). Run `kubectl get hpa` and **observe** the targets. If `<unknown>` appears, wait about 1 minute: the metrics-server needs to collect the first reading.
2. Start the load generator in one terminal and run `kubectl get hpa -w` in another. **Observe** the CPU percentage go above 70% and then the `REPLICAS` column go up. If the percentage stalls below the target, use plan B. Confirm with `kubectl get pods`: new pods were born without any command from you.
3. Stop the load (Ctrl+C) and keep watching. **Observe** that the replicas take about 5 minutes to shrink. This slowness is deliberate.
4. Run `kubectl top pods` during the test to see the raw metric that feeds the HPA.
5. Clean up: `kubectl delete -f deployment.yaml -f hpa.yaml -f service.yaml`. The `gerador` pod was created with `--rm` and deleted itself when you interrupted the load; confirm with `kubectl get pods`. Keep the metrics-server enabled, because Stage 09 also uses the HPA.

### Tip

If `kubectl get hpa` shows `<unknown>` in the targets, there are two possible causes: the metrics-server is not active or the container did not declare `resources.requests`.

### Takeaway

> The HPA is the desired state applied to scaling: you define a target, a floor and a ceiling, but without the metrics-server and without resources.requests it sees nothing, and only CPU and memory come ready (the rest requires an adapter).

---

## Stage 09: Bonus, a professional application with a real Docker Hub image

### The problem

The eight previous stages used nginx on purpose: a simple image, with no noise, so you could learn the mechanics of each piece. But a real deployment is not made of isolated pieces. Three questions only appear when you put everything together: how the pieces fit together in a real app, how to test probes in an application with real health endpoints (instead of the illustrative YAML from Stage 07) and which pieces to use, or leave out, for that specific app.

### The concept

This stage builds a complete deployment with the `stefanprodan/podinfo` image from Docker Hub (`docker.io/stefanprodan/podinfo`). Podinfo is an open source project designed to be used in demonstrations. It exposes real `/healthz` and `/readyz`, accepts configuration through environment variables (`PODINFO_UI_MESSAGE`, `PODINFO_UI_COLOR`) and has a `/panic` endpoint that **ends the process** on purpose.

That last point deserves care, because `/panic` and liveness test different things. When the podinfo process ends, the one that restarts the container is the **kubelet, through the Pod's `restartPolicy`** (case 1 of Stage 07). This would happen even if the manifest had no `livenessProbe` at all. Liveness only comes into play in case 3, a process that is alive but does not respond in a healthy way. That is why this exercise uses `/panic` to demonstrate the restart of a container that went down, and tests liveness for real by pointing the probe at a path that does not exist, so that the endpoint starts returning 404 and the probe fails.

The four manifests fit together through the label `app: podinfo`, the same mechanism that stitched the whole guide together (Stage 03):

- The **ConfigMap** injects the variables via `envFrom` (Stage 04).
- The **Deployment** declares 3 replicas (Stage 05), `resources.requests` (required for the HPA, Stage 08) and two probes: liveness on `/healthz` and readiness on `/readyz` (Stage 07).
- The **Service** is NodePort because here podinfo is the system's entry point, applying the golden rule of Stage 04.
- The **HPA** reads the CPU declared in the Deployment and scales between 2 and 8 replicas (Stage 08).

There is an interaction between the Deployment and the HPA that is worth knowing: the Deployment declares `replicas: 3`, but the HPA has `minReplicas: 2`. While there is some load, or in the first minutes, you will see 3 replicas. Without load, after about 5 minutes (the stability window from Stage 08), the HPA reduces the Deployment to 2. From then on, the one in charge of the number of replicas is the HPA, and the manifest's `replicas: 3` stops applying. In production, it is common to omit `replicas` from the Deployment when an HPA exists, precisely to avoid this dispute.

What was **not** included also matters. Not every piece you learned fits every app.

- The **startupProbe** (Stage 07) was left out because podinfo starts in fractions of a second. Using a piece just because it exists in the manual adds configuration with no benefit.
- The **PVC** (Stage 06) was also left out of the Deployment, for a technical reason. The problem: the PVC from Stage 06 uses `ReadWriteOnce`, and that mode cannot be shared among replicas on different nodes. On Minikube (a single node), attaching `volumes.persistentVolumeClaim` to a Deployment with several replicas may even start without complaint, but on a cluster with several nodes the extra replicas get stuck, competing for the same disk (the event shows up as `FailedAttachVolume`). The ways out, if the app needed state: a truly shared cache (podinfo has the `--cache-server` flag to talk to a Redis) or one disk per replica, with a StatefulSet and `volumeClaimTemplates`, a subject for the advanced module. Stage 06 remains valid: it is the right answer for its scenario, a single Pod with data, like a database.

![The ConfigMap podinfo-config feeds the podinfo Deployment through envFrom; the Deployment, with the stefanprodan/podinfo:6.14.1 image, 3 replicas, CPU requests and probes on /healthz and /readyz, creates 3 Pods on port 9898; the podinfo HPA adjusts the replicas between 2 and 8 with a 70% CPU target; the podinfo Service, NodePort 30898, finds the Pods through the selector and receives the browser.](/guides/kubernetes/etapa09-podinfo.en.svg "The stage's four manifests and how they connect: everything finds each other through the `app: podinfo` label, and the HPA takes over the Deployment's replica count. | Diagram: made for this guide")

### Key concepts

- **ConfigMap with envFrom**: external configuration injected as variables (Stage 04).
- **Deployment with 3 replicas**: self-healing and readiness for a rolling update (Stage 05).
- **Real probes**: liveness on `/healthz`, readiness on `/readyz` (Stage 07).
- **restartPolicy**: what restarts a container whose process ended (`/panic`), unrelated to liveness.
- **NodePort Service**: the app is the entry point, so it is exposed (Stage 04).
- **HPA between 2 and 8 replicas**: scales by the CPU declared in `requests` and, without load, reduces the 3 initial replicas to 2 (Stage 08).
- **Fixed version tag**: using `podinfo:6.14.1` instead of `latest`, so that the deploy is reproducible.
- **rollout restart**: command that recreates the Pods of a Deployment, needed for them to read a changed ConfigMap.
- **Endpoints**: list of Pods that are actually receiving traffic from a Service; Pods with a failing readiness leave it.

### Worked example: the four manifests and the complete test

Create the `etapa09/` folder and save the four manifests in it.

```yaml
# configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: podinfo-config
data:
  PODINFO_UI_MESSAGE: "olá do pitstop.dev!"   # appears on the app screen
  PODINFO_UI_COLOR: "#34d399"                 # banner color in the UI
```

It is the same mechanism as Stage 04 (`envFrom`), but here the keys are variables that podinfo really reads to build its own interface.

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: podinfo
spec:
  replicas: 3                        # real self-healing, Stage 05 (the HPA may reduce to 2)
  selector:
    matchLabels:
      app: podinfo
  template:
    metadata:
      labels:
        app: podinfo                 # matches the selector ↑ and the Service
    spec:
      containers:
        - name: podinfo
          image: stefanprodan/podinfo:6.14.1  # real Docker Hub image, fixed version (never "latest" in production)
          ports:
            - containerPort: 9898
          envFrom:                   # injects the whole ConfigMap (Stage 04)
            - configMapRef:
                name: podinfo-config
          resources:                 # required for the HPA to calculate %, Stage 08
            requests:
              cpu: "100m"
              memory: "64Mi"
            limits:
              cpu: "200m"
              memory: "128Mi"
          livenessProbe:             # "is it alive?" failed → restarts the container, Stage 07
            httpGet:
              path: /healthz
              port: 9898
            periodSeconds: 10
            failureThreshold: 3
          readinessProbe:            # "ready for traffic?" failed → leaves the Service
            httpGet:
              path: /readyz
              port: 9898
            periodSeconds: 5
```

This manifest has no `startupProbe` and no `volumes`, on purpose, for the reasons explained above. A professional manifest declares what the app needs, not everything the course taught.

```yaml
# service.yaml
apiVersion: v1
kind: Service
metadata:
  name: podinfo
spec:
  type: NodePort                # entry point here = golden rule of Stage 04
  selector:
    app: podinfo                # finds the Pods by label, always
  ports:
    - port: 9898
      targetPort: 9898
      nodePort: 30898
```

```yaml
# hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: podinfo
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: podinfo
  minReplicas: 2                 # production does not go below 2, even without load
  maxReplicas: 8
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
```

The tests below follow the order of the exercise. They were written to work both with 3 replicas (in the first minutes) and with 2 (after the HPA reduces them); the points where the number matters are indicated.

```sh
# 1) Applies the 4 manifests at once
$ kubectl apply -f configmap.yaml -f deployment.yaml -f service.yaml -f hpa.yaml
configmap/podinfo-config created
deployment.apps/podinfo created
service/podinfo created
horizontalpodautoscaler.autoscaling/podinfo created

# 2) Wait for the replicas to be Running and the HPA to leave <unknown> (shortened output)
$ kubectl get pods,hpa
NAME                           READY   STATUS    RESTARTS   AGE
pod/podinfo-7f9c6d-abc         1/1     Running   0          1m
pod/podinfo-7f9c6d-def         1/1     Running   0          1m
pod/podinfo-7f9c6d-ghi         1/1     Running   0          1m

NAME                                          REFERENCE            TARGETS       MINPODS   MAXPODS   REPLICAS   AGE
horizontalpodautoscaler.autoscaling/podinfo   Deployment/podinfo   cpu: 3%/70%   2         8         3          1m

# 3) Load balancing. In one terminal, keep the tunnel open:
$ minikube service podinfo --url
http://127.0.0.1:53412   ← do not close this terminal (it is the tunnel)

# In ANOTHER terminal, five requests in a row (use the URL your terminal showed).
# Each request opens a new connection, so the Service may pick different replicas:
$ for i in 1 2 3 4 5; do curl -s http://127.0.0.1:53412 | grep hostname; done
  "hostname": "podinfo-7f9c6d-abc",
  "hostname": "podinfo-7f9c6d-ghi",
  "hostname": "podinfo-7f9c6d-abc",
  "hostname": "podinfo-7f9c6d-def",
  "hostname": "podinfo-7f9c6d-ghi",

# 4) Production gotcha: changing the ConfigMap does NOT restart the Pods by itself.
#    Edit configmap.yaml (change the message to "mensagem nova") and reapply:
$ kubectl apply -f configmap.yaml
configmap/podinfo-config configured
$ kubectl exec deploy/podinfo -- env | grep MESSAGE
PODINFO_UI_MESSAGE=olá do pitstop.dev!   ← still the OLD value

$ kubectl rollout restart deployment/podinfo
deployment.apps/podinfo restarted
$ kubectl rollout status deployment/podinfo
deployment "podinfo" successfully rolled out
$ kubectl exec deploy/podinfo -- env | grep MESSAGE
PODINFO_UI_MESSAGE=mensagem nova         ← only now do the Pods read the new value

# 5) Process crash: restart by the kubelet (restartPolicy), NOT by liveness.
#    We save the name of one Pod so we always talk to the same one.
$ POD=$(kubectl get pods -l app=podinfo -o name | head -n 1)
$ kubectl exec $POD -- curl -s localhost:9898/panic
$ kubectl get pods -w
NAME                 READY   STATUS    RESTARTS      AGE
podinfo-7f9c6d-abc   1/1     Running   1 (4s ago)    3m   ← same Pod, container restarted

$ kubectl describe $POD
(...)
    Last State:     Terminated
      Reason:       Error
      Exit Code:    (value other than 0)
(...)
# No "Liveness probe failed" appears in the Events: the process
# ended, and the kubelet solves that without needing a probe.

# 6) Real liveness: point the probe at a path that does not exist (404)
$ kubectl patch deployment podinfo --type=json \
  -p='[{"op":"replace","path":"/spec/template/spec/containers/0/livenessProbe/httpGet/path","value":"/nao-existe"}]'
deployment.apps/podinfo patched

# The new Pods start and pass readiness (/readyz is still valid), but
# about 30 seconds later (3 consecutive failures, every 10s) RESTARTS starts going up.
# During the failure, the STATUS may alternate between Running and CrashLoopBackOff
# (the kubelet waits an increasing interval before each new restart); this is expected:
$ kubectl get pods -w

$ kubectl describe pods -l app=podinfo
Events:
  Warning  Unhealthy  Liveness probe failed: HTTP probe failed with statuscode: 404
  Normal   Killing    Container podinfo failed liveness probe, will be restarted

# Restore the original probe: reapplying the manifest brings back the /healthz path.
# Note: the apply also sets replicas back to 3 (the manifest value);
# if there is no load, the HPA reduces it to 2 again after about 5 minutes.
$ kubectl apply -f deployment.yaml
deployment.apps/podinfo configured

# Wait for the swap to finish BEFORE the next step. Without that, the "head -n 1"
# in step 7 may pick an old Pod that is still terminating.
$ kubectl rollout status deployment/podinfo
deployment "podinfo" successfully rolled out

# 7) Real readiness: turn off /readyz of ONE Pod without killing the process
$ POD=$(kubectl get pods -l app=podinfo -o name | head -n 1)
$ kubectl exec $POD -- curl -s -X POST localhost:9898/readyz/disable

# Wait about 15 seconds (periodSeconds 5 x 3 failures) and compare:
$ kubectl get pods
NAME                 READY   STATUS    RESTARTS   AGE
podinfo-7f9c6d-abc   0/1     Running   0          6m   ← Running, but out of the load balancer
podinfo-7f9c6d-def   1/1     Running   0          6m

$ kubectl get endpoints podinfo
NAME      ENDPOINTS           AGE
podinfo   10.244.0.6:9898     6m   ← 1 IP (with 2 replicas); with 3 replicas it would be 2 IPs

# Optional: puts the Pod back in the load balancer
$ kubectl exec $POD -- curl -s -X POST localhost:9898/readyz/enable
```

Two remarks about the test. `curl` is used instead of `wget` because it is what the official podinfo image has installed. And if `/panic` does not bring the process down the first time, repeat it: the response sometimes arrives fragmented before the process actually dies.

A remark about the browser: if you open the URL from step 3 in the browser and reload, it is common for the hostname **not** to change on every reload. The browser reuses the open HTTP connection, and the Service's balancing happens per connection, not per request. The `curl` loop, which opens a new connection on every turn, is the reliable test. The distribution is also random, not alternating: consecutive repetitions may appear.

### Essential commands

- `kubectl apply -f a.yaml -f b.yaml -f c.yaml -f d.yaml`: applies several manifests at once.
- `kubectl rollout restart deployment/<name>`: forces the Pods to read a ConfigMap that changed.
- `kubectl exec deploy/<name> -- <command>`: runs in a Pod of the Deployment without needing to know the exact name.
- `kubectl patch deployment <name> --type=json -p='[...]'`: changes a field of the Deployment without editing the file.
- `kubectl get endpoints <service>`: shows who is actually receiving traffic right now (affected by readiness).

### Hands-on

In this exercise you build the complete deployment, provoke controlled failures and confirm each behavior. The command blocks for each step are in the example above.

1. Save the four YAMLs in `etapa09/` (`configmap.yaml`, `deployment.yaml`, `service.yaml`, `hpa.yaml`) and apply them with a single `kubectl apply` pointing to the four files.
2. Run `kubectl get pods,hpa` until you see the pods `Running` (3 at the start) and the HPA with a real CPU value (not `<unknown>`). If it gets stuck, confirm that the Stage 08 metrics-server is still active. Remember that, without load, the HPA will reduce the 3 replicas to 2 in about 5 minutes; this is expected, and the following steps work with either number.
3. Run `minikube service podinfo --url`, keep that terminal open and, in another, run the loop `for i in 1 2 3 4 5; do curl -s <URL> | grep hostname; done`. **Observe** more than one hostname in the output. If you prefer the browser, know that it usually reuses the connection and may always show the same hostname.
4. Reproduce the ConfigMap gotcha: edit the message in `configmap.yaml`, apply it with `kubectl apply -f configmap.yaml`, confirm that `kubectl exec ... env` still shows the old value and only then run `kubectl rollout restart deployment/podinfo`. Confirm the change again. (You can also use `kubectl edit configmap podinfo-config`, which opens the system's default editor, usually vi; editing the file and reapplying is simpler and keeps the YAML versioned as the source of truth.)
5. Provoke a crash with `curl .../panic` and follow `kubectl get pods -w` until you see `RESTARTS` go up by itself, without you restarting anything. **Observe** with `kubectl describe` that the previous container is `Terminated` with a nonzero exit code and that there is no liveness event: the one that restarted it was the kubelet, through the `restartPolicy`.
6. Test liveness for real: change the probe path to `/nao-existe` with `kubectl patch`, wait about 30 seconds and **observe** `RESTARTS` go up (the status may alternate with `CrashLoopBackOff` between one restart and the next, which is expected) and, in `describe`, the events `Liveness probe failed: HTTP probe failed with statuscode: 404` and `Killing`. Restore with `kubectl apply -f deployment.yaml` and run `kubectl rollout status deployment/podinfo`, waiting for the `successfully rolled out` message before step 7, so that `head -n 1` does not pick an old Pod that is still terminating. Know that this `apply` sets `replicas` back to 3; the HPA reduces it to 2 again if there is no load.
7. Turn off the readiness of one Pod with `curl -X POST .../readyz/disable` and, after about 15 seconds, confirm with `kubectl get pods` (`READY 0/1`, `RESTARTS` unchanged) and `kubectl get endpoints podinfo` that this Pod left the list, without being restarted. With 2 replicas, 1 IP remains; with 3, 2 remain.
8. Finish by generating load as in Stage 08 (the same busybox generator against `http://podinfo:9898`) and **observe** the HPA scale this Deployment by itself.
9. Clean up: `kubectl delete -f configmap.yaml -f deployment.yaml -f service.yaml -f hpa.yaml`. Close the `minikube service` terminal with Ctrl+C. If you want to shut the lab down, `minikube stop`.

### Tip

The ConfigMap gotcha is a common mistake: editing the ConfigMap restarts nothing by itself (unless something like a Reloader takes care of it). In production, the command after applying a new configuration is almost always `kubectl rollout restart deployment/<name>`.

### Takeaway

> A professional manifest is not the sum of everything you learned: it is the choice of what the app needs (ConfigMap, replicas, real probes, Service, HPA) and the conscious refusal of what it does not need (startupProbe on a fast app, PVC on a Deployment with several replicas); and a process crash is handled by the kubelet, while only a probe that fails proves liveness.

---

## Free practice platforms

Suggested order: start with Killercoda (zero installation), use Kube by Example as a quick reference and leave the Hard Way for when the stages are solid.

- **Killercoda** (100% free): killercoda.com/kubernetes. Interactive Kubernetes scenarios right in the browser, with a terminal on a real cluster and a guided script. Successor to Katacoda. Good for practicing each stage of this guide without installing anything.
- **Play with Kubernetes** (100% free): labs.play-with-k8s.com. A real, temporary Kubernetes cluster (4-hour sessions) in the browser, maintained by Docker. You build the cluster by hand with kubeadm. Good for testing kubectl commands freely and understanding how a cluster is put together.
- **Kube by Example** (100% free): kubebyexample.com. Short tutorials and examples maintained by Red Hat, one concept per page. Good for quickly reviewing a specific concept.
- **Introduction to Kubernetes, LFS158** (100% free): training.linuxfoundation.org. Official free course from the Linux Foundation, also available on edX, with a certificate of participation. Good for consolidating the theory with the official material.
- **Kubernetes the Hard Way** (100% free): github.com/kelseyhightower. Kelsey Hightower's script for building a cluster piece by piece, without installers. Good for an advanced level, to understand what Minikube hides.
- **KodeKloud** (free tier + paid): kodekloud.com. Guided labs in a challenge style. Some labs are free; the full catalog and the CKA/CKAD mock exams are paid. Good for realistic troubleshooting.
- **iximiuz Labs** (free tier + paid): labs.iximiuz.com. Container and Kubernetes playgrounds in the browser, with hands-on challenges. Good for deeper experiments (networking, images, internals).

---

## Self-assessment checklist

The checklist summarizes what was studied in each stage. Check each item only if you **did** it, not if you "understood it by reading". If any stays blank, go back to the corresponding stage and redo the "Hands-on".

**Stage 01: Motivation and setup**
- [ ] I can explain the difference between a container and a VM and why the container is lighter.
- [ ] I started Minikube and saw the `Ready` node in `kubectl get nodes`.
- [ ] I know what "desired state" means and can give an example.

**Stage 02: kubectl and the API**
- [ ] I created an imperative pod with `kubectl run` and saw it reach `Running`.
- [ ] I provoked an `ImagePullBackOff` on purpose and found the cause in the Events of `describe`.
- [ ] I can recite the debugging flow: get, describe, logs.
- [ ] I can explain the path of a command: kubeconfig, API Server, response.

**Stage 03: Cluster, Pods and labels**
- [ ] I can state the role of master, worker, etcd, kubelet, kube-proxy and API Server.
- [ ] I wrote a Pod YAML from scratch following apiVersion + kind + metadata + spec.
- [ ] I filtered pods with `-l` and can explain when to use a label and when to use an annotation.

**Stage 04: Services and ConfigMap**
- [ ] I exposed a pod via NodePort and opened the page in the browser with `minikube service --url`.
- [ ] I deleted the pod, saw the Service left without endpoints (`kubectl get endpoints`) and saw access return when I recreated the pod.
- [ ] I can say which Service type to use for an internal database, a test on Minikube and production in the cloud.
- [ ] I injected a ConfigMap as environment variables, confirmed with `kubectl exec -- env` and can explain why changing the ConfigMap does not change the variables of a running Pod.

**Stage 05: ReplicaSets and Deployments**
- [ ] I deleted a pod of a Deployment and saw the replacement be born by itself (self-healing).
- [ ] I did a rolling update, broke a deploy on purpose and went back with `rollout undo`.
- [ ] I used `kubectl get rs` to see one ReplicaSet per version and can explain why the suffix of the Pod names changes on a version swap.
- [ ] I can explain why the old pods hold the service when the new image fails.

**Stage 06: Volumes**
- [ ] I can explain the chain PVC (request), PV (disk), StorageClass (disk types).
- [ ] I wrote a file to a PVC, destroyed the pod, recreated it and read the file back.
- [ ] I repeated the test with `emptyDir` (in a Pod with another name) and saw the file vanish.
- [ ] I can say when to use emptyDir, hostPath and persistentVolumeClaim.

**Stage 07: Probes**
- [ ] I can say what happens when each probe fails (liveness, readiness, startup).
- [ ] I can tell the three cases apart: process crash (the kubelet restarts the container), Pod that disappears (the ReplicaSet creates a new Pod) and process alive but stuck (only liveness detects it).
- [ ] I ran the liveness-exec experiment and saw the RESTARTS column go up by itself, with the pair `Unhealthy` and `Killing` in the Events.
- [ ] I can explain why `Running` does not mean healthy.

**Stage 08: HPA**
- [ ] I can state the two prerequisites of the HPA (metrics-server and resources.requests).
- [ ] I can say which metrics come ready (CPU and memory) and which require an adapter.
- [ ] I generated load and saw the HPA increase the replicas without any command from me.
- [ ] I can explain why the scale down takes about 5 minutes.

**Stage 09: Professional application**
- [ ] I applied the four podinfo manifests and saw the replicas `Running` with the HPA reading the CPU.
- [ ] I reproduced the ConfigMap gotcha and solved it with `rollout restart`.
- [ ] I provoked a crash with `/panic` and can explain that the restart was done by the kubelet (restartPolicy), not by liveness.
- [ ] I provoked a real liveness failure (probe on a nonexistent path, 404) and saw the events `Liveness probe failed` and `Killing`.
- [ ] I restored the probe with `kubectl apply` and waited for `rollout status` to finish before moving on.
- [ ] I took a Pod out of the Service with `/readyz/disable` and confirmed with `kubectl get endpoints` and `READY 0/1`, with no restart.
- [ ] I can explain why the HPA reduces the 3 replicas to 2 and why the startupProbe and the PVC were left out of this Deployment.

**Next steps:** with all items checked, repeat the exercises on one of the platforms listed in the previous section, this time without consulting the guide. The next topic is the advanced module, where the StatefulSet mentioned in Stage 09 appears.

---

## Teacher's notes: technical precisions

This block gathers details that help you read the examples safely. Nothing here changes the path of the exercises; they are clarifications about behaviors that tend to raise questions.

**About what you will see in the terminal**

1. **Example outputs.** The outputs shown are typical formats. Pod names, ReplicaSet hashes, IPs, ages and columns vary with the Kubernetes version and the environment. Compare the structure, not the exact text. The `rollout history` and `kubectl top` outputs are approximate, and the `get pods -w` outputs are shortened: in a real environment, the lines appear with longer intervals than the example suggests.
2. **API path (Stage 02).** `kubectl get pods` in the `default` namespace makes `GET /api/v1/namespaces/default/pods`. The path `/api/v1/pods` lists pods from all namespaces. `-v=6` shows the actual request, and the format of the log line varies between kubectl versions.
3. **kubectl version before the cluster (Stage 01).** `kubectl version` without `--client` tries to query the server. Before `minikube start` this ends in a connection error, which is expected and does not indicate a faulty installation.
4. **`kubectl get endpoints` (Stages 04 and 09).** In recent Kubernetes versions, the command may display a deprecation warning in favor of EndpointSlices. It remains useful for the exercises; the alternative is `kubectl get endpointslices`.

**About behaviors that surprise**

5. **Rollback (Stage 05).** `rollout undo` goes back to the immediately previous revision, not to the original. In the example, it restores `nginx:1.16.1`, not `nginx:1.14.2`. The restored revision gets a new number in the history and reuses its ReplicaSet.
6. **`kubectl delete pvc` (Stage 06).** With Minikube's `standard` StorageClass, the reclaim policy is usually `Delete`: deleting the PVC deletes the PV and the data. Check your cluster's policy with `kubectl get storageclass`. In production environments, this policy is an important decision.
7. **Changing an existing Pod (Stage 06).** The `spec` of a Pod cannot be modified after it is created (with few exceptions, such as the image). To change the volume type, create a Pod with another name or delete and recreate the Pod.
8. **Restart timing (Stage 07).** In the liveness-exec experiment, the first restart happens at around 45 seconds (30s healthy plus 3 failures spaced 5s apart). The following cycles may take longer, because the kubelet waits for the container to terminate (up to 30s by default, the `terminationGracePeriodSeconds`) before recreating it.
9. **Who restarts what (Stages 07 and 09).** The kubelet restarts containers whose process ended, because of the `restartPolicy`, with or without a probe. The liveness probe exists for the case where the process is still alive but does not respond. An endpoint that brings the process down (like podinfo's `/panic`) demonstrates the first case, not the second.
10. **HPA metrics (Stage 08).** The HPA natively reads CPU and memory, via the metrics-server. Requests per second, Prometheus metrics, disk I/O and any other metric require a custom or external metrics adapter installed in the cluster.
11. **HPA and `replicas` (Stages 08 and 09).** With an active HPA, the number of replicas is decided by it within `minReplicas` and `maxReplicas`. The Deployment's `replicas` works as a starting point and is adjusted by the HPA, which explains the 3 replicas becoming 2 in Stage 09. Reapplying the manifest (`kubectl apply`) sets `replicas` back to the value written in it, and the HPA adjusts again after the stability window.
12. **Service balancing (Stage 09).** Balancing is per connection and the choice of replica is random. Clients that reuse the connection (like a browser) tend to always talk to the same replica.
13. **startupProbe (Stage 07).** The most common way to give a slow app time is `failureThreshold` multiplied by `periodSeconds`, instead of a fixed `initialDelaySeconds`. The example with `initialDelaySeconds: 120` is valid and was kept out of fidelity to the source material.

**Terminology and points to verify**

14. **Master node and control plane.** The lesson material uses "Master node". Current Kubernetes documentation prefers **control plane**, which is what appears in the ROLES column of `kubectl get nodes` in Stage 01. Both names refer to the same thing.
15. **Image tag (Stage 09).** The tag `stefanprodan/podinfo:6.14.1` comes from the guide's material. Confirm on Docker Hub that it exists before running; if it does not, use a more recent published tag. The fixed tag, instead of `latest`, is the didactic point and remains.
16. **Supporting manifests.** The files `liveness-exec.yaml` (Stage 07), the HPA `service.yaml` (Stage 08) and `pod-emptydir.yaml` (Stage 06) are supporting additions to the exercises, following the pattern of the official Kubernetes documentation.
