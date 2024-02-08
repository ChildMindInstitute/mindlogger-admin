import get from 'lodash.get';
import { useTranslation } from 'react-i18next';

import { ToggleContainerUiType, ToggleItemContainer } from 'modules/Builder/components';
import { useCurrentActivity, useCustomFormContext } from 'modules/Builder/hooks';
import { FlankerItemPositions } from 'modules/Builder/types';

import { ButtonsContent } from './ButtonsContent';

export const ButtonsScreen = () => {
  const { t } = useTranslation();
  const { activityObjField } = useCurrentActivity();
  const {
    formState: { errors },
  } = useCustomFormContext();

  const error = get(errors, `${activityObjField}.items[${FlankerItemPositions.PracticeFirst}].config.buttons`);

  return (
    <ToggleItemContainer
      errorMessage={error ? 'fillInAllRequired' : null}
      uiType={ToggleContainerUiType.PerformanceTask}
      title={t('flankerButtons.title')}
      Content={ButtonsContent}
      tooltip={t('flankerButtons.tooltip')}
      headerToggling
      data-testid="builder-activity-flanker-buttons"
    />
  );
};
