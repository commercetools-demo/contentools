import type { EContentType } from './enums';

export interface FetchVersionsEvent extends CustomEvent {
  detail: {
    key: string;
    contentType: EContentType;
  };
}

export interface SaveVersionEvent extends CustomEvent {
  detail: {
    item: any;
    previousItem: any;
    key: string;
    contentType: EContentType;
  };
}

export interface FetchStatesEvent extends CustomEvent {
  detail: {
    key: string;
    contentType: EContentType;
  };
}

export interface SaveDraftEvent extends CustomEvent {
  detail: {
    item: any;
    key: string;
    contentType: EContentType;
  };
}

export interface PublishEvent extends CustomEvent {
  detail: {
    item: any;
    key: string;
    contentType: EContentType;
    clearDraft?: boolean;
  };
}

export interface RevertEvent extends CustomEvent {
  detail: {
    key: string;
    contentType: EContentType;
  };
}
