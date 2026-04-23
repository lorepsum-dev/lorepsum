import { useCallback, useRef } from "react";

function useSectionNavigation() {
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  const setSectionRef = useCallback(
    (index: number) => (element: HTMLElement | null) => {
      sectionRefs.current[index] = element;
    },
    [],
  );

  const scrollToSection = useCallback((index: number) => {
    sectionRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return {
    setSectionRef,
    scrollToSection,
  };
}

export { useSectionNavigation };
