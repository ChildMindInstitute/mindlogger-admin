import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { Button, ButtonPropsVariantOverrides } from '@mui/material';

import { Svg } from 'shared/components';
import { useBreadcrumbs } from 'shared/hooks';

import { LeftBar } from './LeftBar';
import { ScoresAndReports } from './ScoresAndReports';
import { ActivitySettingsForm } from './ActivitySettings.types';
import { StyledWrapper, StyledButtonsContainer } from './ActivitySettings.styles';
import { ActivitySettingsOptions } from './ActivitySettings.const';

const commonButtonProps = {
  variant: 'outlined' as keyof ButtonPropsVariantOverrides,
  startIcon: <Svg id="add" width="20" height="20" />,
};

export const ActivitySettings = () => {
  const [activeSetting, setActiveSetting] = useState<ActivitySettingsOptions>(
    ActivitySettingsOptions.ScoresAndReports,
  );

  const { t } = useTranslation('app');

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

  const handleAddScore = () => {
    appendScore({});
  };

  const handleAddSection = () => {
    appendSection({});
  };

  return (
    <StyledWrapper>
      <LeftBar activeSetting={activeSetting} setActiveSetting={setActiveSetting} />
      <FormProvider {...methods}>
        {activeSetting === ActivitySettingsOptions.ScoresAndReports && (
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
      </FormProvider>
    </StyledWrapper>
  );
};
