import { IconButton } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AddIndividualSchedulePopup } from 'modules/Dashboard/features/Applet/Schedule/AddIndividualSchedulePopup';
import { RemoveIndividualSchedulePopup } from 'modules/Dashboard/features/Applet/Schedule/RemoveIndividualSchedulePopup';
import { Svg, Tooltip } from 'shared/components';

import { ScheduleToggleProps } from './ScheduleToggle.types';

export const ScheduleToggle = ({
  'data-testid': dataTestId,
  appletId = '',
  disabled,
  isEmpty = false,
  isIndividual,
  userId,
  userName = '',
  ...otherProps
}: ScheduleToggleProps) => {
  const { t } = useTranslation('app');
  const [addDialogVisible, setAddDialogVisible] = useState(false);
  const [removeDialogVisible, setRemoveDialogVisible] = useState(false);
  const ariaLabel = isIndividual ? t('removeIndividualSchedule') : t('addIndividualSchedule');
  const renderedTooltipLabel = disabled ? t('individualScheduleLimited') : ariaLabel;

  const handlePressToggle = () => {
    if (isIndividual) {
      setRemoveDialogVisible(true);
    } else {
      setAddDialogVisible(true);
    }
  };

  return (
    <>
      <Tooltip tooltipTitle={renderedTooltipLabel}>
        <span>
          <IconButton
            aria-label={ariaLabel}
            data-testid={dataTestId}
            disabled={disabled}
            onClick={handlePressToggle}
            size="large"
            {...otherProps}
          >
            <Svg
              fill={disabled ? 'currentColor' : undefined}
              id={isIndividual ? 'trash' : 'user-calendar'}
            />
          </IconButton>
        </span>
      </Tooltip>

      {isIndividual ? (
        <RemoveIndividualSchedulePopup
          appletId={appletId}
          data-testid={`${dataTestId}-remove-popup`}
          isEmpty={isEmpty}
          onClose={() => {
            setRemoveDialogVisible(false);
          }}
          open={removeDialogVisible}
          userId={userId}
          userName={userName}
        />
      ) : (
        <AddIndividualSchedulePopup
          appletId={appletId}
          data-testid={`${dataTestId}-add-popup`}
          onClose={() => {
            setAddDialogVisible(false);
          }}
          open={addDialogVisible}
          userName={userName}
          userId={userId}
        />
      )}
    </>
  );
};
