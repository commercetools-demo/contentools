import React, { useCallback, useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'puck-properties-width';

export interface PropertiesResizerProps {
  /** Smallest allowed width in px. */
  minWidth?: number;
  /** Largest allowed width in px. */
  maxWidth?: number;
}

interface HandleBox {
  top: number;
  left: number;
  height: number;
}

const sameBox = (a: HandleBox | null, b: HandleBox | null) =>
  a === b ||
  (!!a && !!b && a.top === b.top && a.left === b.left && a.height === b.height);

/**
 * Draggable divider that resizes the Puck properties (right) panel.
 *
 * Render it as a child of the `.puck-editor-fill` container (a sibling of the
 * Puck editor). It writes the chosen width to a `--puck-properties-width` CSS
 * variable on that container — the grid-template override in
 * ComponentListSearch's injected `<style>` reads it to size only the right
 * column, leaving the left panel and canvas alone. The handle is positioned
 * over the panel's left edge by measuring the live sidebar, and hides itself
 * when the panel is collapsed. The width persists in localStorage.
 */
export const PropertiesResizer: React.FC<PropertiesResizerProps> = ({
  minWidth = 240,
  maxWidth = 680,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HandleBox | null>(null);
  const [box, setBox] = useState<HandleBox | null>(null);

  const els = useCallback(() => {
    const handle = ref.current;
    const fill = (handle?.closest('.puck-editor-fill') ?? null) as HTMLElement | null;
    const sidebar = (fill?.querySelector('[class*="PuckLayout-rightSideBar"]') ??
      null) as HTMLElement | null;
    return { fill, sidebar };
  }, []);

  const measure = useCallback(() => {
    const { fill, sidebar } = els();
    let next: HandleBox | null = null;
    if (fill && sidebar) {
      const fr = fill.getBoundingClientRect();
      const sr = sidebar.getBoundingClientRect();
      // width < 2 ⇒ the panel is collapsed (grid track is 0) — hide the handle.
      if (sr.width >= 2) {
        next = { top: sr.top - fr.top, left: sr.left - fr.left, height: sr.height };
      }
    }
    if (!sameBox(boxRef.current, next)) {
      boxRef.current = next;
      setBox(next);
    }
  }, [els]);

  useEffect(() => {
    const { fill, sidebar } = els();
    // Restore the persisted width.
    const saved = Number(localStorage.getItem(STORAGE_KEY));
    if (fill && saved >= minWidth && saved <= maxWidth) {
      fill.style.setProperty('--puck-properties-width', `${saved}px`);
    }
    measure();
    const ro = new ResizeObserver(() => measure());
    if (fill) ro.observe(fill);
    if (sidebar) ro.observe(sidebar);
    window.addEventListener('resize', measure);
    // Re-measure periodically to track panel toggles / Puck remounts cheaply
    // (guarded setState means this only re-renders when geometry changes).
    const interval = window.setInterval(measure, 400);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
      window.clearInterval(interval);
    };
  }, [els, measure, minWidth, maxWidth]);

  const startDrag = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      const handle = ref.current;
      const { fill } = els();
      if (!fill || !handle) return;

      // Capture the pointer to the handle. The Puck canvas is an <iframe>;
      // without capture, moving the cursor over it routes pointermove/pointerup
      // to the iframe's document and the drag never ends. Capture forces every
      // pointer event to the handle regardless of what's underneath.
      try {
        handle.setPointerCapture(e.pointerId);
      } catch {
        /* ignore — capture is best-effort */
      }
      // Belt-and-suspenders: stop the iframe(s) from swallowing events too.
      const iframes = Array.from(
        fill.querySelectorAll('iframe')
      ) as HTMLIFrameElement[];
      iframes.forEach((f) => (f.style.pointerEvents = 'none'));

      const onMove = (ev: PointerEvent) => {
        const fr = fill.getBoundingClientRect();
        const w = Math.max(
          minWidth,
          Math.min(maxWidth, Math.round(fr.right - ev.clientX))
        );
        fill.style.setProperty('--puck-properties-width', `${w}px`);
        measure();
      };
      const onUp = (ev: PointerEvent) => {
        try {
          handle.releasePointerCapture(ev.pointerId);
        } catch {
          /* ignore */
        }
        iframes.forEach((f) => (f.style.pointerEvents = ''));
        const w = parseInt(
          fill.style.getPropertyValue('--puck-properties-width'),
          10
        );
        if (w) localStorage.setItem(STORAGE_KEY, String(w));
        handle.removeEventListener('pointermove', onMove);
        handle.removeEventListener('pointerup', onUp);
        handle.removeEventListener('pointercancel', onUp);
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
      };

      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'col-resize';
      // With pointer capture these fire on the handle even over the iframe.
      handle.addEventListener('pointermove', onMove);
      handle.addEventListener('pointerup', onUp);
      handle.addEventListener('pointercancel', onUp);
    },
    [els, measure, minWidth, maxWidth]
  );

  return (
    <div
      ref={ref}
      className="puck-props-resizer"
      onPointerDown={startDrag}
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize properties panel"
      style={
        box
          ? {
              position: 'absolute',
              top: box.top,
              left: box.left - 3,
              height: box.height,
              width: 7,
              cursor: 'col-resize',
              zIndex: 20,
              touchAction: 'none',
            }
          : { display: 'none' }
      }
    />
  );
};
