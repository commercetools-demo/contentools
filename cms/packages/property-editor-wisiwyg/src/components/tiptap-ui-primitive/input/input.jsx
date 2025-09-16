import * as React from "react"
import styled from "styled-components"

const StyledInput = styled.input`
  --tiptap-input-placeholder: var(--tt-gray-light-a-400);
  
  .dark & {
    --tiptap-input-placeholder: var(--tt-gray-dark-a-400);
  }
  
  display: block;
  width: 100%;
  height: 2rem;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  padding: 0.375rem 0.5rem;
  border-radius: 0.375rem;
  background: none;
  appearance: none;
  outline: none;

  &::placeholder {
    color: var(--tiptap-input-placeholder);
  }

  ${props => props.$clamp && `
    min-width: 12rem;
    padding-right: 0;
    text-overflow: ellipsis;
    white-space: nowrap;

    &:focus {
      text-overflow: clip;
      overflow: visible;
    }
  `}
`

const StyledInputGroup = styled.div`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
`

function Input({
  className,
  type,
  clamp,
  ...props
}) {
  return <StyledInput type={type} className={className} $clamp={clamp} {...props} />;
}

function InputGroup({
  className,
  children,
  ...props
}) {
  return (
    <StyledInputGroup className={className} {...props}>
      {children}
    </StyledInputGroup>
  );
}

export { Input, InputGroup }
