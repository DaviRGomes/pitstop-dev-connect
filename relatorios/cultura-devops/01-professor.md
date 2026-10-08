# Cultura DevOps: da briga entre Dev e Ops à esteira que entrega sozinha

> Versão didática dos quatro materiais do módulo "Cultura DevOps" (DevOps e Arquitetura Cloud, Fase 1). Cada aula virou uma etapa, na mesma ordem. As aulas originais são teóricas: não trazem código nem comandos. Aqui cada etapa ganha um laboratório que roda na sua máquina, sem conta de nuvem, e uma tabela de equivalência entre AWS e Azure.

**O que você vai saber fazer ao final deste guia:** explicar por que o DevOps existe e o que ele muda além das ferramentas; calcular as métricas DORA a partir de um histórico git; escrever uma IaC mínima em Terraform e compará-la com o equivalente em CloudFormation (AWS) e Bicep (Azure); garantir idempotência com Ansible; montar um pipeline de CI que roda igual no seu terminal e no GitHub Actions, e traduzi-lo para Azure Pipelines e AWS CodeBuild; demonstrar blue-green e canary com nginx; publicar uma imagem num registro de containers (local, com o mapa para ECR e Azure Container Registry); calcular SLIs e disparar um alerta de SLO; conduzir um post-mortem sem culpa; e montar uma esteira ponta a ponta com health check e rollback automático, cuidando de segredos desde o início.

**Convenção de marcação.** O material original só cita AWS (CloudFormation, Systems Manager, Prime Day) e ferramentas agnósticas. Tudo que envolve **Azure** é **acréscimo do professor**, e vem marcado com o rótulo `[Acréscimo do professor: Azure]` ou numa coluna identificada. Os comandos de nuvem (`aws` e `az`) aparecem como **referência de leitura**, para você comparar. Os laboratórios locais não exigem conta nem geram custo. Se um dia você rodar os comandos de nuvem, faça isso numa conta de estudos e execute o bloco de limpeza correspondente.

**Pré-requisitos:**

- Terminal com `bash`, `git`, `awk`, `curl`, `sort`, `uniq`, `sed` e `grep`. Linux, macOS (veja a nota abaixo) ou WSL servem.
- `python3` (3.8 ou superior) para a Etapa 02, com o módulo `venv` (no Debian e no Ubuntu, instale o pacote `python3-venv`). As saídas do `unittest` mostradas no guia são as do Python 3.11 ou superior; a diferença para versões anteriores está anotada no ponto em que aparece.
- Docker com `docker compose` para os laboratórios de blue-green, canary, registro de containers e Prometheus.
- Opcionais, cada um indicado no laboratório que o usa: `terraform`; `ansible` e `cfn-lint`, instalados com `pip` dentro de um ambiente virtual Python, como mostra a Etapa 02.1 (Debian 12, Ubuntu 23.04 e sistemas mais novos recusam `pip install` fora dele com o erro `externally-managed-environment`, regra conhecida como PEP 668); e `az` com Bicep (`az bicep install`).
- **Nota para macOS:** o `sed -i` do macOS é BSD e exige um sufixo (`sed -i ''`). Instale o GNU sed (`brew install gnu-sed`) e use `gsed`, ou edite o arquivo manualmente. Além disso, no macOS 12 ou superior a porta 5000 é ocupada pelo AirPlay Receiver; por isso o laboratório de registro (Etapa 02.5) publica o registro na porta **5001** do seu computador, em qualquer sistema.

**Estrutura de pastas do laboratório:**

```text
lab-devops/
  .venv/      # ambiente virtual Python (cfn-lint e Ansible), criado na Etapa 02.1
  etapa-01/   # histórico git e métricas DORA
  etapa-02/   # IaC, Ansible, CI, blue-green/canary, registro, SLO
    iac/  ansible/  ci/  deploy/  slo/
  etapa-03/   # post-mortem e métricas de valor
  etapa-04/   # esteira ponta a ponta, rollback e segredos
```

**Uma variável para não se perder entre as pastas.** Todos os comandos do guia chegam às pastas acima pela variável `LAB`, a partir de qualquer diretório. Defina-a no início e repita a linha sempre que abrir um terminal novo:

```sh
export LAB="$HOME/lab-devops"
```

---

## Etapa 01: Fundamentos da Cultura DevOps

### O problema

Sexta-feira, 18h. Uma loja virtual vai lançar o novo checkout com Pix. O time de desenvolvimento entrega o código pronto e vai embora feliz. O time de operações recebe um pacote que nunca viu, instala na mão e, às 21h, o site sai do ar. A conversa de segunda-feira começa com "na minha máquina funcionava" e termina com um culpado.

Esse é o cenário que o material descreve: **equipes de desenvolvimento** são cobradas por criar e implantar funcionalidades; **equipes de operação** são cobradas por estabilidade, manutenção e monitoramento. Uma quer mudar rápido, a outra quer que nada quebre. Isoladas, geram atraso, falha e ruído de comunicação.

**Analogia do restaurante.** A cozinha é cobrada por criar pratos novos; o salão é cobrado por servir sem erro e sem reclamação. Se a cozinha inventa um prato sem avisar o salão e o salão só descobre quando o cliente pergunta o que é, a culpa nunca é de ninguém e o jantar é de todos. Agora imagine cozinha e salão decidindo o cardápio juntos, e o garçom trazendo para a cozinha o que o cliente disse sobre o prato, na mesma noite. Isso é DevOps.

### O conceito

**DevOps** é uma mudança cultural que integra Dev e Ops num fluxo de trabalho único, colaborativo e contínuo. O material insiste: não é só metodologia nem só ferramenta, é uma mentalidade de colaboração entre **pessoas, processos e tecnologias**.

**Princípios e práticas:**

| Princípio | O que significa na prática |
|---|---|
| Time único e integrado | Dev e Ops atuam juntos desde o planejamento até bem depois da entrega, e não só alinhando objetivos de vez em quando |
| Automação | Testes, integração e implantação deixam de ser manuais, o que reduz falha humana |
| Comunicação | Derruba silos; equipes que raramente se falavam passam a conversar todo dia |
| Entregas contínuas | Lançar funcionalidades e correções com frequência, mantendo o software em evolução |
| Monitoramento e feedback contínuos | O que se observa em produção volta para o time rapidamente |

**O ciclo de vida** é um fluxo contínuo, desenhado como o símbolo do infinito, porque a saída de uma fase alimenta a entrada da seguinte:

1. **Planejamento:** objetivos, requisitos e expectativas. Já nasce colaborativo: Operações participa desde o início, para que as decisões considerem como o sistema será implantado, monitorado e mantido.
2. **Desenvolvimento:** codificação incremental, com integração contínua e testes automatizados para que falhas apareçam cedo.
3. **Entrega:** funcionalidades implantadas em produção por pipelines automatizados. Entregar deixa de ser um evento e vira rotina.
4. **Operação:** o software está com os usuários. Monitoramento em tempo real devolve falhas e oportunidades para o início do ciclo.

**Benefícios citados:** redução de riscos (problemas aparecem antes de chegar à produção), qualidade das entregas, produtividade, aprendizado contínuo e resiliência organizacional.

**Origem.** Em **2009**, John Allspaw e Paul Hammond, do Flickr, apresentaram a palestra **"10+ Deploys Per Day"**, mostrando múltiplas implantações diárias sem comprometer a estabilidade. Inspirado por ela, **Patrick Debois** organizou ainda em 2009 a primeira edição do **DevOpsDays**, ponto de partida para espalhar a cultura.

**Case Etsy (segundo o material).** Antes: deploy lento, manual e "aterrorizante", apenas **duas vezes por semana**, frequentemente causando instabilidade. A dor era o medo de quebrar a produção, o que gerava atrito entre Dev e Ops. Depois de focar em automação, monitoramento e segurança psicológica: **dezenas de deploys por dia**, de forma segura e controlada.

**Tendências citadas:** Engenharia de Plataforma (plataformas internas de autoatendimento), DevSecOps (segurança em todas as etapas, como responsabilidade compartilhada) e AIOps (IA para monitorar, prever falhas e acelerar a resolução de incidentes). Você as revê nas etapas 02 e 04.

**Como saber se está funcionando? As métricas DORA.** O material (Etapa 03) cita o framework **DORA (DevOps Research and Assessment)** como padrão da indústria para avaliar maturidade, e a Etapa 04 cita tempo médio de recuperação, taxa de falhas e frequência de deploys como métricas a acompanhar. Juntando as duas pontas, as quatro métricas que usamos neste guia são:

| Métrica | Pergunta que responde |
|---|---|
| Frequência de deploy | Com que frequência entregamos em produção? |
| Lead time de mudança | Quanto tempo um commit leva para chegar à produção? |
| Taxa de falha de mudança | Que fração dos deploys causa problema? |
| Tempo de restauração | Quanto tempo levamos para voltar ao normal depois de uma falha? |

> **Acréscimo do professor:** as duas primeiras medem velocidade e as duas últimas, estabilidade. O ponto central da cultura DevOps é que um time bom melhora as quatro ao mesmo tempo, em vez de trocar uma pela outra.

**Nuvem nesta etapa.** Os fundamentos não dependem de provedor. AWS e Azure entram a partir da Etapa 02, onde há ferramenta gerenciada para cada prática.

### Exemplo comentado: um histórico git que conta a história do time

Em vez de decorar as métricas, vamos calculá-las. Criamos um repositório com commits datados que representam 5 dias de trabalho: mudanças (`feat`, `fix`), implantações (`deploy`), um incidente e uma restauração. É um **modelo**, com datas fixas para que os resultados sejam previsíveis.

```sh
export LAB="$HOME/lab-devops"            # raiz do laboratório (repita em cada terminal novo)
mkdir -p "$LAB/etapa-01" && cd "$LAB/etapa-01"
```

`gerar-historico.sh`:

```sh
#!/usr/bin/env bash
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
evento "2025-03-07T16:00:00+00:00" "deploy: v4"
```

`dora.sh`:

```sh
#!/usr/bin/env bash
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
  printf "Frequência de deploy    : %.2f por dia (%d deploys em %d dias)\n", deploys / dias, deploys, dias
  printf "Lead time médio         : %.1f horas (%d mudanças)\n", soma / itens / 3600, itens
  printf "Taxa de falha de mudança: %.0f%% (%d de %d deploys)\n", 100 * falhas / deploys, falhas, deploys
  printf "Tempo médio de restauro : %.1f horas\n", soma_r / restauros / 3600
}'
```

Rode:

```sh
bash gerar-historico.sh
bash dora.sh
```

Saída esperada:

```text
Frequência de deploy    : 0.80 por dia (4 deploys em 5 dias)
Lead time médio         : 12.0 horas (5 mudanças)
Taxa de falha de mudança: 25% (1 de 4 deploys)
Tempo médio de restauro : 2.0 horas
```

Confira a conta à mão: os lead times foram 6h (carrinho), 23h (cupom), 22h (frete), 3h (fix) e 6h (pix), somando 60h, ou 12h de média. O incidente de 14h foi restaurado às 16h.

### Mão na massa

1. Olhe o histórico bruto: `cd repo && git log --reverse --format='%ad  %s' --date=iso-strict && cd ..`. Você deve ver as 11 linhas, na ordem dos eventos.
2. Edite `gerar-historico.sh` e mude a data do `deploy: v1` de `2025-03-03T15:00:00+00:00` para `2025-03-04T09:00:00+00:00` (ele continua antes dos commits de cupom e frete). Regere (`bash gerar-historico.sh`) e rode `bash dora.sh`. **Observe:** o lead time médio sobe de 12.0 para 15.6 horas, porque o carrinho esperou 24h em vez de 6h. A frequência de deploy não mudou. Moral: segurar uma mudança pronta numa fila piora o lead time sem trazer segurança.
3. Restaure a data original do `deploy: v1` em `gerar-historico.sh` (`2025-03-03T15:00:00+00:00`) e rode `bash gerar-historico.sh` de novo. Guarde o script: o diretório `repo` pode ser apagado na Limpeza abaixo, porque a Etapa 03 o regera a partir do `gerar-historico.sh`.

### Exercícios

1. Classifique cada situação como problema de **cultura**, de **ferramenta** ou de **ambos**: (a) o Ops só fica sabendo do deploy quando recebe o ticket; (b) o deploy é feito copiando arquivos por SFTP; (c) o time evita implantar às sextas por medo, e ninguém discute por quê.
2. No histórico do laboratório, se o `deploy: v3` também tivesse gerado um incidente, qual seria a nova taxa de falha de mudança?
3. Por que o material diz que o ciclo de vida "retroalimenta" o planejamento?

<details>
<summary>Gabarito</summary>

1. (a) cultura: silo e comunicação. (b) ferramenta: falta automação, embora também revele hábito. (c) ambos: o medo é cultural, e o processo manual de deploy alimenta esse medo.
2. 2 falhas em 4 deploys, ou 50%.
3. Porque o que se aprende na operação (falhas, métricas, feedback de usuários) vira insumo do próximo planejamento, fechando o laço.

</details>

### Limpeza

```sh
cd "$LAB/etapa-01" && rm -rf repo
```

(Apague só o `repo`. O `gerar-historico.sh` e o `dora.sh` ficam, porque a Etapa 03 regera o repositório com eles.)

### Anota aí

DevOps é fazer Dev e Ops compartilharem um objetivo e um fluxo contínuo, e o progresso se mede em velocidade e estabilidade juntas.

---

## Etapa 02: Práticas comuns e ferramentas

### O problema

Black Friday. O time precisa de um ambiente de teste idêntico à produção para validar uma correção de preço. Quem monta? Um operador, em dois dias, seguindo uma planilha. O ambiente sai um pouco diferente (uma versão de biblioteca, um parâmetro de rede), o teste passa, e na produção o preço continua errado. Isso é **deriva de ambiente**, e o material resume a cura em cinco pilares: Infraestrutura como Código (IaC), Integração Contínua (CI), Entrega Contínua (CD), conteinerização e monitoramento contínuo.

Esta etapa percorre os pilares na ordem em que um aluno os encontra: primeiro descrever o ambiente (IaC e gerenciamento de configuração), depois testá-lo e entregá-lo (CI/CD e estratégias de deploy), em seguida empacotá-lo (containers e registros) e por fim observá-lo (monitoramento).

### 2.1 Infraestrutura como Código (IaC)

#### O conceito

Na IaC, servidores, redes, balanceadores e até contas de usuário deixam de ser configurados manualmente e passam a ser descritos em arquivos legíveis e versionados. O ambiente fica **reproduzível, auditável e imune à deriva** entre desenvolvimento, homologação e produção. Os arquivos são tratados como código de aplicação:

- ficam em repositórios Git;
- passam por revisão via pull request;
- são validados por testes automatizados que checam sintaxe e executam planos de alteração (os **dry-runs**) antes de qualquer mudança valer.

Criar um ambiente de teste vira um comando, e destruí-lo depois também, sem sobrar recurso ocioso gastando orçamento.

**Analogia da receita.** Cozinhar "de cabeça" produz um prato diferente a cada vez. Uma receita escrita, com medidas, permite que qualquer cozinheiro repita o prato, e que você veja no histórico quem mudou o sal.

**Ferramentas citadas no material:** Terraform (multi-cloud, linguagem própria HCL), serviços nativos (AWS CloudFormation, Azure Resource Manager, Google Deployment Manager) e Pulumi (linguagens convencionais como TypeScript, Python ou Go).

#### Equivalência AWS x Azure

> **Acréscimo do professor:** o material cita CloudFormation e Azure Resource Manager lado a lado, sem aprofundar. A tabela e as diferenças abaixo são explicação didática do professor.

| Papel | AWS `[Acréscimo do professor, salvo o citado no material]` | Azure `[Acréscimo do professor]` | Ponte agnóstica |
|---|---|---|---|
| Linguagem declarativa nativa | CloudFormation (citado no material; templates em YAML ou JSON) | Azure Resource Manager (ARM, templates em JSON) e **Bicep** (linguagem que compila para ARM) | Terraform (HCL) |
| Unidade que agrupa a implantação | Stack | Deployment, dentro de um Resource Group | Estado do Terraform |
| Prévia antes de aplicar | Change set (`aws cloudformation deploy --no-execute-changeset`) | `what-if` (`az deployment group what-if`) | `terraform plan` |
| Detecção de deriva | `aws cloudformation detect-stack-drift` | Reexecutar o `what-if` compara o template com o que existe | `terraform plan` |

**Onde diferem de verdade:**

- **Onde mora o estado.** O CloudFormation guarda o estado da stack no próprio serviço. O ARM/Bicep não usa arquivo de estado: cada implantação compara o template com os recursos do escopo. O Terraform guarda um **arquivo de estado** que precisa ser protegido e compartilhado em equipe (por exemplo, com backends remotos como S3 na AWS ou Azure Storage na Azure).
- **Escopo.** CloudFormation e ARM/Bicep só falam com o próprio provedor. Terraform fala com ambos (e com outros), com a mesma sintaxe, mas com recursos específicos de cada provedor: o código muda, o fluxo `init, plan, apply` não.
- **Bicep vs ARM.** Bicep é a forma de escrita mais legível; por baixo, vira template ARM. Aprender Bicep é aprender o ARM com menos ruído.
- **Opcional: Deployment Stacks.** A Azure também tem um conceito próximo da stack do CloudFormation: as *Deployment Stacks*, que agrupam os recursos de uma implantação como uma unidade gerenciada e podem apagar ou bloquear contra alteração o que sai do template. Não são necessárias para este guia.

#### Exemplo comentado: o mesmo "recurso mínimo" em três linguagens

Nosso recurso é um armazenamento de objetos com uma tag de ambiente. Primeiro o Terraform, em modo que roda **sem nuvem**, usando o provedor `local` para gravar um arquivo (o fluxo `plan`/`apply`/`destroy` é idêntico ao de um provedor real).

```sh
mkdir -p "$LAB/etapa-02/iac" && cd "$LAB/etapa-02/iac"
```

`main.tf`:

```hcl
terraform {
  required_providers {
    local = {
      source = "hashicorp/local"   # provedor que cria arquivos locais, ideal para aprender
    }
  }
}

variable "ambiente" {              # parâmetro de entrada, como no CloudFormation e no Bicep
  type    = string
  default = "dev"
}

resource "local_file" "config" {   # tipo "local_file", nome interno "config"
  filename = "${path.module}/saida/${var.ambiente}.conf"   # onde o arquivo será criado
  content  = "ambiente=${var.ambiente}\nreplicas=2\n"      # conteúdo desejado (estado declarado)
}
```

Rode (requer `terraform` instalado):

```sh
terraform init            # baixa o provedor
terraform plan            # o dry-run: mostra o que MUDARIA
terraform apply -auto-approve
cat saida/dev.conf
terraform apply -auto-approve    # segunda vez
```

Trechos esperados (os textos completos têm mais linhas):

```text
Plan: 1 to add, 0 to change, 0 to destroy.
...
Apply complete! Resources: 1 added, 0 changed, 0 destroyed.
ambiente=dev
replicas=2
...
No changes. Your infrastructure matches the configuration.
```

A segunda execução não faz nada: o ambiente já está no estado desejado. Isso é o comportamento **declarativo**: você descreve o destino, não os passos.

Agora o mesmo recurso na linguagem nativa de cada nuvem. Estes arquivos servem para **comparação**, e a validação local abaixo não cria nada na nuvem.

`cfn.yaml` (AWS CloudFormation):

```yaml
AWSTemplateFormatVersion: "2010-09-09"   # versão do formato do template (valor fixo)
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
          Value: !Ref Ambiente           # usa o valor do parâmetro
```

`main.bicep` (Azure Bicep, `[Acréscimo do professor: Azure]`):

```bicep
param ambiente string = 'dev'                         // parâmetro de entrada
param localizacao string = resourceGroup().location   // região do grupo de recursos onde for implantado

resource conta 'Microsoft.Storage/storageAccounts@2023-01-01' = {   // tipo e versão da API
  name: 'st${uniqueString(resourceGroup().id)}'       // nome único e válido (só minúsculas e números)
  location: localizacao
  sku: { name: 'Standard_LRS' }                       // nível de replicação do armazenamento
  kind: 'StorageV2'                                   // tipo de conta
  tags: { ambiente: ambiente }                        // a mesma tag do exemplo AWS
}
```

Validação local, sem credenciais. O `cfn-lint` é instalado com `pip` dentro de um **ambiente virtual** (`venv`), porque em Debian 12, Ubuntu 23.04 e sistemas mais novos o `pip install` direto no sistema falha com `externally-managed-environment` (PEP 668). O mesmo ambiente serve para o Ansible, na seção 2.2. (Alternativa sem venv: `pipx install cfn-lint`.) Os comandos `az bicep` exigem o Azure CLI (`az`) instalado.

```sh
python3 -m venv "$LAB/.venv"           # cria o ambiente virtual (uma vez)
. "$LAB/.venv/bin/activate"            # ativa o ambiente neste terminal
pip install cfn-lint
cfn-lint cfn.yaml && echo "cfn ok"     # saída esperada: cfn ok (cfn-lint não imprime nada quando está tudo certo)

az bicep install                       # requer o Azure CLI; baixa o compilador Bicep (uma vez)
az bicep build --file main.bicep       # gera main.json, o template ARM equivalente
ls main.json
```

O `main.json` é o **ARM** gerado do Bicep: abra e compare o tamanho com o `.bicep`. Isso mostra, na prática, por que o Bicep existe.

Comandos de nuvem (**referência, não é necessário executar**):

```sh
# AWS: prévia (change set), aplicação e remoção
aws cloudformation deploy --template-file cfn.yaml --stack-name loja-dev \
  --parameter-overrides Ambiente=dev --no-execute-changeset
aws cloudformation deploy --template-file cfn.yaml --stack-name loja-dev \
  --parameter-overrides Ambiente=dev
aws cloudformation delete-stack --stack-name loja-dev

# Azure: grupo, prévia (what-if), aplicação e remoção
az group create --name rg-devops --location brazilsouth
az deployment group what-if --resource-group rg-devops --template-file main.bicep
az deployment group create --resource-group rg-devops --template-file main.bicep \
  --parameters ambiente=dev
az group delete --name rg-devops --yes
```

Observe a diferença de modelo: na Azure tudo mora num **Resource Group**, e apagar o grupo apaga o conteúdo; na AWS você apaga a **stack**.

#### Mão na massa

1. Rode `terraform plan` de novo (`No changes`), depois `rm saida/dev.conf` e `terraform plan` outra vez. **Observe:** o plano passa a propor **criar** o arquivo novamente (`local_file.config will be created` e `Plan: 1 to add, 0 to change, 0 to destroy.`). Você simulou uma deriva (alguém apagou algo à mão) e o IaC a detecta. Feche a deriva com `terraform apply -auto-approve`, que recria o `saida/dev.conf`.
2. Com o `dev.conf` de volta, rode `terraform apply -auto-approve -var ambiente=prod`. **Observe:** o plano mostra `local_file.config must be replaced` e `Plan: 1 to add, 0 to change, 1 to destroy.`: o `dev.conf` é apagado e o `prod.conf` é criado no lugar (confira com `ls saida`).
3. Limpe: `terraform destroy -auto-approve`. A pasta `saida/` fica vazia. "Destruir depois da validação é igualmente rápido", como o material afirma.

#### Anota aí

IaC é a receita versionada do ambiente: se você não consegue destruí-lo e recriá-lo com um comando, ainda tem configuração manual escondida.

### 2.2 Gerenciamento de configuração e idempotência

#### O problema

Terraform cria o servidor. E o que acontece **dentro** dele (pacotes, arquivos, serviços)? Se cada servidor for ajustado à mão, em seis meses nenhum é igual ao outro. O material chama isso de **deriva de configuração** (configuration drift). Ferramentas de gerenciamento de configuração (**Ansible, Chef, Puppet**) descrevem o estado desejado de cada máquina e o aplicam de forma **idempotente**: rodar uma vez ou dez vezes dá o mesmo resultado.

**Analogia do termostato.** Você não diz "aqueça por 10 minutos"; diz "mantenha 22 graus". Se já está em 22, nada acontece.

#### Equivalência AWS x Azure

| Papel | AWS `[Acréscimo do professor, salvo o citado no material]` | Azure `[Acréscimo do professor]` | Ponte agnóstica |
|---|---|---|---|
| Aplicar e manter configuração em máquinas | **AWS Systems Manager** (citado no material) | **Azure Automation** e **Azure Arc** (para estender o gerenciamento a máquinas fora da Azure, como as on-premises) | Ansible, Chef, Puppet |
| Guardar parâmetros de configuração | Systems Manager Parameter Store | Azure App Configuration | Arquivos versionados no Git |

**Onde diferem de verdade:** o Systems Manager reúne muitas capacidades sob um nome (execução remota de comandos, parâmetros, inventário e patching), enquanto na Azure essas capacidades se distribuem por serviços diferentes (Automation, Arc, App Configuration). **A equivalência é aproximada, não um para um.** Se você tem máquinas em vários lugares, o Ansible serve como linguagem comum.

Referência de CLI para parâmetros (**não é necessário executar**):

```sh
# AWS: grava e lê um parâmetro no Parameter Store
aws ssm put-parameter --name /loja/dev/porta --value 8080 --type String
aws ssm get-parameter --name /loja/dev/porta --query Parameter.Value --output text

# Azure: cria um repositório do App Configuration e grava uma chave
az appconfig create --name appcfg-loja-exemplo --resource-group rg-devops --location brazilsouth
az appconfig kv set --name appcfg-loja-exemplo --key loja/dev/porta --value 8080 --yes
```

#### Exemplo comentado: um playbook idempotente

Requer `ansible`, instalado no mesmo ambiente virtual da seção 2.1. O playbook roda na própria máquina, sem SSH, e fica numa pasta própria:

```sh
mkdir -p "$LAB/etapa-02/ansible" && cd "$LAB/etapa-02/ansible"
python3 -m venv "$LAB/.venv"           # só se você ainda não criou o ambiente na seção 2.1
. "$LAB/.venv/bin/activate"
pip install ansible
```

`playbook.yml`:

```yaml
- hosts: localhost                  # alvo: a máquina local
  connection: local                 # não usa SSH
  gather_facts: false               # dispensa a coleta de fatos, para a saída ficar curta
  tasks:
    - name: Garante o arquivo de configuração da aplicação
      ansible.builtin.copy:         # módulo que garante um arquivo com certo conteúdo
        dest: "{{ playbook_dir }}/app.conf"   # onde o arquivo deve existir
        content: "porta=8080\n"               # como ele deve estar
```

```sh
ansible-playbook playbook.yml    # 1a vez
ansible-playbook playbook.yml    # 2a vez
```

Resumo esperado (a linha do `PLAY RECAP`, no fim de cada execução):

```text
localhost                  : ok=1    changed=1    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
localhost                  : ok=1    changed=0    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
```

No topo de cada execução aparecem dois avisos `[WARNING]` sobre inventário vazio (`No inventory was parsed...`). Aqui eles são normais: não há inventário, e o alvo é só a máquina local.

`changed=1` na primeira vez e `changed=0` na segunda: **idempotência**.

#### Mão na massa

1. Edite o `app.conf` à mão e troque `8080` por `9999`. Rode o playbook de novo. **Observe:** `changed=1` e o arquivo volta a `porta=8080`. O Ansible corrigiu a deriva.
2. Rode `ansible-playbook playbook.yml --check --diff`. **Observe:** modo dry-run, que mostra a diferença sem aplicar (e, se o arquivo já estiver correto, nada a mostrar).
3. Saia do ambiente virtual com `deactivate` (para voltar a ele: `. "$LAB/.venv/bin/activate"`).

#### Anota aí

Gerenciar configuração é declarar o estado desejado e deixar a ferramenta convergir para ele, quantas vezes for preciso.

### 2.3 Integração Contínua (CI) e Entrega Contínua (CD)

#### O problema

Duas pessoas trabalham em branches diferentes por três semanas. Quando juntam, o código não compila, os testes quebram e ninguém lembra qual mudança causou o quê. Quanto mais tarde o defeito aparece, mais caro é consertá-lo.

#### O conceito

**CI.** Cada commit aciona verificações automáticas: o servidor de CI compila, gera artefatos e roda testes unitários. Se algo falha, o feedback chega em minutos, enquanto o contexto mental ainda está fresco.

**CD.** A CI sozinha não basta em cenários complexos. Depois dos testes iniciais, o artefato passa por testes de integração, simulações de carga e verificações automatizadas de segurança. Tudo orquestrado por um **arquivo de configuração unificado**, o **pipeline declarativo**, geralmente em YAML. Ele define desde o disparo a cada push no branch principal até as condições que bloqueiam um merge (cobertura de testes caiu, o lint falhou).

> **Nota do professor:** o material usa "Entrega Contínua (Continuous Delivery e Deployment)" quase como sinônimos. Distinguir ajuda: em **delivery** o artefato fica sempre pronto para ir a produção, e uma pessoa aprova o último passo; em **deployment** esse passo também é automático.

**Ferramentas citadas:** Jenkins (extensível por plugins), GitHub Actions e GitLab CI/CD (integradas ao repositório) e Argo CD (em Kubernetes, trata o Git como fonte única de verdade).

#### Equivalência AWS x Azure

| Papel | AWS `[Acréscimo do professor]` | Azure `[Acréscimo do professor]` | Ponte agnóstica |
|---|---|---|---|
| Build e testes | **CodeBuild** (definido em `buildspec.yml`) | **Azure Pipelines**, parte do Azure DevOps (definido em `azure-pipelines.yml`) | GitHub Actions, GitLab CI/CD, Jenkins |
| Orquestração das etapas até produção | **CodePipeline** | Azure Pipelines (mesmo produto, com `stages`) | GitHub Actions (jobs e ambientes) |
| Implantação em instâncias ou serviços | **CodeDeploy** | Tarefas de implantação do Azure Pipelines | Argo CD, Spinnaker |

**Onde diferem de verdade:** na AWS, build, orquestração e implantação são **serviços separados** que você conecta. No Azure DevOps, o Azure Pipelines concentra build e release em **um** produto, que ainda traz boards e repositórios no mesmo pacote. Nada impede de usar GitHub como origem do código nos dois casos.

CLI de referência (**não é necessário executar**):

```sh
aws codebuild start-build --project-name loja-build           # AWS: dispara um build
aws codepipeline start-pipeline-execution --name loja-pipe    # AWS: dispara o pipeline

az extension add --name azure-devops                          # Azure: adiciona a extensão (uma vez)
az pipelines run --name loja-ci \
  --org https://dev.azure.com/<org> --project <projeto>       # Azure: dispara um pipeline (organização e projeto são obrigatórios)
```

(`<org>` e `<projeto>` são marcadores. Para não repeti-los em todo comando, defina-os uma vez com `az devops configure --defaults organization=https://dev.azure.com/<org> project=<projeto>`.)

#### Exemplo comentado: o mesmo CI rodando local, no GitHub Actions, no Azure Pipelines e no CodeBuild

A ideia-chave: **o pipeline chama um script**; o script também roda no seu terminal. Assim você testa o CI antes de dar push.

```sh
mkdir -p "$LAB/etapa-02/ci" && cd "$LAB/etapa-02/ci"
```

`calc.py`:

```python
def soma(a, b):
    return a + b
```

`test_calc.py`:

```python
import unittest
from calc import soma


class TestCalc(unittest.TestCase):
    def test_soma(self):
        self.assertEqual(soma(2, 3), 5)


if __name__ == "__main__":
    unittest.main()
```

`ci.sh`:

```sh
#!/usr/bin/env bash
set -euo pipefail                                   # qualquer erro interrompe o pipeline

echo "[1/3] lint (sintaxe)"
python3 -m py_compile calc.py test_calc.py          # falha se houver erro de sintaxe

echo "[2/3] testes"
python3 -m unittest -v                              # falha se algum teste falhar

echo "[3/3] build (artefato)"
mkdir -p dist
tar -czf dist/app.tar.gz calc.py                    # o "artefato" gerado
echo "artefato: $(ls dist)"
```

```sh
chmod +x ci.sh
./ci.sh
```

Saída esperada no Python 3.11 ou superior (o tempo no "Ran 1 test" varia; no Python 3.10 ou anterior, a terceira linha aparece como `test_soma (test_calc.TestCalc) ... ok`, sem o nome do método dentro do parêntese, e isso não é erro):

```text
[1/3] lint (sintaxe)
[2/3] testes
test_soma (test_calc.TestCalc.test_soma) ... ok

----------------------------------------------------------------------
Ran 1 test in 0.000s

OK
[3/3] build (artefato)
artefato: app.tar.gz
```

Agora o mesmo script orquestrado por três serviços. Compare como cada um expressa a mesma ideia.

`.github/workflows/ci.yml` (GitHub Actions, agnóstico; o caminho é relativo à **raiz do repositório**, veja o passo 3 do Mão na massa):

```yaml
name: ci                              # nome que aparece na aba Actions
on:                                   # gatilhos
  push:
    branches: [main]                  # a cada push no main
  pull_request:                       # e a cada pull request
jobs:
  build-test:                         # nome do job
    runs-on: ubuntu-latest            # máquina que executa
    steps:
      - uses: actions/checkout@v4     # baixa o código do repositório
      - uses: actions/setup-python@v5 # instala o Python
        with:
          python-version: "3.12"      # versão do Python
      - run: ./ci.sh                  # roda exatamente o mesmo script do seu terminal
```

`azure-pipelines.yml` (Azure Pipelines, `[Acréscimo do professor: Azure]`):

```yaml
trigger:
  - main                              # dispara a cada push no main
pool:
  vmImage: ubuntu-latest              # máquina hospedada que executa
steps:
  - task: UsePythonVersion@0          # tarefa que instala o Python
    inputs:
      versionSpec: "3.12"             # versão do Python
  - script: ./ci.sh                   # o mesmo script
    displayName: Rodar CI             # nome do passo na interface
```

`buildspec.yml` (AWS CodeBuild):

```yaml
version: 0.2                          # versão do formato de buildspec
phases:
  build:
    commands:
      - ./ci.sh                       # o mesmo script
artifacts:
  files:
    - dist/app.tar.gz                 # o que o CodeBuild guarda como artefato
```

Veja o padrão: três formatos, **um** script. Quem aprende a lógica (disparo, ambiente, passos, artefato) troca de ferramenta com facilidade. Os dois primeiros YAMLs concentram o caminho em um arquivo, como diz o material; na AWS, o `buildspec.yml` cuida do build e o CodePipeline orquestra o resto.

#### Mão na massa

1. Quebre o teste: troque `5` por `6` em `test_calc.py` e rode `./ci.sh; echo "código de saída: $?"`. **Observe:** o teste falha, o passo 3 **não executa** (`set -e`), e o código de saída é diferente de zero. É isso que o servidor de CI interpreta como "build vermelho".
2. Conserte o teste e rode de novo para ver o pipeline voltar a passar.
3. Opcional: crie um repositório no GitHub cuja **raiz** seja a própria pasta `ci/` (`cd "$LAB/etapa-02/ci" && git init`), com o `ci.yml` em `.github/workflows/ci.yml` dentro dela. Isso importa por dois motivos: o GitHub só procura workflows em `.github/workflows/` na raiz do repositório, e o `run: ./ci.sh` é executado a partir dessa raiz. Se você publicar a pasta `lab-devops` inteira, o workflow não roda. O bit de execução do `ci.sh` também precisa ir no commit (no Windows, rode `git update-index --chmod=+x ci.sh` antes de commitar). Faça o push e veja o job rodar na aba Actions. Não é necessário para concluir o laboratório.

#### Anota aí

Pipeline bom é um arquivo declarativo que chama scripts que você consegue rodar na sua máquina.

### 2.4 Estratégias de deployment: blue-green e canary

#### O problema

O deploy de sexta à noite falha e o site sai do ar. A pergunta não é só "como evitar o erro", mas "como fazer o erro machucar o mínimo de gente e ser desfeito rápido".

#### O conceito

- **Blue-green:** dois ambientes idênticos coexistem, um com a versão atual e outro com a nova. O tráfego é redirecionado de forma controlada para validar a nova antes de desativar a antiga.
- **Canary release:** a nova versão vai para um pequeno percentual de usuários; observam-se indicadores de desempenho e experiência antes de expandir. Regressões ficam contidas.

**Analogia.** Blue-green é ter dois palcos montados e girar o público de um para o outro. Canary é mandar um mineiro com um canário à frente: se o canário passar mal, a equipe inteira não entra.

A Etapa 04 acrescenta **rolling updates** (trocar instâncias em lotes, gradualmente).

#### Equivalência AWS x Azure

| Estratégia | AWS `[Acréscimo do professor]` | Azure `[Acréscimo do professor]` |
|---|---|---|
| Blue-green | CodeDeploy (implantação blue/green) | **Slots de implantação** do App Service, com troca (swap) |
| Canary por peso de tráfego | Pesos entre grupos de destino no balanceador (ALB) | Roteamento de uma porcentagem do tráfego entre slots do App Service |

**Onde diferem de verdade:** na Azure, o conceito de "slot" (um ambiente paralelo do mesmo serviço, que pode ser trocado) é nativo do App Service e deixa a troca blue-green muito direta. Na AWS, a mesma ideia é montada com mais peças (balanceador, grupos de destino, CodeDeploy). Para containers em Kubernetes, ambas as nuvens (EKS e AKS) usam as mesmas ferramentas do ecossistema, como Argo CD.

#### Exemplo comentado: blue-green e canary com nginx (local)

Dois containers (`azul` e `verde`) respondem com o nome da versão, e um nginx na frente decide para qual mandar o tráfego.

```sh
mkdir -p "$LAB/etapa-02/deploy/conf" && cd "$LAB/etapa-02/deploy"
docker network create devops-lab
docker run -d --name azul  --network devops-lab hashicorp/http-echo -text="v1 azul"
docker run -d --name verde --network devops-lab hashicorp/http-echo -text="v2 verde"
```

`conf/default.conf` (começa 100% no azul):

```nginx
server {
    listen 80;                              # porta dentro do container
    location / {
        proxy_pass http://azul:5678;        # destino atual: o ambiente azul (http-echo escuta em 5678)
    }
}
```

```sh
docker run -d --name proxy --network devops-lab -p 8080:80 \
  -v "$PWD/conf:/etc/nginx/conf.d:ro" nginx:alpine
sleep 1                                     # dá tempo de o nginx subir
curl -s localhost:8080
```

Saída esperada: `v1 azul`.

**Blue-green:** troque o destino e recarregue o nginx, sem derrubar o container.

```sh
sed -i 's/azul:5678/verde:5678/' conf/default.conf
docker exec proxy nginx -s reload && sleep 1    # o reload é assíncrono: espere os workers novos assumirem
curl -s localhost:8080
```

Saída esperada: `v2 verde` (antes dela, o `reload` imprime uma linha `[notice] ... signal process started`, que é normal). O `sleep 1` existe porque o `reload` volta antes de terminar: o nginx troca os workers em segundo plano, e um `curl` imediato ainda pode cair num worker antigo e responder `v1 azul`. Para fazer o **rollback**, é só desfazer a edição e recarregar (o ambiente azul continuou de pé o tempo todo, e esse é o valor do blue-green).

**Canary:** substitua o arquivo por um `upstream` com pesos (9 para o azul, 1 para o verde). A linha `zone` é o que torna a contagem exata: o nginx roda vários processos de trabalho (os *workers*, em geral um por CPU), e sem uma zona de memória compartilhada cada um tem o seu próprio contador de pesos, de modo que 10 requisições podem sair 8/2 ou 10/0.

```nginx
upstream app {
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
```

```sh
docker exec proxy nginx -s reload && sleep 1
for i in $(seq 1 10); do curl -s localhost:8080; done | sort | uniq -c
```

Saída esperada:

```text
      9 v1 azul
      1 v2 verde
```

#### Mão na massa

1. Mude os pesos para 7 e 3, recarregue (`docker exec proxy nginx -s reload && sleep 1`) e repita a contagem. **Observe:** `7 v1 azul` e `3 v2 verde`; a proporção acompanha os pesos. É assim que o canário é "expandido" aos poucos.
2. Siga esta ordem: (a) volte os pesos para 9 e 1; (b) rode `docker exec proxy nginx -s reload && sleep 1`; (c) só então pare o canário com `docker stop verde`; (d) rode a contagem. A ordem importa: com o container parado, o nome `verde` deixa de existir na rede, e um `reload` feito depois falharia com `host not found in upstream "verde:5678"`. **Observe:** `10 v1 azul`. Quando um servidor do grupo não responde, o nginx repassa a requisição para o próximo servidor e marca o que falhou como indisponível por 10 segundos (o padrão); por isso nenhuma requisição se perde, mas a contagem pode demorar até cerca de um minuto, porque as tentativas no `verde` esperam o tempo limite de conexão. Em produção, quem decide quando abortar o canário é a **métrica** (Etapa 2.6), não o olho.

#### Limpeza

```sh
docker rm -f proxy azul verde
docker network rm devops-lab
```

#### Anota aí

Blue-green troca o ambiente inteiro de uma vez com volta imediata; canary expõe a versão nova a poucos antes de expor a todos.

### 2.5 Virtualização, containers e registros

#### O problema

"Na minha máquina funcionava." A aplicação depende de versões de bibliotecas e do sistema operacional, e cada ambiente tem as suas.

#### O conceito

- **Máquinas virtuais:** embarcam um sistema operacional completo sobre um **hipervisor**. Isolam bem, mas carregam o peso de um SO inteiro por VM.
- **Containers:** empacotam só o runtime e as dependências essenciais, **compartilhando o kernel do host**. Consomem menos e iniciam mais rápido.
- **Imagens imutáveis e versionadas** ficam em **registros**. O mesmo artefato testado em homologação é exatamente o que chega à produção, e voltar a uma versão anterior é um comando.
- **Kubernetes** orquestra containers em escala: escalona réplicas, equilibra tráfego e recupera instâncias que falham, tudo por configuração declarativa.
- **Segurança de containers (material):** AppArmor, SELinux e Falco restringem o que cada container pode fazer.
- **On-premises (material):** VMware vSphere, Proxmox e Hyper-V; arquiteturas híbridas misturam VMs (isolamento rígido) e containers (escala rápida).

**Analogia.** VM é alugar um apartamento inteiro, com cozinha e banheiro, para cada pessoa. Container é um quarto numa casa compartilhada: cada um tem o seu espaço, e todos usam a mesma estrutura.

#### Equivalência AWS x Azure

| Papel | AWS `[Acréscimo do professor]` | Azure `[Acréscimo do professor]` | Ponte agnóstica |
|---|---|---|---|
| Registro de imagens | **ECR** (Elastic Container Registry) | **ACR** (Azure Container Registry) | Registro `registry:2` (local), Docker Hub |
| Kubernetes gerenciado | EKS | AKS | Kubernetes |

**Onde diferem de verdade:** ECR e ACR cumprem o mesmo papel (guardar imagens privadas, controle de acesso, integração com a respectiva nuvem). No ECR, o repositório pode ser configurado para **impedir a sobrescrita de tags** (`--image-tag-mutability IMMUTABLE`). No ACR, o recurso equivalente é **travar** uma imagem contra escrita: `az acr repository update --name <registro> --image loja:1.0.0 --write-enabled false` impede que a tag `loja:1.0.0` seja sobrescrita ou apagada (com `--repository loja` no lugar de `--image`, a trava vale para o repositório inteiro). A autenticação do Docker também muda de forma (veja abaixo).

CLI de referência (**não é necessário executar**):

```sh
# AWS: cria o repositório, autentica o Docker, envia a imagem
aws ecr create-repository --repository-name loja --image-tag-mutability IMMUTABLE
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin 123456789012.dkr.ecr.us-east-1.amazonaws.com
docker tag loja:1.0.0 123456789012.dkr.ecr.us-east-1.amazonaws.com/loja:1.0.0
docker push 123456789012.dkr.ecr.us-east-1.amazonaws.com/loja:1.0.0

# Azure: cria o registro, autentica o Docker, envia a imagem e trava a tag
az acr create --resource-group rg-devops --name acrlojaexemplo --sku Basic
az acr login --name acrlojaexemplo
docker tag loja:1.0.0 acrlojaexemplo.azurecr.io/loja:1.0.0
docker push acrlojaexemplo.azurecr.io/loja:1.0.0
az acr repository update --name acrlojaexemplo --image loja:1.0.0 --write-enabled false
```

(O número `123456789012` e o nome `acrlojaexemplo` são fictícios; o nome do ACR precisa ser único globalmente.)

#### Exemplo comentado: seu próprio registro local

O padrão é idêntico ao dos dois provedores: **tag com versão, push, pull**. Só muda o endereço. O registro escuta na porta 5000 dentro do container, e nós o publicamos na **5001** do seu computador (`-p 5001:5000`), porque no macOS 12 ou superior a 5000 está ocupada pelo AirPlay Receiver.

```sh
docker run -d --name registro -p 5001:5000 registry:2        # um registro local mínimo, na porta 5001
docker pull alpine:3.20                                      # uma imagem qualquer para servir de "app"
docker tag alpine:3.20 localhost:5001/loja:1.0.0             # endereço do registro + nome + versão
docker push localhost:5001/loja:1.0.0                        # publica
curl -s localhost:5001/v2/_catalog
curl -s localhost:5001/v2/loja/tags/list
```

Saída esperada dos dois `curl`:

```text
{"repositories":["loja"]}
{"name":"loja","tags":["1.0.0"]}
```

#### Mão na massa

1. Publique uma segunda versão: `docker tag alpine:3.20 localhost:5001/loja:1.0.1 && docker push localhost:5001/loja:1.0.1`. Rode o `tags/list` de novo. **Observe:** as duas tags coexistem, e é isso que permite voltar a uma versão anterior.
2. Apague a imagem local e baixe uma versão específica do registro: `docker rmi localhost:5001/loja:1.0.0 && docker run --rm localhost:5001/loja:1.0.0 echo "rodei a 1.0.0"`. **Observe:** o Docker baixa do registro e executa. A saída termina com `rodei a 1.0.0`.

#### Limpeza

```sh
docker rm -f registro
docker rmi localhost:5001/loja:1.0.0 localhost:5001/loja:1.0.1 2>/dev/null || true
```

#### Anota aí

Imagem imutável com tag de versão, guardada num registro, é o que torna "o mesmo artefato do teste à produção" uma verdade e não um desejo.

### 2.6 Feedback contínuo em produção: métricas, logs, tracing e SLOs

#### O problema

O site está lento e ninguém sabe desde quando. O cliente reclama no suporte antes de o time perceber. Sem observar, você só descobre o problema pela reclamação.

#### O conceito

Cada requisição, cada byte de memória e cada milissegundo de latência contam uma história. Três pilares:

- **Métricas:** CPU, memória, tempo de resposta, taxa de sucesso.
- **Logs:** eventos centralizados em um repositório pesquisável.
- **Tracing distribuído:** segue uma chamada entre microsserviços, do front-end ao banco, expondo gargalos invisíveis.

Coletar não basta; é preciso transformar dados em decisão. Por isso se definem **SLIs** (indicadores medidos) e **SLOs** (objetivos acordados), e alertas para quando o limite estoura, como os exemplos do material: **erro acima de 1% das requisições** ou **latência média acima de 200 ms**.

**Analogia do painel do carro.** O velocímetro mostra o número (SLI); a placa "limite 80" é o objetivo (SLO); o alerta é o bip quando você passa dele.

**Ferramentas citadas:** Prometheus e Grafana (dashboards), Elasticsearch e Kibana (logs), Jaeger (tracing), Datadog e New Relic (comerciais, tudo-em-um).

#### Equivalência AWS x Azure

| Papel | AWS `[Acréscimo do professor]` | Azure `[Acréscimo do professor]` | Ponte agnóstica |
|---|---|---|---|
| Métricas, logs e alarmes | **CloudWatch** (Metrics, Logs, Alarms) | **Azure Monitor** (Metrics, Log Analytics, Alerts) | Prometheus + Grafana, ELK |
| Tracing distribuído e telemetria de aplicação | **X-Ray** | **Application Insights** (dentro do Azure Monitor) | Jaeger |
| Prometheus e Grafana gerenciados | Amazon Managed Service for Prometheus e Amazon Managed Grafana | Azure Monitor managed service for Prometheus e Azure Managed Grafana | Prometheus + Grafana auto-hospedados |

**Onde diferem de verdade:** em ambas as nuvens o monitoramento nativo é a escolha mais rápida para recursos da própria nuvem. A ponte Prometheus + Grafana existe nos dois lados, o que permite manter **as mesmas consultas e dashboards** ao migrar. Já os agentes e a forma de consultar logs diferem (CloudWatch Logs Insights de um lado, consultas no Log Analytics do outro), então não se aprende um e se usa o outro sem estudar.

CLI de referência (**não é necessário executar**; `i-0abc...` e `<id-do-recurso>` são marcadores):

```sh
# AWS: alarme de CPU alta (o 70 é só um exemplo)
aws cloudwatch put-metric-alarm --alarm-name cpu-alta \
  --namespace AWS/EC2 --metric-name CPUUtilization --statistic Average \
  --period 300 --evaluation-periods 1 --threshold 70 \
  --comparison-operator GreaterThanThreshold \
  --dimensions Name=InstanceId,Value=i-0abc1234567890def

# Azure: alerta de métrica equivalente
az monitor metrics alert create --name cpu-alta --resource-group rg-devops \
  --scopes <id-do-recurso> --condition "avg Percentage CPU > 70" \
  --window-size 5m --evaluation-frequency 1m
```

#### Exemplo comentado: calculando SLIs de um log e disparando um alerta de SLO

Geramos um log de acesso previsível (200 requisições, com erro a cada 40 e latência que varia de 100 a 280 ms) e calculamos os dois SLIs do material. O gerador fica num arquivo, `gerar-log.sh`, para que você possa editá-lo e rodá-lo de novo no Mão na massa.

```sh
mkdir -p "$LAB/etapa-02/slo" && cd "$LAB/etapa-02/slo"
```

`gerar-log.sh`:

```sh
#!/usr/bin/env bash
# gera acesso.log: uma linha por requisição, no formato "status latência_ms"
awk 'BEGIN{ for (i=1; i<=200; i++) {
  status = (i % 40 == 0) ? 500 : 200          # 5 erros em 200 requisições
  lat = 100 + (i % 10) * 20                   # latência de 100 a 280 ms, em ciclos
  print status, lat } }' > acesso.log
```

```sh
bash gerar-log.sh
head -3 acesso.log
```

Saída esperada do `head`:

```text
200 120
200 140
200 160
```

`slo.sh`:

```sh
#!/usr/bin/env bash
awk '
{ total++; lat += $2; if ($1 >= 500) erros++ }       # conta requisições, soma latências, conta erros
END {
  taxa = 100 * erros / total                         # SLI 1: taxa de erro (%)
  media = lat / total                                # SLI 2: latência média (ms)
  printf "taxa de erro: %.1f%% | latência média: %.0f ms\n", taxa, media
  if (taxa > 1)    print "ALERTA: erro acima de 1% das requisições"
  if (media > 200) print "ALERTA: latência média acima de 200 ms"
}' acesso.log
```

```sh
bash slo.sh
```

Saída esperada:

```text
taxa de erro: 2.5% | latência média: 190 ms
ALERTA: erro acima de 1% das requisições
```

A latência média (190 ms) está dentro do limite, mas a taxa de erro (2,5%) estourou: um só indicador já basta para acordar alguém.

O mesmo alerta, na linguagem do Prometheus (agnóstico, vale para os dois provedores). Duas peças da expressão, antes do YAML: `http_requests_total` é um **contador** que a aplicação expõe, que só cresce (uma unidade a cada requisição atendida) e traz rótulos como `status`; `rate(...[5m])` transforma esse contador em **requisições por segundo**, na média dos últimos 5 minutos. A regra divide a taxa das respostas 5xx (`status=~"5.."`) pela taxa total, e o `sum` soma as séries de todas as instâncias da aplicação. `alertas.yml`:

```yaml
groups:
  - name: slo-loja                       # grupo de regras
    rules:
      - alert: TaxaDeErroAlta            # nome do alerta
        expr: sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m])) > 0.01
        # expr: razão de erros 5xx sobre o total, nos últimos 5 minutos, acima de 1%
        for: 5m                          # só dispara se persistir por 5 minutos (evita ruído)
        labels:
          severity: page                 # etiqueta usada para rotear a notificação
```

Validação, sem subir nada:

```sh
docker run --rm -v "$PWD":/cfg --entrypoint promtool prom/prometheus check rules /cfg/alertas.yml
```

(Em sistemas com SELinux, como o Fedora, acrescente `:z` ao volume: `-v "$PWD":/cfg:z`.)

Saída esperada:

```text
Checking /cfg/alertas.yml
  SUCCESS: 1 rules found
```

#### Mão na massa

1. No `gerar-log.sh`, mude `i % 40` para `i % 200` (1 erro em 200, ou 0,5%), regere o log com `bash gerar-log.sh` e rode `bash slo.sh`. **Observe:** `taxa de erro: 0.5% | latência média: 190 ms` e nenhum alerta, porque o SLI voltou para dentro do SLO.
2. No mesmo arquivo, mude `(i % 10) * 20` para `(i % 10) * 40`, rode `bash gerar-log.sh && bash slo.sh` e **observe** o alerta de latência disparar: `latência média: 280 ms` e `ALERTA: latência média acima de 200 ms`.

#### Anota aí

Métrica sem limite acordado é só número; o SLO transforma o dado em decisão sobre quando agir.

### 2.7 Fechando a etapa: o que o mercado conta

**Case Netflix (segundo o material):** como fazer milhares de alterações por dia, em escala global, sem colapso? Automatizar tudo: infraestrutura como código, pipelines de CI/CD robustos (como o **Spinnaker**, que a própria Netflix ajudou a criar) e containers padronizados. O profissional é valorizado menos por conhecer a ferramenta e mais por replicar uma fração dessa eficiência.

**Tendências:** **GitOps** (Git como fonte única da verdade, com Argo CD ou Flux garantindo que a produção reflita o código) e **Policy as Code** (por exemplo, com Open Policy Agent, para que a infraestrutura já nasça dentro das regras de segurança e custo). Cada nuvem tem seu serviço de políticas nativo (AWS Config e Azure Policy), mas esta etapa não os aprofunda.

### Exercícios da etapa

1. Qual a diferença entre um `terraform plan` e um `terraform apply`? E qual o equivalente do `plan` em CloudFormation e em Bicep?
2. Seu playbook rodou duas vezes e na segunda mostrou `changed=1`. Que hipóteses você levanta?
3. Para fazer um canary com 5% do tráfego usando o nginx do laboratório, que pesos você usaria?
4. Quais dois SLIs o material usa como exemplo de alerta, e com que limites?

<details>
<summary>Gabarito</summary>

1. `plan` só mostra o que mudaria (dry-run); `apply` executa a mudança. Equivalentes: change set (`aws cloudformation deploy --no-execute-changeset`) no CloudFormation e `az deployment group what-if` no Bicep/ARM.
2. A tarefa não é idempotente (por exemplo, usa um módulo de comando em vez de um que verifica o estado), ou algo no ambiente muda o recurso entre as execuções (uma segunda fonte de verdade mexendo no mesmo arquivo).
3. `weight=19` no estável e `weight=1` no canário (1 em cada 20, ou 5%).
4. Taxa de erro acima de 1% das requisições e latência média acima de 200 ms.

</details>

### Anota aí (etapa inteira)

IaC descreve, CI valida, CD entrega, containers empacotam, e o monitoramento devolve para o time o que a produção aprendeu.

---

## Etapa 03: Cultura organizacional

### O problema

A sexta-feira de novo, mas agora o foco é o que acontece **depois** da falha. O deploy da noite derruba o site. Dev diz que a infraestrutura é instável; Ops diz que o código novo é ruim; a gestão quer um culpado. Na semana seguinte, ninguém quer mexer em nada importante, e as mudanças ficam acumuladas em lotes gigantes (que são, justamente, mais arriscadas). É a "caça às bruxas" descrita no material: medo, desconfiança e aversão a risco. A etapa anterior deu as ferramentas; esta mostra por que elas fracassam num ambiente em que errar é perigoso.

### O conceito

#### DevOps como mudança de mentalidade

A cultura DevOps floresce quando a cultura organizacional está madura o bastante. Não é adotar ferramentas nem redesenhar o organograma: é **transformar silos em pontes**. Dev, Ops, QA e segurança dividem as responsabilidades de design, implantação e monitoramento. A entrega de cada um **só está completa quando o serviço funciona de forma estável no ambiente real e gera valor ao usuário**.

Três práticas sustentam isso:

- **Post-mortems construtivos:** sem caça a culpados; documenta-se a falha com transparência e converte-se o aprendizado em processo, checklist ou ferramenta.
- **Experimentação segura:** testes pequenos em ambientes controlados, apoiados por feedback rápido.
- **Foco no valor ao cliente:** conta a estabilidade, a rapidez com que novidades chegam ao ar e a experiência do usuário, e não a quantidade de merges.

#### O que é cultura organizacional

É o "DNA corporativo": valores, crenças, normas e rituais, muitos não escritos, que guiam como pessoas interagem e como conflitos se resolvem. Quatro fatores a moldam:

| Fator | Como molda a cultura |
|---|---|
| História e fundação | Startups tendem a inovação e tolerância ao erro; corporações tradicionais, a hierarquia e processo |
| Liderança | Equipes espelham o comportamento dos gestores |
| Políticas de RH e gestão | Feedback frequente, planos de carreira e celebrações transformam valor abstrato em hábito |
| Símbolos e cerimônias | Reuniões de aprendizado, hackathons, o café coletivo de sexta |

#### Tipos de cultura e a relação com DevOps

| Tipo | Traço central | Receptividade ao DevOps (segundo o material) |
|---|---|---|
| Clã | Pertencimento, cuidado mútuo, erro como aprendizado coletivo | Naturalmente receptiva (valoriza laços, essenciais para integrar Dev e Ops) |
| Adhocrática | Inovação, equipes pequenas, risco calculado | Naturalmente receptiva (já está acostumada a experimentar) |
| Mercado | Resultados e concorrência, urgência | Pode se beneficiar muito, mas enfrenta barreiras: redirecionar o olhar de métricas só financeiras para valor contínuo ao cliente |
| Hierárquica | Processos padronizados, cadeia de comando, previsibilidade | Pode se beneficiar muito, mas enfrenta barreiras: desconstruir o comando rígido |

Entender o perfil cultural é o primeiro passo para escolher a estratégia de transformação.

#### Desafios da transformação

Resistência à mudança; curva de aprendizado das ferramentas; equilíbrio entre padronizar e permitir experimentar; segurança desde o início (DevSecOps); expectativas irrealistas (deploys em minutos nos primeiros meses, sem investir em treinamento); **métricas adequadas**; e visão de longo prazo da liderança.

Sobre métricas, o material contrasta indicadores de **valor real** (tempo de resposta a incidentes, frequência de lançamentos bem-sucedidos, satisfação do cliente) com indicadores **superficiais** (número de commits, horas de uptime).

#### Como iniciar a jornada (10 passos)

1. Mapear o que existe: processos, gargalos e metas.
2. Cultura primeiro: criar espaços de diálogo entre Dev, Ops, QA e demais áreas.
3. Projeto-piloto numa equipe pequena.
4. Automatizar o que é manual e gera erro (CI a cada commit, testes, aos poucos IaC).
5. Introduzir ferramentas gradualmente.
6. Coletar feedback e refinar.
7. Educação contínua.
8. Monitorar as métricas que importam.
9. Celebrar conquistas e documentar aprendizados.
10. Escalar o piloto quando estiver sólido, no ritmo de cada equipe.

#### Case Google (SRE) e DORA

O Google institucionalizou o **blameless post-mortem**: a pergunta nunca é "quem errou?", mas "por que o processo permitiu que o erro acontecesse?". Isso cria **segurança psicológica**: engenheiros não têm medo de experimentar, reportar erros e colaborar. Por fim, o material afirma que as pesquisas **DORA** mostram que as equipes de "elite" (mais velocidade e estabilidade) têm cultura **geradora e de alta confiança**: a cultura é o principal motor do desempenho técnico.

**Nuvem nesta etapa.** Cultura não tem ferramenta gerenciada equivalente, então **não há tabela AWS x Azure** aqui, e forçar uma seria enganoso. A conexão com a nuvem é indireta: o que dá segurança para errar são as práticas da Etapa 02 (IaC, rollback, observabilidade), que existem nos dois provedores.

### Exemplo comentado: do culpado ao processo

**Cenário (do material, expandido):** na sexta às 21h, o deploy da v2 quebrou o checkout por 2 horas.

Um relato **com culpa** soa assim:

> "O João subiu a v2 sem testar direito e derrubou o checkout."

Um relato **sem culpa** documenta fatos e causas sistêmicas. Crie a pasta da etapa e salve este modelo como `postmortem.md` dentro dela:

```sh
mkdir -p "$LAB/etapa-03" && cd "$LAB/etapa-03"
```

`postmortem.md`:

```markdown
# Post-mortem: v2 quebrou o checkout

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
- Criar alerta de erro acima de 1%. (dono: operações)
```

Repare que as ações apontam para as práticas da Etapa 02 (CI, canary, SLO). O post-mortem é onde a cultura vira melhoria técnica.

### Mão na massa

**Parte A: o que as métricas contam.** Gere de novo o repositório da Etapa 01 (`cd "$LAB/etapa-01" && bash gerar-historico.sh`) e compare uma métrica superficial com as de valor:

```sh
cd repo
git log --oneline | wc -l                                        # métrica superficial: número de commits
git log --format=%s | grep -c '^deploy'                          # deploys feitos
git log --format=%s | grep -c '^incidente'                       # incidentes
cd ..
```

Saída esperada: `11`, `4` e `1`. O "11 commits" não diz se o time está bem; "4 deploys em 5 dias, 1 incidente restaurado em 2 horas" diz muito mais. É a diferença entre indicador **superficial** e indicador de **valor**, como o material propõe.

**Parte B: diagnóstico cultural.** Em 5 minutos, responda por escrito sobre o seu time ou empresa atual (ou um que você conheça):

1. Quando algo quebra, a primeira pergunta é "quem?" ou "por quê?"
2. Qual dos quatro tipos (Clã, Adhocrática, Mercado, Hierárquica) mais se parece com a sua organização, e por quê?
3. Qual um passo dos 10 que você poderia dar sozinho esta semana?

### Exercícios

1. Reescreva sem culpa: "A Ana esqueceu de rodar os testes e o bug foi para produção."
2. Uma empresa de cultura hierárquica quer adotar DevOps. Que barreira o material prevê e que passo da jornada de 10 passos reduz o risco inicial?
3. Por que "horas de uptime" aparece como indicador superficial no material?

<details>
<summary>Gabarito</summary>

1. Exemplo: "O bug chegou à produção porque a execução de testes dependia de uma ação manual. Ação: tornar os testes um passo obrigatório do pipeline, que bloqueia o merge se falhar."
2. A barreira é o comando rígido e a necessidade de desconstruí-lo. O passo 3 (projeto-piloto em equipe pequena, ambiente controlado) reduz o risco, porque valida as práticas sem arriscar iniciativas críticas.
3. Porque disponibilidade isolada não diz se o time entrega valor com rapidez nem como se recupera de falhas; o material prefere indicadores como tempo de resposta a incidentes e frequência de lançamentos bem-sucedidos.

</details>

### Limpeza

```sh
cd "$LAB/etapa-01" && rm -rf repo
```

### Anota aí

A ferramenta só rende onde errar é seguro: sem culpa, o time aprende; com culpa, o time esconde.

---

## Etapa 04: Integração e automação

### O problema

Black Friday de novo. O time faz deploys mensais porque cada um exige uma maratona: provisionar servidor, copiar artefato, ajustar configuração, rodar testes, avisar todos. Uma falha de segurança é descoberta numa quinta e a correção só vai ao ar no mês seguinte. A automação ataca isso: não só acelera tarefas, mas garante entregas **consistentes, previsíveis e rastreáveis**, deixando a equipe livre para inovar. O material afirma que a frequência de deploys pode saltar de ciclos mensais para diários, ou até horários.

### O conceito

Automação de DevOps é mais que scripts: é um conjunto integrado de tecnologias e práticas que orquestram o ciclo de vida do software de ponta a ponta, com intervenção humana mínima. Cada contribuição de código dispara uma sequência (compilação, testes, análise de segurança, provisionamento), e o resultado é um ambiente consistente: o que foi testado em homologação roda em produção, o que reduz o "it works on my machine".

**Analogia da linha de montagem.** Cada estação faz uma verificação e passa o item adiante; se uma estação rejeita, a linha para antes que o defeito chegue ao cliente.

#### Os blocos da esteira (do material)

| Bloco | Ferramentas citadas |
|---|---|
| Provisionamento de infraestrutura | Terraform, Ansible (Pulumi também aparece no texto) |
| Construção de pipelines | Jenkins, GitLab CI/CD, GitHub Actions |
| Implantação contínua | Argo CD, Helm, Spinnaker |
| Monitoramento pós-deploy | Prometheus, Grafana, ELK |

Mais a segurança (**DevSecOps**, com scanners como Snyk e Aqua Security), o **ChatOps** (bots em Slack e Microsoft Teams que acionam rollbacks, geram relatórios de health check ou redistribuem tráfego com comandos num canal) e as **métricas de pipeline** (duração de build, taxa de falhas, tempo médio de recuperação).

#### O fluxo ponta a ponta, com AWS e Azure lado a lado

Os cinco passos do material, acrescidos do mapa dos provedores. As colunas AWS vêm do material apenas onde indicado.

| Passo | O que acontece | AWS `[Acréscimo do professor, salvo o citado no material]` | Azure `[Acréscimo do professor]` | Ponte agnóstica |
|---|---|---|---|---|
| 1. Provisionar | Ambiente descrito em arquivos e criado com um comando | CloudFormation (citado no material) | ARM/Bicep | Terraform, Pulumi |
| 2. Construir e validar | Compilação e testes a cada commit | CodeBuild, CodePipeline | Azure Pipelines | GitHub Actions, GitLab CI, Jenkins |
| 3. Implantar | Blue/green, canary ou rolling, com health check e rollback | CodeDeploy | Azure Pipelines e slots do App Service | Argo CD, Spinnaker, Helm |
| 4. Configurar e manter | Pacotes, variáveis e políticas sem deriva | Systems Manager (citado no material) | Azure Automation e Azure Arc | Ansible, Puppet, Chef |
| 5. Monitorar e alertar | Métricas, logs e traces; alertas por SLO | CloudWatch, X-Ray | Azure Monitor, Application Insights | Prometheus, Grafana, ELK |
| Transversal: imagens | Registro versionado | ECR | ACR | `registry:2`, Docker Hub |
| Transversal: segredos | Cofre de credenciais | Secrets Manager | Key Vault | Variáveis de ambiente do CI, Vault |
| Transversal: varredura de segurança | Análise de imagens e dependências | Amazon Inspector (para imagens no ECR, entre outros) | Microsoft Defender for Cloud | Snyk, Aqua (citados no material) |

**Onde diferem de verdade** (além do que já foi visto nas etapas anteriores): na AWS, a esteira é composta de serviços especializados que você encaixa; na Azure, o Azure DevOps entrega boa parte dela no mesmo produto. Nenhum dos dois é "melhor": a escolha depende de onde seu código, equipe e carga já estão. As ferramentas agnósticas da coluna da direita são justamente a ponte quando a empresa usa os dois.

#### Segredos: o ponto em que a esteira mais vaza

> **Acréscimo do professor:** o material cita a segurança integrada (DevSecOps), mas não detalha a gestão de segredos. Como todo pipeline precisa de senhas e chaves, este bloco entra aqui.

**Problema.** Alguém coloca a senha do banco no repositório "só para testar". Ela fica no histórico para sempre, e qualquer pessoa com acesso ao código a lê. **Regra:** segredo nunca vai para o Git; o pipeline o busca de um cofre em tempo de execução.

| Papel | AWS `[Acréscimo do professor]` | Azure `[Acréscimo do professor]` |
|---|---|---|
| Cofre de segredos | **Secrets Manager** | **Key Vault** |
| Chaves de criptografia e certificados | KMS (chaves) e ACM (certificados), serviços à parte | Também no Key Vault (que guarda segredos, chaves e certificados) |

**Onde diferem de verdade:** o Key Vault concentra segredos, chaves e certificados num só serviço, enquanto na AWS cada tipo costuma ter seu serviço. Em ambos, o acesso é controlado por permissões (na Azure, dependendo da configuração do cofre, via RBAC ou política de acesso: se o comando negar acesso, verifique a permissão).

CLI de referência (**não é necessário executar**):

```sh
# AWS
aws secretsmanager create-secret --name loja/db --secret-string '{"user":"app","pass":"troque-isto"}'
aws secretsmanager get-secret-value --secret-id loja/db --query SecretString --output text

# Azure
az keyvault create --name kv-loja-exemplo --resource-group rg-devops --location brazilsouth
az keyvault secret set --vault-name kv-loja-exemplo --name db-pass --value 'troque-isto'
az keyvault secret show --vault-name kv-loja-exemplo --name db-pass --query value --output tsv
```

(`kv-loja-exemplo` é fictício; o nome do cofre precisa ser único globalmente.)

#### Cases de automação (segundo o material)

- **Netflix:** pipeline de deploy quase autônomo, com **centenas de deploys diários** e recuperação automática que isola e substitui instâncias com falha.
- **Amazon:** automação que escala a infraestrutura diante de picos como o Prime Day, a partir de IaC e de monitoramento que dispara ações corretivas antes de degradações perceptíveis.
- **Etsy:** CI/CD integral, com **implantações canary** que detectam regressões sutis antes de atingir toda a base.
- **Red Hat:** Ansible para gerenciar e implantar componentes do OpenShift, com clusters criados por **playbooks** que definem dependências e políticas.

**Mercado e tendências:** AIOps e Engenharia de Plataforma. Case Amazon, "you build it, you run it": desenvolvedores não abrem tickets para provisionar ou implantar; consomem uma plataforma interna automatizada. Demanda por Engenheiros de Automação, de Plataforma e SREs, com Python ou Go, IaC com Terraform e arquitetura de pipelines.

### Exemplo comentado: uma esteira completa com rollback automático (local)

Montamos a esteira em quatro estágios: **segurança** (varredura de segredos), **build e teste** (o `ci.sh` da Etapa 02), **deploy** com health check e **rollback automático** se o health check falhar. O "ambiente de produção" é um link simbólico `current` que aponta para a release ativa: trocar o link é o análogo local de redirecionar o tráfego.

```sh
mkdir -p "$LAB/etapa-04" && cd "$LAB/etapa-04"
cp "$LAB/etapa-02/ci/calc.py" "$LAB/etapa-02/ci/test_calc.py" "$LAB/etapa-02/ci/ci.sh" .
```

(Se você pulou a Etapa 02, crie antes esses três arquivos com o conteúdo da seção 2.3.)

`esteira.sh`:

```sh
#!/usr/bin/env bash
set -u                                               # variável não definida é erro

escanear_segredos() {                                # estágio 1: DevSecOps simplificado
  # procura padrões de chave AWS (AKIA + 16 caracteres) e "password=" literal nos arquivos
  if grep -rnE 'AKIA[0-9A-Z]{16}|password\s*=' --include='*.py' --include='*.sh' --include='*.yml' \
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
  printf '%s\n' "$2" > "releases/$nova/status"       # a "aplicação" informa o próprio estado
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
echo "status: $(cat current/status)"
```

```sh
chmod +x ci.sh && rm -rf releases current dist
bash esteira.sh
```

Saída esperada:

```text
segurança: nenhum segredo encontrado
ci: passou
deploy: current -> releases/v1
health check: passou
deploy: current -> releases/v2
health check: FALHOU
rollback automático: current -> releases/v1
versão em produção: releases/v1
status: OK
```

O `2>&1` do estágio 2 importa: o `unittest` escreve no **stderr**, e sem ele as linhas `test_soma ... ok`, `Ran 1 test` e `OK` apareceriam entre a primeira e a segunda linha da saída.

Em produção real, os mesmos papéis são cumpridos por serviços como CodeDeploy (com reversão automática configurável), pelos slots do App Service (trocando de volta o slot) ou, em Kubernetes, por ferramentas como Argo CD e Helm (`helm rollback`).

### Mão na massa

1. **Provoque o estágio de segurança.** Acrescente ao fim do `calc.py` duas linhas: `SENHA = "x"` e, logo abaixo, o comentário `# password = 123`. Rode `bash esteira.sh`. **Observe:** o scanner imprime só `./calc.py:4:# password = 123`, a esteira para **antes** do deploy e a saída termina com a mensagem de segurança. Repare que `SENHA = "x"` **não** foi detectado, porque não casa com nenhum dos dois padrões do scanner. Essa é a lição do passo: um scanner por padrões só acha o que conhece, e por isso existem ferramentas dedicadas (como gitleaks e Snyk), com centenas de regras. Remova as duas linhas e a esteira volta a passar.
2. **Quebre o CI.** Altere o `5` do teste para `6` e rode `bash esteira.sh; echo "código de saída: $?"`. **Observe:** a saída para em `segurança: nenhum segredo encontrado`; a linha `ci: passou` **não** aparece, nenhum `deploy:` é executado e o código de saída é `1`. A falha do teste não aparece porque o estágio 2 cala a saída do `ci.sh`; rode `./ci.sh` direto para vê-la. Conserte e confirme que volta ao normal.
3. **Inverta o deploy.** Troque a chamada `deploy v2 QUEBRADO` por `deploy v2 OK` e rode (`rm -rf releases current` antes). **Observe:** a v2 passa no health check e `versão em produção: releases/v2`.
4. **Use um segredo de verdade, sem pôr no Git.** Exporte um valor no terminal e leia-o no script, em vez de escrevê-lo no arquivo: `export DB_PASS='troque-isto'` e `python3 -c "import os; print('lido:', bool(os.environ['DB_PASS']))"` deve imprimir `lido: True`. É o mesmo princípio dos segredos do CI e dos cofres (Secrets Manager, Key Vault), que injetam o valor em tempo de execução. Depois, `unset DB_PASS`.

### Exercícios

1. Em qual dos cinco passos do fluxo entra cada item: (a) `terraform apply`, (b) Prometheus, (c) `helm rollback`, (d) Ansible, (e) `docker push`?
2. Por que o `deploy` do laboratório guarda a `anterior` **antes** de trocar o link?
3. Dê o equivalente na Azure de: CloudFormation, CodeBuild, Systems Manager, ECR, Secrets Manager, CloudWatch.
4. Qual o risco de um segredo commitado e depois "apagado" no commit seguinte?

<details>
<summary>Gabarito</summary>

1. (a) passo 1; (b) passo 5; (c) passo 3; (d) passo 4 (configuração; o material também o cita no passo 1, como provisionamento); (e) o `docker push` encerra o passo 2 (artefato pronto), alimentando o passo 3.
2. Porque depois da troca a informação da release anterior se perde; sem ela o rollback automático não saberia para onde voltar.
3. ARM/Bicep; Azure Pipelines; Azure Automation e Azure Arc (equivalência aproximada); ACR; Key Vault; Azure Monitor.
4. O segredo continua no histórico do Git e pode ser recuperado. O correto é considerá-lo comprometido, **revogá-lo e gerar outro**, além de removê-lo do código.

</details>

### Limpeza

```sh
rm -rf releases current dist __pycache__
```

### Anota aí

Automação boa é uma esteira que barra o que está errado, entrega o que está certo e desfaz sozinha o que escapou.

---

## Checklist de autoavaliação

Marque só o que você consegue fazer **sem consultar o guia**.

**Fundamentos (Etapa 01)**

- [ ] Explico o conflito entre Dev e Ops com um exemplo real.
- [ ] Descrevo as quatro fases do ciclo de vida e por que ele é contínuo.
- [ ] Conto a história de 2009 (Flickr e DevOpsDays) e o case Etsy.
- [ ] Calculo frequência de deploy, lead time, taxa de falha e tempo de restauração a partir de um histórico.

**Práticas e ferramentas (Etapa 02)**

- [ ] Explico o que é IaC e sei rodar `init`, `plan`, `apply` e `destroy` no Terraform.
- [ ] Comparo CloudFormation, ARM/Bicep e Terraform, incluindo onde mora o estado.
- [ ] Demonstro idempotência com Ansible (`changed=1` e depois `changed=0`).
- [ ] Escrevo um pipeline de CI que chama um script local e o traduzo para GitHub Actions, Azure Pipelines e CodeBuild.
- [ ] Distingo Continuous Delivery de Continuous Deployment.
- [ ] Faço blue-green e canary com nginx e explico quando usar cada um.
- [ ] Publico uma imagem versionada num registro e mapeio os comandos para ECR e ACR.
- [ ] Calculo SLIs, comparo com SLOs e escrevo uma regra de alerta no Prometheus.
- [ ] Mapeio CloudWatch e Azure Monitor, e digo por que Prometheus + Grafana serve de ponte.

**Cultura (Etapa 03)**

- [ ] Reescrevo um relato de incidente com culpa em um post-mortem sem culpa.
- [ ] Descrevo os quatro tipos de cultura e a receptividade de cada um ao DevOps.
- [ ] Cito os dez passos da jornada e escolho o primeiro para uma equipe real.
- [ ] Diferencio indicador superficial de indicador de valor, com exemplos.

**Integração e automação (Etapa 04)**

- [ ] Descrevo os cinco passos do fluxo ponta a ponta e a ferramenta de cada um em AWS, Azure e agnóstica.
- [ ] Explico por que segredos não vão para o Git e como Secrets Manager e Key Vault resolvem isso.
- [ ] Monto uma esteira local com varredura, CI, deploy, health check e rollback automático.
- [ ] Explico o que são DevSecOps, ChatOps, Platform Engineering e AIOps em uma frase cada.

---

## Notas do professor

Correções e esclarecimentos feitos em relação ao material bruto, mais as limitações assumidas:

1. **CD não é só "delivery e deployment" misturados.** O bruto trata Continuous Delivery e Deployment quase como sinônimos. Esclareci a diferença na Etapa 02 (aprovação manual do último passo versus implantação totalmente automática).
2. **Spinnaker é plataforma de entrega (CD), não de CI.** O bruto (Etapa 02) o apresenta como "pipeline de CI/CD robusto"; ele cuida de implantação e estratégias de release, e aparece na Etapa 04 corretamente sob "Implantação contínua".
3. **Helm e Argo CD não "coordenam" canary por si só.** O bruto (Etapa 04) diz que blue/green, canary e rolling updates são "coordenados por Spinnaker, Argo CD ou Helm". Helm é um gerenciador de pacotes para Kubernetes (instala e faz rollback de releases), e Argo CD aplica o estado do Git no cluster; estratégias progressivas de verdade costumam exigir ferramentas dedicadas (como o Spinnaker, ou o Argo Rollouts, do ecossistema do Argo). Mantive os nomes do bruto na tabela de blocos e deixei esta ressalva.
4. **Ansible aparece em duas categorias.** Na tabela da Etapa 04, o Ansible está em "Provisionamento de infraestrutura" ao lado do Terraform; no texto da Etapa 02, está em "gerenciamento de configuração" (provisionamento de software dentro das máquinas). Tratei-o como gerenciamento de configuração (que é seu papel principal), e anotei que o bruto também o cita no passo de provisionamento.
5. **Google Deployment Manager.** O bruto o lista como serviço nativo de IaC. Segundo meu conhecimento, o Google anunciou a descontinuação desse serviço em favor de outro; **confirme o status atual na documentação do Google** antes de escolher essa ferramenta. Não aprofundei por estar fora do escopo AWS e Azure.
6. **"Escala em frações de segundo" (Amazon, Etapa 04).** É linguagem de marketing; não trate como garantia técnica de latência de provisionamento. Não acrescentei números.
7. **O bruto não define as métricas DORA.** Ele cita o framework e métricas como frequência de deploys, tempo de recuperação e taxa de falhas, mas não as lista como as quatro métricas padronizadas. A lista na Etapa 01 é explicação do professor, baseada no que o framework consagrou.
8. **Segredos, Azure e containers como acréscimos.** A gestão de segredos (Secrets Manager e Key Vault), o mapa de registros (ECR e ACR), de monitoramento (CloudWatch, Azure Monitor e correlatos) e todo o conteúdo Azure são **acréscimos do professor**. O bruto cita apenas AWS CloudFormation, AWS Systems Manager e o Prime Day da Amazon. Nenhum dado de mercado, número ou preço foi acrescentado: as quantidades (duas vezes por semana, dezenas e centenas de deploys, 1% e 200 ms) vêm do bruto.
9. **Equivalências aproximadas.** Systems Manager x Azure Automation e Arc, e Secrets Manager x Key Vault (que também guarda chaves e certificados) **não são um para um**. Deixei isso explícito nas tabelas.
10. **Comandos de nuvem não foram executados na produção deste guia.** Os comandos `aws` e `az` são de referência e usam nomes fictícios; antes de usá-los, confira os parâmetros com `--help` na versão do seu CLI. Os laboratórios locais (git, Terraform com provedor `local`, Ansible, nginx, registro local, scripts de SLO e esteira) foram desenhados para resultado determinístico, e as saídas mostradas foram conferidas executando os laboratórios (Python 3.12, Terraform 1.16, Ansible core 2.21 e cfn-lint 1.57 num ambiente virtual, Docker com nginx, registro local e `promtool`); só os comandos `az bicep`, que exigem o Azure CLI, não foram executados; textos longos de ferramentas (Terraform, Ansible, Docker) aparecem em trechos e podem variar levemente conforme a versão.
