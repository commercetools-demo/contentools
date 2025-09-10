import React, { useMemo } from 'react';
import Stamp, { type TStampProps } from '@commercetools-uikit/stamp';
import { EStateType } from '@commercetools-demo/contentools-types';

type Props = {
  status: {
    draft?: any;
    published?: any;
  };
  minimal?: boolean;
};

const StateTag = ({
  status,
  minimal = false,
  ...props
}: Props & TStampProps) => {
  const statusText = useMemo(() => {
    if (!status) {
      return minimal ? 'D' : 'Draft';
    }

    if (status.draft && status.published) {
      return minimal ? 'DP' : 'Draft & Published';
    }

    if (status.draft) {
      return minimal ? 'D' : 'Draft';
    }

    return minimal ? 'P' : 'Published';
  }, [status]);

  const tone = useMemo(() => {
    if (!status) {
      return 'critical';
    }

    if (status.draft && status.published) {
      return 'warning'; // Using archived for "both" state
    }

    return status.draft ? 'information' : 'positive';
  }, [status]);
  return (
    <Stamp {...props} tone={tone}>
      {statusText}
    </Stamp>
  );
};

export const getStateType = (
  status?: {
    draft?: any;
    published?: any;
  } | null
): EStateType => {
  if (!status) {
    return EStateType.DRAFT;
  }

  if (status.draft && status.published) {
    return EStateType.BOTH;
  }

  if (status.draft) {
    return EStateType.DRAFT;
  }

  return EStateType.PUBLISHED;
};

export default StateTag;
