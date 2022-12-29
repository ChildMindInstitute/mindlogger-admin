import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';

import { Svg } from 'components/Svg';
import { useBreadcrumbs } from 'hooks';

import { CreateActivityPopup } from './CreateActivityPopup';

export const Schedule = () => {
  const { t } = useTranslation('app');
  const [createActivityPopupVisible, setCreateActivityPopupVisible] = useState(false);

  useBreadcrumbs([
    {
      icon: <Svg id="schedule-outlined" width="14" height="14" />,
      label: t('schedule'),
    },
  ]);

  return (
    <>
      <Button onClick={() => setCreateActivityPopupVisible(true)}>Create Activity Schedule</Button>
      <CreateActivityPopup
        open={createActivityPopupVisible}
        onClose={() => setCreateActivityPopupVisible(false)}
      />
    </>
  );
};
