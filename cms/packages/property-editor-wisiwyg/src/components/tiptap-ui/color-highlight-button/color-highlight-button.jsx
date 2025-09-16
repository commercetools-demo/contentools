import * as React from "react"
import styled from "styled-components"

// --- Lib ---
import { parseShortcutKeys } from "../../../lib/tiptap-utils"

// --- Hooks ---
import { useTiptapEditor } from "../../../hooks/use-tiptap-editor"

import {
  COLOR_HIGHLIGHT_SHORTCUT_KEY,
  useColorHighlight,
} from "."

import { Button } from "../../tiptap-ui-primitive/button"
import { Badge } from "../../tiptap-ui-primitive/badge"

const StyledHighlightIndicator = styled.span`
  position: relative;
  width: 1.25rem;
  height: 1.25rem;
  margin: 0 -0.175rem;
  border-radius: var(--tt-radius-xl);
  background-color: var(--highlight-color);
  transition: transform 0.2s ease;

  &::after {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    border-radius: inherit;
    box-sizing: border-box;
    border: 1px solid var(--highlight-color);
    filter: brightness(95%);
    mix-blend-mode: multiply;

    .dark & {
      filter: brightness(140%);
      mix-blend-mode: lighten;
    }
  }

  /* Active state when parent button is active */
  [data-active-state="on"] & {
    &::after {
      filter: brightness(80%);
    }
    
    .dark & {
      &::after {
        filter: brightness(180%);
      }
    }
  }
`

export function ColorHighlightShortcutBadge({
  shortcutKeys = COLOR_HIGHLIGHT_SHORTCUT_KEY
}) {
  return <Badge>{parseShortcutKeys({ shortcutKeys })}</Badge>;
}

/**
 * Button component for applying color highlights in a Tiptap editor.
 *
 * For custom button implementations, use the `useColorHighlight` hook instead.
 */
export const ColorHighlightButton = React.forwardRef((
  {
    editor: providedEditor,
    highlightColor,
    text,
    hideWhenUnavailable = false,
    onApplied,
    showShortcut = false,
    onClick,
    children,
    style,
    ...buttonProps
  },
  ref
) => {
  const { editor } = useTiptapEditor(providedEditor)
  const {
    isVisible,
    canColorHighlight,
    isActive,
    handleColorHighlight,
    label,
    shortcutKeys,
  } = useColorHighlight({
    editor,
    highlightColor,
    label: text || `Toggle highlight (${highlightColor})`,
    hideWhenUnavailable,
    onApplied,
  })

  const handleClick = React.useCallback((event) => {
    onClick?.(event)
    if (event.defaultPrevented) return
    handleColorHighlight()
  }, [handleColorHighlight, onClick])

  const buttonStyle = React.useMemo(() =>
    ({
      ...style,
      "--highlight-color": highlightColor
    }), [highlightColor, style])

  if (!isVisible) {
    return null
  }

  return (
    <Button
      type="button"
      data-style="ghost"
      data-active-state={isActive ? "on" : "off"}
      role="button"
      tabIndex={-1}
      disabled={!canColorHighlight}
      data-disabled={!canColorHighlight}
      aria-label={label}
      aria-pressed={isActive}
      tooltip={label}
      onClick={handleClick}
      style={buttonStyle}
      {...buttonProps}
      ref={ref}>
      {children ?? (
        <>
          <StyledHighlightIndicator
            style={
              {
                "--highlight-color": highlightColor
              }
            } />
          {text && <span className="tiptap-button-text">{text}</span>}
          {showShortcut && (
            <ColorHighlightShortcutBadge shortcutKeys={shortcutKeys} />
          )}
        </>
      )}
    </Button>
  );
})

ColorHighlightButton.displayName = "ColorHighlightButton"
