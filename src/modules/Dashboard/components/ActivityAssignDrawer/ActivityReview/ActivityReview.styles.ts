import { Accordion, AccordionDetails, AccordionSummary, styled } from '@mui/material';

import { theme, variables } from 'shared/styles';

export const StyledAccordion = styled(Accordion)<{ component?: string }>({
  background: 0,
  border: 0,
  boxShadow: variables.boxShadow.soft2,
  borderRadius: variables.borderRadius.lg2,
  padding: theme.spacing(1.2, 2.4, 0.8),
  listStyle: 'none',

  '&::before': { display: 'none' },
  '& [data-toggle]': { transition: variables.transitions.all },

  '&.Mui-expanded': {
    margin: 0,
    '& [data-toggle]': { transform: 'rotate(-180deg)' },
  },

  '&.Mui-disabled': {
    background: 0,
  },
});

StyledAccordion.defaultProps = {
  component: 'li',
  square: true,
  variant: 'outlined',
};

export const StyledAccordionSummary = styled(AccordionSummary)({
  '&&': {
    minHeight: theme.spacing(4.8),
    padding: 0,
  },

  '&& .MuiAccordionSummary-content': {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1.2),
    margin: theme.spacing(0.4, 0),
  },

  '&.Mui-disabled': {
    opacity: 1,
  },
});

export const StyledAccordionDetails = styled(AccordionDetails)({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(4.8),
  padding: theme.spacing(1.6, 0, 2.4),
});
