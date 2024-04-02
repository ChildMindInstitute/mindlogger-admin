import { Box } from '@mui/material';

import { StyledFlexColumn, StyledTitleMedium, theme } from 'shared/styles';
import { ItemResponseType } from 'shared/consts';

import { SliderActivityItem, SliderRowsItemAnswer } from '../RespondentDataReview.types';
import { SliderResponseItem } from '../SliderResponseItem';

export const SliderRowsResponseItem = ({
  activityItem,
  answer,
  'data-testid': dataTestid,
}: SliderRowsItemAnswer) => (
  <StyledFlexColumn data-testid={dataTestid}>
    {activityItem?.responseValues?.rows?.map((row, index) => {
      const isLastRow = index === activityItem?.responseValues?.rows.length - 1;
      const value = answer?.value?.[index];
      const answerValue =
        value === undefined
          ? null
          : {
              value,
            };

      const rowActivityItem = {
        ...activityItem,
        responseType: ItemResponseType.Slider,
        responseValues: row,
      } as SliderActivityItem;

      return (
        <Box
          key={row.id}
          data-testid={`${dataTestid}-row-${index}`}
          sx={{
            mb: isLastRow ? 0 : theme.spacing(4.8),
          }}
        >
          <StyledTitleMedium>{row.label ?? ''}</StyledTitleMedium>
          <SliderResponseItem
            activityItem={rowActivityItem}
            answer={answerValue}
            data-testid={`${dataTestid}-row-${index}-slider`}
          />
        </Box>
      );
    })}
  </StyledFlexColumn>
);
