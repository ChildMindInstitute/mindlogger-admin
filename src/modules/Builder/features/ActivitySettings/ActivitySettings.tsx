import { useState, useEffect } from 'react';
import { useNavigate, useParams, generatePath } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Button } from '@mui/material';

import { page } from 'resources';
import { useBreadcrumbs } from 'shared/hooks';
import { useCurrentActivity } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.hooks';

import { LeftBar } from './LeftBar';
import { ActivitySettingsContainer } from './ActivitySettingsContainer';
import { ScoresAndReports } from './ScoresAndReports';
import { SubscalesConfiguration } from './SubscalesConfiguration';
import { ActivitySettingsOptionsItems } from './ActivitySettings.types';
import { StyledWrapper, StyledButtonsContainer } from './ActivitySettings.styles';
import { ActivitySettingsOptions } from './ActivitySettings.types';
import { getSetting } from './ActivitySettings.utils';
import { commonButtonProps } from './ActivitySettings.const';

export const ActivitySettings = () => {
  const [activeSetting, setActiveSetting] = useState<ActivitySettingsOptions | null>(null);

  const { t } = useTranslation('app');

  const navigate = useNavigate();
  const { activityId, setting } = useParams();

  useEffect(() => {
    setActiveSetting(getSetting(setting));
  }, [setting]);

  useBreadcrumbs();

  const { control } = useFormContext();
  const { fieldName } = useCurrentActivity();
  const scoresName = `${fieldName}.scores`;
  const sectionsName = `${fieldName}.sections`;

  const { append: appendScore } = useFieldArray({
    control,
    name: scoresName,
  });

  const { append: appendSection } = useFieldArray({
    control,
    name: sectionsName,
  });

  const handleAddScore = () => {
    appendScore({});
  };

  const handleAddSection = () => {
    appendSection({});
  };

  const handleSetActiveSetting = (setting: ActivitySettingsOptions) => {
    setActiveSetting(setting);
    navigate(
      generatePath(page.builderAppletActivitySettingsItem, { activityId, setting: setting.path }),
    );
  };

  const handleClose = () => {
    setActiveSetting(null);
    navigate(generatePath(page.builderAppletActivitySettings, { activityId }));
  };

  const containerTitle = activeSetting ? t(activeSetting.name) : '';

  return (
    <StyledWrapper>
      <LeftBar setting={activeSetting} onSettingClick={handleSetActiveSetting} />
      <ActivitySettingsContainer title={containerTitle} onClose={handleClose}>
        {activeSetting?.name === ActivitySettingsOptionsItems.ScoresAndReports && (
          <ScoresAndReports>
            <StyledButtonsContainer>
              <Button {...commonButtonProps} onClick={handleAddScore}>
                {t('addScore')}
              </Button>
              <Button {...commonButtonProps} onClick={handleAddSection}>
                {t('addSection')}
              </Button>
            </StyledButtonsContainer>
          </ScoresAndReports>
        )}
        {activeSetting?.name === ActivitySettingsOptionsItems.SubscalesConfiguration && (
          <SubscalesConfiguration />
        )}
      </ActivitySettingsContainer>
    </StyledWrapper>
  );
};
