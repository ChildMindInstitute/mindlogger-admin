import { useState } from 'react';

import { StyledFlexTopCenter, StyledTitleMedium, theme, variables } from 'shared/styles';

import { StyledItem, StyledSvg } from './Accordion.styles';
import { AccordionProps, AccordionUiType } from './Accordion.types';

export const Accordion = ({
  children,
  title,
  uiType = AccordionUiType.Primary,
}: AccordionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleItemExpand = () => {
    setIsOpen((prevState) => !prevState);
  };

  const isPrimaryUiType = uiType === AccordionUiType.Primary;

  return (
    <StyledItem className="accordion-container" isPrimaryUiType={isPrimaryUiType}>
      <StyledFlexTopCenter
        sx={{
          mb: theme.spacing(isPrimaryUiType ? 0 : 1),
          cursor: 'pointer',
        }}
        onClick={handleItemExpand}
      >
        <StyledSvg
          isPrimaryUiType={isPrimaryUiType}
          id={isOpen ? 'navigate-up' : 'navigate-down'}
          width={20}
          height={20}
        />
        <StyledTitleMedium
          sx={{
            fontWeight: isPrimaryUiType
              ? variables.font.weight.bold
              : variables.font.weight.regular,
          }}
          color={variables.palette.on_surface_variant}
        >
          {title}
        </StyledTitleMedium>
      </StyledFlexTopCenter>
      {isOpen && children}
    </StyledItem>
  );
};
