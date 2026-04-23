import type { ReactNode } from "react";
import LoreHeader from "./LoreHeader";
import type { LoreFeature } from "../model/types";

interface LoreFeatureSectionProps {
  feature: LoreFeature;
  isFirst: boolean;
  nextFeature: LoreFeature | null;
  loreTitle: string;
  loreDescription?: string | null;
  onNext: () => void;
  sectionRef: (element: HTMLElement | null) => void;
  children: ReactNode;
}

function LoreFeatureSection({
  feature,
  isFirst,
  nextFeature,
  loreTitle,
  loreDescription,
  onNext,
  sectionRef,
  children,
}: LoreFeatureSectionProps) {
  return (
    <section
      ref={sectionRef}
      className={`grid h-screen w-full grid-rows-[auto_1fr_auto] pl-4 pr-4 sm:pl-24 sm:pr-56 ${isFirst ? "pb-8 pt-16" : "py-16"}`}
      style={{ scrollSnapAlign: "start" }}
    >
      <div className="flex w-full flex-col items-center">
        {isFirst ? (
          <LoreHeader title={loreTitle} description={loreDescription} />
        ) : (
          <>
            <div className="mb-2 flex w-full max-w-5xl items-center gap-4">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-primary-light/40" />
              <h2 className="font-display text-2xl font-bold uppercase tracking-[0.35em] text-gradient-purple">
                {feature.label}
              </h2>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-primary-light/40" />
            </div>
            {feature.description && (
              <p className="mb-6 mt-3 max-w-xl text-center font-mono text-xs leading-relaxed text-muted-foreground/50">
                {feature.description}
              </p>
            )}
          </>
        )}
      </div>

      <div className="flex min-h-0 w-full flex-col items-center overflow-hidden">
        {children}
      </div>

      <div className="flex items-center justify-center">
        {nextFeature && (
          <button
            onClick={onNext}
            className="group flex cursor-pointer flex-col items-center gap-2 focus:outline-none"
            aria-label={`View ${nextFeature.label}`}
          >
            <span className="font-display text-xs uppercase tracking-[0.5em] text-primary-light/50 transition-colors duration-300 group-hover:text-primary-light/90">
              {nextFeature.label}
            </span>
            <div className="flex animate-bounce flex-col items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary-light/50 transition-colors duration-300 drop-shadow-[0_0_8px_hsl(var(--primary-light)/0.4)] group-hover:text-primary-light group-hover:drop-shadow-[0_0_14px_hsl(var(--primary-light)/0.7)]"
              >
                <path d="M12 5v14" />
                <path d="m19 12-7 7-7-7" />
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="-mt-3 text-primary-light/20 transition-colors duration-300 group-hover:text-primary-light/50"
              >
                <path d="m19 12-7 7-7-7" />
              </svg>
            </div>
          </button>
        )}
      </div>
    </section>
  );
}

export default LoreFeatureSection;
