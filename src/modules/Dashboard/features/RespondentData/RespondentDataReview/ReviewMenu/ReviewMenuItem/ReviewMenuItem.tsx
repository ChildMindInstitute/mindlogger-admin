import { useState } from 'react';
import { format } from 'date-fns';

import { Chip } from 'shared/components';
import { DateFormats } from 'shared/consts';
import { StyledBodyLarge, StyledFlexWrap, theme } from 'shared/styles';

import { mockedReviews } from './mock';
import { StyledHeader, StyledItem, StyledSvg } from './ReviewMenuItem.styles';
import { ReviewMenuItemProps } from './ReviewMenuItem.types';

export const ReviewMenuItem = ({
  item,
  isSelected,
  setSelectedItem,
  setSelectedReview,
}: ReviewMenuItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const reviews = mockedReviews;

  const handleItemClick = () => {
    setSelectedItem(item);
    setIsOpen((state) => !state);
  };

  return (
    <StyledItem isSelected={isSelected}>
      <StyledHeader onClick={handleItemClick}>
        <StyledBodyLarge sx={{ maxWidth: '80%' }}>{item.name}</StyledBodyLarge>
        <StyledSvg id={isOpen ? 'navigate-up' : 'navigate-down'} width={24} height={24} />
      </StyledHeader>
      {isOpen && (
        <StyledFlexWrap sx={{ paddingTop: theme.spacing(1.6) }}>
          {reviews.map((review) => (
            <Chip
              color="secondary"
              key={review.id}
              title={String(format(review.date, DateFormats.TimeSeconds))}
              onClick={() => setSelectedReview(review)}
            />
          ))}
        </StyledFlexWrap>
      )}
    </StyledItem>
  );
};
