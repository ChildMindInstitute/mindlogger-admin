import { useState } from 'react';
import { format } from 'date-fns';

import { Chip } from 'shared/components';
import { DateFormats } from 'shared/consts';
import { StyledBodyLarge, StyledFlexWrap, theme } from 'shared/styles';

import { StyledHeader, StyledItem, StyledSvg } from './ReviewMenuItem.styles';
import { ReviewMenuItemProps } from './ReviewMenuItem.types';
import { Answer } from '../../RespondentDataReview.types';

export const ReviewMenuItem = ({
  activity,
  setSelectedActivity,
  isSelected,
  selectedAnswer,
  setSelectedAnswer,
}: ReviewMenuItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const isActivityNotEmpty = !!activity?.answerDates?.length;

  const handleActivityClick = () => {
    setSelectedActivity(activity);
    setSelectedAnswer(null);
    setIsOpen((state) => !state);
  };

  const handleAnswerClick = (answer: Answer) => {
    if (!isSelected) {
      setSelectedActivity(activity);
    }

    setSelectedAnswer(answer);
  };

  return (
    <StyledItem isSelected={isSelected}>
      <StyledHeader onClick={handleActivityClick}>
        <StyledBodyLarge sx={{ maxWidth: '80%' }}>{activity.name}</StyledBodyLarge>
        {isActivityNotEmpty && (
          <StyledSvg id={isOpen ? 'navigate-up' : 'navigate-down'} width={24} height={24} />
        )}
      </StyledHeader>
      {isOpen && isActivityNotEmpty && (
        <StyledFlexWrap sx={{ paddingTop: theme.spacing(1.6) }}>
          {activity?.answerDates?.map((answer) => (
            <Chip
              color={selectedAnswer?.answerId === answer.answerId ? 'primary' : 'secondary'}
              key={answer.answerId}
              title={String(format(new Date(answer.createdAt), DateFormats.TimeSeconds))}
              onClick={() => handleAnswerClick(answer)}
            />
          ))}
        </StyledFlexWrap>
      )}
    </StyledItem>
  );
};
