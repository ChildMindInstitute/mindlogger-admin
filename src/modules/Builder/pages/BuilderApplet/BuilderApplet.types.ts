import { Condition, Item, ScoreReport } from 'shared/state';

export type GetSectionConditions = {
  items?: Item[];
  conditions?: Condition[];
  scores?: ScoreReport[];
};
