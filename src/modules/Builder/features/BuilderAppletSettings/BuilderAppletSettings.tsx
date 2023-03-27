import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components';
import { useBreadcrumbs } from 'shared/hooks';

import { LeftBar } from './LeftBar';
import { StyledWrapper } from './BuilderAppletSettings.styles';

export const BuilderAppletSettings = () => {
  const [activeSetting, setActiveSetting] = useState('scoresAndReports');

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
