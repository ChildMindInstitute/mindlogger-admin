import { Grid } from '@mui/material';

import { StyledTitleBoldMedium, StyledTitleMedium, variables } from 'shared/styles';

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
            <StyledTitleMedium
              sx={{
                color: variables.palette.on_surface_variant,
                fontWeight: variables.font.weight.bold,
                fontSize: variables.font.size.sm,
              }}
            >
              {title}
            </StyledTitleMedium>
            <StyledTitleBoldMedium
              sx={{
                color: variables.palette.on_surface_variant,
                fontWeight: variables.font.weight.regular,
                fontSize: variables.font.size.md,
              }}
            >
              {content}
            </StyledTitleBoldMedium>
          </Grid>
        ))}
      </Grid>
    </StyledSummary>
  );
};
