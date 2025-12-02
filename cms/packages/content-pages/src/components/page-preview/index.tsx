import { PageRenderer } from '@commercetools-demo/contentools-page-renderer';
import { Page } from '@commercetools-demo/contentools-types';
import { Modal } from '@commercetools-demo/contentools-ui-components';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentPage: Page | null;
  baseURL: string;
  businessUnitKey: string;
}

const PagePreview = ({
  isOpen,
  onClose,
  currentPage,
  baseURL,
  businessUnitKey,
}: Props) => {
  if (!currentPage) {
    return null;
  }
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Page Preview" size={90}>
      <PageRenderer
        page={currentPage}
        baseURL={baseURL}
        businessUnitKey={businessUnitKey}
      />
    </Modal>
  );
};

export default PagePreview;
