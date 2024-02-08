import { useContext, useMemo, useState } from 'react';

import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { RespondentDataReviewContext } from 'modules/Dashboard/features/RespondentData/RespondentDataReview/RespondentDataReview.context';
import { DefaultTabs as Tabs, Svg } from 'shared/components';
import { UiType } from 'shared/components/Tabs/Tabs.types';
import { StyledFlexAllCenter, StyledFlexTopStart, StyledLabelBoldLarge, theme } from 'shared/styles';

import { getTabs } from './Feedback.const';
import { StyledButton, StyledContainer } from './Feedback.styles';
import { FeedbackForm, FeedbackProps } from './Feedback.types';
import { getDefaultFormValues } from './Feedback.utils';
import { FeedbackTabs } from './FeedbackAssessment/FeedbackAssessment.const';

export const Feedback = ({ onClose, selectedActivity }: FeedbackProps) => {
  const { t } = useTranslation();
  const { assessment, isFeedbackOpen } = useContext(RespondentDataReviewContext);
  const [assessmentStep, setAssessmentStep] = useState(0);
  const [activeTab, setActiveTab] = useState(FeedbackTabs.Notes);

  const dataTestid = 'respondents-review-feedback-menu';

  const methods = useForm<FeedbackForm>({
    defaultValues: getDefaultFormValues(assessment),
  });

  const tabs = useMemo(
    () => getTabs(selectedActivity, setActiveTab, assessment, assessmentStep, setAssessmentStep),
    [selectedActivity, assessment, assessmentStep],
  );

  return (
    <StyledContainer sx={{ display: isFeedbackOpen ? 'flex' : 'none' }} data-testid={dataTestid}>
      <StyledFlexAllCenter sx={{ justifyContent: 'space-between', margin: theme.spacing(3.2, 3.2, 0) }}>
        <StyledFlexTopStart>
          <Svg id="item-outlined" width="18" height="18" />
          <StyledLabelBoldLarge sx={{ marginLeft: theme.spacing(2) }}>{t('feedback')}</StyledLabelBoldLarge>
        </StyledFlexTopStart>
        <StyledButton onClick={onClose} data-testid={`${dataTestid}-close`}>
          <Svg id="cross" />
        </StyledButton>
      </StyledFlexAllCenter>
      <FormProvider {...methods}>
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} uiType={UiType.Secondary} />
      </FormProvider>
    </StyledContainer>
  );
};
