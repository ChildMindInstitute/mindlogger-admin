import { FallbackProps } from 'react-error-boundary';
import { Accordion, AccordionDetails, AccordionSummary, Box } from '@mui/material';

import { StyledLabelMedium, StyledLinkBtn, StyledTitleLarge } from 'shared/styles';
import { Svg } from 'shared/components/Svg';

export const ErrorFallback = ({ error }: FallbackProps) => {
  const onClick = () => {
    window.location.reload();
  };

  return (
    <Box>
      <StyledTitleLarge>Something went wrong.</StyledTitleLarge>
      <Accordion>
        <AccordionSummary
          expandIcon={<Svg id={'navigate-down'} />}
          aria-controls="panel-content"
          id="panel-header"
        >
          <StyledTitleLarge>Details</StyledTitleLarge>
        </AccordionSummary>
        <AccordionDetails sx={{ whiteSpace: 'pre-wrap' }}>
          <StyledLabelMedium>{error.message}</StyledLabelMedium>
        </AccordionDetails>
      </Accordion>
      <StyledLinkBtn onClick={onClick}>Refresh page</StyledLinkBtn>
    </Box>
  );
};
