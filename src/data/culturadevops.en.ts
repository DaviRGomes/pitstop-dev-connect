// Content from the four lessons of the "DevOps Culture" course (Phase 1), one stage per lesson,
// themed around Formula 1 by the /otimizar-relatorio pipeline (relatorios/cultura-devops/final.en.md).

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
};

export type Mapping = { tema: string; f1: string };

export const DE_PARA: Mapping[] = [
  {
    tema: "Dev and Ops in silos",
    f1: "The factory that designs and the track team that operates, each blaming the other",
  },
  {
    tema: "DevOps culture",
    f1: "Factory, pit wall, and track as a single team, with the track telemetry returning to the factory every session",
  },
  { tema: "Production", f1: "The race: the session that awards points" },
  { tema: "Deploy", f1: "Installing an update on the car that goes to the track" },
  {
    tema: "DORA metrics",
    f1: "Upgrade cadence, time from drawing board to track, upgrades reverted, and time to return to the good specification",
  },
  {
    tema: "Cloud provider (AWS or Azure)",
    f1: "The circuit: each has its own facilities, and the team's procedure is the same at both",
  },
  {
    tema: "Infrastructure as Code (IaC)",
    f1: "The car's specification sheet, versioned: any crew assembles the identical car from it",
  },
  {
    tema: "Idempotent configuration management",
    f1: 'The set-up target value: "pressure at 22 psi", never "add 2 psi"',
  },
  {
    tema: "Continuous Integration (CI)",
    f1: "The test bench and the simulator: a failed part does not board the truck",
  },
  {
    tema: "Canary and rollback",
    f1: "The upgrade fitted to one car only, compared with the teammate's car; and the return to the previous specification",
  },
  {
    tema: "Health check",
    f1: "The installation lap: checking the systems before the car goes to work",
  },
  {
    tema: "SLI, SLO, and alert",
    f1: "The number on the telemetry, the agreed operating window, and the alarm on the pit wall",
  },
  {
    tema: "Blameless post-mortem",
    f1: 'The debrief that asks "why did the process allow it?", never "who got it wrong?"',
  },
];

export const ANALOGY_NOTES: string[] = [
  "Cadence: an F1 team brings updates to the car at the pace of the calendar, and parc fermé freezes the car between qualifying and the race. A mature software team makes dozens of deploys a day, at any hour.",
  "Two cars: the smallest possible canary in F1 is half the fleet. In software you choose 1%, 5%, or 10% of users.",
  "A part is matter; an artifact is a copy. A wing exists in one physical unit; a versioned image is copied without limit and comes back from the registry with one command.",
  "The circuit is not chosen: the calendar decides where the team races. In the cloud the choice of provider is yours, and you can use both at the same time.",
  "The FIA punishes; the post-mortem does not. F1 has investigations that look for systemic causes, but also stewards who apply fines. The blameless post-mortem is internal and has no disciplinary function.",
];

export const LESSONS: Lesson[] = [
  {
    id: "cd1",
    num: "01",
    navTitle: "Fundamentals",
    tag: "silos, lifecycle, and DORA",
    title: "DevOps culture fundamentals",
    lead: "DevOps is making Dev and Ops share one goal and one continuous flow, and progress is measured in speed and stability together.",
    concept: [
      'Development is held accountable for creating and deploying features; operations, for stability, maintenance, and monitoring. One wants to change fast, the other wants nothing to break. Isolated, they produce delays, failures, and the classic "it worked on my machine".',
      "DevOps is a cultural change that integrates Dev and Ops into a single, continuous flow, bringing together people, processes, and technologies. The lifecycle has four phases (planning, development, delivery, and operation) drawn as the infinity symbol: what is learned in operation feeds back into the next planning.",
      'In 2009, John Allspaw and Paul Hammond, from Flickr, gave the talk "10+ Deploys Per Day", and Patrick Debois organized the first DevOpsDays. Etsy went from "terrifying" deploys twice a week to dozens a day. To measure, four DORA metrics: deployment frequency and lead time measure speed; change failure rate and time to restore measure stability.',
      "On the track: the factory is held accountable for performance and the track team for reliability. Pace without reliability does not become points: the fastest car on the grid that stops on the straight finishes the race with zero.",
    ],
    pointsTitle: "This stage's dashboard",
    points: [
      {
        t: "Speed",
        d: "Deployment frequency and lead time: the upgrade cadence and the time from drawing board to track.",
        color: "blue",
      },
      {
        t: "Stability",
        d: "Change failure rate and time to restore: upgrades reverted and the return to the good specification.",
        color: "ember",
      },
      {
        t: "Culture before tooling",
        d: "It is not just a methodology or just a tool: it is collaboration between people, processes, and technologies.",
        color: "signal",
      },
    ],
    examplesTitle: "DORA metrics from a git history",
    examples: [
      {
        label: "gerar-historico.sh",
        lang: "sh",
        code: `#!/usr/bin/env bash
set -euo pipefail                      # stops at the first error

rm -rf repo && mkdir repo && cd repo   # recreates the repository from scratch
git init -q                            # starts the repository without noise
git config user.name "Aluno"           # identity only for this repository
git config user.email "aluno@example.com"

evento() {                             # $1 = ISO date (UTC), $2 = message
  # forces the commit date; the empty commit is enough, only the history matters
  GIT_AUTHOR_DATE="$1" GIT_COMMITTER_DATE="$1" git commit -q --allow-empty -m "$2"
}

evento "2025-03-03T09:00:00+00:00" "feat: carrinho de compras"
evento "2025-03-03T15:00:00+00:00" "deploy: v1"
evento "2025-03-04T10:00:00+00:00" "feat: cupom de desconto"
evento "2025-03-04T11:00:00+00:00" "feat: calculo de frete"
evento "2025-03-05T09:00:00+00:00" "deploy: v2"
evento "2025-03-05T14:00:00+00:00" "incidente: v2 quebrou o checkout"
evento "2025-03-05T16:00:00+00:00" "restore: rollback da v2"
evento "2025-03-06T09:00:00+00:00" "fix: corrige checkout"
evento "2025-03-06T12:00:00+00:00" "deploy: v3"
evento "2025-03-07T10:00:00+00:00" "feat: pagamento com pix"
evento "2025-03-07T16:00:00+00:00" "deploy: v4"`,
        note: "It is a model: 5 days of work with fixed dates, so that the results are predictable.",
      },
      {
        label: "dora.sh",
        lang: "sh",
        code: `#!/usr/bin/env bash
set -euo pipefail
cd repo

# %ct = commit instant in seconds (epoch); %s = message
git log --reverse --format='%ct|%s' | awk -F'|' '
{
  ts = $1; tipo = $2; sub(/:.*/, "", tipo)       # tipo = text before the ":"
  if (NR == 1) primeiro = ts                     # first event of the period
  ultimo = ts                                    # last event of the period

  if (tipo == "feat" || tipo == "fix") {         # change waiting for deploy
    n++; pend[n] = ts
  } else if (tipo == "deploy") {
    deploys++
    for (i = 1; i <= n; i++) { soma += ts - pend[i]; itens++ }  # lead time of each change
    n = 0                                        # the pending queue empties
  } else if (tipo == "incidente") {
    falhas++; t_inc = ts                         # records when the failure started
  } else if (tipo == "restore") {
    soma_r += ts - t_inc; restauros++            # time until restored
  }
}
END {
  dias = int(ultimo / 86400) - int(primeiro / 86400) + 1   # calendar days (UTC)
  printf "Frequência de deploy    : %.2f por dia (%d deploys em %d dias)\\n", deploys / dias, deploys, dias
  printf "Lead time médio         : %.1f horas (%d mudanças)\\n", soma / itens / 3600, itens
  printf "Taxa de falha de mudança: %.0f%% (%d de %d deploys)\\n", 100 * falhas / deploys, falhas, deploys
  printf "Tempo médio de restauro : %.1f horas\\n", soma_r / restauros / 3600
}'`,
      },
      {
        label: "metrics output",
        lang: "sh",
        code: `$ bash gerar-historico.sh
$ bash dora.sh
Frequência de deploy    : 0.80 por dia (4 deploys em 5 dias)
Lead time médio         : 12.0 horas (5 mudanças)
Taxa de falha de mudança: 25% (1 de 4 deploys)
Tempo médio de restauro : 2.0 horas`,
        note: "Lead times of 6h, 23h, 22h, 3h, and 6h add up to 60h, a 12h average. The 14:00 incident was restored at 16:00.",
      },
    ],
    commands: [
      { cmd: 'export LAB="$HOME/lab-devops"', note: "lab root, in every new terminal" },
      { cmd: "bash gerar-historico.sh", note: "recreates the repository with the 11 events" },
      { cmd: "bash dora.sh", note: "calculates the four metrics" },
      { cmd: 'cd "$LAB/etapa-01" && rm -rf repo', note: "cleanup; the scripts stay for Stage 03" },
    ],
    handsOnIntro:
      "Stopwatch in hand: change a single date and watch the lead time rise without anything becoming safer.",
    handsOn: [
      "Run gerar-historico.sh and dora.sh and check the four metrics against the expected output.",
      "Look at the raw history with git log --reverse --format='%ad  %s' --date=iso-strict: there are 11 lines, in event order.",
      "Change the date of deploy: v1 to 2025-03-04T09:00:00+00:00, regenerate, and run dora.sh: the average lead time rises from 12.0 to 15.6 hours, and deployment frequency does not change.",
      "Restore the original date (2025-03-03T15:00:00+00:00) and regenerate the repository.",
      "Without looking at the text: if deploy: v3 had also caused an incident, the failure rate would be 2 out of 4, or 50%.",
    ],
    tip: "Holding a finished change in a queue worsens lead time without adding safety.",
    takeaway:
      "DevOps is Dev and Ops sharing one goal and one continuous flow, with progress measured in speed and stability together.",
  },
  {
    id: "cd2",
    num: "02",
    navTitle: "Practices and tools",
    tag: "IaC, CI/CD, canary, SLO",
    title: "Common practices and tools",
    lead: "IaC describes, CI validates, CD delivers, containers package, and monitoring brings back to the team what production learned.",
    concept: [
      "Infrastructure as Code describes servers, networks, and accounts in versioned files, reviewed through pull requests and validated by dry-runs: the environment becomes reproducible and immune to drift. Terraform is multi-cloud; on AWS the native option is CloudFormation (state kept in the stack) and on Azure it is ARM/Bicep (no state file, it compares against the Resource Group). Inside the machines, Ansible applies configuration idempotently: running it once or ten times gives the same result.",
      "In CI, every commit triggers lint, tests, and build, with feedback in minutes; in CD, the artifact moves through a declarative pipeline in YAML. In delivery a person approves the last step; in deployment that step is automatic too. Blue-green keeps two environments and switches traffic at once, with immediate rollback; canary exposes the new version to a few before exposing it to everyone.",
      "Containers share the host kernel and become immutable images in registries (ECR on AWS, ACR on Azure). Observability has metrics, logs, and tracing; SLIs measure, SLOs set the agreed limit, and the material gives the alert examples: errors above 1% of requests or average latency above 200 ms. CloudWatch and X-Ray on one side, Azure Monitor and Application Insights on the other, with Prometheus and Grafana as the bridge.",
      "On the track: IaC is the car's specification sheet and terraform plan is the list of changes the engineer checks before the mechanics touch anything. CI is the bench and the simulator; canary is the upgrade on one car only, compared with the teammate's car. AWS and Azure are two circuits with their own facilities, and the team takes the same procedure to both.",
    ],
    pointsTitle: "The pillars of the sector",
    points: [
      {
        t: "Declarative and idempotent",
        d: "Describe the destination, not the steps: the second apply and the second playbook change nothing.",
        color: "blue",
      },
      {
        t: "One script, many pipelines",
        d: "GitHub Actions, Azure Pipelines, and CodeBuild call the same ci.sh as your terminal.",
        color: "signal",
      },
      {
        t: "The metric decides",
        d: "What aborts the canary is the metric compared with the SLO, not the eye.",
        color: "ember",
      },
    ],
    examplesTitle: "The same resource on AWS and Azure, and a canary",
    examples: [
      {
        label: "cfn.yaml (AWS CloudFormation)",
        lang: "yaml",
        code: `AWSTemplateFormatVersion: "2010-09-09"   # template format version (fixed value)
Parameters:
  Ambiente:                              # input parameter
    Type: String
    Default: dev
Resources:
  Bucket:                                # logical name of the resource within the stack
    Type: AWS::S3::Bucket                # resource type: S3 bucket
    Properties:
      Tags:                              # no BucketName: AWS generates a unique name
        - Key: ambiente
          Value: !Ref Ambiente           # uses the parameter value`,
        note: "Preview with a change set: aws cloudformation deploy --no-execute-changeset.",
      },
      {
        label: "main.bicep (Azure Bicep)",
        lang: "sh",
        code: `param ambiente string = 'dev'                         // input parameter
param localizacao string = resourceGroup().location   // region of the resource group where it is deployed

resource conta 'Microsoft.Storage/storageAccounts@2023-01-01' = {   // type and API version
  name: 'st\${uniqueString(resourceGroup().id)}'       // unique, valid name (lowercase letters and numbers only)
  location: localizacao
  sku: { name: 'Standard_LRS' }                       // storage replication tier
  kind: 'StorageV2'                                   // account type
  tags: { ambiente: ambiente }                        // the same tag as the AWS example
}`,
        note: "Preview with az deployment group what-if. On Azure everything lives in a Resource Group; on AWS you delete the stack.",
      },
      {
        label: "canary with nginx",
        lang: "sh",
        code: `upstream app {
    zone app 64k;                           # shared memory: all workers use the same weight counter
    server azul:5678  weight=9;             # receives 9 out of every 10 requests
    server verde:5678 weight=1;             # receives 1 out of every 10 (the canary)
}
server {
    listen 80;
    location / {
        proxy_pass http://app;              # now the target is the weighted group
    }
}

$ docker exec proxy nginx -s reload && sleep 1
$ for i in $(seq 1 10); do curl -s localhost:8080; done | sort | uniq -c
      9 v1 azul
      1 v2 verde`,
        note: "On AWS, the canary uses weights between ALB target groups; on Azure, a percentage of traffic between App Service slots.",
      },
    ],
    commands: [
      { cmd: "terraform plan", note: "the dry-run: shows what would change" },
      {
        cmd: "ansible-playbook playbook.yml",
        note: "changed=1 the first time, changed=0 the second",
      },
      { cmd: "./ci.sh", note: "lint, tests, and build, the same as on the CI server" },
      { cmd: "bash slo.sh", note: "calculates the SLIs from the log and fires the alerts" },
    ],
    handsOnIntro:
      "Sheet, set-up, bench, canary, and telemetry: one short test in each stretch of the sector.",
    handsOn: [
      "Delete saida/dev.conf and run terraform plan: it proposes creating the file again (drift detected); close it with terraform apply -auto-approve.",
      "Replace 8080 with 9999 in app.conf and run the playbook: changed=1 and the file goes back to porta=8080.",
      "Replace 5 with 6 in test_calc.py and run ./ci.sh: the test fails, the build does not run, and the exit code is non-zero.",
      "Change the canary weights to 7 and 3, reload nginx, and count 7 v1 azul and 3 v2 verde.",
      "In gerar-log.sh, replace i % 40 with i % 200 and run slo.sh: error rate 0.5% and no alert.",
    ],
    tip: "A good pipeline is a declarative file that calls scripts you can run on your own machine.",
    takeaway:
      "IaC describes, CI validates, CD delivers, containers package, and monitoring brings back to the team what production learned.",
  },
  {
    id: "cd3",
    num: "03",
    navTitle: "Organizational culture",
    tag: "blameless post-mortem",
    title: "Organizational culture",
    lead: "Tools only pay off where making mistakes is safe: without blame, the team learns; with blame, the team hides.",
    concept: [
      "The night deploy takes the site down, Dev blames the infrastructure, Ops blames the code, and management wants a culprit. The following week nobody touches anything, and changes pile up in giant batches, precisely the riskiest ones. DevOps turns silos into bridges with three practices: constructive post-mortems, safe experimentation, and focus on customer value.",
      "Culture is the corporate DNA, shaped by history, leadership, HR policies, and ceremonies. The material describes four types: Clan and Adhocracy are naturally receptive to DevOps; Market and Hierarchy can benefit greatly, but face barriers. The journey has 10 steps, from mapping to a pilot in a small team and to scaling at each team's pace.",
      'Google institutionalized the blameless post-mortem: the question is never "who got it wrong?", but "why did the process allow it?". This creates psychological safety, and the DORA research links elite teams to a generative, high-trust culture. Value indicators (incident response time, successful releases) are worth more than superficial ones (commits, hours of uptime). Culture has no managed tool, so there is no AWS x Azure table here.',
      "On the track: after a serious crash, the useful investigation looks at the whole system (car, barrier, procedure, rescue) and publishes recommendations, instead of looking for a culprit. When a car is released from the pit box with one wheel still to be changed, the useful question is not who made the mistake, but why the release system allowed it.",
    ],
    pointsTitle: "The three practices",
    points: [
      {
        t: "Constructive post-mortem",
        d: "Facts and process causes, with actions that have an owner and a deadline.",
        color: "blue",
      },
      {
        t: "Safe experimentation",
        d: "Small tests in a controlled environment, with fast feedback.",
        color: "signal",
      },
      {
        t: "Customer value",
        d: "Stability and user experience count, not the number of merges.",
        color: "ember",
      },
    ],
    examplesTitle: "From the culprit to the process",
    examples: [
      {
        label: "postmortem.md",
        lang: "sh",
        code: `# Post-mortem: v2 quebrou o checkout

## Resumo
v2 implantada às 09:00. Checkout falhou a partir das 14:00. Restaurado às 16:00 (2 horas).

## Linha do tempo
- 09:00 deploy da v2
- 14:00 alerta de erro no checkout
- 16:00 rollback concluído

## Impacto
Parte dos usuários não conseguiu finalizar compra durante 2 horas.

## Causas (do processo, não de pessoas)
- O teste automatizado não cobria o fluxo de pagamento com cupom.
- O deploy foi feito para 100% dos usuários de uma vez.
- Não havia alerta de taxa de erro; o problema foi percebido pelo suporte.

## O que funcionou
- O rollback foi rápido porque a v1 estava disponível como imagem versionada.

## Ações (cada uma com dono e prazo)
- Adicionar teste de checkout com cupom ao CI. (dono: time de pagamentos)
- Adotar canary na próxima versão. (dono: plataforma)
- Criar alerta de erro acima de 1%. (dono: operações)`,
        note: 'The blaming report would be "João pushed v2 without testing it properly". The actions point to CI, canary, and SLO from Stage 02.',
      },
      {
        label: "superficial vs value indicator",
        lang: "sh",
        code: `$ cd repo
$ git log --oneline | wc -l                                        # superficial metric: number of commits
11
$ git log --format=%s | grep -c '^deploy'                          # deploys made
4
$ git log --format=%s | grep -c '^incidente'                       # incidents
1
$ cd ..`,
        note: '"11 commits" does not say whether the team is doing well; "4 deploys in 5 days, 1 incident restored in 2 hours" says much more.',
      },
    ],
    commands: [
      {
        cmd: 'cd "$LAB/etapa-01" && bash gerar-historico.sh',
        note: "regenerates the Stage 01 repository",
      },
      { cmd: "git log --oneline | wc -l", note: "number of commits: a superficial indicator" },
      { cmd: "git log --format=%s | grep -c '^deploy'", note: "deploys made" },
      { cmd: "git log --format=%s | grep -c '^incidente'", note: "incidents" },
    ],
    handsOnIntro: "First the numbers from the history, then an honest mirror of your own team.",
    handsOn: [
      "Regenerate the Stage 01 repository and confirm 11 commits, 4 deploys, and 1 incident.",
      'In 5 minutes, answer in writing: when something breaks, is the first question on your team "who?" or "why?"',
      "Say which of the four types (Clan, Adhocracy, Market, Hierarchy) most resembles your organization, and why.",
      "Pick one of the 10 journey steps you could take on your own this week.",
      'Rewrite without blame: "Ana forgot to run the tests and the bug went to production."',
    ],
    tip: "A lap driven is not a useful lap: number of commits and hours of uptime do not say whether the team delivers value.",
    takeaway:
      "Tools only pay off where making mistakes is safe: without blame, the team learns; with blame, the team hides.",
  },
  {
    id: "cd4",
    num: "04",
    navTitle: "Integration and automation",
    tag: "conveyor, rollback, and secrets",
    title: "Integration and automation",
    lead: "Good automation is a conveyor that blocks what is wrong, delivers what is right, and undoes by itself whatever slipped through.",
    concept: [
      "DevOps automation orchestrates the lifecycle end to end with minimal human intervention: each commit triggers compilation, tests, security analysis, and provisioning, and what was tested in staging runs in production. The material states that deployment frequency can jump from monthly cycles to daily, or even hourly.",
      "The flow has five steps, with AWS and Azure side by side: provision (CloudFormation x ARM/Bicep), build and validate (CodeBuild and CodePipeline x Azure Pipelines), deploy (CodeDeploy x App Service slots), configure (Systems Manager x Azure Automation and Arc), and monitor (CloudWatch and X-Ray x Azure Monitor and Application Insights). On AWS the conveyor is made of specialized services; on Azure, Azure DevOps delivers much of it in a single product.",
      "A secret never goes into Git: the pipeline fetches it from a vault at run time (Secrets Manager on AWS, Key Vault on Azure, which also stores keys and certificates). A secret committed and then deleted stays in the history: the right move is to revoke it and generate a new one. Add DevSecOps (scanners such as Snyk and Aqua), ChatOps, and pipeline metrics.",
      "On the track: the conveyor is the upgrade chain, from the factory to the installation lap, and each station can reject the part. The health check is the installation lap; the automatic rollback is returning to the previous specification without a meeting. Here the analogy stops: parc fermé prevents changes after qualifying, while the software conveyor undoes a version at any moment.",
    ],
    pointsTitle: "The conveyor stages",
    points: [
      {
        t: "Security first",
        d: "Secret scanning before anything else; a pattern-based scanner only finds what it knows.",
        color: "ember",
      },
      {
        t: "Health check",
        d: "The new version only stays live if it answers OK on the installation lap.",
        color: "blue",
      },
      {
        t: "Automatic rollback",
        d: "Save the previous release before switching, or there is nowhere to go back to.",
        color: "signal",
      },
    ],
    examplesTitle: "Local conveyor with rollback, and AWS and Azure vaults",
    examples: [
      {
        label: "esteira.sh",
        lang: "sh",
        code: `#!/usr/bin/env bash
set -u                                               # an undefined variable is an error

escanear_segredos() {                                # stage 1: simplified DevSecOps
  # looks for AWS key patterns (AKIA + 16 characters) and a literal "password=" in the files
  if grep -rnE 'AKIA[0-9A-Z]{16}|password\\s*=' --include='*.py' --include='*.sh' --include='*.yml' \\
       --exclude=esteira.sh .; then
    echo "SEGURANÇA: possível segredo no código. Pipeline interrompido."
    return 1
  fi
  echo "segurança: nenhum segredo encontrado"
}

deploy() {                                           # $1 = version, $2 = state the app will report
  local nova="$1" anterior
  anterior=$(readlink current 2>/dev/null || echo "")    # saves the current release, for the rollback
  mkdir -p "releases/$nova"
  printf '%s\\n' "$2" > "releases/$nova/status"       # the "application" reports its own state
  ln -sfn "releases/$nova" current                   # "redirects traffic" to the new release
  echo "deploy: current -> releases/$nova"
  if grep -q '^OK$' current/status; then             # health check: did the app answer OK?
    echo "health check: passou"
  else
    echo "health check: FALHOU"
    if [ -n "$anterior" ]; then
      ln -sfn "$anterior" current                    # automatic rollback to the previous release
      echo "rollback automático: current -> $anterior"
    fi
    return 1
  fi
}

escanear_segredos || exit 1                          # stage 1
./ci.sh > /dev/null 2>&1 && echo "ci: passou" || exit 1   # stage 2 (silences stdout and stderr)
deploy v1 OK                                         # stage 3: first healthy version
deploy v2 QUEBRADO                                   # version that fails the health check
echo "versão em produção: $(readlink current)"
echo "status: $(cat current/status)"`,
        note: "The current symbolic link points to the active release: switching the link is the local analog of redirecting traffic.",
      },
      {
        label: "conveyor output",
        lang: "sh",
        code: `$ chmod +x ci.sh && rm -rf releases current dist
$ bash esteira.sh
segurança: nenhum segredo encontrado
ci: passou
deploy: current -> releases/v1
health check: passou
deploy: current -> releases/v2
health check: FALHOU
rollback automático: current -> releases/v1
versão em produção: releases/v1
status: OK`,
        note: "In production, the same role belongs to CodeDeploy (automatic rollback), App Service slots, or helm rollback.",
      },
      {
        label: "vaults: AWS and Azure",
        lang: "sh",
        code: `# AWS
$ aws secretsmanager create-secret --name loja/db --secret-string '{"user":"app","pass":"troque-isto"}'
$ aws secretsmanager get-secret-value --secret-id loja/db --query SecretString --output text

# Azure
$ az keyvault create --name kv-loja-exemplo --resource-group rg-devops --location brazilsouth
$ az keyvault secret set --vault-name kv-loja-exemplo --name db-pass --value 'troque-isto'
$ az keyvault secret show --vault-name kv-loja-exemplo --name db-pass --query value --output tsv`,
        note: "Reading reference, no need to run. kv-loja-exemplo is fictitious; the vault name must be globally unique.",
      },
    ],
    commands: [
      {
        cmd: "chmod +x ci.sh && rm -rf releases current dist",
        note: "prepares the conveyor from scratch",
      },
      { cmd: "bash esteira.sh", note: "security, CI, deploy, health check, and rollback" },
      {
        cmd: "export DB_PASS='troque-isto'",
        note: "secret in the environment, never in the file",
      },
      { cmd: "rm -rf releases current dist __pycache__", note: "stage cleanup" },
    ],
    handsOnIntro:
      "Qualifying lap: a planted secret, a rejected part, a good version, and a credential read without touching Git.",
    handsOn: [
      'Add SENHA = "x" and the comment # password = 123 to calc.py and run the conveyor: only the second line is detected and the conveyor stops before the deploy.',
      "Replace the test's 5 with 6: the line ci: passou does not appear, no deploy runs, and the exit code is 1.",
      "Replace deploy v2 QUEBRADO with deploy v2 OK and run again: versão em produção: releases/v2.",
      "Export DB_PASS and read it with python3 -c \"import os; print('lido:', bool(os.environ['DB_PASS']))\": the output is lido: True. Then, unset DB_PASS.",
    ],
    tip: "A leaked secret is compromised: revoke it and generate a new one, besides removing it from the code.",
    takeaway:
      "Good automation is a conveyor that blocks what is wrong, delivers what is right, and undoes by itself whatever slipped through.",
  },
];
