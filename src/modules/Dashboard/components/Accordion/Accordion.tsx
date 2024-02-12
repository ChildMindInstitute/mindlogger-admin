import { useState } from 'react';

import { Box } from '@mui/material';

import { StyledFlexTopCenter, theme, variables } from 'shared/styles';

import { StyledItem, StyledSvg } from './Accordion.styles';
import { AccordionProps, AccordionUiType } from './Accordion.types';

export const Accordion = ({
  children,
  title,
  uiType = AccordionUiType.Primary,
  'data-testid': dataTestid,
}: AccordionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleItemExpand = () => {
    setIsOpen((prevState) => !prevState);
  };

  const isPrimaryUiType = uiType === AccordionUiType.Primary;

  return (
    <StyledItem
      className="accordion-container"
      isPrimaryUiType={isPrimaryUiType}
      data-testid={dataTestid}
    >
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
        <Box
          sx={{
            fontWeight: isPrimaryUiType
              ? variables.font.weight.bold
              : variables.font.weight.regular,
          }}
          color={variables.palette.on_surface_variant}
        >
          {title}
        </Box>
      </StyledFlexTopCenter>
      {isOpen && children}
    </StyledItem>
  );
};
