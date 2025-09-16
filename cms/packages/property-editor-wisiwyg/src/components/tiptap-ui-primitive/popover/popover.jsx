import * as React from "react"
import styled from "styled-components"
import * as PopoverPrimitive from "@radix-ui/react-popover"

const StyledPopover = styled.div`
  --tt-popover-bg-color: var(--white);
  --tt-popover-border-color: var(--tt-gray-light-a-100);
  --tt-popover-text-color: var(--tt-gray-light-a-600);
  
  .dark & {
    --tt-popover-border-color: var(--tt-gray-dark-a-50);
    --tt-popover-bg-color: var(--tt-gray-dark-50);
    --tt-popover-text-color: var(--tt-gray-dark-a-600);
  }
  
  z-index: 1001;
  outline: none;
  transform-origin: var(--radix-popover-content-transform-origin);
  max-height: var(--radix-popover-content-available-height);
  
  > * {
    max-height: var(--radix-popover-content-available-height);
  }
  
  &[data-state="open"] {
    animation: fadeIn 150ms cubic-bezier(0.16, 1, 0.3, 1), zoomIn 150ms cubic-bezier(0.16, 1, 0.3, 1);
  }
  
  &[data-state="closed"] {
    animation: fadeOut 150ms cubic-bezier(0.16, 1, 0.3, 1), zoomOut 150ms cubic-bezier(0.16, 1, 0.3, 1);
  }
  
  &[data-side="top"],
  &[data-side="top-start"],
  &[data-side="top-end"] {
    animation: slideFromBottom 150ms cubic-bezier(0.16, 1, 0.3, 1);
  }
  
  &[data-side="right"],
  &[data-side="right-start"],
  &[data-side="right-end"] {
    animation: slideFromLeft 150ms cubic-bezier(0.16, 1, 0.3, 1);
  }
  
  &[data-side="bottom"],
  &[data-side="bottom-start"],
  &[data-side="bottom-end"] {
    animation: slideFromTop 150ms cubic-bezier(0.16, 1, 0.3, 1);
  }
  
  &[data-side="left"],
  &[data-side="left-start"],
  &[data-side="left-end"] {
    animation: slideFromRight 150ms cubic-bezier(0.16, 1, 0.3, 1);
  }
`

function Popover({
  ...props
}) {
  return <PopoverPrimitive.Root {...props} />;
}

function PopoverTrigger({
  ...props
}) {
  return <PopoverPrimitive.Trigger {...props} />;
}

function PopoverContent({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}) {
  return (
    <PopoverPrimitive.Portal>
      <StyledPopover
        as={PopoverPrimitive.Content}
        align={align}
        sideOffset={sideOffset}
        className={className}
        {...props} />
    </PopoverPrimitive.Portal>
  );
}

export { Popover, PopoverTrigger, PopoverContent }
