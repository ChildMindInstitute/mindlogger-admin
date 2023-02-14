import { useTranslation } from 'react-i18next';

import { Svg, BuilderItem, BuilderHeader } from 'components';
import { StyledTitleMedium, StyledWrapper } from 'styles/styledComponents';
import theme from 'styles/theme';

import { activities, getActions } from './Activities.const';

export const Activities = () => {
  const { t } = useTranslation('app');

  return (
    <StyledWrapper>
      <BuilderHeader
        title={t('activities')}
        buttons={[{ icon: <Svg id="checklist" />, label: t('addActivity') }]}
      />
      {activities?.length ? (
        activities.map((item) => (
          <BuilderItem key={item.id} {...item} getActions={getActions} withHover />
        ))
      ) : (
        <StyledTitleMedium sx={{ marginTop: theme.spacing(0.4) }}>
          {t('activityIsRequired')}
        </StyledTitleMedium>
      )}
    </StyledWrapper>
  );
};
