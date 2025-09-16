import * as React from "react"
import styled from "styled-components"

const StyledSeparator = styled.div`
  --tt-link-border-color: var(--tt-gray-light-a-200);
  
  .dark & {
    --tt-link-border-color: var(--tt-gray-dark-a-200);
  }
  
  flex-shrink: 0;
  background-color: var(--tt-link-border-color);

  &[data-orientation="horizontal"] {
    height: 1px;
    width: 100%;
    margin: 0.5rem 0;
  }

  &[data-orientation="vertical"] {
    height: 1.5rem;
    width: 1px;
  }
`

export const Separator = React.forwardRef(
  ({ decorative, orientation = "vertical", className, ...divProps }, ref) => {
    const ariaOrientation = orientation === "vertical" ? orientation : undefined
    const semanticProps = decorative
      ? { role: "none" }
      : { "aria-orientation": ariaOrientation, role: "separator" }

    return (
      <StyledSeparator
        className={className}
        data-orientation={orientation}
        {...semanticProps}
        {...divProps}
        ref={ref} />
    );
  }
)

Separator.displayName = "Separator"
