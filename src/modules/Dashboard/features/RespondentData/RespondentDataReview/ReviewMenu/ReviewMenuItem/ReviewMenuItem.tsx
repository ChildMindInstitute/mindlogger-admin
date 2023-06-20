import { useEffect, useState } from 'react';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';

import { Chip } from 'shared/components';
import { DateFormats } from 'shared/consts';
import { StyledBodyLarge, StyledFlexWrap, theme } from 'shared/styles';
import { page } from 'resources';

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
  const { appletId, respondentId, answerId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedAnswer || !answerId) return;

    const answerByRoute = activity.answerDates.find((answer) => answer.answerId === answerId);
    if (answerByRoute) {
      setSelectedAnswer(answerByRoute);
      setSelectedActivity(activity);
      setIsOpen(true);
    }
  }, [answerId, selectedAnswer]);

  const isActivityNotEmpty = !!activity?.answerDates?.length;

  const handleActivityClick = () => {
    setSelectedActivity(activity);
    setSelectedAnswer(null);
    setIsOpen((state) => !state);
    navigate(generatePath(page.appletRespondentDataReview, { appletId, respondentId }));
  };

  const handleAnswerClick = (answer: Answer) => {
    if (!isSelected) {
      setSelectedActivity(activity);
    }

    setSelectedAnswer(answer);
    navigate(
      generatePath(page.appletRespondentDataReviewAnswer, {
        appletId,
        respondentId,
        answerId: answer.answerId,
      }),
    );
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
