import { Box } from '@mui/material';

import { ItemResponseType } from 'shared/consts';
import { StyledFlexColumn, StyledTitleMedium, theme } from 'shared/styles';
import {
  Answer,
  ItemOption,
  NumberSelectionResponseValues,
  PerRowSelectionItemOption,
  SimpleAnswerValue,
} from 'modules/Dashboard/features/RespondentData/RespondentData.types';

import { TICK_HEIGHT } from '../Charts/Charts.const';
import { MultiScatterChart } from '../Charts/MultiScatterChart';
import { TimePickerLineChart } from '../Charts/LineChart/TimePickerLineChart';
import { ReportTable } from '../ReportTable';
import { GetResponseOptionsProps } from './ResponseOptions.types';

export const getResponseItem = ({
  color,
  minDate,
  maxDate,
  activityItem,
  versions,
  answers = [],
  dataTestid,
}: GetResponseOptionsProps) => {
  const responseType = activityItem.responseType;

  const renderMultipleSelection = (options: ItemOption[]) => {
    const height = (options.length + 1) * TICK_HEIGHT;

    const values = options.map(({ value }) => value);
    const minY = Math.min(...values);
    const maxY = Math.max(...values);

    return (
      <MultiScatterChart
        color={color}
        minDate={minDate}
        maxDate={maxDate}
        minY={minY}
        maxY={maxY}
        height={height}
        options={options}
        responseType={responseType}
        answers={answers as Answer<SimpleAnswerValue>[]}
        versions={versions}
        data-testid={`${dataTestid}-multi-scatter-chart`}
      />
    );
  };

  const renderTimePicker = () => (
    <TimePickerLineChart
      color={color}
      minDate={minDate}
      maxDate={maxDate}
      answers={answers as Answer<SimpleAnswerValue>[]}
      versions={versions}
      data-testid={`${dataTestid}-time-picker-chart`}
    />
  );

  const renderSingleSelectionPerRow = () => {
    const updatedOptions = activityItem?.responseValues.options.map(({ id, text }, index) => ({
      id,
      text,
      value: index,
    }));

    const optionValueMapper: Record<string, number> = (
      activityItem?.responseValues.options as PerRowSelectionItemOption[]
    ).reduce(
      (acc, { text }, index) => ({
        ...acc,
        [text]: index,
      }),
      {},
    );

    return (
      <StyledFlexColumn>
        {activityItem?.responseValues?.rows?.map(({ rowName }, index) => {
          const height = (activityItem?.responseValues.options.length + 1) * TICK_HEIGHT;

          const updatedAnswers = (answers as Record<string, Answer<string>[]>)[rowName].map(
            ({ answer, date }) => ({
              date,
              answer: {
                value:
                  !answer?.value || optionValueMapper[answer?.value] === undefined
                    ? null
                    : optionValueMapper[answer?.value],
                text: answer.text,
              },
            }),
          );

          return (
            <Box
              key={rowName}
              data-testid={`${dataTestid}-row-${index}`}
              sx={{ mb: theme.spacing(4.8) }}
            >
              <StyledTitleMedium>{rowName}</StyledTitleMedium>
              <MultiScatterChart
                color={color}
                minDate={minDate}
                maxDate={maxDate}
                minY={0}
                maxY={activityItem?.responseValues.options.length - 1}
                height={height}
                options={updatedOptions}
                responseType={responseType}
                answers={updatedAnswers as Answer<string>[]}
                versions={versions}
                data-testid={`${dataTestid}-multi-scatter-chart`}
              />
            </Box>
          );
        })}
      </StyledFlexColumn>
    );
  };

  switch (responseType) {
    case ItemResponseType.SingleSelection:
    case ItemResponseType.MultipleSelection:
    case ItemResponseType.Slider: {
      const { options } = activityItem.responseValues;

      return renderMultipleSelection(options as ItemOption[]);
    }
    case ItemResponseType.NumberSelection: {
      const { minValue, maxValue } = activityItem.responseValues as NumberSelectionResponseValues;
      const min = Number(minValue ?? 0);
      const max = Number(maxValue ?? 0);
      const options = Array.from({ length: max - min + 1 }, (_, i) => {
        const value = i + min;

        return {
          id: String(value),
          text: value,
          value,
        } as ItemOption;
      });

      return renderMultipleSelection(options);
    }
    case ItemResponseType.TimeRange:
    case ItemResponseType.Date:
    case ItemResponseType.Text:
      return (
        <ReportTable
          responseType={responseType}
          answers={answers as Answer[]}
          data-testid={dataTestid}
        />
      );
    case ItemResponseType.Time:
      return renderTimePicker();
    case ItemResponseType.SingleSelectionPerRow:
    case ItemResponseType.MultipleSelectionPerRow:
      return renderSingleSelectionPerRow();
    default:
      <></>;
  }
};
