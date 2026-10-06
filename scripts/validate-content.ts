type Example = { lang?: unknown };
type Lesson = {
  id?: unknown;
  num?: unknown;
  navTitle?: unknown;
  tag?: unknown;
  title?: unknown;
  narration?: unknown;
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
  outro?: unknown;
};

type GuideModule = {
  LESSONS: Lesson[];
  DE_PARA: unknown[];
  ANALOGY_NOTES: unknown[];
  PLATFORMS?: unknown[];
};

const guides = [
  {
    name: "kubernetes-basico",
    pt: () => import("../src/data/kubernetesbasico.ts"),
    en: () => import("../src/data/kubernetesbasico.en.ts"),
  },
  {
    name: "kubernetes-avancado",
    pt: () => import("../src/data/kubernetesavancado.ts"),
    en: () => import("../src/data/kubernetesavancado.en.ts"),
  },
  {
    name: "servidores-web",
    pt: () => import("../src/data/servidoresweb.ts"),
    en: () => import("../src/data/servidoresweb.en.ts"),
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
  },
] as const;

const stringFields = [
  "id",
  "num",
  "navTitle",
  "tag",
  "title",
  "narration",
  "lead",
  "pointsTitle",
  "examplesTitle",
  "tip",
  "takeaway",
  "outro",
] as const;

const arrayFields = ["concept", "points", "examples", "commands", "handsOn"] as const;

function invariant(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function validateLessons(name: string, locale: "pt" | "en", lessons: Lesson[]) {
  invariant(Array.isArray(lessons) && lessons.length > 0, `${name}/${locale}: LESSONS vazio`);
  const ids = new Set<string>();

  for (const [index, lesson] of lessons.entries()) {
    const location = `${name}/${locale}[${index}]`;
    for (const field of stringFields) {
      invariant(
        typeof lesson[field] === "string" && lesson[field].trim().length > 0,
        `${location}: campo ${field} ausente ou vazio`,
      );
    }
    for (const field of arrayFields) {
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

function validateParity(name: string, pt: GuideModule, en: GuideModule) {
  invariant(pt.LESSONS.length === en.LESSONS.length, `${name}: quantidade de etapas diverge`);
  invariant(pt.DE_PARA.length === en.DE_PARA.length, `${name}: quadro de analogias diverge`);
  invariant(
    pt.ANALOGY_NOTES.length === en.ANALOGY_NOTES.length,
    `${name}: notas de analogia divergem`,
  );
  if (pt.PLATFORMS || en.PLATFORMS) {
    invariant(pt.PLATFORMS?.length === en.PLATFORMS?.length, `${name}: plataformas divergem`);
  }

  for (let index = 0; index < pt.LESSONS.length; index += 1) {
    const left = pt.LESSONS[index];
    const right = en.LESSONS[index];
    const id = String(left.id);
    invariant(left.id === right.id, `${name}/${id}: id ou ordem diverge`);
    invariant(left.num === right.num, `${name}/${id}: num diverge`);

    for (const field of ["concept", "points", "examples", "commands", "handsOn"] as const) {
      invariant(
        (left[field] as unknown[]).length === (right[field] as unknown[]).length,
        `${name}/${id}: quantidade em ${field} diverge`,
      );
    }
  }
}

for (const guide of guides) {
  const [pt, en] = (await Promise.all([guide.pt(), guide.en()])) as [GuideModule, GuideModule];
  validateLessons(guide.name, "pt", pt.LESSONS);
  validateLessons(guide.name, "en", en.LESSONS);
  validateParity(guide.name, pt, en);
  console.log(`✓ ${guide.name}: ${pt.LESSONS.length} etapas equivalentes`);
}
