---
name: otimizar-relatorio
description: Pipeline bilíngue de otimização de relatório de estudo do pitstop. Produz e valida versões equivalentes em PT-BR e inglês antes da publicação como guia imersivo de F1.
---

# /otimizar-relatorio: pipeline de relatório de estudo

Transforma um relatório de estudo bruto num guia didático imersivo em Fórmula 1. A versão PT-BR passa por `professor-software` → `piloto-f1` → `comentarista-f1` → `aluno-software`. Depois, `tradutor-en` cria a versão inglesa e `revisor-bilingue` verifica a equivalência antes da publicação.

## Entrada

O argumento é o caminho do relatório bruto (markdown/texto). Se o usuário colou o texto na conversa em vez de dar um arquivo, salve-o primeiro em `relatorios/<slug-do-tema>/00-bruto.md` (crie o slug a partir do tema, ex.: `docker`, `ci-cd`). Se não houver argumento nem texto, pergunte qual arquivo usar.

## Pasta de trabalho

Crie `relatorios/<slug>/` na raiz do projeto. Todos os estágios ficam salvos nela para o usuário auditar cada persona:

- `00-bruto.md`: cópia do relatório original
- `01-professor.md`: versão didática
- `02-piloto.md`: versão com analogias de F1
- `03-comentarista.md`: versão com narrativa de transmissão
- `04-parecer-aluno.md`: parecer de validação
- `final.md`: versão PT-BR aprovada
- `05-tradutor-en.md`: tradução inglesa candidata
- `06-parecer-bilingue.md`: parecer de paridade entre os idiomas
- `final.en.md`: versão inglesa aprovada

## Regra de escrita do projeto: proibido travessão

Todo texto que este pipeline produz vai parar no site, e o site não usa travessão (—) nem meia-risca (–) na prosa. É o tique mais reconhecível de texto gerado por IA, e o conteúdo já teve que ser limpo de 382 deles uma vez.

Os quatro agentes já carregam essa regra no próprio prompt, e o `aluno-software` a fiscaliza com um gate automático. Mesmo assim, **reforce a regra no prompt de cada estágio** que você disparar, e antes de copiar qualquer coisa para `final.md` rode a verificação você mesmo:

```sh
grep -nP "—|–" relatorios/<slug>/03-comentarista.md
```

As únicas exceções permitidas são intervalos numéricos ("aulas 1–8") e travessão de atribuição de citação ("— Ayrton Senna"). Qualquer outra ocorrência volta para a persona que escreveu o trecho antes da promoção para `final.md`.

## Pipeline PT-BR (agentes em sequência, cada um depende do anterior)

Execute cada estágio com a tool Agent, usando o `subagent_type` indicado. Passe sempre os caminhos absolutos de entrada e saída no prompt, e sempre a regra do travessão.

1. **`professor-software`**: "Otimize didaticamente o relatório em `<pasta>/00-bruto.md` e salve em `<pasta>/01-professor.md`. Não use travessão (—) na prosa."
2. **`piloto-f1`**: "Tematize com F1 o relatório em `<pasta>/01-professor.md` e salve em `<pasta>/02-piloto.md`. Não use travessão (—) na prosa, nem no quadro de-para." Guarde o quadro de-para de analogias que ele devolver.
3. **`comentarista-f1`**: "Adicione a camada narrativa ao relatório em `<pasta>/02-piloto.md` e salve em `<pasta>/03-comentarista.md`. Não use travessão (—) na prosa. Quadro de analogias do piloto: <colar quadro>."
4. **`aluno-software`**: "Leia `<pasta>/03-comentarista.md` e salve o parecer em `<pasta>/04-parecer-aluno.md`. Inclua o gate de travessões."

## Ciclo de revisão

- **APROVADO** (e zero travessões): copie `03-comentarista.md` para `final.md`.
- **APROVADO COM RESSALVAS ou REPROVADO**: para cada conserto do parecer, reenvie ao agente responsável indicado (professor/piloto/comentarista) via SendMessage, porque o agente já tem contexto, pedindo para aplicar os consertos no arquivo do seu estágio; depois repasse os estágios seguintes nos arquivos afetados e rode o aluno de novo. **Máximo de 2 ciclos de revisão**; se ainda houver ressalvas após o 2º, copie a melhor versão para `final.md` e liste as ressalvas restantes para o usuário decidir.
- **Travessões são exceção ao limite de ciclos**: eles não são questão de gosto, são um defeito mecânico. Se sobrar algum depois do 2º ciclo, conserte você mesmo no `final.md` (troque por ponto final, vírgula, dois-pontos ou parênteses, conforme a frase pedir) e avise o usuário de quantos consertou.

## Pipeline em inglês

Só comece quando `final.md` estiver aprovado.

1. **`tradutor-en`**: traduza `final.md` para `<pasta>/05-tradutor-en.md`. Preserve integralmente estrutura, fatos, comandos, código e ordem dos exercícios. Não use travessão na prosa.
2. **`revisor-bilingue`**: compare `final.md` com `05-tradutor-en.md` e salve o parecer em `<pasta>/06-parecer-bilingue.md`. Verifique seções, exemplos, comandos, exercícios, fatos, termos técnicos e gate de travessões.
3. Se o parecer estiver **APROVADO**, copie `05-tradutor-en.md` para `final.en.md`.
4. Se houver ressalvas, devolva somente os itens apontados ao `tradutor-en`, rode novamente o revisor e limite a dois ciclos. Nunca publique uma versão parcial como se fosse equivalente.

Antes da aprovação final, substitua referências relativas como "hoje" pela data ou pelo nome exato do evento. Fatos atuais de F1 devem trazer a data de verificação e ser confirmados no backend do pitstop ou numa fonte oficial. A tradução não pode atualizar um fato isoladamente: qualquer correção factual deve entrar nos dois idiomas.

## Relatório final ao usuário

Ao terminar, informe: caminhos de `final.md` e `final.en.md`, vereditos dos dois revisores, nota do aluno, quadro de-para das analogias, ciclos de revisão e contagem final de travessões nos dois idiomas. Sugira (sem executar) converter as versões para `src/data/<slug>.ts` e `src/data/<slug>.en.ts`, preservando os mesmos IDs, exemplos, comandos e exercícios, e criar as rotas PT-BR e `/en` correspondentes.
