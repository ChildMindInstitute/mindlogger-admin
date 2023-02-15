import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { useBreadcrumbs } from 'hooks';
import { page } from 'resources';
import { StyledBody, StyledFlexAllCenter } from 'styles/styledComponents';

export const Builder = () => {
  useBreadcrumbs();
  const navigate = useNavigate();

  return (
    <StyledBody>
      <StyledFlexAllCenter>
        <Button variant="outlined" onClick={() => navigate(page.newApplet)} sx={{ width: 200 }}>
          New Applet
        </Button>
      </StyledFlexAllCenter>
    </StyledBody>
  );
};
