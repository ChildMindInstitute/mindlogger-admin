import { Grid } from '@mui/material';

import { StyledBodyLarge, StyledTitleSmall } from 'shared/styles';

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
            <StyledTitleSmall fontWeight="bold">{title}</StyledTitleSmall>
            <StyledBodyLarge>{content}</StyledBodyLarge>
          </Grid>
        ))}
      </Grid>
    </StyledSummary>
  );
};
