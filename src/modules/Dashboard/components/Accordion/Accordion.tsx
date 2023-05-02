import React, { useState } from 'react';

import { StyledTitleBoldMedium, variables } from 'shared/styles';

import { StyledHeader, StyledItem, StyledSvg } from './Accordion.styles';
import { AccordionProps } from './Accordion.types';

export const Accordion = ({ children, title }: AccordionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleExpande = () => {
    setIsOpen((prevState) => !prevState);
  };

  return (
    <StyledItem>
      <StyledHeader onClick={handleExpande}>
        <StyledSvg id={isOpen ? 'navigate-up' : 'navigate-down'} width={20} height={20} />
        <StyledTitleBoldMedium color={variables.palette.on_surface_variant}>
          {title}
        </StyledTitleBoldMedium>
      </StyledHeader>
      {isOpen && children}
    </StyledItem>
  );
};
