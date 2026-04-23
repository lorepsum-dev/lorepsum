import { useCallback, useRef } from "react";
import type { MouseEvent } from "react";

function useDraggableScroll() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({
    dragging: false,
    startX: 0,
    startY: 0,
    scrollLeft: 0,
    scrollTop: 0,
  });

  const onMouseDown = useCallback((event: MouseEvent<HTMLDivElement>) => {
    const element = scrollRef.current;

    if (!element) {
      return;
    }

    dragRef.current = {
      dragging: true,
      startX: event.pageX - element.offsetLeft,
      startY: event.pageY - element.offsetTop,
      scrollLeft: element.scrollLeft,
      scrollTop: element.scrollTop,
    };

    element.style.cursor = "grabbing";
  }, []);

  const onMouseMove = useCallback((event: MouseEvent<HTMLDivElement>) => {
    const element = scrollRef.current;

    if (!element || !dragRef.current.dragging) {
      return;
    }

    event.preventDefault();

    const nextX = event.pageX - element.offsetLeft;
    const nextY = event.pageY - element.offsetTop;

    element.scrollLeft = dragRef.current.scrollLeft - (nextX - dragRef.current.startX);
    element.scrollTop = dragRef.current.scrollTop - (nextY - dragRef.current.startY);
  }, []);

  const onMouseUp = useCallback(() => {
    dragRef.current.dragging = false;

    if (scrollRef.current) {
      scrollRef.current.style.cursor = "grab";
    }
  }, []);

  return {
    scrollRef,
    dragHandlers: {
      onMouseDown,
      onMouseMove,
      onMouseUp,
    },
  };
}

export { useDraggableScroll };
