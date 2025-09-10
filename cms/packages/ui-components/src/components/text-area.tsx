import React from 'react';
import styled from 'styled-components';

const StyledTextArea = styled.textarea`
  width: 100%;
  height: 100%;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 8px;
  font-size: 14px;
  box-sizing: border-box;
`;

type Props = {
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  hasError: boolean;
  minRows: number;
  maxRows: number;
  placeholder: string;
};

const MultilineTextInput = ({
  id,
  name,
  value,
  onChange,
  hasError,
  minRows,
  maxRows,
  placeholder,
  ...props
}: Props) => {
  return (
    <StyledTextArea
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      rows={minRows}
      placeholder={placeholder}
      {...props}
    />
  );
};

export default MultilineTextInput;
