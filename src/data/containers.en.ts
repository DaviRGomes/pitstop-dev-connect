// Conteúdo das aulas 1-6 do módulo de Containers e Docker, em 13 etapas.
// A lente geral de F1 abre o guia (LENS) e cada etapa ensina o tópico só de forma técnica,
// sem repetir a analogia.
// Gerado de relatorios/containers/final.en.md por scripts/build-lens-guide.py.
// Para mudar o texto, edite o markdown e gere de novo; o markdown inline (`código`, **negrito**)
// é renderizado pelo LensKit.

import type { ChecklistGroup, GuideLens, TechLesson } from "@/components/guide/LensKit";

export type Lesson = TechLesson;

export const INTRO: string[] = [
  "This guide teaches, in 13 stages, the path an application takes from the laptop of the person who wrote it to a production environment, using containers. You start by understanding why containers exist and how the Linux kernel isolates processes with namespaces and cgroups; then you separate image from container, write a Dockerfile, organize layers and cache, and reduce the image size with minimal bases and multistage builds. Next you persist data with volumes, bind mounts and tmpfs, connect services by name on custom networks and describe the whole application in a single Docker Compose file, with per-environment variations, restart policy, scaling and use in CI. Finally, you reduce privileges (non-root user, capabilities, seccomp, read-only filesystem), control what goes into the build and how secrets are handled, investigate failures with a diagnostic order, check the real readiness of services with logs and healthchecks, and put everything together in a small, defensive stack. Before the stages, the next section introduces the F1 lens of the guide: a general comparison that shows the same path, from the factory to the bay, working inside a Formula 1 team.",
  'Each stage depends only on what was explained before it and ends with a small exercise that proves you understood. Containers are learned by creating and destroying things on purpose, so do not skip the "Hands-on" blocks.',
  "**What you need to have:** Docker Engine or Docker Desktop, with the `docker compose` command (Compose v2) available, and a terminal with `curl`. Confirm with `docker version` and `docker compose version`. The examples use Linux images. On Docker Desktop, those images run inside the Linux virtual machine managed by the tool itself. Some older tutorials use `docker-compose` (with a hyphen), the first-generation executable; in this guide we always use `docker compose`.",
  "**How to use this guide:** keep a terminal open next to the text and organize the files in one folder per stage (`etapa01/`, `etapa02/` and so on), because names such as `Dockerfile` and `compose.yaml` repeat. At the end of each stage, remove the lab containers, networks and volumes it created, so that ports such as 3000 and 8080 are free for the next stage. When an example shows the expected output, compare it with yours: IDs, times, sizes and versions will vary, and the structure of the output is what matters. Shortened outputs are marked with `...`.",
  "**What runs where:** every stage runs on Docker on your own computer. Only three examples depend on something external: the `docker push` in Stage 02 requires a real registry with write permission, the NFS volume in Stage 05 requires an accessible NFS server, and the Dive and Snyk tools in Stage 10 must be installed separately (Snyk also requires an account). Those snippets are marked in the text and the rest of the guide does not depend on them.",
  "**About versions:** images and languages evolve. The Node.js examples use the `lts-alpine` and `lts-slim` tags, which always point to the current long-term support version, so that the exercises do not age. In a real project, Stage 02 explains why pinning an explicit version is better.",
];

export const LENS: GuideLens = {
  paragraphs: [
    'A Formula 1 team does not build the car at the circuit. At the factory, the engineers write the assembly manual, the exact sequence of steps: start with this chassis (the central carbon-fiber structure where everything is attached), install this power unit (the car\'s engine, which combines the combustion engine and the electrical part that recovers and returns energy), then the aerodynamic package. The assembly bench receives only a crate with the necessary parts, and a list says what stays out of it (personal notes, access keys, leftovers). Following the manual, the mechanics produce a sealed kit: the car in already assembled subassemblies, each shipping crate holding the result of one step of the manual applied on top of the previous one, and without the molds and tools, which stay at the factory. If a step and its parts are identical to those of the last kit, the factory reuses the finished subassembly; if a part underneath changes, everything that goes on top of it is redone, which is why what changes every weekend goes in last. The kit stays in the team warehouse, with restricted access, and the standard parts come from supplier catalogs open to any team. Each kit carries a version label ("specification B"), which the team can later stick on another kit, and a contents list with the serial number of each part, which changes if any part changes. Logistics ships the same kit to any circuit, sending only the crates that are not yet at the destination. What varies from one circuit to another is the parameter sheet (engine maps, energy modes), delivered separately, without swapping any part.',
    "At the circuit, the team occupies a garage in the pit lane (the lane of the garages), divided into one bay for each of the two cars the regulations allow. The mechanics take the car out of the crates and put it into operation in the bay, and it is running for as long as the engine is on. What is changed on it during the session (an adjustment made by hand, a note on the chassis) stays only on that chassis and disappears when it is taken apart. Partitions separate the bays: the mechanics of one car have their own tools, their own list of people and their own data channel, and cannot see the neighboring bay. Power, compressed air and the data network come from the same garage installation, and each bay has a circuit breaker that limits how much it can draw, so that one bay does not leave the others without power. The alternative would be to build a complete structure inside the garage, with its own generator and compressor: it isolates more, but it is heavy and slow to get ready. What needs to outlive the chassis is kept in the garage cabinets, connected to the car during the session. An engineer can also connect the car directly to a folder on their laptop, and the bay whiteboard holds what is quick and is wiped at the end of the session. Inside, cars and support systems talk over the intercom, the team's internal radio, on separate channels, and each one is called by its radio name, never by the frequency, which can change. To the outside, the garage has few points of contact, each tied to one bay; whatever has no open point can only be reached through the intercom.",
    "Before arriving, the team writes the weekend plan: a single document with every system the garage needs (the cars, the telemetry server, the timing database), the channels and the cabinets of each, so that a single order sets everything up. The plan defines the assembly order, and assembled first does not mean ready. A companion sheet changes only what is different on a test day, and the plan also fixes the rule for a system that shuts down: always restart it, restart it only after a fault, with a maximum number of attempts, or respect whoever shut it down on purpose. At the factory, an automated test rig assembles the set with every new part, runs the tests and takes it apart. Each person gets a credential that opens only the areas they need, never the pass that opens everything, and there are requests that no bay may make to the garage installation, such as shutting off the main power board or plugging new equipment straight into the mains: the installation refuses these requests, whoever makes them. From qualifying (the session that sets the starting order), the car stays in parc fermé, the regime of the regulations in which it is sealed and cannot be modified, with interventions only at permitted points. Access codes arrive in an envelope, to the right person; a code written on a part during assembly remains recorded in the kit even if a later step covers it. During the session, each car sends telemetry (the sensor data, transmitted continuously) in a fixed format to the team servers. The race engineer (who follows one car) makes, from time to time, the radio check, the routine radio call that confirms the car responds and can follow the plan, which says more than seeing the engine running; on the out lap (the first one, with tires and brakes still cold), a bad answer does not count yet. When a car stops, the investigation follows an order: the state and the recorded reason for the stop, the data recorded by the car itself, the sheet of what was assembled, the garage timeline, the consumption and, only then, a laptop connected to the car.",
  ],
  bridge: [
    "It is the same chain that Docker follows. The garage is the host and the shared installation is the shared kernel; the partitions between the bays are the namespaces and the circuit breaker of each bay is the cgroup. The sealed kit is the image, and the car running in the bay is the container. The assembly manual is the Dockerfile, and each crate in the kit is a layer of the image. The garage cabinets are the volumes. Each intercom channel is a custom network, and the radio name is the internal DNS. The weekend plan is the Docker Compose file. The credential that opens only some areas and parc fermé are least privilege applied to the container, and the envelope is the secret. The radio check is the healthcheck. One fixed rule holds for the whole guide: each car taken out of the crates and put into operation in a bay is a container. The kit in the warehouse is never altered, and whoever wants a different car changes the manual and produces another kit.",
    "If you have already read the Kubernetes guides: here the guide looks at a single garage, without the pit wall (the gantry facing the track, where the engineers who decide sit), and you give each order directly with the `docker` command. In the Kubernetes guides, the car becomes the Pod, and the container becomes one of the systems inside it.",
  ],
  mappingNote:
    "The table below translates each technical term in the guide into an everyday idea, with no F1 and no jargon. You do not need to memorize it; come back to it whenever a term shows up in the text.",
  mapping: [
    {
      term: "Container",
      plain:
        "A hotel room occupied by a program: it uses only what is inside the room and cannot see the other rooms, but the building (plumbing, power) is shared.",
    },
    {
      term: "Kernel",
      plain:
        "The building's control center that supplies power, water and a front desk to all the rooms at once. Every container on a computer uses the same one.",
    },
    {
      term: "Host",
      plain: "The real computer (or server) where the containers run, that is, the whole building.",
    },
    {
      term: "Virtual machine (VM)",
      plain:
        "A whole, independent house, with its own electrical and plumbing systems, built inside the building. It isolates well, but it is heavy and takes longer to get ready than a room.",
    },
    {
      term: "Namespace",
      plain:
        "The walls of the room: they define what each program can see (which processes, which network, which files, which name).",
    },
    {
      term: "Cgroup",
      plain:
        "The meter with a limit in each room: it defines how much processing, memory and disk that program can use.",
    },
    {
      term: "Main process (PID 1)",
      plain:
        'The first program the container starts, the one in charge of the room: when it leaves, the room is closed. Since it is the one that receives the building\'s notices (such as "stop now"), it needs to know how to react to them; an "init" is a receptionist who takes that post and passes the notices on to the program.',
    },
    {
      term: "Image",
      plain:
        "The ready, sealed model room, assembled by following the recipe: floor plan, furniture and everything the room needs. Each real room (container) is a copy of it, and changing one room does not alter the model.",
    },
    {
      term: "Registry and Docker Hub",
      plain:
        "A library of model rooms on the internet, from which you download the ones you need. Docker Hub is the best-known public library; there are also private libraries, only for those with a password.",
    },
    {
      term: "Tag",
      plain:
        'The version label stuck on the model, such as "edition 2". Whoever labels it can later move the label from one model to another.',
    },
    {
      term: "Digest",
      plain:
        "The printed serial number of the exact contents of the model. If a detail changes, the number changes, which is why it identifies without ambiguity.",
    },
    {
      term: "Writable layer",
      plain:
        "The room's notepad. The notes are still there when the guest leaves and comes back (stopping and restarting the container) and only vanish when the room is dismantled, that is, when the container is removed.",
    },
    {
      term: "Dockerfile",
      plain:
        'The written recipe: the list of steps to assemble the model room ("start with this, add that, run this command"), so that anyone can repeat the same result.',
    },
    {
      term: "Build",
      plain: "The act of following the Dockerfile recipe, step by step, to produce the model room.",
    },
    {
      term: "EXPOSE",
      plain:
        'A sign on the room\'s door saying "I serve on port 3000". The sign informs, but does not open the door to the public; what opens it is port publishing.',
    },
    {
      term: "Image layer",
      plain:
        "Stacked transparent sheets: each step of the recipe adds a sheet on top, and the sheets underneath do not change.",
    },
    {
      term: "Build cache",
      plain:
        "If a step of the recipe and its materials are identical to last time's, Docker reuses the part that was already finished instead of redoing it.",
    },
    {
      term: "Base image (alpine, slim, distroless)",
      plain:
        "The starting point of the recipe. Alpine is a tiny base room with few pieces of furniture; slim is a reduced but familiar room; distroless has only what the guest needs and no supporting furniture.",
    },
    {
      term: "Multistage build",
      plain:
        "Assembling the room in a workshop full of tools and delivering only the finished room, without the tools.",
    },
    {
      term: "Volume",
      plain:
        "A cabinet kept outside the room: the room can be replaced, and the cabinet keeps everything inside.",
    },
    {
      term: "Bind mount",
      plain:
        "A door that opens straight onto a folder on your computer, so that what changes on one side shows up on the other.",
    },
    {
      term: "tmpfs",
      plain:
        "A whiteboard: quick, but wiped when the meeting ends. It lives in memory and, in general, is not written to disk.",
    },
    {
      term: "Custom network and internal DNS",
      plain:
        "A group chat only for the project members, in which each one is called by name and not by phone number, which can change.",
    },
    {
      term: "Port publishing",
      plain:
        "Opening a service window on the building's front for the public. The other rooms stay internal.",
    },
    {
      term: "Docker Compose",
      plain:
        "A single written plan that lists all the rooms on the floor, how they connect and what each one needs, to set everything up with one request.",
    },
    {
      term: "Service",
      plain: 'Each item in the Compose plan, for example "the API" or "the database".',
    },
    {
      term: "depends_on",
      plain:
        'The opening order of the rooms: "open the database room before the API room". It guarantees only the opening order, not that the database is already ready to serve, unless a health check has been agreed.',
    },
    {
      term: "Override",
      plain:
        "A sheet of adjustments laid over the plan: it changes only what is different in one environment (for example, opening a port only on your computer) without rewriting the whole plan.",
    },
    {
      term: "Restart policy",
      plain:
        "The rule about what to do when the program stops: always reopen, reopen only if it stopped because of a fault, or respect it when you were the one who told it to stop.",
    },
    {
      term: "Replica (scaling)",
      plain:
        "An identical copy of a service, like opening one more identical counter to serve more people.",
    },
    {
      term: "CI (continuous integration)",
      plain:
        "An automatic helper that, at every change to the project, sets up the environment, runs the tests and takes everything down.",
    },
    {
      term: "Non-root user",
      plain:
        "Giving the program an ordinary badge instead of the building's master key. If the badge is stolen, the damage is much smaller.",
    },
    {
      term: "Capabilities",
      plain:
        "The master key split into dozens of small keys (open door A, start the generator). Each program receives only the keys it needs.",
    },
    {
      term: "Seccomp",
      plain:
        "A list of requests the program may or may not make to the building's control center; dangerous requests are refused.",
    },
    {
      term: "Least privilege",
      plain:
        "The rule of giving each person only the access needed for the task, and nothing more.",
    },
    {
      term: "Read-only filesystem",
      plain: "A write-protected document: it can be read, but no one can change it.",
    },
    {
      term: "Build context and .dockerignore",
      plain:
        "The context is the box of materials sent to whoever assembles the model room. The .dockerignore is the list of what stays out of the box (drafts, passwords, junk).",
    },
    {
      term: "Secret",
      plain:
        "A password handed over in person, in an envelope, instead of written on a poster on the door.",
    },
    {
      term: "Environment variable",
      plain:
        "A note pinned in the program's room: it reads it when it needs to, but anyone who inspects the room can read it too.",
    },
    {
      term: "ARG",
      plain:
        "A parameter given at the moment of following the recipe (such as the version number). It is recorded in the assembly history, so it is not suitable for passwords.",
    },
    {
      term: "Vulnerability (CVE)",
      plain:
        "A security flaw already cataloged and given a registration number, like a product recall.",
    },
    {
      term: "Dive and Snyk",
      plain:
        "Two magnifying glasses: one shows what each sheet of the image added and how much it weighs; the other looks for already known security flaws.",
    },
    {
      term: "Exit code",
      plain:
        'The number a program leaves when it finishes: 0 means "I finished fine" and any other number indicates that something went wrong.',
    },
    {
      term: "OOMKilled and code 137",
      plain:
        'OOMKilled is the record that the container was ended for asking for more memory than allowed (OOM means "out of memory"). 137 is the number left by a forced shutdown; this happens because of lack of memory, but also when a polite request to stop is not answered in time.',
    },
    {
      term: "Inspect",
      plain:
        "Asking for the complete technical sheet of a container: what it runs, what is mounted, which network it is on and how it ended.",
    },
    {
      term: "Event",
      plain:
        "The line in Docker's diary that records each occurrence (created, started, stopped, removed), with the time.",
    },
    {
      term: "Log (stdout and stderr)",
      plain:
        "The diary the program writes by itself while it works. Stdout receives the normal messages and stderr receives the errors.",
    },
    {
      term: "Structured log",
      plain:
        "A diary in which every entry always follows the same form (time, level, message), which makes it easy to search and filter.",
    },
    {
      term: "Healthcheck",
      plain:
        'Asking from time to time "can you serve right now?", instead of just checking whether the light on the counter is on.',
    },
    {
      term: "start_period",
      plain:
        "The grace period right after the container comes up: during this period, negative answers do not count as failures, because the program is still settling in.",
    },
    {
      term: "Readiness",
      plain: "Being truly able to serve, and not just switched on.",
    },
    {
      term: "Stack",
      plain:
        "The complete set of pieces that make up a working application (API, database, network, storage).",
    },
    {
      term: "Resource limit",
      plain:
        "A consumption ceiling: the program may use up to so much memory and processing, but that does not guarantee it will have that much reserved.",
    },
    {
      term: "Label",
      plain:
        "An informational tag stuck on the container, used to organize and search. It describes and protects nothing.",
    },
  ],
  limitsIntro:
    "The comparison helps fix the path from the factory to the bay, but it is not a perfect equivalence. These are the points where F1 stops applying for each stage:",
  limits: [
    "**Stage 01:** the car is a complete machine and the partitions are physical walls; the container is just an ordinary process of the host, which the kernel sees and can end like any other, and the isolation is a configuration of that same kernel, not a physical barrier. A fault in the shared kernel affects all the containers at the same time.",
    "**Stage 02:** a physical kit becomes a single car, and assembling consumes the parts; an image produces as many containers as are requested, at the same time, without being used up, and removing the containers does not remove the image. The digest, moreover, is calculated from the content itself by a hash function, and not assigned by someone as a serial number.",
    "**Stage 03:** the assembly manual is read by mechanics who resolve ambiguities; the Dockerfile is executed to the letter, only sees the files in the build context, and `EXPOSE` merely documents the port, without opening any point of contact to the outside (the published port).",
    "**Stage 04:** at the factory, deciding whether a finished subassembly (a cached layer) can be reused is an engineering judgment; in the build, the cache depends on an exact comparison of the instruction and the input files, and any difference invalidates that layer and all the following ones, even with no practical effect. And deleting a file in a later step does not make the kit lighter: the layer that added it remains in the image.",
    "**Stage 05:** the cabinets are furniture separate from the car; the volume is a host directory mounted inside the container, and the bind mount gives the container write access to a real folder on the host, with its permissions, with no safe parallel in the garage. A remote NFS volume also depends on the network and on the server's permissions, and not only on Docker.",
    "**Stage 06:** on the intercom, everyone on the channel hears every message; on a Docker network, each container has its own IP and the connections are point to point. Only custom networks resolve names (the default bridge does not), and `host` mode eliminates network isolation, with no equivalent on a radio channel.",
    "**Stage 07:** the weekend plan is carried out by people who wait for one system to be ready before assembling the next; the simple `depends_on` only guarantees the creation order, and Compose only waits for readiness when there is a healthcheck and the `service_healthy` condition declared.",
    "**Stage 08:** the regulations fix two cars; `--scale` creates as many identical replicas as requested, limited by the host and by the fixed published port, which only one replica can occupy. And the restart rule (the restart policy) reacts only to the end of the process: a system that stays on without responding is not restarted by it.",
    "**Stage 09:** in parc fermé (the read-only root), people check the seals and judge exceptions; in the container, `--read-only`, `--cap-drop` and seccomp are applied by the kernel on every operation, with no room for interpretation. Moreover, by default the container runs as root, which is equivalent to handing over the pass that opens everything (the root user) until someone configures another user, and mounting `docker.sock` in a container gives it command of all the bays in the garage.",
    "**Stage 10:** an envelope handed over in person exists only for the one who received it; a Compose secret is a file in `/run/secrets` that any process in the container with read permission can see. And a code that went into an image layer stays in the history even when covered by a later step, and only disappears when the image is rebuilt without it.",
    "**Stage 11:** an engineer can connect a laptop (the `docker exec`) to a car stopped in the garage; `docker exec` only works with the container running, and an ended container leaves only state, exit code, logs and metadata. The circuit breaker of each bay cuts everything at once, while the cgroup treats resources differently: excess CPU only slows the process down, and it is excess memory that leads to the shutdown marked as `OOMKilled`.",
    "**Stage 12:** the radio check is made by a person who understands the answer; the healthcheck runs a command, looks only at the exit code and proves only what the test examines. Without an orchestrator, the `unhealthy` state is recorded, but Docker does not restart or replace the container because of it. And telemetry (the logs) always goes to the team servers, whereas `docker logs` reads what stayed on the host and logs tend to be lost when the container is removed, unless they are centralized.",
    "**Stage 13:** in the garage, people make up for an item forgotten in the weekend plan (the Compose file); in the stack, each protection only counts if it is declared in the file. The CPU and memory limits work like the circuit breaker of each bay, containing consumption without reserving capacity for the service, and labels are inventory tags, like those on the crates, and not seals: they describe and protect nothing.",
  ],
};

export const LESSONS: Lesson[] = [
  {
    id: "m1",
    num: "01",
    navTitle: "Why containers",
    tag: "foundations",
    title: "Why containers exist",
    lead: "A Node.js application works on the team's laptop but fails on the server. The local machine uses one version of the language, the server uses another, a native library is missing and a setting was made by hand, without documentation. The deploy becomes an attempt to rebuild, step by step, an environment that exists only in the memory of whoever configured it.\n\nThe same strain shows up in other situations. Installing packages and adjusting permissions directly on the server is slow and hard to reproduce, and any small change can break everything. Starting a second instance of the application requires copying and configuring everything again on another machine. And, if the new version has a problem, going back to the previous one means reconfiguring everything or hoping a working backup exists.\n\nVirtual machines (VMs) improved isolation in this scenario, but each VM carries its own complete operating system. That costs memory, disk and startup time. When the goal is to run isolated applications on the same server, repeating a whole operating system for each one can be wasteful.",
    concept: [
      "The evolution went like this: first, one application per physical server, with manual configuration; then virtualization, which divides a server into several VMs; finally, containers, which isolate only the processes and share the kernel of the host operating system. The focus shifts from the machine to the application.",
      "A **container** is a set of processes isolated at the operating system level. On Linux, two kernel mechanisms make this possible:",
      "- **Namespaces** control what the process can see. There is one type for each resource: PID (the process list), network (interfaces and routing tables), mount (filesystem), UTS (hostname), IPC (communication between processes, such as queues and shared memory) and user (user and group identification).",
      "- **Cgroups** (control groups) measure and limit resources, such as CPU, memory and disk input and output operations. A container that tries to consume more than planned is held to what was defined, and this protects the others.",
      "The container shares the host kernel. That is why it usually starts faster and uses fewer resources than a VM. This sharing also means that a container is neither a synonym for a virtual machine nor an absolute security barrier: protection depends on the configuration of the runtime and the host (Stage 09 goes deeper into this).",
      '**Docker** is the tool that made containers accessible: it standardizes how to package, distribute and run. A packaged application runs the same way on your laptop, on the test server, in production or in the cloud, which eliminates the "it works on my machine" problem.',
    ],
    pointsTitle: "Key concepts",
    points: [
      {
        t: "Container",
        d: "processes isolated and limited by the kernel; it lives only as long as its main process is active.",
        color: "blue",
      },
      {
        t: "Shared kernel",
        d: "the central difference from a VM and the reason containers are lightweight.",
        color: "signal",
      },
      {
        t: "Namespace",
        d: "isolates the view of processes, network, files, hostname, communication between processes and users.",
        color: "violet",
      },
      {
        t: "Cgroup",
        d: "measures and limits CPU, memory and disk input and output.",
        color: "ember",
      },
      {
        t: "VM",
        d: "simulates a complete computer, with its own kernel; it isolates more, but costs more.",
        color: "blue",
      },
      {
        t: "Docker",
        d: "tool that creates, packages and runs containers in a standardized way.",
        color: "signal",
      },
    ],
    examplesTitle: "Worked examples",
    examples: [
      {
        label: "the first container",
        lang: "sh",
        code: "# Downloads the image, creates a container, runs its process and shows the output.\n$ docker run --name primeiro-container hello-world\n\n# Also lists containers that have already finished.\n$ docker ps --all\n\n# Shows the container's complete metadata in JSON.\n$ docker inspect primeiro-container\n\n# Removes the container that has already ended.\n$ docker rm primeiro-container\n\n# expected output\nHello from Docker!\n...\nCONTAINER ID   IMAGE         STATUS                     NAMES\nabc123         hello-world   Exited (0) ...             primeiro-container",
        note: "The `Exited (0)` status does not indicate a failure. The main process printed the message and finished successfully. A container stays running only as long as its main process stays active.",
      },
      {
        label: "observing isolation",
        lang: "sh",
        code: "# PID namespace: inside the container, the first process in the list is PID 1,\n# and the host's processes do not appear.\n$ docker run --rm alpine ps\n\n# UTS namespace: the container has its own hostname, set by --hostname.\n$ docker run --rm --hostname demo alpine hostname\n\n# Cgroups: limits to 64 MB of memory and half a CPU, and queries the recorded limit.\n$ docker run --detach --name limitado --memory 64m --cpus 0.5 alpine sleep 120\n$ docker inspect --format 'memoria={{.HostConfig.Memory}} cpus={{.HostConfig.NanoCpus}}' limitado\n\n# Removes the lab container (disposable, hence the --force).\n$ docker rm --force limitado\n\n# expected output\nPID   USER     TIME  COMMAND\n    1 root      0:00 ps\ndemo\nmemoria=67108864 cpus=500000000",
        note: "The memory limit appears in bytes (64 MB is 67108864) and the CPU limit in billionths of a CPU (half a CPU is 500000000).",
      },
    ],
    commands: [
      {
        cmd: "docker version",
        note: "confirms that the Docker client and server are reachable",
      },
      {
        cmd: "docker run hello-world",
        note: "downloads the image (if needed), creates and runs a test container",
      },
      {
        cmd: "docker ps",
        note: "lists the running containers",
      },
      {
        cmd: "docker ps --all",
        note: "(or `docker ps -a`): also lists stopped containers",
      },
      {
        cmd: "docker inspect name",
        note: "shows the complete metadata in JSON",
      },
      {
        cmd: "docker inspect --format '{{.State.Status}} {{.State.ExitCode}}' name",
        note: "shows only the state and the exit code",
      },
      {
        cmd: "docker rm name",
        note: "removes a stopped container",
      },
    ],
    handsOn: [
      "Run `docker run --name fundamentos hello-world`.",
      "Run `docker ps` and then `docker ps --all`.",
      "Note that the container appears only in the second command.",
      "Inspect its status with `docker inspect --format '{{.State.Status}} {{.State.ExitCode}}' fundamentos`.",
      "The expected output is `exited 0`. Remove it with `docker rm fundamentos`.",
      "Run `docker run --rm alpine ps` and note that the only process listed has PID 1: the container does not see the host's processes.",
      "Run `docker run --rm --hostname demo alpine hostname` and then `docker run --rm alpine hostname`. Note that the name changes from one container to another, and neither of them is the name of your computer.",
    ],
    tip: 'When a container "disappears" right after `docker run`, do not assume a defect: run `docker ps --all` and read the `STATUS`. An `Exited (0)` means the main process ended normally, and a container only stays alive while that process continues.',
    takeaway:
      "A container is a process isolated and limited by the kernel; it is not a small virtual machine.",
    figures: [
      {
        items: [
          {
            src: "/guides/containers/etapa01-evolucao-deploy.svg",
            alt: "Three columns: traditional deployment, with applications directly on the operating system and hardware; virtualized deployment, with several VMs, each with its own operating system, on a hypervisor; container deployment, with applications on a container runtime that shares the host operating system.",
            caption:
              "The stage's evolution: one application per server, then several VMs with their own operating system, then containers that isolate only the processes and share the host kernel.",
          },
        ],
        credit: "Diagram: kubernetes.io, The Kubernetes Authors, CC BY 4.0",
      },
    ],
  },
  {
    id: "m2",
    num: "02",
    navTitle: "Image and lifecycle",
    tag: "image + runtime",
    title: "Image, container and lifecycle",
    lead: "A team needs to run the same version of Nginx in development, testing and production. Installing and configuring the program manually in each environment recreates the inconsistency problem. Copying a running container is not enough either, because it accumulates temporary state and does not represent a reproducible recipe.",
    concept: [
      "An **image** gathers the filesystem and the metadata needed to start a process. It is immutable and made of reusable layers. A **container** adds a temporary writable layer on top of the image and runs the configured command. The same image can give rise to several independent containers, and removing a container does not remove the image.",
      "The basic flow is:",
      "1. `docker pull` downloads an image from a registry, such as Docker Hub.",
      "1. `docker run` creates and starts a container from the image.",
      "1. `docker stop` requests that the process stop.",
      "1. `docker start` restarts the same container.",
      "1. `docker rm` removes the container.",
      "1. `docker rmi` removes an image that is not in use.",
      "Tags such as `node:lts-alpine` or `nginx:alpine` identify variants. Avoid depending on `latest` in environments that need reproducibility, since the content associated with the tag can change. An explicit tag (for example, the major version) helps, although a tag can still be moved by the maintainer. When strong immutability is required, a **digest** (`image@sha256:...`) identifies the image content precisely.",
      "A **public registry** lets you discover and download public images, often without authentication. Docker Hub is the best-known example and hosts both free software (Nginx, Node.js) and system bases (Ubuntu, Alpine). A **private registry** restricts access to internal images and requires authentication with `docker login`. Companies usually combine the two: common images come from the public registry, and the images that contain proprietary code stay in internal repositories, accessible only to those who are authorized. Private registry options include Amazon Elastic Container Registry (ECR), Azure Container Registry (ACR), Google Artifact Registry (which replaced the old Google Container Registry), and self-hosted solutions such as Harbor and JFrog Artifactory. They integrate with CI/CD pipelines to automate the creation and distribution of images.",
      "Use public images only when they are trusted and verified, and keep in private repositories everything that is sensitive or internal.",
      "Before pushing an image, the local name must receive a tag that includes the registry address, the namespace and the version.",
    ],
    pointsTitle: "Key concepts",
    points: [
      {
        t: "Image",
        d: "immutable, layered template used to create containers.",
        color: "blue",
      },
      {
        t: "Container",
        d: "execution of an image, with a temporary writable layer on top.",
        color: "signal",
      },
      {
        t: "Writable layer",
        d: "where the container writes during execution; it disappears when the container is removed.",
        color: "violet",
      },
      {
        t: "Registry",
        d: "server that stores and distributes images (Docker Hub, ECR, ACR, Artifact Registry, Harbor).",
        color: "ember",
      },
      {
        t: "Tag",
        d: "version name of an image; it is mutable, and `latest` does not guarantee reproducibility.",
        color: "blue",
      },
      {
        t: "Digest",
        d: "identifier of the exact content of the image.",
        color: "signal",
      },
      {
        t: "Lifecycle",
        d: "`pull`, `run`, `stop`, `start`, `rm`, `rmi`.",
        color: "violet",
      },
    ],
    examplesTitle: "Worked examples",
    examples: [
      {
        label: "serving a page with Nginx",
        lang: "sh",
        code: "# Explicitly downloads the Alpine variant of the official image.\n$ docker pull nginx:alpine\n\n# Creates a container in the background.\n# The name makes the next commands easier.\n# Port 8080 on the host is forwarded to port 80 in the container.\n$ docker run --detach --name pagina --publish 8080:80 nginx:alpine\n\n# Lists the running containers.\n$ docker ps\n\n# Queries the server inside the container through the port published on the host.\n$ curl http://localhost:8080\n\n# Shows the messages produced by the Nginx process.\n$ docker logs pagina\n\n# Runs a command in a container that is already running.\n$ docker exec pagina nginx -v\n\n# Stops and removes the container.\n$ docker stop pagina\n$ docker rm pagina\n\n# expected output\nCONTAINER ID   IMAGE          PORTS                  NAMES\nabc123         nginx:alpine   0.0.0.0:8080->80/tcp   pagina\n<!DOCTYPE html>\n<title>Welcome to nginx!</title>\nnginx version: nginx/...",
      },
      {
        label: "entering, copying files and renaming",
        lang: "sh",
        code: '# Interactive mode: -i keeps the input open and -t allocates a terminal.\n# The container ends when you leave the shell.\n$ docker run -it --name sandbox ubuntu bash\n#   inside the container:  cat /etc/os-release   and then   exit\n\n# Removes the interactive container.\n$ docker rm sandbox\n\n# Creates a container that stays alive for 5 minutes.\n$ docker run --detach --name caixa alpine sleep 300\n\n# Copies a file from the host into the container.\n$ echo "ola do host" > nota.txt\n$ docker cp nota.txt caixa:/tmp/nota.txt\n\n# Opens a shell in a container that is already running.\n$ docker exec -it caixa sh\n#   inside the container:  cat /tmp/nota.txt   and then   exit\n\n# Copies from the container back to the host, with another name.\n$ docker cp caixa:/tmp/nota.txt ./nota-copia.txt\n\n# Renames the container and confirms.\n$ docker rename caixa caixa-nova\n$ docker ps --filter name=caixa-nova\n\n# Cleans up the lab.\n$ docker rm --force caixa-nova\n\n# expected output\nPRETTY_NAME="Ubuntu ..."\nola do host\nCONTAINER ID   IMAGE     COMMAND       ...   NAMES\nabc123         alpine    "sleep 300"   ...   caixa-nova',
        note: "Depending on the version, `docker cp` may print a confirmation line. Files copied into a container stay in the writable layer and vanish with it; to persist data, use volumes (Stage 05).",
      },
      {
        label: "terminal",
        lang: "sh",
        code: "# Authenticates with the private registry.\n# Use the prompt or a token; do not put the password directly in the shell history.\n$ docker login registry.exemplo.com\n\n# Adds to the local image the full name accepted by the registry.\n$ docker tag minha-api:1.1 registry.exemplo.com/equipe/minha-api:1.1\n\n# Pushes the versioned image to the private repository.\n$ docker push registry.exemplo.com/equipe/minha-api:1.1\n\n# expected output\nLogin Succeeded\n1.1: digest: sha256:... size: ...",
        note: "These commands require a real account and registry. On a public registry, reading may be anonymous, but `push` still requires write permission. The `minha-api:1.1` image is the one you build in Stage 03. To see the digest of the images you already have locally:",
      },
      {
        label: "terminal (2)",
        lang: "sh",
        code: "# Shows the DIGEST column in addition to repository, tag and size.\n$ docker images --digests nginx\n\n# expected output\nREPOSITORY   TAG      DIGEST            IMAGE ID   CREATED   SIZE\nnginx        alpine   sha256:...        abc123     ...       ...MB",
      },
    ],
    commands: [
      {
        cmd: "docker pull image:tag",
        note: "downloads an image from a registry",
      },
      {
        cmd: "docker images",
        note: "lists the local images",
      },
      {
        cmd: "docker run --detach --name name --publish 8080:80 image:tag",
        note: "creates and starts a container in the background, publishing a port",
      },
      {
        cmd: "docker run -it image command",
        note: "runs an interactive container (for example, `docker run -it ubuntu bash`)",
      },
      {
        cmd: "docker stop name",
        note: "requests that the main process stop",
      },
      {
        cmd: "docker start name",
        note: "restarts a stopped container",
      },
      {
        cmd: "docker rm name",
        note: "removes a stopped container",
      },
      {
        cmd: "docker rm --force name",
        note: "stops and removes immediately; use only with a disposable container",
      },
      {
        cmd: "docker rmi image",
        note: "removes a local image that no container uses",
      },
      {
        cmd: "docker logs name",
        note: "shows the output of the main process",
      },
      {
        cmd: "docker exec -it name command",
        note: "runs a command inside a running container (for example, `docker exec -it meu-container bash`)",
      },
      {
        cmd: "docker cp source destination",
        note: "copies files between host and container, in both directions",
      },
      {
        cmd: "docker rename old new",
        note: "renames a container",
      },
      {
        cmd: "docker login",
        note: ", `docker tag`, `docker push`: authenticates, names and pushes an image to a registry",
      },
      {
        cmd: "docker container prune",
        note: ", `docker image prune`, `docker system prune`: remove stopped containers, unused images and all unused resources, respectively. Read the list Docker presents and confirm the scope before accepting",
      },
    ],
    handsOn: [
      "Start `nginx:alpine` on port 8080 with the name `ciclo`.",
      "Confirm the response with `curl -I http://localhost:8080`. The first line of the output should be `HTTP/1.1 200 OK`.",
      "Stop the container and repeat the `curl`. The connection should fail, with a message such as `curl: (7) Failed to connect to localhost port 8080`.",
      "Run `docker start ciclo` and confirm that the page is back (`HTTP/1.1 200 OK` again).",
      "Confirm that no needed data lives only inside the container. Then remove it with `docker rm --force ciclo`. This option stops and removes the instance immediately, so it should not be used without checking the target.",
      "Run `docker images nginx` and note that the image is still available even with no container: removing the container does not remove the image.",
      "Make sure the file `nota.txt` exists in the current folder (`echo \"ola do host\" > nota.txt`). Create a container with `docker run --detach --name caixa alpine sleep 300`, copy the file into it with `docker cp nota.txt caixa:/tmp/nota.txt`, read it with `docker exec caixa cat /tmp/nota.txt` (the output is `ola do host`) and remove the container with `docker rm --force caixa`. Then create another one with the same `docker run` and run `docker exec caixa cat /tmp/nota.txt` again. The expected output now is `cat: can't open '/tmp/nota.txt': No such file or directory`, because the file stayed in the writable layer of the container that was removed. Remove the second container with `docker rm --force caixa`.",
    ],
    tip: "When you need to reproduce an image exactly, note the digest with `docker images --digests` and reference `image@sha256:...`. Tags such as `latest` and even `stable` change content over time; digests do not.",
    takeaway:
      "An image is the reproducible artifact; a container is a disposable run of that image.",
    figures: [
      {
        items: [
          {
            src: "/guides/containers/etapa02-camada-container.webp",
            alt: "A container based on the ubuntu:15.04 image: four read-only image layers, with a padlock, and on top a thin read-write layer, the container layer.",
            caption:
              "A container is the image, in read-only layers, plus a thin writable layer on top. Everything the container writes goes to that layer.",
          },
          {
            src: "/guides/containers/etapa02-camadas-compartilhadas.webp",
            alt: "Four thin read-write layers, one per container, all pointing to the same four read-only layers of the ubuntu:15.04 image.",
            caption:
              "Several containers from the same image share the read-only layers, and each one has its own writable layer. Removing a container deletes only its layer.",
          },
        ],
        credit: "Diagrams: docs.docker.com, Docker, Inc., Apache 2.0",
      },
    ],
  },
  {
    id: "m3",
    num: "03",
    navTitle: "Dockerfile",
    tag: "repeatable build",
    title: "Dockerfile as a reproducible recipe",
    lead: "Downloading a ready-made image covers common tools, but does not package your application's code. Manually copying files into a running container produces an environment that is impossible to rebuild with confidence.",
    concept: [
      "The **Dockerfile** is a text file that describes, declaratively, the step-by-step to build an image: you say what you want and Docker builds it. The `docker build` command reads the Dockerfile and a folder of files (the **build context**, given at the end of the command, normally `.`) and produces an image.",
      "The essential instructions are:",
      '- `FROM`: chooses the base image. Example: `FROM node:lts-alpine` means "start from the Node image on an Alpine base".',
      "- `WORKDIR`: sets the directory used by the following instructions, to avoid long paths in each command. Example: `WORKDIR /app`.",
      "- `COPY`: copies files from the build context into the image. Example: `COPY . /app` copies everything in the current directory to `/app`.",
      "- `RUN`: executes an action during the build (installing dependencies, creating folders) and records the result as a new layer. Example: `RUN npm install`.",
      '- `CMD`: sets the default command executed when the container starts. Example: `CMD ["node", "index.js"]`.',
      "- `EXPOSE`: documents the port used by the application. It does not publish the port on the host.",
      "`RUN` happens at build time and records a layer in the image. `CMD` happens at runtime, when a container is started. Mixing these two moments is a common source of error. `CMD` can be replaced on the `docker run` command line.",
      "The order of the instructions matters because Docker caches the result of each one. If you change something at the top, everything below is rebuilt; if you change only the `CMD`, the rest is reused. Stage 04 explores this rule.",
      "**The main process and signals.** The process defined by `CMD` is PID 1 of the container. On Linux, PID 1 does not get the default signal handling: a signal such as SIGTERM or SIGINT, which normally ends a program, is ignored if the program has not installed a handler for it, and Node.js without an explicit handler falls into this case. The result is that Ctrl+C in the terminal may not end the container, and `docker stop` waits for the deadline (10 seconds by default) and then sends SIGKILL. The `--init` option of `docker run` (and `init: true` in Compose) puts a small init process as PID 1, which passes the signals on to your program. That is why the API examples in this guide use `--init`. To end a container in the foreground, use Ctrl+C in its terminal or, in another terminal, `docker stop name`. The exit code 137 that results from a forced shutdown by SIGKILL does not, by itself, indicate lack of memory; Stage 11 shows how to tell the two cases apart.",
    ],
    pointsTitle: "Key concepts",
    points: [
      {
        t: "Dockerfile",
        d: "versionable recipe that turns manual decisions into a repeatable build.",
        color: "blue",
      },
      {
        t: "`FROM`",
        d: "every image starts from another; the choice of base determines size, compatibility and attack surface.",
        color: "signal",
      },
      {
        t: "`WORKDIR`, `COPY`, `RUN`",
        d: "prepare the image content during the build.",
        color: "violet",
      },
      {
        t: "`CMD`",
        d: "the main process of the container, executed at runtime.",
        color: "ember",
      },
      {
        t: "`EXPOSE`",
        d: "documentation only; what publishes the port is `--publish` (or `ports` in Compose).",
        color: "blue",
      },
      {
        t: "Build context",
        d: "the folder sent to Docker in `docker build`; only what is in it can be copied.",
        color: "signal",
      },
      {
        t: "Build tag",
        d: "`--tag name:version` names the built image.",
        color: "violet",
      },
      {
        t: "PID 1 and `--init`",
        d: "the main process does not get the default signal handling; the init passes SIGTERM and SIGINT on to the program.",
        color: "ember",
      },
    ],
    examplesTitle: "Worked examples",
    examples: [
      {
        label: "JavaScript",
        lang: "sh",
        code: '// Imports only the HTTP module included in Node.js.\nconst http = require("node:http");\n\n// Reads the port from the environment and keeps 3000 as the local default.\nconst port = Number(process.env.PORT || 3000);\n\n// Creates a simple JSON response for any request.\nconst server = http.createServer((_request, response) => {\n  response.writeHead(200, { "content-type": "application/json" });\n  response.end(JSON.stringify({ status: "ok" }));\n});\n\n// Listens on all of the container\'s interfaces.\nserver.listen(port, "0.0.0.0", () => {\n  console.log(`Servidor disponível na porta ${port}`);\n});',
        intro: "Create `server.js`:",
        note: "Create `Dockerfile`:",
      },
      {
        label: "Dockerfile",
        lang: "sh",
        code: '# Uses a small Node base; the lts-alpine tag follows the current LTS version.\nFROM node:lts-alpine\n\n# Sets the working directory inside the image.\nWORKDIR /app\n\n# Copies only the file needed for this example.\nCOPY server.js ./server.js\n\n# Documents the port used by the application.\n# EXPOSE does not publish the port on the host.\nEXPOSE 3000\n\n# Defines the main process of the container.\nCMD ["node", "server.js"]',
        note: "Build and run:",
      },
      {
        label: "terminal",
        lang: "sh",
        code: "# The trailing dot is the build context.\n$ docker build --tag minha-api:1.0 .\n\n# Publishes the port and removes the container when it ends.\n# --init puts an init as PID 1, so that Ctrl+C and docker stop end Node.\n$ docker run --rm --init --name minha-api --publish 3000:3000 minha-api:1.0\n\n# expected output\nServidor disponível na porta 3000",
        note: "In another terminal:",
      },
      {
        label: "terminal (2)",
        lang: "sh",
        code: "$ curl http://localhost:3000",
        note: "Expected output:",
      },
      {
        label: "JSON",
        lang: "sh",
        code: '{"status":"ok"}',
        note: "To end it, go back to the container's terminal and use Ctrl+C, or run in another terminal:",
      },
      {
        label: "terminal (3)",
        lang: "sh",
        code: "# Requests the container to stop; with --init, Node ends right away.\n$ docker stop minha-api",
        note: "Since the container was created with `--rm`, it is removed as soon as it stops, and port 3000 is free.",
      },
      {
        label: "Dockerfile (2)",
        lang: "sh",
        code: '# Official base on the Node LTS line. In production, pin the major version (for example, node:22-alpine).\nFROM node:lts-alpine\n\n# All the following commands run inside /app.\nWORKDIR /app\n\n# Copies the whole project from the build context to /app.\nCOPY . /app\n\n# Installs the dependencies; the result is saved as a new layer.\nRUN npm install\n\n# Command executed when the container starts.\nCMD ["node", "index.js"]',
        intro:
          "The template below is the standard for a Node.js application with npm dependencies. It needs a real project (`package.json` and `index.js`), so it serves as a reading reference, and Stage 04 shows a runnable version.",
        note: "The `CMD` can be swapped at run time, without rebuilding the image:",
      },
      {
        label: "terminal (4)",
        lang: "sh",
        code: "# The arguments after the image name replace the Dockerfile's CMD.\n$ docker run --rm minha-api:1.0 node -e \"console.log('outro comando')\"\n\n# expected output\noutro comando",
      },
    ],
    commands: [
      {
        cmd: "docker build --tag name:version .",
        note: "builds an image from the Dockerfile in the current directory",
      },
      {
        cmd: "docker build --file Dockerfile.dev --tag name:dev .",
        note: "uses a Dockerfile with another name",
      },
      {
        cmd: "docker run --rm --init --publish 3000:3000 name:version",
        note: "runs and removes the container when it ends, publishing port 3000 and using an init as PID 1",
      },
      {
        cmd: "docker stop name",
        note: "requests a container running in the foreground in another terminal to stop",
      },
      {
        cmd: "docker run --rm name:version command",
        note: "replaces the `CMD` with another command",
      },
      {
        cmd: "docker images name",
        note: "lists the built versions of an image",
      },
    ],
    handsOn: [
      "Create the two files from the example in an empty directory.",
      "Build `minha-api:1.0` and run the container with `--init`, as in the example.",
      "In another terminal, confirm the response with `curl http://localhost:3000` and end the container with `docker stop minha-api` (or Ctrl+C in its terminal). Confirm with `docker ps` that port 3000 is free.",
      'Change the response value to `{"status":"pronto"}`.',
      "Rebuild with the tag `minha-api:1.1`.",
      "Run `docker images minha-api` and note that the versions are distinct images.",
      "Run `docker run --rm minha-api:1.1 node -e \"console.log('outro comando')\"` and note that the `CMD` was replaced without rebuilding anything.",
    ],
    tip: "Keep the Dockerfile in the same repository as the code. That way, the image recipe is versioned along with the application, and a new colleague can reproduce the environment with a single `docker build`.",
    takeaway: "A Dockerfile turns manual decisions into a repeatable, versionable build.",
    figures: [
      {
        items: [
          {
            src: "/guides/containers/etapa03-build-run.en.svg",
            alt: "On the left, the Dockerfile with FROM, WORKDIR, COPY, RUN npm install and CMD, and the build context; in the middle, the image in layers, with the RUN npm install layer highlighted; on the right, after docker run, the container running node index.js.",
            caption:
              "`docker build` executes `RUN` once and writes the result into a layer. `CMD` is stored as metadata and only runs when a container starts, as PID 1.",
          },
        ],
        credit: "Diagram: made for this guide",
      },
    ],
  },
  {
    id: "m4",
    num: "04",
    navTitle: "Layers and cache",
    tag: "optimization",
    title: "Layers, cache, minimal images and multistage build",
    lead: "A Dockerfile copies the whole project before installing dependencies. Any one-line change invalidates the cache and downloads everything again. The final image also carries compilers, caches and files used only in the build. The result is slow to build, costs more to transfer and offers a larger attack surface.",
    concept: [
      "Docker stores the result of each instruction as a layer. If it finds a layer identical to one it has already built, it reuses it (it appears as `CACHED` in the build). This only happens while the instruction and its input files do not change, and, when a layer is invalidated, all the following ones are too. That is why dependency files should be copied before the rest of the code: first copy the minimum needed to install the dependencies, run the installation and only then copy the rest of the project.",
      "The same logic applies to any package manager (npm, pip, yarn, pnpm, composer); only the file names change. Also use the mode that respects the lockfile (`npm ci`, `--frozen-lockfile`) for predictable builds.",
      "A **multistage build** uses a tool-rich stage to build the artifact and a smaller final stage to run it. You open a `FROM` for the build, install dependencies and compile, and then open a new, clean `FROM`, copying only the result with `COPY --from=`. Build tools, development `node_modules` and temporary files do not go into the final image.",
      "Common base image variants:",
      "- `slim`: reduced Debian base, with good compatibility. It is a middle ground between weight and convenience.",
      "- `alpine`: minimal distribution (a few megabytes) that uses `musl` instead of `glibc` and the `apk` package manager. Things that usually come by default are missing, such as `bash` and `curl`; install them with `apk add` when you need them. It may require adjustments for native dependencies.",
      "- `distroless`: contains only what is needed to run the application, with no shell, no package manager and no utilities. It is excellent for production from a security standpoint, but demands a very well made build and normally depends on multistage.",
      'Smaller is not always better. For development, or while you do not yet know what you will need, start with a more complete image and "trim it down" after everything works. For production, when you already know exactly what runs, `alpine` or `slim` reduce the final size, the transfer time and the attack surface. The base must be compatible, up to date and sufficient to diagnose and run the application.',
      "The multistage example below copies only `/app/dist` to the runtime. This only works when `dist` is self-sufficient or when the application uses only native Node modules. If the artifact imports packages from `node_modules`, the final stage also needs to receive the production dependencies, for example with its own `npm ci --omit=dev` installation. Multistage is no license to leave needed dependencies behind.",
    ],
    pointsTitle: "Key concepts",
    points: [
      {
        t: "Layer",
        d: "immutable result of an instruction; it is the unit of cache and of transfer.",
        color: "blue",
      },
      {
        t: "Build cache",
        d: "reuses layers that did not change; an invalidated layer invalidates the following ones.",
        color: "signal",
      },
      {
        t: "Order by frequency of change",
        d: "what changes little (dependencies) comes before what changes a lot (code).",
        color: "violet",
      },
      {
        t: "Lockfile",
        d: "`package-lock.json` and equivalents; with `npm ci` the installation follows exactly what is in it.",
        color: "ember",
      },
      {
        t: "`slim`, `alpine`, `distroless`",
        d: "three levels of slimming down, each with a cost in compatibility or diagnosis.",
        color: "blue",
      },
      {
        t: "Multistage build",
        d: "separates building from running; `COPY --from=etapa` brings only the artifact.",
        color: "signal",
      },
    ],
    examplesTitle: "Worked examples",
    examples: [
      {
        label: "Dockerfile",
        lang: "sh",
        code: "# WRONG: copying the whole project before installing.\n# Any change to any file invalidates the COPY, and npm ci runs again.\nFROM node:lts-alpine\nWORKDIR /app\nCOPY . .\nRUN npm ci",
      },
      {
        label: "Dockerfile (2)",
        lang: "sh",
        code: "# RIGHT: first copy only the files that define the dependencies.\nFROM node:lts-alpine\nWORKDIR /app\n\n# This layer only changes when the dependencies change.\nCOPY package.json package-lock.json ./\n\n# npm ci depends only on the files above, so this layer stays cached.\nRUN npm ci\n\n# The code comes last; changing it does not redo the installation.\nCOPY . .",
        note: "The same pattern in other ecosystems (template snippets; each starts from its own project):",
      },
      {
        label: "Dockerfile (3)",
        lang: "sh",
        code: "# Python: copies only the dependency list, installs, and then copies the code.\nCOPY requirements.txt .\nRUN pip install -r requirements.txt\nCOPY . .\n\n# PHP with Composer: manifest and lockfile first.\nCOPY composer.json composer.lock ./\nRUN composer install\nCOPY . .\n\n# Node with pnpm (pnpm must be available in the image):\n# manifest and lockfile first, and installation pinned to the lockfile.\nCOPY package.json pnpm-lock.yaml ./\nRUN pnpm install --frozen-lockfile\nCOPY . .",
      },
      {
        label: "JSON",
        lang: "sh",
        code: '{\n  "name": "cache-demo",\n  "version": "1.0.0",\n  "private": true,\n  "scripts": {\n    "build": "node build.js"\n  }\n}',
        intro:
          "To make the test reproducible without depending on a previous project, create a folder with the `server.js` from Stage 03 and add these three files, before the Dockerfile. `package.json`:",
        note: "`package-lock.json` (lets `npm ci` run inside the build without requiring Node or npm on the host):",
      },
      {
        label: "JSON (2)",
        lang: "sh",
        code: '{\n  "name": "cache-demo",\n  "version": "1.0.0",\n  "lockfileVersion": 3,\n  "requires": true,\n  "packages": {\n    "": {\n      "name": "cache-demo",\n      "version": "1.0.0"\n    }\n  }\n}',
        note: "`build.js`:",
      },
      {
        label: "JavaScript",
        lang: "sh",
        code: '// Uses only native modules, so the final artifact does not depend on node_modules.\nconst fs = require("node:fs");\n\n// Recreates the output folder and copies the application as an executable artifact.\nfs.rmSync("dist", { recursive: true, force: true });\nfs.mkdirSync("dist", { recursive: true });\nfs.copyFileSync("server.js", "dist/index.js");',
        note: "Now the multistage `Dockerfile`, in the same folder:",
      },
      {
        label: "Dockerfile (4)",
        lang: "sh",
        code: '# First stage: has the environment needed to build.\nFROM node:lts-alpine AS build\n\nWORKDIR /app\n\n# Copying manifests first preserves the cache when only the code changes.\nCOPY package.json package-lock.json ./\n\n# npm ci uses exactly the lockfile and produces a reproducible installation.\nRUN npm ci\n\n# The code comes after the dependencies.\nCOPY . .\n\n# Generates the application\'s dist directory.\nRUN npm run build\n\n# Second stage: contains only what is needed to run.\nFROM node:lts-slim AS runtime\n\nWORKDIR /app\n\n# Copies the finished artifact from the previous stage.\nCOPY --from=build /app/dist ./dist\n\n# Uses the unprivileged user already present in the official image.\nUSER node\n\n# Starts the artifact, without carrying the tools from the build stage.\nCMD ["node", "dist/index.js"]',
        note: "Build the image:",
      },
      {
        label: "terminal",
        lang: "sh",
        code: "$ docker build --tag minha-app:otimizada .\n\n# expected output\n=> [build ...] RUN npm ci\n=> [build ...] RUN npm run build\n=> [runtime ...] COPY --from=build /app/dist ./dist\n=> naming to ... minha-app:otimizada\n\n# expected output\n=> CACHED [build ...] RUN npm ci\n=> [build ...] COPY . .\n=> [build ...] RUN npm run build",
        note: "On the second build, if only a code file changes, the `npm ci` step should appear as `CACHED`:",
      },
      {
        label: "feeling the difference between bases",
        lang: "sh",
        code: "# Alpine does not ship bash: which finds nothing and echo warns.\n$ docker run --rm alpine sh -c 'which bash || echo \"sem bash\"'\n\n# The slim variant (reduced Debian) keeps bash.\n$ docker run --rm node:lts-slim bash --version\n\n# On Alpine, extra packages come from apk; --no-cache avoids keeping the index in the image.\n$ docker run --rm alpine sh -c 'apk add --no-cache curl >/dev/null && curl --version | head -n 1'\n\n# expected output\nsem bash\nGNU bash, version ...\ncurl ...",
      },
    ],
    commands: [
      {
        cmd: "docker build --tag minha-app:otimizada .",
        note: "builds the image; run it twice and compare the use of `CACHED`",
      },
      {
        cmd: "docker build --no-cache --tag minha-app:otimizada .",
        note: "ignores the cache, useful to confirm that the build works from scratch",
      },
      {
        cmd: "docker build --target build --tag minha-app:etapa-build .",
        note: "builds only up to the `build` stage, to inspect it",
      },
      {
        cmd: "docker images minha-app",
        note: "compares the size of the built images",
      },
      {
        cmd: "docker run --rm --init --publish 3000:3000 minha-app:otimizada",
        note: "runs the image in the foreground; end it with Ctrl+C or `docker stop` in another terminal",
      },
      {
        cmd: "apk add --no-cache package",
        note: "installs a package on an Alpine base",
      },
    ],
    handsOn: [
      "Create a folder with the `server.js` from Stage 03, the `package.json`, the `package-lock.json`, the `build.js` and the multistage Dockerfile from this stage.",
      "Confirm that the `package-lock.json` is exactly the one provided above. It lets `npm ci` run inside the build without requiring Node or npm on the host.",
      "Run `docker build --tag minha-app:otimizada .` twice.",
      "On the second run, note `CACHED` on the steps that did not change.",
      "Change only the response message in `server.js` and rebuild.",
      "Confirm that the `npm ci` step stayed cached and test with `docker run --rm --init --publish 3000:3000 minha-app:otimizada`, followed by `curl http://localhost:3000` in another terminal. To end it, use Ctrl+C in the container's terminal or `docker stop` with the ID shown by `docker ps`, in another terminal. Since the container was created without `--name`, Docker picks a random name; look it up in `docker ps`.",
      'Swap the order of the instructions to the "WRONG" format (a `COPY . .` before `npm ci`), change `server.js` again and rebuild. Note that this time `npm ci` runs again. Undo the swap.',
      'Run the three commands from "feeling the difference between bases" and note what is absent on Alpine.',
    ],
    tip: "If a small image breaks in production because of a native library, the problem is usually the difference between `musl` (Alpine) and `glibc` (Debian). Before blaming the code, test the same application on `slim`. And remember that a `distroless` image has no shell: to diagnose, you will have to use other means (logs, a separate debug image).",
    takeaway: "Order layers by frequency of change and keep build tools out of the runtime image.",
    figures: [
      {
        items: [
          {
            src: "/guides/containers/etapa04-cache.png",
            alt: "The layers of a Dockerfile: FROM ubuntu:latest, RUN apt-get, COPY main.c Makefile, WORKDIR and RUN make build, all marked as cached.",
            caption:
              "With no change to the files, each instruction reuses the layer already built.",
          },
          {
            src: "/guides/containers/etapa04-cache-invalidado.png",
            alt: "The same Dockerfile: FROM and RUN apt-get stay cached, and COPY, WORKDIR and RUN make build appear in red, without cache.",
            caption:
              "The copied files changed: `COPY` loses the cache, and so does every instruction after it. That is why what changes least comes first.",
          },
        ],
        credit: "Diagrams: docs.docker.com, Docker, Inc., Apache 2.0",
      },
    ],
  },
  {
    id: "m5",
    num: "05",
    navTitle: "Persistence",
    tag: "volumes + mounts",
    title: "Persistence with volumes, bind mounts and tmpfs",
    lead: "A database writes data to the container's filesystem. During an update, the container is removed and recreated. The image is still available, but the data in the writable layer disappears along with the container.",
    concept: [
      "The container's writable layer is disposable by definition. Data that needs to survive the swap of the container must live somewhere else, connected to it. Docker offers three main mechanisms:",
      "**Named volume.** It is the recommended form for production. Docker creates and registers the volume in its internal metadata and stores it, by default, on the host at a path such as `/var/lib/docker/volumes/<name>/_data`; what the container sees is that directory mounted at the path you defined (for example, `/var/lib/mysql`). Strengths: management through Docker commands, simpler backup and migration, isolation from the rest of the host. The physical path is an internal detail of the Engine and may vary by system and runtime, so prefer Docker commands over manipulating `/var/lib/docker` directly.",
      "**Bind mount.** It points directly to a specific path on the host, which the container sees exactly as it is, with all files and permissions. It is great in development, because you edit the code on the host and the container sees the change in real time. On the other hand, there is no isolation (the container can alter the host's filesystem) and portability is limited, because it depends on the folder structure of that computer.",
      "**tmpfs.** It stores data in the host's memory. When the container stops or restarts, everything is lost. It is suitable for temporary or sensitive data that, in general, should not be written to disk (under memory pressure, the system may move tmpfs pages to the swap area, so do not treat it as an absolute guarantee that nothing reaches the disk). `tmpfs` is a mount type, and not a persistent volume driver.",
      "**Volume drivers.** The `local` driver is the default and uses the host's filesystem; it serves most cases well and is the recommended starting point. When several hosts need to access the same storage, the volume can use NFS through the `local` driver itself or a third-party plugin compatible with the provider (for example, integrations with EBS, Azure Disk or Ceph). In cloud environments with an orchestrator, specialized drivers or CSI plugins in Kubernetes are the common options. That choice depends on network, availability, permissions, backup and the consistency the application requires; only go down that road if there is a real need for sharing, remote persistence or specific performance requirements.",
    ],
    pointsTitle: "Key concepts",
    points: [
      {
        t: "Writable layer",
        d: "ephemeral; vanishes with the container.",
        color: "blue",
      },
      {
        t: "Named volume",
        d: "storage managed by Docker, independent of the container lifecycle.",
        color: "signal",
      },
      {
        t: "Bind mount",
        d: "a host path mounted inside the container; convenient, but coupled to the host.",
        color: "violet",
      },
      {
        t: "tmpfs",
        d: "in-memory mount, with no persistence.",
        color: "ember",
      },
      {
        t: "`local` driver",
        d: "persists on the host where Docker is running.",
        color: "blue",
      },
      {
        t: "Remote volume (NFS or plugin)",
        d: "allows sharing storage between hosts, with extra complexity.",
        color: "signal",
      },
      {
        t: "`:ro`",
        d: "suffix that mounts the path as read-only.",
        color: "violet",
      },
    ],
    examplesTitle: "Worked examples",
    examples: [
      {
        label: "data survives the container",
        lang: "sh",
        code: "# Creates a volume managed by Docker.\n$ docker volume create dados-demo\n\n# Writes a file inside the volume and removes the container when it ends.\n$ docker run --rm \\\n  --volume dados-demo:/dados \\\n  alpine sh -c 'echo persistiu > /dados/mensagem.txt'\n\n# A new container reads the same volume.\n$ docker run --rm \\\n  --volume dados-demo:/dados:ro \\\n  alpine cat /dados/mensagem.txt\n\n# Shows the volume's metadata.\n$ docker volume inspect dados-demo\n\n# expected output\npersistiu",
        note: "The `:ro` suffix mounts the volume as read-only in the second container.",
      },
      {
        label: "bind mount to edit without rebuilding",
        lang: "sh",
        code: "# Creates a local folder with a page.\n$ mkdir -p site\n$ echo '<h1>ola</h1>' > site/index.html\n\n# Mounts the local folder in the directory served by Nginx (read-only for the container).\n$ docker run --detach --name bind-demo --publish 8080:80 \\\n  --volume \"$(pwd)/site:/usr/share/nginx/html:ro\" \\\n  nginx:alpine\n\n# Reads the page.\n$ curl http://localhost:8080\n\n# Edits the file ON THE HOST and reads again, without rebuilding or restarting anything.\n$ echo '<h1>editado</h1>' > site/index.html\n$ curl http://localhost:8080\n\n# Cleans up the lab.\n$ docker rm --force bind-demo\n\n# expected output\n<h1>ola</h1>\n<h1>editado</h1>",
      },
      {
        label: "tmpfs",
        lang: "sh",
        code: "# Starts a container that stays alive, with /dados mounted as tmpfs.\n# --init prevents sleep, as PID 1, from ignoring the restart's stop request.\n$ docker run --detach --init --name tmp-demo --tmpfs /dados alpine sleep 300\n\n# Writes and reads a file inside the container.\n$ docker exec tmp-demo sh -c 'echo x > /dados/a && cat /dados/a'\n\n# Restarts the SAME container: the tmpfs is recreated empty.\n$ docker restart tmp-demo\n\n# Lists the contents of /dados after the restart.\n$ docker exec tmp-demo ls -A /dados\n\n# Cleans up the lab.\n$ docker rm --force tmp-demo\n\n# expected output\nx",
        note: "The first `exec` prints `x`. The second, after the restart, prints nothing: the directory is empty, and that is what proves that data in tmpfs does not survive even a simple restart of the same container. To compare, repeat the script with `--volume dados-demo:/dados` in place of `--tmpfs /dados`: after the restart, the file is still there.",
      },
      {
        label: "remote NFS volume (study only)",
        lang: "sh",
        code: "# Example of a remote NFS volume.\n# Replace the address and path with an NFS server that is actually reachable.\n$ docker volume create \\\n  --driver local \\\n  --opt type=nfs \\\n  --opt o=addr=192.168.1.100,rw \\\n  --opt device=:/dados/aplicacao \\\n  dados-remotos\n\n# expected output\ndados-remotos",
        note: "Creating the resource does not prove that the remote server is reachable. The actual mount happens when a container uses the volume, and it may fail because of the network, the NFS export or permissions. In orchestrators, the platform's own drivers and plugins take on this role.",
      },
    ],
    commands: [
      {
        cmd: "docker volume create name",
        note: "creates a volume (with the `local` driver by default)",
      },
      {
        cmd: "docker volume create --driver local name",
        note: "chooses the driver explicitly at creation",
      },
      {
        cmd: "docker volume ls",
        note: "lists the volumes",
      },
      {
        cmd: "docker volume inspect name",
        note: "shows driver, mount point and metadata",
      },
      {
        cmd: "docker volume rm name",
        note: "removes the volume permanently",
      },
      {
        cmd: "docker run --volume name:/path image",
        note: "(or `-v name:/path`): mounts a named volume",
      },
      {
        cmd: "docker run --volume /path/on/host:/path image",
        note: "creates a bind mount",
      },
      {
        cmd: "docker run --tmpfs /path image",
        note: "mounts a tmpfs",
      },
      {
        cmd: "docker restart name",
        note: "restarts the same container; the tmpfs comes back empty",
      },
    ],
    handsOn: [
      "Run the commands from the first example (volume `dados-demo`).",
      "Confirm that the first container no longer exists with `docker ps --all`.",
      "Read the file using a second container.",
      "Prove that tmpfs does not survive a restart: run the tmpfs example (`docker run --detach --init --name tmp-demo --tmpfs /dados alpine sleep 300`, write with `docker exec tmp-demo sh -c 'echo x > /dados/a'`, run `docker restart tmp-demo` and list with `docker exec tmp-demo ls -A /dados`). The listing should come out empty. Remove the container with `docker rm --force tmp-demo`.",
      "Run the bind mount example and confirm that the edit made on the host shows up in the response without restarting the container.",
      "Confirm that the volume contains only lab data. Then run `docker volume rm dados-demo`. The removal is permanent and offers no trash bin or automatic recovery.",
    ],
    tip: "For any data that cannot be lost (database, uploads), use a named volume. Reserve the bind mount for the code you edit during development, and remember that a bind mount in production ties the application to the folder structure of that server.",
    takeaway:
      "If data needs to survive the container, it cannot depend on that container's writable layer.",
    figures: [
      {
        items: [
          {
            src: "/guides/containers/etapa05-montagens.en.svg",
            alt: "A container with three mounts: the named volume dados-demo at /dados, stored by Docker in /var/lib/docker/volumes/dados-demo/_data, which persists; the bind mount ./site at /usr/share/nginx/html, a host folder, which persists; and the tmpfs at /dados, in host memory, which is gone on restart.",
            caption:
              "Each mechanism keeps the data in a different place on the host. The volume is managed by Docker, the bind mount is your own folder with no isolation, and tmpfs lives in memory and is gone when the container restarts.",
          },
        ],
        credit: "Diagram: made for this guide",
      },
    ],
  },
  {
    id: "m6",
    num: "06",
    navTitle: "Networks and DNS",
    tag: "connectivity",
    title: "Networks, internal DNS and port publishing",
    lead: "An API needs to reach a database. Using the container's current IP works until it is recreated and gets another address. Publishing the database port on the host solves access, but exposes a service that should be internal.",
    concept: [
      "Each container gets its own network namespace and its own IP inside a Docker network. When you create a **custom network** with `docker network create`, Docker enables an **internal DNS** on it: each connected container can be found by the name defined in `--name`. The API connects to the database using the hostname `banco`, with no fixed IP; a Node.js application would talk to a MongoDB just by pointing the URI to `mongodb://mongo:27017`, as long as the container is named `mongo` and both are on the same network.",
      "Custom networks are also isolated by default: only containers connected to the same network see each other. This lets you isolate databases, separate environments (dev and prod) and reduce the attack surface. Containers can be connected to and disconnected from networks at any time, which gives fine control over who talks to whom. The same network logic is used by Docker Compose (Stage 07) and by orchestrators such as Kubernetes.",
      "The network modes are:",
      "- `bridge`: isolated network on the same host, with an IP per container. User-created bridge networks offer automatic name resolution. It is the everyday mode, suited to local development and simple single-host environments.",
      "- `host`: the container shares the host's network stack, with no NAT and no IP of its own. It gives more performance and direct access to the host's network (useful for monitoring and local proxies), but eliminates network isolation and can cause port conflicts.",
      "- `none`: disables the container's network connectivity. Useful for tests and workloads that should not communicate with anything.",
      "- `overlay`: connects containers on different hosts, used with Docker Swarm. Other advanced networks (such as `macvlan`) exist for specific orchestration scenarios and are outside this guide.",
      "The default `bridge` network (the one the container gets when you specify nothing) and a user-created bridge are not equivalent. DNS by container name is an advantage of the custom network. On the default bridge, do not depend on this automatic discovery.",
      "Discovery by name is different from external access. `EXPOSE 3000` documents a port in the image. `--publish 8080:3000` creates the forwarding from port 8080 on the host to port 3000 in the container. For services that only other containers access (such as the database), publish nothing.",
      "DNS does not transmit data or authenticate participants: it only resolves names to addresses. Isolation, encryption and authorization require their own mechanisms.",
    ],
    pointsTitle: "Key concepts",
    points: [
      {
        t: "Custom bridge network",
        d: "isolates a group of containers and offers DNS by name.",
        color: "blue",
      },
      {
        t: "Internal DNS",
        d: "translates the container name to its current IP.",
        color: "signal",
      },
      {
        t: "`host`",
        d: "no network isolation; only for specific cases.",
        color: "violet",
      },
      {
        t: "`none`",
        d: "no network at all.",
        color: "ember",
      },
      {
        t: "`overlay`",
        d: "network across hosts, belonging to the Swarm universe.",
        color: "blue",
      },
      {
        t: "Port publishing (`--publish`)",
        d: "opens access from the host to a container; without it, the service is only visible inside the network.",
        color: "signal",
      },
      {
        t: "`EXPOSE`",
        d: "documentation in the image, with no publishing effect.",
        color: "violet",
      },
      {
        t: "`docker network connect` and `disconnect`",
        d: "attach a container that is already running to a network, or detach it from it.",
        color: "ember",
      },
    ],
    examplesTitle: "Worked examples",
    examples: [
      {
        label: "discovery by name",
        lang: "sh",
        code: "# Creates a bridge with internal DNS.\n$ docker network create rede-demo\n\n# Starts a server called web on that network.\n$ docker run --detach --name web --network rede-demo nginx:alpine\n\n# A temporary container resolves the hostname web and makes a request.\n$ docker run --rm --network rede-demo curlimages/curl \\\n  --silent --head http://web\n\n# Shows which containers are connected.\n$ docker network inspect rede-demo\n\n# Cleans up the exercise resources.\n$ docker rm --force web\n$ docker network rm rede-demo\n\n# expected output\nHTTP/1.1 200 OK\nServer: nginx/...",
        note: "No port was published. The communication happened internally, through the hostname `web`.",
      },
      {
        label: "isolating the database and exposing only the front",
        lang: "sh",
        code: "# The project's private network.\n$ docker network create minha-rede\n\n# The database joins the network and does NOT publish any port.\n$ docker run --detach --name banco --network minha-rede \\\n  --env POSTGRES_PASSWORD=exemplo-local postgres:16-alpine\n\n# The frontend joins the same network and publishes port 8080 to the host,\n# forwarded to port 80 in the container.\n$ docker run --detach --name frontend --network minha-rede \\\n  --publish 8080:80 nginx:alpine\n\n# Confirms which host port points to which container port.\n$ docker port frontend\n\n# Inside the network, the frontend resolves the name \"banco\" to the database container's IP.\n$ docker exec frontend nslookup banco\n\n# Cleans up the lab.\n$ docker rm --force frontend banco\n$ docker network rm minha-rede\n\n# expected output\n80/tcp -> 0.0.0.0:8080\nName:      banco\nAddress:   172.x.x.x",
        note: "The IP varies. `docker port` may also print a second line for IPv6 (`80/tcp -> [::]:8080`). The database is only reachable from inside the `minha-rede` network; from your terminal, `localhost:5432` does not respond, because the port was never published.",
      },
      {
        label: "the default bridge does not resolve names",
        lang: "sh",
        code: "# Without --network, both containers join the default bridge.\n$ docker run --detach --name alvo nginx:alpine\n$ docker run --detach --name cliente-padrao alpine sleep 300\n\n# The name \"alvo\" is not resolved on the default bridge.\n$ docker exec cliente-padrao wget -qO- http://alvo\n\n# Cleans up the lab.\n$ docker rm --force alvo cliente-padrao\n\n# expected output\nwget: bad address 'alvo'",
      },
      {
        label: "the none and host modes",
        lang: "sh",
        code: "# none: the container only has the loopback interface (lo).\n$ docker run --rm --network none alpine ip addr\n\n# host (Linux with Docker Engine): the container sees the host's own interfaces.\n$ docker run --rm --network host alpine ip addr",
        note: "In the first command the output lists only `lo`. In the second, the host's real interfaces appear (for example `eth0`). On Docker Desktop, the behavior of `host` mode differs, because the container runs inside a VM.",
      },
    ],
    commands: [
      {
        cmd: "docker network create name",
        note: "creates a custom bridge network (equivalent to `--driver bridge`)",
      },
      {
        cmd: "docker network ls",
        note: "lists the networks",
      },
      {
        cmd: "docker network inspect name",
        note: "shows which containers are connected and their IPs",
      },
      {
        cmd: "docker run --network name image",
        note: "starts a container already connected to the network",
      },
      {
        cmd: "docker network connect name container",
        note: "connects an existing container to the network",
      },
      {
        cmd: "docker network disconnect name container",
        note: "disconnects a container from the network",
      },
      {
        cmd: "docker network rm name",
        note: "removes the network (no container can be using it)",
      },
      {
        cmd: "docker run --publish host:container image",
        note: "(or `-p`): publishes a port",
      },
      {
        cmd: "docker run --network host image",
        note: "and `docker run --network none image`: host and none modes",
      },
      {
        cmd: "docker port name",
        note: "shows a container's published ports",
      },
    ],
    handsOn: [
      "Run the first example (`rede-demo`) without the two cleanup commands at the end (`docker rm --force web` and `docker network rm rede-demo`), because the next steps still need the `web` container and the network. Confirm the status `HTTP/1.1 200 OK`.",
      "Run `docker run --rm curlimages/curl --head http://web`, without `--network rede-demo`.",
      "Note the resolution failure, since the new container is outside the network. The expected output is `curl: (6) Could not resolve host: web`.",
      "Create a client with `docker run --detach --name cliente alpine sleep 300`.",
      "Connect it with `docker network connect rede-demo cliente`.",
      "Prove discovery by name with `docker exec cliente wget -qO- http://web`. The output should contain Nginx's welcome HTML (`<title>Welcome to nginx!</title>`).",
      "Inspect the connections with `docker network inspect rede-demo` and locate `web` and `cliente` in the list of containers.",
      "Disconnect the client with `docker network disconnect rede-demo cliente`, repeat the `wget` and note that resolution fails again, with `wget: bad address 'web'`.",
      "Check the names and remove the lab containers with `docker rm --force cliente web`; then remove the network with `docker network rm rede-demo`. `--force` ends the containers without the normal shutdown and is only appropriate here because both are disposable.",
      "Run the example \"the default bridge does not resolve names\" and compare the error (`wget: bad address 'alvo'`) with the success in step 6.",
    ],
    tip: "To expose a service only to your own computer (for example, while developing), publish on the loopback address: `--publish 127.0.0.1:8080:80`. That way the port is not reachable from other machines on the network.",
    takeaway:
      "Containers on the same custom network find each other by name; publish only the ports that need to be reached from the host.",
    figures: [
      {
        items: [
          {
            src: "/guides/containers/etapa06-redes.en.svg",
            alt: "On the host, the custom network minha-rede with frontend and banco: frontend reaches banco by name, through internal DNS, and only frontend receives browser traffic through the published port 8080:80. Below, on the default bridge, cliente-padrao cannot resolve the name alvo.",
            caption:
              "On the custom network, internal DNS resolves the container name, and only what has `--publish` receives traffic from outside. The default bridge has no name resolution.",
          },
        ],
        credit: "Diagram: made for this guide",
      },
    ],
  },
  {
    id: "m7",
    num: "07",
    navTitle: "Docker Compose",
    tag: "multi-container",
    title: "Docker Compose for multi-container applications",
    lead: "Starting API, database, network and volume with several commands works until someone forgets a flag, uses a different name or runs the steps in the wrong order. The environment stops being a versionable configuration and becomes an oral sequence of instructions.",
    concept: [
      "Docker Compose describes a whole application in a single YAML file (by default `compose.yaml`; the older name `docker-compose.yml` is still accepted). With one command you start, observe and tear down all the containers, networks and volumes. Compose automatically creates a network for the project, and the services find each other by service name (`db`, `web`), with the same DNS logic as Stage 06. The project name is, by default, the name of the folder, and the containers get names such as `projeto-web-1`.",
      "The main elements of the file are:",
      "- `services`: the containers that make up the application.",
      "- `build` or `image`: how to obtain the image for each service.",
      "- `ports`: ports published on the host.",
      "- `volumes`: persistence or file sharing.",
      "- `networks`: communication boundaries.",
      "- `environment` and `env_file`: non-secret configuration.",
      "- `secrets`: files mounted for sensitive data (Stage 10).",
      "- `init`: `init: true` runs an init as the service's PID 1, equivalent to `--init` of `docker run` (Stage 03).",
      "Instead of `image:`, a service can use a `build:` block to be built locally before starting. Three fields give control over this: `context` (the folder used as the base of the build), `dockerfile` (which file to use, useful for `Dockerfile.dev` and `Dockerfile.prod`) and `args` (build parameters declared with `ARG` in the Dockerfile). This avoids piling up nearly identical Dockerfiles and lets anyone clone the repository and run `docker compose up` with builds adapted to the team's workflow.",
      "Compose does not solve everything on its own. It interprets the definition and coordinates Docker resources, but the application still needs to handle startup, transient failures and dependencies correctly. `depends_on` guarantees creation order, not that the database is ready; readiness is handled with healthchecks in Stages 08 and 12.",
    ],
    pointsTitle: "Key concepts",
    points: [
      {
        t: "Compose file",
        d: "versionable description of services, networks and volumes.",
        color: "blue",
      },
      {
        t: "Service",
        d: "a container (or a group of replicas) defined in the file.",
        color: "signal",
      },
      {
        t: "Project network",
        d: "created automatically; the service name works as a hostname.",
        color: "violet",
      },
      {
        t: "`build` (`context`, `dockerfile`, `args`)",
        d: "builds the service's image locally.",
        color: "ember",
      },
      {
        t: "`depends_on`",
        d: "creation order, and not readiness.",
        color: "blue",
      },
      {
        t: "`init: true`",
        d: "puts an init as PID 1, so that `docker compose down` ends the Node service without waiting for the deadline.",
        color: "signal",
      },
      {
        t: "Declared volume",
        d: "the file's `volumes:` block creates the named volume used by the services.",
        color: "violet",
      },
      {
        t: "`docker compose config`",
        d: "shows the consolidated configuration and reports YAML errors.",
        color: "ember",
      },
    ],
    examplesTitle: "Worked examples",
    examples: [
      {
        label: "web and database",
        lang: "yaml",
        code: "services:\n  web:\n    # Builds using the Dockerfile in the current directory.\n    build:\n      context: .\n      dockerfile: Dockerfile\n    # Runs an init as PID 1, so that Node receives SIGTERM and the down is quick.\n    init: true\n    # Publishes only the service that receives external traffic.\n    ports:\n      - \"3000:3000\"\n    # The hostname db will be resolved by the Compose network's DNS.\n    environment:\n      DB_HOST: db\n    # Expresses the creation dependency, not the database's readiness.\n    depends_on:\n      - db\n\n  db:\n    # Pins the major version of the official image.\n    image: postgres:16-alpine\n    environment:\n      POSTGRES_PASSWORD: exemplo-local\n    # Persists the data outside the container lifecycle.\n    volumes:\n      - dados_db:/var/lib/postgresql/data\n\n# Declares the named volume used by the database.\nvolumes:\n  dados_db:",
        note: "Commands:",
      },
      {
        label: "terminal",
        lang: "sh",
        code: "# Builds images and starts the services in the background.\n$ docker compose up --detach --build\n\n# Shows the application's state.\n$ docker compose ps\n\n# Follows the services' logs.\n$ docker compose logs --follow\n\n# Tears down containers and networks, preserving the volume.\n$ docker compose down\n\n# expected output\nNAME          IMAGE                SERVICE   STATUS\nprojeto-db-1  postgres:16-alpine   db        Up\nprojeto-web-1 projeto-web          web       Up",
        note: "The `projeto` prefix is the name of the folder where `compose.yaml` is. In the `etapa07/` folder, the names will be `etapa07-db-1` and `etapa07-web-1`, and the volume will be `etapa07_dados_db`. Pin the major version of Postgres and keep it: the data files of one major version are not compatible with another, so switching from `16` to a newer version over the same volume requires a migration procedure.",
      },
      {
        label: "build with an alternative Dockerfile and arguments",
        lang: "yaml",
        code: 'services:\n  frontend:\n    build:\n      # Folder used as the base of the build (and as the context sent to Docker).\n      context: ./frontend\n      # Specific file for the development environment.\n      dockerfile: Dockerfile.dev\n      # Build parameters, read by the Dockerfile\'s ARG instructions.\n      args:\n        REACT_APP_API_URL: "http://localhost:3000"',
        note: "For the `args` to take effect, the Dockerfile must declare the parameter:",
      },
      {
        label: "Dockerfile",
        lang: "sh",
        code: "# Declares the parameter; without this line, the value passed by Compose is ignored.\nARG REACT_APP_API_URL",
        note: 'This example is a reading template (it needs a real `frontend` folder). When an argument is not consumed by any `ARG`, Docker warns that "one or more build-args were not consumed".',
      },
    ],
    commands: [
      {
        cmd: "docker compose config",
        note: "validates the file and shows the consolidated configuration",
      },
      {
        cmd: "docker compose config --quiet",
        note: "only validates, without printing",
      },
      {
        cmd: "docker compose up --detach --build",
        note: "builds (if needed) and starts in the background",
      },
      {
        cmd: "docker compose ps",
        note: "lists the project's containers and their state",
      },
      {
        cmd: "docker compose logs --follow",
        note: "follows the logs of all services (or of one, with `docker compose logs db`)",
      },
      {
        cmd: "docker compose exec service command",
        note: "runs a command inside a running service",
      },
      {
        cmd: "docker compose stop service",
        note: "and `docker compose start service`: stop and resume a service",
      },
      {
        cmd: "docker compose down",
        note: "removes containers and networks, preserving the volumes",
      },
      {
        cmd: "docker compose down --volumes",
        note: "also removes the volumes, deleting the data; use only when the loss is intentional",
      },
    ],
    handsOn: [
      "Save the example as `compose.yaml` next to the `Dockerfile` and the `server.js` from Stage 03.",
      "Run `docker compose config` before starting. This command shows the consolidated configuration and detects YAML errors.",
      "Run `docker compose up --detach --build`.",
      "Check `docker compose ps` and `docker compose logs db`.",
      "From inside the `web` service, confirm discovery of the database by name with `docker compose exec web nslookup db`. The output should show the name `db` and an internal IP address.",
      "Finish with `docker compose down`. Do not use `--volumes` if you want to preserve the data. Then run `docker volume ls` and note that the database volume is still there, named `<folder>_dados_db`.",
    ],
    tip: "Run `docker compose config` whenever you edit the YAML, before `up`. It catches indentation errors and shows the final values (expanded variables, combined files), which saves a lot of trial and error.",
    takeaway:
      "Compose turns a fragile sequence of commands into a versionable definition of the application.",
    figures: [
      {
        items: [
          {
            src: "/guides/containers/etapa07-compose-aplicacao.webp",
            alt: "An external user reaches the frontend service on port 443, which talks to the backend service over a network; the backend writes to a persistent volume, and the HTTP configuration and server certificate are mounted read-only in the frontend.",
            caption:
              "A Compose application brings together services, the network between them, the volume that persists data and the mounted files, all described in one file.",
          },
        ],
        credit: "Diagram: docs.docker.com, Docker, Inc., Apache 2.0",
      },
    ],
  },
  {
    id: "m8",
    num: "08",
    navTitle: "Environments and CI",
    tag: "operations",
    title: "Environments, restart, scaling and CI",
    lead: "Development needs a bind mount and detailed logs. Production needs a ready-made image and less exposure. Copying the whole Compose file for each environment creates nearly identical files that drift apart over time. Besides that, a process can fail temporarily and not come back on its own, and a test pipeline needs a disposable environment that resembles the real one.",
    concept: [
      "**Multiple Compose files.** Compose combines files in the order given by `-f`, and later ones override earlier ones, as long as the services keep the same name. A production file can replace only the image, ports or variables needed, without duplicating the base YAML:",
      "```sh\ndocker compose \\\n  -f compose.yaml \\\n  -f compose.prod.yaml \\\n  config\n```",
      "Use `config` to check the result before starting. By default, `docker compose up` (without `-f`) automatically loads `compose.yaml` and, if it exists, `compose.override.yaml` (in the old names, `docker-compose.yml` and `docker-compose.override.yml`). This makes the override the natural place for development adjustments. When using `-f` explicitly, only the listed files are loaded.",
      "**Restart policies:**",
      "- `no` (default): does not restart automatically.",
      "- `on-failure`: restarts when the process ends with a non-zero code; accepts a limit on attempts (`on-failure:3`).",
      "- `always`: tries to keep the container active, whatever the reason for the stop.",
      "- `unless-stopped`: similar to `always`, but respects a manual stop.",
      "Do not put `always` on everything: understand the role of each service. A database usually does fine with `unless-stopped`; an API that depends on the database can use `on-failure` with a limit, to avoid infinite loops when the error is in the configuration; a queue consumer that must always be active can use `always`. A restart policy does not solve startup order nor guarantee that a dependency is ready. For readiness, combine `healthcheck` and conditional dependencies (`depends_on` with `condition: service_healthy`) when your Compose version supports it, and keep retries in the application itself.",
      "**Scaling.** `docker compose up --scale worker=3` creates replicas of a service. Each replica is an independent instance, and a fixed port mapping such as `8080:3000` prevents several replicas on the same host, because port 8080 can only be occupied once. Replicas behind a single port require a load balancer in front of them.",
      "**CI (continuous integration).** The same definition that runs on the developer's machine can be used in a pipeline: start the dependencies (for example, a Node.js application and a Postgres database), run the integration tests and remove everything. This brings consistency between the local environment and the build pipeline, avoids depending on external services or mocks for everything and brings the test environment closer to production. Compose works on practically any CI provider (GitHub Actions, GitLab CI, Bitbucket, Jenkins).",
    ],
    pointsTitle: "Key concepts",
    points: [
      {
        t: "Override",
        d: "file that changes only what varies between environments.",
        color: "blue",
      },
      {
        t: "Multiple `-f`",
        d: "explicitly defines which files to combine and in what order.",
        color: "signal",
      },
      {
        t: "`restart`",
        d: "reaction to process shutdowns; does not replace a readiness check.",
        color: "violet",
      },
      {
        t: "`on-failure:N`",
        d: "restarts at most N times after failures.",
        color: "ember",
      },
      {
        t: "`--scale`",
        d: "creates replicas; a fixed port on the host limits it to one replica.",
        color: "blue",
      },
      {
        t: "`--wait`",
        d: "makes `up` wait until the services with a healthcheck become healthy.",
        color: "signal",
      },
      {
        t: "CI with Compose",
        d: "disposable environment, start, test and tear down.",
        color: "violet",
      },
    ],
    examplesTitle: "Worked examples",
    examples: [
      {
        label: "base and production",
        lang: "yaml",
        code: 'services:\n  web:\n    # Uses a public image so that the example runs without an external project.\n    image: nginx:alpine\n    # Restarts only on process failure, up to three times.\n    restart: on-failure:3\n    labels:\n      ambiente: desenvolvimento\n    healthcheck:\n      # wget already exists in this variant of the image.\n      test: ["CMD", "wget", "--quiet", "--spider", "http://localhost"]\n      interval: 5s\n      timeout: 2s\n      retries: 5',
        intro: "`compose.yaml`:",
        note: "`compose.prod.yaml`:",
      },
      {
        label: "base and production (2)",
        lang: "yaml",
        code: "services:\n  web:\n    # The additional file swaps the image channel and the environment.\n    image: nginx:stable-alpine\n    labels:\n      ambiente: producao",
        note: "Expected output of `docker compose -f compose.yaml -f compose.prod.yaml config`, summarized (the real output also includes other fields, such as `name`, networks and the full healthcheck):",
      },
      {
        label: "base and production (3)",
        lang: "yaml",
        code: "services:\n  web:\n    image: nginx:stable-alpine\n    restart: on-failure:3\n    labels:\n      ambiente: producao",
      },
      {
        label: "automatic override for development",
        lang: "yaml",
        code: 'services:\n  web:\n    # Publishes the port only in the development environment.\n    ports:\n      - "8080:80"\n    # Mounts the local folder to edit without rebuilding.\n    volumes:\n      - ./site:/usr/share/nginx/html:ro',
        intro: "With the `compose.yaml` above, create `compose.override.yaml` next to it:",
      },
      {
        label: "terminal",
        lang: "sh",
        code: "# Prepares the folder with a page.\n$ mkdir -p site && echo '<h1>dev</h1>' > site/index.html\n\n# Without -f: Compose loads compose.yaml and compose.override.yaml on its own.\n$ docker compose config\n\n# Starts and queries.\n$ docker compose up --detach --wait\n$ curl http://localhost:8080\n\n# With explicit -f, the override is NOT loaded: port 8080 no longer appears.\n$ docker compose -f compose.yaml config\n\n$ docker compose down\n\n# expected output\n<h1>dev</h1>",
      },
      {
        label: "restart and scaling",
        lang: "yaml",
        code: "# Both services use a public image and do not require an external project.\nservices:\n  falhador:\n    image: alpine\n    # Prints a line and ends with an error (code 1).\n    command: sh -c 'echo tentativa; exit 1'\n    # Restarts up to 3 times and then gives up.\n    restart: on-failure:3\n\n  worker:\n    image: alpine\n    # Stays alive for 5 minutes; with no published port, it accepts several replicas.\n    command: sleep 300",
      },
      {
        label: "terminal (2)",
        lang: "sh",
        code: "# Starts everything with 3 replicas of the worker.\n$ docker compose up --detach --scale worker=3\n\n# Shows worker-1, worker-2 and worker-3 running.\n$ docker compose ps\n\n# After a few seconds, falhador runs out of attempts and stays stopped.\n# RestartCount indicates how many times Docker restarted it.\n$ docker inspect --format '{{.State.Status}} reinicios={{.RestartCount}}' $(docker compose ps --all -q falhador)\n\n# Each attempt left a line in the logs.\n$ docker compose logs falhador\n\n$ docker compose down\n\n# expected output\nNAME               SERVICE   STATUS\npasta-worker-1     worker    Up ...\npasta-worker-2     worker    Up ...\npasta-worker-3     worker    Up ...\nexited reinicios=3\nfalhador-1  | tentativa\nfalhador-1  | tentativa\nfalhador-1  | tentativa\nfalhador-1  | tentativa",
        note: '`docker compose ps` lists the three `worker` replicas (and, depending on the moment, `falhador` restarting or already stopped), with the name of your folder in place of `pasta`. There are four `tentativa` lines: the original run and the three restarts. If you published a fixed port on the `worker` (for example, `"8080:80"`) and asked for three replicas, the second would fail with an error of the "port is already allocated" kind.',
      },
      {
        label: "terminal (3)",
        lang: "sh",
        code: "#!/bin/sh\n# ci.sh: script of a pipeline that starts the environment, tests and tears it down.\n\n# Stops the script at the first error.\n$ set -e\n\n# Ensures cleanup even if a test fails.\n# --volumes is intentional here: the CI environment is disposable.\n$ trap 'docker compose down --volumes' EXIT\n\n# --wait returns only when services with a healthcheck become healthy.\n$ docker compose up --detach --wait\n\n# Validates the Nginx configuration inside the reproducible service.\n$ docker compose exec -T web nginx -t",
        note: "The `-T` option disables terminal allocation, which does not exist in a pipeline. The equivalent commands, in a manual run, are:",
      },
      {
        label: "terminal (4)",
        lang: "sh",
        code: "$ docker compose up --detach --wait\n$ docker compose exec web nginx -t\n$ docker compose down\n\n# expected output\nnginx: the configuration file /etc/nginx/nginx.conf syntax is ok\nnginx: configuration file /etc/nginx/nginx.conf test is successful",
        note: "`--wait` does not exist in older versions of Docker Compose. Confirm with `docker compose up --help`. If the option does not exist, update the plugin or follow `docker compose ps` until the service appears as `healthy`; do not treat a plain `Up` as proof of readiness.",
      },
    ],
    commands: [
      {
        cmd: "docker compose -f compose.yaml -f compose.prod.yaml config",
        note: "shows the result of combining the files",
      },
      {
        cmd: "docker compose -f compose.yaml -f compose.prod.yaml up --detach --wait",
        note: "starts the combined environment and waits for readiness",
      },
      {
        cmd: "docker compose up --detach --scale servico=3",
        note: "creates three replicas of the service",
      },
      {
        cmd: "docker compose ps --all",
        note: "also lists the containers that have already finished",
      },
      {
        cmd: "docker compose exec -T service command",
        note: "runs a command without a terminal (advised in CI)",
      },
      {
        cmd: "docker inspect --format '{{.RestartCount}}' container",
        note: "shows how many times Docker restarted the container",
      },
      {
        cmd: "docker compose down",
        note: "ends the resources without removing persistent volumes",
      },
    ],
    handsOn: [
      'Create an empty folder and save in it the two YAML files from the "base and production" example. No Dockerfile or additional code is needed.',
      "Compare `docker compose -f compose.yaml config` with `docker compose -f compose.yaml -f compose.prod.yaml config`.",
      "Note the image tag and the value of the `ambiente` label in the consolidated result: in the first command `nginx:alpine` and `desenvolvimento` appear; in the second, `nginx:stable-alpine` and `producao`.",
      "Run `docker compose -f compose.yaml -f compose.prod.yaml up --detach --wait`.",
      "Confirm `healthy` with `docker compose -f compose.yaml -f compose.prod.yaml ps`. The status column should end in `(healthy)`.",
      "Validate Nginx with `docker compose -f compose.yaml -f compose.prod.yaml exec web nginx -t`. The output should end in `test is successful`. End with `docker compose -f compose.yaml -f compose.prod.yaml down`.",
      "In another folder, run the restart and scaling example. Confirm three `worker` replicas in `docker compose ps` and the `reinicios=3` of `falhador`. End with `docker compose down`.",
      'Still in that folder, add `ports: ["8080:80"]` to the `worker` service and run `docker compose up --detach --scale worker=2`. Note the port conflict: one of the replicas does not start and Docker reports `Bind for 0.0.0.0:8080 failed: port is already allocated`. Finish with `docker compose down` to free the folder and the port.',
    ],
    tip: "Always start with `docker compose config` when combining files. Seeing the consolidated result before starting avoids the surprise of an override that did not overwrite what you expected (or of a `-f` that switched off the automatic override).",
    takeaway:
      "Additional Compose files change only what varies between environments; restart recovers processes, but does not replace a readiness check.",
    figures: [
      {
        items: [
          {
            src: "/guides/containers/etapa08-override.en.svg",
            alt: "compose.yaml with web using nginx:alpine, restart on-failure:3 and healthcheck, plus compose.prod.yaml with web using nginx:stable-alpine, result in a config where web uses nginx:stable-alpine and keeps the restart and healthcheck.",
            caption:
              "With `-f`, the next file overrides the previous one for a service with the same name: only the image changes, and the rest comes from the base file. Always check with `config`.",
          },
        ],
        credit: "Diagram: made for this guide",
      },
    ],
  },
  {
    id: "m9",
    num: "09",
    navTitle: "Security",
    tag: "least privilege",
    title: "Layered security",
    lead: "A vulnerable application runs as root, gets more capabilities than it needs and carries a token inside the image. If it is exploited, the attacker finds permissions and data that were never needed for the service's task.",
    concept: [
      "Since the container shares the kernel with the host, trusting the default isolation is not enough: a container escape can give access to the system. The defense comes from combining several layers, each one reducing what an exploit could do:",
      "- **Namespaces** isolate the view of resources (Stage 01).",
      "- **Capabilities** split the traditional privileges of root into smaller permissions. By default, the container's root already has fewer powers than the host's root. You remove dangerous capabilities (such as `NET_ADMIN` and `SYS_ADMIN`) with `--cap-drop` and grant a specific one with `--cap-add` only if the service proves it needs it. The rule is **least privilege**.",
      "- **Seccomp** works as a filter of system calls (syscalls). Linux has hundreds of them, and seccomp lets you block several, based on an allow list. Docker already ships a default profile that blocks dangerous calls, and it is possible to supply your own, more restrictive profile with `--security-opt seccomp=profile.json`.",
      "- **AppArmor or SELinux**, when enabled on the host, add mandatory access control.",
      "- **Non-root user** reduces the impact of an exploit. By default, the container runs as root; create an unprivileged user in the image and use `USER`.",
      "- **Minimal permissions** avoid `chmod 777` as a generic solution: understand who should own what and grant the minimum necessary.",
      "- **Read-only filesystem** (`--read-only`), with `tmpfs` only where the application needs to write, prevents an attacker from altering the running image.",
      "- **Small, up-to-date image** reduces the tools and vulnerabilities available.",
      "- **Secrets in their own files** keep sensitive values out of the Dockerfile and the environment (Stage 10).",
      "The root user inside a container is not automatically identical to the host's root, since namespaces and capabilities impose limits. Even so, running as UID 0 without need increases risk, especially with dangerous mounts, extra capabilities or runtime flaws.",
      'When creating the user in the image, use `adduser` (or `useradd`, depending on the base distribution) and set the owner of the copied files with `--chown`. When using volumes or bind mounts, the host user may differ from the container user, which causes permission problems; the common solution is to run the container with the same UID and GID as the host (`--user "$(id -u):$(id -g)"`).',
      "Namespaces are not unbreakable walls and `USER node` does not solve security on its own. The defense comes from the combination of controls, and the real implementation belongs to the kernel, the runtime, the image and the run options. Do not mount `/var/run/docker.sock` in ordinary applications: whoever controls that socket can control the Docker Engine and, in practice, compromise the host.",
    ],
    pointsTitle: "Key concepts",
    points: [
      {
        t: "Defense in depth",
        d: "several layers, none sufficient alone.",
        color: "blue",
      },
      {
        t: "Non-root user (`USER`)",
        d: "the process runs without administrative privileges.",
        color: "signal",
      },
      {
        t: "`--chown`",
        d: "sets the owner of the files copied into the image.",
        color: "violet",
      },
      {
        t: "`--cap-drop ALL` and `--cap-add`",
        d: "removes all capabilities and gives back only the indispensable ones.",
        color: "ember",
      },
      {
        t: "Seccomp",
        d: "system call filter; there is a default Docker profile.",
        color: "blue",
      },
      {
        t: "`--read-only` and `--tmpfs`",
        d: "immutable root with writable, ephemeral areas only where needed.",
        color: "signal",
      },
      {
        t: "`--user uid:gid`",
        d: "makes the container use the same IDs as the host, avoiding permission problems on mounts.",
        color: "violet",
      },
      {
        t: "`docker.sock`",
        d: "access to it is equivalent to control over Docker; do not mount it in ordinary applications.",
        color: "ember",
      },
    ],
    examplesTitle: "Worked examples",
    examples: [
      {
        label: "Dockerfile",
        lang: "sh",
        code: '# Template for a Node.js application on Alpine.\nFROM node:lts-alpine\n\n# Creates an unprivileged user; -D skips the password (Alpine command).\n# On Debian bases the equivalent is: RUN useradd -m appuser\nRUN adduser -D appuser\n\nWORKDIR /app\n\n# Copies the files already owned by the application user.\nCOPY --chown=appuser:appuser . .\n\n# Installs dependencies per the lockfile, still with build privilege.\nRUN npm ci --omit=dev\n\n# The following instructions and the main process run without privileges.\nUSER appuser\n\nCMD ["npm", "start"]',
        note: "This template guarantees that there is a user without root privileges, that the files were copied with the correct permission and that the whole application runs with limited permissions. In an official Node image, the `node` user already exists, and it is enough to use `COPY --chown=node:node` and `USER node`. A minimal, runnable version to see the effect:",
      },
      {
        label: "Dockerfile (2)",
        lang: "sh",
        code: 'FROM alpine\n# Creates the user and starts running as it.\nRUN adduser -D appuser\nUSER appuser\n# The id command shows which user the process is running as.\nCMD ["id"]',
      },
      {
        label: "terminal",
        lang: "sh",
        code: "$ docker build --tag usuario-demo .\n$ docker run --rm usuario-demo\n\n# expected output\nuid=1000(appuser) gid=1000(appuser) groups=1000(appuser)",
      },
      {
        label: "Dockerfile (3)",
        lang: "sh",
        code: '# Starts from an official, versioned image.\nFROM node:lts-alpine\n\nWORKDIR /app\n\n# Copies the files already owned by the node user.\nCOPY --chown=node:node . .\n\n# Installs dependencies per the lockfile.\nRUN npm ci --omit=dev\n\n# The following runtime instructions use an unprivileged UID.\nUSER node\n\nCMD ["npm", "start"]',
        intro:
          'The Dockerfile from the previous block ("creating the user in the image") and the runtime one below are reading templates. The `docker run` commands that follow test the flags directly on the official image, without building anything.',
        note: "The proof that `--read-only` works has to be done as root, because an ordinary user already has no permission to write to `/` even without the option. Compare the two commands:",
      },
      {
        label: "terminal (2)",
        lang: "sh",
        code: "# As root, without --read-only: writing to the root works.\n$ docker run --rm alpine sh -c 'touch /liberado && echo \"escrita permitida\"'\n\n# As root, with --read-only: the root refuses the write, even for root.\n$ docker run --rm --read-only alpine touch /bloqueado\n\n# expected output\nescrita permitida\ntouch: /bloqueado: Read-only file system",
        note: "Now the combined command, with the final runtime configuration: ordinary user, no capabilities, read-only root and `/tmp` as a writable tmpfs.",
      },
      {
        label: "terminal (3)",
        lang: "sh",
        code: '# Removes all extra capabilities at runtime.\n# Add a capability only if the service proves it needs it.\n$ docker run --rm \\\n  --user node \\\n  --cap-drop ALL \\\n  --read-only \\\n  --tmpfs /tmp \\\n  node:lts-alpine \\\n  sh -c \'if touch /bloqueado 2>/dev/null; then exit 1; else echo "raiz bloqueada"; fi; echo "tmpfs gravável" > /tmp/teste; cat /tmp/teste\'\n\n# expected output\nraiz bloqueada\ntmpfs gravável',
        note: "The first `touch` fails for two reasons combined (the `node` user does not own the root and the root is read-only); the isolated proof of `--read-only` is the earlier pair of commands, run as root. The second command writes to `/tmp` because that path received a writable, ephemeral `tmpfs`.",
      },
      {
        label: "capabilities in practice",
        lang: "sh",
        code: "# With the default capabilities, the container's root can change a file's owner.\n$ docker run --rm alpine sh -c 'chown nobody /tmp && echo \"chown permitido\"'\n\n# Without capabilities, even the container's root loses that power.\n$ docker run --rm --cap-drop ALL alpine sh -c 'chown nobody /tmp && echo \"chown permitido\"'\n\n# expected output\nchown permitido\nchown: /tmp: Operation not permitted",
      },
      {
        label: "UID and GID on bind mounts",
        lang: "sh",
        code: '# Host folder that will be mounted in the container.\n$ mkdir -p dados-host\n\n# Without --user: the container runs as root and the file is born owned by the host\'s root.\n$ docker run --rm --volume "$(pwd)/dados-host:/dados" alpine touch /dados/como-root\n\n# With --user: the file is born owned by your user.\n$ docker run --rm --user "$(id -u):$(id -g)" \\\n  --volume "$(pwd)/dados-host:/dados" alpine touch /dados/como-eu\n\n# Compares the owners of the two files.\n$ ls -l dados-host\n\n# The real problem: editing from the host the file that belongs to root.\n$ echo x >> dados-host/como-root\n# The file created with --user, on the other hand, is yours and accepts the edit.\n$ echo x >> dados-host/como-eu\n\n# Cleans up: since the FOLDER is yours, you can delete both files from the host,\n# even the one that belongs to root; what you cannot do is edit it.\n$ rm -f dados-host/como-root dados-host/como-eu\n$ rmdir dados-host\n\n# expected output\n-rw-r--r-- 1 root  root  0 ... como-root\n-rw-r--r-- 1 seu-usuario seu-grupo 0 ... como-eu\nbash: dados-host/como-root: Permission denied',
        note: "The exact error message depends on your shell, but `Permission denied` appears only when editing root's file. On Docker Desktop and in Docker's rootless mode, the translation of owners between host and container may erase this difference, and both files appear as yours.",
      },
    ],
    commands: [
      {
        cmd: "docker run --user node image",
        note: "runs as a specific user",
      },
      {
        cmd: 'docker run --user "$(id -u):$(id -g)" image',
        note: "uses the IDs of the host's current user",
      },
      {
        cmd: "docker run --cap-drop ALL image",
        note: "removes all capabilities",
      },
      {
        cmd: "docker run --cap-drop ALL --cap-add NET_BIND_SERVICE image",
        note: "gives back only one needed capability (example: opening ports below 1024)",
      },
      {
        cmd: "docker run --read-only --tmpfs /tmp image",
        note: "read-only root with `/tmp` writable in memory",
      },
      {
        cmd: "docker run --security-opt seccomp=profile.json image",
        note: "uses a custom seccomp profile",
      },
      {
        cmd: "docker run image id",
        note: "shows which user the process runs as",
      },
    ],
    handsOn: [
      "Run `docker run --rm node:lts-alpine id` and note the image's default user (`uid=0(root)`).",
      "Run `docker run --rm --user node node:lts-alpine id` and confirm `uid=1000(node)`.",
      "Prove `--read-only` as root: run `docker run --rm alpine sh -c 'touch /liberado && echo \"escrita permitida\"'` and then `docker run --rm --read-only alpine touch /bloqueado`. The output of the second should be `touch: /bloqueado: Read-only file system`.",
      "Run the full command from the runtime example with `--read-only` and `--tmpfs /tmp`, and confirm the two expected messages: `raiz bloqueada` and `tmpfs gravável`.",
      "Remove `--tmpfs /tmp` from the combined command and repeat. Writing to `/tmp` also fails, because it goes back to being part of the read-only root. The expected output is `raiz bloqueada`, followed by `sh: can't create /tmp/teste: Read-only file system` and `cat: can't open '/tmp/teste': No such file or directory`.",
      "Run the two commands from the capabilities example and compare the result.",
      "Build and run `usuario-demo` and confirm that `id` shows `appuser`, and not `root`.",
      "Run the UID and GID example and confirm that the owners of the two files are different and that editing root's file from the host is denied (`Permission denied`).",
    ],
    tip: "When an application fails after `--cap-drop ALL`, do not go back out of reflex. Read the error, identify which operation was denied and give back only the corresponding capability with `--cap-add`. That is how the minimum set is discovered.",
    takeaway:
      "Container security is defense in depth: user, permissions, capabilities, system calls, image and mounts must cooperate.",
    figures: [
      {
        items: [
          {
            src: "/guides/containers/etapa09-camadas.en.svg",
            alt: "Nested layers around the application process, which runs as USER node: shared host kernel, namespaces and cgroups, AppArmor or SELinux, seccomp, --cap-drop ALL and --read-only with --tmpfs /tmp. On the side, the mounted docker.sock crosses every layer.",
            caption:
              "Each layer reduces what an exploit can do, and none is enough on its own. Mounting `docker.sock` cancels all of them, because it gives control of the daemon, which runs as root on the host.",
          },
        ],
        credit: "Diagram: made for this guide",
      },
    ],
  },
  {
    id: "m10",
    num: "10",
    navTitle: "Context and secrets",
    tag: "supply chain",
    title: "Build context, secrets and image analysis",
    lead: "A `docker build .` sends `.git`, `node_modules`, logs and `.env` into the context. The build is slow, the cache invalidates needlessly and a secret may end up copied into a layer. Even when deleted in a later instruction, it may remain in the history of an earlier layer. At another point in the cycle, a password placed in `environment` or in a `.env` shows up in inspection commands and may end up in Git.",
    concept: [
      "The **build context** is everything in the folder given to `docker build` (or in the path you pass). By default, Docker tries to send everything, including `.git`, `node_modules`, large files and secrets. The **`.dockerignore`** works like a `.gitignore` for the build: it lists what should not be sent to the context. The result is a faster build, a smaller and safer image, and fewer cache invalidations. Keep the `.dockerignore` at the root of the project, near the Dockerfile, and run `docker build` as close as possible to the Dockerfile. If the build seems too heavy, check what is in the context: it is common to send gigabytes without noticing.",
      "Consider the project:",
      "```text\nmeu-app/\n├── node_modules/\n├── .env\n├── .git/\n├── build/\n├── src/\n├── Dockerfile\n└── compose.yaml\n```",
      "A suitable `.dockerignore`:",
      "```gitignore\n# Local dependencies will be installed inside the image.\nnode_modules\n\n# Local configuration and possible secrets do not enter the context.\n.env\n.env.*\n\n# History, metadata and temporary files are unnecessary.\n.git\n*.log\ncoverage\ndist\nbuild\n```",
      "This avoids sending thousands of `node_modules` files, prevents the `.env` from ending up inside the image, avoids copying the history of the `.git` folder and prevents artifacts from earlier builds from getting in by mistake. Each stack has different needs, so review any `.dockerignore` suggested by tools or code assistants for your own reality.",
      "**Environment variables and secrets.** `env_file` is handy for local configuration, but does not turn values into secrets. They can appear in the container's configuration and inspection (`docker inspect`). `.env` files with credentials must not be versioned. The Compose `secrets:` directive mounts the value as a file inside the container, at `/run/secrets/<name>`, which avoids leaving it in the process environment. In local development, `env_file` remains handy; when the application gets staging or production, move the critical data to `secrets`.",
      "**Build parameters.** `ARG` declares a value available during the build, and `build.args` supplies that value through Compose. They are for non-confidential data, such as version, distribution channel or feature selection. Do not use `ARG` for a password or token: build values can appear in the history, in metadata and in pipeline records.",
      "**Image analysis tools.** Once you are past writing a lean Dockerfile, it is worth inspecting the image for real:",
      "- **Dive** shows the content and weight of each layer: what each `RUN`, `COPY` and `ADD` added, what is weighing it down and what can go.",
      "- **Snyk** checks for known vulnerabilities in the image and in dependencies, using a continuously maintained vulnerability database. It works from the command line and integrates with CI pipelines.",
      "One complements the other: Dive helps understand the size, and Snyk takes care of security.",
    ],
    pointsTitle: "Key concepts",
    points: [
      {
        t: "Build context",
        d: "what is sent to Docker in the build; everything in it can affect time, cache and exposure.",
        color: "blue",
      },
      {
        t: "`.dockerignore`",
        d: "filters the context before it is sent.",
        color: "signal",
      },
      {
        t: "Secret in a layer",
        d: "a secret copied into a layer stays in the history, even if it is deleted later.",
        color: "violet",
      },
      {
        t: "`env_file`",
        d: "convenient, but does not protect values.",
        color: "ember",
      },
      {
        t: "`secrets` (Compose)",
        d: "mounts the value as a file at `/run/secrets/<name>`.",
        color: "blue",
      },
      {
        t: "`ARG` / `build.args`",
        d: "non-confidential build parameters.",
        color: "signal",
      },
      {
        t: "Dive and Snyk",
        d: "analysis of layers and of vulnerabilities.",
        color: "violet",
      },
    ],
    examplesTitle: "Worked examples",
    examples: [
      {
        label: "Dockerfile",
        lang: "sh",
        code: "# Uses a concrete base before declaring the stage's argument.\nFROM node:lts-alpine\n\n# Declares a non-confidential parameter with a default value.\nARG APP_VERSION=dev\n\n# Records the version as metadata that can be queried in the image.\nLABEL org.opencontainers.image.version=$APP_VERSION",
        intro: "Use a folder with this `Dockerfile` and the `compose.yaml` right below.",
      },
      {
        label: "a non-confidential `ARG`",
        lang: "yaml",
        code: 'services:\n  app:\n    build:\n      context: .\n      args:\n        # The version guides the build, but is not a secret.\n        APP_VERSION: "1.4.0"\n    # Gives a fixed name to the built image, to query it later.\n    image: versao-demo',
      },
      {
        label: "terminal",
        lang: "sh",
        code: "# Builds the image of the app service, which will be named versao-demo.\n$ docker compose build\n\n# Reads the label recorded in the image.\n$ docker inspect --format '{{index .Config.Labels \"org.opencontainers.image.version\"}}' versao-demo\n\n# expected output\n1.4.0",
        note: "An `ARG` does not automatically become a runtime variable; it persists here only because it was deliberately recorded in a label.",
      },
      {
        label: "secret as a file in Compose",
        lang: "yaml",
        code: "services:\n  db:\n    image: postgres:16-alpine\n    environment:\n      # The image reads the content of the indicated file.\n      POSTGRES_PASSWORD_FILE: /run/secrets/db_password\n    secrets:\n      - db_password\n\nsecrets:\n  db_password:\n    # The file must exist locally and stay out of Git.\n    file: ./secrets/db_password.txt",
        note: "Inside the container, the content is at `/run/secrets/db_password`. In local Compose, this reduces accidental exposure by mounting the value as a file, but does not by itself create an encrypted vault. Protect the source file and use a suitable secrets manager in the target environment. To compare with the less safe form, `env_file`:",
      },
      {
        label: "secret as a file in Compose (2)",
        lang: "yaml",
        code: "services:\n  app:\n    image: minha-api\n    # Loads variables from the .env file (e.g. DB_USER, DB_PASSWORD).\n    # The values are visible in docker inspect.\n    env_file:\n      - .env",
      },
      {
        label: "Dockerfile (2)",
        lang: "sh",
        code: "FROM alpine\n# The secret goes into a layer.\nCOPY segredo.txt /tmp/segredo.txt\n# Deleting afterwards does NOT remove the earlier layer.\nRUN rm /tmp/segredo.txt",
      },
      {
        label: "terminal (2)",
        lang: "sh",
        code: '$ echo "senha-de-laboratorio" > segredo.txt\n$ docker build --tag vazamento .\n\n# The file no longer exists in the final filesystem...\n$ docker run --rm vazamento ls /tmp\n\n# ...but the COPY layer remains in the history, with a non-zero size.\n$ docker history vazamento\n\n# expected output\nIMAGE          CREATED         CREATED BY                                      SIZE      COMMENT\n<id>           ...             RUN /bin/sh -c rm /tmp/segredo.txt # buildkit   0B        buildkit.dockerfile.v0\n<id>           ...             COPY segredo.txt /tmp/segredo.txt # buildkit    21B       buildkit.dockerfile.v0\n<id>           ...             ...                                             ...',
        note: "The `RUN rm` line has `0B`, but the `COPY` line records 21 bytes: the 20 characters of `senha-de-laboratorio` and the line break. The size may appear rounded (for example, in kB) when Docker uses the containerd image store; what matters is that the `COPY` line is larger than `0B` and the `RUN rm` one stays at `0B`. The file is still inside that layer. Anyone who has the image can extract the content, and the script below does exactly that: it exports the image to a `.tar` file, opens the file and looks for the secret in each layer.",
      },
      {
        label: "terminal (3)",
        lang: "sh",
        code: '# Exports the whole image, with all layers, to a file.\n$ docker save vazamento --output vazamento.tar\n\n# Opens the exported file.\n$ mkdir extraido\n$ tar -xf vazamento.tar -C extraido\n\n# Tries to read tmp/segredo.txt from inside each extracted file.\n# Files that are not layers (indexes and manifests) fail silently.\n$ for arquivo in $(find extraido -type f); do\n$   tar -xOf "$arquivo" tmp/segredo.txt 2>/dev/null\n$ done\n\n# Cleans up the lab.\n$ rm -rf extraido vazamento.tar segredo.txt\n$ docker rmi vazamento\n\n# expected output\nsenha-de-laboratorio',
        note: "The secret appears in plain text, even though the `RUN rm` deleted the file. If your Docker version records paths with `./` in front, swap `tmp/segredo.txt` for `./tmp/segredo.txt` in the `tar`. The solution is to never let the secret enter the context (`.dockerignore`) and to deliver it at run time, as a file, never in a Dockerfile instruction.",
      },
      {
        label: "terminal (4)",
        lang: "sh",
        code: "# Creates a node_modules with a 50 MB file, just for the exercise.\n$ mkdir -p node_modules\n$ head -c 50000000 /dev/urandom > node_modules/pesado.bin\n\n# First build, WITHOUT .dockerignore: the large file enters the context.\n# --progress plain shows detailed progress, including the size of the context sent.\n$ docker build --progress plain --tag minha-app:analise .\n\n# expected output\n#3 [internal] load build context\n#3 transferring context: 50.00MB ...",
        intro:
          "Use the Stage 04 folder (the one with `server.js`, `package.json`, `build.js` and the multistage Dockerfile). It has no `node_modules` or `.env`, so create the weight on purpose, so that the `.dockerignore` has something to filter:",
        note: "Now create the example's `.dockerignore` in the same folder and build again:",
      },
      {
        label: "terminal (5)",
        lang: "sh",
        code: "# Creates the .dockerignore with the main exclusions.\n$ printf 'node_modules\\n.env\\n.env.*\\n.git\\n*.log\\ncoverage\\ndist\\nbuild\\n' > .dockerignore\n\n# Second build: the context now leaves node_modules out.\n$ docker build --progress plain --tag minha-app:analise .\n\n# expected output\n#3 [internal] load build context\n#3 transferring context: 2.xxkB ...",
        note: "The size drops from about 50 MB to a few kilobytes. Run the first build only once with the large file: BuildKit transfers the context incrementally, so repeating the build without changes shows a small value even without a `.dockerignore`. Afterwards, inspect the image:",
      },
      {
        label: "terminal (6)",
        lang: "sh",
        code: "# Shows the layers and commands that formed the image.\n$ docker history minha-app:analise\n\n# Shows the final size.\n$ docker images minha-app:analise\n\n# Removes the artificial weight from the lab.\n$ rm -rf node_modules\n\n# expected output\nIMAGE          TAG       SIZE\nminha-app      analise   ...MB",
        note: "If Dive or Snyk is installed (both require separate installation, and Snyk requires an account), the same image can be analyzed like this:",
      },
      {
        label: "terminal (7)",
        lang: "sh",
        code: "# Interactive navigation through the layers and the wasted space.\n$ dive minha-app:analise\n\n# Looks for known vulnerabilities in the image and the base.\n$ snyk container test minha-app:analise",
      },
    ],
    commands: [
      {
        cmd: "docker build --progress plain --tag name:tag .",
        note: "build with detailed output, including the size of the context sent",
      },
      {
        cmd: "docker history name:tag",
        note: "lists the layers and the instructions that created them, with size",
      },
      {
        cmd: "docker save name:tag --output file.tar",
        note: "exports the image with all layers to a file",
      },
      {
        cmd: "docker images name",
        note: "shows the final size of the image",
      },
      {
        cmd: "docker inspect --format '{{index .Config.Labels \"key\"}}' name:tag",
        note: "reads an image label",
      },
      {
        cmd: "docker compose config",
        note: "shows the effective values, including variables read from `env_file`; useful to notice what is exposed",
      },
      {
        cmd: "dive name:tag",
        note: "explores layers (requires installation)",
      },
      {
        cmd: "snyk container test name:tag",
        note: "looks for vulnerabilities (requires installation and an account)",
      },
    ],
    handsOn: [
      "Go into the Stage 04 folder and create the weight on purpose: `mkdir -p node_modules && head -c 50000000 /dev/urandom > node_modules/pesado.bin`.",
      "Run `docker build --progress plain --tag minha-app:analise .` only once and note the context size (about 50 MB).",
      "Create the example's `.dockerignore` in the same folder, repeat the build and compare the size sent (a few kB) and the cache reuse.",
      "Use `docker history minha-app:analise` to identify instructions that added more data. Remove the artificial weight with `rm -rf node_modules`.",
      'Reproduce the example "a secret that survives in the history": confirm in `docker history` the `COPY` line with 21B (or a slightly larger, rounded value, if Docker uses the containerd image store) and the `RUN rm` one with 0B, and run the `docker save` script to see `senha-de-laboratorio` appear in plain text.',
      "Reproduce the `ARG` example with `image: versao-demo` and confirm that `docker inspect` prints `1.4.0`.",
      "If Dive or Snyk is installed, analyze the same tag and record one point for improvement.",
    ],
    tip: "BuildKit also lets you deliver secrets to the build without writing them to any layer. If a build step really needs a credential (for example, downloading a private package), consult Docker's documentation on build secrets instead of resorting to `ARG` or `COPY`.",
    takeaway:
      "A secret that does not enter the context cannot leak through a layer created during the build.",
    figures: [
      {
        items: [
          {
            src: "/guides/containers/etapa10-contexto.en.svg",
            alt: "The meu-app folder: node_modules, .env, .git and build are struck through, because .dockerignore leaves them out; src, Dockerfile, compose.yaml and .dockerignore go in the context sent to the builder, which produces the image. Below, the warning that a secret copied during the build stays in the image history.",
            caption:
              "`.dockerignore` decides what never reaches the builder: the build gets faster and `.env` gets into no layer. A secret copied during the build stays in the history, even if deleted in a later instruction.",
          },
        ],
        credit: "Diagram: made for this guide",
      },
    ],
  },
  {
    id: "m11",
    num: "11",
    navTitle: "Troubleshooting",
    tag: "diagnostics",
    title: "Troubleshooting with an investigation order",
    lead: "A container goes into `Exited (1)`. Restarting it repeatedly does not explain the cause. Changing several settings at once can hide the symptom and create other problems.",
    concept: [
      "Use a predictable sequence, from the cheapest evidence to the most specific:",
      "1. **State:** `docker ps --all` shows whether the container is running, ended or restarting.",
      "1. **Logs:** `docker logs` shows the process's stdout and stderr.",
      "1. **Configuration:** `docker inspect` reveals command, mounts, network, ports and state.",
      "1. **Events:** `docker events` shows creation, start, stop, kill and removal in real time.",
      "1. **Process and resources:** `docker top` and `docker stats` show processes and consumption.",
      "1. **Internal test:** `docker exec` runs a check inside a container that is still active.",
      "`docker inspect` returns detailed JSON and is the source of answers to questions such as: which original command is being run (`Config.Cmd`), which volumes are mounted and where (`Mounts`), which ports are exposed and mapped (`NetworkSettings.Ports`), what the image is (`Image`) and whether the container is stopped by an error or restarting (`State`). To find out whether the container died from lack of memory, check `State.OOMKilled`. The `--format` option extracts exactly the desired field, and the full output can be combined with tools such as `jq` or used in shell scripts.",
      "The **exit code** tells part of the story: `0` indicates normal termination; any other value comes from the program itself or from Docker. Known values include `125` (Docker failed to run the `docker run`), `126` (the command exists but could not be invoked), `127` (the command was not found) and `137` (the process received SIGKILL). `137` has more than one origin: it can be lack of memory (in which case `OOMKilled` appears as `true`), but it also appears when a `docker stop` times out without the process answering SIGTERM and Docker sends SIGKILL (in which case `OOMKilled` remains `false`; this is the effect of PID 1 without a signal handler described in Stage 03). Always confirm with `OOMKilled` before concluding that memory ran out.",
      "`docker events` is lightweight and native, and follows state changes of containers, images, volumes and networks, with timestamps. It is especially useful in real-time troubleshooting, when testing automation scripts or during deploys. It can be filtered by type (`--filter type=container`) or by container (`--filter container=name`) and the output can feed scripts or a logging system.",
      "`docker restart` without evidence switches the system off and on without reading what it said: it may bring the service back for a few minutes, but it also wipes the operational context and does not identify the cause. The order above protects the diagnosis from guesswork: inspection comes before any restart.",
    ],
    pointsTitle: "Key concepts",
    points: [
      {
        t: "State and exit code",
        d: "the first data to look at, before logs.",
        color: "blue",
      },
      {
        t: "Logs",
        d: "the message the process itself left behind.",
        color: "signal",
      },
      {
        t: "`docker inspect --format`",
        d: "extracts a specific field from the metadata.",
        color: "violet",
      },
      {
        t: "`OOMKilled`",
        d: "indicates that the container was killed for lack of memory.",
        color: "ember",
      },
      {
        t: "Code 137",
        d: "SIGKILL; it can be lack of memory (`OOMKilled=true`) or a `docker stop` that timed out (`OOMKilled=false`).",
        color: "blue",
      },
      {
        t: "`docker events`",
        d: "timeline of everything Docker did.",
        color: "signal",
      },
      {
        t: "`docker top` and `docker stats`",
        d: "processes and consumption in real time.",
        color: "violet",
      },
      {
        t: "Hypothesis before evidence",
        d: "formulate what you expect to find and confirm it.",
        color: "ember",
      },
    ],
    examplesTitle: "Worked examples",
    examples: [
      {
        label: "terminal",
        lang: "sh",
        code: "# The shell records an error message and ends with code 42.\n$ docker run --name falha alpine \\\n  sh -c 'echo \"configuração ausente\" >&2; exit 42'\n\n# Confirms the exit code without reading all the JSON.\n$ docker inspect --format \\\n  'status={{.State.Status}} exit={{.State.ExitCode}} oom={{.State.OOMKilled}}' \\\n  falha\n\n# Retrieves the message emitted by the process.\n$ docker logs falha\n\n# expected output\nconfiguração ausente\nstatus=exited exit=42 oom=false\nconfiguração ausente",
        note: "The message `configuração ausente` appears twice: the first is the stderr of `docker run` itself, shown in the terminal while the container was running; the second is the same message retrieved afterwards by `docker logs`, which reads what was recorded. The container keeps existing (stopped) until you remove it, and the removal is left for the end of the diagnosis:",
      },
      {
        label: "terminal (2)",
        lang: "sh",
        code: "# Removes the resource only after recording the cause.\n$ docker rm falha",
        note: "To observe events in real time, open a terminal:",
      },
      {
        label: "terminal (3)",
        lang: "sh",
        code: "# Filters events of the container type.\n$ docker events --filter type=container",
        note: "In another terminal, start and stop a container. The output will show actions such as `create`, `start`, `die` and `destroy`.",
      },
      {
        label: "terminal (4)",
        lang: "sh",
        code: "# Generates a sequence of events: create, attach, start, die, destroy.\n$ docker run --rm --name evento alpine true\n\n# expected output\n... container create <id> (image=alpine, name=evento)\n... container attach <id> (image=alpine, name=evento)\n... container start <id> (image=alpine, name=evento)\n... container die <id> (exitCode=0, image=alpine, name=evento)\n... container destroy <id> (image=alpine, name=evento)",
      },
      {
        label: "errors that Docker itself reports",
        lang: "sh",
        code: '# Nonexistent command: Docker cannot start the process.\n$ docker run --rm alpine comando-inexistente\n$ echo "codigo=$?"\n\n# expected output\ndocker: Error response from daemon: ... executable file not found in $PATH ...\ncodigo=127',
        note: "The message says exactly what the problem is (executable not found) and the code follows the `127` convention. Compare with the previous example, in which the error comes from the program itself (`42`).",
      },
      {
        label: "processes and consumption",
        lang: "sh",
        code: '# Starts a lab container.\n$ docker run --detach --name observado alpine sleep 120\n\n# Processes inside the container.\n$ docker top observado\n\n# CPU and memory consumption, a single reading.\n$ docker stats --no-stream observado\n\n# Original command, as Docker recorded it.\n$ docker inspect --format \'{{json .Config.Cmd}}\' observado\n\n# Cleans up the lab.\n$ docker rm --force observado\n\n# expected output\nUID    PID    PPID   C   STIME   TTY   TIME       CMD\nroot   ...    ...    0   ...     ?     00:00:00   sleep 120\nCONTAINER ID   NAME       CPU %   MEM USAGE / LIMIT   MEM %   ...\nabc123         observado  0.00%   ...MiB / ...GiB     ...     ...\n["sleep","120"]',
      },
    ],
    commands: [
      {
        cmd: "docker ps --all",
        note: "state of all containers",
      },
      {
        cmd: "docker logs name",
        note: "complete logs; `docker logs --tail 50 name` shows only the end",
      },
      {
        cmd: "docker inspect name",
        note: "complete metadata",
      },
      {
        cmd: "docker inspect --format '{{.State.Status}}' name",
        note: "only the state (`running`, `exited`, ...)",
      },
      {
        cmd: "docker inspect --format '{{json .Config.Cmd}}' name",
        note: "the original command",
      },
      {
        cmd: "docker events",
        note: "real-time events; `docker events --filter type=container` and `docker events --filter container=name` restrict the output",
      },
      {
        cmd: "docker top name",
        note: "the container's processes",
      },
      {
        cmd: "docker stats",
        note: "resource consumption (`--no-stream` makes a single reading)",
      },
      {
        cmd: "docker exec -it name sh",
        note: "opens a shell in an active container to test from the inside",
      },
    ],
    handsOn: [
      "Cause the failure by running only the first command of the example (the `docker run --name falha ...`), without the `docker rm`: the removal is left for step 5. The message `configuração ausente` already appears in the terminal during this command.",
      "Before looking at the logs, formulate a hypothesis using only state and exit code: run the example's `docker inspect --format` and read `status=exited exit=42 oom=false`.",
      "Check the hypothesis with `docker logs falha`. The same message appears a second time, now coming from Docker's record.",
      "Use `docker inspect --format '{{json .Config.Cmd}}' falha` to see the original command.",
      "Remove the container only after recording the cause: `docker rm falha`.",
      "Run `docker run --rm alpine comando-inexistente`, read the error and check the code with `echo $?`. The expected output is `127`.",
      "With `docker events --filter type=container` open in one terminal, run `docker run --rm --name evento alpine true` in another and identify each event (`create`, `attach`, `start`, `die`, `destroy`).",
    ],
    tip: "Write your hypothesis before looking at each piece of evidence, even if in one line. This trains you to read the state and the exit code carefully, instead of running commands until something looks right.",
    takeaway:
      "Diagnosis starts from the observable state and moves on to evidence; restarting is not investigating.",
    figures: [
      {
        items: [
          {
            src: "/guides/containers/etapa11-investigacao.en.svg",
            alt: "Six steps in sequence: state with docker ps --all, logs with docker logs, configuration with docker inspect, events with docker events, process and resources with docker top and docker stats, and inside test with docker exec, from the cheapest evidence to the most specific.",
            caption:
              "The order goes from what costs least to look at to what requires getting inside the container. Each step confirms or rules out a hypothesis before the next one.",
          },
        ],
        credit: "Diagram: made for this guide",
      },
    ],
  },
  {
    id: "m12",
    num: "12",
    navTitle: "Health and logs",
    tag: "observability",
    title: "Logs, healthcheck and operational readiness",
    lead: "The process is active, so the container appears as `Up`. Even so, the application cannot serve requests because it lost access to a dependency. In another incident, the container was recreated and its local logs disappeared.",
    concept: [
      "A **healthcheck** periodically runs a check and classifies the container as `starting`, `healthy` or `unhealthy`. The process state indicates presence; the healthcheck verifies the ability to serve. It does not fix the application on its own: the policy of the runtime or the orchestrator decides how to react. A good healthcheck also works as an alert for instability.",
      "A `healthy` result has limited reach. It proves only the condition examined by the test at that moment. A shallow endpoint can pass the test while an important function is broken; a test that is too heavy can create load and false alarms. The healthcheck must represent the right function at a controlled cost.",
      "The main parameters are `test` (the command), `interval` (how often), `timeout` (how long to wait for one attempt), `retries` (how many consecutive failures mark `unhealthy`) and `start_period` (an initial period in which failures do not count, so the application has time to come up). It can be declared in the Dockerfile (`HEALTHCHECK` instruction), in Compose (`healthcheck:`) or in `docker run` (`--health-cmd` and related options).",
      "**Logs.** Applications should write logs to stdout and stderr, which is what `docker logs` reads. But relying only on `docker logs` stops being enough with multiple instances: logs are fragmented across containers and, if the container is destroyed, they are generally lost. The solution is to centralize and structure. **Structured logs** are records in a standardized format (usually JSON), with consistent fields such as `timestamp`, `level`, `message` and `service`, which makes searching and correlating events easier. In larger environments:",
      "- Promtail is an agent that runs alongside the containers, reads the local logs and sends them to Loki. (It is Loki's historical agent, and Grafana has started pointing to another collector; check Grafana's documentation for which collection agent it recommends.)",
      "- Loki stores and queries logs efficiently, with a model similar to Prometheus, only for logs.",
      "- Fluentd can collect, transform and route events, and is useful in more complex scenarios, where logs need to be enriched before being sent.",
      "- Grafana queries and visualizes the data, builds dashboards and correlates logs with metrics.",
      "To get started, it is worth putting together a simple Compose setup that includes the collector, Loki and Grafana. Combining structured logs with alerts on critical events raises the application's observability.",
    ],
    pointsTitle: "Key concepts",
    points: [
      {
        t: "Healthcheck",
        d: "periodic check of the ability to serve, and not of the presence of the process.",
        color: "blue",
      },
      {
        t: "`starting`, `healthy`, `unhealthy`",
        d: "the three health states.",
        color: "signal",
      },
      {
        t: "`start_period`",
        d: "initial tolerance for the application to come up.",
        color: "violet",
      },
      {
        t: "stdout and stderr",
        d: "where the application should write its logs.",
        color: "ember",
      },
      {
        t: "Structured log (JSON)",
        d: "fixed fields that allow searching and correlating.",
        color: "blue",
      },
      {
        t: "Centralization",
        d: "collector, storage and visualization (Promtail/Fluentd, Loki, Grafana).",
        color: "signal",
      },
    ],
    examplesTitle: "Worked examples",
    examples: [
      {
        label: "healthcheck in Compose",
        lang: "yaml",
        code: 'services:\n  api:\n    image: minha-api:1.0\n    healthcheck:\n      # Runs a request with a tool present in the image.\n      test: ["CMD", "curl", "--fail", "http://localhost:3000/health"]\n      # Checks every 30 seconds.\n      interval: 30s\n      # Interrupts an attempt that goes over 10 seconds.\n      timeout: 10s\n      # Marks unhealthy after three consecutive failures.\n      retries: 3\n      # Gives the application time to start before counting failures.\n      start_period: 20s',
        note: "Make sure `curl` exists in the image. In minimal images, prefer a check done by the application's own runtime or deliberately include the necessary tool. Expected output in `docker compose ps`:",
      },
      {
        label: "healthcheck in Compose (2)",
        lang: "sh",
        code: "NAME            SERVICE   STATUS\nprojeto-api-1   api       Up ... (healthy)",
      },
      {
        label: "watching health change with a simple sensor",
        lang: "sh",
        code: "# The health test checks whether the file /tmp/pronto exists.\n# Short interval and low retries just so the exercise is quick.\n$ docker run --detach --name sensor \\\n  --health-cmd 'test -f /tmp/pronto' \\\n  --health-interval 2s \\\n  --health-retries 2 \\\n  alpine sleep 300\n\n# Right after starting, no test has finished yet.\n$ docker inspect --format '{{.State.Health.Status}}' sensor\n\n# After two consecutive failures, the container is marked unhealthy.\n$ sleep 6\n$ docker inspect --format '{{.State.Health.Status}}' sensor\n\n# Creates the file the test looks for; the next test passes.\n$ docker exec sensor touch /tmp/pronto\n$ sleep 3\n$ docker inspect --format '{{.State.Health.Status}}' sensor\n\n# docker ps shows the health in parentheses in the STATUS column.\n$ docker ps --filter name=sensor\n\n# Cleans up the lab.\n$ docker rm --force sensor\n\n# expected output\nstarting\nunhealthy\nhealthy",
      },
      {
        label: "Dockerfile",
        lang: "sh",
        code: 'FROM node:lts-alpine\nWORKDIR /app\nCOPY server.js ./server.js\nEXPOSE 3000\n\n# Checks every 5 s, tolerates 5 s of waiting per attempt,\n# ignores failures in the first 3 s and marks unhealthy after 3 consecutive failures.\n# 127.0.0.1 avoids ambiguity in localhost resolution; wget already exists on Alpine.\nHEALTHCHECK --interval=5s --timeout=5s --start-period=3s --retries=3 \\\n  CMD wget --quiet --spider http://127.0.0.1:3000/ || exit 1\n\nCMD ["node", "server.js"]',
        intro:
          "Use the Stage 03 folder (where `server.js` is) and confirm that port 3000 is free. Create in it the file `Dockerfile.saude` with the content of the `Dockerfile` and one more instruction:",
      },
      {
        label: "terminal",
        lang: "sh",
        code: "$ docker build --file Dockerfile.saude --tag minha-api:saude .\n# --init so that docker rm --force and Node's stops are immediate.\n$ docker run --detach --init --name api-saude --publish 3000:3000 minha-api:saude\n\n# Right after starting, STATUS shows (health: starting); afterwards, (healthy).\n$ docker ps --filter name=api-saude\n$ sleep 8\n$ docker ps --filter name=api-saude\n\n# expected output\nCONTAINER ID   IMAGE              STATUS                            NAMES\nabc123         minha-api:saude    Up 2 seconds (health: starting)   api-saude\nCONTAINER ID   IMAGE              STATUS                            NAMES\nabc123         minha-api:saude    Up 10 seconds (healthy)           api-saude",
      },
      {
        label: "more useful logs",
        lang: "sh",
        code: '# Last 20 lines, with the time of each one.\n$ docker logs --tail 20 --timestamps api-saude\n\n# Follows in real time (Ctrl+C to exit).\n$ docker logs --follow api-saude\n\n# Only what was emitted in the last 5 minutes.\n$ docker logs --since 5m api-saude\n\n# Cleans up the lab.\n$ docker rm --force api-saude\n\n# expected output\n{"timestamp":"...","level":"error","path":"/health","database":"unreachable"}',
        note: "A structured log, like the one from the Stage 13 API, has this form, and a collector can filter by `level`:",
      },
    ],
    commands: [
      {
        cmd: "docker ps",
        note: "the `STATUS` column shows `(healthy)`, `(unhealthy)` or `(health: starting)`",
      },
      {
        cmd: "docker inspect --format '{{.State.Health.Status}}' name",
        note: "current health state",
      },
      {
        cmd: "docker inspect --format '{{json .State.Health}}' name",
        note: "history of the last checks",
      },
      {
        cmd: "docker run --health-cmd '...' --health-interval 5s --health-retries 3 image",
        note: "defines the healthcheck in `docker run`",
      },
      {
        cmd: "docker logs --tail N",
        note: ", `--follow`, `--since 5m`, `--timestamps`: useful variations of `docker logs`",
      },
      {
        cmd: "docker compose logs --follow service",
        note: "logs of a Compose service",
      },
      {
        cmd: "docker compose up --detach --wait",
        note: "waits for the services with a healthcheck to become healthy",
      },
    ],
    handsOn: [
      "Run the sensor example and watch the sequence `starting`, `unhealthy` and `healthy`.",
      "Build the `minha-api:saude` image, start the container and follow the `STATUS` in `docker ps` until `(healthy)` appears.",
      "Run `docker logs --tail 5 --timestamps api-saude` and note the time of each line. Then remove the container with `docker rm --force api-saude`. The exercises of losing the real dependency of an API and watching the healthcheck react are in Stage 13, after you have the complete stack to test.",
    ],
    tip: "Choose what the healthcheck tests according to what really breaks. A test that only checks whether the port opens can pass with the database down; one that queries the database every second can become the biggest source of load. Prefer a light check that still depends on what is essential.",
    takeaway:
      'An active process answers the question "is it running?"; the healthcheck answers "can it do its job?".',
    figures: [
      {
        items: [
          {
            src: "/guides/containers/etapa12-healthcheck.en.svg",
            alt: "Three states: starting, during the 20s start_period, when failures do not count; healthy when the test passes; unhealthy after 3 failures in a row, and back to healthy when the test passes again. Below, what reacts to the state: restart, depends_on with service_healthy and docker compose up --wait.",
            caption:
              "The values from the stage's example. The healthcheck only classifies the container; whatever acts on the result is the runtime, Compose or the orchestrator.",
          },
        ],
        credit: "Diagram: made for this guide",
      },
    ],
  },
  {
    id: "m13",
    num: "13",
    navTitle: "Capstone",
    tag: "defensive stack",
    title: "Capstone, a small defensive stack",
    lead: "The isolated concepts work in the exercises, but production requires them to cooperate. The image must be reproducible, the process must run without root, the API must locate the database by name, the database must persist data, the password must not become an exposed variable and the environment must say when each service is healthy.",
    concept: [
      "This final project combines only mechanisms already presented: Dockerfile, multistage build, non-root user, custom network, volume, tmpfs, secret in a file, healthcheck, dependency on health, reduced privileges, logs and Compose. No isolated mechanism delivers a reliable application; the result comes from the discipline of the whole.",
      "The API uses only native Node modules. It tests whether it can open a TCP connection to PostgreSQL. This proves DNS discovery and connectivity without adding a database library to the exercise.",
      "Compose also applies simple CPU and memory limits. They contain the maximum consumption of the lab, but do not guarantee performance nor reserve exclusive capacity. Labels add metadata for inventory, automation and observability; they describe the services without altering their behavior.",
      "The `api` service uses `init: true`: as Stage 03 explained, Node as PID 1 ignores SIGTERM without a signal handler, and the init passes the signal on, so that `docker compose down` and `docker compose stop` finish in seconds instead of waiting for the 10-second deadline.",
      'The database healthcheck uses `pg_isready -h 127.0.0.1`, with the TCP address explicit. On first startup, the PostgreSQL image brings up a temporary server that listens only on a Unix socket while it prepares the database. Without the `-h`, `pg_isready` queries that socket and may answer "ready" before the final server accepts TCP connections, which is the path the API uses. With the explicit address, the test only passes when the database is actually serving over TCP.',
      "**Production checklist.** Before putting any container into production, a last review is worthwhile. The capstone covers each item below, and the file shows where:",
      "1. **Optimized image:** avoid generic, heavy images (such as `node:latest`); prefer `slim`/`alpine` variants or a multistage, so that only the essentials go to production. Covered by the `Dockerfile`.",
      "1. **Sensitive variables kept safe:** passwords and tokens via `secrets:`, and not via `env_file` or directly in Compose. Covered by the `secrets` block.",
      "1. **Resource limits:** CPU and memory defined so as not to overload the host. Covered by `cpus` and `mem_limit`.",
      "1. **Healthcheck configured:** serves as an alert and gives the orchestrator the restart criterion. Covered by the two `healthcheck` blocks.",
      "1. **Structured log:** the application writes JSON to stdout, ready for an observability stack (Stage 12). Covered by `server.js`.",
      "1. **Unprivileged user:** `USER node` in the Dockerfile. Covered.",
      "1. **Isolated network:** a specific network between services, instead of the default bridge. Covered by the `interna` network.",
      "1. **Persistence guaranteed:** volume so that no important data is lost on a restart. Covered by `dados_db`.",
      "1. **Labels and metadata:** make automation and integration with monitoring tools easier. Covered by the `labels`.",
      '1. **Final local test:** simulate the production environment locally, combining the files (`docker compose -f compose.yaml -f compose.prod.yaml up`) before deploying for real. See the last step of the "Hands-on" section.',
      "The limits can also be written in the Compose `deploy.resources.limits` format, which the bibliography uses:",
      '```yaml\nservices:\n  api:\n    deploy:\n      resources:\n        limits:\n          # Half a CPU and 512 MB of memory.\n          cpus: "0.50"\n          memory: 512M\n```',
      "Both formats are accepted by Compose v2; this guide uses `cpus` and `mem_limit`. Check the result with `docker compose config`.",
    ],
    pointsTitle: "Key concepts",
    points: [
      {
        t: "Stack",
        d: "API, database, network, volume and secret described together.",
        color: "blue",
      },
      {
        t: "Dependency on health",
        d: "`depends_on` with `condition: service_healthy` waits for readiness, and not just creation.",
        color: "signal",
      },
      {
        t: "Reduced privileges",
        d: "`cap_drop: ALL`, `read_only: true`, `tmpfs` at `/tmp`, `USER node`.",
        color: "violet",
      },
      {
        t: "`init: true`",
        d: "an init as PID 1 passes SIGTERM on to Node and speeds up shutdown.",
        color: "ember",
      },
      {
        t: "Secret in a file",
        d: "`POSTGRES_PASSWORD_FILE` points to `/run/secrets/db_password`.",
        color: "blue",
      },
      {
        t: "`interna` network",
        d: "DNS by service name, without publishing the database.",
        color: "signal",
      },
      {
        t: "Resource limits",
        d: "contain consumption, without reserving capacity.",
        color: "violet",
      },
      {
        t: "Labels",
        d: "inventory metadata, and not a security control.",
        color: "ember",
      },
      {
        t: "`pg_isready -h 127.0.0.1`",
        d: "checks the database over the same TCP path the API uses.",
        color: "blue",
      },
    ],
    examplesTitle: "Worked examples",
    examples: [
      {
        label: "project files",
        lang: "sh",
        code: "capstone/\n├── app/\n│   └── server.js\n├── secrets/\n│   └── db_password.txt\n├── .dockerignore\n├── Dockerfile\n└── compose.yaml",
        intro: "Structure:",
        note: "`app/server.js`:",
      },
      {
        label: "JavaScript",
        lang: "sh",
        code: '// Uses only modules included in Node.js.\nconst http = require("node:http");\nconst net = require("node:net");\n\nconst port = Number(process.env.PORT || 3000);\nconst databaseHost = process.env.DB_HOST || "db";\n\n// Tests whether the database\'s TCP port accepts a connection.\nfunction databaseReachable() {\n  return new Promise((resolve) => {\n    const socket = net.createConnection(5432, databaseHost);\n    const finish = (result) => {\n      socket.destroy();\n      resolve(result);\n    };\n\n    socket.setTimeout(1000);\n    socket.once("connect", () => finish(true));\n    socket.once("timeout", () => finish(false));\n    socket.once("error", () => finish(false));\n  });\n}\n\nconst server = http.createServer(async (request, response) => {\n  const reachable = await databaseReachable();\n  const status = reachable ? 200 : 503;\n  const body = {\n    service: "api",\n    database: reachable ? "reachable" : "unreachable",\n  };\n\n  // Produces a structured log on stdout.\n  console.log(JSON.stringify({\n    timestamp: new Date().toISOString(),\n    level: reachable ? "info" : "error",\n    path: request.url,\n    database: body.database,\n  }));\n\n  response.writeHead(status, { "content-type": "application/json" });\n  response.end(JSON.stringify(body));\n});\n\nserver.listen(port, "0.0.0.0", () => {\n  console.log(JSON.stringify({ level: "info", message: `listening:${port}` }));\n});',
        note: "`Dockerfile`:",
      },
      {
        label: "Dockerfile",
        lang: "sh",
        code: '# Artifact preparation stage.\nFROM node:lts-alpine AS build\nWORKDIR /build\nCOPY app/server.js ./server.js\n\n# Final stage separate from the preparation: it carries only what is needed to run.\nFROM node:lts-alpine AS runtime\nWORKDIR /app\n\n# Copies the artifact with the correct user.\nCOPY --from=build --chown=node:node /build/server.js ./server.js\n\n# Documents the port and drops root privileges.\nEXPOSE 3000\nUSER node\n\n# The exec form makes Node the main process (PID 1) directly, with no shell in between.\n# That alone is not enough for a clean shutdown: Compose\'s init: true\n# puts an init as PID 1, which passes SIGTERM on to Node.\nCMD ["node", "server.js"]',
        note: "`.dockerignore`:",
      },
      {
        label: ".dockerignore",
        lang: "sh",
        code: ".git\n.env\nsecrets\nnode_modules\n*.log",
        note: "`compose.yaml`:",
      },
      {
        label: "project files (2)",
        lang: "yaml",
        code: 'services:\n  api:\n    # Builds the local image with the Dockerfile.\n    build:\n      context: .\n      dockerfile: Dockerfile\n    # Runs an init as PID 1, so that SIGTERM reaches Node and the down is quick.\n    init: true\n    # Publishes only the API.\n    ports:\n      - "3000:3000"\n    environment:\n      DB_HOST: db\n      PORT: "3000"\n    # Waits for the database to become healthy before creating the API.\n    depends_on:\n      db:\n        condition: service_healthy\n    # Removes capabilities that the API does not use.\n    cap_drop:\n      - ALL\n    # Limits the service\'s maximum consumption on the host.\n    cpus: "0.50"\n    mem_limit: 128m\n    # Identifies the container\'s role for search and automation.\n    labels:\n      com.exemplo.service: api\n      com.exemplo.component: backend\n    # Prevents writing to the root and offers an ephemeral /tmp.\n    read_only: true\n    tmpfs:\n      - /tmp\n    restart: on-failure:3\n    networks:\n      - interna\n    healthcheck:\n      # fetch is available in current Node versions and avoids installing curl.\n      # 127.0.0.1 avoids ambiguity in localhost resolution.\n      test:\n        - CMD\n        - node\n        - -e\n        - fetch(\'http://127.0.0.1:3000/health\').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))\n      interval: 10s\n      timeout: 3s\n      retries: 3\n      start_period: 5s\n\n  db:\n    image: postgres:16-alpine\n    environment:\n      POSTGRES_USER: app\n      POSTGRES_DB: app\n      # The official image reads the password from this file.\n      POSTGRES_PASSWORD_FILE: /run/secrets/db_password\n    secrets:\n      - db_password\n    volumes:\n      - dados_db:/var/lib/postgresql/data\n    networks:\n      - interna\n    # Keeps the database within limits suited to the lab.\n    cpus: "0.75"\n    mem_limit: 512m\n    # Records metadata without changing how the process runs.\n    labels:\n      com.exemplo.service: db\n      com.exemplo.component: database\n    restart: unless-stopped\n    healthcheck:\n      # pg_isready already exists in the PostgreSQL image.\n      # -h 127.0.0.1 forces the check over TCP, the path the API uses. Without it, the test\n      # queries the Unix socket and may pass during the temporary startup server.\n      test: ["CMD-SHELL", "pg_isready -h 127.0.0.1 -U app -d app"]\n      interval: 5s\n      timeout: 3s\n      retries: 10\n\nvolumes:\n  # The database keeps its data after the container is recreated.\n  dados_db:\n\nnetworks:\n  # The user-created network offers DNS by service name.\n  interna:\n\nsecrets:\n  db_password:\n    # This file is outside the context because of the .dockerignore.\n    file: ./secrets/db_password.txt',
        note: "Expected output of `curl http://localhost:3000/health` with the stack healthy:",
      },
      {
        label: "JSON",
        lang: "sh",
        code: '{"service":"api","database":"reachable"}',
      },
      {
        label: "checking the running stack",
        lang: "sh",
        code: "# State and health of the two services.\n$ docker compose ps\n\n# The API process's user.\n$ docker compose exec api id\n\n# Existing volumes; the database's carries the project name (the folder) as a prefix.\n$ docker volume ls\n\n# expected output\nNAME             SERVICE   STATUS\ncapstone-api-1   api       Up ... (healthy)\ncapstone-db-1    db        Up ... (healthy)\nuid=1000(node) gid=1000(node) groups=1000(node)\nDRIVER    VOLUME NAME\nlocal     capstone_dados_db",
        note: "The volume declared as `dados_db` in the file appears as `capstone_dados_db` because Compose prefixes resources with the project name, which by default is the name of the folder (`capstone`).",
      },
    ],
    commands: [
      {
        cmd: "docker compose config --quiet",
        note: "validates the YAML without printing",
      },
      {
        cmd: "docker compose up --detach --build --wait",
        note: "builds, starts and waits for readiness",
      },
      {
        cmd: "docker compose ps",
        note: "state and health of the services",
      },
      {
        cmd: "docker compose logs api",
        note: "the API's JSON logs",
      },
      {
        cmd: "docker compose exec api id",
        note: "confirms the process's user",
      },
      {
        cmd: "docker volume ls",
        note: "confirms that the `capstone_dados_db` volume (prefix = folder name) still exists",
      },
      {
        cmd: "docker compose down",
        note: "ends while preserving the data",
      },
      {
        cmd: "docker compose down --volumes",
        note: "ends and deletes the data; only when the loss is intentional",
      },
      {
        cmd: "docker ps --filter publish=3000",
        note: "checks whether port 3000 is already in use by another container",
      },
      {
        cmd: "docker compose stop db",
        note: "and `docker compose start db`: stop and resume the database, to test the reaction of the API's healthcheck",
      },
    ],
    handsOn: [
      "Create the structure and the files exactly as shown.",
      "Write a lab password with `mkdir -p secrets && printf 'troque-esta-senha' > secrets/db_password.txt && chmod 644 secrets/db_password.txt`. The `chmod 644` matters because Postgres reads the file as the `postgres` user inside the container; with a restrictive `umask` on the host, the file would be born readable only by you and the read could fail.",
      "Validate the YAML with `docker compose config --quiet`.",
      "Bring up the stack with `docker compose up --detach --build --wait`.",
      "Run `curl http://localhost:3000/health`.",
      'The expected output is `{"service":"api","database":"reachable"}`.',
      "Run `docker compose ps` and confirm that both services are healthy.",
      "Run `docker compose logs api` and locate the request's JSON log.",
      "Confirm the user with `docker compose exec api id`. The output should identify the user `node`, not `root`.",
      "Run `docker compose down`, bring it up again and confirm that the volume `capstone_dados_db` (the prefix is the name of your folder) still exists with `docker volume ls`. Also notice that the `down` finishes in a few seconds, thanks to `init: true`.",
      "If you want to preserve the database, end only with `docker compose down`. Use `docker compose down --volumes` only when you decide to discard the lab: that command removes the volume `capstone_dados_db` and permanently deletes its contents, with no trash bin or automatic recovery. Back up first if there is any data you need.",
      "To close item 10 of the production checklist, write a minimal `compose.prod.yaml` (for example, changing `restart` or adding a label `ambiente: producao`), validate with `docker compose -f compose.yaml -f compose.prod.yaml config` and bring it up with `-f` on both files before considering the environment ready.",
      "Extra, losing the database and coming back: with the stack up (`docker compose up --detach --build --wait`), confirm the initial state with `docker compose ps`. API and database should appear as `healthy`.",
      "Extra: stop the API's real dependency with `docker compose stop db`.",
      'Extra: follow `docker compose ps` until the API appears as `unhealthy`. The endpoint returns 503 because the TCP test to the database fails, and `curl -i http://localhost:3000/health` shows `HTTP/1.1 503` with `{"service":"api","database":"unreachable"}`.',
      "Extra: look up the attempts with `docker inspect --format '{{json .State.Health}}' $(docker compose ps -q api)` and correlate with `docker compose logs api`, where the `error`-level lines appear.",
      "Extra: recover the database with `docker compose start db` and wait for both services to return to `healthy` in `docker compose ps`.",
    ],
    tip: "After finishing the capstone, repeat it causing a failure on purpose: stop the database, remove the volume, change the password. If you can predict and explain each response of the system (state, healthcheck, logs), you have understood how the pieces work together.",
    takeaway:
      "A mature stack does not depend on a single resource: it combines reproducible building, isolation, least privilege, persistence, health and operational evidence.",
    figures: [
      {
        items: [
          {
            src: "/guides/containers/etapa13-stack.en.svg",
            alt: "On the interna network, the api, with init, USER node, read_only, tmpfs, cap_drop ALL, limits and healthcheck, receives the client on port 3000 and talks to db over TCP 5432 by name; it depends on db with service_healthy. The db, postgres:16-alpine with no published port, uses the dados_db volume and the db_password secret.",
            caption:
              "The capstone stack in one picture: only the api publishes a port, the database is reachable only through the `interna` network, the data lives in the volume and the password arrives as a file in `/run/secrets/`.",
          },
        ],
        credit: "Diagram: made for this guide",
      },
    ],
  },
];

export const CHECKLIST: ChecklistGroup[] = [
  {
    title: "Stage 01: Why containers exist",
    items: [
      "I can explain why a container is not a small VM.",
      "I can state the role of namespaces and cgroups.",
      "I can explain why the main process determines the life of the container.",
      "I saw PID and hostname isolation and read a memory limit recorded on a container.",
    ],
  },
  {
    title: "Stage 02: Image, container and lifecycle",
    items: [
      "I tell image, layer and container apart.",
      "I ran the `pull`, `run`, `stop`, `start` and `rm` cycle and confirmed that the image survives the container.",
      "I can explain why `latest` and other tags do not guarantee reproducibility and what a digest solves.",
      "I can tell a public registry from a private one and describe the `login`, `tag` and `push` flow.",
      "I used `docker exec`, `docker cp` and `docker rename` on a running container.",
    ],
  },
  {
    title: "Stage 03: Dockerfile",
    items: [
      "I can build and version an image with a Dockerfile.",
      "I tell `RUN`, `CMD`, `EXPOSE` and `--publish` apart.",
      "I replaced an image's `CMD` on the command line without rebuilding it.",
      "I can end a container in the foreground and explain why `--init` helps Node as PID 1.",
    ],
  },
  {
    title: "Stage 04: Layers, cache and multistage",
    items: [
      "I can organize a Dockerfile to take advantage of the cache.",
      "I observed `CACHED` and caused cache invalidation by reversing the order of the instructions.",
      "I understand when to choose `slim`, `alpine`, `distroless` or a more complete image.",
      "I can explain the benefit of a multistage build and the care needed with runtime dependencies.",
    ],
  },
  {
    title: "Stage 05: Persistence",
    items: [
      "I can choose between volume, bind mount and tmpfs.",
      "I showed that data in a volume survives the removal of the container and that data in tmpfs does not survive even a restart.",
      "I can explain what changes when using a remote driver (NFS or plugin) instead of `local`.",
    ],
  },
  {
    title: "Stage 06: Networks",
    items: [
      "I can connect services by name on a custom network.",
      "I showed the difference between the default bridge and a custom network regarding name resolution.",
      "I publish only the ports that need to leave the internal network.",
      "I can say when to use `host`, `none` and `overlay`.",
    ],
  },
  {
    title: "Stage 07: Docker Compose",
    items: [
      "I can validate, start, observe and tear down a Compose application.",
      "I can explain what `depends_on` guarantees and what it does not.",
      "I can use `build` with `context`, `dockerfile` and `args`.",
    ],
  },
  {
    title: "Stage 08: Environments, restart, scaling and CI",
    items: [
      "I can combine Compose files for different environments and check the result with `config`.",
      "I can say when the override is loaded automatically and when it is not.",
      "I understand that restart does not guarantee the readiness of dependencies.",
      "I saw a fixed port prevent replicas on the same host.",
      "I can describe a CI script that starts, tests and tears down the environment.",
    ],
  },
  {
    title: "Stage 09: Security",
    items: [
      "I can configure a non-root user, a read-only filesystem and minimal capabilities.",
      "I proved `--read-only` as root, comparing with and without the option.",
      "I can state the role of capabilities, seccomp and least privilege.",
      "I can solve permission problems on bind mounts with `--user` and I know why not to mount `docker.sock`.",
    ],
  },
  {
    title: "Stage 10: Context, secrets and analysis",
    items: [
      "I know why `.env` and secrets must not enter the build context.",
      "I saw the context size drop with the `.dockerignore`.",
      "I can explain why deleting a secret in a later layer does not remove it from the image, and I extracted the secret from the layer with `docker save`.",
      "I tell `ARG`, `env_file` and `secrets` apart.",
      "I know what Dive and Snyk are for.",
    ],
  },
  {
    title: "Stage 11: Troubleshooting",
    items: [
      "I can investigate a failure using status, logs, inspect and events, in that order.",
      "I can interpret the exit codes 0, 125, 126, 127 and 137 and check `OOMKilled`, knowing that 137 also appears when a `docker stop` times out.",
    ],
  },
  {
    title: "Stage 12: Logs, healthcheck and readiness",
    items: [
      "I tell an active process from a healthy service.",
      "I saw a container go through `starting`, `unhealthy` and `healthy`.",
      "I can explain how structured logs help centralization and search.",
    ],
  },
  {
    title: "Stage 13: Capstone",
    items: [
      "I completed the capstone and can justify each Compose decision.",
      "I mapped each item of the production checklist to a line of the file.",
      "I stopped the database, saw the API become `unhealthy` and saw it return to `healthy` when the database came back.",
    ],
  },
  {
    title: "",
    items: [],
    outro:
      "**Next steps:** with all the items checked, redo the labs without consulting the guide and then put the pieces together. Cause failures in the capstone (stop the database, change the password, remove the volume) and explain each response of the system before looking at the logs. Then add a third service (for example, a cache) and take the same stack to a CI flow with `docker compose up --wait`.",
  },
];

export const NOTES: string[] = [
  "This block gathers the corrections made to the raw material and the details that help read the examples safely. Nothing here changes the path of the exercises.",
  "**Corrections to the raw material**",
  "**The container's root is not the host's root.** The raw text states that root inside the container is \"practically the same\" as the host's. Namespaces and capabilities reduce its powers. Even so, running as UID 0 widens the impact of dangerous mounts, extra capabilities and runtime flaws, which is why the guide recommends a non-root user.",
  "**User namespace is not the default.** The raw text presents the user namespace as if every container had user IDs separate from the host's. In Docker's default configuration, the container's UID 0 corresponds to the host's UID 0 (with reduced capabilities); the mapping only exists if `userns-remap` or rootless mode is enabled. That is why, without `--user`, a bind mount creates files owned by the host's root (Stage 09).",
  "**`tmpfs` is not a persistent volume driver.** The raw text lists it among the volume drivers. It is an in-memory mount that loses its content when removed.",
  "**The default bridge has no DNS by name.** The raw text says the default bridge network provides name resolution. That resolution is an advantage of user-created networks; on the default bridge, do not depend on it (Stage 06).",
  "**Overlay belongs to Docker Swarm.** The raw text associates overlay networks with Swarm or Kubernetes. Kubernetes does not use Docker overlay networks; it uses its own network plugins (CNI). The guide mentions overlay only as Swarm's multi-host network.",
  "**Google Container Registry.** The service cited in the raw text was replaced by Artifact Registry; the guide uses the name of the replacement service.",
  "**`docker-compose` with a hyphen.** The raw text's examples use the first-generation executable. The guide uses `docker compose` (Compose v2) throughout. The name `docker-compose.yml` is still accepted, but `compose.yaml` is the preferred name.",
  "**Cache example with pnpm.** The raw text copies only `pnpm-lock.yaml` before `pnpm install`, but the manager also needs the `package.json`. The guide copies both and uses `--frozen-lockfile`.",
  "**Order of `USER` in the Dockerfile.** The raw text's example switches to the ordinary user before `RUN npm ci`. Since the directory created by `WORKDIR` may be owned by root, the installation may fail on permissions. The guide installs the dependencies before `USER` and uses `COPY --chown`.",
  "**Multistage and dependencies.** The raw text copies only `/app/dist` to the runtime with no caveat. That only works if the artifact is self-sufficient; otherwise, the final stage needs its own `npm ci --omit=dev`.",
  '**Alpine size.** The raw text says "under 10 MB" in one lesson and "about 5 MB" in another. The guide says "a few megabytes", since the value varies between versions.',
  "**Cgroups and network.** The raw text includes network bandwidth among the resources controlled by cgroups. Docker exposes CPU, memory and disk input and output limits through flags; the guide restricts itself to those.",
  '**`env_file` and versioning.** The raw text suggests `env_file` for values that "you need to version". `.env` files with credentials must not be versioned, and `env_file` values are visible in `docker inspect`.',
  "**Promtail.** The raw text presents it as Loki's agent. It is the historical agent, and Grafana has started pointing to another collector; since this recommendation may change, the guide asks you to check in the documentation which agent it indicates.",
  "**Extraction errors.** Commands such as `dockerpull`, `dockerinspect` and `docker-composeup` appear with lost spaces in the raw text, and the `-a` option of `docker ps` appears with a long typographic hyphen in place of the plain hyphen. The guide restores them to `docker pull`, `docker inspect`, `docker ps -a` and `docker compose up`.",
  "**About what you will see in the terminal**",
  "**Example outputs.** The outputs shown are typical formats. IDs, times, sizes, IPs and versions vary. Compare the structure, not the exact text.",
  "**Image tags.** The Node tags `lts-alpine` and `lts-slim` follow the current LTS version, which keeps the exercises from aging, but makes them movable: in a project, pin the major version. The `postgres:16-alpine` image must keep the chosen major version, because the data files are not compatible between major versions. Check the availability of third-party images (such as `curlimages/curl`) at the time you run them.",
  "**Writable layer and `docker cp`.** Files copied into a container stay in the writable layer and vanish with it; to persist, use volumes.",
  "**Resource limits.** `cpus` and `mem_limit` (or `deploy.resources.limits`) contain consumption, but do not reserve exclusive capacity nor replace monitoring.",
  "**A label is metadata, not a security control.** It helps inventory, automation and observability, but does not enforce isolation or authorization.",
  "**Secrets in local Compose.** `secrets` mounts the value as a file and reduces exposure, but is not an encrypted vault; the source file still needs protection.",
  "**`ARG` is not a secret.** Build values can appear in history, metadata and pipeline records. For build secrets, there is a dedicated BuildKit mechanism.",
  '**PID 1, signals and `--init`.** On Linux, PID 1 of a process namespace does not get the default action of signals: SIGTERM and SIGINT are ignored if the program has not installed a handler. Node.js without an explicit handler is affected, so Ctrl+C may not end a container in the foreground and `docker stop` waits 10 seconds before sending SIGKILL. `--init` (and `init: true` in Compose) solves this with an init that passes the signals on. An alternative is to handle the signal in code, with something like `process.on("SIGTERM", () => server.close(() => process.exit(0)))`.',
  '**137 has two origins.** Exit code 137 means SIGKILL. It appears with lack of memory (with `OOMKilled=true`) and also when a `docker stop` times out and Docker kills the process (with `OOMKilled=false`). Whoever read "137" as lack of memory needs to check `OOMKilled` before concluding.',
  "**tmpfs and swap.** A tmpfs lives in memory, but, under memory pressure, the system may move its pages to the swap area, which is why it is not an absolute guarantee that the data never reaches the disk.",
  "**Incremental build context.** BuildKit transfers the context incrementally: on the second run of a build, only the differences are sent. That is why the `.dockerignore` exercise in Stage 10 asks for the first build, with the large file, to be done only once before creating the `.dockerignore`.",
  "**Sizes in `docker history`.** Depending on the version and the image store Docker uses (the classic one or containerd's), layer sizes may appear rounded or in another unit. The reading that matters is the comparison: the `COPY` layer is larger than `0B` and the `RUN rm` one stays at `0B`.",
  "**`pg_isready` and the temporary server.** On first startup, the official PostgreSQL image runs a temporary server only on a Unix socket, restarts and then starts listening on TCP. A `pg_isready` without `-h` may report readiness in that phase; with `-h 127.0.0.1`, the test reflects the TCP path used by the API.",
  "**Points to check for whoever runs it**",
  "**Docker Desktop.** Linux containers run inside a VM. The `host` network mode and the translation of file owners on bind mounts behave differently from native Linux (Stages 06 and 09).",
  "**Restart and counting.** The number of restarts shown in Stage 08 (`reinicios=3`) and the number of log lines depend on how long you wait before querying; wait a few seconds before inspecting.",
  "**External services.** The `docker push` (Stage 02) requires a real registry, the NFS volume (Stage 05) requires an accessible NFS server, Snyk (Stage 10) requires an account, and Dive requires installation. The other exercises do not depend on them.",
  "**Ports in use.** The examples use host ports 3000 and 8080. If either is busy, change the left side of the mapping (for example, `3001:3000`) and adjust the `curl`.",
  "**Minimal images and diagnosis.** Alpine, slim and distroless reduce size and surface, but compatibility and diagnostic ability must also be considered; an image without a shell does not accept `docker exec ... sh`.",
  "**Layer extraction with `docker save`.** The format of the exported file changes with the Docker version (layers in their own directories or in `blobs/`, with or without compression). The Stage 10 script walks through all the files precisely so as not to depend on that layout; if `tar` does not find the path, try the `./tmp/segredo.txt` variant.",
];
