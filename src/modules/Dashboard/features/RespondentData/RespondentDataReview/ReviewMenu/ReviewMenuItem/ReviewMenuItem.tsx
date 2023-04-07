import { useState } from 'react';
import { format } from 'date-fns';

import { Chip } from 'shared/components';
import { DateFormats } from 'shared/consts';
import { StyledBodyLarge, StyledFlexWrap, theme } from 'shared/styles';

import { StyledHeader, StyledItem, StyledSvg } from './ReviewMenuItem.styles';
import { ReviewMenuItemProps } from './ReviewMenuItem.types';
import { Response } from '../../RespondentDataReview.types';

export const ReviewMenuItem = ({
  item,
  isSelected,
  responses,
  selectedResponse,
  setSelectedItem,
  setSelectedResponse,
}: ReviewMenuItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleItemClick = () => {
    setSelectedItem(item);
    setIsOpen((state) => !state);
  };

  const handleResponseClick = (response: Response) => {
    if (!isSelected) {
      setSelectedItem(item);
    }

    setSelectedResponse(response);
  };

  return (
    <StyledItem isSelected={isSelected}>
      <StyledHeader onClick={handleItemClick}>
        <StyledBodyLarge sx={{ maxWidth: '80%' }}>{item.name}</StyledBodyLarge>
        <StyledSvg id={isOpen ? 'navigate-up' : 'navigate-down'} width={24} height={24} />
      </StyledHeader>
      {isOpen && (
        <StyledFlexWrap sx={{ paddingTop: theme.spacing(1.6) }}>
          {responses.map((response) => (
            <Chip
              color={selectedResponse?.id === response.id ? 'primary' : 'secondary'}
              key={response.id}
              title={String(format(response.date, DateFormats.TimeSeconds))}
              onClick={() => handleResponseClick(response)}
            />
          ))}
        </StyledFlexWrap>
      )}
    </StyledItem>
  );
};
