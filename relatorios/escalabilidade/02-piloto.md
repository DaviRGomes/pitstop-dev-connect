# Escalabilidade nos servidores: do primeiro box ao pit lane que aguenta o pico

> Versão do piloto, reescrita sobre a versão didática (`01-professor.md`) dos seis materiais da disciplina "Escalabilidade nos servidores" (DevOps e Arquitetura Cloud, Fase 2). Cada aula virou uma etapa, na mesma ordem. As aulas originais são conceituais e usam o console da AWS como demonstração; aqui cada etapa ganha um laboratório que roda na sua máquina, sem conta de nuvem. Todo o conteúdo técnico, os comandos, os códigos e a ordem dos exercícios foram preservados. O que muda é a lente: cada conceito de escalabilidade é lido como eu leio um fim de semana de corrida, do pit lane até a fábrica.

No domingo passado, em Sepang, o campeonato inteiro passou por um problema de escala. O GP do Bahrein, disputado na Malásia, largou com atraso por causa da chuva forte; dois safety cars abriram janelas em que muita gente quis parar na mesma volta; a Mercedes fez uma parada perfeita sob pressão para manter o Kimi Antonelli na frente; e o George Russell ficou parado na reta nas voltas finais, atrás do último safety car, ao que tudo indica com a unidade de potência apagada. Pico de demanda, fila no pit lane, ponto único de falha: estava tudo ali, em uma tarde. Escalar servidor é resolver o mesmo problema que o pit lane resolve em todo GP: atender muita coisa ao mesmo tempo, sem que uma falha derrube a corrida inteira.

> **Dados de campeonato usados neste guia (verificados em 2026-10-05).** O backend do pitstop (`localhost:3333`) estava fora do ar no momento da escrita, então conferi em fontes públicas (lista em "Fontes dos dados de F1", no fim). Classificação após a rodada 16 (GP do Bahrein disputado em Sepang, Malásia, em 4 de outubro de 2026): 1. Kimi Antonelli (Mercedes), 320 pontos; 2. George Russell (Mercedes), 236; 3. Lewis Hamilton (Ferrari), 214; 4. Charles Leclerc (Ferrari), 191; 5. Lando Norris (McLaren), 188; 6. Max Verstappen (Red Bull), 188; 7. Oscar Piastri (McLaren), 128; 8. Isack Hadjar (Red Bull), 96; 9. Liam Lawson (Racing Bulls), 65; 10. Pierre Gasly (Alpine), 41. Pódio em Sepang: Verstappen (primeira vitória dele e da Red Bull em 2026), Antonelli e Hamilton. Próxima etapa: GP de Singapura, 9 a 11 de outubro de 2026. Todo cenário com esses nomes que não aconteceu de fato está marcado como hipotético.

**O que você vai saber fazer ao final deste guia:** distinguir desempenho, otimização e escalabilidade e medir a diferença entre elas; explicar escala vertical, horizontal e elasticidade; montar um load balancer com três réplicas e observar algoritmos, failover e deploy canary; tornar uma aplicação stateless com Redis; desacoplar trabalho pesado com fila e workers; inspecionar `Cache-Control`, `304` e cache hit/miss numa borda de CDN; montar uma réplica de leitura de Postgres, aplicar cache-aside e entender sharding e o teorema CAP; e, por fim, juntar tudo numa arquitetura completa, verificá-la com um script e rastreá-la com métricas, logs e um identificador de requisição.

**Pré-requisitos:**

- Docker Engine ou Docker Desktop, com o comando `docker compose` (Compose v2 recente). Confira com `docker compose version`.
- Um terminal com `bash`, `curl`, `awk`, `sort`, `uniq` e `sed` (GNU). Linux, macOS ou WSL servem.
- **Nota para macOS:** o `sed` que vem no macOS é o BSD, que não aceita `sed -i` sem sufixo nem `\n` na substituição. Instale o GNU sed com `brew install gnu-sed` e use `gsed` no lugar de `sed` nos comandos deste guia (a Etapa 02 também traz uma alternativa por edição manual).
- Conhecimento básico de containers (imagem, container, porta publicada, rede do Compose).
- Nada de conta de nuvem. Onde a aula usa AWS (ALB, ASG, SQS, CloudFront, RDS), o laboratório usa um equivalente local e diz claramente onde a analogia termina.

> **Cuidado com limpeza:** cada etapa deixa containers rodando. Ao terminar uma etapa, rode o bloco "Limpeza" dela antes de começar a próxima. Várias etapas usam as mesmas portas (8080, por exemplo).

**Estrutura de pastas do laboratório** (você vai criando aos poucos):

```text
lab-escalabilidade/
  app/                 # a aplicação de teste, compartilhada por várias etapas
  etapa-02/            # load balancer
  etapa-03/            # stateless, fila e workers
  etapa-04/            # CDN (origem + borda)
  etapa-05/            # banco (primary, réplica, cache-aside)
  etapa-06/            # arquitetura completa
```

---

## Quadro de-para: cole isto no volante

A mesma analogia vale do começo ao fim do documento. Se servidor é box na Etapa 01, servidor continua sendo box na Etapa 06. Aqui ficam só as dez peças centrais; você não precisa saber nada de F1 para seguir o guia, porque cada analogia é explicada no ponto em que aparece. O quadro completo, com todas as analogias usadas, está no [Apêndice: quadro de-para completo](#apêndice-quadro-de-para-completo), no fim do documento.

| Escalabilidade | Fórmula 1 |
|---|---|
| Requisição | Um carro entrando no pit lane para ser atendido |
| Servidor, instância ou réplica | Um box com a sua crew completa de pit stop |
| Ponto único de falha (SPOF) | A unidade de potência: não tem reserva, falhou, acabou a corrida |
| Load balancer | O controle de entrada do pit lane, que direciona cada carro a um box livre |
| Stateful e stateless | O set-up na cabeça de um mecânico e o set-up anotado no painel central |
| Redis (estado, fila e cache) | O painel de dados ao vivo da garagem, compartilhado por todos os boxes |
| Fila e worker | A pilha de pneus usados esperando análise e o engenheiro da fábrica que a processa |
| CDN (origem e borda) | A fábrica e o estoque de peças montado em cada circuito |
| Banco primary e read replica | O arquivo oficial na fábrica e a cópia somente leitura no circuito |
| `X-Request-ID` | O transponder: o mesmo número em cada laço de cronometragem |

## Onde a comparação para

A analogia organiza o raciocínio, mas não substitui o modelo técnico. Os limites principais, que eu repito no texto quando aparecem:

- **Um box por equipe.** O regulamento dá a cada equipe um box e dois carros. Na F1 real não existe um controlador distribuindo carros entre boxes: cada carro vai sempre ao box da própria equipe. Servidor não tem regulamento; você abre quantas réplicas o orçamento permitir e qualquer uma pode atender qualquer requisição.
- **Um carro por vez.** Um box de F1 atende um carro por vez. O "box com capacidade 2" do laboratório é um box imaginário com duas posições de serviço.
- **Gente não sobe em segundos.** O número de pessoas operando o carro é limitado e fixo no fim de semana. No autoscaling, a capacidade nasce e morre em minutos, e você paga só pelo que ficou ligado.
- **Peça é matéria; dado é cópia.** Uma peça física sai de um lugar para estar em outro. Um arquivo em cache é copiado sem sair da origem.

Sempre que houver conflito entre a pista e o terminal, vale o que está no terminal: definições, comandos e saídas esperadas do texto técnico.

---

## Etapa 01: Fundamentos de escalabilidade moderna

### O problema

Um aplicativo viraliza depois de uma campanha de marketing. Milhões de usuários tentam acessá-lo ao mesmo tempo e o sistema sai do ar. O que deveria ser sucesso vira frustração e perda de receita. Isso é falha de escala. Grandes varejistas fora do ar na Black Friday e o "Fail Whale" do Twitter (atual X) são os exemplos clássicos, e tecnicamente costumavam vir de gargalos em componentes difíceis de escalar horizontalmente: um banco relacional sobrecarregado ou um sistema de pagamentos que não aguentava a concorrência.

Crescer junto com a demanda é necessidade de negócio, não luxo. Mas há uma armadilha: nem todo sistema lento tem problema de escala. Antes de comprar mais máquinas, é preciso saber o que exatamente está lento.

### O conceito

**Analogia do supermercado:**

- **Desempenho (performance)** é a velocidade de uma única tarefa, ou seja, a latência de uma operação: quantos itens por minuto um caixa escaneia.
- **Otimização** é melhorar o desempenho sem adicionar recursos: ensinar o caixa a escanear 20% mais rápido ou reorganizar os produtos nas prateleiras.
- **Escalabilidade** é a capacidade de aumentar a produtividade (throughput) proporcionalmente aos recursos adicionados. Quando a fila fica gigantesca, não adianta ter o caixa mais rápido do mundo: abrem-se mais caixas.

**Leitura de cockpit:** no nosso mapa, o caixa é o box e cada item escaneado é um pit stop; a lógica do supermercado vale inteira. O que a pista acrescenta é a cena do pico: em Sepang, os safety cars abriram janelas em que muita gente quis parar na mesma volta, e nessa hora a crew mais rápida do mundo não resolve se existir um box só para todo mundo.

**O triângulo de trade-offs.** Performance, custo e complexidade: é praticamente impossível maximizar os três ao mesmo tempo. Banco com hardware de ponta e várias camadas de cache eleva custo e complexidade. Microsserviços podem baratear o custo por requisição em larga escala, mas trazem complexidade operacional enorme comparada a um monolito. O papel do profissional é navegar esses trade-offs conforme os requisitos técnicos e de negócio.

Na F1 esse triângulo tem nome: teto de gastos. Cada décimo de desempenho custa túnel de vento e horas de fábrica, e cada sistema a mais no carro custa complexidade de operação e risco de confiabilidade. Nenhuma equipe maximiza os três; a diferença entre elas está em escolher onde gastar.

**Escala vertical (scaling up)** é aumentar um único servidor: mais CPU, mais RAM, discos mais rápidos.

- Vantagem: simplicidade, geralmente sem mudar código.
- Desvantagens: limite físico e financeiro (o próximo upgrade fica proibitivo ou não existe), costuma exigir downtime para o upgrade e cria um **ponto único de falha (SPOF)**: se o super-servidor cai, tudo cai.

**Leitura de cockpit:** escala vertical é tentar resolver tudo com um único box maior: mais mecânicos, mais pistolas, mais equipamento. Funciona até o box não caber mais na garagem, e continua sendo um box só. O ponto único de falha eu conheço de dentro do carro: a unidade de potência não tem reserva. Foi o que vimos com o George Russell em Sepang, parado na reta nas voltas finais; um único componente sem redundância e a corrida acabou ali, a poucas voltas da bandeirada, com um pódio jogado fora. Servidor único é isso: tudo depende dele.

**Escala horizontal (scaling out)** é adicionar mais servidores para distribuir a carga: uma frota de máquinas menores e mais baratas.

- Vantagem: escala teoricamente ilimitada e mais resiliência, pois a falha de uma instância só redireciona o tráfego para as saudáveis.
- Custo: a aplicação precisa ser projetada para ambiente distribuído (idealmente stateless) e a operação fica mais complexa, com a necessidade de um Load Balancer (próxima etapa).

**Leitura de cockpit:** escala horizontal é abrir mais boxes idênticos no pit lane. Se um box tem problema, os carros vão para os outros. **Aqui a analogia para:** o regulamento dá um box por equipe e dois carros; servidor não tem regulamento, e a frota cresce até onde o orçamento deixar.

**Elasticidade e autoscaling.** Elasticidade é a capacidade de crescer e encolher recursos conforme a carga. Autoscaling é o mecanismo automatizado que a implementa, com regras predefinidas, sem equipe de plantão adicionando servidores na mão. Há três estilos:

| Estilo | Como decide | Exemplo do material |
|---|---|---|
| Baseado em métricas (o mais comum) | Reage a um número medido | "Se a CPU média da frota passar de 70% por mais de 5 minutos, adicione um servidor; se cair abaixo de 30% por 10 minutos, remova um" |
| Agendado | Para demanda previsível | "Todo dia útil às 8h55, suba para 10 servidores; às 18h05, desça para 2" |
| Preditivo | Machine Learning sobre histórico prevê picos | Ajusta a capacidade antes que o pico aconteça |

A automação é a chave para eficiência de custos: paga-se só pelo que se usa.

**Leitura de cockpit:** a regra por métrica é a mureta olhando a fila de carros no pit lane e reagindo. A agendada é a crew já posicionada para a janela de pit que estava no plano de corrida antes da largada. A preditiva é o radar meteorológico: quem lê a chuva antes de ela chegar já está com os intermediários na mão. Sepang mostrou o outro lado: o Lewis Hamilton largou de pneus slick na pista molhada, despencou para o fim do pelotão e precisou de uma recuperação enorme para terminar em terceiro. Previsão errada custa caro, em pista e em nuvem. **Aqui a analogia para:** numa equipe de F1 ninguém contrata mecânico no meio da corrida; no autoscaling, a capacidade nasce e morre em minutos.

**Quando NÃO escalar.** Às vezes o gargalo se resolve com otimização de código ou uma query mais eficiente. Para um sistema interno de 50 funcionários com tráfego baixo e estável, autoscaling é exagero de custo e complexidade. Distinguir problema de escala de problema de otimização é sinal de maturidade.

É como montar um segundo box para um teste privado com um carro só: gente e custo a mais, nenhum décimo ganho.

**Ferramentas citadas no material:** Kubernetes (padrão de orquestração), AWS Auto Scaling Groups (ASG, elasticidade na nuvem), Karpenter (provisiona recursos pela necessidade real, com foco em custo) e KEDA (escala com base em eventos, como o tamanho de uma fila). Microsserviços, contêineres e picos sazonais imprevisíveis são os desafios atuais: a granularidade permite escalar só o componente necessário (por exemplo, o carrinho), mas traz latência de rede e desafios de observabilidade.

**No mercado (segundo o material):** o iFood enfrenta picos em finais de campeonato e dias chuvosos, e responde com microsserviços na nuvem, autoscaling intensivo e filas para desacoplar o processamento de pedidos. A tendência FinOps olha a escalabilidade também pela ótica de custo. Venda de ingressos de festivais e eventos esportivos derrubando sites força o mercado a evoluir em balanceamento, proteção contra bots e cache distribuído via CDN.

### Exemplo comentado: uma "loja" com capacidade limitada

Para sentir a diferença entre otimizar, escalar para cima e escalar para fora, vamos usar uma aplicação de teste que modela um servidor com capacidade finita: cada instância atende no máximo N requisições ao mesmo tempo, e cada requisição leva um tempo fixo. É um **modelo** (uma maquete), não um servidor real, mas deixa os números previsíveis.

Leia a aplicação assim: cada container é um **box**; `CAPACIDADE` é quantos carros ele atende ao mesmo tempo; `TRABALHO_MS` é a duração de cada pit stop; e as requisições que excedem a capacidade esperam a vez, como o carro de trás num double stack. O `/health` responde na hora, sem trabalho, como um radio check que não exige o carro entrar no box. **Aqui a analogia para:** um box de F1 atende um carro por vez; o modelo com capacidade 2 é um box imaginário com duas posições de serviço.

Crie a pasta e os arquivos:

```sh
mkdir -p lab-escalabilidade/app && cd lab-escalabilidade
```

`app/app.py`:

```python
import os
import socket
import threading
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

HOST = socket.gethostname()  # nome do container: identifica quem respondeu
VERSAO = os.getenv("VERSAO", "v1")  # rótulo de versão (usado na Etapa 02)
TRABALHO = float(os.getenv("TRABALHO_MS", "100")) / 1000  # tempo por requisição, em segundos
CAPACIDADE = threading.Semaphore(int(os.getenv("CAPACIDADE", "2")))  # quantas requisições ao mesmo tempo


class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/health":
            corpo = "ok\n"  # health check: responde na hora, sem simular trabalho
        else:
            with CAPACIDADE:  # só N entram de cada vez; as outras esperam na fila
                time.sleep(TRABALHO)  # simula o trabalho real (consulta, cálculo)
            corpo = f"{HOST} {VERSAO}\n"
        dados = corpo.encode()
        self.send_response(200)
        self.send_header("Content-Type", "text/plain")
        self.send_header("Content-Length", str(len(dados)))
        self.end_headers()
        self.wfile.write(dados)


class Servidor(ThreadingHTTPServer):
    request_queue_size = 128  # fila de conexões pendentes maior que o padrão


if __name__ == "__main__":
    Servidor(("0.0.0.0", 8080), Handler).serve_forever()
```

`app/Dockerfile`:

```dockerfile
# Imagem pequena com Python
FROM python:3.12-alpine
# Pasta de trabalho dentro da imagem
WORKDIR /srv
# Copia só o código da aplicação
COPY app.py .
# Documenta a porta que a aplicação escuta
EXPOSE 8080
# -u desliga o buffer de saída, para os logs aparecerem na hora
CMD ["python", "-u", "app.py"]
```

Construa a imagem e defina uma função de carga (100 requisições, 20 em paralelo, e o tempo total):

```sh
# Constrói a imagem com o nome lab-app
docker build -t lab-app ./app

# Função auxiliar: dispara 100 requisições, 20 por vez, contra a URL recebida
carga() { time (seq 1 100 | xargs -P 20 -I{} curl -s -o /dev/null "$1"); }
```

Saída esperada do build (resumida): `naming to docker.io/library/lab-app` ao final.

### Mão na massa

**1. Linha de base: uma instância, capacidade 2, 100 ms por requisição.**

```sh
docker run -d --name base -p 8081:8080 lab-app
curl -s -o /dev/null -w "latência de uma requisição: %{time_total}s\n" localhost:8081/
carga http://localhost:8081/
```

Saída esperada (valores aproximados, sua máquina varia):

```text
latência de uma requisição: 0.10xxxxs
real    0m5.2s
```

A conta: 2 requisições por 100 ms = 20 por segundo; 100 requisições levam cerca de 5 segundos.

Na linguagem do pit lane: um box de duas posições, com 100 ms por pit stop, devolve 20 carros por segundo à pista.

**2. Otimização: mesma máquina, trabalho pela metade.**

```sh
docker run -d --name otim -p 8082:8080 -e TRABALHO_MS=50 lab-app
curl -s -o /dev/null -w "latência: %{time_total}s\n" localhost:8082/
carga http://localhost:8082/
```

Esperado: latência perto de 0.05s e tempo total perto de 2,5s.

É a crew treinada: o mesmo box, cada pit stop na metade do tempo. O meu carro sai antes **e** a fila anda mais rápido.

**3. Escala vertical: um "servidor maior" (capacidade 4).**

```sh
docker run -d --name vert -p 8083:8080 -e CAPACIDADE=4 lab-app
curl -s -o /dev/null -w "latência: %{time_total}s\n" localhost:8083/
carga http://localhost:8083/
```

Esperado: latência continua perto de 0.10s, tempo total perto de 2,5s.

É o box maior: cada pit stop continua durando o mesmo, mas agora cabem quatro carros em serviço de uma vez.

**4. Escala horizontal: três instâncias pequenas, com um "balanceador" feito à mão.**

```sh
docker run -d --name h1 -p 8084:8080 lab-app
docker run -d --name h2 -p 8085:8080 lab-app
docker run -d --name h3 -p 8086:8080 lab-app

# O módulo 3 do número da requisição escolhe a porta 8084, 8085 ou 8086
time (seq 1 100 | xargs -P 20 -I{} sh -c 'curl -s -o /dev/null http://localhost:$((8084 + {} % 3))/')
```

Esperado: tempo total perto de 1,7s (3 instâncias × 20 por segundo = 60 por segundo).

Três boxes idênticos, e o seu `sh -c` fazendo o papel de controle de entrada do pit lane, escolhendo o box pelo número da requisição.

**5. O que observar:**

| Experimento | Latência de 1 requisição | Tempo para 100 requisições |
|---|---|---|
| Base | cerca de 0,10 s | cerca de 5 s |
| Otimização | cerca de 0,05 s | cerca de 2,5 s |
| Vertical | cerca de 0,10 s | cerca de 2,5 s |
| Horizontal (3) | cerca de 0,10 s | cerca de 1,7 s |

Escalar (vertical ou horizontal) **não mexeu na latência** de uma requisição isolada, só no throughput. Otimizar mexeu nos dois. É exatamente a distinção entre desempenho e escalabilidade.

De dentro do carro isso é óbvio: abrir mais boxes não faz o meu pit stop durar menos, só faz caber mais carros. Quem baixa o tempo do meu pit stop é a crew treinada.

**6. O ponto único de falha, ao vivo.**

```sh
docker stop base
curl -s -o /dev/null -w "%{http_code}\n" --max-time 2 localhost:8081/

docker stop h1
for p in 8084 8085 8086; do curl -s -o /dev/null -w "%{http_code} " --max-time 2 localhost:$p/; done; echo
```

Esperado: `000` na primeira (conexão recusada, o SPOF caiu) e `000 200 200` na segunda: com a frota, só um terço falha. Mas quem decide para onde mandar a requisição? Hoje é o seu `sh -c`. Na próxima etapa, é o load balancer.

O `000` do box único é o carro parado na reta: não há para onde desviar. O `000 200 200` é o pit lane com três boxes e um fechado, em que só os carros mandados ao box fechado sofrem. Falta alguém na entrada do pit lane para perceber o box fechado e redirecionar.

**Limpeza:**

```sh
docker rm -f base otim vert h1 h2 h3
```

### Exercícios

1. **Escalar ou otimizar?** Para cada situação, diga qual alavanca usar primeiro e por quê: (a) uma página faz 400 consultas SQL em loop; (b) o site da campanha de Black Friday vai receber 20 vezes o tráfego normal em 3 horas; (c) um sistema interno de 50 funcionários está lento às segundas de manhã. *Resposta esperada:* (a) otimizar (o problema é a query, escalar só multiplicaria o desperdício); (b) escalar horizontalmente, de preferência agendado ou com autoscaling; (c) medir antes, provavelmente otimizar, e evitar autoscaling por ser exagero de custo e complexidade.
2. **Escreva as três regras.** Para uma loja com pico previsível às 20h, escreva uma regra baseada em métrica, uma agendada e descreva o que uma preditiva faria de diferente. *Resposta esperada:* (métrica) "se a CPU média da frota passar de 70% por mais de 5 minutos, adicione um servidor; se cair abaixo de 30% por 10 minutos, remova um"; (agendada) "todo dia às 19h50, suba para o número de servidores que o pico pede, e às 22h desça para o mínimo"; (preditiva) um modelo de Machine Learning treinado no histórico aprende o formato do pico (por exemplo, que sexta-feira é mais forte que terça) e sobe a capacidade antes de ele começar, sem depender de um horário fixo escrito à mão. A diferença de fundo: a regra por métrica reage depois que a carga subiu; a agendada e a preditiva se antecipam.
3. **Triângulo.** Você precisa baixar a latência do banco pela metade. Cite uma solução que sacrifica custo e outra que sacrifica complexidade. *Resposta esperada:* sacrificando custo, hardware de ponta para o banco (escala vertical: mais RAM, discos mais rápidos), o que é simples de operar, mas caro, com teto e ponto único de falha; sacrificando complexidade, uma ou mais camadas de cache (por exemplo, Redis) na frente do banco, que são baratas por unidade, mas trazem novos problemas (invalidação, dado desatualizado). E, antes das duas, vale conferir se uma query ou índice melhor já resolve (otimização, que custa pouco nos três vértices).

### Anota aí

> Escalar aumenta quanto o sistema aguenta (throughput), otimizar faz cada tarefa custar menos; antes de comprar servidor, descubra qual dos dois problemas você tem.

> **Na linguagem do box:** crew treinada baixa o tempo de cada pit stop; mais boxes aumentam quantos carros voltam à pista. Descubra qual dos dois está faltando antes de gastar.

---

## Etapa 02: Load balancers na prática

### O problema

Você tem três servidores idênticos e uma pergunta: como o tráfego chega até eles de forma organizada? Na Etapa 01, o seu `sh -c` fazia o papel de distribuidor e, quando uma instância caiu, um terço das requisições simplesmente falhou. Em produção, ninguém quer um cliente decidindo isso sozinho, e ninguém quer derrubar o site para publicar uma versão nova. É aqui que entra o Load Balancer (balanceador de carga): ele evita sobrecarga, mantém a aplicação no ar mesmo se uma instância falhar e viabiliza deploys com zero downtime (como Netflix e Spotify fazem).

No pit lane, ninguém deixa o carro decidir sozinho onde parar. Existe entrada controlada, limite de velocidade, box designado e liberação segura. É essa ordem que o load balancer traz para o servidor.

### O conceito

**Analogia:** o controlador de tráfego aéreo. Ele direciona os aviões para pistas livres e mantém o aeroporto operando mesmo com uma pista interditada.

Um Load Balancer é um servidor proxy entre clientes e servidores da aplicação, o único ponto de contato e uma abstração: o cliente fala com um endereço só. Ele distribui requisições e garante alta disponibilidade, confiabilidade e gerenciamento simplificado.

**Leitura de cockpit:** no nosso mapa, a torre de controle vira o controle de entrada do pit lane e as pistas do aeroporto viram os boxes. **Aqui a analogia para:** na F1 real, cada carro tem box fixo da própria equipe e não existe controlador distribuindo carros entre boxes. O pit lane de verdade é o caso do IP hash, que aparece logo adiante.

**Camada 4 vs Camada 7 (modelo OSI):**

| | L4 (transporte, TCP/UDP) | L7 (aplicação, HTTP/HTTPS) |
|---|---|---|
| Decide com base em | IP de origem e destino e portas, nos primeiros pacotes | O conteúdo de cada requisição |
| O que enxerga | Nada do conteúdo: buscar imagem e pagar são pacotes iguais | Caminho, `User-Agent`, `Accept-Language`, cookies |
| Vantagem | Extremamente rápido, milhões de requisições por segundo, latência mínima | Roteamento inteligente |
| Exemplos de uso | Jogos online, streaming, balancear outros LBs (AWS NLB) | `/api/pagamentos` para servidores robustos e `/blog` para servidores simples; mobile para versão otimizada; idioma; teste A/B por cookie (AWS ALB) |

**Leitura de cockpit:** o L4 é o laço de cronometragem enterrado no asfalto. Ele lê o transponder, sabe que o carro 12 do Antonelli passou e em que instante, e decide muito rápido, mas não tem ideia do que o carro precisa. O L7 é o engenheiro que ouve o rádio: "macio, mais asa na frente". Com o pedido na mão, ele manda o carro ao box preparado para aquele serviço. Mais inteligente, e mais caro de processar.

**Externo vs interno.** O externo tem interface pública (IP público ou DNS) e é o portão de entrada. O interno só existe dentro da rede privada (VPC) e gerencia a comunicação entre serviços: o "Carrinho" fala com o "Estoque" sem expor o Estoque à internet, o que é ganho de segurança.

Na garagem: o externo é a entrada do pit lane, por onde chega quem vem da pista. O interno é o intercom entre os departamentos da garagem, que liga estratégia, motores e pneus sem que nada disso passe pela pista.

**Algoritmos:**

- **Round-robin:** lista circular, o próximo da fila. Justo e previsível, mas ignora carga e capacidade. A variante **Weighted Round-robin** dá pesos maiores a servidores mais potentes.
- **Least Connections:** manda para quem tem menos conexões ativas. Bom quando as conexões têm durações muito diferentes (uploads, streaming).
- **IP Hashing:** o hash do IP do cliente define o servidor, então o mesmo IP cai sempre no mesmo servidor (afinidade de sessão). Desvantagens: distribuição desigual quando muitos usuários estão atrás do mesmo proxy corporativo e problemas de sessão se um servidor falha e o hash é recalculado.

**Leitura de cockpit:** round-robin é mandar cada carro ao próximo box da fila circular, sem olhar se o box está cheio ou vazio. O weighted dá mais carros ao box com crew maior. O least connections manda ao box com menos carros em serviço, e isso faz diferença quando um pit stop é troca de pneus e outro é troca de asa dianteira, que demora bem mais. O IP hash é exatamente o pit lane real: cada carro sempre no box da própria equipe; o carro do Charles Leclerc nunca vai parar no box da McLaren. A desvantagem também é real: se o box da equipe está com problema, o carro não tem para onde ir.

**Health checks e failover.** O LB testa ativamente a saúde de cada servidor. Parâmetros: intervalo, timeout, *unhealthy threshold* (falhas consecutivas para marcar como não saudável) e *healthy threshold* (sucessos consecutivos para voltar). Falhou: ocorre o **failover**, e o LB para de mandar tráfego novo para a instância doente, de forma transparente. O **connection draining** deixa as conexões existentes terminarem antes de remover a instância.

**Leitura de cockpit:** o health check ativo é o radio check periódico: a cada intervalo, o controle chama o box e espera resposta; algumas falhas seguidas (*unhealthy threshold*) tiram o box de rotação, e alguns sucessos seguidos (*healthy threshold*) o trazem de volta. O failover é desviar o próximo carro para outro box. O connection draining é o que nenhum chefe de mecânicos negocia: o carro que já está no macaco termina o pit stop antes de o box fechar. Liberar o carro com uma roda mal presa dá punição, e o regulamento tem nome para isso: unsafe release.

**Estratégias de deploy:**

- **Blue/Green:** dois ambientes idênticos e isolados. O LB manda 100% para Blue (estável); Green (a nova versão) é validado; a "virada" aponta tudo para Green. O rollback é igualmente rápido. Atenção ao banco compartilhado: mudanças de schema precisam ser retrocompatíveis.
- **Canary:** nome vindo dos canários nas minas de carvão. Uma pequena porcentagem (1%, 5%) vai para a versão nova; monitoram-se métricas técnicas (erros, latência) e de negócio (conversão, engajamento); aumenta-se gradualmente até 100%.

**Leitura de cockpit:** blue/green é ter duas especificações completas do carro prontas (a atual e o pacote de upgrade) e virar tudo de uma vez; se a nova não anda, o rollback é voltar para a especificação anterior, a que funcionava. O canary é o que as equipes fazem com peça nova o tempo todo: o pacote vai primeiro em um carro, a equipe compara a telemetria com o carro irmão e só então leva ao segundo. Exemplo hipotético: se a McLaren levar um assoalho novo para Singapura, montar só no carro do Oscar Piastri e comparar com o do Lando Norris é um canary de 50%. **Aqui a analogia para:** com dois carros, o menor canary possível na F1 é metade da frota; no load balancer você escolhe 1%, 5% ou 10%. E as métricas de negócio do canary (conversão, engajamento) não têm equivalente na pista.

**No mercado (segundo o material):** a Netflix usa LBs internos para desacoplar milhares de microsserviços (se recomendações ficam lentas, o tráfego vai para um fallback ou circuit breakers são ativados, evitando falha em cascata). Service Mesh e API Gateways (Istio e Linkerd, com sidecar proxies agindo como LBs L7 por serviço) trazem observabilidade, mTLS e controle granular. O GSLB (Global Server Load Balancing) usa DNS inteligente para multi-cloud e híbrido: usuário do Brasil vai para São Paulo, da Europa para Frankfurt, conforme geolocalização, latência e saúde.

**Como o laboratório se encaixa:** o Nginx fará o papel do Application Load Balancer (L7). Em AWS, o *listener* é a porta de entrada, o *target group* é o grupo de servidores de destino e o *health check* decide quem está saudável. No Nginx, o `listen` é o listener, o bloco `upstream` é o target group, e a verificação de saúde é **passiva** (o Nginx de código aberto marca um servidor como falho quando as conexões reais dele falham; o health check ativo, que sonda periodicamente, é recurso do NGINX Plus).

Na nossa leitura: o `listen` é a entrada do pit lane, o `upstream` é o conjunto de boxes entre os quais a entrada escolhe, e o health check passivo do Nginx de código aberto é descobrir que um box tem problema só quando um carro real falha nele. O ALB, com sondagem ativa, é o radio check periódico.

### Exemplo comentado: Nginx balanceando 3 réplicas

```sh
mkdir -p etapa-02/nginx && cd etapa-02
```

`docker-compose.yml`:

```yaml
name: lab-etapa-02            # nome fixo do projeto (prefixo de containers e redes)

services:
  app:
    build: ../app             # a imagem da Etapa 01
    image: lab-app            # nome da imagem construída
    environment:
      VERSAO: v1              # versão estável (a "azul")
    deploy:
      replicas: 3             # três cópias idênticas deste serviço
  verde:
    build: ../app
    image: lab-app
    environment:
      VERSAO: v2              # versão nova (a "verde"), usada no canary
  lb:
    image: nginx:1.27-alpine  # o nosso balanceador L7
    ports:
      - "8080:80"             # porta 8080 do host entra na porta 80 do Nginx
    volumes:
      - ./nginx:/etc/nginx/conf.d:ro   # monta a pasta (não o arquivo) para o reload enxergar edições
    depends_on:
      - app                   # o Nginx só sobe depois das réplicas, pois resolve nomes na partida
      - verde
```

`nginx/default.conf`:

```nginx
upstream azul {
    # zone: memória compartilhada entre os processos worker do Nginx; sem ela,
    # cada worker teria o seu próprio contador de round-robin e a distribuição sairia irregular
    zone azul 64k;
    # "app" resolve para os IPs das 3 réplicas; cada IP vira um servidor do grupo
    # max_fails=1 fail_timeout=10s: uma falha tira o servidor de rotação por 10 s (health check passivo)
    server app:8080 max_fails=1 fail_timeout=10s;
}

upstream verde {
    server verde:8080;
}

server {
    listen 80;                          # o listener
    location / {
        proxy_pass http://azul;         # encaminha para o grupo azul (round-robin por padrão)
        proxy_connect_timeout 1s;       # desiste rápido de um servidor que não responde
        proxy_next_upstream error timeout;  # em erro ou timeout, tenta o próximo servidor
    }
}
```

Suba tudo e confira:

```sh
docker compose up -d --build
docker compose ps
```

Saída esperada (resumida): três linhas `lab-etapa-02-app-1/2/3` em `running`, mais `verde` e `lb`.

### Mão na massa

**1. Round-robin.** 30 requisições, contando quem respondeu:

```sh
for i in $(seq 1 30); do curl -s localhost:8080/; done | awk '{print $1}' | sort | uniq -c
```

Esperado (os IDs mudam):

```text
     10 3f2a1b9c0d1e
     10 7c8d9e0f1a2b
     10 a1b2c3d4e5f6
```

Graças à diretiva `zone`, os processos worker do Nginx compartilham o mesmo contador de round-robin, por isso a divisão sai exata. Sem ela, cada worker teria o seu contador e a distribuição poderia sair irregular (por exemplo, 12 para um, 9 para cada um dos outros).

Dez carros para cada box, em ordem circular: round-robin puro.

**2. Failover.** Derrube uma réplica e continue chamando:

```sh
docker stop $(docker compose ps -q app | head -n 1)
for i in $(seq 1 20); do curl -s -o /dev/null -w "%{http_code}\n" localhost:8080/; done | sort | uniq -c
```

Esperado: `20 200`. Nenhuma falha chegou ao cliente. A primeira requisição que cair na réplica morta pode demorar cerca de 1 segundo (o `proxy_connect_timeout`) antes de o Nginx tentar outro servidor. Compare com a Etapa 01, em que `000` apareceu.

Um box fechou, a entrada do pit lane percebeu na falha e mandou os carros seguintes para os outros dois. O segundo de espera é o carro que chegou à porta do box fechado e precisou ser redirecionado.

Traga a réplica de volta e atualize o Nginx, que resolve nomes só na partida e por isso pode estar com um IP desatualizado:

```sh
docker compose up -d
docker compose exec lb nginx -s reload
```

**3. Algoritmos.** Troque para `least_conn` e depois `ip_hash`. (No macOS, use `gsed` no lugar de `sed`, ou edite `nginx/default.conf` à mão: insira a linha `least_conn;` logo abaixo de `upstream azul {` e, depois, troque-a por `ip_hash;`.)

```sh
# Insere "least_conn;" logo depois da abertura do bloco upstream azul
sed -i 's/upstream azul {/upstream azul {\n    least_conn;/' nginx/default.conf
docker compose exec lb nginx -t && docker compose exec lb nginx -s reload

# Agora troca por ip_hash
sed -i 's/least_conn;/ip_hash;/' nginx/default.conf
docker compose exec lb nginx -t && docker compose exec lb nginx -s reload
for i in $(seq 1 10); do curl -s localhost:8080/; done | awk '{print $1}' | sort | uniq -c
```

Esperado com `ip_hash`: uma única linha com `10` e um só servidor. O seu cliente tem sempre o mesmo IP (o do gateway do Docker), logo cai sempre no mesmo servidor: é a afinidade de sessão, e também o desequilíbrio que acontece quando muita gente compartilha um IP. Remova a linha para voltar ao round-robin:

```sh
sed -i '/ip_hash;/d' nginx/default.conf
docker compose exec lb nginx -s reload
```

**Leitura de cockpit do `ip_hash`:** esse é o pit lane da F1. O seu cliente (o mesmo IP) é sempre o mesmo carro, e ele sempre para no mesmo box.

**4. Canary com 10%.** Substitua o conteúdo de `nginx/default.conf` por:

```nginx
upstream azul {
    zone azul 64k;                      # estado de balanceamento compartilhado entre os workers
    server app:8080 max_fails=1 fail_timeout=10s;
}

upstream verde {
    server verde:8080;
}

# Sorteia o destino pelo ID único de cada requisição: 10% vão para "verde", o resto para "azul"
split_clients "${request_id}" $destino {
    10% verde;
    *   azul;
}

server {
    listen 80;
    location / {
        proxy_pass http://$destino;     # o nome do grupo vem da variável sorteada
        proxy_connect_timeout 1s;
        proxy_next_upstream error timeout;
    }
}
```

```sh
docker compose exec lb nginx -t && docker compose exec lb nginx -s reload
seq 1 200 | xargs -P 10 -I{} curl -s localhost:8080/ | awk '{print $2}' | sort | uniq -c
```

Esperado, aproximadamente: `180 v1` e `20 v2` (o sorteio varia um pouco).

Um em cada dez carros sai com o pacote de upgrade; os outros nove continuam com a especificação atual. Se a telemetria do `v2` piorar, ninguém além desses 10% sentiu.

**5. Blue/Green: a virada e o rollback.** (No macOS, use `gsed`, ou edite o arquivo à mão: troque `10%` por `100%` na virada e apague a linha do `verde` no rollback.)

```sh
# Virada: 100% para a versão nova
sed -i 's/10% verde;/100% verde;/' nginx/default.conf
docker compose exec lb nginx -s reload
for i in 1 2 3 4 5; do curl -s localhost:8080/ | awk '{print $2}'; done
# Esperado: v2 cinco vezes

# Rollback: remove a regra do verde e volta tudo para azul
sed -i '/% verde;/d' nginx/default.conf
docker compose exec lb nginx -s reload
for i in 1 2 3 4 5; do curl -s localhost:8080/ | awk '{print $2}'; done
# Esperado: v1 cinco vezes
```

O `nginx -s reload` é gracioso: os processos antigos terminam as conexões em andamento antes de sair, a ideia do connection draining, como a crew antiga que só deixa o box depois de terminar os pit stops em andamento.

**Limpeza (só ao terminar também os exercícios):**

```sh
docker compose down -v
cd ..
```

### Exercícios

Os exercícios 1 e 2 mexem no `nginx/default.conf` e precisam da stack no ar. Se você já rodou a limpeza acima, suba de novo: estando em `lab-escalabilidade`, rode `cd etapa-02 && docker compose up -d --build`. O arquivo `nginx/default.conf` continua no disco no formato do canary/rollback (com o `split_clients`), e é o bloco `location /` desse arquivo que você troca no exercício 1. Depois de editar, rode `docker compose exec lb nginx -t && docker compose exec lb nginx -s reload`. Ao terminar, repita a limpeza.

1. **Roteamento L7.** Troque o bloco `location /` por dois: `location /api/` com `proxy_pass http://verde;` e `location /` com `proxy_pass http://azul;`. Chame `curl -s localhost:8080/api/pagamentos` e `curl -s localhost:8080/blog`. Qual versão responde a cada uma? Isso só é possível em L7: por quê? *Resposta esperada:* `/api/pagamentos` responde com `v2` (o grupo `verde`) e `/blog` responde com `v1` (o grupo `azul`). Só o L7 consegue, porque o caminho `/api/...` está dentro da requisição HTTP, e o L4 enxerga apenas IP e porta.
2. **Pesos.** Qual seria o efeito de `server app:8080 weight=3;` ao lado de outro servidor com peso 1, e em que cenário real você usaria isso? *Resposta esperada:* o servidor de peso 3 receberia cerca de 3 de cada 4 requisições (proporção 3 para 1). É o Weighted Round-robin, útil quando as máquinas são desiguais: um servidor mais potente deve receber mais carga que um menor.
3. **Ingress (leitura).** O Ingress do Kubernetes é o "roteador inteligente" que leva o tráfego externo aos serviços certos. Leia o YAML e diga qual serviço atende `/api/pedidos` e qual atende `/`:

```yaml
apiVersion: networking.k8s.io/v1   # versão da API do recurso Ingress
kind: Ingress                      # tipo do recurso
metadata:
  name: loja                       # nome do Ingress
spec:
  ingressClassName: nginx          # qual controlador de Ingress vai implementá-lo
  rules:
    - host: loja.exemplo.com       # só vale para este domínio
      http:
        paths:
          - path: /api             # requisições que começam com /api
            pathType: Prefix       # casamento por prefixo
            backend:
              service:
                name: api          # vão para o Service "api"
                port:
                  number: 80
          - path: /                # todo o resto
            pathType: Prefix
            backend:
              service:
                name: web          # vai para o Service "web"
                port:
                  number: 80
```

*Resposta esperada:* `/api/pedidos` vai para o Service `api`; `/` vai para o `web`. É o mesmo raciocínio do `location` do Nginx.

Na pista: são as placas na entrada do pit lane, indicando para onde vai cada tipo de serviço.

### Anota aí

> O load balancer é o único ponto de entrada que distribui a carga, tira instâncias doentes de rotação e permite trocar versões sem derrubar ninguém.

> **Na linguagem do box:** uma entrada só para o pit lane, que distribui os carros, para de mandar carro a box com problema e deixa trocar a especificação sem parar a corrida.

---

## Etapa 03: Padrões de escala horizontal em arquiteturas cloud

### O problema

Já temos LB e frota. Mas de que adianta uma frota de carros idênticos se cada um só funciona com um motorista específico? Um cliente coloca café no carrinho, o LB manda a próxima requisição para outra instância, e o carrinho está vazio. E se o processamento de pagamentos for muito mais lento que o resto? Adicionar servidores para tudo é desperdício. Esta etapa olha para dentro da aplicação.

(O material usa "frota de carros" para falar de servidores. Na nossa leitura, servidor continua sendo box, e o problema descrito é o de um box em que só um mecânico sabe o set-up do carro, guardado na cabeça dele.)

Há um segundo cenário, o do e-commerce na Black Friday: confirmar um pedido envolve validar o pagamento, baixar o estoque, emitir a nota fiscal e enviar um e-mail. Feito de forma síncrona, o usuário fica esperando tudo isso olhando para uma tela de carregamento.

Na pista isso seria absurdo: o carro parado no box esperando a Pirelli terminar de analisar os pneus que acabaram de sair dele. Ninguém faz isso. O pneu usado vai para a pilha, o carro volta para a pista, e a análise acontece depois.

### O conceito

**Regra de ouro: stateless.**

- **Stateful:** guarda dados da sessão na memória do servidor (por exemplo, o carrinho numa variável de sessão). O cliente fica "preso" ao servidor; se o LB o manda para outro, o carrinho some. O contorno são as *sticky sessions*, que limitam a resiliência e a eficiência do balanceamento.
- **Stateless:** nenhuma informação de contexto fica entre requisições; cada requisição traz tudo de que precisa. O estado vai para um armazenamento compartilhado e rápido (um banco ou um cache distribuído como o Redis). Qualquer servidor atende qualquer cliente a qualquer momento: é compatível com escala horizontal e com failover automático.

**Analogia:** o atendente que anota o seu pedido no próprio braço (stateful) contra o que escreve numa comanda de papel que fica no balcão (stateless): se o atendente sai, outro lê a comanda e continua.

**Leitura de cockpit:** na garagem, o atendente que anota no braço é o mecânico com o set-up do carro na cabeça, e a comanda de papel é o painel de dados ao vivo da garagem (o Redis do laboratório), compartilhado por todos os boxes. A sticky session é o carro preso ao box onde está o mecânico que lembra dele, que é, de novo, o pit lane real da F1. **Aqui a analogia para:** na F1, prender o carro ao box da equipe é escolha sensata (set-up, peças e pessoas são de cada equipe); no servidor, prender o cliente a uma instância limita o balanceamento e perde o estado quando ela cai.

**Unidades de escala:**

- **Kubernetes ReplicaSet:** garante um número especificado de cópias idênticas de um Pod sempre rodando.
- **AWS Auto Scaling Group (ASG):** gerencia o ciclo de vida de um grupo de instâncias EC2, mantendo a quantidade desejada saudável.

No Compose, o campo `deploy.replicas` que você usou na Etapa 02 cumpre um papel parecido.

Na leitura de pista: é a regra do chefe de equipe, "N boxes prontos, sempre". Caiu um, outro é montado no lugar.

**Workers e filas.** A aplicação principal (o **produtor**) publica uma mensagem numa fila (AWS SQS, RabbitMQ) e responde na hora ("Seu pedido foi recebido e está sendo processado!"). Os **workers** (consumidores) leem a fila e fazem o trabalho pesado de forma assíncrona. Os workers escalam de forma independente, com base no tamanho da fila.

**Leitura de cockpit:** o box é o produtor: atende o carro, devolve à pista e responde "box confirmado" (o `202`). O trabalho pesado vai para uma pilha: pneus usados que a Pirelli recolhe para análise, dados da parada para o debrief. Quem processa essa pilha são os workers, os engenheiros do centro de operações na fábrica (a sala de suporte da Mercedes em Brackley, a garagem remota da Ferrari em Maranello). Se a pilha cresce, chama-se mais gente para a sala de operações, sem tocar em nenhum box. **Aqui a analogia para:** na F1, o número de pessoas nessas salas é fixo durante o fim de semana; workers sobem e descem com a fila.

**Padrões avançados:**

- **Sidecar:** contêiner auxiliar no mesmo Pod do principal, cuidando de logs, monitoramento ou proxy de rede sem a aplicação saber.
- **Ambassador:** variação de proxy focada na comunicação com o exterior ou com outros serviços (retries, descoberta de serviços).
- **Sharding:** escala horizontal de dados; o banco é particionado em bancos menores e independentes (shards). Veremos na Etapa 05.

**Leitura de cockpit:** o sidecar é o registrador de dados instalado ao lado dos sistemas do carro: ele grava e reporta sem que o resto do carro precise saber dele. O ambassador é o team manager: em vez de cada engenheiro falar com a direção de prova, uma pessoa só faz essa ponte com o exterior, com o protocolo certo.

**Trade-offs e resiliência.** Política de autoscaling agressiva dá melhor performance e conta alta; a conservadora economiza e degrada nos picos. FinOps busca o equilíbrio. Em sistemas distribuídos a falha é certa, por isso existem o **Retry** com exponential backoff e o **Fallback** (plano B, como servir do cache ou uma resposta padrão).

**Leitura de cockpit:** retry com backoff é o que o engenheiro faz quando eu não respondo no rádio: chama de novo, e espera cada vez mais entre as chamadas para não congestionar o canal. O fallback é o plano B de estratégia, calculado antes da largada: se o pneu não aguenta, a parada extra já está pronta.

**Ferramentas e mercado (segundo o material):** KEDA (Kubernetes Event-driven Autoscaling) monitora o tamanho de fila no SQS ou o lag de um tópico Kafka e escala workers de zero a N. O Karpenter provisiona nós exatos, mais baratos e adequados no momento. A Netflix popularizou o Circuit Breaker com a biblioteca Hystrix: falhas repetidas "abrem" o circuito, bloqueando chamadas ao serviço falho e indo para o fallback. Instagram e iFood usam workers e filas em larga escala. Serverless (AWS Lambda) é a evolução máxima de workers e filas: escala de zero a milhares de execuções e cobra por execução. Istio e Linkerd implementam Sidecar e Ambassador de forma padronizada.

O circuit breaker tem paralelo direto: quando a direção de prova fecha a entrada do pit lane (bandeira vermelha ou incidente na entrada), nenhum carro tenta entrar e bater na porta fechada; a equipe vai direto para o plano B até a entrada reabrir.

### Exemplo comentado: carrinho stateful vs stateless, e fila com workers

Vamos substituir a aplicação por uma versão completa: carrinho (em memória ou em Redis, conforme a variável `MODO`), endpoint de pedido que enfileira, e um worker. Ela mantém o comportamento da Etapa 01 em `/` e `/health`.

Na nossa leitura: `MODO=memoria` é o mecânico com o set-up na cabeça; `MODO=redis` é o set-up no painel central; `/pedido` é o box que empilha a análise e responde na hora; e o `worker.py` é o engenheiro da sala de operações.

Substitua `app/app.py`:

```python
import json
import os
import socket
import threading
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, urlparse

HOST = socket.gethostname()
VERSAO = os.getenv("VERSAO", "v1")
MODO = os.getenv("MODO", "memoria")  # "memoria" = stateful, "redis" = stateless
TRABALHO = float(os.getenv("TRABALHO_MS", "100")) / 1000
CAPACIDADE = threading.Semaphore(int(os.getenv("CAPACIDADE", "2")))

memoria = {}  # carrinhos guardados no processo (stateful)
r = None
if MODO == "redis":
    import redis  # só é importado quando precisa

    r = redis.Redis(host=os.getenv("REDIS_HOST", "redis"), port=6379, decode_responses=True)


class Handler(BaseHTTPRequestHandler):
    def responder(self, status, corpo, tipo="text/plain"):
        dados = corpo.encode()
        self.send_response(status)
        self.send_header("Content-Type", tipo)
        self.send_header("Content-Length", str(len(dados)))
        self.end_headers()
        self.wfile.write(dados)

    def responder_json(self, status, dados):
        # todo JSON diz quem respondeu (servidor) e em que modo
        corpo = json.dumps({"servidor": HOST, "modo": MODO, **dados}) + "\n"
        self.responder(status, corpo, "application/json")

    def do_GET(self):
        url = urlparse(self.path)
        q = parse_qs(url.query)
        if url.path == "/health":
            return self.responder(200, "ok\n")
        if url.path == "/carrinho":
            user = q.get("user", ["anonimo"])[0]
            # stateless: lê do Redis; stateful: lê da memória deste processo
            itens = r.lrange(f"carrinho:{user}", 0, -1) if r else memoria.get(user, [])
            return self.responder_json(200, {"user": user, "itens": itens})
        with CAPACIDADE:
            time.sleep(TRABALHO)
        self.responder(200, f"{HOST} {VERSAO}\n")

    def do_POST(self):
        url = urlparse(self.path)
        q = parse_qs(url.query)
        if url.path == "/carrinho":
            user = q.get("user", ["anonimo"])[0]
            item = q.get("item", ["?"])[0]
            if r:
                r.rpush(f"carrinho:{user}", item)  # estado externalizado
            else:
                memoria.setdefault(user, []).append(item)  # estado preso ao processo
            return self.responder_json(200, {"ok": True})
        if url.path == "/pedido":
            if r is None:
                return self.responder_json(503, {"erro": "sem fila (use MODO=redis)"})
            pedido = q.get("id", ["0"])[0]
            r.lpush("fila:pedidos", pedido)  # produtor: publica na fila e responde já
            return self.responder_json(202, {"pedido": pedido, "status": "recebido"})
        self.responder(404, "nao encontrado\n")

    def log_message(self, formato, *args):
        # registra quem atendeu e o X-Request-ID (será útil na Etapa 06)
        print(f"[{HOST}] {self.command} {self.path} rid={self.headers.get('X-Request-ID', '-')}", flush=True)


class Servidor(ThreadingHTTPServer):
    request_queue_size = 128


if __name__ == "__main__":
    Servidor(("0.0.0.0", 8080), Handler).serve_forever()
```

Crie `app/worker.py` (o consumidor):

```python
import os
import socket
import time

import redis

HOST = socket.gethostname()
r = redis.Redis(host=os.getenv("REDIS_HOST", "redis"), port=6379, decode_responses=True)

while True:
    # BRPOP espera até 5 s por um item na fila; devolve None se nada chegou
    item = r.brpop("fila:pedidos", timeout=5)
    if item is None:
        continue
    _, pedido = item  # item vem como (nome_da_fila, valor)
    print(f"[{HOST}] processando pedido {pedido}", flush=True)
    time.sleep(1)  # simula nota fiscal e e-mail: 1 s de trabalho pesado
    print(f"[{HOST}] pedido {pedido} concluido", flush=True)
```

Substitua `app/Dockerfile`:

```dockerfile
FROM python:3.12-alpine
WORKDIR /srv
# Cliente Python do Redis (biblioteca pura, instala sem compilar)
RUN pip install --no-cache-dir redis
# Agora a imagem leva a aplicação e o worker
COPY app.py worker.py ./
EXPOSE 8080
CMD ["python", "-u", "app.py"]
```

Crie a pasta da etapa:

```sh
mkdir -p etapa-03/nginx && cd etapa-03
```

`docker-compose.yml`:

```yaml
name: lab-etapa-03

services:
  app:
    build: ../app
    image: lab-app
    environment:
      MODO: ${MODO:-memoria}      # lê MODO do shell; se não existir, usa "memoria"
      REDIS_HOST: redis           # nome do serviço Redis na rede do Compose
    deploy:
      replicas: 3                 # três réplicas da API
  redis:
    image: redis:7-alpine         # estado compartilhado e fila
  worker:
    build: ../app
    image: lab-app
    command: ["python", "-u", "worker.py"]   # mesma imagem, outro comando
    environment:
      REDIS_HOST: redis
    depends_on:
      - redis
    restart: on-failure           # se o Redis ainda não estava pronto, tenta de novo
    deploy:
      replicas: 0                 # nasce desligado; ligamos no experimento da fila
  lb:
    image: nginx:1.27-alpine
    ports:
      - "8080:80"
    volumes:
      - ./nginx:/etc/nginx/conf.d:ro
    depends_on:
      - app
```

`nginx/default.conf`:

```nginx
upstream backend {
    zone backend 64k;             # estado de round-robin compartilhado entre os processos worker do Nginx
    server app:8080;              # as 3 réplicas, em round-robin
}

server {
    listen 80;
    location / {
        proxy_pass http://backend;
        proxy_set_header X-Request-ID $request_id;   # repassa um ID único da requisição
        proxy_connect_timeout 1s;                    # desiste rápido de uma réplica que não responde
        proxy_next_upstream error timeout;           # em erro ou timeout, tenta a próxima réplica
    }
}
```

### Mão na massa

**1. O problema: carrinho stateful.**

```sh
export MODO=memoria
docker compose up -d --build

# Três itens, um por requisição; o LB distribui entre as réplicas
for i in 1 2 3; do curl -s -X POST "localhost:8080/carrinho?user=ana&item=item$i"; done
# Agora lê o carrinho três vezes
for i in 1 2 3; do curl -s "localhost:8080/carrinho?user=ana"; done
```

Esperado (os IDs e a ordem variam):

```text
{"servidor": "aaa111", "modo": "memoria", "user": "ana", "itens": ["item1"]}
{"servidor": "bbb222", "modo": "memoria", "user": "ana", "itens": ["item2"]}
{"servidor": "ccc333", "modo": "memoria", "user": "ana", "itens": ["item3"]}
```

Cada resposta tem **um item só**. O carrinho da Ana está espalhado em três memórias, e nenhuma réplica o vê por inteiro. É o problema do estado preso ao servidor. (O `zone` no `upstream` faz os workers do Nginx compartilharem o round-robin, então as seis requisições percorrem as três réplicas em ordem e cada leitura cai na réplica que recebeu o item correspondente.)

Três boxes, cada um com um pedaço do set-up da Ana na cabeça de um mecânico diferente. Nenhum deles monta o carro inteiro.

**2. A solução: estado no Redis.**

```sh
docker compose down
export MODO=redis
docker compose up -d
for i in 1 2 3; do curl -s -X POST "localhost:8080/carrinho?user=ana&item=item$i"; done
for i in 1 2 3; do curl -s "localhost:8080/carrinho?user=ana"; done
docker compose exec redis redis-cli LRANGE carrinho:ana 0 -1
```

Esperado: as três respostas mostram `"itens": ["item1", "item2", "item3"]`, vindas de servidores diferentes, e o `redis-cli` lista:

```text
1) "item1"
2) "item2"
3) "item3"
```

Agora o set-up está no painel central: qualquer box lê a mesma ficha, completa.

**3. Failover sem perder o carrinho.**

```sh
docker stop $(docker compose ps -q app | head -n 1)
curl -s "localhost:8080/carrinho?user=ana"
```

Esperado: o carrinho continua completo (pode levar até cerca de 1 segundo se a requisição cair na réplica parada: o Nginx de código aberto só percebe a falha ao tentar, e o `proxy_connect_timeout 1s` limita a espera antes de ele passar para outra réplica). Suba a réplica de volta e atualize o Nginx, que resolve nomes só na partida e a réplica pode voltar com outro IP:

```sh
docker compose up -d
docker compose exec lb nginx -s reload
```

Um box fechou e o carrinho continua inteiro, porque ele nunca morou no box.

**4. Fila e workers.** O pedido volta rápido e o trabalho pesado acontece depois:

```sh
# Liga 1 worker (o MODO continua exportado, para não recriar a API em outro modo)
docker compose up -d --scale worker=1

# Enfileira 12 pedidos; cada resposta chega na hora com 202
for i in $(seq 1 12); do curl -s -o /dev/null -w "%{http_code} %{time_total}s\n" -X POST "localhost:8080/pedido?id=$i"; done

# Tamanho da fila
docker compose exec redis redis-cli LLEN fila:pedidos
```

Esperado: doze linhas do tipo `202 0.00xs` e um `(integer) N` com N entre 1 e 11 (os workers já estão consumindo). Veja o worker trabalhando (Ctrl+C para sair):

```sh
docker compose logs -f worker
```

Saída esperada (resumida):

```text
lab-etapa-03-worker-1  | [9f8e7d6c5b4a] processando pedido 1
lab-etapa-03-worker-1  | [9f8e7d6c5b4a] pedido 1 concluido
```

O box responde "box confirmado" em milissegundos; a pilha de análise vai sendo consumida pelo engenheiro da fábrica no ritmo dele.

**5. Escalar os workers pelo tamanho da fila.** Meça o tempo para esvaziar a fila com 1 worker e depois com 3:

```sh
# Com 1 worker (12 pedidos de 1 s: perto de 12 s)
for i in $(seq 1 12); do curl -s -o /dev/null -X POST "localhost:8080/pedido?id=$i"; done
time { while [ "$(docker compose exec -T redis redis-cli LLEN fila:pedidos | tr -d '\r')" != "0" ]; do sleep 0.5; done; }

# Com 3 workers (perto de 4 s)
docker compose up -d --scale worker=3
for i in $(seq 1 12); do curl -s -o /dev/null -X POST "localhost:8080/pedido?id=$i"; done
time { while [ "$(docker compose exec -T redis redis-cli LLEN fila:pedidos | tr -d '\r')" != "0" ]; do sleep 0.5; done; }
```

Os workers escalaram **independentemente da API**, e foi o tamanho da fila que justificou o escalonamento. É a ideia do KEDA.

Três engenheiros na sala de operações esvaziam a pilha cerca de três vezes mais rápido, e nenhum box foi tocado.

**Limpeza (só ao terminar também os exercícios):**

```sh
docker compose down -v
unset MODO
cd ..
```

### Exercícios

Os exercícios 1 e 3 precisam da stack no ar. Se você já rodou a limpeza acima, suba de novo: estando em `lab-escalabilidade`, rode `cd etapa-03`, depois `export MODO=redis` (exercício 1) ou `export MODO=memoria` (exercício 3) e `docker compose up -d --build`. Se a stack já estiver no ar no outro modo, rode `docker compose down` antes de trocar o `MODO`. O exercício 1 ainda usa `--scale worker=N`. Ao terminar, repita a limpeza.

1. **KEDA à mão.** Suponha que cada worker processa 1 pedido por segundo e você quer esvaziar a fila em até 4 segundos. Escreva a fórmula do número de workers em função do `LLEN` (dica: arredonde para cima). Teste com `--scale`. *Resposta esperada:* `workers = ceil(LLEN / 4)`, porque cada worker dá conta de 4 pedidos em 4 segundos. Em Bash, `n=$(( (LLEN + 3) / 4 ))`. Com `LLEN` igual a 12, são 3 workers (`docker compose up -d --scale worker=3`) e a fila esvazia em cerca de 4 segundos. É a lógica que o KEDA automatiza ao escalar workers pelo tamanho da fila.
2. **Retry com backoff exponencial.** Rode o script abaixo contra uma porta onde nada escuta. Depois, em outro terminal, suba `docker run -d --rm -p 9999:8080 lab-app` durante a espera e veja o script ter sucesso.

```sh
for tentativa in 1 2 3 4 5; do
  # --fail trata HTTP de erro como falha; --max-time 2 limita a espera de cada tentativa
  if curl -sf --max-time 2 -o /dev/null http://localhost:9999/health; then
    echo "ok na tentativa $tentativa"; break
  fi
  espera=$((2 ** (tentativa - 1)))   # espera 1, 2, 4, 8, 16 segundos
  echo "tentativa $tentativa falhou, esperando ${espera}s"
  sleep "$espera"
done
```

3. **Sticky session, o remendo.** Volte ao `MODO=memoria` (`docker compose down`, `export MODO=memoria`, `docker compose up -d`), adicione `ip_hash;` ao `upstream backend` em `nginx/default.conf`, rode `docker compose exec lb nginx -s reload` e repita o teste do carrinho. Funciona? Agora derrube a réplica que atendeu a Ana (`docker stop` no container que respondeu). O que aconteceu com o carrinho, e por que isso limita a resiliência?
4. **ReplicaSet (leitura).** Mapeie cada campo ao Compose: quem é o `replicas`, quem é a imagem?

```yaml
apiVersion: apps/v1          # versão da API do ReplicaSet
kind: ReplicaSet             # tipo do recurso
metadata:
  name: carrinho             # nome do ReplicaSet
spec:
  replicas: 3                # quantas cópias do Pod devem existir sempre
  selector:
    matchLabels:
      app: carrinho          # quais Pods pertencem a este ReplicaSet
  template:                  # molde dos Pods criados
    metadata:
      labels:
        app: carrinho        # o rótulo que o selector procura
    spec:
      containers:
        - name: carrinho
          image: nginx:1.27-alpine   # imagem do container
          ports:
            - containerPort: 80
```

### Anota aí

> Se o estado mora no servidor, o servidor não pode morrer nem ser trocado; tire o estado para fora (Redis, banco) e tire o trabalho lento do caminho da resposta (fila e workers).

> **Na linguagem do box:** set-up no painel central, não na cabeça do mecânico; e análise de pneu vai para a fábrica, não segura o carro no box.

---

## Etapa 04: CDNs e performance global

### O problema

Seus servidores estão no Brasil e funcionam bem para usuários locais. Mas um cliente em Lisboa, Tóquio ou Nova York sofre com a latência imposta pela distância e pelos cabos submarinos, centenas de milissegundos antes mesmo de o processamento começar. Nenhum servidor potente vence a física: a latência depende da velocidade da luz e da distância. A solução é aproximar o conteúdo do usuário, e é isso que uma CDN (Content Delivery Network) faz. Ela é, também, uma camada de segurança e de escalabilidade, porque a maior parte das requisições nem chega à sua origem.

Física é física também no paddock: Singapura fica a mais de dez mil quilômetros de Maranello, e uma peça que precisa sair da fábrica não chega ao circuito em minutos.

### O conceito

**Analogia:** uma rede de filiais de uma livraria. Em vez de todo cliente do mundo pedir o livro ao depósito central, cada filial guarda cópias dos mais vendidos. O depósito só é incomodado quando a filial não tem o livro.

**Leitura de cockpit:** no nosso mapa, o depósito central é a fábrica e a filial é o estoque de peças montado em cada circuito. O que a F1 acrescenta é o pré-posicionamento: kits de frete marítimo despachados com muita antecedência e revezados ao longo do calendário, além do frete aéreo. Para Singapura, neste fim de semana, quase tudo de que a equipe precisa já estará no circuito antes de o carro andar (cache hit); a peça que precisa vir de avião da fábrica é o cache miss: cara, lenta, evitada a todo custo.

Uma CDN é uma rede global de servidores proxy em pontos de troca de tráfego (IXPs), chamados **PoPs** (Points of Presence) ou **Edge Locations**, guardando cópias do conteúdo perto do usuário.

**Como funciona:**

1. **Geolocalização via DNS.** A consulta DNS vai para o DNS inteligente da CDN, que identifica a localização pelo IP e devolve o IP do PoP mais próximo, em vez do da origem.
2. **Edge caching.** O PoP (por exemplo, Paris) verifica o cache local. Na primeira vez há um **Cache Miss**: ele busca na origem no Brasil, entrega e guarda uma cópia. O próximo usuário próximo tem um **Cache Hit**, servido instantaneamente da borda.

O DNS inteligente é a logística que sabe qual estoque está mais perto de quem pediu. O primeiro pedido de uma peça que o estoque não tem gera o miss; a partir dali, a cópia fica no circuito para os próximos. **Aqui a analogia para:** peça física sai de um lugar para estar em outro; o arquivo em cache é copiado e continua na origem.

**Controle de cache.** O cabeçalho `Cache-Control` manda na história. O `max-age` define o TTL em segundos: `Cache-Control: public, max-age=3600` guarda por uma hora. Expirado, o arquivo fica *stale* e é revalidado com a origem; se não mudou, a origem responde `304 Not Modified` e a CDN renova o TTL sem baixar o arquivo de novo.

**Leitura de cockpit:** o `Cache-Control` é a fábrica dizendo por quanto tempo uma peça fica liberada para uso na pista. Vencido o prazo, ninguém joga a peça fora: o engenheiro pergunta à fábrica "a revisão C ainda é a atual?". Se for, a resposta é o `304`: siga usando, nada foi embarcado. O ETag é exatamente esse número de revisão.

**Invalidação (purging).** É remover à força arquivos de todos os caches, por painel ou API (por exemplo, um bug fix urgente num JavaScript). Use com critério: pode custar dinheiro e reduz a eficiência do cache.

É o recall: a fábrica descobre um problema num lote e manda retirar aquela peça de todos os circuitos de uma vez. Necessário quando é sério, caro quando vira hábito, porque cada recall obriga uma nova remessa da fábrica (um miss).

**Além de assets estáticos.** CDNs também escalam APIs: respostas GET que mudam pouco (um catálogo de produtos) podem ser cacheadas na borda, aliviando aplicação e banco. Players citados: Amazon CloudFront, Akamai, Fastly.

**Segurança e performance na borda:**

- **WAF** integrado à CDN bloqueia SQL Injection e XSS na borda.
- **TLS Offload:** a CDN faz o handshake TLS (caro em CPU) nos servidores de borda otimizados e mantém uma conexão segura otimizada com a origem.

Na borda do paddock, o WAF é a catraca de credenciais: quem não tem acesso é barrado na entrada, longe da garagem. O TLS offload é a verificação pesada feita na catraca, para que a equipe lá dentro não precise repeti-la.

**Infraestrutura e observabilidade.** CDNs usam BGP para anunciar as rotas mais eficientes para seus PoPs e acordos de peering (conexões diretas com grandes provedores) para reduzir saltos. As métricas principais: **Cache Hit Ratio** (a mais importante), economia de banda, latência de resposta e taxa de erros.

O cache hit ratio é a métrica que todo chefe de logística vigia: a porcentagem de pedidos resolvidos no circuito, sem acionar a fábrica.

**No mercado (segundo o material):** patches de Fortnite e League of Legends (dezenas de GB) são pré-posicionados nos PoPs dias antes do lançamento. Edge Computing (AWS Lambda@Edge, Cloudflare Workers) executa código nos PoPs (renderização, testes A/B, imagens, autenticação). Dynamic Content Acceleration (Akamai, Fastly) acelera até conteúdo não cacheável com otimização TCP/IP e roteamento inteligente.

Os patches pré-posicionados são, sem tirar nem pôr, o kit de frete marítimo: carga pesada despachada semanas antes, para estar no lugar quando o pico chegar. O edge computing é a engenharia feita no próprio circuito, sem esperar a fábrica.

**Como o laboratório se encaixa:** uma CDN real tem centenas de PoPs, mas o mecanismo de um PoP é um proxy com cache. Montaremos duas instâncias de Nginx: a **origem** (que define o `Cache-Control`) e a **borda** (que cacheia e informa `X-Cache`). No CloudFront, o *Origin* é a origem, o *Behavior* é a regra de cache por tipo de requisição e o domínio da CDN é a borda.

Na nossa leitura: o Nginx `origem` é a fábrica, o `edge` é o estoque no circuito, e o `X-Cache` é a etiqueta que diz se a peça saiu da prateleira do circuito (`HIT`) ou veio da fábrica (`MISS`).

### Exemplo comentado: origem e borda

```sh
mkdir -p etapa-04/origem etapa-04/edge etapa-04/site/estatico && cd etapa-04
echo 'console.log("v1");' > site/estatico/app.js
echo '<h1>Loja</h1>' > site/index.html
```

`docker-compose.yml`:

```yaml
name: lab-etapa-04

services:
  origem:
    image: nginx:1.27-alpine
    ports:
      - "8082:80"                         # expomos a origem para comparar com a borda
    volumes:
      - ./origem:/etc/nginx/conf.d:ro     # configuração da origem
      - ./site:/usr/share/nginx/html:ro   # arquivos servidos
  edge:
    image: nginx:1.27-alpine
    ports:
      - "8081:80"                         # a "CDN" que o usuário acessa
    volumes:
      - ./edge:/etc/nginx/conf.d:ro
    depends_on:
      - origem
```

`origem/default.conf`:

```nginx
server {
    listen 80;
    root /usr/share/nginx/html;                 # onde moram os arquivos

    location /estatico/ {
        # TTL de 10 s (curto de propósito, para você ver a expiração)
        add_header Cache-Control "public, max-age=10";
    }

    location /api/ {
        default_type application/json;
        # API sem Cache-Control: a borda não deve cachear
        return 200 '{"produtos": ["camiseta", "caneca"]}';
    }
}
```

`edge/default.conf`:

```nginx
# Área de cache: pasta em disco, zona de metadados "edge" de 10 MB, até 100 MB de conteúdo
proxy_cache_path /var/cache/nginx/edge levels=1:2 keys_zone=edge:10m max_size=100m inactive=10m;

server {
    listen 80;
    location / {
        proxy_pass http://origem:80;                   # a origem
        proxy_cache edge;                              # usa a área de cache acima
        proxy_cache_revalidate on;                     # ao expirar, pergunta à origem (If-None-Match) em vez de baixar de novo
        add_header X-Cache $upstream_cache_status always;   # HIT, MISS, EXPIRED, REVALIDATED...
    }
}
```

O Nginx respeita o `Cache-Control: max-age` vindo da origem para decidir o TTL; respostas sem `Cache-Control` nem `Expires` não são cacheadas, a menos que você configure `proxy_cache_valid`.

```sh
docker compose up -d
```

### Mão na massa

**1. Detetive de performance na origem.** Inspecione os cabeçalhos:

```sh
curl -sI http://localhost:8082/estatico/app.js
```

Esperado (resumido):

```text
HTTP/1.1 200 OK
...
ETag: "6650a1b2-14"
Cache-Control: public, max-age=10
```

**2. O 304 acontecendo.** Pegue o ETag e pergunte "mudou?":

```sh
ETAG=$(curl -sI http://localhost:8082/estatico/app.js | tr -d '\r' | awk 'tolower($1)=="etag:" {print $2}')
curl -sI -H "If-None-Match: $ETAG" http://localhost:8082/estatico/app.js
```

Esperado: `HTTP/1.1 304 Not Modified`, sem corpo. O servidor confirmou que a cópia ainda vale sem reenviar o arquivo.

A fábrica confirmou que a revisão ainda é a atual. Nenhuma peça embarcada.

**3. Miss e hit na borda.**

```sh
for i in 1 2 3; do curl -s -D - -o /dev/null http://localhost:8081/estatico/app.js | tr -d '\r' | grep -i '^x-cache'; done
```

Esperado:

```text
X-Cache: MISS
X-Cache: HIT
X-Cache: HIT
```

A primeira peça veio da fábrica; as seguintes saíram da prateleira do circuito.

**4. Cache Hit Ratio.** Vinte requisições e a contagem:

```sh
for i in $(seq 1 20); do curl -s -D - -o /dev/null http://localhost:8081/estatico/app.js | tr -d '\r' | grep -i '^x-cache'; done | sort | uniq -c
```

Esperado: `20 X-Cache: HIT` se você rodou logo depois do passo 3 (dentro dos 10 s de TTL). Se já passaram mais de 10 s, o resultado é `1 X-Cache: REVALIDATED` e `19 X-Cache: HIT`: a borda já tem a cópia, então a primeira resposta depois do TTL revalida com a origem e nunca aparece `MISS` (o `MISS` só acontece quando a borda não tem nada guardado, como no passo 3). O hit ratio é `hits / (hits + misses)`: aqui, entre 95% e 100%. Confirme que a origem quase não foi incomodada:

```sh
docker compose logs origem | grep 'app.js' | wc -l
```

Esperado: cerca de `4`. Três dessas linhas vêm dos `curl -sI` que você mandou direto à origem, na porta 8082 (uma do passo 1 e duas do passo 2), e só uma vem da borda (o `MISS` do passo 3). Se o TTL venceu antes deste passo e houve revalidação, soma-se mais uma linha (o `304`). O que importa: as 20 requisições deste passo foram atendidas pela borda, e a origem foi consultada no máximo uma vez (na revalidação).

Quase todos os pedidos foram resolvidos no circuito, e a fábrica quase não foi incomodada.

**5. Expiração e revalidação.** Espere o TTL passar e peça de novo:

```sh
sleep 11
curl -s -D - -o /dev/null http://localhost:8081/estatico/app.js | tr -d '\r' | grep -i '^x-cache'
docker compose logs origem | grep 'app.js' | tail -n 3
```

Esperado: `X-Cache: REVALIDATED` e, nos logs da origem, uma linha com `304` (a borda perguntou, a origem disse "não mudou", o TTL foi renovado sem transferir o arquivo).

Prazo vencido, pergunta à fábrica, revisão confirmada, prazo renovado: tudo sem frete.

**6. Arquivo que mudou: expira e baixa de novo.**

```sh
echo 'console.log("v2");' > site/estatico/app.js
curl -s http://localhost:8081/estatico/app.js      # ainda v1, dentro do TTL
sleep 11
curl -s -D - http://localhost:8081/estatico/app.js | tr -d '\r' | grep -iE '^x-cache|console'
```

Esperado: a primeira chamada mostra `console.log("v1");` (cópia da borda, ainda válida). Depois do TTL, aparece `X-Cache: EXPIRED` e `console.log("v2");`.

A fábrica lançou a revisão nova (`v2`), mas o circuito seguiu usando a `v1` até o prazo vencer. É a janela de defasagem que o TTL compra.

**7. Invalidação (purge) simulada.** O Nginx de código aberto não tem API de purge; simulamos apagando o cache. Primeiro encha o cache, depois "invalide":

```sh
echo 'console.log("v3");' > site/estatico/app.js
curl -s http://localhost:8081/estatico/app.js        # v2 ou v3, conforme o estado do cache
docker compose exec edge sh -c 'rm -rf /var/cache/nginx/edge/*'
docker compose restart edge
curl -s -D - http://localhost:8081/estatico/app.js | tr -d '\r' | grep -iE '^x-cache|console'
```

Esperado: `X-Cache: MISS` e `console.log("v3");`, na hora, sem esperar o TTL. Uma CDN real faz isso por API ou painel, e é por isso que invalidar demais custa eficiência: cada purge obriga um novo miss.

É o recall forçado: o circuito descarta o que tinha e a próxima peça vem direto da fábrica.

**Limpeza (só ao terminar também os exercícios):**

```sh
docker compose down -v
cd ..
```

### Exercícios

Os exercícios 1 e 2 precisam da stack no ar. Se você já rodou a limpeza acima, suba de novo: estando em `lab-escalabilidade`, rode `cd etapa-04 && docker compose up -d` (os arquivos `site/`, `origem/` e `edge/` continuam no disco). Depois de editar `origem/default.conf`, rode `docker compose exec origem nginx -s reload`. Ao terminar, repita a limpeza.

1. **Cachear a API.** Em `origem/default.conf`, adicione `add_header Cache-Control "public, max-age=60";` no `location /api/` e rode `docker compose exec origem nginx -s reload`. Faça 10 chamadas a `localhost:8081/api/produtos` antes e depois. O que muda no `X-Cache`? Que tipo de resposta de API é segura de cachear assim? *Resposta esperada:* antes, todas as 10 chamadas aparecem como `MISS`, porque a resposta não traz `Cache-Control` e a borda não a guarda (a origem é consultada toda vez); depois, a primeira é `MISS` e as 9 seguintes são `HIT` (dentro dos 60 s). É seguro para respostas GET públicas, iguais para todos os usuários e que mudam pouco, como o catálogo de produtos; não serve para respostas personalizadas.
2. **Quando não cachear.** Troque o valor por `Cache-Control "private, no-store"`. O `X-Cache` volta a ser `HIT`? Por que dados de um usuário logado não deveriam ficar numa borda compartilhada? *Resposta esperada:* não, depois que a cópia de 60 s do exercício anterior expirar (ou for apagada, como no passo 7) as chamadas voltam a ser `MISS`, porque `no-store` proíbe a borda de guardar a resposta. Dados de um usuário logado numa borda compartilhada poderiam ser entregues a outra pessoa, e `private` indica que só o navegador do próprio usuário pode guardá-los.
3. **Quanto cachear?** Para cada item, escolha um TTL e justifique: logo da empresa, bundle JavaScript versionado, catálogo de produtos, saldo bancário do usuário. *Resposta esperada (exemplos):* logo da empresa, TTL longo (dias), porque quase nunca muda; bundle JavaScript versionado, TTL muito longo (meses), porque o nome do arquivo muda a cada versão e a cópia nunca fica velha; catálogo de produtos, TTL curto (de segundos a poucos minutos), aceitando uma pequena defasagem; saldo bancário, não cachear (`private, no-store`), porque é dado pessoal e muda o tempo todo.
4. **Conceitual.** Explique, em três frases, por que o DNS inteligente da CDN é o que faz o usuário de Lisboa falar com o PoP de Paris e não com o servidor no Brasil. *Resposta esperada:* quando o navegador pergunta o endereço do site, a consulta chega ao DNS inteligente da CDN. Esse DNS identifica a localização do usuário pelo IP e devolve o IP do PoP mais próximo (Paris), em vez do IP da origem. O navegador então se conecta a esse PoP, que responde do cache (hit) e só vai ao Brasil se não tiver a cópia (miss).

*Dica de cockpit para o exercício 2:* o set-up de um carro específico nunca vai para a prateleira compartilhada do circuito, por mais tempo que isso economizasse.

### Anota aí

> A CDN é cache perto do usuário; quem manda nela é o `Cache-Control` da origem, e a métrica que importa é o Cache Hit Ratio.

> **Na linguagem do box:** peça boa é peça que já está no circuito; quem decide quanto tempo ela vale é a fábrica, e o que se mede é quantos pedidos não precisaram dela.

---

## Etapa 05: Escalabilidade de banco de dados

### O problema

A aplicação está escalada, há LB e há CDN. Mas quase toda ação relevante (compra, post, busca) lê ou escreve dados, e tudo aponta para um único lugar: o banco de dados, o "chefão final" da escalabilidade. Ele é stateful e precisa de consistência, então não dá para simplesmente "ligar mais três" como fizemos com a API. Numa Black Friday, o banco relacional sobrecarregado costuma ser exatamente o ponto que derruba tudo.

Na equipe, o equivalente é o arquivo oficial de engenharia: todas as revisões de peças e todos os set-ups oficiais. A consulta pode ser copiada para quantos circuitos você quiser, mas a liberação de uma revisão tem que acontecer num lugar só, ou duas versões da mesma peça vão para a pista.

### O conceito

**Os três desafios:**

- **Consistência:** uma transação atômica e leituras subsequentes vendo o resultado correto.
- **Concorrência:** múltiplos acessos simultâneos sem corromper dados.
- **Latência:** operações rápidas mesmo com mais volume.

**Escalando leitura.** A proporção de leitura para escrita costuma ser alta (por exemplo, 100 para 1). Duas ferramentas:

1. **Caching** (Redis, Memcached) entre a aplicação e o banco: a primeira linha de defesa. O padrão **cache-aside** funciona assim: a aplicação tenta o cache; se houver *miss*, busca no banco e grava no cache antes de retornar.
2. **Read Replicas:** modelo primary-replica (antes chamado master-slave). O primary recebe todas as escritas (INSERT, UPDATE, DELETE) e as replica, geralmente de forma assíncrona, para réplicas somente leitura. A aplicação implementa o **write splitting**: escritas no primary, leituras distribuídas entre as réplicas.

**Leitura de cockpit:** o primary é o arquivo oficial na fábrica, o único lugar onde se escreve. A réplica de leitura é a cópia espelhada que a equipe consulta no circuito, somente leitura, que segue a fábrica com um pequeno atraso. O write splitting é a regra da equipe: revisão só se libera na fábrica; no circuito, só se consulta. O cache-aside é o painel de dados da garagem (o mesmo Redis da Etapa 03): o engenheiro olha primeiro o painel; se a informação não estiver lá, busca no arquivo e anota no painel antes de responder.

**Escalando escrita.** Todas as escritas ainda vão para um servidor. A solução é o **sharding** (particionamento horizontal):

- **Por range** (A a M no shard 1, N a Z no shard 2): simples, mas cria *hotspots* se a distribuição não é uniforme.
- **Por hash** (hash do ID do usuário): distribuição mais equitativa, mas dificulta consultas por faixa.

A complexidade é imensa, especialmente no **re-sharding**.

**Leitura de cockpit:** imagine o arquivo de peças dividido entre armazéns, cada um com uma faixa de números de peça (range) ou com cada peça indo para o armazém definido por uma conta sobre o número dela (hash). O hotspot aparece quando a faixa de um armazém concentra as peças mais trocadas, como asas dianteiras, e ele vive lotado enquanto os outros ficam ociosos. Abrir um terceiro armazém depois obriga a mudar muita peça de lugar: é o re-sharding. **Aqui a analogia para:** essa divisão é uma imagem de logística, não uma prática documentada de equipe de F1; serve para visualizar o mecanismo.

**Bancos distribuídos.** Amazon DynamoDB (NoSQL), CockroachDB (NewSQL) e Apache Cassandra (NoSQL) fazem sharding e replicação de forma transparente. No DynamoDB, a demonstração da aula configura "unidades de capacidade de leitura e escrita", ou seja, você declara quanta leitura e escrita espera.

**Teorema CAP (Eric Brewer).** Um sistema distribuído garante ao mesmo tempo só duas de três propriedades:

- **Consistência:** todos os nós veem o mesmo dado.
- **Disponibilidade:** toda requisição recebe resposta, sem garantia de ser a escrita mais recente.
- **Tolerância a Partição:** opera mesmo com quebra de comunicação entre nós.

Como partições são inevitáveis, a escolha real é CP ou AP. Relacionais tradicionais tendem a CP; o Cassandra escolhe AP, o que leva à **Consistência Eventual**: sem novas escritas, as réplicas convergem, mas por um tempo nós diferentes podem retornar valores diferentes.

**Leitura de cockpit:** partição é o rádio cair. O carro continua na pista, o muro continua lá, mas um não ouve o outro. Duas escolhas: seguir pilotando com a última instrução recebida (disponível, talvez desatualizado: AP) ou recolher e esperar confirmação (consistente, mas parado: CP). Como o rádio sempre pode cair, a pergunta real é qual das duas você escolhe. A consistência eventual aparece em toda corrida: depois de uma rodada de paradas, a torre de tempos da transmissão e a cronometragem oficial podem divergir por um instante, e convergem logo depois. **Aqui a analogia para:** o piloto decide na hora; no banco, a escolha entre CP e AP é de projeto e de configuração, feita antes da partição.

**Estratégia e resiliência.** Escalar verticalmente ainda pode ser o mais simples e eficaz até certo ponto; a horizontal é mais complexa, com teto maior e mais resiliência. O **failover** automatizado promove uma réplica a primary. Dois números definidos pelo negócio guiam o desenho:

- **RPO (Recovery Point Objective):** quanta perda de dados é tolerável. RPO de 5 minutos significa aceitar perder os últimos 5 minutos de transações.
- **RTO (Recovery Time Objective):** quanto tempo o sistema pode ficar fora. RTO de 15 minutos significa que detecção, failover e retorno devem levar menos de 15 minutos.

Eles ditam a escolha entre replicação síncrona e assíncrona e o nível de automação do failover.

**Leitura de cockpit:** o failover de banco é o reserva que acompanhava tudo pelo fone assumir o rádio quando o titular cai. O RPO é o que o reserva não chegou a ouvir antes da troca; o RTO é quanto tempo eu fico sem ninguém no rádio. **Aqui a analogia para:** no banco, a réplica promovida passa a aceitar escritas, e a primary antiga, se voltar, não pode simplesmente reassumir sem ser reconstruída como réplica. Trocar quem fala no rádio não exige esse cuidado operacional.

**No mercado (segundo o material):** o Google Spanner entrega consistência forte global com alta disponibilidade usando relógios atômicos, e o CockroachDB leva essa ideia ao mercado sem o hardware do Google. Bancos serverless (Aurora Serverless, MongoDB Atlas Serverless, Neon) separam computação de armazenamento e escalam até zero. HTAP (SingleStore, TiDB) une OLTP e OLAP num sistema só, evitando ETL.

**Como o laboratório se encaixa:** no Amazon RDS, criar uma Read Replica são poucos cliques e a AWS gerencia a replicação. Aqui você fará à mão, com Postgres, o que o RDS esconde: uma réplica por *streaming replication* assíncrona. Também aplicará cache-aside com Redis.

Na nossa leitura: `primary` é o arquivo na fábrica, `replica` é a cópia no circuito e o `redis` é o painel da garagem.

### Exemplo comentado: Postgres primary + réplica + Redis

```sh
mkdir -p etapa-05 && cd etapa-05
```

`init-primary.sh` (roda uma vez, na criação do primary):

```bash
#!/bin/bash
# Cria o usuário que a réplica usará para copiar os dados
psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -c "CREATE ROLE replicador WITH REPLICATION LOGIN PASSWORD 'replica123';"
# Libera conexões de replicação vindas de outros containers
echo "host replication replicador all scram-sha-256" >> "$PGDATA/pg_hba.conf"
```

`replica.sh` (substitui o entrypoint da réplica):

```bash
#!/bin/bash
set -e
# Só faz a cópia inicial se o diretório de dados ainda está vazio
if [ ! -s "$PGDATA/PG_VERSION" ]; then
  chmod 700 "$PGDATA"   # o Postgres exige permissão restrita no diretório de dados
  # -R grava a configuração de standby; -X stream copia também o WAL em tempo real
  # a senha vem da variável PGPASSWORD
  pg_basebackup -h primary -U replicador -D "$PGDATA" -R -X stream
fi
# Inicia o Postgres; por causa do -R, ele sobe como réplica somente leitura
exec postgres
```

`docker-compose.yml`:

```yaml
name: lab-etapa-05

services:
  primary:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: senha123       # senha do superusuário postgres
    volumes:
      - ./init-primary.sh:/docker-entrypoint-initdb.d/init-primary.sh:ro
    healthcheck:
      # -h 127.0.0.1 força TCP: durante a inicialização, o servidor temporário só escuta no socket local,
      # então este teste só passa quando o servidor definitivo está de pé
      test: ["CMD-SHELL", "pg_isready -U postgres -h 127.0.0.1"]
      interval: 2s
      timeout: 2s
      retries: 30
  replica:
    image: postgres:16
    user: postgres                      # o Postgres não roda como root
    environment:
      PGPASSWORD: replica123            # senha do usuário replicador
    volumes:
      - ./replica.sh:/replica.sh:ro
    entrypoint: ["bash", "/replica.sh"]
    depends_on:
      primary:
        condition: service_healthy      # espera o primary ficar saudável
  redis:
    image: redis:7-alpine
```

Suba e espere a réplica:

```sh
docker compose up -d
docker compose logs replica | tail -n 5
```

Esperado ao final (pode levar alguns segundos): uma linha com `database system is ready to accept read only connections`.

### Mão na massa

**1. Quem é quem.**

```sh
docker compose exec primary psql -U postgres -c "SELECT pg_is_in_recovery();"
docker compose exec replica psql -U postgres -c "SELECT pg_is_in_recovery();"
```

Esperado: `f` no primary e `t` na réplica (a réplica está em modo de recuperação, ou seja, seguindo o primary).

`f` é a fábrica, que escreve; `t` é a cópia do circuito, seguindo a fábrica.

**2. A replicação está viva (e é assíncrona).**

```sh
docker compose exec primary psql -U postgres -c "SELECT client_addr, state, sync_state FROM pg_stat_replication;"
```

Esperado:

```text
 client_addr |   state   | sync_state
-------------+-----------+------------
 172.x.x.x   | streaming | async
```

`async`: a cópia do circuito recebe as revisões com atraso, e a fábrica não espera confirmação para seguir trabalhando.

**3. Escreva no primary, leia na réplica.**

```sh
docker compose exec primary psql -U postgres -c "CREATE TABLE produtos (id int primary key, nome text); INSERT INTO produtos VALUES (1,'Camiseta'),(2,'Caneca');"
sleep 1
docker compose exec replica psql -U postgres -c "SELECT * FROM produtos;"
```

Esperado: as duas linhas aparecem na réplica.

**4. A réplica não aceita escrita.**

```sh
docker compose exec replica psql -U postgres -c "INSERT INTO produtos VALUES (9,'Intruso');"
```

Esperado: `ERROR:  cannot execute INSERT in a read-only transaction`. É por isso que a aplicação precisa do write splitting.

A cópia do circuito recusa a revisão. Revisão, só na fábrica.

**5. Consistência eventual, ao vivo.** Pause a aplicação das mudanças na réplica, escreva no primary e compare:

```sh
docker compose exec replica psql -U postgres -c "SELECT pg_wal_replay_pause();"
docker compose exec primary psql -U postgres -c "INSERT INTO produtos VALUES (3,'Boné');"
echo "primary:"; docker compose exec primary psql -U postgres -tA -c "SELECT count(*) FROM produtos;"
echo "réplica:"; docker compose exec replica psql -U postgres -tA -c "SELECT count(*) FROM produtos;"
```

Esperado: `3` no primary e `2` na réplica. Agora retome:

```sh
docker compose exec replica psql -U postgres -c "SELECT pg_wal_replay_resume();"
sleep 1
docker compose exec replica psql -U postgres -tA -c "SELECT count(*) FROM produtos;"
```

Esperado: `3`. Por um tempo, dois nós responderam coisas diferentes e depois convergiram: consistência eventual.

Link de dados com a fábrica pausado: o circuito ainda via duas peças enquanto a fábrica já tinha três. Religou, convergiu.

**6. Cache-aside com Redis, lendo da réplica.** Crie `cache-aside.sh`:

```bash
#!/usr/bin/env bash
# uso: bash cache-aside.sh <id do produto>
chave="produto:$1"

# 1. Tenta o cache (-T desliga o terminal interativo para capturar a saída)
valor=$(docker compose exec -T redis redis-cli GET "$chave" | tr -d '\r')
if [ -n "$valor" ]; then
  echo "HIT  $valor"
  exit 0
fi

# 2. Miss: busca no banco (na réplica, que atende leitura)
valor=$(docker compose exec -T replica psql -U postgres -tA -c "SELECT nome FROM produtos WHERE id = $1" | tr -d '\r')
if [ -z "$valor" ]; then
  echo "não encontrado"
  exit 1
fi

# 3. Grava no cache com validade de 30 s (EX) antes de devolver
docker compose exec -T redis redis-cli SET "$chave" "$valor" EX 30 > /dev/null
echo "MISS $valor"
```

```sh
bash cache-aside.sh 1
bash cache-aside.sh 1
bash cache-aside.sh 1
docker compose exec redis redis-cli TTL produto:1
```

Esperado: `MISS Camiseta`, depois `HIT  Camiseta` duas vezes, e um `(integer)` entre 1 e 30 (os segundos restantes de vida da chave).

O primeiro pedido foi ao arquivo (`MISS`) e anotou no painel; os seguintes saíram do painel (`HIT`) até a anotação vencer.

**7. O preço do cache: dado velho.** Atenção ao relógio: a chave do cache vive só 30 s. Rode este passo logo depois do passo 6; se passou mais que isso, rode `bash cache-aside.sh 1` antes do `UPDATE` para repovoar o cache, senão o dado velho não aparece (você veria `MISS Camiseta Azul` direto). Altere o dado e releia:

```sh
docker compose exec primary psql -U postgres -c "UPDATE produtos SET nome='Camiseta Azul' WHERE id=1;"
bash cache-aside.sh 1
```

Esperado: `HIT  Camiseta`. O cache serve o valor antigo até expirar. Invalide ao escrever:

```sh
docker compose exec redis redis-cli DEL produto:1
bash cache-aside.sh 1
```

Esperado: `MISS Camiseta Azul`. Quem escreve precisa invalidar (ou aceitar o TTL como janela de defasagem).

É o painel da garagem mostrando a revisão antiga depois que a fábrica mudou a peça. Quem libera a revisão tem que apagar a anotação do painel.

**Limpeza (só ao terminar também os exercícios):**

```sh
docker compose down -v
cd ..
```

### Exercícios

1. **Sharding por hash, e o custo do re-sharding.** Distribua 10 IDs em 2 shards pelo módulo (um hash bem simples) e, depois, veja quantos IDs trocam de shard ao passar para 3 shards:

```sh
for id in $(seq 1 10); do echo "usuario $id -> shard $((id % 2))"; done

mudou=0
for id in $(seq 1 1000); do
  # compara o shard antigo (2 shards) com o novo (3 shards)
  if [ $((id % 2)) -ne $((id % 3)) ]; then mudou=$((mudou + 1)); fi
done
echo "IDs que trocaram de shard: $mudou de 1000"
```

Esperado: `667 de 1000`. Cerca de dois terços dos dados precisariam migrar: é a dor do re-sharding. Sharding por range tem outro problema: qual? (Dica: hotspots.) Bancos como Cassandra e DynamoDB fazem esse trabalho de forma transparente.

2. **Partição de rede (CAP na prática).** Desconecte a réplica da rede, escreva no primary e leia dos dois lados:

```sh
docker network disconnect lab-etapa-05_default $(docker compose ps -q replica)
docker compose exec primary psql -U postgres -c "INSERT INTO produtos VALUES (4,'Chaveiro');"
docker compose exec primary psql -U postgres -tA -c "SELECT count(*) FROM produtos;"
docker compose exec replica psql -U postgres -tA -c "SELECT count(*) FROM produtos;"
```

Esperado: o primary com uma linha a mais que a réplica. A réplica **respondeu** (disponibilidade) com dado possivelmente velho (sem consistência). Reconecte com `docker network connect lab-etapa-05_default $(docker compose ps -q replica)` e espere até cerca de 1 minuto: a conexão de replicação antiga pode ficar pendurada até o `wal_receiver_timeout` estourar (60 s por padrão), e a réplica ainda pode voltar com outro IP. Depois rode o `count(*)` de novo e confira que os números convergem. Para acompanhar, rode na réplica `docker compose exec replica psql -U postgres -c "SELECT status FROM pg_stat_wal_receiver;"` (quando a replicação volta, o status é `streaming`). Se a sua prioridade fosse consistência, o que a réplica deveria ter feito durante a partição? *Resposta esperada:* escolhendo consistência (CP), a réplica deveria recusar a leitura, devolvendo erro ou ficando fora de rota, enquanto não pudesse confirmar que está em dia com o primary: o preço é a disponibilidade durante a partição. O laboratório mostrou o outro lado, a escolha por disponibilidade (AP): a réplica respondeu com o que tinha, e os nós convergiram depois (consistência eventual).

Na pista: é o rádio cortado. A réplica seguiu respondendo com a última informação que tinha, como o piloto que segue o plano antigo.

3. **Failover manual e o RTO.** Derrube o primary e promova a réplica:

```sh
docker compose stop primary
time docker compose exec replica psql -U postgres -c "SELECT pg_promote();"
docker compose exec replica psql -U postgres -c "SELECT pg_is_in_recovery();"
docker compose exec replica psql -U postgres -c "INSERT INTO produtos VALUES (5,'Adesivo');"
```

Esperado: `pg_promote` devolve `t`, `pg_is_in_recovery` passa a `f` e o INSERT funciona. Você acaba de fazer um failover. Responda: que parte do RTO foi automática, e qual dependeu de você? Com replicação assíncrona, o que pode ter ficado para trás no momento da queda (isto é, qual RPO você aceitou)? Para recomeçar, rode `docker compose down -v` e suba tudo de novo. *Resposta esperada:* quase nada do RTO foi automático: perceber a queda, decidir promover e rodar o `pg_promote` dependeram de você (um serviço gerenciado como o RDS automatiza a detecção e a promoção). Quanto ao RPO, com replicação assíncrona as transações já confirmadas no primary que ainda não tinham chegado à réplica no instante da queda se perdem; no laboratório, com rede local, costuma ser pouco ou nada, mas não há garantia, e é essa janela que o RPO mede.

Você acabou de ser o reserva assumindo o rádio. O tempo que levou para perceber e agir é o RTO.

4. **RPO e RTO.** O negócio define RPO de 5 minutos e RTO de 15. Replicação síncrona ou assíncrona? O failover pode ser manual? Justifique. *Resposta esperada:* a replicação assíncrona basta, porque o negócio aceita perder até 5 minutos de transações, desde que o atraso da réplica seja monitorado e fique dentro desse limite; a síncrona só seria necessária se o RPO fosse próximo de zero. O failover pode ser manual se a equipe conseguir detectar, decidir e promover com folga dentro dos 15 minutos (com plantão e um roteiro testado); automatizá-lo reduz o risco de estourar o RTO e de erro humano, ao custo de mais complexidade.

### Anota aí

> Leitura se escala com cache e réplicas; escrita só se escala particionando (sharding), e todo o resto é escolher, conscientemente, entre consistência e disponibilidade.

> **Na linguagem do box:** consulta, em quantos circuitos quiser; revisão, só na fábrica; e quando o rádio cai, decida antes se o carro segue ou recolhe.

---

## Etapa 06: Arquiteturas escaláveis no mundo real

### O problema

Última aula. Você tem todas as peças (fundamentos, LB, padrões, CDN, banco), mas peças soltas não são uma arquitetura. Considere o caso do e-commerce fictício: um monolito tradicional, com aplicação e banco no mesmo servidor, caiu na Black Friday. Onde exatamente estava a falha? E, depois de reconstruir, como saber onde está o próximo gargalo? Esta etapa pede a visão de arquiteto: a planta baixa completa, cada peça justificada, e os instrumentos para enxergar o sistema funcionando.

É o debrief de domingo à noite depois de uma corrida ruim: não basta saber que deu errado; é preciso saber em que volta, em que sistema e por quê, e a resposta vem dos dados.

### O conceito

**Serverless.** Com o AWS Lambda, temos a máxima abstração: a pessoa desenvolvedora envia a função e o provedor provisiona, aplica patches e escala. São centenas de execuções por segundo, e volta a zero (inclusive o custo) quando a demanda some.

**Aqui a analogia para:** não há bom equivalente de serverless na F1. O mais perto é uma equipe cliente que recebe a unidade de potência pronta do fabricante e não cuida do desenvolvimento dela, mas nenhuma equipe escala até zero e para de pagar quando não está correndo.

**Monolito escalável vs microsserviços:**

| | Monolito escalável | Microsserviços |
|---|---|---|
| Ideia | Não é inerentemente ruim: stateless e bem projetado, roda num ASG e escala horizontalmente | Serviços pequenos por capacidade de negócio (catálogo, pagamento) |
| Ganhos | Simplicidade de desenvolvimento, teste, deploy e depuração (tudo no mesmo processo) | Escala granular, independência de equipes, flexibilidade tecnológica |
| Custos | Escala o sistema inteiro junto | Complexidade operacional massiva, latência e novos pontos de falha na rede, depuração distribuída difícil |

**Lei de Conway:** a arquitetura reflete a estrutura de comunicação da organização. Times pequenos e autônomos tendem a microsserviços; times centralizados tendem a monolitos.

**Leitura de cockpit:** monolito é o carro projetado e operado como uma peça única, por uma só estrutura; microsserviços são departamentos independentes (aerodinâmica, unidade de potência, chassi, estratégia), cada um com a sua interface. A Lei de Conway é das coisas mais visíveis no paddock: o carro reflete a organização de quem o desenha. A Mercedes, com o chassi em Brackley e a unidade de potência em Brixworth, depende de interfaces muito bem definidas entre as duas sedes.

**Onde está o gargalo? Observabilidade.** O gargalo pode estar em CPU, memória, I/O de disco, uma query, uma API de terceiro, a latência de rede ou um cache mal configurado. Sem instrumentos, você chuta. Os três pilares:

| Pilar | O que é | Responde |
|---|---|---|
| **Métricas** | Números agregados no tempo (CPU, latência, taxa de erros) | **O que** está acontecendo; disparam alertas |
| **Logs** | Eventos discretos com timestamp | **Por que** aconteceu |
| **Traces** | Jornada de uma requisição pelos serviços (rastreamento distribuído) | **Onde** o tempo foi gasto |

**Leitura de cockpit:** isso eu vivo de dentro. Métricas são a telemetria ao vivo, centenas de canais que dizem o que está acontecendo e disparam alarme no muro. Logs são o rádio e o registro cronológico de eventos: explicam por que algo aconteceu. Traces são os tempos de minissetor de uma volta: mostram exatamente onde eu perdi o tempo. O fio que costura tudo é o identificador: o transponder do carro, o mesmo número em cada laço de cronometragem, como o `X-Request-ID` que você vai seguir no laboratório.

**Como os grandes fazem (segundo o material):** o Google tem cultura SRE (operações como problema de software, automação, error budgets e SLOs); a Amazon pratica "you build it, you run it" (cada time opera e escala o seu serviço); o Nubank é nativo da nuvem, com microsserviços, programação funcional e observabilidade robusta para crescimento explosivo (microsserviços, Clojure e Datomic para consistência em ambiente distribuído, com forte cultura de automação e testes num negócio regulado). A tendência SRE troca times de "Operações" por SRE, com SLOs, error budgets e autoridade para priorizar estabilidade quando o orçamento de erro estoura. A tendência Platform Engineering monta uma Internal Developer Platform (IDP) com CI/CD, IaC, observabilidade e segurança como serviço, reduzindo a carga cognitiva dos times de produto.

SLO e error budget têm um paralelo direto. Cada piloto tem um número limitado de componentes da unidade de potência (motor, bateria e afins) para a temporada inteira; usou mais que a cota, perde posições no grid de largada. Essa cota funciona como um orçamento de erro: enquanto há folga, a equipe arrisca mais; quando ela acaba, a prioridade muda para confiabilidade. O abandono do Russell em Sepang, ao que tudo indica por falha da unidade de potência, é o tipo de evento que consome esse orçamento. **Aqui a analogia para:** a cota é regulamento externo, com punição esportiva; o error budget é um acordo interno entre produto e operação.

**O estudo de caso: refatoração do e-commerce.** O monolito com aplicação e banco no mesmo servidor caiu na Black Friday. Os pontos de falha: falta de LB, aplicação stateful, banco sobrecarregado, ausência de CDN. O redesenho, passo a passo, amarra cada etapa deste guia:

| Etapa | Problema | Peça adicionada |
|---|---|---|
| 04 (CDN) | Assets estáticos pesando na origem, distância do usuário | CDN (CloudFront) servindo os assets |
| 02 (LB) | Ponto único de falha | Load Balancer (ALB) na frente |
| 01 e 03 (Escala e padrões) | Aplicação e banco no mesmo servidor; estado preso; tarefas lentas no caminho | Aplicação separada do banco, stateless, em ASG; e-mails e processos lentos desacoplados por fila (SQS) |
| 05 (Banco) | Banco sobrecarregado | Banco em serviço gerenciado (RDS) com Read Replicas |

Resultado: de uma arquitetura frágil a um sistema distribuído, resiliente e escalável.

Na leitura de pista, é a operação integrada de um fim de semana de GP: estoque no circuito (CDN), controle de entrada do pit lane (load balancer), boxes intercambiáveis (aplicação stateless), painel central da garagem (Redis), pilha de análise e engenheiros da fábrica (fila e workers), e o arquivo oficial com cópias no circuito (banco com réplicas).

### Exemplo comentado: a arquitetura completa, local

Vamos montar a versão "depois" do caso: **borda (CDN) → load balancer → 3 réplicas stateless → Redis (estado e fila) → worker**. A parte de banco com réplicas de leitura você já construiu na Etapa 05 e ela se encaixa atrás da API da mesma forma; aqui o foco é a cadeia de requisição e a observabilidade, para o compose não ficar enorme.

Na pista: estoque no circuito, entrada do pit lane, três boxes, painel central e engenheiro da sala de operações.

```sh
mkdir -p etapa-06/edge etapa-06/lb etapa-06/site/estatico && cd etapa-06
echo 'console.log("loja");' > site/estatico/app.js
```

`docker-compose.yml`:

```yaml
name: lab-etapa-06

services:
  edge:                                  # a "CDN": cacheia e entrega
    image: nginx:1.27-alpine
    ports:
      - "8080:80"                        # única porta exposta ao mundo
    volumes:
      - ./edge:/etc/nginx/conf.d:ro
    depends_on:
      - lb
  lb:                                    # o "ALB": distribui entre as réplicas
    image: nginx:1.27-alpine
    volumes:
      - ./lb:/etc/nginx/conf.d:ro
      - ./site:/usr/share/nginx/html:ro  # assets estáticos (a origem da CDN)
    depends_on:
      - app
  app:                                   # o monolito stateless, em 3 réplicas (o "ASG")
    build: ../app
    image: lab-app
    environment:
      MODO: redis                        # estado no Redis
      REDIS_HOST: redis
    deploy:
      replicas: 3
  worker:                                # consumidor da fila de pedidos
    build: ../app
    image: lab-app
    command: ["python", "-u", "worker.py"]
    environment:
      REDIS_HOST: redis
    depends_on:
      - redis
    restart: on-failure
  redis:                                 # sessão/carrinho e fila
    image: redis:7-alpine
```

`edge/default.conf`:

```nginx
proxy_cache_path /var/cache/nginx/edge levels=1:2 keys_zone=edge:10m max_size=100m inactive=10m;

server {
    listen 80;
    location / {
        proxy_pass http://lb:80;                      # a "origem" da borda é o load balancer
        proxy_cache edge;
        proxy_cache_revalidate on;
        add_header X-Cache $upstream_cache_status always;
    }
}
```

`lb/default.conf`:

```nginx
upstream backend {
    zone backend 64k;                   # estado de round-robin compartilhado entre os processos worker do Nginx
    server app:8080 max_fails=1 fail_timeout=10s;
}

# Formato de log com o ID da requisição: é o nosso "trace" caseiro
log_format rastreio '$remote_addr "$request" $status rid=$request_id upstream=$upstream_addr';

server {
    listen 80;
    access_log /dev/stdout rastreio;

    # Assets estáticos: servidos aqui mesmo, com TTL, para a borda cachear
    location /estatico/ {
        root /usr/share/nginx/html;
        add_header Cache-Control "public, max-age=30";
    }

    # Todo o resto vai para a aplicação
    location / {
        proxy_pass http://backend;
        proxy_set_header X-Request-ID $request_id;    # a aplicação registra este ID nos logs dela
        proxy_connect_timeout 1s;
        proxy_next_upstream error timeout;
    }
}
```

`verificar.sh` confere uma propriedade de cada etapa do guia:

É o checklist de pré-corrida: cada linha confere um sistema antes de o carro ir para o grid.

```bash
#!/usr/bin/env bash
# uso: bash verificar.sh (com a stack no ar)
base=http://localhost:8080
ok()    { echo "OK     $1"; }
falha() { echo "FALHA  $1"; }

# Etapa 04: a segunda leitura de um asset deve vir da borda
curl -s -o /dev/null "$base/estatico/app.js"
x=$(curl -s -D - -o /dev/null "$base/estatico/app.js" | tr -d '\r' | grep -i '^x-cache' | awk '{print $2}')
[ "$x" = "HIT" ] && ok "asset servido pela borda (HIT)" || falha "asset não veio do cache (x-cache=$x)"

# Etapas 01 e 02: a carga deve ser distribuída entre 3 réplicas
n=$(for i in $(seq 1 12); do curl -s "$base/"; done | awk '{print $1}' | sort -u | wc -l)
[ "$n" -eq 3 ] && ok "requisições distribuídas em 3 réplicas" || falha "só $n réplica(s) responderam"

# Etapa 03: o carrinho escrito por uma réplica deve ser visto por todas (stateless)
curl -s -o /dev/null -X POST "$base/carrinho?user=teste&item=livro"
n=$(for i in 1 2 3; do curl -s "$base/carrinho?user=teste"; done | grep -c livro)
[ "$n" -eq 3 ] && ok "carrinho visível em qualquer réplica" || falha "carrinho inconsistente ($n/3)"

# Etapa 03: o pedido deve ser aceito na hora (202) e processado depois pelo worker
c=$(curl -s -o /dev/null -w '%{http_code}' -X POST "$base/pedido?id=99")
[ "$c" = "202" ] && ok "pedido aceito de forma assíncrona (202)" || falha "pedido devolveu $c"
```

### Mão na massa

**1. Sobe e verifica.**

```sh
docker compose up -d --build
sleep 3
bash verificar.sh
```

Esperado:

```text
OK     asset servido pela borda (HIT)
OK     requisições distribuídas em 3 réplicas
OK     carrinho visível em qualquer réplica
OK     pedido aceito de forma assíncrona (202)
```

Quatro luzes verdes no checklist: o carro pode ir para o grid.

**2. Resiliência: derrube uma réplica.**

```sh
docker stop $(docker compose ps -q app | head -n 1)
for i in $(seq 1 20); do curl -s -o /dev/null -w "%{http_code}\n" "localhost:8080/"; done | sort | uniq -c
```

Esperado: `20 200`. Suba de volta e atualize o Nginx, que resolve nomes só na partida e a réplica pode voltar com outro IP:

```sh
docker compose up -d
docker compose exec lb nginx -s reload
```

Um box fechou e nenhum carro percebeu.

**3. Antes e depois, em números.** Use a função de carga da Etapa 01 (redefina se abriu um terminal novo) contra a arquitetura e contra um "monolito" de uma instância só:

```sh
carga() { time (seq 1 100 | xargs -P 20 -I{} curl -s -o /dev/null "$1"); }

# Depois: borda, LB e 3 réplicas
carga http://localhost:8080/

# Antes: uma instância stateful, sem LB e sem borda
docker run -d --name monolito -p 8090:8080 -e MODO=memoria lab-app
carga http://localhost:8090/
```

Esperado: cerca de 1,7 s contra cerca de 5 s. Agora o ponto único de falha:

```sh
docker stop monolito
curl -s -o /dev/null -w "%{http_code}\n" --max-time 2 localhost:8090/
```

Esperado: `000`. Remova com `docker rm monolito`.

O `000` é o monolito: um box só e nenhum lugar para desviar, como o carro parado na reta em Sepang.

**4. Observabilidade, os três pilares com o que temos.**

*Métricas* (o quê):

```sh
docker stats --no-stream
```

Esperado: uma tabela com CPU e memória de cada container (`NAME`, `CPU %`, `MEM USAGE / LIMIT`...).

*Logs* (por quê). A aplicação registra cada requisição:

```sh
curl -s "localhost:8080/carrinho?user=ana" > /dev/null
docker compose logs --no-color app | tail -n 3
```

Esperado: linhas como `app-2  | [9f8e7d6c5b4a] GET /carrinho?user=ana rid=4c1d...`.

*Traces* (onde). Siga um ID de requisição pelas camadas:

```sh
RID=$(docker compose logs --no-color lb | grep carrinho | tail -n 1 | grep -o 'rid=[a-f0-9]*')
echo "seguindo $RID"
docker compose logs --no-color lb app | grep "$RID"
```

Esperado: duas linhas com o **mesmo** `rid`, uma do `lb` (com `upstream=` mostrando qual réplica foi escolhida) e outra do `app` (a réplica que atendeu). É um mini trace distribuído: o mesmo identificador costurando o caminho da requisição por duas camadas. Ferramentas reais de tracing fazem isso de forma automática e medem o tempo de cada trecho.

É o transponder: o mesmo número aparece no laço da entrada do pit lane (o `lb`, que registra para qual box mandou o carro) e no box que atendeu (o `app`).

**Limpeza:**

```sh
docker compose down -v
docker rm -f monolito 2>/dev/null
cd ..
```

### Exercícios

1. **Diagnóstico.** O e-commerce abaixo caiu na Black Friday. Liste os pontos de falha e, para cada um, a peça do guia que o resolve e em que etapa ela foi estudada:
   - aplicação e banco no mesmo servidor;
   - carrinho em variável de sessão;
   - imagens e JavaScript servidos pela própria aplicação;
   - e-mail de confirmação enviado antes de responder ao cliente;
   - um único servidor na frente de tudo.

   *Resposta esperada:* aplicação e banco no mesmo servidor, separar os dois (aplicação em instâncias próprias, banco em serviço gerenciado com read replicas; Etapas 01, 03 e 05); carrinho em variável de sessão, aplicação stateless com o estado no Redis ou no banco (Etapa 03); imagens e JavaScript servidos pela aplicação, CDN na frente (Etapa 04); e-mail antes de responder, fila e workers, com o produtor respondendo na hora (Etapa 03); servidor único na frente, load balancer com uma frota de instâncias (Etapas 01 e 02).
2. **Monolito ou microsserviços?** Uma startup com 6 pessoas, um único time, quer "ser como o Nubank". Use a Lei de Conway e a tabela de custos para argumentar a favor de um monolito escalável (stateless, em ASG) como ponto de partida. *Resposta esperada:* pela Lei de Conway, um time único e centralizado tende a produzir (e a operar bem) um monolito; microsserviços refletem times pequenos e autônomos, que a startup ainda não tem. A tabela mostra o preço dos microsserviços: complexidade operacional massiva, latência e novos pontos de falha na rede, depuração distribuída difícil. Um monolito stateless, em ASG, escala horizontalmente com simplicidade de desenvolvimento, teste, deploy e depuração, e pode ser dividido mais tarde, quando surgirem times e gargalos que justifiquem.
3. **Gargalo ou pilar?** Você vê a latência do `/carrinho` triplicar. Qual pilar você consulta primeiro para saber *que* algo mudou, qual para saber *por quê* e qual para saber *onde* o tempo foi gasto? *Resposta esperada:* métricas para saber **que** algo mudou (e disparar o alerta), logs para saber **por quê** e traces para saber **onde** o tempo foi gasto, ao longo dos serviços por onde a requisição passou.
4. **Orçamento de erro (conta).** Um SLO de 99,9% de disponibilidade em 30 dias deixa quantos minutos de indisponibilidade de orçamento? (Dica: 30 dias têm 43.200 minutos.) *Resposta:* 0,1% de 43.200 = 43,2 minutos.
5. **Plano de upgrade.** Escreva o que você adicionaria ao `docker-compose.yml` para incluir o banco primary e a réplica da Etapa 05 atrás da API, e como a aplicação faria o write splitting. *Resposta esperada:* acrescentar ao compose os serviços `primary` e `replica` (com o `init-primary.sh`, o `replica.sh` e o healthcheck da Etapa 05) e passar à `app` os endereços dos dois por variáveis de ambiente. No write splitting, os comandos de escrita (INSERT, UPDATE, DELETE) vão para o `primary` e as leituras (SELECT) para a `replica`, de preferência com o cache-aside do Redis na frente. A aplicação de teste não fala com Postgres, então seria preciso acrescentar a ela um cliente de Postgres.

### Anota aí

> Arquitetura escalável é a combinação certa de peças simples (borda, balanceador, aplicação stateless, fila, banco com réplicas), e só se mantém assim se você enxergar o sistema por métricas, logs e traces.

> **Na linguagem do box:** estoque no circuito, entrada única, boxes intercambiáveis, pilha para a fábrica, arquivo com cópia; e telemetria, rádio e minissetores para saber onde está o próximo décimo.

---

## Checklist de autoavaliação

Marque só o que você consegue fazer **sem consultar o texto**.

**Etapa 01: Fundamentos**

- [ ] Explico a diferença entre desempenho, otimização e escalabilidade com um exemplo.
- [ ] Sei dizer por que escalar não reduz a latência de uma requisição isolada.
- [ ] Comparo escala vertical e horizontal, incluindo o conceito de SPOF.
- [ ] Diferencio autoscaling baseado em métrica, agendado e preditivo.
- [ ] Reconheço quando NÃO escalar.

**Etapa 02: Load balancers**

- [ ] Diferencio L4 e L7 e dou um uso de cada.
- [ ] Explico round-robin, least connections e IP hash, com uma desvantagem de cada.
- [ ] Descrevo health check, failover e connection draining.
- [ ] Executo e explico um canary e uma virada blue/green.
- [ ] Consigo configurar um `upstream` no Nginx e recarregar a configuração.

**Etapa 03: Padrões de escala horizontal**

- [ ] Explico por que stateful atrapalha o balanceamento e como o Redis resolve.
- [ ] Reproduzo o problema do carrinho em memória e a correção.
- [ ] Explico o padrão produtor, fila e worker, e por que os workers escalam pelo tamanho da fila.
- [ ] Escrevo um retry com backoff exponencial e explico o papel do fallback.
- [ ] Sei o que são sidecar, ambassador, ReplicaSet e ASG.

**Etapa 04: CDNs**

- [ ] Explico como o DNS inteligente aproxima o usuário de um PoP.
- [ ] Leio `Cache-Control` e `ETag` com `curl` e provoco um `304`.
- [ ] Diferencio HIT, MISS, EXPIRED e REVALIDATED.
- [ ] Calculo o cache hit ratio e sei por que invalidar demais é ruim.
- [ ] Decido o que cachear e o que não cachear numa borda.

**Etapa 05: Banco de dados**

- [ ] Explico cache-aside e implemento o fluxo com Redis.
- [ ] Explico primary-replica, replicação assíncrona e write splitting.
- [ ] Demonstro consistência eventual com uma réplica.
- [ ] Comparo sharding por range e por hash e explico a dor do re-sharding.
- [ ] Explico o teorema CAP, RPO e RTO com um exemplo.

**Etapa 06: Arquiteturas no mundo real**

- [ ] Diagnostico os pontos de falha de um monolito e redesenho a arquitetura justificando cada peça.
- [ ] Comparo monolito escalável e microsserviços e cito a Lei de Conway.
- [ ] Associo métricas, logs e traces às perguntas "o quê", "por quê" e "onde".
- [ ] Rodo e interpreto a verificação da arquitetura completa.
- [ ] Explico SLO e error budget.

---

## Notas do piloto: onde as analogias quebram

A camada de F1 não altera comandos, código, saídas esperadas nem exercícios; correções técnicas vieram da revisão do professor. Os pontos em que a comparação não fecha 100%:

1. **Um box por equipe, dois carros.** A F1 real é "sticky" por regulamento: cada carro só para no box da própria equipe. Round-robin entre boxes de equipes diferentes não existe, e o controle de entrada do pit lane que distribui carros é uma figura imaginada para a analogia.
2. **Um carro por vez.** Um box atende um carro por vez; o double stack é sequencial. A `CAPACIDADE` do laboratório é um box imaginário com várias posições de serviço.
3. **Elasticidade.** O pessoal de uma equipe é limitado e fixo no fim de semana. Réplicas e workers sobem e descem em minutos, e a cobrança acompanha o uso.
4. **Canary.** Com dois carros, o menor canary da F1 é 50% da frota. Métricas de negócio do canary (conversão, engajamento) não têm equivalente na pista.
5. **Fila sem confirmação.** Um engenheiro que larga a análise no meio não faz o pneu sumir da pilha. A lista do Redis do laboratório, sim: se o worker morre no meio da tarefa, a mensagem se perde (ver as notas do professor). SQS e RabbitMQ se parecem mais com a pilha da Pirelli.
6. **Peça e dado.** Peça física muda de lugar; arquivo em cache é cópia, e a origem continua com o original.
7. **Sharding.** A divisão de armazéns por número de peça é imagem de logística, não prática documentada de equipe.
8. **CAP.** O piloto decide na hora se segue ou recolhe; no banco, CP ou AP é decisão de projeto e configuração, tomada antes da partição.
9. **Failover de banco.** A primary antiga não reassume sozinha quando volta; precisa ser reconstruída como réplica. Trocar quem fala no rádio não exige esse cuidado.
10. **Serverless.** Não há bom paralelo: nenhuma equipe escala até zero.
11. **Error budget.** A cota de componentes da unidade de potência é regulamento externo com punição esportiva; o error budget é acordo interno entre produto e operação.

## Fontes dos dados de F1 (consultadas em 2026-10-05)

- Classificação de pilotos 2026: [RacingNews365](https://racingnews365.com/f1/standings/2026/drivers) e [Formula One History](https://www.formulaonehistory.com/results/2026-f1-drivers-championship-standings/).
- Relato da rodada 16 (GP do Bahrein em Sepang, 4 de outubro de 2026): [Formula1.com](https://www.formula1.com/en/latest/article/verstappen-wins-rain-hit-bahrain-gp-in-malaysia-over-antonelli-as-russell-retires-late-on.6qfpIHPch8mIVj2YgfHdCp), [Al Jazeera](https://www.aljazeera.com/sports/2026/10/4/red-bulls-verstappen-wins-rain-delayed-bahrain-gp-f1-race-in-sepang) e [Sky Sports](https://www.skysports.com/f1/news/13594860/bahrain-gp-in-malaysia-max-verstappen-wins-first-race-of-2026-f1-season-in-wild-rain-hit-grand-prix-as-lewis-hamilton-surges-back).
- GP de Singapura 2026: [Formula1.com](https://www.formula1.com/en/racing/2026/singapore).

---

## Apêndice: quadro de-para completo

Todas as analogias usadas no documento, na ordem em que aparecem. As dez centrais estão no quadro do início.

| Escalabilidade | Fórmula 1 |
|---|---|
| Requisição | Um carro entrando no pit lane para ser atendido |
| Servidor, instância ou réplica da aplicação | Um box com a sua crew completa de pit stop |
| Imagem `lab-app` | O procedimento padrão de pit stop, idêntico em todo box montado a partir dele |
| Latência (desempenho) | A duração de um pit stop: quanto tempo um carro fica em serviço |
| Throughput | Quantos carros o pit lane devolve à pista por segundo |
| Otimização | Treinar a crew para o mesmo pit stop levar menos tempo, sem gente a mais |
| `CAPACIDADE` (o semáforo do laboratório) | Quantos carros um box consegue atender ao mesmo tempo |
| Requisições esperando a vez | O double stack: o carro de trás esperando o da frente sair do macaco |
| Escala vertical | Um box maior, com mais gente e mais pistolas |
| Escala horizontal | Mais boxes idênticos no pit lane |
| Ponto único de falha (SPOF) | Um componente sem reserva, como a unidade de potência: falhou, acabou a corrida |
| Elasticidade e autoscaling | Abrir e fechar boxes conforme o movimento do pit lane, seguindo regras definidas antes |
| Autoscaling por métrica | Reagir ao tamanho da fila de carros no pit lane |
| Autoscaling agendado | Crew posicionada para a janela de pit que já estava no plano de corrida |
| Autoscaling preditivo | O radar meteorológico antecipando a chuva e a troca para intermediários |
| Triângulo performance, custo e complexidade | O teto de gastos: desempenho, orçamento e complexidade disputando o mesmo recurso |
| Load balancer | O controle de entrada do pit lane, que direciona cada carro a um box livre |
| Balanceamento L4 | O laço de cronometragem: lê o transponder, nunca o pedido |
| Balanceamento L7 | O engenheiro que ouve o rádio e entende o pedido ("macio e mais asa") |
| LB externo | A entrada do pit lane, por onde chega quem vem da pista |
| LB interno | O intercom da garagem, que liga departamentos sem passar pela pista |
| Round-robin | Cada carro vai ao próximo box de uma fila circular |
| Weighted round-robin | O box com crew maior recebe mais carros |
| Least connections | O carro vai ao box com menos carros em serviço |
| IP hash e sticky session | Cada carro sempre no box da própria equipe (é como a F1 real funciona) |
| Health check ativo | O radio check periódico com cada box |
| Health check passivo (Nginx) | Descobrir que o box tem problema só quando um carro real falha nele |
| Failover | Desviar o carro para outro box quando o seu está fora de combate |
| Connection draining | Terminar o pit stop em andamento antes de fechar o box |
| Blue/Green | Duas especificações completas do carro prontas, com virada total de uma para a outra |
| Canary | O pacote de upgrade montado primeiro em um carro só |
| Rollback | Voltar para a especificação anterior, a que funcionava |
| Ingress | As placas na entrada do pit lane, indicando o destino de cada tipo de serviço |
| Stateful | O mecânico que guarda o set-up do carro na cabeça |
| Stateless | O set-up anotado no sistema central: qualquer mecânico de qualquer box continua o trabalho |
| Redis (estado, fila e cache) | O painel de dados ao vivo da garagem, compartilhado por todos os boxes |
| ReplicaSet e ASG | A regra do chefe de equipe: "N boxes prontos, sempre" |
| Produtor | O box que atende o carro e o devolve à pista na hora |
| Fila de mensagens | A pilha de pneus usados e dados de parada esperando análise |
| Worker | O engenheiro do centro de operações na fábrica, processando essa pilha depois |
| `202 Accepted` | "Box confirmado": o carro já voltou à pista, a análise vem depois |
| KEDA | Chamar mais engenheiros para a sala de operações conforme a pilha cresce |
| Sidecar | O registrador de dados instalado ao lado dos sistemas do carro, que grava sem o carro saber |
| Ambassador | O team manager, que fala com a direção de prova em nome da equipe |
| Retry com backoff exponencial | Repetir o chamado de rádio, esperando cada vez mais entre as tentativas |
| Fallback | O plano B de estratégia, calculado antes da largada |
| Circuit breaker | A entrada do pit lane fechada: ninguém tenta entrar enquanto o problema existe |
| CDN | A rede de kits de frete e estoques de peças pré-posicionados ao longo do calendário |
| Origem | A fábrica (Brackley, Maranello, Milton Keynes, Woking) |
| PoP ou borda | O estoque de peças montado no circuito |
| Cache miss | A peça que não está no circuito e precisa vir da fábrica |
| Cache hit | A peça entregue direto da prateleira do circuito |
| `Cache-Control` e TTL | A fábrica define por quanto tempo uma peça fica liberada para uso na pista |
| ETag e `304 Not Modified` | O número de revisão da peça: "a revisão C ainda vale?", "vale, siga usando" |
| Invalidação (purge) | O recall: retirar uma peça de todos os circuitos de uma vez |
| DNS inteligente da CDN | A logística que manda buscar a peça no estoque mais próximo |
| Cache hit ratio | A porcentagem de pedidos resolvidos no circuito, sem acionar a fábrica |
| WAF | A catraca de credenciais do paddock |
| Edge computing | Engenharia feita no próprio circuito, sem esperar a fábrica |
| Banco primary | O arquivo oficial de engenharia na fábrica: o único lugar onde se escreve |
| Read replica | A cópia espelhada do arquivo, consultada no circuito, somente leitura |
| Replicação assíncrona | A revisão chega à cópia do circuito com atraso, sem a fábrica esperar confirmação |
| Write splitting | Revisão só se libera na fábrica; no circuito, só se consulta |
| Cache-aside | Olhar primeiro o painel da garagem; se não estiver lá, buscar no arquivo e anotar no painel |
| Consistência eventual | A torre de tempos da transmissão e a cronometragem oficial divergindo por um instante e convergindo |
| Sharding | O arquivo de peças dividido entre armazéns, cada um com a sua parte dos números de peça |
| Partição de rede e teorema CAP | O rádio cai: seguir com a última instrução (AP) ou recolher e esperar confirmação (CP) |
| Failover de banco (promoção da réplica) | O reserva que ouvia tudo pelo fone assume o rádio quando o titular cai |
| RPO | O que o reserva não chegou a ouvir antes da troca |
| RTO | Quanto tempo o piloto fica sem ninguém no rádio |
| Monolito | O carro projetado e operado como uma peça única, por uma só estrutura |
| Microsserviços | Departamentos independentes (aerodinâmica, unidade de potência, chassi, estratégia) com interfaces definidas |
| Lei de Conway | O carro reflete a organização da equipe que o desenha |
| Métricas | A telemetria ao vivo: o que está acontecendo |
| Logs | O rádio e o registro cronológico de eventos: por que aconteceu |
| Traces | Os tempos de minissetor de uma volta: onde o tempo foi gasto |
| `X-Request-ID` | O transponder: o mesmo número costurando cada passagem pelos laços de cronometragem |
| SLO e error budget | A cota de componentes da unidade de potência por temporada: usou mais que a cota, perde posições no grid |
| Arquitetura completa | A operação integrada de um fim de semana de GP, do estoque no circuito à sala de operações da fábrica |

---

## Notas do professor

**Precisões e correções ao material bruto:**

1. **Teorema CAP.** O texto diz que o sistema "garante só duas de três" propriedades. A leitura mais precisa é que, **durante uma partição de rede**, é preciso escolher entre consistência e disponibilidade. Sem partição, um sistema pode oferecer as duas. Por isso a frase "a escolha real é CP ou AP" do próprio material é a que vale. Classificar bancos como "CP" ou "AP" também é uma simplificação: muitos permitem ajustar o comportamento por configuração.
2. **Hystrix.** O material cita a biblioteca Hystrix como a que popularizou o Circuit Breaker. É um fato histórico correto, mas a biblioteca está em modo de manutenção (a própria Netflix deixou de desenvolvê-la) e hoje se usam outras alternativas, como o Resilience4j. O padrão continua válido; a biblioteca é que ficou como referência histórica.
3. **Cabeçalho `X-Cache`.** O material trata `X-Cache` (Hit/Miss) como algo que a CDN simplesmente envia. Esse cabeçalho **não faz parte de um padrão HTTP**: é uma convenção de cada provedor e o formato do valor varia entre eles. O que é padronizado é o `Cache-Control`. No laboratório, definimos o `X-Cache` nós mesmos na borda.
4. **ReplicaSet vs Deployment.** O material apresenta o ReplicaSet como unidade de escala, o que está correto. Na prática, costuma-se criar um **Deployment**, que gerencia ReplicaSets e acrescenta atualizações graduais e rollback. O ReplicaSet continua sendo o mecanismo que mantém o número de cópias.
5. **Backoff exponencial.** O material cita retry com exponential backoff. Em sistemas reais, costuma-se somar um pequeno atraso aleatório (jitter) para que muitos clientes não repitam as tentativas todos no mesmo instante.

**Limites dos laboratórios (onde a analogia local termina):**

- A aplicação de teste **modela** a capacidade de um servidor com um semáforo e um `sleep`. Os números das experiências da Etapa 01 são previsíveis por construção; servem para ver a lógica, não para medir hardware real.
- O Nginx de código aberto faz **health check passivo** (reage a falhas reais). O ALB faz sondagem ativa em intervalo configurável, com *unhealthy threshold* e *healthy threshold*. O Nginx também resolve os nomes dos servidores só na partida, e por isso o `reload` depois de mudar a frota; no ASG, o registro e a remoção de instâncias no target group são automáticos.
- Os blocos `upstream` usam `zone` (memória compartilhada) para que os vários processos worker do Nginx dividam o mesmo estado de round-robin. Sem ela, cada worker balanceia por conta própria e contagens exatas como 10/10/10 podem sair irregulares.
- Os comandos `sed -i` com `\n` são do GNU sed. No macOS (BSD sed), use `gsed` (`brew install gnu-sed`) ou edite os arquivos à mão.
- A fila do laboratório é uma **lista do Redis** (`LPUSH` e `BRPOP`). Ela não tem confirmação: se um worker morrer no meio de uma tarefa, a mensagem se perde. O SQS e o RabbitMQ mantêm a mensagem até a confirmação do consumidor, e é essa garantia que o padrão real exige.
- A "CDN" local é uma única borda. Ela reproduz o mecanismo (miss, hit, revalidação com `304`, TTL), mas não a distribuição geográfica, o DNS inteligente nem o WAF. O purge é simulado apagando o cache.
- O Postgres do laboratório usa replicação por streaming **assíncrona**, e o failover é manual. Um serviço gerenciado como o RDS automatiza a detecção e a promoção; o RTO real dele depende dessa automação.
- Em Docker Compose, `deploy.replicas` serve para réplicas locais. Em produção, o equivalente é o ReplicaSet/Deployment (Kubernetes) ou o ASG (AWS), com autoscaling de verdade.

---

## Referências do material

- Beyer et al., *The Site Reliability Workbook* (2018) e *Site Reliability Engineering* (2016).
- Kleppmann, *Designing Data-Intensive Applications* (2017).
- Newman, *Building Microservices* (2015).
- Grigorik, *High Performance Browser Networking* (2013).
- AWS: *What is an Application Load Balancer?*, *Amazon CloudFront Developer Guide*, *Amazon Aurora Features*, *AWS Well-Architected Framework*.
- Kubernetes, *Ingress*; documentação do Karpenter e do KEDA; Cloudflare, *Load Balancing* e *What is a CDN?*; Cockroach Labs, *CAP Theorem*; Netflix Technology Blog.
