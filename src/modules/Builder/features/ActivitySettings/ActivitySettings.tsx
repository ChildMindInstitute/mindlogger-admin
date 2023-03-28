import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components';
import { useBreadcrumbs } from 'shared/hooks';

import { LeftBar } from './LeftBar';
import { StyledWrapper } from './ActivitySettings.styles';
import { ActivitySettingsOptions } from './ActivitySettings.const';

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

  return (
    <StyledWrapper>
      <LeftBar activeSetting={activeSetting} setActiveSetting={setActiveSetting} />
    </StyledWrapper>
  );
};
