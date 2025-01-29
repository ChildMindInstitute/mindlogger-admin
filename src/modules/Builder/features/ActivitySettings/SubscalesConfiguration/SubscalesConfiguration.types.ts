import { SubscaleFormValue } from 'modules/Builder/types';
import { AgeFieldType } from 'redux/modules';

export const enum SubscaleColumns {
  Name = 'name',
}

export const enum SharedElementColumns {
  Element = 'element',
  Subscale = 'subscale',
}

export type ItemElement = {
  id: string;
  [SubscaleColumns.Name]: string;
};

export type SubscaleContentProps = {
  subscaleId: string;
  name: string;
  notUsedElements: ItemElement[];
  'data-testid'?: string;
};

export type UseSubscalesSystemItemsSetupProps = {
  subscales: SubscaleFormValue[];
  ageFieldType: AgeFieldType;
  isAgeVisible: boolean;
  isGenderVisible: boolean;
};
