type Example = { lang?: unknown };
type Lesson = Record<string, unknown> & {
  id?: unknown;
  num?: unknown;
  navTitle?: unknown;
  tag?: unknown;
  title?: unknown;
  lead?: unknown;
  concept?: unknown;
  points?: unknown;
  pointsTitle?: unknown;
  examples?: unknown;
  examplesTitle?: unknown;
  commands?: unknown;
  handsOn?: unknown;
  tip?: unknown;
  takeaway?: unknown;
};

type GuideModule = {
  LESSONS: Lesson[];
  DE_PARA?: unknown[];
  ANALOGY_NOTES?: unknown[];
  PLATFORMS?: unknown[];
  SYSTEM_MAP?: unknown[];
  LENS?: { mapping?: unknown[]; limits?: unknown[] };
  CHECKLIST?: { items: unknown[] }[];
};

// Formato padrão (LessonSection), o formato próprio do guia de Escalabilidade (ScaleLessonSection)
// e o formato lente de F1 + etapas técnicas (LensKit).
type Shape = { strings: readonly string[]; arrays: readonly string[]; depara: boolean };

const guides = [
  {
    name: "kubernetes-basico",
    pt: () => import("../src/data/kubernetesbasico.ts"),
    en: () => import("../src/data/kubernetesbasico.en.ts"),
    shape: "lens",
  },
  {
    name: "kubernetes-avancado",
    pt: () => import("../src/data/kubernetesavancado.ts"),
    en: () => import("../src/data/kubernetesavancado.en.ts"),
    shape: "lens",
  },
  {
    name: "servidores-web",
    pt: () => import("../src/data/servidoresweb.ts"),
    en: () => import("../src/data/servidoresweb.en.ts"),
    shape: "lens",
  },
  {
    name: "containers",
    pt: () => import("../src/data/containers.ts"),
    en: () => import("../src/data/containers.en.ts"),
  },
  {
    name: "escalabilidade",
    pt: () => import("../src/data/escalabilidade.ts"),
    en: () => import("../src/data/escalabilidade.en.ts"),
    shape: "scale",
  },
  {
    name: "cultura-devops",
    pt: () => import("../src/data/culturadevops.ts"),
    en: () => import("../src/data/culturadevops.en.ts"),
  },
  {
    name: "arquitetura-aplicacoes",
    pt: () => import("../src/data/arquiteturaaplicacoes.ts"),
    en: () => import("../src/data/arquiteturaaplicacoes.en.ts"),
  },
  {
    name: "arquitetura-cloud",
    pt: () => import("../src/data/arquiteturacloud.ts"),
    en: () => import("../src/data/arquiteturacloud.en.ts"),
  },
  {
    name: "aws-azure",
    pt: () => import("../src/data/awsazure.ts"),
    en: () => import("../src/data/awsazure.en.ts"),
  },
] as const;

const defaultStringFields = [
  "id",
  "num",
  "navTitle",
  "tag",
  "title",
  "lead",
  "pointsTitle",
  "examplesTitle",
  "tip",
  "takeaway",
] as const;

const defaultArrayFields = ["concept", "points", "examples", "commands", "handsOn"] as const;

const shapes: Record<"default" | "scale" | "lens", Shape> = {
  default: { strings: defaultStringFields, arrays: defaultArrayFields, depara: true },
  lens: { strings: defaultStringFields, arrays: defaultArrayFields, depara: false },
  scale: {
    strings: [
      "id",
      "num",
      "navTitle",
      "tag",
      "title",
      "question",
      "symptom",
      "pitScene",
      "answer",
      "examplesTitle",
      "labGoal",
      "rule",
      "pitRule",
      "selfCheck",
    ],
    arrays: ["concept", "analogies", "tradeoffs", "examples", "commands", "labSteps"],
    depara: false,
  },
};

function invariant(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function validateLessons(name: string, locale: "pt" | "en", lessons: Lesson[], shape: Shape) {
  invariant(Array.isArray(lessons) && lessons.length > 0, `${name}/${locale}: LESSONS vazio`);
  const ids = new Set<string>();

  for (const [index, lesson] of lessons.entries()) {
    const location = `${name}/${locale}[${index}]`;
    for (const field of shape.strings) {
      const value = lesson[field];
      invariant(
        typeof value === "string" && value.trim().length > 0,
        `${location}: campo ${field} ausente ou vazio`,
      );
    }
    for (const field of shape.arrays) {
      invariant(Array.isArray(lesson[field]), `${location}: campo ${field} não é array`);
    }

    const id = lesson.id as string;
    invariant(!ids.has(id), `${name}/${locale}: id duplicado ${id}`);
    ids.add(id);

    for (const [exampleIndex, example] of (lesson.examples as Example[]).entries()) {
      invariant(
        example.lang === "yaml" || example.lang === "sh",
        `${location}.examples[${exampleIndex}]: linguagem inválida`,
      );
    }
  }
}

function validateParity(name: string, pt: GuideModule, en: GuideModule, shape: Shape) {
  invariant(pt.LESSONS.length === en.LESSONS.length, `${name}: quantidade de etapas diverge`);
  if (shape.depara) {
    invariant(
      Array.isArray(pt.DE_PARA) && pt.DE_PARA.length === en.DE_PARA?.length,
      `${name}: quadro de analogias diverge`,
    );
    invariant(
      Array.isArray(pt.ANALOGY_NOTES) && pt.ANALOGY_NOTES.length === en.ANALOGY_NOTES?.length,
      `${name}: notas de analogia divergem`,
    );
  }
  if (pt.SYSTEM_MAP || en.SYSTEM_MAP) {
    invariant(pt.SYSTEM_MAP?.length === en.SYSTEM_MAP?.length, `${name}: mapa do sistema diverge`);
  }
  if (pt.PLATFORMS || en.PLATFORMS) {
    invariant(pt.PLATFORMS?.length === en.PLATFORMS?.length, `${name}: plataformas divergem`);
  }

  if (pt.LENS || en.LENS) {
    invariant(
      pt.LENS?.mapping?.length === en.LENS?.mapping?.length &&
        pt.LENS?.limits?.length === en.LENS?.limits?.length,
      `${name}: lente de F1 diverge`,
    );
  }
  if (pt.CHECKLIST || en.CHECKLIST) {
    invariant(
      JSON.stringify(pt.CHECKLIST?.map((g) => g.items.length)) ===
        JSON.stringify(en.CHECKLIST?.map((g) => g.items.length)),
      `${name}: checklist diverge`,
    );
  }

  for (let index = 0; index < pt.LESSONS.length; index += 1) {
    const left = pt.LESSONS[index];
    const right = en.LESSONS[index];
    const id = String(left.id);
    invariant(left.id === right.id, `${name}/${id}: id ou ordem diverge`);
    invariant(left.num === right.num, `${name}/${id}: num diverge`);

    if (left.figures || right.figures) {
      const frames = (lesson: Lesson) =>
        JSON.stringify(
          ((lesson.figures as { items: { src: string }[] }[] | undefined) ?? []).map((g) =>
            g.items.map((item) => item.src),
          ),
        );
      invariant(frames(left) === frames(right), `${name}/${id}: figuras divergem entre PT e EN`);
    }

    for (const field of shape.arrays) {
      invariant(
        (left[field] as unknown[]).length === (right[field] as unknown[]).length,
        `${name}/${id}: quantidade em ${field} diverge`,
      );
    }
  }
}

for (const guide of guides) {
  const [pt, en] = (await Promise.all([guide.pt(), guide.en()])) as [GuideModule, GuideModule];
  const shape = shapes["shape" in guide ? guide.shape : "default"];
  validateLessons(guide.name, "pt", pt.LESSONS, shape);
  validateLessons(guide.name, "en", en.LESSONS, shape);
  validateParity(guide.name, pt, en, shape);
  console.log(`✓ ${guide.name}: ${pt.LESSONS.length} etapas equivalentes`);
}
