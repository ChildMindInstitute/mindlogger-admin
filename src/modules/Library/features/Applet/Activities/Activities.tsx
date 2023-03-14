import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Svg } from 'shared/components';
import { StyledHeadline, StyledLabelBoldLarge } from 'shared/styles/styledComponents';

import { ActivitiesProps } from './Activities.types';
import { StyledActivitiesContainer, StyledExpandedButton } from './Activities.styles';
import { AppletUiType } from '../';

export const Activities = ({ uiType = AppletUiType.List }: ActivitiesProps) => {
  const { t } = useTranslation('app');
  const [activitiesVisible, setActivitiesVisible] = useState(uiType === AppletUiType.Details);

  return (
    <StyledActivitiesContainer uiType={uiType}>
      {uiType === AppletUiType.Details ? (
        <StyledHeadline>{`${t('appletActivities')}:`}</StyledHeadline>
      ) : (
        <StyledExpandedButton
          disableRipple
          onClick={() => setActivitiesVisible((prevState) => !prevState)}
          startIcon={<Svg id={activitiesVisible ? 'navigate-up' : 'navigate-down'} />}
        >
          <StyledLabelBoldLarge>{t('activities')}</StyledLabelBoldLarge>
        </StyledExpandedButton>
      )}
    </StyledActivitiesContainer>
  );
};
