// Content for the 8 stages, based on lessons 1-8 (Thiago Adriano / FIAP),
// themed around Formula 1 by the /otimizar-relatorio pipeline (relatorios/kubernetes-basico/final.md)
// English translation of kubernetesbasico.ts.

export type Example = {
  label: string;
  lang: "yaml" | "sh";
  code: string;
  note?: string;
};

export type Command = { cmd: string; note?: string };

export type Point = { t: string; d: string; color?: string };

export type Lesson = {
  id: string;
  num: string;
  navTitle: string;
  tag: string;
  title: string;
  narration: string;
  lead: string;
  concept: string[];
  points: Point[];
  pointsTitle: string;
  examples: Example[];
  examplesTitle: string;
  commands: Command[];
  handsOnIntro?: string;
  handsOn: string[];
  tip: string;
  takeaway: string;
  outro: string;
};

export type Mapping = { k8s: string; f1: string };

// The pilot's cheat sheet — the same analogy holds from the first page to the last
export const DE_PARA: Mapping[] = [
  {
    k8s: "Container",
    f1: "The car plus the team's kit: sealed off in its own garage, sharing the circuit's infrastructure",
  },
  {
    k8s: "Container image",
    f1: "The car's build spec, reproducible at any circuit on the calendar",
  },
  { k8s: "Virtual machine (VM)", f1: "Hauling the team's entire factory to every GP" },
  { k8s: "Kubernetes (the orchestrator)", f1: "The whole pit wall plus garage operation" },
  {
    k8s: "Desired state",
    f1: "The target called over the radio: you declare the goal, the system holds it",
  },
  { k8s: "Cluster", f1: "The team assembled for race weekend" },
  { k8s: "Control plane (master node)", f1: "The pit wall" },
  { k8s: "Worker node", f1: "The garage/box where cars get built and run" },
  { k8s: "API Server", f1: "The race engineer: every radio call goes through him, no exceptions" },
  { k8s: "kubectl", f1: "The driver's radio button" },
  { k8s: "kubeconfig", f1: "The paddock pass plus the team's radio frequency" },
  { k8s: "etcd", f1: "The team's central data system (setup sheets plus the state of everything)" },
  { k8s: "kubelet", f1: "Each garage's head mechanic" },
  { k8s: "kube-proxy", f1: "The pit lane marshal, routing each car to the right box" },
  { k8s: "Minikube", f1: "The factory simulator" },
  { k8s: "Pod", f1: "The car (chassis built and running)" },
  { k8s: "The Pod's IP", f1: "The car's position on track, always changing" },
  { k8s: "Labels", f1: "The FIA tracking tags on parts and the car (used for selection)" },
  { k8s: "Annotations", f1: "The engineer's debrief notebook entries (for humans)" },
  { k8s: "YAML manifest", f1: "The car's spec sheet, version-controlled" },
  {
    k8s: "Imperative vs. declarative",
    f1: 'A direct radio order ("box, box") vs. a race plan written before the GP',
  },
  {
    k8s: "Service",
    f1: "The pit box: a fixed spot in the pit lane, serving any car with the team tag",
  },
  { k8s: "ClusterIP", f1: "Internal radio channel: only the team hears it" },
  { k8s: "NodePort", f1: "The circuit's numbered service gate" },
  { k8s: "LoadBalancer", f1: "The circuit's official entrance, ticket booth included" },
  { k8s: "ConfigMap", f1: "The setup sheet, kept separate from the chassis" },
  { k8s: "Secret", f1: "The confidential engine maps" },
  {
    k8s: "ReplicaSet",
    f1: "The team boss's rule: \"N cars ready, always\" (and the mechanics' all-nighter)",
  },
  { k8s: "Deployment", f1: "The development program: upgrade packages, spec by spec" },
  { k8s: "Rolling update", f1: "Rolling the upgrade into one car at a time" },
  { k8s: "Rollback", f1: "Reverting to the previous spec (the old floor that used to work)" },
  { k8s: "emptyDir", f1: "The garage whiteboard, wiped when the weekend ends" },
  { k8s: "hostPath", f1: "Storing data in that circuit's own freight crate" },
  { k8s: "PVC", f1: "The data engineer's storage request" },
  { k8s: "PV", f1: "The factory's physical storage that fills the request" },
  {
    k8s: "StorageClass",
    f1: "The catalog of storage types (fast trackside vs. the factory datacenter)",
  },
  { k8s: "Probes", f1: "Telemetry checks plus the radio check" },
  { k8s: "Liveness probe", f1: "Telemetry flatlined → full reset of the car" },
  {
    k8s: "Readiness probe",
    f1: "The box's red light: holds the car off track without stripping anything down",
  },
  {
    k8s: "Startup probe",
    f1: "The power unit's fire-up procedure: nothing is timed before the engine warms up",
  },
  {
    k8s: "HPA",
    f1: "The strategy wall lining up more cars as the load grows (an F1 without the 2-car cap)",
  },
  { k8s: "metrics-server", f1: "The telemetry sensors: without them the pit wall sees nothing" },
  {
    k8s: "resources.requests",
    f1: "The declared energy/fuel allocation, the baseline for any percentage",
  },
];

// Pilot's notes: where the analogies break down (a forced analogy is worse than no analogy)
export const ANALOGY_NOTES: string[] = [
  'ReplicaSet (Stage 05): in F1, swapping a car only happens between sessions, and the rules cap each team at 2 cars. The ReplicaSet replaces Pods in seconds, at any moment, in any quantity. The "mechanics\' all-nighter" captures the mechanism (rebuilding from spec), not the timing or the cap.',
  'HPA (Stage 08): scaling replicas has no direct parallel on a 2-car grid. The stated analogy is an "endurance race with no entry limit." The pit wall\'s behavior (reacting to telemetry, respecting the floor and ceiling) stays faithful.',
  "Service (Stage 04): a real pit box serves one car at a time; a Service balances continuous traffic across N simultaneous replicas. What stays faithful is the fixed address plus tag-based selection.",
  'Multi-container Pod (Stage 03): a car with a power unit plus MGU-K illustrates "distinct units sharing systems," but a Pod\'s containers are independent processes that can be swapped individually in the spec.',
];

export const LESSONS: Lesson[] = [
  {
    id: "m1",
    num: "01",
    navTitle: "Why K8s exists",
    tag: "motivation + setup",
    title: "Why Kubernetes exists",
    narration:
      "LIGHTS OUT! It's lights out at the Kubernetes GP! First corner, first brake, and the question that opens every championship: why does this sport exist? The answer to this stage carries the other seven. Stay with me.",
    lead: "Think about the demand on a GP weekend: the team's website, timing, streaming. Everything sleeps all week and explodes on race Sunday. And there's the car that flies in the simulator but won't run on track: the classic \"works on my machine.\" Every project runs into both problems, and Kubernetes automates the fix for both.",
    concept: [
      "The piece both solutions share is the container. A virtual machine is like hauling the entire factory to every GP: the carbon-fiber press, the wind tunnel, the office, all loaded onto the plane. A container is the car plus the team's kit. Each team has its own sealed garage, its own secrets, its own parts, but the circuit's structure (the paddock building, the power, the pit lane, in other words the host operating system's kernel) is shared by all ten teams. Cadillac, debuting this year, didn't build its own racetrack to compete: it showed up with its crates and plugged into the infrastructure that was already there.",
      "In technical terms: a VM carries a full operating system (gigabytes, minutes to boot); a container shares the host OS's kernel and only brings the files, binaries, and libraries the app actually needs (megabytes, seconds). A container image is an entire environment, reproducible anywhere. It's the build spec that guarantees the car shipped to Suzuka is identical to the one that ran in Melbourne. Goodbye, \"works on my machine.\"",
      "But containers solve the environment problem and create another one: with dozens or hundreds of them, someone has to create them, tear them down, watch their health, and recreate whatever fails. Doing that by hand does not scale. It's like asking one person to run both cars, the telemetry, and the pit stop, alone. Kubernetes (K8s) is the orchestrator that takes over those jobs: the entire pit wall plus garage operation.",
      'Its philosophy is that of the race engineer calling a target: he doesn\'t issue an instruction every corner. He declares "target plus 0.3 a lap, engine mode 6," and the whole system works on its own to hold it. In K8s you declare the desired state ("I want 3 copies of this running") and it makes reality match that declaration, even at 3 a.m. when a container dies. The pit wall never sleeps.',
    ],
    pointsTitle: "The key concepts of this stage",
    points: [
      {
        t: "Container ≠ VM",
        d: "VM = virtual hardware + full OS (the whole factory, shipped). Container = only what the app needs, sharing the host kernel (the car in the circuit's garage). Much lighter.",
        color: "ember",
      },
      {
        t: "Horizontal scaling",
        d: "More copies of the app splitting the load (what K8s automates). Vertical = more CPU/RAM on the same machine: lining up more cars vs. a bigger engine in a single car.",
        color: "signal",
      },
      {
        t: "Cluster and Pod",
        d: "K8s organizes machines (nodes) into clusters. Containers run grouped in Pods, the smallest managed unit. Cluster = the team on race weekend; Pod = the car.",
        color: "blue",
      },
      {
        t: "kubectl",
        d: "The command-line tool that talks to the cluster's REST API. It's your radio button (details in Stage 02).",
        color: "blue",
      },
      {
        t: "Minikube",
        d: "A 1-node K8s cluster running on your machine. The factory simulator: built for practice, no risk of crashing the real car. It's this guide's lab.",
        color: "signal",
      },
      {
        t: "Desired state",
        d: "K8s's philosophy: you declare what you want, it makes it happen and keeps it that way. Something dies? It rebuilds it on its own. The target called over the radio.",
        color: "violet",
      },
    ],
    examplesTitle: "Setting up the lab (step by step)",
    examples: [
      {
        label: "environment setup",
        lang: "sh",
        code: `# 1. Install Docker Desktop (docker.com). On Linux, use the Docker
#    Engine (docs.docker.com/engine/install). Check:
$ docker -v
Docker version 27.x

# 2. Install kubectl (kubernetes.io/docs/tasks/tools) and check:
$ kubectl version --output=yaml

# 3. Install Minikube (minikube.sigs.k8s.io/docs/start) and bring up the cluster:
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
No resources found in default namespace.`,
        note: "The first minikube start run downloads the cluster image and takes a few minutes. That's normal. It's the simulator's cold fire-up, and a cold simulator never starts instantly.",
      },
    ],
    commands: [
      { cmd: "minikube start", note: "brings up the local 1-node cluster" },
      { cmd: "minikube stop", note: "stops the cluster without deleting anything" },
      { cmd: "kubectl get nodes", note: "lists nodes and their status" },
      { cmd: "kubectl get pods", note: "lists pods in the current namespace" },
    ],
    handsOnIntro:
      "The smallest possible exercise: prove your lab is alive, the equivalent of the installation lap.",
    handsOn: [
      'Run minikube start and wait for "Done!".',
      "Run kubectl get nodes and check: the minikube node shows STATUS Ready. If it shows NotReady, wait a minute and check again.",
      'Run kubectl get pods and check: "No resources found." An empty, ready cluster is exactly the starting point for the next stage: a clean garage before the car arrives.',
      'Bonus: run minikube stop, then kubectl get nodes to see the connection error. Bring it back up with minikube start. Now you know what "cluster off the air" looks like in the terminal: a dead radio, and a dead radio mid-race is the worst feeling there is.',
    ],
    tip: "If minikube start fails, the most common cause is Docker Desktop not being open (on Linux, the service is stopped: sudo systemctl start docker). Bring Docker up first and try again. (Every simulator has a breaker someone forgot to flip.)",
    takeaway:
      "A container is a light, reproducible environment, the car that runs the same on any circuit; Kubernetes is the race engineer of desired state: you call the target, it holds it.",
    outro:
      "Sector 1 in the green! Lab standing, simulator on, cluster responding, a spotless start. Now comes the part every rookie underestimates: learning to talk on the radio. Stage 02 is next. Don't go anywhere.",
  },

  {
    id: "m2",
    num: "02",
    navTitle: "kubectl & API",
    tag: "the radio button",
    title: "kubectl and the API: how you command the cluster",
    narration:
      "Second stage and the track tightens: what good is having the car in the garage if you don't know how to key the radio? F1 lives on this channel. It's where Kimi Räikkönen immortalized \"leave me alone, I know what I'm doing\" at Abu Dhabi 2012, and won. Today you're the one learning to give the orders.",
    lead: "Your cluster is standing, but it's a sealed box. How do you give it orders? How do you investigate when something breaks, with no \"physical\" access to the container? On track the driver has the same problem: at 300 km/h, there's no getting out to pop the hood. Everything he knows about the car arrives by radio and telemetry.",
    concept: [
      "Everything in Kubernetes goes through the master node's REST API. kubectl is that API's client: every command you type becomes an HTTP request (GET, POST, PUT, DELETE) against the cluster. In F1, the driver doesn't talk to the front-left tire mechanic, or to the factory. He talks to one person: the race engineer. Every message goes through that single channel, which validates it, logs it, and passes it on to whoever executes it. kubectl is your radio button; the API Server is the race engineer: nothing happens in the cluster without going through him.",
      "The path of a command: you type kubectl get pods, kubectl reads the kubeconfig file (the API Server's address, credentials, and the current cluster context; Minikube sets this up on its own, and you can think of it as the paddock pass with the team's radio frequency already tuned in), and fires a GET /api/v1/pods at the API Server. The response comes back formatted in your terminal.",
      "The API is split into groups: the 'core' group holds the fundamental resources (pods, services, replicasets); other groups handle security, storage, autoscaling, like the team's departments: chassis, aero, power unit, strategy. Since it's plain REST, you can call it from any language (Python, Go, Java, C#), which opens the door to automation.",
      'There are two ways to work: imperative (kubectl run nginx --image=nginx, the direct order, the "box, box, box" over the radio: fast, decisive, good for tests) and declarative (write a YAML and run kubectl apply -f file.yaml, the race plan written Saturday night: documented, reviewed, versioned). In real projects declarative wins, because the file is versionable in Git. No serious team improvises the entire strategy live on the radio.',
    ],
    pointsTitle: "The verbs that handle 90% of your day",
    points: [
      {
        t: "get",
        d: "Query: lists resources and each one's status. kubectl get pods, get svc, get nodes... It's the glance at the timing screen.",
        color: "blue",
      },
      {
        t: "create / run / apply",
        d: "Create: run spins up an imperative pod; apply -f applies a YAML (declarative).",
        color: "signal",
      },
      {
        t: "delete",
        d: "Remove: kubectl delete pod nginx. Careful: it can affect whatever depends on that resource.",
        color: "ember",
      },
      {
        t: "describe",
        d: "Detail: config plus the Events section. First stop when something breaks. The session's telemetry history, event by event.",
        color: "violet",
      },
      {
        t: "logs",
        d: "See what the container is printing. Your best friend for debugging: it's listening to the car's radio directly.",
        color: "signal",
      },
      {
        t: "exec",
        d: "Open a shell inside the container: kubectl exec -it <pod> -- /bin/sh. The mechanic plugging a laptop into the car.",
        color: "blue",
      },
    ],
    examplesTitle: "Worked example: a Pod's life cycle",
    examples: [
      {
        label: "create → inspect → destroy",
        lang: "sh",
        code: `# Creates a pod named "nginx" from the nginx:1.14.2 image on Docker Hub
$ kubectl run nginx --image=nginx:1.14.2 --port=80
pod/nginx created

# Watch until the status reads Running (the first state is ContainerCreating)
$ kubectl get pods
NAME    READY   STATUS    RESTARTS   AGE
nginx   1/1     Running   0          30s

# Details plus events (look for the "Pulling image" line in Events)
$ kubectl describe pod nginx

# What the container is printing
$ kubectl logs nginx

# Cleanup
$ kubectl delete pod nginx
pod "nginx" deleted`,
        note: "If the status sits at ImagePullBackOff, the cluster couldn't pull the image. Check the name/tag and your internet connection. It's the parts crate that never reached the paddock: without the right spec, the car doesn't go together.",
      },
    ],
    commands: [
      {
        cmd: "kubectl run nginx --image=nginx:1.14.2 --port=80",
        note: "creates an imperative pod",
      },
      { cmd: "kubectl describe pod <name>", note: "details + Events (troubleshooting)" },
      { cmd: "kubectl logs <name>", note: "container output" },
      { cmd: "kubectl exec -it <name> -- /bin/sh", note: "shell inside the container" },
      { cmd: "kubectl delete pod <name>", note: "removes the pod" },
    ],
    handsOnIntro:
      "Run the full cycle and force your first real K8s error. Every driver needs that first lap to feel out the limit:",
    handsOn: [
      "Run the sequence from the example above (run → get → describe → logs → delete). In describe, look at the Events section: the Pulling image, Created container, Started container lines tell the pod's story in order, like a telemetry replay, frame by frame.",
      "Now create a pod that's broken on purpose: kubectl run broken --image=nginx:a-tag-that-does-not-exist.",
      "Run kubectl get pods and check the ImagePullBackOff (or ErrImagePull) status.",
      "Run kubectl describe pod broken and look in Events for the message explaining the image wasn't found. You just practiced a real debugging flow.",
      "Clean up: kubectl delete pod broken.",
    ],
    tip: "Memorize this flow: get pods (what's the status?) → describe pod (what do the Events say?) → logs (what is the app saying?). That sequence solves most problems. It's the driver's post-incident protocol: timing screen → telemetry history → the car's radio.",
    takeaway:
      "Everything in K8s is a call to the REST API; kubectl is your radio button and the API Server is the race engineer. And when something breaks, the path is always get → describe → logs.",
    outro:
      "Radio calibrated, and did you notice? Your first forced error, diagnosed without panic. This sector separates button-pushers from people who actually talk to the team. And heads up, because next comes the technical heart of the circuit: cluster anatomy and the spec sheet. Don't blink.",
  },

  {
    id: "m3",
    num: "03",
    navTitle: "Cluster & Pods",
    tag: "architecture + labels",
    title: "Cluster anatomy and its smallest unit: the Pod",
    narration:
      "We're entering the most technical corner complex on the track. Courage doesn't help here, precision does. And the sport's history shows no mercy for a spec out of place: in 1999 Ferrari nearly lost a win in Malaysia over millimeters on the barge boards. A spec isn't paperwork, it's the result. Today you write your first spec sheet.",
    lead: "In Stage 02 you created a pod with an imperative command. It works, but it has two holes: you don't know exactly what got created or where. And if you need to recreate that same pod tomorrow, you're relying on memory. No team builds a car from memory: there's a spec sheet for everything, from wing angle to every bolt's torque.",
    concept: [
      "A cluster is a group of machines (nodes) working together, with well-defined roles: it's the team assembled for race weekend. The Pod is the smallest unit Kubernetes manages. On our map, the Pod is the car: an 'envelope' holding one or more containers that share networking and storage.",
      "Four facts about Pods: (1) a Pod represents a running process and can hold more than one container sharing the same IP and volumes, like the power unit and the MGU-K in the same car; (2) Pods are ephemeral, constantly born and dying; the car that raced Silverstone today gets stripped down to the last bolt before Spa, what survives is the spec (keep this line, it's the root of Stages 04, 05, and 06); (3) every Pod gets an internal cluster IP, the car's position on track: real, it exists, but it keeps changing; (4) Pods are described in YAML, the car's spec sheet.",
      "To organize dozens of Pods there are labels and annotations. In F1, every car component (power unit, turbo, MGU-K, gearbox) carries an FIA-sealed tracking tag: that's how the system knows which engine is in which car; the tag exists to IDENTIFY AND SELECT. The engineer's debrief notebook (\"driver reported vibration at turn 7\") is information for humans, and nobody filters components by notebook entry. Labels are the FIA tag (it's by label that a Service finds its Pods, as you'll see in Stage 04); annotations are the debrief notebook (author, documentation, audit trail; they do NOT take part in selection). That difference is what shows up on the test.",
    ],
    pointsTitle: "Who does what inside the cluster",
    points: [
      {
        t: "Master node",
        d: "The pit wall: manages the cluster and decides where Pods run.",
        color: "blue",
      },
      {
        t: "Worker node",
        d: "The garages: run the Pods and other resources. Where the car gets built and actually runs.",
        color: "blue",
      },
      {
        t: "etcd",
        d: "The team's central data system: a distributed database holding the cluster's config and state, every setup sheet there is.",
        color: "ember",
      },
      {
        t: "kubelet",
        d: "Each garage's head mechanic: the agent on every node that manages its local Pods.",
        color: "signal",
      },
      {
        t: "kube-proxy",
        d: "The pit lane marshal: routes network traffic to the right Pods.",
        color: "signal",
      },
      {
        t: "API Server",
        d: "The race engineer: everything kubectl does passes through here (Stage 02).",
        color: "violet",
      },
    ],
    examplesTitle: "Your first YAML: memorize this skeleton",
    examples: [
      {
        label: "my-pod.yaml",
        lang: "yaml",
        code: `apiVersion: v1                # the K8s API version for this object
kind: Pod                     # the object's TYPE
metadata:                     # data ABOUT the object
  name: my-pod
  labels:                     # labels: key-value pairs used to SELECT
    app: myapp
    environment: study
  annotations:                # annotations: free-form metadata (docs)
    author: "Davi Gomes"
spec:                         # the SPEC: what runs inside
  containers:
    - name: my-container
      image: nginx:1.14.2
      ports:
        - containerPort: 80`,
        note: "Every K8s object follows this skeleton: apiVersion + kind + metadata + spec. The kind and the spec's contents change; the rest is always the same. It's like the technical regulations: once you understand one article's structure, you can read all the others.",
      },
      {
        label: "working with labels",
        lang: "sh",
        code: `# Apply the YAML (declarative)
$ kubectl apply -f my-pod.yaml
pod/my-pod created

# List, showing labels
$ kubectl get pods --show-labels
NAME      READY   STATUS    LABELS
my-pod    1/1     Running   environment=study,app=myapp

# Filter by label: K8s's core mechanism
$ kubectl get pods -l app=myapp
NAME      READY   STATUS    RESTARTS   AGE
my-pod    1/1     Running   0          1m

# Add a label to a pod that already exists
$ kubectl label pod my-pod team=devops`,
        note: 'That -l filter looks trivial right now, but Services, ReplicaSets, and Deployments find "their" Pods exactly this way: by label selector. It\'s the thread that stitches the next stages together, the same way the FIA tag stitches a car to its box and to the results sheet.',
      },
    ],
    commands: [
      { cmd: "kubectl apply -f file.yaml", note: "creates/updates from a YAML" },
      { cmd: "kubectl get pods --show-labels", note: "lists pods, showing their labels" },
      { cmd: "kubectl get pods -l app=myapp", note: "filters by label" },
      { cmd: "kubectl delete -f file.yaml", note: "removes whatever the file created" },
    ],
    handsOn: [
      "Save the YAML above as my-pod.yaml and apply it with kubectl apply -f my-pod.yaml.",
      "Run kubectl get pods --show-labels and check both labels in the last column.",
      "Run kubectl get pods -l app=myapp, then kubectl get pods -l app=something-else. Notice: the first finds the pod, the second comes back empty. Right tag, car found; wrong tag, empty garage.",
      "Add a label live: kubectl label pod my-pod team=devops and confirm with --show-labels.",
      "Don't delete the pod: it'll be the Service's target in the next stage. (If you already deleted it, just apply the YAML again. That's the beauty of declarative: the spec sheet rebuilds the identical car.)",
    ],
    tip: "Labels = operational selection (what K8s uses). Annotations = documentation (what humans use). A Pod's author? Annotation. Grouping an app's Pods? Label. The FIA tag versus the debrief notebook.",
    takeaway:
      "Every K8s object is apiVersion + kind + metadata + spec, the car's spec sheet; and labels are the FIA tag by which everything in the cluster finds everything else.",
    outro:
      "What a clean sector, ladies and gentlemen! YAML skeleton in your pocket, labels mastered. And notice how the guide set this up: that app: myapp label still alive on track is the overtake being prepared for the next stage. Off to the pit box!",
  },

  {
    id: "m4",
    num: "04",
    navTitle: "Services & ConfigMap",
    tag: "networking + config",
    title: "Services: a fixed address for Pods that keep changing",
    narration:
      "Lap 4 and the classic pit lane problem shows up: how do you find a car that keeps changing position? Anyone who follows F1 knows address and pit procedure are never a detail. Ask Christijan Albers, who left the box in 2007 with the fuel hose still attached. A fixed address and config kept out of the chassis: that's what this stage is about.",
    lead: "Remember fact #2 from Stage 03? Pods are ephemeral: every new Pod is born with a different IP. Trying to talk to them by IP is like finding a car by its track position: on lap 12 it's P4, by lap 30 it's P7. And there's a second problem: config baked into the image forces a rebuild for every change. A new chassis every time the pit wall asks for half a degree more wing.",
    concept: [
      "Problem 1 → Service. The Service is the team's pit box: the box's position in the pit lane stays fixed all season, everyone knows where Ferrari's box is. Which car pulls in each lap changes (Leclerc's, Hamilton's, a chassis built yesterday), and whoever needs the box doesn't care: the address is the same, and the box serves any car carrying the team's tag.",
      "The flow: a request hits the Service (fixed IP and name), the Service selects Pods by label selector (Stage 03's mechanism, the FIA tag again), and spreads traffic evenly across the healthy replicas. The Service's name becomes an internal cluster hostname: if the Service is called \"auth-service,\" any Pod reaches it at http://auth-service, even if the Pods behind it swap IPs a thousand times.",
      "Problem 2 → ConfigMap. The ConfigMap is the setup sheet kept separate from the chassis: wing, pressures, maps. None of it is welded to the car; it lives on a sheet the mechanics apply before the car leaves the garage. You store the values in one central object and inject them three ways: environment variables (the most common, via envFrom), mounted files (great for long configs), or command-line arguments. Config changed? Update the ConfigMap; the image stays the same. Half a degree of wing doesn't need a new chassis.",
    ],
    pointsTitle: "The 3 kinds of Service",
    points: [
      {
        t: "ClusterIP (default)",
        d: "Internal IP, cluster-only. The internal radio channel: only the team hears it. Use it for service-to-service traffic (e.g., API ↔ database).",
        color: "blue",
      },
      {
        t: "NodePort",
        d: "A fixed port (30000–32767) opened on the node. The circuit's numbered service gate, the way to expose something on Minikube.",
        color: "signal",
      },
      {
        t: "LoadBalancer",
        d: "An external load balancer with a public IP. The circuit's official main entrance, ticket booth included. This is the production type in the cloud (AWS, GCP, Azure).",
        color: "violet",
      },
    ],
    examplesTitle: "The YAMLs: watch the selector",
    examples: [
      {
        label: "app.yaml (Service)",
        lang: "yaml",
        code: `# app.yaml: save the Service in this file
apiVersion: v1
kind: Service
metadata:
  name: my-service              # becomes the internal hostname
spec:
  type: NodePort                # swap for ClusterIP (internal) or LoadBalancer (cloud)
  selector:                     # ← THE LINK: looks for Pods with this label
    app: myapp
  ports:
    - protocol: TCP
      port: 80                  # port the Service listens on
      targetPort: 80            # port the container receives on
      nodePort: 30080           # port exposed on the node (NodePort only)`,
        note: "The Service's selector matches the Pod's label (app: myapp), the exact my-pod you created in Stage 03. That's how it knows where to send traffic: the box reads the tag on the car pulling in.",
      },
      {
        label: "configmap-pod.yaml",
        lang: "yaml",
        code: `# configmap-pod.yaml: both objects in the same file, separated by ---
# 1) The ConfigMap with the values...
apiVersion: v1
kind: ConfigMap
metadata:
  name: my-config
data:
  MESSAGE: "hello from the configmap!"
  MODE: "study"
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
      envFrom:                 # injects ALL the keys at once
        - configMapRef:
            name: my-config`,
        note: "Confirm the injection with: kubectl exec pod-config -- env",
      },
      {
        label: "testing in the browser",
        lang: "sh",
        code: `$ kubectl apply -f app.yaml
$ kubectl get svc
NAME          TYPE       CLUSTER-IP    PORT(S)
my-service    NodePort   10.96.xx.xx   80:30080/TCP

# Generates the access URL (on Windows/Docker, leave the terminal open: it's a tunnel)
$ minikube service my-service --url
http://127.0.0.1:53412   ← open it in your browser: the nginx page!`,
      },
    ],
    commands: [
      { cmd: "kubectl get svc", note: "lists Services" },
      { cmd: "minikube service <name> --url", note: "access URL for a NodePort" },
      { cmd: "kubectl get configmap", note: "lists ConfigMaps" },
      { cmd: "kubectl exec <pod> -- env", note: "checks injected variables" },
    ],
    handsOn: [
      "With the Stage 03 my-pod running (label app: myapp), save the Service YAML as app.yaml and apply it.",
      "Run minikube service my-service --url, open the URL in your browser, and check the nginx welcome page. You just reached an ephemeral Pod through a stable address: you found the car by its box, not by its track position.",
      "Test the link: delete the pod (kubectl delete pod my-pod) and reload the browser to see the error (empty box, no car with the team's tag). Recreate it with kubectl apply -f my-pod.yaml and reload: it's back, without touching the Service. The box never moved.",
      "Apply the ConfigMap + pod (kubectl apply -f configmap-pod.yaml), run kubectl exec pod-config -- env, and check MESSAGE and MODE in the variable list. The setup sheet made it onto the car.",
    ],
    tip: "Golden rule: expose the minimum. Database = ClusterIP (internal channel; race strategy doesn't leak over an open radio). Only the system's entry point becomes NodePort/LoadBalancer. For passwords and keys, ConfigMap's secure sibling is the Secret: the confidential engine maps not every mechanic on the team gets to see.",
    takeaway:
      "Service is the pit box: a fixed address for cars (Pods) that keep changing, found by their tag (label); ConfigMap is the setup sheet, config kept outside the chassis (image).",
    outro:
      "Purple sector! A Pod reached through a stable address, config kept outside the chassis. And you even proved the link by deleting the car and watching the box stand there unmoved. Stay sharp, though, because next comes the corner that decides races: what happens when the car STOPS on track?",
  },

  {
    id: "m5",
    num: "05",
    navTitle: "Deployments",
    tag: "self-healing + scale",
    title: "Self-healing and scale: ReplicaSets and Deployments",
    narration:
      "THIS is where the point-scorers separate from the rest of the grid! Just today, lap 46, the Red Bull engine died and Verstappen watched the finish from the wall. Zero points. In production, your single Pod dying at 3 a.m. is exactly that scene. Self-healing and the way back: the most important stage of the guide starts NOW.",
    lead: "Up to now you've created Pods by hand. Great for learning, but think about Silverstone today: Verstappen stopped on lap 46 and that was it, there's no substitute mid-race. In production, your one Pod dying overnight is the same thing: the site is down until someone wakes up. And when you ship 2.0, how do you swap versions without taking the service down? And if it ships with a catastrophic bug, how do you get back fast?",
    concept: [
      'ReplicaSet: the team boss of headcount. You declare "replicas: 3" and it watches the Pods by label selector (the FIA tag, again!). One drops? It notices the count is short and spins up another in seconds, without you asking. It\'s the team boss\'s non-negotiable rule, "N cars ready, always": the driver wrecks the chassis Saturday, the mechanics work through the night, and Sunday there\'s a whole car on the grid, rebuilt from spec. That\'s Kubernetes self-healing, Stage 01\'s "desired state" kept for real.',
      "The analogy breaks here, and it's worth flagging: in F1, replacing a car only happens between sessions, and the rules cap each team at 2 cars. The ReplicaSet has no parc fermé and no rulebook: it replaces the Pod in seconds, any time, any quantity. Think of K8s as an endurance race with no entry limit, where the \"mechanics' all-nighter\" takes thirty seconds.",
      "Deployment: the spec manager. It wraps the ReplicaSet and adds the development program: Rolling Update (swap the image, and it brings up new replicas while gradually shutting down the old ones, so the service never goes dark, like an upgrade rolled into one car while the other keeps running the old spec), Rollback (kubectl rollout undo goes back to the previous version in seconds: the new floor doesn't work, the car reverts to the old spec; Ferrari showed up in Barcelona this year with a new package and Hamilton won, but if the package had hurt the car, they would have reverted to the Monaco spec with no drama), and manual scale (kubectl scale --replicas=5: five cars on the grid).",
      "The ReplicaSet and Deployment YAMLs are nearly identical, but in practice we almost always use the Deployment, for version control. Nobody manages just the car count; you manage the count AND each one's spec. The Deployment creates and manages the ReplicaSet under the hood.",
    ],
    pointsTitle: "What each one guarantees",
    points: [
      {
        t: "ReplicaSet",
        d: "N replicas running ALWAYS. One drops, another is born in seconds: the mechanics' all-nighter, compressed. Selection by label selector.",
        color: "blue",
      },
      {
        t: "Rolling Update",
        d: "Gradual version swap: brings up the new ones, shuts down the old. Zero downtime: the upgrade rolled in one car at a time.",
        color: "signal",
      },
      {
        t: "Rollback",
        d: "New version broke something? kubectl rollout undo restores the previous one in seconds, back to the spec that worked.",
        color: "ember",
      },
    ],
    examplesTitle: "The full Deployment + its life cycle",
    examples: [
      {
        label: "deployment.yaml",
        lang: "yaml",
        code: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-fiap
spec:
  replicas: 3                  # I want 3 copies, always
  selector:
    matchLabels:
      app: nginx-app           # I manage Pods with this label...
  template:                    # ...and this is each Pod's "mold"
    metadata:
      labels:
        app: nginx-app         # has to match the selector above
    spec:
      containers:
        - name: nginx
          image: nginx:1.14.2  # changing this version triggers the rolling update
          ports:
            - containerPort: 80`,
        note: "Notice: the template is literally the Pod skeleton from Stage 03, embedded inside the Deployment. Nothing here is new, it's composition: the car's spec sheet, attached to the team boss's order (\"three cars at this spec, always\").",
      },
      {
        label: "self-healing in action",
        lang: "sh",
        code: `$ kubectl apply -f deployment.yaml
$ kubectl get pods
nginx-fiap-7d4b9c-aaa   1/1   Running
nginx-fiap-7d4b9c-bbb   1/1   Running
nginx-fiap-7d4b9c-ccc   1/1   Running

# Kill a pod on purpose:
$ kubectl delete pod nginx-fiap-7d4b9c-aaa

# Look again: a NEW pod is already spinning up to hold the 3 replicas
$ kubectl get pods
nginx-fiap-7d4b9c-bbb   1/1   Running
nginx-fiap-7d4b9c-ccc   1/1   Running
nginx-fiap-7d4b9c-ddd   0/1   ContainerCreating   ← self-healing!`,
      },
      {
        label: "update + rollback",
        lang: "sh",
        code: `# Rolling update: swap the image
$ kubectl set image deployment/nginx-fiap nginx=nginx:1.16.1
$ kubectl rollout status deployment/nginx-fiap
deployment "nginx-fiap" successfully rolled out

# Break it on purpose (an image that doesn't exist):
$ kubectl set image deployment/nginx-fiap nginx=nginx:does-not-exist
$ kubectl get pods
nginx-fiap-7d4b9c-bbb   1/1   Running            ← old pods hold the service up
nginx-fiap-9f8e2a-xyz   0/1   ImagePullBackOff   ← new ones stuck

# Rollback: revert everything to the previous version
$ kubectl rollout undo deployment/nginx-fiap
deployment.apps/nginx-fiap rolled back`,
        note: "K8s only shuts down the old Pods once the new ones are ready. Since the broken image never becomes ready, the old ones keep the service running: the old-spec cars keep scoring points while the new spec never even clears the crash test.",
      },
    ],
    commands: [
      { cmd: "kubectl scale deployment <name> --replicas=5", note: "manual scale" },
      { cmd: "kubectl set image deployment/<name> ctn=img:tag", note: "triggers a rolling update" },
      { cmd: "kubectl rollout status deployment/<name>", note: "tracks the rollout" },
      { cmd: "kubectl rollout history deployment/<name>", note: "lists revisions" },
      { cmd: "kubectl rollout undo deployment/<name>", note: "rollback!" },
    ],
    handsOnIntro:
      "The moment the grandstands were waiting for: the guide's own pit stop. But here, unlike a tire change, rushing is the enemy: the value of this exercise is in WATCHING each state change in the terminal. Stay calm, keep your eyes open.",
    handsOn: [
      "Apply deployment.yaml and confirm the 3 pods are Running: three cars on track, same spec.",
      "Delete a pod by hand (copy a real name from kubectl get pods) and run kubectl get pods again, fast, to catch the replacement in ContainerCreating. You just tried to violate the desired state and the cluster corrected it.",
      "Run the rolling update to nginx:1.16.1, track it with kubectl rollout status, and watch for the success message. The upgrade rolled in car by car, nobody left the track.",
      "Break it on purpose with the nginx:does-not-exist image and watch kubectl get pods show old pods Running, holding the service, and new ones stuck in ImagePullBackOff.",
      "Run kubectl rollout undo deployment/nginx-fiap and confirm with kubectl rollout history, checking the listed revisions. You just did a production rollback in one command: back to qualifying spec without losing the race.",
    ],
    tip: "Run the self-healing test at least once: kill a pod and watch its replacement get born, the mechanics' all-nighter compressed into seconds. It's the moment Kubernetes finally clicks.",
    takeaway:
      "Nobody runs a standalone Pod in production, because a car with no team never finishes the race: the Deployment guarantees N replicas (self-healing), swaps specs without pulling anyone off track (rolling update), and reverts to the previous spec in one command (rollback).",
    outro:
      "And the grandstand is on its feet! You KILLED a Pod and the cluster rebuilt it before the replay even finished. A decisive sector, completed in the green. Now, the question that haunts every top team: what about the DATA?",
  },

  {
    id: "m6",
    num: "06",
    navTitle: "Volumes",
    tag: "data persistence",
    title: "Volumes: data that outlives the Pod",
    narration:
      "We're entering the high-speed sector, and the subject that never makes the highlight reel but wins championships: data. Williams dominated the '90s because it turned telemetry into development before anyone else did. A car gets stripped down; history, never. Stage 06, and it counts.",
    lead: "Pods are ephemeral, and Stage 05 made that radical, with pods dying and being born on every rolling update. Great for the app, catastrophic for data: the car that raced today gets stripped to the monocoque, but gigabytes of telemetry are already back at the factory before the driver even pulls off his helmet. If the PostgreSQL Pod gets recreated mid-update, every Black Friday order disappears with it. Data that matters can't live on a container's filesystem.",
    concept: [
      "Kubernetes solves this with a chain of 4 concepts: Volume, PersistentVolume (PV), PersistentVolumeClaim (PVC), and StorageClass (SC). Memorize it through the team's data operation: the PVC is the data engineer's REQUEST (\"I need 1Gi, read-write from one node\"); the PV is the factory's physical STORAGE that fills the request (NFS, AWS EBS, hostPath...); the StorageClass is the CATALOG of storage types (the fast trackside server? the factory datacenter?).",
      "The Pod only references the PVC: the car doesn't know (and doesn't need to know) which rack in the factory holds its telemetry. That separation is what lets the same YAML run on Minikube and on AWS, the same way the same data procedure works at Interlagos and at Suzuka. On Minikube, the 'standard' StorageClass already provisions PVs automatically: you make the request (PVC) and the storage (PV) appears.",
      "PVC access modes (who can mount the volume): ReadWriteOnce (read-write from ONE node, the typical database case; only the team's own garage writes to its own data), ReadOnlyMany (read-only, many nodes, for static assets; like the FIA timing feed: every team reads it, nobody changes it), and ReadWriteMany (read-write from many nodes; needs NFS or similar).",
    ],
    pointsTitle: "The storage chain",
    points: [
      {
        t: "emptyDir",
        d: "Lives and dies with the Pod. The garage whiteboard: session notes, wiped when the weekend ends. For temporary data and sharing between a Pod's own containers.",
        color: "signal",
      },
      {
        t: "hostPath",
        d: "Mounts a directory from the NODE into the container. That circuit's freight crate: fine for dev; be careful in production (it ties the Pod to that node).",
        color: "ember",
      },
      {
        t: "PVC → PV",
        d: "The request (Claim) matches the storage (Volume). Data survives the Pod dying: telemetry safe at the factory.",
        color: "blue",
      },
      {
        t: "StorageClass",
        d: "The catalog: provisions PVs automatically by profile. On Minikube, the 'standard' class already handles this.",
        color: "violet",
      },
    ],
    examplesTitle: "Prove the persistence: write, destroy, read it back",
    examples: [
      {
        label: "pvc.yaml",
        lang: "yaml",
        code: `apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: my-pvc
spec:
  accessModes:
    - ReadWriteOnce            # one node reads and writes (typical for a database)
  resources:
    requests:
      storage: 1Gi             # how much disk I want
# on Minikube, the "standard" StorageClass provisions the PV on its own`,
      },
      {
        label: "pod-with-pvc.yaml",
        lang: "yaml",
        code: `apiVersion: v1
kind: Pod
metadata:
  name: persistent-pod
spec:
  containers:
    - name: app
      image: nginx:1.14.2
      volumeMounts:
        - name: data
          mountPath: /data     # where the volume shows up in the container
  volumes:
    - name: data
      persistentVolumeClaim:   # ← points to the PVC (instead of emptyDir)
        claimName: my-pvc`,
      },
      {
        label: "the survival test",
        lang: "sh",
        code: `$ kubectl apply -f pvc.yaml -f pod-with-pvc.yaml

# Bound = the PV was created and linked to the request
$ kubectl get pvc
NAME     STATUS   VOLUME         CAPACITY   ACCESS MODES
my-pvc   Bound    pvc-3f2a1...   1Gi        RWO

# Write a file to the volume
$ kubectl exec persistent-pod -- sh -c "echo 'i survived!' > /data/test.txt"

# DESTROY the pod (the PVC keeps existing)
$ kubectl delete pod persistent-pod

# Recreate the pod and read the file:
$ kubectl apply -f pod-with-pvc.yaml
$ kubectl exec persistent-pod -- cat /data/test.txt
i survived!            ← the Pod died, the data didn't.`,
        note: "It's the car stripped down after the race with the telemetry intact back at the factory: the fresh chassis for Spa is born already carrying Silverstone's full history.",
      },
    ],
    commands: [
      { cmd: "kubectl get pvc", note: "volume requests (Bound = ok)" },
      { cmd: "kubectl get pv", note: "the cluster's persistent disks" },
      { cmd: "kubectl delete pvc <name>", note: "removes the request (and frees the disk)" },
    ],
    handsOn: [
      "Apply the PVC and run kubectl get pvc. Check the STATUS: Bound: your request was filled by a PV created automatically (confirm with kubectl get pv).",
      "Run the full sequence from the example: write the file → delete the pod → recreate the pod → read the file. Watch \"i survived!\" come back. That's the PVC's contract: the car dies, the telemetry stays.",
      "Bonus experiment (the contrast that teaches): repeat the test swapping the volume for emptyDir, and when you recreate the Pod, the file will be gone. That's the difference between the garage whiteboard and the factory server, felt firsthand.",
    ],
    tip: "Important data ALWAYS goes in a PVC. If data vanished after a restart, I'd bet it was living in emptyDir or the container's filesystem: someone wrote the race strategy on the whiteboard and the cleaning crew came through.",
    takeaway:
      "PVC is the request, PV is the storage, StorageClass is the catalog. And data that matters always lives behind a PVC: the car gets stripped down, the telemetry never does.",
    outro:
      "\"I SURVIVED!\" And the file came back! The car was stripped down to the monocoque and the telemetry was right there, intact, at the factory. Green sector. But hold on tight, because next comes the sneakiest trap on the circuit: the car that's running... but isn't.",
  },

  {
    id: "m7",
    num: "07",
    navTitle: "Probes",
    tag: "app health",
    title: "Probes: how the cluster knows your app is actually alive",
    narration:
      "Careful, this corner is BLIND! Today, at Silverstone, the whole world watched: Antonelli started from pole, set a 1:31.777 (the fastest lap of the race), and crossed the line SIXTEENTH. Fifty-two laps on track, and nothing about it was healthy. And the veterans remember Senna at Interlagos, 1991: the car was moving, but only sixth gear still worked. That's exactly the gap probes close.",
    lead: "Antonelli was out there, running, for all 52 laps, and something was clearly not healthy anyway. It's identical in the cluster: your app deadlocks at 3 a.m., the process is still standing (Kubernetes sees Running across the board), but no request gets answered. Stage 05's self-healing only recreates pods that DIE; it can't see pods that are alive but stuck: the car that's running... but isn't.",
    concept: [
      "Probes are health checks declared in the Pod's manifest. It's telemetry plus a radio check: the team doesn't trust the fact that the car is moving. It checks specific channels at regular intervals: oil pressure, power unit temperature, the driver's response on the radio. It's not enough for the car to be on track; it has to respond to being poked.",
      'How a probe checks (3 mechanisms): httpGet (the kubelet fires a GET at an endpoint like /health and expects 200 OK; the most common one, the radio check: "give me an OK, driver"), tcpSocket (tests whether the port accepts a connection, for services that don\'t speak HTTP; the radio carrier opens, even with no actual talk), and exec (runs a command inside the container; exit code 0 = healthy, the mechanic plugging in a laptop and running diagnostics).',
      "Best practices from the lesson: use all three probes together in production; use different endpoints for each probe (separate telemetry channels; you don't measure oil pressure on the brake sensor); start from the default settings and only tune intervals when the app actually needs it; monitor probe failures (e.g., with Prometheus), because they're the first sign of trouble, like that flicker in the telemetry two laps before a part fails.",
    ],
    pointsTitle: "The 3 probes and what happens when they fail",
    points: [
      {
        t: "Liveness",
        d: '"Is it alive?" Fails → the Pod gets RESTARTED. The full cycle: turn the car off and back on. For apps that hang and only come back with a restart.',
        color: "ember",
      },
      {
        t: "Readiness",
        d: "\"Ready for traffic?\" Fails → it LEAVES the load balancer, no restart. The box's red light: held in the garage, nobody strips it down. For apps that load data before they're ready.",
        color: "signal",
      },
      {
        t: "Startup",
        d: '"Done booting?" While it runs, it HOLDS the other two off. The power unit\'s fire-up procedure: nobody clocks a lap time on a cold engine. For apps that are slow to boot.',
        color: "violet",
      },
    ],
    examplesTitle: "A Pod with all 3 probes, plus a teaching sabotage",
    examples: [
      {
        label: "pod-with-probes.yaml",
        lang: "yaml",
        code: `apiVersion: v1
kind: Pod
metadata:
  name: probes-example
spec:
  containers:
    - name: app
      image: example:latest
      ports:
        - containerPort: 80
      livenessProbe:           # fails → RESTARTS the pod
        httpGet:
          path: /health
          port: 80
        periodSeconds: 10      # checks every 10s
        timeoutSeconds: 5
        failureThreshold: 3    # 3 failures in a row → restart (3 is the default)
      readinessProbe:          # fails → LEAVES the load balancer
        httpGet:
          path: /ready         # good practice: a separate endpoint
          port: 80
        periodSeconds: 5
      startupProbe:            # holds the others off until the app is up
        httpGet:
          path: /startup
          port: 80
        initialDelaySeconds: 120   # slow app: wait 2 minutes
        periodSeconds: 30`,
        note: "This YAML is illustrative: the example:latest image is fictional. The runnable experiment is in the next tab.",
      },
      {
        label: "liveness-exec.yaml",
        lang: "yaml",
        code: `# liveness-exec.yaml: the sabotage is a busybox that creates /tmp/healthy,
# stays "healthy" for 30s, deletes the file, and the probe starts failing.
apiVersion: v1
kind: Pod
metadata:
  name: liveness-exec
spec:
  containers:
    - name: liveness
      image: busybox
      args:                         # the "sabotage script":
        - /bin/sh
        - -c
        - touch /tmp/healthy; sleep 30; rm -f /tmp/healthy; sleep 600
      livenessProbe:
        exec:
          command:                  # probe: does the file exist? (exit 0 = healthy)
            - cat
            - /tmp/healthy
        initialDelaySeconds: 5     # wait 5s before the first check
        periodSeconds: 5           # check every 5s`,
        note: "It's an oil pressure sensor sabotaged on purpose: 30 seconds of a good reading, then silence on the telemetry.",
      },
      {
        label: "watch the restart",
        lang: "sh",
        code: `$ kubectl apply -f liveness-exec.yaml

# Watch it live (Ctrl+C to exit):
$ kubectl get pods -w
NAME            READY   STATUS    RESTARTS
liveness-exec   1/1     Running   0
liveness-exec   1/1     Running   1 (5s ago)    ← automatic restart!
liveness-exec   1/1     Running   2 (10s ago)   ← and again...

# Investigate like a pro:
$ kubectl describe pod liveness-exec
Events:
  Warning  Unhealthy  Liveness probe failed: cat: /tmp/healthy: No such file
  Normal   Killing    Container liveness failed liveness probe, will be restarted`,
        note: "Timeline: 30s healthy → file deleted → 3 failures in a row (the failureThreshold default; the pit wall doesn't call for an engine reset on the first bad reading either, it confirms three times) → kubelet restarts it. Since the script starts over, the cycle repeats forever, on purpose, so you can watch it.",
      },
    ],
    commands: [
      { cmd: "kubectl get pods -w", note: "watches changes live" },
      { cmd: "kubectl describe pod <name>", note: "Events show the probe failures" },
    ],
    handsOn: [
      'Apply liveness-exec.yaml, run kubectl get pods -w, and watch the RESTARTS column climb on its own every ~35-45s. Every increment is the kubelet sending "turn the car off and on" to a Pod that stopped answering the telemetry.',
      "In another terminal, run kubectl describe pod liveness-exec and look in Events for the Warning Unhealthy plus Normal Killing pair. Learn to recognize that duo: in production, it's the signature of a failing probe.",
      "Clean up: kubectl delete pod liveness-exec.",
    ],
    tip: "Running does NOT mean healthy. Antonelli ran all 52 laps at Silverstone with pole and the fastest lap in his pocket, and finished P16. A car on track isn't a competitive car; a standing process isn't a working app. That's exactly why probes exist.",
    takeaway:
      "Liveness fails = turn the car off and on (restart); Readiness fails = the box's red light (leaves the load balancer without restarting); Startup = the power unit's fire-up (holds the other two off until the app finishes warming up).",
    outro:
      "RESTARTS climbing on its own on screen: you sabotaged the sensor and watched the pit wall call the reset, three readings confirmed, no panic. Few sectors teach this much with so little YAML. And now, the final straight of the circuit: the cluster is about to learn to drive itself.",
  },

  {
    id: "m8",
    num: "08",
    navTitle: "Autoscaling (HPA)",
    tag: "automatic scaling",
    title: "HPA: automatic scaling driven by metrics",
    narration:
      "FINAL STAGE, checkered flag in sight! And what a way to close it out: the pit wall calling strategy in real time. That's how Ross Brawn won Hungary in 1998, with Schumacher flying and a three-stop strategy recalculated mid-race. Today, the one reading and reacting is the HPA, and the desired-state loop opened back in Stage 01 closes right in front of you.",
    lead: "Go back to Stage 01's problem: demand explodes on race Sunday. You already know how to scale by hand (kubectl scale, Stage 05), but are you going to sit at the terminal adjusting replicas for every spike? At 2 a.m. too? No pit wall works that way: strategy reacts to the race in real time, based on telemetry. The loop needs to close: the cluster has to measure the load and scale itself.",
    concept: [
      "The Horizontal Pod Autoscaler (HPA) watches Pod metrics (CPU, memory...) and adjusts the replica count between a minimum and a maximum you define. It's the strategy wall with the power to line up more cars as the race load grows, keeping in mind Stage 05's deal: F1 itself caps out at 2 cars, so think of it as an endurance race with no entry limit. The pace tightened past the target? Line up more cars (up to the ceiling). The race calmed down? Pull back gradually.",
      "How it works: the HPA compares Pod utilization against the configured target (e.g., keep average CPU at 70%). Went over? It creates replicas (up to the max). Dropped? It removes them (down to the min), saving resources. Scale-down is deliberately slow (~5 minutes of stability) so it doesn't 'porpoise' on every quick blip. It's the same reason the pit wall doesn't rewrite strategy over every cloud on the radar: it waits for the pattern to confirm before it tears down the operation over the first safety car.",
      "Supported metrics: CPU (the most common), memory, custom app metrics (requests/sec, queue depth), external metrics (e.g., Prometheus), and disk I/O. The right metric depends on the app's profile, the same way you pick a strategy around what actually degrades the car: tires at Barcelona, brakes at Montreal.",
      "Two prerequisites that trip everyone up: (1) the cluster needs metrics-server to read CPU/memory. On Minikube: minikube addons enable metrics-server. No sensors on the car, and the pit wall sees nothing. (2) The container MUST declare resources.requests.cpu, because '70% CPU' means 70% OF WHAT THE POD ASKED FOR, the same way ERS energy allocation per lap works: 'I used 70%' only makes sense against a declared allocation. Without requests, the HPA shows <unknown> and doesn't scale.",
    ],
    pointsTitle: "What the HPA understands",
    points: [
      {
        t: "CPU / Memory",
        d: "The classic metrics. A percentage calculated against the container's resources.requests: the percentage of the declared allocation, never a raw absolute number.",
        color: "blue",
      },
      {
        t: "Custom metrics",
        d: "From your own app (req/s, queue depth) or external ones (Prometheus). Scale on what actually matters, because every track degrades something different.",
        color: "violet",
      },
      {
        t: "min / max",
        d: "You always set the floor and the ceiling on replicas. The HPA works inside that range, the same way strategy works inside the rulebook.",
        color: "signal",
      },
    ],
    examplesTitle: "Deployment + HPA + Service + load test",
    examples: [
      {
        label: "deployment.yaml (with requests!)",
        lang: "yaml",
        code: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-hpa
spec:
  replicas: 1                  # start with 1; the HPA takes it from here
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
          resources:           # WITHOUT requests the HPA can't compute %
            requests:
              cpu: "100m"      # 100 millicores = 0.1 CPU
            limits:
              cpu: "200m"`,
      },
      {
        label: "hpa.yaml",
        lang: "yaml",
        code: `apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: nginx-hpa
spec:
  scaleTargetRef:              # WHO the HPA controls
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
          averageUtilization: 70   # target: average CPU at 70%`,
      },
      {
        label: "service.yaml",
        lang: "yaml",
        code: `# service.yaml: so the load generator can find the app by name
# (Stage 04's fixed-address pit box, now on the internal channel)
apiVersion: v1
kind: Service
metadata:
  name: nginx-hpa              # internal hostname used by the generator
spec:
  type: ClusterIP              # internal traffic only (Stage 04's golden rule)
  selector:
    app: nginx-hpa             # matches the Deployment pods' label
  ports:
    - port: 80
      targetPort: 80`,
      },
      {
        label: "generating load and watching it scale",
        lang: "sh",
        code: `# Prerequisite: metrics-server
$ minikube addons enable metrics-server

$ kubectl apply -f deployment.yaml -f hpa.yaml -f service.yaml

# Generate load from inside the cluster:
$ kubectl run generator --image=busybox -it --rm -- /bin/sh -c \\
  "while true; do wget -q -O- http://nginx-hpa; done"

# In ANOTHER terminal, watch:
$ kubectl get hpa -w
NAME        TARGETS         MINPODS  MAXPODS  REPLICAS
nginx-hpa   cpu: 0%/70%     1        10       1
nginx-hpa   cpu: 152%/70%   1        10       1
nginx-hpa   cpu: 152%/70%   1        10       3    ← scaled itself!

# Stop the load (Ctrl+C) and wait ~5min: replicas shrink back down.`,
        note: "Plan B if TARGETS never clears 70% (static nginx is too efficient for its own good): run 2-3 generators in parallel (generator2, generator3), drop requests.cpu to '50m', or swap the image for registry.k8s.io/hpa-example, the official tutorial's php-apache, which burns CPU on every request. In production, K6 and JMeter run this kind of test in a controlled way.",
      },
    ],
    commands: [
      { cmd: "minikube addons enable metrics-server", note: "HPA prerequisite" },
      { cmd: "kubectl get hpa -w", note: "watches the HPA react to load" },
      { cmd: "kubectl top pods", note: "CPU/memory per pod" },
      {
        cmd: "kubectl autoscale deployment <n> --cpu-percent=70 --min=1 --max=10",
        note: "creates an imperative HPA",
      },
    ],
    handsOnIntro: "The weekend's final quick lap, with every sector coming together at once:",
    handsOn: [
      "Enable metrics-server and apply all three YAMLs (Deployment, HPA, Service). Run kubectl get hpa and check the targets: if it shows <unknown>, wait about a minute (a freshly installed sensor gives no reading before its first lap).",
      "Start the load generator in one terminal and kubectl get hpa -w in another, and watch the CPU percentage shoot past 70% and the REPLICAS column climb. If it plateaus below target, use the load tab's plan B. Confirm with kubectl get pods: new pods were born without a single command from you, the pit wall lined up cars on its own, reading the telemetry.",
      "Stop the load (Ctrl+C) and keep watching: replicas take about 5 minutes to shrink back. That slowness is deliberate (nobody tears down the garage the moment things go quiet).",
      "Use kubectl top pods during the test to see the raw metric feeding the HPA, the telemetry behind the strategy call.",
    ],
    tip: "kubectl get hpa showing <unknown> in the targets? Either metrics-server isn't running, or the container never declared resources.requests. Always one of those two causes: either the sensor is off, or nobody declared the reference allocation.",
    takeaway:
      "HPA = desired state applied to scale: you set the target, floor, and ceiling, and the pit wall does the rest. But without metrics-server (sensors) and resources.requests (declared allocation), it sees nothing.",
    outro:
      "And the cluster SCALED ITSELF, ladies and gentlemen! Replicas climbing on screen without a single command, and the loop closes: you declare the target, the pit wall runs the race. Final corner complete. Now it's the cool-down lap, a wave to the grandstand, and the podium just ahead.",
  },
];

// ===== FREE PRACTICE PLATFORMS =====

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
