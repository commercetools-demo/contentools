import * as React from "react"
import styled from "styled-components"
import { Separator } from "../separator"
import { useMenuNavigation } from "../../../hooks/use-menu-navigation"
import { useComposedRef } from "../../../hooks/use-composed-ref"

const StyledToolbar = styled.div`
  --tt-toolbar-height: 2.75rem;
  --tt-safe-area-bottom: env(safe-area-inset-bottom, 0px);
  --tt-toolbar-bg-color: var(--white);
  --tt-toolbar-border-color: var(--tt-gray-light-a-100);
  
  .dark & {
    --tt-toolbar-bg-color: var(--black);
    --tt-toolbar-border-color: var(--tt-gray-dark-a-50);
  }
  
  display: flex;
  align-items: center;
  gap: 0.25rem;
  
  &[data-variant="fixed"] {
    position: sticky;
    top: 0;
    z-index: 1001;
    width: 100%;
    min-height: var(--tt-toolbar-height);
    background: var(--tt-toolbar-bg-color);
    border-bottom: 1px solid var(--tt-toolbar-border-color);
    padding: 0 0.5rem;
    overflow-x: auto;
    overscroll-behavior-x: contain;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    -ms-overflow-style: none;
    
    &::-webkit-scrollbar {
      display: none;
    }
    
    @media (max-width: 480px) {
      position: absolute;
      top: auto;
      height: calc(var(--tt-toolbar-height) + var(--tt-safe-area-bottom));
      border-top: 1px solid var(--tt-toolbar-border-color);
      border-bottom: none;
      padding: 0 0.5rem var(--tt-safe-area-bottom);
      flex-wrap: nowrap;
      justify-content: flex-start;
      
      .tiptap-toolbar-group {
        flex: 0 0 auto;
      }
    }
  }
  
  &[data-variant="floating"] {
    --tt-toolbar-padding: 0.125rem;
    --tt-toolbar-border-width: 1px;
    
    padding: 0.188rem;
    border-radius: calc(var(--tt-toolbar-padding) + var(--tt-radius-lg) + var(--tt-toolbar-border-width));
    border: var(--tt-toolbar-border-width) solid var(--tt-toolbar-border-color);
    background-color: var(--tt-toolbar-bg-color);
    box-shadow: var(--tt-shadow-elevated-md);
    outline: none;
    overflow: hidden;
    
    &[data-plain="true"] {
      padding: 0;
      border-radius: 0;
      border: none;
      box-shadow: none;
      background-color: transparent;
    }
    
    @media screen and (max-width: 480px) {
      width: 100%;
      border-radius: 0;
      border: none;
      box-shadow: none;
    }
  }
`

const StyledToolbarGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.125rem;
  
  &:empty {
    display: none;
  }
  
  &:empty + *[role="separator"],
  *[role="separator"] + &:empty {
    display: none;
  }
`

const useToolbarNavigation = (
  toolbarRef
) => {
  const [items, setItems] = React.useState([])

  const collectItems = React.useCallback(() => {
    if (!toolbarRef.current) return []
    return Array.from(toolbarRef.current.querySelectorAll(
      'button:not([disabled]), [role="button"]:not([disabled]), [tabindex="0"]:not([disabled])'
    ));
  }, [toolbarRef])

  React.useEffect(() => {
    const toolbar = toolbarRef.current
    if (!toolbar) return

    const updateItems = () => setItems(collectItems())

    updateItems()
    const observer = new MutationObserver(updateItems)
    observer.observe(toolbar, { childList: true, subtree: true })

    return () => observer.disconnect();
  }, [collectItems, toolbarRef])

  const { selectedIndex } = useMenuNavigation({
    containerRef: toolbarRef,
    items,
    orientation: "horizontal",
    onSelect: (el) => el.click(),
    autoSelectFirstItem: false,
  })

  React.useEffect(() => {
    const toolbar = toolbarRef.current
    if (!toolbar) return

    const handleFocus = (e) => {
      const target = e.target
      if (toolbar.contains(target))
        target.setAttribute("data-focus-visible", "true")
    }

    const handleBlur = (e) => {
      const target = e.target
      if (toolbar.contains(target)) target.removeAttribute("data-focus-visible")
    }

    toolbar.addEventListener("focus", handleFocus, true)
    toolbar.addEventListener("blur", handleBlur, true)

    return () => {
      toolbar.removeEventListener("focus", handleFocus, true)
      toolbar.removeEventListener("blur", handleBlur, true)
    };
  }, [toolbarRef])

  React.useEffect(() => {
    if (selectedIndex !== undefined && items[selectedIndex]) {
      items[selectedIndex].focus()
    }
  }, [selectedIndex, items])
}

export const Toolbar = React.forwardRef(({ children, className, variant = "fixed", ...props }, ref) => {
  const toolbarRef = React.useRef(null)
  const composedRef = useComposedRef(toolbarRef, ref)
  useToolbarNavigation(toolbarRef)

  return (
    <StyledToolbar
      ref={composedRef}
      role="toolbar"
      aria-label="toolbar"
      data-variant={variant}
      className={className}
      {...props}>
      {children}
    </StyledToolbar>
  );
})
Toolbar.displayName = "Toolbar"

export const ToolbarGroup = React.forwardRef(({ children, className, ...props }, ref) => (
  <StyledToolbarGroup
    ref={ref}
    role="group"
    className={className}
    {...props}>
    {children}
  </StyledToolbarGroup>
))
ToolbarGroup.displayName = "ToolbarGroup"

export const ToolbarSeparator = React.forwardRef(({ ...props }, ref) => (
  <Separator ref={ref} orientation="vertical" decorative {...props} />
))
ToolbarSeparator.displayName = "ToolbarSeparator"
