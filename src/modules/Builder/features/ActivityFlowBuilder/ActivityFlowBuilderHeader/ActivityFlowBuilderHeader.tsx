import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';

import { Svg, ButtonWithMenu } from 'shared/components';
import { StyledHeader } from 'shared/features';
import { falseReturnFunc } from 'shared/utils';
import { AppletFormValues } from 'modules/Builder/types';

import { ClearFlowModal } from '../ClearFlowModal';
import { getMenuItems } from '../ActivityFlowBuilder.utils';
import { GetMenuItemsType } from '../ActivityFlowBuilder.types';
import { StyledButtons } from './ActivityFlowBuilderHeader.styles';
import { ActivityFlowBuilderHeaderProps } from './ActivityFlowBuilderHeader.types';

export const ActivityFlowBuilderHeader = ({
  isSticky,
  children,
  headerProps,
}: ActivityFlowBuilderHeaderProps) => {
  const { t } = useTranslation('app');
  const { watch } = useFormContext();
  const activities: AppletFormValues['activities'] = watch('activities');
  const [clearFlowModalVisible, setClearFlowModalVisible] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const {
    clearFlowBtnDisabled = false,
    onAddFlowActivity = falseReturnFunc,
    onClearFlow = falseReturnFunc,
  } = headerProps || {};

  const handleFlowClear = () => {
    onClearFlow();
    setClearFlowModalVisible(false);
  };

  return (
    <>
      <StyledHeader isSticky={isSticky}>
        {children}
        <StyledButtons>
          <ButtonWithMenu
            variant="outlined"
            label={t('addActivity')}
            anchorEl={anchorEl}
            setAnchorEl={setAnchorEl}
            menuItems={getMenuItems({
              type: GetMenuItemsType.AddActivity,
              onMenuClose: () => setAnchorEl(null),
              activities,
              onAddFlowActivity,
            })}
            startIcon={<Svg id="add" width={18} height={18} />}
            menuListWidth="44rem"
          />
          <Button
            disabled={clearFlowBtnDisabled}
            variant="outlined"
            startIcon={<Svg id="cross" width={18} height={18} />}
            onClick={() => setClearFlowModalVisible(true)}
            data-testid="builder-activity-flows-builder-clear"
          >
            {t('clearFlow')}
          </Button>
        </StyledButtons>
      </StyledHeader>
      {clearFlowModalVisible && (
        <ClearFlowModal
          isOpen={clearFlowModalVisible}
          onModalClose={() => setClearFlowModalVisible(false)}
          onModalSubmit={handleFlowClear}
        />
      )}
    </>
  );
};
