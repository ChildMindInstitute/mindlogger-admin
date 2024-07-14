import { Accordion, AccordionDetails, AccordionSummary, styled } from '@mui/material';

import { theme, variables } from 'shared/styles';

export const StyledAccordion = styled(Accordion)<{ component?: string }>({
  background: 'none',
  border: 'none',
  boxShadow: `0 -2px 0 -1px ${variables.palette.outline_variant2}`,
  margin: theme.spacing(0, -3),
  padding: theme.spacing(0, 3),

  '& [data-toggle]': { transition: variables.transitions.all },

  '&.Mui-expanded': {
    margin: theme.spacing(0, -3),
    padding: theme.spacing(0, 3),

    '& [data-toggle]': {
      transform: 'rotate(-180deg)',
    },
  },
});

StyledAccordion.defaultProps = {
  component: 'li',
  square: true,
  variant: 'outlined',
};

export const StyledAccordionSummary = styled(AccordionSummary)({
  margin: 0,
  minHeight: 'unset',
  padding: theme.spacing(3, 0),

  '&& .MuiAccordionSummary-content': {
    margin: 0,

    '&.Mui-expanded': { margin: 0 },
  },
});

export const StyledAccordionDetails = styled(AccordionDetails)({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2.4),
  padding: theme.spacing(0, 0, 1.6, 0),
});

export const StyledPhraseTemplateFieldSet = styled('fieldset')({
  border: 'none',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.8),
  margin: 0,
  padding: theme.spacing(0, 0, 0, 6),
  position: 'relative',

  '&:before': {
    background: variables.palette.outline_variant2,
    borderRadius: '4px',
    content: '""',
    display: 'block',
    inset: theme.spacing(0, 0, 0, 2.8),
    position: 'absolute',
    width: 4,
  },
});
