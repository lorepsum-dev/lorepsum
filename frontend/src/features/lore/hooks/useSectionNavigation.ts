import { useCallback, useEffect, useRef, useState } from "react";

function useSectionNavigation(featuresCount: number) {
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const setSectionRef = useCallback(
    (index: number) => (element: HTMLElement | null) => {
      sectionRefs.current[index] = element;
    },
    [],
  );

  const scrollToSection = useCallback((index: number) => {
    sectionRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  useEffect(() => {
    if (featuresCount === 0) {
      return;
    }

    const elements = sectionRefs.current
      .slice(0, featuresCount)
      .filter((element): element is HTMLElement => element !== null);

    if (elements.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];

        if (!visible) {
          return;
        }

        const index = sectionRefs.current.findIndex((element) => element === visible.target);

        if (index >= 0) {
          setActiveIndex(index);
        }
      },
      { threshold: [0.4, 0.6, 0.8] },
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [featuresCount]);

  return {
    setSectionRef,
    scrollToSection,
    activeIndex,
  };
}

export { useSectionNavigation };
