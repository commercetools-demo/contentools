import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useStatePages } from '@commercetools-demo/contentools-state';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import TextInput from '@commercetools-uikit/text-input';
import PrimaryButton from '@commercetools-uikit/primary-button';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import Card from '@commercetools-uikit/card';
import FieldLabel from '@commercetools-uikit/field-label';
import styled from 'styled-components';
import {
  Modal,
  useModalState,
} from '@commercetools-demo/contentools-ui-components';
import { Formik, Form } from 'formik';

interface Props {
  parentUrl: string;
  baseURL: string;
  businessUnitKey: string;
  locale: string;
}

const Container = styled.div`
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 24px;
`;

const FormContainer = styled.div`
  padding: 24px;
`;

const Actions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #007acc;
  cursor: pointer;
  font-size: 14px;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

type FormValues = {
  name: string;
  route: string;
};

const PagesNew: React.FC<Props> = ({
  parentUrl,
  baseURL,
  businessUnitKey,
  locale,
}) => {
  const history = useHistory();
  const { createEmptyPage, loading } = useStatePages()!;
  const pageModalState = useModalState(true);

  const hydratedUrl = `${baseURL}/${businessUnitKey}`;

  const initialValues: FormValues = {
    name: '',
    route: '',
  };

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleBack = () => {
    history.push(`/${parentUrl}`);
  };

  const handleClose = () => {
    pageModalState.closeModal();
    history.goBack();
  };

  const validateForm = (values: FormValues) => {
    const newErrors: { [key: string]: string } = {};

    if (!values.name.trim()) {
      newErrors.name = 'Page name is required';
    }

    if (!values.route.trim()) {
      newErrors.route = 'Route is required';
    } else if (!values.route.startsWith('/')) {
      newErrors.route = 'Route must start with /';
    }
    return newErrors;
  };

  const handleSubmit = async (values: FormValues) => {
    console.log(values);

    try {
      const newPage = await createEmptyPage(
        hydratedUrl,
        {
          name: values.name,
          route: values.route,
        },
        businessUnitKey
      );

      // Navigate to edit mode
      // Note: We'll use the route as key for now, this should be the actual page key in real implementation
      history.push(`/${parentUrl}/edit/${newPage.key}`);
    } catch (error) {
      console.error('Failed to create page:', error);
      // Handle error - could show a toast or error message
    }
  };

  return (
    <Modal
      isOpen={pageModalState.isModalOpen}
      onClose={handleClose}
      title="Select Content Type"
      size={30}
    >
      <FormContainer>
        <Formik
          onSubmit={handleSubmit}
          initialValues={initialValues}
          validate={validateForm}
        >
          {(formikProps) => (
            <Spacings.Stack scale="m">
              <Spacings.Stack scale="xs" alignItems="flex-start">
                <FieldLabel
                  title="Page Name"
                  hint="Display name for this page"
                  hasRequiredIndicator
                />
                <TextInput
                  value={formikProps.values.name}
                  name="name"
                  onChange={formikProps.handleChange}
                  placeholder="Enter page name"
                  hasError={!!formikProps.errors.name}
                />
                {formikProps.errors.name && (
                  <Text.Detail tone="critical">
                    {formikProps.errors.name}
                  </Text.Detail>
                )}
              </Spacings.Stack>

              <Spacings.Stack scale="xs" alignItems="flex-start">
                <FieldLabel
                  title="Route"
                  hint="URL path for this page (e.g., /home, /about)"
                  hasRequiredIndicator
                />
                <TextInput
                  value={formikProps.values.route}
                  name="route"
                  onChange={formikProps.handleChange}
                  placeholder="/page-route"
                  hasError={!!formikProps.errors.route}
                />
                {formikProps.errors.route && (
                  <Text.Detail tone="critical">
                    {formikProps.errors.route}
                  </Text.Detail>
                )}
              </Spacings.Stack>

              <Actions>
                <SecondaryButton
                  label="Cancel"
                  onClick={handleBack}
                  isDisabled={loading}
                />
                <PrimaryButton
                  type="button"
                  onClick={() => formikProps.handleSubmit()}
                  label="Create Page"
                  isDisabled={
                    loading || formikProps.isSubmitting || !formikProps.dirty
                  }
                />
              </Actions>
            </Spacings.Stack>
          )}
        </Formik>
      </FormContainer>
    </Modal>
  );
};

export default PagesNew;
