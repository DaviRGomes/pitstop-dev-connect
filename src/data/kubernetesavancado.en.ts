// Content from the 9 lessons of the DevOps and Cloud Architecture module — Phase 2 (FIAP),
// themed with Formula 1 by the /otimizar-relatorio pipeline (relatorios/kubernetes-avancado/final.md)

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

// The driver's cheat sheet — the map that holds from Stage 01 to 09: a Pod is the car
export const DE_PARA: Mapping[] = [
  {
    k8s: "Container",
    f1: "A component of the car (the hybrid PU, the ERS, the gearbox), the part that does the work",
  },
  {
    k8s: "Pod",
    f1: "The complete car, the smallest unit that goes on track; groups components that share the same chassis and the same telemetry",
  },
  {
    k8s: "Node",
    f1: "The garage in the pit lane: hosts several cars and has finite resources (power, compressed air, space)",
  },
  { k8s: "Cluster", f1: "The whole team: every garage + the pit wall + the operation" },
  {
    k8s: "kubelet",
    f1: "The chief mechanic of that garage: watches the cars there, swaps a part, calls it in for repair",
  },
  {
    k8s: "Deployment",
    f1: "The operating sheet that guarantees N identical cars ready on the grid",
  },
  { k8s: "ReplicaSet", f1: "The set of cars built to the same spec/setup version" },
  { k8s: "Replica", f1: "Each identical car the team fields on the grid" },
  {
    k8s: "Service",
    f1: "The pit wall radio with a fixed address that routes the call to the right car",
  },
  { k8s: "Endpoints", f1: "The list of cars currently able to take on work" },
  {
    k8s: "Load balancing",
    f1: "The strategist splitting stints/laps between the cars",
  },
  {
    k8s: "Liveness probe",
    f1: '"Has the car stopped?" telemetry, if so, call it into the garage and restart the component',
  },
  {
    k8s: "Readiness probe",
    f1: '"Is the car on the pace?" telemetry, pulls it from the pack and puts it back without a garage visit',
  },
  {
    k8s: "Startup probe",
    f1: '"Did it finish the warm-up out-lap?" (tyres and brakes into their temperature window)',
  },
  {
    k8s: "Requests / limits",
    f1: "Guaranteed energy per lap vs. the ceiling that can't be crossed (ERS envelope / quota)",
  },
  {
    k8s: "OOMKill",
    f1: "The component blew past its envelope and burned out: catastrophic failure, car retires",
  },
  {
    k8s: "CPU throttling",
    f1: "Derate / engine mapping holding back power to stay inside the quota",
  },
  {
    k8s: "QoS classes",
    f1: "The order in which the team sacrifices cars under a safety car / when resources are tight",
  },
  {
    k8s: "Taint",
    f1: 'A sign on the garage: "reserved, authorized cars only" (the wet-tyre garage, the GPU rig)',
  },
  { k8s: "Toleration", f1: "The credential that lets a car into that marked garage" },
  {
    k8s: "Node affinity",
    f1: 'A strategy call on the radio: "that car HAS to go to that garage/setup"',
  },
  {
    k8s: "Pod anti-affinity",
    f1: "Never park both of the team's cars in the same garage (double the risk)",
  },
  {
    k8s: "Topology Spread",
    f1: "Spreading the cars across garages/zones with a numeric guarantee",
  },
  {
    k8s: "Eviction",
    f1: "The chief mechanic sacrificing one car to save the garage when resources run out",
  },
  {
    k8s: "PriorityClass",
    f1: "The championship leader's car vs. the test car: who gets saved first",
  },
  {
    k8s: "RollingUpdate",
    f1: "Swapping the setup car by car across a series of pit stops, without emptying the track",
  },
  { k8s: "maxUnavailable", f1: "The brake: how many cars can be in the garage at once" },
  { k8s: "maxSurge", f1: "The power: how many extra cars (T-cars) you build to speed up the swap" },
  {
    k8s: "Recreate",
    f1: "Calling everyone into the garage at once: stops everything, but never mixes versions",
  },
  { k8s: "rollout undo", f1: "Going back to the saved qualifying setup (the parc fermé baseline)" },
  { k8s: "Helm Chart", f1: "The car's build mold: same base, tuned per circuit" },
  { k8s: "values.yaml", f1: "The setup sheet per circuit (wing, tyre pressure, engine map)" },
  {
    k8s: "helm template (pure function)",
    f1: "The simulator: same input, same output, runs before it ever hits the track",
  },
  {
    k8s: "Blue/Green",
    f1: "The T-car already built and warmed up behind the scenes; promoting means swapping cars",
  },
  {
    k8s: "Canary",
    f1: "Sending ONE car to test the upgrade over a slice of the race before rolling it out to both",
  },
  {
    k8s: "Traffic weight (service mesh)",
    f1: "The engineer dialing in the exact fraction, independent of how many cars are out there",
  },
  { k8s: "SLO gate", f1: "The delta/temperature limit that aborts the test on the spot" },
  { k8s: "Karpenter", f1: "The logistics manager building a garage to spec, just-in-time" },
  { k8s: "Cluster Autoscaler", f1: "Fixed-size garages, pre-booked by contract" },
  {
    k8s: "Spot instance",
    f1: "Cheap capacity that can be reclaimed at any moment",
  },
  {
    k8s: "PodDisruptionBudget",
    f1: "The rule: never pull too many replicas at once (never both cars in the garage together)",
  },
  {
    k8s: "KEDA / scale-to-zero",
    f1: "Opening pit crew stations as the queue builds; zero when no car is coming in",
  },
  { k8s: "ServiceAccount", f1: "Each team member's access badge" },
  { k8s: "RBAC (Role/RoleBinding)", f1: "What that badge opens, and only that" },
  {
    k8s: "IRSA / Workload Identity",
    f1: "A temporary credential to enter the supplier's motorhome, no master key needed",
  },
  { k8s: "cert-manager / TLS", f1: "FIA seals that expire and renew themselves" },
  { k8s: "Zero Trust", f1: "The FIA rulebook: nobody passes without a verified credential" },
];

// Driver's notes: where the analogies break down (a forced analogy is worse than none)
export const ANALOGY_NOTES: string[] = [
  "Blue/Green (Stage 05): swapping cars on track is clean, but software can \"rewrite the track layout\" itself, meaning the database schema. When the new version changes the schema in an incompatible way, going back to the old car doesn't save you: the track has already changed underneath it. That's why backward-compatible migration (temporary dual support) comes BEFORE the cutover; the T-car doesn't cover that case on its own.",
  'Replicas and shared failure (Stages 01 and 02): two cars on the grid only multiply availability if they don\'t depend on the same piece of infrastructure. A liveness probe tied to the same database, or both pods on the same node, break the independence the "two cars" analogy assumes.',
];

export const LESSONS: Lesson[] = [
  {
    id: "m1",
    num: "01",
    navTitle: "Health & resources",
    tag: "onboard telemetry",
    title: "Application health and resource management",
    narration:
      "Ladies and gentlemen, the field leaves the garage for the first lap, and the question that opens EVERY broadcast is the simplest and the most brutal one: is the car in one piece? Is it on the pace? Before any elaborate strategy, it's telemetry that calls the shots. Buckle up, because Stage 01 is where we learn to READ the car.",
    lead: 'Picture your e-commerce site on Black Friday. One of the API pods has deadlocked: the process is still standing, the container hasn\'t died, but it answers every incoming client with an HTTP 500. Kubernetes, on its own, only knows one thing: "the process is alive." It restarts nothing, and you bleed sales for hours until someone spots it on a graph. In the pod next door, a memory leak is quietly eating RAM until it blows up the whole node and takes the healthy neighbors down with it.',
    concept: [
      'This is exactly what happened to Antonelli at Silverstone: started on pole (P1), crossed the line in P15. The car was alive (engine running, laps completed, race finished), but it wasn\'t on the pace. Process standing, 500 response. You need two different kinds of telemetry: one that screams "the car has stopped" and calls it into the garage to swap a part (liveness), and another that says "the car is still running but off the pace, pull it from the fight until it recovers" without calling it in for repair (readiness). And you need to define how much ERS energy and quota each component is entitled to, so no one steals the other\'s envelope (requests/limits).',
      "The three probes are the telemetry the pit wall reads at the end of every sector. Liveness restarts the container after N failures (self-healing); readiness only pulls the pod out of the load balancer, without restarting it; startup protects slow-booting apps by suspending the other two while the app hasn't come up yet. Confusing liveness with readiness causes cascading restarts. It's the difference between calling the car into the garage (losing 22s) and just telling it to cede position and recover.",
      "Requests and limits are the resource contract. requests is what the container reserves, the guaranteed floor the scheduler uses to decide which node the pod fits on (the guaranteed ERS energy per lap). limits is the ceiling it can't cross: blow past the memory limit and you get an OOMKill (the kernel kills the container); blow past the CPU limit and you get throttling (the kernel slows the process down to keep it inside its quota). Blowing the PU's thermal envelope burns the component; hitting the energy ceiling is the derate that reins in the power.",
      "The combination of requests and limits produces the pod's QoS class: the sacrifice order for when the garage runs short on resources. Guaranteed (requests == limits on every container) is sacrificed last (the championship leader's car); Burstable (requests < limits) uses idle slack but yields under contention; BestEffort (no requests, no limits) is evicted first (the test car nobody protects).",
      "One counterintuitive detail (a real case from Buffer): setting a CPU limit can actually make latency worse. The CFS quota algorithm can throttle a pod even at low average usage: small spikes burn through the 100ms quota and the process freezes until the next period. Buffer removed CPU limits from latency-sensitive services and saw p99 drop by 5 to 10x. In a multi-tenant setup you want limits for isolation; in a latency-sensitive service, sometimes less is more. And replicas in parallel multiply availability (A = MTBF / (MTBF + MTTR)): two pods at 99% reach roughly 99.99%, because the Service behaves like a logical OR: it only takes one Ready pod. The team with two cars: if one retires, the other still scores.",
    ],
    pointsTitle: "Key concepts in this stage",
    points: [
      {
        t: "Liveness probe",
        d: '"Have you stopped?" Fails N times in a row → the kubelet restarts the container. This is self-healing; use it for deadlocks, never for a passing slowdown (or it turns into a restart loop). On track: the unrecoverable DNF, pulled from the race.',
        color: "ember",
      },
      {
        t: "Readiness probe",
        d: '"Ready for traffic?" Fails → the pod leaves the load balancer (the endpoints), WITHOUT restarting. Comes back on its own once the dependency recovers. On track: the car cedes position and recovers, no garage visit needed.',
        color: "signal",
      },
      {
        t: "Startup probe",
        d: '"Finished booting yet?" Until it passes, it suspends liveness and readiness, protecting slow-booting apps from dying during startup. On track: the warm-up out-lap; nobody expects race pace on cold tyres.',
        color: "blue",
      },
      {
        t: "Requests and limits",
        d: "requests = the reserved floor (the scheduler uses it to place the pod); limits = the ceiling it can't cross. Blow memory and it's OOMKill; blow CPU and it's throttling. Guaranteed ERS energy vs. a quota you can't exceed.",
        color: "violet",
      },
      {
        t: "QoS classes",
        d: "Guaranteed (requests==limits) is sacrificed last; Burstable (requests<limits) yields under contention; BestEffort (nothing set) is evicted first. The sacrifice order under a safety car.",
        color: "teal",
      },
    ],
    examplesTitle: "YAML and commands in practice",
    examples: [
      {
        label: "Deployment with all 3 probes + resources",
        lang: "yaml",
        code: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
spec:
  replicas: 3
  selector: { matchLabels: { app: api } }
  template:
    metadata: { labels: { app: api } }
    spec:
      containers:
        - name: api
          image: myregistry/api:1.0.0
          ports: [ { containerPort: 8080 } ]
          startupProbe:            # 1) protects a slow boot
            httpGet: { path: /healthz, port: 8080 }
            failureThreshold: 30   #    up to 30 x 10s = 5min to come up
            periodSeconds: 10      #    checks every 10s
          livenessProbe:           # 2) stopped? restart the container
            httpGet: { path: /healthz, port: 8080 }
            periodSeconds: 10
            failureThreshold: 3    #    3 failures in a row -> restart
          readinessProbe:          # 3) ready? enters/leaves the load balancer
            httpGet: { path: /ready, port: 8080 }
            periodSeconds: 5
          resources:
            requests: { cpu: 100m, memory: 128Mi }  # guaranteed floor (scheduling)
            limits:   { memory: 256Mi }              # RAM ceiling; NO CPU limit
                                                     # (avoids CFS throttling)`,
        note: "This Deployment is Burstable (it has CPU/memory requests, but only a memory limit). To become Guaranteed, requests would have to equal limits on every resource of every container.",
      },
      {
        label: "a liveness probe restarting a stuck container",
        lang: "sh",
        code: `# 1) Create a pod whose liveness probe points at a port that does NOT exist -> always fails
#    IMPORTANT: --restart=Always (the Deployment default). With --restart=Never the
#    kubelet does NOT restart the container on a failed liveness probe (the pod just goes to Failed).
kubectl run teste-liveness --image=nginx --restart=Always \\
  --overrides='{"spec":{"containers":[{"name":"teste-liveness","image":"nginx","livenessProbe":{"httpGet":{"path":"/","port":9999},"periodSeconds":5,"failureThreshold":2}}]}}'

# 2) Watch the RESTARTS column climb every ~15s
kubectl get pod teste-liveness -w

# 3) Confirm the reason in the events
kubectl describe pod teste-liveness | grep -i liveness`,
        note: 'The RESTARTS column climbs on its own and describe shows "Liveness probe failed". That\'s self-healing in action: the car automatically called into the garage because telemetry flagged a stall. Afterward: kubectl delete pod teste-liveness.',
      },
    ],
    commands: [
      {
        cmd: "kubectl describe pod <pod>",
        note: "probe events, OOMKill, restarts (Liveness probe failed, OOMKilled)",
      },
      {
        cmd: "kubectl top pod / kubectl top node",
        note: "actual CPU/memory usage vs. requests/limits (needs metrics-server)",
      },
      {
        cmd: `kubectl get pod <pod> -o jsonpath='{.status.qosClass}'`,
        note: "shows the pod's QoS class",
      },
    ],
    handsOnIntro:
      "Prove in practice that liveness restarts a stuck container, your first fast lap of the weekend:",
    handsOn: [
      "Create a pod whose liveness probe points at a port that does NOT exist (port 9999). It will always fail. Use --restart=Always (with --restart=Never the kubelet won't restart it on a failed liveness probe).",
      "Run kubectl get pod teste-liveness -w and watch the RESTARTS column climb every ~15s.",
      'Confirm the reason: kubectl describe pod teste-liveness | grep -i liveness, and see "Liveness probe failed".',
      "That's self-healing: the car automatically called into the garage because telemetry flagged a stall. Clean up with kubectl delete pod teste-liveness.",
    ],
    tip: "Don't put a database check in the liveness probe. If the database goes down, every replica fails liveness at the same time, they all restart together, and you get a cascading failure. Check dependencies in the startup probe (so you don't come up without them) and degrade gracefully otherwise. It's like tying both cars' liveness to the same piece of infrastructure: if that fails, both come into the garage together and you're left with no one on track.",
    takeaway:
      "Liveness restarts, readiness only pulls from traffic, and every pod deserves at least a request, because a pod with no request is BestEffort and the first to be evicted. Liveness is calling the car into the garage, readiness is ceding position and recovering; a car with no reserved energy is the first one sacrificed under a safety car.",
    outro:
      "SECTOR 1 GREEN! We've crossed the first split and the car is in one piece, telemetry clean, resources under control. What a start! But now the track tightens: next up is the technical complex where we decide WHICH garage each car goes into. Strategy takes over. Hold on tight, Stage 02 is a pure precision corner.",
  },

  {
    id: "m2",
    num: "02",
    navTitle: "Scheduling",
    tag: "the strategy complex",
    title: "Advanced scheduling and node behavior",
    narration:
      "The track now demands a cool head. A fast car isn't enough: you need to put the RIGHT car in the RIGHT garage, and know who the team sacrifices when resources get tight. This is where the strategist wins or loses the Sunday. Radio's live with the pit wall!",
    lead: "You have a mixed cluster: some nodes have GPUs (expensive, for training models), most are ordinary. By default the scheduler drops a pod on any node it fits, so a random pod can occupy the GPU node and block the ML team, while a training job can land on an ordinary node with no GPU and never work. Worse: when a node runs out of memory, who does Kubernetes kill first? If it's the wrong pod, your critical service goes with it.",
    concept: [
      'Think of the pit lane. There\'s the ordinary garage and the specialized one: the one with the thermal blankets for wet tyres, the GPU calibration rig. Taints are the sign that says "reserved garage, authorized cars only" (repels anyone without clearance). Affinity is the strategy call on the radio: "take that car to the GPU garage" (attracts). And eviction is the chief mechanic who, when the garage runs short on power, starts sacrificing the test car before touching the championship leader\'s car.',
      "Taints and Tolerations repel. A taint is a mark on the node (\"don't schedule pods here unless they tolerate X\"); a toleration is the mark on the pod (\"I can handle X, I can go there\"). The effects: NoSchedule (won't schedule non-tolerant pods; ones already running stay), PreferNoSchedule (avoids it, but it's not absolute) and NoExecute (blocks new pods AND evicts non-tolerant pods already there; useful for draining a node for maintenance). Crucial point: a taint only repels, it doesn't attract. A pod that tolerates the GPU node can still end up on an ordinary one. To guarantee it only goes to the GPU, combine it with affinity.",
      'Node Affinity is the positive counterpart ("I want to go to nodes with label X"): required (hard, no label means no scheduling) vs. preferred (soft, weighted, if none is found it schedules elsewhere anyway). Pod Affinity/Anti-Affinity, meanwhile, relates pods to each other: affinity pulls them together ("put the cache near the front-end"); anti-affinity keeps them apart ("never put two replicas of the database on the same node/zone"), never both cars in the same garage. Inter-pod affinity gets expensive for the scheduler above a few hundred nodes; for spreading with a numeric guarantee, prefer Topology Spread Constraints (maxSkew), which scales better.',
      "Eviction under pressure is the node's self-protection. When memory, disk, or PIDs run short, the kubelet first tries to clean up (dead containers, unused images); if that's not enough, it evicts pods in this order: first the ones exceeding their requests (overshot BestEffort and Burstable), then by PriorityClass, and Guaranteed pods last. Details worth knowing: node-pressure eviction ignores the PodDisruptionBudget (it's an emergency); eviction ≠ OOMKill (OOMKill is the cgroup killing a container that went over its limit; eviction is the kubelet pulling pods to save the whole node). Placing pods under multiple constraints is bin packing, which is NP-hard. The scheduler uses a greedy heuristic (filter nodes → score them → pick one): fast, never optimal.",
    ],
    pointsTitle: "Key concepts in this stage",
    points: [
      {
        t: "Taints and Tolerations",
        d: 'A taint is the mark on the node ("don\'t schedule pods here unless they tolerate X"); a toleration is the mark on the pod ("I can handle X, I can go"). The sign on the garage and the car\'s badge. Only repels, never attracts.',
        color: "ember",
      },
      {
        t: "Taint effects",
        d: "NoSchedule (won't schedule non-tolerant pods), PreferNoSchedule (avoids it, not absolute) and NoExecute (blocks new pods AND evicts existing non-tolerant ones; drains a node for maintenance).",
        color: "signal",
      },
      {
        t: "Node Affinity",
        d: 'The positive counterpart ("I want nodes with label X"). required (hard: no label, no scheduling) vs. preferred (soft, weighted). Only affinity forces the car into the right garage.',
        color: "blue",
      },
      {
        t: "Pod (anti-)affinity and Topology Spread",
        d: 'Anti-affinity separates replicas ("never both cars in the same garage"); it gets expensive for the scheduler past a few hundred nodes; for spreading with a numeric guarantee, prefer Topology Spread (maxSkew).',
        color: "violet",
      },
      {
        t: "Eviction under pressure",
        d: "Short on memory/disk/PIDs, the kubelet evicts pods: first those exceeding requests, then by PriorityClass, Guaranteed last. Ignores the PodDisruptionBudget (emergency). ≠ OOMKill (cgroup kills one container).",
        color: "teal",
      },
    ],
    examplesTitle: "YAML and commands in practice",
    examples: [
      {
        label: "an ML pod that requires a GPU node",
        lang: "yaml",
        code: `# 1) Taint the GPU node (once, via kubectl):
#    kubectl taint nodes gpu-node-1 nvidia.com/gpu=true:NoSchedule
apiVersion: v1
kind: Pod
metadata: { name: treino-ml }
spec:
  tolerations:                     # PART 1: tolerates the GPU taint (allows entry)
    - key: "nvidia.com/gpu"
      operator: "Equal"
      value: "true"
      effect: "NoSchedule"
  affinity:
    nodeAffinity:                  # PART 2: AND requires a GPU node (forces it there)
      requiredDuringSchedulingIgnoredDuringExecution:   # hard: no label, no scheduling
        nodeSelectorTerms:
          - matchExpressions:
              - key: "accelerator"
                operator: In
                values: ["nvidia-gpu"]
  containers:
    - name: treino
      image: myregistry/treino:1.0
      resources:
        limits: { nvidia.com/gpu: 1 }   # requests 1 GPU (extended resource)`,
        note: "The toleration alone wouldn't be enough (the pod could still land on an ordinary node). It's the combination of toleration + nodeAffinity that guarantees strong isolation: clearance to enter the wet-weather garage PLUS the strategy call ordering it there.",
      },
      {
        label: "a taint repelling a pod",
        lang: "sh",
        code: `# 1) Find the node's name
kubectl get nodes

# 2) Taint the node: nothing without a toleration can be scheduled
kubectl taint nodes <NODE_NAME> demo=sim:NoSchedule

# 3) Try to launch an ordinary pod (no toleration)
kubectl run repelido --image=nginx

# 4) It stays Pending; check why
kubectl get pod repelido           # STATUS = Pending
kubectl describe pod repelido | grep -A2 Events   # "had untolerated taint"

# 5) Clean up: remove the taint (note the "-" at the end) and the pod
kubectl taint nodes <NODE_NAME> demo=sim:NoSchedule-
kubectl delete pod repelido`,
        note: 'While the taint exists, the pod stays Pending with "had untolerated taint": a car with no clearance, turned away at the garage door. Once the taint is removed, it schedules on its own.',
      },
    ],
    commands: [
      {
        cmd: "kubectl taint nodes <node> key=value:NoSchedule",
        note: "applies a taint (add a trailing - to remove it)",
      },
      {
        cmd: "kubectl label nodes <node> accelerator=nvidia-gpu",
        note: "labels the node for affinity",
      },
      {
        cmd: "kubectl describe node <node>",
        note: "shows taints, labels, pods, and resource pressure",
      },
      {
        cmd: "kubectl get events --field-selector reason=Evicted",
        note: "lists recent evictions",
      },
    ],
    handsOnIntro:
      "Watch a taint repel a pod in real time (works fine on a single-node minikube/kind cluster):",
    handsOn: [
      "Find the node's name: kubectl get nodes.",
      "Apply the taint: kubectl taint nodes <NODE_NAME> demo=sim:NoSchedule. Nothing without a toleration can be scheduled.",
      "Launch an ordinary pod with no toleration: kubectl run repelido --image=nginx.",
      'It stays Pending; check why: kubectl describe pod repelido | grep -A2 Events, which shows "had untolerated taint".',
      'Clean up: remove the taint (note the trailing "-") with kubectl taint nodes <NODE_NAME> demo=sim:NoSchedule- and delete the pod.',
    ],
    tip: 'Monitor node disk/memory usage and alert at 85%, before the ~95% that triggers eviction. Combined with log rotation, this avoids an "eviction storm". Prefer reacting manually (draining the node with kubectl drain) over letting the kubelet evict in a panic. It\'s the difference between calling the car into the garage on your own planned window and being forced to stop under a safety car along with everyone else.',
    takeaway:
      "A taint repels, affinity attracts. To truly reserve a node, you need both together. Garage clearance plus a strategy call: one without the other doesn't guarantee the right car ends up in the right garage.",
    outro:
      "SECTOR 2 COMPLETE, what a strategy masterclass! You put the right car in the right garage and you already know who the team sacrifices under pressure. But now comes the part that makes the pit crew's heart race: the race is live and you NEED to update the car without pulling anyone out of the fight. Welcome to the art of the pit stop. Stage 03, HERE WE GO!",
  },

  {
    id: "m3",
    num: "03",
    navTitle: "Rollouts",
    tag: "the pit straight",
    title: "Update strategies and rollouts",
    narration:
      "Friday, production is running, and you need to ship v2 without the public noticing. This is the sector of steel nerves: a mistimed pit stop throws away the lead. Here we learn to swap everything with the car still moving. BREATHE, and come with me.",
    lead: "Friday, 4pm. You need to ship v2 of the API. Take everything down at once to bring up the new version, and the service goes dark in the middle of the day. Ship it wrong with no fast way back, and the weekend turns into an on-call marathon. Worse still: if v2 is incompatible with v1 because of a database migration, running both at once corrupts data.",
    concept: [
      "It's the pit stop dilemma in a long race. RollingUpdate is swapping the cars' setup one pit stop at a time, with the rest of the team still scoring points on track (the operation never stops). Recreate is the red flag: calls everyone into the garage at once, stops everything, but guarantees no car ever runs on half-old, half-new parts, there's never a mix of old and new spec on track at the same time.",
      "RollingUpdate (the default) delivers zero downtime: it replaces pods gradually, spinning up a new ReplicaSet and scaling the old one down proportionally. Two parameters control the pace. maxUnavailable is the brake: how many pods can be unavailable during the swap (default 25%), guaranteeing a floor for availability. maxSurge is the power: how many pods above the desired count can exist temporarily (default 25%), the T-cars that speed up the round of swaps. With N replicas and the defaults, during a rollout you have at least 75% available and at most 125% running. You can't set both maxUnavailable and maxSurge to zero (the swap queue would jam).",
      "Recreate guarantees full consistency, at the cost of downtime: it tears down all of v1 before bringing up v2. It guarantees the two versions never coexist, which you need when v1 and v2 are incompatible (a database migration that breaks the old version). The tuning trade-off: a high maxUnavailable speeds things up but shrinks capacity (latency spikes); a high maxSurge speeds things up but doubles pods, which doubles connections, which can saturate the database. Two recipes: availability-first (maxUnavailable: 0, generous maxSurge) or minimum-time under a budget (push the peak and accept the minimum tolerable degradation).",
      "Guarantee tools: minReadySeconds (the pod must stay Ready for X seconds before it counts as available); progressDeadlineSeconds (default 600s; if the rollout stalls, it's flagged ProgressDeadlineExceeded, but the Deployment does NOT roll back on its own, you decide whether to go back); revisionHistoryLimit (default 10, how many revisions are kept for rollback). A rollout only fires on a change to .spec.template, scaling replicas alone doesn't count. More sophisticated strategies (Blue/Green, Canary) aren't native to Deployment; controllers like Argo Rollouts and Flagger add them with automated promotion gates.",
    ],
    pointsTitle: "Key concepts in this stage",
    points: [
      {
        t: "RollingUpdate (default)",
        d: "Replaces pods gradually while keeping the service up: spins up a new ReplicaSet and scales the old one down proportionally. Zero downtime: swaps the setup car by car while the others keep lapping.",
        color: "signal",
      },
      {
        t: "maxUnavailable (the brake)",
        d: "How many pods can be unavailable during the swap. Guarantees a floor for availability. Default 25%. How many cars you'll accept in the garage without emptying the track.",
        color: "ember",
      },
      {
        t: "maxSurge (the power)",
        d: "How many pods above the desired count can exist temporarily. Speeds things up by creating extras (the T-cars). Default 25%. Setting both to zero is forbidden (the swap queue jams).",
        color: "blue",
      },
      {
        t: "Recreate",
        d: "Tears down ALL of v1 before bringing up v2. Causes downtime, but guarantees the two versions never coexist, needed when v1 and v2 are incompatible (a database migration). The red flag.",
        color: "violet",
      },
      {
        t: "Rollout guarantees",
        d: "minReadySeconds (only counts as ready after X s stable), progressDeadlineSeconds (detects a stall, but does NOT roll back on its own), revisionHistoryLimit (revisions kept). A rollout only fires on a change to .spec.template.",
        color: "teal",
      },
    ],
    examplesTitle: "YAML and commands in practice",
    examples: [
      {
        label: 'an "availability-first" RollingUpdate',
        lang: "yaml",
        code: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
  annotations:
    kubernetes.io/change-cause: "Rollout v2.0.0"   # shows up in the rollout history
spec:
  replicas: 10
  minReadySeconds: 30           # a pod only "counts" after 30s stable Ready
  progressDeadlineSeconds: 600  # stalled for 10min, flags ProgressDeadlineExceeded
  revisionHistoryLimit: 10      # keeps 10 revisions for rollback
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 0         # BRAKE: never drops below minimum capacity
      maxSurge: "50%"           # POWER: creates up to 5 extra pods to speed things up
  selector: { matchLabels: { app: myapp } }
  template:
    metadata: { labels: { app: myapp } }
    spec:
      containers:
        - name: app
          image: myregistry/myapp:2.0.0
          readinessProbe:        # without readiness, the rollout "lies" about being ready
            httpGet: { path: /healthz, port: 8080 }`,
      },
      {
        label: "rollout + rollback from scratch",
        lang: "sh",
        code: `# 1) Create and wait until it's ready
kubectl create deployment web --image=nginx:1.25 --replicas=3
kubectl rollout status deployment/web

# 2) Update the image (fires the rollout because it changes the template)
kubectl set image deployment/web nginx=nginx:1.27
kubectl rollout status deployment/web

# 3) See BOTH ReplicaSets (the old one at zero, the new one with 3)
kubectl get rs -l app=web

# 4) Roll back and confirm it's on 1.25 again
kubectl rollout undo deployment/web
kubectl describe deployment web | grep Image

# 5) Clean up
kubectl delete deployment web`,
        note: "In step 3 there are two ReplicaSets: Kubernetes doesn't delete the old one, it scales it to zero. That's what makes the undo instant: the qualifying setup stays saved in the system, and reloading it takes seconds because it was never deleted.",
      },
    ],
    commands: [
      {
        cmd: "kubectl rollout status deployment/myapp",
        note: "tracks the rollout (exits non-zero if the deadline is blown)",
      },
      {
        cmd: "kubectl rollout history deployment/myapp",
        note: "lists revisions (with the change-cause)",
      },
      {
        cmd: "kubectl rollout undo deployment/myapp",
        note: "reverts to the previous revision (--to-revision=N for a specific one)",
      },
      {
        cmd: "kubectl rollout pause/resume deployment/myapp",
        note: "freezes/resumes mid-rollout (useful for a manual canary)",
      },
    ],
    handsOnIntro: "Run a rollout and a rollback from scratch and watch the ReplicaSets:",
    handsOn: [
      "Create it and wait until it's ready: kubectl create deployment web --image=nginx:1.25 --replicas=3 and kubectl rollout status deployment/web.",
      "Update the image (fires the rollout because it changes the template): kubectl set image deployment/web nginx=nginx:1.27 and track it with rollout status.",
      "See BOTH ReplicaSets (the old one at zero, the new one with 3): kubectl get rs -l app=web.",
      "Roll back and confirm it's on 1.25 again: kubectl rollout undo deployment/web and kubectl describe deployment web | grep Image.",
      "Clean up: kubectl delete deployment web.",
    ],
    tip: "Always fill in kubernetes.io/change-cause (or use --record). Without it, the rollout history is blind and you won't know which revision to go back to when the incident hits at 3am. It's your setup log: fail to note down what changed and why, and when the car goes off you're guessing in the dark, mid-race.",
    takeaway:
      "RollingUpdate is zero-downtime with a brake (maxUnavailable) and power (maxSurge); the undo is instant because the old ReplicaSet is kept around, just scaled to zero. Just like a qualifying setup that stays saved: going back to it is a reload, not a rebuild.",
    outro:
      "WHAT A PIT STOP, LADIES AND GENTLEMEN! Sector 3 green, the car changed setup on the move and we still have the undo button in hand. But now we level up how the team is organized: how do you build EVERY car from the same mold, changing only the setup sheet? Helm takes the wheel. Stage 04!",
  },

  {
    id: "m4",
    num: "04",
    navTitle: "Helm",
    tag: "behind the scenes at the factory",
    title: "Package management with Helm Charts",
    narration:
      "Far from the cameras, the championship gets built at the factory. Same chassis all year, a different setup sheet for every circuit. Enough copy-pasting YAML and hoping you didn't forget anything. Helm is Kubernetes's apt, and it's about to organize your garage. Come into the workshop!",
    lead: "You've got dev, staging, and prod. Each environment needs the same ~15 YAML manifests, changing only replicas, image tag, and resources. You copy-paste everything three times. Then one day you change a label on the prod Deployment, forget to replicate it in staging, and spend the week chasing why \"it works in staging but not in prod\". That's a DRY violation and a factory for bugs.",
    concept: [
      "Helm is Kubernetes's apt/yum. Think of the car's build mold: the chassis, the suspension philosophy, the aero architecture stay the same base all year. What changes from circuit to circuit is the setup sheet: low wing at Monza vs. high downforce at Monaco, tyre pressure, engine map. You don't redesign the car for every Grand Prix; you only swap the ingredients that vary (the values) inside the same mold (the template).",
      "Anatomy of a Chart: Chart.yaml holds the metadata: version is the chart's version and appVersion is the version of the packaged application (both SemVer; keeping them separate helps governance). values.yaml holds the configurable defaults (replicas, image, port, resources), and everything that varies per environment lives here. templates/ are the manifests written as Go templates plus Sprig functions, where {{ .Values.replicaCount }} injects a value and helpers in _helpers.tpl avoid repeating logic.",
      "The theoretical insight: a Helm template is a pure function T(values) → YAML: same inputs, same output, predictable and testable (helm template renders without applying). It's the simulator: you feed it the setup sheet and it hands back exactly how the car will turn out, without ever touching the track. That embodies two pillars of Infrastructure as Code: idempotence (applying it N times has the same effect as applying it once) and immutability (it doesn't mutate the existing object, it creates a new version and keeps the history, which is what makes rollback reliable).",
      "Lifecycle: helm install (creates and records the release in a Secret) → helm upgrade (computes the diff and applies only the changes) → helm rollback (returns to a saved revision). Helm 3 has no central server (no Tiller): the client uses your kubectl credentials directly, so the user's RBAC limits what Helm can do. At scale, charts follow SemVer, get distributed through repositories (Artifact Hub, private ones), can be digitally signed (GPG + .prov) to protect the supply chain, and should embed least-privilege RBAC. Combined with GitOps (ArgoCD/Flux), every release becomes an auditable commit.",
    ],
    pointsTitle: "Key concepts in this stage",
    points: [
      {
        t: "Chart.yaml",
        d: "Metadata. version is the chart's version (the mold); appVersion is the packaged application's version. Both SemVer, and keeping them separate lets the chart evolve without swapping the app.",
        color: "blue",
      },
      {
        t: "values.yaml",
        d: "The configurable defaults (replicas, image, port, resources). Everything that varies per environment lives here. The setup sheet per circuit.",
        color: "signal",
      },
      {
        t: "templates/",
        d: "The manifests as Go templates plus Sprig functions. {{ .Values.replicaCount }} injects the value; helpers in _helpers.tpl avoid repetition. The mold that receives the numbers from the setup sheet.",
        color: "violet",
      },
      {
        t: "Pure function",
        d: "A template is T(values) → YAML: same inputs, same output. helm template renders without applying (the simulator). Backs idempotence (applying N times = applying once) and immutability (new version, history preserved).",
        color: "teal",
      },
      {
        t: "Helm 3, no Tiller",
        d: "No central server: the client uses your kubectl credentials directly, so your RBAC limits what Helm can do. The operator's badge defines what the mold is allowed to build.",
        color: "ember",
      },
    ],
    examplesTitle: "YAML and commands in practice",
    examples: [
      {
        label: "Chart.yaml: the package's identity",
        lang: "yaml",
        code: `# Chart.yaml: the package's identity
apiVersion: v2
name: myapp
version: 0.1.0          # CHART version (the mold)
appVersion: "1.0.0"     # packaged APPLICATION version (the cake)
type: application`,
      },
      {
        label: "values.yaml",
        lang: "yaml",
        code: `# values.yaml: everything that varies per environment lives here
replicaCount: 2
image:
  repository: myregistry/myapp
  tag: "1.0.0"
  pullPolicy: IfNotPresent
service: { type: ClusterIP, port: 80 }
resources:
  requests: { cpu: 250m, memory: 128Mi }
  limits:   { cpu: 500m, memory: 256Mi }`,
      },
      {
        label: "templates/deployment.yaml (excerpt)",
        lang: "yaml",
        code: `# templates/deployment.yaml (excerpt): the mold consuming the values
spec:
  replicas: {{ .Values.replicaCount }}          # injects the value from values.yaml
  template:
    spec:
      containers:
        - name: {{ .Chart.Name }}               # uses the name defined in Chart.yaml
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
          resources:
            {{- toYaml .Values.resources | nindent 12 }}  # serializes the whole block,
                                                          # indented 12 spaces`,
      },
      {
        label: "the pure function in the simulator",
        lang: "sh",
        code: `# 1) Create a sample chart
helm create demo

# 2) Render with the default value (notice replicas: 1)
helm template demo | grep -i replicas

# 3) Render changing ONLY the input; the output changes predictably
helm template demo --set replicaCount=4 | grep -i replicas

# 4) Validate the chart
helm lint demo`,
        note: "The same template produces replicas: 1 in step 2 and replicas: 4 in step 3. Different input, deterministic output. That's idempotence/immutability in practice, tested before it ever touches a real cluster: it ran in the simulator before the car went on track.",
      },
    ],
    commands: [
      { cmd: "helm create <chart>", note: "generates the basic structure" },
      {
        cmd: "helm template ./chart",
        note: "renders the YAML without applying it (local dry-run; proves it's a pure function)",
      },
      { cmd: "helm install <release> ./chart -n <ns>", note: "installs it" },
      {
        cmd: "helm upgrade <release> ./chart --set image.tag=1.1.0 --atomic",
        note: "upgrades it (--atomic rolls everything back on failure)",
      },
      {
        cmd: "helm history <release> / helm rollback <release> <rev>",
        note: "history and rollback",
      },
      {
        cmd: "helm lint ./chart",
        note: "validates best practices (the technical inspection before hitting the track)",
      },
    ],
    handsOnIntro: 'See the "pure function" with your own eyes, without touching any cluster:',
    handsOn: [
      "Create a sample chart: helm create demo.",
      "Render with the default value: helm template demo | grep -i replicas (notice replicas: 1).",
      "Render changing ONLY the input: helm template demo --set replicaCount=4 | grep -i replicas, and the output changes predictably.",
      "Validate the chart: helm lint demo. You tested everything without touching any cluster: it ran in the simulator before the car went on track.",
    ],
    tip: "Run helm diff upgrade (the helm-diff plugin) before applying to production. Seeing exactly what will change in the cluster avoids the number-one fear of anyone starting out with Helm: applying a template \"blind\". It's comparing the new setup sheet against what's currently on the car before you touch the jack.",
    takeaway:
      "A Chart is a mold (templates) plus ingredients (values); because the template is a pure function, helm template lets you check the result before touching the cluster. Same car mold, a setup sheet per circuit, and the simulator shows you the result before the track does.",
    outro:
      "SECTOR 4 CLOSED with the garage running like clockwork! The factory is dialed in, every car comes off the same mold with the right setup sheet. Now we're back to Sunday's ADRENALINE: how do you ship v2 with an INSTANT undo button? The T-car is warmed up behind the scenes. Stage 05, Blue/Green. Hold on to that feeling!",
  },

  {
    id: "m5",
    num: "05",
    navTitle: "Blue/Green",
    tag: "the warmed-up T-car in the garage",
    title: "Blue/Green deployment",
    narration:
      "Imagine having a spare car, same team, new setup, engine at temperature, READY to take over in the blink of an eye. That was the spirit of the spare-car era, before 2008, when a driver could switch to the spare on the grid and still start the race. That's the spirit of Blue/Green: flip the switch and be back in seconds. Radio's live in the garage!",
    lead: "You shipped v2, it passed every test, but in production, with real traffic and real data, a critical bug showed up 3 minutes later. With RollingUpdate, rolling back means running another full rollout, which takes minutes while customers suffer. You wanted an instant undo button.",
    concept: [
      "It's the T-car (spare car), already built and warmed up behind the scenes. The Blue car is the one on track serving the public (traffic); Green is the spare: same team, new setup, engine already at temperature, ready to take over. Once you've validated Green, you swap cars instantly: the public sees Green right away. Something goes wrong? You're back on Blue in seconds, because it was never torn down, it stayed warm and waiting.",
      "The core idea: keep two identical production environments. Blue is the current version serving 100% of the traffic; Green is the new version, ready and \"warm\", but with no traffic. Once Green is validated, you flip the switch and it takes over everything. In Kubernetes, the two sets of pods carry different labels (env: blue, env: green) and a single Service points to one of them via its selector. Promotion is just a patch to the Service's selector, and kube-proxy reconfigures routing in an instant. Rollback is the reverse patch. It's an atomic transition between two states (B → G) with deterministic rollback.",
      "The traps: data/schema consistency is the Achilles' heel. If Green changes the database in an incompatible way, reverting to Blue breaks it. The fix is temporary dual compatibility (Martin Fowler): migrate the database to support both versions first, validate it, and only then switch the code. This is where the T-car analogy starts to strain: if the new car \"rewrites the track layout\" itself, meaning the database schema, going back to the old car doesn't help, the track has already changed underneath it. That's why backward-compatible migration comes before the switch.",
      'Cost: two full environments means roughly 100% overhead during the transition (Etsy has run as high as 200% capacity). Good practice: scale the inactive environment to zero once things stabilize. Connection storm: switching 100% at once dumps the whole load on Green suddenly, and cold caches can cause a spike; mitigate it by warming Green up with shadow traffic beforehand. Classic anti-pattern: not treating Green as production all the time. If you let changes pile up waiting for the "right moment", the Blue-to-Green jump gets huge and risky. Tools: Argo Rollouts supports blueGreen natively; Flagger integrates with a service mesh (also called Red/Black at Netflix/Spinnaker).',
    ],
    pointsTitle: "Key concepts in this stage",
    points: [
      {
        t: "Two identical environments",
        d: 'Blue = current version serving 100% of traffic; Green = new version, ready and "warm", no traffic. Validate Green, flip the switch, it serves everything. Something breaks? Flip back in seconds.',
        color: "blue",
      },
      {
        t: "Flipping the switch",
        d: "The two sets carry different labels (env: blue/green); a Service points to one via its selector. Promotion is a patch to the selector, and kube-proxy reconfigures instantly. Rollback is the reverse patch.",
        color: "signal",
      },
      {
        t: "Data consistency (the Achilles' heel)",
        d: "If Green changes the database incompatibly, reverting to Blue breaks it. Fix: temporary dual compatibility, migrating the database to support BOTH versions BEFORE switching the code.",
        color: "ember",
      },
      {
        t: "Cost and connection storms",
        d: "Two environments means roughly 100% overhead (scale the inactive one to zero once stable). Switching 100% at once with cold caches causes a spike; warm Green up with shadow traffic first.",
        color: "violet",
      },
      {
        t: "Anti-pattern",
        d: 'Not treating Green as production all the time: letting changes pile up waiting for the "right moment" makes the jump huge and risky. Real Blue/Green means continuous deployment to the passive environment, just without traffic.',
        color: "teal",
      },
    ],
    examplesTitle: "YAML and commands in practice",
    examples: [
      {
        label: "Service pointing at BLUE",
        lang: "yaml",
        code: `# Service initially pointing at BLUE
apiVersion: v1
kind: Service
metadata: { name: myapp-service }
spec:
  selector: { app: myapp, env: blue }   # <- the "switch": flips to green on promotion
  ports: [ { port: 80, targetPort: 8080 } ]`,
      },
      {
        label: "promotion and rollback (patching the selector)",
        lang: "sh",
        code: `# Promotion Blue -> Green: just repatch the selector (flipping the switch)
kubectl patch service myapp-service \\
  -p '{"spec":{"selector":{"app":"myapp","env":"green"}}}'

# Rollback: the reverse patch, back in seconds (Green stays up, just without traffic)
kubectl patch service myapp-service \\
  -p '{"spec":{"selector":{"app":"myapp","env":"blue"}}}'`,
      },
      {
        label: "toy Blue/Green",
        lang: "sh",
        code: `# 1) Two "environments": what matters to the Service is the labels on the pod TEMPLATE
#    (the Service selects pods, not the Deployment object), so we set env=blue/green there:
kubectl create deployment blue  --image=nginx:1.25
kubectl create deployment green --image=nginx:1.27
kubectl patch deployment blue  -p '{"spec":{"template":{"metadata":{"labels":{"app":"bg","env":"blue"}}}}}'
kubectl patch deployment green -p '{"spec":{"template":{"metadata":{"labels":{"app":"bg","env":"green"}}}}}'

# 2) A Service pointing at BLUE
kubectl expose deployment blue --name=bg-svc --port=80 --selector='app=bg,env=blue'

# 3) See which pod is getting traffic (the BLUE pod's IP)
kubectl get endpoints bg-svc

# 4) Flip the switch to GREEN and watch the endpoints change
kubectl patch service bg-svc -p '{"spec":{"selector":{"app":"bg","env":"green"}}}'
kubectl get endpoints bg-svc

# 5) Clean up
kubectl delete deploy blue green; kubectl delete svc bg-svc`,
        note: "In step 3 the endpoint points at the blue pod's IP; after the patch (step 4), it points at the green pod, with nothing restarted. That's the switch flip: the pit wall simply changes cars without anyone visiting the garage.",
      },
    ],
    commands: [
      {
        cmd: "kubectl get endpoints myapp-service",
        note: "confirms which pods the Service is routing to (validates the switch)",
      },
      { cmd: "kubectl patch service ...", note: "executes the switch flip (patches the selector)" },
      {
        cmd: "kubectl scale deployment myapp-blue --replicas=0",
        note: "shuts down the old environment once stable",
      },
    ],
    handsOnIntro: "Build a toy Blue/Green and flip the switch while watching the endpoints:",
    handsOn: [
      'Create two "environments": kubectl create deployment blue --image=nginx:1.25 and green --image=nginx:1.27.',
      "Set the labels on the pod TEMPLATE (the Service selects pods): patch blue with env=blue and green with env=green (app=bg).",
      "Expose a Service pointing at BLUE: kubectl expose deployment blue --name=bg-svc --port=80 --selector=app=bg,env=blue.",
      "See which pod is getting traffic: kubectl get endpoints bg-svc (the blue pod's IP).",
      "Flip the switch to GREEN: kubectl patch service bg-svc -p ... env green, and watch the endpoints change, nothing restarted.",
      "Clean up: kubectl delete deploy blue green; kubectl delete svc bg-svc.",
    ],
    tip: "Before flipping the switch, make sure the database accepts both versions. The question is always: \"if I need to revert to Blue five minutes from now, will the data Green wrote break Blue?\" If yes, you're not ready for the cutover. Only switch to the T-car when you're certain you can go back to the original without the track having changed underneath it.",
    takeaway:
      "Blue/Green is \"all or nothing\": promotion and rollback are a patch to the Service selector, instant, as long as the database is backward compatible. It's swapping cars on the spot, with the old one warm in the garage, and it only works if the track (the schema) hasn't changed underneath.",
    outro:
      "SECTOR 5 GREEN, a perfect switch flip! You've got the instant undo button in your pocket now. But Blue/Green throws 100% of the public onto v2 at once. What if the bug only shows up in 1 user out of 20? Then you don't risk both cars: you send ONE car to test the new part on track. The canary's in the cockpit. Stage 06!",
  },

  {
    id: "m6",
    num: "06",
    navTitle: "Canary",
    tag: "one car tests the new part",
    title: "Canary deployment",
    narration:
      "Ferrari doesn't put the new wing on both cars at once. They fit it to Leclerc's car, read the telemetry for a few laps, and only then release it to Hamilton. One feels the gas before anyone else: the old canary in the coal mine. It's the most surgical strategy on the grid, and it's our next corner. Telemetry live!",
    lead: "Blue/Green flips 100% of traffic at once. But what if v2 has a bug that only shows up under real load, in 1 out of every 20 users? Flipping everything at once exposes everybody at the same time. You wanted to test v2 with a small, real slice of users, measure it, and only then expand.",
    concept: [
      "It's sending a single car to test the upgrade under race conditions before rolling it out to both. Ferrari doesn't put the new wing on both cars at once: they fit it to Leclerc's car for a few laps, read the telemetry (lap-time delta, tyre temperature, degradation), and only then release it to Hamilton too. If the delta gets worse, they pull the part off that car and the rest of the fleet was never exposed. The name comes from the \"canary in the coal mine\": a small fraction feels the toxic gas before anyone else does.",
      'The core idea: instead of exposing everyone to v2, you send a small fraction of real users to it, monitor metrics, and only ramp up if things look fine. Blue/Green is "all or nothing" (100% at once); Canary is progressive (1% → 5% → 25% → 50% → 100%), validating at each step under real load. Both versions run side by side and you migrate traffic gradually.',
      "Fine-grained traffic routing: done by a service mesh (Istio, Linkerd) or a weighted ingress, letting you set exact percentages (e.g., 90% v1 / 10% v2) independent of how many replicas exist, through sidecar proxies. In Istio, a VirtualService splits traffic between subsets (v1/v2) and you adjust the weights dynamically. What decides whether to promote or roll back are real-time metrics: error rate (5xx), latency (p95, p99), resource usage, business metrics. That closes an automatable feedback loop: if the canary's error rate stays below the threshold, increase the weight; if it violates it, roll back to v1 immediately.",
      "Vocabulary worth knowing (deeper theory): a canary is a continuous A/B test, a statistical experiment between v1 (control) and v2, tested for significance (α = 0.05) via a z-test, chi-squared, or Mann-Whitney test (Netflix's Kayenta uses Mann-Whitney). Sequential tests (Wald's SPRT) stop early once there's enough evidence. Queueing theory: even 10% of traffic can have poor latency if that 10% nearly saturates the v2 pods (W = 1/(μ−λ) blows up near saturation). Multi-armed bandits (Thompson Sampling) allocate traffic adaptively. Real cases: Shopify sends ~5% for ~10min with automated analysis; Netflix automated the whole thing with Kayenta; Nubank uses feature flags plus canary for hundreds of deploys a day.",
    ],
    pointsTitle: "Key concepts in this stage",
    points: [
      {
        t: "Progressive rollout",
        d: "Instead of exposing everyone, sends a small fraction of real users to v2, monitors, and only ramps up if things look fine (1% → 5% → 25% → 50% → 100%). Both versions run side by side.",
        color: "signal",
      },
      {
        t: "Canary vs Blue/Green",
        d: 'Blue/Green is "all or nothing" (100% at once); Canary is progressive, validating at each step under real load. Fitting the new part car by car, measuring every stint.',
        color: "blue",
      },
      {
        t: "Fine-grained weighted routing",
        d: "Done by a service mesh (Istio, Linkerd) or a weighted ingress: exact percentages (e.g., 90/10) independent of replica count, through sidecar proxies. The engineer dials in the exact fraction.",
        color: "violet",
      },
      {
        t: "Data-driven decisions",
        d: "What decides promotion or rollback are real-time metrics: error rate (5xx), latency (p95/p99), resources, business metrics. Closes a loop: error below threshold, raise the weight; violated it, roll back immediately.",
        color: "ember",
      },
      {
        t: "SLO gate",
        d: "Tie the canary to your SLOs, not arbitrary metrics. Tools like Kayenta (Netflix) and Argo Rollouts run the statistical analysis for you. Set the delta limit BEFORE sending the car on track.",
        color: "teal",
      },
    ],
    examplesTitle: "YAML and commands in practice",
    examples: [
      {
        label: "traffic split with Istio (VirtualService)",
        lang: "yaml",
        code: `apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata: { name: myapp }
spec:
  hosts: [ myapp ]
  http:
    - route:
        - destination: { host: myapp, subset: v1 }
          weight: 90        # stable gets 90%
        - destination: { host: myapp, subset: v2 }
          weight: 10        # canary gets 10%, ramps up gradually`,
      },
      {
        label: "canary steps in Argo Rollouts",
        lang: "yaml",
        code: `# Argo Rollouts: the canary steps with a pause and automated analysis
strategy:
  canary:
    steps:
      - setWeight: 5                                   # sends 5% to v2
      - pause: { duration: 60s }                       # observe for 60s
      - analysis: { templates: [ { templateName: slo-check } ] }  # SLO gate
      - setWeight: 25                                  # if it passed, ramp to 25%
      - pause: { duration: 60s }
      - setWeight: 100                                 # full promotion`,
      },
      {
        label: "canary approximated with replicas",
        lang: "sh",
        code: `# 1) v1 with 9 replicas, v2 with 1 -> ~10% of traffic lands on v2
kubectl create deployment app-v1 --image=nginx:1.25 --replicas=9
kubectl create deployment app-v2 --image=nginx:1.27 --replicas=1
kubectl label deployment app-v1 app=canary --overwrite
kubectl label deployment app-v2 app=canary --overwrite
kubectl patch deployment app-v1 -p '{"spec":{"template":{"metadata":{"labels":{"app":"canary"}}}}}'
kubectl patch deployment app-v2 -p '{"spec":{"template":{"metadata":{"labels":{"app":"canary"}}}}}'

# 2) A single Service covers BOTH versions (same label app=canary)
kubectl expose deployment app-v1 --name=canary-svc --port=80 --selector='app=canary'

# 3) Confirm: 10 endpoints (9 v1 + 1 v2) behind the Service
kubectl get endpoints canary-svc -o wide

# 4) "Promote": raise v2 and lower v1 (25% -> 50% -> 100%)
kubectl scale deployment app-v2 --replicas=3
kubectl scale deployment app-v1 --replicas=1

# 5) Clean up
kubectl delete deploy app-v1 app-v2; kubectl delete svc canary-svc`,
        note: 'The Service lists every pod from both versions as endpoints; changing the replica ratio changes the traffic split. With replicas you only get "rough" fractions (10%, 25%...). That\'s why a service mesh, which weighs by percentage independent of replica count, is superior for a real canary.',
      },
    ],
    commands: [
      {
        cmd: "kubectl -n istio-system get virtualservice",
        note: "inspects the traffic rules",
      },
      {
        cmd: "kubectl argo rollouts get rollout myapp --watch",
        note: "tracks the canary (Argo Rollouts plugin)",
      },
      {
        cmd: "kubectl argo rollouts promote myapp / abort myapp",
        note: "promotes or aborts manually",
      },
    ],
    handsOnIntro:
      "Without Istio installed, you can approximate a canary effect through the replica ratio behind the same Service (the balancing stays proportional to pod count):",
    handsOn: [
      "Create v1 with 9 replicas and v2 with 1 (~10% of traffic lands on v2): kubectl create deployment app-v1 --image=nginx:1.25 --replicas=9 and app-v2 --image=nginx:1.27 --replicas=1.",
      "Give both the same label app=canary, including on the pod template (via patch).",
      "Expose a Service that covers BOTH versions: kubectl expose deployment app-v1 --name=canary-svc --port=80 --selector=app=canary.",
      "Confirm 10 endpoints (9 v1 + 1 v2): kubectl get endpoints canary-svc -o wide.",
      '"Promote" by adjusting replicas: kubectl scale deployment app-v2 --replicas=3 and app-v1 --replicas=1.',
      "Clean up: kubectl delete deploy app-v1 app-v2; kubectl delete svc canary-svc.",
    ],
    tip: 'Tie the canary to your SLOs, not arbitrary metrics. If your error SLO is 0.1%, the canary should brake automatically the moment v2 violates that. That way production monitoring and deploy monitoring become the same thing, and promoting stops being a "gut call". Set the delta limit up front: "if it crosses +0.3s per lap or 110°C tyre temp, abort." Clear number, automatic decision.',
    takeaway:
      "Canary is a progressive rollout with a metrics gate at every step; the ideal weight comes from a service mesh (independent of replica count), and the promotion decision should come from your SLO. One car tests the new part for a few laps, telemetry decides, and only then does the whole team get it.",
    outro:
      "SECTOR 6 DONE, canary approved! You now know how to ship without fear, the most surgical way on the grid. We've hit the second half of the race, and now the question changes scale: what happens when there isn't enough GARAGE space for the cars coming in? Who builds the pit on demand? Logistics takes the wheel. Stage 07, floor it on the back straight!",
  },

  {
    id: "m7",
    num: "07",
    navTitle: "Karpenter",
    tag: "on-demand infrastructure power",
    title: "Node scalability with Karpenter",
    narration:
      "In a flash sale, the HPA asks for 20 pods and... there's no garage for anyone. The cars queue up in the pit lane. It's like a back-to-back race weekend where the team has to build the structure on the spot, in the right place, with the cheapest material available. Karpenter is the fastest logistics manager in the paddock. Foot down!",
    lead: "So far you've scaled pods. But in a flash sale the HPA asks for 20 new pods and... there's no node to put them on. The pods sit Pending and the service can't keep up with demand. The traditional Cluster Autoscaler would solve it, but it's slow and depends on fixed node groups (ASGs) pre-configured by type/zone, a pain to maintain. And it often spins up a giant node for one small pod, wasting money.",
    concept: [
      "It's the difference between two ways of building a garage in the pit lane. The Cluster Autoscaler is having fixed-size garage contracts, booked months in advance: a small car shows up and you're forced to open a giant garage, paying for the empty space. Karpenter is the logistics manager who looks at exactly how many cars, and what size, just arrived, and builds the right-sized garage on the spot, choosing even the cheapest material available, then tears it down the moment it's empty.",
      "Karpenter = just-in-time node autoscaling. Built by AWS (open source, now multicloud), it provisions nodes sized to the pending pods, without fixed groups: faster (seconds to under a minute), picks the optimal instance (including Spot), and removes idle nodes on its own. Companies report savings of up to 30%. The flow: pods become unschedulable (the scheduler can't find a node) → Karpenter watches → calculates which instance best fits those pods → provisions it → the pods get scheduled. In reverse, it spots underutilized nodes and consolidates: moves the pods elsewhere and removes the idle node, or swaps an expensive On-Demand instance for a cheaper Spot one.",
      "Configuration via NodePools (formerly called Provisioners): they define the rules for the nodes Karpenter is allowed to launch: instance types, zones, Spot vs. On-Demand, limits. Recommendation: restrict as little as possible, to give Karpenter room to optimize. Why it's clever: the underlying problem is multidimensional bin packing (NP-hard); it uses a greedy heuristic (filters out unfit types, sorts by cost/fit, does something close to First-Fit Decreasing). Key difference: the Cluster Autoscaler preserves homogeneity within a group (a small pod can trigger a big node); Karpenter does right-sizing, a small node for a small pod.",
      "Spot and cost: Spot instances cost roughly 70-90% less, but can be pulled back with short notice (2 minutes on AWS). They're borrowed material the supplier can reclaim at any time: cheap, but you need a plan B. Karpenter handles this with proactive interruption: it detects the warning, marks the node as terminating, applies a taint, and drains the pods elsewhere before the cutoff. It also respects PodDisruptionBudgets, never consolidating or terminating nodes if that would violate the budget. Best practices: a PDB to control how many pods go down together, Topology Spread to distribute replicas, and separate NodePools for critical workloads (On-Demand) vs. tolerant ones (Spot).",
    ],
    pointsTitle: "Key concepts in this stage",
    points: [
      {
        t: "Just-in-time node autoscaling",
        d: "Provisions nodes sized to the pending pods, with NO fixed groups: fast (seconds to under a minute), picks the optimal instance (including Spot), removes idle nodes on its own. Up to ~30% savings.",
        color: "signal",
      },
      {
        t: "The flow",
        d: "Pods become unschedulable → Karpenter watches → calculates the best-fitting instance → provisions it → pods get scheduled. In reverse, it consolidates underutilized nodes: moves pods and removes the idle one.",
        color: "blue",
      },
      {
        t: "NodePools",
        d: "Define the rules for nodes Karpenter can launch (types, zones, Spot vs. On-Demand, limits). Recommendation: restrict as little as possible, to give it room to optimize.",
        color: "violet",
      },
      {
        t: "Right-sizing vs. Cluster Autoscaler",
        d: "The CA preserves group homogeneity (a small pod can trigger a big node); Karpenter does right-sizing, a small node for a small pod. It's NP-hard bin packing solved by a greedy heuristic (First-Fit Decreasing).",
        color: "ember",
      },
      {
        t: "Spot and PodDisruptionBudget",
        d: "Spot costs ~70-90% less but can be pulled with short notice (2min). Karpenter does proactive interruption (drains before the cutoff) and respects the PDB, never pulling too many replicas at once.",
        color: "teal",
      },
    ],
    examplesTitle: "YAML and commands in practice",
    examples: [
      {
        label: "NodePool with Spot + On-Demand and consolidation",
        lang: "yaml",
        code: `apiVersion: karpenter.sh/v1
kind: NodePool
metadata: { name: default }
spec:
  template:
    spec:
      requirements:
        - key: karpenter.sh/capacity-type
          operator: In
          values: ["spot", "on-demand"]     # can use spot; falls back to on-demand if unavailable
        - key: kubernetes.io/arch
          operator: In
          values: ["amd64"]                  # restricts architecture
      nodeClassRef: { name: default }        # points at the infra config (AMI, subnets...)
  limits: { cpu: "1000", memory: 1000Gi }    # cost ceiling: never exceeded
  disruption:
    consolidationPolicy: WhenEmptyOrUnderutilized  # consolidates empty OR underutilized nodes
    consolidateAfter: 30s                          # hysteresis: waits 30s before acting`,
      },
      {
        label: "the trigger: a pod Pending for lack of a node",
        lang: "sh",
        code: `# 1) Ask for more CPU than any node in the cluster has (e.g., 100 cores)
kubectl create deployment faminto --image=nginx
kubectl set resources deployment faminto --requests=cpu=100

# 2) The pod stays Pending: no node can fit the request
kubectl get pods -l app=faminto           # STATUS = Pending

# 3) See why: it's EXACTLY the signal Karpenter listens for to provision
kubectl describe pod -l app=faminto | grep -A3 Events
#   -> "0/N nodes are available: Insufficient cpu" (FailedScheduling)

# 4) Clean up
kubectl delete deployment faminto`,
        note: "The FailedScheduling / Insufficient cpu event is the pod going unschedulable: the car showed up and there's no garage big enough for it. In a cluster running Karpenter, this exact event triggers provisioning of a right-sized node within seconds.",
      },
    ],
    commands: [
      {
        cmd: "kubectl get nodeclaims",
        note: "lists the nodes Karpenter provisioned (the garages built to spec)",
      },
      {
        cmd: "kubectl get pods --field-selector=status.phase=Pending",
        note: "shows the pods triggering provisioning (the cars waiting for a garage)",
      },
      { cmd: "kubectl describe nodepool default", note: "inspects the rules and limits" },
      {
        cmd: "kubectl get nodes -L karpenter.sh/capacity-type",
        note: "shows which nodes are Spot vs. On-Demand",
      },
    ],
    handsOnIntro:
      "Karpenter runs in the cloud, but you can see the trigger it watches for (a pod Pending for lack of a node) in any cluster:",
    handsOn: [
      "Ask for more CPU than any node has: kubectl create deployment faminto --image=nginx and kubectl set resources deployment faminto --requests=cpu=100.",
      "The pod stays Pending (no node fits the request): kubectl get pods -l app=faminto.",
      'See why, the signal Karpenter watches for: kubectl describe pod -l app=faminto | grep -A3 Events → "Insufficient cpu" (FailedScheduling).',
      "Clean up: kubectl delete deployment faminto.",
    ],
    tip: "Run stateless workloads that can tolerate interruption on Spot, and reserve On-Demand for what's critical/stateful, in separate NodePools. Combine with PodDisruptionBudget and Topology Spread so a Spot interruption never takes down too many replicas of a service at once. Borrowed material (Spot) only on the parts you can afford to lose; on the leader's car, only guaranteed materials.",
    takeaway:
      "Karpenter provisions the right node just-in-time in response to Pending pods, does right-sizing, and saves with Spot, always respecting the PodDisruptionBudget. It's the logistics manager building a garage to the exact size of the car, cheap material wherever it can, never emptying the whole team at once.",
    outro:
      "SECTOR 7 GREEN, what an overtake down the straight! You've solved GARAGE scaling. Now for the other side of the coin: sizing the PIT CREW to the queue of cars coming in, and pulling everyone back to zero in the quiet of the night. Scaling by event, not by effort. KEDA takes the stage. Stage 08!",
  },

  {
    id: "m8",
    num: "08",
    navTitle: "KEDA",
    tag: "event-driven scaling",
    title: "Application scalability with KEDA",
    narration:
      "No car coming into the garage, zero mechanics standing idle on the jack for nothing. A queue of 40 orders shows up? Open 4 stations right now. It empties out? Pull everyone back. What triggers it isn't how hard a mechanic is sweating, it's how many cars are in the queue. Event-driven scaling. Let's get into KEDA!",
    lead: "You have workers consuming orders off a queue. The standard HPA only knows how to scale by CPU/memory, but your bottleneck isn't CPU, it's the size of the order queue. Worse: at 3am the queue sits empty, and you're still paying for 3 pods standing around with nothing to do. You wanted to scale by queue size and drop to zero when there's no work.",
    concept: [
      "It's the pit crew sized to the queue of cars coming in. No car coming into the garage? Zero mechanics standing on the jack (the team doesn't pay people to do nothing). A car shows up? A crew steps up right away. A queue of 40 orders, each station handling 10 at a time? Open 4 stations. It empties out and stays empty for a while? Pull everyone back. What triggers it isn't one mechanic's effort (CPU), it's how many cars are in the queue (the event).",
      "KEDA = event-driven autoscaling. It scales based on external events (RabbitMQ/SQS/Kafka queues, Prometheus metrics, cron, etc.) and enables scale-to-zero: no pod consuming resources when the queue is empty. It complements the HPA, it doesn't replace it. How it works: you create a ScaledObject (the central CRD) pointing at a target Deployment and defining a trigger (e.g., a RabbitMQ queue, 1 pod per 10 messages). KEDA creates an HPA behind the scenes. Empty queue → keeps the Deployment at 0 pods; a message arrives → activates 1 pod immediately; the queue grows → the HPA calculates the pods (40 messages = 4 pods); the queue empties out past the cooldownPeriod → back to zero. Only KEDA has the authority to go to zero; the HPA alone goes from 1 to N (minReplicas ≥ 1).",
      "The theory (queueing theory): model events arriving at rate λ and each pod processing at rate μ; with c pods, capacity is c·μ. Stability condition: λ < c·μ (otherwise the queue grows without bound, and no autoscaling saves you). Little's Law (L = λ·W) relates average backlog L, arrival rate λ, and response time W: if the backlog is growing, either arrivals are too fast, or you're short on pods. The ideal autoscaler controls L to keep W within the SLO.",
      "The challenge: oscillation/jitter (pods scaling up and down repeatedly), caused by feedback delay and static thresholds. KEDA/HPA mitigations: hysteresis (~10%: only scales up past 110% or down below 90% of target); stabilization windows and cooldownPeriod; a dead band (different thresholds for scaling up vs. down: scale up at 100 msgs but only scale down below 20). KEDA is cloud-agnostic (AKS, EKS, GKE, on-prem) and extensible via external gRPC scalers. Typical case: an e-commerce site scaling order workers by queue size during flash sales, back to zero overnight.",
    ],
    pointsTitle: "Key concepts in this stage",
    points: [
      {
        t: "Event-driven autoscaling",
        d: "Scales by external events (RabbitMQ/SQS/Kafka queues, Prometheus, cron) and enables scale-to-zero: no pod when the queue is empty. Complements the HPA, doesn't replace it.",
        color: "signal",
      },
      {
        t: "ScaledObject and trigger",
        d: "The central CRD points at a Deployment and defines a trigger (e.g., 1 pod per 10 messages). KEDA creates an HPA behind the scenes. 40 messages = 4 pods; empty queue past the cooldownPeriod → back to zero.",
        color: "blue",
      },
      {
        t: "Only KEDA goes to zero",
        d: "The HPA alone goes from 1 to N (minReplicas ≥ 1); only KEDA has the authority to go to zero. The HPA always leaves one mechanic on standby; only KEDA closes the garage when no car is coming.",
        color: "violet",
      },
      {
        t: "Stability condition",
        d: "Model arrivals at λ and processing at μ with c pods: capacity c·μ. Stable only if λ < c·μ; otherwise the queue grows without bound and no autoscaling saves you. Little's Law: L = λ·W.",
        color: "ember",
      },
      {
        t: "Oscillation (jitter)",
        d: "Pods scaling up and down repeatedly. Mitigations: hysteresis (~10%: up past 110%, down below 90%), stabilization windows/cooldownPeriod, and a dead band (different thresholds for scaling up vs. down).",
        color: "teal",
      },
    ],
    examplesTitle: "YAML and commands in practice",
    examples: [
      {
        label: "ScaledObject scaling by a RabbitMQ queue",
        lang: "yaml",
        code: `apiVersion: keda.sh/v1alpha1
kind: ScaledObject
metadata: { name: worker-scaler }
spec:
  scaleTargetRef: { name: meu-deployment }   # the Deployment that will be scaled
  minReplicaCount: 0        # scale-to-zero: zero pods when there's no work
  maxReplicaCount: 5        # safety ceiling
  cooldownPeriod: 60        # wait 60s of an empty queue before zeroing out
  pollingInterval: 15       # checks the queue every 15s
  triggers:
    - type: rabbitmq
      metadata:
        queueName: minha-fila
        protocol: amqp
        mode: QueueLength
        value: "10"         # target: 1 pod for every 10 messages in the queue`,
      },
      {
        label: "scale-to-zero with a cron trigger",
        lang: "sh",
        code: `# Prerequisite: KEDA installed (helm repo add kedacore https://kedacore.github.io/charts && helm install keda kedacore/keda -n keda --create-namespace)

# 1) Any Deployment
kubectl create deployment cron-demo --image=nginx

# 2) A ScaledObject that keeps 0 pods and ramps to 3 during a time window
cat <<'EOF' | kubectl apply -f -
apiVersion: keda.sh/v1alpha1
kind: ScaledObject
metadata: { name: cron-demo }
spec:
  scaleTargetRef: { name: cron-demo }
  minReplicaCount: 0
  maxReplicaCount: 3
  triggers:
    - type: cron
      metadata:
        timezone: America/Sao_Paulo
        start: "0 * * * *"      # ramps up at minute 0 of every hour
        end: "30 * * * *"       # ramps down at minute 30
        desiredReplicas: "3"
EOF

# 3) Watch the Deployment: 0 outside the window; 3 inside it
kubectl get scaledobject cron-demo
kubectl get deployment cron-demo -w

# 4) Clean up
kubectl delete scaledobject cron-demo; kubectl delete deployment cron-demo`,
        note: "Outside the cron window, the Deployment sits at 0 replicas (a plain HPA would never do that) and returns to 3 inside the window. That's scale-to-zero, with no dependency on RabbitMQ: the garage closed when there's no race, and the crew back for the pit window.",
      },
    ],
    commands: [
      {
        cmd: "kubectl get scaledobject",
        note: "lists the ScaledObjects and the HPA generated behind them",
      },
      {
        cmd: "kubectl describe hpa <name>",
        note: "shows the scaling events (Scaled up to 4 replicas...)",
      },
      {
        cmd: "kubectl get deployment meu-deployment -w",
        note: "watches replicas climb/drop in real time",
      },
    ],
    handsOnIntro:
      "You can test KEDA without an external queue, using the cron trigger (which depends on nothing) to see scale-to-zero and reactivation:",
    handsOn: [
      "Prerequisite: KEDA installed (helm install keda kedacore/keda -n keda --create-namespace).",
      "Create any Deployment: kubectl create deployment cron-demo --image=nginx.",
      "Apply a ScaledObject with a cron trigger: minReplicaCount 0, maxReplicaCount 3, ramping up at minute 0 and down at minute 30 of every hour (timezone America/Sao_Paulo).",
      "Watch the Deployment: 0 outside the window; 3 inside it (kubectl get deployment cron-demo -w).",
      "Clean up: kubectl delete scaledobject cron-demo; kubectl delete deployment cron-demo.",
    ],
    tip: "Tune pollingInterval and cooldownPeriod to match the load's actual dynamics. Too short a cooldown kills healthy pods in the middle of a bursty load; too long wastes resources. And remember: if λ ≥ c·μ persistently, no autoscaling fixes it, the bottleneck is capacity or code, not pod count. Hiring another mechanic doesn't fix a garage that's slower than the cars arriving.",
    takeaway:
      "KEDA scales by events (queue, cron, metric) and is the only one that can go to zero; but if λ ≥ c·μ persistently, the problem is capacity, not the autoscaler. Pit crew sized to the queue of cars, pulled to zero in the quiet hours. But no amount of reinforcement saves a garage that's slower than the cars coming in.",
    outro:
      "SECTOR 8 DONE, scaling fully under control! Garages and crew now breathe with demand. One sector left, and it's the most unforgiving one. You don't lose a race on the track here, you lose it OFF it, in scrutineering. It's the final security chicane. Maximum focus, because the wrong badge costs you the championship. Stage 09, the decisive lap!",
  },

  {
    id: "m9",
    num: "09",
    navTitle: "Security",
    tag: "the final chicane",
    title: "Cluster security",
    narration:
      "The FIA doesn't forgive. We've seen cars win on track and get disqualified in scrutineering over a single regulation detail. It's the same in the cluster: one compromised container carrying the master key hands over the whole kingdom. Zero Trust, a badge with your name on it, a seal that expires on its own. It's the final corner, and it's where champions prove they deserve the trophy. FOCUS!",
    lead: "Your cluster runs multiple teams and services. One of them runs a dependency with a vulnerability and gets compromised. If that pod was using the default ServiceAccount with broad permissions (or worse, had a static AWS key baked into the container), the attacker just became king of the kingdom: reads secrets from every namespace, spins up mining pods, reaches into buckets. A single compromised container shouldn't be able to cost you the whole cluster.",
    concept: [
      "It's FIA paddock access control. Every team member gets a badge that opens only their own zone: the tyre mechanic doesn't walk into the strategy room, the data engineer doesn't touch the PU (ServiceAccount plus least-privilege RBAC). Nobody walks around with the circuit's master key. Badges expire at the end of the weekend and areas lock themselves automatically (TLS and short-lived tokens). It's the same philosophy as the rulebook, Zero Trust: nobody passes a gate without a verified credential, not even the team principal. Kubernetes security rests on three pillars: identity, authorization, and encryption.",
      "Identity (ServiceAccounts): every application should have its own ServiceAccount, never the default one. It gives the pod a token to talk to the API Server. Isolating identities per workload is what lets you contain the damage when a pod gets compromised: each role on the team with a badge bearing their own name, and if one falls into the wrong hands, you know exactly which zone was exposed and revoke just that one.",
      'Authorization (RBAC): grants permissions through Roles (namespaced) or ClusterRoles (cluster-wide), tied to subjects via RoleBindings. The model is a graph: Subject → RoleBinding → Role → Permission. Least privilege in practice: prefer a namespaced Role over a ClusterRole; grant only the verbs you need (get, list, never *) and only the resources you need. Kubernetes RBAC is static and additive (it only adds permissions, there are no denials), which makes it auditable. For conditional policies ("deny pods without limits", "only the stable image tag"), use OPA/Gatekeeper with the Rego language (Policy as Code).',
      "Federated cloud identity: applications need access to S3, buckets, Key Vault, without baking static keys into the container. The fix is federating the Kubernetes ServiceAccount with a cloud identity via OIDC, receiving short-lived tokens: IRSA (IAM Roles for Service Accounts) on EKS, Workload Identity on GKE and AKS. Real incidents prove the point: in the 2023 SCARLETEEL attack, the damage was contained because the pod's Role had a tightly scoped permission set; in the Tesla case (2018), a password-free dashboard plus broad AWS credentials on a pod led to cryptojacking. Encryption (cert-manager): automates the TLS lifecycle through CRDs (Issuer/ClusterIssuer issues; Certificate defines the CN, SANs, duration, and renewBefore), generates the CSR, signs it, fills in the Secret, and renews itself. Secret rotation uses an overlap window: old and new both valid at once until everyone has migrated, then the old one is invalidated.",
    ],
    pointsTitle: "Key concepts in this stage",
    points: [
      {
        t: "Identity: ServiceAccounts",
        d: "Every app with its OWN ServiceAccount, never the default. It gives the pod a token to talk to the API Server. Isolating identities per workload contains the damage when a pod is compromised. A badge with your name on it.",
        color: "blue",
      },
      {
        t: "Authorization: RBAC",
        d: "Permissions via Roles (namespaced) or ClusterRoles, tied together by RoleBindings (Subject → RoleBinding → Role → Permission). Least privilege: prefer a namespaced Role, only the verbs/resources you need, never a wildcard *.",
        color: "signal",
      },
      {
        t: "RBAC is additive and auditable",
        d: "Static and additive (only adds, never denies), which makes it auditable: you can deterministically list who can do what. For conditional policies, use OPA/Gatekeeper with Rego (Policy as Code).",
        color: "violet",
      },
      {
        t: "Federated identity (IRSA / Workload Identity)",
        d: "Access S3/buckets/Key Vault without static keys: federate the SA with a cloud identity via OIDC, getting short-lived tokens. IRSA on EKS, Workload Identity on GKE/AKS. The supplier's temporary badge.",
        color: "ember",
      },
      {
        t: "Encryption: cert-manager",
        d: "Automates the TLS lifecycle via CRDs: Issuer/ClusterIssuer (who issues) and Certificate (what to issue, with renewBefore). Generates the CSR, signs it, fills in the Secret, and renews itself. The FIA seals that expire and renew.",
        color: "teal",
      },
    ],
    examplesTitle: "YAML and commands in practice",
    examples: [
      {
        label: "SA + least-privilege Role + IRSA",
        lang: "yaml",
        code: `apiVersion: v1
kind: ServiceAccount
metadata:
  name: analytics-sa
  namespace: analytics
  annotations:
    eks.amazonaws.com/role-arn: arn:aws:iam::123456789012:role/S3Reader  # IRSA:
                                                       # federates this SA with an IAM Role
                                                       # (short-lived token, zero static keys)
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role                    # namespaced (limited to the analytics namespace), NOT ClusterRole
metadata: { name: analytics-read, namespace: analytics }
rules:
  - apiGroups: [""]
    resources: ["pods"]
    verbs: ["get", "list"]    # read-only on pods, no "*"
  - apiGroups: [""]
    resources: ["configmaps"]
    verbs: ["get"]            # only get on configmaps
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding             # ties the Role to the subject (the SA)
metadata: { name: bind-analytics-read, namespace: analytics }
roleRef: { apiGroup: rbac.authorization.k8s.io, kind: Role, name: analytics-read }
subjects:
  - kind: ServiceAccount
    name: analytics-sa
    namespace: analytics`,
      },
      {
        label: "cert-manager: a Certificate with automatic renewal",
        lang: "yaml",
        code: `# cert-manager: issues and renews internal TLS automatically
apiVersion: cert-manager.io/v1
kind: Certificate
metadata: { name: service-a-cert }
spec:
  secretName: service-a-tls   # where cert-manager writes tls.crt / tls.key
  duration: 2160h             # 90-day validity
  renewBefore: 360h           # renews 15 days BEFORE expiry (no intervention needed)
  commonName: service-a.default.svc.cluster.local
  dnsNames: [ service-a, service-a.default.svc.cluster.local ]  # SANs
  issuerRef: { name: cluster-ca-issuer, kind: Issuer }          # who signs it`,
      },
      {
        label: "least privilege with auth can-i",
        lang: "sh",
        code: `# 1) Namespace, SA, and a read-only Role on pods
kubectl create namespace lab
kubectl create serviceaccount leitor -n lab
kubectl create role ler-pods --verb=get,list --resource=pods -n lab
kubectl create rolebinding bind-leitor --role=ler-pods --serviceaccount=lab:leitor -n lab

# 2) CAN the SA list pods in the lab namespace?
kubectl auth can-i list pods -n lab --as=system:serviceaccount:lab:leitor
#   -> yes

# 3) CAN the SA delete pods? (we didn't grant "delete")
kubectl auth can-i delete pods -n lab --as=system:serviceaccount:lab:leitor
#   -> no

# 4) CAN the SA read Secrets? (we didn't grant that resource)
kubectl auth can-i get secrets -n lab --as=system:serviceaccount:lab:leitor
#   -> no

# 5) Clean up
kubectl delete namespace lab`,
        note: 'yes only for what you explicitly granted (list pods); no for everything else. That\'s RBAC additive and auditable in action: if a pod with this SA gets compromised, the attacker is stuck at "list pods in this namespace" and nothing more.',
      },
    ],
    commands: [
      {
        cmd: "kubectl auth can-i <verb> <resource> --as=system:serviceaccount:<ns>:<sa>",
        note: "tests whether an SA has a given permission (RBAC audit)",
      },
      {
        cmd: "kubectl get rolebindings,clusterrolebindings -A -o wide",
        note: "maps who has access to what",
      },
      {
        cmd: "kubectl get certificate -A",
        note: "state of the certificates managed by cert-manager",
      },
      {
        cmd: "kubectl create token <sa>",
        note: "generates a short-lived token for a ServiceAccount",
      },
    ],
    handsOnIntro: "Prove least privilege with kubectl auth can-i, no cloud required:",
    handsOn: [
      "Create a namespace, an SA, and a read-only Role on pods: kubectl create namespace lab; kubectl create serviceaccount leitor -n lab; kubectl create role ler-pods --verb=get,list --resource=pods -n lab; kubectl create rolebinding bind-leitor --role=ler-pods --serviceaccount=lab:leitor -n lab.",
      "CAN the SA list pods? kubectl auth can-i list pods -n lab --as=system:serviceaccount:lab:leitor → yes.",
      'CAN the SA delete pods? (we didn\'t grant "delete") → no.',
      "CAN the SA read Secrets? (we didn't grant that resource) → no.",
      "Clean up: kubectl delete namespace lab. A badge that opens only one door: whoever steals it is stuck in that one room.",
    ],
    tip: "Use kubectl auth can-i --as=... in CI to validate that your ServiceAccounts have exactly the permissions you expect and nothing more. Combine it with minimally-scoped IRSA/Workload Identity. That way, even if a container is compromised, the attacker is stuck with whatever that specific identity can do. Inspect credentials before the race weekend starts, not after the leak.",
    takeaway:
      "One SA per app, plus a namespaced Role with specific verbs, plus short-lived tokens (IRSA/Workload Identity): that's what turns a \"compromised container\" into a contained incident instead of a lost cluster. A badge with your name on it, opening only the right zone, expiring on its own: the paddock's Zero Trust, applied to the cluster.",
    outro:
      "CHECKERED FLAG IN SIGHT! The car got through the final chicane without touching a thing, scrutineering signed off, and the trophy is YOURS. Nine sectors completed start to finish. You're no longer a passenger in this cluster: you're the driver in command of the pit wall. It's been an honor calling this race!",
  },
];
