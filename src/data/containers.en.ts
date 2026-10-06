// Content from the six Containers and Docker lessons, organized into 13 stages.

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

export type Mapping = { docker: string; f1: string };

export const DE_PARA: Mapping[] = [
  { docker: "Host and kernel", f1: "The circuit's shared operational infrastructure" },
  { docker: "Virtual machine", f1: "A complete, independent facility" },
  { docker: "Namespace", f1: "Partitions that limit what each garage can see" },
  { docker: "Cgroup", f1: "Control that measures and limits each operation's resources" },
  { docker: "Image", f1: "A repeatable specification used to build a car" },
  { docker: "Container", f1: "A running instance assembled from the specification" },
  { docker: "Registry", f1: "The central archive of versioned specifications" },
  { docker: "Dockerfile", f1: "The versioned assembly sequence sheet" },
  { docker: "Layer and cache", f1: "A validated package that can be reused" },
  { docker: "Multistage build", f1: "Full factory assembly, with only the track kit shipped" },
  { docker: "Volume", f1: "A persistent vault outside the car's lifecycle" },
  { docker: "Bind mount", f1: "Direct access to a specific host workbench" },
  { docker: "tmpfs", f1: "A temporary garage board held in memory" },
  { docker: "Custom network", f1: "The team's private communication channel" },
  { docker: "Internal DNS", f1: "A stable call sign even when the address changes" },
  { docker: "Port publishing", f1: "Controlled external access to an internal service" },
  { docker: "Docker Compose", f1: "The complete race weekend operations plan" },
  { docker: "Healthcheck", f1: "An active check that the system can do its job" },
  { docker: "Non-root user", f1: "Credentials limited to the required task" },
  { docker: "Secret", f1: "Credentials delivered through a separate channel" },
  { docker: "Logs and events", f1: "Radio, telemetry, and the operation timeline" },
];

export const ANALOGY_NOTES: string[] = [
  "A physical car does not share a kernel. The analogy explains organization, not the isolation mechanism implemented by Linux.",
  "An F1 team normally fields two cars, while services can have dozens of independent replicas.",
  "DNS only resolves names to addresses. It does not transmit, authenticate, or encrypt communication.",
  "Local Compose organizes secret files, but it does not turn the source into an encrypted vault.",
];

export const LESSONS: Lesson[] = [
  {
    id: "ct1",
    num: "01",
    navTitle: "Why containers",
    tag: "foundations",
    title: "Why containers exist",
    narration:
      "The installation lap begins. Before chasing time, we need to understand why carrying a full operating system for every application can be too much weight.",
    lead: "Containers make environments repeatable and isolate processes with less overhead than a complete virtual machine.",
    concept: [
      "A container is a set of processes isolated at the operating-system level. Namespaces control what those processes can see; cgroups measure and limit CPU, memory, and input or output.",
      "A container shares the host kernel, so it usually starts quickly and takes less space. That sharing also means it is neither a small VM nor an absolute security boundary.",
    ],
    pointsTitle: "This stage's dashboard",
    points: [
      {
        t: "Namespaces",
        d: "Isolate processes, networking, mounts, hostnames, and users.",
        color: "blue",
      },
      {
        t: "Cgroups",
        d: "Measure and limit the resources consumed by a workload.",
        color: "signal",
      },
      {
        t: "Shared kernel",
        d: "Reduces weight and startup time, with isolation different from a VM.",
        color: "ember",
      },
    ],
    examplesTitle: "First container",
    examples: [
      {
        label: "hello-world",
        lang: "sh",
        code: `# Creates and runs the image process
$ docker run --name primeiro-container hello-world
$ docker ps --all
$ docker inspect --format '{{.State.Status}} {{.State.ExitCode}}' primeiro-container
exited 0`,
        note: "Exited (0) means the main process completed successfully.",
      },
    ],
    commands: [
      {
        cmd: "docker run --name fundamentos hello-world",
        note: "creates and starts the container",
      },
      { cmd: "docker ps --all", note: "lists running and stopped containers" },
      { cmd: "docker rm fundamentos", note: "removes the stopped instance" },
    ],
    handsOnIntro: "Prove that the lab is alive and observe the process's complete lifecycle.",
    handsOn: [
      "Run hello-world with the name fundamentos.",
      "Compare docker ps with docker ps --all.",
      "Inspect State.Status and State.ExitCode.",
      "Confirm exited 0 and remove the container.",
    ],
    tip: "A container stays active only while its main process is running.",
    takeaway: "A container is a kernel-isolated and limited process, not a small virtual machine.",
    outro:
      "Foundations are green. Now we will separate the car specification from the instance that takes the track.",
  },
  {
    id: "ct2",
    num: "02",
    navTitle: "Image and lifecycle",
    tag: "image + runtime",
    title: "Image, container, and lifecycle",
    narration:
      "Images and containers need separate columns on the timing screen. Confusing the recipe with its execution costs reproducibility.",
    lead: "The image is the immutable, versioned artifact; the container adds a writable layer and runs the configured command.",
    concept: [
      "The same image can create several independent instances. Pull downloads, run creates and starts, stop requests shutdown, start resumes the same instance, rm removes the container, and rmi removes an unused image.",
      "Tags such as node:20-alpine identify variants, but they can move. Avoid latest when reproducibility matters and use a digest when content immutability is required.",
    ],
    pointsTitle: "The lifecycle",
    points: [
      { t: "Image", d: "A filesystem and metadata stored in reusable layers.", color: "blue" },
      {
        t: "Container",
        d: "An independent execution with a temporary writable layer.",
        color: "signal",
      },
      {
        t: "Registry",
        d: "Distributes public or private images with access control.",
        color: "violet",
      },
    ],
    examplesTitle: "Running Nginx",
    examples: [
      {
        label: "complete lifecycle",
        lang: "sh",
        code: `$ docker pull nginx:alpine
$ docker run --detach --name pagina --publish 8080:80 nginx:alpine
$ curl --head http://localhost:8080
HTTP/1.1 200 OK
$ docker logs pagina
$ docker stop pagina
$ docker rm pagina`,
        note: "EXPOSE documents a port; --publish creates host forwarding.",
      },
    ],
    commands: [
      { cmd: "docker pull nginx:alpine", note: "downloads an explicit variant" },
      { cmd: "docker start ciclo", note: "resumes the same stopped container" },
      { cmd: "docker rm --force ciclo", note: "stops and removes a disposable instance" },
    ],
    handsOnIntro: "Start, stop, and resume the same instance to see the complete lifecycle.",
    handsOn: [
      "Start nginx:alpine on port 8080 with the name ciclo.",
      "Confirm the HTTP response and stop the container.",
      "Verify the connection fails, then run docker start ciclo.",
      "Confirm service recovery and remove the instance after checking the target.",
    ],
    tip: "Use explicit tags and keep registry credentials out of shell history.",
    takeaway: "An image is the reproducible artifact; a container is a disposable execution of it.",
    outro:
      "The distinction is clear. At the next corner, the specification gains a versioned recipe.",
  },
  {
    id: "ct3",
    num: "03",
    navTitle: "Dockerfile",
    tag: "repeatable build",
    title: "Dockerfile as a repeatable recipe",
    narration:
      "We enter the section where procedure beats improvisation. Workshop knowledge needs to become a repeatable process.",
    lead: "A Dockerfile records every decision required to rebuild an image without relying on someone's memory.",
    concept: [
      "FROM selects the base, WORKDIR sets the directory, COPY brings in build-context files, RUN executes during construction, and CMD defines the default runtime process.",
      "RUN happens during the build and records a layer. CMD runs when the container starts. EXPOSE only documents the port and does not publish it on the host.",
    ],
    pointsTitle: "Essential instructions",
    points: [
      { t: "Build", d: "FROM, COPY, and RUN form the versioned artifact.", color: "blue" },
      {
        t: "Runtime",
        d: "CMD defines the main process started by the container.",
        color: "signal",
      },
      {
        t: "Context",
        d: "The final dot in docker build defines which files can enter.",
        color: "ember",
      },
    ],
    examplesTitle: "Minimal API",
    examples: [
      {
        label: "Dockerfile",
        lang: "sh",
        code: `FROM node:20-alpine
WORKDIR /app
COPY server.js ./server.js
EXPOSE 3000
CMD ["node", "server.js"]

$ docker build --tag minha-api:1.0 .
$ docker run --rm --publish 3000:3000 minha-api:1.0`,
        note: "The exec form of CMD lets the process receive signals directly.",
      },
    ],
    commands: [
      {
        cmd: "docker build --tag minha-api:1.0 .",
        note: "builds the image from the current directory",
      },
      {
        cmd: "docker run --rm --publish 3000:3000 minha-api:1.0",
        note: "runs and publishes the API",
      },
      { cmd: "docker images minha-api", note: "compares the built tags" },
    ],
    handsOnIntro: "Build two revisions and prove that each tag identifies a distinct image.",
    handsOn: [
      "Create a simple HTTP server.js and the example Dockerfile.",
      "Build and test the minha-api:1.0 tag.",
      "Change the response and rebuild it as minha-api:1.1.",
      "List the images and confirm both revisions.",
    ],
    tip: "Prefer explicitly versioned base images and copy only what is required.",
    takeaway: "A Dockerfile turns manual decisions into a repeatable, versioned build.",
    outro:
      "The recipe is recorded. Next we cut build time and image weight without removing a required part.",
  },
  {
    id: "ct4",
    num: "04",
    navTitle: "Layers and cache",
    tag: "optimization",
    title: "Layers, cache, and multistage builds",
    narration:
      "Every Dockerfile instruction changes cache behavior, and every tool shipped to runtime must justify its weight.",
    lead: "Order layers by change frequency and separate the build environment from the final runtime image.",
    concept: [
      "Docker reuses a layer while its instruction and inputs remain unchanged. Copying manifests and installing dependencies before source code preserves cache reuse.",
      "A multistage build uses a tool-rich stage to compile and a smaller final stage to run. Slim, Alpine, and distroless trade size against compatibility and diagnostics.",
    ],
    pointsTitle: "Where time is won",
    points: [
      { t: "Order", d: "Place stable inputs before frequently changing ones.", color: "blue" },
      {
        t: "Multistage",
        d: "Copy only the artifact and its real dependencies into runtime.",
        color: "signal",
      },
      {
        t: "Minimal base",
        d: "Smaller is better only while it remains compatible and operable.",
        color: "ember",
      },
    ],
    examplesTitle: "Build separated from runtime",
    examples: [
      {
        label: "multistage",
        lang: "sh",
        code: `FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-slim AS runtime
WORKDIR /app
COPY --from=build /app/dist ./dist
USER node
CMD ["node", "dist/index.js"]`,
        note: "If dist imports packages, also copy or install production dependencies.",
      },
    ],
    commands: [
      { cmd: "docker build --tag minha-app:otimizada .", note: "builds and reports cache use" },
      { cmd: "docker history minha-app:otimizada", note: "displays image layers" },
      { cmd: "docker images minha-app:otimizada", note: "shows final size" },
    ],
    handsOnIntro: "Run two builds and follow which stages remain cached.",
    handsOn: [
      "Create a project with a lockfile, build script, and multistage Dockerfile.",
      "Run the build twice and find CACHED in the second run.",
      "Change only source code and rebuild.",
      "Confirm npm ci stayed cached and test the final image.",
    ],
    tip: "Do not remove tools or libraries the runtime truly needs just to save megabytes.",
    takeaway: "Order layers by change frequency and keep build tools out of runtime.",
    outro:
      "The image is more efficient and the sector is clean. Now data must survive outside the instance.",
  },
  {
    id: "ct5",
    num: "05",
    navTitle: "Persistence",
    tag: "volumes + mounts",
    title: "Persistence with volumes, bind mounts, and tmpfs",
    narration:
      "Replacing an instance without losing what matters requires separating disposable state from persistent data.",
    lead: "The writable layer follows the container; volumes live outside that lifecycle and can be attached to the next instance.",
    concept: [
      "Named volumes are managed by Docker. Bind mounts expose a host path. tmpfs keeps temporary data in memory.",
      "The local driver persists on the current host. Cross-host storage requires NFS or an integration that accounts for networking, permissions, backup, and consistency.",
    ],
    pointsTitle: "Choosing a mount",
    points: [
      { t: "Volume", d: "Managed persistence kept separate from the container.", color: "blue" },
      { t: "Bind mount", d: "Direct access to host files and directories.", color: "signal" },
      { t: "tmpfs", d: "Ephemeral in-memory data, erased when execution ends.", color: "violet" },
    ],
    examplesTitle: "Data that survives",
    examples: [
      {
        label: "named volume",
        lang: "sh",
        code: `$ docker volume create dados-demo
$ docker run --rm --volume dados-demo:/dados alpine sh -c 'echo persistiu > /dados/mensagem.txt'
$ docker run --rm --volume dados-demo:/dados:ro alpine cat /dados/mensagem.txt
persistiu
$ docker volume inspect dados-demo`,
        note: "The :ro suffix prevents the second container from writing.",
      },
    ],
    commands: [
      { cmd: "docker volume create dados-demo", note: "creates the persistent resource" },
      { cmd: "docker volume inspect dados-demo", note: "queries its metadata" },
      { cmd: "docker volume rm dados-demo", note: "permanently deletes the confirmed volume" },
    ],
    handsOnIntro:
      "Write the data, dismantle the instance, and read the file from another container.",
    handsOn: [
      "Create dados-demo and write mensagem.txt.",
      "Confirm the first container no longer exists.",
      "Read the file through a read-only mount.",
      "Compare it with tmpfs and remove only the lab volume.",
    ],
    tip: "Use Docker commands to manage volumes and back up data before any removal.",
    takeaway: "Data that must survive cannot depend on the container's writable layer.",
    outro:
      "The stop is complete without leaving data behind. The next sector requires predictable communication.",
  },
  {
    id: "ct6",
    num: "06",
    navTitle: "Networks and DNS",
    tag: "connectivity",
    title: "Networks, internal DNS, and port publishing",
    narration:
      "Services need stable identities for finding each other and should expose only what is required.",
    lead: "A user-created bridge provides internal DNS by name; port publishing opens a controlled path through the host.",
    concept: [
      "Bridge connects containers on one host, host shares the system stack, none disables networking, and overlay links multiple orchestrated hosts.",
      "On a custom network, names resolve automatically. EXPOSE documents a port; --publish forwards a host port to the container.",
    ],
    pointsTitle: "Communication boundaries",
    points: [
      {
        t: "Internal DNS",
        d: "Use stable names instead of IP addresses that change.",
        color: "blue",
      },
      {
        t: "Custom network",
        d: "Defines who belongs to the same communication domain.",
        color: "signal",
      },
      {
        t: "Published port",
        d: "Exposes only the service that needs external access.",
        color: "ember",
      },
    ],
    examplesTitle: "Discovery by name",
    examples: [
      {
        label: "private bridge",
        lang: "sh",
        code: `$ docker network create rede-demo
$ docker run --detach --name web --network rede-demo nginx:alpine
$ docker run --rm --network rede-demo curlimages/curl --silent --head http://web
HTTP/1.1 200 OK
$ docker network inspect rede-demo`,
        note: "Internal communication does not require a published port.",
      },
    ],
    commands: [
      { cmd: "docker network create rede-demo", note: "creates a bridge with internal DNS" },
      { cmd: "docker network connect rede-demo cliente", note: "attaches an existing container" },
      { cmd: "docker network inspect rede-demo", note: "lists connections and addresses" },
    ],
    handsOnIntro: "Make the same request from inside and outside the network.",
    handsOn: [
      "Confirm HTTP 200 from inside rede-demo.",
      "Repeat without connecting the client and observe the failure.",
      "Attach an existing client and query web by name.",
      "Inspect and remove the disposable resources.",
    ],
    tip: "Do not publish a database or internal service just to simplify container discovery.",
    takeaway: "Use names on the same custom network; publish only ports the host must access.",
    outro:
      "The internal channel is confirmed. Now the complete operation will become a repeatable plan.",
  },
  {
    id: "ct7",
    num: "07",
    navTitle: "Docker Compose",
    tag: "multi-container",
    title: "Docker Compose for multi-container applications",
    narration:
      "Services, networks, volumes, and configuration become part of one versioned operations plan.",
    lead: "Compose replaces fragile commands with a YAML definition that the whole team can review.",
    concept: [
      "services describes containers; build or image defines their source; ports, volumes, networks, environment, and secrets complete the application.",
      "A simple depends_on orders creation but does not prove readiness. The application must still tolerate transient failures.",
    ],
    pointsTitle: "The operations plan",
    points: [
      { t: "Services", d: "Each role receives its own image and configuration.", color: "blue" },
      {
        t: "Resources",
        d: "Networks and volumes are declared with the application.",
        color: "signal",
      },
      { t: "Validation", d: "compose config checks the YAML before lights out.", color: "violet" },
    ],
    examplesTitle: "Web and database",
    examples: [
      {
        label: "compose.yaml",
        lang: "yaml",
        code: `services:
  web:
    build: .
    ports: ["3000:3000"]
    environment:
      DB_HOST: db
    depends_on: [db]
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: exemplo-local
    volumes: [dados_db:/var/lib/postgresql/data]
volumes:
  dados_db:`,
        note: "Do not keep the password directly in production YAML.",
      },
    ],
    commands: [
      { cmd: "docker compose config", note: "validates the consolidated configuration" },
      { cmd: "docker compose up --detach --build", note: "builds and starts the services" },
      {
        cmd: "docker compose down",
        note: "removes containers and networks while preserving volumes",
      },
    ],
    handsOnIntro: "Validate first, start second, and observe the stack.",
    handsOn: [
      "Save the YAML beside a working Dockerfile.",
      "Run docker compose config.",
      "Start the stack and inspect ps and database logs.",
      "Finish without --volumes to preserve the data.",
    ],
    tip: "Use docker compose logs --follow to correlate related services.",
    takeaway: "Compose turns loose commands into a versioned application definition.",
    outro: "The team now works from a shared plan. The next sector covers variation and recovery.",
  },
  {
    id: "ct8",
    num: "08",
    navTitle: "Environments and CI",
    tag: "operations",
    title: "Environments, restarts, scaling, and CI",
    narration:
      "Configuration must adapt to practice, testing, and production without duplicating the original plan.",
    lead: "Additional files change only what varies; restart and health policies define responses to failure.",
    concept: [
      "Compose combines files in -f order. Use config to inspect the result. no, on-failure, always, and unless-stopped control restarts.",
      "Restarting does not guarantee readiness. Scaling creates instances, but a fixed host port cannot be occupied by several replicas.",
    ],
    pointsTitle: "Controlled variation",
    points: [
      {
        t: "Overrides",
        d: "Change images, ports, or variables without copying everything.",
        color: "blue",
      },
      { t: "Restart", d: "Recovers the process but does not test its function.", color: "signal" },
      {
        t: "CI",
        d: "Starts dependencies, waits for health, tests, and tears down.",
        color: "violet",
      },
    ],
    examplesTitle: "Base and production",
    examples: [
      {
        label: "compose.yaml",
        lang: "yaml",
        code: `services:
  web:
    image: nginx:alpine
    restart: on-failure:3
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--spider", "http://localhost"]
      interval: 5s
      timeout: 2s
      retries: 5`,
        note: "A second file can replace only the image and labels.",
      },
    ],
    commands: [
      {
        cmd: "docker compose -f compose.yaml -f compose.prod.yaml config",
        note: "shows the final merge",
      },
      {
        cmd: "docker compose -f compose.yaml -f compose.prod.yaml up --detach --wait",
        note: "waits for health",
      },
      { cmd: "docker compose exec web nginx -t", note: "validates the service" },
    ],
    handsOnIntro: "Compare the base with the combined configuration.",
    handsOn: [
      "Create the base and production files.",
      "Compare the docker compose config results.",
      "Start the combination and wait for healthy.",
      "Validate Nginx and tear down.",
    ],
    tip: "If --wait is unavailable, follow compose ps until healthy; Up does not prove readiness.",
    takeaway: "Overrides control environments; restart does not replace health checks.",
    outro: "Strategy changed without duplicating the plan. Now we enter stack protection.",
  },
  {
    id: "ct9",
    num: "09",
    navTitle: "Security",
    tag: "least privilege",
    title: "Layered security",
    narration:
      "Every removed permission reduces an attacker's options, but no single layer guarantees protection.",
    lead: "Users, capabilities, seccomp, filesystems, images, and mounts must work together.",
    concept: [
      "Namespaces isolate visibility, capabilities split privileges, seccomp filters system calls, and a non-root user reduces impact.",
      "UID 0 increases risk with mounts or extra capabilities. Do not mount docker.sock in ordinary applications.",
    ],
    pointsTitle: "Overlapping barriers",
    points: [
      { t: "Identity", d: "Run with an unprivileged UID.", color: "blue" },
      {
        t: "Capabilities",
        d: "Drop everything and return only what is required.",
        color: "signal",
      },
      { t: "Filesystem", d: "Use a read-only root and temporary tmpfs.", color: "ember" },
    ],
    examplesTitle: "Reduced runtime",
    examples: [
      {
        label: "least privilege",
        lang: "sh",
        code: `$ docker run --rm --user node --cap-drop ALL --read-only --tmpfs /tmp node:20-alpine sh -c 'touch /bloqueado 2>/dev/null || echo "raiz bloqueada"; echo ok > /tmp/teste; cat /tmp/teste'
raiz bloqueada
ok`,
        note: "tmpfs provides ephemeral writes without opening the entire root filesystem.",
      },
    ],
    commands: [
      { cmd: "docker run --rm node:20-alpine id", note: "observes the default user" },
      { cmd: "docker run --rm --user node node:20-alpine id", note: "confirms the limited UID" },
      { cmd: "docker inspect CONTAINER", note: "reviews effective configuration" },
    ],
    handsOnIntro: "Reduce privileges and confirm that the write failures are intentional.",
    handsOn: [
      "Compare the default identity with the node user.",
      "Run with a read-only root and tmpfs.",
      "Confirm the root block and the write to /tmp.",
      "Remove tmpfs and observe the new block.",
    ],
    tip: "Avoid chmod 777, privileged mode, and mounting the Engine socket.",
    takeaway: "Container security depends on small, combined controls.",
    outro: "Privileges are reduced. We still need to keep unwanted material out of the build.",
  },
  {
    id: "ct10",
    num: "10",
    navTitle: "Context and secrets",
    tag: "supply chain",
    title: "Build context, secrets, and image analysis",
    narration:
      "Everything in the context affects time, cache, size, and exposure. Screening happens before the build.",
    lead: ".dockerignore reduces what is sent to the builder and keeps local files or credentials out of image layers.",
    concept: [
      "Deleting a secret in a later instruction does not remove it from an earlier layer. env_file does not create a secret, and ARG is only for non-confidential parameters.",
      "Compose can mount a secret as a file, but its source still needs protection. Dive and Snyk help review weight and vulnerabilities.",
    ],
    pointsTitle: "Inspection before the track",
    points: [
      {
        t: ".dockerignore",
        d: "Excludes local dependencies, Git, logs, and environment files.",
        color: "blue",
      },
      {
        t: "ARG",
        d: "A visible parameter suitable for a version, never a password.",
        color: "signal",
      },
      {
        t: "Secret",
        d: "Mounted through its own channel, with the source kept out of Git.",
        color: "violet",
      },
    ],
    examplesTitle: "Minimal context",
    examples: [
      {
        label: ".dockerignore and analysis",
        lang: "sh",
        code: `# .dockerignore
node_modules
.env
.env.*
.git
*.log
coverage
dist

$ docker build --progress plain --tag minha-app:analise .
$ docker history minha-app:analise
$ docker images minha-app:analise`,
        note: "Compare transferring context before and after screening.",
      },
    ],
    commands: [
      {
        cmd: "docker build --progress plain --tag minha-app:analise .",
        note: "shows context and stages",
      },
      { cmd: "docker history minha-app:analise", note: "reveals commands and layer weight" },
      { cmd: "docker inspect minha-app:analise", note: "queries labels and configuration" },
    ],
    handsOnIntro: "Measure the context before and after .dockerignore.",
    handsOn: [
      "Run a detailed build and record the transferred size.",
      "Create .dockerignore and repeat.",
      "Compare context, cache, and the largest layers.",
      "If available, analyze the tag with Dive or Snyk.",
    ],
    tip: "Do not use ARG, ENV, or versioned files to transport tokens and passwords.",
    takeaway: "A secret that never enters the context cannot leak through a build layer.",
    outro: "Inspection is complete. If something fails, we need a reliable investigation sequence.",
  },
  {
    id: "ct11",
    num: "11",
    navTitle: "Troubleshooting",
    tag: "diagnostics",
    title: "Troubleshooting with an investigation order",
    narration: "Yellow flag. The right speed now is disciplined diagnosis before any guesswork.",
    lead: "Investigate state, logs, configuration, events, and resources in order, preserving evidence until the cause is clear.",
    concept: [
      "docker ps shows state; logs reads stdout and stderr; inspect reveals commands, mounts, networking, and exit code; events shows the timeline; top and stats show processes and consumption.",
      "docker exec tests from inside only while a container is running. Restarting without evidence can hide the symptom and does not identify the cause.",
    ],
    pointsTitle: "Diagnostic sequence",
    points: [
      { t: "State", d: "Find exit codes, restarts, and OOM before acting.", color: "blue" },
      {
        t: "Evidence",
        d: "Compare logs, configuration, and events with a hypothesis.",
        color: "signal",
      },
      {
        t: "Resources",
        d: "Observe processes, CPU, and memory without changing the workload.",
        color: "ember",
      },
    ],
    examplesTitle: "Controlled failure",
    examples: [
      {
        label: "exit code 42",
        lang: "sh",
        code: `$ docker run --name falha alpine sh -c 'echo "configuração ausente" >&2; exit 42'
$ docker inspect --format 'status={{.State.Status}} exit={{.State.ExitCode}} oom={{.State.OOMKilled}}' falha
status=exited exit=42 oom=false
$ docker logs falha
configuração ausente`,
        note: "The code and logs describe complementary parts of the incident.",
      },
    ],
    commands: [
      { cmd: "docker ps --all", note: "starts with observable state" },
      { cmd: "docker logs falha", note: "retrieves stdout and stderr" },
      { cmd: "docker events --filter type=container", note: "follows the timeline" },
    ],
    handsOnIntro: "Resist an automatic restart and test a hypothesis against the data.",
    handsOn: [
      "Trigger the example failure.",
      "Form a hypothesis from state and exit code.",
      "Check logs and the original command in inspect.",
      "Record the cause before removing the container.",
    ],
    tip: "Change one variable at a time and record state, hypothesis, test, and result.",
    takeaway: "Diagnosis starts with evidence; restarting is not investigation.",
    outro:
      "Cause before correction. Now we must distinguish a running process from a ready service.",
  },
  {
    id: "ct12",
    num: "12",
    navTitle: "Health and logs",
    tag: "observability",
    title: "Logs, healthchecks, and operational readiness",
    narration:
      "An engine running does not mean a car is ready. The service must prove it can do its job.",
    lead: "Process state signals presence; a healthcheck tests a functional condition, and logs explain behavior over time.",
    concept: [
      "A healthcheck classifies starting, healthy, or unhealthy, but does not repair the application. The test must represent the right function at controlled cost.",
      "Applications should write structured logs to stdout and stderr. Promtail or Fluentd can send events to Loki and Grafana.",
    ],
    pointsTitle: "Operational signals",
    points: [
      { t: "Process", d: "Up only says that the main process remains alive.", color: "blue" },
      {
        t: "Health",
        d: "The test confirms one specific function at that moment.",
        color: "signal",
      },
      {
        t: "Logs",
        d: "Timestamp, level, message, and service simplify correlation.",
        color: "violet",
      },
    ],
    examplesTitle: "Healthcheck in Compose",
    examples: [
      {
        label: "HTTP check",
        lang: "yaml",
        code: `services:
  api:
    image: minha-api:1.0
    healthcheck:
      test: ["CMD", "curl", "--fail", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 20s`,
        note: "Make sure curl exists, or use the application's own runtime.",
      },
    ],
    commands: [
      { cmd: "docker compose ps", note: "shows consolidated health state" },
      {
        cmd: "docker inspect --format '{{json .State.Health}}' CONTAINER",
        note: "shows check attempts",
      },
      { cmd: "docker compose logs api", note: "correlates health and behavior" },
    ],
    handsOnIntro: "Remove a dependency and follow the health transition.",
    handsOn: [
      "Start the capstone with --wait.",
      "Stop the database and follow the API to unhealthy.",
      "Inspect Health and correlate it with logs.",
      "Recover the database and wait for healthy.",
    ],
    tip: "A shallow endpoint can stay green while an important function is broken.",
    takeaway:
      "A running process asks whether it is alive; a healthcheck asks whether it can do its job.",
    outro: "Dashboard and telemetry tell complementary stories. Only the capstone remains.",
  },
  {
    id: "ct13",
    num: "13",
    navTitle: "Capstone",
    tag: "defensive stack",
    title: "Capstone: a small, defensive stack",
    narration:
      "Final lap. Build, networking, persistence, secrets, health, and evidence must cross the line as one system.",
    lead: "The stack combines a non-root Node API, persistent PostgreSQL, an internal network, a file secret, limits, logs, and healthchecks.",
    concept: [
      "The API resolves db through DNS and tests the PostgreSQL port. The database uses a volume, reads its password from a file, and releases the API after its healthcheck.",
      "A read-only root, tmpfs, cap_drop, limits, and labels reduce risk and improve inventory. Limits do not guarantee performance or exclusive capacity.",
    ],
    pointsTitle: "Final integration",
    points: [
      {
        t: "Build and identity",
        d: "Multistage build, minimal artifact, and the node user.",
        color: "blue",
      },
      { t: "Data and access", d: "A volume, file secret, and internal network.", color: "signal" },
      {
        t: "Operations",
        d: "Healthchecks, logs, labels, limits, and controlled restarts.",
        color: "violet",
      },
    ],
    examplesTitle: "Core stack",
    examples: [
      {
        label: "compose.yaml",
        lang: "yaml",
        code: `services:
  api:
    build: .
    ports: ["3000:3000"]
    environment:
      DB_HOST: db
    depends_on:
      db:
        condition: service_healthy
    cap_drop: [ALL]
    read_only: true
    tmpfs: [/tmp]
    networks: [interna]
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: app
      POSTGRES_DB: app
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password
    secrets: [db_password]
    volumes: [dados_db:/var/lib/postgresql/data]
    networks: [interna]
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app -d app"]
      interval: 5s
      timeout: 3s
      retries: 10
volumes:
  dados_db:
networks:
  interna:
secrets:
  db_password:
    file: ./secrets/db_password.txt`,
        note: "Add secrets to .dockerignore and keep the source out of Git.",
      },
    ],
    commands: [
      { cmd: "docker compose config --quiet", note: "validates before creating resources" },
      { cmd: "docker compose up --detach --build --wait", note: "builds and waits for health" },
      { cmd: "docker compose down", note: "stops while preserving the volume" },
    ],
    handsOnIntro: "Run the complete sequence and validate each mechanism.",
    handsOn: [
      "Create the API, Dockerfile, .dockerignore, Compose file, and local password.",
      "Validate, start with --wait, and query /health.",
      "Confirm health, JSON logs, and the node user.",
      "Stop without volumes, start again, and confirm dados_db remains.",
    ],
    tip: "Use down --volumes only when permanent loss of the data is intentional.",
    takeaway:
      "Maturity combines repeatable builds, least privilege, persistence, health, and evidence.",
    outro: "Checkered flag. The final time came from small, verifiable, coordinated decisions.",
  },
];
