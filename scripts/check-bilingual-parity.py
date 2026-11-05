#!/usr/bin/env python3
"""Checagem mecânica de paridade entre final.md (PT-BR) e a versão inglesa.

Uso: python3 scripts/check-bilingual-parity.py <pt.md> <en.md>

Compara o que não depende de leitura: estrutura de títulos, blocos de código,
tabelas, imagens, URLs, travessões e exclamações fora de código. O
revisor-bilingue roda este script primeiro e só lê o texto para o que exige
julgamento (sentido, precisão dos termos, tom). Sai com código 1 se houver
divergência.
"""
import re
import sys

FENCE = re.compile(r"^(```|~~~)")
URL = re.compile(r"https?://[^\s)>\]\"'`]+")
IMAGE = re.compile(r"!\[[^\]]*\]\(([^\s)]+)")
NUM_RANGE = re.compile(r"\d\s*[–—]\s*\d")


def parse(path):
    with open(path, encoding="utf-8") as f:
        lines = f.read().splitlines()
    info = {"headings": [], "code": [], "tables": [], "images": [],
            "urls": [], "dashes": [], "bangs": []}
    in_code, block, table_rows = False, None, 0
    for n, line in enumerate(lines, 1):
        if FENCE.match(line.strip()):
            if in_code:
                info["code"].append(block)
                in_code = False
            else:
                in_code = True
                block = {"line": n, "lang": line.strip()[3:].strip(), "lines": 0}
            continue
        if in_code:
            block["lines"] += 1
            info["urls"] += URL.findall(line)
            continue
        if line.lstrip().startswith("|"):
            table_rows += 1
        elif table_rows:
            info["tables"].append(table_rows)
            table_rows = 0
        m = re.match(r"^(#{1,6})\s", line)
        if m:
            info["headings"].append((len(m.group(1)), n, line.strip()))
        # versões traduzidas de diagramas usam o sufixo .en (etapa02-x.en.svg)
        info["images"] += [re.sub(r"\.en(\.\w+)$", r"\1", i) for i in IMAGE.findall(line)]
        info["urls"] += URL.findall(line)
        # código inline e saídas citadas entre aspas ("Done!") não são prosa
        prose = re.sub(r"`[^`]*`|\"[^\"]*\"|“[^”]*”", "", line)
        if re.search(r"[—–]", NUM_RANGE.sub("", prose)) and not re.match(r"^\s*[>]*\s*[—–]\s*\w", prose):
            info["dashes"].append(n)
        if re.search(r"!(?!\[)", re.sub(r"!\[", "", prose)):
            info["bangs"].append(n)
    if table_rows:
        info["tables"].append(table_rows)
    return info


def main():
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    pt, en = parse(sys.argv[1]), parse(sys.argv[2])
    problems = []

    levels_pt = [h[0] for h in pt["headings"]]
    levels_en = [h[0] for h in en["headings"]]
    if levels_pt != levels_en:
        problems.append(f"Títulos: PT tem {len(levels_pt)}, EN tem {len(levels_en)} ou a hierarquia difere.")
        for i, (a, b) in enumerate(zip(pt["headings"], en["headings"])):
            if a[0] != b[0]:
                problems.append(f"  primeira divergência: PT l.{a[1]} {a[2]!r} x EN l.{b[1]} {b[2]!r}")
                break

    if len(pt["code"]) != len(en["code"]):
        problems.append(f"Blocos de código: PT {len(pt['code'])}, EN {len(en['code'])}.")
    for a, b in zip(pt["code"], en["code"]):
        if a["lang"] != b["lang"] or a["lines"] != b["lines"]:
            problems.append(f"Bloco de código PT l.{a['line']} ({a['lang']}, {a['lines']} linhas) x "
                            f"EN l.{b['line']} ({b['lang']}, {b['lines']} linhas)")

    if pt["tables"] != en["tables"]:
        problems.append(f"Tabelas (linhas por tabela): PT {pt['tables']} x EN {en['tables']}")
    if pt["images"] != en["images"]:
        problems.append(f"Imagens fora de ordem ou diferentes: PT {pt['images']} x EN {en['images']}")
    if sorted(set(pt["urls"])) != sorted(set(en["urls"])):
        only_pt = sorted(set(pt["urls"]) - set(en["urls"]))
        only_en = sorted(set(en["urls"]) - set(pt["urls"]))
        problems.append(f"URLs só no PT: {only_pt}; só no EN: {only_en}")

    for name, info in (("PT", pt), ("EN", en)):
        if info["dashes"]:
            problems.append(f"Travessões na prosa ({name}), linhas: {info['dashes']}")
        if info["bangs"]:
            problems.append(f"Exclamações na prosa ({name}), linhas: {info['bangs']}")

    print(f"Títulos {len(levels_pt)}/{len(levels_en)} · código {len(pt['code'])}/{len(en['code'])} · "
          f"tabelas {len(pt['tables'])}/{len(en['tables'])} · imagens {len(pt['images'])}/{len(en['images'])}")
    if problems:
        print("DIVERGÊNCIAS:")
        print("\n".join(f"- {p}" for p in problems))
        sys.exit(1)
    print("Paridade mecânica OK.")


if __name__ == "__main__":
    main()
