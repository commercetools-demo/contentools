import React, { useCallback } from 'react';
import { StringField } from './components/string-field';
import { PropertyEditorFormValues } from '.';
import { useFormikContext } from 'formik';
import { DateTimeField } from './components/date-field';
import styled from 'styled-components';
import Spacings from '@commercetools-uikit/spacings';

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 10px;
`;

type Props = {
  diff: string[];
  onChange: (key: string, value: string) => void;
};

const GeneralPropertyFields = ({ diff, onChange }: Props) => {
  const { values, errors, touched, setFieldValue } =
    useFormikContext<PropertyEditorFormValues>();

  const handleChange = useCallback(
    (key: string, value: string) => {
      setFieldValue(key, value);
      onChange(key, value);
    },
    [setFieldValue]
  );
  return (
    <Spacings.Stack scale="xs">
      <StringField
        fieldKey="name"
        label="Name"
        value={values.name}
        highlight={diff.includes('name')}
        required
        onFieldChange={(value) => handleChange('name', value)}
        error={
          touched.name && errors.name
            ? typeof errors.name === 'string'
              ? errors.name
              : JSON.stringify(errors.name)
            : undefined
        }
      />
      <StyledDiv>
        <DateTimeField
          fieldKey="startDate"
          label="Start Date"
          value={values.startDate}
          highlight={diff.includes('startDate')}
          onFieldChange={(value) => handleChange('startDate', value)}
        />
        <DateTimeField
          fieldKey="endDate"
          label="End Date"
          value={values.endDate}
          highlight={diff.includes('endDate')}
          onFieldChange={(value) => handleChange('endDate', value)}
        />
      </StyledDiv>
      
    </Spacings.Stack>
  );
};

export default GeneralPropertyFields;
