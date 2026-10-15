// Conteúdo das quatro aulas da disciplina "Cultura DevOps" (Fase 1), uma etapa por aula,
// tematizado com Fórmula 1 pelo pipeline /otimizar-relatorio (relatorios/cultura-devops/final.md).

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
    tema: "Dev e Ops em silos",
    f1: "A fábrica que projeta e a equipe de pista que opera, cada uma culpando a outra",
  },
  {
    tema: "Cultura DevOps",
    f1: "Fábrica, muro e pista como uma equipe só, com a telemetria da pista voltando à fábrica a cada sessão",
  },
  { tema: "Produção", f1: "A corrida: a sessão que vale pontos" },
  { tema: "Deploy", f1: "Instalar uma atualização no carro que vai para a pista" },
  {
    tema: "Métricas DORA",
    f1: "Cadência de upgrades, tempo da prancheta à pista, upgrades revertidos e tempo para voltar à especificação boa",
  },
  {
    tema: "Provedor de nuvem (AWS ou Azure)",
    f1: "O circuito: cada um tem instalações próprias, e o procedimento da equipe é o mesmo nos dois",
  },
  {
    tema: "Infraestrutura como Código (IaC)",
    f1: "A ficha de especificação do carro, versionada: qualquer crew monta o carro idêntico a partir dela",
  },
  {
    tema: "Gerenciamento de configuração idempotente",
    f1: 'O valor-alvo do set-up: "pressão em 22 psi", nunca "some 2 psi"',
  },
  {
    tema: "Integração Contínua (CI)",
    f1: "A bancada de testes e o simulador: peça reprovada não embarca no caminhão",
  },
  {
    tema: "Canary e rollback",
    f1: "O upgrade montado num carro só, comparado ao carro irmão; e a volta para a especificação anterior",
  },
  {
    tema: "Health check",
    f1: "A volta de instalação: conferir os sistemas antes de o carro trabalhar",
  },
  {
    tema: "SLI, SLO e alerta",
    f1: "O número na telemetria, a janela operacional acordada e o alarme no muro",
  },
  {
    tema: "Post-mortem sem culpa",
    f1: 'O debrief que pergunta "por que o processo permitiu?", nunca "quem errou?"',
  },
];

export const ANALOGY_NOTES: string[] = [
  "Cadência: uma equipe de F1 leva atualizações ao carro no ritmo do calendário, e o parc fermé congela o carro entre a classificação e a corrida. Um time de software maduro faz dezenas de deploys por dia, a qualquer hora.",
  "Dois carros: o menor canary possível na F1 é metade da frota. No software você escolhe 1%, 5% ou 10% dos usuários.",
  "Peça é matéria; artefato é cópia. Uma asa existe numa unidade física; uma imagem versionada é copiada sem limite e volta do registro com um comando.",
  "O circuito não se escolhe: o calendário decide onde a equipe corre. Na nuvem a escolha do provedor é sua, e dá para usar os dois ao mesmo tempo.",
  "A FIA pune; o post-mortem não. A F1 tem investigações que buscam causas sistêmicas, mas também comissários que aplicam multas. O post-mortem sem culpa é interno e não tem função disciplinar.",
];

export const LESSONS: Lesson[] = [
  {
    id: "cd1",
    num: "01",
    navTitle: "Fundamentos",
    tag: "silos, ciclo e DORA",
    title: "Fundamentos da Cultura DevOps",
    lead: "DevOps é fazer Dev e Ops compartilharem um objetivo e um fluxo contínuo, e o progresso se mede em velocidade e estabilidade juntas.",
    concept: [
      'Desenvolvimento é cobrado por criar e implantar funcionalidades; operações, por estabilidade, manutenção e monitoramento. Uma quer mudar rápido, a outra quer que nada quebre. Isoladas, geram atraso, falha e o clássico "na minha máquina funcionava".',
      "DevOps é uma mudança cultural que integra Dev e Ops num fluxo único e contínuo, unindo pessoas, processos e tecnologias. O ciclo de vida tem quatro fases (planejamento, desenvolvimento, entrega e operação) desenhadas como o símbolo do infinito: o que se aprende na operação retroalimenta o próximo planejamento.",
      'Em 2009, John Allspaw e Paul Hammond, do Flickr, apresentaram a palestra "10+ Deploys Per Day", e Patrick Debois organizou o primeiro DevOpsDays. A Etsy saiu de deploys "aterrorizantes" duas vezes por semana para dezenas por dia. Para medir, quatro métricas DORA: frequência de deploy e lead time medem velocidade; taxa de falha de mudança e tempo de restauração medem estabilidade.',
      "Na pista: a fábrica é cobrada por desempenho e a equipe de pista por confiabilidade. Ritmo sem confiabilidade não vira ponto: o carro mais rápido do grid que para na reta termina a corrida com zero.",
    ],
    pointsTitle: "O painel desta etapa",
    points: [
      {
        t: "Velocidade",
        d: "Frequência de deploy e lead time: a cadência de upgrades e o tempo da prancheta à pista.",
        color: "blue",
      },
      {
        t: "Estabilidade",
        d: "Taxa de falha de mudança e tempo de restauração: upgrades revertidos e volta à especificação boa.",
        color: "ember",
      },
      {
        t: "Cultura antes da ferramenta",
        d: "Não é só metodologia nem só ferramenta: é colaboração entre pessoas, processos e tecnologias.",
        color: "signal",
      },
    ],
    examplesTitle: "Métricas DORA a partir de um histórico git",
    examples: [
      {
        label: "gerar-historico.sh",
        lang: "sh",
        code: `#!/usr/bin/env bash
set -euo pipefail                      # para no primeiro erro

rm -rf repo && mkdir repo && cd repo   # recria o repositório do zero
git init -q                            # inicia o repositório sem ruído
git config user.name "Aluno"           # identidade só para este repositório
git config user.email "aluno@example.com"

evento() {                             # $1 = data ISO (UTC), $2 = mensagem
  # força a data do commit; o commit vazio basta, só o histórico importa
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
        note: "É um modelo: 5 dias de trabalho com datas fixas, para que os resultados sejam previsíveis.",
      },
      {
        label: "dora.sh",
        lang: "sh",
        code: `#!/usr/bin/env bash
set -euo pipefail
cd repo

# %ct = instante do commit em segundos (epoch); %s = mensagem
git log --reverse --format='%ct|%s' | awk -F'|' '
{
  ts = $1; tipo = $2; sub(/:.*/, "", tipo)       # tipo = texto antes do ":"
  if (NR == 1) primeiro = ts                     # primeiro evento do período
  ultimo = ts                                    # último evento do período

  if (tipo == "feat" || tipo == "fix") {         # mudança aguardando deploy
    n++; pend[n] = ts
  } else if (tipo == "deploy") {
    deploys++
    for (i = 1; i <= n; i++) { soma += ts - pend[i]; itens++ }  # lead time de cada mudança
    n = 0                                        # a fila de pendentes esvazia
  } else if (tipo == "incidente") {
    falhas++; t_inc = ts                         # guarda quando a falha começou
  } else if (tipo == "restore") {
    soma_r += ts - t_inc; restauros++            # tempo até restaurar
  }
}
END {
  dias = int(ultimo / 86400) - int(primeiro / 86400) + 1   # dias corridos (UTC)
  printf "Frequência de deploy    : %.2f por dia (%d deploys em %d dias)\\n", deploys / dias, deploys, dias
  printf "Lead time médio         : %.1f horas (%d mudanças)\\n", soma / itens / 3600, itens
  printf "Taxa de falha de mudança: %.0f%% (%d de %d deploys)\\n", 100 * falhas / deploys, falhas, deploys
  printf "Tempo médio de restauro : %.1f horas\\n", soma_r / restauros / 3600
}'`,
      },
      {
        label: "saída das métricas",
        lang: "sh",
        code: `$ bash gerar-historico.sh
$ bash dora.sh
Frequência de deploy    : 0.80 por dia (4 deploys em 5 dias)
Lead time médio         : 12.0 horas (5 mudanças)
Taxa de falha de mudança: 25% (1 de 4 deploys)
Tempo médio de restauro : 2.0 horas`,
        note: "Lead times de 6h, 23h, 22h, 3h e 6h somam 60h, ou 12h de média. O incidente das 14h foi restaurado às 16h.",
      },
    ],
    commands: [
      { cmd: 'export LAB="$HOME/lab-devops"', note: "raiz do laboratório, em cada terminal novo" },
      { cmd: "bash gerar-historico.sh", note: "recria o repositório com os 11 eventos" },
      { cmd: "bash dora.sh", note: "calcula as quatro métricas" },
      {
        cmd: 'cd "$LAB/etapa-01" && rm -rf repo',
        note: "limpeza; os scripts ficam para a Etapa 03",
      },
    ],
    handsOnIntro:
      "Cronômetro na mão: mexa numa única data e veja o lead time subir sem que nada fique mais seguro.",
    handsOn: [
      "Rode gerar-historico.sh e dora.sh e confira as quatro métricas da saída esperada.",
      "Veja o histórico bruto com git log --reverse --format='%ad  %s' --date=iso-strict: são 11 linhas, na ordem dos eventos.",
      "Mude a data do deploy: v1 para 2025-03-04T09:00:00+00:00, regere e rode dora.sh: o lead time médio sobe de 12.0 para 15.6 horas, e a frequência de deploy não muda.",
      "Restaure a data original (2025-03-03T15:00:00+00:00) e regere o repositório.",
      "Sem olhar o texto: se o deploy: v3 também gerasse um incidente, a taxa de falha seria 2 de 4, ou 50%.",
    ],
    tip: "Segurar uma mudança pronta numa fila piora o lead time sem trazer segurança.",
    takeaway:
      "DevOps é Dev e Ops compartilhando objetivo e fluxo contínuo, com progresso medido em velocidade e estabilidade juntas.",
  },
  {
    id: "cd2",
    num: "02",
    navTitle: "Práticas e ferramentas",
    tag: "IaC, CI/CD, canary, SLO",
    title: "Práticas comuns e ferramentas",
    lead: "IaC descreve, CI valida, CD entrega, containers empacotam, e o monitoramento devolve para o time o que a produção aprendeu.",
    concept: [
      "Infraestrutura como Código descreve servidores, redes e contas em arquivos versionados, revisados por pull request e validados por dry-run: o ambiente fica reproduzível e imune à deriva. Terraform é multi-cloud; na AWS o nativo é o CloudFormation (estado guardado na stack) e na Azure é o ARM/Bicep (sem arquivo de estado, compara com o Resource Group). Dentro das máquinas, Ansible aplica a configuração de forma idempotente: rodar uma ou dez vezes dá o mesmo resultado.",
      "Na CI, cada commit dispara lint, testes e build, com feedback em minutos; na CD, o artefato segue por um pipeline declarativo em YAML. Em delivery uma pessoa aprova o último passo; em deployment ele também é automático. Blue-green mantém dois ambientes e vira o tráfego de uma vez, com rollback imediato; canary expõe a versão nova a poucos antes de expor a todos.",
      "Containers compartilham o kernel do host e viram imagens imutáveis em registros (ECR na AWS, ACR na Azure). A observabilidade tem métricas, logs e tracing; SLIs medem, SLOs definem o limite acordado, e o material dá os exemplos de alerta: erro acima de 1% das requisições ou latência média acima de 200 ms. CloudWatch e X-Ray de um lado, Azure Monitor e Application Insights do outro, com Prometheus e Grafana como ponte.",
      "Na pista: a IaC é a ficha de especificação do carro e o terraform plan é a lista de alterações que o engenheiro confere antes de os mecânicos mexerem. A CI é a bancada e o simulador; o canary é o upgrade num carro só, comparado ao carro irmão. AWS e Azure são dois circuitos com instalações próprias, e a equipe leva o mesmo procedimento para os dois.",
    ],
    pointsTitle: "Os pilares do setor",
    points: [
      {
        t: "Declarativo e idempotente",
        d: "Descreva o destino, não os passos: o segundo apply e o segundo playbook não mudam nada.",
        color: "blue",
      },
      {
        t: "Um script, várias esteiras",
        d: "GitHub Actions, Azure Pipelines e CodeBuild chamam o mesmo ci.sh do seu terminal.",
        color: "signal",
      },
      {
        t: "Métrica decide",
        d: "Quem aborta o canary é a métrica comparada ao SLO, não o olho.",
        color: "ember",
      },
    ],
    examplesTitle: "O mesmo recurso em AWS e Azure, e um canary",
    examples: [
      {
        label: "cfn.yaml (AWS CloudFormation)",
        lang: "yaml",
        code: `AWSTemplateFormatVersion: "2010-09-09"   # versão do formato do template (valor fixo)
Parameters:
  Ambiente:                              # parâmetro de entrada
    Type: String
    Default: dev
Resources:
  Bucket:                                # nome lógico do recurso dentro da stack
    Type: AWS::S3::Bucket                # tipo do recurso: bucket S3
    Properties:
      Tags:                              # sem BucketName: a AWS gera um nome único
        - Key: ambiente
          Value: !Ref Ambiente           # usa o valor do parâmetro`,
        note: "Prévia com change set: aws cloudformation deploy --no-execute-changeset.",
      },
      {
        label: "main.bicep (Azure Bicep)",
        lang: "sh",
        code: `param ambiente string = 'dev'                         // parâmetro de entrada
param localizacao string = resourceGroup().location   // região do grupo de recursos onde for implantado

resource conta 'Microsoft.Storage/storageAccounts@2023-01-01' = {   // tipo e versão da API
  name: 'st\${uniqueString(resourceGroup().id)}'       // nome único e válido (só minúsculas e números)
  location: localizacao
  sku: { name: 'Standard_LRS' }                       // nível de replicação do armazenamento
  kind: 'StorageV2'                                   // tipo de conta
  tags: { ambiente: ambiente }                        // a mesma tag do exemplo AWS
}`,
        note: "Prévia com az deployment group what-if. Na Azure tudo mora num Resource Group; na AWS você apaga a stack.",
      },
      {
        label: "canary com nginx",
        lang: "sh",
        code: `upstream app {
    zone app 64k;                           # memória compartilhada: todos os workers usam o mesmo contador de pesos
    server azul:5678  weight=9;             # recebe 9 de cada 10 requisições
    server verde:5678 weight=1;             # recebe 1 de cada 10 (o canário)
}
server {
    listen 80;
    location / {
        proxy_pass http://app;              # agora o destino é o grupo ponderado
    }
}

$ docker exec proxy nginx -s reload && sleep 1
$ for i in $(seq 1 10); do curl -s localhost:8080; done | sort | uniq -c
      9 v1 azul
      1 v2 verde`,
        note: "Na AWS, o canary usa pesos entre grupos de destino do ALB; na Azure, uma porcentagem do tráfego entre slots do App Service.",
      },
    ],
    commands: [
      { cmd: "terraform plan", note: "o dry-run: mostra o que mudaria" },
      {
        cmd: "ansible-playbook playbook.yml",
        note: "changed=1 na primeira vez, changed=0 na segunda",
      },
      { cmd: "./ci.sh", note: "lint, testes e build, igual ao do servidor de CI" },
      { cmd: "bash slo.sh", note: "calcula os SLIs do log e dispara os alertas" },
    ],
    handsOnIntro:
      "Ficha, set-up, bancada, canary e telemetria: um teste curto em cada trecho do setor.",
    handsOn: [
      "Apague saida/dev.conf e rode terraform plan: ele propõe criar o arquivo de novo (deriva detectada); feche com terraform apply -auto-approve.",
      "Troque 8080 por 9999 no app.conf e rode o playbook: changed=1 e o arquivo volta a porta=8080.",
      "Troque 5 por 6 em test_calc.py e rode ./ci.sh: o teste falha, o build não executa e o código de saída é diferente de zero.",
      "Mude os pesos do canary para 7 e 3, recarregue o nginx e conte 7 v1 azul e 3 v2 verde.",
      "No gerar-log.sh, troque i % 40 por i % 200 e rode slo.sh: taxa de erro 0.5% e nenhum alerta.",
    ],
    tip: "Pipeline bom é um arquivo declarativo que chama scripts que você consegue rodar na sua máquina.",
    takeaway:
      "IaC descreve, CI valida, CD entrega, containers empacotam, e o monitoramento devolve para o time o que a produção aprendeu.",
  },
  {
    id: "cd3",
    num: "03",
    navTitle: "Cultura organizacional",
    tag: "post-mortem sem culpa",
    title: "Cultura organizacional",
    lead: "A ferramenta só rende onde errar é seguro: sem culpa, o time aprende; com culpa, o time esconde.",
    concept: [
      "O deploy da noite derruba o site, Dev culpa a infraestrutura, Ops culpa o código e a gestão quer um culpado. Na semana seguinte ninguém mexe em nada, e as mudanças se acumulam em lotes gigantes, justamente os mais arriscados. DevOps transforma silos em pontes com três práticas: post-mortems construtivos, experimentação segura e foco no valor ao cliente.",
      "A cultura é o DNA corporativo, moldado por história, liderança, políticas de RH e cerimônias. O material descreve quatro tipos: Clã e Adhocrática são naturalmente receptivas ao DevOps; Mercado e Hierárquica podem se beneficiar muito, mas enfrentam barreiras. A jornada tem 10 passos, do mapeamento ao piloto numa equipe pequena e à escala no ritmo de cada equipe.",
      'O Google institucionalizou o blameless post-mortem: a pergunta nunca é "quem errou?", mas "por que o processo permitiu?". Isso cria segurança psicológica, e as pesquisas DORA associam as equipes de elite a uma cultura geradora e de alta confiança. Indicadores de valor (tempo de resposta a incidentes, lançamentos bem-sucedidos) valem mais que superficiais (commits, horas de uptime). Cultura não tem ferramenta gerenciada, então aqui não há tabela AWS x Azure.',
      "Na pista: depois de um acidente grave, a investigação útil olha o sistema inteiro (carro, barreira, procedimento, resgate) e publica recomendações, em vez de procurar um culpado. Quando um carro é liberado do box com uma roda por trocar, a pergunta útil não é quem errou, e sim por que o sistema de liberação permitiu.",
    ],
    pointsTitle: "As três práticas",
    points: [
      {
        t: "Post-mortem construtivo",
        d: "Fatos e causas do processo, com ações que têm dono e prazo.",
        color: "blue",
      },
      {
        t: "Experimentação segura",
        d: "Testes pequenos em ambiente controlado, com feedback rápido.",
        color: "signal",
      },
      {
        t: "Valor ao cliente",
        d: "Conta a estabilidade e a experiência do usuário, não a quantidade de merges.",
        color: "ember",
      },
    ],
    examplesTitle: "Do culpado ao processo",
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
        note: 'O relato com culpa seria "O João subiu a v2 sem testar direito". As ações apontam para CI, canary e SLO da Etapa 02.',
      },
      {
        label: "indicador superficial x valor",
        lang: "sh",
        code: `$ cd repo
$ git log --oneline | wc -l                                        # métrica superficial: número de commits
11
$ git log --format=%s | grep -c '^deploy'                          # deploys feitos
4
$ git log --format=%s | grep -c '^incidente'                       # incidentes
1
$ cd ..`,
        note: '"11 commits" não diz se o time está bem; "4 deploys em 5 dias, 1 incidente restaurado em 2 horas" diz muito mais.',
      },
    ],
    commands: [
      {
        cmd: 'cd "$LAB/etapa-01" && bash gerar-historico.sh',
        note: "regera o repositório da Etapa 01",
      },
      { cmd: "git log --oneline | wc -l", note: "número de commits: indicador superficial" },
      { cmd: "git log --format=%s | grep -c '^deploy'", note: "deploys feitos" },
      { cmd: "git log --format=%s | grep -c '^incidente'", note: "incidentes" },
    ],
    handsOnIntro:
      "Primeiro os números do histórico, depois um espelho honesto do seu próprio time.",
    handsOn: [
      "Regere o repositório da Etapa 01 e confirme 11 commits, 4 deploys e 1 incidente.",
      'Em 5 minutos, responda por escrito: quando algo quebra, a primeira pergunta no seu time é "quem?" ou "por quê?"',
      "Diga qual dos quatro tipos (Clã, Adhocrática, Mercado, Hierárquica) mais se parece com a sua organização, e por quê.",
      "Escolha um dos 10 passos da jornada que você poderia dar sozinho esta semana.",
      'Reescreva sem culpa: "A Ana esqueceu de rodar os testes e o bug foi para produção."',
    ],
    tip: "Volta dada não é volta útil: número de commits e horas de uptime não dizem se o time entrega valor.",
    takeaway:
      "A ferramenta só rende onde errar é seguro: sem culpa, o time aprende; com culpa, o time esconde.",
  },
  {
    id: "cd4",
    num: "04",
    navTitle: "Integração e automação",
    tag: "esteira, rollback e segredos",
    title: "Integração e automação",
    lead: "Automação boa é uma esteira que barra o que está errado, entrega o que está certo e desfaz sozinha o que escapou.",
    concept: [
      "Automação de DevOps orquestra o ciclo de ponta a ponta com intervenção humana mínima: cada commit dispara compilação, testes, análise de segurança e provisionamento, e o que foi testado em homologação roda em produção. O material afirma que a frequência de deploys pode saltar de ciclos mensais para diários, ou até horários.",
      "O fluxo tem cinco passos, com AWS e Azure lado a lado: provisionar (CloudFormation x ARM/Bicep), construir e validar (CodeBuild e CodePipeline x Azure Pipelines), implantar (CodeDeploy x slots do App Service), configurar (Systems Manager x Azure Automation e Arc) e monitorar (CloudWatch e X-Ray x Azure Monitor e Application Insights). Na AWS a esteira é feita de serviços especializados; na Azure, o Azure DevOps entrega boa parte num produto só.",
      "Segredo nunca vai para o Git: o pipeline o busca de um cofre em tempo de execução (Secrets Manager na AWS, Key Vault na Azure, que também guarda chaves e certificados). Segredo commitado e apagado continua no histórico: o correto é revogá-lo e gerar outro. Somam-se DevSecOps (scanners como Snyk e Aqua), ChatOps e métricas de pipeline.",
      "Na pista: a esteira é a cadeia do upgrade, da fábrica à volta de instalação, e cada estação pode reprovar a peça. O health check é a volta de instalação; o rollback automático é voltar à especificação anterior sem reunião. Aqui a analogia para: o parc fermé impede trocas depois da classificação, e a esteira de software desfaz uma versão a qualquer momento.",
    ],
    pointsTitle: "Os estágios da esteira",
    points: [
      {
        t: "Segurança primeiro",
        d: "Varredura de segredos antes de tudo; scanner por padrões só acha o que conhece.",
        color: "ember",
      },
      {
        t: "Health check",
        d: "A versão nova só fica no ar se responder OK na volta de instalação.",
        color: "blue",
      },
      {
        t: "Rollback automático",
        d: "Guarde a release anterior antes de trocar, ou não há para onde voltar.",
        color: "signal",
      },
    ],
    examplesTitle: "Esteira local com rollback e cofres AWS e Azure",
    examples: [
      {
        label: "esteira.sh",
        lang: "sh",
        code: `#!/usr/bin/env bash
set -u                                               # variável não definida é erro

escanear_segredos() {                                # estágio 1: DevSecOps simplificado
  # procura padrões de chave AWS (AKIA + 16 caracteres) e "password=" literal nos arquivos
  if grep -rnE 'AKIA[0-9A-Z]{16}|password\\s*=' --include='*.py' --include='*.sh' --include='*.yml' \\
       --exclude=esteira.sh .; then
    echo "SEGURANÇA: possível segredo no código. Pipeline interrompido."
    return 1
  fi
  echo "segurança: nenhum segredo encontrado"
}

deploy() {                                           # $1 = versão, $2 = estado que o app vai reportar
  local nova="$1" anterior
  anterior=$(readlink current 2>/dev/null || echo "")    # guarda a release atual, para o rollback
  mkdir -p "releases/$nova"
  printf '%s\\n' "$2" > "releases/$nova/status"       # a "aplicação" informa o próprio estado
  ln -sfn "releases/$nova" current                   # "redireciona o tráfego" para a nova release
  echo "deploy: current -> releases/$nova"
  if grep -q '^OK$' current/status; then             # health check: o app respondeu OK?
    echo "health check: passou"
  else
    echo "health check: FALHOU"
    if [ -n "$anterior" ]; then
      ln -sfn "$anterior" current                    # rollback automático para a release anterior
      echo "rollback automático: current -> $anterior"
    fi
    return 1
  fi
}

escanear_segredos || exit 1                          # estágio 1
./ci.sh > /dev/null 2>&1 && echo "ci: passou" || exit 1   # estágio 2 (cala stdout e stderr)
deploy v1 OK                                         # estágio 3: primeira versão saudável
deploy v2 QUEBRADO                                   # versão que falha no health check
echo "versão em produção: $(readlink current)"
echo "status: $(cat current/status)"`,
        note: "O link simbólico current aponta para a release ativa: trocar o link é o análogo local de redirecionar o tráfego.",
      },
      {
        label: "saída da esteira",
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
        note: "Em produção, o mesmo papel é do CodeDeploy (reversão automática), dos slots do App Service ou do helm rollback.",
      },
      {
        label: "cofres: AWS e Azure",
        lang: "sh",
        code: `# AWS
$ aws secretsmanager create-secret --name loja/db --secret-string '{"user":"app","pass":"troque-isto"}'
$ aws secretsmanager get-secret-value --secret-id loja/db --query SecretString --output text

# Azure
$ az keyvault create --name kv-loja-exemplo --resource-group rg-devops --location brazilsouth
$ az keyvault secret set --vault-name kv-loja-exemplo --name db-pass --value 'troque-isto'
$ az keyvault secret show --vault-name kv-loja-exemplo --name db-pass --query value --output tsv`,
        note: "Referência de leitura, não é necessário executar. kv-loja-exemplo é fictício; o nome do cofre precisa ser único globalmente.",
      },
    ],
    commands: [
      {
        cmd: "chmod +x ci.sh && rm -rf releases current dist",
        note: "prepara a esteira do zero",
      },
      { cmd: "bash esteira.sh", note: "segurança, CI, deploy, health check e rollback" },
      {
        cmd: "export DB_PASS='troque-isto'",
        note: "segredo no ambiente, nunca no arquivo",
      },
      { cmd: "rm -rf releases current dist __pycache__", note: "limpeza da etapa" },
    ],
    handsOnIntro:
      "Volta de classificação: segredo plantado, peça reprovada, versão boa e credencial lida sem tocar no Git.",
    handsOn: [
      'Acrescente SENHA = "x" e o comentário # password = 123 ao calc.py e rode a esteira: só a segunda linha é detectada e a esteira para antes do deploy.',
      "Troque o 5 do teste por 6: a linha ci: passou não aparece, nenhum deploy é executado e o código de saída é 1.",
      "Troque deploy v2 QUEBRADO por deploy v2 OK e rode de novo: versão em produção: releases/v2.",
      "Exporte DB_PASS e leia com python3 -c \"import os; print('lido:', bool(os.environ['DB_PASS']))\": a saída é lido: True. Depois, unset DB_PASS.",
    ],
    tip: "Segredo vazado é comprometido: revogue e gere outro, além de removê-lo do código.",
    takeaway:
      "Automação boa é uma esteira que barra o que está errado, entrega o que está certo e desfaz sozinha o que escapou.",
  },
];
