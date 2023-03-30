import { useState, useEffect } from 'react';
import { useNavigate, useParams, generatePath } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { ButtonPropsVariantOverrides, Button } from '@mui/material';

import { page } from 'resources';
import { Svg } from 'shared/components';
import { useBreadcrumbs } from 'shared/hooks';

import { LeftBar } from './LeftBar';
import { ActivitySettingsContainer } from './ActivitySettingsContainer';
import { ScoresAndReports } from './ScoresAndReports';
import { SubscalesConfiguration } from './SubscalesConfiguration';
import { ActivitySettingsForm, ActivitySettingsOptionsItems } from './ActivitySettings.types';
import { StyledWrapper, StyledButtonsContainer } from './ActivitySettings.styles';
import { ActivitySettingsOptions } from './ActivitySettings.types';
import { getSetting } from './ActivitySettings.utils';

const commonButtonProps = {
  variant: 'outlined' as keyof ButtonPropsVariantOverrides,
  startIcon: <Svg id="add" width="20" height="20" />,
};

export const ActivitySettings = () => {
  const [activeSetting, setActiveSetting] = useState<ActivitySettingsOptions | null>(null);

  const { t } = useTranslation('app');

  const navigate = useNavigate();
  const { setting } = useParams();

  useEffect(() => {
    setActiveSetting(getSetting(setting));
  }, [setting]);

  useBreadcrumbs([
    {
      icon: <Svg id="settings" width="18" height="18" />,
      label: t('activitySettings'),
    },
  ]);

  const methods = useForm<ActivitySettingsForm>({
    defaultValues: {
      generateReport: false,
      showScoreSummary: false,
    },
    mode: 'onChange',
  });

  const { control } = methods;

  const { append: appendScore } = useFieldArray({
    control,
    name: 'scores',
  });

  const { append: appendSection } = useFieldArray({
    control,
    name: 'sections',
  });

  const { append: appendSubscale } = useFieldArray({
    control,
    name: 'subscales',
  });

  const handleAddScore = () => {
    appendScore({});
  };

  const handleAddSection = () => {
    appendSection({});
  };

  const handleAddSubscale = () => {
    appendSubscale({});
  };

  const handleSetActiveSetting = (setting: ActivitySettingsOptions) => {
    setActiveSetting(setting);
    navigate(generatePath(page.newAppletNewActivitySettingsItem, { setting: setting.path }));
  };

  const handleClose = () => {
    setActiveSetting(null);
    navigate(page.newAppletNewActivitySettings);
  };

  const containerTitle = activeSetting ? t(activeSetting.name) : '';

  return (
    <StyledWrapper>
      <LeftBar setting={activeSetting} onSettingClick={handleSetActiveSetting} />
      <FormProvider {...methods}>
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
            <SubscalesConfiguration>
              <StyledButtonsContainer>
                <Button {...commonButtonProps} onClick={handleAddSubscale}>
                  {t('addSubscales')}
                </Button>
              </StyledButtonsContainer>
            </SubscalesConfiguration>
          )}
        </ActivitySettingsContainer>
      </FormProvider>
    </StyledWrapper>
  );
};
