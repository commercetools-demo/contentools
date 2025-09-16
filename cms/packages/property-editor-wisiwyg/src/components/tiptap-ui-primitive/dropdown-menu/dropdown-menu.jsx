import * as React from "react"
import styled from "styled-components"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"

const StyledDropdownMenu = styled.div`
  --tt-dropdown-menu-bg-color: var(--white);
  --tt-dropdown-menu-border-color: var(--tt-gray-light-a-100);
  --tt-dropdown-menu-text-color: var(--tt-gray-light-a-600);
  
  .dark & {
    --tt-dropdown-menu-border-color: var(--tt-gray-dark-a-50);
    --tt-dropdown-menu-bg-color: var(--tt-gray-dark-50);
    --tt-dropdown-menu-text-color: var(--tt-gray-dark-a-600);
  }
  
  z-index: 1001;
  outline: none;
  transform-origin: var(--radix-dropdown-menu-content-transform-origin);
  max-height: var(--radix-dropdown-menu-content-available-height);
  
  > * {
    max-height: var(--radix-dropdown-menu-content-available-height);
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

function DropdownMenu({
  ...props
}) {
  return <DropdownMenuPrimitive.Root modal={false} {...props} />;
}

function DropdownMenuPortal({
  ...props
}) {
  return <DropdownMenuPrimitive.Portal {...props} />;
}

const DropdownMenuTrigger = React.forwardRef(
  ({ ...props }, ref) => <DropdownMenuPrimitive.Trigger ref={ref} {...props} />
)
DropdownMenuTrigger.displayName = DropdownMenuPrimitive.Trigger.displayName

const DropdownMenuGroup = DropdownMenuPrimitive.Group

const DropdownMenuSub = DropdownMenuPrimitive.Sub

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

const DropdownMenuItem = DropdownMenuPrimitive.Item

const DropdownMenuSubTrigger = DropdownMenuPrimitive.SubTrigger

const DropdownMenuSubContent = React.forwardRef(({ className, portal = true, ...props }, ref) => {
  const content = (
    <StyledDropdownMenu as={DropdownMenuPrimitive.SubContent} ref={ref} className={className} {...props} />
  )

  return portal ? (
    <DropdownMenuPortal {...(typeof portal === "object" ? portal : {})}>
      {content}
    </DropdownMenuPortal>
  ) : (
    content
  );
})
DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName

const DropdownMenuContent = React.forwardRef(({ className, sideOffset = 4, portal = false, ...props }, ref) => {
  const content = (
    <StyledDropdownMenu
      as={DropdownMenuPrimitive.Content}
      ref={ref}
      sideOffset={sideOffset}
      onCloseAutoFocus={(e) => e.preventDefault()}
      className={className}
      {...props} />
  )

  return portal ? (
    <DropdownMenuPortal {...(typeof portal === "object" ? portal : {})}>
      {content}
    </DropdownMenuPortal>
  ) : (
    content
  );
})
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuPortal,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
}
