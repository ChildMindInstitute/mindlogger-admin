import { Grid } from '@mui/material';

import { StyledBodyLarge, StyledTitleBoldSmall } from 'shared/styles';

import { ResponsesSummaryProps } from './ResponsesSummary.types';
import { StyledSummary } from './ResponsesSummary.styles';
import { useResponsesSummary } from './ResponsesSummary.hooks';

export const ResponsesSummary = ({
  'data-testid': dataTestid,
  ...props
}: ResponsesSummaryProps) => {
  const reviewDescription = useResponsesSummary(props);

  return (
    <StyledSummary data-testid={`${dataTestid}-description`}>
      <Grid container columns={4} spacing={2.4}>
        {reviewDescription.map(({ id, title, content }) => (
          <Grid key={id} item xs={1}>
            <StyledTitleBoldSmall>{title}</StyledTitleBoldSmall>
            <StyledBodyLarge>{content}</StyledBodyLarge>
          </Grid>
        ))}
      </Grid>
    </StyledSummary>
  );
};
