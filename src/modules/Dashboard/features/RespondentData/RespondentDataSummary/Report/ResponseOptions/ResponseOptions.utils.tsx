import { ItemResponseType } from 'shared/consts';

import { MultiScatterChart } from '../Charts';
import { ReportTable } from '../ReportTable';
import { GetResponseOptionsProps, MultiScatterResponseValues } from './ResponseOptions.types';

export const getResponseItem = ({
  minDate,
  maxDate,
  activityItem,
  versions,
  answers = [],
}: GetResponseOptionsProps) => {
  const responseType = activityItem.responseType;

  switch (responseType) {
    case ItemResponseType.SingleSelection:
    case ItemResponseType.MultipleSelection:
      return (
        <MultiScatterChart
          minDate={minDate}
          maxDate={maxDate}
          responseValues={activityItem.responseValues as MultiScatterResponseValues}
          answers={answers}
          versions={versions}
        />
      );
    case ItemResponseType.Text:
      return <ReportTable answers={answers} />;

    default:
      <></>;
  }
};
