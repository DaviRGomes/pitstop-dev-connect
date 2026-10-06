import { useEffect, useLayoutEffect, useState } from "react";

export function useGuideProgress(storageKey: string) {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [loadedKey, setLoadedKey] = useState<string | null>(null);

  useEffect(() => {
    let saved: Record<string, boolean> = {};
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) saved = JSON.parse(raw) as Record<string, boolean>;
    } catch {
      // Armazenamento indisponível ou conteúdo antigo inválido.
    }
    setDone(saved);
    setLoadedKey(storageKey);
  }, [storageKey]);

  useEffect(() => {
    // Não substitui o progresso salvo pelo estado vazio usado no SSR/primeira
    // renderização; espera a leitura da chave atual terminar.
    if (loadedKey !== storageKey) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(done));
    } catch {
      // O progresso continua válido somente nesta renderização.
    }
  }, [done, loadedKey, storageKey]);

  return [done, setDone] as const;
}

export function useSectionReveal() {
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    if (!("IntersectionObserver" in window)) return;

    const sections = Array.from(document.querySelectorAll<HTMLElement>(".section"));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );

    for (const section of sections) {
      section.classList.add("reveal");
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);
}

export function useScrollSpy(ids: string[]) {
  const [activeId, setActiveId] = useState(ids[0]);
  const key = ids.join("|");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));

    if (sections.length === 0) return;

    if (typeof window.IntersectionObserver === "function") {
      const visible = new Set<string>();
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) visible.add(entry.target.id);
            else visible.delete(entry.target.id);
          }

          let current: HTMLElement | undefined;
          for (let index = sections.length - 1; index >= 0; index -= 1) {
            if (visible.has(sections[index].id)) {
              current = sections[index];
              break;
            }
          }
          if (current) setActiveId((previous) => (previous === current.id ? previous : current.id));
        },
        { rootMargin: "0px 0px -70% 0px", threshold: 0.01 },
      );

      sections.forEach((section) => observer.observe(section));
      return () => observer.disconnect();
    }

    let frame = 0;
    const offsets = sections.map((section) => ({ id: section.id, top: section.offsetTop }));
    const update = () => {
      frame = 0;
      const position = window.scrollY + window.innerHeight * 0.3;
      let current = offsets[0].id;
      for (const section of offsets) {
        if (section.top <= position) current = section.id;
        else break;
      }
      setActiveId((previous) => (previous === current ? previous : current));
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
    // `key` represents the stable contents of ids.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    document
      .querySelector(".nav a.active")
      ?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [activeId]);

  return activeId;
}
