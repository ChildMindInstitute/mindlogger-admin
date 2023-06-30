import { ItemResponseType } from 'shared/consts';
import {
  SingleAndMultipleSelectItemResponseValues,
  SliderItemResponseValues,
} from 'shared/state/Applet/Applet.schema';
import {
  DecryptedMultiSelectionAnswer,
  DecryptedSingleSelectionAnswer,
} from 'modules/Dashboard/features/RespondentData/RespondentDataReview/RespondentDataReview.types';

import { ItemAnswer, FormattedItemAnswer } from '../Report.types';
import { MultiScatterChart } from '../Charts';
import { ReportTable } from '../ReportTable';
import { GetResponseOptionsProps, MultiScatterResponseValues } from './ResponseOptions.types';
import { TICK_HEIGHT } from './ResponseOptions.const';
import { TextAnswer } from '../ReportTable/ReportTable.types';

export const formatAnswers = (answers: ItemAnswer[]) =>
  answers?.reduce((flattenAnswers: FormattedItemAnswer[], { answer, date }: ItemAnswer) => {
    const flattenValues = Array.isArray(
      (answer as DecryptedMultiSelectionAnswer | DecryptedSingleSelectionAnswer)?.value,
    )
      ? (answer as DecryptedMultiSelectionAnswer)?.value?.map((item) => ({
          value: item,
          date,
        }))
      : [
          {
            value: (answer as DecryptedSingleSelectionAnswer).value,
            date,
          },
        ];

    return [...flattenAnswers, ...flattenValues];
  }, []);

export const getResponseItem = ({
  color,
  minDate,
  maxDate,
  activityItem,
  versions,
  answers = [],
}: GetResponseOptionsProps) => {
  const responseType = activityItem.responseType;

  const renderSingleMultipleSelection = () => {
    const formattedAnswers = formatAnswers(answers);
    const { options } = activityItem.responseValues as SingleAndMultipleSelectItemResponseValues;
    const height = (options.length + 1) * TICK_HEIGHT;
    const maxY = options.length;

    return (
      <MultiScatterChart
        color={color}
        minDate={minDate}
        maxDate={maxDate}
        maxY={maxY}
        height={height}
        responseValues={activityItem.responseValues as MultiScatterResponseValues}
        responseType={responseType}
        answers={formattedAnswers}
        versions={versions}
      />
    );
  };

  const renderSlider = () => {
    const formattedAnswers = formatAnswers(answers);
    const { minValue, maxValue } = activityItem.responseValues as SliderItemResponseValues;
    const maxValueNumber = Number(maxValue);
    const minValueNumber = Number(minValue);
    const height = (maxValueNumber - minValueNumber + 1) * TICK_HEIGHT;

    return (
      <MultiScatterChart
        color={color}
        minDate={minDate}
        maxDate={maxDate}
        maxY={maxValueNumber}
        minY={minValueNumber}
        height={height}
        responseValues={activityItem.responseValues as MultiScatterResponseValues}
        responseType={responseType}
        answers={formattedAnswers}
        versions={versions}
      />
    );
  };

  switch (responseType) {
    case ItemResponseType.SingleSelection:
    case ItemResponseType.MultipleSelection:
      return renderSingleMultipleSelection();
    case ItemResponseType.Slider:
      return renderSlider();
    case ItemResponseType.Text:
      return <ReportTable answers={answers as TextAnswer[]} />;
    default:
      <></>;
  }
};
