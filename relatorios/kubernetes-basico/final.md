# Kubernetes Básico — do zero ao autoscaling, com a mão no volante

> Versão do piloto — reescrita do relatório didático (`01-professor.md`), baseado nas aulas 1-8 (Thiago Adriano / FIAP). Todo o conteúdo técnico foi preservado; o que muda é a lente: aqui, cada conceito de Kubernetes é lido como eu leio a telemetria do carro.

> Versão do comentarista — mesma corrida, agora com a transmissão ao vivo por cima: abertura de GP, narração entre setores e bandeirada final. Nenhuma linha técnica foi tocada — quem manda no carro continua sendo o piloto; a cabine só narra.

*Boa tarde, Brasil! Boa tarde, paddock! Estamos AO VIVO num dia e tanto: hoje, 5 de julho, Charles Leclerc venceu o GP da Inglaterra em Silverstone por míseros 0s427 — e teve brasileiro nos pontos, Gabriel Bortoleto em oitavo! Mas a corrida que nos interessa vale campeonato: o GP do Kubernetes Básico. Oito etapas, da largada (por que esse esporte existe) à reta final do autoscaling, onde o cluster passa a pilotar sozinho. Em jogo: sair daqui sabendo montar, operar, curar e escalar um cluster de verdade. O farol vai apagar — e quem assume o volante da narrativa é o piloto. Com vocês.*

Eu passo o domingo inteiro com um engenheiro na minha orelha ditando estado desejado: "target +0.3", "modo de energia 7", "box esta volta". Eu não controlo cada milissegundo do carro — eu declaro a intenção e um sistema inteiro de gente, sensores e processos mantém a realidade alinhada com o plano. Quando descobri que o Kubernetes funciona **exatamente assim**, o resto foi só mapear o paddock.

**O que você vai saber fazer ao final deste guia:** montar um laboratório Kubernetes na sua máquina, criar e inspecionar Pods, expô-los com Services, configurá-los com ConfigMaps, garantir réplicas e atualizações sem downtime com Deployments, persistir dados com PVCs, declarar verificações de saúde com probes e, por fim, deixar o cluster escalar sozinho com o HPA. Cada etapa depende apenas do que veio antes — e cada uma termina com um exercício mínimo que prova que você entendeu. Não pule os blocos "mão na massa": Kubernetes não se aprende lendo, se aprende quebrando e consertando. Na pista é igual — ninguém aprende o limite do carro sem passar dele pelo menos uma vez.

**Como usar este guia:** reserve um terminal aberto do lado do texto. Todos os comandos foram pensados para rodar no Minikube (que você instala na Etapa 01). Quando um exemplo mostra a saída esperada, compare com a sua — divergência é oportunidade de debug, não fracasso. É a mesma disciplina do treino livre: a volta que sai diferente do simulador é a volta que mais ensina.

---

## O quadro de-para — cole isto no volante

A mesma analogia vale do início ao fim do documento. Se Pod é carro na Etapa 03, Pod segue sendo carro na Etapa 08.

**Não tente decorar esta tabela agora.** Ela é o mapa do circuito, não a prova: siga direto para a Etapa 01 e volte aqui como referência sempre que uma analogia aparecer no texto.

| Kubernetes | Fórmula 1 |
|---|---|
| Container | O carro + kit da equipe: isolado na sua garagem, compartilhando a infraestrutura do circuito |
| Imagem de container | A especificação de montagem do carro — replicável em qualquer circuito do calendário |
| Máquina virtual (VM) | Levar a fábrica inteira da equipe para cada GP |
| Kubernetes (orquestrador) | A operação completa de mureta + garagem |
| Estado desejado | O target passado no rádio: você declara o alvo, o sistema mantém |
| Cluster | A equipe montada no fim de semana de GP |
| Control plane (master node) | A mureta (pit wall) |
| Worker node | A garagem/box onde os carros são montados e operados |
| API Server | O engenheiro de corrida — todo rádio passa por ele, sem exceção |
| kubectl | O botão de rádio do piloto |
| kubeconfig | O paddock pass + a frequência de rádio da equipe |
| etcd | O sistema central de dados da equipe (setup sheets + estado de tudo) |
| kubelet | O chefe de mecânicos de cada garagem |
| kube-proxy | O sinaleiro do pit lane, direcionando cada carro ao box certo |
| Minikube | O simulador da fábrica |
| Pod | O carro (chassi montado e rodando) |
| IP do Pod | A posição do carro na pista — muda o tempo todo |
| Labels | As etiquetas de rastreamento FIA nas peças e no carro (servem para selecionar) |
| Annotations | As anotações do engenheiro no caderno de debrief (servem para humanos) |
| Manifesto YAML | A folha de especificação do carro, versionada |
| Imperativo vs. declarativo | Ordem direta no rádio ("box, box") vs. plano de corrida escrito antes do GP |
| Service | O pit box: posição fixa no pit lane, atende qualquer carro com a etiqueta da equipe |
| ClusterIP | Canal interno de rádio — só a equipe ouve |
| NodePort | Portão de serviço numerado do autódromo |
| LoadBalancer | A entrada oficial do autódromo, com bilheteria |
| ConfigMap | A folha de set-up — separada do chassi |
| Secret | Os mapas de motor confidenciais |
| ReplicaSet | A regra do chefe de equipe: "N carros prontos, sempre" (e a virada de madrugada dos mecânicos) |
| Deployment | O programa de desenvolvimento: pacotes de upgrade, spec por spec |
| Rolling update | Introduzir o upgrade em um carro de cada vez |
| Rollback | Voltar para a spec anterior (o assoalho antigo que funcionava) |
| emptyDir | O quadro branco da garagem — apagado quando o fim de semana acaba |
| hostPath | Guardar dados no caixote de frete daquele circuito |
| PVC | A requisição de armazenamento do engenheiro de dados |
| PV | O storage físico da fábrica que atende a requisição |
| StorageClass | O catálogo de tipos de storage (trackside rápido vs. datacenter da fábrica) |
| Probes | As checagens de telemetria + radio check |
| Liveness probe | Telemetria mudou → reset completo do carro |
| Readiness probe | O semáforo do box: segura o carro fora da pista, sem desmontar nada |
| Startup probe | O procedimento de fire-up da PU: nada é cobrado antes do motor aquecer |
| HPA | A mureta de estratégia alinhando mais carros conforme a carga (uma F1 sem o limite de 2 carros) |
| metrics-server | Os sensores de telemetria — sem eles a mureta não enxerga nada |
| resources.requests | A alocação declarada de energia/combustível — a base de qualquer percentual |

Onde a analogia quebra, eu aviso no texto — piloto que esconde limitação do carro quebra no muro.

---

## Etapa 01 — Por que o Kubernetes existe (motivação + setup do laboratório)

*APAGARAM-SE AS LUZES! É largada no GP do Kubernetes! Primeira curva, primeira freada, e a pergunta que abre todo campeonato: por que esse esporte existe? Repare no pelotão — a resposta desta etapa sustenta as outras sete. Segura comigo.*

### O problema

Pense na demanda de um fim de semana de GP: o site de uma equipe, a plataforma de timing, o streaming — tudo dorme durante a semana e explode no domingo da corrida. É o mesmo drama de um e-commerce na Black Friday: comprar servidor para o pico é desperdício em 11 meses; dimensionar para o dia a dia derruba o site no pico. Você precisa de uma infraestrutura que **cresça e encolha sob demanda** — como uma equipe que opera com esqueleto mínimo na fábrica em janeiro e com todo mundo ligado nos monitores no domingo de Silverstone.

E tem um segundo problema, mais silencioso, que eu conheço bem: o carro que voa no simulador e não anda na pista. Qualquer diferença entre a sua máquina, a do QA e a produção vira o clássico *"na minha máquina funciona"* — a versão dev do *"no simulador o carro estava perfeito"*. Manter vários ambientes idênticos (dev, testes, produção) na mão é uma fonte infinita de bugs, como seria correr cada GP com um carro montado de memória.

Todo projeto de software esbarra nesses dois problemas — e o Kubernetes automatiza a solução de ambos.

### O conceito

A peça comum das duas soluções é o **container**.

**Analogia de paddock:** uma máquina virtual é como levar a **fábrica inteira** para cada GP — prensa de fibra de carbono, túnel de vento, escritório, tudo embarcado no avião. Um container é o **carro com o kit da equipe**: cada equipe tem sua garagem isolada, seus segredos, suas peças — mas a estrutura do circuito (o prédio dos boxes, a energia, o pit lane, ou seja, o *kernel* do sistema operacional) é compartilhada entre as dez equipes. Resultado: muito mais equipes operando no mesmo autódromo, e mudança de etapa muito mais rápida. A Cadillac, estreando neste ano, não construiu um autódromo para correr — chegou com seus caixotes e plugou na infraestrutura existente.

Em termos técnicos: a VM carrega um sistema operacional completo (gigabytes, minutos para subir); o container compartilha o kernel do SO hospedeiro e leva só os arquivos, binários e bibliotecas que o app precisa (megabytes, segundos). Uma **imagem de container** é um ambiente inteiro, replicável em qualquer lugar — a especificação de montagem que garante que o carro embarcado para Suzuka é idêntico ao que rodou em Melbourne. Adeus "na minha máquina funciona".

Só que containers resolvem o problema do ambiente e criam outro: com dezenas ou centenas deles, alguém precisa criá-los, destruí-los, vigiar a saúde e recriar o que falhar. Fazer isso na mão não escala — é como pedir para uma pessoa só operar os dois carros, a telemetria e o pit stop. O **Kubernetes (K8s)** é o **orquestrador** que assume essas tarefas: a operação completa de mureta + garagem.

A filosofia dele é o que eu vivo em cada stint: o Kubernetes funciona como o **engenheiro de corrida ditando target**. Ele não me manda instrução a cada curva — ele declara "target +0.3 por volta, modo de energia 6" e todo o sistema (eu, o carro, a estratégia) trabalha sozinho para manter. No K8s você declara o **estado desejado** ("quero 3 cópias disso rodando") e ele mantém a realidade de acordo — inclusive de madrugada, quando um container morre. A mureta nunca dorme.

**Conceitos-chave desta etapa:**

- **Container ≠ VM** — VM = hardware virtual + SO completo (a fábrica embarcada). Container = só o necessário do app, compartilhando o kernel do hospedeiro (o carro na garagem do circuito). Muito mais leve.
- **Escala horizontal** — mais cópias da aplicação dividindo a carga (é o que o K8s automatiza). Vertical = mais CPU/RAM na mesma máquina — é a diferença entre alinhar mais carros e colocar um motor maior num carro só.
- **Cluster e Pod** — o K8s organiza máquinas (nós) em clusters. Os containers rodam agrupados em **Pods** — a menor unidade gerenciada (detalhes na Etapa 03). Adiantando o mapa: cluster = a equipe no fim de semana; Pod = o carro.
- **kubectl** — a ferramenta de linha de comando que conversa com a API REST do cluster. É o seu botão de rádio (detalhes na Etapa 02).
- **Minikube** — um cluster K8s de 1 nó rodando na sua máquina. É o **simulador da fábrica**: feito para estudo, sem risco de bater o carro de verdade — e é o laboratório deste guia inteiro.
- **Estado desejado** — a filosofia do K8s: você declara o que quer, ele faz acontecer e mantém. Caiu? Ele recria sozinho. O target no rádio.

### Exemplo comentado — montando o laboratório

```sh
# 1. Instale o Docker Desktop (docker.com) — no Linux, use o Docker
#    Engine (docs.docker.com/engine/install) — e confirme:
$ docker -v
Docker version 27.x

# 2. Instale o kubectl (kubernetes.io/docs/tasks/tools) e confirme:
$ kubectl version --output=yaml

# 3. Instale o Minikube (minikube.sigs.k8s.io/docs/start) e suba o cluster:
$ minikube start
😄  minikube v1.33 on Windows 11
✨  Using the docker driver
🏄  Done! kubectl is now configured to use "minikube"

# 4. Confirme que o cluster está de pé:
$ kubectl get nodes
NAME       STATUS   ROLES           AGE   VERSION
minikube   Ready    control-plane   1m    v1.30.x

# 5. Cluster vazio = sucesso:
$ kubectl get pods
No resources found in default namespace.
```

Nota: a primeira execução do `minikube start` baixa a imagem do cluster e demora alguns minutos. É normal — é o fire-up do simulador, e simulador frio nunca liga instantâneo.

**Cola de comandos:**

- `minikube start` — sobe o cluster local de 1 nó
- `minikube stop` — para o cluster sem apagar nada
- `kubectl get nodes` — lista os nós e o status
- `kubectl get pods` — lista os pods do namespace atual

**Dica:** se o `minikube start` falhar, a causa mais comum é o Docker Desktop não estar aberto (no Linux, o serviço parado: `sudo systemctl start docker`). Suba o Docker primeiro e tente de novo. (Todo simulador tem um disjuntor que alguém esqueceu de ligar.)

### Mão na massa

O menor exercício possível: prove que seu laboratório está vivo — o equivalente ao installation lap.

1. Rode `minikube start` e aguarde o "Done!".
2. Rode `kubectl get nodes` — **observe**: o nó `minikube` com `STATUS Ready`. Se aparecer `NotReady`, aguarde 1 minuto e repita.
3. Rode `kubectl get pods` — **observe**: `No resources found`. Cluster vazio e pronto é exatamente o ponto de partida da próxima etapa — garagem limpa antes do carro chegar.
4. Bônus: rode `minikube stop` e depois `kubectl get nodes` — veja a mensagem de erro de conexão. Suba de novo com `minikube start`. Agora você sabe o que "cluster fora do ar" parece no terminal — é o rádio mudo, e rádio mudo em corrida é a pior sensação que existe.

### Anota aí

> Container é um ambiente leve e replicável — o carro que anda igual em qualquer circuito; Kubernetes é o engenheiro de corrida do estado desejado — você declara o target, ele garante.

*Setor 1 no verde! Laboratório de pé, simulador ligado, cluster respondendo — largada limpíssima. Agora vem a parte que todo estreante subestima: aprender a falar no rádio. Etapa 02 na sequência — não sai daí.*

---

## Etapa 02 — kubectl e a API: como você comanda o cluster

*Segunda etapa e o traçado aperta: de que adianta ter o carro na garagem se você não sabe apertar o botão do rádio? A F1 vive desse canal — foi nele que Kimi Räikkönen imortalizou o "deixa comigo, eu sei o que estou fazendo" em Abu Dhabi 2012, e venceu. Hoje é você quem aprende a dar as ordens.*

### O problema

Seu cluster está de pé (Etapa 01), mas ele é uma caixa fechada. Como você manda ordens para ele? Como cria, consulta e destrói coisas lá dentro? E quando algo der errado (vai dar), como você investiga sem acesso "físico" ao container? Na pista eu tenho o mesmo problema: estou a 300 km/h, não posso descer e abrir o capô — tudo que eu sei do carro chega pelo rádio e pela telemetria.

### O conceito

**Tudo** no Kubernetes passa pela API REST do nó master. O `kubectl` é o cliente dessa API: cada comando que você digita vira uma requisição HTTP (GET, POST, PUT, DELETE) contra o cluster.

**Analogia de rádio:** na F1, o piloto não fala com o mecânico do pneu dianteiro esquerdo, não fala com o cara do macaco, não fala com a fábrica. O piloto fala com **uma pessoa**: o engenheiro de corrida. Toda mensagem — pedido de mudança de mapa, reclamação de vibração, "box esta volta" — passa por esse canal único, que valida, registra e repassa para quem executa. O `kubectl` é o seu **botão de rádio**; o **API Server é o engenheiro de corrida**: nada acontece no cluster sem passar por ele. Ninguém mexe na panela — perdão, no carro — diretamente.

O caminho de um comando: você digita `kubectl get pods` → o kubectl lê o arquivo **kubeconfig** (que guarda o endereço do API Server, as credenciais e o contexto do cluster atual — o Minikube configura isso sozinho; pense nele como o seu paddock pass com a frequência de rádio da equipe já sintonizada) → e dispara um `GET /api/v1/pods` contra o API Server. A resposta volta formatada no seu terminal.

A API é dividida em grupos: o grupo "core" tem os recursos fundamentais (pods, services, replicasets); outros grupos cuidam de segurança, armazenamento, autoscaling — como os departamentos da equipe: chassi, aero, PU, estratégia. Como é REST puro, dá para chamar de qualquer linguagem — Python, Go, Java, C# — o que abre portas para automação.

Existem **dois jeitos de trabalhar**:

- **Imperativo** — `kubectl run nginx --image=nginx` — você dá a ordem direta. É o "box, box, box" no rádio: rápido, decisivo, bom para testes.
- **Declarativo** — escrever um YAML e rodar `kubectl apply -f arquivo.yaml` — você descreve o estado desejado (o target de novo). É o plano de corrida escrito no sábado à noite: documentado, revisado, versionado.

Em projetos reais o declarativo domina, porque o arquivo é versionável no Git — nenhuma equipe séria improvisa a estratégia inteira no rádio; o plano existe por escrito antes da luz apagar. Neste guia começamos imperativo (mais rápido para aprender) e migramos para o declarativo na Etapa 03.

**Os verbos que resolvem 90% do dia:**

- **get** — consultar: lista recursos e o status de cada um. `kubectl get pods`, `get svc`, `get nodes`... É a olhada no painel de timing.
- **create / run / apply** — criar: `run` cria um pod imperativo; `apply -f` aplica um YAML (declarativo).
- **delete** — remover: `kubectl delete pod nginx`. Cuidado — pode afetar quem depende do recurso.
- **describe** — detalhar: mostra configuração + a seção **Events**. É a primeira parada quando algo trava — o histórico de telemetria da sessão, evento por evento.
- **logs** — ver o que o container está imprimindo. Seu melhor amigo no debug: é ouvir o rádio do carro direto.
- **exec** — abrir um shell dentro do container: `kubectl exec -it <pod> -- /bin/sh`. O mecânico plugando o laptop no carro.

### Exemplo comentado — ciclo de vida de um Pod

```sh
# Cria um pod chamado "nginx" a partir da imagem nginx:1.14.2 do Docker Hub
$ kubectl run nginx --image=nginx:1.14.2 --port=80
pod/nginx created

# Acompanhe até o status ficar Running (o primeiro estado é ContainerCreating)
$ kubectl get pods
NAME    READY   STATUS    RESTARTS   AGE
nginx   1/1     Running   0          30s

# Detalhes + eventos (veja a linha "Pulling image" na seção Events)
$ kubectl describe pod nginx

# O que o container está imprimindo
$ kubectl logs nginx

# Limpeza
$ kubectl delete pod nginx
pod "nginx" deleted
```

Nota: se o status ficar em `ImagePullBackOff`, o cluster não conseguiu baixar a imagem — confira o nome/tag e sua internet. É o caixote de peças que não chegou no circuito: sem a spec certa, o carro não monta.

**Cola de comandos:**

- `kubectl run nginx --image=nginx:1.14.2 --port=80` — cria um pod imperativo
- `kubectl describe pod <nome>` — detalhes + Events (troubleshooting)
- `kubectl logs <nome>` — saída do container
- `kubectl exec -it <nome> -- /bin/sh` — shell dentro do container
- `kubectl delete pod <nome>` — remove o pod

### Mão na massa

Execute o ciclo completo e force o primeiro erro da sua vida no K8s — todo piloto precisa da primeira rodada para calibrar o limite:

1. Rode a sequência do exemplo acima (`run` → `get` → `describe` → `logs` → `delete`). **Observe** no `describe` a seção `Events`: as linhas `Pulling image`, `Created container`, `Started container` contam a história do pod em ordem — igual ao replay da telemetria, quadro a quadro.
2. Agora crie um pod quebrado de propósito: `kubectl run quebrado --image=nginx:versao-que-nao-existe`.
3. Rode `kubectl get pods` — **observe** o status `ImagePullBackOff` (ou `ErrImagePull`).
4. Rode `kubectl describe pod quebrado` — **observe** nos Events a mensagem explicando que a imagem não foi encontrada. Você acabou de praticar o fluxo de debug de verdade.
5. Limpe: `kubectl delete pod quebrado`.

**Dica (grave este fluxo):** `get pods` (qual o status?) → `describe pod` (o que dizem os Events?) → `logs` (o que o app diz?). Essa sequência resolve a maioria dos problemas. É o meu protocolo pós-problema: painel de timing → histórico de telemetria → rádio do carro.

### Anota aí

> Tudo no K8s é uma chamada à API REST; o kubectl é o seu botão de rádio e o API Server é o engenheiro de corrida — e quando algo trava, o caminho é sempre get → describe → logs.

*Rádio calibrado e — repararam? — o primeiro erro forçado e diagnosticado sem pânico. Esse setor separa quem aperta botão de quem conversa com a equipe. E atenção, porque agora vem o miolo técnico do circuito: a anatomia do cluster e a folha de especificação. Não pisca.*

---

## Etapa 03 — A anatomia do cluster e a menor unidade dele: o Pod

*Entramos no complexo de curvas mais técnico do traçado — aqui não adianta coragem, é precisão. E a história do esporte não perdoa spec fora do lugar: em 1999 a Ferrari quase perdeu uma vitória na Malásia por milímetros nas barge boards. Especificação não é burocracia, é resultado. Hoje você escreve a sua primeira folha de especificação.*

### O problema

Na Etapa 02 você criou um pod com um comando imperativo. Funciona, mas tem dois furos: (1) você não sabe **o que** exatamente foi criado nem **onde** dentro do cluster; (2) se amanhã precisar recriar aquele pod idêntico em outro ambiente, vai depender da memória. Nenhuma equipe monta um carro de memória — existe folha de especificação para tudo, do ângulo da asa ao torque de cada parafuso. Precisamos entender as peças do cluster e passar a descrever tudo em arquivos versionáveis.

### O conceito

Um **cluster** é um grupo de máquinas (**nodes**) trabalhando juntas, com papéis bem definidos — é a equipe montada no fim de semana de GP:

- **Master node** — a **mureta**: gerencia o cluster e decide onde executar os Pods (quem para de fazer o quê, e quando).
- **Worker node** — as **garagens**: executam os Pods e demais recursos. É onde o carro é montado e roda.
- **etcd** — o **sistema central de dados da equipe**: banco de dados distribuído com a configuração e o estado do cluster — as setup sheets, o histórico, o estado de cada peça.
- **kubelet** — o **chefe de mecânicos** de cada garagem: agente em cada node que gerencia os Pods locais.
- **kube-proxy** — o **sinaleiro do pit lane**: encaminha o tráfego de rede para os Pods certos, como quem direciona cada carro ao box correto no meio do trânsito do pit lane.
- **API Server** — o **engenheiro de corrida** — tudo que o kubectl faz passa por aqui (você já conheceu na Etapa 02).

O **Pod** é a menor unidade que o Kubernetes gerencia — no nosso mapa, o Pod é **o carro**: um "envelope" com um ou mais containers que dividem rede e armazenamento (o carro carrega chassi, PU e ERS integrados, compartilhando os mesmos sistemas). Quatro fatos sobre Pods:

1. Um Pod representa um processo em execução e pode ter mais de um container dividindo o mesmo IP e volumes — como PU e MGU-K no mesmo carro: unidades distintas, telemetria e combustível compartilhados.
2. **Pods são efêmeros** — nascem e morrem o tempo todo. Nunca conte com um Pod específico existir amanhã. O carro que correu em Silverstone hoje será desmontado até o último parafuso antes de Spa; o que permanece é a especificação. (Guarde esta frase: ela é a raiz das Etapas 04, 05 e 06.)
3. Cada Pod ganha um IP interno do cluster — pense na posição do carro na pista: existe, é real, mas muda o tempo todo.
4. Pods são descritos em YAML — a folha de especificação do carro.

Para organizar dezenas de Pods existem os rótulos e as anotações. **Analogia de rastreamento:** na F1, cada componente do carro — PU, turbo, MGU-K, câmbio — carrega uma **etiqueta de rastreamento lacrada pela FIA**. É por essa etiqueta que o sistema sabe qual motor está em qual carro e quantos cada piloto já usou; a etiqueta serve para **identificar e selecionar**. Já o **caderno de debrief do engenheiro** ("piloto reportou vibração na curva 7, verificar amanhã") é informação para humanos — ninguém filtra componentes por anotação de caderno.

- **Labels** — pares chave-valor usados para IDENTIFICAR E SELECIONAR objetos. É por label que um Service acha seus Pods (você verá isso acontecer na Etapa 04) — como o pit box reconhece que o carro que está entrando é da equipe dele.
- **Annotations** — metadados livres (autor, documentação, auditoria) que NÃO participam de seleção. O caderno de debrief.

Essa diferença é o que cai em prova.

### Exemplo comentado — o primeiro YAML (decore este esqueleto)

```yaml
apiVersion: v1                # versão da API do K8s p/ este objeto
kind: Pod                     # o TIPO de objeto criado
metadata:                     # dados SOBRE o objeto
  name: meu-pod
  labels:                     # rótulos: chave-valor p/ SELECIONAR
    app: myapp
    ambiente: estudo
  annotations:                # anotações: metadados livres (docs)
    autor: "Davi Gomes"
spec:                         # a ESPECIFICAÇÃO: o que roda dentro
  containers:
    - name: meu-container
      image: nginx:1.14.2
      ports:
        - containerPort: 80
```

Nota: **todo** objeto K8s segue esse esqueleto: `apiVersion` + `kind` + `metadata` + `spec`. Muda o `kind` e o conteúdo do `spec` — o resto é sempre igual. Quem domina esse esqueleto lê qualquer manifesto — é como o regulamento técnico: quem entende a estrutura de um artigo lê todos os outros.

```sh
# Aplica o YAML (declarativo)
$ kubectl apply -f meu-pod.yaml
pod/meu-pod created

# Lista mostrando os labels
$ kubectl get pods --show-labels
NAME      READY   STATUS    LABELS
meu-pod   1/1     Running   ambiente=estudo,app=myapp

# Filtra por label — o mecanismo central do K8s
$ kubectl get pods -l app=myapp
NAME      READY   STATUS    RESTARTS   AGE
meu-pod   1/1     Running   0          1m

# Adiciona label num pod que já existe
$ kubectl label pod meu-pod time=devops
```

Nota: esse filtro `-l` parece bobo agora, mas Services, ReplicaSets e Deployments encontram "seus" Pods **exatamente assim**: por label selector. É o fio que costura as próximas etapas — do mesmo jeito que a etiqueta FIA costura o carro ao box, à alocação de motores e ao resultado na súmula.

**Cola de comandos:**

- `kubectl apply -f arquivo.yaml` — cria/atualiza pelo YAML
- `kubectl get pods --show-labels` — lista exibindo rótulos
- `kubectl get pods -l app=myapp` — filtra por rótulo
- `kubectl delete -f arquivo.yaml` — remove o que o arquivo criou

### Mão na massa

1. Salve o YAML acima como `meu-pod.yaml` e aplique com `kubectl apply -f meu-pod.yaml`.
2. Rode `kubectl get pods --show-labels` — **observe** os dois labels na última coluna.
3. Rode `kubectl get pods -l app=myapp` e depois `kubectl get pods -l app=outra-coisa` — **observe**: o primeiro encontra o pod, o segundo retorna vazio. Esse é o mecanismo de seleção em ação — etiqueta certa, carro encontrado; etiqueta errada, garagem vazia.
4. Adicione um label em tempo real: `kubectl label pod meu-pod time=devops` e confirme com `--show-labels`.
5. **Não delete o pod** — ele será o alvo do Service na próxima etapa. (Se deletou, é só aplicar o YAML de novo — essa é a graça do declarativo: a folha de especificação remonta o carro idêntico.)

**Dica:** Labels = seleção operacional (o K8s usa). Annotations = documentação (humanos usam). Autor de um Pod? Annotation. Agrupar Pods de uma app? Label. Etiqueta FIA vs. caderno de debrief.

### Anota aí

> Todo objeto K8s é apiVersion + kind + metadata + spec — a folha de especificação do carro; e labels são a etiqueta FIA pela qual tudo no cluster encontra tudo.

*Que setor limpo, senhoras e senhores! Esqueleto de YAML no bolso, etiquetas dominadas — e repara que o guia armou a jogada: esse label `app: myapp` que ficou vivo na pista é a ultrapassagem preparada da próxima etapa. Vamos para o pit box!*

---

## Etapa 04 — Services e ConfigMaps: endereço fixo e configuração externa

*Volta 4 e o problema clássico do pit lane aparece: como achar um carro que muda de posição o tempo todo? Quem acompanha F1 sabe que endereço e procedimento no box não são detalhe — Christijan Albers que o diga, saindo do box em 2007 com a mangueira de combustível ainda pendurada. Endereço fixo e configuração fora do chassi: é disso que esta etapa vive.*

### O problema

Lembra do fato nº 2 da Etapa 03? **Pods são efêmeros.** Cada Pod novo nasce com um IP diferente. Agora imagine seu frontend tentando falar com a API: hoje ela está no IP 10.244.0.5, amanhã o Pod morre e renasce no 10.244.0.9. É como tentar achar um carro pela posição na pista: na volta 12 ele está em P4, na volta 30 em P7 — endereço que muda o tempo todo não serve de referência. Como alguém fala com Pods de forma confiável?

E tem um segundo problema: serviços precisam de configuração (portas, URLs, flags). Se você colocar isso **dentro da imagem** do container, cada mudança de configuração obriga a rebuildar e republicar a imagem. Seria como construir um chassi novo toda vez que a mureta pede meio grau a mais de asa. Deploy na sexta-feira para mudar uma URL? Não.

### O conceito

**Problema 1 → Service.** O Service é um ponto de entrada estável que encontra os Pods por label e balanceia o tráfego entre eles.

**Analogia:** o Service é o **pit box da equipe**. A posição do box no pit lane é fixa a temporada inteira — todo mundo sabe onde fica o box da Ferrari. Qual carro entra nele a cada volta muda (o de Leclerc, o de Hamilton, um chassi novo montado ontem) — e quem precisa do box não se importa: o endereço é o mesmo, e o box atende qualquer carro que carregue a etiqueta da equipe.

O fluxo: uma requisição chega no Service (que tem IP e nome fixos) → o Service seleciona os Pods pelo **label selector** (o mecanismo da Etapa 03! — a etiqueta FIA de novo) → e distribui o tráfego de forma balanceada entre as réplicas saudáveis. O nome do Service vira um **hostname interno** do cluster: se o Service chama `auth-service`, qualquer Pod acessa `http://auth-service` — mesmo que os Pods por trás troquem de IP mil vezes, como o box da equipe continua no mesmo lugar mesmo que o chassi seja trocado entre uma etapa e outra.

**Os 3 tipos de Service:**

- **ClusterIP (padrão)** — IP interno, acessível só dentro do cluster. É o **canal interno de rádio**: só a equipe ouve. Use para comunicação entre serviços (ex.: API ↔ banco).
- **NodePort** — abre uma porta fixa (30000–32767) no nó. Acessível de fora via `IP-do-nó:porta` — o **portão de serviço numerado** do autódromo, por onde entra quem tem credencial. É o jeito de expor algo no Minikube.
- **LoadBalancer** — provisiona um balanceador externo com IP público. A **entrada oficial do autódromo, com bilheteria**: é por ali que o público entra. É o tipo de produção na nuvem (AWS, GCP, Azure).

**Problema 2 → ConfigMap.** O ConfigMap é a **folha de set-up separada do chassi**: asa, pressões, mapas — nada disso é soldado no carro; está numa folha que os mecânicos aplicam antes do carro sair da garagem. Você guarda os valores num objeto central e injeta de 3 formas: **variáveis de ambiente** (a mais comum, via `envFrom`), **arquivos montados** (ótimo para configs longas) ou **argumentos de linha de comando**. Mudou a config? Atualiza o ConfigMap — a imagem continua a mesma. Meio grau de asa não exige chassi novo.

### Exemplo comentado — repare no selector

```yaml
# app.yaml — salve o Service neste arquivo
apiVersion: v1
kind: Service
metadata:
  name: meu-service            # vira o hostname interno
spec:
  type: NodePort               # troque p/ ClusterIP (interno) ou LoadBalancer (nuvem)
  selector:                    # ← O ELO: procura Pods com este label
    app: myapp
  ports:
    - protocol: TCP
      port: 80                 # porta em que o Service escuta
      targetPort: 80           # porta do container que recebe
      nodePort: 30080          # porta exposta no nó (só NodePort)
```

Nota: o `selector` do Service casa com o label do Pod (`app: myapp`) — exatamente o pod `meu-pod` que você criou na Etapa 03. É assim que ele sabe para quem mandar o tráfego: o box lê a etiqueta do carro que está chegando.

```yaml
# configmap-pod.yaml — os dois objetos no mesmo arquivo, separados por ---
# 1) O ConfigMap com os valores...
apiVersion: v1
kind: ConfigMap
metadata:
  name: minha-config
data:
  MENSAGEM: "olá do configmap!"
  MODO: "estudo"
---
# 2) ...injetado como variáveis de ambiente no Pod
apiVersion: v1
kind: Pod
metadata:
  name: pod-config
spec:
  containers:
    - name: app
      image: nginx:1.14.2
      envFrom:                 # injeta TODAS as chaves de uma vez
        - configMapRef:
            name: minha-config
```

Nota: confirme a injeção com: `kubectl exec pod-config -- env`

```sh
$ kubectl apply -f app.yaml
$ kubectl get svc
NAME          TYPE       CLUSTER-IP    PORT(S)
meu-service   NodePort   10.96.xx.xx   80:30080/TCP

# Gera a URL de acesso (no Windows/Docker, deixe o terminal aberto — é um túnel)
$ minikube service meu-service --url
http://127.0.0.1:53412   ← abra no navegador: página do nginx!
```

**Cola de comandos:**

- `kubectl get svc` — lista os Services
- `minikube service <nome> --url` — URL de acesso a um NodePort
- `kubectl get configmap` — lista os ConfigMaps
- `kubectl exec <pod> -- env` — confere variáveis injetadas

### Mão na massa

1. Com o `meu-pod` da Etapa 03 rodando (label `app: myapp`), salve o YAML do Service como `app.yaml` e aplique.
2. Rode `minikube service meu-service --url` e abra a URL no navegador — **observe** a página de boas-vindas do nginx. Você acabou de acessar um Pod efêmero por um endereço estável — encontrou o carro pelo box, não pela posição na pista.
3. Teste o elo: delete o pod (`kubectl delete pod meu-pod`) e recarregue o navegador — **observe** o erro (não há mais Pods com o label — box vazio, nenhum carro com a etiqueta da equipe). Recrie com `kubectl apply -f meu-pod.yaml` e recarregue — voltou, sem tocar no Service. O box nem se mexeu.
4. Aplique o ConfigMap + pod (`kubectl apply -f configmap-pod.yaml`) e rode `kubectl exec pod-config -- env` — **observe** `MENSAGEM` e `MODO` na lista de variáveis. A folha de set-up foi aplicada no carro.

**Dica (regra de ouro):** exponha o mínimo. Banco de dados = ClusterIP (canal interno — estratégia de corrida não vaza no rádio aberto). Só a porta de entrada do sistema vira NodePort/LoadBalancer. Para senhas e chaves, o irmão seguro do ConfigMap é o **Secret** — os mapas de motor que nem todo mecânico da própria equipe conhece.

### Anota aí

> Service é o pit box: endereço fixo para carros (Pods) que mudam, achando-os pela etiqueta (label); ConfigMap é a folha de set-up — configuração fora do chassi (imagem).

*Setor no roxo! Pod acessado por endereço estável, configuração fora do chassi — e você ainda provou o elo deletando o carro e vendo o box impassível no mesmo lugar. Mas atenção, porque agora vem a curva que decide corrida: o que acontece quando o carro PARA na pista?*

---

## Etapa 05 — Auto-cura e escala: ReplicaSets e Deployments

*É AQUI que separa os pontuadores do resto do grid! Hoje mesmo, volta 46, o carro da Red Bull calou e o Verstappen assistiu ao fim da prova do muro — zero ponto. Em produção, o seu Pod único morrendo às 3h da manhã é exatamente essa cena. Auto-cura e caminho de volta — a etapa mais importante do guia começa AGORA.*

### O problema

Até aqui você criou Pods na mão — ótimo para aprender, mas pense no que aconteceu hoje em Silverstone: o Verstappen parou na volta 46 com problema no carro e acabou — a Red Bull não tem como colocar um substituto na pista no meio da corrida. Em produção, seu único Pod morrendo de madrugada é isso: o site fora do ar até alguém acordar. E mais: quando você lançar a versão 2.0 do app, como trocar a versão **sem derrubar o serviço**? E se a 2.0 vier com um bug catastrófico, como voltar rápido? Deploy que quebrou na sexta às 18h não pode depender de heroísmo — assim como fim de semana de GP não pode depender de um chassi só.

### O conceito

Duas peças resolvem isso, uma embrulhando a outra:

**ReplicaSet — o chefe de equipe do número.** Você declara `replicas: 3` e ele monitora os Pods pelo label selector (a etiqueta FIA, de novo!). Caiu um? Ele detecta que a contagem baixou e cria outro em segundos, sem você pedir. **Analogia:** é a regra inegociável do chefe de equipe — "N carros prontos, sempre". Quando um piloto destrói o chassi no treino de sábado, os mecânicos viram a madrugada e no domingo de manhã tem um carro inteiro no grid, remontado peça por peça a partir da especificação. É a auto-cura do Kubernetes em ação — o "estado desejado" da Etapa 01 mantido de verdade.

**Aqui a analogia quebra — e vale registrar onde:** na F1, a reposição só acontece entre sessões; em corrida, carro parado é carro perdido (pergunte à Red Bull como foi ver o carro do Max parado hoje). E o regulamento limita cada equipe a 2 carros. O ReplicaSet não tem parc fermé nem artigo de regulamento: ele repõe o Pod **em segundos, a qualquer hora, em qualquer quantidade**. Pense no K8s como uma categoria de endurance sem limite de inscrições: a equipe alinha quantos carros a demanda pedir, e a "madrugada dos mecânicos" dura trinta segundos.

**Deployment — o gestor de specs.** Ele embrulha o ReplicaSet e adiciona o que na F1 chamamos de programa de desenvolvimento:

- **Rolling Update** — ao trocar a imagem, sobe réplicas novas e desliga as antigas **gradualmente** — o serviço nunca fica fora do ar. É exatamente como as equipes introduzem upgrade quando há peças para um carro só: a spec nova entra em um carro, o outro segue com a antiga, e ninguém fica fora da pista durante a transição.
- **Rollback** — a versão nova quebrou? `kubectl rollout undo` volta para a anterior em segundos. Toda equipe já fez isso: o assoalho novo não anda, e na etapa seguinte o carro volta com a spec anterior. A Ferrari chegou em Barcelona este ano com pacote novo e o Hamilton venceu — mas se o pacote tivesse piorado o carro, voltavam para a spec de Mônaco sem drama. Ter o caminho de volta faz parte do desenvolvimento.
- **Escala manual** — `kubectl scale --replicas=5` e pronto: cinco carros no grid.

Os YAMLs de ReplicaSet e Deployment são quase idênticos, mas no dia a dia usamos **quase sempre o Deployment**, justamente pelo controle de versão — ninguém gerencia só o número de carros; gerencia-se o número **e** a spec de cada um. O Deployment cria e gerencia o ReplicaSet por baixo dos panos.

### Exemplo comentado — o Deployment completo + ciclo de vida

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-fiap
spec:
  replicas: 3                  # quero 3 cópias, sempre
  selector:
    matchLabels:
      app: nginx-app           # gerencio os Pods com este label...
  template:                    # ...e este é o "molde" de cada Pod
    metadata:
      labels:
        app: nginx-app         # tem que casar com o selector ↑
    spec:
      containers:
        - name: nginx
          image: nginx:1.14.2  # trocar esta versão dispara o rolling update
          ports:
            - containerPort: 80
```

Repare: o `template` é literalmente o esqueleto de Pod da Etapa 03, embutido dentro do Deployment. Nada aqui é novo — é composição: a folha de especificação do carro, agora anexada à ordem do chefe de equipe ("três carros desta spec, sempre").

```sh
$ kubectl apply -f deployment.yaml
$ kubectl get pods
nginx-fiap-7d4b9c-aaa   1/1   Running
nginx-fiap-7d4b9c-bbb   1/1   Running
nginx-fiap-7d4b9c-ccc   1/1   Running

# Mate um pod de propósito:
$ kubectl delete pod nginx-fiap-7d4b9c-aaa

# Olhe de novo: um pod NOVO já está nascendo pra manter as 3 réplicas
$ kubectl get pods
nginx-fiap-7d4b9c-bbb   1/1   Running
nginx-fiap-7d4b9c-ccc   1/1   Running
nginx-fiap-7d4b9c-ddd   0/1   ContainerCreating   ← auto-cura!
```

```sh
# Rolling update: troca a imagem
$ kubectl set image deployment/nginx-fiap nginx=nginx:1.16.1
$ kubectl rollout status deployment/nginx-fiap
deployment "nginx-fiap" successfully rolled out

# Quebre de propósito (imagem que não existe):
$ kubectl set image deployment/nginx-fiap nginx=nginx:nao-existe
$ kubectl get pods
nginx-fiap-7d4b9c-bbb   1/1   Running            ← antigos seguram o serviço
nginx-fiap-9f8e2a-xyz   0/1   ImagePullBackOff   ← novos travados

# Rollback: volta tudo pra versão anterior
$ kubectl rollout undo deployment/nginx-fiap
deployment.apps/nginx-fiap rolled back
```

Nota: repare que o K8s **só desliga os Pods antigos quando os novos ficam prontos**. Como a imagem quebrada nunca fica pronta, os antigos seguram o serviço no ar. Um deploy quebrado não derruba o que já funcionava — os carros de spec antiga continuam pontuando enquanto a spec nova não passa nem do crash test.

**Cola de comandos:**

- `kubectl scale deployment <nome> --replicas=5` — escala manual
- `kubectl set image deployment/<nome> ctn=img:tag` — dispara rolling update
- `kubectl rollout status deployment/<nome>` — acompanha a troca
- `kubectl rollout history deployment/<nome>` — lista revisões
- `kubectl rollout undo deployment/<nome>` — rollback!

### Mão na massa

*O momento que as arquibancadas esperavam: o pit stop do guia. Mas aqui, diferente da troca de pneus, pressa é inimiga — o valor do exercício está em OBSERVAR cada estado mudando no terminal. Calma e olhos abertos.*

Este é O exercício do guia — o momento em que o Kubernetes "clica" na cabeça:

1. Aplique o `deployment.yaml` e confirme os 3 pods `Running` — três carros na pista, mesma spec.
2. Delete um pod na mão (copie um nome real do `kubectl get pods`) e rode `kubectl get pods` de novo, rápido — **observe** o substituto em `ContainerCreating`. Você tentou violar o estado desejado e o cluster corrigiu — a madrugada dos mecânicos comprimida em segundos.
3. Rode o rolling update para `nginx:1.16.1` e acompanhe com `kubectl rollout status` — **observe** a mensagem de sucesso. Upgrade introduzido carro a carro, ninguém saiu da pista.
4. Quebre de propósito com a imagem `nginx:nao-existe` — **observe** no `kubectl get pods` os pods antigos `Running` segurando o serviço e os novos em `ImagePullBackOff`.
5. Execute `kubectl rollout undo deployment/nginx-fiap` e confirme com `kubectl rollout history` — **observe** as revisões listadas. Você acabou de fazer um rollback de produção em um comando — voltou para a spec da classificação sem perder a corrida.

### Anota aí

> Ninguém cria Pod avulso em produção — carro sem equipe não termina corrida: o Deployment garante N réplicas (auto-cura), troca specs sem tirar ninguém da pista (rolling update) e volta pra spec anterior em um comando (rollback).

*E o público de pé nas arquibancadas! Você MATOU um Pod e o cluster o remontou antes do replay terminar — a madrugada dos mecânicos comprimida em segundos, como prometia o quadro de-para. Setor decisivo completado no verde. Agora, a pergunta que assombra qualquer equipe de ponta: e os DADOS?*

---

## Etapa 06 — Volumes: dados que sobrevivem ao Pod

*Entramos no setor de alta velocidade — e no assunto que não aparece nos highlights, mas ganha campeonatos: dados. A Williams dominou os anos 90 porque transformava telemetria em desenvolvimento antes de todo mundo. Carro se desmonta; histórico, jamais. Etapa 06 valendo.*

### O problema

Você já sabe: Pods são efêmeros — e a Etapa 05 deixou isso ainda mais radical, com pods morrendo e nascendo em rolling updates. Ótimo para o app... e catastrófico para dados. Na F1, o carro que correu hoje em Silverstone vai ser desmontado até o monocoque — mas os **gigabytes de telemetria** que ele gerou já estão nos servidores da fábrica antes de eu tirar o capacete. Imagine se a telemetria morresse com o carro: cada etapa a equipe recomeçaria do zero, sem histórico, sem comparação, sem evolução. É exatamente isso que acontece com o Pod do PostgreSQL do seu e-commerce recriado num update: **todos os pedidos da Black Friday somem junto**. Dados de verdade não podem viver no filesystem de um container — nem no datalogger de um carro que vai ser desmontado.

### O conceito

O Kubernetes resolve isso com uma cadeia de 4 conceitos: **Volume**, **PersistentVolume (PV)**, **PersistentVolumeClaim (PVC)** e **StorageClass (SC)**.

**Memorize pela operação de dados da equipe:**

- o **PVC é a REQUISIÇÃO do engenheiro de dados** — "preciso de 1Gi, leitura e escrita por um nó";
- o **PV é o STORAGE físico da fábrica** que atende a requisição — NFS, EBS da AWS, hostPath...;
- a **StorageClass é o CATÁLOGO de tipos de storage** — o servidor trackside rápido para a sessão? o datacenter da fábrica para o histórico da temporada?

O Pod só referencia o PVC — o carro não sabe (nem precisa saber) em qual rack da fábrica a telemetria dele está guardada. Essa separação é o que permite o mesmo YAML rodar no Minikube e na AWS — o mesmo procedimento de dados funciona em Interlagos e em Suzuka.

**Tipos de volume mais comuns:**

- **emptyDir** — nasce vazio com o Pod e **MORRE com o Pod**. É o quadro branco da garagem: anotações da sessão, apagadas quando o fim de semana acaba. Serve para arquivos temporários e para compartilhar dados entre containers do mesmo Pod.
- **hostPath** — monta um diretório do nó dentro do container. É guardar dados no caixote de frete daquele circuito: útil em dev, perigoso em produção (amarra o Pod ao nó — e caixote esquecido no circuito não viaja com a equipe).
- **persistentVolumeClaim** — o jeito certo para dados de verdade: sobrevivem a reinício e recriação do Pod. A telemetria na fábrica.

**Modos de acesso do PVC** (quem pode montar o volume):

- **ReadWriteOnce (RWO)** — leitura e escrita por UM nó — o caso típico de banco de dados. Só a garagem da equipe escreve nos próprios dados.
- **ReadOnlyMany (ROX)** — só leitura, vários nós — assets estáticos. Como o feed de timing da FIA: todas as equipes leem, ninguém altera.
- **ReadWriteMany (RWX)** — leitura e escrita por vários nós — precisa de NFS ou similar. Infraestrutura compartilhada de verdade exige sistema especializado.

No Minikube, a StorageClass `standard` já provisiona PVs automaticamente — você faz a requisição (PVC) e o storage (PV) aparece.

### Exemplo comentado — prove a persistência: escreva, destrua, leia de volta

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: meu-pvc
spec:
  accessModes:
    - ReadWriteOnce            # um nó lê e escreve (típico de banco)
  resources:
    requests:
      storage: 1Gi             # quanto disco eu quero
# no Minikube, a StorageClass "standard" provisiona o PV sozinha
```

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-persistente
spec:
  containers:
    - name: app
      image: nginx:1.14.2
      volumeMounts:
        - name: dados
          mountPath: /dados    # onde o volume aparece no container
  volumes:
    - name: dados
      persistentVolumeClaim:   # ← aponta pro PVC (em vez de emptyDir)
        claimName: meu-pvc
```

```sh
$ kubectl apply -f pvc.yaml -f pod-com-pvc.yaml

# Bound = o PV foi criado e vinculado ao pedido
$ kubectl get pvc
NAME      STATUS   VOLUME         CAPACITY   ACCESS MODES
meu-pvc   Bound    pvc-3f2a1...   1Gi        RWO

# Escreva um arquivo no volume
$ kubectl exec pod-persistente -- sh -c "echo 'sobrevivi!' > /dados/teste.txt"

# DESTRUA o pod (o PVC continua existindo)
$ kubectl delete pod pod-persistente

# Recrie o pod e leia o arquivo:
$ kubectl apply -f pod-com-pvc.yaml
$ kubectl exec pod-persistente -- cat /dados/teste.txt
sobrevivi!            ← o Pod morreu, o dado não.
```

É o carro desmontado depois da corrida e a telemetria intacta na fábrica — o chassi novo de Spa nasce já com todo o histórico de Silverstone disponível.

**Cola de comandos:**

- `kubectl get pvc` — pedidos de volume (Bound = ok)
- `kubectl get pv` — discos persistentes do cluster
- `kubectl delete pvc <nome>` — remove o pedido (e libera o disco)

### Mão na massa

1. Aplique o PVC e rode `kubectl get pvc` — **observe** o `STATUS Bound`: sua requisição foi atendida por um PV criado automaticamente (confirme com `kubectl get pv`).
2. Execute a sequência completa do exemplo: escrever o arquivo → deletar o pod → recriar o pod → ler o arquivo. **Observe** o `sobrevivi!` voltar. Esse é o contrato do PVC — o carro morre, a telemetria fica.
3. Experimento extra (o contraste que ensina): repita o teste trocando o volume por `emptyDir` — ao recriar o Pod, o arquivo terá sumido. Essa é exatamente a diferença entre o quadro branco da garagem e o servidor da fábrica, sentida na prática.

**Dica:** dado importante SEMPRE em PVC. Se os dados sumiram após um restart, aposto que estavam em `emptyDir` ou no filesystem do container — alguém anotou a estratégia da corrida no quadro branco e a faxina passou.

### Anota aí

> PVC é a requisição, PV é o storage, StorageClass é o catálogo — e dado que importa mora sempre atrás de um PVC: o carro é desmontado, a telemetria nunca.

*"SOBREVIVI!" — e o arquivo voltou! Que momento bonito da transmissão: o carro foi desmontado até o monocoque e a telemetria estava lá, intacta, na fábrica. Setor no verde. Mas segura na cadeira, porque agora vem a pegadinha mais traiçoeira do circuito: o carro que anda... mas não anda.*

---

## Etapa 07 — Probes: como o cluster sabe que seu app está vivo

*Atenção que esta curva é CEGA! Hoje, em Silverstone, o mundo inteiro viu: Antonelli largou na pole, cravou 1:31.777 — a volta mais rápida da prova — e cruzou a linha em DÉCIMO SEXTO. Cinquenta e duas voltas na pista, e nada saudável. E os mais antigos lembram de Senna em Interlagos, 1991: o carro andava, mas só restava a sexta marcha — o painel dizia "rodando", o braço do piloto dizia outra coisa. É exatamente esse buraco que as probes fecham. Etapa 07, talvez a lição mais sutil do guia inteiro.*

### O problema

Cenário real da corrida de hoje: o Antonelli largou de pole em Silverstone, cravou a volta mais rápida da prova (1:31.777)... e cruzou a linha em P16. O carro dele esteve **na pista, rodando, as 52 voltas** — e mesmo assim algo claramente não estava saudável. Se a Mercedes olhasse só "o carro está andando?", o painel diria "sim" a corrida inteira.

No cluster é idêntico: seu app entra em deadlock às 3h da manhã. O **processo continua de pé** — então para o Kubernetes está tudo `Running` — mas nenhuma requisição é respondida. Sem informação extra, o cluster não tem como saber que "rodando" não é "funcionando". A auto-cura da Etapa 05 só recria pods que **morrem**; ela não enxerga pods **vivos porém travados** — o carro que anda, mas não anda.

### O conceito

As **probes** são verificações de saúde declaradas no manifesto do Pod. **Analogia:** é a telemetria + o radio check. A equipe não confia no fato de o carro estar se movendo: ela verifica canais específicos em intervalos regulares — pressão de óleo, temperatura da PU, resposta do piloto no rádio. Não basta o carro estar na pista; ele precisa responder aos estímulos.

São três probes, e o mais importante é o que acontece quando cada uma **FALHA**:

- **Liveness** — pergunta "está vivo?". Falhou → o Pod é **REINICIADO**. É o procedimento que todo piloto conhece: a telemetria travou, a PU entrou em modo de proteção, e a ordem no rádio é "faça o ciclo completo — desliga e liga o carro". Para apps que travam e só voltam com restart.
- **Readiness** — pergunta "está pronto para receber requisições?". Falhou → o Pod **SAI DO BALANCEADOR** (o Service para de mandar tráfego), **sem reiniciar**. É o semáforo vermelho do box: o carro fica segurado na garagem — ninguém o desmonta, ele só não vai para a pista até estar pronto. Para apps que carregam dados antes de atender.
- **Startup** — pergunta "terminou de inicializar?". Enquanto roda, **SEGURA as outras probes** — é o fire-up da PU: um V6 híbrido não dá partida frio; os fluidos circulam, o motor aquece, e **ninguém cobra tempo de volta durante o aquecimento**. Evita que a liveness mate um app lento antes da hora.

**Como a probe verifica** (3 mecanismos):

- **httpGet** — o kubelet faz um GET num endpoint tipo `/health` e espera 200 OK. O mais comum. É o radio check: "me dá um ok, piloto" — e a resposta precisa vir clara.
- **tcpSocket** — testa se a porta aceita conexão. Para serviços que não falam HTTP — a portadora do rádio abre, mesmo sem conversa.
- **exec** — executa um comando dentro do container; código de saída 0 = saudável. O mecânico plugando o laptop no carro e rodando o diagnóstico.

**Boas práticas da aula:** use as três probes juntas em produção; use endpoints diferentes para cada probe (canais de telemetria separados — pressão de óleo não se mede no sensor de freio); comece pelas configurações padrão e ajuste intervalos só quando o app pedir; monitore as falhas de probe (ex.: com Prometheus) — elas são o primeiro sinal de problema, como aquele tremor na telemetria duas voltas antes de a peça quebrar.

### Exemplo comentado — Pod com as 3 probes

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: exemplo-probes
spec:
  containers:
    - name: app
      image: exemplo:latest
      ports:
        - containerPort: 80
      livenessProbe:           # falhou → REINICIA o pod
        httpGet:
          path: /health
          port: 80
        periodSeconds: 10      # verifica a cada 10s
        timeoutSeconds: 5
        failureThreshold: 3    # 3 falhas seguidas → reinicia (3 é o padrão)
      readinessProbe:          # falhou → SAI do balanceador
        httpGet:
          path: /ready         # boa prática: endpoint separado
          port: 80
        periodSeconds: 5
      startupProbe:            # segura as outras até o app subir
        httpGet:
          path: /startup
          port: 80
        initialDelaySeconds: 120   # app lento: espera 2min
        periodSeconds: 30
```

(Este YAML é ilustrativo — a imagem `exemplo:latest` é fictícia. O experimento executável vem a seguir.)

### Exemplo comentado — sabotagem didática (executável)

A ideia: um busybox que cria o arquivo `/tmp/healthy`, vive 30s "saudável", apaga o arquivo — e a partir daí a liveness probe (`cat /tmp/healthy`) passa a falhar. Arquivo existe = saudável; arquivo sumiu = doente. É um sensor de pressão de óleo sabotado de propósito: 30 segundos de leitura boa e depois silêncio na telemetria.

```yaml
# liveness-exec.yaml
apiVersion: v1
kind: Pod
metadata:
  name: liveness-exec
spec:
  containers:
    - name: liveness
      image: busybox
      args:                         # o "roteiro da sabotagem":
        - /bin/sh
        - -c
        - touch /tmp/healthy; sleep 30; rm -f /tmp/healthy; sleep 600
      livenessProbe:
        exec:
          command:                  # probe: arquivo existe? (exit 0 = saudável)
            - cat
            - /tmp/healthy
        initialDelaySeconds: 5     # espera 5s antes da 1ª verificação
        periodSeconds: 5           # verifica a cada 5s
```

```sh
$ kubectl apply -f liveness-exec.yaml

# Assista em tempo real (Ctrl+C pra sair):
$ kubectl get pods -w
NAME            READY   STATUS    RESTARTS
liveness-exec   1/1     Running   0
liveness-exec   1/1     Running   1 (5s ago)    ← restart automático!
liveness-exec   1/1     Running   2 (10s ago)   ← e de novo...

# Investigue como um profissional:
$ kubectl describe pod liveness-exec
Events:
  Warning  Unhealthy  Liveness probe failed: cat: /tmp/healthy: No such file
  Normal   Killing    Container liveness failed liveness probe, will be restarted
```

Nota — linha do tempo do experimento: 30s saudável → arquivo apagado → 3 falhas seguidas (o padrão do `failureThreshold` — a mureta também não manda resetar o carro na primeira leitura ruim; confirma três vezes) → kubelet reinicia. Como o script recomeça do zero após o restart, o ciclo repete para sempre — de propósito, para você ver.

**Cola de comandos:**

- `kubectl get pods -w` — assiste mudanças em tempo real
- `kubectl describe pod <nome>` — Events mostram as falhas de probe

### Mão na massa

1. Aplique o `liveness-exec.yaml` e rode `kubectl get pods -w` — **observe** a coluna `RESTARTS` subir sozinha a cada ~35-45s. Cada incremento é o kubelet mandando o "desliga e liga o carro" para um Pod que parou de responder na telemetria.
2. Em outro terminal, rode `kubectl describe pod liveness-exec` — **observe** nos Events o par `Warning Unhealthy` + `Normal Killing`. Aprenda a reconhecer essa dupla: em produção, ela é o diagnóstico de probe falhando.
3. Limpe: `kubectl delete pod liveness-exec`.

**Dica:** `Running` **não** significa saudável. O Antonelli rodou as 52 voltas de Silverstone hoje com pole e volta mais rápida no bolso — e terminou em P16. Carro na pista não é carro competitivo; processo de pé não é app funcionando. É exatamente por isso que as probes existem.

### Anota aí

> Liveness falhou = desliga e liga o carro (reinicia); Readiness falhou = semáforo vermelho do box (sai do balanceador sem reiniciar); Startup = fire-up da PU (segura as duas até o app terminar de aquecer).

*RESTARTS subindo sozinho na tela — você sabotou o sensor e viu a mureta mandar o reset, três leituras confirmadas, sem pânico. Poucos setores ensinam tanto com tão pouco YAML. E agora, a reta final do circuito: o cluster vai aprender a pilotar sozinho.*

---

## Etapa 08 — HPA: escala automática baseada em métricas

*ÚLTIMA ETAPA, bandeirada à vista! E que fecho de prova: a mureta assumindo a estratégia em tempo real. Foi assim que Ross Brawn venceu a Hungria em 1998 — Schumacher voando e uma estratégia de três paradas recalculada com a corrida em andamento, a mureta lendo a telemetria e reagindo na hora. Hoje, quem lê e reage é o HPA — e o ciclo do estado desejado, aberto lá na Etapa 01, se fecha diante dos seus olhos.*

### O problema

Volte ao problema da Etapa 01: a demanda explode no domingo da corrida. Você já sabe escalar na mão (`kubectl scale --replicas=...`, Etapa 05) — mas vai ficar de plantão no terminal ajustando réplicas a cada pico de acesso? Às 2h da manhã também? Nenhuma mureta funciona assim: a estratégia reage à corrida em tempo real, com base em telemetria, não com o chefe de equipe girando um botão na mão a cada volta. O ciclo precisa se fechar: o cluster deve **medir a carga e escalar sozinho**.

### O conceito

O **Horizontal Pod Autoscaler (HPA)** monitora métricas dos Pods (CPU, memória...) e ajusta o número de réplicas entre um mínimo e um máximo que você define.

**Analogia (com aviso de regulamento):** o HPA é a **mureta de estratégia com poder de alinhar mais carros conforme a carga da corrida**. Lembrando o combinado da Etapa 05: aqui a comparação para — o regulamento da F1 trava cada equipe em 2 carros, então imagine o K8s como uma prova de endurance sem limite de inscrições. A mureta olha a telemetria: o ritmo apertou além do alvo → alinha mais carros (até o teto da frota); a corrida acalmou → recolhe carros gradualmente — **sem desmontar a operação no primeiro safety car**, porque a corrida pode reacender.

O funcionamento: o HPA compara a utilização dos Pods com o **alvo** configurado (ex.: manter a média de CPU em 70%). Passou do alvo → cria réplicas (até o máximo). Caiu → remove réplicas (até o mínimo), economizando recurso. O **scale down é propositalmente lento** (~5min de estabilidade) para não ficar "pistonando" com variações rápidas — mesma razão pela qual a mureta não muda a estratégia a cada nuvem que aparece no radar: espera o padrão se confirmar.

**Métricas suportadas:** CPU (a mais comum), memória, métricas personalizadas do seu app (requisições/s, tamanho de fila), métricas externas (ex.: vindas do Prometheus) e E/S de disco. A métrica certa depende do perfil do app: app pesado em CPU escala por CPU; app que devora RAM escala por memória — como escolher a estratégia pelo que o carro degrada: pneu em Barcelona, freio em Montreal.

**Dois pré-requisitos que pegam todo mundo:**

1. O cluster precisa do **metrics-server** para ler CPU/memória — no Minikube: `minikube addons enable metrics-server`. Sem sensores no carro, a mureta não enxerga nada — telemetria desligada, estratégia cega.
2. O container **PRECISA declarar `resources.requests.cpu`**, porque "70% de CPU" significa 70% **do que o Pod pediu**. É como a alocação de energia do ERS por volta: "usei 70%" só faz sentido contra uma alocação declarada. Sem requests, o HPA mostra `<unknown>` e não escala.

**O que o HPA entende:**

- **CPU / Memória** — as métricas clássicas. % calculada sobre o `resources.requests` do container — o percentual da alocação declarada, nunca um número absoluto solto.
- **Métricas custom** — do seu app (req/s, fila) ou externas (Prometheus). Para escalar pelo que importa — cada pista degrada uma coisa diferente.
- **min / max** — você sempre define o piso e o teto de réplicas. O HPA trabalha dentro da faixa, como a estratégia trabalha dentro do regulamento: nunca menos que a frota mínima, nunca mais que o teto.

### Exemplo comentado — Deployment + HPA + teste de carga

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-hpa
spec:
  replicas: 1                  # começa com 1; o HPA assume daqui
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
          resources:           # SEM requests o HPA não calcula %
            requests:
              cpu: "100m"      # 100 milicores = 0,1 CPU
            limits:
              cpu: "200m"
```

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: nginx-hpa
spec:
  scaleTargetRef:              # QUEM o HPA controla
    apiVersion: apps/v1
    kind: Deployment
    name: nginx-hpa
  minReplicas: 1               # piso
  maxReplicas: 10              # teto
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70   # alvo: média de CPU em 70%
```

Para o gerador de carga achar o app pelo nome, crie também um Service ClusterIP chamado `nginx-hpa` — é o mesmo padrão da Etapa 04 (o pit box com endereço fixo, agora no canal interno de rádio):

```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-hpa              # hostname interno usado pelo gerador
spec:
  type: ClusterIP              # só tráfego interno — regra de ouro da Etapa 04
  selector:
    app: nginx-hpa             # casa com o label dos pods do Deployment
  ports:
    - port: 80
      targetPort: 80
```

```sh
# Pré-requisito: metrics-server
$ minikube addons enable metrics-server

$ kubectl apply -f deployment.yaml -f hpa.yaml
# (aplique também o service.yaml acima, pro gerador achar o app)

# Gere carga de dentro do cluster:
$ kubectl run gerador --image=busybox -it --rm -- /bin/sh -c \
  "while true; do wget -q -O- http://nginx-hpa; done"

# Em OUTRO terminal, assista:
$ kubectl get hpa -w
NAME        TARGETS         MINPODS  MAXPODS  REPLICAS
nginx-hpa   cpu: 0%/70%     1        10       1
nginx-hpa   cpu: 152%/70%   1        10       1
nginx-hpa   cpu: 152%/70%   1        10       3    ← escalou sozinho!

# Pare a carga (Ctrl+C) e aguarde ~5min: as réplicas encolhem de volta.
```

Nota: em produção, ferramentas como K6 e JMeter fazem esse teste de carga de forma controlada — o equivalente ao teste de longa duração da pré-temporada no Bahrein, estressar o pacote antes da corrida de verdade.

**Plano B (se o TARGETS não passar de 70%):** o nginx servindo página estática é eficiente demais — um único gerador pode não gerar carga suficiente pra tirar a mureta da cadeira. Três saídas, da mais simples à mais fiel ao tutorial oficial:

1. Rode 2–3 geradores em paralelo: repita o `kubectl run` em outros terminais trocando o nome (`gerador2`, `gerador3`).
2. Reduza `requests.cpu` para `"50m"` no Deployment e reaplique — o mesmo consumo passa a valer o dobro em %.
3. Troque a imagem por `registry.k8s.io/hpa-example` (o php-apache do tutorial oficial do K8s, que queima CPU a cada requisição — feito exatamente pra essa demo).

**Cola de comandos:**

- `minikube addons enable metrics-server` — pré-requisito do HPA
- `kubectl get hpa -w` — assiste o HPA reagir à carga
- `kubectl top pods` — CPU/memória por pod
- `kubectl autoscale deployment <n> --cpu-percent=70 --min=1 --max=10` — cria HPA imperativo

### Mão na massa

*Volta rápida final do fim de semana — todos os setores juntos numa tacada só. Cronômetro rodando!*

O experimento final, que junta tudo:

1. Ative o metrics-server e aplique os três YAMLs (Deployment, HPA, Service). Rode `kubectl get hpa` — **observe** os targets: se aparecer `<unknown>`, aguarde ~1min (o metrics-server precisa coletar a primeira leitura — sensor recém-instalado não dá dado antes da primeira volta).
2. Suba o gerador de carga num terminal e `kubectl get hpa -w` em outro — **observe** o percentual de CPU disparar acima de 70% e, em seguida, a coluna `REPLICAS` subir. Se o percentual estacionar abaixo do alvo, use o plano B acima. Confirme com `kubectl get pods`: pods novos nasceram sem nenhum comando seu — a mureta alinhou carros sozinha, lendo a telemetria.
3. Pare a carga (Ctrl+C) e continue assistindo — **observe** que as réplicas demoram ~5min para encolher. Essa lentidão é proposital (estabilidade contra "pistonagem" — ninguém desmonta a garagem no primeiro momento de calmaria).
4. Use `kubectl top pods` durante o teste para ver a métrica crua que alimenta o HPA — a telemetria antes da decisão de estratégia.

**Dica:** `kubectl get hpa` mostrando `<unknown>` nos targets? Ou o metrics-server não está ativo, ou o container não declarou `resources.requests`. São as duas causas, sempre — ou o sensor está desligado, ou ninguém declarou a alocação de referência.

### Anota aí

> HPA = estado desejado aplicado à escala: você define alvo, piso e teto — a mureta faz o resto. Mas sem metrics-server (sensores) e sem resources.requests (alocação declarada) ele não enxerga nada.

*E o cluster ESCALOU SOZINHO, senhoras e senhores! Réplicas subindo na tela sem um comando sequer — o ciclo se fechou: você declara o alvo, a mureta faz a corrida. Última curva completada. Agora é volta de desaceleração, aceno para a arquibancada — e o pódio logo ali.*

---

## Plataformas gratuitas de prática

*Volta de desaceleração: o motor esfria, mas o campeonato continua — e todo piloto sabe que temporada se constrói no treino. Aqui está o calendário de testes.*

Pense nisto como a escada de qualquer piloto: simulador público, kart, F4, e só então o carro de verdade. Ordem sugerida: comece pelo Killercoda (zero instalação), use o Kube by Example como consulta rápida, e deixe o Hard Way para quando as 8 etapas estiverem sólidas.

- **Killercoda** (100% grátis) — killercoda.com/kubernetes — Cenários interativos de Kubernetes direto no navegador: terminal com cluster real e roteiro guiado. Sucessor do Katacoda. Bom para: praticar cada etapa deste guia sem instalar nada. **Comece por aqui.**
- **Play with Kubernetes** (100% grátis) — labs.play-with-k8s.com — Cluster Kubernetes real e temporário (sessões de 4 horas) no navegador, mantido pela Docker. Você monta o cluster na mão com kubeadm. Bom para: testar comandos kubectl livremente e entender a montagem de um cluster.
- **Kube by Example** (100% grátis) — kubebyexample.com — Tutoriais e exemplos curtos mantidos pela Red Hat: um conceito por página, com exemplos direto ao ponto. Bom para: revisar um conceito específico rapidamente.
- **Introduction to Kubernetes (LFS158)** (100% grátis) — training.linuxfoundation.org — Curso oficial gratuito da Linux Foundation, disponível também no edX. Base teórica sólida com certificado de participação. Bom para: consolidar a teoria com o material oficial.
- **Kubernetes the Hard Way** (100% grátis) — github.com/kelseyhightower — O lendário roteiro do Kelsey Hightower: montar um cluster peça por peça, sem instaladores. Bom para: nível avançado, entender o que o Minikube esconde. É o "monte o carro parafuso por parafuso" — quem faz, nunca mais olha a garagem do mesmo jeito.
- **KodeKloud** (free tier + pago) — kodekloud.com — Labs guiados estilo desafio. Alguns labs gratuitos; catálogo completo e simulados CKA/CKAD pagos. Bom para: troubleshooting realista.
- **iximiuz Labs** (free tier + pago) — labs.iximiuz.com — Playgrounds de containers e Kubernetes no navegador com desafios práticos. Bom para: experimentos mais profundos (rede, imagens, internals).

---

## Checklist de autoavaliação

*BANDEIRADA! O carro cruza a linha de chegada — mas todo mundo que acompanha o esporte sabe: o resultado só vale depois da verificação técnica. Este checklist é o parque fechado do seu aprendizado — item marcado só se o carro passou de verdade pela balança.*

Marque cada item apenas se você **fez**, não se você "entendeu lendo". Superlicença ninguém tira assistindo corrida pela TV. Se algum ficar em branco, volte à etapa correspondente e refaça o mão na massa.

**Etapa 01 — Motivação e setup**
- [ ] Sei explicar, com minhas palavras, a diferença entre container e VM (e por que container é mais leve).
- [ ] Subi o Minikube e vi o nó `Ready` no `kubectl get nodes`.
- [ ] Sei o que significa "estado desejado" e consigo dar um exemplo.

**Etapa 02 — kubectl e API**
- [ ] Criei um pod imperativo com `kubectl run` e o vi chegar a `Running`.
- [ ] Provoquei um `ImagePullBackOff` de propósito e encontrei a causa nos Events do `describe`.
- [ ] Sei recitar o fluxo de debug: get → describe → logs.

**Etapa 03 — Cluster, Pods e labels**
- [ ] Sei citar o papel de master, worker, etcd, kubelet, kube-proxy e API Server.
- [ ] Escrevi um YAML de Pod do zero seguindo o esqueleto apiVersion + kind + metadata + spec.
- [ ] Filtrei pods com `-l` e sei explicar quando usar label e quando usar annotation.

**Etapa 04 — Services e ConfigMap**
- [ ] Expus um pod via NodePort e abri a página no navegador com `minikube service --url`.
- [ ] Sei dizer qual tipo de Service usar para: banco interno, teste no Minikube e produção na nuvem.
- [ ] Injetei um ConfigMap como variáveis de ambiente e confirmei com `kubectl exec -- env`.

**Etapa 05 — ReplicaSets e Deployments**
- [ ] Deletei um pod de um Deployment e vi o substituto nascer sozinho (auto-cura).
- [ ] Fiz um rolling update, quebrei um deploy de propósito e voltei com `rollout undo`.
- [ ] Sei explicar por que os pods antigos seguram o serviço quando a imagem nova falha.

**Etapa 06 — Volumes**
- [ ] Sei explicar a cadeia PVC (requisição) → PV (storage) → StorageClass (catálogo).
- [ ] Escrevi um arquivo num PVC, destruí o pod, recriei e li o arquivo de volta.
- [ ] Sei dizer quando usar emptyDir, hostPath e persistentVolumeClaim.

**Etapa 07 — Probes**
- [ ] Sei dizer o que acontece quando cada probe falha (liveness / readiness / startup).
- [ ] Rodei o experimento liveness-exec e vi a coluna RESTARTS subir sozinha.
- [ ] Sei explicar por que `Running` não significa saudável.

**Etapa 08 — HPA**
- [ ] Sei citar os dois pré-requisitos do HPA (metrics-server + resources.requests).
- [ ] Gerei carga e vi o HPA aumentar as réplicas sem nenhum comando meu.
- [ ] Sei explicar por que o scale down demora ~5 minutos.

*E o pódio está formado! Se todas as caixas estão marcadas, sobe no degrau mais alto e ouve o hino: você saiu do grid sem saber o que era um container e cruzou a linha com auto-cura, rollback, persistência, probes e autoscaling no bolso. E fica a lição da temporada 2026: o Antonelli terminou hoje em P16 e segue líder do campeonato, com 179 pontos — campeonato não se ganha numa corrida só, se ganha em consistência. Ficou caixa em branco? Sem drama: box, ajusta, e volta para a pista — é assim que se constrói temporada. E como toda boa transmissão respeita o debrief, ficam agora os registros de bastidor — do piloto e do professor.*

---

## Notas do piloto — onde as analogias quebram

Registro honesto, porque analogia forçada é pior que analogia nenhuma:

1. **ReplicaSet (Etapa 05):** na F1, reposição de carro só entre sessões, e o regulamento limita a 2 carros por equipe — o Verstappen parou em Silverstone e ficou fora. O ReplicaSet repõe em segundos, a qualquer momento, em qualquer quantidade. A analogia da "virada de madrugada dos mecânicos" vale para o mecanismo (remontar da especificação), não para o tempo nem para o limite.
2. **HPA (Etapa 08):** pela mesma razão, escalar réplicas não tem paralelo direto no grid de 2 carros — a analogia declarada é uma "endurance sem limite de inscrições". O comportamento da mureta (reagir à telemetria, respeitar piso e teto, não desmontar tudo no primeiro safety car) se mantém fiel.
3. **Service (Etapa 04):** o pit box real atende no máximo 2 carros e um por vez; o Service balanceia tráfego contínuo entre N réplicas simultâneas. A parte fiel é o endereço fixo + a seleção por etiqueta; o volume de atendimento simultâneo, não.
4. **Pod com múltiplos containers (Etapa 03):** o carro com PU + MGU-K ilustra "unidades distintas compartilhando sistemas", mas diferente do carro, os containers de um Pod são processos independentes que podem ser trocados individualmente na especificação.

---

## Notas do professor

Nenhum erro técnico evidente foi encontrado no relatório bruto. Registro aqui os complementos que adicionei para tornar tudo executável (conteúdo padrão da documentação oficial do Kubernetes, não invenção):

1. **Etapa 07:** o relatório bruto referenciava o `liveness-exec.yaml` apenas em comentários (descrevendo o comportamento do busybox). Incluí o manifesto completo — é o exemplo clássico da documentação oficial do Kubernetes (`touch /tmp/healthy; sleep 30; rm -f /tmp/healthy; sleep 600` com probe `exec: cat /tmp/healthy`) — para que o leitor consiga executar o experimento sem sair do guia.
2. **Etapa 08:** o relatório pedia "crie também um Service ClusterIP nginx-hpa" sem mostrar o YAML. Incluí o manifesto do Service (ClusterIP, selector `app: nginx-hpa`, porta 80), reutilizando exatamente o padrão já ensinado na Etapa 04.
3. **Terminologia (nota, não correção):** o material usa "Master node", termo das aulas de origem. A documentação atual do Kubernetes prefere **control plane** (é inclusive o que aparece na coluna ROLES do `kubectl get nodes` na Etapa 01). Os dois nomes referem-se à mesma coisa. — *Nota do piloto: "control plane" ainda por cima traduz melhor a analogia — é literalmente a mureta.*

---

*E assim encerramos a transmissão, direto do paddock do Kubernetes: oito etapas, nenhum abandono, e um cluster inteiro respondendo ao seu rádio. Da cabine, é tudo. Até o próximo GP do calendário — e lembre: o farol só apaga para quem está no grid. FIM DE TRANSMISSÃO.*
