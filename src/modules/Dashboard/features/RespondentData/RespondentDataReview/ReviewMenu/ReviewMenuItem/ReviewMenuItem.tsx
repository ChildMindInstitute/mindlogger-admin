import { useEffect, useState } from 'react';
import {
  createSearchParams,
  generatePath,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import { format, compareAsc } from 'date-fns';

import { Chip } from 'shared/components';
import { DateFormats } from 'shared/consts';
import { StyledBodyLarge, StyledFlexWrap, theme } from 'shared/styles';
import { page } from 'resources';

import { StyledHeader, StyledItem, StyledSvg } from './ReviewMenuItem.styles';
import { ReviewMenuItemProps } from './ReviewMenuItem.types';
import { Answer } from '../../RespondentDataReview.types';

export const ReviewMenuItem = ({
  selectedDate,
  activity,
  setSelectedActivity,
  isSelected,
  selectedAnswer,
  setSelectedAnswer,
  'data-testid': dataTestid,
}: ReviewMenuItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { appletId, respondentId } = useParams();
  const [searchParams] = useSearchParams();

  const answerId = searchParams.get('answerId');

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

  const answerDates = activity?.answerDates?.sort((a, b) =>
    compareAsc(new Date(a.createdAt), new Date(b.createdAt)),
  );

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
    const pathname = generatePath(page.appletRespondentDataReview, { appletId, respondentId });
    navigate({
      pathname,
      search: createSearchParams({
        selectedDate: format(selectedDate, DateFormats.YearMonthDay),
        answerId: answer.answerId,
      }).toString(),
    });
  };

  return (
    <StyledItem isSelected={isSelected}>
      <StyledHeader onClick={handleActivityClick} data-testid={`${dataTestid}-select`}>
        <StyledBodyLarge sx={{ maxWidth: '80%' }}>{activity.name}</StyledBodyLarge>
        {isActivityNotEmpty && (
          <StyledSvg id={isOpen ? 'navigate-up' : 'navigate-down'} width={24} height={24} />
        )}
      </StyledHeader>
      {isOpen && isActivityNotEmpty && (
        <StyledFlexWrap sx={{ paddingTop: theme.spacing(1.6) }}>
          {answerDates?.map((answer, index) => (
            <Chip
              color={selectedAnswer?.answerId === answer.answerId ? 'primary' : 'secondary'}
              key={answer.answerId}
              title={String(format(new Date(answer.createdAt), DateFormats.TimeSeconds))}
              onClick={() => handleAnswerClick(answer)}
              data-testid={`${dataTestid}-completion-time-${index}`}
            />
          ))}
        </StyledFlexWrap>
      )}
    </StyledItem>
  );
};
