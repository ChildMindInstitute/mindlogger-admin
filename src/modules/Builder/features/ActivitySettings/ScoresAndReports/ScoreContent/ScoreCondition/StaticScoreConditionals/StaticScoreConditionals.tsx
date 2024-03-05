import { Skeleton } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { StyledItemOption, ToggleContainerUiType } from 'modules/Builder/components';
import { ScoreConditionalLogic } from 'redux/modules';
import { StyledTitleMedium, theme } from 'shared/styles';
import { getEntityKey } from 'shared/utils';

import { StaticScoreCondition } from '../StaticScoreCondition/StaticScoreCondition';

export const StaticScoreConditionals = ({
  scoreConditionals,
}: {
  scoreConditionals: ScoreConditionalLogic[];
}) => {
  const { t } = useTranslation('app');

  if (!scoreConditionals?.length) return null;

  return (
    <>
      <StyledTitleMedium sx={{ m: theme.spacing(2.4, 0) }}>
        {t('scoreConditions')}
      </StyledTitleMedium>
      {scoreConditionals.map((item, key) => (
        <StyledItemOption key={getEntityKey(item)} uiType={ToggleContainerUiType.Score}>
          <Skeleton variant="rounded" height={60} sx={{ mb: theme.spacing(1.2), width: '100%' }} />
          <StaticScoreCondition key={key} />
        </StyledItemOption>
      ))}
    </>
  );
};
