import { useTranslation } from 'react-i18next';

import { DefaultTabs as Tabs, Svg } from 'shared/components';
import {
  StyledFlexAllCenter,
  StyledFlexTopStart,
  StyledLabelBoldLarge,
  theme,
} from 'shared/styles';
import { UiType } from 'shared/components/Tabs/Tabs.types';

import { StyledButton, StyledContainer } from './Feedback.styles';
import { getTabs } from './Feedback.const';
import { FeedbackProps } from './Feedback.types';

export const Feedback = ({ onClose, selectedActivity }: FeedbackProps) => {
  const { t } = useTranslation();

  const tabs = getTabs(selectedActivity);

  return (
    <StyledContainer>
      <StyledFlexAllCenter
        sx={{ justifyContent: 'space-between', margin: theme.spacing(3.2, 3.2, 0) }}
      >
        <StyledFlexTopStart>
          <Svg id="item-outlined" width="18" height="18" />
          <StyledLabelBoldLarge sx={{ marginLeft: theme.spacing(2) }}>
            {t('feedback')}
          </StyledLabelBoldLarge>
        </StyledFlexTopStart>
        <StyledButton onClick={onClose}>
          <Svg id="cross" />
        </StyledButton>
      </StyledFlexAllCenter>
      <Tabs tabs={tabs} uiType={UiType.Secondary} />
    </StyledContainer>
  );
};
