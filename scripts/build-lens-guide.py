#!/usr/bin/env python3
"""Regenera os dados dos guias no formato lente de F1 + etapas técnicas (src/data/<guia>.ts e
<guia>.en.ts) a partir de relatorios/<pasta>/final.md e final.en.md.

Uso: python3 scripts/build-lens-guide.py [basico|avancado|servidores-web|all] [pt|en]
     (sem argumentos: todos os guias, nos dois idiomas)

Mantém o bloco de PLATFORMS que já existe no arquivo de dados do guia básico (ele não vem do
markdown).
"""
import json
import os
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

GUIDES = {
    "basico": {
        "folder": "relatorios/kubernetes-basico",
        "data": "kubernetesbasico",
        "keep_platforms": True,
        "about": "// Conteúdo das 8 etapas base (aulas 1-8, Thiago Adriano / FIAP) + 1 etapa bônus de\n"
        "// aplicação profissional.",
        "meta": {
            "pt": [
                ("Por que K8s existe", "motivação + setup"),
                ("kubectl & API", "linha de comando + API"),
                ("Cluster & Pods", "arquitetura + labels"),
                ("Services & ConfigMap", "rede + configuração"),
                ("Deployments", "auto-cura + escala"),
                ("Volumes", "persistência de dados"),
                ("Probes", "saúde do app"),
                ("Autoscaling (HPA)", "escala automática"),
                ("Exemplo profissional", "bônus · imagem real do docker hub"),
            ],
            "en": [
                ("Why K8s exists", "motivation + setup"),
                ("kubectl & API", "command line + API"),
                ("Cluster & Pods", "architecture + labels"),
                ("Services & ConfigMap", "networking + config"),
                ("Deployments", "self-healing + scale"),
                ("Volumes", "data persistence"),
                ("Probes", "app health"),
                ("Autoscaling (HPA)", "automatic scaling"),
                ("Professional example", "bonus · real docker hub image"),
            ],
        },
    },
    "avancado": {
        "folder": "relatorios/kubernetes-avancado",
        "data": "kubernetesavancado",
        "keep_platforms": False,
        "about": "// Conteúdo das 9 aulas da Fase 2 (DevOps e Arquitetura Cloud, FIAP) + 1 etapa bônus que\n"
        "// leva o podinfo do guia básico para produção.",
        "meta": {
            "pt": [
                ("Saúde e recursos", "probes + requests/limits"),
                ("Agendamento", "taints + affinity + spread"),
                ("Rollouts", "estratégias de atualização"),
                ("Helm", "pacotes + values"),
                ("Blue/Green", "troca de ambiente inteiro"),
                ("Canário", "tráfego progressivo"),
                ("Karpenter", "escala de nós"),
                ("KEDA", "escala por eventos"),
                ("Segurança", "rbac + identidade + tls"),
                ("Exemplo profissional", "bônus · podinfo em produção"),
            ],
            "en": [
                ("Health & resources", "probes + requests/limits"),
                ("Scheduling", "taints + affinity + spread"),
                ("Rollouts", "update strategies"),
                ("Helm", "packages + values"),
                ("Blue/Green", "whole-environment switch"),
                ("Canary", "progressive traffic"),
                ("Karpenter", "node scaling"),
                ("KEDA", "event-driven scaling"),
                ("Security", "rbac + identity + tls"),
                ("Professional example", "bonus · podinfo in production"),
            ],
        },
    },
    "servidores-web": {
        "folder": "relatorios/servidores-web-nginx-apache",
        "data": "servidoresweb",
        "keep_platforms": False,
        "about": "// Conteúdo das aulas 1-5 do módulo de Servidores Web e Balanceamento de Carga, em 14 etapas.",
        "meta": {
            "pt": [
                ("Por que existe", "papel do servidor web"),
                ("HTTP 1.1 → 2 → 3", "evolução do protocolo"),
                ("Forward x Reverse Proxy", "intermediários"),
                ("Apache & MPMs", "processos + threads"),
                ("Nginx event-driven", "event loop"),
                ("Load balancing", "L4 + L7 + algoritmos"),
                ("Failover e diagnóstico", "health checks + 502/504"),
                ("Ingress no Kubernetes", "host + path"),
                ("TLS automático", "cert-manager"),
                ("Service Mesh", "istio + sidecars"),
                ("Tráfego no Istio", "canary + mirror"),
                ("mTLS e observabilidade", "identidade + métricas"),
                ("Alta disponibilidade", "slo + spof + vrrp"),
                ("WAF e proteção", "modsecurity + rate limit"),
            ],
            "en": [
                ("Why it exists", "role of the web server"),
                ("HTTP 1.1 → 2 → 3", "protocol evolution"),
                ("Forward vs Reverse Proxy", "intermediaries"),
                ("Apache & MPMs", "processes + threads"),
                ("Nginx event-driven", "event loop"),
                ("Load balancing", "L4 + L7 + algorithms"),
                ("Failover and diagnosis", "health checks + 502/504"),
                ("Kubernetes Ingress", "host + path"),
                ("Automated TLS", "cert-manager"),
                ("Service Mesh", "istio + sidecars"),
                ("Traffic in Istio", "canary + mirror"),
                ("mTLS and observability", "identity + metrics"),
                ("High availability", "slo + spof + vrrp"),
                ("WAF and protection", "modsecurity + rate limit"),
            ],
        },
    },
}


def dump(v):
    return json.dumps(v, ensure_ascii=False, indent=2)


def build(name, locale):
    g = GUIDES[name]
    src = "final.en.md" if locale == "en" else "final.md"
    md = os.path.join(ROOT, g["folder"], src)
    out_path = os.path.join(ROOT, "src/data", g["data"] + (".en.ts" if locale == "en" else ".ts"))
    raw = subprocess.run(
        [sys.executable, os.path.join(ROOT, "scripts/md-to-lens-guide.py"), md, locale],
        check=True, capture_output=True, text=True,
    )
    if raw.stderr:
        print(raw.stderr, file=sys.stderr, end="")
    d = json.loads(raw.stdout)

    platforms = ""
    if g["keep_platforms"]:
        current = open(out_path, encoding="utf-8").read()
        platforms = current[current.index("export type Platform"):]

    lessons = []
    for lesson, (nav, tag) in zip(d["LESSONS"], g["meta"][locale], strict=True):
        ordered = {"id": lesson["id"], "num": lesson["num"], "navTitle": nav, "tag": tag}
        ordered.update({k: v for k, v in lesson.items() if k not in ordered})
        lessons.append(ordered)

    header = f"""{g["about"]}
// A lente geral de F1 abre o guia (LENS) e cada etapa ensina o tópico só de forma técnica,
// sem repetir a analogia.
// Gerado de {g["folder"]}/{src} por scripts/build-lens-guide.py.
// Para mudar o texto, edite o markdown e gere de novo; o markdown inline (`código`, **negrito**)
// é renderizado pelo LensKit.

import type {{ ChecklistGroup, GuideLens, TechLesson }} from "@/components/guide/LensKit";

export type Lesson = TechLesson;

"""
    body = (
        header
        + f"export const INTRO: string[] = {dump(d['INTRO'])};\n\n"
        + f"export const LENS: GuideLens = {dump(d['LENS'])};\n\n"
        + f"export const LESSONS: Lesson[] = {dump(lessons)};\n\n"
        + f"export const CHECKLIST: ChecklistGroup[] = {dump(d['CHECKLIST'])};\n\n"
        + f"export const NOTES: string[] = {dump(d['NOTES'])};\n"
        + ("\n" + platforms if platforms else "")
    )
    open(out_path, "w", encoding="utf-8").write(body)
    print(f"{os.path.relpath(out_path, ROOT)}: {len(lessons)} etapas")
    return out_path


which = sys.argv[1] if len(sys.argv) > 1 else "all"
locales = [sys.argv[2]] if len(sys.argv) > 2 else ["pt", "en"]
written = [build(name, loc) for name in (GUIDES if which == "all" else [which]) for loc in locales]
subprocess.run(["npx", "prettier", "--write", *written], cwd=ROOT, check=True, capture_output=True)
