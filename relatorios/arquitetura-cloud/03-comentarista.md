# Arquitetura Cloud: da garagem alugada no circuito ao carro seguro, redundante e dentro do teto de gastos, em AWS e Azure

*Boa tarde, boa noite, bom dia, onde quer que você esteja! Está no ar a transmissão do GP da Arquitetura Cloud, e o grid já está formado. O que está em jogo nesta corrida: aprender a operar numa infraestrutura que não é sua, alugada por hora, sem perder o controle do que continua sendo seu (os dados, os acessos e a conta no fim do mês). E vale uma regra de pista para a prova inteira: AWS e Azure são dois circuitos onde a mesma equipe opera, e essa equipe é você.*

*O traçado tem seis setores, e eu narro cada um deles. Setor 1, a reta de largada: o que é nuvem e por que ela troca CapEx por OpEx. Setor 2: os modelos de serviço, da garagem vazia ao pit stop disparado pela chamada do box. Setor 3, o trecho mais técnico do circuito: regiões, zonas, a conta dos noves e o disjuntor. Setor 4: a comparação entre provedores, com método e sem torcida. Setor 5, a engenharia pesada: armazenamento, bancos, balanceadores e a rede desenhada no papel antes de existir. Setor 6, a reta final: segurança, custos e governança, com o teto de gastos de olho em cada etiqueta.*

*Uma orientação antes da largada. Ao longo do guia você vai encontrar blocos chamados **Leitura de cockpit**: neles quem fala é o piloto, em primeira pessoa, lendo cada conceito como a operação de uma equipe num fim de semana de corrida. A minha voz, a do comentarista, aparece em itálico na entrada e na saída de cada setor. E um aviso para ninguém achar que é erro de digitação: em 2026 a etapa do Bahrein foi transferida para Sepang, na Malásia (conforme verificado em 2026-10-06), e por isso este guia fala em "GP do Bahrein em Sepang". Foi essa corrida, em 4 de outubro de 2026, que o piloto conta logo abaixo. Cinto afivelado, viseira abaixada. Vai começar!*

> Guia narrado, versão final: construído sobre a versão didática (`01-professor.md`) dos seis materiais da disciplina "Arquitetura Cloud" (DevOps e Arquitetura Cloud, Fase 1). Cada aula virou uma etapa, na mesma ordem. As aulas originais são conceituais e usam o console dos provedores como demonstração; aqui cada etapa ganha práticas que rodam sem nuvem (cálculo local) ou com comandos de leitura numa conta gratuita. Todo o conteúdo técnico, os comandos, os códigos, as tabelas e a ordem dos exercícios foram preservados. O que muda é a camada de pista: a lente do piloto, que lê cada decisão de arquitetura como a operação de uma equipe num fim de semana de corrida (da garagem alugada no circuito até a sala de operações na fábrica, do outro lado do mundo), e a narração de transmissão que conduz você de etapa em etapa.

No domingo, 4 de outubro de 2026, em Sepang, a corrida deu uma aula de arquitetura cloud. A largada atrasou cerca de 40 minutos por causa da chuva forte. A Ferrari apostou em pneus para pista seca nos dois carros, do Lewis Hamilton e do Charles Leclerc, enquanto quase todo o grid largou de intermediários; como a decisão era a mesma para os dois, os dois despencaram nas primeiras voltas antes de se recuperarem. Um safety car na volta 9 abriu, de uma vez, a janela para quem estava de intermediários trocar para pneus de pista seca. O Max Verstappen controlou a corrida e venceu; o Kimi Antonelli foi segundo e o Hamilton, terceiro. E o carro do George Russell parou na reta durante o último safety car: zero ponto para ele, mas a Mercedes ainda saiu de Sepang com os pontos de um segundo lugar, porque tinha outro carro na pista. Sede alternativa, falha correlacionada, um evento que dispara carga de uma vez só e redundância que salva o resultado: é disso que este módulo trata.

> **Dados de campeonato usados neste guia (verificados em 2026-10-06).** Dados conferidos em fontes públicas em 2026-10-06 (o backend do pitstop estava fora do ar) e reaproveitados do guia de Cultura DevOps desta mesma fase. Pódio em Sepang: Verstappen, Antonelli e Hamilton. Próxima etapa: GP de Singapura, 9 a 11 de outubro de 2026, que neste ano recebe pela primeira vez o formato sprint. A classificação completa do campeonato e as fontes estão em "Fontes dos dados de F1", no fim. Todo cenário com esses nomes que não aconteceu de fato está marcado como **hipotético**.

**Para quem não acompanha F1: o mínimo de pista para ler este guia.** Você não precisa saber nada de corrida; cada termo abaixo é explicado de novo quando aparece.

- **Fábrica e equipe de pista.** Toda equipe tem uma fábrica (onde se projeta, fabrica e testa o carro) e uma equipe que viaja para os circuitos e opera o carro no fim de semana.
- **Circuito.** O autódromo onde acontece a etapa. Ele oferece a estrutura comum: prédio dos boxes, energia, rede, cronometragem, comissários de pista. As equipes chegam, ocupam o espaço e operam ali.
- **Garagem (box).** O espaço de cada equipe no prédio dos boxes, onde o carro é preparado. As 11 equipes do grid ficam lado a lado, cada uma na sua.
- **Pit lane.** A via paralela à reta principal por onde os carros entram para parar na frente da própria garagem.
- **Muro dos boxes (pit wall).** A bancada à beira da pista onde ficam engenheiros e estrategistas olhando os dados do carro em tempo real.
- **Sala de operações remota.** Na fábrica, engenheiros acompanham a sessão ao vivo e falam com o muro; as equipes grandes mantêm uma, com dezenas de pessoas durante o GP.
- **Telemetria.** Os dados que os sensores do carro transmitem ao vivo para o muro e para a fábrica: temperaturas, pressões, velocidades, centenas de canais.
- **Set-up.** O ajuste do carro para um circuito: altura, asas, suspensão, pressões de pneu.
- **Unidade de potência (PU) e ERS.** O motor híbrido da F1: motor a combustão mais uma parte elétrica (o ERS), que recupera energia e a guarda numa bateria para devolvê-la em forma de potência.
- **Dois carros.** Cada equipe corre com dois carros; o regulamento não deixa colocar mais.
- **Pit stop.** A parada no box para trocar pneus, feita por uma crew de mecânicos em poucos segundos, quando o muro chama o piloto pelo rádio ("box, box").
- **Pneus de pista seca e intermediários.** Os de pista seca são lisos; os intermediários têm sulcos para pista úmida.
- **Safety car.** O carro de segurança que entra na pista depois de um incidente e reduz o ritmo de todos; costuma abrir uma janela barata para parar no box.
- **Formato sprint.** Fim de semana com uma corrida curta a mais no sábado e só um treino livre.
- **Túnel de vento.** Instalação onde se testa a aerodinâmica com modelos em escala; o regulamento limita quanto cada equipe pode usá-lo.
- **Teto de gastos (cost cap).** O limite anual de gastos que o regulamento impõe às equipes desde 2021.
- **Cota de componentes.** O regulamento limita quantas peças de cada tipo da unidade de potência cada carro pode usar no ano; passar disso custa largar mais atrás no grid.
- **Carga aerodinâmica.** A força que as asas e o assoalho fazem para grudar o carro no chão: ajuda nas curvas e freia o carro nas retas.
- **Frete marítimo.** Parte do material não urgente viaja de navio, com antecedência, para as etapas fora da Europa; o que é urgente vai de avião.
- **Credencial do paddock.** O passe que define onde cada pessoa pode entrar: paddock, garagem, pit lane.
- **Comissários e liberação insegura.** Os comissários são os juízes da prova e aplicam penalidades. Liberação insegura é soltar o carro do pit stop de forma perigosa, e é infração.
- **Abandono.** O carro que não termina a corrida.

**O que você vai saber fazer ao final deste guia:** explicar o que é computação em nuvem e por que ela troca CapEx por OpEx; distinguir nuvem pública, privada e híbrida; escolher entre IaaS, PaaS, SaaS e FaaS pela matriz de responsabilidade; explicar regiões, zonas de disponibilidade, pontos de presença, SLI/SLO/SLA e o padrão Circuit Breaker; comparar os principais provedores com uma metodologia (e não com torcida); desenhar uma VPC (AWS) ou VNet (Azure) com sub-redes e blocos CIDR calculados por você; escolher armazenamento, banco de dados e balanceador pelo problema que cada um resolve; entender IAM, criptografia, MFA e segurança de rede em camadas; auditar tags, calcular economia de custo e aplicar os pilares do Well-Architected. Em todas as etapas, **AWS e Azure aparecem lado a lado**, com o equivalente de cada serviço e a explicação honesta de onde eles diferem.

## Como ler este guia: os dois campos paralelos

O material original fala quase só de AWS (e de Google Cloud em vários exemplos). O pareamento com a Azure é **acréscimo didático do professor**. Convenções:

- Toda tabela **AWS x Azure** é acréscimo do professor, salvo onde a legenda disser "do material". O bruto cita a Azure em poucos pontos (VMs, App Service, Functions, Cosmos DB, Azure SQL, Fabric, Arc, Entra ID, Defender for Cloud, Advisor, Monitor, Resource Graph, Network Watcher, NSGs, Zonas de Disponibilidade e ZRS, framework Well-Architected). O resto do pareamento é meu.
- A coluna "O que muda de verdade" é onde mora o valor. Dois serviços "equivalentes" raramente são idênticos: mudam o escopo (regional ou global), o estado (stateful ou stateless), o modelo de cobrança, o nome das peças ao redor.
- **Números de mercado** só aparecem quando estão no material, marcados como "(material, ref. jun/2025)". São projeções e fotografias de uma data; em 2026, várias já venceram ou mudaram. Não os cite como fato atual.
- **Preços e descontos** deste guia são **fictícios**, medidos em "UM" (unidade monetária inventada) e sempre sinalizados. Preço real: calculadora oficial de cada provedor.
- **Separador decimal.** No texto, decimais usam vírgula, como em português (99,9%). Nas saídas dos scripts aparece ponto (`99.9%`), porque `awk` e `python3` imprimem assim; é o mesmo número.
- **Nomes de serviço mudam.** O material foi consultado em junho de 2025. Onde sei que há renomeação ou transição em curso, aviso. Em dúvida, a documentação oficial manda.

**Pré-requisitos:**

- Um terminal com `bash`, `awk` e `python3` (para os cálculos locais). Linux, macOS ou WSL servem.
- Opcional, para os comandos de leitura: **AWS CLI v2** (`aws`) e **Azure CLI** (`az`), cada uma com uma conta gratuita. As regras de nível gratuito, créditos e prazos mudam com frequência: confirme na página oficial de cada provedor antes de criar a conta.
- Opcional: `openssl` 1.1.1 ou superior (já vem na maioria dos Linux). No macOS, o `openssl` do sistema costuma ser o LibreSSL, e versões antigas dele não aceitam a opção `-pbkdf2` usada na Etapa 06; se ela for rejeitada, instale o OpenSSL pelo Homebrew (`brew install openssl`) e use o binário instalado por ele. Confira a versão com `openssl version`.
- Nada aqui exige que você crie máquinas, bancos ou redes na nuvem.

> **Cuidado com custo.** Comandos de **leitura** (`describe-*`, `list-*`, `show`, `list`) consultam o que já existe e, em regra, não geram cobrança. Comandos que **criam** recursos podem gerar custo; quando aparecem, vêm marcados com **[CRIA RECURSO]** e acompanhados do comando de limpeza. Neste guia não há nenhum comando que crie recursos: todos os comandos `aws` e `az` são de leitura ou de validação. Ao terminar qualquer experimento na nuvem, confira no console se não ficou nada para trás.

**Arquivos locais do guia** (você vai criando aos poucos, na pasta `lab-cloud` dentro da sua pasta pessoal):

```text
~/lab-cloud/      # caminho guardado na variável LAB
  etapa-01/   # cálculo CapEx x OpEx
  etapa-02/   # função stateless
  etapa-03/   # disponibilidade e Circuit Breaker
  etapa-04/   # matriz de decisão
  etapa-05/   # plano de CIDR, CloudFormation e Bicep
  etapa-06/   # envelope encryption, tags e custos
```

Antes da Etapa 01, defina a variável `LAB` e crie as pastas. Todos os comandos do guia usam essa variável:

```sh
LAB="$HOME/lab-cloud"    # pasta base do laboratório; todos os caminhos do guia partem dela
mkdir -p "$LAB"/etapa-01 "$LAB"/etapa-02 "$LAB"/etapa-03 "$LAB"/etapa-04 "$LAB"/etapa-05 "$LAB"/etapa-06
ls "$LAB"                 # confere: etapa-01 a etapa-06
```

Como os comandos usam o caminho completo (`"$LAB"/etapa-XX`), eles funcionam a partir de qualquer pasta, mesmo depois de um `cd`. A variável vale só para o terminal aberto: se abrir outro terminal, rode de novo a linha `LAB="$HOME/lab-cloud"` antes de continuar.

## Quadro de-para: cole isto no volante

A mesma analogia vale do começo ao fim do documento. Se a VM é um carro na Etapa 01, ela continua sendo um carro na Etapa 06. Aqui ficam só as peças centrais; cada analogia é explicada de novo no ponto em que aparece. O quadro completo, com todas as analogias usadas, está no [Apêndice: quadro de-para completo](#apêndice-quadro-de-para-completo), no fim do documento.

Uma regra vale para o documento inteiro: **AWS e Azure não viram equipes de F1.** Os dois provedores entram na analogia do mesmo jeito, como dois circuitos diferentes onde a mesma equipe (você) opera.

| Arquitetura cloud | Fórmula 1 |
|---|---|
| Provedor de nuvem (AWS ou Azure) | O circuito: a infraestrutura que a equipe usa para operar (garagem, energia, rede, cronometragem); a mesma equipe opera nos dois |
| Nuvem pública, privada e híbrida | O circuito compartilhado pelas 11 equipes; a fábrica da equipe; e as duas ligadas por uma conexão |
| IaaS, PaaS, SaaS e FaaS | Garagem vazia com carro-padrão; garagem equipada e mantida pelo circuito; serviço pronto, como a cronometragem oficial; pit stop disparado pela chamada do box |
| Responsabilidade compartilhada | O circuito cuida de pista, barreiras e estrutura; a equipe cuida do carro, da garagem e de quem entra nela |
| VM (instância) | Um carro: a unidade de capacidade que vai para a pista (na IaaS, o carro-padrão que o circuito entrega) |
| Região e zona de disponibilidade | A sede geográfica do circuito; e os pavilhões independentes dentro dela, cada um com energia, refrigeração e rede próprias |
| Redundância em paralelo | Os dois carros da equipe: se um abandona, o outro ainda pontua |
| SLI, SLO e SLA | O número na telemetria; a meta interna com folga; o limite formal que custa penalidade |
| Circuit Breaker | Desligar o sistema que falha em sequência e, algumas voltas depois, tentar um único reset |
| VPC e sub-redes | A área reservada da equipe no circuito, dividida em setores com acessos diferentes |
| IAM | O credenciamento: quem é você e onde a sua credencial deixa entrar |
| FinOps e tags | O teto de gastos e a etiqueta de cada peça com o seu centro de custo |

## Onde a comparação para

A analogia organiza o raciocínio, mas não substitui o modelo técnico. Os limites principais, que eu repito no texto quando aparecem:

- **Um circuito real fica num lugar só.** Um provedor tem sedes em dezenas de lugares do mundo (as regiões). Neste guia, leia "circuito" como o dono da infraestrutura, com várias sedes.
- **Dois carros, sempre.** O regulamento fixa dois carros por equipe. Na nuvem, o número de máquinas sobe e desce sozinho; escala horizontal e elasticidade não têm equivalente na pista.
- **Pavilhões independentes não existem no autódromo.** Num autódromo real há um único prédio dos boxes, com as garagens lado a lado; um problema no prédio atinge todas. Zonas de disponibilidade são fisicamente separadas justamente para evitar isso.
- **O circuito não se escolhe.** O calendário decide onde a equipe corre. Na nuvem, a escolha do provedor é sua, a saída pode custar caro (lock-in) e dá para usar os dois ao mesmo tempo.
- **Peça é matéria; dado é cópia.** Uma peça existe numa unidade. Um objeto, um disco replicado ou uma cópia em cache existe em quantas cópias você quiser.

Sempre que houver conflito entre a pista e o terminal, vale o que está no terminal: definições, comandos e saídas esperadas do texto técnico.

---

## Etapa 01: Introdução à Computação em Nuvem

*APAGARAM-SE AS LUZES! Largada do GP da Arquitetura Cloud, e a primeira curva é uma pergunta de dinheiro: comprar a estrutura para o pior dia do ano ou alugar só quando precisar? Antes de qualquer serviço, entenda o que a nuvem resolve e o que ela não promete. Fica comigo.*

### O problema

Uma loja online (vamos chamá-la de Mercadinho Digital) vende pouco o ano inteiro e muito em novembro. Em março, a diretoria aprova a compra de dez servidores para aguentar a Black Friday. A aprovação demora semanas, a entrega e a instalação demoram meses, e o dinheiro (capital) fica parado em hardware que passa onze meses quase ocioso. Se a campanha viralizar e o pico for maior que o previsto, o site cai e não há como comprar servidor em uma tarde. Se um alagamento atingir a sala de servidores, tudo cai junto, porque tudo está em um único lugar.

Cada dor dessa história é uma limitação da TI tradicional que o material lista: **custo inicial alto (CapEx)**, **ciclos longos de compra**, **falta de elasticidade**, **manutenção toda interna**, **vulnerabilidade a desastres locais** e **agilidade baixa**. A computação em nuvem existe para atacar exatamente essas dores.

**Leitura de cockpit:** o Mercadinho comprando dez servidores em março para a Black Friday é a equipe que decide, no começo do ano, quanta estrutura vai precisar no pior fim de semana da temporada e paga por ela o ano inteiro. Na F1, a capacidade comprada é a infraestrutura própria: túnel de vento, simulador, bancadas. É cara, demora a ficar pronta e passa parte do tempo parada. E se tudo está num prédio só, um problema naquele prédio para tudo.

### O conceito

**Computação em nuvem** é a entrega de recursos de computação (hardware, armazenamento, bancos de dados, rede e software) **sob demanda**, por uma rede (em geral a Internet), sem que você gerencie a infraestrutura física.

**Analogia da energia elétrica.** Você não constrói uma usina para ligar a geladeira: liga o aparelho e paga a conta pelo consumo. A nuvem faz o mesmo com computação. A TI tradicional é ter o seu gerador (caro, ocupa espaço, você conserta); a nuvem é a rede elétrica (você consome e paga pelo uso).

**Leitura de cockpit:** é por isso que, no nosso mapa, cada provedor é um **circuito**. A equipe não constrói o autódromo para correr: chega, ocupa a garagem que o circuito oferece, usa a energia, a rede e a cronometragem de lá, e opera. AWS e Azure são dois circuitos diferentes, cada um com instalações e nomes próprios, e a equipe (você) leva para os dois o mesmo procedimento. Nenhum dos dois vira equipe de F1 neste guia. **Aqui a analogia para:** um autódromo real fica num lugar só; um provedor tem sedes em dezenas de lugares do mundo (as regiões, na Etapa 03). Leia "circuito" como o dono da infraestrutura, com várias sedes.

**TI tradicional x nuvem** (síntese da Tabela 2 do material):

| Característica | TI tradicional | Nuvem |
|---|---|---|
| Modelo de custo | CapEx: grande investimento inicial | OpEx: pagamento por uso ou assinatura |
| Propriedade | Ativos da empresa | Ativos do provedor (alugados como serviço) |
| Aquisição | Meses | Minutos ou horas |
| Escalabilidade e elasticidade | Capacidade fixa; ampliar exige compra | Recursos sob demanda, ajustáveis em tempo real |
| Manutenção | Equipe interna | Principalmente do provedor |
| Recuperação de desastres | Exige infraestrutura redundante própria | Backup e DR integrados do provedor |

**CapEx x OpEx.** CapEx (*Capital Expenditures*) é investimento único em ativo fixo (servidor, licença, data center), depreciado ao longo dos anos. OpEx (*Operational Expenditures*) é gasto recorrente da operação (assinatura, pagamento por uso). Trocar CapEx por OpEx não significa "ficar mais barato" por definição; significa transformar custo fixo em variável, testar ideias sem grande compromisso e alinhar gasto ao uso real. O material chama de "paradoxo": a previsibilidade da TI tradicional pode custar mais no longo prazo por ineficiência e oportunidades perdidas.

**Leitura de cockpit:** CapEx é construir o próprio túnel de vento: investimento grande, depreciado por anos, e o prédio continua seu (e custando) nas semanas em que ninguém o usa. OpEx é pagar por hora de túnel numa instalação de terceiros: custo variável, sem obra, só quando há modelo para testar. Nenhuma das duas é "mais barata" por definição; depende de quanto e com que regularidade você usa. **Aqui a analogia para:** na F1 o uso do túnel é racionado pelo regulamento, seja ele próprio ou alugado. Na nuvem, o limite do OpEx é o seu orçamento.

**Escalabilidade e elasticidade.** Escalabilidade é a capacidade de lidar com carga crescente aumentando recursos: **vertical** (*scale up*, uma máquina maior) ou **horizontal** (*scale out*, mais máquinas). Elasticidade é a escalabilidade operada automaticamente, para cima e para baixo, em tempo real, pagando só pelo que se usa. Escalabilidade é a capacidade de crescer; elasticidade é crescer e encolher sozinho.

**Leitura de cockpit:** escala vertical é pedir mais potência ao mesmo carro: funciona até bater no teto (na F1, o regulamento; na nuvem, o maior tamanho de máquina disponível). Escala horizontal é colocar mais carros na pista. Elasticidade seria a equipe correr com dois carros numa prova tranquila e com seis quando a prova aperta, sem ninguém pedir, e voltar a dois no fim. **Aqui a analogia para:** isso não existe na F1: o regulamento fixa dois carros por equipe, sempre. Na nuvem, a frota cresce e encolhe sozinha, e esse é o ganho que a pista não tem.

**Agilidade, alta disponibilidade (HA), recuperação de desastres (DR) e alcance global.** Agilidade é montar e desmontar recursos em minutos. HA é manter o serviço no ar mesmo quando um componente falha (redundância e failover automático), o que permite SLAs de 99,9% ou 99,99%. DR é ter uma cópia fora do ambiente principal, ativável em outra região. Alcance global é implantar perto do cliente, com baixa latência.

**Modelos de implantação:**

- **Nuvem pública:** recursos de um provedor terceirizado, compartilhados entre vários "inquilinos" (*multi-tenant*), entregues pela Internet. Conveniência e elasticidade ao custo de menos controle e possíveis questões de conformidade e soberania de dados. *Analogia:* transporte coletivo.
- **Nuvem privada:** ambiente dedicado a uma organização, no seu data center ou hospedado em servidores dedicados. Muitas vezes é imposição regulatória (finanças, saúde, governo). *Analogia:* carro próprio.
- **Nuvem híbrida:** mistura de pública, privada e borda, integradas por rede local ou de longa distância, VPN, conexões dedicadas e APIs. A predominância dela não é indecisão: é evolução pragmática, porque nem tudo pode (ou precisa) ir para a nuvem pública por conformidade, legado ou latência. *Analogia:* ter carro e usar o transporte coletivo conforme o trajeto. Desvantagens do material: ainda exige investir e manter hardware interno, exige conhecimentos novos, aumenta a complexidade e a visibilidade fica difícil.

**Leitura de cockpit:** nuvem pública é o circuito: a mesma estrutura (prédio dos boxes, energia, rede, cronometragem) atende as 11 equipes do grid ao mesmo tempo, cada uma na sua garagem, sem enxergar a do vizinho. É *multi-tenant* na veia. Nuvem privada é a fábrica: tudo dedicado à equipe, tudo sob controle dela, tudo pago por ela. Nuvem híbrida é o que as equipes fazem em todo GP: a garagem no circuito ligada à sala de operações remota na fábrica. A ligação pode ser um túnel cifrado pela Internet (VPN) ou uma linha dedicada contratada de um parceiro de conectividade (Direct Connect na AWS, ExpressRoute na Azure). E o motivo da hibridez é o mesmo do material: nem tudo pode ou precisa ir para o circuito; o projeto do carro fica em casa.

**Adoção como transformação organizacional.** O material descreve quatro domínios de uma organização "cloud-first": liderança (*Lead*), aprendizagem (*Learning*), escalabilidade (*Scaling*) e segurança (*Secure*). E cita o Cloud Adoption Framework da AWS, com seis perspectivas: Negócios, Pessoas, Governança, Plataforma, Segurança e Operações. O Gartner, citado no material, aponta a "insatisfação com a nuvem" (expectativas irreais, implementação ruim, custo descontrolado) como risco real.

**Os dois campos, lado a lado** *(acréscimo do professor, salvo onde indicado)*:

| Conceito | AWS | Azure | O que muda de verdade |
|---|---|---|---|
| Região e zonas | Regions e Availability Zones (AZs) | Regions e Availability Zones | Nos dois, região é área geográfica e AZ é local isolado dentro dela. Na Azure, **nem toda região tem zonas**; confira a região antes de projetar. Nos dois, o nome da zona vista por você pode mapear para uma zona física diferente da vista por outra conta ou assinatura (veja a Etapa 03) |
| Rede privada híbrida via Internet | Site-to-Site VPN | VPN Gateway | Nos dois, túnel IPsec entre a rede da nuvem e a sua. Na Azure, a VPN Gateway é um recurso implantado numa sub-rede própria; na AWS, usam-se Virtual Private Gateway (ou Transit Gateway) e Customer Gateway |
| Conexão dedicada | Direct Connect | ExpressRoute | Nos dois, conexão privada dedicada, que não passa pela Internet pública, com mais banda e menos latência que VPN; contratado com um parceiro ou provedor de conectividade. Preço e prazos de contratação variam por localidade |
| Estender a nuvem ao seu data center | AWS Outposts | Azure Stack (HCI e Hub) e Azure Arc | **Diferem de verdade.** Outposts é hardware da AWS instalado no seu data center e operado como extensão de uma AZ. Azure Arc **não é hardware**: é um plano de gerenciamento Azure que enxerga servidores e serviços onde quer que estejam (material: "em qualquer lugar, on-premises ou outras nuvens"). O par mais próximo do Outposts é o Azure Stack. O nome do ramo HCI foi alterado pela Microsoft (Azure Local, conforme a documentação em 2026); confirme na documentação |
| Framework de adoção | AWS Cloud Adoption Framework (CAF) | Microsoft Cloud Adoption Framework (CAF) | A AWS organiza por **perspectivas** (Negócios, Pessoas, Governança, Plataforma, Segurança, Operações, como no material). A Microsoft organiza como **ciclo de fases** (estratégia, plano, preparação, adoção, governança, gestão, com a segurança atravessando todas). Mesma intenção, desenho diferente |

**Leitura de cockpit:** a diferença entre Outposts e Arc é a diferença entre receber equipamento e receber um painel. Outposts é como se o circuito instalasse um pedaço da própria infraestrutura (o rack dele, operado por ele) dentro da sua fábrica, e você só garantisse espaço, energia, refrigeração e rede. Azure Arc é o painel de controle do circuito passando a enxergar e gerenciar os seus equipamentos onde quer que estejam, sem levar hardware nenhum. Quem quer o hardware do circuito Azure dentro de casa procura a linha Azure Stack. **Aqui a analogia para:** nenhum autódromo instala garagem dentro da fábrica de uma equipe; o paralelo serve só para separar "hardware do provedor no seu local" de "gestão do provedor sobre o seu local".

**No mercado (material, ref. jun/2025):** o material projeta que 50% dos recursos de nuvem seriam dedicados a cargas de IA até 2029 e que o Gartner prevê que 25% das empresas teriam insatisfação significativa com a nuvem até 2028. Use como contexto, não como dado atual.

### Exemplo comentado: quanto custa o pico? (números fictícios)

Voltando ao Mercadinho Digital. O modelo abaixo compara dois mundos com números **inventados** para este exercício. Ele ignora muita coisa real (equipe, transferência de dados, energia, licenças) e serve só para ver a mecânica: custo fixo paga o pico o ano todo; custo variável paga o pico só quando ele existe.

Crie o arquivo `$LAB/etapa-01/capex_opex.sh`:

```sh
awk 'BEGIN {
  # ATENÇÃO: todos os valores são FICTÍCIOS. UM = unidade monetária inventada.

  # --- Mundo 1: servidores próprios (CapEx) ---
  preco_servidor = 3600       # compra de 1 servidor
  qtd_pico = 10               # compramos para o pior dia do ano
  vida_util = 36              # meses em que o ativo é depreciado
  manutencao = 300            # custo mensal fixo de manutenção
  onprem = qtd_pico * preco_servidor / vida_util + manutencao   # custo mensal equivalente

  # --- Mundo 2: nuvem (OpEx, pagamento por hora) ---
  preco_hora = 0.50           # 1 VM por hora
  horas_mes = 730             # aproximação de horas em um mês
  normal = 2 * preco_hora * horas_mes    # 11 meses com 2 VMs
  pico   = 10 * preco_hora * horas_mes   # 1 mês (novembro) com 10 VMs
  nuvem  = (11 * normal + pico) / 12     # média mensal ao longo do ano

  printf "on-premises: %.2f UM/mes\n", onprem
  printf "nuvem:       %.2f UM/mes\n", nuvem
}'
```

Rode:

```sh
sh "$LAB"/etapa-01/capex_opex.sh
```

Saída esperada:

```text
on-premises: 1300.00 UM/mes
nuvem:       973.33 UM/mes
```

Leia o resultado com cuidado: ele **não prova** que nuvem é mais barata. Mostra que, com um pico curto e muito acima da média, pagar por hora é vantajoso; se a carga fosse constante nas 24 horas dos 12 meses, a conta mudaria (e é por isso que existem compromissos de uso, na Etapa 06).

**Leitura de cockpit:** é a conta do túnel de vento alugado. Se a equipe precisa de muito túnel num mês só, alugar ganha. Se usa o mesmo tanto o ano inteiro, ter o próprio (ou fechar um contrato longo) começa a compensar. Quem decide é o formato da sua demanda, não a moda.

### Mão na massa

*Cronômetro na mão! Primeiro você mexe nos números do Mercadinho e vê a vantagem da nuvem encolher; depois pergunta a cada circuito onde ficam as sedes dele. Só leitura, nada é criado.*

**1. Mude os números e observe.** Simule uma carga quase plana trocando duas coisas no arquivo `$LAB/etapa-01/capex_opex.sh`: na linha `qtd_pico = 10`, troque o `10` por `4`; na linha `pico   = 10 * preco_hora * horas_mes`, troque o `10` (o número de VMs no mês de pico, que não tem nome de variável) por `4`. Rode de novo com `sh "$LAB"/etapa-01/capex_opex.sh`.

Saída esperada:

```text
on-premises: 700.00 UM/mes
nuvem:       790.83 UM/mes
```

A vantagem **inverteu**: com um pico baixo, os 4 servidores próprios saem mais baratos que as VMs alugadas o ano inteiro. Moral: elasticidade só vale dinheiro quando há variação de carga.

**2. Liste as regiões de cada provedor (somente leitura).** Requer a CLI de cada provedor autenticada (`aws configure` com uma chave de uma conta gratuita; `az login`).

Checagem de que a CLI está instalada (não precisa de conta):

```sh
aws --version     # imprime algo como: aws-cli/2.x.x Python/3.x ...
az --version      # imprime a versão do azure-cli e das extensões instaladas
```

Regiões na AWS (consulta as regiões habilitadas para a sua conta):

```sh
aws ec2 describe-regions --query "Regions[].RegionName" --output text
# --query: filtro JMESPath, pega só o campo RegionName de cada região
# --output text: imprime em uma linha, separado por tabulação
```

Saída esperada (ilustrativa, a sua lista varia conforme as regiões habilitadas):

```text
ap-south-1  eu-west-1  ... sa-east-1  us-east-1  us-west-2 ...
```

Regiões na Azure (`az account list-locations` lista localizações da assinatura; o filtro mantém só as físicas):

```sh
az account list-locations \
  --query "[?metadata.regionType=='Physical'].{regiao:name, nome:displayName}" \
  --output table
```

Saída esperada (ilustrativa):

```text
Regiao       Nome
-----------  ------------
brazilsouth  Brazil South
eastus       East US
...
```

Observe: a Azure usa nomes como `brazilsouth` (São Paulo); a AWS usa `sa-east-1` (também São Paulo). Nomes diferentes, mesma ideia: o lugar físico onde o recurso vive.

**Leitura de cockpit:** `sa-east-1` e `brazilsouth` são duas sedes na mesma cidade, uma de cada circuito, cada uma com o seu sistema de nomes. Na hora de configurar, vale o nome que aquele circuito usa; o procedimento da equipe é o mesmo nos dois.

### Exercícios

*Volta lançada! Quatro perguntas, sem olhar o texto: CapEx ou OpEx, modelo de implantação, escalabilidade ou elasticidade, Outposts ou Arc. Relógio rodando.*

1. **CapEx ou OpEx?** Classifique: (a) comprar 5 servidores para o data center; (b) assinatura mensal de um CRM em SaaS; (c) pagar por hora de uma VM; (d) construir uma sala-cofre. *Resposta esperada:* (a) CapEx; (b) OpEx; (c) OpEx; (d) CapEx.
2. **Qual modelo de implantação?** Um banco é obrigado por lei a manter dados de clientes em território nacional e quer usar IA em nuvem pública para análise de dados não sensíveis. *Resposta esperada:* nuvem híbrida (dados regulados em ambiente privado ou em região que cumpre a regra; análise na pública), integrada por VPN ou conexão dedicada (Direct Connect na AWS, ExpressRoute na Azure).
3. **Escalabilidade ou elasticidade?** O site dobra de capacidade às 19h e volta ao normal às 23h sem ninguém tocar em nada. Qual dos dois termos descreve melhor? *Resposta esperada:* elasticidade, porque é ajuste automático nos dois sentidos; escalabilidade é a capacidade de crescer, que a elasticidade operacionaliza.
4. **Outposts ou Arc?** Você precisa de um rack da nuvem dentro do seu data center, com baixa latência para uma fábrica. Qual serviço da AWS e qual o par mais próximo na Azure? *Resposta esperada:* AWS Outposts; na Azure, a linha Azure Stack (hardware e software no seu local). Azure Arc, sozinho, gerencia mas não entrega hardware.

### Anota aí

> Nuvem é computação vendida como serviço: você troca capital parado (CapEx) por consumo medido (OpEx), e só ganha de verdade quando a sua carga varia ou quando você precisa de velocidade, alcance e resiliência que não conseguiria comprar sozinho.

*Setor 1 no verde! Você já sabe por que a equipe aluga a garagem em vez de construir o autódromo, e que alugar só compensa de verdade quando a carga varia. Agora vem a pergunta seguinte: dentro da garagem alugada, quanto do trabalho fica com você? Etapa 02, os modelos de serviço.*

---

## Etapa 02: Modelos de Serviço: IaaS, PaaS, SaaS e FaaS

*Segundo setor, e a pista sobe uma escada: garagem vazia, garagem equipada, serviço pronto, pit stop sob demanda. A cada degrau você opera menos e controla menos. Só uma linha da matriz não muda de dono em degrau nenhum, e é nela que mora a pegadinha do setor. Olho na tabela.*

### O problema

Uma equipe de três pessoas lança um produto em dois meses. Quem vai instalar o sistema operacional, aplicar patches de segurança, configurar o servidor web, escalar quando o tráfego subir? Se a resposta for "nós, tudo", sobra pouco tempo para o produto. Se for "o provedor, quase tudo", sobra pouco controle para ajustar o que for específico. A pergunta de fundo é: **quanto da pilha tecnológica eu quero operar e quanto quero terceirizar?** Os modelos de serviço são as respostas padronizadas a essa pergunta.

**Leitura de cockpit:** toda equipe de F1 enfrenta uma versão dessa pergunta: quanto do carro eu faço e quanto eu compro pronto? Projetar a unidade de potência e a caixa de câmbio, ou comprar de um fabricante e concentrar a fábrica no que diferencia o carro? Quem faz tudo controla tudo e paga por tudo; quem compra ganha tempo e perde liberdade para mudar. É a mesma troca entre controle e conveniência que os modelos de serviço padronizam.

### O conceito

**Analogia da moradia.**

- **On-premises:** você compra o terreno, constrói a casa e cuida de tudo.
- **IaaS:** você aluga uma casa vazia. A estrutura e a rede elétrica são do proprietário; móveis, pintura e manutenção do interior são seus.
- **PaaS:** você aluga uma casa mobiliada. Só traz a sua mala (o seu código e dados).
- **SaaS:** você se hospeda num hotel. Usa o serviço, não cuida de nada.
- **FaaS:** você pega um carro por aplicativo. Paga só pela corrida e não pensa em garagem, combustível nem manutenção.

**Leitura de cockpit:** na pista, a escada fica assim, sempre com o provedor no papel de circuito:

- **On-premises:** ter a própria pista e as próprias instalações e cuidar de tudo, como a pista de testes que a Ferrari mantém em Fiorano.
- **IaaS:** o circuito entrega a garagem vazia, com energia, rede e um carro-padrão (a VM). Motor, eletrônica, set-up e operação, do sistema operacional para cima, são seus.
- **PaaS:** o circuito entrega a garagem equipada e mantida, com bancadas, ferramentas e equipe de apoio. Você traz o acerto e a estratégia (o seu código e os seus dados).
- **SaaS:** você usa um serviço pronto do circuito, como a cronometragem oficial. Não opera nada, só consome.
- **FaaS:** o pit stop. Disparado por um evento (a chamada "box, box"), dura segundos, tem tempo-limite e a crew não guarda memória entre uma parada e outra: o que importa (qual pneu, quantas voltas) mora no sistema do estrategista.

**Aqui a analogia para:** na F1 nenhum circuito fornece carro; o regulamento obriga cada equipe a projetar o próprio chassi. O "carro-padrão" é só a imagem para "máquina pronta, operada por você do SO para cima". E a crew de pit stop é paga pelo fim de semana inteiro, parada ou não; a FaaS cobra só pelo tempo de execução.

**Camadas de abstração.** Quanto mais alta a abstração (de IaaS para FaaS), mais responsabilidade o provedor assume e menos controle o cliente tem. Em troca você ganha conveniência, implantação rápida, escalabilidade pronta e custo inicial menor; paga com menos flexibilidade e **risco de vendor lock-in** (dependência de ferramentas específicas que dificulta migrar).

**Os quatro modelos:**

- **IaaS (Infraestrutura como Serviço):** servidores virtuais (ou bare metal), armazenamento e rede sob demanda. Você gerencia SO, middleware, aplicações e dados. Bom para controle total, migração *lift-and-shift* (levar a aplicação como está) e ambientes que exigem controlar patches do SO.
- **PaaS (Plataforma como Serviço):** plataforma para desenvolver, executar e gerenciar aplicações. O provedor cuida de servidores, SO, runtime e middleware; você escreve código e cuida de aplicação e dados. Combina com CI/CD e DevOps. Desvantagens: menos controle, risco de lock-in, personalização limitada.
- **SaaS (Software como Serviço):** aplicação completa, por assinatura. Arquitetura *multi-tenant*: uma instância atende vários clientes com dados separados. Desvantagens: pouco controle, dependência do fornecedor e risco de **Shadow IT** (funcionários usando aplicações sem gestão da TI).
- **FaaS (Funções como Serviço, ou *serverless*):** você escreve funções pequenas, disparadas por eventos (requisição HTTP, upload de arquivo, mudança em banco). O provedor executa, escala de zero até o pico e cobra pelo tempo de execução. Cada execução é independente (**stateless**). Desvantagens: *cold start* (latência inicial), tempo máximo de execução (timeout), estado difícil de manter, testes mais complexos. "Serverless" não significa ausência de servidores, e sim que você não se preocupa com eles.

**Matriz de responsabilidade compartilhada** (quem cuida de cada camada; Tabela 1 da Aula 02 do material, na versão corrigida conforme a Nota do professor 1: a linha Dados fica com o cliente em todos os modelos, ao contrário do que a tabela da Aula 01 dizia para o SaaS):

| Camada | On-prem | IaaS | PaaS | SaaS | FaaS |
|---|---|---|---|---|---|
| Aplicações | Cliente | Cliente | Cliente | Provedor | Cliente |
| Dados | Cliente | Cliente | Cliente | Cliente | Cliente |
| Runtime | Cliente | Cliente | Provedor | Provedor | Provedor |
| Middleware | Cliente | Cliente | Provedor | Provedor | Provedor |
| Sistema operacional | Cliente | Cliente | Provedor | Provedor | Provedor |
| Virtualização | Cliente | Provedor | Provedor | Provedor | Provedor |
| Servidores, armazenamento, rede, instalações | Cliente | Provedor | Provedor | Provedor | Provedor |

Duas leituras importantes. Primeira: a linha **Dados é "Cliente" em todas as colunas**. Mesmo no SaaS, quem decide quem acessa e o que é guardado é você. É o "segurança **na** nuvem" (cliente) contra "segurança **da** nuvem" (provedor). Segunda: **não existe modelo "melhor"**, existe o que combina com os requisitos do projeto, a expertise da equipe, a sensibilidade dos dados e o orçamento. Organizações reais combinam: IaaS para o processamento de back-end, PaaS para desenvolvimento, SaaS para CRM e e-mail.

**Leitura de cockpit:** a linha "Dados" é a telemetria e o set-up da equipe. Não importa de quem é a garagem, a energia ou a cronometragem: quem decide quem vê os dados do carro e o que se guarda é a equipe. Se um engenheiro manda a planilha de set-up para o endereço errado, o circuito não tem nada com isso. É o "segurança **na** nuvem" com cheiro de borracha.

**Os dois campos, lado a lado** *(acréscimo do professor; o material cita Azure VMs, App Service e Functions)*:

| Modelo | AWS | Azure | O que muda de verdade |
|---|---|---|---|
| IaaS (VM) | Amazon EC2 | Azure Virtual Machines | Mesmo conceito. Na AWS, o tamanho se chama *instance type*; na Azure, *VM size*. Nos dois, você escolhe imagem, tamanho, disco e rede, e responde pelo SO |
| IaaS (disco de bloco) | Amazon EBS | Azure Managed Disks | Volume de bloco anexado à VM. "Managed" na Azure significa que você não cuida da conta de armazenamento por trás do disco. Nos dois, o disco é cobrado pelo tamanho provisionado |
| PaaS (aplicação web) | AWS Elastic Beanstalk | Azure App Service | **Mesma promessa, filosofias diferentes.** O Beanstalk orquestra recursos que continuam visíveis na sua conta (instâncias, balanceador, grupo de autoscaling). O App Service é uma plataforma de hospedagem em que você escolhe um plano e implanta; a infraestrutura abaixo não aparece como recursos seus |
| FaaS | AWS Lambda | Azure Functions | Em ambos, código disparado por evento e cobrança por uso. Na AWS, uma requisição HTTP para a função costuma passar por um serviço à parte (o API Gateway, cujo preço o material alerta que pode pesar); para casos simples, a Lambda também oferece as *Function URLs*, um endereço HTTPS próprio da função, sem API Gateway (acréscimo do professor; confira recursos e limites na documentação). Na Azure, o gatilho HTTP vem na própria Function. Na Azure, funções se agrupam em um *Function App* com um plano de hospedagem; na AWS, a função é a unidade |
| SaaS | (não é o foco dos provedores) | Microsoft 365 (citado no material como Office 365) | SaaS é o software pronto de qualquer fornecedor (Salesforce, Slack, Dropbox no material). Não há "equivalente" a mapear: é uma categoria, não um serviço de infraestrutura |

**Honestidade sobre FaaS:** a cobrança nos dois é por execução e tempo, mas as unidades de medida, os limites de tempo e as formas de reduzir *cold start* são diferentes. Consulte a página de preços e os limites de cada um antes de comparar custo; não existe conversão "1 para 1".

### Exemplo comentado: por que "stateless" importa

O material diz que FaaS é stateless e que isso é restrição de design e chave da escala. Veja o problema em 6 linhas. Crie `$LAB/etapa-02/funcao.py`:

```python
contador = 0  # estado guardado em memória do processo: NÃO é confiável em FaaS


def handler(evento):
    global contador  # permite alterar a variável de fora da função
    contador += 1  # soma 1 a cada invocação que cair NESTA instância
    return {"recebido": evento, "contador": contador}
```

Rode duas "invocações" no mesmo processo:

```sh
cd "$LAB"/etapa-02    # entra na pasta para o python3 encontrar o funcao.py
python3 -c "import funcao; print(funcao.handler('a')); print(funcao.handler('b'))"
```

Saída esperada:

```text
{'recebido': 'a', 'contador': 1}
{'recebido': 'b', 'contador': 2}
```

Aqui o contador "funcionou" porque as duas chamadas caíram no mesmo processo. Em Lambda ou Azure Functions, a plataforma pode reaproveitar uma instância (funciona às vezes) ou criar outras (o contador volta a 1). O comportamento é imprevisível, e **é essa a armadilha**: a função parece certa em teste e quebra em produção. A regra: estado que importa vai para fora (banco, cache, armazenamento de objetos).

**Leitura de cockpit:** em Sepang, o safety car da volta 9 foi o evento que abriu, de uma vez, a janela de pit stop para quem estava de intermediários. É o perfil de carga da FaaS: nada, depois um pico disparado por um evento, depois nada. E repare como a crew trabalha: ela não decide nem guarda de cabeça que pneu vai no carro; essa informação está no sistema da estratégia, fora dela. Se cada mecânico contasse de cabeça quantas paradas já fez, bastaria outro mecânico (outra instância) atender a próxima para a contagem voltar a zero. A variável global `contador` é esse mecânico contando de cabeça. O *cold start* é o box chamado em cima da hora: a crew ainda precisa sair da garagem e posicionar os pneus antes de o carro chegar. **Aqui a analogia para:** a crew de uma equipe é a mesma o fim de semana todo; na FaaS você não escolhe nem enxerga qual instância atende cada chamada.

### Mão na massa

*Pit lane aberto! Papel e caneta para a sua própria pilha, depois a ficha do carro-padrão de cada circuito e uma conferência de garagem que, em conta nova, tem que voltar vazia.*

**1. Classifique a sua pilha (papel e caneta).** Pegue um sistema que você conhece e preencha a matriz acima: o que é seu e o que é do provedor, caso rodasse em IaaS, PaaS e FaaS. Marque a linha "Dados".

**2. Descreva os tipos de instância sem criar nada (somente leitura).**

AWS (consulta o catálogo do tipo `t3.micro`; não cria instância, só descreve o tipo):

```sh
aws ec2 describe-instance-types \
  --instance-types t3.micro \
  --query "InstanceTypes[].[InstanceType,VCpuInfo.DefaultVCpus,MemoryInfo.SizeInMiB]" \
  --output text
```

Saída esperada (ilustrativa; confira a sua):

```text
t3.micro	2	1024
```

Azure (consulta o catálogo de SKUs de VM numa região e mostra só as capacidades de CPU e memória do tamanho `Standard_B1s`; se ele não existir na região escolhida, troque a região ou o tamanho):

```sh
az vm list-skus --location eastus --size Standard_B1s --resource-type virtualMachines \
  --query "[?name=='Standard_B1s'] | [0].capabilities[?name=='vCPUs' || name=='MemoryGB']" \
  --output table
```

Saída esperada (ilustrativa; a memória vem em GB, e 1 GB = 1024 MB):

```text
Name      Value
--------  -------
vCPUs     1
MemoryGB  1
```

Nota: em outros materiais você vai ver `az vm list-sizes`. Esse comando está marcado como obsoleto nas versões recentes da Azure CLI e imprime um aviso de depreciação que recomenda `az vm list-skus`; o aviso é esperado e não é erro seu. Se a sua versão do `az` reclamar de algum parâmetro, consulte `az vm list-skus --help`.

Observação: os dois dizem "quantas CPUs e quanta memória". O que você escolhe é o *tamanho* da máquina que, no modelo IaaS, você mesmo vai operar.

**Leitura de cockpit:** `t3.micro` e `Standard_B1s` são a ficha do carro-padrão que cada circuito oferece: quantos processadores e quanta memória. Escolher o tamanho é escolher o carro; acertar o que roda dentro dele continua sendo trabalho seu, como o set-up continua sendo da equipe.

**3. Confira o que existe de PaaS e FaaS na sua conta (somente leitura; uma conta nova deve retornar vazio):**

```sh
aws elasticbeanstalk describe-applications   # PaaS na AWS: lista aplicações do Beanstalk
aws lambda list-functions                    # FaaS na AWS: lista funções
az webapp list --output table                # PaaS na Azure: lista aplicações do App Service
az functionapp list --output table           # FaaS na Azure: lista Function Apps
```

Saída esperada em conta nova: `{"Applications": []}`, `{"Functions": []}` e, na Azure, nenhuma linha (ou `[]`).

### Exercícios

*Volta lançada! Quatro exercícios, e o terceiro é o mais traiçoeiro: uma função que parece certa no teste e perde o carrinho em produção. Quem entendeu o stateless crava a resposta.*

1. **Escolha o modelo.** (a) A equipe de RH precisa de e-mail e agenda; (b) um banco precisa controlar o patch do SO do servidor de transações; (c) quatro devs querem publicar uma API web sem cuidar de servidor; (d) processar cada foto enviada por usuários, em picos imprevisíveis. *Resposta esperada:* (a) SaaS; (b) IaaS; (c) PaaS (App Service ou Elastic Beanstalk); (d) FaaS (Lambda ou Azure Functions), acionada pelo evento de upload.
2. **Quem é responsável?** Em um SaaS, um funcionário compartilha por engano uma planilha pública com dados de clientes. Falha de quem? *Resposta esperada:* do cliente. Dados e configuração de acesso são sempre do cliente, em qualquer modelo.
3. **Por que a função falhou?** Uma função guarda o carrinho do usuário em uma variável global. Em produção, os itens "somem" de vez em quando. Explique e conserte. *Resposta esperada:* FaaS é stateless; a plataforma pode atender chamadas diferentes por instâncias diferentes, que não compartilham memória. Conserto: guardar o carrinho em banco ou cache externo, identificado pelo usuário.
4. **Beanstalk x App Service.** Cite uma diferença real entre os dois. *Resposta esperada:* o Beanstalk deixa visíveis, na sua conta, os recursos que cria (instâncias, balanceador, autoscaling); o App Service oferece a hospedagem por plano, sem expor a infraestrutura abaixo como recursos seus.

### Anota aí

> Quanto mais alto o modelo (IaaS, PaaS, FaaS, SaaS), menos você opera e menos você controla, mas os seus dados e o seu acesso continuam sempre sendo seus.

*Setor 2 no verde! Você sobe e desce a escada de IaaS a FaaS sabendo o que é seu em cada degrau, e a linha "Dados" ficou gravada. Agora a pista fica técnica de verdade: onde a infraestrutura mora, quantos noves ela aguenta e quando desligar o que está falhando. Etapa 03, a parte mais exigente do circuito.*

---

## Etapa 03: Infraestrutura de Nuvem

*Terceiro setor, o trecho mais técnico do circuito! Regiões, zonas, pontos de presença, SLI, SLO e SLA, série e paralelo, Circuit Breaker. É aqui que se separam os pontuadores do resto do grid, porque disponibilidade não se declara: se calcula. Freia forte e entra no ritmo.*

### O problema

Na Black Friday, o data center que hospeda a loja perde energia por duas horas. Se todo o sistema estava naquele prédio, são duas horas de faturamento perdido. Pior: um cliente em Manaus acessa um servidor em outro continente e espera a página carregar, porque a luz demora a viajar. Os dois problemas têm a mesma raiz, **geografia**: onde a infraestrutura mora define quanto ela resiste a falhas e quão rápida ela é para quem usa.

**Leitura de cockpit:** a F1 de 2026 deu o exemplo de geografia em escala de calendário: a etapa do Bahrein, disputada em Sepang como contei na abertura, não deixou de acontecer; mudou de sede. Em arquitetura, isso tem nome: recuperação de desastres em outra região. A outra metade do problema, a latência, é o dia a dia de qualquer etapa longe das fábricas: em Singapura, de 9 a 11 de outubro de 2026, engenheiros a milhares de quilômetros vão acompanhar ao vivo carros do outro lado do mundo, e a distância cobra o seu preço em atraso.

### O conceito

**Data centers, regiões, zonas e pontos de presença.**

- **Data center:** instalação física com milhares de servidores, redes e armazenamento.
- **Região:** área geográfica independente, isolada de falhas em outras regiões. Implantar em mais de uma região permite sobreviver à queda de uma delas e atende exigências de residência de dados.
- **Zona de Disponibilidade (AZ):** local isolado **dentro** de uma região, em geral um data center ou conjunto de data centers próximos, com energia, refrigeração e rede independentes. É um **domínio de falha**: a falha de uma zona não deve afetar as outras. As zonas de uma região se ligam por links de alta banda e baixa latência.
- **Ponto de Presença (PoP) ou *edge location*:** porta de entrada da rede do provedor perto do usuário. O tráfego entra no PoP mais próximo e daí segue pela rede do provedor. CDNs usam PoPs para cachear conteúdo estático.

**Analogia.** Região é uma cidade; AZs são bairros da cidade com rede elétrica própria; PoPs são agências dos Correios espalhadas, onde você deixa a encomenda mais perto de casa.

**Leitura de cockpit:** no nosso mapa, o provedor é o circuito; a **região** é cada sede geográfica dele (uma cidade, um país); as **zonas de disponibilidade** são pavilhões independentes dentro da mesma sede, cada um com energia, refrigeração e rede próprias e ligados entre si por cabos rápidos; o **data center** é cada prédio de um pavilhão; e os **pontos de presença** são depósitos avançados de material espalhados pelo mundo, perto de onde a próxima etapa vai acontecer. **Aqui a analogia para:** num autódromo real não há pavilhões independentes: as garagens ficam lado a lado no mesmo prédio dos boxes e dividem a infraestrutura do circuito; um apagão nesse prédio atinge todas. Zonas de disponibilidade são fisicamente separadas justamente para que isso não aconteça.

**Recursos zonais e regionais.** Um recurso **zonal** vive em uma zona (mais barato e menos resiliente); um **regional** é replicado entre zonas (mais disponível e, em geral, mais caro). Escolher é equilibrar custo e resiliência.

**Leitura de cockpit:** recurso zonal é o material num pavilhão só; regional é o material espelhado em vários pavilhões da sede. O segundo custa mais e sobrevive à perda de um deles. E um detalhe que confunde muita gente: o seu "pavilhão 1" pode não ser o "pavilhão 1" de outra conta. O rótulo é seu; o pavilhão é do circuito. O *zone ID* da AWS é o número oficial do pavilhão, igual para todos.

**Os dois campos, lado a lado** *(acréscimo do professor; o material cita AZs de AWS e Azure e ZRS na Etapa 05)*:

| Conceito | AWS | Azure | O que muda de verdade |
|---|---|---|---|
| Região | Region (ex.: `sa-east-1`) | Region (ex.: `brazilsouth`) | Mesmo conceito. A Azure também tem o conceito de **regiões pareadas** para recuperação de desastres |
| Zona | Availability Zone | Availability Zone | Na Azure, **algumas regiões não têm zonas**. Nos dois, o rótulo da zona (`a`, `b`, `c` na AWS; `1`, `2`, `3` na Azure) é mapeado para uma zona física **por conta ou assinatura**: a sua "zona 1" pode não ser a "zona 1" de outra pessoa. A AWS expõe um identificador estável (*zone ID*, como `sae1-az1`) para quem precisa alinhar contas |
| Escopo de recursos | Recursos zonais (instância, volume) ou regionais | Recursos zonais, **zone-redundant** (como o armazenamento ZRS) ou regionais | Nos dois, cabe a você escolher. Na Azure o termo "zone-redundant" é explícito em muitos serviços |
| Borda | CloudFront (edge locations) | Azure Front Door e Azure CDN (PoPs da Microsoft) | Veja a Etapa 05 para as diferenças de escopo. O estado atual do Azure CDN clássico vem sofrendo consolidação com o Front Door: confira a documentação |

> **Nota de escopo.** O material usa Google Cloud em seus exemplos de região (`europe-west1`, `southamerica-east1`) e afirma "cada região tem três ou mais AZs". Isso descreve o Google Cloud. Em AWS e Azure, o número de zonas varia entre regiões e a Azure tem regiões sem zonas. Detalhe nas Notas do professor.

**Latência.** É o atraso na transmissão, medido por RTT (*Round Trip Time*, ida e volta do pacote). Segundo o material: de 30 a 40 ms é geralmente aceitável; de 100 a 150 ms pode ser tolerável em alguns casos; acima disso o usuário percebe; para aplicações ultrassensíveis (carros autônomos, jogos em nuvem), até 10 ms pesa. A aplicação define o que é aceitável. Estratégias: **CDN**, roteamento e infraestrutura otimizados, **IPv6**, compressão e redução de conteúdo, **edge computing** e sub-redes que mantêm o tráfego local.

**Leitura de cockpit:** o RTT é o tempo de ida e volta entre o carro e quem decide. Do muro ao carro, ele é desprezível; da garagem em Marina Bay até uma sala de operações na Europa, ele cresce com a distância, porque o sinal atravessa continentes. Por isso a chamada de box acontece no muro, perto do carro, com a fábrica apoiando. É o mesmo raciocínio da borda: a decisão que não tolera atraso fica perto da fonte.

**Pilar: escalabilidade.** Vertical (máquina maior, simples, mas com teto e geralmente com downtime) ou horizontal (mais máquinas, sem teto de hardware, mais resiliente, mais complexa). Dois mecanismos tornam a escala horizontal prática: **auto-scaling** (grupos que adicionam ou removem instâncias por métrica, como CPU ou número de requisições) e **balanceamento de carga** (distribui as requisições). O material cita Application Load Balancer (camada 7, por conteúdo) e Network Load Balancer (camada 4, TCP e UDP, alto desempenho).

**Leitura de cockpit:** o balanceador é o controle de entrada do pit lane: um ponto único de entrada que olha cada pedido que chega, encaminha para uma das VMs disponíveis sem deixar uma sobrecarregada enquanto outra está livre e tira de rota a que falhou (o *health check*). O de camada 4 decide olhando só o envelope (de onde vem, para onde vai); o de camada 7 lê o pedido inteiro, como o controle que pergunta se é troca de pneus ou de asa antes de indicar quem está preparado para aquele serviço. O auto-scaling é a regra que coloca ou tira carros conforme a carga. **Aqui a analogia para:** no pit lane real, cada carro para na garagem da própria equipe e ninguém redistribui carros; a imagem vale para o papel do balanceador, não para a regra da pista. E na F1 não se coloca carro novo na pista no meio da prova. Atrás de um balanceador, as instâncias são idênticas e qualquer uma atende qualquer requisição.

*(acréscimo do professor; o material cita Application Load Balancer e Network Load Balancer, sem o par da Azure)*

| Conceito | AWS | Azure | O que muda de verdade |
|---|---|---|---|
| Autoscaling de VMs | Auto Scaling Groups (ASG) | Virtual Machine Scale Sets (VMSS) | Mesmo papel: um conjunto de VMs idênticas que cresce e encolhe por regra. Terminologia e integração com o balanceador diferem |
| Balanceador de camada 7 | Application Load Balancer (ALB) | Azure Application Gateway | Roteia por conteúdo (HTTP, caminho, cabeçalhos). Na Azure, o escopo é regional; para entrada **global**, veja o Front Door |
| Balanceador de camada 4 | Network Load Balancer (NLB) | Azure Load Balancer | Alto desempenho para TCP e UDP. Os dois distribuem **por fluxo, com hash**: o NLB escolhe o destino de cada fluxo por um hash de protocolo, endereços e portas de origem e destino; o Azure Load Balancer usa, por padrão, um hash de 5 tuplas (IP e porta de origem, IP e porta de destino, protocolo). Para afinidade de sessão, confira o modo de distribuição na Azure (por IP de origem) e a *stickiness* do grupo de destino na AWS |

**Pilar: alta disponibilidade (HA).** É a fração do tempo em que o sistema está pronto. **Cinco noves** (99,999%) significa cerca de 5,26 minutos de inatividade por ano (você vai calcular isso adiante). Cada nove a mais exige mais redundância, e o material diz que o custo sobe exponencialmente; trate isso como tendência, e não como lei. A hierarquia de confiabilidade:

- **SLI** (*Service Level Indicator*): a medida bruta (uptime, tempo de resposta, taxa de erro).
- **SLO** (*Service Level Objective*): a meta interna sobre o SLI (ex.: "99,95% de disponibilidade mensal"). Permite um **orçamento de erros**.
- **SLA** (*Service Level Agreement*): a promessa formal ao cliente, muitas vezes com penalidade, sempre mais conservadora que o SLO (margem de segurança deliberada).

**Leitura de cockpit:** SLI é o número que a telemetria mostra: temperatura do freio, voltas completadas sem falha. SLO é a meta interna com folga: a equipe planeja a temporada usando menos componentes de unidade de potência do que o regulamento permite, e a folga entre o plano e o limite é o seu **orçamento de erros**. SLA é o limite formal com consequência: passar da cota de componentes do regulamento custa posições no grid. A meta interna é mais rígida que o limite formal pelo mesmo motivo que o SLO é mais rígido que o SLA: margem deliberada. **Aqui a analogia para:** o SLA é uma promessa feita **ao cliente**; a cota de componentes é uma regra imposta **à equipe** pela FIA. O que a comparação preserva é a estrutura: medida, meta interna com folga e limite externo que custa caro.

Sistemas redundantes: replicação de dados, implantação multirregião, redundância de hardware. Failover automático: **ativo-passivo** (backup ocioso assume) ou **ativo-ativo** (todos atendem, atrás de um balanceador).

*Provedores publicam SLAs por serviço, e a garantia muda conforme a topologia (instância única ou várias zonas). Leia o SLA do serviço específico; não existe um "SLA da AWS" ou "SLA da Azure" único.*

**Resiliência e Circuit Breaker.** Resiliência é suportar e se recuperar de falhas mantendo a funcionalidade, mesmo degradada. O padrão **Circuit Breaker** funciona como disjuntor: depois de falhas seguidas ao chamar um serviço remoto, "abre" e para de tentar por um tempo, evitando falhas em cascata e dando ao serviço doente chance de se recuperar. **Retry** tenta de novo esperando falha transitória; Circuit Breaker impede a tentativa quando a falha parece persistente. Podem se combinar, e o retry deve parar quando o disjuntor abrir. Não é um serviço dos provedores: é padrão implementado em biblioteca no seu código (o material remete à documentação da Microsoft sobre o padrão, e ele vale igualmente para AWS e Azure).

**Leitura de cockpit:** o disjuntor é o que a equipe faz quando um sistema do carro começa a falhar em sequência. Se o ERS acusa falha atrás de falha, insistir em exigir energia dele pode danificar outros componentes e parar o carro inteiro: a falha em cascata. O muro manda desligar o sistema (disjuntor **aberto**): o piloto fica mais lento, mas segue na pista. Algumas voltas depois, o engenheiro pede pelo rádio uma única tentativa de reativar o sistema pelos comandos do volante (o estado **meio-aberto**). Voltou, o sistema volta ao normal (**fechado**); falhou de novo, desliga outra vez. O retry é o piloto acionando o mesmo comando a cada curva, esperando que desta vez funcione: ajuda na falha passageira e piora a persistente.

**Tolerância a falhas x HA.** HA minimiza interrupções (inclusive as planejadas); tolerância a falhas mantém a operação sem interrupção **durante** falhas inesperadas, e vai além da redundância (verificação de erros, autocura, design holístico). Replicação: de **dados** (bancos em locais diferentes) e de **componentes** (serviços duplicados em zonas ou regiões).

**Edge computing.** Move processamento para perto da fonte dos dados: respostas mais rápidas, menos banda gasta (filtra localmente e envia só o essencial). Não substitui a nuvem central; complementa. Casos do material: IoT, veículos autônomos, monitoramento de ativos, manutenção preditiva, hospitais, cidades inteligentes. Segurança vira questão, pois mais pontos de borda são mais superfície de ataque. Veja a tabela Outposts x Azure Stack e Arc na Etapa 01.

**Leitura de cockpit:** o carro de F1 é um nó de borda. Ele grava muito mais dados do que transmite ao vivo: a eletrônica de bordo processa os sinais dos sensores ali mesmo, só uma parte segue pela telemetria para o muro durante a volta, e o registro completo é descarregado quando o carro volta à garagem. A decisão que não pode esperar (o controle do motor, a gestão da energia) acontece no carro; a análise pesada acontece na fábrica. Borda e centro se complementam, exatamente como o material descreve.

**Mercado (material, ref. jun/2025):** 97 zettabytes de dados gerados em 2024 com projeção de 181 zettabytes em 2025; o Gartner projetava 75% dos dados corporativos processados na borda até 2025; a IDC projetava 32% do gasto com IA de grandes empresas em inferência até 2027.

### Exemplo comentado: a conta dos noves e o disjuntor

*Atenção, que a corrida esquenta! Três contas seguidas: o downtime de cada SLA, a disponibilidade em série e em paralelo, e um disjuntor que abre e fecha na sua frente. Devagar e com atenção, porque é este trecho que sustenta o resto do setor.*

**Parte A: quanto downtime cada SLA permite?** Crie `$LAB/etapa-03/noves.sh`:

```sh
awk 'BEGIN {
  n = split("99.9 99.95 99.99 99.999", disp, " ")   # as disponibilidades a calcular
  minutos_ano = 365 * 24 * 60                       # minutos em um ano de 365 dias
  for (i = 1; i <= n; i++) {
    # downtime permitido = (100 - disponibilidade)% do ano
    printf "%s%% -> %.2f min/ano\n", disp[i], (100 - disp[i]) / 100 * minutos_ano
  }
}'
```

Rode com `sh "$LAB"/etapa-03/noves.sh`. Saída esperada:

```text
99.9% -> 525.60 min/ano
99.95% -> 262.80 min/ano
99.99% -> 52.56 min/ano
99.999% -> 5.26 min/ano
```

O último valor confirma a conta do material (5,26 minutos). Note como cada nove corta o tempo permitido por dez.

**Parte B: disponibilidade composta (matemática do professor, não está no material).** Se a sua aplicação depende de dois componentes em **série** (um depende do outro) com 99,9% cada, a disponibilidade conjunta é o produto: 0,999 x 0,999 = 0,998001, ou seja, 99,8001%. Pior que cada um sozinho. Se dois componentes idênticos estão em **paralelo** (redundantes em duas zonas), o sistema só cai quando **ambos** caem: 1 - (0,001 x 0,001) = 0,999999, ou 99,9999%. Essa conta supõe falhas **independentes**; zonas que compartilham algo (a mesma região, o mesmo deploy ruim) violam a hipótese. É um modelo, não uma garantia.

**Leitura de cockpit:** série é o próprio carro: unidade de potência, câmbio, hidráulica e eletrônica em cadeia; se qualquer um falha, o carro para. Por isso o carro inteiro é menos confiável que cada componente sozinho. Paralelo é a equipe com dois carros. Em Sepang, o carro do George Russell parou na reta durante o último safety car, e mesmo assim a Mercedes pontuou forte, porque o Kimi Antonelli terminou em segundo. Para a equipe zerar, os dois teriam de parar. Agora a hipótese de independência: na mesma corrida, a Ferrari largou com pneus para pista seca nos dois carros, e os dois despencaram juntos nas primeiras voltas. Dois carros, uma decisão: a redundância não protege contra a falha que os dois compartilham. Duas zonas que recebem o mesmo deploy ruim são os dois carros vermelhos na largada de Sepang. **Aqui a analogia para:** a equipe soma os pontos dos dois carros, então um carro sozinho não entrega "a equipe inteira"; num sistema redundante, uma instância de pé atende o serviço inteiro.

**Parte C: um disjuntor de verdade.** Crie `$LAB/etapa-03/disjuntor.py`:

```python
import time


class Disjuntor:
    def __init__(self, limite=3, espera=2.0):
        self.limite = limite          # quantas falhas seguidas abrem o disjuntor
        self.espera = espera          # segundos aberto antes de aceitar uma nova tentativa
        self.falhas = 0               # contador de falhas seguidas
        self.aberto_em = None         # instante em que abriu (None = fechado)

    def chamar(self, funcao):
        if self.aberto_em is not None:                       # disjuntor aberto?
            if time.time() - self.aberto_em < self.espera:   # ainda no tempo de espera
                return "ABERTO: nem tentei"                  # falha rápido, sem sobrecarregar o serviço
            self.aberto_em = None                            # passou o tempo: deixa UMA tentativa passar
        try:
            resultado = funcao()                             # chama o serviço remoto
            self.falhas = 0                                  # sucesso zera o contador
            return f"ok: {resultado}"
        except Exception:
            self.falhas += 1                                 # mais uma falha seguida
            if self.falhas >= self.limite:
                self.aberto_em = time.time()                 # abre o disjuntor
            return f"falhou ({self.falhas})"


servico_ok = False                                           # simula o serviço remoto fora do ar


def remoto():
    if not servico_ok:
        raise RuntimeError("fora do ar")
    return "200"


d = Disjuntor()
for i in range(6):
    print(i, d.chamar(remoto))
time.sleep(2.1)                                              # espera o disjuntor aceitar nova tentativa
servico_ok = True                                            # o serviço se recupera
print("depois da espera:", d.chamar(remoto))
```

Rode e observe:

```sh
python3 "$LAB"/etapa-03/disjuntor.py
```

Saída esperada:

```text
0 falhou (1)
1 falhou (2)
2 falhou (3)
3 ABERTO: nem tentei
4 ABERTO: nem tentei
5 ABERTO: nem tentei
depois da espera: ok: 200
```

Três falhas abriram o disjuntor; as chamadas 3 a 5 nem chegaram ao serviço (é o "falhar rápido" que evita cascata); passado o tempo, uma tentativa passou, deu certo e o circuito voltou ao normal.

**Leitura de cockpit:** as chamadas 3 a 5 são as voltas com o sistema desligado: o piloto nem tenta usá-lo, e o carro segue sem arriscar a cascata. O "depois da espera" é a tentativa de reativação pedida pelo engenheiro: uma só, que deu certo.

### Mão na massa

*Pit stop cronometrado! Mude o limite e a espera do disjuntor e escreva a saída antes de rodar: errar a previsão aqui é barato, errar em produção não é. Depois, as zonas de uma região, direto de cada circuito.*

**1.** Execute os dois scripts acima e confira as saídas:

```sh
sh "$LAB"/etapa-03/noves.sh
python3 "$LAB"/etapa-03/disjuntor.py
```

Depois, no `disjuntor.py`, troque a linha `d = Disjuntor()` por `d = Disjuntor(limite=2, espera=5)` e preveja a saída **antes** de rodar. Não mexa no `time.sleep(2.1)`.

Gabarito (saída real com a troca):

```text
0 falhou (1)
1 falhou (2)
2 ABERTO: nem tentei
3 ABERTO: nem tentei
4 ABERTO: nem tentei
5 ABERTO: nem tentei
depois da espera: ABERTO: nem tentei
```

Com `limite=2`, duas falhas já abrem o disjuntor, e as chamadas 2 a 5 falham rápido. A última linha continua `ABERTO`, e isso não é defeito: o script espera só 2,1 segundos, menos que os 5 segundos de `espera`, então o disjuntor ainda não aceita a nova tentativa, mesmo com o serviço recuperado. Para ver o `ok: 200`, troque também o `time.sleep(2.1)` por `time.sleep(5.1)`.

**2. Liste as zonas de uma região (somente leitura).**

AWS (`describe-availability-zones` consulta as zonas da região; mostramos nome, ID estável e estado):

```sh
aws ec2 describe-availability-zones --region sa-east-1 \
  --query "AvailabilityZones[].[ZoneName,ZoneId,State]" --output text
```

Saída esperada (ilustrativa; o mapeamento letra para ID pode diferir na sua conta):

```text
sa-east-1a	sae1-az1	available
sa-east-1b	sae1-az2	available
sa-east-1c	sae1-az3	available
```

Azure (lista SKUs de VM que suportam zonas na região; se a região **não tem** zonas, a lista vem vazia, e isso já é a informação; o `head` limita a saída; se a sua versão do `az` reclamar do parâmetro, consulte `az vm list-skus --help`):

```sh
az vm list-skus --location brazilsouth --zone --resource-type virtualMachines --output table | head -n 5
```

Saída esperada (ilustrativa): colunas como `ResourceType`, `Locations`, `Name`, `Zones` e `Restrictions`, com `Zones` mostrando algo como `1,2,3`.

**3. Descreva o que já existe de compute (somente leitura; conta nova retorna vazio):**

```sh
aws ec2 describe-instances \
  --query "Reservations[].Instances[].[InstanceId,InstanceType,State.Name]" --output table
az vm list --output table
```

### Exercícios

*Volta lançada! Cinco perguntas, com conta de noves e de série no meio do caminho. Calculadora liberada, cola não.*

1. **Região ou zona?** Uma aplicação precisa continuar de pé se um data center inteiro perder energia; outra precisa continuar de pé se uma cidade inteira ficar isolada. Qual escopo cada uma exige? *Resposta esperada:* a primeira, múltiplas zonas na mesma região; a segunda, múltiplas regiões.
2. **Conta dos noves.** Um SLA de 99,9% mensal (30 dias) permite quantos minutos de indisponibilidade? *Resposta esperada:* o mês tem 30 x 24 x 60 = 43.200 minutos; 0,1% disso (100% menos 99,9%) é 43.200 x 0,001 = 43,2 minutos por mês.
3. **Série ou paralelo?** Três componentes em série com 99,9% cada: disponibilidade aproximada? *Resposta esperada:* 0,999 x 0,999 x 0,999 = 0,997003, ou cerca de 99,70%.
4. **SLO ou SLA?** "Nossa API terá 99,95% de disponibilidade mensal" é compromisso interno; "o serviço estará disponível 99,9% do tempo, com crédito financeiro em caso de falha" é compromisso com o cliente. Qual é qual? *Resposta esperada:* o primeiro é SLO (meta interna, mais rígida); o segundo é SLA (promessa formal, mais conservadora, com margem).
5. **Retry ou Circuit Breaker?** O serviço de pagamento está fora do ar há 5 minutos e o seu serviço de pedidos insiste em chamar. Qual padrão ajuda e por quê? *Resposta esperada:* Circuit Breaker. A falha é persistente; o retry só aumenta a carga e pode causar falha em cascata.

### Anota aí

> Zonas protegem você de falhas de data center, regiões protegem de falhas geográficas, a borda aproxima você do usuário, e cada nove de disponibilidade tem que justificar o que custa.

*Setor 3 no verde, e era o trecho mais duro! Zona protege do prédio, região protege da cidade, e cada nove tem que pagar o que custa. Resiliência é seguir funcionando mesmo degradado: em Silverstone, em 2020, o Lewis Hamilton teve um pneu furado na última volta e venceu cruzando a linha em três rodas. Agora a pista abre numa reta de decisão: em qual circuito operar, e com que critério. Etapa 04.*

---

## Etapa 04: Principais Provedores de Nuvem

*Quarto setor, e o perigo aqui não é técnico: é a torcida. Comparar provedores é comparar dois circuitos onde a mesma equipe pode operar, com critérios e pesos combinados antes da largada. Quem escolhe pelo coração paga na saída, e o setor dá nome a essa conta: lock-in.*

### O problema

A diretoria decide migrar para a nuvem e pergunta: "Qual provedor?". A pior resposta é "o que eu já conheço" ou "o que está na moda". A empresa tem Active Directory e Microsoft 365? Tem um time de dados que vive de SQL e BI? Precisa de uma região no Brasil por lei? O lock-in assusta? Sem um **método de comparação**, a decisão vira torcida. Sem entender **lock-in**, a decisão vira prisão.

**Leitura de cockpit:** antes desta etapa, a regra do mapa: AWS e Azure são **circuitos**, não equipes. Comparar provedores aqui é comparar instalações, regras e custos de dois lugares onde a sua equipe pode operar, e nunca escolher para quem torcer. A resposta "o que eu já conheço" é a do engenheiro que leva para todo circuito o set-up que funcionou no anterior: às vezes acerta, mas por sorte.

### O conceito

**Quem são os grandes.** O mercado é dominado por AWS, Microsoft Azure, Google Cloud Platform (GCP) e Oracle Cloud Infrastructure (OCI). O material descreve cada um:

- **AWS:** líder, com mais de 200 serviços. Portfólio central: EC2 e Lambda (compute), S3 e EBS (armazenamento), Aurora e DynamoDB (banco), VPC e CloudFront (rede e entrega). Ecossistema amplo, que funciona como *one-stop-shop* e cria "gravidade" (dificulta sair). Exige aprender a plataforma e lidar com preço complexo.
- **Azure:** segundo maior. Forte integração com o ecossistema Microsoft (Windows Server, Active Directory, Office 365), vocação híbrida (Azure Arc) e IA (Azure AI Foundry, Azure Machine Learning, Azure OpenAI Service). Dados: Cosmos DB, Azure SQL, Microsoft Fabric. Compute: VMs, Azure Functions, AKS. Identidade: Microsoft Entra ID (antes Azure AD). Segurança: Microsoft Defender for Cloud.
- **GCP:** posicionado em dados, IA e rede global. Compute Engine, GKE, Cloud Storage, Cloud SQL, Spanner, BigQuery, Vertex AI, Cloud Run, Pub/Sub.
- **OCI:** nuvem de segunda geração, focada em alta performance, cargas empresariais e aplicações Oracle, com serviços autônomos e segurança integrada.

**Participação de mercado (material, ref. jun/2025, não comparáveis entre si):** AWS cerca de 33% no início de 2023; Azure 23% no fim de 2022; GCP cerca de 10% no 1º trimestre de 2022 e 2023; juntas, AWS, Azure e GCP somaram 64% dos gastos globais com nuvem no 4º trimestre de 2024. Observe que **as datas diferem**: não some nem compare as três primeiras como se fossem uma única fotografia. A infraestrutura da AWS, segundo o material, somava 114 AZs em 36 regiões na época. Os números envelhecem rápido; consulte a página oficial de infraestrutura global de cada provedor quando precisar do atual.

**Metodologia de comparação (seis critérios do material):**

1. Ofertas de IaaS, PaaS e SaaS (amplitude e profundidade).
2. Regiões e AZs (presença geográfica, latência, residência de dados, resiliência).
3. Precificação e TCO (pagamento por uso, descontos, instâncias spot; complexidade).
4. SLAs e suporte.
5. Conformidade e certificações (ISO 27001, HIPAA, PCI DSS, GDPR).
6. Ferramentas de gerenciamento (console, API, CLI, automação).

**Leitura de cockpit:** os seis critérios são o que uma equipe avaliaria nas instalações de um lugar onde vai operar: o que a garagem oferece pronto (1), onde ficam as sedes e quão perto estão de quem importa (2), quanto custa e como se cobra (3), que garantias e suporte o local dá (4), que regras e certificações ele cumpre (5) e com que ferramentas a equipe opera lá (6).

**Os dois campos, lado a lado: o mapa de portfólio** *(acréscimo do professor; pares já vistos nas etapas anteriores são resumidos e os novos aparecem aqui)*:

| Categoria | AWS | Azure | O que muda de verdade |
|---|---|---|---|
| VM | EC2 | Azure Virtual Machines | Etapa 02 |
| FaaS | Lambda | Azure Functions | Etapa 02 |
| PaaS web | Elastic Beanstalk | Azure App Service | Etapa 02 |
| Kubernetes gerenciado | Amazon EKS | Azure Kubernetes Service (AKS) | Os dois gerenciam o plano de controle do Kubernetes; a integração com rede, identidade e balanceadores segue o ecossistema de cada um. O material cita AKS e GKE; o par EKS é do professor |
| Objetos | S3 | Blob Storage | Etapa 05 |
| Bloco | EBS | Managed Disks | Etapa 02 |
| Banco relacional | Aurora e RDS | Azure SQL Database; Azure Database for PostgreSQL e MySQL | Etapa 05 |
| NoSQL | DynamoDB | Cosmos DB | Etapa 05 |
| Data warehouse | Redshift | Azure Synapse Analytics e Microsoft Fabric | O Fabric (que o material cita) é a plataforma unificada de dados da Microsoft; a Synapse é o serviço de data warehouse mais tradicional. Confira qual a Microsoft recomenda para projetos novos |
| Cache em memória | ElastiCache | Azure Cache for Redis | O serviço Redis da Azure passa por uma transição de produto para uma oferta sucessora; confira o nome vigente. O ElastiCache também oferece outros motores (Valkey, Memcached) |
| IA generativa (aproximado) | Amazon Bedrock | Azure AI Foundry e Azure OpenAI Service | Pareamento **aproximado**: o material cita o Bedrock (Data Automation) e a pilha de IA da Azure, mas os catálogos de modelos e o modo de acesso diferem; compare modelo a modelo |
| Rede virtual | VPC | VNet | Etapa 05 (escopo difere) |
| CDN e entrada global | CloudFront | Azure Front Door e CDN | Etapa 05 |
| IaC | CloudFormation | ARM templates e Bicep | Etapa 05 |
| Monitoramento | CloudWatch | Azure Monitor | Etapa 06 |
| Híbrido | Outposts | Azure Stack e Arc | Etapa 01 |
| Identidade | IAM | Microsoft Entra ID e Azure RBAC | Etapa 06 |
| Custo | Cost Management e Trusted Advisor | Microsoft Cost Management e Azure Advisor | Etapa 06 |

**Comparação, honestamente.** O material afirma que a AWS tem maior variedade e profundidade, que a Azure é robusta em todas as categorias com integração Microsoft (PaaS como App Service e Functions muito competitivo) e que AWS e Azure têm as maiores bibliotecas de conformidade. Sobre ferramentas, destaca CloudFormation e CloudWatch na AWS e Arc e DevOps na Azure. Essas são **avaliações do material**; elas dependem da época e do seu caso de uso, e a escolha real depende de ecossistema existente, conformidade, orçamento e prioridades de inovação.

**Multicloud e vendor lock-in.** O material cita que, em 2022, 89% das organizações usavam mais de uma nuvem e apenas 9% usavam uma só nuvem pública (ref. jun/2025). Motivos: melhores serviços de cada um, resiliência sem ponto único de falha de provedor, mitigação de risco, otimização de custo, conformidade e **evitar lock-in**. Desafios: complexidade de gestão, segurança consistente, integração, **custos ocultos** (como transferência de dados entre provedores) e falta de pessoas qualificadas.

**Vendor lock-in** é a dependência que torna a troca proibitivamente cara ou complexa. Consequências: queda de qualidade, aumento de preço, perda de poder de negociação, upgrades caros, conversão de dados complexa e inovação reduzida. Mitigação: avaliar com **prova de conceito**, manter **portabilidade de dados** (formatos não proprietários), ter **backups próprios** (também protegem contra ransomware) e considerar multicloud ou híbrido. Um trade-off honesto: usar só o "mínimo comum" para evitar lock-in desperdiça o que cada plataforma tem de melhor, e multicloud tem custo operacional próprio.

**Leitura de cockpit:** lock-in é a equipe que fabrica todo o seu equipamento de garagem (suportes, conectores de energia, bancadas, cabos de telemetria) para encaixar só nas instalações de um circuito. Enquanto ela fica, tudo funciona; no dia em que quiser operar em outro lugar, precisa refabricar as peças que não encaixam e reaprender as instalações. Portabilidade é usar encaixes padrão, que servem em qualquer circuito (dados em formatos abertos, backups próprios). E o trade-off do material vale na pista: a equipe que só usa o que existe em todos os circuitos desperdiça o que cada um tem de melhor. **Aqui a analogia para:** na F1, o calendário escolhe o circuito e ninguém fica "preso" a um autódromo; e uma equipe não opera em dois circuitos no mesmo domingo. Na nuvem, a escolha é sua, a saída custa caro de verdade e uma empresa pode operar nos dois provedores no mesmo minuto (multicloud).

**Tendências (material, ref. jun/2025):** gastos em nuvem pública acima de US$ 700 bilhões projetados para 2025; Gartner projetava 90% das empresas em nuvem híbrida até 2027; também citados: supercloud (camada de abstração sobre várias nuvens), computação quântica na nuvem e IA generativa.

### Exemplo comentado: a matriz de decisão

Uma forma de tirar a comparação da emoção é uma **matriz ponderada**: critérios, pesos (somam 100) e notas de 1 a 5. Os números abaixo são **fictícios**, de "Opção 1" e "Opção 2", **não são avaliação de nenhum provedor real**. Crie `$LAB/etapa-04/matriz.sh`:

```sh
awk 'BEGIN {
  # critérios, na ordem: ecossistema existente, custo, conformidade, ferramentas, regiões
  split("30 25 20 15 10", peso, " ")     # pesos (somam 100)
  split("5 3 4 3 4", op1, " ")           # notas fictícias da Opção 1
  split("3 4 4 4 5", op2, " ")           # notas fictícias da Opção 2
  for (i = 1; i <= 5; i++) {
    soma1 += peso[i] * op1[i]            # soma ponderada da Opção 1
    soma2 += peso[i] * op2[i]            # soma ponderada da Opção 2
  }
  printf "opcao 1: %.2f | opcao 2: %.2f\n", soma1 / 100, soma2 / 100
}'
```

Rode:

```sh
sh "$LAB"/etapa-04/matriz.sh
```

Saída esperada:

```text
opcao 1: 3.90 | opcao 2: 3.80
```

Agora, no `matriz.sh`, troque o texto `"30 25 20 15 10"` da linha dos pesos por `"10 35 20 15 20"` (menos peso no ecossistema, mais em custo e regiões) e rode de novo com `sh "$LAB"/etapa-04/matriz.sh`:

```text
opcao 1: 3.60 | opcao 2: 4.10
```

O vencedor **inverteu** sem que nenhuma nota mudasse. A lição: quem define os pesos define o resultado, por isso os pesos precisam ser acordados com o negócio antes de pontuar.

**Leitura de cockpit:** essa é a conta que todo engenheiro faz ao preparar o set-up de um circuito. As peças disponíveis são as mesmas; o que muda é o peso de cada critério. Em Singapura, para onde o grid vai de 9 a 11 de outubro de 2026, um circuito de rua cheio de curvas lentas, a carga aerodinâmica (a força das asas que gruda o carro no chão nas curvas e o freia na reta) pesa mais que a velocidade de reta; numa pista de alta velocidade o peso se inverte, e a mesma asa vira a escolha errada. Por isso os pesos se combinam antes de pontuar: com o negócio, na empresa; com estratégia e engenharia, na equipe.

### Mão na massa

*Ajuste de set-up na garagem! Você troca os pesos da matriz para dois cenários, conta as sedes de cada circuito e faz o inventário honesto do que custaria sair.*

**1.** Execute a matriz com os dois conjuntos de pesos. Depois invente os seus pesos para o cenário "empresa que já usa Active Directory e Microsoft 365" e para o cenário "startup de dados sem legado". Quais critérios sobem?

**2. Compare as regiões das duas nuvens (somente leitura).** Execute os comandos de região da Etapa 01 e conte as regiões de cada um:

```sh
aws ec2 describe-regions --query "length(Regions)"
az account list-locations --query "length([?metadata.regionType=='Physical'])"
```

Cada comando imprime um número inteiro. Observação importante: o número de **regiões** não é o número de **AZs** (o "114 AZs em 36 regiões" do material conta AZs). Contar regiões não mede resiliência.

**3. Faça o seu "inventário de lock-in" (papel).** Liste cinco serviços que o seu projeto usa ou usaria e marque, para cada um, se existe equivalente em outro provedor, se o formato dos dados é aberto e quanto custaria sair (em tempo e em dinheiro).

### Exercícios

*Volta lançada! Quatro perguntas, e a terceira é armadilha de número: leia as datas antes de somar qualquer coisa.*

1. **Qual critério pesa mais?** Um hospital precisa guardar prontuários no país e já usa Active Directory. Quais critérios da metodologia dominam a decisão? *Resposta esperada:* conformidade e certificações, regiões e AZs (residência de dados), e o ecossistema existente (identidade). Custo vem depois.
2. **Lock-in.** Cite duas práticas de mitigação do material. *Resposta esperada:* avaliar com prova de conceito; manter portabilidade de dados em formatos não proprietários; backups próprios; multicloud ou híbrido (duas bastam).
3. **Armadilha dos números.** Alguém afirma "AWS tem 33%, Azure 23% e GCP 10%, logo juntas têm 66%". O que está errado? *Resposta esperada:* os números têm datas de referência diferentes (início de 2023, fim de 2022, 1º trimestre de 2022 e 2023); não formam uma fotografia única e não se somam de forma válida.
4. **Par aproximado.** Por que "Amazon Bedrock x Azure AI Foundry" é um pareamento aproximado e não exato? *Resposta esperada:* porque os catálogos de modelos, o modo de acesso e o escopo dos serviços diferem; só serve como ponto de partida para a comparação.

### Anota aí

> Escolha o provedor com critérios e pesos combinados com o negócio, e trate o lock-in como um custo que você decide pagar de olhos abertos.

*Setor 4 no verde! Provedor se escolhe com método, peso combinado e lock-in assumido de olhos abertos. Hora de montar a operação dentro do circuito escolhido: armazenamento, bancos, balanceadores e a rede desenhada antes de existir. Etapa 05, a engenharia pesada.*

---

## Etapa 05: Elementos de Arquitetura Cloud

*Quinto setor, o mais cheio de peças! Objeto, bloco e arquivo; SQL, NoSQL e data warehouse; camada 4 e camada 7; CDN; e a área reservada da equipe dividida em sub-redes. Cada pergunta tem o seu bloco, e trocar um pelo outro custa tempo de pista.*

### O problema

Sua loja vai ao ar. Onde ficam as fotos de produtos (milhões de arquivos)? Onde fica o banco de pedidos (transações que não podem se perder)? Quem impede que o banco seja acessado pela Internet? Como distribuir 50 mil acessos simultâneos entre dez servidores? Cada pergunta pede um bloco de construção diferente, e escolher o bloco errado custa caro (dinheiro, desempenho ou segurança). Esta etapa é o catálogo dos blocos e de quando usar cada um.

**Leitura de cockpit:** montar a arquitetura é montar a operação da equipe num circuito: onde guardar milhares de peças e arquivos, onde fica o registro oficial que não pode errar, quem pode entrar em cada sala, como distribuir o trabalho entre os carros. Cada pergunta tem a sua solução, e trocar uma pela outra custa tempo de pista.

### O conceito

**Computação: VMs, contêineres e funções.** A evolução reflete mais abstração. **VMs:** instâncias virtuais com SO e recursos dedicados, controle granular. **Contêineres:** empacotam aplicação e dependências em unidade leve e portátil que roda igual no laptop e na nuvem, base de microsserviços. **Funções serverless:** o provedor cuida de provisionamento, escala e patches; cobra pelo tempo de execução (veja a Etapa 02 para os pares AWS x Azure).

**Armazenamento: objeto, bloco e arquivo.** Não existe solução única; a escolha afeta desempenho, escala, custo e complexidade.

- **Objeto:** dados em objetos isolados com identificador único e metadados, em estrutura "plana" (sem pastas de verdade). Escala quase sem limite e custa pouco por volume; bom para vídeos, imagens, backups, logs, dados de IA. Um objeto **não é modificado em parte**: para mudar, recria-se e reenvia-se; por isso é ruim para dados transacionais com alteração frequente.
- **Bloco:** blocos de tamanho fixo lidos e escritos individualmente, com latência baixa e alto desempenho; para bancos de dados e discos de VMs. Modificar um bloco é eficiente. Cobra-se o espaço alocado, usado ou não.
- **Arquivo:** hierarquia de pastas e arquivos, intuitiva, boa para compartilhamento e colaboração; escala limitada e desempenho que cai com volume.

**Leitura de cockpit:** armazenamento de **objeto** é o depósito de peças etiquetadas: cada peça tem um código único e uma ficha, e ninguém modifica meia peça de fibra de carbono; para mudar, fabrica-se uma nova revisão e ela entra no lugar da anterior. **Bloco** é a memória de bordo do carro: presa a um carro (e ao pavilhão onde ele está), rápida, gravando e regravando trechos pequenos o tempo todo. **Arquivo** é a pasta compartilhada da garagem, onde os engenheiros abrem e editam as mesmas planilhas de set-up: confortável para colaborar, mas não feita para milhões de itens. **Aqui a analogia para:** uma peça física existe numa unidade; um objeto pode ter cópias em várias zonas e regiões sem que ninguém perceba a diferença.

*(acréscimo do professor nas colunas AWS e Azure; o material compara os três tipos sem parear serviços)*

| Tipo | Analogia | AWS | Azure | O que muda de verdade |
|---|---|---|---|---|
| Objeto | Armário de depósito com etiquetas | Amazon S3 | Azure Blob Storage | Nos dois, acesso por API HTTP e organização em "buckets" (S3) ou "contêineres" (Blob, dentro de uma conta de armazenamento). Na Azure, a **conta de armazenamento** é a unidade que agrega redundância e outros tipos de dados; na AWS, o bucket é a unidade |
| Bloco | Disco rígido de um computador | Amazon EBS | Azure Managed Disks | Anexado a uma VM. Na AWS, o volume pertence a uma AZ; na Azure, o disco pode ser zonal ou ter redundância de zona, conforme o tipo |
| Arquivo | Pasta compartilhada de rede | Amazon EFS *(não citado no material)* | Azure Files *(idem)* | Compartilhamento de arquivos por protocolo de rede. Confira os protocolos (NFS, SMB) suportados por cada um para o seu sistema operacional |

**Redundância de armazenamento.** O material cita que serviços com **redundância de zona (ZRS)** replicam dados automaticamente entre AZs. Na Azure, a redundância é uma **escolha explícita na criação** da conta de armazenamento (com siglas como LRS, ZRS, GRS), e o preço acompanha. Na AWS, o S3 padrão já replica entre zonas por design; a replicação entre regiões é uma configuração à parte.

**Redes virtuais.** Uma **VPC** (AWS) ou **VNet** (Azure) é a sua rede privada dentro da nuvem: espaço de endereços IP isolado, onde VMs, balanceadores e bancos conversam.

- **Sub-redes:** fatias do espaço de endereços (blocos CIDR) onde os recursos são implantados.
- **Roteamento:** tabelas de rotas decidem o caminho dos pacotes.
- **Gateways:** pontos de entrada e saída (Internet, VPN, conexão dedicada).
- **Peering:** liga duas redes virtuais.

**Analogia.** A VPC é o terreno de um condomínio; as sub-redes são as ruas; os gateways são as portarias; o roteamento é o mapa que diz por qual portaria cada carro sai.

**Leitura de cockpit:** no circuito, a VPC (ou VNet) é a área reservada da equipe: um espaço cercado onde só circula quem a equipe autorizar. As sub-redes são os setores dentro dela: a frente voltada para o pit lane (exposta, que as câmeras enxergam), o escritório de engenharia nos fundos (sem porta para a rua) e a sala de dados (sem saída nenhuma). Os gateways são os portões; o roteamento é o mapa de por onde cada um sai. Na mesma ideia, o NAT é o assessor de imprensa: a equipe fala com o mundo por ele, mas ninguém de fora entra por ele. E o peering é o cabo que liga a área da equipe a outra área dela, como a área no circuito à sala de operações remota.

**Atenção ao escopo, o ponto mais traiçoeiro.** O material descreve o Google Cloud (VPC **global**, sub-redes **regionais**). Em AWS e Azure é diferente:

*(acréscimo do professor; o material descreve o modelo do Google Cloud)*

| Conceito | AWS | Azure | O que muda de verdade |
|---|---|---|---|
| Rede virtual | VPC (escopo **regional**) | VNet (escopo **regional**) | Nos dois, a rede vive em **uma** região. Diferente do Google Cloud do material, onde ela é global |
| Sub-rede | Vinculada a **uma AZ** | **Não** é zonal: abrange a região (e as zonas dela) | Na AWS, para ter recursos em 2 AZs você cria no mínimo **2 sub-redes**. Na Azure, uma sub-rede pode ter VMs em zonas diferentes. O desenho de endereçamento muda por causa disso (veja o exercício) |
| Saída para Internet | Internet Gateway e sub-rede "pública" (rota para o gateway) | Não há um "Internet Gateway": o acesso depende de IP público, balanceador ou NAT | "Pública" e "privada" na AWS é uma questão de **rota** da sub-rede. Na Azure, o controle vem de IP público, regras de segurança e NAT. Acréscimo do professor: a Microsoft anunciou a aposentadoria do *acesso de saída padrão* (a saída para a Internet que VMs sem IP público recebiam sem configurar nada) e passou a criar sub-redes privadas por padrão; não conte com essa saída implícita e confira o estado atual e as datas na documentação |
| NAT | NAT Gateway (vive numa sub-rede pública, um por AZ costuma ser a boa prática) | NAT Gateway (associado à sub-rede de origem) | Mesmo nome, implantação diferente |
| Interface de rede | Elastic Network Interface (ENI) | Network Interface (NIC) | Onde se anexa o firewall de instância (Etapa 06) |
| Peering | VPC Peering | VNet Peering | Liga duas redes; os blocos CIDR **não podem se sobrepor** (o exercício deste guia mostra a conta) |
| Hub de várias redes | Transit Gateway | Virtual WAN | Etapa 06 |
| Sub-redes especiais | Não há nomes reservados equivalentes | `GatewaySubnet` (VPN Gateway) e `AzureFirewallSubnet` (Azure Firewall) | Na Azure, alguns serviços exigem uma sub-rede com **nome fixo**; planeje o CIDR já contando com elas |

**Leitura de cockpit:** a diferença de escopo da sub-rede, em termos de pavilhão: na AWS, cada setor fica preso a um pavilhão (zona); se a equipe quer carros em dois pavilhões, precisa de dois setores, um em cada. Na Azure, o setor é desenhado para a sede inteira e pode ter carros em pavilhões diferentes. São dois circuitos com regras de planta diferentes, e quem desenha a planta antes de montar a estrutura não se surpreende.

**Endereços reservados.** Nos dois provedores, cada sub-rede reserva cinco endereços para uso da plataforma; assim, uma sub-rede `/24` (256 endereços) tem 251 utilizáveis. Os limites de tamanho de sub-rede variam; consulte a documentação.

**Bancos de dados gerenciados.** "Gerenciado" significa que o provedor cuida de provisionamento, patches, backup e escala. A escolha depende do modelo de dados, do padrão de acesso e da escala.

- **SQL (relacional):** tabelas com esquema, relacionamentos e consistência **ACID** (Atomicidade, Consistência, Isolamento, Durabilidade). Para transações e integridade.
- **NoSQL:** formatos flexíveis, escala horizontal, muitas vezes com **consistência eventual**. Tipos: documentos, chave-valor, colunas, grafos e em memória.
- **Data warehouse:** análise em larga escala sobre grandes volumes.
- **Vetorial:** guarda e consulta *embeddings* (representações numéricas de texto ou imagem) para IA generativa e busca por similaridade.

**Leitura de cockpit:** o banco **relacional** é a classificação oficial: uma volta conta ou não conta, um tempo é válido ou é anulado, e todo mundo vê o mesmo resultado. É o ACID da cronometragem. O **NoSQL** com consistência eventual é a tela de tempos ao vivo de um aplicativo: rápida, flexível, às vezes um instante atrás do que aconteceu na pista, mas que converge. O **data warehouse** é o arquivo de temporadas inteiras que a equipe consulta para estudar um circuito antes de chegar. O **vetorial** é procurar "voltas parecidas com esta" pela forma da volta inteira, não por um campo exato.

*(acréscimo do professor; o material cita Azure SQL e Cosmos DB)*

| Tipo | AWS | Azure | O que muda de verdade |
|---|---|---|---|
| Relacional gerenciado | Amazon RDS (vários motores) e Aurora | Azure SQL Database; Azure Database for PostgreSQL e MySQL | O Aurora é um motor próprio da AWS, compatível com MySQL e PostgreSQL, **sem par exato** na Azure. O Azure SQL Database é o SQL Server como serviço (o RDS também roda SQL Server). Confira o modelo de alta disponibilidade e de cobrança de cada oferta |
| NoSQL | DynamoDB | Azure Cosmos DB | O DynamoDB é chave-valor e documento, com uma API própria. O Cosmos DB é multimodelo, com várias APIs (inclusive compatíveis com outros bancos), e oferece níveis de consistência ajustáveis. A **cobrança** também é diferente em modelo (capacidade medida em unidades próprias de cada um) |
| Cache (chave-valor em memória) | ElastiCache | Azure Cache for Redis | Latência baixíssima; veja a nota sobre a transição do produto na Etapa 04 |
| Data warehouse | Redshift | Synapse e Fabric | Veja a Etapa 04 |

**Balanceamento de carga.** Distribui tráfego entre instâncias para maximizar vazão, minimizar tempo de resposta e evitar ponto único de falha.

- **Camada 4 (rede):** decide por TCP, UDP etc. É rápido e simples, bom para tráfego bruto (conexões de banco, jogos).
- **Camada 7 (aplicação):** decide por conteúdo HTTP (caminho, cabeçalho, cookie), essencial para microsserviços e APIs, e faz terminação SSL (o balanceador decifra o HTTPS e fala com os servidores atrás dele, que não precisam cuidar do certificado).
- **Algoritmos estáticos:** *round-robin* (em sequência) e *hash de IP* (mesmo cliente, mesmo servidor).
- **Algoritmos dinâmicos:** *conexão mínima* (e a versão ponderada), *menor tempo de resposta* e *baseado em recursos* (CPU e memória medidas por agentes).

**Leitura de cockpit:** no nosso mapa, o balanceador continua sendo o controle de entrada do pit lane, e os algoritmos são os critérios dele para escolher o destino de cada pedido. Round-robin é alternar: um para cada, em sequência. Hash de IP é "esse pedido vai sempre para o mesmo carro". Conexão mínima é mandar para quem está menos ocupado agora; menor tempo de resposta é mandar para quem está com o ritmo mais forte no momento; baseado em recursos é olhar a telemetria (CPU e memória fazem o papel de temperatura e desgaste) antes de decidir.

Os pares AWS x Azure (ALB x Application Gateway, NLB x Azure Load Balancer) estão na Etapa 03. Para balancear **entre regiões** na entrada da aplicação web, o serviço da Azure é o Front Door (veja adiante).

**Serviços gerenciados.** O provedor assume gestão, manutenção e operação (configuração, patches, segurança, monitoramento, escala). Vantagens: economia por uso, escala, segurança, disponibilidade e foco no negócio. Representa a passagem de CapEx para OpEx. Serverless é o caso extremo.

**Design para desempenho: caching e CDN.** **Caching** guarda cópias em local mais rápido: no navegador, no DNS, em memória no servidor. **CDN** é uma rede global de servidores que cacheia conteúdo perto dos usuários. **Cache hit:** o conteúdo está na CDN e sai na hora. **Cache miss:** a CDN busca na origem e guarda cópia para os próximos.

**Leitura de cockpit:** a CDN é a logística das etapas longe da Europa. Boa parte do material não urgente viaja de navio, com antecedência, e quando a equipe chega ele já está perto da pista. Os pontos de presença são esses depósitos avançados. **Cache hit** é a peça que já está no material local: sai na hora. **Cache miss** é a peça que não está lá: vem da fábrica (a origem), de avião, mais devagar, e a partir daí fica à mão para as próximas vezes. **Aqui a analogia para:** uma cópia em cache é idêntica à origem no momento em que foi feita, e o problema é ela envelhecer (por isso há prazo de validade); uma peça enviada de navio semanas antes também pode ser de uma revisão anterior à que a fábrica acabou de aprovar. É o mesmo problema de conteúdo desatualizado, só que em fibra de carbono e com uma diferença: a cópia digital se refaz em segundos.

*(acréscimo do professor; o material explica CDN com o exemplo do Google Cloud, sem parear serviços)*

| Conceito | AWS | Azure | O que muda de verdade |
|---|---|---|---|
| CDN | Amazon CloudFront | Azure Front Door e Azure CDN | **Diferem em escopo.** O CloudFront é principalmente CDN. O Front Door junta, num serviço **global** de entrada web, CDN, balanceamento de camada 7 entre regiões e WAF. Na AWS, balanceamento global e firewall web são serviços separados que você combina |
| Firewall web | AWS WAF | Azure Web Application Firewall (WAF) | Na AWS, o WAF é um serviço que se acopla ao CloudFront, ao ALB e a outros. Na Azure, o WAF é uma política que se acopla ao Application Gateway ou ao Front Door |

**Design para escalabilidade e HA.** Escale **horizontalmente** na nuvem (mais instâncias, sem teto prático) e use a vertical com ciência dos limites. Para HA: redundância, failover automático e distribuição em várias localizações; as **AZs** (data centers físicos e logicamente separados na região, com energia, refrigeração e rede independentes) protegem contra falha de um data center. Aproveitar a nuvem exige **mentalidade distribuída** e re-arquitetar a aplicação, não só *lift-and-shift*.

**Outposts (AWS) e Azure Stack e Arc.** Para baixa latência ou residência de dados no seu local, o Outposts estende infraestrutura e serviços da AWS ao seu data center. Responsabilidade compartilhada: a AWS gerencia a infraestrutura do Outpost; você garante energia, refrigeração e rede local. As diferenças para a Azure estão na tabela da Etapa 01.

**Well-Architected Frameworks: os pilares.**

| Pilar (material) | O que cobre |
|---|---|
| Excelência Operacional | Executar e monitorar sistemas para entregar valor e melhorar continuamente |
| Segurança | Proteção de dados, sistemas e ativos |
| Confiabilidade | Funcionar como esperado e se recuperar de falhas |
| Eficiência de Performance | Uso eficiente de recursos conforme a demanda |
| Otimização de Custos | Maximizar valor pelo menor custo |
| Sustentabilidade (pilar adicionado pela AWS) | Reduzir impacto ambiental |

*(acréscimo do professor; o material cita os frameworks da AWS e da Azure sem compará-los)*

| Conceito | AWS | Azure | O que muda de verdade |
|---|---|---|---|
| Framework de boas práticas | AWS Well-Architected Framework | Azure Well-Architected Framework | Mesma intenção e boa parte dos pilares em comum. A AWS adotou a Sustentabilidade como **sexto** pilar. O framework da Azure é descrito com **cinco** pilares (confiabilidade, segurança, otimização de custos, excelência operacional e eficiência de performance); a sustentabilidade é tratada dentro da orientação de projeto, e não como pilar separado. Confirme a estrutura vigente na documentação |

**Leitura de cockpit:** os pilares são o compromisso de projeto de um carro. Mais carga aerodinâmica custa velocidade de reta; mais confiabilidade costuma custar peso; mais desempenho custa dinheiro dentro do teto de gastos. Ninguém maximiza tudo: equilibra-se para o campeonato que se quer ganhar. Um Well-Architected bem aplicado faz a mesma pergunta a cada revisão.

**Design para segurança.** *Secure by Design* (segurança desde o início, não remendo depois). Princípio do **menor privilégio** (só as permissões mínimas, pelo tempo mínimo). **Defesa em profundidade** (camadas sobrepostas: se uma falha, as outras protegem). Outros do OWASP: reduzir superfície de ataque, falhar de forma segura, **Zero Trust** ("nunca confiar, sempre verificar"). **Shift Left:** trazer segurança para o planejamento e o design. Aprofundamos na Etapa 06.

### Exemplo comentado: desenhar a rede antes de criá-la

*Atenção, que a corrida esquenta! Erro de CIDR não se conserta com um clique depois que a rede existe. Quem faz a conta agora, no papel, não precisa renumerar nada mais adiante.*

Antes de clicar em "criar VPC", calcule os endereços. Erro de CIDR é caro de consertar depois (você não redimensiona fácil, e não consegue ligar redes que se sobrepõem). Crie `$LAB/etapa-05/cidr.py`:

```python
import ipaddress
import itertools

# Espaço de endereços da rede virtual (VPC na AWS, VNet na Azure)
rede = ipaddress.ip_network("10.0.0.0/16")

# Plano: 3 camadas (publica, app, dados) x 2 zonas (a, b) = 6 sub-redes /24
plano = {
    "publica-a": "10.0.0.0/24",
    "publica-b": "10.0.1.0/24",
    "app-a": "10.0.10.0/24",
    "app-b": "10.0.11.0/24",
    "dados-a": "10.0.20.0/24",
    "dados-b": "10.0.21.0/24",
}

# Converte cada texto em um objeto de rede
subredes = {nome: ipaddress.ip_network(cidr) for nome, cidr in plano.items()}

for nome, sub in subredes.items():
    dentro = sub.subnet_of(rede)             # a sub-rede cabe dentro da rede grande?
    utilizaveis = sub.num_addresses - 5      # 5 endereços reservados pela plataforma (AWS e Azure)
    print(nome, sub, "dentro=" + str(dentro), "utilizaveis=" + str(utilizaveis))

# Procura pares que se sobrepõem: o resultado deve ser uma lista vazia
conflitos = [(a, b) for (a, ra), (b, rb) in itertools.combinations(subredes.items(), 2) if ra.overlaps(rb)]
print("conflitos:", conflitos)

# Teste de peering ou VPN: a rede da outra ponta pode se sobrepor à sua?
print("overlap com 192.168.0.0/16:", rede.overlaps(ipaddress.ip_network("192.168.0.0/16")))
print("overlap com 10.0.5.0/24:", rede.overlaps(ipaddress.ip_network("10.0.5.0/24")))
```

Saída esperada:

```text
publica-a 10.0.0.0/24 dentro=True utilizaveis=251
publica-b 10.0.1.0/24 dentro=True utilizaveis=251
app-a 10.0.10.0/24 dentro=True utilizaveis=251
app-b 10.0.11.0/24 dentro=True utilizaveis=251
dados-a 10.0.20.0/24 dentro=True utilizaveis=251
dados-b 10.0.21.0/24 dentro=True utilizaveis=251
conflitos: []
overlap com 192.168.0.0/16: False
overlap com 10.0.5.0/24: True
```

Interpretação: o plano é coerente (todas dentro da `/16`, nenhuma conflita). Ligar essa rede a outra que use `10.0.5.0/24` **seria impossível** (sobreposição). Por isso empresas mantêm um cadastro central de CIDRs antes de criar qualquer rede.

**Leitura de cockpit:** sobreposição de CIDR é dois carros com o mesmo número. Na F1, cada piloto tem um número permanente e único justamente para que cronometragem, comissários e transmissão saibam sempre quem é quem; com dois carros de mesmo número, ninguém conseguiria atribuir uma volta. O cadastro central de CIDRs da empresa é o registro de números da FIA: confere-se antes de pintar o carro, não depois. **Aqui a analogia para:** o número identifica um carro só; um bloco CIDR é uma faixa inteira de endereços, e a sobreposição pode ser parcial (como `10.0.5.0/24` dentro de `10.0.0.0/16`).

**Mesmo desenho em duas linguagens de IaC (Infraestrutura como Código).** IaC descreve a infraestrutura em arquivo e a plataforma a cria. Na AWS, o serviço é o **CloudFormation** (YAML ou JSON); na Azure, **ARM templates** (JSON) e **Bicep** (linguagem mais legível que compila para ARM). *(O Terraform funciona nas duas, mas não é citado no material.)*

`$LAB/etapa-05/vpc.yaml` (CloudFormation):

```yaml
AWSTemplateFormatVersion: "2010-09-09"   # versão do formato do template (valor fixo)
Description: VPC de estudo                # texto livre
Resources:
  Vpc:                                    # nome lógico do recurso dentro do template
    Type: AWS::EC2::VPC                   # tipo do recurso
    Properties:
      CidrBlock: 10.0.0.0/16              # espaço de endereços da VPC
      Tags:
        - Key: ambiente                   # tag de governança (Etapa 06)
          Value: teste
  SubredePublicaA:
    Type: AWS::EC2::Subnet                # sub-rede
    Properties:
      VpcId: !Ref Vpc                     # referência à VPC acima
      CidrBlock: 10.0.0.0/24
      AvailabilityZone: !Select [0, !GetAZs ""]   # a primeira AZ da região em que o stack for criado
```

`$LAB/etapa-05/vnet.bicep` (Bicep):

```bicep
param localizacao string = resourceGroup().location   // parâmetro: região do grupo de recursos

resource vnet 'Microsoft.Network/virtualNetworks@2023-11-01' = {   // tipo e versão da API
  name: 'vnet-loja'                                    // nome da VNet
  location: localizacao
  tags: {
    ambiente: 'teste'                                  // mesma tag de governança
  }
  properties: {
    addressSpace: {
      addressPrefixes: ['10.0.0.0/16']                 // espaço de endereços da VNet
    }
    subnets: [
      {
        name: 'publica'                                // na Azure, uma sub-rede por camada basta
        properties: {
          addressPrefix: '10.0.0.0/24'
        }
      }
    ]
  }
}
```

Observe a diferença de modelagem: na AWS, a sub-rede é um recurso à parte, preso a uma AZ; na Azure, ela é uma propriedade da VNet e não é zonal.

**Leitura de cockpit:** a diferença de planta aparece no próprio arquivo: na AWS, cada setor é uma peça separada da ficha, presa a um pavilhão; na Azure, o setor é um item dentro da ficha da área inteira.

### Mão na massa

*Cronômetro ligado! Rode o plano de endereços, valide os dois arquivos de IaC sem criar nada e confira com os próprios olhos que, na AWS, cada sub-rede tem a sua zona.*

**1.** Rode `python3 "$LAB"/etapa-05/cidr.py` e confira a saída.

**2. Valide os arquivos de IaC sem criar nada.**

Bicep (compila localmente para ARM; na primeira vez a CLI pode baixar o Bicep; não precisa de login):

```sh
cd "$LAB"/etapa-05
az bicep build --file vnet.bicep      # gera vnet.json (o template ARM equivalente)
grep "Microsoft.Network" vnet.json    # procura o tipo do recurso no JSON gerado
```

Saída esperada do `grep`: uma linha contendo `"type": "Microsoft.Network/virtualNetworks"`.

CloudFormation (`validate-template` só verifica a sintaxe; exige credenciais configuradas, mas **não cria** a pilha):

```sh
aws cloudformation validate-template --template-body "file://$LAB/etapa-05/vpc.yaml"
```

Saída esperada: um JSON parecido com `{"Parameters": [], "Description": "VPC de estudo"}`.

> **Não rode** `aws cloudformation create-stack` nem `az deployment ... create` neste guia: eles **criam recursos** e podem gerar custo. A etapa é de leitura e de validação.

**3. Veja as redes que já existem (somente leitura).**

AWS (uma conta nova costuma ter uma **VPC padrão** em cada região, com um bloco `172.31.0.0/16`):

```sh
aws ec2 describe-vpcs --query "Vpcs[].[VpcId,CidrBlock,IsDefault]" --output text
```

Saída esperada (ilustrativa):

```text
vpc-0a1b2c3d4e5f67890	172.31.0.0/16	True
```

```sh
aws ec2 describe-subnets --query "Subnets[].[SubnetId,AvailabilityZone,CidrBlock]" --output text
```

Esse comando mostra **uma sub-rede por AZ**, cada uma com a sua zona: a prova prática de que, na AWS, a sub-rede é zonal.

Azure (lista as VNets e as sub-redes; numa assinatura nova a lista vem vazia):

```sh
az network vnet list --output table
```

### Exercícios

*Volta lançada! Seis exercícios, o maior bloco até aqui. O terceiro cobra a diferença de planta entre os dois circuitos: conte as sub-redes antes de responder.*

1. **Qual armazenamento?** (a) Milhões de fotos de produto; (b) disco do banco de dados de pedidos; (c) pasta compartilhada de documentos do time. *Resposta esperada:* (a) objeto (S3 ou Blob Storage); (b) bloco (EBS ou Managed Disks); (c) arquivo (EFS ou Azure Files, pares do professor).
2. **Qual banco?** (a) Sistema financeiro com transferências entre contas; (b) carrinho de compras com milhões de leituras por segundo e esquema flexível; (c) análise de vendas de 5 anos. *Resposta esperada:* (a) relacional (ACID: RDS ou Aurora; Azure SQL Database ou Azure Database for PostgreSQL); (b) NoSQL (DynamoDB ou Cosmos DB), possivelmente com cache em memória; (c) data warehouse (Redshift; Synapse ou Fabric).
3. **Desenhe o CIDR.** Você precisa de uma rede `10.20.0.0/16` com 3 camadas (publica, app, dados) em **3 zonas**, sub-redes `/24`. Quantas sub-redes na AWS e quantas na Azure? Liste um plano na AWS. *Resposta esperada:* na AWS, como a sub-rede é zonal, 3 camadas x 3 zonas = 9 sub-redes (por exemplo, publica-a/b/c em `10.20.0.0/24`, `10.20.1.0/24`, `10.20.2.0/24`; app em `10.20.10.0/24` a `10.20.12.0/24`; dados em `10.20.20.0/24` a `10.20.22.0/24`). Na Azure, como a sub-rede não é zonal, 3 sub-redes (uma por camada) bastam, com as VMs distribuídas nas zonas 1, 2 e 3. Se houver VPN Gateway, acrescente a `GatewaySubnet`.
4. **Sobreposição.** Duas VPCs com `10.0.0.0/16` e `10.0.5.0/24` podem ser ligadas por peering? *Resposta esperada:* não; os blocos se sobrepõem. É preciso renumerar uma delas antes.
5. **Camada 4 ou camada 7?** Rotear `/api` para um grupo de servidores e `/imagens` para outro. *Resposta esperada:* camada 7 (ALB na AWS, Application Gateway na Azure), porque a decisão depende do caminho HTTP.
6. **Quantos pilares?** O material lista seis pilares do Well-Architected. A Azure descreve quantos? *Resposta esperada:* cinco; a Sustentabilidade foi o sexto pilar adicionado pela AWS. Confirme na documentação vigente.

### Anota aí

> Escolha o bloco pelo problema (objeto, bloco ou arquivo; SQL ou NoSQL; camada 4 ou 7) e desenhe o endereçamento da rede antes de criar qualquer coisa, lembrando que a sub-rede é zonal na AWS e não é na Azure.

*Setor 5 no verde! Bloco certo para cada problema e endereçamento desenhado no papel, com a sub-rede zonal na AWS e regional na Azure. Falta a reta que decide se a operação é segura e cabe no orçamento: credenciais, chaves, firewalls, etiquetas e teto de gastos. Etapa 06.*

---

## Etapa 06: Segurança, Custos e Boas Práticas

*Último setor! Segurança, custo e governança, os três temas que costumam ficar para "depois" e que aqui entram no projeto desde a prancheta. Informação de equipe vale ouro: em 2007, a McLaren foi excluída do campeonato de construtores e multada em 100 milhões de dólares por estar com dados técnicos da Ferrari em mãos. Credencial, chave e etiqueta: vamos fechar esta corrida.*

### O problema

Um desenvolvedor sobe um bucket de testes com configuração aberta ao mundo e esquece. Meses depois, descobre-se que dados de clientes vazaram. No mesmo mês, a fatura da nuvem triplica porque dez VMs de desenvolvimento ficaram ligadas fim de semana após fim de semana, e vinte discos órfãos nunca foram apagados. Ninguém sabe de quem são esses recursos, porque ninguém os marcou. Três problemas distintos (**segurança, custo, governança**) com a mesma origem: tratar esses temas como "depois" e não como parte do design.

Fato do material que dói: **erros de configuração**, que são responsabilidade do cliente, estão entre as causas mais comuns de violação de dados na nuvem.

**Leitura de cockpit:** a F1 conhece bem o erro de operação do lado de quem opera. No GP do Bahrein de 2018, a Ferrari liberou o carro do Kimi Räikkönen do pit stop de forma insegura, e um mecânico da própria equipe saiu com a perna quebrada; os comissários multaram a equipe em 50 mil euros. A pista e o pit lane estavam em ordem: a falha foi do procedimento da equipe. É o retrato do material: na nuvem, boa parte dos vazamentos nasce de configuração, e configuração é responsabilidade do cliente.

### O conceito

**Modelo de Responsabilidade Compartilhada (SRM).** O provedor responde pela "segurança **da** nuvem" (infraestrutura física, hardware, software de base, rede e instalações). Você responde pela "segurança **na** nuvem" (dados, configuração de rede, SO, aplicações e IAM). A divisão muda com IaaS, PaaS, SaaS e FaaS (matriz da Etapa 02). Os dois provedores adotam esse modelo.

**Leitura de cockpit:** a responsabilidade compartilhada é o acordo natural entre circuito e equipe. O circuito responde pela segurança **da** pista: asfalto, barreiras, comissários de pista, estrutura dos boxes. A equipe responde pela segurança **no** carro e na garagem: o carro que ela monta, o set-up, quem ela deixa entrar, o jeito como libera o carro no pit stop. Na garagem vazia (IaaS), a parte da equipe é grande; na garagem equipada (PaaS), diminui; mas a lista de quem entra e o que se guarda é sempre dela.

**IAM: quem acessa o quê.** O IAM é a espinha dorsal do menor privilégio.

- **Autenticação:** provar quem você é. Reforçada por **MFA** (mais de um fator) e **SSO** (autenticar uma vez para vários recursos).
- **Autorização:** definir o que você pode fazer em quais recursos.
- **Federação de identidade:** usar credenciais de outro sistema (rede corporativa, provedor de identidade) sem criar novos logins.
- **Roles (funções):** agrupam permissões; quem recebe a role herda os privilégios.
- **Políticas:** documentos formais que dizem quais ações são permitidas em quais recursos.

**Leitura de cockpit:** IAM é o credenciamento do paddock. **Autenticação** é provar que a credencial é sua. **Autorização** é o que ela libera: paddock, garagem, pit lane. **Roles** são os tipos de credencial (mecânico, engenheiro, convidado): quem recebe o tipo herda os acessos dele. **Políticas** são a tabela que diz qual tipo entra onde. **Federação** é aceitar a identidade emitida por outro sistema confiável em vez de criar cadastro novo. E **menor privilégio** é o convidado da área de hospitalidade não ter acesso ao pit lane só porque "talvez precise". Na Azure, quem você é (Entra ID) e o que você pode fazer (RBAC) ficam em serviços diferentes, como se a emissão da credencial e a tabela de acessos fossem balcões separados; na AWS, o IAM cuida dos dois dentro da conta.

*(acréscimo do professor; o material cita o Entra ID)*

| Conceito | AWS | Azure | O que muda de verdade |
|---|---|---|---|
| Serviço de identidade | AWS IAM (usuários, grupos, roles, políticas); para a força de trabalho, AWS IAM Identity Center (acréscimo do professor) | Microsoft Entra ID (identidades) + Azure RBAC (autorização sobre recursos) | **A divisão de papéis é diferente.** Na Azure, o Entra ID é o diretório de identidades do locatário (inclusive do Microsoft 365) e o RBAC decide quem pode fazer o quê nos recursos Azure. Na AWS, o IAM cobre as duas coisas dentro da conta. O Entra ID era chamado Azure AD (o material já registra a mudança). Acréscimo do professor: para login único (SSO) e federação de funcionários em várias contas, o par mais próximo do Entra ID na AWS é o IAM Identity Center (antes chamado AWS SSO); confira na documentação |
| Permissões | Políticas (documentos JSON anexados a usuários, grupos ou roles) | Atribuições de papel (*role assignments*): um papel, um alvo e um escopo | Na Azure, o escopo (grupo de gerenciamento, assinatura, grupo de recursos, recurso) faz parte da atribuição |
| MFA | MFA no IAM; suporta o padrão FIDO2 | MFA no Entra ID; suporta o padrão FIDO2 | Os dois suportam chaves FIDO2, o método mais resistente a phishing citado no material |

**MFA.** Exige um segundo ou terceiro fator: "algo que você sabe" (PIN), "algo que você tem" (token, notificação, código) e "algo que você é" (biometria). MFA por SMS ou código pode ser contornada por phishing, engenharia social e interceptação; o material aponta **FIDO2** como o método mais robusto (ref. jun/2025).

**Leitura de cockpit:** uma credencial com foto, conferida na entrada, já combina dois fatores: algo que você tem (o crachá) e algo que você é (o rosto). Senha sozinha é crachá sem foto: quem achar, usa. **Aqui a analogia para:** a foto é conferida por uma pessoa e pode ser enganada; uma chave FIDO2 faz uma verificação criptográfica vinculada ao site verdadeiro, que um site falso não consegue reaproveitar.

**Criptografia.**

- **Em trânsito (TLS/SSL):** protege dados entre cliente e servidor e entre serviços: criptografa, autentica as pontas e verifica a integridade. O material mostra o exemplo do Google Cloud, onde até o tráfego VM para VM dentro de uma VPC é criptografado. **Isso é uma característica do Google descrita no material, não uma regra geral.** Em AWS e Azure, não assuma: ative TLS na sua aplicação.
- **Em repouso (KMS):** criptografa dados armazenados (algoritmo comum: AES), impedindo uso do dado se vazar. Os provedores permitem gerir chaves próprias.
- **Hierarquia de chaves (criptografia de envelope):** uma **DEK** (chave de dados) criptografa os dados; uma **KEK** (chave de criptografia de chaves) criptografa a DEK. A KEK fica num repositório central controlado. Girar a KEK exige reenvelopar as DEKs, não recriptografar todos os dados.

*(acréscimo do professor; o material fala de KMS de forma genérica e cita o Cloud KMS do Google)*

| Conceito | AWS | Azure | O que muda de verdade |
|---|---|---|---|
| Gestão de chaves | AWS Key Management Service (KMS) | Azure Key Vault | O Key Vault guarda também **segredos e certificados** no mesmo serviço; na AWS esses ficam em serviços próprios. Os dois suportam o padrão de envelope encryption |

**Segurança de rede em camadas** (defesa em profundidade). O material (modelo AWS) descreve:

- **VPC:** segmento isolado; segmentação é a primeira linha de defesa. Sub-redes **públicas** (acesso direto à Internet, como balanceadores), **privadas** (aplicação e bancos; saem pela NAT) e **protegidas** (sem saída da VPC, ideal para banco).
- **NACL (*Network ACL*):** firewall **stateless** no nível da **sub-rede**, com regras de permitir e negar processadas **em ordem numérica**. A NACL padrão permite todo o tráfego; NACLs personalizadas negam tudo por padrão.
- **Security Group:** firewall **stateful** no nível da **interface de rede (ENI)**. Se a entrada é permitida, a resposta é automaticamente permitida. Grupo personalizado: toda saída permitida e nenhuma entrada por padrão.
- **AWS WAF:** firewall de aplicação web, bloqueia tráfego malicioso.
- **AWS Network Firewall:** firewall gerenciado de perímetro de VPCs, com inspeção de todo o tráfego, filtragem web e prevenção de intrusão.
- **VPN, Direct Connect, Client VPN e Transit Gateway:** conexões seguras com on-premises e entre redes.

**Stateful x stateless.** Stateful lembra das conexões: se você autorizou a ida, a volta é liberada sozinha. Stateless não lembra: você precisa autorizar ida **e** volta. Analogia: o porteiro que reconhece o visitante que acabou de entrar (stateful) contra o que confere a lista a cada passagem (stateless).

**Leitura de cockpit:** o Security Group é o segurança ao lado do carro, que viu você chegar até ele e deixa você sair sem conferir de novo (stateful). A NACL é a catraca do setor que confere a lista na entrada **e** na saída, em ordem, regra por regra (stateless). O primeiro lembra da conversa; a segunda só lê a lista.

*(acréscimo do professor; o material descreve o modelo da AWS e cita NSGs)*

| Conceito | AWS | Azure | O que muda de verdade |
|---|---|---|---|
| Firewall de instância | Security Group (stateful, **só regras de permitir**) | Network Security Group (NSG) na interface de rede (stateful) | O NSG aceita regras de **permitir e negar**, com **prioridade numérica** (menor número vale primeiro); o Security Group só permite |
| Firewall de sub-rede | NACL (**stateless**, permitir e negar, ordem numérica) | NSG associado à sub-rede (**stateful**) | **Diferença importante:** a posição é a mesma (sub-rede), mas a NACL é stateless e o NSG é stateful. Na Azure, um mesmo tipo de recurso (o NSG) serve nos dois níveis |
| Saída da rede privada | NAT Gateway | NAT Gateway | Etapa 05 |
| Firewall de aplicação web | AWS WAF | Azure WAF | Etapa 05: acopla-se a pontos de entrada diferentes |
| Firewall de rede gerenciado | AWS Network Firewall | Azure Firewall | Ambos inspecionam o tráfego de forma centralizada. O Azure Firewall é implantado numa sub-rede dedicada (`AzureFirewallSubnet`) numa VNet, em geral num "hub" |
| VPN site a site | Site-to-Site VPN (Virtual Private Gateway e Customer Gateway) | VPN Gateway (Virtual Network Gateway e Local Network Gateway) | Mesmo papel, nomes das duas pontas diferentes |
| VPN de usuário remoto | AWS Client VPN | VPN Gateway no modo ponto a site (Point-to-Site) | Na Azure, o ponto a site é um modo do mesmo gateway; na AWS, é um serviço à parte (Client VPN) |
| Conexão dedicada | Direct Connect | ExpressRoute | Etapa 01 |
| Hub de redes | Transit Gateway | Virtual WAN | O Transit Gateway é um roteador regional central (hub e spokes) que você configura. O Virtual WAN é uma oferta mais gerenciada que também integra conectividade de filiais; confira o escopo de cada um |

**Ordem de leitura de uma regra no NSG (para fixar):** o NSG tem regras padrão que permitem o tráfego dentro da VNet e o tráfego de saída para a Internet, e negam o restante da entrada; **a sua regra com número menor vale antes das padrão**. No Security Group da AWS, o equivalente é: nada entra a não ser que você permita.

**Leitura de cockpit:** no NSG, as regras são numeradas e a de número menor vale primeiro, como uma lista de acesso em que a primeira linha que bate decide. No Security Group da AWS só existe lista de liberados: quem não está nela não entra.

**FinOps.** Prática colaborativa entre finanças, engenharia e negócios para gerir e otimizar custos, com cultura de responsabilidade financeira. O material cita ainda CapOps e RevOps como termos emergentes (não os memorize como padrão da indústria).

**Leitura de cockpit:** a F1 vive de FinOps desde 2021, quando o teto de gastos entrou em vigor. A engenharia não decide uma peça nova sem saber quanto ela consome do orçamento do ano, e as finanças não cortam sem entender o que cada corte custa em desempenho. As duas pontas sentam juntas, e saber para onde vai cada valor passou a fazer parte do desempenho. **Aqui a analogia para:** o teto de gastos é imposto de fora, com punição prevista no regulamento; o FinOps é uma prática interna, e ninguém multa a sua fatura além do seu próprio diretor financeiro.

**Estratégias de otimização (resumo do material):**

- **Armazenamento:** apagar snapshots e volumes sem uso (EBS não anexados); ciclo de vida de retenção; camada adequada.
- **Serverless:** computa só quando necessário, cobra por duração.
- **Autoscaling e balanceamento:** adiciona e remove servidores conforme a carga.
- **Spot ou VMs de baixa prioridade:** capacidade ociosa com grande desconto, **pode ser interrompida** quando surge demanda.
- **Reservas e planos de economia:** descontos para carga previsível em troca de compromisso longo.
- **Egress e transferência de dados:** reduzir a movimentação entre regiões e zonas; usar CDN e cache.
- **Agendamento:** desligar o que não está em uso (ex.: desenvolvimento à noite).
- **Dimensionamento (*right-sizing*):** reduzir recursos superdimensionados (ex.: uso de 0 a 20%).
- **Rede:** remover balanceadores e IPs públicos sem uso.
- **IaC:** infraestrutura sob demanda, sem manter o que não precisa.

**Leitura de cockpit:** desligar o que não está em uso é o desperdício mais fácil de achar: equipamento ligado de madrugada, sem ninguém trabalhando. Discos órfãos são peças fabricadas que nunca foram montadas, mas continuam ocupando espaço e orçamento. Spot é aproveitar uma janela barata que pode ser cancelada a qualquer momento: serve para o trabalho que tolera recomeçar. Right-sizing é parar de levar para o circuito a ferramenta grande quando a pequena dá conta.

*(acréscimo do professor; o material cita Trusted Advisor, Compute Optimizer, Cost Management, Azure Advisor, Azure Monitor e Azure Resource Graph)*

| Conceito | AWS | Azure | O que muda de verdade |
|---|---|---|---|
| Visão e controle de gasto | AWS Cost Management (Cost Explorer, Budgets) | Microsoft Cost Management | Nos dois: análise de custo, orçamentos e alertas. As categorias e dimensões de filtro mudam |
| Recomendações | AWS Trusted Advisor (e Compute Optimizer) | Azure Advisor | Ambos recomendam economia, desempenho, segurança e confiabilidade. Na AWS, parte dos checks do Trusted Advisor depende do plano de suporte contratado |
| Desconto por compromisso | Savings Plans e Reserved Instances (RIs) | Azure Savings Plan e Azure Reservations | O material diz que as ferramentas recomendam RIs e Savings Plans. Os dois oferecem os dois estilos de compromisso (por recurso específico ou por gasto por hora); as condições, prazos e serviços cobertos diferem, e **só a calculadora de cada provedor dá o valor** |
| Capacidade ociosa | Spot Instances | Spot VMs | Em ambos, capacidade ociosa com desconto e **sem garantia de permanência**: o provedor pode retomá-la. As regras de aviso de interrupção e de preço diferem |
| Inventário e consulta de recursos | AWS Resource Groups Tagging API e AWS Config | Azure Resource Graph | O material cita o Resource Graph. Servem para consultar recursos em escala, inclusive por tag |
| IaC | CloudFormation | ARM templates e Bicep | Etapa 05 |
| Monitoramento e observabilidade | Amazon CloudWatch | Azure Monitor | Métricas, logs e alarmes. Na Azure, o Monitor reúne métricas e logs sob uma mesma plataforma; na AWS, o CloudWatch é a base e outros serviços completam |

**Governança: políticas, tags, automação e auditoria.** Governança é criar, aplicar e monitorar políticas de segurança, risco, conformidade e custo.

**Tags** são metadados (chave e valor) que permitem alocar custo, filtrar relatórios, aplicar conformidade e segurança. Exigem uma **política consistente** de nomes (ortografia, capitalização, espaçamento). Exemplos do material: `ambiente = teste`, `custo = projeto`, `db = database`, `compliance = hipaa`, `time = 12x05`. **Cada provedor tem limites próprios** (quantidade de tags, tamanho de chave e valor, sensibilidade a maiúsculas e minúsculas); consulte a documentação e não memorize números.

**Leitura de cockpit:** tag é a etiqueta de cada peça com número de revisão, projeto e centro de custo. Sem ela, no fim do ano ninguém sabe quanto custou o assoalho novo nem quanto dele entrou no teto de gastos. E a mesma etiqueta escrita de dois jeitos (`Producao` e `producao`) vira duas peças diferentes na contabilidade; por isso a regra de grafia é imposta por sistema, e não pela boa vontade de quem etiqueta.

Automação: aplicar tags por template, **verificar** por regra e alertar. Em casos rigorosos (e só fora de produção), terminar recursos sem tags após um prazo. Auditoria: política definida com as partes interessadas, relatórios semanais de cobertura, alertas por e-mail, ação opcional de encerramento e monitoramento contínuo.

*(acréscimo do professor; o material fala de tags sem citar o mecanismo de cada provedor)*

| Conceito | AWS | Azure | O que muda de verdade |
|---|---|---|---|
| Tags | Tags em recursos; **Tag Policies** (AWS Organizations) para padronizar | Tags em recursos e grupos de recursos; **Azure Policy** para exigir e herdar tags | Na Azure, a tag de um grupo de recursos **não é herdada** pelos recursos dentro dele por padrão; use Azure Policy para propagar. Na AWS, a padronização de tags vem das Tag Policies e de regras em AWS Config. Verifique a sensibilidade a maiúsculas e minúsculas e os limites na documentação |

**Well-Architected Framework (aplicação prática).** Seis pilares na AWS (cinco na Azure, ver Etapa 05). Uma solução bem arquitetada **equilibra** todos os pilares, e há trade-offs: mais segurança pode elevar custo e complexidade; mais disponibilidade custa mais. FinOps e GreenOps (o FinOps aplicado ao impacto ambiental: medir e reduzir a pegada de carbono do que se usa) mostram que custo e sustentabilidade se otimizam juntos. Os frameworks também funcionam como **metodologia de revisão**: avaliar a arquitetura contra cada pilar, periodicamente.

**Leitura de cockpit:** replicar em três regiões é como levar três jogos completos de peças sobressalentes para cada etapa: o carro fica mais protegido, a conta e a logística ficam mais pesadas. A revisão periódica contra os pilares é o debrief do projeto: em vez de "o carro foi rápido?", a pergunta é "o carro está equilibrado no que importa?".

**Panorama e tendências (material, ref. jun/2025):** o material projetava que a segurança na nuvem consumiria até 20% do orçamento total de cibersegurança em 2025; cibersegurança baseada em contexto (movimento lateral de atacantes em ambientes híbridos); foco migrando da prevenção pura para **contenção rápida e resiliência** (DORA e NIS2 citadas: regulamentos da União Europeia, o DORA sobre resiliência operacional digital do setor financeiro e a NIS2 sobre cibersegurança); e uma lista de projeções para 2025 (edge, serverless, IA, cloud-native, quântica, nuvem soberana). **Trate essas projeções como contexto histórico**; o ponto durável é que segurança, custo, sustentabilidade e performance se decidem juntos, e não em silos.

### Exemplo comentado: criptografia de envelope no seu terminal

Veja a hierarquia DEK e KEK funcionando, 100% local, com `openssl`. É uma **demonstração didática** (usa AES-256 em modo CBC com derivação de chave por senha; produção usa os serviços gerenciados e modos autenticados). Em um KMS ou Key Vault, a KEK **nunca sai** do serviço. Requer OpenSSL 1.1.1 ou superior (versão em que surgiu a opção `-pbkdf2`); no macOS, se `-pbkdf2` for rejeitada, veja a nota sobre LibreSSL nos pré-requisitos.

```sh
cd "$LAB"/etapa-06

echo "dados do cliente" > dados.txt        # o segredo que queremos proteger
openssl rand -hex 32 > dek.key             # DEK: chave aleatória que criptografa os dados
openssl rand -hex 32 > kek.key             # KEK: chave que protege a DEK (no mundo real, fica no KMS ou Key Vault)

# 1) criptografa os dados com a DEK
openssl enc -aes-256-cbc -pbkdf2 -in dados.txt -out dados.enc -pass file:dek.key

# 2) criptografa (envelopa) a DEK com a KEK
openssl enc -aes-256-cbc -pbkdf2 -in dek.key -out dek.enc -pass file:kek.key

# 3) apaga a DEK em claro: ficam só os dados cifrados e a DEK cifrada
rm dek.key dados.txt

# 4) para ler de volta: primeiro abre o envelope (KEK -> DEK), depois decifra os dados (DEK -> dados)
openssl enc -d -aes-256-cbc -pbkdf2 -in dek.enc -out dek.key -pass file:kek.key
openssl enc -d -aes-256-cbc -pbkdf2 -in dados.enc -pass file:dek.key
```

Saída esperada do último comando:

```text
dados do cliente
```

Perceba a vantagem: para **trocar a KEK** (rotação), você só reabre e refaz o envelope da DEK (um arquivo pequeno), sem recifrar os dados (que podem ter terabytes). E quem roubar `dados.enc` e `dek.enc` sem a KEK não lê nada: o controle de acesso se concentra na chave.

**Leitura de cockpit:** é a chave do caminhão de peças. Cada caminhão tem o seu cadeado, e a chave dele é a DEK. Todas essas chaves ficam trancadas num cofre cujo segredo só o chefe de logística conhece: o segredo do cofre é a KEK. Trocar o segredo do cofre (girar a KEK) não exige trocar o cadeado de nenhum caminhão. E quem roubar o caminhão e a caixa de chaves trancada, sem o segredo do cofre, não abre nada. **Aqui a analogia para:** no KMS e no Key Vault, a KEK nunca sai do serviço: a abertura do envelope acontece lá dentro, sem que ninguém veja o segredo.

**Limpeza:** `cd "$LAB"/etapa-06 && rm -f dek.key kek.key dados.enc dek.enc`.

### Mão na massa

*Pit stop cronometrado, e é o mais longo do guia! Cinco tarefas: auditoria de tags, política comparada, conta de economia, caça a desperdício e risco com comandos de leitura e um TLS de verdade. Ritmo constante até o fim.*

**1. Auditoria de tags, 100% local.** Crie `$LAB/etapa-06/inventario.csv` (inventário **fictício**):

```text
recurso,ambiente,projeto,custo
vm-web-01,producao,loja,cc-100
vm-web-02,producao,loja,
disco-01,teste,,cc-200
bucket-logs,,loja,cc-100
fn-pedidos,producao,loja,cc-100
```

Rode o auditor (`-F,` separa por vírgula; `NR>1` ignora o cabeçalho; uma linha com qualquer das três tags vazias está "sem tag"):

```sh
awk -F, 'NR>1 {
  total++                                              # conta recursos
  if ($2=="" || $3=="" || $4=="") {                    # alguma das tags obrigatórias vazia?
    print "SEM TAG:", $1
    faltam++
  }
} END {
  printf "cobertura: %d/%d = %.0f%%\n", total-faltam, total, (total-faltam)/total*100
}' "$LAB"/etapa-06/inventario.csv
```

Saída esperada:

```text
SEM TAG: vm-web-02
SEM TAG: disco-01
SEM TAG: bucket-logs
cobertura: 2/5 = 40%
```

Desafio: acrescente a linha `vm-api-01,Producao,loja,cc-100` e discuta se `Producao` e `producao` devem contar como a mesma tag (esse é exatamente o problema de sensibilidade a maiúsculas e minúsculas que o material alerta). Reescreva o auditor para tratar `Producao` como erro.

Para acrescentar a linha sem abrir o editor (rode uma vez só; cada execução acrescenta outra cópia):

```sh
echo "vm-api-01,Producao,loja,cc-100" >> "$LAB"/etapa-06/inventario.csv
```

Gabarito. Com o auditor original, a linha nova **passa**, porque `Producao` não está vazia: a saída lista os mesmos três recursos e termina em `cobertura: 3/6 = 50%`. Uma versão que aceita só os valores da política (`producao`, `teste`, `desenvolvimento`, em minúsculas) troca a condição de `$2` por uma expressão regular:

```sh
awk -F, 'NR>1 {
  total++
  if ($2 !~ /^(producao|teste|desenvolvimento)$/ || $3=="" || $4=="") {   # ambiente fora da lista aceita, ou tag vazia
    print "SEM TAG OU FORA DO PADRAO:", $1
    faltam++
  }
} END {
  printf "cobertura: %d/%d = %.0f%%\n", total-faltam, total, (total-faltam)/total*100
}' "$LAB"/etapa-06/inventario.csv
```

Saída esperada:

```text
SEM TAG OU FORA DO PADRAO: vm-web-02
SEM TAG OU FORA DO PADRAO: disco-01
SEM TAG OU FORA DO PADRAO: bucket-logs
SEM TAG OU FORA DO PADRAO: vm-api-01
cobertura: 2/6 = 33%
```

Agora `vm-api-01` aparece como erro e a cobertura cai para 2 de 6. A regra fica no auditor, e não na memória de cada pessoa: é a automação que o material recomenda.

**2. Política de tags comparada (papel).** Preencha:

| Tag obrigatória | Valores aceitos | Por que existe | Como a AWS força | Como a Azure força |
|---|---|---|---|---|
| `ambiente` | `producao`, `teste`, `desenvolvimento` | Separar custo e risco | Tag Policy (padroniza valores) | Azure Policy (exigir tag) |
| `projeto` | Código do projeto | Alocação de custo | Idem, mais regra em AWS Config | Azure Policy |
| `custo` | Código do centro de custo | Chargeback (cobrar o custo de volta da área que o gerou) | Idem | Azure Policy |

Dica: a coluna "como força" é **conceitual**; a configuração real foge ao escopo deste guia.

**3. Cálculo de economia, com números fictícios.** Os preços e descontos abaixo são **inventados** (UM = unidade monetária fictícia; a hora de VM custa 0,50 UM; 730 horas por mês; desconto fictício de 40% para compromisso e 70% para Spot). Crie `$LAB/etapa-06/economia.sh` com o conteúdo abaixo:

```sh
awk 'BEGIN {
  # ATENÇÃO: valores FICTÍCIOS. Preço real: calculadora oficial de cada provedor.
  p = 0.50                     # UM por hora de VM
  h24 = 730                    # horas em um mês
  hcom = 12 * 22               # horário comercial: 12 h por dia x 22 dias úteis = 264 h

  dev24  = 10 * p * h24        # 10 VMs de desenvolvimento ligadas 24x7
  devcom = 10 * p * hcom       # as mesmas 10 VMs, só em horário comercial (agendamento)
  printf "dev 24x7: %.2f\n", dev24
  printf "dev horario comercial (%d h): %.2f\n", hcom, devcom
  printf "economia: %.2f (%.1f%%)\n", dev24 - devcom, (dev24 - devcom) / dev24 * 100

  prod = 4 * p * h24           # 4 VMs de produção estáveis, sob demanda
  printf "prod sob demanda: %.2f\n", prod
  printf "prod com compromisso (desconto ficticio 40%%): %.2f\n", prod * 0.6

  spot = 5 * 100 * p           # 5 VMs de processamento em lote, 100 h no mês
  printf "batch sob demanda: %.2f\n", spot
  printf "batch spot (desconto ficticio 70%%): %.2f\n", spot * 0.3

  printf "discos orfaos: %.2f\n", 20 * 100 * 0.08   # 20 discos x 100 GB x 0,08 UM por GB-mês (fictício)
}'
```

Rode:

```sh
sh "$LAB"/etapa-06/economia.sh
```

Saída esperada:

```text
dev 24x7: 3650.00
dev horario comercial (264 h): 1320.00
economia: 2330.00 (63.8%)
prod sob demanda: 1460.00
prod com compromisso (desconto ficticio 40%): 876.00
batch sob demanda: 250.00
batch spot (desconto ficticio 70%): 75.00
discos orfaos: 160.00
```

Perceba qual alavanca valeu mais: **desligar o que não está em uso** (63,8%) superou o desconto por compromisso, e não exigiu contrato nenhum. Cada técnica serve a um tipo de carga: agendamento para o que é intermitente, compromisso para o que é estável, Spot para o que tolera interrupção.

**Leitura de cockpit:** de novo, a alavanca mais forte não foi negociar desconto, foi parar de pagar pelo que estava parado. É a primeira pergunta de qualquer revisão de orçamento numa equipe sob teto de gastos: o que está ligado, alugado ou guardado sem uso?

**4. Comandos de leitura para caçar desperdício e risco (somente leitura).**

Discos órfãos (o "volume EBS não anexado" do material):

```sh
aws ec2 describe-volumes --filters Name=status,Values=available \
  --query "Volumes[].[VolumeId,Size,CreateTime]" --output text
az disk list --query "[?diskState=='Unattached'].[name,diskSizeGb]" --output table
```

Na AWS, `status=available` significa volume **sem anexo**; na Azure, o estado é `Unattached`. Conta nova: saída vazia.

Quem pode o quê (privilégio mínimo):

```sh
aws iam list-users --query "Users[].UserName" --output text      # usuários IAM da conta
aws iam get-account-summary --query "SummaryMap.AccountMFAEnabled"   # 1 se a conta raiz tem MFA, 0 se não
az role assignment list --all \
  --query "[].{quem:principalName, papel:roleDefinitionName, escopo:scope}" --output table
```

Observação: se o segundo comando devolver `0`, a conta raiz está sem MFA, e isso deve ser corrigido primeiro.

Regras abertas ao mundo:

```sh
aws ec2 describe-security-groups --filters Name=ip-permission.cidr,Values=0.0.0.0/0 \
  --query "SecurityGroups[].[GroupId,GroupName]" --output text
az network nsg list --output table
```

O primeiro lista Security Groups com **alguma entrada liberada para qualquer endereço** (`0.0.0.0/0`). Em conta nova, a saída costuma vir vazia: o security group padrão de cada VPC só aceita entrada vinda do próprio grupo, e não de `0.0.0.0/0`. Se aparecer algum grupo, ele foi criado ou alterado por alguém; avalie caso a caso. Na Azure, liste os NSGs e inspecione as regras de cada um com `az network nsg rule list --resource-group <grupo> --nsg-name <nome> --output table`.

Orçamentos e recomendações:

```sh
az advisor recommendation list --category Cost --output table        # recomendações de custo do Azure Advisor
az consumption budget list --output table                            # orçamentos configurados (pode exigir permissões)
```

Na AWS, o equivalente do Advisor é o Trusted Advisor (`aws support describe-trusted-advisor-checks --language en --region us-east-1`; a API de suporte só responde na região `us-east-1`), que depende do plano de suporte da conta; **sem o plano adequado o comando retorna erro de acesso**, e isso é esperado. Conta nova: listas vazias.

**5. Observe o TLS de verdade (precisa só de Internet).**

```sh
openssl s_client -connect example.com:443 -brief < /dev/null
```

Esse comando abre uma conexão TLS e mostra o resumo: versão do protocolo, suíte de cifras e a verificação do certificado. Saída esperada (varia): linhas como `Protocol version: TLSv1.3` e `Verification: OK`.

### Exercícios

*Última volta do GP! Sete perguntas que costuram o setor inteiro, da responsabilidade compartilhada ao pilar em conflito. Relógio rodando.*

1. **Quem é responsável?** Um bucket (S3 ou Blob) foi deixado público por configuração. Quem responde? *Resposta esperada:* o cliente (segurança **na** nuvem: configuração e dados).
2. **NACL ou NSG de sub-rede?** Qual a diferença de fundo, apesar de ficarem no mesmo nível? *Resposta esperada:* a NACL é stateless (autoriza ida e volta separadamente) e o NSG é stateful (a resposta é liberada automaticamente).
3. **Qual alavanca?** (a) Servidores de desenvolvimento ligados à noite; (b) base de dados de produção que roda 24x7 por anos; (c) processamento de imagens noturno que pode recomeçar se interrompido. *Resposta esperada:* (a) agendamento; (b) compromisso (Savings Plans ou RIs; Azure Savings Plan ou Reservations); (c) Spot (Spot Instances ou Spot VMs).
4. **Por que envelope?** Por que usar DEK e KEK em vez de uma única chave? *Resposta esperada:* para girar a KEK sem recifrar todos os dados (só reenvelopa as DEKs), e para concentrar o controle de acesso na chave central.
5. **Escolha da conexão.** Você precisa de uma conexão privada dedicada, de baixa latência, para ligar o data center à nuvem, e de um acesso individual para 30 funcionários remotos. Cite o serviço de cada caso nas duas nuvens. *Resposta esperada:* circuito dedicado: Direct Connect (AWS) e ExpressRoute (Azure); usuários remotos: Client VPN (AWS) e VPN Gateway ponto a site (Azure).
6. **Tag mal escrita.** Os recursos `ambiente=Producao` e `ambiente=producao` aparecem como grupos distintos no relatório de custo. Qual o remédio? *Resposta esperada:* política de nomes (convenção de capitalização) imposta por automação, que alerta ou corrige, em vez de depender da disciplina de cada pessoa.
7. **Pilar em conflito.** Habilitar replicação em três regiões melhora qual pilar e piora qual? *Resposta esperada:* melhora a confiabilidade; piora a otimização de custos (e a complexidade operacional), o que ilustra os trade-offs do Well-Architected.

### Anota aí

> Segurança, custo e governança são requisitos de design, e não de pós-projeto: aplique menor privilégio e camadas de defesa, marque cada recurso com tags e meça o que importa antes de comprar desconto.

*Setor 6 no verde! Seis setores completos: credenciamento com menor privilégio, chave no cofre, firewall em camadas, etiqueta em cada peça e a alavanca de custo certa para cada carga. Agora é a reta final, direto para a bandeira quadriculada.*

---

## Checklist de autoavaliação

*Última reta, bandeira quadriculada à vista! Esta é a vistoria do parque fechado, a área em que os carros ficam retidos para inspeção depois da corrida e nada passa sem conferência. Marque só o que você consegue fazer sem consultar o guia, porque comissário não aceita resposta decorada.*

**Etapa 01**

- [ ] Defino computação em nuvem com minhas palavras e dou um exemplo.
- [ ] Explico CapEx e OpEx e sei dizer quando a nuvem **não** compensa financeiramente.
- [ ] Diferencio nuvem pública, privada e híbrida e dou um motivo para cada.
- [ ] Diferencio escalabilidade de elasticidade.
- [ ] Distingo Outposts de Azure Arc e de Azure Stack, e Direct Connect de ExpressRoute.
- [ ] Sei listar as regiões com `aws` e com `az`.

**Etapa 02**

- [ ] Descrevo IaaS, PaaS, SaaS e FaaS e dou um serviço AWS e um Azure para cada um (quando houver).
- [ ] Preencho a matriz de responsabilidade e sei que "Dados" é sempre do cliente.
- [ ] Explico por que FaaS é stateless e o que isso muda no design.
- [ ] Sei dizer onde Elastic Beanstalk e App Service diferem.

**Etapa 03**

- [ ] Explico região, zona de disponibilidade e ponto de presença.
- [ ] Sei que o rótulo da zona é mapeado por conta e que na Azure nem toda região tem zonas.
- [ ] Calculo o downtime de um SLA e a disponibilidade em série e em paralelo.
- [ ] Distingo SLI, SLO e SLA.
- [ ] Explico o padrão Circuit Breaker e quando ele vence o retry.
- [ ] Sei parear ASG com VMSS, ALB com Application Gateway e NLB com Azure Load Balancer.

**Etapa 04**

- [ ] Aplico a metodologia de seis critérios para comparar provedores.
- [ ] Explico lock-in e cito mitigações.
- [ ] Sei por que números de participação com datas diferentes não se somam.
- [ ] Monto uma matriz ponderada e entendo por que o peso decide o resultado.

**Etapa 05**

- [ ] Escolho entre armazenamento de objeto, bloco e arquivo e dou o par AWS e Azure.
- [ ] Escolho entre SQL, NoSQL e data warehouse e dou os pares (Aurora e RDS, Azure SQL, DynamoDB, Cosmos DB, Redshift, Synapse e Fabric).
- [ ] Desenho uma rede virtual com sub-redes e CIDR e sei verificar sobreposição.
- [ ] Explico por que na AWS a sub-rede é zonal e na Azure não é.
- [ ] Diferencio balanceamento de camada 4 e 7 e conheço os algoritmos estáticos e dinâmicos.
- [ ] Diferencio CloudFront de Front Door.
- [ ] Cito os pilares do Well-Architected e sei que AWS e Azure diferem no número deles.

**Etapa 06**

- [ ] Explico o modelo de responsabilidade compartilhada e dou exemplos de erro do cliente.
- [ ] Explico IAM, MFA (e FIDO2), SSO e federação, e o par IAM x Entra ID e RBAC.
- [ ] Explico criptografia em trânsito e em repouso e a hierarquia DEK e KEK.
- [ ] Diferencio Security Group, NACL e NSG (stateful x stateless).
- [ ] Pareio WAF, Network Firewall, Site-to-Site VPN, Client VPN, Transit Gateway e Direct Connect com os da Azure.
- [ ] Escolho a alavanca de custo certa (agendamento, compromisso, Spot, right-sizing, limpeza).
- [ ] Defino e audito uma política de tags.
- [ ] Sei que comandos que **criam** recursos geram custo e que os de leitura, em regra, não.

*BANDEIRA QUADRICULADA! Se as caixas estão marcadas, sobe no pódio: você largou com a dúvida entre comprar e alugar e cruzou a linha com modelos de serviço, zonas e regiões, conta dos noves, disjuntor, matriz de decisão, rede desenhada no papel, credenciamento, chave no cofre e etiqueta em cada peça, nos dois circuitos. E largada ruim não decide corrida: em Suzuka, em 1988, o Ayrton Senna deixou o motor morrer no grid, caiu para o meio do pelotão e venceu, garantindo o seu primeiro título. Ficou caixa em branco? Sem drama: box, ajusta e volta para a pista. Na sequência, os registros de bastidor do piloto e do professor.*

---

## Notas do piloto: onde as analogias quebram

A camada de F1 não altera comandos, código, tabelas técnicas, saídas esperadas nem exercícios; as correções técnicas vieram da revisão do professor. Os pontos em que a comparação não fecha 100%:

1. **Circuito com várias sedes.** Um autódromo fica num lugar só; um provedor tem dezenas de regiões. "Circuito", neste guia, é o dono da infraestrutura.
2. **Dois carros fixos.** O regulamento fixa dois carros por equipe. Escala horizontal, elasticidade e auto-scaling não têm equivalente na pista.
3. **Pavilhões independentes.** Num autódromo, as garagens dividem um único prédio dos boxes e a infraestrutura dele; zonas de disponibilidade são fisicamente separadas, com energia, refrigeração e rede próprias.
4. **Carro do circuito não existe.** Na F1, cada equipe projeta o próprio chassi; o "carro-padrão" da IaaS é só uma imagem para "máquina pronta, operada por você do SO para cima".
5. **Pit stop não cobra por uso.** A crew é paga pelo fim de semana inteiro e é sempre a mesma; a FaaS cobra pela execução e você não sabe qual instância atende cada chamada.
6. **SLA e cota de componentes.** O SLA é promessa ao cliente; a cota de componentes de unidade de potência é regra imposta à equipe pela FIA. A comparação preserva só a estrutura (medida, meta com folga, limite que custa caro).
7. **O pit lane não redistribui carros.** Atrás de um balanceador, qualquer instância idêntica atende qualquer requisição; no pit lane real, cada carro para na garagem da própria equipe.
8. **Pontos somados.** A equipe soma os pontos dos dois carros; num sistema redundante, uma instância de pé atende o serviço inteiro.
9. **Peça e cópia.** Uma peça física existe numa unidade; objetos, discos replicados e caches existem em quantas cópias você quiser, e a cópia digital se refaz em segundos.
10. **Número de carro e faixa CIDR.** O número identifica um carro; um bloco CIDR é uma faixa de endereços, e a sobreposição pode ser parcial.
11. **O circuito não se escolhe.** O calendário decide onde a equipe corre e ela nunca opera em dois circuitos no mesmo domingo; na nuvem, você escolhe o provedor, pode usar os dois ao mesmo tempo e a saída tem custo real (lock-in).
12. **Outposts e Arc.** Nenhum circuito instala garagem na fábrica de uma equipe; o paralelo só separa hardware do provedor de gestão do provedor.
13. **Teto de gastos e FinOps.** O teto é imposto de fora, com punição; o FinOps é prática interna.
14. **Crachá e FIDO2.** A foto do crachá é conferida por uma pessoa; a FIDO2 é verificação criptográfica vinculada ao site verdadeiro.
15. **Equipes reais.** Nenhum provedor foi associado a uma equipe. A Mercedes aparece como exemplo de redundância (dois carros, um pontuou) e a Ferrari como exemplo de falha correlacionada (a mesma aposta de pneus nos dois carros) e de erro de operação do lado do cliente (Bahrein 2018); nenhuma das duas representa AWS ou Azure.

## Fontes dos dados de F1 (consultadas em 2026-10-06)

O backend do pitstop estava fora do ar e não houve nova consulta para este guia: os dados abaixo foram reaproveitados do guia de Cultura DevOps do mesmo módulo, verificados em 2026-10-06.

Classificação do campeonato após a rodada 16 de 23 (GP do Bahrein disputado em Sepang, em 4 de outubro de 2026), registrada aqui só como referência; nenhuma etapa do guia depende dela. Pilotos: 1. Kimi Antonelli (Mercedes), 320 pontos; 2. George Russell (Mercedes), 236; 3. Lewis Hamilton (Ferrari), 214; 4. Charles Leclerc (Ferrari), 191; 5. Lando Norris (McLaren), 188; 6. Max Verstappen (Red Bull), 188; 7. Oscar Piastri (McLaren), 128; 8. Isack Hadjar (Red Bull), 96; 9. Liam Lawson (Racing Bulls), 65; 10. Pierre Gasly (Alpine), 41.

- Classificação de pilotos após a rodada 16 de 23: [RacingNews365](https://racingnews365.com/2026-f1-championship-standings-after-bahrain-grand-prix-in-malaysia) e [Motorsport Week](https://www.motorsportweek.com/2026/10/04/f1-2026-world-championship-standings-after-the-bahrain-gp-in-malaysia/).
- Resultado e relato do GP do Bahrein em Sepang (4 de outubro de 2026), classificação de construtores: [Formula1.com](https://www.formula1.com/en/latest/article/verstappen-wins-rain-hit-bahrain-gp-in-malaysia-over-antonelli-as-russell-retires-late-on.6qfpIHPch8mIVj2YgfHdCp) e [RaceFans](https://www.racefans.net/2026/10/04/2026-bahrain-grand-prix-in-malaysia-race-result-and-championship-points/).
- GP de Singapura 2026 (9 a 11 de outubro, primeiro fim de semana sprint em Marina Bay): [RacingNews365](https://racingnews365.com/f1/races/singapore-gp) e [F1 Wiki](https://f1.fandom.com/wiki/2026_Singapore_Grand_Prix).
- Fato histórico, GP do Bahrein de 2018 (liberação insegura da Ferrari, mecânico ferido, multa de 50 mil euros): [Formula1.com](https://www.formula1.com/en/latest/article/ferrari-handed-big-fine-for-raikkonen-unsafe-release.40Rd1aQwsgKSomC2UqqQwc) e [RACER](https://racer.com/2018/04/08/ferrari-mechanic-breaks-leg-in-pit-stop-mishap).
- Fatos gerais de regulamento e operação usados sem fonte nova (dois carros por equipe, 11 equipes no grid de 2026, teto de gastos desde 2021, números permanentes de pilotos, limite de uso do túnel de vento, cota de componentes de unidade de potência, frete marítimo para etapas fora da Europa, pista de Fiorano da Ferrari) vêm do conhecimento do piloto e foram mantidos sem números específicos.

## Apêndice: quadro de-para completo

Todas as analogias usadas no documento, na ordem em que aparecem. As centrais estão no quadro do início. AWS e Azure entram sempre da mesma forma, como circuitos; nenhum provedor é associado a uma equipe real.

| Arquitetura cloud | Fórmula 1 |
|---|---|
| TI tradicional com capacidade comprada para o pico | A estrutura própria comprada para o pior fim de semana do ano e paga o ano inteiro |
| Provedor de nuvem (AWS ou Azure) | O circuito: a infraestrutura que a equipe usa para operar; a mesma equipe opera nos dois |
| CapEx | Construir o próprio túnel de vento |
| OpEx | Pagar por hora de túnel numa instalação de terceiros |
| Escala vertical | Pedir mais potência ao mesmo carro, até o teto |
| Escala horizontal | Colocar mais carros na pista (não existe na F1) |
| Elasticidade | A frota de carros que cresce e encolhe sozinha com a prova (não existe na F1) |
| Nuvem pública (*multi-tenant*) | O circuito compartilhado pelas 11 equipes, cada uma na sua garagem |
| Nuvem privada | A fábrica da equipe |
| Nuvem híbrida | A garagem no circuito ligada à sala de operações remota na fábrica |
| VPN site a site | O túnel cifrado pela Internet entre garagem e fábrica |
| Direct Connect e ExpressRoute | A linha dedicada contratada entre garagem e fábrica |
| AWS Outposts e Azure Stack | O rack do circuito, operado por ele, instalado dentro da sua fábrica |
| Azure Arc | O painel do circuito que enxerga e gerencia os seus equipamentos onde estiverem |
| Nomes de região diferentes (`sa-east-1`, `brazilsouth`) | Duas sedes na mesma cidade, uma de cada circuito, cada uma com o seu sistema de nomes |
| On-premises | Ter a própria pista e instalações, como Fiorano |
| IaaS | Garagem vazia com energia, rede e carro-padrão; do SO para cima é seu |
| PaaS | Garagem equipada e mantida pelo circuito; você traz o acerto e a estratégia |
| SaaS | Serviço pronto do circuito, como a cronometragem oficial |
| FaaS | O pit stop: disparado pela chamada do box, curto, com tempo-limite e sem memória |
| Linha "Dados" da matriz | A telemetria e o set-up da equipe, sempre dela |
| Estado fora da função | O plano de pneus no sistema do estrategista, não na cabeça da crew |
| Variável global em FaaS | O mecânico contando paradas de cabeça |
| Pico disparado por evento | O safety car que abre a janela de box para muitos carros de uma vez |
| *Cold start* | O box chamado em cima da hora, com a crew ainda saindo da garagem |
| Tamanho de instância (`t3.micro`, `Standard_B1s`) | A ficha do carro-padrão: processadores e memória |
| VM (instância) | Um carro: a unidade de capacidade que vai para a pista (na IaaS, o carro-padrão) |
| Recuperação de desastres em outra região | O GP do Bahrein disputado em Sepang: o evento muda de sede |
| Região | A sede geográfica do circuito |
| Zona de disponibilidade | Pavilhão independente na sede, com energia, refrigeração e rede próprias |
| Data center | Cada prédio de um pavilhão |
| Ponto de presença | Depósito avançado de material perto da próxima etapa |
| Recurso zonal e regional | Material num pavilhão só ou espelhado em vários |
| Rótulo da zona e *zone ID* | O nome que você dá ao pavilhão e o número oficial dele, igual para todos |
| Latência (RTT) | O tempo de ida e volta entre o carro e quem decide |
| Balanceador de carga | O controle de entrada do pit lane, encaminhando cada pedido a uma VM livre e tirando de rota a que falhou |
| Camada 4 e camada 7 | Decidir pelo envelope ou abrir a mensagem e decidir pelo conteúdo |
| Auto-scaling | A regra que coloca ou tira carros conforme a carga (não existe na F1) |
| SLI | O número na telemetria |
| SLO e orçamento de erros | A meta interna com folga, como usar menos componentes do que a cota permite |
| SLA | O limite formal com consequência, como a cota de componentes que custa posições no grid |
| Circuit Breaker aberto | O sistema com falhas em sequência desligado; o carro segue mais lento |
| Circuit Breaker meio-aberto | Uma única tentativa de reativação pedida pelo engenheiro |
| Retry | Acionar o mesmo comando a cada curva esperando que funcione |
| Falha em cascata | O sistema forçado que danifica outros componentes e para o carro |
| Edge computing | O carro processando os sensores a bordo e transmitindo só parte ao vivo |
| Componentes em série | A cadeia de sistemas de um carro: se um falha, o carro para |
| Componentes em paralelo | Os dois carros da equipe: se um abandona, o outro pontua |
| Falha correlacionada | A mesma aposta de pneus nos dois carros da Ferrari em Sepang |
| Comparação de provedores | Comparar as instalações de dois circuitos, nunca torcer por um |
| Os seis critérios da metodologia | O que a equipe avalia nas instalações de onde vai operar |
| Vendor lock-in | Equipamento de garagem fabricado para encaixar só nas instalações de um circuito |
| Portabilidade | Usar encaixes padrão, que servem em qualquer circuito |
| Multicloud | Operar em dois circuitos no mesmo minuto (impossível na F1) |
| Matriz ponderada | O peso de cada critério no set-up de um circuito, como carga aerodinâmica em Singapura |
| Armazenamento de objeto | O depósito de peças etiquetadas: para mudar, fabrica-se nova revisão |
| Armazenamento de bloco | A memória de bordo presa a um carro e ao pavilhão onde ele está |
| Armazenamento de arquivo | A pasta compartilhada da garagem |
| VPC e VNet | A área reservada da equipe no circuito |
| Sub-redes pública, privada e protegida | A frente voltada para o pit lane, o escritório nos fundos e a sala de dados sem saída |
| Gateways e roteamento | Os portões e o mapa de por onde cada um sai |
| NAT | O assessor de imprensa: a equipe fala para fora, ninguém de fora entra por ele |
| Peering | O cabo entre duas áreas da mesma equipe |
| Sub-rede zonal (AWS) e regional (Azure) | Setor preso a um pavilhão ou desenhado para a sede inteira |
| Banco relacional (ACID) | A classificação oficial: a volta conta ou não conta |
| NoSQL com consistência eventual | A tela de tempos ao vivo, às vezes um instante atrás da pista |
| Data warehouse | O arquivo de temporadas inteiras |
| Banco vetorial | Procurar voltas parecidas pela forma, não por um campo exato |
| Algoritmos de balanceamento | Critérios do controle de entrada: alternar, fixar, menos ocupado, mais rápido, pela telemetria |
| CDN | A logística das etapas longe da Europa, com material enviado antes |
| Cache hit e cache miss | A peça que já está no local ou a que vem da fábrica de avião |
| Pilares do Well-Architected | O compromisso de projeto do carro: carga, velocidade, confiabilidade, custo |
| Sobreposição de CIDR | Dois carros com o mesmo número |
| Cadastro central de CIDRs | O registro de números permanentes da FIA |
| Erro de configuração do cliente | A liberação insegura da Ferrari no Bahrein em 2018 |
| Responsabilidade compartilhada | O circuito cuida da pista; a equipe cuida do carro, da garagem e de quem entra |
| IAM | O credenciamento do paddock |
| Roles e políticas | Os tipos de credencial e a tabela de qual tipo entra onde |
| Federação de identidade | Aceitar a identidade emitida por outro sistema confiável |
| Menor privilégio | O convidado da hospitalidade sem acesso ao pit lane |
| Entra ID e RBAC | Emissão da credencial e tabela de acessos em balcões separados |
| MFA | Crachá com foto conferida na entrada |
| Security Group (stateful) | O segurança ao lado do carro, que viu você chegar |
| NACL (stateless) | A catraca que confere a lista na entrada e na saída |
| Prioridade numérica do NSG | A lista de acesso em que a primeira linha que bate decide |
| DEK e KEK | A chave de cada caminhão e o segredo do cofre onde as chaves ficam |
| Rotação da KEK | Trocar o segredo do cofre sem trocar nenhum cadeado |
| FinOps | O teto de gastos: engenharia e finanças decidindo juntas |
| Recursos ligados sem uso | Equipamento ligado de madrugada sem ninguém trabalhando |
| Discos órfãos | Peças fabricadas que nunca foram montadas |
| Spot | Janela barata que pode ser cancelada a qualquer momento |
| Right-sizing | Levar a ferramenta pequena quando ela dá conta |
| Tags | A etiqueta de peça com revisão, projeto e centro de custo |
| Replicação em três regiões | Três jogos completos de sobressalentes em cada etapa |
| Revisão Well-Architected | O debrief do projeto: o carro está equilibrado no que importa? |

---

## Notas do professor

**Precisões e correções ao material bruto:**

Nestas notas, "Aula 0X" é a aula do material original e "Etapa 0X" é a etapa deste guia. A numeração das duas coincide, mas alguns assuntos do material aparecem em outra etapa do guia ou ficaram de fora; cada nota indica onde.

1. **Matriz de responsabilidade: dados no SaaS.** A Tabela 1 da Aula 01 do material lista, para o SaaS, o provedor responsável por "toda a pilha, incluindo dados", e a responsabilidade do cliente como "apenas o uso do software". A matriz da Aula 02 e a Aula 06 do material dizem que **os dados são do cliente em todos os modelos**. Prevalece a segunda, que é a versão usada na matriz da Etapa 02 deste guia: o provedor opera o software e a infraestrutura, mas quem decide o que é guardado e quem acessa é o cliente.
2. **Sustentabilidade como pilar.** A Aula 06 do material chama a Sustentabilidade de "sexto pilar, tendência para 2025" (no guia, os pilares estão na Etapa 05). Ela foi adicionada ao AWS Well-Architected Framework em 2021 e não é uma tendência de 2025. Além disso, o framework da Azure é descrito com cinco pilares; o "seis pilares" vale para a AWS.
3. **Sigla WAF duplicada.** O material usa WAF para *Well-Architected Framework* e para *Web Application Firewall* (inclusive na mesma etapa). Neste guia, escrevo "Well-Architected" por extenso e reservo WAF para o firewall web.
4. **Escopo de VPC e sub-rede (Google, AWS e Azure).** A Aula 05 do material diz que a VPC é global e as sub-redes são regionais; isso vale para o **Google Cloud**. A Aula 06 do material diz que "sub-redes são vinculadas a AZs", o que vale para a **AWS**. Na **Azure**, a VNet é regional e a sub-rede não é zonal. O material mistura os provedores sem avisar; a Etapa 05 desta versão separa os três comportamentos.
5. **"Cada região tem três ou mais AZs".** Afirmação do Google Cloud. Em AWS e Azure o número de zonas varia entre regiões e, na Azure, há regiões sem zonas.
6. **Criptografia VM a VM dentro da VPC e AES-256 por padrão.** O material descreve o Google Cloud (TLS entre VMs na VPC, AES-256 em repouso por padrão). Não generalize essas afirmações para AWS e Azure. Os serviços de armazenamento de objetos dos dois oferecem, em 2026, criptografia em repouso por padrão, mas o comportamento é por serviço; confirme na documentação de cada um.
7. **Números de mercado e dispersão de datas.** As participações de mercado (33%, 23%, 10%) têm referências diferentes (início de 2023, fim de 2022, 1º trimestre de 2022 e 2023). O "64%" da Aula 02 do material (citado na Etapa 04 deste guia) é do 4º trimestre de 2024. O tamanho do mercado de computação de borda aparece como "mais de US$ 111 bilhões em 2025" (Aula 03) e "US$ 250 bilhões até 2025" (Aula 06), números que ficaram fora deste guia: no material, os dois convivem sem explicação (provavelmente fontes e definições diferentes). A frase "80% do orçamento de TI dedicado à nuvem até 2024" (Aula 04, também fora do guia) é uma expectativa do material, não um fato verificado. Todas as projeções "até 2025" já venceram em 2026; use-as como retrato do período.
8. **"Cada nove custa exponencialmente mais".** Heurística qualitativa do material, não uma fórmula. A conta de 5,26 minutos para 99,999% **foi verificada** (365 x 24 x 60 x 0,00001 = 5,256 minutos).
9. **Renomeações.** O material (jun/2025) usa nomes que podem ter mudado: Azure AD virou Microsoft Entra ID (o material já registra); o serviço de Redis da Azure e o ramo HCI do Azure Stack passam por transições de nome ou de produto; o Azure CDN clássico passa por consolidação com o Front Door. Confirme sempre na documentação oficial.
10. **Retry e Circuit Breaker.** O material diz que "podem ser combinados, mas o retry deve respeitar as exceções do Circuit Breaker". Acrescento o motivo operacional (explicação do professor): se o retry ignora o disjuntor, ele derruba o benefício do padrão e reintroduz a cascata.

**Limites das práticas (onde a analogia termina):**

- Os cálculos de custo usam **preços e descontos fictícios**. Servem para ver a mecânica de cada alavanca, não para estimar a sua fatura. A calculadora oficial de cada provedor é a fonte de verdade.
- A matriz de decisão da Etapa 04 usa notas fictícias de "Opção 1" e "Opção 2". Não é avaliação de provedor algum.
- O Circuit Breaker do guia é uma maquete de poucas linhas: não tem janela de tempo nem métricas, e o estado meio-aberto é simplificado (depois da espera, deixa uma tentativa passar). Bibliotecas reais (Resilience4j no Java, Polly no .NET) cobrem isso.
- A criptografia de envelope com `openssl` é uma demonstração didática (CBC com chave derivada de senha). Produção usa KMS ou Key Vault, com modos autenticados como GCM.
- Os comandos `aws` e `az` são de **leitura**. As saídas mostradas são **ilustrativas**: IDs, listas de regiões e mapeamentos de zona variam por conta e por época. Se um parâmetro for rejeitado pela sua versão da CLI, use `--help` no comando.
- O Bicep e o CloudFormation foram só **validados ou compilados**; criar a infraestrutura de fato gera recursos e custo, e está fora do escopo.
- O pareamento AWS x Azure é um **mapa de orientação**, e não uma tabela de tradução. Onde a coluna "O que muda de verdade" aponta diferença, ela importa: estude a documentação do serviço antes de migrar ou projetar com base em equivalência.

---

## Referências do material

- Material original da disciplina "Arquitetura Cloud" (6 aulas, FIAP POSTECH), com referências consultadas em junho de 2025: AWS (Cloud Adoption Framework, Well-Architected, Network Firewall, Client VPN, load balancing), Microsoft Azure e Microsoft Learn (nuvens públicas, privadas e híbridas; Azure Well-Architected Framework; padrão Circuit Breaker; Introduction to Identity and Access Management), Google Cloud (vantagens da computação em nuvem, adoção, híbrida, VPC, load balancing, bancos de dados, NoSQL e armazenamento), Atlassian, Cloudflare, FinOps Foundation, Check Point, Akamai, Illumio, Canalys, Gartner (por meio de links citados nas aulas) e outros listados nos PDFs.
- O pareamento com a Azure e os exemplos de cálculo local são acréscimos do professor, sem fonte no material, e devem ser confirmados na documentação oficial vigente de cada provedor.

---

*E assim encerramos a transmissão, direto do muro dos boxes do GP da Arquitetura Cloud: seis setores, dois circuitos e nenhum recurso esquecido ligado gerando conta. Da cabine, é tudo. A próxima parada do calendário é Singapura, de 9 a 11 de outubro de 2026, pela primeira vez com formato sprint; até lá, lembre: a garagem é alugada, mas os dados e as credenciais são sempre seus. FIM DE TRANSMISSÃO.*
