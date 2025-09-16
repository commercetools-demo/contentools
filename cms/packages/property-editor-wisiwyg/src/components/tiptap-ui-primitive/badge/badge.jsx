import * as React from "react"
import { StyledBadge, StyledBadgeGroup } from "./styled"

export const Badge = React.forwardRef((
  {
    variant,
    size = "default",
    appearance = "default",
    trimText = false,
    className,
    children,
    ...props
  },
  ref
) => {
  return (
    <StyledBadge
      ref={ref}
      className={className}
      data-style={variant}
      data-size={size}
      data-appearance={appearance}
      data-text-trim={trimText ? "on" : "off"}
      {...props}>
      {children}
    </StyledBadge>
  );
})

export const BadgeGroup = React.forwardRef((
  {
    orientation = "horizontal",
    className,
    children,
    ...props
  },
  ref
) => {
  return (
    <StyledBadgeGroup
      ref={ref}
      className={className}
      data-orientation={orientation}
      {...props}>
      {children}
    </StyledBadgeGroup>
  );
})

BadgeGroup.displayName = "BadgeGroup"

Badge.displayName = "Badge"

export default Badge
