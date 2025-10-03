import { ContentTypeData } from '@commercetools-demo/contentools-types';
import DataTable, { TColumn } from '@commercetools-uikit/data-table';
import IconButton from '@commercetools-uikit/icon-button';
import { BinLinearIcon, EditIcon } from '@commercetools-uikit/icons';
import PrimaryButton from '@commercetools-uikit/primary-button';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import FlatButton from '@commercetools-uikit/flat-button';

type Props = {
  items: (ContentTypeData & { id: string })[];
  baseURL: string;
  businessUnitKey: string;
  error: string | null;
  onCreateNew: () => void;
  onEdit: (item: ContentTypeData) => void;
  onDelete: (key: string) => void;
  backButton?: {
    label: string;
    onClick: () => void;
    icon: React.ReactElement;
  };
};

const ContentTypeList = ({
  items,
  baseURL,
  businessUnitKey,
  error,
  onCreateNew,
  onEdit,
  onDelete,
  backButton,
}: Props) => {
  const columns: TColumn<ContentTypeData>[] = [
    {
      key: 'name',
      label: 'Name',
      renderItem: (row: ContentTypeData) => (
        <Text.Body>{row.metadata.name}</Text.Body>
      ),
    },
    {
      key: 'key',
      label: 'Key',
      renderItem: (row: ContentTypeData) => (
        <Text.Body truncate>{row.key}</Text.Body>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      renderItem: (row: ContentTypeData) => (
        <Spacings.Inline alignItems="center">
          <IconButton
            onClick={() => onEdit?.(row)}
            label="Edit"
            size="20"
            icon={<EditIcon />}
          >
            Edit
          </IconButton>
          <IconButton
            onClick={() => onDelete?.(row.key)}
            label="Delete"
            size="20"
            icon={<BinLinearIcon />}
          >
            Delete
          </IconButton>
        </Spacings.Inline>
      ),
    },
  ];
  return (
    <Spacings.Stack>
      {backButton && (
        <FlatButton
          onClick={backButton.onClick}
          label={backButton.label}
          icon={backButton.icon as any}
        >
          {backButton.label}
        </FlatButton>
      )}
      <Spacings.Inline alignItems="center" justifyContent="space-between">
        <Text.Headline as="h1">Content types</Text.Headline>
        <PrimaryButton onClick={onCreateNew} label="Create New" />
      </Spacings.Inline>

      <DataTable columns={columns} rows={items} />
    </Spacings.Stack>
  );
};

export default ContentTypeList;
