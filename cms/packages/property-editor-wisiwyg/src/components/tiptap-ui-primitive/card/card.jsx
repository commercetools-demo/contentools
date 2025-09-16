"use client"

import * as React from "react"
import styled from "styled-components"

const StyledCard = styled.div`
  --tiptap-card-bg-color: var(--white);
  --tiptap-card-border-color: var(--tt-gray-light-a-100);
  --tiptap-card-group-label-color: var(--tt-gray-light-a-800);
  --padding: 0.375rem;
  --border-width: 1px;
  
  .dark & {
    --tiptap-card-bg-color: var(--tt-gray-dark-50);
    --tiptap-card-border-color: var(--tt-gray-dark-a-100);
    --tiptap-card-group-label-color: var(--tt-gray-dark-a-800);
  }
  
  border-radius: calc(var(--padding) + var(--tt-radius-lg));
  box-shadow: var(--tt-shadow-elevated-md);
  background-color: var(--tiptap-card-bg-color);
  border: 1px solid var(--tiptap-card-border-color);
  display: flex;
  flex-direction: column;
  outline: none;
  align-items: center;
  position: relative;
  min-width: 0;
  word-wrap: break-word;
  background-clip: border-box;
`

const StyledCardHeader = styled.div`
  padding: 0.375rem;
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  border-bottom: var(--border-width) solid var(--tiptap-card-border-color);
`

const StyledCardBody = styled.div`
  padding: 0.375rem;
  flex: 1 1 auto;
  overflow-y: auto;
`

const StyledCardItemGroup = styled.div`
  position: relative;
  display: flex;
  vertical-align: middle;
  min-width: max-content;
  
  &[data-orientation="vertical"] {
    flex-direction: column;
    justify-content: center;
  }
  
  &[data-orientation="horizontal"] {
    gap: 0.25rem;
    flex-direction: row;
    align-items: center;
  }
`

const StyledCardGroupLabel = styled.div`
  padding-top: 0.75rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  padding-bottom: 0.25rem;
  line-height: normal;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
  color: var(--tiptap-card-group-label-color);
`

const StyledCardFooter = styled.div`
  padding: 0.375rem;
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  border-top: var(--border-width) solid var(--tiptap-card-border-color);
`

const Card = React.forwardRef(({ className, ...props }, ref) => {
  return <StyledCard ref={ref} className={className} {...props} />;
})
Card.displayName = "Card"

const CardHeader = React.forwardRef(({ className, ...props }, ref) => {
  return (<StyledCardHeader ref={ref} className={className} {...props} />);
})
CardHeader.displayName = "CardHeader"

const CardBody = React.forwardRef(({ className, ...props }, ref) => {
  return (<StyledCardBody ref={ref} className={className} {...props} />);
})
CardBody.displayName = "CardBody"

const CardItemGroup = React.forwardRef(({ className, orientation = "vertical", ...props }, ref) => {
  return (
    <StyledCardItemGroup
      ref={ref}
      data-orientation={orientation}
      className={className}
      {...props} />
  );
})
CardItemGroup.displayName = "CardItemGroup"

const CardGroupLabel = React.forwardRef(({ className, ...props }, ref) => {
  return (<StyledCardGroupLabel ref={ref} className={className} {...props} />);
})
CardGroupLabel.displayName = "CardGroupLabel"

const CardFooter = React.forwardRef(({ className, ...props }, ref) => {
  return (<StyledCardFooter ref={ref} className={className} {...props} />);
})
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardBody, CardItemGroup, CardGroupLabel }
