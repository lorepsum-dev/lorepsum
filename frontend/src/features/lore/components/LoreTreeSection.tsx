import type { MouseEvent, RefObject } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import type { TreeNode } from "../model/types";

interface LoreTreeSectionProps {
  forest: TreeNode[];
  isLoading: boolean;
  selectedId: number | null;
  onSelect: (id: number) => void;
  scrollRef: RefObject<HTMLDivElement>;
  onMouseDown: (event: MouseEvent<HTMLDivElement>) => void;
  onMouseMove: (event: MouseEvent<HTMLDivElement>) => void;
  onMouseUp: () => void;
}

interface TreeNodeElementProps {
  node: TreeNode;
  selectedId: number | null;
  onSelect: (id: number) => void;
  delay?: number;
}

function TreeNodeElement({
  node,
  selectedId,
  onSelect,
  delay = 0,
}: TreeNodeElementProps) {
  const hasChildren = node.children.length > 0;
  const isOnly = node.children.length === 1;
  const isSelected = selectedId === node.entity.id;
  const lineDelay = delay + 120;

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={() => onSelect(node.entity.id)}
        style={{ animationDelay: `${delay}ms`, animationFillMode: "both" }}
        className={cn(
          "flex flex-col items-center rounded-lg border px-3 py-1.5 font-mono whitespace-nowrap transition-all duration-200",
          "animate-in fade-in slide-in-from-top-3 duration-500",
          isSelected
            ? "border-primary-light/60 bg-primary/20 text-primary-light shadow-[0_0_12px_hsl(var(--primary-light)/0.2)]"
            : "border-primary-light/15 text-muted-foreground hover:border-primary-light/30 hover:text-primary-light",
        )}
      >
        <span className="text-sm">{node.entity.name}</span>
        {node.parents.length > 0 && (
          <span className="mt-0.5 text-[9px] tracking-wide text-primary-light/30">
            {node.parents.map((parent) => parent.name).join(" · ")}
          </span>
        )}
      </button>

      {hasChildren && (
        <>
          <div
            className="h-6 w-px animate-in fade-in bg-primary-light/20 duration-500"
            style={{ animationDelay: `${lineDelay}ms`, animationFillMode: "both" }}
          />
          <div className="flex gap-3">
            {node.children.map((child, index) => {
              const isFirst = index === 0;
              const isLast = index === node.children.length - 1;
              const childDelay = lineDelay + 80 + index * 60;

              return (
                <div key={child.entity.id} className="flex flex-col items-center">
                  <div className="relative w-full" style={{ height: "24px" }}>
                    {!isOnly && (
                      <div
                        className="absolute top-0 h-px animate-in fade-in bg-primary-light/20 duration-400"
                        style={{
                          left: isFirst ? "50%" : "0",
                          right: isLast ? "50%" : "0",
                          animationDelay: `${childDelay}ms`,
                          animationFillMode: "both",
                        }}
                      />
                    )}
                    <div
                      className="absolute inset-x-0 bottom-0 top-0 flex animate-in fade-in justify-center duration-400"
                      style={{ animationDelay: `${childDelay}ms`, animationFillMode: "both" }}
                    >
                      <div className="w-px bg-primary-light/20" />
                    </div>
                  </div>

                  <TreeNodeElement
                    node={child}
                    selectedId={selectedId}
                    onSelect={onSelect}
                    delay={childDelay + 60}
                  />
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function LoreTreeSection({
  forest,
  isLoading,
  selectedId,
  onSelect,
  scrollRef,
  onMouseDown,
  onMouseMove,
  onMouseUp,
}: LoreTreeSectionProps) {
  return (
    <>
      {isLoading ? (
        <Skeleton className="h-12 w-32 rounded-lg" />
      ) : (
        <div
          ref={scrollRef}
          className="tree-scroll mx-auto w-full max-w-3xl select-none overflow-x-auto overflow-y-auto rounded-xl pb-2 max-h-[100rem]"
          style={{ cursor: "grab" }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
        >
          <div className="flex min-w-max justify-center gap-6 px-8 py-6">
            {forest.map((root, index) => (
              <TreeNodeElement
                key={root.entity.id}
                node={root}
                selectedId={selectedId}
                onSelect={onSelect}
                delay={index * 120}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default LoreTreeSection;
