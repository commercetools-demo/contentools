import * as React from "react"

// --- Tiptap UI Primitive ---
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../tooltip"

// --- Lib ---
import { parseShortcutKeys } from "../../../lib/tiptap-utils"

// --- Styled Components ---
import { StyledButton, StyledButtonGroup } from "./styled"

export const ShortcutDisplay = ({
  shortcuts,
}) => {
  if (shortcuts.length === 0) return null

  return (
    <div>
      {shortcuts.map((key, index) => (
        <React.Fragment key={index}>
          {index > 0 && <kbd>+</kbd>}
          <kbd>{key}</kbd>
        </React.Fragment>
      ))}
    </div>
  );
}

export const Button = React.forwardRef((
  {
    className,
    children,
    tooltip,
    showTooltip = true,
    shortcutKeys,
    "aria-label": ariaLabel,
    ...props
  },
  ref
) => {
  const shortcuts = React.useMemo(() => parseShortcutKeys({ shortcutKeys }), [shortcutKeys])

  if (!tooltip || !showTooltip) {
    return (
      <StyledButton
        className={className}
        ref={ref}
        aria-label={ariaLabel}
        {...props}>
        {children}
      </StyledButton>
    );
  }

  return (
    <Tooltip delay={200}>
      <TooltipTrigger
        asChild
        className={className}
        ref={ref}
        aria-label={ariaLabel}
        {...props}>
        <StyledButton>
          {children}
        </StyledButton>
      </TooltipTrigger>
      <TooltipContent>
        {tooltip}
        <ShortcutDisplay shortcuts={shortcuts} />
      </TooltipContent>
    </Tooltip>
  );
})

Button.displayName = "Button"

export const ButtonGroup = React.forwardRef(({ className, children, orientation = "vertical", ...props }, ref) => {
  return (
    <StyledButtonGroup
      ref={ref}
      className={className}
      data-orientation={orientation}
      role="group"
      {...props}>
      {children}
    </StyledButtonGroup>
  );
})
ButtonGroup.displayName = "ButtonGroup"

export default Button
