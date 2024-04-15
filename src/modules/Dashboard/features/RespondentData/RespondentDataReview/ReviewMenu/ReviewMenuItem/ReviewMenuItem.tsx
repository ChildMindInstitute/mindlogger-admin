import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';

import { Chip } from 'shared/components';
import { DateFormats } from 'shared/consts';
import { StyledBodyLarge, StyledFlexWrap, theme } from 'shared/styles';
import { toggleBooleanState } from 'shared/utils/toggleBooleanState';

import { sortAnswerDates } from '../../utils/sortAnswerDates';
import { StyledHeader, StyledItem, StyledSvg } from './ReviewMenuItem.styles';
import { ReviewMenuItemProps } from './ReviewMenuItem.types';
import { Answer } from '../../RespondentDataReview.types';

export const ReviewMenuItem = ({
  activity,
  setSelectedActivity,
  isSelected,
  selectedAnswer,
  onSelectAnswer,
  'data-testid': dataTestid,
}: ReviewMenuItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const answerId = searchParams.get('answerId');

  const { answerDates } = activity ?? {};
  const isActivityNotEmpty = !!answerDates?.length;
  const sortedAnswerDates = sortAnswerDates(answerDates);

  const handleActivityClick = () => {
    setSelectedActivity(activity);
    onSelectAnswer({ answer: null });
    toggleBooleanState(setIsOpen)();
    setSearchParams(undefined);
  };

  const handleAnswerClick = (answer: Answer) => {
    if (!isSelected) {
      setSelectedActivity(activity);
    }

    onSelectAnswer({ answer });
  };

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
      <StyledHeader onClick={handleActivityClick} data-testid={`${dataTestid}-select`}>
        <StyledBodyLarge sx={{ maxWidth: '80%' }}>{activity.name}</StyledBodyLarge>
        {isActivityNotEmpty && (
          <StyledSvg id={isOpen ? 'navigate-up' : 'navigate-down'} width={24} height={24} />
        )}
      </StyledHeader>
      {isOpen && isActivityNotEmpty && (
        <StyledFlexWrap
          sx={{ paddingTop: theme.spacing(1.6) }}
          data-testid={`${dataTestid}-completion-wrapper`}
        >
          {sortedAnswerDates?.map((answer, index) => (
            <Chip
              color={selectedAnswer?.answerId === answer.answerId ? 'primary' : 'secondary'}
              key={answer.answerId}
              title={String(
                format(new Date(answer.endDatetime ?? answer.createdAt), DateFormats.TimeSeconds),
              )}
              onClick={() => handleAnswerClick(answer)}
              data-testid={`${dataTestid}-completion-time-${index}`}
            />
          ))}
        </StyledFlexWrap>
      )}
    </StyledItem>
  );
};
