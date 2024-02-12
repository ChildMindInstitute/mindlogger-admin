import { useTranslation } from 'react-i18next';
import get from 'lodash.get';

import { ToggleContainerUiType, ToggleItemContainer } from 'modules/Builder/components';
import { FlankerItemPositions } from 'modules/Builder/types';
import { useCurrentActivity, useCustomFormContext } from 'modules/Builder/hooks';

import { FixationContent } from './FixationContent';

export const FixationScreen = () => {
  const { t } = useTranslation();
  const { activityObjField } = useCurrentActivity();
  const {
    formState: { errors },
  } = useCustomFormContext();

  const error = get(
    errors,
    `${activityObjField}.items[${FlankerItemPositions.PracticeFirst}].config.fixationScreen`,
  );

  return (
    <ToggleItemContainer
      errorMessage={error ? 'fillInAllRequired' : null}
      uiType={ToggleContainerUiType.PerformanceTask}
      title={t('flankerFixation.title')}
      Content={FixationContent}
      tooltip={t('flankerFixation.tooltip')}
      headerToggling
      data-testid="builder-activity-flanker-fixation-screen"
    />
  );
};
