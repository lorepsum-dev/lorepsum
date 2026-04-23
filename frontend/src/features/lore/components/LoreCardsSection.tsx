import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useEntityCarousel } from "../hooks/useEntityCarousel";
import type { Entity } from "../model/types";
import EntityCarouselDesktop from "./cards/EntityCarouselDesktop";
import EntityCarouselMobile from "./cards/EntityCarouselMobile";

interface LoreCardsSectionProps {
  entities: Entity[];
  isLoading: boolean;
  onSelectEntity: (id: number) => void;
}

const COMPACT_THRESHOLD = 450;

function LoreCardsSection({
  entities,
  isLoading,
  onSelectEntity,
}: LoreCardsSectionProps) {
  const [compact, setCompact] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const mobileScrollRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const isProgrammaticScroll = useRef(false);
  const {
    centerIndex,
    searchQuery,
    visibleCards,
    canGoLeft,
    canGoRight,
    selectIndex,
    goToPrevious,
    goToNext,
    handleSearch,
  } = useEntityCarousel(entities, onSelectEntity);

  useEffect(() => {
    const element = containerRef.current;

    if (!element) {
      return;
    }

    const observer = new ResizeObserver(([entry]) => {
      setCompact(entry.contentRect.height < COMPACT_THRESHOLD);
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 640px)");
    setIsMobile(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      return;
    }

    const currentCard = cardRefs.current.get(centerIndex);

    if (!currentCard) {
      return;
    }

    isProgrammaticScroll.current = true;
    currentCard.scrollIntoView({ behavior: "smooth", block: "center" });

    const timeout = setTimeout(() => {
      isProgrammaticScroll.current = false;
    }, 700);

    return () => clearTimeout(timeout);
  }, [centerIndex, isMobile]);

  const handleMobileScroll = useCallback(() => {
    if (!mobileScrollRef.current || isProgrammaticScroll.current || entities.length === 0) {
      return;
    }

    const { scrollTop, scrollHeight } = mobileScrollRef.current;
    const slotHeight = scrollHeight / entities.length;
    const nextIndex = Math.max(0, Math.min(Math.round(scrollTop / slotHeight), entities.length - 1));

    if (nextIndex !== centerIndex) {
      selectIndex(nextIndex);
    }
  }, [centerIndex, entities.length, selectIndex]);

  const setCardRef = useCallback((index: number, element: HTMLDivElement | null) => {
    if (element) {
      cardRefs.current.set(index, element);
      return;
    }

    cardRefs.current.delete(index);
  }, []);

  const dotCount = Math.min(entities.length, 3);
  const hasDots = dotCount > 1;

  if (isMobile && !isLoading) {
    return (
      <EntityCarouselMobile
        entities={entities}
        centerIndex={centerIndex}
        searchQuery={searchQuery}
        canGoLeft={canGoLeft}
        canGoRight={canGoRight}
        onSearch={handleSearch}
        onScroll={handleMobileScroll}
        setCardRef={setCardRef}
        onSelectIndex={selectIndex}
        scrollRef={mobileScrollRef}
      />
    );
  }

  return (
    <div ref={containerRef} className="flex h-full w-full flex-col items-center justify-center gap-8">
      {isLoading ? (
        <>
          <Skeleton className="h-9 w-48 rounded-lg" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex gap-4">
              <Skeleton className="h-48 w-52 rounded-xl opacity-40" />
              <Skeleton className="h-48 w-52 rounded-xl" />
              <Skeleton className="h-48 w-52 rounded-xl opacity-40" />
            </div>
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </>
      ) : (
        <>
          <EntityCarouselDesktop
            searchQuery={searchQuery}
            onSearch={handleSearch}
            canGoLeft={canGoLeft}
            canGoRight={canGoRight}
            visibleCards={visibleCards}
            onPrevious={goToPrevious}
            onNext={goToNext}
            onSelect={onSelectEntity}
            compact={compact}
          />

          {hasDots && (
            <div className="mt-5 flex items-center gap-2">
              {dotCount === 2 ? (
                [0, 1].map((index) => (
                  <div
                    key={index}
                    className={cn(
                      "rounded-full transition-all duration-300",
                      index === centerIndex
                        ? "h-1.5 w-4 bg-primary-light/70"
                        : "h-1.5 w-1.5 bg-primary-light/20",
                    )}
                  />
                ))
              ) : (
                <>
                  <div className={cn("h-1.5 w-1.5 rounded-full transition-all duration-300", canGoLeft ? "bg-primary-light/30" : "bg-primary-light/10")} />
                  <div className="h-1.5 w-4 rounded-full bg-primary-light/70" />
                  <div className={cn("h-1.5 w-1.5 rounded-full transition-all duration-300", canGoRight ? "bg-primary-light/30" : "bg-primary-light/10")} />
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default LoreCardsSection;
