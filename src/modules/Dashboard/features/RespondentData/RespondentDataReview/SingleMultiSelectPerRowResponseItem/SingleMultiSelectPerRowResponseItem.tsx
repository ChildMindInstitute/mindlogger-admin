import { StyledFlexColumn } from 'shared/styles';
import { ItemResponseType } from 'shared/consts';

import { Options } from './Options';
import { ItemRows } from './ItemRows';
import { SingleMultiSelectPerRowItemAnswer } from '../RespondentDataReview.types';

export const SingleMultiSelectPerRowResponseItem = ({
  activityItem,
  answer,
  'data-testid': dataTestid,
}: SingleMultiSelectPerRowItemAnswer) => (
  <StyledFlexColumn data-testid={dataTestid}>
    <Options options={activityItem?.responseValues?.options} data-testid={dataTestid} />
    <ItemRows
      responseValues={activityItem.responseValues}
      answer={answer}
      isMultiple={activityItem?.responseType === ItemResponseType.MultipleSelectionPerRow}
      data-testid={dataTestid}
    />
  </StyledFlexColumn>
);
