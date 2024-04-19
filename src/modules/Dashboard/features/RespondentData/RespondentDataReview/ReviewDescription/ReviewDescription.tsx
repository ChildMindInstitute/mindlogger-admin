import { Grid } from '@mui/material';

import { StyledTitleBoldMedium, StyledTitleMedium, variables } from 'shared/styles';

import { ReviewDescriptionProps } from './ReviewDescription.types';
import { StyledReviewDescription } from './ReviewDescription.styles';
import { useReviewDescription } from './ReviewDescription.hooks';

export const ReviewDescription = ({
  'data-testid': dataTestid,
  ...props
}: ReviewDescriptionProps) => {
  const reviewDescription = useReviewDescription(props);

  return (
    <StyledReviewDescription data-testid={`${dataTestid}-description`}>
      <Grid container columns={3} spacing={2.4}>
        {reviewDescription.map(({ id, title, content }) => (
          <Grid key={id} item xs={1}>
            <StyledTitleMedium sx={{ color: variables.palette.on_surface_variant }}>
              {title}
            </StyledTitleMedium>
            <StyledTitleBoldMedium sx={{ color: variables.palette.on_surface_variant }}>
              {content}
            </StyledTitleBoldMedium>
          </Grid>
        ))}
      </Grid>
    </StyledReviewDescription>
  );
};
