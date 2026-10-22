#!/usr/bin/env python3
"""Converte o final.md / final.en.md de um guia no formato "lente de F1 + etapas técnicas"
para JSON com INTRO, LENS, LESSONS, CHECKLIST e NOTES, consumido por src/data/<guia>.ts.

Uso: python3 scripts/md-to-lens-guide.py <final.md> <pt|en>  > saida.json

O markdown segue o formato do pipeline /otimizar-relatorio:
  ## A lente de F1 deste guia      (parágrafos + glossário em palavras simples, 2 colunas
                                    + ### Onde a comparação para, com uma lista)
  ## Etapa NN: Título              (### O problema, O conceito, Os conceitos-chave,
                                    Exemplo comentado: X, Comandos essenciais, Mão na massa,
                                    Dica, Anota aí; sem F1). Imagens no fim de O conceito:
                                    ![alt](/caminho.svg "legenda | crédito"), uma por
                                    parágrafo; linhas seguidas viram uma sequência de quadros.
  ## Checklist de autoavaliação
  ## Notas do professor...
"""

import json
import re
import sys

HEAD = {
    "pt": {
        "lens": "A lente de F1 deste guia",
        "stage": r"Etapa (\d+):\s*(.+)",
        "problem": "O problema",
        "concept": "O conceito",
        "points": "Os conceitos-chave",
        "example": "Exemplo comentado",
        "commands": "Comandos essenciais",
        "handsOn": "Mão na massa",
        "tip": "Dica",
        "takeaway": "Anota aí",
        "limits": "Onde a comparação para",
        "checklist": "Checklist de autoavaliação",
        "notes": "Notas do professor",
        "multiExamples": "Exemplos comentados",
        "output": "saída esperada",
    },
    "en": {
        "lens": "The F1 lens of this guide",
        "stage": r"Stage (\d+):\s*(.+)",
        "problem": "The problem",
        "concept": "The concept",
        "points": "Key concepts",
        "example": "Worked example",
        "commands": "Essential commands",
        "handsOn": "Hands-on",
        "tip": "Tip",
        "takeaway": "Takeaway",
        "limits": "Where the comparison stops",
        "checklist": "Self-assessment checklist",
        "notes": "Teacher's notes",
        "multiExamples": "Worked examples",
        "output": "expected output",
    },
}

COLORS = ["blue", "signal", "violet", "ember"]


def split_sections(lines, level):
    """Divide em [(título, linhas)] pelos headings do nível dado, ignorando código."""
    prefix = "#" * level + " "
    out, cur, title, in_code = [], [], None, False
    for line in lines:
        if line.startswith("```"):
            in_code = not in_code
        if not in_code and line.startswith(prefix):
            if title is not None or cur:
                out.append((title, cur))
            title, cur = line[len(prefix):].strip(), []
        else:
            cur.append(line)
    out.append((title, cur))
    return out


def blocks(lines):
    """Agrupa em blocos: ('p', texto), ('li', texto), ('ol', texto), ('code', lang, texto),
    ('table', linhas), ('quote', texto)."""
    out, i, para = [], 0, []

    def flush():
        if para:
            out.append(("p", " ".join(s.strip() for s in para)))
            para.clear()

    while i < len(lines):
        line = lines[i]
        s = line.strip()
        indented = line[:1] in (" ", "\t") and s
        if indented and out and out[-1][0] in ("li", "ol") and not para:
            # continuação de um item de lista: texto ou bloco de código recuado
            kind, txt = out[-1]
            if s.startswith("```"):
                lang = s[3:].strip() or "sh"
                pad = len(line) - len(line.lstrip())
                code = []
                i += 1
                while i < len(lines) and not lines[i].strip().startswith("```"):
                    code.append(lines[i][pad:])
                    i += 1
                txt += "\n```" + lang + "\n" + "\n".join(code) + "\n```\n"
            else:
                txt += ("" if txt.endswith("\n") else " ") + s
            out[-1] = (kind, txt)
            i += 1
            continue
        if s.startswith("```"):
            flush()
            lang = s[3:].strip() or "sh"
            code = []
            i += 1
            while i < len(lines) and not lines[i].strip().startswith("```"):
                code.append(lines[i])
                i += 1
            out.append(("code", lang, "\n".join(code)))
        elif not s or s == "---":
            flush()
        elif s.startswith("|"):
            flush()
            rows = []
            while i < len(lines) and lines[i].strip().startswith("|"):
                rows.append(lines[i].strip())
                i += 1
            out.append(("table", rows))
            continue
        elif s.startswith(">"):
            flush()
            q = []
            while i < len(lines) and lines[i].strip().startswith(">"):
                q.append(lines[i].strip().lstrip(">").strip())
                i += 1
            out.append(("quote", " ".join(x for x in q if x)))
            continue
        elif re.match(r"^- ", s):
            flush()
            out.append(("li", s[2:].strip()))
        elif re.match(r"^\d+\. ", s):
            flush()
            out.append(("ol", re.sub(r"^\d+\.\s+", "", s)))
        else:
            para.append(line)
        i += 1
    flush()
    return out


def table_rows(rows):
    cells = []
    for r in rows:
        if re.match(r"^\|[\s:|-]+\|$", r):
            continue
        cells.append([c.strip() for c in r.strip("|").split("|")])
    return cells[1:]  # sem cabeçalho


def paragraphs(bl):
    return [b[1] for b in bl if b[0] == "p"]


IMG = re.compile(r'!\[([^\]]*)\]\((\S+)(?:\s+"([^"]*)")?\)')


def figure_group(text):
    """Um parágrafo feito só de imagens vira um grupo de figuras (vários quadros = sequência).
    O título da imagem é "legenda | crédito"."""
    found = IMG.findall(text)
    if not found or IMG.sub("", text).strip():
        return None
    items, credit = [], ""
    for alt, src, title in found:
        caption, _, cr = (title or "").partition(" | ")
        items.append({"src": src, "alt": alt, "caption": caption.strip()})
        credit = cr.strip() or credit
    return {"items": items, "credit": credit}


def concept_items(bl, figures):
    items = []
    for b in bl:
        if b[0] == "p" and (fig := figure_group(b[1])):
            figures.append(fig)
        elif b[0] == "p":
            items.append(b[1])
        elif b[0] == "li":
            items.append("- " + b[1])
        elif b[0] == "ol":
            items.append("1. " + b[1])
        elif b[0] == "code":
            # bloco de código no meio da explicação: vira um item cercado por ``` e o
            # LensKit o renderiza como bloco de código
            items.append(f"```{b[1]}\n{b[2]}\n```")
    return items


FILE_LABEL = re.compile(
    r"(?:#|//)\s*(?:\S*/)?([\w.-]+\.(?:ya?ml|conf|py|json|toml|ini|sh|cfg|js|mjs|txt)"
    r"|Dockerfile[\w.-]*|\.dockerignore|\.gitignore|\.env[\w.-]*)\b"
)
FENCE_LABEL = {"dockerfile": "Dockerfile", "json": "JSON", "js": "JavaScript", "gitignore": ".dockerignore"}
OUTPUT_LEAD = re.compile(r"^(sa[ií]da esperada|expected output)[^.]*:$", re.I)


def with_prompts(code):
    """Bloco de shell escrito sem "$": marca as linhas de comando com "$ " para o site
    diferenciar comando de saída. Pula comentários, continuações ("\\") e heredocs."""
    if any(line.startswith("$") for line in code.split("\n")):
        return code
    out, cont, heredoc = [], False, None
    for line in code.split("\n"):
        stripped = line.strip()
        if heredoc:
            out.append(line)
            if stripped == heredoc:
                heredoc = None
            continue
        if stripped and not stripped.startswith("#") and not cont:
            out.append("$ " + line)
        else:
            out.append(line)
        m = re.search(r"<<-?\s*['\"]?(\w+)['\"]?", line)
        if m and not stripped.startswith("#"):
            heredoc = m.group(1)
        cont = stripped.endswith("\\")
    return "\n".join(out)


def parse_examples(sections, h, warn):
    examples = []
    titles = []
    for title, lines in sections:
        sub = title.split(":", 1)[1].strip() if ":" in title else title
        titles.append(sub)
        bl = blocks(lines)
        pending = []
        n = 0
        start = len(examples)
        for b in bl:
            if b[0] == "code":
                prev = examples[-1] if len(examples) > start else None
                # saída esperada em bloco "text" logo depois de comandos: vai para a mesma aba
                if (
                    b[1] == "text"
                    and prev is not None
                    and prev.get("_fence") == "sh"
                    and not pending
                    and not FILE_LABEL.match(b[2].lstrip().split("\n", 1)[0])
                ):
                    note = prev.pop("_after", [])
                    kept = [t for t in note if not OUTPUT_LEAD.match(t)]
                    prev["code"] += f"\n\n# {h['output']}\n" + b[2]
                    if kept:
                        prev["note"] = " ".join(kept)
                    elif "note" in prev and prev["note"] == " ".join(note):
                        del prev["note"]
                    continue
                n += 1
                first = b[2].lstrip().split("\n", 1)[0]
                m = FILE_LABEL.match(first)
                lang = "yaml" if b[1] in ("yaml", "yml") else "sh"
                code = with_prompts(b[2]) if b[1] == "sh" else b[2]
                ex = {"label": m.group(1) if m else None, "lang": lang, "code": code, "_fence": b[1]}
                if pending:
                    ex["intro"] = " ".join(pending)
                    pending = []
                examples.append(ex)
            elif b[0] in ("p", "li", "ol"):
                txt = b[1] if b[0] == "p" else "• " + b[1]
                if len(examples) > start and not pending and n > 0:
                    prev = examples[-1]
                    prev["note"] = (prev.get("note", "") + " " + txt).strip()
                    prev.setdefault("_after", []).append(txt)
                else:
                    pending.append(txt)
            else:
                warn(f"bloco {b[0]} ignorado em exemplo '{title}'")
        if pending:
            warn(f"texto sem código em '{title}': {pending[0][:60]}")
        # rótulo das abas sem nome de arquivo: o nome da seção quando ela tem uma aba só;
        # com várias abas, "terminal" para shell e o nome da seção para o resto
        section = examples[start:]
        for ex in section:
            if ex["label"] is None:
                kind = FENCE_LABEL.get(ex["_fence"])
                if len(section) == 1:
                    ex["label"] = sub
                elif kind:
                    ex["label"] = kind
                else:
                    ex["label"] = "terminal" if ex["_fence"] in ("sh", "bash", "") else sub
    for ex in examples:
        ex.pop("_after", None)
        ex.pop("_fence", None)
    # rótulos únicos (as abas usam o rótulo como chave)
    seen = {}
    for ex in examples:
        base = ex["label"]
        if base in seen:
            seen[base] += 1
            ex["label"] = f"{base} ({seen[base]})"
        else:
            seen[base] = 1
    return examples, titles


def parse_stage(num, title, lines, h, warn):
    secs = split_sections(lines, 3)
    get = {}
    ex_secs = []
    for t, ls in secs:
        if t is None:
            continue
        if t.startswith(h["example"]):
            ex_secs.append((t, ls))
        else:
            get[t] = ls

    def need(key):
        if h[key] not in get:
            raise SystemExit(f"Etapa {num}: falta '### {h[key]}'")
        return blocks(get[h[key]])

    lead = "\n\n".join(paragraphs(need("problem")))
    figures = []
    concept = concept_items(need("concept"), figures)

    points = []
    pt_blocks = need("points")
    for i, b in enumerate(x for x in pt_blocks if x[0] == "li"):
        m = re.match(r"\*\*(.+?)\*\*\s*:?\s*(.*)", b[1]) or re.match(
            r"(`[^`]+`(?:\s*/\s*`[^`]+`)*)\s*:\s*(.*)", b[1]
        )
        if not m:
            warn(f"Etapa {num}: conceito-chave fora do padrão: {b[1][:50]}")
            continue
        points.append({"t": m.group(1).rstrip(":"), "d": m.group(2), "color": COLORS[i % len(COLORS)]})

    examples, ex_titles = parse_examples(ex_secs, h, warn)
    examples_title = (
        ex_titles[0][:1].upper() + ex_titles[0][1:] if len(ex_titles) == 1 else h["multiExamples"]
    )

    commands = []
    for b in need("commands"):
        if b[0] != "li":
            continue
        m = re.match(r"`([^`]+)`\s*:?\s*(.*)", b[1])
        if m:
            note = m.group(2).rstrip(".")
            commands.append({"cmd": m.group(1), **({"note": note} if note else {})})
        else:
            warn(f"Etapa {num}: comando fora do padrão: {b[1][:50]}")

    ho = need("handsOn")
    intro = " ".join(b[1] for b in ho if b[0] == "p" and not any(x[0] == "ol" for x in ho[: ho.index(b)]))
    steps = [b[1] for b in ho if b[0] in ("ol", "li")]
    after = [b[1] for b in ho if b[0] == "p" and any(x[0] == "ol" for x in ho[: ho.index(b)])]
    if after:
        steps[-1] = steps[-1] + " " + " ".join(after)
    for b in ho:
        if b[0] == "code":
            warn(f"Etapa {num}: código dentro de Mão na massa ignorado")

    tip = " ".join(b[1] if b[0] == "p" else "• " + b[1] for b in need("tip") if b[0] in ("p", "li"))
    tk = need("takeaway")
    takeaway = " ".join(b[1] for b in tk if b[0] in ("quote", "p"))

    lesson = {
        "id": f"m{int(num)}",
        "num": num,
        "title": title,
        "lead": lead,
        "concept": concept,
        "pointsTitle": h["points"],
        "points": points,
        "examplesTitle": examples_title,
        "examples": examples,
        "commands": commands,
        "handsOn": steps,
        "tip": tip,
        "takeaway": takeaway,
    }
    if figures:
        lesson["figures"] = figures
    if intro:
        lesson["handsOnIntro"] = intro
    return lesson


def main():
    path, locale = sys.argv[1], sys.argv[2]
    h = HEAD[locale]
    lines = open(path, encoding="utf-8").read().split("\n")
    warnings = []
    warn = warnings.append

    lens = None
    intro, lessons, checklist, notes = [], [], [], []
    for title, ls in split_sections(lines, 2):
        if title is None:
            # abertura: parágrafos entre o título (#) e a primeira seção
            intro = [b[1] for b in blocks(ls) if b[0] == "p" and not b[1].startswith("# ")]
            continue
        m = re.match(h["stage"], title)
        if title == h["lens"]:
            subs = split_sections(ls, 3)
            limits_intro, limits = "", []
            for sub_title, sub_lines in subs[1:]:
                if sub_title != h["limits"]:
                    raise SystemExit(f"subseção inesperada na lente: {sub_title}")
                sub = blocks(sub_lines)
                limits_intro = " ".join(paragraphs(sub))
                limits = [b[1] for b in sub if b[0] == "li"]
            bl = blocks(subs[0][1])
            paras = paragraphs(bl)
            table = next(b for b in bl if b[0] == "table")
            body = paras[:-1]
            # a ponte começa no parágrafo que liga a F1 ao tema técnico ("É a mesma divisão...",
            # "It is the same..."); sem esse marcador, no primeiro que cita o Kubernetes
            bridge_start = re.compile(r"(É (a|o) mesm|It is the same|This is the same)")
            cut = next((i for i, x in enumerate(body) if bridge_start.match(x)), None)
            if cut is None:
                cut = next((i for i, x in enumerate(body) if "Kubernetes" in x), len(body))
            lens = {
                "paragraphs": body[:cut],
                "bridge": body[cut:],
                "mappingNote": paras[-1],
                "mapping": [{"term": r[0], "plain": r[1]} for r in table_rows(table[1])],
                "limitsIntro": limits_intro,
                "limits": limits,
            }
        elif m:
            lessons.append(parse_stage(m.group(1), m.group(2).strip(), ls, h, warn))
        elif title.startswith(h["checklist"]):
            group = None
            for b in blocks(ls):
                if b[0] == "p" and re.fullmatch(r"\*\*[^*]+\*\*", b[1]):
                    group = {"title": b[1].strip("*"), "items": []}
                    checklist.append(group)
                elif b[0] == "li" and group is not None:
                    group["items"].append(re.sub(r"^\[ \]\s*", "", b[1]))
                elif b[0] == "p" and group is not None:
                    checklist.append({"title": "", "items": [], "outro": b[1]})
        elif title.startswith(h["notes"]):
            for b in blocks(ls):
                if b[0] in ("p", "li", "ol"):
                    notes.append(b[1])

    if lens is None:
        raise SystemExit("seção da lente de F1 não encontrada")
    for w in warnings:
        print("aviso:", w, file=sys.stderr)
    json.dump(
        {"INTRO": intro, "LENS": lens, "LESSONS": lessons, "CHECKLIST": checklist, "NOTES": notes},
        sys.stdout,
        ensure_ascii=False,
        indent=2,
    )


if __name__ == "__main__":
    main()
