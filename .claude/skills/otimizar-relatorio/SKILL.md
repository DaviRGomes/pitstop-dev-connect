---
name: otimizar-relatorio
description: Pipeline de otimização de relatório de estudo do pitstop. O professor de software melhora a didática, o piloto de F1 tematiza com analogias reais, o comentarista de F1 dá o acabamento narrativo e o aluno valida a compreensão. Use quando o usuário enviar um relatório de estudo bruto para transformar em guia imersivo de F1.
---

# /otimizar-relatorio: pipeline de relatório de estudo

Transforma um relatório de estudo bruto num guia didático imersivo em Fórmula 1, passando por 4 personas (agentes deste projeto): `professor-software` → `piloto-f1` → `comentarista-f1` → `aluno-software`.

## Entrada

O argumento é o caminho do relatório bruto (markdown/texto). Se o usuário colou o texto na conversa em vez de dar um arquivo, salve-o primeiro em `relatorios/<slug-do-tema>/00-bruto.md` (crie o slug a partir do tema, ex.: `docker`, `ci-cd`). Se não houver argumento nem texto, pergunte qual arquivo usar.

## Pasta de trabalho

Crie `relatorios/<slug>/` na raiz do projeto. Todos os estágios ficam salvos nela para o usuário auditar cada persona:

- `00-bruto.md`: cópia do relatório original
- `01-professor.md`: versão didática
- `02-piloto.md`: versão com analogias de F1
- `03-comentarista.md`: versão com narrativa de transmissão
- `04-parecer-aluno.md`: parecer de validação
- `final.md`: versão aprovada

## Regra de escrita do projeto: proibido travessão

Todo texto que este pipeline produz vai parar no site, e o site não usa travessão (—) nem meia-risca (–) na prosa. É o tique mais reconhecível de texto gerado por IA, e o conteúdo já teve que ser limpo de 382 deles uma vez.

Os quatro agentes já carregam essa regra no próprio prompt, e o `aluno-software` a fiscaliza com um gate automático. Mesmo assim, **reforce a regra no prompt de cada estágio** que você disparar, e antes de copiar qualquer coisa para `final.md` rode a verificação você mesmo:

```sh
grep -nP "—|–" relatorios/<slug>/03-comentarista.md
```

As únicas exceções permitidas são intervalos numéricos ("aulas 1–8") e travessão de atribuição de citação ("— Ayrton Senna"). Qualquer outra ocorrência volta para a persona que escreveu o trecho antes da promoção para `final.md`.

## Pipeline (agentes em sequência, cada um depende do anterior)

Execute cada estágio com a tool Agent, usando o `subagent_type` indicado. Passe sempre os caminhos absolutos de entrada e saída no prompt, e sempre a regra do travessão.

1. **`professor-software`**: "Otimize didaticamente o relatório em `<pasta>/00-bruto.md` e salve em `<pasta>/01-professor.md`. Não use travessão (—) na prosa."
2. **`piloto-f1`**: "Tematize com F1 o relatório em `<pasta>/01-professor.md` e salve em `<pasta>/02-piloto.md`. Não use travessão (—) na prosa, nem no quadro de-para." Guarde o quadro de-para de analogias que ele devolver.
3. **`comentarista-f1`**: "Adicione a camada narrativa ao relatório em `<pasta>/02-piloto.md` e salve em `<pasta>/03-comentarista.md`. Não use travessão (—) na prosa. Quadro de analogias do piloto: <colar quadro>."
4. **`aluno-software`**: "Leia `<pasta>/03-comentarista.md` e salve o parecer em `<pasta>/04-parecer-aluno.md`. Inclua o gate de travessões."

## Ciclo de revisão

- **APROVADO** (e zero travessões): copie `03-comentarista.md` para `final.md`.
- **APROVADO COM RESSALVAS ou REPROVADO**: para cada conserto do parecer, reenvie ao agente responsável indicado (professor/piloto/comentarista) via SendMessage, porque o agente já tem contexto, pedindo para aplicar os consertos no arquivo do seu estágio; depois repasse os estágios seguintes nos arquivos afetados e rode o aluno de novo. **Máximo de 2 ciclos de revisão**; se ainda houver ressalvas após o 2º, copie a melhor versão para `final.md` e liste as ressalvas restantes para o usuário decidir.
- **Travessões são exceção ao limite de ciclos**: eles não são questão de gosto, são um defeito mecânico. Se sobrar algum depois do 2º ciclo, conserte você mesmo no `final.md` (troque por ponto final, vírgula, dois-pontos ou parênteses, conforme a frase pedir) e avise o usuário de quantos consertou.

## Relatório final ao usuário

Ao terminar, informe: caminho do `final.md`, veredito e nota do aluno, o quadro de-para das analogias, quantos ciclos de revisão foram necessários e a contagem final de travessões (deve ser zero). Sugira (sem executar) o próximo passo: converter o `final.md` para o formato `Lesson[]` num novo arquivo `src/data/<slug>.ts` (siga o modelo de `src/data/kubernetesbasico.ts`, que exporta `DE_PARA`, `ANALOGY_NOTES`, `LESSONS` e `PLATFORMS`) e criar a rota `src/routes/relatorios.<slug>.tsx` para publicar como página em `/relatorios/<slug>` do site.
