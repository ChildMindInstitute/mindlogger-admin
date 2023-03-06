import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Svg } from 'components';
import { page } from 'resources';
import { StyledBuilderWrapper, StyledTitleMedium } from 'styles/styledComponents';
import theme from 'styles/theme';
import { useBreadcrumbs } from 'hooks';

import { Header, Item } from '../../components';
import { activityFlows, getActions } from './ActivityFlow.const';
import { StyledAdd, StyledAddWrapper } from './ActivityFlow.styles';

export const ActivityFlow = () => {
  const { t } = useTranslation('app');
  const navigate = useNavigate();

  useBreadcrumbs([
    {
      icon: <Svg id="flow" width="18" height="18" />,
      label: t('activityFlow'),
    },
  ]);

  return (
    <StyledBuilderWrapper>
      <Header
        title={t('activityFlow')}
        buttons={[
          {
            icon: <Svg id="flow" />,
            label: t('addActivityFlow'),
            handleClick: () => navigate(page.newAppletNewActivityFlow),
          },
        ]}
      />
      {activityFlows?.length ? (
        <>
          {activityFlows.map((item, i) => (
            <Fragment key={item.id}>
              <Item {...item} getActions={getActions} />
              {i >= 0 && i < activityFlows.length - 1 && (
                <StyledAddWrapper>
                  <span />
                  <StyledAdd>
                    <Svg id="add" width={18} height={18} />
                  </StyledAdd>
                </StyledAddWrapper>
              )}
            </Fragment>
          ))}
        </>
      ) : (
        <StyledTitleMedium sx={{ marginTop: theme.spacing(0.4) }}>
          {t('activityFlowIsRequired')}
        </StyledTitleMedium>
      )}
    </StyledBuilderWrapper>
  );
};
