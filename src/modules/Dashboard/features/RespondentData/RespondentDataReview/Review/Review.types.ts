import { Activity, Item } from 'shared/state';

import { Response } from '../RespondentDataReview.types';

export type ReviewProps = {
  response: Response | null;
  activity: Activity;
};

export type ResponseItemProps = {
  item: Item;
  response: Record<string, string | number>;
};
