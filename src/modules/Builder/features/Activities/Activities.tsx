import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Svg } from 'components';
import { StyledTitleMedium, StyledBuilderWrapper } from 'styles/styledComponents';
import theme from 'styles/theme';
import { useBreadcrumbs } from 'hooks';
import { page } from 'resources';

import { Header, Item } from '../../components';
import { activities, getActions } from './Activities.const';

export const Activities = () => {
  const { t } = useTranslation('app');
  const navigate = useNavigate();

  useBreadcrumbs([
    {
      icon: <Svg id="checklist-filled" width="18" height="18" />,
      label: t('activities'),
    },
  ]);

  return (
    <StyledBuilderWrapper>
      <Header
        title={t('activities')}
        buttons={[
          {
            icon: <Svg id="checklist-filled" />,
            label: t('addActivity'),
            handleClick: () => navigate(page.newAppletNewActivity),
          },
        ]}
      />
      {activities?.length ? (
        activities.map((item) => <Item key={item.id} {...item} getActions={getActions} withHover />)
      ) : (
        <StyledTitleMedium sx={{ marginTop: theme.spacing(0.4) }}>
          {t('activityIsRequired')}
        </StyledTitleMedium>
      )}
    </StyledBuilderWrapper>
  );
};
