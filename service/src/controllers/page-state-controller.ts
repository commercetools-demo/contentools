import { CONTENT_PAGE_CONTAINER, PAGE_STATE_CONTAINER } from '../constants';
import CustomError from '../errors/custom.error';
import { CustomObjectController } from './custom-object.controller';
import { Page } from './page.controller';

export interface PageState {
  key: string;
  businessUnitKey: string;
  states: Record<string, Page['value'] | undefined>;
}

export const getPageStatesWithWhereClause = async (
  whereClause: string,
  expand?: string[]
): Promise<PageState[]> => {
  const pageStateController = new CustomObjectController(
    PAGE_STATE_CONTAINER
  );
  const pageStates = await pageStateController.getCustomObjects(
    `value(${whereClause})`,
    expand
  );
  return pageStates.map((state) => state.value);
};

export const getState = async (key: string): Promise<PageState> => {
  const pageStateController = new CustomObjectController(
      PAGE_STATE_CONTAINER
  );
  const pageState = await pageStateController.getCustomObject(key);
  return pageState.value;
};

export const createDraftState = async (
  businessUnitKey: string,
  key: string,
  value: any
): Promise<PageState> => {
  const stateKey = `${businessUnitKey}_${key}`;
  let existingState: PageState;
  try {
    existingState = await getState(stateKey);
  } catch (error) {
    if ((error as any).statusCode === 404) {
      existingState = {
        key,
        businessUnitKey,
        states: {},
      };
    } else {
      throw new CustomError(500, 'Failed to create draft state'); 
    }
  }
  existingState.states = {
    ...existingState.states,
    draft: value,
  };

  const pageStateController = new CustomObjectController(
    PAGE_STATE_CONTAINER
  );
  const pageState = await pageStateController.updateCustomObject(
    stateKey,
    existingState
  );
  return pageState.value;
};

export const createPublishedState = async (
  businessUnitKey: string,
  key: string,
  value: any,
  clear?: boolean
): Promise<PageState> => {
  const stateKey = `${businessUnitKey}_${key}`;
  let existingState: PageState;
  try {
    existingState = await getState(stateKey);
  } catch (error) {
    if ((error as any).statusCode === 404) {
      existingState = {
        key,
        businessUnitKey,
        states: {},
      };
    } else {
      throw new CustomError(500, 'Failed to create published state');
    }
  }
  existingState.states = {
    ...existingState.states,
    published: value,
  };
  if (clear) {
    existingState.states = {
      ...existingState.states,
      draft: undefined,
    };
  }

  const pageStateController = new CustomObjectController(
    PAGE_STATE_CONTAINER
  );
  const pageState = await pageStateController.updateCustomObject(
    stateKey,
    existingState
  );
  return pageState.value;
};

export const deleteDraftState = async (
  businessUnitKey: string,
  key: string
): Promise<PageState> => {
  const stateKey = `${businessUnitKey}_${key}`;
  let existingState: PageState;
  try {
    existingState = await getState(stateKey);
  } catch (error) {
    if ((error as any).statusCode === 404) {
      existingState = {
        key,
        businessUnitKey,
        states: {},
      };
    } else {
      throw new CustomError(500, 'Failed to delete draft state');
    }
  }

  if (!existingState.states.published) {
    throw new CustomError(404, 'No published state found');
  }

  existingState.states = {
    ...existingState.states,
    draft: undefined,
  };

  const pageController = new CustomObjectController(
    CONTENT_PAGE_CONTAINER
  );

  const pageStateController = new CustomObjectController(
    PAGE_STATE_CONTAINER
  );
  await pageController.updateCustomObject(key, {
    ...existingState.states.published,
    businessUnitKey,
  });

  const contentState = await pageStateController.updateCustomObject(
    stateKey,
    existingState
  );
  return contentState.value;
};

export const deleteStates = async (
    businessUnitKey: string,
    key: string
): Promise<void> => {
  const stateKey = `${businessUnitKey}_${key}`;
  const contentStateController = new CustomObjectController(
    PAGE_STATE_CONTAINER
  );
  await contentStateController.deleteCustomObject(stateKey);
};
