import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@mui/material';

import { Svg, ButtonWithMenu } from 'shared/components';
import { StyledBuilderContainerHeader } from 'shared/features';
import { falseReturnFunc } from 'shared/utils';
import { AppletFormValues } from 'modules/Builder/types';
import { useCustomFormContext } from 'modules/Builder/hooks';

import { ClearFlowModal } from '../ClearFlowModal';
import { getMenuItems } from '../ActivityFlowBuilder.utils';
import { GetMenuItemsType } from '../ActivityFlowBuilder.types';
import { StyledButtons } from './ActivityFlowBuilderHeader.styles';
import { ActivityFlowBuilderHeaderProps } from './ActivityFlowBuilderHeader.types';

export const ActivityFlowBuilderHeader = ({ isSticky, children, headerProps }: ActivityFlowBuilderHeaderProps) => {
  const { t } = useTranslation('app');
  const { watch } = useCustomFormContext();
  const activities: AppletFormValues['activities'] = watch('activities');
  const [clearFlowModalVisible, setClearFlowModalVisible] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const {
    clearFlowBtnDisabled = false,
    onAddFlowActivity = falseReturnFunc,
    onClearFlow = falseReturnFunc,
  } = headerProps || {};
  const dataTestid = 'builder-activity-flows-builder';

  const handleFlowClear = () => {
    onClearFlow();
    setClearFlowModalVisible(false);
  };

  return (
    <>
      <StyledBuilderContainerHeader isSticky={isSticky} data-testid={`${dataTestid}-header`}>
        {children}
        <StyledButtons data-testid={`${dataTestid}-buttons`}>
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
            data-testid={`${dataTestid}-add`}
          />
          <Button
            disabled={clearFlowBtnDisabled}
            variant="outlined"
            startIcon={<Svg id="cross" width={18} height={18} />}
            onClick={() => setClearFlowModalVisible(true)}
            data-testid={`${dataTestid}-clear`}>
            {t('clearFlow')}
          </Button>
        </StyledButtons>
      </StyledBuilderContainerHeader>
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
