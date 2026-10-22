// Conteúdo das 8 etapas base (aulas 1-8, Thiago Adriano / FIAP) + 1 etapa bônus de
// aplicação profissional.
// A lente geral de F1 abre o guia (LENS) e cada etapa ensina o tópico só de forma técnica,
// sem repetir a analogia.
// Gerado de relatorios/kubernetes-basico/final.en.md por scripts/build-lens-guide.py.
// Para mudar o texto, edite o markdown e gere de novo; o markdown inline (`código`, **negrito**)
// é renderizado pelo LensKit.

import type { ChecklistGroup, GuideLens, TechLesson } from "@/components/guide/LensKit";

export type Lesson = TechLesson;

export const INTRO: string[] = [
  "This guide teaches Kubernetes from scratch, in eight stages and a bonus, with every exercise running on a Minikube cluster on your own machine. You start by understanding why an orchestrator exists and how to talk to the cluster through kubectl; then you study the anatomy of the cluster and Pods, Services and ConfigMaps, ReplicaSets and Deployments, persistent volumes, probes and the HPA. In the bonus stage, you put these pieces together in a deployment of a real Docker Hub image and decide which of them the app needs and which stay out. Before the stages, the next section introduces the F1 lens of the guide: a general comparison that shows the same system working inside a Formula 1 team.",
  'Each stage depends only on what was explained before it and includes a small exercise that proves you understood. Kubernetes is learned by running things and by making mistakes on purpose, so do not skip the "Hands-on" blocks.',
  "**How to use this guide:** keep a terminal open next to the text. All commands were designed for Minikube, which you install in Stage 01. When an example shows the expected output, compare it with yours. Pod names, IPs and timings will vary; the structure of the output is what matters. When an output is shortened, it is marked with `(...)`.",
  "**Organize your files by stage.** Create one folder for each stage (`etapa03/`, `etapa04/`, `etapa05/` and so on) and save the YAMLs inside it. This is necessary because the name `deployment.yaml` repeats in Stages 05, 08 and 09, and `service.yaml` and `hpa.yaml` repeat in Stages 08 and 09, and working in a single folder would make one file overwrite the previous one. Run the commands from inside the stage folder. At the end of each stage there is a cleanup step; run it before moving on, so that old objects do not interfere with the following exercises.",
];

export const LENS: GuideLens = {
  paragraphs: [
    "A Formula 1 team arrives at a Grand Prix weekend with two cars, a garage in the pit lane and a few dozen people with clearly separated roles. On the pit wall (the gantry facing the track) sit the strategist and the engineers who decide: what each car should do, when to stop, which target to chase. In the garage are the mechanics, organized in one crew per car, each with a chief mechanic. They do not decide strategy: they assemble, adjust and repair the cars according to what the pit wall defined. The cars, on the track, are the units that actually do the work. The regulations limit each team to two cars per race, and that limit will show up a few times as the point where the comparison stops holding.",
    "Nobody on the pit wall touches the car. Information flows through two channels: the team radio and intercom, which carry orders and questions, and the telemetry, hundreds of sensors that continuously transmit the state of each car. To enter that channel you have to be on the team's frequency and hold a credential. Everything the team knows and decides is recorded on the data servers: the weekend plan, the versions of each part, the history of each car. Whoever wants to know how a car is doing consults that record through the official channel, instead of walking to the garage to ask.",
    "The car itself is described by a specification sheet: chassis, power unit (the car's engine, which combines the combustion engine and the electrical part that recovers and returns energy), aerodynamic package, each component with its version. Two cars assembled from the same sheet are equivalent, and a chassis destroyed in a crash is replaced by another one assembled from the same sheet. The chassis is disposable; the specification is what remains. Separate from it there is the parameter sheet (engine maps, energy modes, targets), which changes the car's behavior without swapping any part. What the radio and the timing call is the car's race number, never the serial number of the chassis underneath it.",
  ],
  bridge: [
    "It is the same division of labor that Kubernetes makes: the control plane decides like the pit wall, the nodes execute like the garages, the Pods run like the cars, each Pod comes out of a manifest the way the car comes out of the specification sheet, and everything that is known and ordered goes through a single channel, like the radio and the telemetry. In this guide, you take the place of the person who writes the plan and talks to the pit wall over the radio.",
    "One fixed rule holds for the whole guide: each assembled chassis is a Pod. Swapping the chassis means creating a new Pod, with another serial number (another IP), while the race number (the Service) stays the same. Restarting a system that shut down inside the car, without swapping the chassis, is restarting a container inside the same Pod.",
  ],
  mappingNote:
    "The table below translates each technical term in the guide into an everyday idea, with no F1 and no jargon. You do not need to memorize it; come back to it whenever a term shows up in the text.",
  mapping: [
    {
      term: "Cluster",
      plain: "A group of computers working together as if they were one.",
    },
    {
      term: "Control plane (master node)",
      plain:
        "The management: it decides what runs on each computer and checks that everything matches what was asked, but it does not do the work itself.",
    },
    {
      term: "Worker node",
      plain: "One of the computers that actually does the work.",
    },
    {
      term: "API Server",
      plain: "The service desk: every request and every question goes through it.",
    },
    {
      term: "kubectl",
      plain: "The app you use to talk to the service desk.",
    },
    {
      term: "kubeconfig",
      plain: "The address of the service desk and your access badge, kept in a file.",
    },
    {
      term: "Imperative and declarative",
      plain:
        'Giving an order on the spot ("do this now") or writing down how things should end up.',
    },
    {
      term: "Events",
      plain: "The time-stamped history of what happened to each item.",
    },
    {
      term: "etcd",
      plain:
        "The official notebook where everything that was requested, and the current state of each thing, is written down.",
    },
    {
      term: "kubelet",
      plain: "The supervisor on each computer, who looks after what runs there.",
    },
    {
      term: "kube-proxy",
      plain: "The contact list on each computer, which knows where to forward each call.",
    },
    {
      term: "Virtual machine",
      plain:
        "A whole computer simulated inside another one, with its own operating system: complete, but heavy.",
    },
    {
      term: "Host kernel",
      plain: "The core of the computer's system, shared by every program running on it.",
    },
    {
      term: "Container image",
      plain:
        "A sealed recipe with a version number: followed anywhere, it always gives the same result.",
    },
    {
      term: "Container",
      plain:
        "The program prepared from the recipe, running apart from the others; it can be restarted without touching the rest.",
    },
    {
      term: "Pod",
      plain:
        "The smallest box the system manages: one or more programs that always travel together. If the box is replaced, it is a different box, with a different address.",
    },
    {
      term: "Second container in the Pod",
      plain:
        "A helper program inside the same box, like a recorder that logs what the main one does.",
    },
    {
      term: "Pod IP",
      plain: "The box's address, which changes when the box is replaced.",
    },
    {
      term: "Namespace",
      plain: "Separate folders inside the same system, each with its own list of items.",
    },
    {
      term: "Label",
      plain: "A sticker on an item, used to find all items of the same kind at once.",
    },
    {
      term: "Annotation",
      plain: "A sticky note on an item, written for people to read; it is not used for searching.",
    },
    {
      term: "YAML manifest",
      plain: "The filled-in form that describes what you want, kept so it can be reused.",
    },
    {
      term: "Desired state",
      plain:
        'A standing request, like "always keep 3 running", that the system works on its own to maintain.',
    },
    {
      term: "Minikube",
      plain: "A workbench version of the system that runs on your own computer for studying.",
    },
    {
      term: "Service",
      plain:
        "A fixed service number that forwards the call to whoever is available, even when the people change.",
    },
    {
      term: "ClusterIP, NodePort, LoadBalancer",
      plain:
        "An internal-only extension; the same extension opened on every computer for outside callers; a published public number.",
    },
    {
      term: "ConfigMap",
      plain: "The settings sheet kept apart from the program, read when the program starts.",
    },
    {
      term: "Secret",
      plain: "The same kind of sheet, for passwords and keys, kept with more care.",
    },
    {
      term: "ReplicaSet",
      plain: 'The rule "always N copies running": if one disappears, another is created.',
    },
    {
      term: "Deployment",
      plain:
        "The one in charge of versions: it swaps versions carefully and keeps the history of earlier ones.",
    },
    {
      term: "Rolling update",
      plain: "Swapping the version one copy at a time, without closing the service.",
    },
    {
      term: "Rollback",
      plain: "Going back to the previous version, the one that worked.",
    },
    {
      term: "emptyDir",
      plain: "A temporary scratch pad, thrown away together with the box.",
    },
    {
      term: "hostPath",
      plain: "A drawer in one specific computer: it is only useful to whoever is on that computer.",
    },
    {
      term: "PVC",
      plain: 'The request for space to store data ("I need 1 GB").',
    },
    {
      term: "PV",
      plain: "The actual storage space that fulfills that request.",
    },
    {
      term: "StorageClass",
      plain: "The menu of storage types that can be created when someone asks.",
    },
    {
      term: "restartPolicy",
      plain: "The rule that restarts, on its own, a program that crashed, in the same box.",
    },
    {
      term: "Probes",
      plain: "Routine questions asked every few seconds to find out whether the program is fine.",
    },
    {
      term: "Liveness, readiness, startup",
      plain:
        '"Are you alive?" (if not, restart); "can you serve?" (if not, stay out of the service); "have you finished starting?" (until then, the other questions wait).',
    },
    {
      term: "HPA",
      plain:
        "Automatic adjustment of the number of copies to match demand, always between a minimum and a maximum.",
    },
    {
      term: "metrics-server",
      plain:
        "The usage meter that feeds that adjustment; without it, there are no numbers to decide with.",
    },
    {
      term: "resources.requests",
      plain: "The declared reservation of resources; usage percentages are calculated from it.",
    },
  ],
  limitsIntro:
    "The comparison helps fix the division of roles, but it is not a perfect equivalence. These are the points where F1 stops applying for each stage:",
  limits: [
    "**Stage 01:** a team replaces a car in hours, between sessions, and the regulations fix the number at two cars; Kubernetes creates a new Pod in seconds, at any moment, and the limit on quantity is only what the cluster can handle.",
    "**Stage 02:** the F1 radio is voice, interpreted by people; the Kubernetes API is a rigid HTTP protocol, in which every request has a method, a path and a response code, with no room for interpretation.",
    "**Stage 03:** the systems of a car are physically integrated and designed together, while the containers of a Pod are independent processes that can be swapped one by one in the specification without touching the others.",
    "**Stage 04:** a race number points to a single car, while the Service distributes requests among several replicas at the same time; load balancing has no equivalent in F1.",
    "**Stage 05:** in F1, a car is replaced between sessions, in hours, and the regulations limit the team to two cars; the ReplicaSet replaces in seconds, at any moment, and keeps whatever number of replicas is declared.",
    "**Stage 06:** in F1, the car's data is transmitted or downloaded to the servers, that is, a copy exists; the PVC copies nothing, the Pod writes directly to the external volume, and if the PVC is deleted with the `Delete` policy the data goes with it.",
    "**Stage 07:** in F1, restarting a system on track involves the driver and almost always costs the session; in Kubernetes, the kubelet restarts the container in seconds, with nobody's intervention, and the Pod remains the same Pod, with the RESTARTS counter going up.",
    "**Stage 08:** at a GP the team races with exactly two cars, by regulation; the HPA, which adds or removes replicas according to load, only has a parallel in an imaginary operation with no limit on cars, and this is the stage where the comparison strays furthest from real F1.",
    "**Stage 09:** in an F1 car the driver changes maps and modes from the steering wheel in the middle of a lap, and the new value applies at once; in Kubernetes, an environment variable read from a ConfigMap only changes when the Pod is recreated.",
  ],
};

export const LESSONS: Lesson[] = [
  {
    id: "m1",
    num: "01",
    navTitle: "Why K8s exists",
    tag: "motivation + setup",
    title: "Why Kubernetes exists",
    lead: 'Picture the e-commerce site of a mid-sized company. For eleven months it receives a predictable volume of visits. In the week of Black Friday, traffic multiplies several times over. If you size the servers for everyday traffic, the site goes down at the peak. If you size them for the peak, you pay for idle machines all year. The infrastructure needs to grow and shrink with demand.\n\nThere is a second, less visible problem. The developer runs the application on their own machine, QA tests on another one, and production is a third. Any difference in library version, operating system or configuration produces the classic "it works on my machine". Keeping dev, test and production identical by hand is a constant source of bugs.\n\nEvery software project runs into these two problems: keeping environments equal and scaling when demand changes. Kubernetes automates the solution to both.',
    concept: [
      "The piece common to both solutions is the **container**.",
      'A virtual machine (VM) carries virtualized hardware and a complete operating system: it takes up gigabytes and takes minutes to start. A container shares the kernel of the host operating system and carries only the files, binaries and libraries the app needs: it takes up megabytes and starts in seconds. A **container image** packages that whole environment and can be run identically anywhere, which solves the "it works on my machine" problem.',
      "Containers solve the environment problem and create another one. With dozens or hundreds of them, someone has to create them, destroy them, watch the health of each one and recreate whatever fails. Doing that manually does not scale. **Kubernetes (K8s)** is the **orchestrator** that takes over these tasks.",
      'The central idea of Kubernetes is the **desired state**. You do not run a sequence of orders ("start this container, then that one"). You declare the result you want ("I want 3 copies of this application running") and Kubernetes continuously compares what exists with what was declared, correcting any difference. If one of the copies disappears at 3 a.m. (the Pod is deleted or the node it was running on goes down), the cluster notices that there are 2 copies instead of 3 and creates the missing one, without anyone waking up. When what fails is only the process inside the container, another mechanism reacts, one you will clearly tell apart in Stage 07.',
    ],
    pointsTitle: "Key concepts",
    points: [
      {
        t: "Container",
        d: "an isolated process that shares the host kernel and carries only what the app needs. Much lighter than a VM.",
        color: "blue",
      },
      {
        t: "Image",
        d: "an immutable package with the app's environment. The container is an image in execution.",
        color: "signal",
      },
      {
        t: "Horizontal scaling",
        d: "more copies of the application sharing the load (this is what K8s automates). Vertical scaling is giving more CPU and RAM to the same machine.",
        color: "violet",
      },
      {
        t: "Cluster and node",
        d: "K8s organizes machines (nodes) into a cluster, which is treated as a single platform.",
        color: "ember",
      },
      {
        t: "Pod",
        d: "the group of containers that K8s manages as a unit. It is the smallest managed unit (details in Stage 03).",
        color: "blue",
      },
      {
        t: "Namespace",
        d: "a logical separation of resources inside the cluster. When you indicate none, the namespace used is `default`.",
        color: "signal",
      },
      {
        t: "kubectl",
        d: "a command-line tool that talks to the cluster's REST API (details in Stage 02).",
        color: "violet",
      },
      {
        t: "Minikube",
        d: "a 1-node K8s cluster running on your machine. Built for study, it is the lab of this guide.",
        color: "ember",
      },
      {
        t: "Desired state",
        d: "you declare what you want, and K8s makes it happen and keeps it that way. If something goes down, it recreates it.",
        color: "blue",
      },
    ],
    examplesTitle: "Setting up the lab",
    examples: [
      {
        label: "setting up the lab",
        lang: "sh",
        code: '# 1. Install Docker Desktop (docker.com). On Linux, use Docker\n#    Engine (docs.docker.com/engine/install). Confirm:\n$ docker -v\nDocker version 27.x\n\n# 2. Install kubectl (kubernetes.io/docs/tasks/tools) and confirm.\n#    Use --client: there is no cluster yet, so only the client\n#    version can be queried (without --client, kubectl would try to talk\n#    to a nonexistent server and print a connection error)\n$ kubectl version --client\nClient Version: v1.30.x\nKustomize Version: v5.x\n\n# 3. Install Minikube (minikube.sigs.k8s.io/docs/start) and start the cluster:\n$ minikube start\n😄  minikube v1.33 on Windows 11\n✨  Using the docker driver\n🏄  Done! kubectl is now configured to use "minikube"\n\n# 4. Confirm the cluster is up:\n$ kubectl get nodes\nNAME       STATUS   ROLES           AGE   VERSION\nminikube   Ready    control-plane   1m    v1.30.x\n\n# 5. Empty cluster = success:\n$ kubectl get pods\nNo resources found in default namespace.\n\n# 6. Now that the cluster exists, the full version shows client and server:\n$ kubectl version --output=yaml\nclientVersion:\n  (...)\nserverVersion:\n  (...)',
        note: "The first run of `minikube start` downloads the cluster image and takes a few minutes. This is normal.",
      },
    ],
    commands: [
      {
        cmd: "minikube start",
        note: "starts the local 1-node cluster",
      },
      {
        cmd: "minikube stop",
        note: "stops the cluster without deleting anything",
      },
      {
        cmd: "kubectl version --client",
        note: "shows the kubectl version, with no cluster needed",
      },
      {
        cmd: "kubectl get nodes",
        note: "lists the nodes and the status of each one",
      },
      {
        cmd: "kubectl get pods",
        note: "lists the pods in the current namespace",
      },
    ],
    handsOn: [
      'Run `minikube start` and wait for the "Done!".',
      "Run `kubectl get nodes`. **Observe** the `minikube` node with `STATUS Ready`. If `NotReady` appears, wait 1 minute and repeat.",
      "Run `kubectl get pods`. **Observe** `No resources found in default namespace.` An empty, ready cluster is the starting point of the next stage.",
      'Bonus: run `minikube stop` and then `kubectl get nodes`. **Observe** the connection error message (the cluster does not respond). Start it again with `minikube start`. Now you know what "cluster down" looks like in the terminal.',
    ],
    tip: "If `minikube start` fails, the most common cause is Docker Desktop not being open. On Linux, the equivalent is the stopped service: `sudo systemctl start docker`. Start Docker first and try again.",
    takeaway:
      "A container is a light, replicable environment; Kubernetes maintains the desired state of those containers: you declare what you want, and it guarantees it.",
    figures: [
      {
        items: [
          {
            src: "/guides/kubernetes/etapa01-evolucao-deploy.svg",
            alt: "Three columns: traditional deployment, with apps directly on the operating system; virtualized deployment, with a hypervisor and one operating system per virtual machine; container deployment, with a container runtime on a single operating system.",
            caption:
              "From left to right: apps directly on the server, one VM with its own operating system for each app, and containers sharing the same operating system.",
          },
        ],
        credit: "Diagram: kubernetes.io, The Kubernetes Authors, CC BY 4.0",
      },
    ],
    handsOnIntro: "The smallest possible exercise: prove that the lab is alive.",
  },
  {
    id: "m2",
    num: "02",
    navTitle: "kubectl & API",
    tag: "command line + API",
    title: "kubectl and the API, how you command the cluster",
    lead: "The cluster is up (Stage 01), but you still do not know how to talk to it. Imagine that the checkout service stopped responding at 2 a.m. and you are on call. You need to find out which pods exist, what state they are in, what the app is printing and, if necessary, get inside the container to investigate. None of this can depend on physical access to the machine where the container runs.",
    concept: [
      "Everything in Kubernetes goes through the **REST API** of the master node (the *control plane*). `kubectl` is the client of that API: each command you type becomes an HTTP request (GET, POST, PUT or DELETE) against the cluster.",
      "The path of a command is this:",
      "1. You type `kubectl get pods`.",
      "1. kubectl reads the **kubeconfig** file, which holds the API Server address, the credentials and the current cluster context. Minikube fills in this file by itself on `minikube start`.",
      "1. kubectl sends a `GET` to the API Server (for the `default` namespace, the path is `/api/v1/namespaces/default/pods`).",
      "1. The response comes back and kubectl formats it in the terminal.",
      'The API is divided into groups. The "core" group holds the fundamental resources (pods, services, replicasets); other groups handle security, storage and autoscaling. Since it is plain REST, any language (Python, Go, Java, C#) can call it, which opens room for automation.',
      "There are two ways of working with kubectl:",
      "- **Imperative**: you give the direct order, as in `kubectl run nginx --image=nginx`. It is fast and good for tests.",
      "- **Declarative**: you write a YAML file that describes the desired state and run `kubectl apply -f file.yaml`. It is the dominant mode in real projects, because the file can be versioned in Git, reviewed and reapplied.",
      "In this guide we start with the imperative way, which is faster to learn, and move to the declarative way in Stage 03.",
    ],
    pointsTitle: "Key concepts",
    points: [
      {
        t: "API Server",
        d: "the cluster's front door; it receives every request, validates it and executes it.",
        color: "blue",
      },
      {
        t: "kubeconfig",
        d: "a file with the cluster address, credentials and current context.",
        color: "signal",
      },
      {
        t: "Imperative vs. declarative",
        d: "giving step-by-step orders versus describing the final state.",
        color: "violet",
      },
      {
        t: "Events",
        d: "history of events for an object (image pulled, container created, failure). It appears at the end of `describe`.",
        color: "ember",
      },
      {
        t: "Everyday verbs",
        d: "- `get`: queries resources and the status of each one (`get pods`, `get svc`, `get nodes`). - `create` / `run` / `apply`: create resources. `run` creates an imperative pod; `apply -f` applies a YAML. - `delete`: removes. Be careful, it can affect whoever depends on the resource. - `describe`: shows the configuration and the Events section. It is the first stop when something gets stuck. - `logs`: shows what the container is printing. It is the main source of information when debugging. - `exec`: runs a command inside the container, for example a shell.",
        color: "blue",
      },
    ],
    examplesTitle: "The life cycle of a Pod",
    examples: [
      {
        label: "terminal",
        lang: "sh",
        code: '# Creates a pod named "nginx" from the nginx:1.14.2 image on Docker Hub\n$ kubectl run nginx --image=nginx:1.14.2 --port=80\npod/nginx created\n\n# Follow until the status becomes Running (the first state is ContainerCreating)\n$ kubectl get pods\nNAME    READY   STATUS    RESTARTS   AGE\nnginx   1/1     Running   0          30s\n\n# Details + events (see the "Pulling image" line in the Events section)\n$ kubectl describe pod nginx\nName:         nginx\n(...)\nEvents:\n  Type    Reason     Age   From               Message\n  Normal  Scheduled  35s   default-scheduler  Successfully assigned default/nginx to minikube\n  Normal  Pulling    34s   kubelet            Pulling image "nginx:1.14.2"\n  Normal  Pulled     20s   kubelet            Successfully pulled image "nginx:1.14.2"\n  Normal  Created    20s   kubelet            Created container nginx\n  Normal  Started    20s   kubelet            Started container nginx\n\n# What the container is printing (nginx writes the access log to standard\n# output, so it only shows lines after requests arrive)\n$ kubectl logs nginx\n\n# Opens a shell inside the container (type "exit" to leave).\n# Note: after this command you are INSIDE the container and the prompt\n# becomes "# ". The lines below that start with "# " (ls and exit) are not\n# comments: they are commands typed in the container\'s shell.\n$ kubectl exec -it nginx -- /bin/sh\n# ls /usr/share/nginx/html\n50x.html  index.html\n# exit\n\n# Back in your terminal (prompt "$"). Cleanup:\n$ kubectl delete pod nginx\npod "nginx" deleted',
        note: "If the status stays at `ImagePullBackOff`, the cluster could not download the image. Check the image name and tag and your internet connection. To see the HTTP request behind a command, raise kubectl's log level. The exact format changes from version to version, but you should find a line with the method, the API path and the status:",
      },
      {
        label: "terminal (2)",
        lang: "sh",
        code: "$ kubectl get pods -v=6\n(...) GET https://192.168.49.2:8443/api/v1/namespaces/default/pods?limit=500 200 OK in 12 milliseconds\nNAME    READY   STATUS    RESTARTS   AGE\nnginx   1/1     Running   0          2m",
      },
    ],
    commands: [
      {
        cmd: "kubectl run nginx --image=nginx:1.14.2 --port=80",
        note: "creates an imperative pod",
      },
      {
        cmd: "kubectl get pods",
        note: "lists the pods and their status",
      },
      {
        cmd: "kubectl describe pod <name>",
        note: "details and Events (troubleshooting)",
      },
      {
        cmd: "kubectl logs <name>",
        note: "container output",
      },
      {
        cmd: "kubectl exec -it <name> -- /bin/sh",
        note: "shell inside the container",
      },
      {
        cmd: "kubectl delete pod <name>",
        note: "removes the pod",
      },
      {
        cmd: "kubectl get pods -v=6",
        note: "shows the HTTP request that kubectl made",
      },
    ],
    handsOn: [
      "Run the sequence from the example (`run`, `get`, `describe`, `logs`, `delete`). **Observe** the `Events` section of `describe`: the lines `Pulling image`, `Created container` and `Started container` tell the pod's story in order.",
      "Create a deliberately broken pod: `kubectl run quebrado --image=nginx:versao-que-nao-existe`.",
      "Run `kubectl get pods`. **Observe** the status `ErrImagePull`, which soon becomes `ImagePullBackOff`.",
      "Run `kubectl describe pod quebrado`. **Observe** in the Events the message saying the image was not found. You have just practiced the real debugging flow.",
      "Run `kubectl get pods -v=6` and **observe** the line with `GET .../api/v1/namespaces/default/pods`. This is the command translated into HTTP.",
      "Clean up: `kubectl delete pod quebrado`.",
    ],
    tip: "Memorize the debugging flow: `get pods` (what is the status?), then `describe pod` (what do the Events say?), then `logs` (what does the app say?). This sequence solves most problems.",
    takeaway:
      "Everything in K8s is a call to the REST API, kubectl is the client of that API, and when something gets stuck the path is always get, describe, logs.",
    handsOnIntro: "Run the complete cycle and provoke your first error on purpose.",
  },
  {
    id: "m3",
    num: "03",
    navTitle: "Cluster & Pods",
    tag: "architecture + labels",
    title: "The anatomy of the cluster and its smallest unit, the Pod",
    lead: "In Stage 02 you created a pod with an imperative command. It works, but there are two gaps. First, you do not know what exactly was created or where inside the cluster. Second, if tomorrow you need to recreate that same pod in another environment, you will only have your memory of the command you typed. On top of that, imagine a team with 40 pods in the same cluster (checkout, catalog, payment, search). How do you list only the checkout ones? We need to understand the pieces of the cluster, describe objects in versionable files and group them by criteria that Kubernetes itself can use.",
    concept: [
      "A **cluster** is a group of machines (**nodes**) working together, with well-defined roles:",
      "- The **master node** (control plane) manages the cluster and decides where to run the Pods.",
      "- The **worker nodes** run the Pods and the other resources.",
      "- **etcd** is the distributed database that stores the configuration and state of everything in the cluster.",
      "- The **kubelet** is the agent that runs on each node and manages the Pods of that node.",
      "- **kube-proxy** forwards network traffic to the right Pod.",
      "- The **API Server** is the front door, through which everything kubectl does passes (Stage 02).",
      "The **Pod** is the smallest unit that Kubernetes manages: an envelope with one or more containers that share network and storage. Four facts about Pods:",
      "1. A Pod represents a running process and can have more than one container, all sharing the same IP and the same volumes.",
      "1. **Pods are ephemeral.** They are born and die all the time, and you must never count on a specific Pod existing tomorrow. This sentence is the root of Stages 04, 05 and 06.",
      "1. Each Pod receives an internal cluster IP.",
      "1. Pods are described in YAML.",
      "To organize many objects there are **labels** and **annotations**. Labels are key-value pairs used to **identify and select** objects: it is by label that a Service finds its Pods (Stage 04) and that a Deployment knows which Pods are its own (Stage 05). Annotations are free-form metadata (author, documentation link, audit data) that **do not take part in selection**; they are for people and tools to read. This difference is a classic exam question.",
    ],
    pointsTitle: "Key concepts",
    points: [
      {
        t: "Master node",
        d: "manages the cluster and decides where to run the Pods.",
        color: "blue",
      },
      {
        t: "Worker node",
        d: "runs the Pods and other resources.",
        color: "signal",
      },
      {
        t: "etcd",
        d: "distributed database with the cluster's configuration and state.",
        color: "violet",
      },
      {
        t: "kubelet",
        d: "agent on each node that manages the local Pods.",
        color: "ember",
      },
      {
        t: "kube-proxy",
        d: "forwards network traffic to the right Pods.",
        color: "blue",
      },
      {
        t: "API Server",
        d: "front door for everything kubectl does.",
        color: "signal",
      },
      {
        t: "Pod",
        d: "one or more containers with shared network and volumes; ephemeral.",
        color: "violet",
      },
      {
        t: "Label",
        d: "key-value pair to identify and select objects.",
        color: "ember",
      },
      {
        t: "Annotation",
        d: "free-form metadata for documentation, with no role in selection.",
        color: "blue",
      },
      {
        t: "Manifest",
        d: "YAML file that describes an object. Every manifest has `apiVersion`, `kind`, `metadata` and `spec`.",
        color: "signal",
      },
    ],
    examplesTitle: "The first YAML",
    examples: [
      {
        label: "the first YAML",
        lang: "yaml",
        code: 'apiVersion: v1                # K8s API version for this object\nkind: Pod                     # the TYPE of object created\nmetadata:                     # data ABOUT the object\n  name: meu-pod\n  labels:                     # labels: key-value pairs to SELECT\n    app: myapp\n    ambiente: estudo\n  annotations:                # annotations: free-form metadata (docs)\n    autor: "Davi Gomes"\nspec:                         # the SPECIFICATION: what runs inside\n  containers:\n    - name: meu-container\n      image: nginx:1.14.2\n      ports:\n        - containerPort: 80',
        intro:
          "Create the `etapa03/` folder and save the manifest below in it as `meu-pod.yaml`. This is the skeleton you need to know by heart.",
        note: "Every K8s object follows this skeleton: `apiVersion` + `kind` + `metadata` + `spec`. What changes from one object to another is the value of `kind` and the content of `spec`; the rest is always the same. Whoever masters this skeleton can read any manifest.",
      },
      {
        label: "terminal",
        lang: "sh",
        code: "# Applies the YAML (declarative)\n$ kubectl apply -f meu-pod.yaml\npod/meu-pod created\n\n# Lists showing the labels\n$ kubectl get pods --show-labels\nNAME      READY   STATUS    RESTARTS   AGE   LABELS\nmeu-pod   1/1     Running   0          20s   ambiente=estudo,app=myapp\n\n# Filters by label: the central mechanism of K8s\n$ kubectl get pods -l app=myapp\nNAME      READY   STATUS    RESTARTS   AGE\nmeu-pod   1/1     Running   0          1m\n\n# Adds a label to a pod that already exists\n$ kubectl label pod meu-pod time=devops\npod/meu-pod labeled",
        note: 'The `-l` filter looks simple, but Services, ReplicaSets and Deployments find "their" Pods exactly this way, by **label selector**. The next stages depend on this mechanism.',
      },
    ],
    commands: [
      {
        cmd: "kubectl apply -f file.yaml",
        note: "creates or updates from the YAML",
      },
      {
        cmd: "kubectl get pods --show-labels",
        note: "lists showing the labels",
      },
      {
        cmd: "kubectl get pods -l app=myapp",
        note: "filters by label",
      },
      {
        cmd: "kubectl label pod <name> key=value",
        note: "adds a label to an existing pod",
      },
      {
        cmd: "kubectl delete -f file.yaml",
        note: "removes what the file created",
      },
    ],
    handsOn: [
      "Save the YAML above as `etapa03/meu-pod.yaml` and apply it with `kubectl apply -f meu-pod.yaml`.",
      "Run `kubectl get pods --show-labels`. **Observe** the two labels in the last column.",
      "Run `kubectl get pods -l app=myapp` and then `kubectl get pods -l app=outra-coisa`. **Observe**: the first finds the pod, the second answers `No resources found in default namespace.` This is the selection mechanism in action.",
      "Add a label on the fly with `kubectl label pod meu-pod time=devops` and confirm with `--show-labels`.",
      "Do not delete the pod now: it will be the target of the Service in the next stage, and its cleanup is at the end of Stage 04. If you deleted it, apply the YAML again. This is the advantage of the declarative way: the file recreates the identical object.",
    ],
    tip: "Labels are operational selection (K8s uses them). Annotations are documentation (people use them). To record the author of a Pod, use an annotation; to group the Pods of an application, use a label.",
    takeaway:
      "Every K8s object is apiVersion + kind + metadata + spec, and labels are the mechanism by which everything in the cluster finds everything else.",
    figures: [
      {
        items: [
          {
            src: "/guides/kubernetes/etapa03-arquitetura-cluster.svg",
            alt: "Diagram of a cluster: on the left, the control plane with kube-api-server, etcd, scheduler, controller manager and cloud-controller-manager; on the right, two nodes, each with kubelet, kube-proxy, container runtime and Pods.",
            caption:
              "The control plane decides and stores the state (API Server, etcd, scheduler, controller manager); each node runs the Pods with kubelet and kube-proxy. The cloud-controller-manager only exists in cloud clusters.",
          },
        ],
        credit: "Diagram: kubernetes.io, The Kubernetes Authors, CC BY 4.0",
      },
      {
        items: [
          {
            src: "/guides/kubernetes/etapa03-pods.svg",
            alt: "Four Pods with different IPs: the first with one container, the second with one container and a volume, the third with two containers and a volume, the fourth with several containers and volumes.",
            caption:
              "Each Pod has its own IP. Inside it, one or more containers share that IP and the declared volumes.",
          },
        ],
        credit: "Diagram: kubernetes.io, The Kubernetes Authors, CC BY 4.0",
      },
    ],
  },
  {
    id: "m4",
    num: "04",
    navTitle: "Services & ConfigMap",
    tag: "networking + config",
    title: "Services and ConfigMaps, a fixed address and external configuration",
    lead: "From Stage 03, Pods are ephemeral and each new Pod is born with a different IP. Now imagine the front end of an e-commerce site calling the orders API. Today the API is at IP `10.244.0.5`. Tomorrow the Pod dies, is recreated and becomes `10.244.0.9`. If the front end has the old IP written in its code, it breaks at every recreation. How does anyone talk to Pods reliably if the address keeps changing?\n\nThere is a second problem. Every service needs configuration (ports, URLs of other services, flags). If these values live inside the container image, every change forces a rebuild and a republish of the image. Changing a URL should not require a new build.",
    concept: [
      "**Problem 1: the Service.** The Service is a stable entry point that finds the Pods by label and balances traffic among them. The flow is:",
      "1. A request arrives at the Service, which has a fixed IP and name.",
      "1. The Service selects the Pods by **label selector** (the mechanism from Stage 03).",
      "1. Traffic is distributed in a balanced way among the healthy replicas.",
      "The Service name becomes an **internal hostname** of the cluster. If the Service is called `auth-service`, any Pod in the cluster can reach `http://auth-service`, even if the Pods behind it change IP repeatedly.",
      "There are three types of Service:",
      "- **ClusterIP** (the default): internal IP, reachable only from inside the cluster. It serves communication between services (for example, API to database).",
      "- **NodePort**: opens a fixed port (from 30000 to 32767) on every node. Access from outside is done through `node-IP:port`. It is the way to expose something on Minikube.",
      "- **LoadBalancer**: provisions an external load balancer with a public IP. It is the type used in production in the cloud (AWS, GCP, Azure).",
      "**Problem 2: the ConfigMap.** The ConfigMap stores configuration in an object separate from the container. You inject it into the Pod in three ways:",
      "- **environment variables** (the most common, via `envFrom`);",
      "- **mounted files** (great for long configurations);",
      "- **command-line arguments**.",
      "When the configuration changes, you update the ConfigMap and the image stays the same, with no rebuild. But pay attention to one detail: **environment variables are read when the container starts**. Updating the ConfigMap does not change the variables of a Pod that is already running; the Pod needs to be recreated to see the new values (you will see this happen in practice in Stage 09). ConfigMaps mounted as files, on the other hand, are usually updated inside the Pod after some time, without recreating it, but the app needs to reread the file to use the new value.",
    ],
    pointsTitle: "Key concepts",
    points: [
      {
        t: "Service",
        d: "stable address (IP and name) that selects Pods by label and balances traffic.",
        color: "blue",
      },
      {
        t: "selector",
        d: "the key-value pair that links the Service to the Pods; it must match the label of the Pods.",
        color: "signal",
      },
      {
        t: "port / targetPort / nodePort",
        d: "`port` is where the Service listens; `targetPort` is the container port that receives; `nodePort` is the port exposed on the node (only for the NodePort type).",
        color: "violet",
      },
      {
        t: "ClusterIP",
        d: "internal access only. **NodePort**: external access through a node port. **LoadBalancer**: external access through a public IP in the cloud.",
        color: "ember",
      },
      {
        t: "Endpoints",
        d: "the list of Pod IPs the Service is actually using; empty when no Pod matches the selector.",
        color: "blue",
      },
      {
        t: "ConfigMap",
        d: "object with key-value configuration pairs, separate from the image.",
        color: "signal",
      },
      {
        t: "envFrom",
        d: "injects all the keys of a ConfigMap as environment variables (read only when the container is created).",
        color: "violet",
      },
      {
        t: "Secret",
        d: "sibling of the ConfigMap, meant for passwords and keys.",
        color: "ember",
      },
    ],
    examplesTitle: "Look at the selector",
    examples: [
      {
        label: "app.yaml",
        lang: "yaml",
        code: "# app.yaml: save the Service in this file\napiVersion: v1\nkind: Service\nmetadata:\n  name: meu-service            # becomes the internal hostname\nspec:\n  type: NodePort               # switch to ClusterIP (internal) or LoadBalancer (cloud)\n  selector:                    # ← THE LINK: looks for Pods with this label\n    app: myapp\n  ports:\n    - protocol: TCP\n      port: 80                 # port the Service listens on\n      targetPort: 80           # container port that receives\n      nodePort: 30080          # port exposed on the node (NodePort only)",
        intro: "Create the `etapa04/` folder and save this stage's manifests in it.",
        note: "The Service `selector` matches the Pod label (`app: myapp`), exactly the `meu-pod` from Stage 03. This is how the Service knows where to send traffic.",
      },
      {
        label: "terminal",
        lang: "sh",
        code: "$ kubectl apply -f app.yaml\nservice/meu-service created\n\n$ kubectl get svc\nNAME          TYPE        CLUSTER-IP    EXTERNAL-IP   PORT(S)        AGE\nkubernetes    ClusterIP   10.96.0.1     <none>        443/TCP        1h\nmeu-service   NodePort    10.96.xx.xx   <none>        80:30080/TCP   10s\n\n# Generates the access URL (on Windows/Docker, keep the terminal open: it is a tunnel)\n$ minikube service meu-service --url\nhttp://127.0.0.1:53412   ← open in the browser: nginx page",
        note: "Now the ConfigMap, injected into a Pod as environment variables:",
      },
      {
        label: "configmap-pod.yaml",
        lang: "yaml",
        code: '# configmap-pod.yaml: both objects in the same file, separated by ---\n# 1) The ConfigMap with the values...\napiVersion: v1\nkind: ConfigMap\nmetadata:\n  name: minha-config\ndata:\n  MENSAGEM: "olá do configmap!"\n  MODO: "estudo"\n---\n# 2) ...injected as environment variables into the Pod\napiVersion: v1\nkind: Pod\nmetadata:\n  name: pod-config\nspec:\n  containers:\n    - name: app\n      image: nginx:1.14.2\n      envFrom:                 # injects ALL keys at once\n        - configMapRef:\n            name: minha-config',
      },
      {
        label: "terminal (2)",
        lang: "sh",
        code: "$ kubectl apply -f configmap-pod.yaml\nconfigmap/minha-config created\npod/pod-config created\n\n# Confirm the injection: the ConfigMap keys appear as variables\n$ kubectl exec pod-config -- env\n(...)\nMENSAGEM=olá do configmap!\nMODO=estudo\n(...)",
      },
    ],
    commands: [
      {
        cmd: "kubectl get svc",
        note: "lists the Services",
      },
      {
        cmd: "minikube service <name> --url",
        note: "access URL for a NodePort",
      },
      {
        cmd: "kubectl get endpoints <service>",
        note: "lists the Pod IPs the Service is using",
      },
      {
        cmd: "kubectl get configmap",
        note: "lists the ConfigMaps",
      },
      {
        cmd: "kubectl exec <pod> -- env",
        note: "checks the injected environment variables",
      },
    ],
    handsOn: [
      "With the `meu-pod` from Stage 03 running (label `app: myapp`), save the Service YAML as `etapa04/app.yaml` and apply it.",
      "Run `minikube service meu-service --url` and open the URL in the browser. **Observe** the nginx welcome page. You reached an ephemeral Pod through a stable address.",
      "Test the link: delete the pod (`kubectl delete pod meu-pod`) and reload the browser. **Observe** that the page stops loading (the browser shows connection refused or timed out, depending on the system and the driver), since there is no Pod left with the label. Confirm the cause with `kubectl get endpoints meu-service`: the endpoints list is empty.\n```sh\n$ kubectl get endpoints meu-service\nNAME          ENDPOINTS   AGE\nmeu-service   <none>      5m\n```\nRecreate the pod with `kubectl apply -f ../etapa03/meu-pod.yaml` and reload. Access is back without you touching the Service, and `kubectl get endpoints meu-service` shows an IP again (something like `10.244.0.7:80`).",
      "Apply the ConfigMap and the pod (`kubectl apply -f configmap-pod.yaml`) and run `kubectl exec pod-config -- env`. **Observe** `MENSAGEM` and `MODO` in the list of variables.",
      'Clean up the objects of this stage and the previous one:\n```sh\n$ kubectl delete -f app.yaml -f configmap-pod.yaml -f ../etapa03/meu-pod.yaml\nservice "meu-service" deleted\nconfigmap "minha-config" deleted\npod "pod-config" deleted\npod "meu-pod" deleted\n```\n(The order of the lines may vary.) Also close the `minikube service` terminal, with Ctrl+C.',
    ],
    tip: "Golden rule: expose the minimum. A database should be ClusterIP, invisible from outside. Only the system's entry point becomes NodePort or LoadBalancer. For passwords and keys, the safe sibling of the ConfigMap is the Secret.",
    takeaway:
      "A Service gives a fixed address to Pods that change (finding them by label); a ConfigMap takes configuration out of the image, but environment variables only change when the Pod is recreated.",
    figures: [
      {
        items: [
          {
            src: "/guides/kubernetes/etapa04-service-labels.svg",
            alt: "A Service with selector app=A routes traffic to three Pods labeled app: A, managed by a Deployment and a ReplicaSet; a Pod labeled app: B is left out.",
            caption:
              "The Service finds the Pods by the selector `app=A`, not by IP. The Pod with `app: B` gets no traffic from this Service. Deployment and ReplicaSet are covered in Stage 05.",
          },
        ],
        credit: "Diagram: kubernetes.io, The Kubernetes Authors, CC BY 4.0",
      },
    ],
  },
  {
    id: "m5",
    num: "05",
    navTitle: "Deployments",
    tag: "self-healing + scale",
    title: "Self-healing and scaling with ReplicaSets and Deployments",
    lead: "So far you have created Pods manually, which is fine for learning. In production, three situations break this model.",
    concept: [
      "Two pieces solve this, one wrapping the other.",
      "**ReplicaSet: guarantees the number of replicas.** You declare `replicas: 3` and it monitors the Pods by label selector. If a Pod disappears, the ReplicaSet notices that the count dropped and creates another in seconds, without anyone asking. This is **self-healing**, the desired state from Stage 01 maintained in practice. The ReplicaSet takes care of Pods that **disappear**. If what fails is only the process inside the container (a crash), the Pod still exists and whoever restarts the container is the kubelet, inside the same Pod; this separation is detailed in Stage 07.",
      "**Deployment: manages versions.** It creates and manages the ReplicaSet under the hood and adds:",
      "- **Rolling Update**: when you change the image, the Deployment brings up new replicas and shuts down the old ones gradually, and the service never goes down.",
      "- **Rollback**: if the new version breaks, `kubectl rollout undo` returns to the previous one in seconds.",
      "- **Manual scaling**: `kubectl scale --replicas=5` changes the number of replicas with one command.",
      "Each version of the template has its own ReplicaSet. When the version changes, the Deployment creates a new ReplicaSet and shrinks the old one to zero. The name of a Pod reveals who it belongs to: in `nginx-fiap-7d4b9c-aaa`, the `7d4b9c` part identifies the ReplicaSet (the version), and the final suffix identifies the Pod. When the middle suffix changes in the middle of a rolling update, you are looking at Pods from a new ReplicaSet.",
      "The ReplicaSet and Deployment YAMLs are almost identical, but day to day we nearly always use the Deployment, precisely because of version control.",
    ],
    pointsTitle: "Key concepts",
    points: [
      {
        t: "ReplicaSet",
        d: "keeps N replicas running at all times; if one goes down, another is born. It selects Pods by label selector.",
        color: "blue",
      },
      {
        t: "Deployment",
        d: "manages ReplicaSets and the version history; it is the object you use in practice.",
        color: "signal",
      },
      {
        t: "template",
        d: "the Pod mold embedded in the Deployment (it is the Pod skeleton from Stage 03).",
        color: "violet",
      },
      {
        t: "Rolling Update",
        d: "gradual version swap, with no downtime.",
        color: "ember",
      },
      {
        t: "Rollback",
        d: "return to a previous revision with `rollout undo`.",
        color: "blue",
      },
      {
        t: "Revision",
        d: "each change to the Deployment template generates a revision in the history, and each revision corresponds to a ReplicaSet.",
        color: "signal",
      },
    ],
    examplesTitle: "The complete Deployment and its life cycle",
    examples: [
      {
        label: "the complete Deployment and its life cycle",
        lang: "yaml",
        code: 'apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: nginx-fiap\nspec:\n  replicas: 3                  # I want 3 copies, always\n  selector:\n    matchLabels:\n      app: nginx-app           # I manage the Pods with this label...\n  template:                    # ...and this is the "mold" of each Pod\n    metadata:\n      labels:\n        app: nginx-app         # must match the selector ↑\n    spec:\n      containers:\n        - name: nginx\n          image: nginx:1.14.2  # changing this version triggers the rolling update\n          ports:\n            - containerPort: 80',
        intro:
          "Create the `etapa05/` folder and save the manifest below in it as `deployment.yaml`.",
        note: "The `template` is literally the Pod skeleton from Stage 03 inside the Deployment. Nothing here is new: the Deployment composes pieces you already know.",
      },
      {
        label: "terminal",
        lang: "sh",
        code: '$ kubectl apply -f deployment.yaml\ndeployment.apps/nginx-fiap created\n$ kubectl get pods\nnginx-fiap-7d4b9c-aaa   1/1   Running\nnginx-fiap-7d4b9c-bbb   1/1   Running\nnginx-fiap-7d4b9c-ccc   1/1   Running\n\n# The ReplicaSet that the Deployment created under the hood\n# (the RS name is the prefix of the Pod names)\n$ kubectl get rs\nNAME                DESIRED   CURRENT   READY   AGE\nnginx-fiap-7d4b9c   3         3         3       30s\n\n# Kill a pod on purpose:\n$ kubectl delete pod nginx-fiap-7d4b9c-aaa\npod "nginx-fiap-7d4b9c-aaa" deleted\n\n# Look again: a NEW pod is already being born to keep the 3 replicas\n$ kubectl get pods\nnginx-fiap-7d4b9c-bbb   1/1   Running\nnginx-fiap-7d4b9c-ccc   1/1   Running\nnginx-fiap-7d4b9c-ddd   0/1   ContainerCreating   ← self-healing',
        note: "In the outputs of this stage, the RESTARTS and AGE columns were omitted to fit on screen, and the name suffixes change on every run (the hashes in the example are illustrative).",
      },
      {
        label: "terminal (2)",
        lang: "sh",
        code: '# Rolling update: swaps the image\n$ kubectl set image deployment/nginx-fiap nginx=nginx:1.16.1\ndeployment.apps/nginx-fiap image updated\n$ kubectl rollout status deployment/nginx-fiap\ndeployment "nginx-fiap" successfully rolled out\n\n# A new ReplicaSet took over; the old one is left with 0 replicas (but still\n# exists, and it is what makes rollback possible)\n$ kubectl get rs\nNAME                DESIRED   CURRENT   READY   AGE\nnginx-fiap-6b5d8f   3         3         3       20s\nnginx-fiap-7d4b9c   0         0         0       2m\n\n# Break it on purpose (an image that does not exist):\n$ kubectl set image deployment/nginx-fiap nginx=nginx:nao-existe\n$ kubectl get pods\nnginx-fiap-6b5d8f-bbb   1/1   Running            ← old ones hold the service\nnginx-fiap-9f8e2a-xyz   0/1   ImagePullBackOff   ← new ones stuck\n\n# A third ReplicaSet appeared, with 1 Pod that never gets ready\n$ kubectl get rs\nNAME                DESIRED   CURRENT   READY   AGE\nnginx-fiap-6b5d8f   3         3         3       1m\nnginx-fiap-7d4b9c   0         0         0       3m\nnginx-fiap-9f8e2a   1         1         0       15s\n\n# Rollback: returns to the revision before the broken one (nginx:1.16.1)\n$ kubectl rollout undo deployment/nginx-fiap\ndeployment.apps/nginx-fiap rolled back\n\n# Recorded revisions (approximate format)\n$ kubectl rollout history deployment/nginx-fiap\nREVISION  CHANGE-CAUSE\n1         <none>\n3         <none>\n4         <none>',
        note: "K8s only shuts down the old Pods when the new ones are ready. Since the broken image never becomes ready, the old ones keep serving and the service stays up. A broken deploy does not take down what was already working. Also note that `undo` goes back to the immediately previous revision, which here used `nginx:1.16.1`, and not to the original `nginx:1.14.2`. The restored revision gets a new number in the history (2 reappears as 4) and reuses its ReplicaSet (`6b5d8f`), while the ReplicaSet of the broken version (`9f8e2a`) goes back to 0 replicas.",
      },
    ],
    commands: [
      {
        cmd: "kubectl get rs",
        note: "lists the ReplicaSets (one per template version)",
      },
      {
        cmd: "kubectl scale deployment <name> --replicas=5",
        note: "manual scaling",
      },
      {
        cmd: "kubectl set image deployment/<name> ctn=img:tag",
        note: "triggers a rolling update",
      },
      {
        cmd: "kubectl rollout status deployment/<name>",
        note: "follows the swap",
      },
      {
        cmd: "kubectl rollout history deployment/<name>",
        note: "lists the revisions",
      },
      {
        cmd: "kubectl rollout undo deployment/<name>",
        note: "performs the rollback",
      },
    ],
    handsOn: [
      "Apply `deployment.yaml` and confirm the 3 pods `Running`. Also run `kubectl get rs` and **observe** the `nginx-fiap-<hash>` ReplicaSet with 3 replicas: the prefix of the Pod names is its name.",
      "Delete a pod by hand (copy a real name from `kubectl get pods`) and run `kubectl get pods` again, quickly. **Observe** the replacement in `ContainerCreating`. You tried to violate the desired state and the cluster corrected it.",
      "Run the rolling update to `nginx:1.16.1` and follow it with `kubectl rollout status`. **Observe** the success message. Run `kubectl get rs` and **observe** that there are now two ReplicaSets: the new one with 3 replicas and the old one with 0. This is why the suffix of the Pod names changed.",
      "Break it on purpose with the image `nginx:nao-existe`. **Observe** in `kubectl get pods` the old pods `Running` holding the service and the new ones in `ImagePullBackOff`, and in `kubectl get rs` a third ReplicaSet with `READY 0`.",
      "Run `kubectl rollout undo deployment/nginx-fiap` and confirm with `kubectl rollout history deployment/nginx-fiap`. **Observe** that the list goes 1, 3, 4: revision 2 became 4. Confirm the current image with `kubectl describe deployment nginx-fiap | grep Image`, which should show `nginx:1.16.1`. You did a rollback in one command.",
      'Clean up: `kubectl delete -f deployment.yaml` (output: `deployment.apps "nginx-fiap" deleted`). The Deployment\'s ReplicaSets and Pods are removed along with it.',
    ],
    tip: 'Do the self-healing test at least once: apply the deployment, delete a pod by hand and watch the replacement be born. That is the moment when the "desired state" model stops being theory.',
    takeaway:
      "Nobody creates a standalone Pod in production: the Deployment guarantees N replicas (self-healing), swaps versions without downtime and goes back in one command, using one ReplicaSet per version.",
    figures: [
      {
        items: [
          {
            src: "/guides/kubernetes/etapa05-rolling-update-1.svg",
            alt: "Rolling update, frame 1: a Service in front of four Pods of the old version, spread across three nodes, with the Deployment managing all of them.",
            caption: "1. Before the update: every Pod runs the old version behind the Service.",
          },
          {
            src: "/guides/kubernetes/etapa05-rolling-update-2.svg",
            alt: "Rolling update, frame 2: a Pod of the new version appears with a new IP, and an old Pod starts to leave.",
            caption: "2. A new Pod comes up with another IP; an old one starts to leave.",
          },
          {
            src: "/guides/kubernetes/etapa05-rolling-update-3.svg",
            alt: "Rolling update, frame 3: another Pod of the new version comes in with a new IP; old Pods are still serving.",
            caption:
              "3. The swap continues one Pod at a time, and the Service keeps serving with the ready Pods.",
          },
          {
            src: "/guides/kubernetes/etapa05-rolling-update-4.svg",
            alt: "Rolling update, frame 4: every Pod runs the new version, with new IPs, behind the same Service.",
            caption:
              "4. Done: every Pod is on the new version, and the Service address did not change.",
          },
        ],
        credit: "Diagram: kubernetes.io, The Kubernetes Authors, CC BY 4.0",
      },
    ],
    handsOnIntro:
      "This is the central exercise of the guide. Take it calmly and observe each state.",
  },
  {
    id: "m6",
    num: "06",
    navTitle: "Volumes",
    tag: "data persistence",
    title: "Volumes, data that outlives the Pod",
    lead: "Pods are ephemeral, and Stage 05 showed how frequent that is: pods are recreated at every rolling update. For a stateless API this is great. For a database it is a disaster. Imagine the e-commerce PostgreSQL Pod being recreated during an update, and all the Black Friday orders disappearing with it, because they were written to the container's filesystem. Real data cannot live inside the container.",
    concept: [
      "Kubernetes solves this with a chain of four concepts: **Volume**, **PersistentVolume (PV)**, **PersistentVolumeClaim (PVC)** and **StorageClass (SC)**.",
      '- The **PVC** is the storage *request*: "I want 1Gi, read and write by one node".',
      "- The **PV** is the *real disk* that fulfills the request (NFS, AWS EBS, hostPath and others).",
      "- The **StorageClass** describes *types* of disk (standard, fast SSD) and lets the cluster create PVs automatically when a PVC asks for them.",
      "The Pod references only the PVC and does not need to know where the disk physically is. This separation lets the same Pod YAML run on Minikube and on AWS, changing only what fulfills the request. On Minikube, the `standard` StorageClass already provisions PVs automatically: you create the PVC and the PV appears.",
      "The most common **volume types**:",
      "- **emptyDir**: born empty together with the Pod and **dies with the Pod**. It serves for temporary files and for sharing data between containers of the same Pod.",
      "- **hostPath**: mounts a directory of the node inside the container. It is useful in development and dangerous in production, because it ties the Pod to that node.",
      "- **persistentVolumeClaim**: the right way for real data, which survives restarts and recreation of the Pod.",
      "The PVC **access modes** define who can mount the volume:",
      "- **ReadWriteOnce (RWO)**: read and write by a single node. It is the typical case for a database.",
      "- **ReadOnlyMany (ROX)**: read-only, by several nodes. It serves static assets.",
      "- **ReadWriteMany (RWX)**: read and write by several nodes. It requires NFS or an equivalent backend.",
    ],
    pointsTitle: "Key concepts",
    points: [
      {
        t: "emptyDir",
        d: "temporary volume that lives and dies with the Pod.",
        color: "blue",
      },
      {
        t: "hostPath",
        d: "node directory mounted in the container; ties the Pod to the node.",
        color: "signal",
      },
      {
        t: "PVC (PersistentVolumeClaim)",
        d: "storage request made by the user.",
        color: "violet",
      },
      {
        t: "PV (PersistentVolume)",
        d: "the disk that fulfills the request.",
        color: "ember",
      },
      {
        t: "StorageClass",
        d: "storage profile that provisions PVs automatically.",
        color: "blue",
      },
      {
        t: "Bound",
        d: "status indicating that the PVC was bound to a PV.",
        color: "signal",
      },
      {
        t: "volumeMounts / volumes",
        d: "in the Pod, `volumes` declares the source and `volumeMounts` defines where it appears inside the container.",
        color: "violet",
      },
    ],
    examplesTitle: "Write, destroy, read back",
    examples: [
      {
        label: "pvc.yaml",
        lang: "yaml",
        code: '# pvc.yaml\napiVersion: v1\nkind: PersistentVolumeClaim\nmetadata:\n  name: meu-pvc\nspec:\n  accessModes:\n    - ReadWriteOnce            # one node reads and writes (typical for a database)\n  resources:\n    requests:\n      storage: 1Gi             # how much disk I want\n# on Minikube, the "standard" StorageClass provisions the PV by itself',
        intro: "Create the `etapa06/` folder and save this stage's manifests in it.",
      },
      {
        label: "pod-com-pvc.yaml",
        lang: "yaml",
        code: "# pod-com-pvc.yaml\napiVersion: v1\nkind: Pod\nmetadata:\n  name: pod-persistente\nspec:\n  containers:\n    - name: app\n      image: nginx:1.14.2\n      volumeMounts:\n        - name: dados\n          mountPath: /dados    # where the volume appears in the container\n  volumes:\n    - name: dados\n      persistentVolumeClaim:   # ← points to the PVC (instead of emptyDir)\n        claimName: meu-pvc",
      },
      {
        label: "terminal",
        lang: "sh",
        code: '$ kubectl apply -f pvc.yaml -f pod-com-pvc.yaml\npersistentvolumeclaim/meu-pvc created\npod/pod-persistente created\n\n# Bound = the PV was created and bound to the request\n$ kubectl get pvc\nNAME      STATUS   VOLUME         CAPACITY   ACCESS MODES\nmeu-pvc   Bound    pvc-3f2a1...   1Gi        RWO\n\n# Write a file to the volume\n$ kubectl exec pod-persistente -- sh -c "echo \'sobrevivi!\' > /dados/teste.txt"\n\n# DESTROY the pod (the PVC still exists)\n$ kubectl delete pod pod-persistente\npod "pod-persistente" deleted\n\n# Recreate the pod and read the file:\n$ kubectl apply -f pod-com-pvc.yaml\npod/pod-persistente created\n$ kubectl exec pod-persistente -- cat /dados/teste.txt\nsobrevivi!            ← the Pod died, the data did not',
        note: "To see the contrast, create a second manifest, `pod-emptydir.yaml`, with **another Pod name** and an `emptyDir` in place of the PVC. Do not edit `pod-com-pvc.yaml` and reapply it: the `spec` of an existing Pod cannot be changed (Kubernetes refuses the change of volumes), so the change only works if the Pod is deleted and created again, or if it is a new file and a new name, as here.",
      },
      {
        label: "pod-emptydir.yaml",
        lang: "yaml",
        code: "# pod-emptydir.yaml\napiVersion: v1\nkind: Pod\nmetadata:\n  name: pod-efemero              # different name from pod-persistente\nspec:\n  containers:\n    - name: app\n      image: nginx:1.14.2\n      volumeMounts:\n        - name: dados\n          mountPath: /dados      # same mount point as the previous example\n  volumes:\n    - name: dados\n      emptyDir: {}               # born empty with the Pod and dies with the Pod",
      },
      {
        label: "terminal (2)",
        lang: "sh",
        code: '$ kubectl apply -f pod-emptydir.yaml\npod/pod-efemero created\n\n# Write the file, destroy the Pod and recreate it from the same YAML\n$ kubectl exec pod-efemero -- sh -c "echo \'vou sumir\' > /dados/teste.txt"\n$ kubectl delete pod pod-efemero\npod "pod-efemero" deleted\n$ kubectl apply -f pod-emptydir.yaml\npod/pod-efemero created\n\n# The file no longer exists: the emptyDir died together with the old Pod\n$ kubectl exec pod-efemero -- cat /dados/teste.txt\ncat: /dados/teste.txt: No such file or directory\ncommand terminated with exit code 1',
      },
    ],
    commands: [
      {
        cmd: "kubectl get pvc",
        note: "lists the volume requests (`Bound` indicates success)",
      },
      {
        cmd: "kubectl get pv",
        note: "lists the cluster's persistent disks",
      },
      {
        cmd: "kubectl delete pvc <name>",
        note: "removes the request. With Minikube's `standard` StorageClass, the corresponding PV is usually deleted along with it, data included (the default reclaim policy is `Delete`; check your cluster's with `kubectl get storageclass`)",
      },
    ],
    handsOn: [
      "Apply the PVC and run `kubectl get pvc`. **Observe** the `STATUS Bound`: the request was fulfilled by an automatically created PV. Confirm with `kubectl get pv`.",
      "Run the complete sequence from the example: write the file, delete the pod, recreate the pod, read the file. **Observe** the `sobrevivi!` come back. This is the PVC contract.",
      "Contrast experiment: save `pod-emptydir.yaml` and repeat the sequence (write, delete, recreate, read). **Observe** the `No such file or directory` at the end: the file vanished. This is the difference between ephemeral and persistent, seen in practice.",
      "Clean up, in this order: `kubectl delete pod pod-persistente pod-efemero` and then `kubectl delete pvc meu-pvc`. With the PVC deleted, `kubectl get pv` should be empty (the PV was removed along with it, as described above).",
    ],
    tip: "Important data always sits behind a PVC. If data vanished after a restart or a recreation, it was almost certainly in `emptyDir` or in the container's own filesystem.",
    takeaway:
      "The PVC is the request, the PV is the disk, the StorageClass describes the disk types, and data that matters always lives behind a PVC.",
  },
  {
    id: "m7",
    num: "07",
    navTitle: "Probes",
    tag: "app health",
    title: "Probes, how the cluster knows your app is alive",
    lead: 'At 3 a.m., your app enters a deadlock. The process is still up, so as far as Kubernetes is concerned everything is `Running`, but no request is answered. The recovery mechanisms you have seen so far act when a process ends or when a Pod disappears; none of them sees a process that is alive but stuck. There is also a similar case: the app has just started, but it is still loading data and should not receive traffic, and the Service is already sending requests to it. Without extra information, the cluster cannot tell "running" from "working".',
    concept: [
      'Before probes, it is worth separating three situations that in everyday talk everyone calls "the app went down", because each one is handled by a different mechanism:',
      "1. **The process inside the container ends** (a crash, out of memory, an unhandled exception). The Pod still exists and the one that reacts is the node's **kubelet**: it restarts the **container inside the same Pod**, according to the Pod's `restartPolicy` (the default is `Always`). The Pod's name and IP do not change, and the `RESTARTS` column goes up. This happens with no probe configured.",
      "1. **The Pod disappears** (someone deleted it, the node went down). The whole Pod ceases to exist and the one that reacts is the **ReplicaSet** (Stage 05), which creates a **new Pod**, with a new name and IP. A standalone Pod, without a ReplicaSet or Deployment, does not come back.",
      "1. **The process is still alive but stuck** (deadlock, infinite loop, exhausted dependency). Nothing ended and no Pod disappeared, so the two previous mechanisms do not notice. Only a **liveness probe** detects it, and when it fails the kubelet restarts the container, as in case 1.",
      "**Probes** are health checks declared in the Pod manifest. The kubelet runs them periodically and acts according to the result.",
      "There are three probes, and the most important point is what happens when each one **fails**:",
      '- **Liveness** asks "is it alive?". If it fails, the kubelet **restarts the container** (inside the same Pod). It is for apps that hang and only come back with a restart.',
      '- **Readiness** asks "is it ready to receive requests?". If it fails, the Pod **leaves the load balancer** (the Service stops sending traffic) **without being restarted**. It is for apps that load data before serving or that are temporarily unavailable.',
      '- **Startup** asks "has it finished initializing?". While it runs, it **holds back the other probes**, preventing liveness from killing a slow app too early.',
      "Each probe can check in three ways:",
      "- **httpGet**: the kubelet makes a GET to an endpoint (for example `/health`) and expects a success status (200 OK). It is the most common. An error status, such as 404 or 500, counts as a failure.",
      "- **tcpSocket**: tests whether the port accepts a connection. It serves services that do not speak HTTP.",
      "- **exec**: runs a command inside the container; exit code 0 means healthy.",
      "Good practices from the lesson: use all three probes together in production; use different endpoints for each probe; start with the default settings and adjust intervals only when the app asks for it; monitor probe failures (for example, with Prometheus), because they are the first sign of trouble.",
    ],
    pointsTitle: "Key concepts",
    points: [
      {
        t: "restartPolicy",
        d: "Pod policy for containers that end (default `Always`); it is what restarts a container that went down, with or without probes.",
        color: "blue",
      },
      {
        t: "Liveness probe",
        d: "failed, the kubelet restarts the container.",
        color: "signal",
      },
      {
        t: "Readiness probe",
        d: "failed, the Pod leaves the load balancer without restarting.",
        color: "violet",
      },
      {
        t: "Startup probe",
        d: "until it passes, the others stay suspended.",
        color: "ember",
      },
      {
        t: "httpGet / tcpSocket / exec",
        d: "the three checking mechanisms.",
        color: "blue",
      },
      {
        t: "periodSeconds",
        d: "how many seconds apart the probe runs.",
        color: "signal",
      },
      {
        t: "failureThreshold",
        d: "how many consecutive failures are tolerated before acting (the default is 3).",
        color: "violet",
      },
      {
        t: "initialDelaySeconds",
        d: "how long to wait before the first check.",
        color: "ember",
      },
    ],
    examplesTitle: "Worked examples",
    examples: [
      {
        label: "a Pod with the three probes",
        lang: "yaml",
        code: "apiVersion: v1\nkind: Pod\nmetadata:\n  name: exemplo-probes\nspec:\n  containers:\n    - name: app\n      image: exemplo:latest\n      ports:\n        - containerPort: 80\n      livenessProbe:           # failed → RESTARTS the container\n        httpGet:\n          path: /health\n          port: 80\n        periodSeconds: 10      # checks every 10s\n        timeoutSeconds: 5\n        failureThreshold: 3    # 3 consecutive failures → restarts (3 is the default)\n      readinessProbe:          # failed → LEAVES the load balancer\n        httpGet:\n          path: /ready         # good practice: separate endpoint\n          port: 80\n        periodSeconds: 5\n      startupProbe:            # holds the others until the app is up\n        httpGet:\n          path: /startup\n          port: 80\n        initialDelaySeconds: 120   # slow app: waits 2min\n        periodSeconds: 30",
        note: "This YAML is illustrative: the `exemplo:latest` image is fictitious. The runnable experiment comes next, and in Stage 09 you will see the probes working on a real image. A caveat about the `startupProbe` in the example: `initialDelaySeconds: 120` is valid, but the most common way to give a slow app time is to multiply `failureThreshold` by `periodSeconds` (for example, 30 attempts every 10 seconds give up to 300 seconds). That way the startupProbe finishes as soon as the app responds, instead of always waiting a fixed delay.",
      },
      {
        label: "liveness-exec.yaml",
        lang: "yaml",
        code: "# liveness-exec.yaml\napiVersion: v1\nkind: Pod\nmetadata:\n  name: liveness-exec\nspec:\n  containers:\n    - name: liveness\n      image: busybox\n      args:                         # the sabotage script:\n        - /bin/sh\n        - -c\n        - touch /tmp/healthy; sleep 30; rm -f /tmp/healthy; sleep 600\n      livenessProbe:\n        exec:\n          command:                  # probe: does the file exist? (exit 0 = healthy)\n            - cat\n            - /tmp/healthy\n        initialDelaySeconds: 5     # waits 5s before the 1st check\n        periodSeconds: 5           # checks every 5s",
        intro:
          'Save the manifest in `etapa07/liveness-exec.yaml`. The idea is to use a busybox container that creates the file `/tmp/healthy`, lives 30 seconds "healthy", deletes the file and keeps running. The liveness probe runs `cat /tmp/healthy`: with the file present, the command exits with 0 (healthy); without the file, it fails. This is case 3 from the list above: the process is still alive (the `sleep 600`), but it stops being healthy.',
      },
      {
        label: "terminal",
        lang: "sh",
        code: '$ kubectl apply -f liveness-exec.yaml\npod/liveness-exec created\n\n# Watch in real time (Ctrl+C to leave).\n# Shortened output: each new line appears tens of seconds apart.\n# The "(Ns ago)" part shows how long ago the last restart was,\n# and not the interval between one restart and the next. The first\n# restart shows up about 45s after the start; the following ones take\n# longer, because the kubelet waits for the container to terminate before recreating it.\n$ kubectl get pods -w\nNAME            READY   STATUS    RESTARTS\nliveness-exec   1/1     Running   0                ← right after the start\nliveness-exec   1/1     Running   1 (2s ago)       ← about 45s later: automatic restart\nliveness-exec   1/1     Running   2 (1s ago)       ← one cycle later, much later: and again...\n\n# Investigate like a professional:\n$ kubectl describe pod liveness-exec\nEvents:\n  Warning  Unhealthy  Liveness probe failed: cat: /tmp/healthy: No such file\n  Normal   Killing    Container liveness failed liveness probe, will be restarted',
        note: "The timeline of the experiment: 30s healthy, the file is deleted, 3 consecutive failures (the default `failureThreshold`), the kubelet restarts the container. Since the script starts over from zero after the restart, the cycle repeats indefinitely, on purpose, so you can observe it. Note that the Pod is always the same (`liveness-exec`): what was restarted was the container. Now, to see the difference from case 1, provoke a crash without any probe:",
      },
      {
        label: "terminal (2)",
        lang: "sh",
        code: '# A container that ends with an error 5 seconds after starting, without probes\n$ kubectl run crash --image=busybox -- /bin/sh -c "sleep 5; exit 1"\npod/crash created\n\n# The kubelet restarts the container by itself (restartPolicy Always), with\n# ever longer intervals between attempts (approximate format)\n$ kubectl get pods\nNAME    READY   STATUS             RESTARTS      AGE\ncrash   0/1     CrashLoopBackOff   2 (20s ago)   50s\n\n$ kubectl describe pod crash\n(...)\n    Last State:     Terminated\n      Reason:       Error\n      Exit Code:    1\n(...)\n# No "Liveness probe failed" event: there is no probe at all, and the\n# container was restarted by the kubelet anyway.',
      },
    ],
    commands: [
      {
        cmd: "kubectl get pods -w",
        note: "follows changes in real time",
      },
      {
        cmd: "kubectl describe pod <name>",
        note: "the Events show probe failures; `Last State` shows why the previous container ended",
      },
    ],
    handsOn: [
      "Apply `liveness-exec.yaml` and run `kubectl get pods -w`. **Observe** the `RESTARTS` column go up by itself: the first restart appears about 45 seconds after the start (30s healthy plus 3 failures spaced 5s apart). Each increment is the kubelet restarting a container that stopped passing the check.",
      "In another terminal, run `kubectl describe pod liveness-exec`. **Observe** in the Events the pair `Warning Unhealthy` followed by `Normal Killing`. Learn to recognize this pair: in production, it is the diagnosis of a failing probe.",
      "Run the crash experiment (`kubectl run crash ...`) and compare. **Observe** that `RESTARTS` also goes up, but `describe` shows `Last State: Terminated` with `Exit Code: 1` and no `Liveness probe failed` event. This is case 1, handled by the kubelet without a probe; the one in step 2 is case 3, which only liveness solves.",
      "Clean up: `kubectl delete pod liveness-exec crash`.",
    ],
    tip: "`Running` does not mean healthy. An app can be running and stuck in a deadlock. This is exactly why probes exist.",
    takeaway:
      "A process that crashes is restarted by the kubelet, a Pod that disappears is recreated by the ReplicaSet, and a process that is alive but stuck is detected only by liveness: a failed liveness probe restarts the container, a failed readiness probe takes the Pod out of the load balancer without restarting, and a startup probe holds back both until the app finishes starting.",
  },
  {
    id: "m8",
    num: "08",
    navTitle: "Autoscaling (HPA)",
    tag: "automatic scaling",
    title: "HPA, automatic scaling based on metrics",
    lead: "Go back to the e-commerce site from Stage 01: Black Friday has arrived. You already know how to scale manually with `kubectl scale --replicas=...` (Stage 05). Staying on call at the terminal adjusting replicas at every traffic peak, including at 2 a.m., is not viable. The cluster should measure the load and adjust the number of replicas by itself.",
    concept: [
      "The **Horizontal Pod Autoscaler (HPA)** monitors Pod metrics (CPU, memory and others) and adjusts the number of replicas between a minimum and a maximum that you define.",
      "How it works: the HPA compares the current utilization of the Pods with the configured **target** (for example, keeping average CPU at 70%). If utilization goes above the target, it creates replicas, up to the maximum. If it drops, it removes replicas, down to the minimum, saving resources. The **scale down is deliberately slow** (about 5 minutes of stability) to avoid constant oscillation in the face of quick load variations.",
      "Once an HPA controls a Deployment, it is the HPA that decides the number of replicas within the range `minReplicas` to `maxReplicas`. The `replicas` value written in the Deployment manifest holds only until the HPA acts: if it is above the floor and there is no load, the HPA reduces it after a few minutes (you will see this in Stage 09).",
      "**Which metrics the HPA can use.** CPU and memory are read natively, through the metrics-server. The others require additional components installed in the cluster: custom metrics from your app (requests per second, queue size), external metrics (for example, coming from Prometheus) and disk I/O need a custom or external metrics adapter. Without that adapter, only CPU and memory are available. The right metric depends on the app's profile: a CPU-heavy app scales by CPU; one that consumes a lot of RAM scales by memory.",
      "Two prerequisites are often forgotten:",
      "1. The cluster needs the **metrics-server** to read CPU and memory. On Minikube: `minikube addons enable metrics-server`.",
      '1. The container **must declare `resources.requests.cpu`**, because "70% CPU" means 70% **of what the Pod requested**. Without requests, the HPA shows `<unknown>` and does not scale.',
    ],
    pointsTitle: "Key concepts",
    points: [
      {
        t: "HPA",
        d: "controller that adjusts the number of replicas of a Deployment according to metrics.",
        color: "blue",
      },
      {
        t: "metrics-server",
        d: "component that collects CPU and memory from the Pods; prerequisite of the HPA.",
        color: "signal",
      },
      {
        t: "resources.requests",
        d: "amount of resource the container declares it needs; basis of the percentage calculation.",
        color: "violet",
      },
      {
        t: "resources.limits",
        d: "ceiling of resource the container may consume.",
        color: "ember",
      },
      {
        t: "millicore (m)",
        d: "CPU unit; `100m` equals 0.1 CPU.",
        color: "blue",
      },
      {
        t: "minReplicas / maxReplicas",
        d: "floor and ceiling of replicas; the HPA works within that range.",
        color: "signal",
      },
      {
        t: "averageUtilization",
        d: "average usage percentage, relative to `requests`, that the HPA tries to maintain.",
        color: "violet",
      },
      {
        t: "Metrics adapter",
        d: "extra component needed for metrics other than CPU or memory.",
        color: "ember",
      },
    ],
    examplesTitle: "Deployment, HPA, Service and load test",
    examples: [
      {
        label: "deployment.yaml",
        lang: "yaml",
        code: '# deployment.yaml\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: nginx-hpa\nspec:\n  replicas: 1                  # starts with 1; the HPA takes over from here\n  selector:\n    matchLabels:\n      app: nginx-hpa\n  template:\n    metadata:\n      labels:\n        app: nginx-hpa\n    spec:\n      containers:\n        - name: nginx\n          image: nginx:1.14.2\n          resources:           # WITHOUT requests the HPA does not calculate %\n            requests:\n              cpu: "100m"      # 100 millicores = 0.1 CPU\n            limits:\n              cpu: "200m"',
        intro:
          "Create the `etapa08/` folder and save the three manifests in it (the names `deployment.yaml` and `service.yaml` also appear in Stage 09, hence the separation by folder).",
      },
      {
        label: "hpa.yaml",
        lang: "yaml",
        code: "# hpa.yaml\napiVersion: autoscaling/v2\nkind: HorizontalPodAutoscaler\nmetadata:\n  name: nginx-hpa\nspec:\n  scaleTargetRef:              # WHAT the HPA controls\n    apiVersion: apps/v1\n    kind: Deployment\n    name: nginx-hpa\n  minReplicas: 1               # floor\n  maxReplicas: 10              # ceiling\n  metrics:\n    - type: Resource\n      resource:\n        name: cpu\n        target:\n          type: Utilization\n          averageUtilization: 70   # target: average CPU at 70%",
        note: "So that the load generator can find the app by name, also create a ClusterIP Service called `nginx-hpa`, following the same pattern as Stage 04:",
      },
      {
        label: "service.yaml",
        lang: "yaml",
        code: "# service.yaml\napiVersion: v1\nkind: Service\nmetadata:\n  name: nginx-hpa              # internal hostname used by the generator\nspec:\n  type: ClusterIP              # internal traffic only (golden rule of Stage 04)\n  selector:\n    app: nginx-hpa             # matches the label of the Deployment's pods\n  ports:\n    - port: 80\n      targetPort: 80",
      },
      {
        label: "terminal",
        lang: "sh",
        code: "# Prerequisite: metrics-server\n$ minikube addons enable metrics-server\n💡  metrics-server is an addon maintained by Kubernetes. (...)\n🌟  The 'metrics-server' addon is enabled\n\n$ kubectl apply -f deployment.yaml -f hpa.yaml -f service.yaml\ndeployment.apps/nginx-hpa created\nhorizontalpodautoscaler.autoscaling/nginx-hpa created\nservice/nginx-hpa created\n\n# Generate load from inside the cluster:\n$ kubectl run gerador --image=busybox -it --rm -- /bin/sh -c \\\n  \"while true; do wget -q -O- http://nginx-hpa; done\"\n\n# In ANOTHER terminal, watch:\n$ kubectl get hpa -w\nNAME        TARGETS         MINPODS  MAXPODS  REPLICAS\nnginx-hpa   cpu: 0%/70%     1        10       1\nnginx-hpa   cpu: 152%/70%   1        10       1\nnginx-hpa   cpu: 152%/70%   1        10       3    ← scaled by itself\n\n# Raw metric that feeds the HPA (approximate format):\n$ kubectl top pods\nNAME                        CPU(cores)   MEMORY(bytes)\nnginx-hpa-5d8f7b6c4-abcde   152m         3Mi\n\n# Stop the load (Ctrl+C) and wait ~5min: the replicas shrink back.",
        note: 'In production, tools such as K6 and JMeter run this load test in a controlled way. **Plan B, if TARGETS does not go above 70%.** Nginx serving a static page is too efficient and a single generator may not produce enough load. There are three ways out, from the simplest to the most faithful to the official Kubernetes tutorial: • Run 2 or 3 generators in parallel: repeat the `kubectl run` in other terminals, changing the name (`gerador2`, `gerador3`). • Reduce `requests.cpu` to `"50m"` in the Deployment and reapply. The same consumption now counts double in percentage. • Swap the image for `registry.k8s.io/hpa-example` (the php-apache from the official tutorial, which consumes CPU on every request and was made for this demonstration).',
      },
    ],
    commands: [
      {
        cmd: "minikube addons enable metrics-server",
        note: "prerequisite of the HPA",
      },
      {
        cmd: "kubectl get hpa -w",
        note: "follows the HPA reacting to the load",
      },
      {
        cmd: "kubectl top pods",
        note: "CPU and memory per pod",
      },
      {
        cmd: "kubectl autoscale deployment <n> --cpu-percent=70 --min=1 --max=10",
        note: "creates an HPA imperatively",
      },
    ],
    handsOn: [
      "Enable the metrics-server and apply the three YAMLs (Deployment, HPA, Service). Run `kubectl get hpa` and **observe** the targets. If `<unknown>` appears, wait about 1 minute: the metrics-server needs to collect the first reading.",
      "Start the load generator in one terminal and run `kubectl get hpa -w` in another. **Observe** the CPU percentage go above 70% and then the `REPLICAS` column go up. If the percentage stalls below the target, use plan B. Confirm with `kubectl get pods`: new pods were born without any command from you.",
      "Stop the load (Ctrl+C) and keep watching. **Observe** that the replicas take about 5 minutes to shrink. This slowness is deliberate.",
      "Run `kubectl top pods` during the test to see the raw metric that feeds the HPA.",
      "Clean up: `kubectl delete -f deployment.yaml -f hpa.yaml -f service.yaml`. The `gerador` pod was created with `--rm` and deleted itself when you interrupted the load; confirm with `kubectl get pods`. Keep the metrics-server enabled, because Stage 09 also uses the HPA.",
    ],
    tip: "If `kubectl get hpa` shows `<unknown>` in the targets, there are two possible causes: the metrics-server is not active or the container did not declare `resources.requests`.",
    takeaway:
      "The HPA is the desired state applied to scaling: you define a target, a floor and a ceiling, but without the metrics-server and without resources.requests it sees nothing, and only CPU and memory come ready (the rest requires an adapter).",
    figures: [
      {
        items: [
          {
            src: "/guides/kubernetes/etapa08-hpa.svg",
            alt: "The Horizontal Pod Autoscaler adjusts the scale of a Deployment, which in turn manages Pods 1 to N.",
            caption:
              "The HPA does not create Pods: it changes the Deployment's replica count, and the Deployment creates or removes the Pods. (RC, in the diagram, is the old ReplicationController; in this guide the target is always a Deployment.)",
          },
        ],
        credit: "Diagram: kubernetes.io, The Kubernetes Authors, CC BY 4.0",
      },
    ],
    handsOnIntro: "The final experiment of this part, which joins Deployment, Service and HPA.",
  },
  {
    id: "m9",
    num: "09",
    navTitle: "Professional example",
    tag: "bonus · real docker hub image",
    title: "Bonus, a professional application with a real Docker Hub image",
    lead: "The eight previous stages used nginx on purpose: a simple image, with no noise, so you could learn the mechanics of each piece. But a real deployment is not made of isolated pieces. Three questions only appear when you put everything together: how the pieces fit together in a real app, how to test probes in an application with real health endpoints (instead of the illustrative YAML from Stage 07) and which pieces to use, or leave out, for that specific app.",
    concept: [
      "This stage builds a complete deployment with the `stefanprodan/podinfo` image from Docker Hub (`docker.io/stefanprodan/podinfo`). Podinfo is an open source project designed to be used in demonstrations. It exposes real `/healthz` and `/readyz`, accepts configuration through environment variables (`PODINFO_UI_MESSAGE`, `PODINFO_UI_COLOR`) and has a `/panic` endpoint that **ends the process** on purpose.",
      "That last point deserves care, because `/panic` and liveness test different things. When the podinfo process ends, the one that restarts the container is the **kubelet, through the Pod's `restartPolicy`** (case 1 of Stage 07). This would happen even if the manifest had no `livenessProbe` at all. Liveness only comes into play in case 3, a process that is alive but does not respond in a healthy way. That is why this exercise uses `/panic` to demonstrate the restart of a container that went down, and tests liveness for real by pointing the probe at a path that does not exist, so that the endpoint starts returning 404 and the probe fails.",
      "The four manifests fit together through the label `app: podinfo`, the same mechanism that stitched the whole guide together (Stage 03):",
      "- The **ConfigMap** injects the variables via `envFrom` (Stage 04).",
      "- The **Deployment** declares 3 replicas (Stage 05), `resources.requests` (required for the HPA, Stage 08) and two probes: liveness on `/healthz` and readiness on `/readyz` (Stage 07).",
      "- The **Service** is NodePort because here podinfo is the system's entry point, applying the golden rule of Stage 04.",
      "- The **HPA** reads the CPU declared in the Deployment and scales between 2 and 8 replicas (Stage 08).",
      "There is an interaction between the Deployment and the HPA that is worth knowing: the Deployment declares `replicas: 3`, but the HPA has `minReplicas: 2`. While there is some load, or in the first minutes, you will see 3 replicas. Without load, after about 5 minutes (the stability window from Stage 08), the HPA reduces the Deployment to 2. From then on, the one in charge of the number of replicas is the HPA, and the manifest's `replicas: 3` stops applying. In production, it is common to omit `replicas` from the Deployment when an HPA exists, precisely to avoid this dispute.",
      "What was **not** included also matters. Not every piece you learned fits every app.",
      "- The **startupProbe** (Stage 07) was left out because podinfo starts in fractions of a second. Using a piece just because it exists in the manual adds configuration with no benefit.",
      "- The **PVC** (Stage 06) was also left out of the Deployment, for a technical reason. The problem: the PVC from Stage 06 uses `ReadWriteOnce`, and that mode cannot be shared among replicas on different nodes. On Minikube (a single node), attaching `volumes.persistentVolumeClaim` to a Deployment with several replicas may even start without complaint, but on a cluster with several nodes the extra replicas get stuck, competing for the same disk (the event shows up as `FailedAttachVolume`). The ways out, if the app needed state: a truly shared cache (podinfo has the `--cache-server` flag to talk to a Redis) or one disk per replica, with a StatefulSet and `volumeClaimTemplates`, a subject for the advanced module. Stage 06 remains valid: it is the right answer for its scenario, a single Pod with data, like a database.",
    ],
    pointsTitle: "Key concepts",
    points: [
      {
        t: "ConfigMap with envFrom",
        d: "external configuration injected as variables (Stage 04).",
        color: "blue",
      },
      {
        t: "Deployment with 3 replicas",
        d: "self-healing and readiness for a rolling update (Stage 05).",
        color: "signal",
      },
      {
        t: "Real probes",
        d: "liveness on `/healthz`, readiness on `/readyz` (Stage 07).",
        color: "violet",
      },
      {
        t: "restartPolicy",
        d: "what restarts a container whose process ended (`/panic`), unrelated to liveness.",
        color: "ember",
      },
      {
        t: "NodePort Service",
        d: "the app is the entry point, so it is exposed (Stage 04).",
        color: "blue",
      },
      {
        t: "HPA between 2 and 8 replicas",
        d: "scales by the CPU declared in `requests` and, without load, reduces the 3 initial replicas to 2 (Stage 08).",
        color: "signal",
      },
      {
        t: "Fixed version tag",
        d: "using `podinfo:6.14.1` instead of `latest`, so that the deploy is reproducible.",
        color: "violet",
      },
      {
        t: "rollout restart",
        d: "command that recreates the Pods of a Deployment, needed for them to read a changed ConfigMap.",
        color: "ember",
      },
      {
        t: "Endpoints",
        d: "list of Pods that are actually receiving traffic from a Service; Pods with a failing readiness leave it.",
        color: "blue",
      },
    ],
    examplesTitle: "The four manifests and the complete test",
    examples: [
      {
        label: "configmap.yaml",
        lang: "yaml",
        code: '# configmap.yaml\napiVersion: v1\nkind: ConfigMap\nmetadata:\n  name: podinfo-config\ndata:\n  PODINFO_UI_MESSAGE: "olá do pitstop.dev!"   # appears on the app screen\n  PODINFO_UI_COLOR: "#34d399"                 # banner color in the UI',
        intro: "Create the `etapa09/` folder and save the four manifests in it.",
        note: "It is the same mechanism as Stage 04 (`envFrom`), but here the keys are variables that podinfo really reads to build its own interface.",
      },
      {
        label: "deployment.yaml",
        lang: "yaml",
        code: '# deployment.yaml\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: podinfo\nspec:\n  replicas: 3                        # real self-healing, Stage 05 (the HPA may reduce to 2)\n  selector:\n    matchLabels:\n      app: podinfo\n  template:\n    metadata:\n      labels:\n        app: podinfo                 # matches the selector ↑ and the Service\n    spec:\n      containers:\n        - name: podinfo\n          image: stefanprodan/podinfo:6.14.1  # real Docker Hub image, fixed version (never "latest" in production)\n          ports:\n            - containerPort: 9898\n          envFrom:                   # injects the whole ConfigMap (Stage 04)\n            - configMapRef:\n                name: podinfo-config\n          resources:                 # required for the HPA to calculate %, Stage 08\n            requests:\n              cpu: "100m"\n              memory: "64Mi"\n            limits:\n              cpu: "200m"\n              memory: "128Mi"\n          livenessProbe:             # "is it alive?" failed → restarts the container, Stage 07\n            httpGet:\n              path: /healthz\n              port: 9898\n            periodSeconds: 10\n            failureThreshold: 3\n          readinessProbe:            # "ready for traffic?" failed → leaves the Service\n            httpGet:\n              path: /readyz\n              port: 9898\n            periodSeconds: 5',
        note: "This manifest has no `startupProbe` and no `volumes`, on purpose, for the reasons explained above. A professional manifest declares what the app needs, not everything the course taught.",
      },
      {
        label: "service.yaml",
        lang: "yaml",
        code: "# service.yaml\napiVersion: v1\nkind: Service\nmetadata:\n  name: podinfo\nspec:\n  type: NodePort                # entry point here = golden rule of Stage 04\n  selector:\n    app: podinfo                # finds the Pods by label, always\n  ports:\n    - port: 9898\n      targetPort: 9898\n      nodePort: 30898",
      },
      {
        label: "hpa.yaml",
        lang: "yaml",
        code: "# hpa.yaml\napiVersion: autoscaling/v2\nkind: HorizontalPodAutoscaler\nmetadata:\n  name: podinfo\nspec:\n  scaleTargetRef:\n    apiVersion: apps/v1\n    kind: Deployment\n    name: podinfo\n  minReplicas: 2                 # production does not go below 2, even without load\n  maxReplicas: 8\n  metrics:\n    - type: Resource\n      resource:\n        name: cpu\n        target:\n          type: Utilization\n          averageUtilization: 70",
        note: "The tests below follow the order of the exercise. They were written to work both with 3 replicas (in the first minutes) and with 2 (after the HPA reduces them); the points where the number matters are indicated.",
      },
      {
        label: "terminal",
        lang: "sh",
        code: '# 1) Applies the 4 manifests at once\n$ kubectl apply -f configmap.yaml -f deployment.yaml -f service.yaml -f hpa.yaml\nconfigmap/podinfo-config created\ndeployment.apps/podinfo created\nservice/podinfo created\nhorizontalpodautoscaler.autoscaling/podinfo created\n\n# 2) Wait for the replicas to be Running and the HPA to leave <unknown> (shortened output)\n$ kubectl get pods,hpa\nNAME                           READY   STATUS    RESTARTS   AGE\npod/podinfo-7f9c6d-abc         1/1     Running   0          1m\npod/podinfo-7f9c6d-def         1/1     Running   0          1m\npod/podinfo-7f9c6d-ghi         1/1     Running   0          1m\n\nNAME                                          REFERENCE            TARGETS       MINPODS   MAXPODS   REPLICAS   AGE\nhorizontalpodautoscaler.autoscaling/podinfo   Deployment/podinfo   cpu: 3%/70%   2         8         3          1m\n\n# 3) Load balancing. In one terminal, keep the tunnel open:\n$ minikube service podinfo --url\nhttp://127.0.0.1:53412   ← do not close this terminal (it is the tunnel)\n\n# In ANOTHER terminal, five requests in a row (use the URL your terminal showed).\n# Each request opens a new connection, so the Service may pick different replicas:\n$ for i in 1 2 3 4 5; do curl -s http://127.0.0.1:53412 | grep hostname; done\n  "hostname": "podinfo-7f9c6d-abc",\n  "hostname": "podinfo-7f9c6d-ghi",\n  "hostname": "podinfo-7f9c6d-abc",\n  "hostname": "podinfo-7f9c6d-def",\n  "hostname": "podinfo-7f9c6d-ghi",\n\n# 4) Production gotcha: changing the ConfigMap does NOT restart the Pods by itself.\n#    Edit configmap.yaml (change the message to "mensagem nova") and reapply:\n$ kubectl apply -f configmap.yaml\nconfigmap/podinfo-config configured\n$ kubectl exec deploy/podinfo -- env | grep MESSAGE\nPODINFO_UI_MESSAGE=olá do pitstop.dev!   ← still the OLD value\n\n$ kubectl rollout restart deployment/podinfo\ndeployment.apps/podinfo restarted\n$ kubectl rollout status deployment/podinfo\ndeployment "podinfo" successfully rolled out\n$ kubectl exec deploy/podinfo -- env | grep MESSAGE\nPODINFO_UI_MESSAGE=mensagem nova         ← only now do the Pods read the new value\n\n# 5) Process crash: restart by the kubelet (restartPolicy), NOT by liveness.\n#    We save the name of one Pod so we always talk to the same one.\n$ POD=$(kubectl get pods -l app=podinfo -o name | head -n 1)\n$ kubectl exec $POD -- curl -s localhost:9898/panic\n$ kubectl get pods -w\nNAME                 READY   STATUS    RESTARTS      AGE\npodinfo-7f9c6d-abc   1/1     Running   1 (4s ago)    3m   ← same Pod, container restarted\n\n$ kubectl describe $POD\n(...)\n    Last State:     Terminated\n      Reason:       Error\n      Exit Code:    (value other than 0)\n(...)\n# No "Liveness probe failed" appears in the Events: the process\n# ended, and the kubelet solves that without needing a probe.\n\n# 6) Real liveness: point the probe at a path that does not exist (404)\n$ kubectl patch deployment podinfo --type=json \\\n  -p=\'[{"op":"replace","path":"/spec/template/spec/containers/0/livenessProbe/httpGet/path","value":"/nao-existe"}]\'\ndeployment.apps/podinfo patched\n\n# The new Pods start and pass readiness (/readyz is still valid), but\n# about 30 seconds later (3 consecutive failures, every 10s) RESTARTS starts going up.\n# During the failure, the STATUS may alternate between Running and CrashLoopBackOff\n# (the kubelet waits an increasing interval before each new restart); this is expected:\n$ kubectl get pods -w\n\n$ kubectl describe pods -l app=podinfo\nEvents:\n  Warning  Unhealthy  Liveness probe failed: HTTP probe failed with statuscode: 404\n  Normal   Killing    Container podinfo failed liveness probe, will be restarted\n\n# Restore the original probe: reapplying the manifest brings back the /healthz path.\n# Note: the apply also sets replicas back to 3 (the manifest value);\n# if there is no load, the HPA reduces it to 2 again after about 5 minutes.\n$ kubectl apply -f deployment.yaml\ndeployment.apps/podinfo configured\n\n# Wait for the swap to finish BEFORE the next step. Without that, the "head -n 1"\n# in step 7 may pick an old Pod that is still terminating.\n$ kubectl rollout status deployment/podinfo\ndeployment "podinfo" successfully rolled out\n\n# 7) Real readiness: turn off /readyz of ONE Pod without killing the process\n$ POD=$(kubectl get pods -l app=podinfo -o name | head -n 1)\n$ kubectl exec $POD -- curl -s -X POST localhost:9898/readyz/disable\n\n# Wait about 15 seconds (periodSeconds 5 x 3 failures) and compare:\n$ kubectl get pods\nNAME                 READY   STATUS    RESTARTS   AGE\npodinfo-7f9c6d-abc   0/1     Running   0          6m   ← Running, but out of the load balancer\npodinfo-7f9c6d-def   1/1     Running   0          6m\n\n$ kubectl get endpoints podinfo\nNAME      ENDPOINTS           AGE\npodinfo   10.244.0.6:9898     6m   ← 1 IP (with 2 replicas); with 3 replicas it would be 2 IPs\n\n# Optional: puts the Pod back in the load balancer\n$ kubectl exec $POD -- curl -s -X POST localhost:9898/readyz/enable',
        note: "Two remarks about the test. `curl` is used instead of `wget` because it is what the official podinfo image has installed. And if `/panic` does not bring the process down the first time, repeat it: the response sometimes arrives fragmented before the process actually dies. A remark about the browser: if you open the URL from step 3 in the browser and reload, it is common for the hostname **not** to change on every reload. The browser reuses the open HTTP connection, and the Service's balancing happens per connection, not per request. The `curl` loop, which opens a new connection on every turn, is the reliable test. The distribution is also random, not alternating: consecutive repetitions may appear.",
      },
    ],
    commands: [
      {
        cmd: "kubectl apply -f a.yaml -f b.yaml -f c.yaml -f d.yaml",
        note: "applies several manifests at once",
      },
      {
        cmd: "kubectl rollout restart deployment/<name>",
        note: "forces the Pods to read a ConfigMap that changed",
      },
      {
        cmd: "kubectl exec deploy/<name> -- <command>",
        note: "runs in a Pod of the Deployment without needing to know the exact name",
      },
      {
        cmd: "kubectl patch deployment <name> --type=json -p='[...]'",
        note: "changes a field of the Deployment without editing the file",
      },
      {
        cmd: "kubectl get endpoints <service>",
        note: "shows who is actually receiving traffic right now (affected by readiness)",
      },
    ],
    handsOn: [
      "Save the four YAMLs in `etapa09/` (`configmap.yaml`, `deployment.yaml`, `service.yaml`, `hpa.yaml`) and apply them with a single `kubectl apply` pointing to the four files.",
      "Run `kubectl get pods,hpa` until you see the pods `Running` (3 at the start) and the HPA with a real CPU value (not `<unknown>`). If it gets stuck, confirm that the Stage 08 metrics-server is still active. Remember that, without load, the HPA will reduce the 3 replicas to 2 in about 5 minutes; this is expected, and the following steps work with either number.",
      "Run `minikube service podinfo --url`, keep that terminal open and, in another, run the loop `for i in 1 2 3 4 5; do curl -s <URL> | grep hostname; done`. **Observe** more than one hostname in the output. If you prefer the browser, know that it usually reuses the connection and may always show the same hostname.",
      "Reproduce the ConfigMap gotcha: edit the message in `configmap.yaml`, apply it with `kubectl apply -f configmap.yaml`, confirm that `kubectl exec ... env` still shows the old value and only then run `kubectl rollout restart deployment/podinfo`. Confirm the change again. (You can also use `kubectl edit configmap podinfo-config`, which opens the system's default editor, usually vi; editing the file and reapplying is simpler and keeps the YAML versioned as the source of truth.)",
      "Provoke a crash with `curl .../panic` and follow `kubectl get pods -w` until you see `RESTARTS` go up by itself, without you restarting anything. **Observe** with `kubectl describe` that the previous container is `Terminated` with a nonzero exit code and that there is no liveness event: the one that restarted it was the kubelet, through the `restartPolicy`.",
      "Test liveness for real: change the probe path to `/nao-existe` with `kubectl patch`, wait about 30 seconds and **observe** `RESTARTS` go up (the status may alternate with `CrashLoopBackOff` between one restart and the next, which is expected) and, in `describe`, the events `Liveness probe failed: HTTP probe failed with statuscode: 404` and `Killing`. Restore with `kubectl apply -f deployment.yaml` and run `kubectl rollout status deployment/podinfo`, waiting for the `successfully rolled out` message before step 7, so that `head -n 1` does not pick an old Pod that is still terminating. Know that this `apply` sets `replicas` back to 3; the HPA reduces it to 2 again if there is no load.",
      "Turn off the readiness of one Pod with `curl -X POST .../readyz/disable` and, after about 15 seconds, confirm with `kubectl get pods` (`READY 0/1`, `RESTARTS` unchanged) and `kubectl get endpoints podinfo` that this Pod left the list, without being restarted. With 2 replicas, 1 IP remains; with 3, 2 remain.",
      "Finish by generating load as in Stage 08 (the same busybox generator against `http://podinfo:9898`) and **observe** the HPA scale this Deployment by itself.",
      "Clean up: `kubectl delete -f configmap.yaml -f deployment.yaml -f service.yaml -f hpa.yaml`. Close the `minikube service` terminal with Ctrl+C. If you want to shut the lab down, `minikube stop`.",
    ],
    tip: "The ConfigMap gotcha is a common mistake: editing the ConfigMap restarts nothing by itself (unless something like a Reloader takes care of it). In production, the command after applying a new configuration is almost always `kubectl rollout restart deployment/<name>`.",
    takeaway:
      "A professional manifest is not the sum of everything you learned: it is the choice of what the app needs (ConfigMap, replicas, real probes, Service, HPA) and the conscious refusal of what it does not need (startupProbe on a fast app, PVC on a Deployment with several replicas); and a process crash is handled by the kubelet, while only a probe that fails proves liveness.",
    handsOnIntro:
      "In this exercise you build the complete deployment, provoke controlled failures and confirm each behavior. The command blocks for each step are in the example above.",
  },
];

export const CHECKLIST: ChecklistGroup[] = [
  {
    title: "Stage 01: Motivation and setup",
    items: [
      "I can explain the difference between a container and a VM and why the container is lighter.",
      "I started Minikube and saw the `Ready` node in `kubectl get nodes`.",
      'I know what "desired state" means and can give an example.',
    ],
  },
  {
    title: "Stage 02: kubectl and the API",
    items: [
      "I created an imperative pod with `kubectl run` and saw it reach `Running`.",
      "I provoked an `ImagePullBackOff` on purpose and found the cause in the Events of `describe`.",
      "I can recite the debugging flow: get, describe, logs.",
      "I can explain the path of a command: kubeconfig, API Server, response.",
    ],
  },
  {
    title: "Stage 03: Cluster, Pods and labels",
    items: [
      "I can state the role of master, worker, etcd, kubelet, kube-proxy and API Server.",
      "I wrote a Pod YAML from scratch following apiVersion + kind + metadata + spec.",
      "I filtered pods with `-l` and can explain when to use a label and when to use an annotation.",
    ],
  },
  {
    title: "Stage 04: Services and ConfigMap",
    items: [
      "I exposed a pod via NodePort and opened the page in the browser with `minikube service --url`.",
      "I deleted the pod, saw the Service left without endpoints (`kubectl get endpoints`) and saw access return when I recreated the pod.",
      "I can say which Service type to use for an internal database, a test on Minikube and production in the cloud.",
      "I injected a ConfigMap as environment variables, confirmed with `kubectl exec -- env` and can explain why changing the ConfigMap does not change the variables of a running Pod.",
    ],
  },
  {
    title: "Stage 05: ReplicaSets and Deployments",
    items: [
      "I deleted a pod of a Deployment and saw the replacement be born by itself (self-healing).",
      "I did a rolling update, broke a deploy on purpose and went back with `rollout undo`.",
      "I used `kubectl get rs` to see one ReplicaSet per version and can explain why the suffix of the Pod names changes on a version swap.",
      "I can explain why the old pods hold the service when the new image fails.",
    ],
  },
  {
    title: "Stage 06: Volumes",
    items: [
      "I can explain the chain PVC (request), PV (disk), StorageClass (disk types).",
      "I wrote a file to a PVC, destroyed the pod, recreated it and read the file back.",
      "I repeated the test with `emptyDir` (in a Pod with another name) and saw the file vanish.",
      "I can say when to use emptyDir, hostPath and persistentVolumeClaim.",
    ],
  },
  {
    title: "Stage 07: Probes",
    items: [
      "I can say what happens when each probe fails (liveness, readiness, startup).",
      "I can tell the three cases apart: process crash (the kubelet restarts the container), Pod that disappears (the ReplicaSet creates a new Pod) and process alive but stuck (only liveness detects it).",
      "I ran the liveness-exec experiment and saw the RESTARTS column go up by itself, with the pair `Unhealthy` and `Killing` in the Events.",
      "I can explain why `Running` does not mean healthy.",
    ],
  },
  {
    title: "Stage 08: HPA",
    items: [
      "I can state the two prerequisites of the HPA (metrics-server and resources.requests).",
      "I can say which metrics come ready (CPU and memory) and which require an adapter.",
      "I generated load and saw the HPA increase the replicas without any command from me.",
      "I can explain why the scale down takes about 5 minutes.",
    ],
  },
  {
    title: "Stage 09: Professional application",
    items: [
      "I applied the four podinfo manifests and saw the replicas `Running` with the HPA reading the CPU.",
      "I reproduced the ConfigMap gotcha and solved it with `rollout restart`.",
      "I provoked a crash with `/panic` and can explain that the restart was done by the kubelet (restartPolicy), not by liveness.",
      "I provoked a real liveness failure (probe on a nonexistent path, 404) and saw the events `Liveness probe failed` and `Killing`.",
      "I restored the probe with `kubectl apply` and waited for `rollout status` to finish before moving on.",
      "I took a Pod out of the Service with `/readyz/disable` and confirmed with `kubectl get endpoints` and `READY 0/1`, with no restart.",
      "I can explain why the HPA reduces the 3 replicas to 2 and why the startupProbe and the PVC were left out of this Deployment.",
    ],
  },
  {
    title: "",
    items: [],
    outro:
      "**Next steps:** with all items checked, repeat the exercises on one of the platforms listed in the previous section, this time without consulting the guide. The next topic is the advanced module, where the StatefulSet mentioned in Stage 09 appears.",
  },
];

export const NOTES: string[] = [
  "This block gathers details that help you read the examples safely. Nothing here changes the path of the exercises; they are clarifications about behaviors that tend to raise questions.",
  "**About what you will see in the terminal**",
  "**Example outputs.** The outputs shown are typical formats. Pod names, ReplicaSet hashes, IPs, ages and columns vary with the Kubernetes version and the environment. Compare the structure, not the exact text. The `rollout history` and `kubectl top` outputs are approximate, and the `get pods -w` outputs are shortened: in a real environment, the lines appear with longer intervals than the example suggests.",
  "**API path (Stage 02).** `kubectl get pods` in the `default` namespace makes `GET /api/v1/namespaces/default/pods`. The path `/api/v1/pods` lists pods from all namespaces. `-v=6` shows the actual request, and the format of the log line varies between kubectl versions.",
  "**kubectl version before the cluster (Stage 01).** `kubectl version` without `--client` tries to query the server. Before `minikube start` this ends in a connection error, which is expected and does not indicate a faulty installation.",
  "**`kubectl get endpoints` (Stages 04 and 09).** In recent Kubernetes versions, the command may display a deprecation warning in favor of EndpointSlices. It remains useful for the exercises; the alternative is `kubectl get endpointslices`.",
  "**About behaviors that surprise**",
  "**Rollback (Stage 05).** `rollout undo` goes back to the immediately previous revision, not to the original. In the example, it restores `nginx:1.16.1`, not `nginx:1.14.2`. The restored revision gets a new number in the history and reuses its ReplicaSet.",
  "**`kubectl delete pvc` (Stage 06).** With Minikube's `standard` StorageClass, the reclaim policy is usually `Delete`: deleting the PVC deletes the PV and the data. Check your cluster's policy with `kubectl get storageclass`. In production environments, this policy is an important decision.",
  "**Changing an existing Pod (Stage 06).** The `spec` of a Pod cannot be modified after it is created (with few exceptions, such as the image). To change the volume type, create a Pod with another name or delete and recreate the Pod.",
  "**Restart timing (Stage 07).** In the liveness-exec experiment, the first restart happens at around 45 seconds (30s healthy plus 3 failures spaced 5s apart). The following cycles may take longer, because the kubelet waits for the container to terminate (up to 30s by default, the `terminationGracePeriodSeconds`) before recreating it.",
  "**Who restarts what (Stages 07 and 09).** The kubelet restarts containers whose process ended, because of the `restartPolicy`, with or without a probe. The liveness probe exists for the case where the process is still alive but does not respond. An endpoint that brings the process down (like podinfo's `/panic`) demonstrates the first case, not the second.",
  "**HPA metrics (Stage 08).** The HPA natively reads CPU and memory, via the metrics-server. Requests per second, Prometheus metrics, disk I/O and any other metric require a custom or external metrics adapter installed in the cluster.",
  "**HPA and `replicas` (Stages 08 and 09).** With an active HPA, the number of replicas is decided by it within `minReplicas` and `maxReplicas`. The Deployment's `replicas` works as a starting point and is adjusted by the HPA, which explains the 3 replicas becoming 2 in Stage 09. Reapplying the manifest (`kubectl apply`) sets `replicas` back to the value written in it, and the HPA adjusts again after the stability window.",
  "**Service balancing (Stage 09).** Balancing is per connection and the choice of replica is random. Clients that reuse the connection (like a browser) tend to always talk to the same replica.",
  "**startupProbe (Stage 07).** The most common way to give a slow app time is `failureThreshold` multiplied by `periodSeconds`, instead of a fixed `initialDelaySeconds`. The example with `initialDelaySeconds: 120` is valid and was kept out of fidelity to the source material.",
  "**Terminology and points to verify**",
  '**Master node and control plane.** The lesson material uses "Master node". Current Kubernetes documentation prefers **control plane**, which is what appears in the ROLES column of `kubectl get nodes` in Stage 01. Both names refer to the same thing.',
  "**Image tag (Stage 09).** The tag `stefanprodan/podinfo:6.14.1` comes from the guide's material. Confirm on Docker Hub that it exists before running; if it does not, use a more recent published tag. The fixed tag, instead of `latest`, is the didactic point and remains.",
  "**Supporting manifests.** The files `liveness-exec.yaml` (Stage 07), the HPA `service.yaml` (Stage 08) and `pod-emptydir.yaml` (Stage 06) are supporting additions to the exercises, following the pattern of the official Kubernetes documentation.",
];

export type Platform = {
  name: string;
  price: string;
  free: boolean;
  url: string;
  urlLabel: string;
  desc: string;
  goodFor: string;
};

export const PLATFORMS: Platform[] = [
  {
    name: "Killercoda",
    price: "100% free",
    free: true,
    url: "https://killercoda.com/kubernetes",
    urlLabel: "killercoda.com/kubernetes",
    desc: "Interactive Kubernetes scenarios right in the browser: you get a terminal with a real cluster and a guided script. Katacoda's successor.",
    goodFor: "Practice every stage of this guide without installing anything. Start here.",
  },
  {
    name: "Play with Kubernetes",
    price: "100% free",
    free: true,
    url: "https://labs.play-with-k8s.com",
    urlLabel: "labs.play-with-k8s.com",
    desc: "A real, temporary Kubernetes cluster (4-hour sessions) in the browser, run by Docker. You build the cluster by hand with kubeadm.",
    goodFor: "Freely test kubectl commands and understand how a cluster comes together.",
  },
  {
    name: "Kube by Example",
    price: "100% free",
    free: true,
    url: "https://kubebyexample.com",
    urlLabel: "kubebyexample.com",
    desc: "Short tutorials and examples maintained by Red Hat: one concept per page (Pods, Services, Deployments...), straight to the point.",
    goodFor: "Quickly review a specific concept, like a second explanation.",
  },
  {
    name: "Introduction to Kubernetes (LFS158)",
    price: "100% free",
    free: true,
    url: "https://training.linuxfoundation.org/training/introduction-to-kubernetes/",
    urlLabel: "training.linuxfoundation.org",
    desc: "The Linux Foundation's official free course (who maintains K8s), also available on edX. Solid theory with a certificate of completion.",
    goodFor: "Consolidate the theory with the official material after finishing this guide.",
  },
  {
    name: "Kubernetes the Hard Way",
    price: "100% free",
    free: true,
    url: "https://github.com/kelseyhightower/kubernetes-the-hard-way",
    urlLabel: "github.com/kelseyhightower",
    desc: "Kelsey Hightower's legendary walkthrough: building a cluster piece by piece, by hand, with no installers. It's \"build the car bolt by bolt\": once you've done it, you never look at the garage the same way.",
    goodFor: "Advanced level, for when you want to understand what Minikube hides from you.",
  },
  {
    name: "KodeKloud",
    price: "Free tier + paid",
    free: false,
    url: "https://kodekloud.com",
    urlLabel: "kodekloud.com",
    desc: 'Guided, challenge-style labs: "this Pod won\'t come up, figure out why." Some labs are free; the full catalog (plus CKA/CKAD practice exams) is paid.',
    goodFor: "Realistic troubleshooting, the closest thing to a technical interview.",
  },
  {
    name: "iximiuz Labs",
    price: "Free tier + paid",
    free: false,
    url: "https://labs.iximiuz.com",
    urlLabel: "labs.iximiuz.com",
    desc: "Container and Kubernetes playgrounds in the browser with hands-on challenges. Several playgrounds and challenges are unlocked on the free plan.",
    goodFor: "Deeper experiments: networking, images, container internals.",
  },
];
