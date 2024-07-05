import { useTranslation } from 'react-i18next';

import { DatePickerInput } from 'shared/components/DatePicker/DatePickerInput';
import { StyledFlexTopStart, theme } from 'shared/styles';

import { TimeRangeItemAnswer } from '../../RespondentDataReview.types';
import { StyledTimeWrapper } from './TimeRangeResponseItem.styles';
import { getTimeRangeResponse } from '../../../RespondentData.utils';

export const TimeRangeResponseItem = ({
  answer,
  'data-testid': dataTestId,
}: TimeRangeItemAnswer) => {
  const { t } = useTranslation('app');

  if (!answer) return null;

  const formattedResponse = getTimeRangeResponse(answer);

  return (
    <StyledFlexTopStart data-testid={dataTestId}>
      <StyledTimeWrapper>
        <DatePickerInput
          label={t('from')}
          value={formattedResponse.from}
          dataTestid={`${dataTestId}-from-time`}
          disabled
        />
      </StyledTimeWrapper>
      <StyledTimeWrapper sx={{ ml: theme.spacing(2.4) }}>
        <DatePickerInput
          label={t('to')}
          value={formattedResponse.to}
          dataTestid={`${dataTestId}-to-time`}
          disabled
        />
      </StyledTimeWrapper>
    </StyledFlexTopStart>
  );
};
