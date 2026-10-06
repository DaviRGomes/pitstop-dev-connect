# Containers and Docker: from car specification to complete track operations

> Commentator version built from the six source materials on container fundamentals, images, Dockerfiles, persistence, networks, Docker Compose, security, observability, and diagnostics. All technical content has been preserved. The difference lies in the trackside perspective: each mechanism is connected to a concrete part of a Formula 1 team's operation.

## Opening broadcast

The lights are on for the Containers Grand Prix. The circuit has 13 stages and demands much more than speed: the competitor must begin with the fundamentals, master image assembly, organize networking and persistence, secure operations, and cross the line with a complete and observable stack.

Here, the stopwatch measures understanding. Every command needs a purpose, every layer needs to justify its place, and every failure needs to leave evidence. The car may look ready in the garage, but only a complete lap shows whether the whole package works in harmony.

When I get into the car, I do not receive an entire factory inside the cockpit. I receive an instance assembled from a controlled specification, with known components, configuration, and limits. The team can assemble another instance from the same specification, but each running car accumulates its own state during use. This distinction is the best entry point to containers: the image is the replicable specification; the container is an executable instance assembled from it.

**What you will be able to do by the end of this guide:** explain how a container isolates processes without carrying a complete operating system; distinguish an image from a container; build reproducible and lean images; persist data; connect services through internal DNS; describe an application with Docker Compose; reduce privileges; investigate failures; and combine all of this in a small executable stack.

**Prerequisites:** Docker Engine or Docker Desktop with the `docker compose` command available. The examples use Linux images. On Docker Desktop, these images run inside the Linux virtual machine managed by the tool itself.

> **Cleanup warning:** commands with `prune` remove unused resources across the Docker environment. `docker rm --force` stops and removes the container without a normal shutdown, discarding everything that existed only in its writable layer. `docker volume rm` permanently deletes the contents of the specified volume. `docker compose down --volumes` removes the volumes declared by the application and the data stored in them. Check names, back up anything important, and run these options only when data loss is intentional.

## Docker to F1 reference: keep this on the steering wheel

The same analogy will be used across all 13 stages. If image means a replicable car specification here, it will keep that meaning through the capstone.

| Containers and Docker | Formula 1 |
|---|---|
| Host and kernel | Shared operational infrastructure of the circuit |
| Virtual machine | A complete and independent facility with its own infrastructure |
| Namespace | Operational partitions that limit what each garage and team can see |
| Cgroup | Resource control that measures and limits the capacity delivered to each operation |
| Image | Replicable specification or recipe used to assemble a car |
| Container | Executable instance assembled from the specification |
| Registry | Central archive of versioned specifications |
| Tag | Identifier for a version or configuration of the specification |
| Dockerfile | Versioned sheet with the assembly sequence |
| Image layer | Immutable package of changes to the specification |
| Build cache | Reuse of already validated sets that have not changed |
| Multistage build | Complete assembly at the factory, with only the kit required for operation sent to the track |
| Writable layer | Temporary record produced by an instance while it runs |
| Named volume | Persistent data vault, separate from the car lifecycle |
| Bind mount | Direct access to a specific host workbench |
| tmpfs | Temporary garage board, kept in memory and erased when the operation is dismantled |
| Custom network | Private communication channel among members of the same operation |
| Internal DNS | Stable identification by role or call sign, even when the address changes |
| Port publishing | Controlled opening of internal access to someone outside the garage |
| Docker Compose | Operational plan that describes all cars, services, access points, and resources together |
| Restart policy | Automatic retry procedure after a stop |
| Healthcheck | Active verification that the system can perform its function |
| Non-root user | Team member who receives only the credentials required for the task |
| Capabilities | Specific operational permissions, granted one at a time |
| Seccomp | List of system procedures that are allowed or blocked |
| `.dockerignore` | Screening of material before the crate is sent for assembly |
| Secret | Confidential credential delivered through its own channel |
| Logs and events | Radio, telemetry, and chronological operational record |
| Final stack | Integrated operation of a race weekend |

## Where the comparison stops

The analogy helps organize reasoning, but it does not replace the technical model. A physical car does not share a computer kernel, an F1 team normally fields only two cars, and an image does not contain physical material. Containers can be created and removed in seconds, replicated at large scale, and connected through virtual networks. Whenever there is a conflict, the Docker definitions and commands presented in the text take precedence.

---
## Stage 01: why containers exist

**Broadcast call:** the installation lap begins. Before chasing lap time, we need to understand the circuit and find out why carrying an entire operating system for every application may be too much weight.

### The problem

A Node.js application works on the team's laptop but fails on the server. The local machine uses one language version, the server uses another, a native library is missing, and a setting was made manually without documentation. Deployment becomes an attempt to reconstruct, step by step, an environment that exists only in the memory of the person who configured it.

Virtual machines improved isolation in this scenario, but each VM carries its own operating system. That costs memory, disk space, and startup time. When the goal is to run isolated applications on the same host, repeating a complete operating system can be wasteful.

### The concept

**Cockpit perspective:** a VM is like taking a complete and independent facility for every application. A container is like placing a car instance in a bounded garage while sharing the circuit's operational infrastructure. Namespaces form the visibility partitions; cgroups work as the control that measures and limits the resources assigned to that operation.

A container is a set of processes isolated at the operating-system level. On Linux, two mechanisms are fundamental:

- **Namespaces** control what the process can see, such as processes, networking, mount points, hostname, interprocess communication, and users.
- **Cgroups** measure and limit resources such as CPU, memory, and input and output operations.

The container shares the host kernel. This is why it usually starts faster and consumes fewer resources than a VM. This sharing also means that a container is neither synonymous with a virtual machine nor an absolute security boundary.

Here the comparison reaches its first limit: separate garages reduce interference between teams, but they do not describe process isolation. In Docker, isolation is implemented by the kernel and remains subject to runtime and host configuration.

| Characteristic | Virtual machine | Container |
|---|---|---|
| Isolated unit | Complete machine | Processes |
| Kernel | One per VM | Shared with the host |
| Startup | Usually slower | Usually fast |
| Image | Complete operating system | Application and its dependencies |

### Commented example: the first container

```sh
# Downloads the image, creates a container, runs its process, and displays the output.
docker run --name primeiro-container hello-world

# Also lists containers that have already finished.
docker ps --all

# Displays complete container metadata as JSON.
docker inspect primeiro-container

# Removes the stopped container.
docker rm primeiro-container
```

Expected output, shortened:

```text
Hello from Docker!
...
CONTAINER ID   IMAGE         STATUS                     NAMES
abc123         hello-world   Exited (0) ...             primeiro-container
```

The `Exited (0)` status does not indicate a failure. The main process printed the message and completed successfully. A container remains running only while its main process remains active.

### Hands-on

**Fast lap:** the track is open for the first `docker run`. Proceed calmly and confirm each dashboard reading before removing the container.

1. Run `docker run --name fundamentos hello-world`.
2. Run `docker ps` and then `docker ps --all`.
3. Notice that the container appears only in the second command.
4. Inspect its status with `docker inspect --format '{{.State.Status}} {{.State.ExitCode}}' fundamentos`.
5. The expected output is `exited 0`. Remove it with `docker rm fundamentos`.

### Remember this

> A container is a process isolated and limited by the kernel; it is not a small virtual machine.

**Radio after the sector:** fundamentals confirmed and the first sector is green. The 1950 British Grand Prix opened the history of the World Championship at Silverstone; here we also start from the foundation before chasing performance. Next, we will separate the car specification from the instance that actually takes to the track.

---

## Stage 02: image, container, and lifecycle

**Broadcast call:** watch the timing screen. From this point on, image and container must occupy different columns, because confusing the recipe with its execution costs reproducibility.

### The problem

A team needs to run the same Nginx version in development, testing, and production. Installing and configuring the program manually in every environment recreates the inconsistency problem. Copying a running container is not enough either, because it accumulates temporary state and does not represent a reproducible recipe.

### The concept

**Cockpit perspective:** the image is the immutable and versioned specification used to assemble the car. The container is an executable instance assembled from that specification. The same image can create several independent instances, just as an approved specification can guide more than one assembly without making the cars the same entity.

An **image** contains the filesystem and metadata required to start a process. It is made of reusable layers. A **container** adds a temporary writable layer on top of the image and executes the configured command.

The basic flow is:

1. `docker pull` downloads an image from a registry such as Docker Hub.
2. `docker run` creates and starts a container from the image.
3. `docker stop` requests that the process stop.
4. `docker start` restarts the same container.
5. `docker rm` removes the container.
6. `docker rmi` removes an image that is not in use.

Tags such as `node:20-alpine` identify variants. Avoid depending on `latest` in environments that require reproducibility, because the content associated with that tag can change.

I would not accept arriving on the grid with a sheet marked only as "the latest configuration." I want to know exactly which revision was assembled. An explicit tag provides that identification, although a tag can still be moved. When strong immutability is required, a digest identifies the image content precisely.

A **public registry** lets you discover and download public images, often without authentication. Docker Hub is the best-known example. A **private registry** restricts access to internal images and requires authentication. Before pushing an image, its local name must receive a tag containing the registry address, namespace, and version.

```sh
# Authenticates with the private registry.
# Use the prompt or a token; do not put the password directly in shell history.
docker login registry.exemplo.com

# Adds the complete name accepted by the registry to the local image.
docker tag minha-api:1.1 registry.exemplo.com/equipe/minha-api:1.1

# Pushes the versioned image to the private repository.
docker push registry.exemplo.com/equipe/minha-api:1.1
```

Expected output, shortened:

```text
Login Succeeded
1.1: digest: sha256:... size: ...
```

These commands require a real account and registry. Reading from a public registry may be anonymous, but `push` still requires write permission.

### Commented example: serving a page with Nginx

```sh
# Explicitly downloads the Alpine variant of the official image.
docker pull nginx:alpine

# Creates a container in the background.
# The name makes the next commands easier.
# Host port 8080 is forwarded to container port 80.
docker run --detach --name pagina --publish 8080:80 nginx:alpine

# Lists running containers.
docker ps

# Queries the server inside the container through the port published on the host.
curl http://localhost:8080

# Displays messages produced by the Nginx process.
docker logs pagina

# Runs a command in an already running container.
docker exec pagina nginx -v

# Stops and removes the container.
docker stop pagina
docker rm pagina
```

Expected output, shortened:

```text
CONTAINER ID   IMAGE          PORTS                  NAMES
abc123         nginx:alpine   0.0.0.0:8080->80/tcp   pagina
<!DOCTYPE html>
<title>Welcome to nginx!</title>
nginx version: nginx/...
```

### Hands-on

**Fast lap:** start, stop, and resume the same instance. The goal is not to memorize commands, but to see the complete lifecycle on the instruments.

1. Start `nginx:alpine` on port 8080 with the name `ciclo`.
2. Confirm the response with `curl -I http://localhost:8080`.
3. Stop the container and repeat the `curl`. The connection should fail.
4. Run `docker start ciclo` and confirm that the page is back.
5. Confirm that no required data exists only inside the container. Then remove it with `docker rm --force ciclo`. This option immediately stops and removes the instance, so it must not be used without checking the target.

### Remember this

> An image is the reproducible artifact; a container is a disposable execution of that image.

**Radio after the sector:** the difference is clear. Just as one specification can guide new assemblies, the image remains available when an execution ends. At the next turn, that specification gains a versioned recipe.

---

## Stage 03: Dockerfile as a reproducible recipe

**Broadcast call:** we enter the section where procedure beats improvisation. F1 history has always rewarded teams capable of turning workshop knowledge into a repeatable process, and the Dockerfile performs that role in the build.

### The problem

Downloading a ready-made image solves common tooling needs, but it does not package your application code. Manually copying files into a running container produces an environment that cannot be rebuilt with confidence.

### The concept

**Cockpit perspective:** if the image is the replicable car specification, the Dockerfile is the versioned sheet with the assembly sequence. Each instruction records a decision required to repeat the result without relying on a mechanic's memory.

The essential instructions are:

- `FROM`: chooses the base image.
- `WORKDIR`: sets the directory used by the following instructions.
- `COPY`: copies files from the build context.
- `RUN`: performs an action during the build.
- `CMD`: sets the default command executed when the container starts.

`RUN` happens during the build and records a layer in the image. `CMD` happens at runtime, when a container starts. Mixing these two moments is a common source of errors.

In my mind, `RUN` belongs to preparation at the factory; `CMD` belongs to the moment when the instance operates at the track. The comparison stops there: both are software mechanisms recorded in the image, not regulatory phases in the manufacture of a real car.

### Commented example: an application without external dependencies

Create `server.js`:

```js
// Imports only the HTTP module included with Node.js.
const http = require("node:http");

// Reads the port from the environment and keeps 3000 as the local default.
const port = Number(process.env.PORT || 3000);

// Creates a simple JSON response for every request.
const server = http.createServer((_request, response) => {
  response.writeHead(200, { "content-type": "application/json" });
  response.end(JSON.stringify({ status: "ok" }));
});

// Listens on every interface in the container.
server.listen(port, "0.0.0.0", () => {
  console.log(`Servidor disponível na porta ${port}`);
});
```

Create `Dockerfile`:

```dockerfile
# Uses an explicit Node version on a small base.
FROM node:20-alpine

# Sets the working directory inside the image.
WORKDIR /app

# Copies only the file required for this example.
COPY server.js ./server.js

# Documents the port used by the application.
# EXPOSE does not publish the port on the host.
EXPOSE 3000

# Sets the container's main process.
CMD ["node", "server.js"]
```

Build and run:

```sh
# The final dot is the build context.
docker build --tag minha-api:1.0 .

# Publishes the port and removes the container when it finishes.
docker run --rm --name minha-api --publish 3000:3000 minha-api:1.0
```

In another terminal:

```sh
curl http://localhost:3000
```

Expected output:

```json
{"status":"ok"}
```

### Hands-on

**Fast lap:** now track time counts. Build two revisions and prove that each tag identifies a distinct image before continuing.

1. Create the two example files in an empty directory.
2. Build `minha-api:1.0` and run the container.
3. Change the response value to `{"status":"pronto"}`.
4. Rebuild with the tag `minha-api:1.1`.
5. Run `docker images minha-api` and notice that the versions are distinct images.

### Remember this

> A Dockerfile turns manual decisions into a repeatable, version-controlled build.

**Radio after the sector:** recipe recorded and assembly repeatable. The next challenge is to cut build time and image weight without removing a required part.

---

## Stage 04: layers, cache, minimal images, and multistage builds

**Broadcast call:** we have reached the highly technical sector. Here, every instruction order in the Dockerfile changes cache behavior, and every tool carried into runtime must justify its weight.

### The problem

A Dockerfile copies the entire project before installing dependencies. Any one-line change invalidates the cache and downloads everything again. The final image also carries compilers, caches, and files used only during the build. The result takes longer to build, costs more to transfer, and offers a larger attack surface.

### The concept

**Cockpit perspective:** the factory uses molds, benches, and instruments that do not need to travel in the trackside kit. Carrying the whole workshop because a tool was needed during assembly increases weight, transfer costs, and risk surface without helping execution. A multistage build separates building from operating.

Docker reuses previous layers as long as the instruction and its input files have not changed. Dependency files should therefore be copied before the rest of the code. A **multistage build** uses a tool-rich stage to build the artifact and a smaller final stage to run it.

Common base image variants include:

- `slim`: reduced Debian base with good compatibility.
- `alpine`: very small, but uses musl and may require adjustments for native dependencies.
- `distroless`: contains only what is required for execution, usually without a shell or package manager.

Smaller does not always mean better. The base must be compatible, up to date, and sufficient to diagnose and run the application.

It is the same care we take when removing sensors or tools from the kit: reduction is a gain only when operational capability is preserved. A small image that breaks compatibility or makes every incident impossible to investigate may cost more than the megabytes saved.

The following example copies only `/app/dist` into runtime. This works only when `dist` is self-contained or when the application uses only native Node modules. If the artifact imports packages from `node_modules`, the final stage must also receive production dependencies, for example through its own `npm ci --omit=dev` installation. Multistage does not authorize leaving required dependencies behind.

### Commented example: separating build and execution

```dockerfile
# First stage: includes the environment required to build.
FROM node:20-alpine AS build

WORKDIR /app

# Copying manifests first preserves the cache when only source code changes.
COPY package.json package-lock.json ./

# npm ci uses the exact lockfile and produces a reproducible installation.
RUN npm ci

# Source code enters after the dependencies.
COPY . .

# Generates the application's dist directory.
RUN npm run build

# Second stage: contains only what is required to run.
FROM node:20-slim AS runtime

WORKDIR /app

# Copies the finished artifact from the previous stage.
COPY --from=build /app/dist ./dist

# Uses the unprivileged user already present in the official image.
USER node

# Starts the artifact without carrying tools from the build stage.
CMD ["node", "dist/index.js"]
```

Expected build output, shortened:

```text
=> [build ...] RUN npm ci
=> [build ...] RUN npm run build
=> [runtime ...] COPY --from=build /app/dist ./dist
=> naming to ... minha-app:otimizada
```

On the second build, if only a source file changes, the `npm ci` step should appear as `CACHED`.

To make the test reproducible without depending on an existing project, use the `server.js` from Stage 03 and add these two files:

`package.json`:

```json
{
  "name": "cache-demo",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "build": "node build.js"
  }
}
```

`package-lock.json`:

```json
{
  "name": "cache-demo",
  "version": "1.0.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "cache-demo",
      "version": "1.0.0"
    }
  }
}
```

`build.js`:

```js
// Uses only native modules, so the final artifact does not depend on node_modules.
const fs = require("node:fs");

// Recreates the output directory and copies the application as an executable artifact.
fs.rmSync("dist", { recursive: true, force: true });
fs.mkdirSync("dist", { recursive: true });
fs.copyFileSync("server.js", "dist/index.js");
```

### Hands-on

**Fast lap:** perform two builds and follow the cache split times. Then change only the source code to verify that the strategy kept dependencies green.

1. Create a directory with `server.js` from Stage 03, `package.json`, `package-lock.json`, `build.js`, and the Dockerfile from this stage.
2. Save the `package-lock.json` shown above. It allows `npm ci` to run inside the build without requiring Node or npm on the host.
3. Run `docker build --tag minha-app:otimizada .` twice.
4. On the second run, look for `CACHED` in the unchanged steps.
5. Change only the response message in `server.js` and rebuild.
6. Confirm that the `npm ci` step remained cached and test with `docker run --rm --publish 3000:3000 minha-app:otimizada`, followed by `curl http://localhost:3000` in another terminal.

### Remember this

> Order layers by how often they change and keep build tools out of the runtime image.

**Radio after the sector:** clean sector and a more efficient image. Brawn GP's 2009 season was marked by arriving with a very well integrated package; the equivalent lesson here is that gains come from the complete architecture, not from one isolated optimization. Now we need to ensure that data survives an instance change.

---
## Stage 05: persistence with volumes, bind mounts, and tmpfs

**Broadcast call:** the pit stop reaches its critical point: replacing the instance without losing what matters. The challenge now is to separate disposable state from data that must remain in the race.

### The problem

A database writes data to the container filesystem. During an update, the container is removed and recreated. The image remains available, but the data in the writable layer disappears with the container.

### The concept

**Cockpit perspective:** the container's writable layer is the set of temporary records produced by that car instance. When the instance is dismantled, that state goes with it. A volume is the data vault kept outside the car lifecycle, ready to be connected to the next instance.

Docker offers three main mechanisms:

| Mechanism | Management | Persistence | Typical use |
|---|---|---|---|
| Named volume | Docker | Yes | Application and database data |
| Bind mount | User and host | Yes | Local source code in development |
| tmpfs | Host memory | No | Temporary or sensitive data |

The `local` driver is the default for volumes. `tmpfs` is a mount type, not a persistent volume driver. A volume's physical path is an internal Engine detail and can vary across systems and runtimes. Prefer Docker commands instead of manipulating `/var/lib/docker` directly.

The `local` driver persists data on the host where Docker is running. When multiple hosts need to access shared storage, the volume can use NFS through the `local` driver itself or a remote plugin compatible with the provider, such as solutions integrated with EBS, Azure Disk, or Ceph. This choice depends on networking, availability, permissions, backup, and the consistency required by the application.

```sh
# Example of a remote NFS volume.
# Replace the address and path with an NFS server that is actually reachable.
docker volume create \
  --driver local \
  --opt type=nfs \
  --opt o=addr=192.168.1.100,rw \
  --opt device=:/dados/aplicacao \
  dados-remotos
```

Expected output when the volume is registered:

```text
dados-remotos
```

Creating the resource does not prove that the remote server is reachable. The actual mount occurs when a container uses the volume, and it may fail because of networking, NFS exports, or permissions. In orchestrators, platform-specific drivers and plugins perform this role.

A bind mount opens direct access to a specific host workbench, which is useful when the team needs to edit local source code during development. `tmpfs` is more like the garage work board: fast, held in memory, and intentionally erased when the operation ends. The comparison does not mean volumes are transported physical files; they are storage resources managed by the runtime.

### Commented example: data survives the container

```sh
# Creates a Docker-managed volume.
docker volume create dados-demo

# Writes a file inside the volume and removes the container when it finishes.
docker run --rm \
  --volume dados-demo:/dados \
  alpine sh -c 'echo persistiu > /dados/mensagem.txt'

# A new container reads the same volume.
docker run --rm \
  --volume dados-demo:/dados:ro \
  alpine cat /dados/mensagem.txt

# Displays volume metadata.
docker volume inspect dados-demo
```

Expected output:

```text
persistiu
```

The `:ro` suffix mounts the volume as read-only in the second container.

### Hands-on

**Timed pit stop:** write the data, dismantle the instance, and return with another container. The green flag appears only when the file returns intact.

1. Run the commands in the example.
2. Confirm that the first container no longer exists with `docker ps --all`.
3. Read the file using a second container.
4. Compare it with a `tmpfs`: `docker run --rm --tmpfs /dados alpine sh -c 'echo temporario > /dados/a && cat /dados/a'`.
5. Confirm that the volume contains only lab data. Then run `docker volume rm dados-demo`. Removal is permanent and has no trash or automatic recovery.

### Remember this

> If data must survive the container, it cannot depend on that container's writable layer.

**Radio after the sector:** the change was completed without leaving the data in the garage. With persistence secured, the next section requires predictable communication among services.

---

## Stage 06: networks, internal DNS, and port publishing

**Broadcast call:** we enter the communication sector. Services need to find one another through stable identification, while only the access points that are actually needed are opened outside the operation.

### The problem

An API needs to access a database. Using the container's current IP address works until it is recreated and receives another address. Publishing the database port on the host solves access, but it exposes a service that should remain internal.

### The concept

**Cockpit perspective:** a custom Docker network works as the team's private communication channel. Each service calls the other by a stable call sign, such as `web` or `db`, even when its numeric address changes after recreation. Publishing a port is equivalent to opening controlled access outside that internal operation.

The modes presented in the sources are:

- `bridge`: isolated network on the same host. User-created bridge networks provide automatic name resolution.
- `host`: shares the host network stack. It reduces isolation and can cause port conflicts.
- `none`: disables network connectivity for the container.
- `overlay`: connects services across multiple hosts in orchestrated environments.

The default `bridge` network and a user-created bridge are not equivalent. DNS by container name is an advantage of a custom network. Do not depend on this automatic discovery on the default bridge.

The radio parallel has a clear limit: DNS neither carries conversation nor authenticates participants. It resolves names to addresses. Isolation, encryption, and authorization require their own mechanisms.

`EXPOSE 3000` documents a port in the image. `--publish 8080:3000` creates forwarding from host port 8080 to container port 3000.

### Commented example: discovery by name

```sh
# Creates a bridge with internal DNS.
docker network create rede-demo

# Starts a server named web on that network.
docker run --detach --name web --network rede-demo nginx:alpine

# A temporary container resolves the web hostname and makes a request.
docker run --rm --network rede-demo curlimages/curl \
  --silent --head http://web

# Shows which containers are connected.
docker network inspect rede-demo

# Cleans up the exercise resources.
docker rm --force web
docker network rm rede-demo
```

Expected output, shortened:

```text
HTTP/1.1 200 OK
Server: nginx/...
```

No port was published. Communication happened internally through the `web` hostname.

### Hands-on

**Fast lap:** make the call from inside and outside the network. The difference between successful and failed resolution should be clear on the dashboard.

1. Repeat the example and confirm HTTP status 200.
2. Before removing the network, run `docker run --rm curlimages/curl --head http://web` without `--network rede-demo`.
3. Observe the resolution failure because the new container is outside the network.
4. Before the cleanup commands in the example, create a client with `docker run --detach --name cliente alpine sleep 300`.
5. Connect it with `docker network connect rede-demo cliente`.
6. Prove name discovery with `docker exec cliente wget -qO- http://web`. The output should contain the Nginx welcome HTML.
7. Inspect the connections with `docker network inspect rede-demo`.
8. Check the names and remove the lab containers with `docker rm --force cliente web`; then remove the network with `docker network rm rede-demo`. `--force` stops containers without a normal shutdown and is appropriate here only because both are disposable.

### Remember this

> Containers on the same custom network find one another by name; publish only the ports that need to be accessed from the host.

**Radio after the sector:** internal channel confirmed and exposure under control. The challenge now is to record the whole operation in a plan that any team member can repeat.

---

## Stage 07: Docker Compose for multi-container applications

**Broadcast call:** the pit wall takes a complete view. Service, network, volume, and configuration become part of one operational plan that is versioned and readable by the entire team.

### The problem

Starting an API, database, network, and volume with several commands works until someone forgets a flag, uses a different name, or performs the steps in the wrong order. The environment stops being a version-controlled configuration and becomes an oral sequence of instructions.

### The concept

**Cockpit perspective:** isolated `docker run` commands are like orders sent to the garage one at a time. A Compose file is the versioned operational plan for the weekend, with each service, network, storage resource, configuration, and relationship described together.

Docker Compose describes an application in YAML. Its main elements are:

- `services`: containers that make up the application.
- `build` or `image`: how to obtain each service image.
- `ports`: ports published on the host.
- `volumes`: persistence or file sharing.
- `networks`: communication boundaries.
- `environment` and `env_file`: non-secret configuration.
- `secrets`: mounted files for sensitive data.

The plan does not drive by itself. Compose interprets the definition and coordinates Docker resources, but the application must still handle startup, transient failures, and dependencies correctly. It is like a perfect operations sheet: it organizes execution, but it does not eliminate the need to respond to real track data.

### Commented example: web and database

```yaml
services:
  web:
    # Builds using the Dockerfile in the current directory.
    build:
      context: .
      dockerfile: Dockerfile
    # Publishes only the service that receives external traffic.
    ports:
      - "3000:3000"
    # The db hostname is resolved by DNS on the Compose network.
    environment:
      DB_HOST: db
    # Expresses creation dependency, not database readiness.
    depends_on:
      - db

  db:
    # Pins a version of the official image.
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: exemplo-local
    # Persists data outside the container lifecycle.
    volumes:
      - dados_db:/var/lib/postgresql/data

# Declares the named volume used by the database.
volumes:
  dados_db:
```

Commands:

```sh
# Builds images and starts services in the background.
docker compose up --detach --build

# Shows application state.
docker compose ps

# Follows service logs.
docker compose logs --follow

# Stops containers and networks while preserving the volume.
docker compose down
```

Expected output, shortened:

```text
NAME          IMAGE                SERVICE   STATUS
projeto-db-1  postgres:16-alpine   db        Up
projeto-web-1 projeto-web          web       Up
```

### Hands-on

**Timed pit stop:** validate first, start next, and observe everything before dismantling it. A fast operation still follows the correct sequence.

1. Save the example as `compose.yaml` next to a working Dockerfile.
2. Run `docker compose config` before starting. This command displays the consolidated configuration and detects YAML errors.
3. Run `docker compose up --detach --build`.
4. Check `docker compose ps` and `docker compose logs db`.
5. Finish with `docker compose down`. Do not use `--volumes` if you want to preserve the data.

### Remember this

> Compose turns a fragile sequence of commands into a version-controlled application definition.

**Radio after the sector:** the team no longer depends on disconnected instructions and starts working from a shared configuration. The next sector tests how this plan responds to different environments and failures.

---

## Stage 08: environments, restart, scaling, and CI

**Broadcast call:** the race changes, and the configuration must respond without erasing the original plan. It is time to combine files, define reactions to failure, and understand the limit of replicas on the same host.

### The problem

Development needs a bind mount and detailed logs. Production needs a ready-made image and less exposure. Copying the entire Compose file for every environment creates nearly identical files that diverge over time. In addition, a process can fail temporarily and not return on its own.

### The concept

**Cockpit perspective:** the base configuration is the shared operational plan. Additional files record adjustments for practice, testing, or the race without duplicating the entire definition. I want to see exactly what changed between configurations; `docker compose ... config` provides that consolidated view before the start.

Compose combines files in the order provided with `-f`. A production file can replace only the image, ports, or required variables:

```sh
docker compose \
  -f compose.yaml \
  -f compose.prod.yaml \
  config
```

Use `config` to check the result before starting the services.

Restart policies:

- `no`: does not restart automatically.
- `on-failure`: restarts when the process ends with a nonzero code.
- `always`: attempts to keep the container active.
- `unless-stopped`: similar to `always`, but respects a manual stop.

A restart policy does not solve startup order or guarantee that a dependency is ready. For readiness, combine `healthcheck` with conditional dependencies when supported by your Compose version, and keep retries in the application itself.

`docker compose up --scale worker=3` creates replicas of a service. A fixed mapping such as `8080:3000` prevents multiple replicas on the same host because port 8080 can be occupied only once.

Here the F1 analogy breaks on purpose. A team normally competes with two cars, while a service can have three, thirty, or hundreds of replicas. Docker's technical rule applies: each replica is an independent instance, and a fixed host port cannot be occupied by all of them at the same time.

### Commented example: base and production

`compose.yaml`:

```yaml
services:
  web:
    # Uses a public image so the example runs without an external project.
    image: nginx:alpine
    # Restarts only after a process failure, up to three times.
    restart: on-failure:3
    labels:
      ambiente: desenvolvimento
    healthcheck:
      # wget is already present in this image variant.
      test: ["CMD", "wget", "--quiet", "--spider", "http://localhost"]
      interval: 5s
      timeout: 2s
      retries: 5
```

`compose.prod.yaml`:

```yaml
services:
  web:
    # The additional file changes the image channel and environment.
    image: nginx:stable-alpine
    labels:
      ambiente: producao
```

Expected output from `docker compose -f compose.yaml -f compose.prod.yaml config`, shortened:

```yaml
services:
  web:
    image: nginx:stable-alpine
    restart: on-failure:3
    labels:
      ambiente: producao
```

In CI, the same definition can start dependencies, run tests, and be removed at the end:

```sh
# --wait returns only after services with a healthcheck become healthy.
docker compose up --detach --wait

# Validates the Nginx configuration inside the reproducible service.
docker compose exec web nginx -t

# Stops resources without removing persistent volumes.
docker compose down
```

`--wait` is available in modern Docker Compose versions. Check with `docker compose up --help`. If the option does not exist, update the plugin or watch `docker compose ps` until the service appears as `healthy`; do not treat a simple `Up` as proof of readiness.

### Hands-on

**Fast lap:** compare the base configuration with the combined result. This proves whether the race adjustment changed only what was necessary.

1. Create an empty directory and save the two example YAML files in it. No Dockerfile or additional source code is required.
2. Compare `docker compose -f compose.yaml config` with `docker compose -f compose.yaml -f compose.prod.yaml config`.
3. Observe the image tag and the `ambiente` label value in the consolidated result.
4. Run `docker compose -f compose.yaml -f compose.prod.yaml up --detach --wait`.
5. Confirm `healthy` with `docker compose -f compose.yaml -f compose.prod.yaml ps`.
6. Validate Nginx with `docker compose -f compose.yaml -f compose.prod.yaml exec web nginx -t` and finish with `docker compose -f compose.yaml -f compose.prod.yaml down`.

### Remember this

> Additional Compose files change only what varies between environments; restart recovers processes, but does not replace readiness verification.

**Radio after the sector:** strategy adjusted without duplicating the whole plan. At the 1998 Hungarian Grand Prix, Ferrari and Michael Schumacher executed a switch to three stops and turned operational discipline into victory; in Compose, the lesson is equally clear: an adjustment works only when execution and limits are understood. Now we enter stack protection.

---

## Stage 09: layered security

**Broadcast call:** we have reached the zone where every excess carries a high cost. Each permission removed reduces the options available to an exploit, but no isolated layer guarantees complete protection.

### The problem

A vulnerable application runs as root, receives more capabilities than it needs, and carries a token inside the image. If it is exploited, the attacker finds permissions and data that were never required for the service's task.

### The concept

**Cockpit perspective:** container security resembles a team's access control. Partitions restrict visibility, credentials limit actions, dangerous procedures are blocked, and each member receives only the tools required for the job. Nobody needs the key to the entire factory to change a tire.

The layers presented in the sources are:

- **Namespaces** isolate the view of resources.
- **Capabilities** divide traditional root privileges into smaller permissions.
- **Seccomp** filters system calls.
- **Non-root user** reduces the impact of an exploit.
- **Minimum permissions** avoid using `chmod 777` as a generic solution.
- **Small and current image** reduces the tools and vulnerabilities available.
- **Secrets in dedicated files** keep sensitive values out of the Dockerfile and environment.

The root user inside a container is not automatically identical to root on the host because namespaces and capabilities impose limits. Even so, running unnecessarily as UID 0 increases risk, especially with dangerous mounts, extra capabilities, or runtime vulnerabilities.

Namespaces are not impenetrable walls, and `USER node` does not solve security by itself. Protection comes from combining controls. We also work in layers at the track, but the real implementation here belongs to the kernel, runtime, image, and execution options.

### Commented example: runtime with reduced privileges

```dockerfile
# Starts from an official, versioned image.
FROM node:20-alpine

WORKDIR /app

# Copies files already owned by the node user.
COPY --chown=node:node . .

# Installs dependencies according to the lockfile.
RUN npm ci --omit=dev

# The following runtime instructions use an unprivileged UID.
USER node

CMD ["npm", "start"]
```

```sh
# Drops all additional capabilities at runtime.
# Add a capability only if the service proves that it needs it.
docker run --rm \
  --user node \
  --cap-drop ALL \
  --read-only \
  --tmpfs /tmp \
  node:20-alpine \
  sh -c 'if touch /bloqueado 2>/dev/null; then exit 1; else echo "raiz bloqueada"; fi; echo "tmpfs gravável" > /tmp/teste; cat /tmp/teste'
```

Expected write-test output:

```text
raiz bloqueada
tmpfs gravável
```

The first `touch` fails because the root filesystem is read-only. The second writes to `/tmp` because that path received a writable and ephemeral `tmpfs`.

Do not mount `/var/run/docker.sock` in ordinary applications. Anyone who controls this socket can control Docker Engine and, in practice, compromise the host.

### Hands-on

**Timed pit stop:** reduce privileges and test the write boundaries. Each expected failure confirms that an unnecessary door has been closed.

1. Run `docker run --rm node:20-alpine id` and observe the image's default user.
2. Run `docker run --rm --user node node:20-alpine id` and confirm `uid=1000(node)`.
3. Run the complete example command with `--read-only` and `--tmpfs /tmp`.
4. Confirm both expected messages: the root filesystem blocked writing and `/tmp` accepted it.
5. Remove `--tmpfs /tmp`, repeat the command, and observe that writing to `/tmp` also fails because it becomes part of the read-only root filesystem again.

### Remember this

> Container security is defense in depth: user, permissions, capabilities, system calls, image, and mounts must work together.

**Radio after the sector:** privileges reduced and barriers layered. We still need to prevent inappropriate material from reaching the image assembly process itself.

---

## Stage 10: build context, secrets, and image analysis

**Broadcast call:** inspection begins for the material sent to assembly. Everything in the context can affect time, cache, size, and exposure, so screening must happen before the build.

### The problem

A `docker build .` sends `.git`, `node_modules`, logs, and `.env` into the context. The build takes longer, the cache is invalidated unnecessarily, and a secret can be copied into a layer. Even when deleted in a later instruction, it may remain in the history of a previous layer.

### The concept

**Cockpit perspective:** the build context is the crate delivered to the assembly area. `.dockerignore` is the screening performed before shipment. If a confidential engine map entered the crate and was recorded in a layer, removing it from the finished product later is too late.

Example `.dockerignore`:

```gitignore
# Local dependencies will be installed inside the image.
node_modules

# Local configuration and possible secrets do not enter the context.
.env
.env.*

# History, metadata, and temporary files are unnecessary.
.git
*.log
coverage
dist
```

`env_file` is convenient for local configuration, but it does not turn values into secrets. They may appear in the configuration and container inspection. `.env` files with credentials must not be versioned.

Build parameters also require a clear boundary. `ARG` declares a value available during the build, and `build.args` supplies that value through Compose. They are suitable for non-confidential data such as a version, distribution channel, or feature selection. Do not use `ARG` for a password or token: build values can appear in history, metadata, and pipeline logs.

```dockerfile
# Uses a concrete base before declaring the stage argument.
FROM node:20-alpine

# Declares a non-confidential parameter with a default value.
ARG APP_VERSION=dev

# Records the version as queryable image metadata.
LABEL org.opencontainers.image.version=$APP_VERSION
```

```yaml
services:
  app:
    build:
      context: .
      args:
        # The version guides the build, but is not a secret.
        APP_VERSION: "1.4.0"
```

After the build, `docker inspect --format '{{index .Config.Labels "org.opencontainers.image.version"}}' nome-da-imagem` should print `1.4.0`. An `ARG` does not automatically become a runtime environment variable; it persists here only because it was deliberately recorded in a label.

Compose can mount a secret as a file:

```yaml
services:
  db:
    image: postgres:16-alpine
    environment:
      # The image reads the contents of the specified file.
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password
    secrets:
      - db_password

secrets:
  db_password:
    # The file must exist locally and stay out of Git.
    file: ./secrets/db_password.txt
```

In local Compose, this reduces accidental exposure by mounting the value as a file, but it does not create an encrypted vault by itself. Protect the source file and use a suitable secret manager in the target environment.

In the team analogy, the mechanism delivers a credential through a channel separate from the rest of the specification. The comparison stops before suggesting absolute protection: local Compose does not turn the source file into a vault, just as putting a document in an envelope does not by itself secure the entire chain of custody.

Tools cited in the sources complement the review:

- **Dive** shows the content and weight of each layer.
- **Snyk** checks the image and its dependencies for known vulnerabilities.

### Commented example: checking the context and image

```sh
# Shows detailed progress and the size of the context sent.
docker build --progress plain --tag minha-app:analise .

# Displays the layers and commands that formed the image.
docker history minha-app:analise

# Displays the final size.
docker images minha-app:analise
```

Expected output, with variable values:

```text
transferring context: ...
IMAGE          TAG       SIZE
minha-app      analise   ...MB
```

### Hands-on

**Fast lap:** time the context before and after `.dockerignore`. The gain should appear in the build data and image history.

1. Run a build with `--progress plain` and record the context size.
2. Create the example `.dockerignore` and repeat the build.
3. Compare the amount sent and cache reuse.
4. Use `docker history` to identify instructions that added more data.
5. If Dive or Snyk is installed, analyze the same tag and record one improvement point.

### Remember this

> A secret that never enters the context cannot leak through a layer created during the build.

**Radio after the sector:** inspection completed before the load goes to the factory. If anything fails from this point onward, we need to replace anxiety with a reliable investigation sequence.

---
## Stage 11: troubleshooting with an investigation order

**Broadcast call:** yellow flag on the circuit. The right speed now is disciplined diagnosis: state, logs, configuration, events, and resources, in that order, before any guesswork.

### The problem

A container enters `Exited (1)`. Restarting it repeatedly does not explain the cause. Changing several settings at the same time can hide the symptom and create new problems.

### The concept

**Cockpit perspective:** when I feel a loss of power, I do not change five settings at once. First I check the state on the dashboard, describe the symptom over the radio, correlate telemetry, and observe the sequence of events. In Docker, status, logs, metadata, and events fulfill these roles.

Use a predictable sequence:

1. **State:** `docker ps --all` shows whether the container is running, stopped, or restarting.
2. **Logs:** `docker logs` shows the process's stdout and stderr.
3. **Configuration:** `docker inspect` reveals the command, mounts, network, ports, and state.
4. **Events:** `docker events` shows creation, start, stop, kill, and removal in real time.
5. **Process and resources:** `docker top` and `docker stats` show processes and consumption.
6. **Internal test:** `docker exec` runs a check inside a container that is still active.

Using `docker restart` without evidence is like turning the car off and on without reading telemetry: it may restore the system for a few minutes, but it also erases operational context and does not identify the cause. The order above protects the diagnosis from guesswork.

### Commented example: causing and locating a failure

```sh
# The shell records an error message and exits with code 42.
docker run --name falha alpine \
  sh -c 'echo "configuração ausente" >&2; exit 42'

# Confirms the exit code without reading the entire JSON document.
docker inspect --format \
  'status={{.State.Status}} exit={{.State.ExitCode}} oom={{.State.OOMKilled}}' \
  falha

# Retrieves the message emitted by the process.
docker logs falha

# Removes the resource after diagnosis.
docker rm falha
```

Expected output:

```text
status=exited exit=42 oom=false
configuração ausente
```

To observe real-time events, open one terminal:

```sh
# Filters events of the container type.
docker events --filter type=container
```

In another terminal, start and stop a container. The output will show actions such as `create`, `start`, `die`, and `destroy`.

### Hands-on

**Fast lap under a yellow flag:** resist the automatic restart. Record the hypothesis, compare it with the logs, and preserve the evidence until you close the cause.

1. Cause the failure from the example.
2. Before reading the logs, form a hypothesis using only state and exit code.
3. Check the hypothesis with `docker logs falha`.
4. Use `docker inspect --format '{{json .Config.Cmd}}' falha` to see the original command.
5. Remove the container only after recording the cause.

### Remember this

> Diagnosis begins with observable state and advances toward evidence; restarting is not investigating.

**Radio after the sector:** cause before correction, evidence before guesswork. This method leads directly to the next question: does the process merely exist, or is the service actually ready?

---

## Stage 12: logs, healthchecks, and operational readiness

**Broadcast call:** engine running and car stationary in the garage. Telemetry must answer whether the service can actually perform its function, not only whether the process is still alive.

### The problem

The process is active, so the container appears as `Up`. Even so, the application cannot serve requests because it has lost access to a dependency. In another incident, the container was recreated and its local logs disappeared.

### The concept

**Cockpit perspective:** a running engine does not mean that the car is ready to leave the garage. Hydraulic pressure, communications, temperature, and critical systems must respond within range. Process state indicates presence; a healthcheck verifies service capability.

A healthcheck periodically performs a check and classifies the container as `starting`, `healthy`, or `unhealthy`. It does not fix the application by itself. The runtime or orchestrator policy decides how to respond.

The check's green light also has a limited scope. It proves only the condition examined by the test at that moment. A shallow endpoint can stay green while an important function is broken; a test that is too heavy can create load and false alarms. A healthcheck must represent the right function at a controlled cost.

Applications should write logs to stdout and stderr. Structured logs, usually JSON with `timestamp`, `level`, `message`, and `service`, simplify search and correlation. In larger environments:

- Promtail can collect logs and send them to Loki.
- Loki stores and queries logs.
- Fluentd can collect, transform, and route events.
- Grafana can query and visualize the data.

### Commented example: healthcheck in Compose

```yaml
services:
  api:
    image: minha-api:1.0
    healthcheck:
      # Performs a request with a tool present in the image.
      test: ["CMD", "curl", "--fail", "http://localhost:3000/health"]
      # Checks every 30 seconds.
      interval: 30s
      # Stops an attempt that exceeds 10 seconds.
      timeout: 10s
      # Marks the container unhealthy after three consecutive failures.
      retries: 3
      # Gives the application time to start before counting failures.
      start_period: 20s
```

Make sure `curl` exists in the image. With minimal images, prefer a check performed by the application runtime itself or deliberately include the required tool.

Expected output in `docker compose ps`:

```text
NAME            SERVICE   STATUS
projeto-api-1   api       Up ... (healthy)
```

### Hands-on

**Fast lap:** cause a real dependency loss and follow the state change. The exercise ends when the indicator explains what happened.

1. Finish the Stage 13 capstone files and start the stack with `docker compose up --detach --build --wait`.
2. Confirm the initial state with `docker compose ps`. The API and database should both appear as `healthy`.
3. Stop the API's actual dependency with `docker compose stop db`.
4. Follow `docker compose ps` until the API appears as `unhealthy`. The endpoint returns 503 because the TCP test against the database fails.
5. Inspect the attempts with `docker inspect --format '{{json .State.Health}}' $(docker compose ps -q api)` and correlate them with `docker compose logs api`.
6. Restore the database with `docker compose start db` and wait for both services to become `healthy` again.

### Remember this

> Process state answers "is it running?"; a healthcheck answers "can it perform its function?"

**Radio after the sector:** the dashboard and telemetry now tell different but complementary stories. We only need to bring them together in the complete capstone operation.

---
## Stage 13: capstone, a small and defensive stack

**Broadcast call:** final lap, with every system working together. Build, network, persistence, secrets, health, and observability must cross the line as one coherent package.

### The problem

The individual concepts work in the exercises, but production requires them to cooperate. The image must be reproducible, the process must run without root, the API must find the database by name, the database must persist data, the password must not become an exposed variable, and the environment must report when each service is healthy.

### The concept

This final project combines only mechanisms already presented: Dockerfile, multistage build, non-root user, custom network, volume, tmpfs, file-mounted secret, healthcheck, health-based dependency, reduced privileges, logs, and Compose.

**Cockpit perspective:** I read the capstone as the complete operation of a Grand Prix. The specification produces the instance, assembly brings only what is required to the track, the internal channel connects the API and database, the vault preserves data, credentials arrive separately, telemetry records behavior, and the healthcheck decides whether the system is fit to run. No isolated mechanism wins the race; the result comes from the discipline of the complete package.

The API uses only native Node modules. It tests whether it can open a TCP connection to PostgreSQL. This proves DNS discovery and connectivity without adding a database library to the exercise.

Compose also applies simple CPU and memory limits. They contain the laboratory's maximum consumption, but they do not guarantee performance or reserve exclusive capacity. Labels add metadata for inventory, automation, and observability; they describe services without changing their behavior.

### Commented example: project files

Structure:

```text
capstone/
├── app/
│   └── server.js
├── secrets/
│   └── db_password.txt
├── .dockerignore
├── Dockerfile
└── compose.yaml
```

`app/server.js`:

```js
// Uses only modules included with Node.js.
const http = require("node:http");
const net = require("node:net");

const port = Number(process.env.PORT || 3000);
const databaseHost = process.env.DB_HOST || "db";

// Tests whether the database TCP port accepts a connection.
function databaseReachable() {
  return new Promise((resolve) => {
    const socket = net.createConnection(5432, databaseHost);
    const finish = (result) => {
      socket.destroy();
      resolve(result);
    };

    socket.setTimeout(1000);
    socket.once("connect", () => finish(true));
    socket.once("timeout", () => finish(false));
    socket.once("error", () => finish(false));
  });
}

const server = http.createServer(async (request, response) => {
  const reachable = await databaseReachable();
  const status = reachable ? 200 : 503;
  const body = {
    service: "api",
    database: reachable ? "reachable" : "unreachable",
  };

  // Produces a structured log on stdout.
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    level: reachable ? "info" : "error",
    path: request.url,
    database: body.database,
  }));

  response.writeHead(status, { "content-type": "application/json" });
  response.end(JSON.stringify(body));
});

server.listen(port, "0.0.0.0", () => {
  console.log(JSON.stringify({ level: "info", message: `listening:${port}` }));
});
```

`Dockerfile`:

```dockerfile
# Artifact preparation stage.
FROM node:20-alpine AS build
WORKDIR /build
COPY app/server.js ./server.js

# Smaller final stage, separate from preparation.
FROM node:20-alpine AS runtime
WORKDIR /app

# Copies the artifact with the correct owner.
COPY --from=build --chown=node:node /build/server.js ./server.js

# Documents the port and drops root privileges.
EXPOSE 3000
USER node

# Uses exec form so Node receives signals directly.
CMD ["node", "server.js"]
```

`.dockerignore`:

```gitignore
.git
.env
secrets
node_modules
*.log
```

`compose.yaml`:

```yaml
services:
  api:
    # Builds the local image with the Dockerfile.
    build:
      context: .
      dockerfile: Dockerfile
    # Publishes only the API.
    ports:
      - "3000:3000"
    environment:
      DB_HOST: db
      PORT: "3000"
    # Waits for the database to become healthy before creating the API.
    depends_on:
      db:
        condition: service_healthy
    # Drops capabilities that the API does not use.
    cap_drop:
      - ALL
    # Limits maximum service consumption on the host.
    cpus: "0.50"
    mem_limit: 128m
    # Identifies the container role for search and automation.
    labels:
      com.pitstop.service: api
      com.pitstop.component: backend
    # Prevents writes to the root filesystem and provides ephemeral /tmp.
    read_only: true
    tmpfs:
      - /tmp
    restart: on-failure:3
    networks:
      - interna
    healthcheck:
      # fetch is available in Node 20 and avoids installing curl.
      test:
        - CMD
        - node
        - -e
        - fetch('http://localhost:3000/health').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))
      interval: 10s
      timeout: 3s
      retries: 3
      start_period: 5s

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: app
      POSTGRES_DB: app
      # The official image reads the password from this file.
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password
    secrets:
      - db_password
    volumes:
      - dados_db:/var/lib/postgresql/data
    networks:
      - interna
    # Keeps the database within limits suitable for the lab.
    cpus: "0.75"
    mem_limit: 512m
    # Records metadata without changing process execution.
    labels:
      com.pitstop.service: db
      com.pitstop.component: database
    restart: unless-stopped
    healthcheck:
      # pg_isready is already present in the PostgreSQL image.
      test: ["CMD-SHELL", "pg_isready -U app -d app"]
      interval: 5s
      timeout: 3s
      retries: 10

volumes:
  # The database keeps data after container recreation.
  dados_db:

networks:
  # The user-created network provides DNS by service name.
  interna:

secrets:
  db_password:
    # This file is outside the context because of .dockerignore.
    file: ./secrets/db_password.txt
```

### Hands-on

**Final pit stop:** perform the complete sequence without skipping inspection. Each confirmation in the procedure validates one part of the architecture before the checkered flag.

> **Before starting:** host port 3000 must be available. Check with `docker ps --filter publish=3000`. If another container is already using it, stop that resource only if it belongs to you, or change the mapping to `"3001:3000"` and use `curl http://localhost:3001/health` in the following steps.

1. Create the structure and files exactly as shown.
2. Save a laboratory password with `mkdir -p secrets && printf 'troque-esta-senha' > secrets/db_password.txt`.
3. Validate the YAML with `docker compose config --quiet`.
4. Start the stack with `docker compose up --detach --build --wait`.
5. Run `curl http://localhost:3000/health`.
6. The expected output is `{"service":"api","database":"reachable"}`.
7. Run `docker compose ps` and confirm that both services are healthy.
8. Run `docker compose logs api` and find the JSON log for the request.
9. Confirm the user with `docker compose exec api id`. The output must identify the `node` user, not `root`.
10. Run `docker compose down`, start it again, and confirm that the `dados_db` volume still exists with `docker volume ls`.
11. If you want to preserve the database, stop only with `docker compose down`. Use `docker compose down --volumes` only when you decide to discard the lab: this command removes the `dados_db` volume and permanently deletes its contents, with no trash or automatic recovery. Make a backup first if there is any required data.

### Remember this

> A mature stack does not depend on a miracle feature: it combines reproducible builds, isolation, least privilege, persistence, health, and operational evidence.

**Radio after the sector:** complete lap and every system checked. The final time did not come from a trick, but from the sum of small, verifiable, and well-coordinated decisions.

On the track, I would translate it like this: speed without repeatability, control, and evidence lasts only until the first failure.

---
## Quick command reference

| Goal | Command |
|---|---|
| List active containers | `docker ps` |
| List all containers | `docker ps --all` |
| List images | `docker images` |
| Download an image | `docker pull imagem:tag` |
| Run a container | `docker run imagem:tag` |
| Stop a container | `docker stop nome` |
| Restart a stopped container | `docker start nome` |
| Remove a container | `docker rm nome` |
| View logs | `docker logs nome` |
| Run a command | `docker exec nome comando` |
| Inspect a resource | `docker inspect nome` |
| Copy a file | `docker cp origem destino` |
| List volumes | `docker volume ls` |
| List networks | `docker network ls` |
| Validate Compose | `docker compose config` |
| Start an application | `docker compose up --detach` |
| Stop an application | `docker compose down` |
| View events | `docker events` |
| View resource usage | `docker stats` |

The `docker container prune`, `docker image prune`, and `docker system prune` commands remove unused resources. Read the list presented by Docker and confirm its scope before proceeding.

---

## Checkered flag: self-assessment checklist

The checkered flag is out, but the result counts only after inspection. Mark every item you can explain and perform without relying on trial and error.

- [ ] I can explain why a container is not a small VM.
- [ ] I can describe the roles of namespaces and cgroups.
- [ ] I can distinguish an image, a layer, and a container.
- [ ] I can explain why the main process determines the container lifecycle.
- [ ] I can build and version an image with a Dockerfile.
- [ ] I can distinguish `RUN`, `CMD`, `EXPOSE`, and `--publish`.
- [ ] I can organize a Dockerfile to take advantage of cache.
- [ ] I understand when to choose `slim`, `alpine`, or a more complete image.
- [ ] I can explain the benefit of a multistage build.
- [ ] I can choose between a volume, bind mount, and tmpfs.
- [ ] I can connect services by name on a custom network.
- [ ] I publish only the ports that need to leave the internal network.
- [ ] I can validate, start, observe, and stop a Compose application.
- [ ] I can combine Compose files for different environments.
- [ ] I understand that restart does not guarantee dependency readiness.
- [ ] I can configure a non-root user, read-only filesystem, and minimum capabilities.
- [ ] I know why `.env` files and secrets must not enter the build context.
- [ ] I can investigate a failure using status, logs, inspect, and events.
- [ ] I can distinguish an active process from a healthy service.
- [ ] I can explain how structured logs help centralization and search.
- [ ] I completed the capstone and can justify every Compose decision.

**Learning podium:** you completed a journey that began with process isolation and ended with a defensive, persistent, and observable stack. Reproducibility stands on the top step. Least privilege and evidence-based diagnosis stand beside it. The celebration lasts a moment; the next improvement begins when you repeat the capstone, cause a failure, and can explain every system response.

---

## Instructor notes

The corrections below resolve inaccuracies found in the raw material without changing the objective of the six lessons:

1. **Portability does not mean complete operating-system independence.** Containers share the kernel. Docker Desktop runs Linux containers through a Linux VM when the host does not use that kernel directly.
2. **Root in the container is not automatically the same as root on the host.** Namespaces and capabilities reduce privileges, but running as UID 0 still increases the impact of dangerous configurations and isolation failures.
3. **`tmpfs` is not a persistent volume driver.** It is an in-memory mount and loses its contents when removed.
4. **DNS by name is guaranteed on user-created bridge networks.** The default bridge must not be described as equivalent to a custom network in this respect.
5. **`EXPOSE` does not publish a port.** Publishing happens with `--publish` or `ports` in Compose.
6. **A `restart` policy does not fix ordering or readiness.** It reacts to process termination. Health, dependency, and retries address different problems.
7. **Local Compose secrets are not an encrypted vault.** Compose mounts a secret as a file and reduces exposure, but the source file still needs protection.
8. **An `.env` file containing a secret must not be versioned.** Local convenience does not justify placing credentials in Git.
9. **Minimal images involve a tradeoff.** Alpine, slim, and distroless reduce size and surface, but compatibility and diagnostic capability must also be considered.
10. **Removing a secret in a later layer does not erase it from an earlier layer.** The correct approach is to prevent it from entering the context and use dedicated secret mechanisms.
11. **`ARG` and `build.args` are not secret mechanisms.** Build values can appear in history, metadata, and pipeline logs.
12. **A volume using the `local` driver belongs to the Engine host.** Sharing across hosts requires remote storage and compatible configuration, such as NFS or a provider plugin.
13. **A resource limit is not a performance reservation.** `cpus` and `mem_limit` contain consumption, but do not provide exclusive capacity or replace monitoring.
14. **A label is metadata, not a security control.** It helps inventory, automation, and observability, but does not enforce isolation or authorization.

## Consolidated sources

1. Lesson 01, Introduction to Containers.
2. Lesson 02, Images and Containers.
3. Lesson 03, Dockerfile and Image Builds.
4. Lesson 04, Volumes and Networks.
5. Lesson 05, Docker Compose.
6. Lesson 06, Best Practices, Security, and Troubleshooting.
