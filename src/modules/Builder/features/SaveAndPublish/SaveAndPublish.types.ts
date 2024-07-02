import { Dispatch, SetStateAction } from 'react';

import {
  Condition,
  ConditionalLogic,
  ScoreReport,
  SectionCondition,
  SectionReport,
} from 'shared/state';
import { ActivityFormValues, ItemFormValues } from 'modules/Builder/types';
import { Encryption } from 'shared/utils';
import { SaveAndPublishSteps } from 'modules/Builder/components/Popups/SaveAndPublishProcessPopup/SaveAndPublishProcessPopup.types';
import { AppletPasswordRefType } from 'modules/Dashboard/features/Applet/Popups';

export type GetItemCommonFields = {
  id?: string;
  item: ItemFormValues;
  items: ItemFormValues[];
  conditionalLogic?: ConditionalLogic[];
};

export type GetSectionConditions = {
  items: ItemFormValues[];
  conditions?: SectionCondition[];
  scores?: ScoreReport[];
};

export type GetConditions = {
  items: ItemFormValues[];
  conditions?: (SectionCondition | Condition)[];
  score?: ScoreReport;
};

export type GetSection = {
  section: SectionReport;
  items: ActivityFormValues['items'];
  scores?: ScoreReport[];
  itemsObjectById: Record<string, ItemFormValues>;
};

export type SaveAndPublishSetup = {
  isPasswordPopupOpened: boolean;
  isPublishProcessPopupOpened: boolean;
  publishProcessStep: SaveAndPublishSteps | undefined;
  promptVisible: boolean;
  appletEncryption: Encryption | undefined;
  setIsPasswordPopupOpened: Dispatch<SetStateAction<boolean>>;
  handleSaveAndPublishFirstClick: () => Promise<void>;
  handleAppletPasswordSubmit: (ref?: AppletPasswordRefType) => Promise<void>;
  handlePublishProcessOnClose: () => void;
  handlePublishProcessOnRetry: () => Promise<void>;
  handleSaveChangesDoNotSaveSubmit: () => Promise<void>;
  handleSaveChangesSaveSubmit: () => void;
  cancelNavigation: () => void;
};
