import React, { useCallback } from 'react';
import { StringField } from './components/string-field';
import { PropertyEditorFormValues } from '.';
import { useFormikContext } from 'formik';

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
    <div>
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
    </div>
  );
};

export default GeneralPropertyFields;
