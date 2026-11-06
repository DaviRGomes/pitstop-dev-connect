---
name: otimizar-relatorio
description: Pipeline bilíngue de otimização de relatório de estudo do pitstop. Produz e valida versões equivalentes em PT-BR e inglês antes da publicação como guia de estudo técnico com uma lente geral de F1 no início.
---

# /otimizar-relatorio: pipeline de relatório de estudo

Transforma um relatório de estudo bruto num guia didático: o tema ensinado de forma técnica, etapa por etapa, com uma lente geral de Fórmula 1 no início. A versão PT-BR passa por `professor-software` → `piloto-f1` → `comentarista-f1` → `aluno-software`. Depois, `tradutor-en` cria a versão inglesa, `revisor-bilingue` verifica a equivalência e `ilustrador-tecnico` deixa o guia rico em imagens (pelo menos uma por etapa: primeiro busca com o Tavily imagens de licença aberta, só desenha quando não acha) antes da publicação.

## Entrada

O argumento é o caminho do relatório bruto (markdown/texto). Se o usuário colou o texto na conversa em vez de dar um arquivo, salve-o primeiro em `relatorios/<slug-do-tema>/00-bruto.md` (crie o slug a partir do tema, ex.: `docker`, `ci-cd`). Se não houver argumento nem texto, pergunte qual arquivo usar.

## Pasta de trabalho

Crie `relatorios/<slug>/` na raiz do projeto. Todos os estágios ficam salvos nela para o usuário auditar cada persona:

- `00-bruto.md`: cópia do relatório original
- `01-professor.md`: versão didática
- `02-piloto.md`: versão com analogias de F1
- `03-comentarista.md`: versão com abertura explicativa e tom calmo revisado
- `04-parecer-aluno.md`: parecer de validação
- `final.md`: versão PT-BR aprovada
- `05-tradutor-en.md`: tradução inglesa candidata
- `06-parecer-bilingue.md`: parecer de paridade entre os idiomas
- `final.en.md`: versão inglesa aprovada
- `public/guides/<guia>/`: diagramas da etapa de imagens (`.svg` PT e `.en.svg` EN) e `CREDITS.md`

## Formato do projeto: lente de F1 geral no início, etapas só técnicas

O usuário quer que o guia **ensine o tema de forma técnica de verdade** e que a F1 apareça **uma única vez, como lente geral no início**: uma comparação do sistema inteiro com uma equipe de F1, que permite a quem não entende a parte técnica enxergar o tema por outro ângulo. As etapas não repetem a analogia: nada de F1 dentro delas nem bloco de comparação no fim de cada uma (esse formato foi testado e descartado em 2026-10).

Estrutura de todo relatório:

1. **Abertura**: parágrafo calmo com o que o guia cobre, o que será estudado (na ordem das etapas) e o aviso de que a seção seguinte apresenta a lente de F1.
2. **`## A lente de F1 deste guia`** (piloto): o mundo da F1 usado no guia (por exemplo, a equipe no fim de semana de GP: mureta, garagens, carros, rádio), explicado para quem nunca acompanhou F1; a ponte com o tema; o glossário `| Termo técnico | Em palavras simples |`, escrito pelo professor com ideias do dia a dia e sem F1 nem jargão (o usuário pediu que esse quadro não use F1); e a subseção `### Onde a comparação para`, com um item `- **Etapa NN:** ...` por etapa.
3. **Cada etapa**: só técnica (problema, conceito, conceitos-chave, exemplo comentado, comandos, mão na massa, dica, anota aí), sem F1.
4. **Checklist final**.

O guia de Kubernetes básico já usa esse formato no site (`src/components/guide/LensKit.tsx`): depois de mudar `relatorios/kubernetes-basico/final.md` ou `final.en.md`, rode `python3 scripts/build-lens-guide.py basico` para regenerar `src/data/kubernetesbasico.ts` e `.en.ts`, e depois `npm run content:check`. O Kubernetes avançado (`avancado`) e Servidores Web (`servidores-web`) também já usam esse formato; para converter outro guia, acrescente uma entrada em `GUIDES` no `scripts/build-lens-guide.py` (o conversor `scripts/md-to-lens-guide.py` exige os cabeçalhos fixos deste formato).

## Imagens técnicas: guia rico em imagens

O usuário quer guias **ricos em imagens**: toda etapa tem pelo menos um diagrama técnico (nunca fotos de F1). Isso é uma etapa fixa do pipeline, feita pelo `ilustrador-tecnico` depois da aprovação bilíngue (ver "Pipeline de imagens" abaixo); não é um acabamento opcional para depois.

- **Primeiro buscar, depois desenhar** (pedido do usuário): para cada etapa o agente busca na internet com o Tavily (`include_images`) imagens de **licença aberta**: Wikimedia Commons, kubernetes.io (CC BY 4.0), docs.docker.com (Apache 2.0), docs do Azure e do Google Cloud (CC BY 4.0). Confirma a licença na página de origem antes de baixar e credita fonte, autor e licença. Com licença aberta verificada, pode baixar sem pedir confirmação.
- **Nunca** imagem sem licença clara: Medium, blogs, sites de fornecedores e marketing, bancos de imagens, Google Imagens.
- **Só quando a busca não acha nada adequado**, o agente desenha a partir do laboratório da etapa com `scripts/svg-diagram.py` (gera `.svg` PT e `.en.svg` EN no estilo visual dos guias) e confere com `node scripts/svg-preview.mjs`, que renderiza PNG para ver texto cortado e sobreposição.
- Os arquivos ficam em `public/guides/<guia>/` com o crédito de origem em `CREDITS.md`. No markdown, a figura fica no fim de "O conceito": `![texto alternativo](/guides/<guia>/arquivo.svg "legenda | Diagrama: feito para este guia")` (no inglês, `.en.svg` e `Diagram: made for this guide`); linhas de imagem seguidas viram uma sequência de quadros.

## Regra de tom do projeto: guia de estudo, não transmissão

O usuário pediu que os relatórios tenham **tom calmo de guia de estudo**, com a F1 como lente conceitual. A narração de transmissão já precisou ser removida à mão de todos os relatórios uma vez. Vale para todas as personas e também na conversão para `src/data` e para as rotas:

- **Abertura (topo da página)**: um parágrafo explicativo dizendo o que o guia cobre, o que será estudado (na ordem das etapas) e qual é a lente de F1 do tema. Nada de "Boa tarde a todos", "Está no ar o GP de...", "Farol apagado, o piloto assume", "Com vocês". O selo acima do título é "guia de estudo · <tema> em N etapas", não "transmissão ao vivo".
- **Etapas**: sem chamada de entrada nem de saída ("Apagaram-se as luzes!", "Setor 2 no verde. Etapa 03 na sequência"). O tipo `Lesson` não tem mais `narration` nem `outro`; não os recrie.
- **Sem euforia em nenhum trecho**, inclusive dentro do bloco de F1: a comparação é calma e informativa, sem exclamações, superlativos, suspense ou frase de efeito no fim do parágrafo.
- **Analogias conceituais**: nunca corridas, pilotos, equipes, circuitos ou datas reais. Descreva a cena genérica que ensina a mesma coisa ("um carro pode largar na pole e terminar em décimo quinto", "a equipe monta a peça nova num carro só").
- **Sem euforia**: frases declarativas, sem exclamações em série nem superlativos de comentarista.
- **Variedade de formato**: o usuário reclamou de relatórios "muito padronizados". Antes de reaproveitar o `LessonSection` padrão, considere um formato próprio para o tema (o guia de Escalabilidade usa `ScaleLessonSection`: pergunta, sintoma, analogias, tabela ganha × paga e laboratório).

Verificação antes de promover para `final.md` e `final.en.md`:

```sh
grep -niE "boa tarde|good afternoon|farol|lights out|apagaram|no verde|is green|bandeir|checkered|não pisca|está no ar|com vocês|transmissão ao vivo|live broadcast" relatorios/<slug>/final*.md
```

Qualquer ocorrência volta para o `comentarista-f1` (tom) ou para o `piloto-f1` (analogia com corrida real).

## Regra de escrita do projeto: proibido travessão

Todo texto que este pipeline produz vai parar no site, e o site não usa travessão (—) nem meia-risca (–) na prosa. É o tique mais reconhecível de texto gerado por IA, e o conteúdo já teve que ser limpo de 382 deles uma vez.

Os quatro agentes já carregam essa regra no próprio prompt, e o `aluno-software` a fiscaliza com um gate automático. Mesmo assim, **reforce a regra no prompt de cada estágio** que você disparar, e antes de copiar qualquer coisa para `final.md` rode a verificação você mesmo:

```sh
grep -nP "—|–" relatorios/<slug>/03-comentarista.md
```

As únicas exceções permitidas são intervalos numéricos ("aulas 1–8") e travessão de atribuição de citação ("— Ayrton Senna"). Qualquer outra ocorrência volta para a persona que escreveu o trecho antes da promoção para `final.md`.

## Custo de tokens: modelo e esforço por agente

Os relatórios têm de 30 a 50 mil tokens, então o que mais pesa é reescrever o arquivo inteiro e usar Opus onde não precisa. A divisão abaixo fica no frontmatter de cada agente; não passe `model` nem `effort` no Agent, exceto se o usuário pedir.

| Agente | Modelo | Esforço | Por quê |
|---|---|---|---|
| `professor-software` | opus | medium | cria todo o conteúdo didático: é onde a qualidade se decide |
| `piloto-f1` | opus | medium | escreve só a lente, mas é a parte criativa da analogia |
| `comentarista-f1` | sonnet | low | ajuste de tom com regras explícitas, guiado por grep |
| `aluno-software` | sonnet | medium | leitura de aluno e gates mecânicos |
| `tradutor-en` | sonnet | low | tradução fiel, sem criação |
| `revisor-bilingue` | sonnet | low | o script `scripts/check-bilingual-parity.py` faz as contagens |
| `ilustrador-tecnico` | sonnet | medium | busca e licença pelo Tavily; o gerador `scripts/svg-diagram.py` cuida do estilo quando precisa desenhar |

- **Piloto e comentarista editam, não reescrevem**: copiam a entrada para a saída (`cp`) e alteram só os trechos com a ferramenta Edit. Nos ciclos de revisão vale o mesmo: cada conserto é um Edit no arquivo do estágio.
- **Orquestração**: esta skill só repassa caminhos e roda grep. Rodá-la numa sessão Sonnet basta; não leia os relatórios inteiros na sessão principal.
- **Sem paralelismo**: cada estágio depende do anterior. Rodar agentes em paralelo só gastaria mais tokens com contexto repetido.

## Pipeline PT-BR (agentes em sequência, cada um depende do anterior)

Execute cada estágio com a tool Agent, usando o `subagent_type` indicado. Passe sempre os caminhos absolutos de entrada e saída no prompt, e sempre a regra do travessão.

1. **`professor-software`**: "Otimize didaticamente o relatório em `<pasta>/00-bruto.md` e salve em `<pasta>/01-professor.md`. Explicação técnica completa, sem F1 e sem euforia, com a seção `## Os termos em palavras simples` (glossário do dia a dia) depois da abertura. Não use travessão (—) na prosa."
2. **`piloto-f1`**: "Copie `<pasta>/01-professor.md` para `<pasta>/02-piloto.md` e edite a cópia (Edit, sem reescrever o arquivo) para incluir a lente de F1: só a seção `## A lente de F1 deste guia` depois da abertura, com o glossário em palavras simples do professor movido para dentro dela (sem F1) e `### Onde a comparação para` (um item por etapa). Não coloque F1 nas etapas. Tom calmo, sem narração nem euforia, sem corridas, pilotos, equipes ou datas reais. Não use travessão (—) na prosa, nem nas tabelas." Guarde o quadro de correspondência que ele devolver.
3. **`comentarista-f1`**: "Copie `<pasta>/02-piloto.md` para `<pasta>/03-comentarista.md` e, editando só os trechos necessários na cópia (Edit, sem reescrever o arquivo), escreva a abertura explicativa e revise o tom (guia de estudo calmo, sem narração de transmissão nem euforia, sem corridas ou pilotos reais, F1 só na lente geral do início, nenhuma F1 nas etapas). Não use travessão (—) na prosa. Quadro de analogias do piloto: <colar quadro>."
4. **`aluno-software`**: "Leia `<pasta>/03-comentarista.md` e salve o parecer em `<pasta>/04-parecer-aluno.md`. Inclua o gate de travessões."

## Ciclo de revisão

- **APROVADO** (zero travessões e zero ocorrências de tom de transmissão): copie `03-comentarista.md` para `final.md`.
- **APROVADO COM RESSALVAS ou REPROVADO**: para cada conserto do parecer, reenvie ao agente responsável indicado (professor/piloto/comentarista) via SendMessage, porque o agente já tem contexto, pedindo para aplicar os consertos no arquivo do seu estágio; depois repasse os estágios seguintes nos arquivos afetados e rode o aluno de novo. **Máximo de 2 ciclos de revisão**; se ainda houver ressalvas após o 2º, copie a melhor versão para `final.md` e liste as ressalvas restantes para o usuário decidir.
- **Travessões são exceção ao limite de ciclos**: eles não são questão de gosto, são um defeito mecânico. Se sobrar algum depois do 2º ciclo, conserte você mesmo no `final.md` (troque por ponto final, vírgula, dois-pontos ou parênteses, conforme a frase pedir) e avise o usuário de quantos consertou.

## Pipeline em inglês

Só comece quando `final.md` estiver aprovado.

1. **`tradutor-en`**: traduza `final.md` para `<pasta>/05-tradutor-en.md`. Preserve integralmente estrutura, fatos, comandos, código e ordem dos exercícios. Não use travessão na prosa.
2. **`revisor-bilingue`**: compare `final.md` com `05-tradutor-en.md` e salve o parecer em `<pasta>/06-parecer-bilingue.md`. Comece por `python3 scripts/check-bilingual-parity.py <pasta>/final.md <pasta>/05-tradutor-en.md` e depois verifique, lendo, seções, exemplos, comandos, exercícios, fatos, termos técnicos e gate de travessões.
3. Se o parecer estiver **APROVADO**, copie `05-tradutor-en.md` para `final.en.md`.
4. Se houver ressalvas, devolva somente os itens apontados ao `tradutor-en`, rode novamente o revisor e limite a dois ciclos. Nunca publique uma versão parcial como se fosse equivalente.

## Pipeline de imagens

Só comece quando `final.md` e `final.en.md` estiverem aprovados.

1. **`ilustrador-tecnico`**: "Deixe o guia em `<pasta>` rico em imagens: pelo menos uma imagem técnica por etapa em `public/guides/<guia>/`. Busque primeiro com o Tavily imagens de licença aberta verificada; desenhe com `scripts/svg-diagram.py` só quando não achar nada adequado. Insira no fim de 'O conceito' em `final.md` e `final.en.md` e atualize `CREDITS.md`. Sem F1 nas imagens. Não use travessão (—) na prosa." 
2. Confira: `python3 scripts/check-bilingual-parity.py <pasta>/final.md <pasta>/final.en.md` (imagens n/n) e `grep -c "^!\[" <pasta>/final*.md` (pelo menos uma por etapa).
3. Abra você mesmo 2 ou 3 dos PNG de conferência antes de o agente apagá-los, ou gere de novo com `node scripts/svg-preview.mjs`, e devolva ao agente o que estiver ilegível.

Antes da aprovação final, troque referências relativas como "hoje" por formulações que não envelheçam. Os guias não usam fatos de temporada de F1 (corridas, pilotos, classificação): se algum aparecer, troque por uma cena conceitual. A tradução não pode alterar um fato isoladamente: qualquer correção entra nos dois idiomas.

## Relatório final ao usuário

Ao terminar, informe: caminhos de `final.md` e `final.en.md`, vereditos dos dois revisores, a tabela de imagens do ilustrador (origem e licença de cada uma), nota do aluno, quadro de-para das analogias, ciclos de revisão, contagem final de travessões e de ocorrências de tom de transmissão nos dois idiomas. Sugira (sem executar) converter as versões para `src/data/<slug>.ts` e `src/data/<slug>.en.ts`, preservando os mesmos IDs, exemplos, comandos e exercícios, e criar as rotas PT-BR e `/en` correspondentes.
