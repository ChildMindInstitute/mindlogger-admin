import { useTranslation } from 'react-i18next';
import { generatePath, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

import { Svg } from 'shared/components/Svg';
import { theme, variables, StyledBodyLarge } from 'shared/styles';
import { page } from 'resources';
import { SettingParam } from 'shared/utils/urlGenerator';

import { StyledSvg } from '../ReportConfigSetting.styles';
import { ServerNotConfiguredProps } from './ServerNotConfigured.types';

export const ServerNotConfigured = ({ appletId, 'data-testid': dataTestid }: ServerNotConfiguredProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <>
      <StyledBodyLarge sx={{ margin: theme.spacing(2.4, 0, 4.8, 0) }} color={variables.palette.semantic.error}>
        {t('configureServerForReport')}
      </StyledBodyLarge>
      <Button
        variant="outlined"
        sx={{ width: '30rem' }}
        startIcon={
          <StyledSvg>
            <Svg id="server-connect" />
          </StyledSvg>
        }
        onClick={() =>
          navigate(
            generatePath(page.builderAppletSettingsItem, {
              appletId,
              setting: SettingParam.ReportConfiguration,
            }),
          )
        }
        data-testid={`${dataTestid}-configure-report`}>
        {t('configureServerForApplet')}
      </Button>
    </>
  );
};
