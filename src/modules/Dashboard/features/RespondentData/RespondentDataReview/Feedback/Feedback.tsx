import { useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FormProvider, useForm } from 'react-hook-form';

import { DefaultTabs as Tabs, Svg } from 'shared/components';
import {
  StyledFlexAllCenter,
  StyledFlexTopStart,
  StyledLabelBoldLarge,
  theme,
} from 'shared/styles';
import { UiType } from 'shared/components/Tabs/Tabs.types';

import { RespondentDataReviewContext } from '../RespondentDataReview.context';
import { StyledButton, StyledContainer } from './Feedback.styles';
import { FeedbackForm, FeedbackProps } from './Feedback.types';
import { getDefaultFormValues, getTabs } from './Feedback.utils';
import { FeedbackTabs } from './FeedbackAssessment/FeedbackAssessment.const';
import { ANIMATION_DURATION_MS } from './Feedback.const';

export const Feedback = ({ onClose, selectedActivity }: FeedbackProps) => {
  const { t } = useTranslation();
  const { assessment, isFeedbackOpen } = useContext(RespondentDataReviewContext);
  const [activeTab, setActiveTab] = useState(FeedbackTabs.Notes);

  const dataTestid = 'respondents-review-feedback-menu';

  const methods = useForm<FeedbackForm>({
    defaultValues: getDefaultFormValues(assessment),
  });

  const tabs = useMemo(() => getTabs(selectedActivity, assessment), [selectedActivity, assessment]);

  return (
    <StyledContainer isOpen={isFeedbackOpen} data-testid={dataTestid}>
      {isFeedbackOpen && (
        <>
          <StyledFlexAllCenter
            sx={{ justifyContent: 'space-between', m: theme.spacing(3.2, 3.2, 0) }}
          >
            <StyledFlexTopStart>
              <Svg id="item-outlined" width="18" height="18" />
              <StyledLabelBoldLarge sx={{ marginLeft: theme.spacing(2) }}>
                {t('feedback')}
              </StyledLabelBoldLarge>
            </StyledFlexTopStart>
            <StyledButton onClick={onClose} data-testid={`${dataTestid}-close`}>
              <Svg id="cross" />
            </StyledButton>
          </StyledFlexAllCenter>
          <FormProvider {...methods}>
            <Tabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              tabs={tabs}
              uiType={UiType.Secondary}
              animationDurationMs={ANIMATION_DURATION_MS}
              variant="fullWidth"
            />
          </FormProvider>
        </>
      )}
    </StyledContainer>
  );
};
