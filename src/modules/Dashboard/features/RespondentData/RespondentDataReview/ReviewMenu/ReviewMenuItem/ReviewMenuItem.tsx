import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';

import { Chip } from 'shared/components';
import { DateFormats } from 'shared/consts';
import { StyledBodyLarge, StyledFlexWrap, theme } from 'shared/styles';
import { toggleBooleanState } from 'shared/utils/toggleBooleanState';
import { AnswerDate } from 'modules/Dashboard/api';

import { sortAnswerDates } from '../../utils/sortAnswerDates';
import { StyledHeader, StyledItem, StyledSvg } from './ReviewMenuItem.styles';
import { ReviewMenuItemProps } from './ReviewMenuItem.types';

export const ReviewMenuItem = ({
  item,
  onSelectItem,
  isSelected,
  selectedAnswer,
  onSelectAnswer,
  'data-testid': dataTestid,
}: ReviewMenuItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const answerId = searchParams.get('answerId');
  const submitId = searchParams.get('submitId');

  const { answerDates } = item ?? {};
  const isItemNotEmpty = !!answerDates?.length;
  const sortedAnswerDates = sortAnswerDates(answerDates);

  const handleItemClick = () => {
    onSelectItem(item);
    onSelectAnswer({ answer: null });
    toggleBooleanState(setIsOpen)();
    setSearchParams(undefined);
  };

  const handleAnswerClick = (answer: AnswerDate) => {
    if (!isSelected) {
      onSelectItem(item);
    }

    onSelectAnswer({ answer });
  };

  useEffect(() => {
    if (!answerId && !submitId) return;

    const answerByRoute = answerDates.find(
      (answer) => answer.answerId === answerId || answer.submitId === submitId,
    );
    if (!answerByRoute) return;

    setIsOpen(true);

    if (selectedAnswer) return;

    onSelectAnswer({ answer: answerByRoute, isRouteCreated: true });
    onSelectItem(item);
  }, [answerId, submitId, answerDates, selectedAnswer, onSelectItem, onSelectAnswer, item]);

  useEffect(() => {
    if (!answerId) return;

    const answerByRoute = answerDates.find((answer) => answer.answerId === answerId);
    if (!answerByRoute) return;

    setIsOpen(true);

    if (selectedAnswer) return;

    onSelectAnswer({ answer: answerByRoute, isRouteCreated: true });
    setSelectedActivity(activity);
  }, [answerId, answerDates, selectedAnswer, setSelectedActivity, onSelectAnswer, activity]);

  return (
    <StyledItem isSelected={isSelected} data-testid={`${dataTestid}-item`}>
      <StyledHeader onClick={handleItemClick} data-testid={`${dataTestid}-select`}>
        <StyledBodyLarge sx={{ maxWidth: '80%' }}>{item.name}</StyledBodyLarge>
        {isItemNotEmpty && (
          <StyledSvg id={isOpen ? 'navigate-up' : 'navigate-down'} width={24} height={24} />
        )}
      </StyledHeader>
      {isOpen && isItemNotEmpty && (
        <StyledFlexWrap
          sx={{ paddingTop: theme.spacing(1.6) }}
          data-testid={`${dataTestid}-completion-wrapper`}
        >
          {sortedAnswerDates?.map((answer, index) => {
            const chipColor =
              (answer.answerId && selectedAnswer?.answerId === answer.answerId) ||
              (answer.submitId && selectedAnswer?.submitId === answer.submitId)
                ? 'primary'
                : 'secondary';

            return (
              <Chip
                color={chipColor}
                key={answer.answerId ?? answer.submitId}
                title={String(
                  format(new Date(answer.endDatetime ?? answer.createdAt), DateFormats.TimeSeconds),
                )}
                onClick={() => handleAnswerClick(answer)}
                data-testid={`${dataTestid}-completion-time-${index}`}
              />
            );
          })}
        </StyledFlexWrap>
      )}
    </StyledItem>
  );
};
