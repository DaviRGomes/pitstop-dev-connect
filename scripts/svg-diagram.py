#!/usr/bin/env python3
"""Gera um diagrama técnico em SVG, nas versões PT (.svg) e EN (.en.svg), a partir de uma
especificação JSON, no estilo visual dos diagramas próprios dos guias (fundo branco, caixas com
cantos arredondados, azul como cor principal, setas cinza).

Uso: python3 scripts/svg-diagram.py <spec.json> <saida-sem-extensao>
     ex.: python3 scripts/svg-diagram.py /tmp/d.json public/guides/escalabilidade/etapa02-lb
     grava public/guides/escalabilidade/etapa02-lb.svg e .en.svg

Formato da especificação (todo texto pode ser "igual nos dois idiomas" ou {"pt": ..., "en": ...};
"\\n" quebra linha):

{
  "width": 960, "height": 400,
  "elements": [
    {"type": "frame", "x": 20, "y": 20, "w": 920, "h": 360, "title": "host", "color": "gray",
     "dashed": false},
    {"type": "box", "x": 60, "y": 80, "w": 180, "h": 70, "title": "nginx", "sub": "porta 8080",
     "color": "blue", "mono": true},
    {"type": "arrow", "from": [240, 115], "to": [400, 115], "label": "proxy_pass",
     "color": "gray", "dashed": false, "both": false},
    {"type": "text", "x": 480, "y": 30, "text": "título", "size": 15, "bold": true,
     "color": "text", "anchor": "middle", "mono": false},
    {"type": "line", "from": [0, 0], "to": [10, 10], "color": "gray", "dashed": true}
  ]
}

Cores: blue, green, amber, red, violet, gray, white. "frame" é um contêiner com título no
canto superior esquerdo; "box" é um componente com título centralizado e subtítulo opcional.
"""
import html
import json
import sys

SANS = "Helvetica, Arial, 'Liberation Sans', sans-serif"
MONO = "Menlo, Consolas, 'DejaVu Sans Mono', monospace"
TEXT, MUTED = "#1b2230", "#5b6474"
COLORS = {
    # nome: (contorno, preenchimento)
    "blue": ("#2f6fde", "#e6efff"),
    "green": ("#1f9d55", "#e5f6ec"),
    "amber": ("#c27c0e", "#fff4e0"),
    "red": ("#d64545", "#fdeaea"),
    "violet": ("#7c4dcc", "#f0eafc"),
    "gray": ("#c9d0db", "#fafbfc"),
    "white": ("#c9d0db", "#ffffff"),
}
ARROW = "#9aa3b2"


def tr(v, loc):
    if isinstance(v, dict):
        return v.get(loc, v.get("pt", ""))
    return "" if v is None else str(v)


def text(x, y, s, size=12, bold=False, color=TEXT, anchor="middle", mono=False):
    lines = s.split("\n")
    lh = size * 1.3
    y0 = y - (len(lines) - 1) * lh / 2
    out = []
    for i, ln in enumerate(lines):
        out.append(
            f'<text x="{x}" y="{y0 + i * lh:.1f}" font-family="{MONO if mono else SANS}" '
            f'font-size="{size}" font-weight="{"bold" if bold else "normal"}" fill="{color}" '
            f'text-anchor="{anchor}">{html.escape(ln)}</text>'
        )
    return "".join(out)


def stroke_of(name):
    return COLORS.get(name, COLORS["gray"])[0] if name != "gray" else ARROW


def render(spec, loc):
    w, h = spec["width"], spec["height"]
    out = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}">',
        "<defs>"
        + "".join(
            f'<marker id="a-{n}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" '
            f'markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" '
            f'fill="{stroke_of(n)}"/></marker>'
            for n in COLORS
        )
        + "</defs>",
        f'<rect width="{w}" height="{h}" fill="#ffffff"/>',
    ]
    for el in spec["elements"]:
        t = el["type"]
        col = el.get("color", "blue" if t == "box" else "gray")
        if t in ("frame", "box"):
            stroke, fill = COLORS[col]
            dash = ' stroke-dasharray="6 4"' if el.get("dashed") else ""
            out.append(
                f'<rect x="{el["x"]}" y="{el["y"]}" width="{el["w"]}" height="{el["h"]}" rx="8" '
                f'fill="{fill}" stroke="{stroke}" stroke-width="1.5"{dash}/>'
            )
            title, sub = tr(el.get("title"), loc), tr(el.get("sub"), loc)
            if t == "frame":
                tc = TEXT if col in ("gray", "white") else stroke
                out.append(text(el["x"] + 18, el["y"] + 24, title, 13, True, tc, "start", el.get("mono", False)))
            else:
                cx, cy = el["x"] + el["w"] / 2, el["y"] + el["h"] / 2
                if sub:
                    nsub = len(sub.split("\n"))
                    out.append(text(cx, cy - 8 * nsub, title, 14, True, TEXT, "middle", el.get("mono", False)))
                    out.append(text(cx, cy + 12 + 7 * (nsub - 1), sub, 12, False, MUTED, "middle", el.get("submono", False)))
                else:
                    out.append(text(cx, cy + 5, title, 14, True, TEXT, "middle", el.get("mono", False)))
        elif t in ("arrow", "line"):
            (x1, y1), (x2, y2) = el["from"], el["to"]
            c = stroke_of(col)
            dash = ' stroke-dasharray="6 4"' if el.get("dashed") else ""
            marks = ""
            if t == "arrow":
                m = f"url(#a-{col})"
                marks = f' marker-end="{m}"' + (f' marker-start="{m}"' if el.get("both") else "")
            out.append(
                f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{c}" stroke-width="2"{dash}{marks}/>'
            )
            lab = tr(el.get("label"), loc)
            if lab:
                lx = el.get("lx", (x1 + x2) / 2)
                ly = el.get("ly", (y1 + y2) / 2 - 10)
                lc = MUTED if col == "gray" else c
                out.append(text(lx, ly, lab, 12, False, lc, el.get("anchor", "middle"), el.get("mono", False)))
        elif t == "text":
            c = {"text": TEXT, "muted": MUTED}.get(el.get("color", "text"), None)
            if c is None:
                c = COLORS[el["color"]][0]
            out.append(
                text(el["x"], el["y"], tr(el["text"], loc), el.get("size", 12), el.get("bold", False), c,
                     el.get("anchor", "middle"), el.get("mono", False))
            )
        else:
            raise SystemExit(f"tipo desconhecido: {t}")
    out.append("</svg>")
    return "".join(out)


def main():
    if len(sys.argv) != 3:
        raise SystemExit(__doc__)
    spec = json.load(open(sys.argv[1], encoding="utf-8"))
    for loc, suffix in (("pt", ".svg"), ("en", ".en.svg")):
        path = sys.argv[2] + suffix
        with open(path, "w", encoding="utf-8") as f:
            f.write(render(spec, loc))
        print(path)


if __name__ == "__main__":
    main()
