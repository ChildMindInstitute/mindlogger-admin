import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useBreadcrumbs } from 'shared/hooks';
import { StyledBody, StyledFlexAllCenter } from 'shared/styles';
import { getBuilderAppletUrl, Path } from 'shared/utils';

export const Main = () => {
  const { t } = useTranslation('app');
  useBreadcrumbs();
  const navigate = useNavigate();

  return (
    <StyledBody>
      <StyledFlexAllCenter>
        <Button
          variant="outlined"
          onClick={() => navigate(getBuilderAppletUrl(Path.NewApplet))}
          sx={{ width: 200 }}
        >
          {t('newApplet')}
        </Button>
      </StyledFlexAllCenter>
    </StyledBody>
  );
};
