import { IsPracticeRoundType } from '../RoundSettings.types';

export type RoundOptionsProps = IsPracticeRoundType & {
  'data-testid'?: string;
};

export type GetCheckboxes = {
  fieldName: string;
  'data-testid'?: string;
};
