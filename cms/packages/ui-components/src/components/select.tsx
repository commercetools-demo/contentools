import React from 'react';
import styled from 'styled-components';

type Props = React.SelectHTMLAttributes<HTMLSelectElement> & {
  options: {
    label: string;
    value: string;
  }[];
};

const Select = styled.select`
  height: 40px;
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  font-size: 14px;
`;

const SelectInput = (props: Props) => {
  return (
    <Select {...props}>
      {props.options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Select>
  );
};

export default SelectInput;
