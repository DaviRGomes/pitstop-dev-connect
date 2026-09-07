// Content for all 14 stages, based on Lessons 01 through 05 of the Web Servers and Load Balancing module,
// themed around Formula 1 by the /otimizar-relatorio pipeline (relatorios/servidores-web-nginx-apache/final.md)
// English translation of src/data/servidoresweb.ts, same structure, same ids/colors, same code blocks.

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

export type Mapping = { sw: string; f1: string };

// The pilot's cheat sheet: the same analogy holds from start to finish
export const DE_PARA: Mapping[] = [
  {
    sw: "Application (business logic, Node on port 3000)",
    f1: "The driver driving: the core skill, race and nothing else",
  },
  {
    sw: "Web server (Nginx / Apache)",
    f1: "The whole pit wall and garage operation: everything around the driver",
  },
  { sw: "HTTP request", f1: "A radio call, a request reaching the pit wall" },
  { sw: "Connection", f1: "A car in the team's care, in the garage or on track" },
  {
    sw: "Static content",
    f1: "Ready-made data handed over without bothering the driver (track maps, lap references)",
  },
  {
    sw: "Proxy to a dynamic app",
    f1: "Passing the driver the one question only he or the engineer can answer",
  },
  {
    sw: "Reverse proxy",
    f1: "The pit wall at the front door: takes everything from outside and routes it to the cars behind it",
  },
  {
    sw: "Forward proxy",
    f1: "The driver's manager, speaking to the outside world on his behalf (outbound)",
  },
  { sw: "Load balancer", f1: "The strategist splitting load and stints across the team's cars" },
  {
    sw: "TLS/SSL termination",
    f1: "The encrypted radio channel, managed at one single point by the team",
  },
  { sw: "Cache", f1: "The engineer's ready-made answers for the questions that always come back" },
  {
    sw: "Access control and security",
    f1: "The paddock pass and the box security guard, keeping out anyone without clearance",
  },
  { sw: "HTTP (the protocol)", f1: "The radio and telemetry protocol between car and pit wall" },
  {
    sw: "Stateless HTTP",
    f1: "Every radio call stands alone, context lives on the pit board (cookies, sessions)",
  },
  {
    sw: "Head-of-line blocking",
    f1: "A jammed radio queue: one long transmission holds up every other one",
  },
  {
    sw: "HTTP/1.1 keep-alive",
    f1: "Keeping the radio channel open, but one transmission at a time",
  },
  {
    sw: "HTTP/2 multiplexing",
    f1: "Several telemetry channels running at once over the same link",
  },
  {
    sw: "HTTP/3 (QUIC over UDP)",
    f1: "Swapping the transport so a lost packet doesn't stall the rest (a bad radio zone)",
  },
  { sw: "MPM (Apache)", f1: "How the team scales its crew of mechanics in the garage" },
  { sw: "Process (Apache)", f1: "An independent box, with its own tools and its own space" },
  { sw: "Thread", f1: "A mechanic inside that box" },
  { sw: "Shared process memory", f1: "The shared toolbench inside that box" },
  {
    sw: "Prefork MPM",
    f1: "One whole, isolated box for every single car: total isolation, sky-high cost",
  },
  { sw: "Worker MPM", f1: "A few boxes, each with several mechanics sharing the same toolbench" },
  { sw: "Event MPM", f1: "Mechanics who don't stand still babysitting a car that's just waiting" },
  {
    sw: "Non-thread-safe module",
    f1: "A legacy tool that can't share a toolbench: it needs its own isolated box",
  },
  {
    sw: "Event-driven architecture (Nginx)",
    f1: "The pit wall running an event loop: a handful of engineers watching the whole telemetry wall",
  },
  {
    sw: "Non-blocking I/O",
    f1: 'The engineer logs "let me know when car X\'s data comes in" and keeps working the others',
  },
  {
    sw: "Event loop",
    f1: "The engineer sweeping the telemetry board, acting only when an alert fires",
  },
  { sw: "Worker process (Nginx)", f1: "Each engineer posted at the telemetry wall" },
  { sw: "epoll", f1: "The telemetry system that flags exactly which channel just got new data" },
  {
    sw: "L4 load balancing",
    f1: "The tower routes cars by number and gate without hearing the radio message",
  },
  {
    sw: "L7 load balancing",
    f1: "The pit wall understands the full message before choosing who answers",
  },
  {
    sw: "Health check and failover",
    f1: "Telemetry spots a component outside its window and triggers the redundant system",
  },
  {
    sw: "Ingress and Ingress Controller",
    f1: "The paddock's single gate and the crew reading each pass to point to the right box",
  },
  {
    sw: "cert-manager",
    f1: "The office that automatically issues and renews secure paddock credentials",
  },
  {
    sw: "Service Mesh",
    f1: "The operating network connecting every car, box, and engineer under common policies",
  },
  {
    sw: "Envoy sidecar",
    f1: "The telemetry unit beside every car, applying instructions from the pit wall",
  },
  {
    sw: "VirtualService and DestinationRule",
    f1: "The race plan that splits traffic across versions and defines each group's setup",
  },
  {
    sw: "mTLS",
    f1: "A radio where car and pit wall authenticate each other before exchanging data",
  },
  {
    sw: "High availability",
    f1: "Redundant systems ready to keep the operation alive when one component fails",
  },
  {
    sw: "WAF",
    f1: "Paddock security inspecting both credentials and contents before allowing entry",
  },
];

// Pilot's notes: where the analogies break down (a forced analogy is worse than no analogy)
export const ANALOGY_NOTES: string[] = [
  "Connection as a car, in Stage 04 and 05: it works for grasping cost and isolation, but a process or a thread spins up and dies in milliseconds and you have thousands of them. A real car is expensive, one of a kind, and you only get two per team. The scale is completely different: where the garage has 2 cars, the server has 4,000 connections.",
  "The engineer at the telemetry wall, in Stage 05: it works for explaining the event loop, but a human gets tired and loses track; Nginx's worker doesn't. Nginx's real bottleneck is CPU and memory, not attention span. The image is useful for teaching, the mechanism is different.",
  "Radio and telemetry as HTTP, in Stage 02: the head-of-line blocking parallel holds up, but F1's real radio has human priority (the engineer chooses when to speak) and the protocol doesn't. F1 telemetry is also mostly one-way (car to pit wall), while HTTP is always a request-response pair. Use the image to feel the queue and the lost packet, not to equate the protocols byte for byte.",
  "Ingress as the paddock gate, in Stages 08 and 09: it helps picture a single entry point and routing by destination. In Kubernetes, however, Ingress is a declaration and the Controller is the component that executes it; at a circuit, gate and agent look like one thing.",
  "Envoy as a telemetry unit, in Stages 10 through 12: the image explains its presence beside every workload, but the proxy also changes traffic, applies security, and can add latency. Real telemetry observes far more than it interferes.",
  "F1 redundancy as high availability, in Stage 13: teams keep backup systems and spare parts, but they do not scale cars without limit or promise a public SLA. The analogy explains reaction to failure, not capacity or contract.",
];

export const LESSONS: Lesson[] = [
  {
    id: "sw1",
    num: "01",
    navTitle: "Why it exists",
    tag: "pit wall + garage",
    title: "What a web server is for",
    narration:
      "Lights out! The very first corner already asks the question that decides the whole race: what stays in the driver's lap, and what goes to the pit wall. The best teams win Grands Prix in the pit box, and a Red Bull stop under two seconds proves the operation around the driver matters as much as the car. Let's find out why.",
    lead: "Picture a team that spins up a Node.js app and lets it answer directly on port 3000, with nothing in front of it. At first it works fine, but the product grows and a string of pains show up, none of them related to business logic: serving static files starts competing for the same process running the app, renewing the HTTPS certificate means touching the code and restarting the process, spreading traffic across replicas turns into a manual call on every request, and there's no layer filtering bots before they hit the application directly. Translated to the cockpit: it's the driver who, on top of driving, would also have to run his own encrypted radio, decide the stint strategy alone, and still keep intruders out of the box. Nobody races like that.",
    concept: [
      "Every one of these problems is edge infrastructure, not business logic. Solving all of them inside the application's own code mixes up responsibilities that should stay separate, and that exact set of responsibilities is what a web server like the Apache HTTP Server or Nginx takes on.",
      "The analogy: think of your team's pit wall and garage. Without them, the driver would have to work out strategy alone, handle his own secure comms, and still watch who walks into the box. With a central operation, everything arrives at one point (the pit wall), which decides what to pass on to the driver, turns away anyone without clearance, and handles the shared chores (radio, telemetry, timing) without breaking the concentration of whoever's in the car. The web server is that pit wall for your infrastructure: the point every HTTP request passes through before it reaches (or doesn't) your application.",
      "A modern web server typically takes on the six functions in the cards below. Worth remembering: this piece of software is a war veteran. The Apache HTTP Server first shipped in 1995, which makes it more than 30 years on track.",
    ],
    pointsTitle: "The six functions of a modern web server",
    points: [
      {
        t: "Serving static content",
        d: "HTML, CSS, JS, images and video straight from disk, no application code involved. The track map handed over without calling the driver on the radio.",
        color: "signal",
      },
      {
        t: "Proxying to a dynamic app",
        d: "Forwards requests to PHP-FPM, Tomcat, Node.js, Gunicorn, and the like. The pit wall passing the driver the one question only he can answer.",
        color: "blue",
      },
      {
        t: "Load balancing",
        d: "Spreads requests across multiple application servers. The strategist splitting load, lap after lap, between the team's cars.",
        color: "ember",
      },
      {
        t: "SSL/TLS termination",
        d: "Manages certificates and encryption at one central point instead of spreading it across every instance. The team's one encrypted radio channel.",
        color: "violet",
      },
      {
        t: "Caching",
        d: "Keeps already-processed responses to serve faster next time, without repeating the work. The engineer with the answer ready for the question that always comes back.",
        color: "signal",
      },
      {
        t: "Access control and security",
        d: "Filters malicious traffic and applies authentication before an attack gets anywhere near the application. The paddock pass at the box door.",
        color: "ember",
      },
    ],
    examplesTitle: "The Server header gives away who's answering you",
    examples: [
      {
        label: "nginx.conf (illustrative)",
        lang: "yaml",
        code: `# /etc/nginx/conf.d/default.conf
server {
    listen 80;                       # the port Nginx listens on
    server_name localhost;           # the domain this block serves

    location / {
        root /usr/share/nginx/html;  # the folder holding the static files
        index index.html;           # file served when the URL ends in "/"
    }
}`,
        note: "This block is illustrative: it shows the syntax, but you don't need to create or edit it by hand to complete this stage's hands-on. The official nginx:latest image already ships with an equivalent config, serving a static page on its own. The car rolls off the truck with the base setup already fitted.",
      },
      {
        label: "curl -I",
        lang: "sh",
        code: `$ curl -I http://localhost:8080
HTTP/1.1 200 OK
Server: nginx/1.27.0
Content-Type: text/html
Content-Length: 615

$ curl -I http://localhost:8081
HTTP/1.1 200 OK
Server: Apache/2.4.58 (Unix)
Content-Type: text/html`,
        note: "Look at the Server header: the web server introducing itself, answering before any application even exists behind it. The pit wall picking up the radio before the driver has even climbed into the car.",
      },
    ],
    commands: [
      { cmd: "docker run -d -p 8080:80 nginx:latest", note: "spins up a sample Nginx" },
      { cmd: "docker run -d -p 8081:80 httpd:latest", note: "spins up a sample Apache" },
      { cmd: "curl -I http://localhost:8080", note: "headers only, no body download" },
      {
        cmd: "curl -I http://localhost:8080/does-not-exist",
        note: "confirms the 404 comes from the web server",
      },
    ],
    handsOnIntro:
      "Two containers up, a curl to read the Server header, and you can already feel the pit wall answering before the driver gets in the car. No rush to set a lap time here: it's a track familiarization lap.",
    handsOn: [
      "Spin up an Nginx container (docker run -d -p 8080:80 nginx:latest) and an Apache container (docker run -d -p 8081:80 httpd:latest).",
      "Run curl -I http://localhost:8080 and curl -I http://localhost:8081. Notice the Server header on each: two different pieces of software answering the same job. Two different pit wall vendors doing the same work.",
      "Ask for a path that doesn't exist on each one (curl -I http://localhost:8080/does-not-exist) and notice the 404 Not Found. That response came from the web server, with no application ever triggered: the pit wall turned the request away at the door, the driver never even knew it existed.",
    ],
    tip: "Always use curl -I to inspect just the headers, without downloading the whole response body: it's the fastest way to find out which server is actually answering before you dig deeper.",
    takeaway:
      "A web server doesn't run your application's business logic: it handles everything around it (static files, proxying, TLS, cache, security) so the application doesn't have to worry about any of it. Just like the pit wall exists so you can just drive.",
    outro:
      "Clear as day: the pit wall exists so you can just drive. Now the track opens onto the longest straight of the circuit, the evolution of the radio protocol between car and box. Stage 02, and it's all about shaving milliseconds off the conversation.",
  },

  {
    id: "sw2",
    num: "02",
    navTitle: "HTTP 1.1 → 2 → 3",
    tag: "the HTTP evolution straight",
    title: "HTTP and its evolution, from 1.1 to QUIC/HTTP-3",
    narration:
      "Here the fight is over milliseconds in the conversation between car and pit wall, and three generations of protocol are racing on the same tarmac. Remember Mansell glued to Senna's gearbox in the closing laps of Monaco 1992, faster and unable to pass? Head-of-line blocking is exactly that: the quick one stuck behind whoever got there first.",
    lead: "Two scenes explain why HTTP had to evolve, framed as two communication failures between car and pit wall. Scene 1: an e-commerce page loads the main HTML plus 40 thumbnail images; even with persistent connections (keep-alive), HTTP/1.1 processes one request at a time within that connection, so the second image only starts downloading once the first has arrived in full. It's a single radio: while the engineer dumps one long transmission, every other message waits in line. Scene 2: even once scene 1 is fixed, a user on a shaky mobile network still feels the lag, because a single lost packet along the way is enough to freeze the whole page load until the retransmission arrives, even though everything else already got there. It's the car entering the Monaco tunnel: it loses one word of the radio and the whole message freezes until it repeats, even though the rest had already come through.",
    concept: [
      "Before the version numbers, one structural fact about HTTP itself: it's a stateless protocol. Every request is handled completely independently, with no memory of previous requests, like an isolated radio call that carries no memory of the calls before it. That makes the protocol simpler to scale, but it requires mechanisms layered on top (cookies, sessions) to fake context between requests from the same user. On the pit wall, that context lives on the pit board and in accumulated telemetry, not in the radio call itself.",
      "HTTP/1.1, the classic version (1997): introduced persistent connections (keep-alive), letting multiple requests and responses share the same TCP connection, which cut a lot of the overhead of opening a fresh connection for every resource. The catch is head-of-line blocking: if the first request takes a while, everything behind it, on that same connection, has to wait. Channel stays open, sure, but one transmission at a time, and the long one holds up the queue.",
      "HTTP/2, multiplexing (2015): solves scene 1's head-of-line blocking at the application layer, multiple requests and responses travel simultaneously over the same TCP connection, with none blocking another. It's the modern telemetry of a 2026 car, dumping dozens of channels at once over the same link (tire pressure, ERS deployment, DRS mode) with no channel holding up another. It also brought resource prioritization, header compression via HPACK, and Server Push (a feature that shipped in the original spec but has since fallen out of use: the major browsers have removed or restricted support for it since 2022, because the real performance gain rarely justified the complexity of using it correctly).",
      "HTTP/3, QUIC over UDP: HTTP/2 solved head-of-line blocking at the application layer, but scene 2's problem still lives one layer down. TCP guarantees bytes arrive in strict order, so if a packet is lost, everything that came after it waits for the retransmission, even if it belongs to a different stream than the one that stalled. HTTP/3 attacks that by swapping TCP for QUIC (Quick UDP Internet Connections), which runs over UDP: every stream is independent, and losing a packet from one stream doesn't stall the others. It's like having every telemetry channel immune to the others' noise: if the brake-temperature reading drops out for an instant in the tunnel, the GPS channel doesn't even notice. The gain is biggest on networks with packet loss or high latency, the typical case for mobile connections, in other words the car out in the far, noisy stretches of a long track like Spa.",
    ],
    pointsTitle: "The three generations, side by side",
    points: [
      {
        t: "HTTP/1.1 (1997)",
        d: "TCP transport. Fixed reopening a connection for every request with keep-alive. Limitation: head-of-line blocking, one transmission at a time.",
        color: "blue",
      },
      {
        t: "HTTP/2 (2015)",
        d: "Still TCP. Fixed application-layer head-of-line blocking with stream multiplexing over one connection, plus HPACK and prioritization.",
        color: "signal",
      },
      {
        t: "HTTP/3 (QUIC)",
        d: "UDP transport via QUIC. Fixed TCP's own head-of-line blocking with independent streams: a lost packet only stalls its own stream.",
        color: "ember",
      },
    ],
    examplesTitle: "Asking curl itself which version got negotiated",
    examples: [
      {
        label: "version negotiation",
        lang: "sh",
        code: `# Let curl negotiate freely and show the version used in the response
$ curl -so /dev/null -w 'Negotiated protocol: HTTP/%{http_version}\\n' https://www.cloudflare.com
Negotiated protocol: HTTP/2

# Force HTTP/1.1, even if the server supports newer versions
$ curl --http1.1 -so /dev/null -w 'Negotiated protocol: HTTP/%{http_version}\\n' https://www.cloudflare.com
Negotiated protocol: HTTP/1.1

# Force HTTP/3 (needs a curl build with QUIC support)
$ curl --http3 -so /dev/null -w 'Negotiated protocol: HTTP/%{http_version}\\n' https://www.cloudflare.com
Negotiated protocol: HTTP/3`,
        note: "Not every curl build ships with HTTP/3 support (it depends on a QUIC library, like ngtcp2 or quiche). Run curl --version | grep -i http3 to check before using the --http3 flag, the same care as checking the car has the QUIC telemetry kit installed before you demand that mode.",
      },
    ],
    commands: [
      {
        cmd: "curl -so /dev/null -w 'HTTP/%{http_version}\\n' <url>",
        note: "shows the negotiated version",
      },
      { cmd: "curl --http1.1 <url>", note: "forces HTTP/1.1" },
      { cmd: "curl --http3 <url>", note: "forces HTTP/3 (needs a curl build with QUIC support)" },
      { cmd: "curl --version | grep -i http3", note: "checks whether your curl supports HTTP/3" },
    ],
    handsOnIntro:
      "Three curl commands, three protocol versions negotiated right in front of you. Clock the %{time_total} of each and feel, in your own hands, the difference every generation brought. This one's a qualifying lap.",
    handsOn: [
      "Pick a domain you know supports HTTP/2 (for example, www.cloudflare.com or www.google.com) and run the three commands from the example above. Watch the %{http_version} value change with the flag used.",
      'Run curl -v --http2 https://www.cloudflare.com 2>&1 | grep -i "HTTP/2" and find, buried in the verbose output, the line confirming the version negotiated during the handshake. It\'s the radio handshake before the first real transmission.',
      'If your curl supports HTTP/3, repeat with --http3 and compare the response time with -w "%{time_total}\\n" across all three variants.',
    ],
    tip: "Realizing HTTP/2 cleared the queue up at the application layer and HTTP/3 dropped down to the transport layer to kill the problem at the root is the kind of distinction a senior engineer makes without even thinking. Catch that difference and you're already running with the front pack.",
    takeaway:
      "Every HTTP version solved head-of-line blocking at a different layer: /2 solved it at the application layer with multiplexing, /3 solved it at the transport layer, swapping TCP for QUIC over UDP. One cleared the radio queue, the other made every telemetry channel immune to its neighbors' noise.",
    outro:
      "You watched the radio clear its queue and the telemetry go deaf to interference. Now the circuit stretches into a technical chicane: two lookalike intermediaries doing opposite jobs. Stage 03, mind the braking zone.",
  },

  {
    id: "sw3",
    num: "03",
    navTitle: "Forward vs Reverse Proxy",
    tag: "the proxy chicane",
    title: "Forward Proxy and Reverse Proxy, the web's two intermediaries",
    narration:
      "Careful with this sequence: forward proxy and reverse proxy are twins running in opposite directions. Get them mixed up here and you lose the car in the gravel. Full focus through the next few corners.",
    lead: "Two mirrored scenes, one on the client side and one on the server side. Think of a car that needs to talk to the world (outbound) and a box that needs to receive the world (inbound). Scene A: a company wants every outbound request from its employees to pass through a single control point, to block unwanted sites, log access for compliance, and stop each machine's internal IP from being exposed straight to the internet. Scene B: the same company runs five application servers behind a single public domain, and it makes no sense to expose each server's IP individually, repeat the TLS certificate setup on every one of them, or let each server decide on its own whether it can handle one more simultaneous connection. Two different needs, but with one piece in common: an intermediary sitting between whoever's asking and whoever's answering. The difference is which side that intermediary represents and protects.",
    concept: [
      "Forward Proxy, the outbound intermediary: sits between a client (usually inside a private network) and the internet, and is explicitly configured on the client's side (in the browser, the operating system, or the application). Analogy: it's the driver's manager. The driver doesn't personally go negotiate with a sponsor or field questions from the press, he talks to his manager, who decides what goes out, negotiates on his behalf, and brings the outcome back. The sponsor on the other end has no idea the words came from the driver, all they see is the manager. The driver hired that intermediary on purpose, exactly like a client configures a forward proxy. Use cases: security and compliance (routing traffic through firewalls), content control (blocking sites), anonymity and privacy (masking the client's real IP), and caching (storing frequent responses to save bandwidth).",
      "Reverse Proxy, the smart gatekeeper at the front door: sits at the edge of the infrastructure, receiving requests from the internet and handing them out to the application servers behind it. It's transparent to the client, who has no idea it's even there. Analogy: it's literally the pit wall from Stage 01, seen from another angle, now formalized specifically for when it exists to protect and organize what's behind it. Picture Ferrari's pit wall taking every incoming call from outside and deciding, request by request, whether it's business for Hamilton's car or Leclerc's, already armed with ready answers for the routine stuff and turning away anyone who shouldn't get near the cars. Main functions: load balancing across multiple backends, centralized SSL/TLS termination (taking that CPU load off the backends), content caching, a first line of defense against malicious traffic (blocking specific attacks like XSS usually needs extra WAF rules, not just the plain proxy), compression (Gzip/Brotli), and smart routing across different services.",
      "Summed up in paddock slang: forward proxy is the manager speaking for the driver on the way out, reverse proxy is the pit wall taking in the world on the way in. Same kind of intermediary, opposite directions.",
    ],
    pointsTitle: "The two sides of the same mechanism",
    points: [
      {
        t: "Forward Proxy",
        d: "Sits on the client's side, configured by the client itself. Protects the client against the internet. Visible and explicit: you point at it on purpose.",
        color: "blue",
      },
      {
        t: "Reverse Proxy",
        d: "Sits on the server's side, configured by the server's own infrastructure. Protects the server against the internet. Transparent: the client has no idea it's there.",
        color: "signal",
      },
      {
        t: "Reverse Proxy's functions",
        d: "Load balancing, SSL/TLS termination, caching, a first security layer (real XSS defense needs a separate WAF), compression, and routing across services.",
        color: "ember",
      },
    ],
    examplesTitle: "An Nginx reverse proxy in front of a simple backend",
    examples: [
      {
        label: "proxy.conf (Nginx)",
        lang: "yaml",
        code: `# /etc/nginx/conf.d/proxy.conf
upstream backend_app {
    server 127.0.0.1:8000;         # the real application server, behind the proxy
}

server {
    listen 80;
    server_name localhost;

    location / {
        proxy_pass http://backend_app;                    # forwards the request to the backend
        proxy_set_header Host $host;                       # preserves the client's original Host
        proxy_set_header X-Real-IP $remote_addr;           # tells the backend the client's real IP
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; # chain of IPs, if there's more than one proxy
    }
}`,
        note: "Without the X-Real-IP/X-Forwarded-For headers, the backend would see every request as coming from Nginx itself (127.0.0.1), losing track of who actually made the request. It'd be the pit wall relaying a message to the driver without saying who it came from.",
      },
      {
        label: "client → proxy → backend",
        lang: "sh",
        code: `# A simple backend, just to have something behind the proxy
$ python3 -m http.server 8000

# On the client side, you're talking to the proxy, with no idea a Python server is behind it
$ curl -I http://localhost
HTTP/1.1 200 OK
Server: nginx/1.27.0`,
        note: "The Server header still reads nginx, even with the content coming from the Python server behind it. That's exactly the transparency that defines a reverse proxy: from the outside, you speak to the pit wall and hear back from the pit wall, even if the answer was born inside, in the car.",
      },
      {
        label: "explicit forward proxy",
        lang: "sh",
        code: `# Here it's you, the client, explicitly pointing at the proxy
$ curl -x http://company-proxy:3128 http://example.com`,
        note: 'This is the driver saying, straight up, "talk to my manager": he knows there\'s an intermediary and points at it on purpose.',
      },
    ],
    commands: [
      { cmd: "python3 -m http.server 8000", note: "spins up a simple backend to test with" },
      { cmd: "nginx -s reload", note: "reloads Nginx's config without dropping connections" },
      { cmd: "curl -I http://localhost", note: "checks the Server header through the proxy" },
      {
        cmd: "curl -x http://proxy:3128 http://example.com",
        note: "uses an explicit forward proxy",
      },
    ],
    handsOnIntro:
      "Spin up the Python backend, put Nginx in front of it, reload, and check the Server header with a curl: every step is a tire change, do it in order and the car leaves the box clean. Garage warning: this exercise edits Nginx's real config and reloads the process with nginx -s reload, so use an Nginx installed on the host (sudo apt install nginx), not the nginx:latest container from Stage 01. If you'd rather stay on Docker, see the workaround suggested at the top of the guide.",
    handsOn: [
      "Spin up the Python backend (python3 -m http.server 8000, in a folder with any index.html) and configure Nginx as in the example above. Reload with nginx -s reload.",
      "Run curl -I http://localhost and notice the Server: nginx header, even with the content coming from the Python process. The pit wall out front, the car behind it.",
      "Temporarily remove the proxy_set_header X-Real-IP line, reload, and think through what the backend would now see: without that header, it would only see Nginx's own IP.",
      "Compare with the forward proxy's curl -x command: notice that there, it's you pointing at the intermediary on purpose; in step 2, you didn't even know it existed.",
    ],
    tip: "To tell whether you're on the explicit or the implicit side of a proxy, ask: who set up the pointer, the client or the server? That answer alone tells you whether it's forward or reverse.",
    takeaway:
      "A forward proxy sits on the client's side and is configured by it; a reverse proxy sits on the server's side and is invisible to the client, but both are the same kind of intermediary, looking in opposite directions. Manager on the way out, pit wall on the way in.",
    outro:
      "Manager on the way out, pit wall on the way in: you won't mix those up again. Now comes the heaviest braking zone on the track, where Apache's garage strategy decides who survives the peak. Stage 04.",
  },

  {
    id: "sw4",
    num: "04",
    navTitle: "Apache & MPMs",
    tag: "the MPM braking zone",
    title: "Apache HTTP Server and its processing models (MPMs)",
    narration:
      "Here the track demands garage strategy: how do you scale your crew of mechanics to handle 5,000 cars wanting the box at the same time? Get this wrong and it costs you. Ask Ferrari about Abu Dhabi 2010, who threw away a championship on the wrong box call at the wrong moment.",
    lead: "Scenario 1: an e-commerce site running Apache with the oldest processing model takes a spike of 5,000 simultaneous connections during a sale. Since every connection gets its own, fully isolated operating-system process, the server tries to open thousands of processes, each burning tens of megabytes just to exist, before it's even processed a single request. Memory runs out, the system starts swapping to disk, and the site crashes right at the sales peak. It's a pit-stop window under a safety car: all 22 cars want the box at the same time, and if you demanded a whole separate crew for every car, there wouldn't be room or people in the pit lane for all of them. Scenario 2, the opposite: the same company depends on an old module written with no concurrency care (not thread-safe), and it has to keep working. Switching the processing model to one based on threads sharing memory would make that module corrupt data or crash the process unpredictably. It's that legacy calibration tool that only works on an isolated bench: on a shared bench, it messes up every other mechanic's work. One scenario calls for lightness to scale; the other calls for total isolation to survive. Apache resolves that tension by letting you choose the concurrency model, the MPMs (Multi-Processing Modules).",
    concept: [
      "General analogy: think of the garage and how you scale the mechanics. In this stage, a connection is a car pulling in to be serviced, a process is an independent box with its own tools and its own space, and a thread is a mechanic inside that box, sharing the same toolbench.",
      "Prefork MPM (non-threaded): an independent child process gets spun up for every connection, fully isolated from the rest. Advantages: very stable (a problem in one process doesn't touch the others), ideal for non-thread-safe modules, high compatibility with legacy software. Drawbacks: high memory use and poor scalability under heavy concurrency. Prefork commonly pairs with mod_php (PHP embedded inside Apache's own process, historically not thread-safe); the modern alternative is running PHP as a separate process via PHP-FPM, with Apache talking to it over a proxy, which lets you run a lighter MPM without losing compatibility.",
      "Worker MPM (multithreaded): spins up multiple child processes, each running multiple threads, and each thread handles one connection. More memory-efficient than Prefork and better performing under heavy concurrency, but since threads in the same process share memory, a serious bug in one thread can corrupt the whole child process hosting it, taking down the connections that specific process was serving (the other processes and the master process stay up). It's the mechanic who knocks over the toolbench and only hurts his own box's crew; the other boxes and the team principal keep working. That's why the modules need to be thread-safe.",
      "Event MPM (recommended for production): builds on the Worker model, but tuned for the common case of open, idle keep-alive connections: one dedicated thread can watch several connections that are just waiting, without tying up a whole working thread just to hold an idle connection open. It's the mechanic who doesn't stand rooted next to a car that's only waiting for an order; he watches several waiting cars at once and only acts when one of them actually needs him. Efficient for keep-alive, tuned for high concurrency, with native HTTP/2 support, but it demands thread-safe modules and is more complex to configure.",
    ],
    pointsTitle: "The three MPMs, side by side",
    points: [
      {
        t: "Prefork",
        d: "Total isolation, one process per connection. High memory, low concurrency. Use for: maximum stability, non-thread-safe modules (e.g., legacy mod_php).",
        color: "ember",
      },
      {
        t: "Worker",
        d: "Few processes, threads sharing memory. Medium memory, high concurrency. Use for: moderate-to-high traffic, requires thread-safe modules.",
        color: "signal",
      },
      {
        t: "Event",
        d: "Like Worker, but tuned for idle keep-alive. Low memory, very high concurrency. Use for: recommended for most new deployments.",
        color: "blue",
      },
    ],
    examplesTitle: "Finding and switching the active MPM",
    examples: [
      {
        label: "apachectl -V",
        lang: "sh",
        code: `# Shows which MPM is compiled in / active right now (trimmed output)
$ apachectl -V | grep -i mpm
Server MPM:     event

# On Debian/Ubuntu, a2query shows which MPM module is enabled
$ sudo a2query -M
event`,
      },
      {
        label: "switching MPM",
        lang: "sh",
        code: `# Switching to Prefork (say, to run a legacy non-thread-safe module)
$ sudo a2dismod mpm_event      # disables the current MPM module
$ sudo a2enmod mpm_prefork     # enables Prefork
$ sudo systemctl restart apache2

$ sudo a2query -M
prefork`,
        note: "On RHEL/CentOS-based distros, the switch is done by commenting/uncommenting the LoadModule mpm_*_module lines in /etc/httpd/conf.modules.d/00-mpm.conf, instead of using a2enmod/a2dismod.",
      },
      {
        label: "mpm_event.conf",
        lang: "yaml",
        code: `# Illustrative excerpt from mpm_event.conf (tune the values to your real traffic)
<IfModule mpm_event_module>
    StartServers             3     # child processes created at startup
    MinSpareThreads         75     # minimum idle threads kept in reserve
    MaxRequestWorkers      400     # cap on simultaneously served connections
    ThreadsPerChild         25     # threads per child process
</IfModule>`,
        note: "Switching MPMs is like reconfiguring the garage between one race and the next: same crew, same Apache, it just changes behavior based on how boxes and mechanics are organized.",
      },
    ],
    commands: [
      { cmd: "apachectl -V | grep -i mpm", note: "shows the active MPM" },
      { cmd: "sudo a2query -M", note: "confirms the enabled MPM module (Debian/Ubuntu)" },
      {
        cmd: "sudo a2dismod mpm_event && sudo a2enmod mpm_prefork",
        note: "switches the active MPM",
      },
      { cmd: "sudo systemctl restart apache2", note: "applies the MPM switch" },
      { cmd: "ab -n 500 -c 50 http://localhost/", note: "generates test load (Apache Bench)" },
    ],
    handsOnIntro:
      "Find the active MPM, switch it, and run Apache Bench before and after: the same machine stopping in 2 seconds or 4, just from how you scaled the crew. Garage warning: this exercise uses a2enmod/a2dismod and apachectl, commands that act on an Apache installed on the host (sudo apt install apache2), not on the httpd:latest container from Stage 01. Step 3 also uses ab: if it's not installed, run sudo apt install apache2-utils before you get there.",
    handsOn: [
      "Run apachectl -V | grep -i mpm (or httpd -V | grep -i mpm, depending on the distro) on your Apache and note which MPM is active right now.",
      "If your system is Debian/Ubuntu, switch the active MPM with a2dismod/a2enmod and confirm the switch with a2query -M.",
      "Run a simple load test against the same Apache, before and after the MPM switch: ab -n 500 -c 50 http://localhost/. Compare the Requests per second and Time per request lines between the two runs. Don't expect a magic number: the point is to feel that the same machine behaves differently just because of the MPM chosen, the same feeling as a pit stop that comes out in 2 seconds or in 4 depending on how the crew was scaled.",
    ],
    tip: "Prefork, Worker, Event: memorizing the three names gets you to one level; understanding that the difference lives in process, thread, and isolation gets you to another. Worth rereading the table slowly before you decide which to run in production.",
    takeaway:
      "Prefork isolates everything into processes and is the heaviest; Worker splits that into threads inside a handful of processes and is lighter, but demands thread-safe code; Event is Worker tuned so it doesn't burn a whole thread on an idle keep-alive connection, and it's the recommended model today. An isolated box per car, a shared bench per crew, or a mechanic watching several waiting cars at once.",
    outro:
      "An isolated box per car, a shared bench per crew, or a mechanic watching several waiting cars at once: you can already pick the garage layout to match the race. All that's left is the final fast corner, where Nginx shows why it was born for this era. Stage 05.",
  },

  {
    id: "sw5",
    num: "05",
    navTitle: "Nginx event-driven",
    tag: "the event-loop fast corner",
    title: "Nginx and its event-driven architecture",
    narration:
      "The final split of the lap, and this is where the grid's leanest chassis shines. Nginx follows F1 designers' golden rule: simplify first, then strip out every gram of weight that doesn't need to be there. Let's watch this car through its best corner.",
    lead: "Scenario: an application with lots of long-lived, mostly idle simultaneous connections (real-time chat, push notifications, keep-alive for mobile app APIs). Even with Apache's Event MPM cutting the cost of idle connections, the model is still built on reserving one thread for every connection being actively processed. Scaling to tens of thousands of simultaneous connections means scaling, in the same proportion, the number of threads and the memory they eat, until you hit the practical limit of how many threads can coexist efficiently. Imagine wanting one dedicated engineer per car to monitor tens of thousands of cars at once: no pit wall can hold that. That's the exact problem Nginx was built from scratch to solve. While Apache started life as a traditional web server and picked up concurrency models over time, Nginx was designed from day one with a modern architecture in mind, built specifically to serve static content and act as a reverse proxy under heavy concurrency.",
    concept: [
      "Nginx's core difference is its asynchronous, event-driven architecture, quite unlike the dedicated thread- or process-per-connection model. Analogy: picture a race engineer at the telemetry wall, the giant board showing every car's telemetry at once. He doesn't stand there staring at a single car waiting for something to happen. He sweeps the whole board and only acts when an event fires: a tire-temperature alert on Russell's car, an undercut request from Antonelli's. One engineer can monitor the entire grid this way, because he's never blocked waiting on just one car.",
      "On Apache, every active connection tends to hold a dedicated thread or process for as long as it lasts (even the Event MPM only reserves a thread for the request being actively processed, it just avoids spending a whole thread on connections that are merely idle). With 10,000 users connected at once, you need to sustain a meaningful fraction of 10,000 threads or processes eating memory. It would be like wanting one engineer per car for a grid of ten thousand cars.",
      "On Nginx, non-blocking I/O: when an I/O operation is needed (reading from disk, waiting on a backend's response), the worker registers the event and moves on to another connection, instead of standing there waiting. The engineer logs \"let me know when car X's data comes in\" and goes straight to watching car Y. The event loop is the loop each worker process runs, handling thousands of connections with few resources, the continuous sweep of the telemetry wall. When the event is ready, the worker gets notified and picks up exactly where it left off: the alert flashes on the board, the engineer reacts on that car, and goes back to sweeping the rest.",
      "This approach makes Nginx extremely efficient, especially for keep-alive and idle connections, exactly this stage's scenario. Practical benefits: lower memory use, higher throughput, better latency, and excellent performance as a reverse proxy and load balancer, including in front of Apache itself.",
      "One caveat, so as not to oversell it: at a real telemetry wall, a human engineer has limited attention and genuinely loses track with too many cars. Nginx's worker doesn't get tired: it processes every event in microseconds and goes back to the loop, and the bottleneck becomes CPU and memory, not attention. The engineer image is there to explain the event loop's logic, not to claim there's a human inside making it happen.",
    ],
    pointsTitle: "The pieces of the event-driven engine",
    points: [
      {
        t: "Non-blocking I/O",
        d: "Instead of standing idle waiting on a disk or backend response, the worker registers the event and moves on to another connection.",
        color: "blue",
      },
      {
        t: "Event loop",
        d: "Every worker runs a loop continuously sweeping connections, acting only when an event fires.",
        color: "signal",
      },
      {
        t: "epoll",
        d: "A Linux kernel mechanism that tells the worker exactly which connection just got new data, no blind sweeping needed.",
        color: "ember",
      },
    ],
    examplesTitle: "Few processes, thousands of connections",
    examples: [
      {
        label: "nginx.conf (workers)",
        lang: "yaml",
        code: `# /etc/nginx/nginx.conf (main excerpt)
worker_processes auto;   # 1 worker process per available CPU core

events {
    worker_connections 1024;   # each worker can handle up to 1024 simultaneous connections
    use epoll;                 # Linux kernel's event notification mechanism
}`,
        note: "With worker_processes auto and worker_connections 1024 on a 4-core machine, Nginx can, in theory, serve up to 4,096 simultaneous connections using just 4 worker processes (plus the master process, which only manages the workers). Four engineers at the telemetry wall watching 4,096 cars, and a team principal coordinating the engineers without ever picking up a radio.",
      },
      {
        label: "ps aux + ss",
        lang: "sh",
        code: `# Few processes, no matter how many connections are active
$ ps aux | grep '[n]ginx'
root       812  0.0  0.1  55508  1420 ?  Ss  10:02  0:00 nginx: master process nginx -g daemon off;
nginx      813  0.0  0.2  55964  2116 ?  S   10:02  0:00 nginx: worker process
nginx      814  0.0  0.2  55964  2116 ?  S   10:02  0:00 nginx: worker process

# How many TCP connections are actually established right now
$ ss -tn state established | wc -l
187`,
        note: "Notice: 187 established connections being served by just 2 worker processes. Two engineers handling 187 cars. On an Apache running Prefork or Worker under the same load, ps aux usually shows dozens or hundreds of lines, almost one mechanic or box per car.",
      },
    ],
    commands: [
      { cmd: "nginx -t", note: "validates the config and shows nginx.conf's path" },
      { cmd: "ps aux | grep '[n]ginx'", note: "lists Nginx's processes" },
      { cmd: "nproc", note: "shows the machine's core count" },
      { cmd: "ab -n 1000 -c 200 http://localhost/", note: "generates test load" },
      { cmd: "ss -tn state established | wc -l", note: "counts established TCP connections" },
    ],
    handsOnIntro:
      "Count the processes with ps aux, throw load at it with ab, and watch: the number of engineers at the wall doesn't budge, no matter how many cars show up. Garage warning: just like in Stage 03, this exercise reads config and watches processes for an Nginx installed on the host, not the nginx:latest container from Stage 01. Step 3 uses ab again: install it with sudo apt install apache2-utils if you haven't already in Stage 04.",
    handsOn: [
      "Find your Nginx's nginx.conf (nginx -t shows the path at the top of its output) and locate the worker_processes and worker_connections directives.",
      "Run ps aux | grep '[n]ginx' and count how many processes show up. Compare with nproc (your machine's core count): the worker count is usually equal to or close to it. As many engineers as available cores.",
      "Generate load with several simultaneous connections: ab -n 1000 -c 200 http://localhost/. While the test runs, run ps aux | grep '[n]ginx' in a second terminal. Notice: the process count doesn't change, even with hundreds of simultaneous connections hitting the server. The same engineers at the wall, whether more cars show up or not.",
      "If you have access to an Apache for the same kind of test, repeat the load there and run ps aux | grep '[a]pache2\\|[h]ttpd'. Depending on the configured MPM, notice the process or thread count grow along with the load, unlike what happened with Nginx. There, the garage hires mechanics as traffic picks up; here, the wall keeps running with the same crew.",
    ],
    tip: "Non-blocking I/O and the event loop are the heart of it all: a single engineer sweeps the whole telemetry wall without ever getting stuck on one car. Get that, and you get why Nginx scales the way it does.",
    takeaway:
      "Apache handles concurrency by dedicating a process or thread to every connection (even when tuned by the Event MPM); Nginx handles concurrency with a handful of processes running a non-blocking event loop, and that's exactly why it dominates as a reverse proxy and load balancer in front of anything, including Apache itself. One mechanic per car versus one engineer sweeping the whole telemetry wall.",
    outro:
      "A handful of processes, one event loop, and Nginx dominating the edge of anything, including Apache itself. You've crossed the whole track, from static content to the event loop. Pack up the pit board, go over the debrief at your own pace, and see you at the next race on the calendar.",
  },
  {
    id: "sw6",
    num: "06",
    navTitle: "Load balancing",
    tag: "strategy distributes traffic",
    title: "Load balancing: L4, L7, and Nginx algorithms",
    narration:
      "The straight has brought too much traffic for one car. The pit wall must now distribute every call without losing pace. Pick the wrong algorithm and every pit stop queues at one box while the next one sits empty.",
    lead: "When one instance reaches its limit, adding only CPU and memory merely postpones the problem. Horizontal scaling creates several backends, and the Load Balancer chooses which one receives each new request. That decision may look only at IP and port at L4, or understand HTTP hosts, paths, and headers at L7.",
    concept: [
      "L4 balancers work at the TCP or UDP transport layer. They are fast and handle generic protocols, but cannot route by URL or header. L7 balancers understand HTTP and HTTPS, can terminate TLS, cache, compress, and apply content rules, at the cost of some extra processing.",
      "In Nginx, Round Robin is the default and distributes in sequence. weight changes the share for servers with different capacity. least_conn picks the backend with the fewest active connections. ip_hash creates affinity from the client IP, useful for legacy local sessions but vulnerable to imbalance behind NAT or VPN.",
      "Stateless applications simplify the grid: shared sessions in Redis or signed tokens let any backend answer. Strategy no longer needs to pin each user to the same car.",
    ],
    pointsTitle: "How to choose the algorithm",
    points: [
      {
        t: "Round Robin + weight",
        d: "A sound default for similar backends; add weights when capacity differs.",
        color: "blue",
      },
      {
        t: "Least Connections",
        d: "Prefer it when request duration varies widely or connections stay open.",
        color: "signal",
      },
      {
        t: "IP Hash",
        d: "Simple affinity, but it can group many users on one public IP and does not replace stateless design.",
        color: "ember",
      },
    ],
    examplesTitle: "An upstream with an explicit decision",
    examples: [
      {
        label: "nginx.conf",
        lang: "yaml",
        code: 'upstream pitstop_api {\n    least_conn;\n    server api-1:3000 weight=2;\n    server api-2:3000;\n    keepalive 32;\n}\n\nserver {\n    listen 80;\n    location /api/ {\n        proxy_pass http://pitstop_api;\n        proxy_http_version 1.1;\n        proxy_set_header Connection "";\n    }\n}',
        note: "least_conn watches active connections; keepalive reuses Nginx-to-backend connections. Weight still affects selection among available servers.",
      },
    ],
    commands: [
      { cmd: "nginx -t", note: "validates configuration before lights out" },
      { cmd: "nginx -s reload", note: "reloads without dropping existing connections" },
      {
        cmd: "for i in $(seq 1 8); do curl -s http://localhost/api/; done",
        note: "observes distribution",
      },
      {
        cmd: "ab -n 1000 -c 20 http://localhost/api/",
        note: "measures throughput and latency under concurrency",
      },
    ],
    handsOnIntro:
      "Run two backends that return different names and place Nginx in front. The goal is not memorizing directives, but seeing the pit wall make each choice.",
    handsOn: [
      "Configure an upstream with two backends and Round Robin. Make eight calls and record the response sequence.",
      "Switch to least_conn and repeat while one backend answers more slowly. Watch which one receives less new work.",
      "Test ip_hash and explain why repeated calls from the same client tend to reach one backend. Then describe how Redis or JWT removes that dependency.",
    ],
    tip: "Choose an algorithm from workload behavior. Round Robin distributes counts; least_conn distributes occupancy; ip_hash distributes affinity.",
    takeaway:
      "Balancing is more than spreading requests. It is deciding how much information the balancer sees and which signal it uses to distribute work without becoming the next bottleneck.",
    outro:
      "Traffic distributed, stints balanced. A strong strategy must still notice when a car stops answering. The next stage turns on health sensors and the contingency plan.",
  },
  {
    id: "sw7",
    num: "07",
    navTitle: "Failover and diagnosis",
    tag: "telemetry + plan B",
    title: "Health checks, failover, metrics, and troubleshooting",
    narration:
      "Yellow flag in sector two. One backend has lost performance, and sending more calls to it turns a local fault into a team-wide retirement. Telemetry must detect it, remove it from rotation, and confirm recovery.",
    lead: "A process can be running yet unable to serve users. Health checks measure the real service; failover redirects work when health drops. Without logs, metrics, and load tests, the crew only learns about the fault over the user's radio.",
    concept: [
      "In Nginx Open Source, max_fails and fail_timeout provide passive health checks: failures observed in real requests temporarily remove a backend. The backup directive reserves a server for when all primaries are unavailable. Full active checks require Nginx Plus or external modules.",
      "stub_status exposes active connections and read, write, and wait states. Apache Bench creates controlled load. Reading RPS, latency, percentiles, CPU, and logs together reveals whether the constraint lives in the proxy, backend, or a dependency.",
      "502 Bad Gateway usually means a refused connection or invalid upstream response. 504 Gateway Timeout means the connection worked but the backend exceeded proxy_read_timeout. Raising a timeout without diagnosis can simply hide slowness.",
    ],
    pointsTitle: "The failure response cycle",
    points: [
      {
        t: "Detect",
        d: "Watch real failures, health endpoints, latency, and error rate.",
        color: "signal",
      },
      {
        t: "Isolate",
        d: "Remove the unhealthy backend and preserve healthy ones; use backup only for contingency.",
        color: "ember",
      },
      {
        t: "Diagnose",
        d: "Follow client, Nginx, backend, and dependencies with correlated metrics and logs.",
        color: "blue",
      },
    ],
    examplesTitle: "Primary backends, standby, and status panel",
    examples: [
      {
        label: "nginx.conf",
        lang: "yaml",
        code: "upstream pitstop_api {\n    server api-1:3000 max_fails=3 fail_timeout=15s;\n    server api-2:3000 max_fails=1 fail_timeout=5s;\n    server api-backup:3000 backup;\n}\n\nlocation = /nginx_status {\n    stub_status;\n    allow 127.0.0.1;\n    deny all;\n}",
        note: "The passive check depends on real traffic. After fail_timeout, Nginx retries the backend and restores it if the call succeeds.",
      },
    ],
    commands: [
      { cmd: "curl http://localhost/nginx_status", note: "queries the built-in panel" },
      { cmd: "ab -n 2000 -c 50 http://localhost/api/", note: "creates measurable load" },
      { cmd: "docker stop api-1", note: "simulates a backend failure" },
      { cmd: "docker logs -f nginx", note: "follows failures and recovery" },
    ],
    handsOn: [
      "Generate load and record Requests per second and the 95th percentile from Apache Bench.",
      "Stop one backend during the run. Confirm in logs that it left rotation while healthy nodes kept answering.",
      "Stop all primaries and verify the backup server takes over. Restore one primary and follow its return after fail_timeout.",
      "Use a wrong address and a slow response to tell 502 from 504 in practice.",
    ],
    tip: "Never change three timeouts at once. Reproduce, change one variable, rerun the load, and compare the same metric.",
    takeaway:
      "High availability begins when the edge detects an incapable backend, stops sending it work, and proves through telemetry that the experience continued.",
    outro:
      "The proxy can react now. The track changes scale: in Kubernetes, dozens of Services need to share one clear, secure, declarative entrance.",
  },
  {
    id: "sw8",
    num: "08",
    navTitle: "Kubernetes Ingress",
    tag: "the cluster's single gate",
    title: "Ingress: host and path routing in Kubernetes",
    narration:
      "We have reached a Grand Prix paddock. There are many boxes, but the public enters through a few gates. The pass names the destination; the gate crew reads it and sends each call to the right Service.",
    lead: "Creating one LoadBalancer per Service raises cost and multiplies public IPs. Ingress centralizes HTTP and HTTPS rules. It does not forward packets on its own: an Ingress Controller watches those declarations and configures the real proxy.",
    concept: [
      "Ingress is the rule map; ingress-nginx, Traefik, or another Controller executes it. Without a Controller, creating an Ingress object changes no traffic.",
      "Host routing separates domains such as api.example.com and app.example.com. Path routing separates routes under one domain. Prefix accepts subpaths; Exact requires a full match.",
      "Annotations apply Controller-specific capabilities such as URL rewrites. ingressClassName chooses the Controller when the cluster has more than one.",
    ],
    pointsTitle: "The pieces of the external path",
    points: [
      {
        t: "Ingress Resource",
        d: "Declares hosts, paths, and destination Services.",
        color: "blue",
      },
      {
        t: "Ingress Controller",
        d: "Watches rules and configures the proxy receiving real traffic.",
        color: "signal",
      },
      {
        t: "ClusterIP Service",
        d: "Keeps a stable internal destination for selected Pods.",
        color: "ember",
      },
    ],
    examplesTitle: "One domain, two Services",
    examples: [
      {
        label: "ingress.yaml",
        lang: "yaml",
        code: "apiVersion: networking.k8s.io/v1\nkind: Ingress\nmetadata:\n  name: pitstop\n  annotations:\n    nginx.ingress.kubernetes.io/rewrite-target: /$2\nspec:\n  ingressClassName: nginx\n  rules:\n    - host: pitstop.local\n      http:\n        paths:\n          - path: /api(/|$)(.*)\n            pathType: ImplementationSpecific\n            backend:\n              service:\n                name: api\n                port:\n                  number: 3333\n          - path: /\n            pathType: Prefix\n            backend:\n              service:\n                name: web\n                port:\n                  number: 3005",
        note: "rewrite-target is specific to ingress-nginx. Use regex only when needed and test the path the backend actually receives.",
      },
    ],
    commands: [
      {
        cmd: "helm upgrade --install ingress-nginx ingress-nginx/ingress-nginx -n ingress-nginx --create-namespace",
        note: "installs the Controller",
      },
      { cmd: "kubectl apply -f ingress.yaml", note: "publishes the rules" },
      { cmd: "kubectl get ingress -A", note: "checks address and class" },
      {
        cmd: "curl -H 'Host: pitstop.local' http://127.0.0.1/api/health",
        note: "tests host and path",
      },
    ],
    handsOn: [
      "Install an Ingress Controller and wait for its Pods to become Ready.",
      "Publish two Services and a rule sending / to the frontend and /api to the backend.",
      "Test with the Host header and inspect both backend logs to confirm the destination.",
      "Change Prefix to Exact on a health route and test a subpath to feel the difference.",
    ],
    tip: "Debug in this order: active Controller, correct IngressClass, accepted rule, Service endpoints, healthy Pod. Ingress remains stable, but its API is frozen; for new designs, compare it with the Kubernetes-recommended Gateway API.",
    takeaway:
      "Ingress declares a shared HTTP entrance; the Controller turns that intent into a real proxy and sends each host and path to the right Service.",
    outro:
      "The gate knows where every request belongs. Now its credential must be valid and renewed before expiry. Time for automated TLS.",
  },
  {
    id: "sw9",
    num: "09",
    navTitle: "Automated TLS",
    tag: "credentials renewed on time",
    title: "TLS and cert-manager: HTTPS without manual renewal",
    narration:
      "An expired document at the gate stops the car before the box. Certificates expire too. Mature operation renews them before a user ever sees a broken lock.",
    lead: "TLS provides confidentiality, integrity, and server authentication. In dynamic environments, manual certificate issuance and renewal does not scale. cert-manager extends the Kubernetes API and automates that lifecycle through declarative resources.",
    concept: [
      "An Issuer creates certificates inside one namespace; a ClusterIssuer can serve several namespaces. Certificate declares DNS names and the destination Secret.",
      "With ACME and Let's Encrypt, HTTP-01 or DNS-01 challenges prove control of the domain. cert-manager watches validity and renews ahead of expiry.",
      "Ingress references the TLS Secret. The private key stays in the cluster and must not be written directly into a manifest or repository.",
    ],
    pointsTitle: "From request to valid lock",
    points: [
      { t: "Issuer", d: "Defines the authority and how domain control is proven.", color: "blue" },
      {
        t: "Certificate",
        d: "Declares DNS names, duration, and the Secret receiving key and certificate.",
        color: "signal",
      },
      {
        t: "Ingress TLS",
        d: "Uses the issued Secret to terminate HTTPS at the edge.",
        color: "ember",
      },
    ],
    examplesTitle: "Ingress integrated with cert-manager",
    examples: [
      {
        label: "ingress-tls.yaml",
        lang: "yaml",
        code: "apiVersion: networking.k8s.io/v1\nkind: Ingress\nmetadata:\n  name: pitstop-secure\n  annotations:\n    cert-manager.io/cluster-issuer: letsencrypt-prod\nspec:\n  ingressClassName: nginx\n  tls:\n    - hosts:\n        - pitstop.example.com\n      secretName: pitstop-tls\n  rules:\n    - host: pitstop.example.com\n      http:\n        paths:\n          - path: /\n            pathType: Prefix\n            backend:\n              service:\n                name: web\n                port:\n                  number: 3005",
        note: "Use the authority's staging environment during tests to avoid issuance limits. Move to production only after DNS and routing are correct.",
      },
    ],
    commands: [
      { cmd: "kubectl get clusterissuer", note: "checks the certificate source" },
      { cmd: "kubectl describe certificate pitstop-tls", note: "shows issuance and renewal" },
      { cmd: "kubectl get challenge,order -A", note: "investigates the ACME flow" },
      { cmd: "curl -Iv https://pitstop.example.com", note: "validates handshake and chain" },
    ],
    handsOn: [
      "Install cert-manager and create a staging ClusterIssuer first.",
      "Apply an Ingress with tls and the issuer annotation. Watch Certificate, Order, and Challenge.",
      "Confirm the Secret was created and validate HTTPS with curl.",
      "Explain why base64 in a Secret is not encryption and which access controls protect the private key.",
    ],
    tip: "If issuance stalls, read the Challenge event. It usually points to wrong DNS, the wrong IngressClass, or a blocked HTTP-01 path.",
    takeaway:
      "cert-manager turns certificates into desired state: declare domain and destination, and the controller issues, stores, and renews TLS.",
    outro:
      "The entrance is routed and the channel protected. Inside the cluster, each service still repeats retries, security, and telemetry. The next lap moves that discipline into a shared mesh.",
  },
  {
    id: "sw10",
    num: "10",
    navTitle: "Service Mesh",
    tag: "operating network between services",
    title: "Service Mesh and the Istio architecture",
    narration:
      "A small team can settle everything over the radio. With dozens of imaginary cars and boxes, communication becomes the problem itself. The mesh creates one pattern for every call without asking every driver to reprogram the car.",
    lead: "Microservices turn internal calls into network traffic exposed to latency, failure, and uncertain identities. Reimplementing timeout, retry, encryption, and telemetry in every language creates inconsistency. A Service Mesh moves those policies into centrally controlled proxies.",
    concept: [
      "In Istio's classic sidecar model, an Envoy runs beside the workload and intercepts inbound and outbound traffic. The application stays focused on business logic.",
      "The Data Plane is the set of proxies processing traffic and enforcing policy. Istiod is the Control Plane: it watches services, translates high-level resources into Envoy configuration, and distributes identities and rules.",
      "The abstraction has a price: sidecars consume CPU and memory, add latency per hop, and introduce another platform to operate. For only a few services, that tradeoff may not pay.",
    ],
    pointsTitle: "Brain, execution, and cost",
    points: [
      {
        t: "Envoy",
        d: "Proxy in the data path; applies routing, resilience, security, and telemetry.",
        color: "signal",
      },
      {
        t: "Istiod",
        d: "Control Plane distributing configuration, discovery, and identities.",
        color: "blue",
      },
      {
        t: "Overhead",
        d: "More resources, hops, and another platform to update and diagnose.",
        color: "ember",
      },
    ],
    examplesTitle: "Sidecar injection and validation",
    examples: [
      {
        label: "bootstrap",
        lang: "sh",
        code: "$ istioctl install --set profile=demo -y\n✔ Istio core installed\n✔ Ingress gateways installed\n\n$ kubectl label namespace demo istio-injection=enabled\nnamespace/demo labeled\n\n$ kubectl get pods -n demo\nNAME             READY   STATUS\napi-6c8d9f       2/2     Running",
        note: "READY 2/2 means application and proxy share the Pod. Demo profiles are for labs, not a production baseline.",
      },
    ],
    commands: [
      { cmd: "istioctl install --set profile=demo -y", note: "installs a local lab" },
      {
        cmd: "kubectl label namespace demo istio-injection=enabled",
        note: "enables classic injection",
      },
      { cmd: "kubectl rollout restart deployment -n demo", note: "recreates Pods with sidecars" },
      { cmd: "istioctl proxy-status", note: "checks proxy synchronization" },
    ],
    handsOn: [
      "Install the demo profile in a disposable cluster and enable injection in one namespace.",
      "Recreate an application and confirm two containers per Pod.",
      "Compare resource use before and after, and record the proxy cost.",
      "Disable injection in another namespace and explain where mesh policies stop applying.",
    ],
    tip: "A Service Mesh does not fix bad code or a slow dependency. It standardizes network behavior and provides better signals to locate the problem.",
    takeaway:
      "Istio separates communication from business logic: Envoy enforces policies in the Data Plane and Istiod coordinates configuration and identity in the Control Plane.",
    outro:
      "The mesh is built and each unit receives strategy. Now we can split traffic between versions without changing a line of service code.",
  },
  {
    id: "sw11",
    num: "11",
    navTitle: "Traffic in Istio",
    tag: "canary with precise control",
    title: "VirtualService, DestinationRule, and gradual delivery",
    narration:
      "A new version ready for the track does not deserve one hundred percent of traffic immediately. It starts with controlled laps, telemetry comparison, and promotion only after the pace holds.",
    lead: "Gradual delivery requires distinct versions and control over who receives each call. In Istio, DestinationRule names subsets and policies; VirtualService decides weights, headers, paths, retries, timeouts, and simulated failures.",
    concept: [
      "Weighted canary sends a small share to the new version. A/B testing uses request traits such as a header to segment users. Traffic mirroring copies requests to the new version but discards its response.",
      "Retries help transient failures but multiply load when left unbounded. Timeouts define how long a caller accepts waiting. Circuit breaking ejects unhealthy endpoints and limits cascading failures.",
      "Changes must be judged by error rate, latency, and business metrics. Weight is a delivery mechanism, not an automatic success criterion.",
    ],
    pointsTitle: "Three ways to test a version",
    points: [
      { t: "Canary", d: "Splits real traffic by weight and expands gradually.", color: "signal" },
      {
        t: "A/B",
        d: "Selects groups by header, cookie, or another HTTP condition.",
        color: "blue",
      },
      {
        t: "Mirroring",
        d: "Copies real load to the new version without using its response.",
        color: "ember",
      },
    ],
    examplesTitle: "Ninety percent v1, ten percent v2",
    examples: [
      {
        label: "canary.yaml",
        lang: "yaml",
        code: "apiVersion: networking.istio.io/v1\nkind: DestinationRule\nmetadata:\n  name: api\nspec:\n  host: api\n  subsets:\n    - name: v1\n      labels: { version: v1 }\n    - name: v2\n      labels: { version: v2 }\n---\napiVersion: networking.istio.io/v1\nkind: VirtualService\nmetadata:\n  name: api\nspec:\n  hosts: [api]\n  http:\n    - route:\n        - destination: { host: api, subset: v1 }\n          weight: 90\n        - destination: { host: api, subset: v2 }\n          weight: 10\n      timeout: 2s\n      retries:\n        attempts: 2\n        perTryTimeout: 500ms",
        note: "Weights in one route must total 100. Make sure Pod labels match the subsets.",
      },
    ],
    commands: [
      { cmd: "kubectl apply -f canary.yaml", note: "publishes subsets and split" },
      { cmd: "istioctl analyze", note: "finds invalid configuration" },
      {
        cmd: "for i in $(seq 1 100); do curl -s http://api/version; done | sort | uniq -c",
        note: "measures the ratio",
      },
      { cmd: "kubectl get virtualservice,destinationrule", note: "checks resources" },
    ],
    handsOn: [
      "Deploy v1 and v2 with distinct labels and confirm the Service selects both.",
      "Apply a 90/10 split and count one hundred responses by version.",
      "Create a header rule sending one test user to v2 every time.",
      "Mirror traffic to v2 and confirm in logs that it arrived while the client still received v1.",
    ],
    tip: "If all traffic lands on one version, check labels, the Service host, and match rule order first.",
    takeaway:
      "DestinationRule defines the available groups; VirtualService decides how each call travels across them. Together they make gradual delivery observable and reversible.",
    outro:
      "The new version has completed controlled laps. Next, the same mesh authenticates services and turns every hop into readable telemetry.",
  },
  {
    id: "sw12",
    num: "12",
    navTitle: "mTLS and observability",
    tag: "identity + telemetry",
    title: "Security and observability inside the mesh",
    narration:
      "Hearing a voice on the radio is not enough. The team must know who is speaking, what that identity may request, and which route the message took. Security and telemetry share this lap.",
    lead: "An internal network is not automatically trusted. Istio can authenticate workloads with short-lived certificates, encrypt traffic with mTLS, and authorize calls by identity. The same proxies emit consistent metrics, logs, and traces.",
    concept: [
      "PeerAuthentication controls mTLS. PERMISSIVE helps migration; STRICT rejects traffic without a mesh identity. AuthorizationPolicy answers what an authenticated identity may do.",
      "Envoy records volume, response codes, and duration. Prometheus stores metrics; Grafana presents dashboards; Jaeger rebuilds traces; Kiali shows topology, errors, and mTLS state.",
      "The proxy creates and reads tracing headers, but the application must propagate them on downstream calls. Without propagation, the trace breaks even when every sidecar is healthy.",
    ],
    pointsTitle: "Authenticate, authorize, and explain",
    points: [
      {
        t: "mTLS",
        d: "Client and server present identities and encrypt the hop.",
        color: "signal",
      },
      {
        t: "AuthorizationPolicy",
        d: "Allows only the required source, method, and path.",
        color: "ember",
      },
      {
        t: "Distributed tracing",
        d: "Connects spans across services to reveal where latency began.",
        color: "blue",
      },
    ],
    examplesTitle: "Strict mTLS by namespace",
    examples: [
      {
        label: "security.yaml",
        lang: "yaml",
        code: "apiVersion: security.istio.io/v1\nkind: PeerAuthentication\nmetadata:\n  name: strict-default\n  namespace: demo\nspec:\n  mtls:\n    mode: STRICT\n---\napiVersion: security.istio.io/v1\nkind: AuthorizationPolicy\nmetadata:\n  name: api-read\n  namespace: demo\nspec:\n  selector:\n    matchLabels:\n      app: api\n  action: ALLOW\n  rules:\n    - from:\n        - source:\n            principals: [cluster.local/ns/demo/sa/web]\n      to:\n        - operation:\n            methods: [GET]\n            paths: [/api/*]",
        note: "STRICT without tested policies and identities can block production. Migrate, observe, and restrict in stages.",
      },
    ],
    commands: [
      {
        cmd: "istioctl proxy-config secret deploy/api -n demo",
        note: "checks active certificates in the proxy",
      },
      { cmd: "kubectl get peerauthentication,authorizationpolicy -A", note: "lists policies" },
      { cmd: "istioctl dashboard kiali", note: "opens the mesh graph" },
      { cmd: "istioctl dashboard jaeger", note: "inspects traces" },
    ],
    handsOn: [
      "Enable PERMISSIVE mTLS and confirm which workloads already use the mesh.",
      "Move a lab namespace to STRICT and test one authorized call and one from outside the mesh.",
      "Create an AuthorizationPolicy allowing only GET from a known ServiceAccount.",
      "Generate traffic, open one trace, and identify which service consumed the most time.",
    ],
    tip: "Authentication answers who you are; authorization answers what you may do. Do not use mTLS as a replacement for access policy.",
    takeaway:
      "The mesh makes identity and telemetry properties of every hop: mTLS authenticates, AuthorizationPolicy restricts, and observability explains the route.",
    outro:
      "The internal radio now has identity and replay. The operation itself must still survive when a whole component leaves its operating window.",
  },
  {
    id: "sw13",
    num: "13",
    navTitle: "High availability",
    tag: "tested redundancy",
    title: "SLA, SLO, SPOF, and high-availability architecture",
    narration:
      "A long race is not won by betting that nothing breaks. The team removes single points, prepares redundant systems, and tests the plan before failure chooses the worst moment.",
    lead: "High availability reduces downtime from local failures. It starts with a measurable target, identifies components whose loss takes everything down, and chooses redundancy that matches cost and application state.",
    concept: [
      "An SLA is the external promise, potentially tied to penalties. An SLO is engineering's internal target. A SPOF is any server, balancer, link, or location whose failure stops the whole service.",
      "Active-passive keeps a standby instance and needs failover. Active-active uses every node and redistributes load, but requires stateless applications or correct synchronization. Keepalived and VRRP can move a virtual IP between balancers.",
      "Health checks must test the real function, not just the process. Chaos Engineering states a hypothesis, injects a controlled failure, and measures the response. Disaster Recovery covers wider events and uses RTO for recovery time and RPO for acceptable data loss.",
    ],
    pointsTitle: "Promise, design, and proof",
    points: [
      {
        t: "SLA and SLO",
        d: "Turn reliability into an external commitment and a measurable internal target.",
        color: "blue",
      },
      { t: "SPOF", d: "Reveals where one failure can still end the race.", color: "ember" },
      {
        t: "Resilience test",
        d: "Proves failover and recovery before the real incident.",
        color: "signal",
      },
    ],
    examplesTitle: "Keepalived protecting the balancer",
    examples: [
      {
        label: "keepalived.conf",
        lang: "yaml",
        code: "vrrp_instance PITSTOP {\n    state BACKUP\n    interface eth0\n    virtual_router_id 51\n    priority 100\n    advert_int 1\n    virtual_ipaddress {\n        10.0.0.50/24\n    }\n    track_script {\n        check_nginx\n    }\n}",
        note: "Both nodes share virtual_router_id and VIP but use different priorities. The script should test a useful Nginx function, not just process existence.",
      },
    ],
    commands: [
      { cmd: "ip addr show | grep 10.0.0.50", note: "finds which node owns the VIP" },
      { cmd: "systemctl status keepalived nginx", note: "checks both services" },
      { cmd: "systemctl stop nginx", note: "injects a controlled failure" },
      { cmd: "watch -n 1 'ip addr show | grep 10.0.0.50'", note: "follows failover" },
    ],
    handsOn: [
      "Draw the full path of one request and mark every component without redundancy.",
      "Define a simple availability SLO and calculate the allowed monthly downtime.",
      "In a two-node lab, stop the primary Nginx and measure how long the VIP takes to move.",
      "Write a Chaos Engineering hypothesis and clear conditions for aborting the experiment.",
    ],
    tip: "Untested redundancy is expensive hope. Measure failover, lost requests, and recovery time.",
    takeaway:
      "HA combines a measurable target, SPOF removal, redundancy, and tests. DR complements it when failure exceeds a server or local zone.",
    outro:
      "The operation survived the rehearsed failure. Final stage: keep the system available without making it available to attackers.",
  },
  {
    id: "sw14",
    num: "14",
    navTitle: "WAF and protection",
    tag: "security at the gate",
    title: "WAF, ModSecurity, rate limiting, and layered defense",
    narration:
      "Final lap. The gate must remain fast for legitimate visitors and ruthless with malicious load. Good security does not close the track; it recognizes the attack without stopping the race.",
    lead: "L3 and L4 firewalls block networks and ports, but cannot understand a SQL Injection payload inside HTTP. A Web Application Firewall inspects the application layer. ModSecurity provides the engine; OWASP Core Rule Set supplies a community-maintained rule baseline.",
    concept: [
      "The WAF intercepts requests, evaluates rules, and accumulates an anomaly score. It may only log or actively block. Starting in detection mode lets you tune false positives before disrupting legitimate users.",
      "TLS 1.2 or 1.3, HSTS, and secure headers protect the channel and browser. Rate limiting caps requests per key and helps against brute force and abuse, but does not replace distributed DDoS protection.",
      "Nginx and ModSecurity logs should reach a central platform, with alerts for spikes in blocks, 5xx responses, and latency. Security depends on review, CRS updates, and repeatable tests.",
    ],
    pointsTitle: "Layered defense at the edge",
    points: [
      {
        t: "ModSecurity + CRS",
        d: "Inspects HTTP content with known-attack rules and anomaly scoring.",
        color: "ember",
      },
      {
        t: "Rate limiting",
        d: "Controls abuse by IP, token, or another key without changing the application.",
        color: "signal",
      },
      {
        t: "Logs and alerts",
        d: "Turn blocks into evidence for tuning rules and responding to incidents.",
        color: "blue",
      },
    ],
    examplesTitle: "Protecting the login endpoint",
    examples: [
      {
        label: "nginx.conf",
        lang: "yaml",
        code: "limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;\n\nserver {\n    listen 443 ssl;\n    add_header Strict-Transport-Security max-age=31536000 always;\n\n    location = /login {\n        limit_req zone=login burst=3 nodelay;\n        proxy_pass http://pitstop_api;\n    }\n}",
        note: "Test limits in a controlled environment and choose an appropriate key. IP can group many users behind NAT.",
      },
      {
        label: "validation",
        lang: "sh",
        code: "$ curl -i http://localhost/login?user=admin%27%20OR%20%271%27=%271\nHTTP/1.1 403 Forbidden\n\n$ for i in $(seq 1 10); do curl -s -o /dev/null -w '%{http_code}\n' https://localhost/login; done\n200\n200\n429",
        note: "403 represents a WAF rule block; 429 represents rate limiting. The exact result depends on the installed CRS and Nginx configuration.",
      },
    ],
    commands: [
      { cmd: "nginx -t", note: "validates syntax before reload" },
      { cmd: "curl -I https://localhost", note: "checks TLS and HSTS" },
      { cmd: "tail -f /var/log/modsec_audit.log", note: "follows triggered rules" },
      {
        cmd: "tail -f /var/log/nginx/access.log /var/log/nginx/error.log",
        note: "correlates response and cause",
      },
    ],
    handsOn: [
      "Run Nginx with ModSecurity and OWASP CRS in detection mode. Send normal requests and lab attack payloads.",
      "Read the audit log, identify the triggered rule, and only then enable blocking.",
      "Apply rate limiting to /login and confirm 429 responses after the threshold.",
      "Build a checklist covering TLS, HSTS, CRS updates, log retention, and alerts for block spikes.",
    ],
    tip: "A WAF does not fix a code vulnerability. It reduces exposure and buys time; the permanent fix still belongs in the application.",
    takeaway:
      "A secure edge combines encryption, L7 inspection, rate control, logs, and operational response. Availability only matters when legitimate access remains trustworthy.",
    outro:
      "Chequered flag! You started with one web server and reached a distributed, observable, resilient, protected edge. Full debrief, fourteen sectors green.",
  },
];
