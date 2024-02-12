import { useState } from 'react';

import { useTranslation } from 'react-i18next';
import { Box, Button } from '@mui/material';

import { StyledBuilderContainerHeader } from 'shared/features';
import { ButtonWithMenu, Svg, MenuUiType } from 'shared/components';
import { theme } from 'shared/styles';
import { falseReturnFunc } from 'shared/utils';

import { ActivitiesHeaderProps } from './ActivitiesHeader.types';
import { getPerformanceTasksMenu } from './ActivitiesHeader.utils';

export const ActivitiesHeader = ({ isSticky, children, headerProps }: ActivitiesHeaderProps) => {
  const { t } = useTranslation('app');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleActivityAdd = () => {
    headerProps?.onAddActivity && headerProps.onAddActivity(null);
  };

  return (
    <StyledBuilderContainerHeader isSticky={isSticky}>
      {children}
      <Box>
        <Button
          variant="outlined"
          startIcon={<Svg id="add" width={18} height={18} />}
          onClick={handleActivityAdd}
          sx={{ mr: theme.spacing(1.6) }}
          data-testid="builder-activities-add-activity"
        >
          {t('addBlankActivity')}
        </Button>
        <ButtonWithMenu
          variant="outlined"
          label={t('addPerformanceTask')}
          anchorEl={anchorEl}
          setAnchorEl={setAnchorEl}
          menuItems={getPerformanceTasksMenu(
            headerProps?.onAddActivity || falseReturnFunc,
            setAnchorEl,
          )}
          startIcon={<Svg id="add" width={18} height={18} />}
          menuListWidth="44rem"
          data-testid="builder-activities-add-perf-task"
          menuProps={{ uiType: MenuUiType.Secondary }}
        />
      </Box>
    </StyledBuilderContainerHeader>
  );
};
