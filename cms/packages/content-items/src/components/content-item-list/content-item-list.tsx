import { ContentItem, StateInfo } from "@commercetools-demo/cms-types";
import DataTable, { TColumn, TRow } from "@commercetools-uikit/data-table";
import IconButton from "@commercetools-uikit/icon-button";
import {
    BinLinearIcon,
    CopyIcon,
    EditIcon,
    ExternalLinkIcon,
} from "@commercetools-uikit/icons";
import PrimaryButton from "@commercetools-uikit/primary-button";
import Stamp from "@commercetools-uikit/stamp";
import React from "react";
import styles from "./content-item-list.module.css";
import Spacings from "@commercetools-uikit/spacings";

interface ContentItemListProps {
  items: ContentItem[];
  states: Record<string, StateInfo>;
  baseURL: string;
  businessUnitKey: string;
  loading?: boolean;
  error?: string | null;
  onCreateNew?: () => void;
  onEdit?: (item: ContentItem) => void;
  onDelete?: (key: string) => void;
}

type ContentItemRow = TRow & ContentItem;

const formatStatus = (status?: StateInfo): string => {
  if (!status) {
    return "Draft";
  }

  if (status.draft && status.published) {
    return "Draft & Published";
  }

  if (status.draft) {
    return "Draft";
  }

  return "Published";
};

const formatTone = (status?: StateInfo) => {
  if (!status) {
    return "critical";
  }

  if (status.draft && status.published) {
    return "warning"; // Using archived for "both" state
  }

  return status.draft ? "information" : "positive";
};

export const ContentItemList: React.FC<ContentItemListProps> = ({
  items,
  states,
  baseURL,
  businessUnitKey,
  loading = false,
  error = null,
  onCreateNew,
  onEdit,
  onDelete,
}) => {
  const handleCopy = (item: ContentItem) => {
    navigator.clipboard.writeText(item.key);
    alert("Item ID copied to clipboard");
  };

  const handleJson = (item: ContentItem) => {
    window.open(
      `${baseURL}/${businessUnitKey}/published/content-items/${item.key}`,
      "_blank"
    );
  };

  const columns: TColumn<ContentItemRow>[] = [
    {
      key: "name",
      label: "Name",
    },
    {
      key: "type",
      label: "Type",
    },
    {
      key: "slot",
      label: "Slot",
      renderItem: (row: ContentItemRow) => row.properties?.slot || "-",
    },
    {
      key: "status",
      label: "Status",
      renderItem: (row: ContentItemRow) => (
        <Stamp tone={formatTone(states[row.key])}>
          {formatStatus(states[row.key])}
        </Stamp>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      renderItem: (row: ContentItemRow) => (
        <Spacings.Inline alignItems="center">
          <IconButton
            onClick={() => onEdit?.(row)}
            label="Edit"
            icon={<EditIcon />}
          >
            Edit
          </IconButton>
          <IconButton
            onClick={() => onDelete?.(row.key)}
            label="Delete"
            icon={<BinLinearIcon />}
          >
            Delete
          </IconButton>
          <IconButton
            onClick={() => handleCopy(row)}
            label="Copy ID"
            icon={<CopyIcon />}
          >
            Copy ID
          </IconButton>
          <IconButton
            onClick={() => handleJson(row)}
            label="Open JSON"
            icon={<ExternalLinkIcon />}
          >
            Open JSON
          </IconButton>
        </Spacings.Inline>
      ),
    },
  ];

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <Spacings.Stack>
      <Spacings.Inline alignItems="center" justifyContent="space-between">
        <h1 className={styles.title}>Content Items</h1>
        <PrimaryButton onClick={onCreateNew} label="Create New" />
      </Spacings.Inline>

      <DataTable columns={columns} rows={items} />
    </Spacings.Stack>
  );
};
