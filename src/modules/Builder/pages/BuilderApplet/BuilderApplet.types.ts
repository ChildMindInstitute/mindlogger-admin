import { Condition, Item, ScoreReport } from 'shared/state';

export type GetSectionConditions = {
  items?: Item[];
  conditions?: Condition[];
  scores?: ScoreReport[];
};

export type GetMessageItem = {
  name: string;
  question: string;
  order?: number;
};
