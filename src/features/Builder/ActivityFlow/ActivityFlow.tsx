import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';

import { BuilderItem, BuilderHeader, Svg } from 'components';
import { StyledBuilderWrapper, StyledTitleMedium } from 'styles/styledComponents';
import theme from 'styles/theme';

import { activityFlows, getActions } from './ActivityFlow.const';
import { StyledAdd, StyledAddWrapper } from './ActivityFlow.styles';

export const ActivityFlow = () => {
  const { t } = useTranslation('app');

  return (
    <StyledBuilderWrapper>
      <BuilderHeader
        title={t('activityFlow')}
        buttons={[{ icon: <Svg id="flow" />, label: t('addActivityFlow') }]}
      />
      {activityFlows?.length ? (
        <>
          {activityFlows.map((item, i) => (
            <Fragment key={item.id}>
              <BuilderItem {...item} getActions={getActions} />
              {i === 0 && (
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
