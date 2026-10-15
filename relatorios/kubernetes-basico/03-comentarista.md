# Kubernetes Básico: do zero ao autoscaling, com a mão no teclado

> Baseado nas aulas 1–8 (Thiago Adriano / FIAP), mais uma etapa bônus de aplicação profissional.

Este guia ensina Kubernetes do zero, em oito etapas e um bônus, com todos os exercícios rodando em um cluster Minikube na sua máquina. Você começa entendendo por que um orquestrador existe e como conversar com o cluster pelo kubectl; depois estuda a anatomia do cluster e os Pods, Services e ConfigMaps, ReplicaSets e Deployments, volumes persistentes, probes e o HPA. Na etapa bônus, junta essas peças em um deployment de uma imagem real do Docker Hub e decide quais delas o app precisa e quais ficam de fora. Antes das etapas, a seção seguinte apresenta a lente de F1 do guia: uma comparação geral que mostra o mesmo sistema funcionando dentro de uma equipe de Fórmula 1.

Cada etapa só depende do que foi explicado antes dela e traz um exercício pequeno que prova que você entendeu. Kubernetes se aprende executando e errando de propósito, então não pule os blocos "Mão na massa".

**Como usar este guia:** mantenha um terminal aberto ao lado do texto. Todos os comandos foram pensados para o Minikube, que você instala na Etapa 01. Quando um exemplo mostra a saída esperada, compare com a sua. Nomes de pods, IPs e tempos vão variar; a estrutura da saída é o que importa. Quando a saída aparece abreviada, ela está marcada com `(...)`.

**Organize os arquivos por etapa.** Crie uma pasta para cada etapa (`etapa03/`, `etapa04/`, `etapa05/` e assim por diante) e salve os YAMLs dentro dela. Isso é necessário porque o nome `deployment.yaml` se repete nas Etapas 05, 08 e 09, e `service.yaml` e `hpa.yaml` se repetem nas Etapas 08 e 09, e trabalhar numa pasta só faria um arquivo sobrescrever o anterior. Rode os comandos de dentro da pasta da etapa. Ao fim de cada etapa existe um passo de limpeza; execute-o antes de seguir, para que objetos antigos não interfiram nos exercícios seguintes.

## A lente de F1 deste guia

Uma equipe de Fórmula 1 chega a um fim de semana de Grande Prêmio com dois carros, uma garagem no pit lane e algumas dezenas de pessoas com funções bem separadas. Na mureta (o pit wall, a bancada voltada para a pista) ficam o estrategista e os engenheiros que decidem: o que cada carro deve fazer, quando parar, que alvo perseguir. Na garagem ficam os mecânicos, organizados em uma equipe por carro, cada uma com um chefe de mecânicos. Eles não decidem estratégia: montam, ajustam e consertam os carros conforme o que a mureta definiu. Os carros, na pista, são as unidades que de fato fazem o trabalho. O regulamento limita cada equipe a dois carros por corrida, e esse limite vai aparecer algumas vezes como o ponto em que a comparação deixa de valer.

Ninguém na mureta encosta no carro. A informação circula por dois canais: o rádio e o intercom da equipe, por onde passam ordens e perguntas, e a telemetria, centenas de sensores que transmitem continuamente o estado de cada carro. Para entrar nesse canal é preciso estar na frequência da equipe e ter credencial. Tudo o que a equipe sabe e decide fica registrado nos servidores de dados: o plano do fim de semana, as versões de cada peça, o histórico de cada carro. Quem quer saber como um carro está consulta esse registro pelo canal oficial, não vai até a garagem perguntar.

O carro em si é descrito por uma folha de especificação: chassi, unidade de potência (o motor do carro, que junta o motor a combustão e a parte elétrica que recupera e devolve energia), pacote aerodinâmico, cada componente com sua versão. Dois carros montados a partir da mesma folha são equivalentes, e um chassi destruído numa batida é substituído por outro montado a partir da mesma folha. O chassi é descartável; a especificação é o que permanece. Separada dela existe a folha de parâmetros (mapas de motor, modos de energia, alvos), que muda o comportamento do carro sem trocar nenhuma peça. Quem é chamado pelo rádio e pela cronometragem é o número de corrida do carro, nunca o número de série do chassi que está embaixo dele.

É a mesma divisão de trabalho que o Kubernetes faz: o control plane decide como a mureta, os nós executam como as garagens, os Pods rodam como os carros, cada Pod sai de um manifesto como o carro sai da folha de especificação, e tudo o que se sabe e se ordena passa por um canal único, como o rádio e a telemetria. Neste guia, você ocupa o lugar de quem escreve o plano e conversa com a mureta pelo rádio.

Uma regra fixa vale para o guia inteiro: cada chassi montado é um Pod. Trocar o chassi é criar um Pod novo, com outro número de série (outro IP), enquanto o número de corrida (o Service) continua o mesmo. Já religar um sistema que desligou dentro do carro, sem trocar o chassi, é reiniciar um container dentro do mesmo Pod.

O quadro abaixo traduz cada termo técnico do guia para uma ideia do dia a dia, sem F1 e sem jargão. Não precisa decorar; volte a ele quando um termo aparecer no texto.

| Termo técnico | Em palavras simples |
|---|---|
| Cluster | Um grupo de computadores que trabalham juntos como se fossem um só. |
| Control plane (master node) | A gerência: decide o que roda em cada computador e acompanha se tudo está como foi pedido, mas não faz o trabalho em si. |
| Worker node | Um dos computadores que faz o trabalho de fato. |
| API Server | O balcão de atendimento: todo pedido e toda consulta passam por ele. |
| kubectl | O aplicativo que você usa para falar com o balcão. |
| kubeconfig | O endereço do balcão e o seu crachá de acesso, guardados num arquivo. |
| Imperativo e declarativo | Dar uma ordem na hora ("faça isto agora") ou deixar por escrito como as coisas devem ficar. |
| Events | O histórico, com horário, do que aconteceu com cada item. |
| etcd | O caderno oficial onde fica anotado tudo o que foi pedido e como cada coisa está agora. |
| kubelet | O encarregado de cada computador, que cuida do que roda ali. |
| kube-proxy | A lista de contatos de cada computador, que sabe para quem repassar cada chamada. |
| Máquina virtual | Um computador inteiro simulado dentro de outro, com sistema operacional próprio: completo, mas pesado. |
| Kernel do hospedeiro | A base do sistema do computador, dividida por todos os programas que rodam nele. |
| Imagem de container | Uma receita fechada e com versão: seguida em qualquer lugar, dá sempre o mesmo resultado. |
| Container | O programa preparado a partir da receita, rodando separado dos outros; pode ser reiniciado sem mexer no resto. |
| Pod | A menor caixa que o sistema gerencia: um ou mais programas que andam sempre juntos. Se a caixa é trocada, é outra caixa, com outro endereço. |
| Segundo container no Pod | Um programa ajudante dentro da mesma caixa, como um gravador que registra o que o principal faz. |
| IP do Pod | O endereço da caixa, que muda quando ela é substituída. |
| Namespace | Pastas separadas dentro do mesmo sistema, cada uma com a sua lista de itens. |
| Label | Uma etiqueta colada no item, usada para achar de uma vez todos os itens do mesmo tipo. |
| Annotation | Um bilhete preso ao item, escrito para pessoas lerem; não serve para buscar. |
| Manifesto YAML | O formulário preenchido que descreve o que você quer, guardado para ser reutilizado. |
| Estado desejado | O pedido permanente, como "quero sempre 3 funcionando", que o sistema trabalha sozinho para manter. |
| Minikube | Uma versão de bancada do sistema, que roda no seu computador para estudar. |
| Service | Um número fixo de atendimento que repassa a ligação para quem estiver disponível, mesmo que as pessoas mudem. |
| ClusterIP, NodePort, LoadBalancer | Um ramal só interno; o mesmo ramal aberto em cada computador para quem liga de fora; um número público divulgado. |
| ConfigMap | A folha de configurações separada do programa, lida quando ele começa a rodar. |
| Secret | A mesma folha, para senhas e chaves, guardada com mais cuidado. |
| ReplicaSet | A regra "sempre N cópias funcionando": se uma some, outra é criada. |
| Deployment | Quem cuida das versões: troca a versão com calma e guarda o histórico das anteriores. |
| Rolling update | Trocar a versão uma cópia de cada vez, sem fechar o atendimento. |
| Rollback | Voltar para a versão anterior, que funcionava. |
| emptyDir | Um rascunho temporário, jogado fora junto com a caixa. |
| hostPath | Uma gaveta de um computador específico: só serve para quem está naquele computador. |
| PVC | O pedido de espaço para guardar dados ("preciso de 1 GB"). |
| PV | O espaço de armazenamento real que atende esse pedido. |
| StorageClass | O cardápio dos tipos de armazenamento que podem ser criados quando alguém pede. |
| restartPolicy | A regra de religar sozinho um programa que caiu, na mesma caixa. |
| Probes | Perguntas de rotina feitas a cada poucos segundos para saber se o programa está bem. |
| Liveness, readiness, startup | "Está vivo?" (se não, reinicia); "pode atender?" (se não, fica fora do atendimento); "já terminou de ligar?" (enquanto não, as outras perguntas esperam). |
| HPA | O ajuste automático do número de cópias conforme o movimento, sempre entre um mínimo e um máximo. |
| metrics-server | O medidor de consumo que alimenta esse ajuste; sem ele, não há números para decidir. |
| resources.requests | A reserva declarada de recursos; as porcentagens de uso são calculadas em cima dela. |

### Onde a comparação para

A comparação ajuda a fixar a divisão de papéis, mas não é uma equivalência perfeita. Estes são os pontos em que a F1 deixa de valer para cada etapa:

- **Etapa 01:** uma equipe repõe um carro em horas, entre sessões, e o regulamento fixa dois carros; o Kubernetes cria um Pod novo em segundos, a qualquer momento, e o limite de quantidade é só o que o cluster aguenta.
- **Etapa 02:** o rádio da F1 é voz, interpretada por pessoas; a API do Kubernetes é um protocolo HTTP rígido, em que cada pedido tem método, caminho e código de resposta, sem nenhuma margem de interpretação.
- **Etapa 03:** os sistemas de um carro são fisicamente integrados e projetados juntos, enquanto os containers de um Pod são processos independentes que podem ser trocados um a um na especificação sem mexer nos outros.
- **Etapa 04:** um número de corrida aponta para um carro só, enquanto o Service distribui requisições entre várias réplicas ao mesmo tempo; o balanceamento de carga não tem equivalente na F1.
- **Etapa 05:** na F1, um carro é reposto entre sessões, em horas, e o regulamento limita a equipe a dois carros; o ReplicaSet repõe em segundos, a qualquer momento, e mantém o número de réplicas que for declarado.
- **Etapa 06:** na F1, os dados do carro são transmitidos ou baixados para os servidores, ou seja, existe uma cópia; o PVC não copia nada, o Pod escreve direto no volume externo, e se o PVC for apagado com política `Delete` os dados vão junto.
- **Etapa 07:** na F1, religar um sistema em pista envolve o piloto e quase sempre custa a sessão; no Kubernetes, o kubelet reinicia o container em segundos, sem intervenção de ninguém, e o Pod continua sendo o mesmo Pod, com o contador de RESTARTS aumentando.
- **Etapa 08:** num GP a equipe corre com exatamente dois carros, por regulamento; o HPA, que coloca mais ou menos réplicas conforme a carga, só tem paralelo numa operação imaginária sem limite de carros, e esta é a etapa em que a comparação mais se afasta da F1 real.
- **Etapa 09:** num carro de F1 o piloto troca mapas e modos pelo volante em plena volta, e o valor novo vale na hora; no Kubernetes, uma variável de ambiente lida de um ConfigMap só muda quando o Pod é recriado.

---

## Etapa 01: Por que o Kubernetes existe

### O problema

Imagine o e-commerce de uma empresa média. Durante onze meses ele recebe um volume previsível de acessos. Na semana da Black Friday, o tráfego multiplica várias vezes. Se você dimensiona os servidores para o dia a dia, o site cai no pico. Se dimensiona para o pico, paga por máquinas ociosas o ano inteiro. A infraestrutura precisa crescer e encolher conforme a demanda.

Existe um segundo problema, menos visível. O desenvolvedor roda a aplicação na própria máquina, o QA testa em outra e a produção é uma terceira. Qualquer diferença de versão de biblioteca, de sistema operacional ou de configuração produz o clássico "na minha máquina funciona". Manter dev, testes e produção idênticos, na mão, é uma fonte constante de bugs.

Todo projeto de software esbarra nesses dois problemas: manter ambientes iguais e escalar quando a demanda muda. O Kubernetes automatiza a solução dos dois.

### O conceito

A peça comum às duas soluções é o **container**.

Uma máquina virtual (VM) carrega hardware virtualizado e um sistema operacional completo: ocupa gigabytes e leva minutos para subir. Um container compartilha o kernel do sistema operacional da máquina hospedeira e leva apenas os arquivos, binários e bibliotecas de que o app precisa: ocupa megabytes e sobe em segundos. Uma **imagem de container** empacota esse ambiente inteiro e pode ser executada igual em qualquer lugar, o que resolve o "na minha máquina funciona".

Containers resolvem o problema do ambiente e criam outro. Com dezenas ou centenas deles, alguém precisa criá-los, destruí-los, vigiar a saúde de cada um e recriar o que falhar. Fazer isso manualmente não escala. O **Kubernetes (K8s)** é o **orquestrador** que assume essas tarefas.

A ideia central do Kubernetes é o **estado desejado**. Você não executa uma sequência de ordens ("suba este container, depois aquele"). Você declara o resultado que quer ("quero 3 cópias desta aplicação rodando") e o Kubernetes compara continuamente o que existe com o que foi declarado, corrigindo qualquer diferença. Se uma das cópias some às 3h da manhã (o Pod é apagado ou o nó onde ele rodava cai), o cluster percebe que existem 2 cópias em vez de 3 e cria a que falta, sem ninguém acordar. Quando o que falha é só o processo dentro do container, quem reage é outro mecanismo, que você vai separar com clareza na Etapa 07.

![Três colunas: deploy tradicional, com apps direto no sistema operacional; deploy virtualizado, com hypervisor e um sistema operacional por máquina virtual; deploy com containers, com container runtime sobre um único sistema operacional.](/guides/kubernetes/etapa01-evolucao-deploy.svg "Da esquerda para a direita: apps direto no servidor, uma VM com sistema operacional próprio para cada app e containers dividindo o mesmo sistema operacional. | Diagrama: kubernetes.io, The Kubernetes Authors, CC BY 4.0")

### Os conceitos-chave

- **Container**: processo isolado que compartilha o kernel do hospedeiro e leva só o que o app precisa. Muito mais leve que uma VM.
- **Imagem**: pacote imutável com o ambiente do app. O container é uma imagem em execução.
- **Escala horizontal**: mais cópias da aplicação dividindo a carga (é o que o K8s automatiza). Escala vertical é dar mais CPU e RAM à mesma máquina.
- **Cluster e nó (node)**: o K8s organiza máquinas (nós) em um cluster, que é tratado como uma única plataforma.
- **Pod**: o grupo de containers que o K8s gerencia como unidade. É a menor unidade gerenciada (detalhes na Etapa 03).
- **Namespace**: separação lógica de recursos dentro do cluster. Quando você não indica nenhum, o namespace usado é o `default`.
- **kubectl**: ferramenta de linha de comando que conversa com a API REST do cluster (detalhes na Etapa 02).
- **Minikube**: cluster K8s de 1 nó rodando na sua máquina. Feito para estudo, é o laboratório deste guia.
- **Estado desejado**: você declara o que quer, e o K8s faz acontecer e mantém. Se algo cai, ele recria.

### Exemplo comentado: montando o laboratório

```sh
# 1. Instale o Docker Desktop (docker.com). No Linux, use o Docker
#    Engine (docs.docker.com/engine/install). Confirme:
$ docker -v
Docker version 27.x

# 2. Instale o kubectl (kubernetes.io/docs/tasks/tools) e confirme.
#    Use --client: ainda não existe cluster, então só a versão do
#    cliente pode ser consultada (sem --client, o kubectl tentaria falar
#    com um servidor inexistente e imprimiria um erro de conexão)
$ kubectl version --client
Client Version: v1.30.x
Kustomize Version: v5.x

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

# 6. Agora que o cluster existe, a versão completa mostra cliente e servidor:
$ kubectl version --output=yaml
clientVersion:
  (...)
serverVersion:
  (...)
```

A primeira execução do `minikube start` baixa a imagem do cluster e demora alguns minutos. É normal.

### Comandos essenciais

- `minikube start`: sobe o cluster local de 1 nó.
- `minikube stop`: para o cluster sem apagar nada.
- `kubectl version --client`: mostra a versão do kubectl, sem precisar de cluster.
- `kubectl get nodes`: lista os nós e o status de cada um.
- `kubectl get pods`: lista os pods do namespace atual.

### Mão na massa

O menor exercício possível: provar que o laboratório está vivo.

1. Rode `minikube start` e aguarde o "Done!".
2. Rode `kubectl get nodes`. **Observe** o nó `minikube` com `STATUS Ready`. Se aparecer `NotReady`, aguarde 1 minuto e repita.
3. Rode `kubectl get pods`. **Observe** `No resources found in default namespace.` Um cluster vazio e pronto é o ponto de partida da próxima etapa.
4. Bônus: rode `minikube stop` e depois `kubectl get nodes`. **Observe** a mensagem de erro de conexão (o cluster não responde). Suba de novo com `minikube start`. Agora você sabe como "cluster fora do ar" aparece no terminal.

### Dica

Se o `minikube start` falhar, a causa mais comum é o Docker Desktop não estar aberto. No Linux, o equivalente é o serviço parado: `sudo systemctl start docker`. Suba o Docker primeiro e tente de novo.

### Anota aí

> Container é um ambiente leve e replicável; Kubernetes mantém o estado desejado desses containers: você declara o que quer, ele garante.

---

## Etapa 02: kubectl e a API, como você comanda o cluster

### O problema

O cluster está de pé (Etapa 01), mas você ainda não sabe como falar com ele. Imagine que o serviço de checkout parou de responder às 2h da manhã e você está de plantão. Você precisa descobrir quais pods existem, em que estado estão, o que o app está imprimindo e, se necessário, entrar no container para investigar. Nada disso pode depender de acesso físico à máquina onde o container roda.

### O conceito

Tudo no Kubernetes passa pela **API REST** do nó master (o *control plane*). O `kubectl` é o cliente dessa API: cada comando que você digita vira uma requisição HTTP (GET, POST, PUT ou DELETE) contra o cluster.

O caminho de um comando é este:

1. Você digita `kubectl get pods`.
2. O kubectl lê o arquivo **kubeconfig**, que guarda o endereço do API Server, as credenciais e o contexto do cluster atual. O Minikube preenche esse arquivo sozinho no `minikube start`.
3. O kubectl envia um `GET` ao API Server (para o namespace `default`, o caminho é `/api/v1/namespaces/default/pods`).
4. A resposta volta e o kubectl a formata no terminal.

A API é dividida em grupos. O grupo "core" tem os recursos fundamentais (pods, services, replicasets); outros grupos cuidam de segurança, armazenamento e autoscaling. Como é REST puro, qualquer linguagem (Python, Go, Java, C#) consegue chamá-la, o que abre espaço para automação.

Existem dois jeitos de trabalhar com o kubectl:

- **Imperativo**: você dá a ordem direta, como em `kubectl run nginx --image=nginx`. É rápido e serve para testes.
- **Declarativo**: você escreve um arquivo YAML que descreve o estado desejado e roda `kubectl apply -f arquivo.yaml`. É o modo dominante em projetos reais, porque o arquivo pode ser versionado no Git, revisado e reaplicado.

Neste guia começamos pelo imperativo, que é mais rápido para aprender, e passamos ao declarativo na Etapa 03.

### Os conceitos-chave

- **API Server**: a porta de entrada do cluster; recebe toda requisição, valida e executa.
- **kubeconfig**: arquivo com endereço do cluster, credenciais e contexto atual.
- **Imperativo vs. declarativo**: dar ordens passo a passo versus descrever o estado final.
- **Events**: histórico de eventos de um objeto (imagem baixada, container criado, falha). Aparece no final do `describe`.
- **Verbos do dia a dia**:
  - `get`: consulta recursos e o status de cada um (`get pods`, `get svc`, `get nodes`).
  - `create` / `run` / `apply`: criam recursos. `run` cria um pod imperativo; `apply -f` aplica um YAML.
  - `delete`: remove. Cuidado, pode afetar quem depende do recurso.
  - `describe`: mostra configuração e a seção Events. É a primeira parada quando algo trava.
  - `logs`: mostra o que o container está imprimindo. É a principal fonte de informação no debug.
  - `exec`: executa um comando dentro do container, por exemplo um shell.

### Exemplo comentado: ciclo de vida de um Pod

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
Name:         nginx
(...)
Events:
  Type    Reason     Age   From               Message
  Normal  Scheduled  35s   default-scheduler  Successfully assigned default/nginx to minikube
  Normal  Pulling    34s   kubelet            Pulling image "nginx:1.14.2"
  Normal  Pulled     20s   kubelet            Successfully pulled image "nginx:1.14.2"
  Normal  Created    20s   kubelet            Created container nginx
  Normal  Started    20s   kubelet            Started container nginx

# O que o container está imprimindo (o nginx escreve o log de acesso na saída
# padrão, então ele só mostra linhas depois que chegam requisições)
$ kubectl logs nginx

# Abre um shell dentro do container (digite "exit" para sair).
# Atenção: depois deste comando você está DENTRO do container e o prompt
# passa a ser "# ". As linhas abaixo que começam com "# " (ls e exit) não
# são comentários: são comandos digitados no shell do container.
$ kubectl exec -it nginx -- /bin/sh
# ls /usr/share/nginx/html
50x.html  index.html
# exit

# De volta ao seu terminal (prompt "$"). Limpeza:
$ kubectl delete pod nginx
pod "nginx" deleted
```

Se o status ficar em `ImagePullBackOff`, o cluster não conseguiu baixar a imagem. Confira o nome e a tag da imagem e a sua conexão com a internet.

Para ver a requisição HTTP por trás de um comando, aumente o nível de log do kubectl. O formato exato muda de versão para versão, mas você deve encontrar uma linha com o método, o caminho da API e o status:

```sh
$ kubectl get pods -v=6
(...) GET https://192.168.49.2:8443/api/v1/namespaces/default/pods?limit=500 200 OK in 12 milliseconds
NAME    READY   STATUS    RESTARTS   AGE
nginx   1/1     Running   0          2m
```

### Comandos essenciais

- `kubectl run nginx --image=nginx:1.14.2 --port=80`: cria um pod imperativo.
- `kubectl get pods`: lista os pods e o status.
- `kubectl describe pod <nome>`: detalhes e Events (troubleshooting).
- `kubectl logs <nome>`: saída do container.
- `kubectl exec -it <nome> -- /bin/sh`: shell dentro do container.
- `kubectl delete pod <nome>`: remove o pod.
- `kubectl get pods -v=6`: mostra a requisição HTTP que o kubectl fez.

### Mão na massa

Execute o ciclo completo e provoque o primeiro erro de propósito.

1. Rode a sequência do exemplo (`run`, `get`, `describe`, `logs`, `delete`). **Observe** a seção `Events` do `describe`: as linhas `Pulling image`, `Created container` e `Started container` contam a história do pod em ordem.
2. Crie um pod quebrado de propósito: `kubectl run quebrado --image=nginx:versao-que-nao-existe`.
3. Rode `kubectl get pods`. **Observe** o status `ErrImagePull`, que logo vira `ImagePullBackOff`.
4. Rode `kubectl describe pod quebrado`. **Observe** nos Events a mensagem dizendo que a imagem não foi encontrada. Você acabou de praticar o fluxo de debug real.
5. Rode `kubectl get pods -v=6` e **observe** a linha com `GET .../api/v1/namespaces/default/pods`. Esse é o comando traduzido em HTTP.
6. Limpe: `kubectl delete pod quebrado`.

### Dica

Grave o fluxo de debug: `get pods` (qual o status?), depois `describe pod` (o que dizem os Events?), depois `logs` (o que o app diz?). Essa sequência resolve a maioria dos problemas.

### Anota aí

> Tudo no K8s é uma chamada à API REST, o kubectl é o cliente dessa API, e quando algo trava o caminho é sempre get, describe, logs.

---

## Etapa 03: A anatomia do cluster e a menor unidade dele, o Pod

### O problema

Na Etapa 02 você criou um pod com um comando imperativo. Funciona, mas há dois furos. Primeiro, você não sabe o que exatamente foi criado nem onde dentro do cluster. Segundo, se amanhã precisar recriar aquele pod idêntico em outro ambiente, só terá a memória do comando que digitou. Além disso, imagine um time com 40 pods no mesmo cluster (checkout, catálogo, pagamento, busca). Como listar apenas os do checkout? Precisamos entender as peças do cluster, descrever os objetos em arquivos versionáveis e agrupá-los por critérios que o próprio Kubernetes consiga usar.

### O conceito

Um **cluster** é um grupo de máquinas (**nodes**) trabalhando juntas, com papéis bem definidos:

- O **master node** (control plane) gerencia o cluster e decide onde executar os Pods.
- Os **worker nodes** executam os Pods e os demais recursos.
- O **etcd** é o banco de dados distribuído que guarda a configuração e o estado de tudo no cluster.
- O **kubelet** é o agente que roda em cada node e gerencia os Pods daquele node.
- O **kube-proxy** encaminha o tráfego de rede até o Pod certo.
- O **API Server** é a porta de entrada, por onde passa tudo que o kubectl faz (Etapa 02).

O **Pod** é a menor unidade que o Kubernetes gerencia: um envelope com um ou mais containers que dividem rede e armazenamento. Quatro fatos sobre Pods:

1. Um Pod representa um processo em execução e pode ter mais de um container, todos dividindo o mesmo IP e os mesmos volumes.
2. **Pods são efêmeros.** Nascem e morrem o tempo todo, e você nunca deve contar com um Pod específico existindo amanhã. Esta frase é a raiz das Etapas 04, 05 e 06.
3. Cada Pod recebe um IP interno do cluster.
4. Pods são descritos em YAML.

Para organizar muitos objetos existem **labels** (rótulos) e **annotations** (anotações). Labels são pares chave-valor usados para **identificar e selecionar** objetos: é por label que um Service encontra seus Pods (Etapa 04) e que um Deployment sabe quais Pods são seus (Etapa 05). Annotations são metadados livres (autor, link de documentação, dados de auditoria) que **não participam de seleção**; servem para pessoas e ferramentas lerem. Essa diferença é uma pergunta clássica de prova.

![Diagrama de um cluster: à esquerda, o control plane com kube-api-server, etcd, scheduler, controller manager e cloud-controller-manager; à direita, dois nós, cada um com kubelet, kube-proxy, runtime de containers e Pods.](/guides/kubernetes/etapa03-arquitetura-cluster.svg "O control plane decide e guarda o estado (API Server, etcd, scheduler, controller manager); cada nó roda os Pods com kubelet e kube-proxy. O cloud-controller-manager só existe em clusters de nuvem. | Diagrama: kubernetes.io, The Kubernetes Authors, CC BY 4.0")

![Quatro Pods com IPs diferentes: o primeiro com um container, o segundo com um container e um volume, o terceiro com dois containers e um volume, o quarto com vários containers e volumes.](/guides/kubernetes/etapa03-pods.svg "Cada Pod tem o próprio IP. Dentro dele, um ou mais containers dividem esse IP e os volumes declarados. | Diagrama: kubernetes.io, The Kubernetes Authors, CC BY 4.0")

### Os conceitos-chave

- **Master node**: gerencia o cluster e decide onde executar os Pods.
- **Worker node**: executa os Pods e demais recursos.
- **etcd**: banco distribuído com a configuração e o estado do cluster.
- **kubelet**: agente de cada node que gerencia os Pods locais.
- **kube-proxy**: encaminha o tráfego de rede para os Pods certos.
- **API Server**: porta de entrada de tudo que o kubectl faz.
- **Pod**: um ou mais containers com rede e volumes compartilhados; efêmero.
- **Label**: chave-valor para identificar e selecionar objetos.
- **Annotation**: metadado livre para documentação, sem papel em seleção.
- **Manifesto**: arquivo YAML que descreve um objeto. Todo manifesto tem `apiVersion`, `kind`, `metadata` e `spec`.

### Exemplo comentado: o primeiro YAML

Crie a pasta `etapa03/` e salve o manifesto abaixo nela como `meu-pod.yaml`. Este é o esqueleto que você precisa saber de cabeça.

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

Todo objeto K8s segue esse esqueleto: `apiVersion` + `kind` + `metadata` + `spec`. O que muda de um objeto para outro é o valor de `kind` e o conteúdo de `spec`; o resto é sempre igual. Quem domina esse esqueleto consegue ler qualquer manifesto.

```sh
# Aplica o YAML (declarativo)
$ kubectl apply -f meu-pod.yaml
pod/meu-pod created

# Lista mostrando os labels
$ kubectl get pods --show-labels
NAME      READY   STATUS    RESTARTS   AGE   LABELS
meu-pod   1/1     Running   0          20s   ambiente=estudo,app=myapp

# Filtra por label: o mecanismo central do K8s
$ kubectl get pods -l app=myapp
NAME      READY   STATUS    RESTARTS   AGE
meu-pod   1/1     Running   0          1m

# Adiciona label num pod que já existe
$ kubectl label pod meu-pod time=devops
pod/meu-pod labeled
```

O filtro `-l` parece simples, mas Services, ReplicaSets e Deployments encontram "seus" Pods exatamente assim, por **label selector**. As próximas etapas dependem desse mecanismo.

### Comandos essenciais

- `kubectl apply -f arquivo.yaml`: cria ou atualiza pelo YAML.
- `kubectl get pods --show-labels`: lista exibindo os rótulos.
- `kubectl get pods -l app=myapp`: filtra por rótulo.
- `kubectl label pod <nome> chave=valor`: adiciona um rótulo a um pod existente.
- `kubectl delete -f arquivo.yaml`: remove o que o arquivo criou.

### Mão na massa

1. Salve o YAML acima como `etapa03/meu-pod.yaml` e aplique com `kubectl apply -f meu-pod.yaml`.
2. Rode `kubectl get pods --show-labels`. **Observe** os dois labels na última coluna.
3. Rode `kubectl get pods -l app=myapp` e depois `kubectl get pods -l app=outra-coisa`. **Observe**: o primeiro encontra o pod, o segundo responde `No resources found in default namespace.` Esse é o mecanismo de seleção em ação.
4. Adicione um label em tempo real com `kubectl label pod meu-pod time=devops` e confirme com `--show-labels`.
5. Não delete o pod agora: ele será o alvo do Service na próxima etapa, e a limpeza dele está no final da Etapa 04. Se você deletou, aplique o YAML de novo. Essa é a vantagem do declarativo: o arquivo recria o objeto idêntico.

### Dica

Labels são seleção operacional (o K8s usa). Annotations são documentação (pessoas usam). Para registrar o autor de um Pod, use uma annotation; para agrupar os Pods de uma aplicação, use um label.

### Anota aí

> Todo objeto K8s é apiVersion + kind + metadata + spec, e labels são o mecanismo pelo qual tudo no cluster encontra tudo.

---

## Etapa 04: Services e ConfigMaps, endereço fixo e configuração externa

### O problema

Pela Etapa 03, Pods são efêmeros e cada Pod novo nasce com um IP diferente. Agora imagine o frontend de um e-commerce chamando a API de pedidos. Hoje a API está no IP `10.244.0.5`. Amanhã o Pod morre, é recriado e passa a ser `10.244.0.9`. Se o frontend tem o IP antigo escrito no código, ele quebra a cada recriação. Como alguém fala com Pods de forma confiável se o endereço muda o tempo todo?

Há um segundo problema. Todo serviço precisa de configuração (portas, URLs de outros serviços, flags). Se esses valores ficam dentro da imagem do container, cada mudança obriga a rebuildar e republicar a imagem. Trocar uma URL não deveria exigir um novo build.

### O conceito

**Problema 1: o Service.** O Service é um ponto de entrada estável que encontra os Pods por label e balanceia o tráfego entre eles. O fluxo é:

1. Uma requisição chega ao Service, que tem IP e nome fixos.
2. O Service seleciona os Pods pelo **label selector** (o mecanismo da Etapa 03).
3. O tráfego é distribuído de forma balanceada entre as réplicas saudáveis.

O nome do Service vira um **hostname interno** do cluster. Se o Service se chama `auth-service`, qualquer Pod do cluster consegue acessar `http://auth-service`, mesmo que os Pods por trás dele troquem de IP repetidamente.

Existem três tipos de Service:

- **ClusterIP** (o padrão): IP interno, acessível só de dentro do cluster. Serve para a comunicação entre serviços (por exemplo, API para banco).
- **NodePort**: abre uma porta fixa (de 30000 a 32767) em cada nó. O acesso de fora é feito por `IP-do-nó:porta`. É o jeito de expor algo no Minikube.
- **LoadBalancer**: provisiona um balanceador externo com IP público. É o tipo usado em produção na nuvem (AWS, GCP, Azure).

**Problema 2: o ConfigMap.** O ConfigMap guarda a configuração em um objeto separado do container. Você o injeta no Pod de três formas:

- **variáveis de ambiente** (a mais comum, via `envFrom`);
- **arquivos montados** (ótimo para configurações longas);
- **argumentos de linha de comando**.

Quando a configuração muda, você atualiza o ConfigMap e a imagem continua a mesma, sem rebuild. Mas atenção a um detalhe: **variáveis de ambiente são lidas quando o container inicia**. Atualizar o ConfigMap não altera as variáveis de um Pod que já está rodando; o Pod precisa ser recriado para enxergar os valores novos (você vai ver isso acontecer na prática na Etapa 09). Já os ConfigMaps montados como arquivos costumam ser atualizados dentro do Pod depois de algum tempo, sem recriá-lo, mas o app precisa reler o arquivo para usar o valor novo.

![Um Service com selector app=A encaminha tráfego para três Pods com o label app: A, gerenciados por um Deployment e um ReplicaSet; um Pod com label app: B fica de fora.](/guides/kubernetes/etapa04-service-labels.svg "O Service encontra os Pods pelo selector `app=A`, não pelo IP. O Pod com `app: B` não recebe tráfego desse Service. Deployment e ReplicaSet aparecem na Etapa 05. | Diagrama: kubernetes.io, The Kubernetes Authors, CC BY 4.0")

### Os conceitos-chave

- **Service**: endereço estável (IP e nome) que seleciona Pods por label e balanceia o tráfego.
- **selector**: o par chave-valor que liga o Service aos Pods; precisa casar com o label dos Pods.
- **port / targetPort / nodePort**: `port` é onde o Service escuta; `targetPort` é a porta do container que recebe; `nodePort` é a porta exposta no nó (só no tipo NodePort).
- **ClusterIP**: acesso interno apenas. **NodePort**: acesso externo por porta do nó. **LoadBalancer**: acesso externo por IP público na nuvem.
- **Endpoints**: a lista de IPs de Pods que o Service está de fato usando; vazia quando nenhum Pod casa com o selector.
- **ConfigMap**: objeto com pares chave-valor de configuração, separado da imagem.
- **envFrom**: injeta todas as chaves de um ConfigMap como variáveis de ambiente (lidas só na criação do container).
- **Secret**: irmão do ConfigMap, destinado a senhas e chaves.

### Exemplo comentado: repare no selector

Crie a pasta `etapa04/` e salve os manifestos desta etapa nela.

```yaml
# app.yaml: salve o Service neste arquivo
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

O `selector` do Service casa com o label do Pod (`app: myapp`), exatamente o `meu-pod` da Etapa 03. É assim que o Service sabe para quem mandar o tráfego.

```sh
$ kubectl apply -f app.yaml
service/meu-service created

$ kubectl get svc
NAME          TYPE        CLUSTER-IP    EXTERNAL-IP   PORT(S)        AGE
kubernetes    ClusterIP   10.96.0.1     <none>        443/TCP        1h
meu-service   NodePort    10.96.xx.xx   <none>        80:30080/TCP   10s

# Gera a URL de acesso (no Windows/Docker, deixe o terminal aberto: é um túnel)
$ minikube service meu-service --url
http://127.0.0.1:53412   ← abra no navegador: página do nginx
```

Agora o ConfigMap, injetado em um Pod como variáveis de ambiente:

```yaml
# configmap-pod.yaml: os dois objetos no mesmo arquivo, separados por ---
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

```sh
$ kubectl apply -f configmap-pod.yaml
configmap/minha-config created
pod/pod-config created

# Confirme a injeção: as chaves do ConfigMap aparecem como variáveis
$ kubectl exec pod-config -- env
(...)
MENSAGEM=olá do configmap!
MODO=estudo
(...)
```

### Comandos essenciais

- `kubectl get svc`: lista os Services.
- `minikube service <nome> --url`: URL de acesso a um NodePort.
- `kubectl get endpoints <service>`: lista os IPs de Pods que o Service está usando.
- `kubectl get configmap`: lista os ConfigMaps.
- `kubectl exec <pod> -- env`: confere as variáveis de ambiente injetadas.

### Mão na massa

1. Com o `meu-pod` da Etapa 03 rodando (label `app: myapp`), salve o YAML do Service como `etapa04/app.yaml` e aplique.
2. Rode `minikube service meu-service --url` e abra a URL no navegador. **Observe** a página de boas-vindas do nginx. Você acessou um Pod efêmero por um endereço estável.
3. Teste o elo: delete o pod (`kubectl delete pod meu-pod`) e recarregue o navegador. **Observe** que a página deixa de carregar (o navegador mostra conexão recusada ou tempo esgotado, dependendo do sistema e do driver), já que não existe mais nenhum Pod com o label. Confirme a causa com `kubectl get endpoints meu-service`: a lista de endpoints está vazia.
   ```sh
   $ kubectl get endpoints meu-service
   NAME          ENDPOINTS   AGE
   meu-service   <none>      5m
   ```
   Recrie o pod com `kubectl apply -f ../etapa03/meu-pod.yaml` e recarregue. O acesso voltou sem você tocar no Service, e `kubectl get endpoints meu-service` volta a mostrar um IP (algo como `10.244.0.7:80`).
4. Aplique o ConfigMap e o pod (`kubectl apply -f configmap-pod.yaml`) e rode `kubectl exec pod-config -- env`. **Observe** `MENSAGEM` e `MODO` na lista de variáveis.
5. Limpe os objetos desta etapa e da anterior:
   ```sh
   $ kubectl delete -f app.yaml -f configmap-pod.yaml -f ../etapa03/meu-pod.yaml
   service "meu-service" deleted
   configmap "minha-config" deleted
   pod "pod-config" deleted
   pod "meu-pod" deleted
   ```
   (A ordem das linhas pode variar.) Feche também o terminal do `minikube service`, com Ctrl+C.

### Dica

Regra de ouro: exponha o mínimo. Um banco de dados deve ser ClusterIP, invisível de fora. Apenas a porta de entrada do sistema vira NodePort ou LoadBalancer. Para senhas e chaves, o irmão seguro do ConfigMap é o Secret.

### Anota aí

> Service dá endereço fixo a Pods que mudam (achando-os por label); ConfigMap tira a configuração de dentro da imagem, mas variáveis de ambiente só mudam quando o Pod é recriado.

---

## Etapa 05: Auto-cura e escala com ReplicaSets e Deployments

### O problema

Até aqui você criou Pods manualmente, o que serve para aprender. Em produção, três situações quebram esse modelo.

1. O único Pod da API morre de madrugada (falta de memória, falha de hardware, bug). O site fica fora do ar até alguém perceber e recriar o Pod.
2. Você precisa lançar a versão 2.0 do app sem derrubar o serviço durante a troca.
3. A versão 2.0 vai ao ar com um bug grave e você precisa voltar para a anterior rapidamente. Um deploy que quebrou na sexta às 18h não pode depender de improviso.

### O conceito

Duas peças resolvem isso, uma embrulhando a outra.

**ReplicaSet: garante o número de réplicas.** Você declara `replicas: 3` e ele monitora os Pods por label selector. Se um Pod some, o ReplicaSet percebe que a contagem caiu e cria outro em segundos, sem ninguém pedir. Essa é a **auto-cura**, o estado desejado da Etapa 01 mantido na prática. O ReplicaSet cuida de Pods que **desaparecem**. Se o que falha é só o processo dentro do container (um crash), o Pod continua existindo e quem reinicia o container é o kubelet, dentro do mesmo Pod; essa separação é detalhada na Etapa 07.

**Deployment: gerencia versões.** Ele cria e gerencia o ReplicaSet por baixo dos panos e adiciona:

- **Rolling Update**: ao trocar a imagem, o Deployment sobe réplicas novas e desliga as antigas gradualmente, e o serviço nunca fica fora do ar.
- **Rollback**: se a versão nova quebrar, `kubectl rollout undo` volta para a anterior em segundos.
- **Escala manual**: `kubectl scale --replicas=5` muda o número de réplicas com um comando.

Cada versão do template tem o seu próprio ReplicaSet. Na troca de versão, o Deployment cria um ReplicaSet novo e vai reduzindo o antigo até zero. O nome de um Pod revela a quem ele pertence: em `nginx-fiap-7d4b9c-aaa`, o trecho `7d4b9c` identifica o ReplicaSet (a versão), e o sufixo final identifica o Pod. Quando o sufixo do meio muda no meio de um rolling update, você está vendo Pods de um ReplicaSet novo.

Os YAMLs de ReplicaSet e Deployment são quase idênticos, mas no dia a dia usamos quase sempre o Deployment, justamente pelo controle de versão.

![Rolling update, quadro 1: um Service na frente de quatro Pods da versão antiga, espalhados por três nós, e o Deployment controlando todos.](/guides/kubernetes/etapa05-rolling-update-1.svg "1. Antes da atualização: todos os Pods rodam a versão antiga atrás do Service. | Diagrama: kubernetes.io, The Kubernetes Authors, CC BY 4.0")
![Rolling update, quadro 2: um Pod da versão nova aparece com um IP novo, e um Pod antigo começa a sair.](/guides/kubernetes/etapa05-rolling-update-2.svg "2. Um Pod novo sobe com outro IP; um antigo começa a sair. | Diagrama: kubernetes.io, The Kubernetes Authors, CC BY 4.0")
![Rolling update, quadro 3: mais um Pod da versão nova entra com IP novo; ainda há Pods antigos atendendo.](/guides/kubernetes/etapa05-rolling-update-3.svg "3. A troca continua um Pod por vez, e o Service segue atendendo com os Pods prontos. | Diagrama: kubernetes.io, The Kubernetes Authors, CC BY 4.0")
![Rolling update, quadro 4: todos os Pods rodam a versão nova, com IPs novos, atrás do mesmo Service.](/guides/kubernetes/etapa05-rolling-update-4.svg "4. Fim: todos os Pods estão na versão nova, e o endereço do Service não mudou. | Diagrama: kubernetes.io, The Kubernetes Authors, CC BY 4.0")

### Os conceitos-chave

- **ReplicaSet**: mantém N réplicas rodando sempre; se uma cai, nasce outra. Seleciona Pods por label selector.
- **Deployment**: gerencia ReplicaSets e o histórico de versões; é o objeto que você usa na prática.
- **template**: o molde de Pod embutido no Deployment (é o esqueleto de Pod da Etapa 03).
- **Rolling Update**: troca gradual de versão, sem downtime.
- **Rollback**: retorno a uma revisão anterior com `rollout undo`.
- **Revisão**: cada alteração do template do Deployment gera uma revisão no histórico, e cada revisão corresponde a um ReplicaSet.

### Exemplo comentado: o Deployment completo e o ciclo de vida

Crie a pasta `etapa05/` e salve o manifesto abaixo nela como `deployment.yaml`.

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

O `template` é literalmente o esqueleto de Pod da Etapa 03 dentro do Deployment. Nada aqui é novo: o Deployment compõe peças que você já conhece.

```sh
$ kubectl apply -f deployment.yaml
deployment.apps/nginx-fiap created
$ kubectl get pods
nginx-fiap-7d4b9c-aaa   1/1   Running
nginx-fiap-7d4b9c-bbb   1/1   Running
nginx-fiap-7d4b9c-ccc   1/1   Running

# O ReplicaSet que o Deployment criou por baixo dos panos
# (o nome do RS é o prefixo dos nomes dos Pods)
$ kubectl get rs
NAME                DESIRED   CURRENT   READY   AGE
nginx-fiap-7d4b9c   3         3         3       30s

# Mate um pod de propósito:
$ kubectl delete pod nginx-fiap-7d4b9c-aaa
pod "nginx-fiap-7d4b9c-aaa" deleted

# Olhe de novo: um pod NOVO já está nascendo pra manter as 3 réplicas
$ kubectl get pods
nginx-fiap-7d4b9c-bbb   1/1   Running
nginx-fiap-7d4b9c-ccc   1/1   Running
nginx-fiap-7d4b9c-ddd   0/1   ContainerCreating   ← auto-cura
```

Nas saídas desta etapa, as colunas RESTARTS e AGE foram omitidas para caber na tela, e os sufixos dos nomes mudam a cada execução (os hashes do exemplo são ilustrativos).

```sh
# Rolling update: troca a imagem
$ kubectl set image deployment/nginx-fiap nginx=nginx:1.16.1
deployment.apps/nginx-fiap image updated
$ kubectl rollout status deployment/nginx-fiap
deployment "nginx-fiap" successfully rolled out

# Um ReplicaSet novo assumiu; o antigo ficou com 0 réplicas (mas continua
# existindo, é ele que permite o rollback)
$ kubectl get rs
NAME                DESIRED   CURRENT   READY   AGE
nginx-fiap-6b5d8f   3         3         3       20s
nginx-fiap-7d4b9c   0         0         0       2m

# Quebre de propósito (imagem que não existe):
$ kubectl set image deployment/nginx-fiap nginx=nginx:nao-existe
$ kubectl get pods
nginx-fiap-6b5d8f-bbb   1/1   Running            ← antigos seguram o serviço
nginx-fiap-9f8e2a-xyz   0/1   ImagePullBackOff   ← novos travados

# Um terceiro ReplicaSet apareceu, com 1 Pod que nunca fica pronto
$ kubectl get rs
NAME                DESIRED   CURRENT   READY   AGE
nginx-fiap-6b5d8f   3         3         3       1m
nginx-fiap-7d4b9c   0         0         0       3m
nginx-fiap-9f8e2a   1         1         0       15s

# Rollback: volta para a revisão anterior à quebrada (nginx:1.16.1)
$ kubectl rollout undo deployment/nginx-fiap
deployment.apps/nginx-fiap rolled back

# Revisões registradas (formato aproximado)
$ kubectl rollout history deployment/nginx-fiap
REVISION  CHANGE-CAUSE
1         <none>
3         <none>
4         <none>
```

O K8s só desliga os Pods antigos quando os novos ficam prontos. Como a imagem quebrada nunca fica pronta, os antigos continuam servindo e o serviço permanece no ar. Um deploy quebrado não derruba o que já funcionava.

Repare também que o `undo` volta para a revisão imediatamente anterior, que aqui usava `nginx:1.16.1`, e não para a original `nginx:1.14.2`. A revisão restaurada ganha um número novo no histórico (a 2 reaparece como 4) e reaproveita o ReplicaSet dela (`6b5d8f`), enquanto o ReplicaSet da versão quebrada (`9f8e2a`) volta a 0 réplicas.

### Comandos essenciais

- `kubectl get rs`: lista os ReplicaSets (um por versão do template).
- `kubectl scale deployment <nome> --replicas=5`: escala manual.
- `kubectl set image deployment/<nome> ctn=img:tag`: dispara um rolling update.
- `kubectl rollout status deployment/<nome>`: acompanha a troca.
- `kubectl rollout history deployment/<nome>`: lista as revisões.
- `kubectl rollout undo deployment/<nome>`: faz o rollback.

### Mão na massa

Este é o exercício central do guia. Vá com calma e observe cada estado.

1. Aplique o `deployment.yaml` e confirme os 3 pods `Running`. Rode também `kubectl get rs` e **observe** o ReplicaSet `nginx-fiap-<hash>` com 3 réplicas: o prefixo dos nomes dos Pods é o nome dele.
2. Delete um pod na mão (copie um nome real do `kubectl get pods`) e rode `kubectl get pods` de novo, rápido. **Observe** o substituto em `ContainerCreating`. Você tentou violar o estado desejado e o cluster corrigiu.
3. Rode o rolling update para `nginx:1.16.1` e acompanhe com `kubectl rollout status`. **Observe** a mensagem de sucesso. Rode `kubectl get rs` e **observe** que há agora dois ReplicaSets: o novo com 3 réplicas e o antigo com 0. É por isso que o sufixo do nome dos Pods mudou.
4. Quebre de propósito com a imagem `nginx:nao-existe`. **Observe** no `kubectl get pods` os pods antigos `Running` segurando o serviço e os novos em `ImagePullBackOff`, e no `kubectl get rs` um terceiro ReplicaSet com `READY 0`.
5. Execute `kubectl rollout undo deployment/nginx-fiap` e confirme com `kubectl rollout history deployment/nginx-fiap`. **Observe** que a lista vai 1, 3, 4: a revisão 2 virou a 4. Confirme a imagem atual com `kubectl describe deployment nginx-fiap | grep Image`, que deve mostrar `nginx:1.16.1`. Você fez um rollback em um comando.
6. Limpe: `kubectl delete -f deployment.yaml` (saída: `deployment.apps "nginx-fiap" deleted`). Os ReplicaSets e Pods do Deployment são removidos junto.

### Dica

Faça o teste da auto-cura pelo menos uma vez: aplicar o deployment, deletar um pod na mão e ver o substituto nascer. É nesse momento que o modelo de "estado desejado" deixa de ser teoria.

### Anota aí

> Ninguém cria Pod avulso em produção: o Deployment garante N réplicas (auto-cura), troca versões sem downtime e volta atrás em um comando, usando um ReplicaSet por versão.

---

## Etapa 06: Volumes, dados que sobrevivem ao Pod

### O problema

Pods são efêmeros, e a Etapa 05 mostrou como isso é frequente: pods são recriados a cada rolling update. Para uma API sem estado isso é ótimo. Para um banco de dados é um desastre. Imagine o Pod do PostgreSQL do e-commerce sendo recriado durante um update, e todos os pedidos da Black Friday desaparecendo junto, porque estavam gravados no sistema de arquivos do container. Dados de verdade não podem viver dentro do container.

### O conceito

O Kubernetes resolve isso com uma cadeia de quatro conceitos: **Volume**, **PersistentVolume (PV)**, **PersistentVolumeClaim (PVC)** e **StorageClass (SC)**.

- O **PVC** é o *pedido* de armazenamento: "quero 1Gi, leitura e escrita por um nó".
- O **PV** é o *disco real* que atende o pedido (NFS, EBS da AWS, hostPath e outros).
- A **StorageClass** descreve *tipos* de disco (padrão, SSD rápido) e permite que o cluster crie PVs automaticamente quando um PVC os solicita.

O Pod referencia apenas o PVC e não precisa saber onde o disco fica fisicamente. Essa separação permite que o mesmo YAML de Pod rode no Minikube e na AWS, mudando só o que atende o pedido. No Minikube, a StorageClass `standard` já provisiona PVs automaticamente: você cria o PVC e o PV aparece.

Os **tipos de volume** mais comuns:

- **emptyDir**: nasce vazio junto com o Pod e **morre com o Pod**. Serve para arquivos temporários e para compartilhar dados entre containers do mesmo Pod.
- **hostPath**: monta um diretório do nó dentro do container. É útil em desenvolvimento e perigoso em produção, porque amarra o Pod àquele nó.
- **persistentVolumeClaim**: o jeito correto para dados de verdade, que sobrevivem a reinício e recriação do Pod.

Os **modos de acesso** do PVC definem quem pode montar o volume:

- **ReadWriteOnce (RWO)**: leitura e escrita por um único nó. É o caso típico de banco de dados.
- **ReadOnlyMany (ROX)**: somente leitura, por vários nós. Serve para assets estáticos.
- **ReadWriteMany (RWX)**: leitura e escrita por vários nós. Exige NFS ou um backend equivalente.

### Os conceitos-chave

- **emptyDir**: volume temporário que vive e morre com o Pod.
- **hostPath**: diretório do nó montado no container; amarra o Pod ao nó.
- **PVC (PersistentVolumeClaim)**: pedido de armazenamento feito pelo usuário.
- **PV (PersistentVolume)**: o disco que atende o pedido.
- **StorageClass**: perfil de armazenamento que provisiona PVs automaticamente.
- **Bound**: status que indica que o PVC foi vinculado a um PV.
- **volumeMounts / volumes**: no Pod, `volumes` declara a origem e `volumeMounts` define onde ela aparece dentro do container.

### Exemplo comentado: escreva, destrua, leia de volta

Crie a pasta `etapa06/` e salve os manifestos desta etapa nela.

```yaml
# pvc.yaml
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
# pod-com-pvc.yaml
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
persistentvolumeclaim/meu-pvc created
pod/pod-persistente created

# Bound = o PV foi criado e vinculado ao pedido
$ kubectl get pvc
NAME      STATUS   VOLUME         CAPACITY   ACCESS MODES
meu-pvc   Bound    pvc-3f2a1...   1Gi        RWO

# Escreva um arquivo no volume
$ kubectl exec pod-persistente -- sh -c "echo 'sobrevivi!' > /dados/teste.txt"

# DESTRUA o pod (o PVC continua existindo)
$ kubectl delete pod pod-persistente
pod "pod-persistente" deleted

# Recrie o pod e leia o arquivo:
$ kubectl apply -f pod-com-pvc.yaml
pod/pod-persistente created
$ kubectl exec pod-persistente -- cat /dados/teste.txt
sobrevivi!            ← o Pod morreu, o dado não
```

Para ver o contraste, crie um segundo manifesto, `pod-emptydir.yaml`, com **outro nome de Pod** e um `emptyDir` no lugar do PVC. Não edite o `pod-com-pvc.yaml` e reaplique: o `spec` de um Pod existente não pode ser alterado (o Kubernetes recusa a mudança de volumes), então a alteração só funciona se o Pod for apagado e criado de novo, ou se for um arquivo e um nome novos, como aqui.

```yaml
# pod-emptydir.yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-efemero              # nome diferente do pod-persistente
spec:
  containers:
    - name: app
      image: nginx:1.14.2
      volumeMounts:
        - name: dados
          mountPath: /dados      # mesmo ponto de montagem do exemplo anterior
  volumes:
    - name: dados
      emptyDir: {}               # nasce vazio com o Pod e morre com o Pod
```

```sh
$ kubectl apply -f pod-emptydir.yaml
pod/pod-efemero created

# Escreva o arquivo, destrua o Pod e recrie-o a partir do mesmo YAML
$ kubectl exec pod-efemero -- sh -c "echo 'vou sumir' > /dados/teste.txt"
$ kubectl delete pod pod-efemero
pod "pod-efemero" deleted
$ kubectl apply -f pod-emptydir.yaml
pod/pod-efemero created

# O arquivo não existe mais: o emptyDir morreu junto com o Pod antigo
$ kubectl exec pod-efemero -- cat /dados/teste.txt
cat: /dados/teste.txt: No such file or directory
command terminated with exit code 1
```

### Comandos essenciais

- `kubectl get pvc`: lista os pedidos de volume (`Bound` indica sucesso).
- `kubectl get pv`: lista os discos persistentes do cluster.
- `kubectl delete pvc <nome>`: remove o pedido. Com a StorageClass `standard` do Minikube, o PV correspondente costuma ser apagado junto, com os dados (a política de reclaim padrão é `Delete`; confira a do seu cluster com `kubectl get storageclass`).

### Mão na massa

1. Aplique o PVC e rode `kubectl get pvc`. **Observe** o `STATUS Bound`: o pedido foi atendido por um PV criado automaticamente. Confirme com `kubectl get pv`.
2. Execute a sequência completa do exemplo: escrever o arquivo, deletar o pod, recriar o pod, ler o arquivo. **Observe** o `sobrevivi!` voltar. Esse é o contrato do PVC.
3. Experimento de contraste: salve o `pod-emptydir.yaml` e repita a sequência (escrever, deletar, recriar, ler). **Observe** o `No such file or directory` no final: o arquivo sumiu. Essa é a diferença entre efêmero e persistente, vista na prática.
4. Limpe, nesta ordem: `kubectl delete pod pod-persistente pod-efemero` e depois `kubectl delete pvc meu-pvc`. Com o PVC apagado, `kubectl get pv` deve ficar vazio (o PV foi removido junto, como descrito acima).

### Dica

Dado importante sempre fica atrás de um PVC. Se os dados sumiram após um restart ou uma recriação, quase certamente estavam em `emptyDir` ou no sistema de arquivos do próprio container.

### Anota aí

> PVC é o pedido, PV é o disco, StorageClass descreve os tipos de disco, e dado que importa mora sempre atrás de um PVC.

---

## Etapa 07: Probes, como o cluster sabe que seu app está vivo

### O problema

Às 3h da manhã, o seu app entra em deadlock. O processo continua de pé, então para o Kubernetes está tudo `Running`, mas nenhuma requisição é respondida. Os mecanismos de recuperação que você viu até aqui agem quando um processo termina ou quando um Pod some; nenhum deles enxerga um processo vivo porém travado. Existe ainda um caso parecido: o app acabou de subir, mas ainda está carregando dados e não deveria receber tráfego, e o Service já está mandando requisições para ele. Sem informação extra, o cluster não distingue "rodando" de "funcionando".

### O conceito

Antes das probes, convém separar três situações que no dia a dia todo mundo chama de "o app caiu", porque cada uma é tratada por um mecanismo diferente:

1. **O processo dentro do container termina** (um crash, falta de memória, uma exceção não tratada). O Pod continua existindo e quem reage é o **kubelet** do nó: ele reinicia o **container dentro do mesmo Pod**, conforme a `restartPolicy` do Pod (o padrão é `Always`). O nome e o IP do Pod não mudam, e a coluna `RESTARTS` sobe. Isso acontece sem nenhuma probe configurada.
2. **O Pod some** (alguém o apagou, o nó caiu). O Pod inteiro deixa de existir e quem reage é o **ReplicaSet** (Etapa 05), que cria um **Pod novo**, com nome e IP novos. Um Pod avulso, sem ReplicaSet ou Deployment, não volta.
3. **O processo continua vivo, mas travado** (deadlock, loop infinito, dependência esgotada). Nada terminou e nenhum Pod sumiu, então os dois mecanismos anteriores não percebem. Só uma **probe de liveness** detecta, e quando ela falha o kubelet reinicia o container, como no caso 1.

As **probes** são verificações de saúde declaradas no manifesto do Pod. O kubelet as executa periodicamente e age conforme o resultado.

São três probes, e o ponto mais importante é o que acontece quando cada uma **falha**:

- **Liveness** pergunta "está vivo?". Se falha, o kubelet **reinicia o container** (dentro do mesmo Pod). É para apps que travam e só voltam com restart.
- **Readiness** pergunta "está pronto para receber requisições?". Se falha, o Pod **sai do balanceador** (o Service para de mandar tráfego) **sem ser reiniciado**. É para apps que carregam dados antes de atender ou que ficam temporariamente indisponíveis.
- **Startup** pergunta "terminou de inicializar?". Enquanto roda, **segura as outras probes**, evitando que a liveness mate um app lento antes da hora.

Cada probe pode verificar de três formas:

- **httpGet**: o kubelet faz um GET em um endpoint (por exemplo `/health`) e espera um status de sucesso (200 OK). É o mais comum. Um status de erro, como 404 ou 500, conta como falha.
- **tcpSocket**: testa se a porta aceita conexão. Serve para serviços que não falam HTTP.
- **exec**: executa um comando dentro do container; código de saída 0 significa saudável.

Boas práticas da aula: use as três probes juntas em produção; use endpoints diferentes para cada probe; comece pelas configurações padrão e ajuste intervalos só quando o app pedir; monitore as falhas de probe (por exemplo, com Prometheus), porque elas são o primeiro sinal de problema.

### Os conceitos-chave

- **restartPolicy**: política do Pod para containers que terminam (padrão `Always`); é o que reinicia um container que caiu, com ou sem probes.
- **Liveness probe**: falhou, o kubelet reinicia o container.
- **Readiness probe**: falhou, o Pod sai do balanceador sem reiniciar.
- **Startup probe**: enquanto não passa, as outras ficam suspensas.
- **httpGet / tcpSocket / exec**: os três mecanismos de verificação.
- **periodSeconds**: de quantos em quantos segundos a probe roda.
- **failureThreshold**: quantas falhas seguidas são toleradas antes de agir (o padrão é 3).
- **initialDelaySeconds**: quanto esperar antes da primeira verificação.

### Exemplo comentado: Pod com as três probes

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
      livenessProbe:           # falhou → REINICIA o container
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

Este YAML é ilustrativo: a imagem `exemplo:latest` é fictícia. O experimento executável vem a seguir, e na Etapa 09 você verá as probes funcionando em uma imagem real.

Uma ressalva sobre a `startupProbe` do exemplo: o `initialDelaySeconds: 120` é válido, mas a forma mais comum de dar tempo a um app lento é multiplicar `failureThreshold` por `periodSeconds` (por exemplo, 30 tentativas a cada 10 segundos dão até 300 segundos). Assim a startupProbe termina assim que o app responde, em vez de esperar sempre um atraso fixo.

### Exemplo comentado: sabotagem didática (executável)

Salve o manifesto em `etapa07/liveness-exec.yaml`. A ideia é usar um container busybox que cria o arquivo `/tmp/healthy`, vive 30 segundos "saudável", apaga o arquivo e continua rodando. A liveness probe executa `cat /tmp/healthy`: com o arquivo presente, o comando sai com 0 (saudável); sem o arquivo, falha. Este é o caso 3 da lista acima: o processo continua vivo (o `sleep 600`), mas deixa de estar saudável.

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
      args:                         # o roteiro da sabotagem:
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
pod/liveness-exec created

# Assista em tempo real (Ctrl+C pra sair).
# Saída abreviada: cada linha nova aparece com dezenas de segundos de
# intervalo. O trecho "(Ns ago)" mostra há quanto tempo foi o último
# reinício, e não o intervalo entre um reinício e o seguinte. O primeiro
# reinício surge cerca de 45s depois do início; os seguintes demoram mais,
# porque o kubelet espera o container encerrar antes de recriá-lo.
$ kubectl get pods -w
NAME            READY   STATUS    RESTARTS
liveness-exec   1/1     Running   0                ← logo após o início
liveness-exec   1/1     Running   1 (2s ago)       ← cerca de 45s depois: restart automático
liveness-exec   1/1     Running   2 (1s ago)       ← um ciclo depois, bem mais tarde: e de novo...

# Investigue como um profissional:
$ kubectl describe pod liveness-exec
Events:
  Warning  Unhealthy  Liveness probe failed: cat: /tmp/healthy: No such file
  Normal   Killing    Container liveness failed liveness probe, will be restarted
```

A linha do tempo do experimento: 30s saudável, o arquivo é apagado, 3 falhas seguidas (o padrão de `failureThreshold`), o kubelet reinicia o container. Como o script recomeça do zero após o restart, o ciclo se repete indefinidamente, de propósito, para você observar. Repare que o Pod é sempre o mesmo (`liveness-exec`): quem foi reiniciado foi o container.

Agora, para enxergar a diferença com o caso 1, provoque um crash sem nenhuma probe:

```sh
# Um container que termina com erro 5 segundos depois de subir, sem probes
$ kubectl run crash --image=busybox -- /bin/sh -c "sleep 5; exit 1"
pod/crash created

# O kubelet reinicia o container sozinho (restartPolicy Always), com
# intervalos cada vez maiores entre as tentativas (formato aproximado)
$ kubectl get pods
NAME    READY   STATUS             RESTARTS      AGE
crash   0/1     CrashLoopBackOff   2 (20s ago)   50s

$ kubectl describe pod crash
(...)
    Last State:     Terminated
      Reason:       Error
      Exit Code:    1
(...)
# Nenhum evento "Liveness probe failed": não há probe nenhuma, e o
# container mesmo assim foi reiniciado pelo kubelet.
```

### Comandos essenciais

- `kubectl get pods -w`: acompanha mudanças em tempo real.
- `kubectl describe pod <nome>`: os Events mostram as falhas de probe; `Last State` mostra por que o container anterior terminou.

### Mão na massa

1. Aplique o `liveness-exec.yaml` e rode `kubectl get pods -w`. **Observe** a coluna `RESTARTS` subir sozinha: a primeira reinicialização aparece cerca de 45 segundos após o início (30s saudável mais 3 falhas espaçadas de 5s). Cada incremento é o kubelet reiniciando um container que parou de passar na verificação.
2. Em outro terminal, rode `kubectl describe pod liveness-exec`. **Observe** nos Events o par `Warning Unhealthy` seguido de `Normal Killing`. Aprenda a reconhecer essa dupla: em produção, ela é o diagnóstico de probe falhando.
3. Rode o experimento do crash (`kubectl run crash ...`) e compare. **Observe** que o `RESTARTS` também sobe, mas o `describe` mostra `Last State: Terminated` com `Exit Code: 1` e nenhum evento `Liveness probe failed`. Este é o caso 1, tratado pelo kubelet sem probe; o do passo 2 é o caso 3, que só a liveness resolve.
4. Limpe: `kubectl delete pod liveness-exec crash`.

### Dica

`Running` não significa saudável. Um app pode estar rodando e travado em um deadlock. É exatamente por isso que as probes existem.

### Anota aí

> Processo que cai o kubelet reinicia, Pod que some o ReplicaSet recria, e processo vivo porém travado só a liveness detecta: liveness falhou reinicia o container, readiness falhou tira o Pod do balanceador sem reiniciar, e startup segura as duas até o app terminar de subir.

---

## Etapa 08: HPA, escala automática baseada em métricas

### O problema

Volte ao e-commerce da Etapa 01: chegou a Black Friday. Você já sabe escalar manualmente com `kubectl scale --replicas=...` (Etapa 05). Ficar de plantão no terminal ajustando réplicas a cada pico de acesso, inclusive às 2h da manhã, não é viável. O cluster deve medir a carga e ajustar o número de réplicas sozinho.

### O conceito

O **Horizontal Pod Autoscaler (HPA)** monitora métricas dos Pods (CPU, memória e outras) e ajusta o número de réplicas entre um mínimo e um máximo definidos por você.

O funcionamento: o HPA compara a utilização atual dos Pods com o **alvo** configurado (por exemplo, manter a média de CPU em 70%). Se a utilização passa do alvo, ele cria réplicas, até o máximo. Se cai, ele remove réplicas, até o mínimo, economizando recursos. O **scale down é propositalmente lento** (cerca de 5 minutos de estabilidade) para evitar oscilações constantes diante de variações rápidas de carga.

Quando um HPA passa a controlar um Deployment, é ele quem decide o número de réplicas dentro da faixa `minReplicas` a `maxReplicas`. O valor `replicas` escrito no manifesto do Deployment vale só até o HPA agir: se ele for maior que o piso e não houver carga, o HPA o reduz depois de alguns minutos (você vai ver isso na Etapa 09).

**Quais métricas o HPA consegue usar.** CPU e memória são lidas nativamente, por meio do metrics-server. As demais exigem componentes adicionais instalados no cluster: métricas personalizadas do seu app (requisições por segundo, tamanho de fila), métricas externas (por exemplo, vindas do Prometheus) e E/S de disco precisam de um adaptador de métricas customizadas ou externas. Sem esse adaptador, só CPU e memória estão disponíveis. A métrica certa depende do perfil do app: um app pesado em CPU escala por CPU; um que consome muita RAM escala por memória.

Dois pré-requisitos costumam ser esquecidos:

1. O cluster precisa do **metrics-server** para ler CPU e memória. No Minikube: `minikube addons enable metrics-server`.
2. O container **precisa declarar `resources.requests.cpu`**, porque "70% de CPU" significa 70% **do que o Pod pediu**. Sem requests, o HPA mostra `<unknown>` e não escala.

![O Horizontal Pod Autoscaler ajusta a escala de um Deployment, que por sua vez controla os Pods 1 a N.](/guides/kubernetes/etapa08-hpa.svg "O HPA não cria Pods: ele muda o número de réplicas do Deployment, e o Deployment cria ou remove os Pods. (RC, no diagrama, é o antigo ReplicationController; neste guia, o alvo é sempre um Deployment.) | Diagrama: kubernetes.io, The Kubernetes Authors, CC BY 4.0")

### Os conceitos-chave

- **HPA**: controlador que ajusta o número de réplicas de um Deployment conforme métricas.
- **metrics-server**: componente que coleta CPU e memória dos Pods; pré-requisito do HPA.
- **resources.requests**: quantidade de recurso que o container declara precisar; base do cálculo de percentual.
- **resources.limits**: teto de recurso que o container pode consumir.
- **milicore (m)**: unidade de CPU; `100m` equivale a 0,1 CPU.
- **minReplicas / maxReplicas**: piso e teto de réplicas; o HPA trabalha dentro dessa faixa.
- **averageUtilization**: percentual médio de uso, relativo ao `requests`, que o HPA tenta manter.
- **Adaptador de métricas**: componente extra necessário para métricas que não sejam CPU ou memória.

### Exemplo comentado: Deployment, HPA, Service e teste de carga

Crie a pasta `etapa08/` e salve os três manifestos nela (os nomes `deployment.yaml` e `service.yaml` também aparecem na Etapa 09, por isso a separação por pasta).

```yaml
# deployment.yaml
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
# hpa.yaml
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

Para o gerador de carga encontrar o app pelo nome, crie também um Service ClusterIP chamado `nginx-hpa`, no mesmo padrão da Etapa 04:

```yaml
# service.yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-hpa              # hostname interno usado pelo gerador
spec:
  type: ClusterIP              # só tráfego interno (regra de ouro da Etapa 04)
  selector:
    app: nginx-hpa             # casa com o label dos pods do Deployment
  ports:
    - port: 80
      targetPort: 80
```

```sh
# Pré-requisito: metrics-server
$ minikube addons enable metrics-server
💡  metrics-server is an addon maintained by Kubernetes. (...)
🌟  The 'metrics-server' addon is enabled

$ kubectl apply -f deployment.yaml -f hpa.yaml -f service.yaml
deployment.apps/nginx-hpa created
horizontalpodautoscaler.autoscaling/nginx-hpa created
service/nginx-hpa created

# Gere carga de dentro do cluster:
$ kubectl run gerador --image=busybox -it --rm -- /bin/sh -c \
  "while true; do wget -q -O- http://nginx-hpa; done"

# Em OUTRO terminal, assista:
$ kubectl get hpa -w
NAME        TARGETS         MINPODS  MAXPODS  REPLICAS
nginx-hpa   cpu: 0%/70%     1        10       1
nginx-hpa   cpu: 152%/70%   1        10       1
nginx-hpa   cpu: 152%/70%   1        10       3    ← escalou sozinho

# Métrica crua que alimenta o HPA (formato aproximado):
$ kubectl top pods
NAME                        CPU(cores)   MEMORY(bytes)
nginx-hpa-5d8f7b6c4-abcde   152m         3Mi

# Pare a carga (Ctrl+C) e aguarde ~5min: as réplicas encolhem de volta.
```

Em produção, ferramentas como K6 e JMeter fazem esse teste de carga de forma controlada.

**Plano B, se o TARGETS não passar de 70%.** O nginx servindo uma página estática é eficiente demais e um único gerador pode não produzir carga suficiente. Há três saídas, da mais simples à mais fiel ao tutorial oficial do Kubernetes:

1. Rode 2 ou 3 geradores em paralelo: repita o `kubectl run` em outros terminais, trocando o nome (`gerador2`, `gerador3`).
2. Reduza `requests.cpu` para `"50m"` no Deployment e reaplique. O mesmo consumo passa a valer o dobro em percentual.
3. Troque a imagem por `registry.k8s.io/hpa-example` (o php-apache do tutorial oficial, que consome CPU a cada requisição e foi feito para esta demonstração).

### Comandos essenciais

- `minikube addons enable metrics-server`: pré-requisito do HPA.
- `kubectl get hpa -w`: acompanha o HPA reagindo à carga.
- `kubectl top pods`: CPU e memória por pod.
- `kubectl autoscale deployment <n> --cpu-percent=70 --min=1 --max=10`: cria um HPA de forma imperativa.

### Mão na massa

O experimento final desta parte, que junta Deployment, Service e HPA.

1. Ative o metrics-server e aplique os três YAMLs (Deployment, HPA, Service). Rode `kubectl get hpa` e **observe** os targets. Se aparecer `<unknown>`, aguarde cerca de 1 minuto: o metrics-server precisa coletar a primeira leitura.
2. Suba o gerador de carga em um terminal e rode `kubectl get hpa -w` em outro. **Observe** o percentual de CPU passar de 70% e, em seguida, a coluna `REPLICAS` subir. Se o percentual estacionar abaixo do alvo, use o plano B. Confirme com `kubectl get pods`: pods novos nasceram sem nenhum comando seu.
3. Pare a carga (Ctrl+C) e continue assistindo. **Observe** que as réplicas levam cerca de 5 minutos para encolher. Essa lentidão é proposital.
4. Rode `kubectl top pods` durante o teste para ver a métrica crua que alimenta o HPA.
5. Limpe: `kubectl delete -f deployment.yaml -f hpa.yaml -f service.yaml`. O pod `gerador` foi criado com `--rm` e já se apagou quando você interrompeu a carga; confirme com `kubectl get pods`. Mantenha o metrics-server ativo, porque a Etapa 09 também usa o HPA.

### Dica

Se o `kubectl get hpa` mostra `<unknown>` nos targets, há duas causas possíveis: o metrics-server não está ativo ou o container não declarou `resources.requests`.

### Anota aí

> HPA é o estado desejado aplicado à escala: você define alvo, piso e teto, mas sem metrics-server e sem resources.requests ele não enxerga nada, e só CPU e memória vêm prontos (o resto exige um adaptador).

---

## Etapa 09: Bônus, aplicação profissional com uma imagem real do Docker Hub

### O problema

As oito etapas anteriores usaram o nginx de propósito: uma imagem simples, sem ruído, para você aprender a mecânica de cada peça. Mas um deployment real não é feito de peças isoladas. Três perguntas só aparecem quando você junta tudo: como as peças se encaixam em um app de verdade, como testar probes em uma aplicação com endpoints de saúde reais (em vez do YAML ilustrativo da Etapa 07) e quais peças usar, ou deixar de fora, para esse app específico.

### O conceito

Esta etapa monta um deployment completo com a imagem `stefanprodan/podinfo` do Docker Hub (`docker.io/stefanprodan/podinfo`). O podinfo é um projeto open source pensado para ser usado em demonstrações. Ele expõe `/healthz` e `/readyz` de verdade, aceita configuração por variáveis de ambiente (`PODINFO_UI_MESSAGE`, `PODINFO_UI_COLOR`) e tem um endpoint `/panic` que **encerra o processo** de propósito.

Esse último ponto merece cuidado, porque `/panic` e liveness testam coisas diferentes. Quando o processo do podinfo termina, quem reinicia o container é o **kubelet, pela `restartPolicy`** do Pod (caso 1 da Etapa 07). Isso aconteceria mesmo que o manifesto não tivesse nenhuma `livenessProbe`. A liveness só entra em ação no caso 3, processo vivo que não responde de forma saudável. Por isso este exercício usa o `/panic` para demonstrar o reinício de um container que caiu, e testa a liveness de verdade apontando a probe para um caminho que não existe, de modo que o endpoint passe a devolver 404 e a probe falhe.

Os quatro manifestos se encaixam pelo label `app: podinfo`, o mesmo mecanismo que costurou o guia inteiro (Etapa 03):

- O **ConfigMap** injeta as variáveis via `envFrom` (Etapa 04).
- O **Deployment** declara 3 réplicas (Etapa 05), `resources.requests` (obrigatório para o HPA, Etapa 08) e duas probes: liveness em `/healthz` e readiness em `/readyz` (Etapa 07).
- O **Service** é NodePort porque aqui o podinfo é o ponto de entrada do sistema, aplicando a regra de ouro da Etapa 04.
- O **HPA** lê a CPU declarada no Deployment e escala entre 2 e 8 réplicas (Etapa 08).

Há uma interação entre o Deployment e o HPA que vale conhecer: o Deployment declara `replicas: 3`, mas o HPA tem `minReplicas: 2`. Enquanto há alguma carga, ou nos primeiros minutos, você verá 3 réplicas. Sem carga, depois de cerca de 5 minutos (a janela de estabilidade da Etapa 08), o HPA reduz o Deployment para 2. A partir daí, quem manda no número de réplicas é o HPA, e o `replicas: 3` do manifesto deixa de valer. Em produção, é comum omitir `replicas` do Deployment quando existe HPA, justamente para evitar essa disputa.

Também importa o que **não** entrou. Nem toda peça aprendida cabe em todo app.

- A **startupProbe** (Etapa 07) ficou de fora porque o podinfo sobe em frações de segundo. Usar uma peça só porque ela existe no manual adiciona configuração sem benefício.
- O **PVC** (Etapa 06) também ficou fora do Deployment, por um motivo técnico. O problema: o PVC da Etapa 06 usa `ReadWriteOnce`, e esse modo não pode ser dividido entre réplicas em nós diferentes. No Minikube (um nó só) colar o `volumes.persistentVolumeClaim` em um Deployment com várias réplicas pode até subir sem reclamar, mas num cluster com vários nós as réplicas extras ficam presas, disputando o mesmo disco (o evento aparece como `FailedAttachVolume`). As saídas, se o app precisasse de estado: um cache compartilhado de verdade (o podinfo tem a flag `--cache-server` para falar com um Redis) ou um disco por réplica, com um StatefulSet e `volumeClaimTemplates`, assunto do módulo avançado. A Etapa 06 continua válida: ela é a resposta certa para o cenário dela, um Pod único com dados, como um banco.

### Os conceitos-chave

- **ConfigMap com envFrom**: configuração externa injetada como variáveis (Etapa 04).
- **Deployment com 3 réplicas**: auto-cura e preparo para rolling update (Etapa 05).
- **Probes reais**: liveness em `/healthz`, readiness em `/readyz` (Etapa 07).
- **restartPolicy**: o que reinicia um container cujo processo terminou (`/panic`), sem relação com a liveness.
- **Service NodePort**: o app é o ponto de entrada, então é exposto (Etapa 04).
- **HPA entre 2 e 8 réplicas**: escala pela CPU declarada em `requests` e, sem carga, reduz as 3 réplicas iniciais para 2 (Etapa 08).
- **Tag de versão fixa**: usar `podinfo:6.14.1` em vez de `latest`, para que o deploy seja reprodutível.
- **rollout restart**: comando que recria os Pods de um Deployment, necessário para que eles leiam um ConfigMap alterado.
- **Endpoints**: lista de Pods que estão de fato recebendo tráfego de um Service; Pods com readiness falhando saem dela.

### Exemplo comentado: os quatro manifestos e o teste completo

Crie a pasta `etapa09/` e salve os quatro manifestos nela.

```yaml
# configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: podinfo-config
data:
  PODINFO_UI_MESSAGE: "olá do pitstop.dev!"   # aparece na tela do app
  PODINFO_UI_COLOR: "#34d399"                 # cor do banner na UI
```

É o mesmo mecanismo da Etapa 04 (`envFrom`), mas aqui as chaves são variáveis que o podinfo realmente lê para montar a própria interface.

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: podinfo
spec:
  replicas: 3                        # auto-cura de verdade, Etapa 05 (o HPA pode reduzir para 2)
  selector:
    matchLabels:
      app: podinfo
  template:
    metadata:
      labels:
        app: podinfo                 # casa com o selector ↑ e com o Service
    spec:
      containers:
        - name: podinfo
          image: stefanprodan/podinfo:6.14.1  # imagem real do Docker Hub, versão fixa (nunca "latest" em produção)
          ports:
            - containerPort: 9898
          envFrom:                   # injeta o ConfigMap inteiro (Etapa 04)
            - configMapRef:
                name: podinfo-config
          resources:                 # obrigatório pro HPA calcular %, Etapa 08
            requests:
              cpu: "100m"
              memory: "64Mi"
            limits:
              cpu: "200m"
              memory: "128Mi"
          livenessProbe:             # "está vivo?" falhou → reinicia o container, Etapa 07
            httpGet:
              path: /healthz
              port: 9898
            periodSeconds: 10
            failureThreshold: 3
          readinessProbe:            # "pronto pro tráfego?" falhou → sai do Service
            httpGet:
              path: /readyz
              port: 9898
            periodSeconds: 5
```

Este manifesto não tem `startupProbe` nem `volumes`, de propósito, pelos motivos explicados acima. Um manifesto profissional declara o que o app precisa, não tudo o que o curso ensinou.

```yaml
# service.yaml
apiVersion: v1
kind: Service
metadata:
  name: podinfo
spec:
  type: NodePort                # ponto de entrada aqui = regra de ouro da Etapa 04
  selector:
    app: podinfo                # acha os Pods pelo label, sempre
  ports:
    - port: 9898
      targetPort: 9898
      nodePort: 30898
```

```yaml
# hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: podinfo
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: podinfo
  minReplicas: 2                 # produção não desce de 2, nem sem carga
  maxReplicas: 8
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
```

Os testes abaixo seguem a ordem do exercício. Eles foram escritos para funcionar tanto com 3 réplicas (nos primeiros minutos) quanto com 2 (depois que o HPA reduz); os pontos em que o número importa estão indicados.

```sh
# 1) Aplica os 4 manifestos de uma vez
$ kubectl apply -f configmap.yaml -f deployment.yaml -f service.yaml -f hpa.yaml
configmap/podinfo-config created
deployment.apps/podinfo created
service/podinfo created
horizontalpodautoscaler.autoscaling/podinfo created

# 2) Espere as réplicas Running e o HPA sair de <unknown> (saída abreviada)
$ kubectl get pods,hpa
NAME                           READY   STATUS    RESTARTS   AGE
pod/podinfo-7f9c6d-abc         1/1     Running   0          1m
pod/podinfo-7f9c6d-def         1/1     Running   0          1m
pod/podinfo-7f9c6d-ghi         1/1     Running   0          1m

NAME                                          REFERENCE            TARGETS       MINPODS   MAXPODS   REPLICAS   AGE
horizontalpodautoscaler.autoscaling/podinfo   Deployment/podinfo   cpu: 3%/70%   2         8         3          1m

# 3) Balanceamento. Num terminal, deixe o túnel aberto:
$ minikube service podinfo --url
http://127.0.0.1:53412   ← não feche este terminal (é o túnel)

# Em OUTRO terminal, cinco requisições seguidas (use a URL que o seu terminal mostrou).
# Cada requisição abre uma conexão nova, então o Service pode escolher réplicas diferentes:
$ for i in 1 2 3 4 5; do curl -s http://127.0.0.1:53412 | grep hostname; done
  "hostname": "podinfo-7f9c6d-abc",
  "hostname": "podinfo-7f9c6d-ghi",
  "hostname": "podinfo-7f9c6d-abc",
  "hostname": "podinfo-7f9c6d-def",
  "hostname": "podinfo-7f9c6d-ghi",

# 4) Pegadinha de produção: mudar o ConfigMap NÃO reinicia os Pods sozinho.
#    Edite o configmap.yaml (troque a mensagem por "mensagem nova") e reaplique:
$ kubectl apply -f configmap.yaml
configmap/podinfo-config configured
$ kubectl exec deploy/podinfo -- env | grep MESSAGE
PODINFO_UI_MESSAGE=olá do pitstop.dev!   ← ainda o valor ANTIGO

$ kubectl rollout restart deployment/podinfo
deployment.apps/podinfo restarted
$ kubectl rollout status deployment/podinfo
deployment "podinfo" successfully rolled out
$ kubectl exec deploy/podinfo -- env | grep MESSAGE
PODINFO_UI_MESSAGE=mensagem nova         ← só agora os Pods leem o valor novo

# 5) Crash do processo: reinício pelo kubelet (restartPolicy), NÃO pela liveness.
#    Guardamos o nome de um Pod para falar sempre com o mesmo.
$ POD=$(kubectl get pods -l app=podinfo -o name | head -n 1)
$ kubectl exec $POD -- curl -s localhost:9898/panic
$ kubectl get pods -w
NAME                 READY   STATUS    RESTARTS      AGE
podinfo-7f9c6d-abc   1/1     Running   1 (4s ago)    3m   ← mesmo Pod, container reiniciado

$ kubectl describe $POD
(...)
    Last State:     Terminated
      Reason:       Error
      Exit Code:    (valor diferente de 0)
(...)
# Nos Events não aparece nenhum "Liveness probe failed": o processo
# terminou, e isso o kubelet resolve sem precisar de probe.

# 6) Liveness de verdade: aponte a probe para um caminho que não existe (404)
$ kubectl patch deployment podinfo --type=json \
  -p='[{"op":"replace","path":"/spec/template/spec/containers/0/livenessProbe/httpGet/path","value":"/nao-existe"}]'
deployment.apps/podinfo patched

# Os Pods novos sobem e passam na readiness (/readyz continua válido), mas
# cerca de 30 segundos depois (3 falhas seguidas, a cada 10s) o RESTARTS começa a subir.
# Durante a falha, o STATUS pode alternar entre Running e CrashLoopBackOff
# (o kubelet espera um intervalo crescente antes de cada novo reinício); isso é esperado:
$ kubectl get pods -w

$ kubectl describe pods -l app=podinfo
Events:
  Warning  Unhealthy  Liveness probe failed: HTTP probe failed with statuscode: 404
  Normal   Killing    Container podinfo failed liveness probe, will be restarted

# Restaure a probe original: reaplicar o manifesto devolve o caminho /healthz.
# Atenção: o apply também devolve replicas para 3 (o valor do manifesto);
# se não houver carga, o HPA volta a reduzir para 2 depois de cerca de 5 minutos.
$ kubectl apply -f deployment.yaml
deployment.apps/podinfo configured

# Espere a troca terminar ANTES do passo seguinte. Sem isso, o "head -n 1"
# do passo 7 pode escolher um Pod antigo que ainda está terminando.
$ kubectl rollout status deployment/podinfo
deployment "podinfo" successfully rolled out

# 7) Readiness de verdade: desliga o /readyz de UM Pod sem matar o processo
$ POD=$(kubectl get pods -l app=podinfo -o name | head -n 1)
$ kubectl exec $POD -- curl -s -X POST localhost:9898/readyz/disable

# Aguarde cerca de 15 segundos (periodSeconds 5 x 3 falhas) e compare:
$ kubectl get pods
NAME                 READY   STATUS    RESTARTS   AGE
podinfo-7f9c6d-abc   0/1     Running   0          6m   ← Running, mas fora do balanceador
podinfo-7f9c6d-def   1/1     Running   0          6m

$ kubectl get endpoints podinfo
NAME      ENDPOINTS           AGE
podinfo   10.244.0.6:9898     6m   ← 1 IP (com 2 réplicas); com 3 réplicas seriam 2 IPs

# Opcional: devolve o Pod ao balanceador
$ kubectl exec $POD -- curl -s -X POST localhost:9898/readyz/enable
```

Duas observações sobre o teste. O `curl` é usado no lugar do `wget` porque é o que a imagem oficial do podinfo traz instalado. E se o `/panic` não derrubar o processo de primeira, repita: a resposta às vezes chega fragmentada antes do processo morrer de fato.

Uma observação sobre o navegador: se você abrir a URL do passo 3 no navegador e recarregar, é comum o hostname **não** mudar a cada recarga. O navegador reaproveita a conexão HTTP aberta, e o balanceamento do Service acontece por conexão, não por requisição. O laço com `curl`, que abre uma conexão nova a cada volta, é o teste confiável. A distribuição também é aleatória, não alternada: podem aparecer repetições seguidas.

### Comandos essenciais

- `kubectl apply -f a.yaml -f b.yaml -f c.yaml -f d.yaml`: aplica vários manifestos de uma vez.
- `kubectl rollout restart deployment/<nome>`: força os Pods a lerem um ConfigMap que mudou.
- `kubectl exec deploy/<nome> -- <comando>`: executa em um Pod do Deployment sem precisar saber o nome exato.
- `kubectl patch deployment <nome> --type=json -p='[...]'`: altera um campo do Deployment sem editar o arquivo.
- `kubectl get endpoints <service>`: mostra quem está de fato recebendo tráfego agora (afetado pela readiness).

### Mão na massa

Neste exercício você monta o deployment completo, provoca falhas controladas e confirma cada comportamento. Os blocos de comandos de cada passo estão no exemplo acima.

1. Salve os quatro YAMLs em `etapa09/` (`configmap.yaml`, `deployment.yaml`, `service.yaml`, `hpa.yaml`) e aplique com um único `kubectl apply` apontando para os quatro arquivos.
2. Rode `kubectl get pods,hpa` até ver os pods `Running` (3 no começo) e o HPA com um valor de CPU real (não `<unknown>`). Se travar, confirme que o metrics-server da Etapa 08 continua ativo. Lembre que, sem carga, o HPA reduzirá as 3 réplicas para 2 em cerca de 5 minutos; isso é esperado, e os passos seguintes funcionam com qualquer um dos dois números.
3. Rode `minikube service podinfo --url`, deixe esse terminal aberto e, em outro, execute o laço `for i in 1 2 3 4 5; do curl -s <URL> | grep hostname; done`. **Observe** mais de um hostname na saída. Se preferir o navegador, saiba que ele costuma reaproveitar a conexão e pode mostrar sempre o mesmo hostname.
4. Reproduza a pegadinha do ConfigMap: edite a mensagem no `configmap.yaml`, aplique com `kubectl apply -f configmap.yaml`, confirme que `kubectl exec ... env` ainda mostra o valor antigo e só depois rode `kubectl rollout restart deployment/podinfo`. Confirme a mudança de novo. (Você também pode usar `kubectl edit configmap podinfo-config`, que abre o editor padrão do sistema, geralmente o vi; editar o arquivo e reaplicar é mais simples e mantém o YAML versionado como fonte da verdade.)
5. Provoque um crash com `curl .../panic` e acompanhe `kubectl get pods -w` até ver o `RESTARTS` subir sozinho, sem você reiniciar nada. **Observe** com `kubectl describe` que o container anterior está em `Terminated` com código de saída diferente de zero e que não há evento de liveness: quem reiniciou foi o kubelet, pela `restartPolicy`.
6. Teste a liveness de verdade: troque o caminho da probe para `/nao-existe` com `kubectl patch`, espere cerca de 30 segundos e **observe** o `RESTARTS` subir (o status pode alternar com `CrashLoopBackOff` entre uma reinicialização e outra, o que é esperado) e, no `describe`, os eventos `Liveness probe failed: HTTP probe failed with statuscode: 404` e `Killing`. Restaure com `kubectl apply -f deployment.yaml` e rode `kubectl rollout status deployment/podinfo`, esperando a mensagem `successfully rolled out` antes do passo 7, para que o `head -n 1` não escolha um Pod antigo que ainda está terminando. Saiba que esse `apply` devolve `replicas` para 3; o HPA reduz de novo para 2 se não houver carga.
7. Desligue a readiness de um Pod com `curl -X POST .../readyz/disable` e, depois de cerca de 15 segundos, confirme com `kubectl get pods` (`READY 0/1`, `RESTARTS` inalterado) e `kubectl get endpoints podinfo` que aquele Pod saiu da lista, sem ser reiniciado. Com 2 réplicas sobra 1 IP; com 3, sobram 2.
8. Feche gerando carga como na Etapa 08 (o mesmo gerador busybox contra `http://podinfo:9898`) e **observe** o HPA escalar este Deployment sozinho.
9. Limpe: `kubectl delete -f configmap.yaml -f deployment.yaml -f service.yaml -f hpa.yaml`. Feche o terminal do `minikube service` com Ctrl+C. Se quiser desligar o laboratório, `minikube stop`.

### Dica

A pegadinha do ConfigMap é um erro comum: editar o ConfigMap não reinicia nada sozinho (a menos que exista algo como um Reloader cuidando disso). Em produção, o comando depois de aplicar uma configuração nova quase sempre é `kubectl rollout restart deployment/<nome>`.

### Anota aí

> Um manifesto profissional não é a soma de tudo que você aprendeu: é a escolha do que o app precisa (ConfigMap, réplicas, probes reais, Service, HPA) e a recusa consciente do que ele não precisa (startupProbe num app rápido, PVC num Deployment com várias réplicas); e crash de processo é tratado pelo kubelet, enquanto só uma probe que falha prova a liveness.

---

## Plataformas gratuitas de prática

Ordem sugerida: comece pelo Killercoda (zero instalação), use o Kube by Example como consulta rápida e deixe o Hard Way para quando as etapas estiverem sólidas.

- **Killercoda** (100% grátis): killercoda.com/kubernetes. Cenários interativos de Kubernetes direto no navegador, com terminal em cluster real e roteiro guiado. Sucessor do Katacoda. Bom para praticar cada etapa deste guia sem instalar nada.
- **Play with Kubernetes** (100% grátis): labs.play-with-k8s.com. Cluster Kubernetes real e temporário (sessões de 4 horas) no navegador, mantido pela Docker. Você monta o cluster na mão com kubeadm. Bom para testar comandos kubectl livremente e entender a montagem de um cluster.
- **Kube by Example** (100% grátis): kubebyexample.com. Tutoriais e exemplos curtos mantidos pela Red Hat, um conceito por página. Bom para revisar um conceito específico rapidamente.
- **Introduction to Kubernetes, LFS158** (100% grátis): training.linuxfoundation.org. Curso oficial gratuito da Linux Foundation, disponível também no edX, com certificado de participação. Bom para consolidar a teoria com o material oficial.
- **Kubernetes the Hard Way** (100% grátis): github.com/kelseyhightower. Roteiro de Kelsey Hightower para montar um cluster peça por peça, sem instaladores. Bom para nível avançado, para entender o que o Minikube esconde.
- **KodeKloud** (free tier + pago): kodekloud.com. Labs guiados no estilo desafio. Alguns labs são gratuitos; o catálogo completo e os simulados CKA/CKAD são pagos. Bom para troubleshooting realista.
- **iximiuz Labs** (free tier + pago): labs.iximiuz.com. Playgrounds de containers e Kubernetes no navegador, com desafios práticos. Bom para experimentos mais profundos (rede, imagens, internals).

---

## Checklist de autoavaliação

O checklist resume o que foi estudado em cada etapa. Marque cada item apenas se você **fez**, não se "entendeu lendo". Se algum ficar em branco, volte à etapa correspondente e refaça o "Mão na massa".

**Etapa 01: Motivação e setup**
- [ ] Sei explicar a diferença entre container e VM e por que o container é mais leve.
- [ ] Subi o Minikube e vi o nó `Ready` no `kubectl get nodes`.
- [ ] Sei o que significa "estado desejado" e consigo dar um exemplo.

**Etapa 02: kubectl e API**
- [ ] Criei um pod imperativo com `kubectl run` e o vi chegar a `Running`.
- [ ] Provoquei um `ImagePullBackOff` de propósito e encontrei a causa nos Events do `describe`.
- [ ] Sei recitar o fluxo de debug: get, describe, logs.
- [ ] Sei explicar o caminho de um comando: kubeconfig, API Server, resposta.

**Etapa 03: Cluster, Pods e labels**
- [ ] Sei citar o papel de master, worker, etcd, kubelet, kube-proxy e API Server.
- [ ] Escrevi um YAML de Pod do zero seguindo apiVersion + kind + metadata + spec.
- [ ] Filtrei pods com `-l` e sei explicar quando usar label e quando usar annotation.

**Etapa 04: Services e ConfigMap**
- [ ] Expus um pod via NodePort e abri a página no navegador com `minikube service --url`.
- [ ] Apaguei o pod, vi o Service ficar sem endpoints (`kubectl get endpoints`) e vi o acesso voltar ao recriar o pod.
- [ ] Sei dizer qual tipo de Service usar para banco interno, teste no Minikube e produção na nuvem.
- [ ] Injetei um ConfigMap como variáveis de ambiente, confirmei com `kubectl exec -- env` e sei explicar por que mudar o ConfigMap não muda as variáveis de um Pod em execução.

**Etapa 05: ReplicaSets e Deployments**
- [ ] Deletei um pod de um Deployment e vi o substituto nascer sozinho (auto-cura).
- [ ] Fiz um rolling update, quebrei um deploy de propósito e voltei com `rollout undo`.
- [ ] Usei `kubectl get rs` para ver um ReplicaSet por versão e sei explicar por que o sufixo do nome dos Pods muda numa troca de versão.
- [ ] Sei explicar por que os pods antigos seguram o serviço quando a imagem nova falha.

**Etapa 06: Volumes**
- [ ] Sei explicar a cadeia PVC (pedido), PV (disco), StorageClass (tipos de disco).
- [ ] Escrevi um arquivo num PVC, destruí o pod, recriei e li o arquivo de volta.
- [ ] Repeti o teste com `emptyDir` (em um Pod de outro nome) e vi o arquivo sumir.
- [ ] Sei dizer quando usar emptyDir, hostPath e persistentVolumeClaim.

**Etapa 07: Probes**
- [ ] Sei dizer o que acontece quando cada probe falha (liveness, readiness, startup).
- [ ] Sei separar os três casos: crash de processo (kubelet reinicia o container), Pod que some (ReplicaSet cria Pod novo) e processo vivo porém travado (só a liveness detecta).
- [ ] Rodei o experimento liveness-exec e vi a coluna RESTARTS subir sozinha, com o par `Unhealthy` e `Killing` nos Events.
- [ ] Sei explicar por que `Running` não significa saudável.

**Etapa 08: HPA**
- [ ] Sei citar os dois pré-requisitos do HPA (metrics-server e resources.requests).
- [ ] Sei dizer quais métricas vêm prontas (CPU e memória) e quais exigem um adaptador.
- [ ] Gerei carga e vi o HPA aumentar as réplicas sem nenhum comando meu.
- [ ] Sei explicar por que o scale down demora cerca de 5 minutos.

**Etapa 09: Aplicação profissional**
- [ ] Apliquei os quatro manifestos do podinfo e vi as réplicas `Running` com o HPA lendo a CPU.
- [ ] Reproduzi a pegadinha do ConfigMap e resolvi com `rollout restart`.
- [ ] Provoquei um crash com `/panic` e sei explicar que o reinício foi feito pelo kubelet (restartPolicy), não pela liveness.
- [ ] Provoquei uma falha real de liveness (probe em um caminho inexistente, 404) e vi os eventos `Liveness probe failed` e `Killing`.
- [ ] Restaurei a probe com `kubectl apply` e esperei o `rollout status` terminar antes de seguir.
- [ ] Tirei um Pod do Service com `/readyz/disable` e confirmei com `kubectl get endpoints` e `READY 0/1`, sem reinício.
- [ ] Sei explicar por que o HPA reduz as 3 réplicas para 2 e por que a startupProbe e o PVC ficaram de fora desse Deployment.

**Próximos passos:** com todos os itens marcados, repita os exercícios em uma das plataformas listadas na seção anterior, desta vez sem consultar o guia. O tema seguinte é o módulo avançado, onde aparece o StatefulSet citado na Etapa 09.

---

## Notas do professor: precisões técnicas

Este bloco reúne detalhes que ajudam a ler os exemplos com segurança. Nada aqui muda o caminho dos exercícios; são esclarecimentos sobre comportamentos que costumam gerar dúvida.

**Sobre o que você vai ver no terminal**

1. **Saídas de exemplo.** As saídas mostradas são formatos típicos. Nomes de pods, hashes de ReplicaSet, IPs, idades e colunas variam conforme a versão do Kubernetes e do ambiente. Compare a estrutura, não o texto exato. O histórico de `rollout history` e as saídas de `kubectl top` são aproximados, e as saídas de `get pods -w` são abreviadas: no ambiente real, as linhas aparecem com intervalos maiores do que o exemplo sugere.
2. **Caminho da API (Etapa 02).** `kubectl get pods` no namespace `default` faz `GET /api/v1/namespaces/default/pods`. O caminho `/api/v1/pods` lista pods de todos os namespaces. O `-v=6` mostra a requisição real, e o formato da linha de log varia entre versões do kubectl.
3. **Versão do kubectl antes do cluster (Etapa 01).** `kubectl version` sem `--client` tenta consultar o servidor. Antes do `minikube start` isso termina em erro de conexão, o que é esperado e não indica instalação defeituosa.
4. **`kubectl get endpoints` (Etapas 04 e 09).** Em versões recentes do Kubernetes, o comando pode exibir um aviso de depreciação em favor de EndpointSlices. Ele continua útil para os exercícios; a alternativa é `kubectl get endpointslices`.

**Sobre comportamentos que surpreendem**

5. **Rollback (Etapa 05).** `rollout undo` volta para a revisão imediatamente anterior, não para a original. No exemplo, restaura `nginx:1.16.1`, não `nginx:1.14.2`. A revisão restaurada recebe um número novo no histórico e reaproveita o ReplicaSet dela.
6. **`kubectl delete pvc` (Etapa 06).** Com a StorageClass `standard` do Minikube, a política de reclaim costuma ser `Delete`: apagar o PVC apaga o PV e os dados. Confira a política do seu cluster com `kubectl get storageclass`. Em ambientes de produção, essa política é uma decisão importante.
7. **Alterar um Pod existente (Etapa 06).** O `spec` de um Pod não pode ser modificado depois de criado (com poucas exceções, como a imagem). Para trocar o tipo de volume, crie um Pod com outro nome ou apague e recrie o Pod.
8. **Tempo do restart (Etapa 07).** No experimento do liveness-exec, a primeira reinicialização ocorre por volta de 45 segundos (30s saudável mais 3 falhas espaçadas de 5s). Os ciclos seguintes podem demorar mais, porque o kubelet aguarda o container encerrar (até 30s por padrão, o `terminationGracePeriodSeconds`) antes de recriá-lo.
9. **Quem reinicia o quê (Etapas 07 e 09).** O kubelet reinicia containers cujo processo terminou, por causa da `restartPolicy`, com ou sem probe. A liveness probe existe para o caso em que o processo continua vivo mas não responde. Um endpoint que derruba o processo (como o `/panic` do podinfo) demonstra o primeiro caso, não o segundo.
10. **Métricas do HPA (Etapa 08).** O HPA lê nativamente CPU e memória, via metrics-server. Requisições por segundo, métricas do Prometheus, E/S de disco e qualquer outra métrica exigem um adaptador de métricas customizadas ou externas instalado no cluster.
11. **HPA e `replicas` (Etapas 08 e 09).** Com um HPA ativo, o número de réplicas é decidido por ele dentro de `minReplicas` e `maxReplicas`. O `replicas` do Deployment funciona como ponto de partida e é ajustado pelo HPA, o que explica as 3 réplicas virarem 2 na Etapa 09. Reaplicar o manifesto (`kubectl apply`) devolve `replicas` ao valor escrito nele, e o HPA volta a ajustar depois da janela de estabilidade.
12. **Balanceamento do Service (Etapa 09).** O balanceamento é por conexão e a escolha da réplica é aleatória. Clientes que reaproveitam a conexão (como um navegador) tendem a falar sempre com a mesma réplica.
13. **startupProbe (Etapa 07).** A forma mais comum de dar tempo a um app lento é `failureThreshold` multiplicado por `periodSeconds`, em vez de um `initialDelaySeconds` fixo. O exemplo com `initialDelaySeconds: 120` é válido e foi mantido por fidelidade ao material de origem.

**Terminologia e pontos a verificar**

14. **Master node e control plane.** O material das aulas usa "Master node". A documentação atual do Kubernetes prefere **control plane**, que é o que aparece na coluna ROLES do `kubectl get nodes` na Etapa 01. Os dois nomes se referem à mesma coisa.
15. **Tag da imagem (Etapa 09).** A tag `stefanprodan/podinfo:6.14.1` vem do material do guia. Confirme no Docker Hub que ela existe antes de executar; se não existir, use uma tag publicada mais recente. A tag fixa, em vez de `latest`, é o ponto didático e permanece.
16. **Manifestos de apoio.** Os arquivos `liveness-exec.yaml` (Etapa 07), `service.yaml` do HPA (Etapa 08) e `pod-emptydir.yaml` (Etapa 06) são complementos de apoio aos exercícios, no padrão da documentação oficial do Kubernetes.
