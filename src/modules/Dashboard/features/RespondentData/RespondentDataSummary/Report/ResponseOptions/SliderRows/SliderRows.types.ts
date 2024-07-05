import { Version } from 'api';
import {
  FormattedActivityItem,
  SliderRowsAnswer,
  SliderRowsItemResponseValues,
} from 'modules/Dashboard/features/RespondentData/RespondentData.types';

export type SliderRowsProps = {
  color: string;
  minDate: Date;
  maxDate: Date;
  activityItem: FormattedActivityItem<SliderRowsItemResponseValues>;
  answers?: SliderRowsAnswer;
  versions: Version[];
  isStaticActive?: boolean;
  'data-testid'?: string;
};
