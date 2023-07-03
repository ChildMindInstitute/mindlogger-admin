import { ActivityResponse } from '../Report.types';

export const enum SubscalesTypes {
  Table = 'Table',
}

export type SubscaleScore = {
  label: string;
  score: number;
};

export type AdditionalInformation = {
  description?: string;
};

export type Subscale = {
  id: string;
  type?: SubscalesTypes;
  name?: string;
  items?: Subscale[];
  additionalInformation?: AdditionalInformation;
};

export type SubscalesProps = {
  answers: ActivityResponse[];
};

export type ParsedSubscales = {
  subscales: { [key: string]: { score: number; optionText: string } };
  totalScore: { score?: number; optionText?: string };
};
