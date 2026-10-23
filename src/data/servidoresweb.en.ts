// Conteúdo das aulas 1-5 do módulo de Servidores Web e Balanceamento de Carga, em 14 etapas.
// A lente geral de F1 abre o guia (LENS) e cada etapa ensina o tópico só de forma técnica,
// sem repetir a analogia.
// Gerado de relatorios/servidores-web-nginx-apache/final.en.md por scripts/build-lens-guide.py.
// Para mudar o texto, edite o markdown e gere de novo; o markdown inline (`código`, **negrito**)
// é renderizado pelo LensKit.

import type { ChecklistGroup, GuideLens, TechLesson } from "@/components/guide/LensKit";

export type Lesson = TechLesson;

export const INTRO: string[] = [
  "This guide teaches, in 14 stages, the path a request takes from the browser to the application and how to configure each piece of that path. You begin by understanding what a web server is for, how HTTP evolved from version 1.1 to HTTP/3 and the difference between a forward proxy and a reverse proxy; then you study Apache's processing models (MPMs), Nginx's event-driven architecture, load balancing with its algorithms and health checks with failover and diagnosis of 502 and 504. On Kubernetes, you publish services with Ingress and automatic TLS through cert-manager and, with Istio, you study the service mesh architecture, gradual deployment with VirtualService and DestinationRule, and mTLS with authorization and observability; finally, you calculate availability targets (SLA and SLO), test the failover of a virtual IP with Keepalived and protect the edge with a WAF, rate limiting and HSTS. Before the stages, the next section introduces the F1 lens of the guide: a general comparison that shows the same path working inside a Formula 1 team.",
  'Each stage depends only on what was explained before it and ends with a small exercise that proves you understood. Servers are learned by taking pieces down and bringing them back up on purpose, so do not skip the "Hands-on" blocks.',
  "**What you need:** a terminal with `curl` and Docker (with Compose v2), which are enough for Stages 01 to 07, 13 and 14. Stages 08 to 12 run on Minikube and build on what the Kubernetes guides teach: Pods, Deployments, Services and `kubectl` with declarative YAML come from the Kubernetes basics guide, and Helm, used here to install cert-manager, is introduced in the advanced Kubernetes guide. If those topics are new to you, study those guides before Stage 08.",
  "**How to use this guide:** keep a terminal open next to the text. The labs assume Linux (Ubuntu or Debian), Docker with Compose v2 (the `docker compose` command), `curl`, `python3` and `openssl`. The `ab` utility (Apache Bench) comes in the `apache2-utils` package (`sudo apt install apache2-utils`). Organize the files in one folder per stage (`etapa01/`, `etapa02/` and so on), because names such as `compose.yaml` and `nginx.conf` repeat, and run `docker compose down` at the end of each stage before moving on. When an example shows the expected output, compare it with yours: versions, IPs, timings and counts will vary, and the structure of the output is what matters. Shortened outputs are marked with `(...)`, and outputs that depend on a version or on the environment are shown as approximate.",
  "**What runs where:** Stages 01 to 07, 13 and 14 run on Docker (Compose), without installing nginx or apache2 on your computer. Stage 04 brings, besides the Docker path, the equivalent commands for an Apache installed on the host (`sudo apt install apache2`), and Stage 05 can be repeated with an Nginx installed on the host (`sudo apt install nginx`). Stages 08 and 09 run on Minikube (with the `ingress` addon and cert-manager installed by Helm). Stages 10, 11 and 12 run on Minikube with Istio installed by `istioctl`; a profile with 4 CPUs and 8 GB of memory is recommended, adjusted to what your machine has. These stay read-only: issuing real certificates with Let's Encrypt (it requires a public domain), the circuit breaking policy with endpoint ejection and trace collection with Jaeger (it requires configuring a tracing provider). Stage 13 uses Docker on Linux, with network permission (`NET_ADMIN`) for Keepalived.",
];

export const LENS: GuideLens = {
  paragraphs: [
    "The Kubernetes guides presented the cluster as a Formula 1 team on a Grand Prix weekend. On the pit wall (the gantry facing the track) sit the engineers who decide, in the garages are the mechanics who execute, and the cars on the track do the work. Each car is called by its race number, the number that appears on the radio and in the timing, even when the chassis underneath it is swapped. This guide looks at the same team from another angle: where requests and people enter it, where they pass through and who answers. Around the garages is the paddock, the teams' work area, closed to the public. Only people with a credential get in, and entry is through turnstiles that read each person's pass.",
    "Inside the paddock, each team has a reception in its hospitality area (the motorhome, the structure where the team receives press and guests). Every request from outside arrives there. What is already ready, such as the press release or the session timing sheet, the reception hands over on the spot. The rest it forwards to whoever resolves it: a technical question goes to the responsible engineer, and the answer comes back through the reception. Whoever asked does not know which engineer answered or how many there are behind the reception, and the engineer receives, along with the question, a note saying who really asked. In the opposite direction, the exit also has a single point. When an engineer needs something from a supplier, the request goes through the purchasing department, which approves or refuses it, records it and places the order on behalf of the team. The supplier only knows the purchasing department.",
    "The team's conversations follow two formats. On the voice radio, between the race engineer (the person who follows a car from the pit wall) and the driver, only one speaks at a time: the engineer asks a question, waits for the answer and only then asks the next one, even if the second one were quick. Telemetry works differently. The car's sensors send data continuously to the garage, and hundreds of streams, each identified by its source sensor, travel together over the same link, with no stream waiting for another.",
    "The reception can organize its service in different ways. In one, each visitor gets a room and an attendant just for them: a problem in one room does not affect the others, but with hundreds of visitors there are not enough rooms. In another, a few rooms receive several attendants each, who share a desk and files: more people fit, but an attendant who knocks over the files disrupts the whole room. A variation of this second way puts a single person in charge of watching the visitors who are seated without asking for anything, and frees the attendants for those who are speaking. There is also a very different way: few attendants, one per desk, who never stand idle waiting. When the answer depends on an engineer, the attendant notes down the request, arranges to be notified when it arrives and serves the next person. With few people, the reception keeps track of many visitors at once.",
    "Many requests can be answered by any one of a group of data analysts who do the same work. Who decides which analyst receives each request is the reception itself, at the same counter where the request arrived, and not someone else somewhere else. It can take turns in order, give twice as many requests to the faster analyst, choose whoever has the fewest open requests or always send a car's requests to the same analyst, who already has that car's history on the desk. It can decide only by the sender (which car it came from) or read the request and send the aerodynamics question to whoever handles that.",
    "The reception also watches the health of the group. It notices when a request comes back unanswered and calls each analyst from time to time, like the radio check (the routine call on the radio to confirm that the channel works). Whoever does not answer leaves the roster, and a reserve analyst only comes in when all the regular ones are out.",
    "The reception does not invent where to send each request. It follows a routing sheet written by the team: questions about car 1 go to whoever answers to number 1, guests go to hospitality, suppliers go to logistics. The sheet only works because someone at the reception reads it and acts; a sheet pinned to a door with nobody there routes nothing. The reception also needs to prove that it really belongs to the team. It shows a credential issued by the event's accreditation office, which any visitor can check. Each credential has a validity period, and whoever looks after the passes asks for renewal before it expires, without waiting for someone to notice that it has expired.",
    "Internally, the team talks over the intercom, the internal radio system with separate channels (strategy, car 1, car 2, garage). Each person uses a belt radio connected to the headset, and it is that device, not the person, that encrypts the conversation, repeats a message that was not acknowledged and records everything with timestamps. The rules for each device come from a control center, where the communications engineer defines the channels and who speaks on each. Only a radio registered to the pass of whoever uses it joins a channel, and being registered is not enough: the control center also says who may speak on the strategy channel. The timestamped recording makes it possible to reconstruct where a decision passed through and where it was slow.",
    "To debut something new, the team uses the cautious path from the advanced guide: the new part goes only on car 1, and car 2 keeps the old one. A new strategy software can run at the factory in parallel, receiving the same live data, without the pit wall using its answer. The team also avoids depending on a single piece. The garage radio has a main unit and a backup, which answer on the same channel: if the main one fails, the backup takes over, and whoever calls does not need to change channel. Each critical system has an uptime target, and the team rehearses the switchovers with failures provoked on purpose, with a time to start and a time to stop.",
    "At the entrance, protection also comes in layers. The paddock turnstile checks only the credential and the gate the person goes through. In hospitality, security searches what the person carries, adds up the suspicions and only stops whoever goes over a limit. And each press outlet has a maximum number of interview requests per day.",
  ],
  bridge: [
    "It is the same path that a request takes to the application. The reception is the web server in the role of reverse proxy: it delivers the static content (the ready press release), forwards the rest to the backend (the engineer) and writes the real client into X-Forwarded-For (the note). The purchasing department is the forward proxy. The rules of the conversation are HTTP: on the voice radio one speaks at a time and the second question waits for the first answer, as in HTTP/1.1, while telemetry, with many identified streams on the same link, is HTTP/2 multiplexing. The room per visitor is Apache's Prefork MPM, the rooms with several attendants are Worker, the person who watches those who only wait is Event, and the attendant who notes down and moves on to the next is the Nginx worker with its event loop.",
    "The reception, when it chooses the analyst, is the load balancer: the same Nginx that does the proxying, with the group of analysts declared in the upstream block. Deciding by sender is layer 4, reading the request is layer 7, and the four criteria are Round Robin, weight, least_conn and ip_hash. The periodic call is the active health check, the unanswered request is the passive one, and the reserve analyst is the backup server. The routing sheet is the Ingress, and whoever reads it at the reception is the Ingress Controller. The reception's credential is the TLS certificate, the accreditation office is the Issuer, and the renewal before expiry is the work of cert-manager.",
    "The intercom is the service mesh: the belt radio is the Envoy sidecar (the data plane), the control center of the communications engineer is Istiod (the control plane), and the message repeated without acknowledgment is the retry. The radio registered to the pass is mTLS, with identity derived from the ServiceAccount, the permission to speak on the channel is the AuthorizationPolicy, and the timestamped recording is distributed tracing. The part only on car 1 is the canary, and the software running in parallel is mirroring. The backup equipment on the same channel is the virtual IP moved by Keepalived, the uptime target is the SLO, and the failure rehearsals are chaos engineering. The turnstile is the network firewall, the search is the WAF, and the limit on interview requests is rate limiting.",
    "The rules of the Kubernetes guides still hold: each assembled chassis is a Pod, each garage is a node and the race number is the Service. This guide adds one: the reception is always the edge. Every request from outside passes through it before reaching any engineer, and whoever is behind it does not need to know how to deal with the queue, the credential or the search.",
  ],
  mappingNote:
    "The table below translates each technical term in the guide into an everyday idea, with no F1 and no jargon. You do not need to memorize it; come back to it whenever a term shows up in the text.",
  mapping: [
    {
      term: "Web server",
      plain:
        "The service counter of a building: it receives whoever arrives, hands over right away what is already ready (leaflets, forms) and forwards the more complicated requests to the responsible department.",
    },
    {
      term: "Backend (application server)",
      plain:
        "The department that actually resolves the request, such as the one that calculates the price of a delivery. It sits behind the counter and does not need to deal with the queue.",
    },
    {
      term: "Static content",
      plain:
        "Material that is the same for everyone, like a printed leaflet: you just hand over the file, with nothing to calculate.",
    },
    {
      term: "Request and response",
      plain:
        "The request the client makes and the answer that comes back, like handing in a form at the counter and getting the stamped form back.",
    },
    {
      term: "Header and status code",
      plain:
        'A header is the label stuck on a piece of mail, with information about it (who sent it, type of content). A status code is the result summarized in a number: 200 "all good", 404 "I could not find it", 502 and 504 "the department behind failed or took too long".',
    },
    {
      term: "TLS termination",
      plain:
        "Opening the sealed (encrypted) envelope at a single window at the entrance, instead of every department having to know how to open envelopes.",
    },
    {
      term: "Cache",
      plain:
        "A drawer with copies of answers that repeat, so you do not go to the archive for every request.",
    },
    {
      term: "Stateless",
      plain:
        "Every visit starts from zero, like a counter that does not recognize who has already been there. That is why the client carries a receipt (cookie) that identifies them.",
    },
    {
      term: "Cookie and session",
      plain:
        "The receipt the client shows on each visit (cookie) and the file the building keeps about them (session).",
    },
    {
      term: "Persistent connection (keep-alive)",
      plain:
        "Leaving the phone line open between one question and the next, instead of calling again for every question.",
    },
    {
      term: "Head-of-line blocking",
      plain:
        "A single-checkout line in which the first customer takes a long time and everyone behind waits, even with simple requests.",
    },
    {
      term: "Multiplexing",
      plain:
        "Several requests traveling together on the same line, each with its own number, so that one answer does not have to wait for another.",
    },
    {
      term: "HTTP/1.1, HTTP/2 and HTTP/3",
      plain:
        "Three generations of the rules of conversation between client and server, each created to eliminate a kind of waiting from the previous generation.",
    },
    {
      term: "QUIC",
      plain:
        "A way of delivering messages in which each conversation has its own conveyor belt, so a parcel lost on one belt does not stop the others.",
    },
    {
      term: "Proxy",
      plain:
        "An intermediary that receives a request and passes it on to another place on someone's behalf.",
    },
    {
      term: "Forward proxy",
      plain:
        "The exit gate of a company: employees only talk to the outside through it, and the outside only sees the gate.",
    },
    {
      term: "Reverse proxy",
      plain:
        "The reception of a company: whoever comes from outside talks only to the reception, which forwards each request to the right department without the visitor knowing how many departments exist.",
    },
    {
      term: "Upstream",
      plain: "The group of departments in the back, to which the reception forwards the requests.",
    },
    {
      term: "X-Forwarded-For",
      plain:
        "A note that the reception attaches to the request saying who really sent it, since the department in the back only sees the reception delivering it.",
    },
    {
      term: "Process and thread",
      plain:
        "A process is an independent workroom, with its own desk and files. A thread is a person working inside a room, sharing the desk and files with colleagues.",
    },
    {
      term: "Thread-safe",
      plain:
        "A tool that several people can use at the same time without getting in each other's way. A tool that is not thread-safe only works well when one person uses it at a time.",
    },
    {
      term: "MPM",
      plain:
        "The rule Apache uses to organize service: one room per client, a few rooms with several people, or people who watch several waiting clients.",
    },
    {
      term: "Prefork, Worker and Event",
      plain:
        "Apache's three organization rules: one isolated room per client; a few rooms with several people each; and the second rule with a way of not tying a person to a client who is only waiting.",
    },
    {
      term: "mod_php and PHP-FPM",
      plain:
        "In the first, the PHP program works inside Apache's room. In the second, it is a separate department that Apache calls when it needs it.",
    },
    {
      term: "Non-blocking I/O and event loop",
      plain:
        'Instead of standing in front of a client waiting for an answer, the attendant notes "tell me when it arrives" and serves another. The event loop is the cycle of looking at the list of notices, handling what is ready and going back to the list.',
    },
    {
      term: "Worker (Nginx)",
      plain: "Each attendant who runs that cycle; there is usually one per processor core.",
    },
    {
      term: "Load balancer",
      plain:
        "Whoever distributes requests among several identical counters, following a rule: taking turns, whoever has the shortest line or always the same counter for the same client.",
    },
    {
      term: "Layer 4 and layer 7",
      plain:
        "Layer 4 decides by looking only at address and port, like sorting letters by postal code without opening the envelope. Layer 7 opens and reads the content to decide.",
    },
    {
      term: "Round Robin, weight, least_conn and ip_hash",
      plain:
        "Taking turns in order; taking turns but giving the stronger counter more turns; choosing the counter with the fewest clients right now; and always sending the same client to the same counter, based on their address.",
    },
    {
      term: "Session affinity",
      plain:
        "Preferring that the same client is always served at the same counter, because their file is there.",
    },
    {
      term: "Passive and active health check",
      plain:
        "Passive: noticing that a counter is failing because real clients complained. Active: someone going by from time to time asking each counter whether it is working.",
    },
    {
      term: "Failover and backup server",
      plain:
        "Failover is redirecting service when a counter fails. The backup is a reserve counter, which only opens when the main ones are closed.",
    },
    {
      term: "Percentile (p95)",
      plain:
        "Saying that 95% of the customers were served faster than a certain time. It shows the experience of the slowest ones, which the average hides.",
    },
    {
      term: "stub_status",
      plain:
        "A simple panel on the counter that shows how many clients are being served right now.",
    },
    {
      term: "Ingress and Ingress Controller",
      plain:
        'The Ingress is the notice board at a condominium gatehouse ("block A goes to building 1, block B to building 2"). The Controller is the doorman who reads the board and acts. Without a doorman, the board changes nothing.',
    },
    {
      term: "ClusterIP, NodePort and LoadBalancer",
      plain:
        "Three ways of giving a stable address to a group of programs: for internal use only; a port on each machine; or an external address of its own.",
    },
    {
      term: "Annotation",
      plain:
        "An extra note stuck on a resource, which is only read by whoever knows how to interpret it.",
    },
    {
      term: "pathType",
      plain:
        "The rule that says whether an address must be exactly equal to the agreed one or only start the same as it.",
    },
    {
      term: "Certificate, ACME and Let's Encrypt",
      plain:
        "A certificate is the document that proves the site is who it says it is. ACME is the automatic protocol for requesting and renewing that document. Let's Encrypt is a free organization that issues it.",
    },
    {
      term: "SNI",
      plain:
        "The name of the destination the visitor says right at the start of the secure conversation, so that one entrance can present the right document for each site.",
    },
    {
      term: "Issuer, ClusterIssuer and Certificate",
      plain:
        "An Issuer is the registry office that issues documents for one area; a ClusterIssuer is the registry office for all areas; a Certificate is the request for one specific document.",
    },
    {
      term: "HTTP-01 and DNS-01",
      plain:
        "Two ways of proving to the registry office that the domain is yours: publishing a file on the site or publishing a record in the address directory (DNS).",
    },
    {
      term: "Secret",
      plain:
        "A small safe for passwords and keys. The content is only encoded; what protects it is the control over who can open the safe.",
    },
    {
      term: "Service mesh",
      plain:
        "A network of inspectors beside each program, who take care of the communication between them (resending, encryption, measurement) so that the programs do not have to.",
    },
    {
      term: "Sidecar and Envoy",
      plain:
        "A sidecar is the assistant who works beside the program, at the same desk. Envoy is the assistant that Istio uses.",
    },
    {
      term: "Data plane and control plane",
      plain:
        "The control plane is the center that decides the rules; the data plane is the assistants who apply them to each request.",
    },
    {
      term: "Istiod",
      plain: "Istio's center: it distributes rules, addresses and identities to the assistants.",
    },
    {
      term: "ServiceAccount",
      plain: "A program's badge inside the cluster, which says on whose behalf it works.",
    },
    {
      term: "VirtualService and DestinationRule",
      plain:
        "The first defines where each request goes (routes and percentages). The second gives names to the destination groups and defines rules about them.",
    },
    {
      term: "Subset",
      plain:
        'A named subgroup of identical programs with a label in common, for example "version 1".',
    },
    {
      term: "Canary, A/B and mirroring",
      plain:
        "Canary: testing with a few clients before releasing to everyone. A/B: giving different versions to groups chosen by some characteristic. Mirroring: sending a copy of the request to the new version only to observe, without handing its answer to the client.",
    },
    {
      term: "Retry and timeout",
      plain:
        "A retry is trying again a request that failed. A timeout is the maximum waiting time before giving up.",
    },
    {
      term: "Circuit breaking",
      plain:
        "The circuit breaker: stopping sending requests to a destination that is failing, so as not to make the situation worse.",
    },
    {
      term: "mTLS",
      plain:
        "Both ends show their badge to each other before talking, and the conversation is in code.",
    },
    {
      term: "PeerAuthentication and AuthorizationPolicy",
      plain:
        "The first requires a badge in the conversation. The second is the list of who, with a badge, may ask for what.",
    },
    {
      term: "Distributed tracing",
      plain:
        "A protocol number that follows a request through all the departments, to see where it took the longest.",
    },
    {
      term: "SLA and SLO",
      plain:
        "An SLA is the written promise to the client, with consequences if it fails. An SLO is the internal target, usually stricter.",
    },
    {
      term: "Error budget",
      plain: "The amount of failure the target allows in the period, like a limit on absences.",
    },
    {
      term: "SPOF",
      plain: "A single point of failure: the only key to a door. If it is lost, nobody gets in.",
    },
    {
      term: "Active-passive and active-active",
      plain: "A main reception with an idle reserve, or two receptions working together.",
    },
    {
      term: "VRRP, Keepalived and virtual IP",
      plain:
        "Two attendants agree on a shared phone number. The phone rings at the one on duty and moves to the other if that one leaves.",
    },
    {
      term: "RTO and RPO",
      plain:
        "The maximum time accepted to resume service and the maximum amount of information (measured in time) that is accepted to be lost.",
    },
    {
      term: "HA and DR",
      plain:
        "HA is keeping service going when a piece fails. DR is the plan to start again after a big disaster, such as losing the whole building.",
    },
    {
      term: "Chaos engineering",
      plain:
        "A fire drill: causing a controlled failure, with a hypothesis and a time to stop, to see whether the plan works.",
    },
    {
      term: "WAF",
      plain:
        "Gatehouse security that reads the content of the request looking for known scams, besides checking documents.",
    },
    {
      term: "ModSecurity and OWASP CRS",
      plain:
        "The engine that applies the security rules and the rulebook maintained by the community.",
    },
    {
      term: "Anomaly scoring and detection mode",
      plain:
        "Each suspicion adds points and only those who go over a limit are stopped. In detection mode, the guard only notes what would be stopped, without stopping it, to calibrate.",
    },
    {
      term: "Rate limiting",
      plain: "A limit on how many requests per minute each person can make.",
    },
    {
      term: "HSTS",
      plain:
        'The notice the site gives the browser: "from now on, only talk to me through the secure route".',
    },
    {
      term: "Defense in depth",
      plain:
        "Several barriers in sequence (gatehouse, turnstile, door), so that the failure of one does not leave everything exposed.",
    },
  ],
  limitsIntro:
    "The comparison helps fix who does what at the edge, but it is not a perfect equivalence. These are the points where F1 stops applying for each stage:",
  limits: [
    "**Stage 01:** in the team, the reception and the engineers are different people by nature; in software, the application can serve the internet directly (a Node.js on port 3000, with nothing in front), and separating the web server from the application is an architecture decision, not a given.",
    "**Stage 02:** the voice radio is run by people who remember the conversation and ask for repetition; HTTP is stateless, each request arrives with no memory of the previous ones, and the user's context has to come from a cookie or session. The swap of TCP for QUIC in HTTP/3, which limits the delay of a lost packet to the affected stream, has no equivalent on the voice radio.",
    "**Stage 03:** the note the reception attaches is trustworthy because only it writes it; X-Forwarded-For can be forged by the client itself, and the backend should only trust it when it comes from a known proxy. Also, the visitor knows they are talking to a reception, while the reverse proxy is transparent to the client.",
    "**Stage 04:** at the reception, the limit is the number of people and rooms; in Apache, the MPM is chosen in the configuration, only one is active at a time, and the limit is the memory of each process. In Worker and Event, a serious error in one thread can bring down the whole child process and the connections it was serving, and the requirement of thread-safe modules has no counterpart in a team of people.",
    "**Stage 05:** an attendant who notes down requests has to remember each one; the Nginx worker receives from the kernel (epoll) the list of what became ready, and the limit becomes CPU, memory and file descriptors. As a proxy, each client occupies two connections (one with the client and another with the backend), a count that does not show up at the reception.",
    "**Stage 06:** the analysts are people with different paces; the backends of an upstream are identical copies of the same application. ip_hash groups clients by address, so many users behind the same NAT or VPN land on a single backend, and the recommendation is to keep the session outside the backend (Redis or a signed token), unlike the analyst, who keeps the history on their own desk.",
    "**Stage 07:** the radio check is an active call made by people; in Nginx Open Source the check is only passive, based on real requests (max_fails and fail_timeout), and Nginx tries another backend on its own in case of a connection error or timeout. The distinction between 502 (invalid response or refused connection) and 504 (a response that did not arrive in time) has no equivalent.",
    "**Stage 08:** the routing sheet is read by people who interpret an ambiguous rule; in the Ingress, pathType (Prefix, Exact) defines the exact match, the annotations apply to the whole Ingress, and with more than one Controller the ingressClassName chooses who reads each sheet. If the destination Service has no ready Pods, the Ingress has nowhere to forward.",
    "**Stage 09:** the paddock credential is a physical object checked by people; the certificate is verified by software on every connection, the private key lives in a Secret that is only base64-encoded (the protection comes from RBAC), and the proof of control of the domain (HTTP-01 or DNS-01) has no equivalent in accreditation.",
    "**Stage 10:** the belt radio is handed to each person at the start of the day; the sidecar is only injected when the Pod is created, so Pods that already existed need to be recreated to join the mesh. And each sidecar consumes CPU and memory and adds latency at every hop, a cost that, with few services, may not pay off.",
    "**Stage 11:** with two cars, the new part goes to half of the team; the VirtualService splits traffic by exact weights that add up to 100, or by header, cookie or path. Repeating a message on the radio overloads nobody, while unlimited retries multiply the load on a service that is already failing, and that is why circuit breaking exists, which ejects endpoints with consecutive failures.",
    "**Stage 12:** the intercom recording already comes out complete and timestamped; in distributed tracing, the application needs to propagate the tracing headers in every following call, and without that the trace breaks even with healthy sidecars. And an ALLOW AuthorizationPolicy denies with HTTP 403 everything that does not match a rule, without the common sense of whoever administers a channel.",
    "**Stage 13:** in the garage, it is enough for the backup equipment to be on the same channel; with VRRP, the two balancers exchange announcements all the time, the one with the highest priority and confirmed health answers for the virtual IP, the configuration of both has to be kept identical by automation, and in many cloud networks VRRP does not work as on a local network. The availability calculations (components in series multiply, independent replicas in parallel improve) have no direct counterpart.",
    "**Stage 14:** hospitality security recognizes behavior it has never seen; the WAF only scores patterns described in the CRS rules, higher paranoia levels bring more false positives, and it does not fix the flaw in the code, it only reduces the exposure. Rate limiting counts by IP, so users behind the same NAT share the same limit, and it does not protect against a distributed attack in which each source sends little.",
  ],
};

export const LESSONS: Lesson[] = [
  {
    id: "m1",
    num: "01",
    navTitle: "Why it exists",
    tag: "role of the web server",
    title: "What a web server is for",
    lead: "A team publishes a Node.js application and leaves it serving directly on port 3000, with nothing in front of it. At first it works well. As the product grows, pains appear that have nothing to do with the business rules. The site's images and CSS and JavaScript files start to compete for the same process that runs the application logic, and everything gets slower.\n\nThe time comes to renew the HTTPS certificate, and since it is configured inside the code, the renewal requires touching the application and restarting the process even with no business rule change. Traffic rises and a single instance can no longer cope, but distributing traffic among replicas becomes a manual decision on every request. Finally, a bot starts aggressively scraping the catalog, and there is no layer at all filtering that traffic before it hits the application directly.\n\nAll of these problems belong to edge infrastructure, not to business rules. Solving them inside the application code mixes responsibilities that should be kept separate, and it is exactly this set of responsibilities that a web server such as Apache HTTP Server or Nginx takes on.",
    concept: [
      "A web server is the point through which every HTTP request enters before reaching (or not) the application. The application, also called the backend or application server (Node.js, PHP-FPM, Tomcat, Gunicorn), runs the business logic. The web server takes care of everything around it. A modern web server typically takes on six functions:",
      "- **Serve static content**: it delivers HTML, CSS, JavaScript, images and videos straight from disk, without invoking application code.",
      "- **Proxy to dynamic applications**: it forwards requests to PHP-FPM, Tomcat, Node.js, Gunicorn and similar.",
      "- **Balance load**: it distributes requests among several application servers.",
      "- **Terminate TLS**: it manages certificates and encryption at a central point, instead of spreading that task across each instance.",
      "- **Cache**: it stores responses already produced to deliver them faster later, without repeating the work.",
      "- **Control access and security**: it filters malicious traffic and applies authentication before the attack gets near the application.",
      "Apache HTTP Server had its first release in 1995, so the category has more than three decades of use. When the web server answers before any application exists (for example, a 404 for a nonexistent file), it shows that it is a layer of its own, and the `Server` header of the response identifies which software answered. The following stages go deeper into each function: proxy in Stage 03, Apache's MPMs in Stage 04, Nginx's architecture in Stage 05 and balancing in Stage 06.",
    ],
    pointsTitle: "Key concepts",
    points: [
      {
        t: "Web server",
        d: "software at the edge that receives HTTP requests and decides whether to answer on its own or forward to the application.",
        color: "blue",
      },
      {
        t: "Backend",
        d: "the process that runs the business rule; it should not take care of TLS, static files or traffic filtering.",
        color: "signal",
      },
      {
        t: "Static content",
        d: "a ready file served straight from disk, without application code.",
        color: "violet",
      },
      {
        t: "Proxy to a dynamic application",
        d: "the web server passes to the backend what only the backend knows how to answer.",
        color: "ember",
      },
      {
        t: "TLS termination",
        d: "the encryption is opened at a single point, and certificate renewal stops touching the application.",
        color: "blue",
      },
      {
        t: "`Server` header",
        d: "it identifies the software that answered and lets you quickly find out who is in front.",
        color: "signal",
      },
    ],
    examplesTitle: "A minimal web server and the Server header",
    examples: [
      {
        label: "default.conf",
        lang: "sh",
        code: '# default.conf\nserver {\n    listen 80;                       # the port Nginx listens on\n    server_name localhost;           # the name this block serves\n\n    location / {                     # rule for all URLs that start with "/"\n        root /usr/share/nginx/html;  # the folder where the static files are\n        index index.html;            # file served when the URL ends in "/"\n    }\n}',
        intro:
          "The block below shows the syntax of an Nginx configuration that serves a static page. It is illustrative: the official Nginx image already starts with an equivalent configuration, so you do not need to create this file to do this stage's exercise.",
        note: "Each `location` is a routing rule. There is no application behind it here: it is static content served directly by the web server. The `curl -I` command shows only the response headers, and `Server` reveals who answered.",
      },
      {
        label: "terminal",
        lang: "sh",
        code: "# approximate output: versions vary\n$ curl -I http://localhost:8080\nHTTP/1.1 200 OK\nServer: nginx/1.xx.x\nContent-Type: text/html\nContent-Length: 615\n\n$ curl -I http://localhost:8081\nHTTP/1.1 200 OK\nServer: Apache/2.4.xx (Unix)\nContent-Type: text/html",
        note: "These are two different pieces of software doing the same task (delivering a page), and both answered before any application existed.",
      },
    ],
    commands: [
      {
        cmd: "docker run -d --name nginx-lab -p 8080:80 nginx:stable",
        note: "starts a sample Nginx on port 8080 (the `stable` tag moves; pin the version when you need to reproduce a result)",
      },
      {
        cmd: "docker run -d --name apache-lab -p 8081:80 httpd:2.4",
        note: "starts a sample Apache on port 8081",
      },
      {
        cmd: "curl -I http://localhost:8080",
        note: "shows only the headers, without downloading the body",
      },
      {
        cmd: "curl -I http://localhost:8080/nao-existe",
        note: "confirms the 404 coming from the web server",
      },
      {
        cmd: "docker logs nginx-lab",
        note: "shows the access log that the web server itself keeps",
      },
    ],
    handsOn: [
      "Start both containers: `docker run -d --name nginx-lab -p 8080:80 nginx:stable` and `docker run -d --name apache-lab -p 8081:80 httpd:2.4`.",
      "Run `curl -I http://localhost:8080` and `curl -I http://localhost:8081`. **Observe** the `Server` header of each one and the `200 OK`.",
      "Ask for a path that does not exist (`curl -I http://localhost:8080/nao-existe`) and **observe** the `404 Not Found`. That response came from the web server, with no application having been invoked.",
      "Run `docker logs nginx-lab` and **observe** the access lines with your requests, including the one that resulted in a 404.",
      "Clean up: `docker rm -f nginx-lab apache-lab`.",
    ],
    tip: "Use `curl -I` to inspect only the headers. It is the fastest way to find out which server is answering before going deeper into an investigation. Remember that the `Server` header also reports the software version, which is useful to you and to whoever attacks; Stage 14 shows how to hide the version.",
    takeaway:
      "A web server does not run the business rule: it takes care of everything around it (static content, proxy, TLS, cache, security) so that the application does not have to.",
    figures: [
      {
        items: [
          {
            src: "/guides/servidores-web/etapa01-conteudo-estatico.svg",
            alt: "Three clients connected over the network to an HTTP server process, which reads files from a file system.",
            caption:
              "Serving static content: the HTTP server process reads the file from disk and returns it to the client, without running application code.",
          },
        ],
        credit: "Diagram: Wikimedia Commons, Giga Bang, CC BY-SA 4.0",
      },
    ],
  },
  {
    id: "m2",
    num: "02",
    navTitle: "HTTP 1.1 → 2 → 3",
    tag: "protocol evolution",
    title: "HTTP and its evolution, from 1.1 to HTTP/3",
    lead: "Two scenes explain why HTTP needed to evolve. In the first, an e-commerce product page loads the main HTML and 40 more image thumbnails. Even with persistent connections (keep-alive), HTTP/1.1 processes one request at a time within a connection: the second image only starts downloading after the response to the first has finished arriving. Browsers partly work around this by opening several parallel TCP connections to the same domain (usually about six), but that only trades one cost for another, because now there are several connections to manage.\n\nIn the second scene, even with the first one solved, a user on an unstable mobile network still feels slowness. It takes just a single packet getting lost on the way for the whole load to stall until the retransmission arrives, even though all the other packets have already reached the destination.\n\nThe first scene motivated HTTP/2. The second motivated HTTP/3.",
    concept: [
      "Before the versions, a structural fact: HTTP is a **stateless** protocol. Each request is handled independently, with no memory of the previous ones. This simplifies scaling, but requires mechanisms on top of the protocol (cookies and sessions) to keep the context of the same user.",
      "- **HTTP/1.1 (1997)**: it introduced persistent connections (keep-alive), allowing several requests and responses on the same TCP connection and reducing the cost of opening a new connection per resource. The limitation is **head-of-line blocking**: if the first request is slow, the following ones on the same connection wait.",
      "- **HTTP/2 (2015)**: it solves the head-of-line blocking of the first scene, at the application layer. Several requests and responses (streams) travel at the same time over the same TCP connection, with none blocking another. It also brought resource prioritization, header compression (HPACK) and Server Push, which fell out of use because the main browsers removed or restricted support, since the gain rarely justified the complexity. On the web, HTTP/2 is used over TLS, and client and server agree on the version during the TLS handshake (ALPN extension).",
      "- **HTTP/3 (QUIC over UDP)**: HTTP/2 solved the problem in the application, but TCP guarantees that bytes arrive in strict order. If a packet is lost, everything that came after it waits for the retransmission, even if it belongs to another stream. HTTP/3 replaces TCP with QUIC, which runs over UDP: each stream is independent, and the loss of a packet only delays the affected stream. QUIC also combines the transport handshake with the TLS 1.3 one, which tends to establish the connection faster. The gain is larger on networks with packet loss or high latency, such as mobile connections.",
      "In practice, the client discovers that the server offers HTTP/3 through the `Alt-Svc` response header. Networks that block UDP on port 443 make the client fall back to HTTP/2 or HTTP/1.1.",
    ],
    pointsTitle: "Key concepts",
    points: [
      {
        t: "Stateless",
        d: "each request is independent; cookies and sessions simulate context on top.",
        color: "blue",
      },
      {
        t: "Keep-alive (HTTP/1.1)",
        d: "it reuses the TCP connection, but serves one request at a time on it.",
        color: "signal",
      },
      {
        t: "Head-of-line blocking",
        d: "a slow item holds back the ones that come after it in the same line.",
        color: "violet",
      },
      {
        t: "Multiplexing (HTTP/2)",
        d: "several streams on the same TCP connection; it solves the blocking in the application.",
        color: "ember",
      },
      {
        t: "QUIC (HTTP/3)",
        d: "independent streams over UDP; it solves the blocking in the transport.",
        color: "blue",
      },
      {
        t: "ALPN and Alt-Svc",
        d: "ALPN negotiates h2 during the TLS handshake; `Alt-Svc` announces HTTP/3.",
        color: "signal",
      },
    ],
    examplesTitle: "Asking curl which version was negotiated",
    examples: [
      {
        label: "terminal",
        lang: "sh",
        code: "# Lets curl negotiate freely and shows the version used (approximate output)\n$ curl -so /dev/null -w 'Protocolo negociado: HTTP/%{http_version}\\n' https://www.cloudflare.com\nProtocolo negociado: HTTP/2\n\n# Forces HTTP/1.1, even if the server supports newer versions\n$ curl --http1.1 -so /dev/null -w 'Protocolo negociado: HTTP/%{http_version}\\n' https://www.cloudflare.com\nProtocolo negociado: HTTP/1.1\n\n# Forces HTTP/3 (requires a curl built with QUIC support)\n$ curl --http3 -so /dev/null -w 'Protocolo negociado: HTTP/%{http_version}\\n' https://www.cloudflare.com\nProtocolo negociado: HTTP/3",
        note: "Not every `curl` comes with HTTP/3 support (it depends on a QUIC library). Run `curl --version | grep -i http3` to check before using `--http3`. The results depend on the chosen domain supporting each version and on your network allowing UDP. To see the negotiation happen on a server of your own, without depending on the internet, start an Nginx with HTTP/2 using a self-signed certificate.",
      },
      {
        label: "terminal (2)",
        lang: "sh",
        code: '# Generates a self-signed lab certificate (valid for 30 days)\n$ mkdir -p certs\n$ openssl req -x509 -newkey rsa:2048 -nodes -days 30 -subj "/CN=localhost" \\\n    -keyout certs/key.pem -out certs/cert.pem',
      },
      {
        label: "h2.conf",
        lang: "sh",
        code: '# h2.conf\nserver {\n    listen 443 ssl;                              # listens for HTTPS on the container\'s port 443\n    http2 on;                                    # enables HTTP/2 (nginx 1.25.1 or higher)\n    ssl_certificate     /etc/nginx/certs/cert.pem;      # certificate\n    ssl_certificate_key /etc/nginx/certs/key.pem;       # private key\n    default_type text/plain;                     # type of the test response\n\n    location / {\n        return 200 "ola\\n";                      # fixed response, no backend\n    }\n}',
      },
      {
        label: "terminal (3)",
        lang: "sh",
        code: "# Starts Nginx mounting the configuration and the certificates\n$ docker run -d --name h2-lab -p 8443:443 \\\n    -v \"$PWD/h2.conf:/etc/nginx/conf.d/default.conf:ro\" \\\n    -v \"$PWD/certs:/etc/nginx/certs:ro\" nginx:stable\n\n# -k accepts the self-signed certificate\n$ curl -sk -o /dev/null -w 'HTTP/%{http_version}\\n' https://localhost:8443/\nHTTP/2\n\n$ curl -sk --http1.1 -o /dev/null -w 'HTTP/%{http_version}\\n' https://localhost:8443/\nHTTP/1.1",
      },
    ],
    commands: [
      {
        cmd: "curl -so /dev/null -w 'HTTP/%{http_version}\\n' <url>",
        note: "shows the negotiated version",
      },
      {
        cmd: "curl --http1.1 <url>",
        note: "forces HTTP/1.1",
      },
      {
        cmd: "curl --http2 <url>",
        note: "asks for HTTP/2",
      },
      {
        cmd: "curl --http3 <url>",
        note: "forces HTTP/3 (requires a curl with QUIC support)",
      },
      {
        cmd: "curl --version | grep -i http3",
        note: "checks whether your curl supports HTTP/3",
      },
      {
        cmd: "curl -sI https://www.cloudflare.com | grep -i alt-svc",
        note: "shows the HTTP/3 announcement made by the server (it depends on the domain)",
      },
      {
        cmd: "docker restart h2-lab",
        note: "restarts the container when an edit to `h2.conf` does not show up after the reload",
      },
    ],
    handsOn: [
      "Choose a domain that supports HTTP/2 (for example, `www.cloudflare.com`) and run the first two commands of the example. **Observe** the value of `%{http_version}` changing according to the flag.",
      'Run `curl -v --http2 https://www.cloudflare.com 2>&1 | grep -i "HTTP/2"` and **observe** the line that confirms the version negotiated in the handshake.',
      "If your curl supports HTTP/3, repeat with `--http3` and compare `-w '%{time_total}\\n'` across the three variants. Do not expect a large difference on a stable network.",
      "Generate the certificate, create `h2.conf` and start `h2-lab`. **Observe** `HTTP/2` on the first call and `HTTP/1.1` with `--http1.1`.",
      "Delete the `http2 on;` line from the local `h2.conf` and run `docker exec h2-lab nginx -s reload`. Repeat the `curl` with no flag and **observe** that the version goes back to `HTTP/1.1`, because the server stopped offering h2 in the handshake. Warning: the file is mounted individually in the container, and some editors and `sed -i` replace the file with a new one instead of changing the original. In that case the container keeps seeing the old version and the `reload` seems to do nothing; run `docker restart h2-lab` and repeat the test.",
      "Clean up: `docker rm -f h2-lab`.",
    ],
    tip: "HTTP/2 eliminated the queue at the application layer, and HTTP/3 solved the same problem at the transport layer. When diagnosing slowness, first ask at which layer the waiting happens.",
    takeaway:
      "Each HTTP version solved head-of-line blocking at a different layer: HTTP/2 in the application, with multiplexing, and HTTP/3 in the transport, swapping TCP for QUIC over UDP.",
    figures: [
      {
        items: [
          {
            src: "/guides/servidores-web/etapa02-tcp-streams.png",
            alt: "Two computers connected by a single chain whose links alternate between red and green.",
            caption:
              "HTTP/2: the red and green streams share the same TCP connection. If one link is lost, everything after it waits for the retransmission, whichever stream it belongs to.",
          },
          {
            src: "/guides/servidores-web/etapa02-quic-streams.png",
            alt: "Two computers connected by two separate chains, one yellow and one blue.",
            caption:
              "HTTP/3: in QUIC, each stream is an independent chain, and losing a link only delays the chain it was in.",
          },
        ],
        credit: "Illustration: HTTP/3 explained, Daniel Stenberg and contributors, CC BY 4.0",
      },
      {
        items: [
          {
            src: "/guides/servidores-web/etapa02-pilha-http.svg",
            alt: "Three stacks side by side over IPv4/IPv6 and under the HTTP Semantics layer: HTTP 1.1 over optional TLS and TCP; HTTP/2 over TLS 1.2+ and TCP; HTTP/3 over QUIC, which includes TLS 1.3, and UDP.",
            caption:
              "The meaning of methods, headers and status codes is the same in all three versions; what changes is the transport. HTTP/3 replaces TCP with QUIC over UDP, and TLS 1.3 becomes part of QUIC.",
          },
        ],
        credit: "Diagram: Wikimedia Commons, Sedrubal, CC BY-SA 4.0",
      },
    ],
  },
  {
    id: "m3",
    num: "03",
    navTitle: "Forward vs Reverse Proxy",
    tag: "intermediaries",
    title: "Forward proxy and reverse proxy",
    lead: "Two symmetric needs, one on the client side and the other on the server side. On the client side, a company wants all of its employees' outbound traffic to pass through a single control point, to block unwanted sites, record accesses for compliance and avoid exposing each machine's internal IP directly to the internet.\n\nOn the server side, the same company keeps five application servers behind a single public domain. It makes no sense to expose each server's IP, to repeat the TLS certificate configuration on each of them, or to let each server decide on its own whether it can take one more connection.\n\nThese are two different needs with one piece in common: an intermediary between whoever asks and whoever answers. The difference lies in which side the intermediary represents and protects.",
    concept: [
      "**Forward proxy, the outbound intermediary.** It sits between a client (usually on a private network) and the internet, and is configured explicitly on the client side (browser, operating system or application). The flow is this: the client sends the request to the proxy indicating the destination; the proxy analyzes it and decides whether to forward or block it; if it forwards, it makes the request on the client's behalf; the response returns to the proxy, which passes it on to the client. For HTTPS, the client asks the proxy for a tunnel (the `CONNECT` method), and the proxy only sees the content if it does TLS inspection. Use cases: security and compliance, content control, anonymity (masking the client's IP) and cache. Squid is an example of software that fills this role.",
      "**Reverse proxy, the inbound intermediary.** It sits at the edge of the infrastructure, receives requests from the internet and distributes them to the application servers behind it. It is transparent to the client, who does not even know it exists. The flow: the client sends the request to the proxy's public IP; based on rules, the proxy chooses the backend; it forwards the request; the backend answers the proxy; the proxy delivers the response to the client. Main functions: load balancing, centralized TLS termination (taking that load off the backends), cache, a first layer of security, compression (Gzip or Brotli) and routing between services. On security, the plain proxy filters certain traffic patterns, but blocking attacks such as XSS normally requires WAF rules (Stage 14).",
      "The practical rule to tell the two apart: ask who configured the pointing to the intermediary. If it was the client, it is a forward proxy. If it was the server's infrastructure and the client does not know, it is a reverse proxy.",
      "There is a consequence for the backend: it only sees the proxy opening the connection. To know who really made the request, the proxy passes on the client's IP in headers such as `X-Real-IP` and `X-Forwarded-For` (not standardized, but widely used; the standardized header is `Forwarded`). The backend should only trust these headers when they come from a known proxy, because a client can send them forged.",
    ],
    pointsTitle: "Key concepts",
    points: [
      {
        t: "Forward proxy",
        d: "on the client side, configured by the client, it represents the client to the internet.",
        color: "blue",
      },
      {
        t: "Reverse proxy",
        d: "on the server side, configured by the infrastructure, transparent to the client.",
        color: "signal",
      },
      {
        t: "upstream",
        d: "the group of backends to which the reverse proxy forwards.",
        color: "violet",
      },
      {
        t: "proxy_pass",
        d: "the Nginx directive that forwards the request to the backend.",
        color: "ember",
      },
      {
        t: "X-Real-IP and X-Forwarded-For",
        d: "headers that carry the original client's IP to the backend.",
        color: "blue",
      },
      {
        t: "Host",
        d: "without `proxy_set_header Host`, Nginx sends the backend the name of the upstream, not the domain the client used.",
        color: "signal",
      },
    ],
    examplesTitle: "Nginx reverse proxy and Squid forward proxy in the same lab",
    examples: [
      {
        label: "backend.py",
        lang: "sh",
        code: '# backend.py\nimport os\nimport time\nfrom http.server import BaseHTTPRequestHandler, ThreadingHTTPServer\n\nNAME = os.environ.get("NAME", "backend")      # name returned in the responses\nPORT = int(os.environ.get("PORT", "3000"))    # listening port\nDELAY = float(os.environ.get("DELAY", "0"))   # artificial delay, in seconds\n\n\nclass Handler(BaseHTTPRequestHandler):\n    protocol_version = "HTTP/1.1"             # allows persistent connections\n\n    def responder(self, com_corpo):\n        if self.path == "/slow":\n            time.sleep(10)                    # simulates a stuck backend\n        elif self.path != "/healthz":\n            time.sleep(DELAY)                 # simulates a slow backend\n        if self.path.endswith("/headers"):\n            linhas = [f"peer: {self.client_address[0]}"]   # who opened the TCP connection\n            linhas += [f"{k}: {v}" for k, v in self.headers.items()]\n            corpo = "\\n".join(linhas) + "\\n"\n        else:\n            corpo = f"{NAME} recebeu {self.path}\\n"\n        dados = corpo.encode()\n        self.send_response(200)\n        self.send_header("Content-Length", str(len(dados)))\n        self.end_headers()\n        if com_corpo:                         # HEAD does not send a body\n            self.wfile.write(dados)\n\n    def do_GET(self):\n        self.responder(True)\n\n    def do_HEAD(self):\n        self.responder(False)\n\n\nThreadingHTTPServer(("0.0.0.0", PORT), Handler).serve_forever()',
        intro:
          "First, a didactic backend in Python (standard library only). It returns its own name, the path received and, on `/headers`, the headers that arrived and the IP of whoever opened the connection. This same `backend.py` will be reused in the following stages.",
      },
      {
        label: "nginx.conf",
        lang: "sh",
        code: "# nginx.conf\nupstream backend_app {\n    server backend:3000;             # service name in Compose, resolved by Docker's DNS\n}\n\nserver {\n    listen 80;\n    server_name localhost;\n\n    location / {\n        proxy_pass http://backend_app;                     # forwards the request to the backend\n        proxy_set_header Host $host;                       # preserves the domain requested by the client (without the port)\n        proxy_set_header X-Real-IP $remote_addr;           # tells the backend the client's IP\n        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;  # chain of IPs, if there is more than one proxy\n    }\n}",
      },
      {
        label: "squid.conf",
        lang: "sh",
        code: "# squid.conf\nhttp_port 3128                                  # port the proxy listens on\nvisible_hostname squid-lab                      # name used in the Via header\nacl rede_lab src 10.0.0.0/8 172.16.0.0/12 192.168.0.0/16   # private networks, where the lab's clients are\nhttp_access allow rede_lab                      # allows whoever comes from these networks\nhttp_access deny all                            # denies everything else",
      },
      {
        label: "compose.yaml",
        lang: "yaml",
        code: '# compose.yaml\nservices:\n  backend:\n    image: python:3.12-alpine                   # small image with Python\n    command: ["python", "/app/backend.py"]      # runs the didactic backend\n    environment:\n      NAME: app                                 # name returned in the responses\n    volumes:\n      - ./backend.py:/app/backend.py:ro         # mounts the script read-only\n  nginx:\n    image: nginx:stable                         # the reverse proxy\n    ports:\n      - "8080:80"                               # the only published entry point to the backend\n    volumes:\n      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro   # replaces the default configuration\n    depends_on:\n      - backend                                 # starts the backend before the proxy\n  squid:\n    image: ubuntu/squid                         # the forward proxy\n    ports:\n      - "3128:3128"                             # proxy port for your terminal\n    volumes:\n      - ./squid.conf:/etc/squid/squid.conf:ro   # minimal lab configuration',
        note: "Without the `X-Real-IP` and `X-Forwarded-For` headers, the backend would see every request as coming from Nginx itself. The `Server` header of the response remains `nginx`, even with the content generated by Python: that transparency is what characterizes the reverse proxy.",
      },
      {
        label: "terminal",
        lang: "sh",
        code: "$ docker compose up -d\n$ curl -s http://localhost:8080/headers\n# approximate output: IPs and versions vary\npeer: 172.18.0.3\nHost: localhost\nX-Real-IP: 172.18.0.1\nX-Forwarded-For: 172.18.0.1\nConnection: close\nUser-Agent: curl/8.x\n\n# The backend is not published: from outside, only the proxy answers\n$ curl -sI http://localhost:8080/\nHTTP/1.1 200 OK\nServer: nginx/1.xx.x\n\n# Forward proxy: here it is the client that explicitly points to the intermediary\n$ curl -s -x http://localhost:3128 http://backend:3000/headers\n# approximate output\npeer: 172.18.0.4\nHost: backend:3000\nVia: 1.1 squid-lab (squid/x.y)\nX-Forwarded-For: 172.18.0.1\n\n# Without the proxy, your terminal cannot even resolve the backend's name\n$ curl -s http://backend:3000/\ncurl: (6) Could not resolve host: backend",
        note: "Note that, in the forward proxy, the one that opens the connection to the backend is Squid (`peer` shows Squid's IP), and the name `backend` only works because the proxy is inside Docker's network.",
      },
    ],
    commands: [
      {
        cmd: "docker compose up -d",
        note: "starts the backend, Nginx and Squid in the background",
      },
      {
        cmd: "docker compose exec nginx nginx -t",
        note: "validates the configuration syntax before applying it",
      },
      {
        cmd: "docker compose exec nginx nginx -s reload",
        note: "reloads the configuration without dropping existing connections",
      },
      {
        cmd: "docker compose restart nginx",
        note: "restarts Nginx when an edit to `nginx.conf` does not show up after the reload",
      },
      {
        cmd: "curl -s http://localhost:8080/headers",
        note: "shows what the backend received through the proxy",
      },
      {
        cmd: "curl -s -x http://localhost:3128 http://backend:3000/headers",
        note: "uses the forward proxy explicitly",
      },
    ],
    handsOn: [
      "Create the `etapa03/` folder with `backend.py`, `nginx.conf`, `squid.conf` and `compose.yaml`, and run `docker compose up -d`. Confirm the three services with `docker compose ps`.",
      "Run `curl -s http://localhost:8080/headers` and **observe** `X-Real-IP`, `X-Forwarded-For` and `Host: localhost`. Then run `curl -sI http://localhost:8080/` and **observe** `Server: nginx`, even with the content coming from Python.",
      "Delete the `proxy_set_header Host $host;` line from `nginx.conf`, run `docker compose exec nginx nginx -s reload` and repeat `/headers`. **Observe** `Host: backend_app`, the name of the upstream, instead of the domain the client asked for. Warning: `nginx.conf` is mounted as a single file, and some editors and `sed -i` replace it with a new file, which leaves the container seeing the old version. If the change does not show up after the reload, run `docker compose restart nginx`.",
      "Restore the line, delete `proxy_set_header X-Real-IP $remote_addr;`, reload and repeat. **Observe** that `X-Real-IP` disappears, but `X-Forwarded-For` still carries the client's IP, and that `peer` shows Nginx's IP (the `peer` was always Nginx, because it is the one that opens the connection to the backend). Also delete the `X-Forwarded-For` line, reload and repeat: without both headers, the backend only sees Nginx.",
      "Restore the lines and run `curl -s -x http://localhost:3128 http://backend:3000/headers`. **Observe** the `Via` and `X-Forwarded-For` headers added by Squid. Compare with `curl -s http://backend:3000/`, which fails to resolve the name.",
      "Clean up: `docker compose down`.",
    ],
    tip: "To know which side you are on, ask who configured the pointing: if it was the client, it is a forward proxy; if the client does not know the intermediary exists, it is a reverse proxy. In production, configure the backend to trust `X-Forwarded-For` only when the connection comes from your proxy, because the header can be forged by any client.",
    takeaway:
      "The forward proxy sits on the client side and is configured by the client; the reverse proxy sits on the server side and is invisible to the client, and the original IP only reaches the backend if the proxy passes it on in headers.",
    figures: [
      {
        items: [
          {
            src: "/guides/servidores-web/etapa03-forward-proxy.svg",
            alt: "A user and a proxy inside the internal network; the user talks to the proxy, and the proxy talks to example.com on the internet.",
            caption:
              "Forward proxy: the proxy sits on the client's network, and the client uses it to reach the outside. The external site only sees the proxy.",
          },
          {
            src: "/guides/servidores-web/etapa03-reverse-proxy.svg",
            alt: "The internet talks to a proxy inside the internal network of example.com, and the proxy talks to the web server.",
            caption:
              "Reverse proxy: the proxy sits on the server's network, and whoever comes from the internet talks only to it, without knowing which server answered.",
          },
        ],
        credit: "Diagrams: Wikimedia Commons, H2g2bob, CC0 (public domain)",
      },
    ],
  },
  {
    id: "m4",
    num: "04",
    navTitle: "Apache & MPMs",
    tag: "processes + threads",
    title: "Apache HTTP Server and the processing models (MPMs)",
    lead: "First scenario: an e-commerce site runs Apache with the oldest processing model and receives a peak of 5,000 simultaneous connections during a promotion. Since each connection gets an entirely separate operating system process, the server tries to open thousands of processes, each consuming tens of megabytes just to exist. Memory runs out, the system starts swapping to disk and the site freezes right at the sales peak.\n\nSecond scenario, the opposite: the same company depends on an old module, written without concern for concurrency (not thread-safe), that must keep working. Switching to a model based on threads that share memory would make that module corrupt data or bring down the process unpredictably.\n\nOne scenario asks for lightness to scale, the other asks for total isolation to survive. Apache resolves this tension by letting you choose the concurrency model, the MPMs (Multi-Processing Modules).",
    concept: [
      "Before the models, two terms. A **process** has its own memory, isolated from the others; if it fails, the others carry on. A **thread** lives inside a process and shares its memory with the other threads, which makes it lighter and more dangerous: a serious error in one thread can corrupt the whole process. Code that works correctly when several threads run it at the same time is called thread-safe.",
      "- **Prefork (no threads)**: an independent child process serves each connection, completely isolated from the others. Advantages: very stable (a problem in one process does not affect the others), compatible with non-thread-safe modules and with legacy software. Disadvantages: high memory consumption and poor scalability under high concurrency. It is common to see Prefork with `mod_php` (PHP embedded in the Apache process, historically not thread-safe). The alternative is to run PHP as a separate process, PHP-FPM, with Apache talking to it through a proxy (`mod_proxy_fcgi`, the same concept as Stage 03), which allows using a lighter MPM without losing compatibility.",
      "- **Worker (with threads)**: it creates several child processes, each with several threads, and each thread serves one connection. It uses less memory than Prefork and supports more concurrency. Since the threads of a process share memory, a serious error in one of them can bring down the child process that hosts it and the connections it was serving; the other children and the master process stay up. That is why modules need to be thread-safe.",
      "- **Event (recommended for most new deployments)**: it starts from Worker, but is optimized for the common case of open, idle keep-alive connections. A dedicated thread can watch several connections that are only waiting, without tying a worker thread to each idle connection. It keeps the requirement of thread-safe modules and is the MPM recommended for HTTP/2, which Apache offers through the `mod_http2` module (enabled with `a2enmod http2` and `Protocols h2 http/1.1`).",
      "Two reading points for the comparison: memory consumption grows in the order Event, Worker, Prefork, and the supported concurrency grows in the opposite order. The choice, therefore, is always a trade between isolation and efficiency.",
    ],
    pointsTitle: "Key concepts",
    points: [
      {
        t: "MPM",
        d: "the module that defines how Apache serves connections in parallel (processes, threads or both).",
        color: "blue",
      },
      {
        t: "Prefork",
        d: "one process per connection; total isolation, high memory, low concurrency; it serves non-thread-safe modules.",
        color: "signal",
      },
      {
        t: "Worker",
        d: "a few processes with several threads; medium memory, high concurrency; it requires thread-safe modules.",
        color: "violet",
      },
      {
        t: "Event",
        d: "like Worker, but it does not tie a thread to idle keep-alive connections; low memory, very high concurrency.",
        color: "ember",
      },
      {
        t: "Thread-safe",
        d: "code that tolerates simultaneous execution by several threads in the same process.",
        color: "blue",
      },
      {
        t: "PHP-FPM",
        d: "PHP as a separate process, which lets you leave Prefork without abandoning PHP.",
        color: "signal",
      },
    ],
    examplesTitle: "Finding and switching the active MPM",
    examples: [
      {
        label: "terminal",
        lang: "sh",
        code: "# Shows the MPM in use (shortened output)\n$ apachectl -V | grep -i mpm\nServer MPM:     event\n\n# On Debian and Ubuntu, a2query shows the enabled MPM module\n$ sudo a2query -M\nevent\n\n# Switches to Prefork (for example, to run a legacy non-thread-safe module)\n$ sudo a2dismod mpm_event      # disables the current MPM\n$ sudo a2enmod mpm_prefork     # enables Prefork\n$ sudo systemctl restart apache2\n\n$ sudo a2query -M\nprefork",
        intro:
          "On an Apache installed on the host (Debian or Ubuntu), `apachectl` and `a2query` report the active MPM, and `a2dismod` and `a2enmod` do the switch.",
        note: "On RHEL-based distributions, the switch is done by commenting and uncommenting the `LoadModule mpm_*_module` lines in `/etc/httpd/conf.modules.d/00-mpm.conf`, and the service is called `httpd`.",
      },
      {
        label: "mpm_event.conf",
        lang: "sh",
        code: "# /etc/apache2/mods-available/mpm_event.conf\n# Illustrative excerpt: adjust the values to your real traffic\n<IfModule mpm_event_module>\n    StartServers             3     # child processes created at startup\n    MinSpareThreads         75     # minimum idle threads kept in reserve\n    MaxSpareThreads        250     # ceiling of idle threads; above this Apache ends processes\n    ThreadsPerChild         25     # threads in each child process\n    MaxRequestWorkers      400     # requests processed at the same time (16 processes x 25 threads)\n</IfModule>",
        note: "The number 400 is not arbitrary: `MaxRequestWorkers` must fit within `ServerLimit` (16 by default) multiplied by `ThreadsPerChild`, which here gives 16 x 25 = 400. In Event, idle keep-alive connections do not each occupy one of these worker threads. To practice without changing your computer, the same contrast can be done with the official `httpd` image, choosing the MPM when building the image.",
      },
      {
        label: "Dockerfile",
        lang: "sh",
        code: "# Dockerfile\nFROM httpd:2.4\nARG MPM=event\n# 1) comments out the event MPM line; 2) uncomments the line of the MPM requested in MPM\nRUN sed -i \\\n      -e 's/^LoadModule mpm_event_module/#LoadModule mpm_event_module/' \\\n      -e \"s/^#LoadModule mpm_${MPM}_module/LoadModule mpm_${MPM}_module/\" \\\n      /usr/local/apache2/conf/httpd.conf",
      },
      {
        label: "terminal (2)",
        lang: "sh",
        code: "$ docker build --build-arg MPM=event   -t apache-event   .\n$ docker build --build-arg MPM=prefork -t apache-prefork .\n\n$ docker run -d --name apache-event   -p 8081:80 apache-event\n$ docker run -d --name apache-prefork -p 8082:80 apache-prefork\n\n# Lists the loaded modules and filters the MPMs (approximate output)\n$ docker exec apache-event   httpd -M | grep mpm\n mpm_event_module (shared)\n$ docker exec apache-prefork httpd -M | grep mpm\n mpm_prefork_module (shared)",
      },
    ],
    commands: [
      {
        cmd: "apachectl -V | grep -i mpm",
        note: "shows the active MPM (on some distributions the command is `httpd -V`)",
      },
      {
        cmd: "sudo a2query -M",
        note: "confirms the enabled MPM module (Debian and Ubuntu)",
      },
      {
        cmd: "sudo a2dismod mpm_event && sudo a2enmod mpm_prefork",
        note: "switches the active MPM",
      },
      {
        cmd: "sudo systemctl restart apache2",
        note: "applies the switch (switching MPM requires a restart, a reload is not enough)",
      },
      {
        cmd: "docker exec <container> httpd -M | grep mpm",
        note: "shows the MPM loaded in a container",
      },
      {
        cmd: "ab -n 50000 -c 100 http://localhost:8081/",
        note: "generates test load (Apache Bench)",
      },
      {
        cmd: "docker top <container>",
        note: "lists the container's processes, as seen from the host",
      },
    ],
    handsOn: [
      "Create the `etapa04/` folder with the `Dockerfile` above, build the two images and start the two containers as in the example.",
      "Confirm each one's MPM with `docker exec <container> httpd -M | grep mpm`. **Observe** `mpm_event_module` and `mpm_prefork_module`.",
      "In one terminal, run `ab -n 50000 -c 100 http://localhost:8082/` (Prefork). In another, run `docker top apache-prefork | grep -c httpd` several times during the test and **observe** the number of processes grow.",
      "Repeat step 3 against `http://localhost:8081/` (Event) and `apache-event`. **Observe** that the number of processes stays small, because each process holds several threads. Also compare `docker stats --no-stream apache-event apache-prefork` at the end of the tests. The exact numbers vary; what matters is the difference in order of magnitude in the processes.",
      "If you have an Apache installed on the host (`sudo apt install apache2`), switch the MPM with `a2dismod` and `a2enmod`, restart the service and confirm with `sudo a2query -M`.",
      "Clean up: `docker rm -f apache-event apache-prefork`. The `apache-event` and `apache-prefork` images stay on the computer and can be reused in Stage 05.",
    ],
    tip: "The difference between the three MPMs lies in process, thread and isolation, and it is this criterion that guides the choice in production. Before switching MPM on a real server, check that all loaded modules are thread-safe, because that is the restriction that decides the choice.",
    takeaway:
      "Prefork isolates each connection in a process and is the heaviest; Worker uses threads inside a few processes and requires thread-safe code; Event is Worker tuned so as not to spend a thread on idle keep-alive connections.",
    figures: [
      {
        items: [
          {
            src: "/guides/servidores-web/etapa04-mpm.en.svg",
            alt: "Three columns. Prefork: a parent process and three child processes, each with one connection. Worker: two processes with three threads each, above a band of process memory, each thread with one connection. Event: two processes with two worker threads and a listener thread, which holds several idle keep-alive connections.",
            caption:
              "In Prefork, each connection takes a whole process. In Worker, threads from a few processes share the process memory. In Event, a listener thread holds the idle keep-alive connections, and the worker threads stay free for whoever is sending data.",
          },
        ],
        credit: "Diagram: made for this guide",
      },
    ],
  },
  {
    id: "m5",
    num: "05",
    navTitle: "Nginx event-driven",
    tag: "event loop",
    title: "Nginx and the event-driven architecture",
    lead: "An application keeps many simultaneous connections, long-lived and almost always idle: real-time chat, push notifications, keep-alive from mobile app APIs. Even with the Event MPM reducing the cost of idle connections, Apache still reserves a thread for each request being processed. Scaling to tens of thousands of connections means scaling, in the same proportion, the number of threads and the memory they consume, until reaching the practical limit of threads that coexist efficiently.\n\nNginx was designed for this scenario. While Apache was born as a traditional web server and gained concurrency models over time, Nginx was born with an architecture aimed at serving static content and acting as a reverse proxy under high concurrency.",
    concept: [
      "The central difference is the **asynchronous, event-driven** architecture, instead of a dedicated process or thread per connection.",
      "A **master** process reads the configuration and manages the **worker** processes, which are the ones that serve connections (the master does not serve requests). Each worker runs an **event loop**: a loop that waits for events (new data on a connection, a response from a backend, a write becoming available), handles what became ready and goes back to the loop. When an input and output operation would have to wait (reading from disk, waiting for a backend), the worker does not stand still: it registers interest in that event and moves on to handle another connection. This is **non-blocking I/O**. When the event becomes ready, the worker is notified and resumes exactly where it stopped.",
      "On Linux, the notification of which connections have new data comes from a kernel mechanism, `epoll`, which avoids scanning all connections on every cycle. Nginx picks the most efficient method available on its own, so the `use epoll;` directive is usually optional on Linux.",
      'The practical result is that the number of processes stays stable and small (usually one worker per CPU core), while the number of connections grows. The limit stops being "one thread per connection" and becomes CPU, memory and file descriptors. Benefits: lower memory consumption, higher throughput, good latency and excellent performance as a reverse proxy and balancer, including in front of Apache itself. Be careful with the capacity calculation: `worker_processes` times `worker_connections` is the ceiling of simultaneous connections, but, when Nginx acts as a proxy, each client request uses two connections (one with the client and one with the backend), so the number of simultaneous clients is about half of that ceiling. In addition, `worker_connections` must not exceed the process\'s open file limit (adjustable with `worker_rlimit_nofile`).',
    ],
    pointsTitle: "Key concepts",
    points: [
      {
        t: "Event-driven",
        d: "a few processes handle many connections by reacting to events.",
        color: "blue",
      },
      {
        t: "Non-blocking I/O",
        d: "the worker registers the event and serves another connection instead of waiting.",
        color: "signal",
      },
      {
        t: "Event loop",
        d: "each worker's loop that handles the ready events.",
        color: "violet",
      },
      {
        t: "master and worker",
        d: "the master manages; the workers serve; the number of workers usually equals the number of cores (`worker_processes auto`).",
        color: "ember",
      },
      {
        t: "epoll",
        d: "a Linux kernel mechanism that tells which connections have new data.",
        color: "blue",
      },
      {
        t: "worker_connections",
        d: "the maximum number of simultaneous connections per worker, counting connections with backends.",
        color: "signal",
      },
    ],
    examplesTitle: "Few processes, many connections",
    examples: [
      {
        label: "nginx.conf",
        lang: "sh",
        code: "# nginx.conf (main excerpt)\nworker_processes auto;          # one worker process per available CPU core\n\nevents {\n    worker_connections 1024;    # each worker accepts up to 1024 simultaneous connections\n    use epoll;                  # optional on Linux: Nginx already picks the most efficient method\n}",
        note: "On a 4-core machine, this configuration allows, in theory, up to 4096 simultaneous connections using only 4 workers (plus the master). If Nginx is acting as a proxy, count about half of that in simultaneous clients.",
      },
      {
        label: "terminal",
        lang: "sh",
        code: "# Few processes, regardless of how many connections are active (approximate output)\n$ docker top nginx-lab\nUID    PID   PPID  C  STIME  TTY  TIME      CMD\nroot   2101  2080  0  10:02  ?    00:00:00  nginx: master process nginx -g daemon off;\n101    2140  2101  0  10:02  ?    00:00:00  nginx: worker process\n101    2141  2101  0  10:02  ?    00:00:00  nginx: worker process\n\n# On the host, counts the established TCP connections (includes all of the computer's connections)\n$ ss -tn state established | wc -l\n187",
        note: "An Apache with Prefork or Worker under the same load usually shows dozens or hundreds of processes in the same listing.",
      },
    ],
    commands: [
      {
        cmd: "docker run -d --name nginx-lab -p 8080:80 nginx:stable",
        note: "starts the test Nginx",
      },
      {
        cmd: "docker exec nginx-lab nginx -T | grep -E 'worker_processes|worker_connections'",
        note: "shows the effective values of the configuration",
      },
      {
        cmd: "docker top nginx-lab",
        note: "lists the master and the workers",
      },
      {
        cmd: "nproc",
        note: "number of cores on the machine, to compare with the number of workers",
      },
      {
        cmd: "ab -n 50000 -c 200 http://localhost:8080/",
        note: "generates load with 200 simultaneous connections",
      },
      {
        cmd: "docker run -d --name apache-prefork -p 8082:80 apache-prefork",
        note: "recreates the Prefork Apache from Stage 04 (the image already exists on the computer)",
      },
      {
        cmd: "nginx -t",
        note: "on an Nginx installed on the host, validates the configuration and shows the path of `nginx.conf`",
      },
    ],
    handsOn: [
      "Start the test Nginx with `docker run -d --name nginx-lab -p 8080:80 nginx:stable` and run `docker exec nginx-lab nginx -T | grep -E 'worker_processes|worker_connections'`. **Observe** `worker_processes auto` and `worker_connections 1024`.",
      "Run `docker top nginx-lab` and count the worker processes. Compare with `nproc`: the number of workers is usually equal or close to the number of cores (the container sees the host's cores).",
      "Run `ab -n 50000 -c 200 http://localhost:8080/` and, during the test, repeat `docker top nginx-lab` in another terminal. **Observe** that the number of processes does not change, even with 200 simultaneous connections.",
      "The `apache-prefork` container was deleted at the end of Stage 04, so recreate it with `docker run -d --name apache-prefork -p 8082:80 apache-prefork` (the image is still on the computer; if you removed it, rebuild it with `docker build --build-arg MPM=prefork -t apache-prefork .` in the `etapa04/` folder). Repeat the load on `http://localhost:8082/` and run `docker top apache-prefork | grep -c httpd`. **Observe** the number of processes grow along with the load, unlike what happened with Nginx.",
      "Compare memory consumption with `docker stats --no-stream nginx-lab apache-prefork`.",
      "Optional, on an Nginx installed on the host (`sudo apt install nginx`): run `nginx -t` and `ps aux | grep '[n]ginx'` and repeat steps 2 and 3 against `http://localhost/`.",
      "Clean up: `docker rm -f nginx-lab apache-prefork`.",
    ],
    tip: "The central point is that a worker never waits standing still: it registers the event and moves on, and that is what allows Nginx to serve many connections without multiplying processes. When diagnosing a saturated Nginx, look at CPU, memory and the open file limit, and not at the number of processes, which barely changes.",
    takeaway:
      "Apache dedicates a process or thread to each request in progress (even when optimized by the Event MPM); Nginx uses a few workers with a non-blocking event loop, and that is why it is widely used as a reverse proxy and balancer in front of any backend.",
    figures: [
      {
        items: [
          {
            src: "/guides/servidores-web/etapa05-nginx-arquitetura.png",
            alt: "A master process above three workers; clients talk HTTP and HTTPS to the workers, which multiplex connections via kevent, epoll or select, talk to web, application and Memcached servers in the backend, and share a proxy cache maintained by the cache loader and cache manager processes.",
            caption:
              "The master loads the configuration and starts the workers; each worker handles many client and backend connections in the same event loop. The module names inside the workers date from 2012; the split between master and workers is still the same.",
          },
        ],
        credit:
          "Diagram: The Architecture of Open Source Applications, vol. II, Andrew Alexeev, CC BY 3.0",
      },
    ],
  },
  {
    id: "m6",
    num: "06",
    navTitle: "Load balancing",
    tag: "L4 + L7 + algorithms",
    title: "Load balancing: L4, L7 and Nginx algorithms",
    lead: "A single instance reaches its limit and the store starts losing orders on Black Friday. Increasing the CPU and memory of the same machine (vertical scaling) postpones the problem, but has a ceiling and is still a single point of failure. The way out is horizontal scaling: several identical backends. A question then arises that the application code does not answer: who decides, on each request, which backend receives the work? And by what criterion, if one backend is stronger than the other, or if some requests take a second and others ten milliseconds?",
    concept: [
      "A **load balancer** distributes requests among the backends. The decision can use little or a lot of information, and that defines the layer it works at.",
      "- **L4 (transport)**: it decides with IP and port, over TCP or UDP. It is fast, serves generic protocols (databases, for example), but cannot route by URL, host or header because it does not even read HTTP. In Nginx, this is done by the `stream` module.",
      "- **L7 (application)**: it understands HTTP and HTTPS. It can terminate TLS, apply cache and compression and route by host, path, header or cookie, with a slightly higher overhead.",
      "In Nginx, the algorithms of the `upstream` block are:",
      "- **Round Robin**: the default; it distributes in sequence. The `weight` parameter changes the proportion for servers with different capacities (`weight=2` receives double).",
      "- **least_conn**: it sends the request to the backend with the fewest active connections. It is suitable when requests have very different durations.",
      "- **ip_hash**: the same client tends to always land on the same backend, based on the IPv4 address (it uses the first three octets) or the IPv6 address (the whole thing). It helps applications with local state, but concentrates many users behind the same NAT or VPN on a single backend.",
      'Affinity like that of `ip_hash` makes redistribution and scalability harder. Whenever possible, prefer **stateless** applications: session in Redis or a signed token (such as JWT) allow any backend to answer any request. Two directives complete the picture: `keepalive` reuses connections between Nginx and the backends (it requires `proxy_http_version 1.1` and `proxy_set_header Connection ""`), and the timeouts `proxy_connect_timeout`, `proxy_send_timeout` and `proxy_read_timeout` limit each phase of the conversation with the upstream.',
    ],
    pointsTitle: "Key concepts",
    points: [
      {
        t: "L4 and L7",
        d: "L4 decides by IP and port (fast, generic); L7 understands HTTP (flexible, more cost).",
        color: "blue",
      },
      {
        t: "Round Robin and weight",
        d: "a simple sequence; weights for different capacities.",
        color: "signal",
      },
      {
        t: "least_conn",
        d: "it favors whoever has the fewest active connections; good for heterogeneous durations.",
        color: "violet",
      },
      {
        t: "ip_hash",
        d: "affinity by the client's IP; subject to imbalance behind a NAT.",
        color: "ember",
      },
      {
        t: "Stateless",
        d: "external session or signed token remove the need for affinity.",
        color: "blue",
      },
      {
        t: "keepalive",
        d: "it reuses connections with the backends and reduces the cost of opening new connections.",
        color: "signal",
      },
    ],
    examplesTitle: "An upstream with an explicit decision",
    examples: [
      {
        label: "compose.yaml",
        lang: "yaml",
        code: '# compose.yaml\nx-backend: &backend                        # template reused by both backends\n  image: python:3.12-alpine\n  command: ["python", "/app/backend.py"]   # runs the didactic backend\n  volumes:\n    - ./backend.py:/app/backend.py:ro      # mounts the script read-only\n\nservices:\n  api-1:\n    <<: *backend                           # inherits the template above\n    environment:\n      NAME: api-1                          # name returned in the responses\n      DELAY: "${API1_DELAY:-0}"            # delay configurable by environment variable (default 0)\n  api-2:\n    <<: *backend\n    environment:\n      NAME: api-2\n  nginx:                                   # L7 balancer (HTTP)\n    image: nginx:stable\n    ports:\n      - "8080:80"\n    volumes:\n      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro\n    depends_on:\n      - api-1\n      - api-2\n  nginx-l4:                                # L4 balancer (plain TCP)\n    image: nginx:stable\n    ports:\n      - "9090:9090"\n    volumes:\n      - ./nginx-l4.conf:/etc/nginx/nginx.conf:ro   # replaces the whole nginx.conf\n    depends_on:\n      - api-1\n      - api-2',
        intro:
          "The lab has two backends (`api-1` and `api-2`, the `backend.py` from Stage 03), an L7 Nginx on port 8080 and an L4 Nginx on port 9090. Copy the `backend.py` from Stage 03 to the `etapa06/` folder.",
      },
      {
        label: "nginx.conf",
        lang: "sh",
        code: '# nginx.conf\nupstream pitstop_api {\n    # Choose at most one of these lines (with none, the default is Round Robin):\n    # least_conn;\n    # ip_hash;\n    server api-1:3000;                     # backend 1 (add weight=2 to give it double)\n    server api-2:3000;                     # backend 2\n    keepalive 32;                          # up to 32 idle connections reused with the backends\n}\n\nserver {\n    listen 80;\n    default_type text/plain;               # type of the fixed response below\n\n    location = / {\n        return 200 "home servida pelo proprio Nginx\\n";   # L7 decides by path: this route does not touch the backends\n    }\n\n    location /api/ {\n        proxy_pass http://pitstop_api;     # forwards to the group of backends\n        proxy_http_version 1.1;            # required for keepalive with the backends\n        proxy_set_header Connection "";    # removes the default "Connection: close"\n    }\n}',
      },
      {
        label: "nginx-l4.conf",
        lang: "sh",
        code: "# nginx-l4.conf\nevents {}                                  # mandatory block, even if empty\n\nstream {                                   # TCP/UDP balancing context\n    upstream api_tcp {\n        server api-1:3000;\n        server api-2:3000;\n    }\n    server {\n        listen 9090;                       # listens for TCP, without interpreting HTTP\n        proxy_pass api_tcp;                # passes the bytes to the chosen backend\n    }\n}",
      },
      {
        label: "terminal",
        lang: "sh",
        code: '$ docker compose up -d\n\n# L7: the "/" route is decided by Nginx; "/api/" goes to the backends in sequence\n$ curl -s http://localhost:8080/\nhome servida pelo proprio Nginx\n$ for i in $(seq 1 4); do curl -s http://localhost:8080/api/; done\napi-1 recebeu /api/\napi-2 recebeu /api/\napi-1 recebeu /api/\napi-2 recebeu /api/\n\n# L4: it does not read HTTP, so "/" also reaches a backend (and there is no Nginx route of its own)\n$ curl -s http://localhost:9090/\napi-1 recebeu /',
        note: "`weight=2` only changes the proportion in Round Robin: with 30 requests, about 20 are expected for `api-1` and 10 for `api-2`. `least_conn` looks at active connections, and the weight still influences the choice among available servers.",
      },
    ],
    commands: [
      {
        cmd: "docker compose exec nginx nginx -t",
        note: "validates the configuration before applying it",
      },
      {
        cmd: "docker compose exec nginx nginx -s reload",
        note: "reloads without dropping existing connections",
      },
      {
        cmd: "docker compose restart nginx",
        note: "restarts Nginx when an edit to `nginx.conf` does not show up after the reload",
      },
      {
        cmd: "for i in $(seq 1 30); do curl -s http://localhost:8080/api/; done | sort | uniq -c",
        note: "counts the distribution among the backends",
      },
      {
        cmd: "seq 1 20 | xargs -P 10 -I{} curl -s http://localhost:8080/api/ | sort | uniq -c",
        note: "generates concurrent requests (10 at a time) and counts the distribution",
      },
      {
        cmd: "ab -n 1000 -c 20 -k http://localhost:8080/api/",
        note: "measures throughput and latency under concurrency (`-k` uses keep-alive; without it, `ab` opens one connection per request)",
      },
      {
        cmd: "API1_DELAY=1 docker compose up -d api-1",
        note: "recreates `api-1` with a 1-second delay per response",
      },
    ],
    handsOn: [
      "Create `etapa06/` with `backend.py`, `compose.yaml`, `nginx.conf` and `nginx-l4.conf`, and run `docker compose up -d`.",
      "With Round Robin, run `for i in $(seq 1 30); do curl -s http://localhost:8080/api/; done | sort | uniq -c`. **Observe** a split of 15 to 15.",
      "Add `weight=2` to `api-1`, validate and reload (`docker compose exec nginx nginx -t` and then `nginx -s reload`) and repeat the count. **Observe** about 20 for `api-1` and 10 for `api-2`. If the split does not change, the container may be seeing the old version of the file (editors and `sed -i` replace the mounted file with a new one); run `docker compose restart nginx` and repeat the count.",
      "Remove the weight, enable `least_conn;`, reload and run `API1_DELAY=1 docker compose up -d api-1`. Reload Nginx again (the IP of `api-1` may have changed) and run `seq 1 20 | xargs -P 10 -I{} curl -s http://localhost:8080/api/ | sort | uniq -c`. **Observe** that the slow backend receives less new work (for example, 5 against 15; the numbers vary).",
      "Replace `least_conn;` with `ip_hash;`, reload and repeat the count. **Observe** that all responses come from the same backend. Explain why: because of Docker's port mapping, all requests reach Nginx with the same source IP (that of the network gateway). It is the effect of many users behind the same NAT.",
      "Compare L4 and L7: run `curl -s http://localhost:8080/` and `curl -s http://localhost:9090/`. **Observe** that only L7 answers on its own for a route, because only it reads the path.",
      "Measure with `ab -n 1000 -c 20 -k http://localhost:8080/api/` and note `Requests per second` and the mean time per request. Then describe in one sentence how Redis or JWT would eliminate the need for `ip_hash`.",
      "Clean up: `docker compose down`.",
    ],
    tip: "Choose the algorithm by the behavior of the load: Round Robin distributes count, `least_conn` distributes occupancy and `ip_hash` distributes affinity. If you need affinity for the application to work, the problem lies in the state kept inside the backend, and the long-term solution is to take it out of there.",
    takeaway:
      "Balancing is not just spreading requests: it is choosing how much information the balancer sees (L4 or L7) and which signal it uses (sequence, weight, active connections or affinity) without creating a new bottleneck.",
    figures: [
      {
        items: [
          {
            src: "/guides/servidores-web/etapa06-l4-l7.en.svg",
            alt: "Two panels. L7, Nginx on port 8080: GET / is answered by Nginx itself in location = /, and GET /api/ goes through location /api/ to api-1 and api-2 in Round Robin. L4, Nginx stream on port 9090: the client's TCP connection goes straight to api-1 or api-2.",
            caption:
              "The lab's two ports. The L7 balancer reads the path and decides: `/` does not reach the backends. L4 only sees IP and port and relays each TCP connection, so `/` also reaches a backend.",
          },
        ],
        credit: "Diagram: made for this guide",
      },
    ],
  },
  {
    id: "m7",
    num: "07",
    navTitle: "Failover and diagnosis",
    tag: "health checks + 502/504",
    title: "Health checks, failover, metrics and diagnosis",
    lead: "During a promotion, one of the three backends freezes, but the process stays up. For the operating system everything is fine, and the balancer keeps sending a third of the requests to it. A third of the users receive an error or wait until the timeout, and the team only finds out because customers complain. A balancer needs to measure whether the service really answers, take out of rotation whoever does not answer, have a plan B and, when something goes wrong, show where the problem is with logs and metrics.",
    concept: [
      "**Health checks.** In Nginx Open Source, the `max_fails` and `fail_timeout` parameters implement **passive** checking: failures observed in real requests temporarily take the backend out of rotation. With `max_fails=3 fail_timeout=10s`, three failures within 10 seconds take the server out of rotation for 10 seconds; after that Nginx tries it again and puts it back if the call works. Passive checking depends on real traffic: with no requests, there are no failures to observe. **Active** checks (periodic probes independent of traffic, with the `health_check` directive) are a feature of Nginx Plus, the commercial edition, or of external modules. A detail: in a group with a single server, `max_fails` and `fail_timeout` are ignored.",
      "**Failover and backup.** When an attempt fails by connection error or timeout, Nginx tries the next server in the group (the default behavior of `proxy_next_upstream`), so the client does not always notice the failure. The `backup` parameter reserves a server that only receives requests when all the primaries are unavailable (it cannot be combined with `ip_hash`, `hash` or `random`).",
      "**Metrics.** The `stub_status` module exposes active connections, total connections and accepted requests, and the reading, writing and waiting states. Apache Bench (`ab`) generates controlled load. Read together requests per second, latency, percentiles (the p95 shows the experience of the slowest ones, which the average hides), CPU and logs, to know whether the limit is in the proxy, in the backend or in a dependency.",
      "**Diagnosing 502 and 504.** The `502 Bad Gateway` error indicates that Nginx did not obtain a valid response from the upstream: connection refused, connection closed or invalid response. The `504 Gateway Timeout` error indicates that the connection was made, but the backend did not answer within `proxy_read_timeout`. The investigation follows the path of the request: client, Nginx, backend, dependencies. Increasing a timeout without investigating may only hide slowness.",
    ],
    pointsTitle: "Key concepts",
    points: [
      {
        t: "Passive check (`max_fails`, `fail_timeout`)",
        d: "failures in real traffic take the backend out for a while; available in Open Source.",
        color: "blue",
      },
      {
        t: "Active check (`health_check`)",
        d: "periodic probes; it requires Nginx Plus or an external module.",
        color: "signal",
      },
      {
        t: "`backup`",
        d: "a reserve server used only when the primaries fail.",
        color: "violet",
      },
      {
        t: "`proxy_next_upstream`",
        d: "defines on which failures Nginx tries another server in the group.",
        color: "ember",
      },
      {
        t: "`stub_status`",
        d: "a native panel with active connections and the reading, writing and waiting states.",
        color: "blue",
      },
      {
        t: "502 and 504",
        d: "502 is a failure to obtain a valid response (for example, connection refused); 504 is waiting beyond `proxy_read_timeout`.",
        color: "signal",
      },
    ],
    examplesTitle: "Primary and backup backends, status panel and provoked errors",
    examples: [
      {
        label: "compose.yaml",
        lang: "yaml",
        code: '# compose.yaml\nx-backend: &backend\n  image: python:3.12-alpine\n  command: ["python", "/app/backend.py"]\n  volumes:\n    - ./backend.py:/app/backend.py:ro\n  networks: [lab]\n\nservices:\n  api-1:\n    <<: *backend\n    environment: { NAME: api-1 }\n  api-2:\n    <<: *backend\n    environment: { NAME: api-2 }\n  api-backup:\n    <<: *backend\n    environment: { NAME: api-backup }      # only answers when the primaries fail\n  nginx:\n    image: nginx:stable\n    ports:\n      - "8080:80"\n    volumes:\n      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro\n    networks: [lab]\n    depends_on: [api-1, api-2, api-backup]\n  tools:                                   # container only to run curl inside the network\n    image: curlimages/curl\n    entrypoint: ["tail", "-f", "/dev/null"]\n    networks: [lab]\n\nnetworks:\n  lab:\n    ipam:\n      config:\n        - subnet: 172.30.0.0/24            # fixed subnet, used in the stub_status allow rule',
        intro:
          "The lab has `api-1`, `api-2`, `api-backup` and an Nginx with routes to provoke 502 and 504. Copy the `backend.py` from Stage 03 to `etapa07/`.",
      },
      {
        label: "nginx.conf",
        lang: "sh",
        code: "# nginx.conf\nlog_format lab '$remote_addr \"$request\" $status upstream=$upstream_addr ust=$upstream_status rt=$request_time';\n\nupstream pitstop_api {\n    server api-1:3000 max_fails=3 fail_timeout=10s;   # 3 failures in 10s take the server out for 10s\n    server api-2:3000 max_fails=3 fail_timeout=10s;\n    server api-backup:3000 backup;                    # reserve: only comes in if api-1 and api-2 are out\n}\n\nserver {\n    listen 80;\n    default_type text/plain;\n    access_log /var/log/nginx/access.log lab;         # log with the upstream address and the time of each request\n\n    location / {\n        proxy_pass http://pitstop_api;\n    }\n\n    location = /nginx_status {\n        stub_status;                                  # native connection panel\n        allow 127.0.0.1;                              # only the machine itself\n        allow 172.30.0.0/24;                          # and the lab network\n        deny all;                                     # denies the rest\n    }\n\n    location = /quebrado {\n        proxy_pass http://api-1:9999;                 # port where nobody listens: connection refused (502)\n    }\n\n    location = /lento {\n        proxy_read_timeout 2s;                        # waits at most 2s for the response\n        proxy_pass http://api-1:3000/slow;            # backend route that takes 10s (504)\n    }\n}",
        note: "The `/quebrado` and `/lento` routes use `api-1`, so test them with it up.",
      },
      {
        label: "terminal",
        lang: "sh",
        code: '# With normal traffic, the log shows a single upstream per request (approximate output)\n$ curl -s http://localhost:8080/\napi-1 recebeu /\n$ docker compose logs nginx --tail 2\nnginx-1  | 172.30.0.1 "GET / HTTP/1.1" 200 upstream=172.30.0.3:3000 ust=200 rt=0.003\n\n# After "docker compose stop api-1", the container disappears from the network. The connection attempt to the old IP\n# usually fails with "No route to host" or with a connection timeout after a few seconds\n# (and not with an immediate refusal). Nginx then tries the next server: the client receives 200,\n# but the request takes a while, and the log shows two addresses (the one that failed and the one that answered)\n# approximate output\nnginx-1  | 172.30.0.1 "GET / HTTP/1.1" 200 upstream=172.30.0.3:3000, 172.30.0.4:3000 ust=502, 200 rt=3.005\n\n# Provoked errors, with api-1 up (approximate output)\n$ curl -s -o /dev/null -w \'%{http_code} em %{time_total}s\\n\' http://localhost:8080/quebrado\n502 em 0.004s\n$ curl -s -o /dev/null -w \'%{http_code} em %{time_total}s\\n\' http://localhost:8080/lento\n504 em 2.003s\n\n# Status panel, from inside the network (approximate output)\n$ docker compose exec tools curl -s http://nginx/nginx_status\nActive connections: 1\nserver accepts handled requests\n 25 25 25\nReading: 0 Writing: 1 Waiting: 0',
        note: "The `502` from `/quebrado` comes back almost immediately because the connection is refused by an IP that exists and has nothing listening on the port; the `504` only appears after `proxy_read_timeout`. That time difference, seen together with the message in the error log (`Connection refused`, `No route to host` or `timed out`), already points to the cause. A backend stopped with `docker compose stop` behaves differently: since the IP disappears from the network, the first request that lands on it may take a few seconds, and the failures count toward `max_fails`. Nginx resolves the `upstream` names when it loads the configuration: if a container is recreated with another IP, reload Nginx (`nginx -s reload`).",
      },
    ],
    commands: [
      {
        cmd: "docker compose logs -f nginx",
        note: "follows accesses, failures and recovery",
      },
      {
        cmd: "docker compose stop api-1",
        note: "simulates the failure of a backend",
      },
      {
        cmd: "docker compose start api-1",
        note: "brings the backend back (afterwards, reload Nginx if the IP changed)",
      },
      {
        cmd: "docker compose exec tools curl -s http://nginx/nginx_status",
        note: "queries the native panel",
      },
      {
        cmd: "ab -n 2000 -c 50 -k http://localhost:8080/",
        note: "generates measurable load and prints the percentiles",
      },
      {
        cmd: "docker compose logs nginx | grep -E 'refused|timed out|unreachable|No route'",
        note: "shows the cause of the 502s and 504s in the error log",
      },
    ],
    handsOn: [
      "Create `etapa07/` with `backend.py`, `compose.yaml` and `nginx.conf`, and run `docker compose up -d`. Confirm with `for i in $(seq 1 6); do curl -s http://localhost:8080/; done` that the responses alternate between `api-1` and `api-2` and never come from `api-backup`.",
      "Run `ab -n 2000 -c 50 -k http://localhost:8080/` and note `Requests per second` and the `95%` line of the percentile table.",
      "In one terminal, run `for i in $(seq 1 60); do curl -s -o /dev/null -w '%{http_code} ' http://localhost:8080/; sleep 0.5; done`. In another, run `docker compose stop api-1`. **Observe** that all the codes stay 200, but that the first requests that land on `api-1` may take a few seconds each (the connection attempt to an IP that disappeared from the network is not refused immediately; the times vary). Confirm in `docker compose logs nginx --tail 30` the lines with two upstream addresses (the first one failed) and, after the three failures of `max_fails`, only the address of `api-2` during the 10-second window.",
      "Run `docker compose stop api-2` and `curl -s http://localhost:8080/`. **Observe** `api-backup recebeu /`: with the primaries out, the reserve takes over, and the first call may take a few seconds for the same reason as in the previous step.",
      "Run `docker compose start api-1 api-2`, reload Nginx (`docker compose exec nginx nginx -s reload`) and repeat the loop from step 1. **Observe** the return of the primaries and the end of backup usage.",
      "With `api-1` up, provoke the two errors: `curl -s -o /dev/null -w '%{http_code} em %{time_total}s\\n' http://localhost:8080/quebrado` and the same for `/lento`. **Observe** an immediate `502` and a `504` in about 2 seconds, and look for the cause with `docker compose logs nginx | grep -E 'refused|timed out|unreachable|No route'`.",
      "Query `docker compose exec tools curl -s http://nginx/nginx_status` during an `ab` run and **observe** `Active connections` rising.",
      "Clean up: `docker compose down`.",
    ],
    tip: "Never change three timeouts at the same time. Reproduce the problem, change one variable, repeat the load and compare the same metric. And remember that the passive check only discovers the failure when a real client is affected by it: the first request that lands on a sick backend pays the price.",
    takeaway:
      "High availability begins when the edge detects an incapable backend, stops sending work to it and proves, with logs and metrics, that the user experience carried on.",
    figures: [
      {
        items: [
          {
            src: "/guides/servidores-web/etapa07-failover.en.svg",
            alt: "Nginx with the pitstop_api upstream: the connection to api-1 fails and Nginx tries the next one; api-2 answers 200; api-backup, dashed, only comes in if api-1 and api-2 are down. Below, 502 when the connection to the backend fails and 504 when the backend does not answer within proxy_read_timeout.",
            caption:
              "The lab's upstream: a connection failure sends Nginx to the next server, three failures in 10 seconds take the server out of rotation, and the `backup` only receives traffic when no primary is left. Below, where each error comes from: 502 with no valid response, 504 with no response in time.",
          },
        ],
        credit: "Diagram: made for this guide",
      },
    ],
  },
  {
    id: "m8",
    num: "08",
    navTitle: "Kubernetes Ingress",
    tag: "host + path",
    title: "Ingress on Kubernetes",
    lead: "In the cluster, each Service that needs to be reached from outside could get its own `LoadBalancer`. With ten services, that is ten external balancers, ten public IPs to manage, ten sets of rules and ten cloud costs. The existing Service types solve parts of the problem: `ClusterIP` exposes the service only inside the cluster, `NodePort` publishes a high port on each node and `LoadBalancer` usually creates one external balancer per Service. What is missing is a single entry point that understands HTTP and routes by domain and path.",
    concept: [
      'The **Ingress** centralizes HTTP and HTTPS routing rules under a single entry point. It is only a declaration: an API object that says "host X and path Y go to Service Z". Whoever executes these rules is the **Ingress Controller** (ingress-nginx, Traefik, among others), which watches the Ingress objects and configures the real proxy that receives the traffic. Without a Controller, creating the Ingress object does not change the traffic.',
      "- **Host routing** separates domains (`api.exemplo.com` and `app.exemplo.com`). **Path routing** separates paths on the same domain (`/api` and `/`).",
      "- `pathType: Prefix` accepts the path and its subpaths; `Exact` requires complete equality; `ImplementationSpecific` leaves the interpretation to the Controller (it is the type used when the path has a regular expression in ingress-nginx).",
      "- Annotations apply features specific to the Controller, such as URL rewriting. They apply to the whole Ingress, and not to a single path. `ingressClassName` chooses which Controller serves the rule when there is more than one in the cluster.",
      "- The destination Service remains a stable `ClusterIP` for the selected Pods. If the Service has no endpoints (ready Pods), the Ingress has nowhere to forward.",
      "The Ingress remains stable, but its API is frozen (evolution happens in the Gateway API, `gateway.networking.k8s.io`, which Kubernetes recommends for new architectures). ingress-nginx, the Controller used in this lab, was retired by the Kubernetes project: the retirement was announced in November 2025 and maintenance ended in March 2026. It is still useful for studying the concept on Minikube, but for production prefer a maintained Controller or the Gateway API. This does not apply to the NGINX Ingress Controller maintained by F5, which is another project.",
    ],
    pointsTitle: "Key concepts",
    points: [
      {
        t: "Ingress",
        d: "declaration of hosts, paths and destination Services (`networking.k8s.io/v1`).",
        color: "blue",
      },
      {
        t: "Ingress Controller",
        d: "the component that reads the Ingresses and configures the real proxy.",
        color: "signal",
      },
      {
        t: "ingressClassName",
        d: "chooses the Controller responsible for the rule.",
        color: "violet",
      },
      {
        t: "pathType",
        d: "`Prefix`, `Exact` or `ImplementationSpecific`.",
        color: "ember",
      },
      {
        t: "`rewrite-target` annotation",
        d: "rewrites the path before sending it to the backend; it applies to all paths of the same Ingress.",
        color: "blue",
      },
      {
        t: "Service with endpoints",
        d: "a prerequisite for the Ingress to work; without ready Pods, there is no destination.",
        color: "signal",
      },
    ],
    examplesTitle: "One domain, two Services",
    examples: [
      {
        label: "apps.yaml",
        lang: "yaml",
        code: '# apps.yaml\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: api                                # "api" backend\nspec:\n  replicas: 2                              # two replicas\n  selector:\n    matchLabels:\n      app: api                             # selects the Pods by label\n  template:\n    metadata:\n      labels:\n        app: api                           # must match the selector\n    spec:\n      containers:\n        - name: api\n          image: python:3.12-alpine        # image with Python\n          command: ["python", "/app/backend.py"]   # runs the didactic backend\n          env:\n            - name: NAME\n              value: api                   # name returned in the responses\n          ports:\n            - containerPort: 3000          # backend port\n          readinessProbe:                  # only receives traffic when it answers\n            httpGet:\n              path: /healthz\n              port: 3000\n          volumeMounts:\n            - name: code\n              mountPath: /app              # the script appears at /app/backend.py\n      volumes:\n        - name: code\n          configMap:\n            name: backend-py               # ConfigMap created from backend.py\n---\napiVersion: v1\nkind: Service\nmetadata:\n  name: api\nspec:\n  selector:\n    app: api                               # forwards to the Pods with this label\n  ports:\n    - port: 80                             # Service port\n      targetPort: 3000                     # container port\n---\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: web                                # same template, another name\nspec:\n  replicas: 2\n  selector:\n    matchLabels:\n      app: web\n  template:\n    metadata:\n      labels:\n        app: web\n    spec:\n      containers:\n        - name: web\n          image: python:3.12-alpine\n          command: ["python", "/app/backend.py"]\n          env:\n            - name: NAME\n              value: web                   # the only field that changes\n          ports:\n            - containerPort: 3000\n          readinessProbe:\n            httpGet:\n              path: /healthz\n              port: 3000\n          volumeMounts:\n            - name: code\n              mountPath: /app\n      volumes:\n        - name: code\n          configMap:\n            name: backend-py\n---\napiVersion: v1\nkind: Service\nmetadata:\n  name: web\nspec:\n  selector:\n    app: web\n  ports:\n    - port: 80\n      targetPort: 3000',
        intro:
          "The two Services (`api` and `web`) use the `backend.py` from Stage 03 (copy it to `etapa08/`), delivered to the cluster by a ConfigMap.",
        note: "URL rewriting applies to all paths of the Ingress in which the annotation appears, so the `/api` route (with rewriting) and the `/` route (without rewriting) go in two separate Ingress objects.",
      },
      {
        label: "ingress.yaml",
        lang: "yaml",
        code: '# ingress.yaml\napiVersion: networking.k8s.io/v1\nkind: Ingress\nmetadata:\n  name: pitstop-api\n  annotations:\n    nginx.ingress.kubernetes.io/rewrite-target: /$2    # sends to the backend only what matched in the second group\nspec:\n  ingressClassName: nginx                  # served by ingress-nginx\n  rules:\n    - host: pitstop.local                  # host routing\n      http:\n        paths:\n          - path: /api(/|$)(.*)            # regular expression: group 2 is the rest of the path\n            pathType: ImplementationSpecific\n            backend:\n              service:\n                name: api\n                port:\n                  number: 80\n---\napiVersion: networking.k8s.io/v1\nkind: Ingress\nmetadata:\n  name: pitstop-web                        # no rewriting: the path stays intact\nspec:\n  ingressClassName: nginx\n  rules:\n    - host: pitstop.local\n      http:\n        paths:\n          - path: /status                  # exact path: only "/status", no subpaths\n            pathType: Exact\n            backend:\n              service:\n                name: api\n                port:\n                  number: 80\n          - path: /                        # everything else goes to the frontend\n            pathType: Prefix\n            backend:\n              service:\n                name: web\n                port:\n                  number: 80',
      },
      {
        label: "terminal",
        lang: "sh",
        code: "$ kubectl create configmap backend-py --from-file=backend.py\n$ kubectl apply -f apps.yaml -f ingress.yaml\n\n# Port-forward of the Controller, so as not to depend on the Minikube IP or on /etc/hosts\n# (the \"&\" puts it in the background; without it, the command holds the terminal and you need to open another)\n$ kubectl port-forward -n ingress-nginx svc/ingress-nginx-controller 8080:80 &\n\n# The Host header chooses the rule; the rewrite removes the /api prefix (approximate output)\n$ curl -s -H 'Host: pitstop.local' http://127.0.0.1:8080/api/health\napi recebeu /health\n$ curl -s -H 'Host: pitstop.local' http://127.0.0.1:8080/\nweb recebeu /\n\n# Exact matches only \"/status\"; a subpath falls into the \"/\" rule (Prefix)\n$ curl -s -H 'Host: pitstop.local' http://127.0.0.1:8080/status\napi recebeu /status\n$ curl -s -H 'Host: pitstop.local' http://127.0.0.1:8080/status/extra\nweb recebeu /status/extra",
      },
    ],
    commands: [
      {
        cmd: "minikube addons enable ingress -p lab",
        note: "installs ingress-nginx on Minikube's `lab` profile",
      },
      {
        cmd: "kubectl wait -n ingress-nginx --for=condition=ready pod --selector=app.kubernetes.io/component=controller --timeout=180s",
        note: "waits for the Controller to be ready",
      },
      {
        cmd: "helm upgrade --install ingress-nginx ingress-nginx/ingress-nginx -n ingress-nginx --create-namespace",
        note: "installation alternative on other clusters (it requires `helm repo add` for the ingress-nginx repository)",
      },
      {
        cmd: "kubectl get ingress,ingressclass",
        note: "checks the address and the class",
      },
      {
        cmd: "kubectl get endpointslices -l kubernetes.io/service-name=api",
        note: "checks whether the Service has ready Pods (`kubectl get endpoints api` also works, with a deprecation warning in recent versions)",
      },
      {
        cmd: "kubectl exec -n ingress-nginx deploy/ingress-nginx-controller -- cat /etc/nginx/nginx.conf | grep -n pitstop.local",
        note: "shows the `nginx.conf` that the Controller generated from the Ingresses",
      },
    ],
    handsOn: [
      "Start the cluster and the Controller: `minikube start -p lab`, `minikube addons enable ingress -p lab` and the `kubectl wait` above. **Observe** the `ingress-nginx-controller` Pod in `Running` and confirm the `nginx` class with `kubectl get ingressclass`.",
      "Create the ConfigMap (`kubectl create configmap backend-py --from-file=backend.py`) and apply `apps.yaml` and `ingress.yaml`. Confirm the Pods with `kubectl get pods` and the endpoints with `kubectl get endpointslices`.",
      "Open the port-forward in another terminal (`kubectl port-forward -n ingress-nginx svc/ingress-nginx-controller 8080:80`, which stays in the foreground) and, in the original terminal, run `curl -s -H 'Host: pitstop.local' http://127.0.0.1:8080/api/health` and the same for `/`. **Observe** `api recebeu /health` (the `/api` prefix was removed by the rewrite) and `web recebeu /`.",
      "Test `/status` and `/status/extra` with the same `Host` header. **Observe** that `Exact` matches only the exact path and that the subpath falls into the frontend's `/` rule.",
      "Run `kubectl exec ... cat /etc/nginx/nginx.conf | grep -n pitstop.local` and **observe** that the Controller turned the Ingress objects into `server` blocks of a real Nginx.",
      "Provoke a failure: `kubectl scale deployment api --replicas=0` and repeat `/api/health`. **Observe** the Controller's `503` response (Service without endpoints) and restore with `--replicas=2`.",
      "End the port-forward (Ctrl+C in the other terminal) and delete only the rules: `kubectl delete -f ingress.yaml`. Keep the `lab` profile, the applied `apps.yaml` and the `backend-py` ConfigMap, because Stage 09 uses the `web` Service. The full cleanup comes at the end of Stage 09.",
    ],
    tip: "When debugging, follow the order: Controller running, correct `ingressClassName`, rule recognized (`kubectl describe ingress`), Service with endpoints and a healthy Pod. The cause is usually in the last two items, not in the Ingress.",
    takeaway:
      "The Ingress declares a shared HTTP entry by host and path; the Controller turns that intent into a real proxy, and nothing works without a Service with healthy endpoints behind it.",
    figures: [
      {
        items: [
          {
            src: "/guides/servidores-web/etapa08-ingress-path.svg",
            alt: "A client arrives through a load balancer managed by the Ingress; the /foo rule leads to service1 and the /bar rule leads to service2, each with two Pods.",
            caption:
              "Path routing: the same entry address, and the URL path decides the Service. This is the case of this lab's `/api`.",
          },
          {
            src: "/guides/servidores-web/etapa08-ingress-host.svg",
            alt: "A client arrives through a load balancer managed by the Ingress; the host foo.bar.com leads to service1 and the host bar.foo.com leads to service2, each with two Pods.",
            caption:
              "Host routing: the request's `Host` header decides the Service. In both cases, the Ingress is only the rule; whoever executes it is the Ingress Controller.",
          },
        ],
        credit: "Diagram: kubernetes.io, The Kubernetes Authors, CC BY 4.0",
      },
    ],
  },
  {
    id: "m9",
    num: "09",
    navTitle: "Automated TLS",
    tag: "cert-manager",
    title: "TLS and cert-manager",
    lead: "The store's site runs on HTTPS, and the certificate expires in 90 days. Someone needs to remember, generate the request, prove to the authority that the domain belongs to the company, install the file and reload the server. With dozens of domains and services created and removed all the time in the cluster, this does not scale. An expired certificate takes access away from all users with a security warning in the browser.",
    concept: [
      "TLS offers confidentiality, integrity and server authentication. **cert-manager** extends the Kubernetes API with declarative resources to issue, store and renew certificates automatically.",
      "- **Issuer** issues certificates within a namespace; **ClusterIssuer** serves the whole cluster. They define the issuing authority (self-signed, an internal CA or ACME).",
      "- **Certificate** declares the DNS names, the duration and the **Secret** that will receive the private key and the certificate.",
      "- With **ACME** (the protocol used by Let's Encrypt), an **HTTP-01** challenge (publishing a token at a path of the site) or **DNS-01** (publishing a TXT record) proves control of the domain. cert-manager tracks the validity and renews before expiry (by default, the duration is 90 days and renewal starts when a third of it remains).",
      "- The **Ingress** references the TLS Secret. With the `cert-manager.io/cluster-issuer` annotation, cert-manager creates the Certificate on its own from the Ingress's `tls` block.",
      "- On the connection, the client states the name of the site it wants right at the start of the handshake (**SNI**), and that is why a single Controller can present the right certificate for each host.",
      "The private key stays in the cluster and must not be written to manifests or repositories. A Secret is base64-encoded, and that is not encryption: the protection comes from access control (RBAC) over the Secrets.",
      "The ACME challenge requires a public domain reachable by the authority, so Let's Encrypt can only be practiced with a real domain. The lab uses a self-signed ClusterIssuer, which exercises the same path (Ingress, Certificate, Secret, renewal) without depending on the public internet. When using Let's Encrypt for real, start with the staging environment to avoid the issuance limits.",
    ],
    pointsTitle: "Key concepts",
    points: [
      {
        t: "Issuer and ClusterIssuer",
        d: "define who issues the certificates (`cert-manager.io/v1`).",
        color: "blue",
      },
      {
        t: "Certificate",
        d: "the request (DNS names, duration, destination Secret).",
        color: "signal",
      },
      {
        t: "`kubernetes.io/tls` Secret",
        d: "holds `tls.crt` and `tls.key`; it is what the Ingress uses.",
        color: "violet",
      },
      {
        t: "ACME, HTTP-01 and DNS-01",
        d: "protocol and challenges to prove ownership of the domain.",
        color: "ember",
      },
      {
        t: "Renewal",
        d: "automatic, before expiry (`renewBefore`).",
        color: "blue",
      },
      {
        t: "Staging",
        d: "Let's Encrypt's test environment, without the strict production limits.",
        color: "signal",
      },
    ],
    examplesTitle: "Ingress integrated with cert-manager",
    examples: [
      {
        label: "clusterissuer-selfsigned.yaml",
        lang: "yaml",
        code: "# clusterissuer-selfsigned.yaml\napiVersion: cert-manager.io/v1\nkind: ClusterIssuer\nmetadata:\n  name: selfsigned                         # name cited in the annotations\nspec:\n  selfSigned: {}                           # issues self-signed certificates (lab only)",
      },
      {
        label: "ingress-tls.yaml",
        lang: "yaml",
        code: "# ingress-tls.yaml\napiVersion: networking.k8s.io/v1\nkind: Ingress\nmetadata:\n  name: pitstop-secure\n  annotations:\n    cert-manager.io/cluster-issuer: selfsigned   # asks cert-manager to issue the certificate\nspec:\n  ingressClassName: nginx\n  tls:\n    - hosts:\n        - secure.pitstop.local             # names covered by the certificate\n      secretName: pitstop-tls              # Secret that cert-manager will create\n  rules:\n    - host: secure.pitstop.local\n      http:\n        paths:\n          - path: /\n            pathType: Prefix\n            backend:\n              service:\n                name: web                  # Service created in Stage 08 (kept until the end of this stage)\n                port:\n                  number: 80",
        note: "To observe a renewal without waiting 60 days, create an explicit Certificate with the minimum allowed duration (1 hour) and a renewal window of 55 minutes: the renewal happens about 5 minutes after issuance.",
      },
      {
        label: "certificate-renova.yaml",
        lang: "yaml",
        code: "# certificate-renova.yaml\napiVersion: cert-manager.io/v1\nkind: Certificate\nmetadata:\n  name: renova-teste\nspec:\n  secretName: renova-teste-tls             # destination Secret\n  duration: 1h                             # minimum validity accepted by cert-manager\n  renewBefore: 55m                         # renews when 55 minutes remain (5 minutes after issuing)\n  dnsNames:\n    - renova.pitstop.local                 # certificate's DNS name\n  issuerRef:\n    name: selfsigned                       # issuer used\n    kind: ClusterIssuer",
        note: "The manifest below is read-only: it configures Let's Encrypt's ACME in staging and requires a public domain reachable on port 80.",
      },
      {
        label: "clusterissuer-letsencrypt-staging.yaml",
        lang: "yaml",
        code: "# clusterissuer-letsencrypt-staging.yaml\napiVersion: cert-manager.io/v1\nkind: ClusterIssuer\nmetadata:\n  name: letsencrypt-staging\nspec:\n  acme:\n    server: https://acme-staging-v02.api.letsencrypt.org/directory   # staging; production uses acme-v02\n    email: voce@exemplo.com                # contact for notices from the authority\n    privateKeySecretRef:\n      name: letsencrypt-staging-account    # Secret that holds the ACME account key\n    solvers:\n      - http01:\n          ingress:\n            ingressClassName: nginx        # the HTTP-01 challenge goes through the same Controller",
      },
      {
        label: "terminal",
        lang: "sh",
        code: "# cert-manager installation by Helm (the chart version is the latest in the repository)\n$ helm repo add jetstack https://charts.jetstack.io\n$ helm repo update\n$ helm install cert-manager jetstack/cert-manager -n cert-manager --create-namespace --set crds.enabled=true\n\n$ kubectl apply -f clusterissuer-selfsigned.yaml -f ingress-tls.yaml\n$ kubectl get certificate -w\nNAME          READY   SECRET        AGE\npitstop-tls   False   pitstop-tls   2s\npitstop-tls   True    pitstop-tls   4s\n\n$ kubectl get secret pitstop-tls -o jsonpath='{.data.tls\\.crt}' | base64 -d \\\n    | openssl x509 -noout -issuer -dates -ext subjectAltName\n# approximate output\nissuer=                                    # self-signed: the issuer is the certificate itself (the line may come empty, because the request only defines the DNS name)\nnotBefore=...\nnotAfter=...                               # about 90 days later\nX509v3 Subject Alternative Name:\n    DNS:secure.pitstop.local\n\n# Response body over HTTPS (-k accepts the self-signed certificate; --resolve sends the correct name, the SNI)\n$ curl -sk --resolve secure.pitstop.local:8443:127.0.0.1 https://secure.pitstop.local:8443/\nweb recebeu /\n\n# Certificate delivered: it should no longer be the Controller's default fake certificate (approximate output)\n$ curl -skv --resolve secure.pitstop.local:8443:127.0.0.1 https://secure.pitstop.local:8443/ 2>&1 | grep -iE 'subject:|issuer:'\n*  subject: (may be empty)\n*  issuer: (may be empty)",
      },
    ],
    commands: [
      {
        cmd: "kubectl get clusterissuer",
        note: "confirms the certificate source",
      },
      {
        cmd: "kubectl describe certificate pitstop-tls",
        note: "shows issuance, events and renewal",
      },
      {
        cmd: "kubectl get certificate,certificaterequest,order,challenge -A",
        note: "investigates the flow (Order and Challenge only exist with ACME)",
      },
      {
        cmd: "kubectl port-forward -n ingress-nginx svc/ingress-nginx-controller 8443:443",
        note: "exposes the Controller's HTTPS locally (in another terminal, because it stays in the foreground)",
      },
      {
        cmd: "curl -sk --resolve secure.pitstop.local:8443:127.0.0.1 https://secure.pitstop.local:8443/",
        note: "shows the response body, sending the correct name (SNI); `-k` accepts the self-signed certificate",
      },
      {
        cmd: "minikube delete -p lab",
        note: "removes the `lab` cluster at the end of the stage, before bringing up the `mesh` profile of Stage 10",
      },
    ],
    handsOn: [
      "In the `lab` cluster, confirm that `apps.yaml` and the `backend-py` ConfigMap from Stage 08 are still applied (`kubectl get svc web`). If you deleted them, recreate them with `kubectl create configmap backend-py --from-file=backend.py` and `kubectl apply -f apps.yaml`, using the files from the `etapa08/` folder. Install cert-manager with the three `helm` commands from the example and confirm the three `Running` Pods with `kubectl get pods -n cert-manager`.",
      "Apply `clusterissuer-selfsigned.yaml` and `ingress-tls.yaml`. Run `kubectl get certificate -w` and **observe** `READY` go from `False` to `True`. Confirm the Secret with `kubectl get secret pitstop-tls` and **observe** the `kubernetes.io/tls` type.",
      "In another terminal, open the port-forward for port 443 (`kubectl port-forward -n ingress-nginx svc/ingress-nginx-controller 8443:443`). In the original terminal, first run `curl -sk --resolve secure.pitstop.local:8443:127.0.0.1 https://secure.pitstop.local:8443/` and **observe** the `web recebeu /` response. Then run the same command with `-v` and `2>&1 | grep -iE 'subject:|issuer:'` and **observe** that the delivered certificate is no longer the Controller's `Kubernetes Ingress Controller Fake Certificate` (the cert-manager certificate does not define a common name, so `subject` and `issuer` may come empty; the site's name appears in the `subjectAltName` extension, which step 4 shows).",
      "Inspect the Secret's certificate with the `openssl` from the example and **observe** the `issuer=` line, the DNS name in `subjectAltName` and the validity.",
      "Apply `certificate-renova.yaml`, wait about 6 minutes and run `kubectl describe certificate renova-teste`. **Observe** a renewal event and `Revision: 2` in the status.",
      "Show that base64 is not encryption: `kubectl get secret pitstop-tls -o jsonpath='{.data.tls\\.key}' | base64 -d | head -n 1` shows the start of the private key in plain text. Explain which access controls (RBAC) protect the Secret.",
      "Clean up everything from Stage 08 and this one: end the port-forward (Ctrl+C), run `kubectl delete -f ingress-tls.yaml -f certificate-renova.yaml`, `kubectl delete secret pitstop-tls renova-teste-tls`, `kubectl delete -f ../etapa08/apps.yaml`, `kubectl delete configmap backend-py` and, finally, `minikube delete -p lab`. Two clusters running at the same time are heavy, and Stage 10 brings up a new profile (`mesh`) with 4 CPUs and 8 GB.",
    ],
    tip: "When issuance gets stuck, read the Certificate's events and, with ACME, the Challenge's. The cause is almost always incorrect DNS, a wrong `ingressClassName` or a block on the HTTP-01 challenge path. Use staging while testing and only switch to production when DNS and route are correct.",
    takeaway:
      "cert-manager turns the certificate into a desired state: you declare domain and destination, and the controller issues, stores in the Secret and renews before expiry.",
    figures: [
      {
        items: [
          {
            src: "/guides/servidores-web/etapa09-cert-manager.svg",
            alt: "cert-manager at the center, linked above to several Issuers (Let's Encrypt staging and production, Vault and others) and below to two Certificates, each generating a Secret with the signed key pair.",
            caption:
              "The Certificate says which name needs a certificate and which Issuer signs it; cert-manager requests it, stores the result in a Secret and renews before expiry. In this lab, the Issuer is a self-signed ClusterIssuer.",
          },
        ],
        credit: "Diagram: cert-manager.io, The cert-manager Authors, Apache 2.0",
      },
    ],
  },
  {
    id: "m10",
    num: "10",
    navTitle: "Service Mesh",
    tag: "istio + sidecars",
    title: "Service Mesh and Istio's architecture",
    lead: "An e-commerce application became twenty microservices. Every internal call is now a network call, subject to latency, failures and questions nobody answered: is the service that called who it says it is? How many times to retry before giving up? How do we know where the request got slow? Each team implements timeout, retry, encryption and telemetry in its own language, in a different way, and the network's behavior becomes inconsistent. A Service Mesh moves these policies to centrally controlled proxies.",
    concept: [
      "In Istio's **sidecar** model, an **Envoy** proxy is injected into each Pod, next to the application container, and intercepts inbound and outbound traffic. The application stays focused on the business rule.",
      "- The **Data Plane** is made up of the Envoy proxies: they process the requests and apply routing, resilience, security and telemetry.",
      "- The **Control Plane** is **Istiod**: it watches services and Istio resources, translates the high-level rules into Envoy configuration, distributes service discovery and issues the workloads' identities (certificates).",
      "- Injection is enabled per namespace (`istio-injection=enabled`) and happens when the Pod is created: Pods that already exist only get the sidecar when they are recreated (for example, with `kubectl rollout restart`).",
      "The abstraction has a cost: each sidecar consumes CPU and memory, adds latency per hop and the mesh is an additional platform to update and diagnose. For a few services, the benefit may not pay off. Istio also offers ambient mode, without sidecars; this guide uses sidecars because the path of the traffic stays visible.",
    ],
    pointsTitle: "Key concepts",
    points: [
      {
        t: "Service Mesh",
        d: "a layer that standardizes retry, timeout, mTLS and telemetry outside the applications' code.",
        color: "blue",
      },
      {
        t: "Envoy (sidecar)",
        d: "the proxy beside each workload; it intercepts and processes the traffic.",
        color: "signal",
      },
      {
        t: "Data Plane",
        d: "the set of proxies that apply the policies.",
        color: "violet",
      },
      {
        t: "Istiod (Control Plane)",
        d: "distributes configuration, discovery and identities.",
        color: "ember",
      },
      {
        t: "Injection per namespace",
        d: "the `istio-injection=enabled` label and the recreation of the Pods.",
        color: "blue",
      },
      {
        t: "Overhead",
        d: "extra resources, one more hop and one more platform to operate.",
        color: "signal",
      },
    ],
    examplesTitle: "Installation, injection and sidecar validation",
    examples: [
      {
        label: "app.yaml",
        lang: "yaml",
        code: '# app.yaml\napiVersion: v1\nkind: ServiceAccount\nmetadata:\n  name: web                                # client identity (used in Stage 12)\n---\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: api-v1\nspec:\n  replicas: 1\n  selector:\n    matchLabels:\n      app: api\n      version: v1\n  template:\n    metadata:\n      labels:\n        app: api                           # label recommended by Istio\n        version: v1                        # version: basis of the Stage 11 subsets\n    spec:\n      containers:\n        - name: api\n          image: python:3.12-alpine\n          command: ["python", "/app/backend.py"]\n          env:\n            - name: NAME\n              value: api-v1                # name returned in the responses\n          ports:\n            - containerPort: 3000\n          volumeMounts:\n            - name: code\n              mountPath: /app\n      volumes:\n        - name: code\n          configMap:\n            name: backend-py\n---\napiVersion: v1\nkind: Service\nmetadata:\n  name: api\nspec:\n  selector:\n    app: api                               # selects all versions of the api\n  ports:\n    - name: http                           # the name http tells the mesh the protocol\n      port: 80\n      targetPort: 3000\n---\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: web\nspec:\n  replicas: 1\n  selector:\n    matchLabels:\n      app: web\n  template:\n    metadata:\n      labels:\n        app: web\n    spec:\n      serviceAccountName: web              # the client calls the api with the "web" identity\n      containers:\n        - name: web\n          image: curlimages/curl\n          command: ["sleep", "86400"]      # stays idle; we will use kubectl exec to call the api',
        intro:
          "The lab uses a `demo` namespace with an `api` application (version v1) and a `web` client. Copy the `backend.py` from Stage 03 to `etapa10/` and run all the commands below from that folder.",
      },
      {
        label: "terminal",
        lang: "sh",
        code: "# From inside etapa10/: downloads Istio (it brings istioctl and the sample manifests) and installs the demo profile\n$ curl -L https://istio.io/downloadIstio | sh -\n# enters the downloaded folder only to put istioctl on the PATH (absolute path) and goes back to etapa10/\n$ cd istio-* && export PATH=$PWD/bin:$PATH && cd -\n$ minikube start -p mesh --cpus=4 --memory=8192\n$ istioctl install --set profile=demo -y\n# approximate output\n✔ Istio core installed\n✔ Istiod installed\n✔ Egress gateways installed\n✔ Ingress gateways installed\n✔ Installation complete\n\n# Still in etapa10/ (where backend.py and app.yaml are):\n# applies the application BEFORE enabling injection: the Pods are born without a sidecar (1/1)\n$ kubectl create namespace demo\n$ kubectl create configmap backend-py --from-file=backend.py -n demo\n$ kubectl apply -f app.yaml -n demo\n$ kubectl get pods -n demo\nNAME            READY   STATUS    RESTARTS   AGE\napi-v1-xxxx     1/1     Running   0          20s\nweb-xxxx        1/1     Running   0          20s\n\n# Enables injection and recreates the Pods: now each one has the app and the proxy (2/2)\n$ kubectl label namespace demo istio-injection=enabled\n$ kubectl rollout restart deployment -n demo\n$ kubectl get pods -n demo\nNAME            READY   STATUS    RESTARTS   AGE\napi-v1-yyyy     2/2     Running   0          15s\nweb-yyyy        2/2     Running   0          15s",
        note: "`READY 2/2` indicates the application and the proxy in the same Pod. The `demo` profile serves the lab (it turns logs and traces up to high levels and installs extra gateways); it is not the default production configuration. The `export PATH` only applies to the terminal in which it was run: in a new terminal, repeat it (`export PATH=$PWD/bin:$PATH` inside the `istio-*` folder). The sample manifests that Stage 12 uses are in `etapa10/istio-*/samples/addons`.",
      },
    ],
    commands: [
      {
        cmd: "istioctl install --set profile=demo -y",
        note: "installs a lab Istio",
      },
      {
        cmd: "kubectl label namespace demo istio-injection=enabled",
        note: "enables classic sidecar injection",
      },
      {
        cmd: "kubectl rollout restart deployment -n demo",
        note: "recreates the Pods so that they receive the sidecar",
      },
      {
        cmd: "istioctl proxy-status",
        note: "checks whether the proxies are in sync with Istiod (`SYNCED`)",
      },
      {
        cmd: 'kubectl get pod -n demo -l app=api -o jsonpath=\'{range .items[0].spec.containers[*]}{.name}{"\\t"}{.resources.requests}{"\\n"}{end}\'',
        note: "shows the resources reserved by each container, including `istio-proxy`",
      },
      {
        cmd: "minikube delete -p mesh",
        note: "removes the lab cluster at the end of Stages 10 to 12",
      },
    ],
    handsOn: [
      "Go into `etapa10/` and run the first three commands of the example (download, `cd istio-* && export PATH=$PWD/bin:$PATH && cd -` and `minikube start`). Confirm with `pwd` that you are back in `etapa10/`, install Istio with `istioctl install --set profile=demo -y` and **observe** `Installation complete`. Run `kubectl get pods -n istio-system` to see `istiod` and the gateways in `Running`.",
      "Still in `etapa10/`, create the `demo` namespace, the ConfigMap and apply `app.yaml`. **Observe** `READY 1/1` on both Pods, without a sidecar.",
      "Enable injection, run `kubectl rollout restart deployment -n demo` and **observe** `READY 2/2`. Run `kubectl get pod -n demo -l app=api -o jsonpath='{.items[0].spec.containers[*].name}'` and **observe** the `api` and `istio-proxy` containers.",
      "Run `istioctl proxy-status` and **observe** the proxies of `api-v1` and `web` in `SYNCED`. Also run the reserved resources command and record the proxy's cost in CPU and memory.",
      "Test the internal call: `kubectl exec -n demo deploy/web -c web -- curl -s http://api/`. **Observe** `api-v1 recebeu /`, now passing through two proxies.",
      "Create the `legacy` namespace without the label (`kubectl create namespace legacy`), copy the ConfigMap (`kubectl create configmap backend-py --from-file=backend.py -n legacy`) and apply `app.yaml` with `-n legacy`. **Observe** `READY 1/1` and explain where the mesh's policies stop acting: on Pods without a sidecar, no Istio policy is applied.",
      "Keep the `mesh` cluster and the `demo` namespace for Stages 11 and 12. Clean up `legacy` with `kubectl delete namespace legacy`.",
    ],
    tip: "A Service Mesh does not fix bad code or a slow dependency: it standardizes the network's behavior and offers better signals to find the problem. Before adopting it, describe a scenario in your system in which the mesh's complexity would not pay off; if you cannot find any, you probably have not yet weighed the cost.",
    takeaway:
      "Istio separates communication from business: Envoy executes the policies in the Data Plane and Istiod coordinates configuration and identity in the Control Plane, at the cost of resources and operation.",
    figures: [
      {
        items: [
          {
            src: "/guides/servidores-web/etapa10-istio-arquitetura.svg",
            alt: "Inside the mesh, Services A and B each have a proxy beside them; inbound traffic, traffic between services and outbound traffic pass through the proxies, and istiod, in the control plane, sends discovery, configuration and certificates to them.",
            caption:
              "The data plane is the Envoy proxies beside each Pod, through which all traffic passes; the control plane is istiod, which does not touch the requests and only distributes configuration and certificates.",
          },
        ],
        credit: "Diagram: istio.io, Istio Authors, Apache 2.0",
      },
    ],
  },
  {
    id: "m11",
    num: "11",
    navTitle: "Traffic in Istio",
    tag: "canary + mirror",
    title: "VirtualService, DestinationRule and gradual deployment",
    lead: "Version 2 of the orders API is ready. Releasing it to 100% of users at once is risky: an error that the tests did not catch brings down all sales, and the reversal requires a new deploy. It would be better to send a small fraction of real traffic to the new version, watch errors and latency and only then widen it. Splitting by exact percentage, or by characteristics of the request, is not something a Kubernetes Service knows how to do, because it distributes by the number of Pods.",
    concept: [
      "In Istio, two rules work together. The **DestinationRule** names groups of Pods (**subsets**, selected by labels such as `version: v1`) and defines connection policies for the destination. The **VirtualService** decides how each call travels through those groups: weights, conditions by header or path, retries, timeouts, mirroring and simulated failures. The rules are applied by the client's sidecar, so they only apply to calls that go through a mesh proxy.",
      "Three ways of testing a version:",
      "- **Canary by weight** sends a small percentage of real traffic to the new version and widens it gradually. The weights of a route must add up to 100.",
      "- **A/B testing** uses characteristics of the request (header, cookie, path) to segment users, for example always sending a test user to v2.",
      "- **Traffic mirroring** duplicates the calls to the new version and discards its response: the client keeps receiving v1, and v2 receives real load with no risk to the user.",
      "Resilience in the same resource: **retries** help with transient failures, but multiply the load if they are not limited. `attempts` is the number of new attempts after the first, `perTryTimeout` limits each attempt and the route's `timeout` limits the total time, which must accommodate all the attempts. **Circuit breaking** (in the DestinationRule, with `outlierDetection`) ejects endpoints that fail repeatedly, to avoid cascades. Fault injection (`fault`, with delay or abort) lets you test how applications react.",
      "Weight is the delivery mechanism, not the success criterion: the decision to widen the canary comes from error rate, latency and business metrics.",
    ],
    pointsTitle: "Key concepts",
    points: [
      {
        t: "DestinationRule",
        d: "defines subsets (groups by label) and destination policies (`networking.istio.io/v1`).",
        color: "blue",
      },
      {
        t: "VirtualService",
        d: "defines routes, weights, matches, retries, timeout, mirror and fault (`networking.istio.io/v1`).",
        color: "signal",
      },
      {
        t: "Canary, A/B and mirroring",
        d: "split by weight, segmentation by condition and copy of the traffic.",
        color: "violet",
      },
      {
        t: "Retries and timeout",
        d: "the total timeout must be greater than (`attempts` + 1) × `perTryTimeout`, because `attempts` does not count the first try.",
        color: "ember",
      },
      {
        t: "Circuit breaking (`outlierDetection`)",
        d: "ejects endpoints that fail in sequence.",
        color: "blue",
      },
      {
        t: "Rule order",
        d: "the first `match` that matches wins; the default route goes last.",
        color: "signal",
      },
    ],
    examplesTitle: "Ninety percent v1, ten percent v2",
    examples: [
      {
        label: "api-v2.yaml",
        lang: "yaml",
        code: '# api-v2.yaml\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: api-v2\nspec:\n  replicas: 1\n  selector:\n    matchLabels:\n      app: api\n      version: v2\n  template:\n    metadata:\n      labels:\n        app: api                           # the "api" Service selects this Pod too\n        version: v2                        # distinguishes v2 from v1\n    spec:\n      containers:\n        - name: api\n          image: python:3.12-alpine\n          command: ["python", "/app/backend.py"]\n          env:\n            - name: NAME\n              value: api-v2\n          ports:\n            - containerPort: 3000\n          volumeMounts:\n            - name: code\n              mountPath: /app\n      volumes:\n        - name: code\n          configMap:\n            name: backend-py',
        intro:
          "First, version 2 of the application, equal to v1 except for the name and the `version` label.",
      },
      {
        label: "canary.yaml",
        lang: "yaml",
        code: '# canary.yaml\napiVersion: networking.istio.io/v1\nkind: DestinationRule\nmetadata:\n  name: api\nspec:\n  host: api.demo.svc.cluster.local         # full name of the Service, to avoid ambiguity\n  subsets:\n    - name: v1\n      labels:\n        version: v1                        # Pods with this label form the v1 subset\n    - name: v2\n      labels:\n        version: v2\n---\napiVersion: networking.istio.io/v1\nkind: VirtualService\nmetadata:\n  name: api\nspec:\n  hosts:\n    - api.demo.svc.cluster.local           # calls to this host go through these rules\n  http:\n    - match:                               # rule 1: evaluated first\n        - headers:\n            x-usuario:\n              exact: teste                 # whoever sends "x-usuario: teste"...\n      route:\n        - destination:\n            host: api.demo.svc.cluster.local\n            subset: v2                     # ...always goes to v2 (A/B)\n    - route:                               # rule 2: everything else\n        - destination:\n            host: api.demo.svc.cluster.local\n            subset: v1\n          weight: 90                       # 90% to v1\n        - destination:\n            host: api.demo.svc.cluster.local\n            subset: v2\n          weight: 10                       # 10% to v2 (canary); the weights add up to 100\n      timeout: 2s                          # maximum total time of the call\n      retries:\n        attempts: 2                        # up to 2 new attempts after the first\n        perTryTimeout: 500ms               # 3 attempts x 500ms = 1.5s, within the 2s timeout',
      },
      {
        label: "mirror.yaml",
        lang: "yaml",
        code: "# mirror.yaml\napiVersion: networking.istio.io/v1\nkind: VirtualService\nmetadata:\n  name: api                                # replaces the previous VirtualService\nspec:\n  hosts:\n    - api.demo.svc.cluster.local\n  http:\n    - route:\n        - destination:\n            host: api.demo.svc.cluster.local\n            subset: v1                     # the client keeps receiving v1\n      mirror:\n        host: api.demo.svc.cluster.local\n        subset: v2                         # copy of the call sent to v2; the response is discarded\n      mirrorPercentage:\n        value: 100.0                       # mirrors 100% of the calls",
        note: "The manifest below is read-only: it shows circuit breaking with endpoint ejection, which only manifests when a backend returns 5xx errors in sequence.",
      },
      {
        label: "circuit-breaker.yaml",
        lang: "yaml",
        code: "# circuit-breaker.yaml\napiVersion: networking.istio.io/v1\nkind: DestinationRule\nmetadata:\n  name: api-cb\nspec:\n  host: api.demo.svc.cluster.local\n  trafficPolicy:\n    outlierDetection:\n      consecutive5xxErrors: 3              # 3 consecutive 5xx errors eject the endpoint\n      interval: 10s                        # frequency of the analysis\n      baseEjectionTime: 30s                # minimum time out of rotation\n      maxEjectionPercent: 50               # at most half of the endpoints ejected",
      },
      {
        label: "terminal",
        lang: "sh",
        code: "$ kubectl apply -f api-v2.yaml -n demo\n$ kubectl apply -f canary.yaml -n demo\n$ istioctl analyze -n demo\n✔ No validation issues found when analyzing namespace: demo.\n\n# Counts 100 responses from the mesh client (approximate output: the numbers vary)\n$ kubectl exec -n demo deploy/web -c web -- sh -c 'for i in $(seq 1 100); do curl -s http://api/; done' | sort | uniq -c\n     91 api-v1 recebeu /\n      9 api-v2 recebeu /\n\n# The test header always goes to v2\n$ kubectl exec -n demo deploy/web -c web -- curl -s -H 'x-usuario: teste' http://api/\napi-v2 recebeu /",
      },
    ],
    commands: [
      {
        cmd: "kubectl apply -f canary.yaml -n demo",
        note: "publishes the subsets and the traffic split",
      },
      {
        cmd: "istioctl analyze -n demo",
        note: "detects invalid configurations (labels without Pods, nonexistent hosts)",
      },
      {
        cmd: "kubectl exec -n demo deploy/web -c web -- sh -c 'for i in $(seq 1 100); do curl -s http://api/; done' | sort | uniq -c",
        note: "measures the proportion",
      },
      {
        cmd: "kubectl get virtualservice,destinationrule -n demo",
        note: "checks the resources",
      },
      {
        cmd: "kubectl logs -n demo deploy/api-v2 -c api --tail 5",
        note: "shows the requests received by v2 (including the mirrored ones)",
      },
      {
        cmd: "kubectl delete virtualservice api -n demo",
        note: "goes back to the Service's ordinary balancing (canary rollback)",
      },
    ],
    handsOn: [
      "Apply `api-v2.yaml` and confirm `READY 2/2` on both `api` Pods. Run `kubectl get endpointslices -n demo -l kubernetes.io/service-name=api` and **observe** two endpoints: the Service selects both versions.",
      "With no VirtualService, count 100 responses with the loop from the example. **Observe** a split close to 50 and 50, the behavior of the plain Service.",
      "Apply `canary.yaml`, run `istioctl analyze -n demo` and count 100 responses again. **Observe** about 90 for v1 and 10 for v2 (the split is statistical, so the numbers vary).",
      "Send `curl -s -H 'x-usuario: teste' http://api/` through the `web` client several times. **Observe** `api-v2` in all the responses, and the same command without the header going back to the 90/10 split.",
      "Apply `mirror.yaml`, send 10 calls through the client and **observe** that all the responses are `api-v1`. Then run `kubectl logs -n demo deploy/api-v2 -c api --tail 12` and **observe** the 10 requests reaching v2, even though the client does not receive its response.",
      "Practice the rollback: `kubectl delete virtualservice api -n demo` and count 100 responses. **Observe** the return to the Service's split. If something looks wrong, run `istioctl analyze` before attributing the deviation to the proxy.",
      "Keep the cluster for Stage 12 and leave it without a VirtualService, as after the rollback in step 6. If you reapply `canary.yaml` or `mirror.yaml`, the Stage 12 responses will also come from v2 and the counters read only on `api-v1` will differ from the ones shown there.",
    ],
    tip: "If all the traffic falls on a single version, check in this order: the Pods' labels against the subsets, the VirtualService's `host` against the Service, and the order of the `match` rules. Also remember that the rules only apply to calls made by a client with a sidecar; a client outside the mesh ignores the VirtualService.",
    takeaway:
      "The DestinationRule defines the available groups and the VirtualService decides how each call travels through those groups: together, they make gradual deployment observable and reversible.",
    figures: [
      {
        items: [
          {
            src: "/guides/servidores-web/etapa11-istio-versoes.svg",
            alt: "The Envoy next to service A receives routing rules from Pilot and sends 99% of calls to version v1.5 of service B and 1% to version v2.0-alpha.",
            caption:
              "Weighted canary: the client's proxy splits calls between service B's subsets, and the new version receives only a fraction of the traffic. The drawing comes from an old version of the documentation; Pilot, which distributes the rules, is now part of istiod.",
          },
        ],
        credit: "Diagram: istio.io, Istio Authors, Apache 2.0",
      },
    ],
  },
  {
    id: "m12",
    num: "12",
    navTitle: "mTLS and observability",
    tag: "identity + metrics",
    title: "mTLS, authorization and observability in the mesh",
    lead: 'The cluster is inside a private network, so "nobody from outside can call it". In practice, a single compromised or misconfigured Pod can call any other service, and internal traffic travels in plain text. In addition, when a request gets slow in a chain of five services, nobody knows which one consumed the time. An internal network is not a synonym for a trusted network, and it is necessary to authenticate who calls, restrict what they can call and see the path of the request.',
    concept: [
      "Istio authenticates workloads with short-lived certificates issued by Istiod, encrypts traffic between sidecars with **mTLS** (both ends present an identity) and authorizes calls by identity, which is derived from the Pod's ServiceAccount (`cluster.local/ns/demo/sa/web`).",
      "- **PeerAuthentication** controls mTLS. `PERMISSIVE` accepts traffic with and without mTLS and helps with migrations; `STRICT` rejects traffic without a mesh identity. The policy named `default` in a namespace applies to the whole namespace.",
      "- **AuthorizationPolicy** answers what an authenticated identity can do, by source, method and path. When an `ALLOW` policy exists for a workload, every request that does not match any rule is denied (HTTP 403).",
      "- **Observability**: Envoy records volume, response code and duration of each call. Prometheus stores metrics, Grafana presents dashboards, Jaeger reconstructs traces and Kiali shows the topology, the errors and the mTLS state.",
      "- **Distributed tracing**: the proxy creates and reads tracing headers, but the application needs to propagate them in the following calls (`x-request-id`, `x-b3-traceid`, `x-b3-spanid`, `x-b3-parentspanid`, `x-b3-sampled`, `x-b3-flags`, `b3` and, for W3C, `traceparent` and `tracestate`). Without propagation, the trace breaks even with healthy sidecars. Collecting traces requires configuring a tracing provider in the mesh, which is outside the lab; here you check the headers and the metrics.",
      "Authentication answers who it is; authorization answers what it can do. mTLS does not replace an access policy.",
    ],
    pointsTitle: "Key concepts",
    points: [
      {
        t: "mTLS",
        d: "both ends authenticate and encrypt the hop between the sidecars.",
        color: "blue",
      },
      {
        t: "PeerAuthentication (`security.istio.io/v1`)",
        d: "`PERMISSIVE` mode (migration) or `STRICT` (requires the mesh).",
        color: "signal",
      },
      {
        t: "AuthorizationPolicy (`security.istio.io/v1`)",
        d: "allows minimal source, method and path; requests outside the `ALLOW` rules are denied.",
        color: "violet",
      },
      {
        t: "Identity (principal)",
        d: "derived from the ServiceAccount; it only exists when there is mTLS.",
        color: "ember",
      },
      {
        t: "Envoy metrics",
        d: "`istio_requests_total` records volume and response codes by source and destination.",
        color: "blue",
      },
      {
        t: "Header propagation",
        d: "the application's responsibility, indispensable for complete traces.",
        color: "signal",
      },
    ],
    examplesTitle: "Strict mTLS, identity-based policy and metrics",
    examples: [
      {
        label: "mtls-strict.yaml",
        lang: "yaml",
        code: "# mtls-strict.yaml\napiVersion: security.istio.io/v1\nkind: PeerAuthentication\nmetadata:\n  name: default                            # policy for the whole namespace\n  namespace: demo\nspec:\n  mtls:\n    mode: STRICT                           # rejects traffic without mTLS",
        intro:
          "The two policies live in separate files so that they can be applied and tested one at a time.",
      },
      {
        label: "authz-api.yaml",
        lang: "yaml",
        code: '# authz-api.yaml\napiVersion: security.istio.io/v1\nkind: AuthorizationPolicy\nmetadata:\n  name: api-read\n  namespace: demo\nspec:\n  selector:\n    matchLabels:\n      app: api                             # applies to the api Pods\n  action: ALLOW                            # whatever does not match the rules below is denied\n  rules:\n    - from:\n        - source:\n            principals: ["cluster.local/ns/demo/sa/web"]   # only the "web" identity\n      to:\n        - operation:\n            methods: ["GET"]               # read only\n            paths: ["/api/*"]              # only paths under /api/',
        note: "To prove that the decision is by identity, a second client with another ServiceAccount (the `default` one), created in the `demo` namespace to receive the sidecar.",
      },
      {
        label: "outro.yaml",
        lang: "yaml",
        code: '# outro.yaml\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: outro\n  namespace: demo                          # in the namespace with injection, to get the sidecar\nspec:\n  replicas: 1\n  selector:\n    matchLabels:\n      app: outro\n  template:\n    metadata:\n      labels:\n        app: outro\n    spec:\n      containers:\n        - name: outro\n          image: curlimages/curl\n          command: ["sleep", "86400"]      # uses the namespace\'s default ServiceAccount',
        note: "With `api-v2` up, the `api` Service selects both versions, so the responses and counters below may come from v1 or v2 (the examples show `api-v1`). To get exactly the outputs shown, keep the cluster without a VirtualService, as after the Stage 11 rollback.",
      },
      {
        label: "terminal",
        lang: "sh",
        code: "# 1) In PERMISSIVE (default), the client outside the mesh can call the api\n$ kubectl create namespace legacy\n$ kubectl run curl -n legacy --image=curlimages/curl --restart=Never -- sleep 3600\n$ kubectl exec -n legacy curl -- curl -s http://api.demo.svc.cluster.local/\napi-v1 recebeu /\n\n# 2) In STRICT, the same client is refused (approximate output: the message varies)\n$ kubectl apply -f mtls-strict.yaml\n$ kubectl exec -n legacy curl -- curl -s http://api.demo.svc.cluster.local/\ncurl: (56) Recv failure: Connection reset by peer\n\n# 3) The identity reaches the backend in the X-Forwarded-Client-Cert header\n$ kubectl exec -n demo deploy/web -c web -- curl -s http://api/api/headers | grep -iE 'x-request-id|x-forwarded-client-cert'\nX-Request-Id: 6f1c...\nX-Forwarded-Client-Cert: By=spiffe://cluster.local/ns/demo/sa/default;Hash=...;Subject=\"\";URI=spiffe://cluster.local/ns/demo/sa/web\n\n# 4) Creates the second client and applies the authorization; then tests identity, method and path\n$ kubectl apply -f outro.yaml\n$ kubectl apply -f authz-api.yaml\n$ kubectl exec -n demo deploy/web -c web -- curl -s -o /dev/null -w '%{http_code}\\n' http://api/api/ping\n200\n$ kubectl exec -n demo deploy/web -c web -- curl -s -o /dev/null -w '%{http_code}\\n' http://api/\n403\n$ kubectl exec -n demo deploy/web -c web -- curl -s -o /dev/null -w '%{http_code}\\n' -X POST http://api/api/ping\n403\n$ kubectl exec -n demo deploy/outro -c outro -- curl -s -o /dev/null -w '%{http_code}\\n' http://api/api/ping\n403\n\n# 5) Envoy metrics, straight from the api's sidecar (approximate output)\n$ kubectl exec -n demo deploy/api-v1 -c istio-proxy -- pilot-agent request GET stats/prometheus | grep '^istio_requests_total' | head -n 3\nistio_requests_total{response_code=\"200\",destination_workload=\"api-v1\",...} 7\nistio_requests_total{response_code=\"403\",destination_workload=\"api-v1\",...} 3",
        note: "STRICT without tested policies and identities can block production: migrate from `PERMISSIVE` to `STRICT` in stages, watching which clients still talk without mTLS, and restrict access gradually.",
      },
    ],
    commands: [
      {
        cmd: "kubectl apply -f mtls-strict.yaml",
        note: "applies strict mTLS in the `demo` namespace",
      },
      {
        cmd: "kubectl apply -f authz-api.yaml",
        note: "applies the api's authorization policy",
      },
      {
        cmd: "kubectl get peerauthentication,authorizationpolicy -A",
        note: "lists the security policies",
      },
      {
        cmd: "istioctl proxy-config secret deploy/api-v1 -n demo",
        note: "shows the certificates active in the proxy (a `default` and the `ROOTCA`)",
      },
      {
        cmd: "kubectl exec -n demo deploy/api-v1 -c istio-proxy -- pilot-agent request GET stats/prometheus",
        note: "reads Envoy's metrics without installing anything",
      },
      {
        cmd: "kubectl apply -f istio-*/samples/addons/prometheus.yaml -f istio-*/samples/addons/kiali.yaml",
        note: "(from `etapa10/`, where Istio was downloaded): installs Prometheus and Kiali for the mesh graph",
      },
      {
        cmd: "istioctl dashboard kiali",
        note: "opens the mesh graph, with the mTLS state (alternative without a local browser: `kubectl port-forward -n istio-system svc/kiali 20001:20001`)",
      },
    ],
    handsOn: [
      "With the `mesh` cluster, create the `legacy` namespace and a test Pod without a sidecar (commands from the example). Call the api and **observe** that, in `PERMISSIVE`, the call without mTLS works.",
      "Apply only the `PeerAuthentication`: `kubectl apply -f mtls-strict.yaml`. Repeat the call from `legacy` and **observe** the refusal. Repeat the call through `web` (which has a sidecar) and **observe** that it keeps working.",
      "Apply `outro.yaml` (it already declares `namespace: demo`) and confirm that the `outro` Pod has `READY 2/2`. Before applying the policy, run `kubectl exec -n demo deploy/outro -c outro -- curl -s -o /dev/null -w '%{http_code}\\n' http://api/api/ping` and **observe** `200`, because there is no authorization rule yet. Apply `authz-api.yaml`, run the four calls from item 4 of the example and **observe** `200` only for `GET /api/ping` coming from `web`, and `403` for another path, another method and another identity (`outro`).",
      "Run the call to `/api/headers` and **observe** that the proxy added `X-Request-Id` and `X-Forwarded-Client-Cert` with the caller's identity. Explain why, for a complete trace, the application needs to copy these headers into the calls it makes itself.",
      "Run `istioctl proxy-config secret deploy/api-v1 -n demo` and read Envoy's metrics on the sidecar. **Observe** `istio_requests_total` counters separated by response code, including the `403`s you provoked. Since api-v2 also serves the Service, repeat the reading on `deploy/api-v2` and add up the counters if the calls went to both.",
      "Optional: install Prometheus and Kiali (`samples/addons` inside the `istio-*` folder in `etapa10/`), generate traffic with a `curl` loop and open `istioctl dashboard kiali`. **Observe** the `web` to `api` graph and the mTLS padlock icon.",
      "Clean up everything at the end of Stages 10 to 12: `minikube delete -p mesh`.",
    ],
    tip: 'Change one policy at a time and test both sides: a call that should pass and another that should fail. A `STRICT` that "works" only with the clients you remembered to test usually breaks the client you forgot.',
    takeaway:
      "In the mesh, identity and telemetry become properties of each hop: mTLS authenticates, the AuthorizationPolicy restricts by identity and observability explains the journey, as long as the application propagates the tracing headers.",
    figures: [
      {
        items: [
          {
            src: "/guides/servidores-web/etapa12-istio-seguranca.svg",
            alt: "Istio security architecture: traffic between proxies uses mTLS, each proxy applies local authorization and holds a certificate, and istiod in the control plane brings together the certificate authority and the authentication and authorization policies.",
            caption:
              "istiod issues each workload's identity (derived from the ServiceAccount) and distributes the policies; whoever encrypts with mTLS and applies the `AuthorizationPolicy` on each request is the proxy beside the Pod.",
          },
        ],
        credit: "Diagram: istio.io, Istio Authors, Apache 2.0",
      },
    ],
  },
  {
    id: "m13",
    num: "13",
    navTitle: "High availability",
    tag: "slo + spof + vrrp",
    title: "High availability: SLA, SLO, SPOF and redundancy",
    lead: "At 2 a.m., the machine hosting the store's only balancer loses its power supply. The ten backends are healthy, but nobody can reach them, because everything goes through that balancer. Another scenario: the contract promises 99.9% availability, and nobody can say how many minutes of unavailability that allows, nor how long the system's failover really takes. High availability begins with a measurable target, identifies the components whose failure takes everything down and chooses redundancy compatible with the cost and with the application's state. And it needs to be tested before the real incident.",
    concept: [
      "- **SLA** is the external promise to the client, possibly with a penalty. **SLO** is the internal target used by engineering, usually stricter than the SLA. The **error budget** is what the SLO allows in failure over the period (100% minus the SLO). A target of 99.9% over 30 days allows about 43 minutes of unavailability.",
      "- A **SPOF** (single point of failure) is any server, balancer, link, database or location whose failure interrupts the whole service. Components in series multiply availabilities (two 99.9% components give about 99.8%), while independent replicas in parallel improve them (two 99% ones give about 99.99%, if the failures are independent). SPOFs must be removed, reduced or explicitly accepted.",
      "- **Active-passive** keeps a reserve instance and requires failover; it simplifies consistency. **Active-active** uses all the nodes at the same time and redistributes the load when one fails, but requires stateless applications or correct state synchronization.",
      "- **Keepalived** with **VRRP** moves a **virtual IP** (VIP) between two balancers: the node with the highest priority and confirmed health answers for the VIP, and if it fails the other takes over. The configuration of both nodes must be kept in sync by automation (such as Ansible) or by declarative mechanisms. In many cloud networks VRRP does not work as on a local network, and the provider offers managed balancers or IP reassignment; check your provider's documentation.",
      "- Health checks must verify the **real function** (for example, a valid HTTP response), not just the existence of the process.",
      "- **Chaos Engineering** formulates a hypothesis, injects a controlled failure and measures the reaction, with clear criteria for aborting. It is not random failure in production.",
      "- **HA** reduces local interruptions; **Disaster Recovery** (DR) recovers the service after broad events, such as the loss of a zone or region. The **RTO** is the maximum time accepted to recover and the **RPO** is the maximum data loss accepted, measured in time.",
    ],
    pointsTitle: "Key concepts",
    points: [
      {
        t: "SLA, SLO and error budget",
        d: "external promise, internal target and how much failure fits in it.",
        color: "blue",
      },
      {
        t: "SPOF",
        d: "a component whose failure takes everything down; in series, availabilities multiply.",
        color: "signal",
      },
      {
        t: "Active-passive and active-active",
        d: "a reserve waiting, or capacity shared among the nodes.",
        color: "violet",
      },
      {
        t: "Keepalived, VRRP and VIP",
        d: "the virtual IP migrates between balancers according to priority and health.",
        color: "ember",
      },
      {
        t: "Chaos Engineering",
        d: "hypothesis, controlled failure, measurement and abort criterion.",
        color: "blue",
      },
      {
        t: "RTO and RPO",
        d: "accepted recovery time and accepted data loss in DR.",
        color: "signal",
      },
    ],
    examplesTitle: "Keepalived protecting the balancer",
    examples: [
      {
        label: "Dockerfile",
        lang: "sh",
        code: "# Dockerfile\nFROM nginx:stable\n# keepalived does the VRRP; curl and iproute2 serve the health check and the IP inspection\nRUN apt-get update \\\n && apt-get install -y --no-install-recommends keepalived curl iproute2 \\\n && rm -rf /var/lib/apt/lists/*",
        intro:
          "The lab starts two Nginx balancers (`lb1` and `lb2`) on a Docker network with a virtual IP (`172.28.0.100`) and a client. Each node answers with its own name, which makes the failover visible.",
      },
      {
        label: "lb.conf",
        lang: "sh",
        code: '# lb.conf\nserver {\n    listen 80;\n    default_type text/plain;\n\n    location = /healthz {\n        return 200 "ok\\n";                          # route used by the health check\n    }\n\n    location / {\n        return 200 "atendido por $hostname\\n";      # shows which balancer answered\n    }\n}',
      },
      {
        label: "keepalived-lb1.conf",
        lang: "sh",
        code: "# keepalived-lb1.conf\nvrrp_script check_nginx {\n    script \"/usr/bin/curl -fsS --max-time 1 http://127.0.0.1/healthz\"   # tests Nginx's real function\n    interval 1                                      # runs every 1 second\n    fall 2                                          # 2 consecutive failures: the node is considered sick\n    rise 2                                          # 2 consecutive successes: the node becomes healthy again\n}\n\nvrrp_instance PITSTOP {\n    state MASTER                                    # initial state (priority decides in practice)\n    interface eth0                                  # interface that carries the virtual IP\n    virtual_router_id 51                            # same on both nodes\n    priority 100                                    # higher priority: preferred to hold the VIP\n    advert_int 1                                    # announces presence every 1 second\n    unicast_src_ip 172.28.0.11                      # this node's IP\n    unicast_peer {\n        172.28.0.12                                 # the other node's IP (unicast, because the Docker network is not ideal for multicast)\n    }\n    virtual_ipaddress {\n        172.28.0.100/24                             # the shared virtual IP\n    }\n    track_script {\n        check_nginx                                 # if the check fails, the node releases the VIP\n    }\n}",
        note: "`keepalived-lb2.conf` is identical, swapping `state MASTER` for `state BACKUP`, `priority 100` for `priority 90`, `unicast_src_ip` for `172.28.0.12` and the peer in `unicast_peer` for `172.28.0.11`.",
      },
      {
        label: "compose.yaml",
        lang: "yaml",
        code: '# compose.yaml\nservices:\n  lb1:\n    build: .                                        # uses the Dockerfile in this folder\n    image: lb-ha-lab\n    hostname: lb1\n    cap_add: [NET_ADMIN, NET_BROADCAST, NET_RAW]    # allows Keepalived to manage IPs and use VRRP\n    command: ["sh", "-c", "nginx && exec keepalived --dont-fork --log-console"]   # starts Nginx and then Keepalived\n    volumes:\n      - ./lb.conf:/etc/nginx/conf.d/default.conf:ro\n      - ./keepalived-lb1.conf:/etc/keepalived/keepalived.conf:ro\n    networks:\n      lab:\n        ipv4_address: 172.28.0.11\n  lb2:\n    image: lb-ha-lab                                # reuses the image built by lb1\n    hostname: lb2\n    cap_add: [NET_ADMIN, NET_BROADCAST, NET_RAW]\n    command: ["sh", "-c", "nginx && exec keepalived --dont-fork --log-console"]\n    volumes:\n      - ./lb.conf:/etc/nginx/conf.d/default.conf:ro\n      - ./keepalived-lb2.conf:/etc/keepalived/keepalived.conf:ro\n    networks:\n      lab:\n        ipv4_address: 172.28.0.12\n    depends_on: [lb1]\n  client:\n    image: curlimages/curl                          # client inside the same network\n    entrypoint: ["tail", "-f", "/dev/null"]\n    networks: [lab]\n\nnetworks:\n  lab:\n    ipam:\n      config:\n        - subnet: 172.28.0.0/24                     # fixed subnet that contains the VIP',
      },
      {
        label: "terminal",
        lang: "sh",
        code: "$ docker compose up -d --build\n\n# Who has the VIP now? (approximate output)\n$ docker compose exec lb1 ip -brief addr show eth0\neth0@if21   UP   172.28.0.11/24 172.28.0.100/24\n\n$ docker compose exec client curl -s http://172.28.0.100/\natendido por lb1\n\n# Controlled failure: stops the active node's Nginx and follows the client\n$ docker compose exec lb1 nginx -s stop\n$ docker compose exec client sh -c 'for i in $(seq 1 12); do echo \"$(date +%T) $(curl -s --max-time 1 http://172.28.0.100/ || echo FALHOU)\"; sleep 0.5; done'\n10:41:02 atendido por lb1\n10:41:02 atendido por lb1\n10:41:03 FALHOU\n10:41:04 atendido por lb2\n10:41:04 atendido por lb2",
        note: "The switchover time depends on `interval`, `fall` and `advert_int`; in the lab it usually comes to a few seconds. To measure the SLO, use the arithmetic below.",
      },
      {
        label: "terminal (2)",
        lang: "sh",
        code: "# Minutes of unavailability allowed in 30 days for each SLO (approximate output)\n$ for slo in 99 99.9 99.99; do awk -v s=$slo 'BEGIN{printf \"SLO %s%%: %.1f min\\n\", s, 30*24*60*(100-s)/100}'; done\nSLO 99%: 432.0 min\nSLO 99.9%: 43.2 min\nSLO 99.99%: 4.3 min",
      },
    ],
    commands: [
      {
        cmd: "docker compose up -d --build",
        note: "builds the image and starts the two balancers and the client",
      },
      {
        cmd: "docker compose exec lb1 ip -brief addr show eth0",
        note: "shows whether the node has the VIP (repeat on `lb2`)",
      },
      {
        cmd: "docker compose exec lb1 nginx -s stop",
        note: "injects a controlled failure into the active node",
      },
      {
        cmd: "docker compose exec lb1 nginx",
        note: "gives Nginx back to the node (the VIP returns to the node with the highest priority)",
      },
      {
        cmd: "docker compose logs lb1 lb2 | grep -i -E 'MASTER|BACKUP|FAULT'",
        note: "follows the VRRP state transitions",
      },
      {
        cmd: "watch -n 1 'docker compose exec -T lb2 ip -brief addr show eth0'",
        note: "follows the VIP migrating",
      },
    ],
    handsOn: [
      "Draw on paper the complete path of a request (client, DNS, balancer, application, database) and mark each component without redundancy. Each mark is a SPOF.",
      "Choose an availability SLO for the service and calculate the allowed monthly downtime with the `awk` command from the example. Also calculate the availability of two 99.9% components in series.",
      "Create `etapa13/` with the example's files and run `docker compose up -d --build`. Find out which node has the VIP and **observe** `atendido por lb1` when calling the virtual IP.",
      "In one terminal, run the client loop. In another, stop `lb1`'s Nginx with `docker compose exec lb1 nginx -s stop`. **Observe** responses from `lb1`, one or two failures and then responses from `lb2`, and measure how many seconds passed without a response.",
      "Run `docker compose exec lb1 nginx` and **observe** the VIP return to `lb1` (higher priority) after the health checks pass. Also record the state transitions in `docker compose logs`.",
      'Write a Chaos Engineering hypothesis (for example, "if the active balancer goes down, the client loses at most 5 seconds of response") with an abort criterion (for example, "if the VIP does not migrate in 30 seconds, restore the node and end the experiment"). Compare the result of step 4 with the hypothesis.',
      "Clean up: `docker compose down`.",
    ],
    tip: "A redundancy that has never been tested is still an assumption. Measure the failover time, the loss of requests and the recovery time, and compare with the SLO. If you cannot demonstrate the failover in a lab, you should not trust it in production.",
    takeaway:
      "High availability combines a measurable target, the removal of SPOFs, redundancy and testing; DR complements it when the failure goes beyond the server or the local zone.",
    figures: [
      {
        items: [
          {
            src: "/guides/servidores-web/etapa13-vip-1.en.svg",
            alt: "The client points to VIP 172.28.0.100, which is on lb1, MASTER with priority 100; lb2 is BACKUP with priority 90 and receives VRRP adverts from lb1.",
            caption:
              "Before the failure: lb1 has the highest priority and a passing check_nginx, so it answers for the virtual IP.",
          },
          {
            src: "/guides/servidores-web/etapa13-vip-2.en.svg",
            alt: "lb1's Nginx is stopped and check_nginx failed twice, so lb1 goes to FAULT; VIP 172.28.0.100 has moved to lb2, now MASTER.",
            caption:
              "After `nginx -s stop` on lb1: two consecutive check_nginx failures take lb1 out of the role, lb2 takes the VIP, and the client keeps using the same address.",
          },
        ],
        credit: "Diagram: made for this guide",
      },
    ],
  },
  {
    id: "m14",
    num: "14",
    navTitle: "WAF and protection",
    tag: "modsecurity + rate limit",
    title: "WAF, rate limiting and defense in depth",
    lead: "The store's login API receives, in the small hours, thousands of password attempts per minute coming from a few IPs, and some requests carry fragments of SQL in the search parameter. The network firewall blocks ports and networks, but does not understand what is inside an HTTP request: a SQL Injection payload arrives through a legitimate port (443) and passes. Availability still depends on legitimate access remaining reliable, so the edge needs to tell normal use from hostile behavior without bringing down real users.",
    concept: [
      "Layer 3 and 4 firewalls block networks and ports, but do not inspect the application layer. A **WAF** (Web Application Firewall) inspects the HTTP content. **ModSecurity** (with the libModSecurity library and the connector for Nginx) is the engine that applies the rules, and the **OWASP Core Rule Set (CRS)** is a community-maintained rule base against patterns such as SQL Injection and XSS.",
      "- The WAF evaluates the rules and accumulates an **anomaly score**; when it goes over a threshold, it blocks (by default in the CRS, the inbound threshold is 5). It can only log (`DetectionOnly`) or block (`On`). Start in detection mode to adjust false positives before interrupting legitimate users. The CRS also has paranoia levels (from 1 to 4): higher levels detect more and generate more false positives.",
      "- **TLS 1.2 or 1.3**, **HSTS** and secure headers protect the channel and the browser. HSTS tells the browser to use only HTTPS for the domain for the time given in `max-age`.",
      "- **Rate limiting** limits requests per key (usually the IP) and helps against brute force and abuse, but does not replace protection against distributed DDoS, in which each source sends little. In Nginx, `limit_req_zone` defines the key, the memory and the rate; `limit_req` applies the limit in a location; `burst` allows bursts and `nodelay` serves the burst without delay. The default rejection response is 503; use `limit_req_status 429` to return `429 Too Many Requests`. Behind a NAT, several users share the same IP, and behind a CDN or proxy you need to configure the client's real IP.",
      "- Nginx and ModSecurity logs need to reach a central platform, with alerts for increases in blocks, 5xx responses and latency. Security depends on review, CRS updates and repeatable tests.",
      "A WAF does not fix the vulnerability in the code: it reduces exposure and buys time for the definitive fix. Defense works in layers, each covering what the previous one does not see.",
    ],
    pointsTitle: "Key concepts",
    points: [
      {
        t: "WAF (ModSecurity + CRS)",
        d: "inspects HTTP content with rules and anomaly scoring.",
        color: "blue",
      },
      {
        t: "DetectionOnly and On",
        d: "log without blocking, and block; start by logging.",
        color: "signal",
      },
      {
        t: "Rate limiting (`limit_req_zone`, `limit_req`)",
        d: "controls abuse by key; `limit_req_status 429` changes the rejection code.",
        color: "violet",
      },
      {
        t: "TLS and HSTS",
        d: "protect the channel and force the browser to use HTTPS.",
        color: "ember",
      },
      {
        t: "403 and 429",
        d: "403 comes from a WAF rule block; 429 comes from the configured rate limit.",
        color: "blue",
      },
      {
        t: "Logs and alerts",
        d: "turn blocks into evidence to adjust rules and respond to incidents.",
        color: "signal",
      },
    ],
    examplesTitle: "A layered edge, with TLS, rate limit and WAF",
    examples: [
      {
        label: "compose.yaml",
        lang: "yaml",
        code: '# compose.yaml\nservices:\n  api:\n    image: python:3.12-alpine\n    command: ["python", "/app/backend.py"]\n    environment:\n      NAME: api\n    volumes:\n      - ./backend.py:/app/backend.py:ro\n  crs:\n    image: owasp/modsecurity-crs:nginx              # WAF: Nginx with ModSecurity and OWASP CRS\n    environment:\n      BACKEND: http://api:3000                      # where the WAF forwards the approved traffic\n      PORT: "8080"                                  # WAF listening port inside the container\n      MODSEC_RULE_ENGINE: DetectionOnly             # only logs; change to On to block\n      PARANOIA: "1"                                 # CRS paranoia level (1 is the least sensitive)\n    depends_on: [api]\n  edge:\n    image: nginx:stable                             # edge: TLS, HSTS and rate limit\n    ports:\n      - "8443:443"\n    volumes:\n      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro\n      - ./certs:/etc/nginx/certs:ro\n    depends_on: [crs]',
        intro:
          "The lab chains three containers: the edge Nginx (TLS, HSTS and rate limit), the WAF (the `owasp/modsecurity-crs` image, which runs Nginx with ModSecurity and CRS as a reverse proxy) and the backend. Copy the `backend.py` from Stage 03 to `etapa14/` and generate a self-signed certificate as in Stage 02 (`certs/` folder).",
      },
      {
        label: "nginx.conf",
        lang: "sh",
        code: '# nginx.conf\nlimit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;   # 5 requests per minute per IP; 10 MB of state\n\nserver {\n    listen 443 ssl;\n    http2 on;\n    server_name localhost;\n\n    ssl_certificate     /etc/nginx/certs/cert.pem;\n    ssl_certificate_key /etc/nginx/certs/key.pem;\n    ssl_protocols       TLSv1.2 TLSv1.3;                   # refuses old TLS versions\n\n    server_tokens off;                                     # hides the Nginx version\n    add_header Strict-Transport-Security "max-age=300" always;   # short HSTS in the lab; in production, 31536000 after validating everything\n    limit_req_status 429;                                  # rejections return 429 (the default would be 503)\n\n    proxy_set_header Host $host;                           # inherited by the two routes below\n    proxy_set_header X-Real-IP $remote_addr;\n    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n\n    location = /login {\n        limit_req zone=login burst=3 nodelay;              # 1 request + burst of 3; the rest gets 429\n        proxy_pass http://crs:8080;                        # goes through the WAF before reaching the application\n    }\n\n    location / {\n        proxy_pass http://crs:8080;\n    }\n}',
      },
      {
        label: "terminal",
        lang: "sh",
        code: "$ docker compose up -d\n\n# TLS and HSTS (approximate output)\n$ curl -sk -I https://localhost:8443/ | grep -iE 'HTTP/|strict|server'\nHTTP/2 200\nserver: nginx\nstrict-transport-security: max-age=300\n\n# In DetectionOnly, the malicious payload passes (200), but is logged (the rule codes vary)\n$ curl -sk -G -o /dev/null -w '%{http_code}\\n' --data-urlencode \"q=<script>alert(1)</script>\" https://localhost:8443/\n200\n$ docker compose logs crs | grep -i 'ModSecurity' | tail -n 3\ncrs-1  | ... ModSecurity: Warning. ... [id \"941100\"] ... XSS Attack Detected via libinjection ...\n\n# After switching MODSEC_RULE_ENGINE to On and recreating the container (docker compose up -d), the same payload is blocked\n$ curl -sk -G -o /dev/null -w '%{http_code}\\n' --data-urlencode \"q=<script>alert(1)</script>\" https://localhost:8443/\n403\n\n# Rate limit: 10 consecutive calls to /login (approximate result: 4 of 200 and 6 of 429)\n$ for i in $(seq 1 10); do curl -sk -o /dev/null -w '%{http_code}\\n' https://localhost:8443/login; done\n200\n200\n200\n200\n429\n429\n429\n429\n429\n429",
        note: "With `rate=5r/m` and `burst=3 nodelay`, the first request and the three of the burst pass; the following ones are rejected until the renewal window (one slot every 12 seconds). The exact number depends on the loop's speed and on the clock.",
      },
    ],
    commands: [
      {
        cmd: "docker compose exec edge nginx -t",
        note: "validates the syntax before the reload",
      },
      {
        cmd: "docker compose exec edge nginx -s reload",
        note: "reloads the edge after editing `nginx.conf`",
      },
      {
        cmd: "docker compose restart edge",
        note: "restarts the edge when an edit to `nginx.conf` does not show up after the reload (editors and `sed -i` replace the mounted file with a new one, and the container keeps seeing the old one)",
      },
      {
        cmd: "curl -sk -I https://localhost:8443/",
        note: "checks TLS and HSTS",
      },
      {
        cmd: "docker compose logs -f crs",
        note: "follows the rules triggered by ModSecurity (the audit log may be in a file, at `/var/log/modsec_audit.log` or another path; check with `docker compose exec crs env | grep -i audit`)",
      },
      {
        cmd: "docker compose logs -f edge",
        note: "correlates the response (403, 429, 5xx) with the cause",
      },
      {
        cmd: "docker compose up -d",
        note: "recreates `crs` after changing `MODSEC_RULE_ENGINE`",
      },
      {
        cmd: "curl -sk -G --data-urlencode \"id=1' OR '1'='1\" https://localhost:8443/",
        note: "lab SQL Injection payload",
      },
    ],
    handsOn: [
      "Create `etapa14/` with `backend.py`, `compose.yaml`, `nginx.conf` and the `certs/` folder, and run `docker compose up -d`. If `edge` returns `502`, check with `docker compose logs crs` which port the WAF listens on and adjust `PORT` and the `proxy_pass`. If you edit `nginx.conf` later, run `docker compose exec edge nginx -s reload` and, if the change does not show up, `docker compose restart edge`.",
      "Send a normal request (`curl -sk https://localhost:8443/`) and **observe** `api recebeu /`, passing through edge, WAF and backend.",
      "With the WAF in `DetectionOnly`, send the XSS payload and the SQL Injection one from the example. **Observe** the `200` and look in `docker compose logs crs` for the rule triggered (a rule `id` and the message). Identify the rule before enabling blocking.",
      "Switch `MODSEC_RULE_ENGINE` to `On`, run `docker compose up -d` and repeat the payloads. **Observe** `403`. Send a normal request again and **observe** that it is still `200`.",
      "Run the 10 consecutive calls to `/login` and **observe** the `429`s after the limit. Wait about 12 seconds and repeat one call to **observe** the limit releasing a slot.",
      "Check the headers with `curl -sk -I https://localhost:8443/` and **observe** `strict-transport-security`, and the absence of the version in the `server` header.",
      "Build a checklist for your service: TLS 1.2 or 1.3, HSTS, CRS updates, log retention, alerts for spikes in blocks and 5xx, and a repeatable test of the payloads.",
      "Clean up: `docker compose down`.",
    ],
    tip: "The WAF does not fix a vulnerability in the code: it reduces exposure and buys time, and the definitive fix remains in the application. Never enable blocking without having read the detection log for a period with real traffic, because the false positive that takes down a legitimate customer costs more than the delay in blocking.",
    takeaway:
      "A secure edge combines encryption, inspection at the application layer, rate control, logs and operational response: each layer covers what the previous one does not see, and all of them start by observing before blocking.",
    figures: [
      {
        items: [
          {
            src: "/guides/servidores-web/etapa14-camadas.en.svg",
            alt: "A request goes through a network firewall, an edge Nginx with TLS, HSTS and limit_req, and a WAF with ModSecurity and OWASP CRS before reaching the api. The firewall blocks a port or network, the edge Nginx returns 429 and the WAF returns 403.",
            caption:
              "Each layer sees something different: the firewall sees ports and networks, the edge Nginx counts requests per IP, and the WAF reads the content and adds up the anomaly score. The api only receives what got through all three.",
          },
        ],
        credit: "Diagram: made for this guide",
      },
    ],
  },
];

export const CHECKLIST: ChecklistGroup[] = [
  {
    title: "Stage 01: Web server",
    items: [
      "I can name the six functions of a web server without consulting the text.",
      "I ran an Nginx and an Apache and compared the `Server` header of each.",
      "I can explain why these functions should not live inside the application code.",
    ],
  },
  {
    title: "Stage 02: HTTP",
    items: [
      "I can explain what head-of-line blocking is and at which layer each HTTP version solves it.",
      "I used `curl` to force HTTP versions and observed `%{http_version}` change.",
      "I saw HTTP/2 being negotiated and disappearing when I removed `http2 on;` in my Nginx.",
    ],
  },
  {
    title: "Stage 03: Proxies",
    items: [
      "I can say, for a scenario, whether it calls for a forward or a reverse proxy.",
      "I configured an Nginx reverse proxy and confirmed the headers received by the backend with `/headers`.",
      "I can explain the effect of removing `proxy_set_header Host`, `X-Real-IP` and `X-Forwarded-For`, and why `peer` always shows the proxy.",
      "I used a forward proxy with `curl -x` and understood who opens the connection to the destination.",
    ],
  },
  {
    title: "Stage 04: Apache and MPMs",
    items: [
      "I can explain Prefork, Worker and Event in terms of process, thread and isolation.",
      "I confirmed an Apache's MPM with `httpd -M` or `apachectl -V`.",
      "I observed the difference in the number of processes between Prefork and Event under load.",
      "I can explain why non-thread-safe modules require Prefork.",
    ],
  },
  {
    title: "Stage 05: Nginx",
    items: [
      "I can explain non-blocking I/O, the event loop and the role of `epoll`.",
      "I located `worker_processes` and `worker_connections` and compared the workers with the number of cores.",
      "I observed that Nginx's number of processes does not grow with load.",
      "I can explain why, as a proxy, Nginx holds about half of the theoretical ceiling of connections.",
    ],
  },
  {
    title: "Stage 06: Load balancing",
    items: [
      "I can choose between Round Robin, `weight`, `least_conn` and `ip_hash` explaining the cost of each.",
      "I measured the distribution among backends in each algorithm.",
      "I compared an L4 and an L7 balancer and explained what L4 does not see.",
    ],
  },
  {
    title: "Stage 07: Failover and diagnosis",
    items: [
      "I stopped a backend during the test and confirmed the failover through the logs, noting the delay of the first requests.",
      "I saw the `backup` server take over and the primaries come back.",
      "I told 502 from 504 by the response time and by the error log message.",
      "I can say what Nginx Open Source does (passive check) and what requires Plus (active check).",
    ],
  },
  {
    title: "Stage 08: Ingress",
    items: [
      "I can explain why Ingress and Ingress Controller are not the same thing.",
      "I tested host and path routing, `Prefix` against `Exact` and URL rewriting.",
      "I can explain why annotations apply to the whole Ingress.",
    ],
  },
  {
    title: "Stage 09: TLS and cert-manager",
    items: [
      "I followed the Certificate and the Secret until `READY True` with a ClusterIssuer.",
      "I validated the certificate delivered by the Ingress and read the DNS name and the validity with `openssl`.",
      "I can explain why base64 in a Secret is not encryption.",
      "I can tell the difference between HTTP-01 and DNS-01, what SNI is and why staging exists.",
    ],
  },
  {
    title: "Stage 10: Istio",
    items: [
      "I can separate Data Plane, Control Plane and the mesh's operational cost.",
      "I confirmed the sidecar injection (`2/2`) and the sync with `istioctl proxy-status`.",
      "I can explain why existing Pods need to be recreated after enabling injection.",
    ],
  },
  {
    title: "Stage 11: Gradual deployment",
    items: [
      "I configured subsets and a 90/10 split and measured the real proportion.",
      "I can tell canary, A/B and mirroring apart and I saw the mirroring reach v2.",
      "I practiced the rollback and can explain the relationship between `timeout`, `attempts` and `perTryTimeout`.",
    ],
  },
  {
    title: "Stage 12: mTLS and observability",
    items: [
      "I saw the refusal of a client outside the mesh in `STRICT`.",
      "I applied the `PeerAuthentication` and the `AuthorizationPolicy` in separate files and proved, with 200 and 403 responses, that authorization decides by identity, method and path.",
      "I read Envoy's metrics and the identity in `X-Forwarded-Client-Cert`.",
      "I can explain why the application needs to propagate the tracing headers.",
    ],
  },
  {
    title: "Stage 13: High availability",
    items: [
      "I can relate SLA, SLO, error budget, SPOF, RTO and RPO.",
      "I calculated the monthly downtime allowed by an SLO.",
      "I measured the failover of a virtual IP with Keepalived.",
      "I wrote a Chaos Engineering hypothesis with an abort criterion.",
    ],
  },
  {
    title: "Stage 14: Edge defense",
    items: [
      "I tested the WAF first in detection, read the triggered rule and only then enabled blocking.",
      "I validated TLS, HSTS, the WAF's 403 and the rate limiting's 429.",
      "I can explain why `limit_req_status 429` is needed and what `burst` and `nodelay` do.",
    ],
  },
  {
    title: "",
    items: [],
    outro:
      "**Next steps:** with all items checked, redo the labs without consulting the guide and then put the pieces together. On Docker, build an edge with two backends behind an Nginx with balancing, a `backup` server, rate limiting and a WAF, and protect that Nginx with a second node and Keepalived. On Minikube, publish the same application with Ingress and cert-manager TLS and do a 90/10 canary with Istio, measuring the real proportion and practicing the rollback.",
  },
];

export const NOTES: string[] = [
  "This block gathers details that help you read the examples safely. Nothing here changes the path of the exercises; they are clarifications about behaviors that tend to raise questions.",
  "**About what you will see in the terminal**",
  "**Example outputs.** The outputs shown are typical formats. Versions, IPs, Pod hashes, times, process counts and statistical distributions (such as the 90/10 split of the canary) vary. Compare the structure, not the exact text.",
  "**Image tags.** The labs use broad tags (`nginx:stable`, `httpd:2.4`, `python:3.12-alpine`, `owasp/modsecurity-crs:nginx`). They move over time, and the behavior described holds for recent versions (for example, `http2 on;` requires Nginx 1.25.1 or higher). Pin exact versions when you need reproducibility, and confirm the availability of the images at the time of execution.",
  '**Upstream DNS in Nginx.** Nginx resolves the names in `upstream` and `proxy_pass` when it loads the configuration. If a container is recreated with another IP, reload (`nginx -s reload`). If a name does not resolve at startup, Nginx refuses to start. A container stopped with `docker compose stop` disappears from the network, and the connection attempt to the old IP usually fails with "No route to host" or with a connection timeout after a few seconds, instead of an immediate refusal; a closed port on a running container, on the other hand, is refused right away.',
  "**Client IP in Docker.** Through port mapping, Nginx sees as the source the IP of the Docker network's gateway, and not that of your terminal. That is why `ip_hash` sends everything to the same backend and `limit_req` counts all of the lab's accesses as a single client.",
  "**Apache Bench.** `ab` speaks HTTP/1.0 by default and opens one connection per request; `-k` enables keep-alive. It does not do HTTP/2 or HTTP/3 and does not replace a realistic load tool. Use the numbers to compare scenarios on the same machine, not as an absolute measure.",
  "**`kubectl get endpoints`.** In recent versions of Kubernetes, the command displays a deprecation warning in favor of EndpointSlices. The examples use `kubectl get endpointslices`.",
  "**Single file mounted in a container.** Mounting a file (such as `nginx.conf` or `h2.conf`) in a container ties the container to the host's original file. Editors that write to a new file and `sed -i` replace the file, and the container keeps seeing the old version, so that the `reload` seems to do nothing. In that case, restart the container (`docker restart <name>` or `docker compose restart <service>`) or mount the whole folder instead of the file.",
  "**About Apache and Nginx**",
  "**Reach of the failure in the Worker MPM.** A serious error in one thread can corrupt or bring down the child process that hosts it, and the connections it was serving. The master process and the other children keep working.",
  "**HTTP/2 in Apache.** It is offered by the `mod_http2` module (`Protocols h2 http/1.1`) and is recommended for MPMs with threads, especially Event. It is not recommended with Prefork.",
  "**`MaxRequestWorkers` in Event.** It limits the requests processed at the same time and must fit within `ServerLimit` times `ThreadsPerChild`. Idle keep-alive connections do not each consume a worker thread, which is the whole point of Event.",
  "**Nginx capacity.** `worker_processes` times `worker_connections` is a theoretical ceiling of connections, and a proxy uses two per request (client and backend). `use epoll;` is optional on Linux, because Nginx picks the most efficient method.",
  "**Open Source and Plus.** Nginx Open Source offers balancing (Round Robin, `least_conn`, `ip_hash`, `hash`, `random`), `keepalive` with the backends, `backup` and passive checking (`max_fails`, `fail_timeout`). Features such as active checking (`health_check`), cookie-based session persistence (`sticky cookie`), `slow_start`, the `least_time` method, the request queue (`queue`) and the dynamic configuration API with a monitoring dashboard are exclusive to Nginx Plus.",
  "**`limit_req_status`.** The default response of `limit_req` is 503. To return 429, `limit_req_status 429` is necessary. With `rate=5r/m` and `burst=3 nodelay`, the first request and the three of the burst pass; the following ones are rejected until a slot (one every 12 seconds) is released.",
  "**`add_header` and inheritance.** `add_header` directives declared in a `location` replace the ones inherited from the `server`. When adding a header in a `location`, repeat the upper-level ones.",
  "**About Kubernetes and cert-manager**",
  "**Annotations and Ingress.** The `rewrite-target` annotation with capture groups applies to all paths of the same Ingress, which is why the example separates the route with rewriting from the route without rewriting. With `rewrite-target`, ingress-nginx starts treating the host's paths as regular expressions.",
  "**ingress-nginx and Gateway API.** The ingress-nginx project was retired (announced in November 2025, maintenance ended in March 2026), and the Ingress API is frozen in favor of the Gateway API. Confirm the current state of the project and of your Minikube's `ingress` addon before using it; the concept of Ingress, Controller and Service with endpoints holds for any Controller.",
  "**cert-manager.** The Helm installation uses `crds.enabled=true` in recent chart versions (old versions used `installCRDs`). The default duration of a Certificate is 90 days, with renewal starting when a third of the duration remains; the minimum duration is 1 hour and the minimum `renewBefore` is 5 minutes. The self-signed ClusterIssuer is for the lab only. The certificate issued for the lab defines only the DNS name (`subjectAltName`), so `subject` and `issuer` may appear empty in `openssl` and `curl -v`.",
  "**Secret and base64.** The content of a Secret is only encoded. Real protection comes from RBAC, from encryption at rest in `etcd` and from not versioning keys.",
  "**About Istio, Keepalived and WAF**",
  "**Istio APIs.** The examples use `networking.istio.io/v1` (VirtualService and DestinationRule) and `security.istio.io/v1` (PeerAuthentication and AuthorizationPolicy). The `v1beta1` version still appears in old installations. Prefer full service names (`api.demo.svc.cluster.local`) in the `host` fields, because short names are interpreted relative to the resource's namespace.",
  "**Retries and timeout.** `attempts` counts the new attempts after the first; the route's `timeout` must accommodate all the attempts. Unlimited retries multiply the load on a backend that is already sick.",
  "**Tracing.** The sidecar generates the `x-request-id` and reads tracing headers, but the application needs to propagate them. Collecting and viewing traces requires a tracing provider configured in the mesh, which is not part of the lab; Stage 12 checks the headers and Envoy's metrics.",
  "**Identity and authorization.** `principals` in an AuthorizationPolicy only match when there is mTLS. With an `ALLOW` policy in effect, whatever matches no rule is denied with 403.",
  "**Keepalived.** The `track_script` must reference a `vrrp_script` defined in the same file. In production, use `enable_script_security` and scripts with restricted permissions. The lab uses unicast VRRP over a Docker network; in cloud networks, VRRP usually does not work as on a local network.",
  "**WAF.** The variables of the `owasp/modsecurity-crs` image (`BACKEND`, `PORT`, `MODSEC_RULE_ENGINE`, `PARANOIA`) and the audit log path may vary between image versions; confirm in its documentation. The rule identifiers shown (such as 941100) are examples and depend on the CRS version. The CRS's default inbound anomaly threshold is 5.",
  "**Rate limiting and DDoS.** The per-IP limit helps against brute force and abuse, but does not replace protection against distributed attacks. Behind a CDN or proxy, configure the real IP module (`set_real_ip_from` and `real_ip_header`) so that the limit's key is the client, and not the proxy.",
  "**Points to check for whoever runs the labs**",
  "**Third-party images.** `ubuntu/squid`, `owasp/modsecurity-crs`, `curlimages/curl` and `python:3.12-alpine` are public images; confirm the availability, the name of the environment variables and the listening port of each one before running.",
  "**Minikube resources.** Istio with the `demo` profile and the lab images require memory and CPU; adjust `--cpus` and `--memory` to your machine. That is why the `lab` cluster from Stages 08 and 09 is removed before bringing up the `mesh` profile.",
  "**Keepalived on Docker.** The Stage 13 lab depends on network `cap_add` and on a Docker that grants them; environments without that permission (some rootless Docker setups and Podman) may not run it.",
];
