import { useContext, useEffect, useMemo, useState } from 'react';
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
import { RespondentDataReviewContext } from 'modules/Dashboard/features/RespondentData/RespondentDataReview/RespondentDataReview.context';

import { StyledButton, StyledContainer } from './Feedback.styles';
import { FeedbackTabs, getTabs } from './Feedback.const';
import { FeedbackForm, FeedbackProps } from './Feedback.types';
import { getDefaultFormValues } from './Feedback.utils';

export const Feedback = ({ onClose, selectedActivity }: FeedbackProps) => {
  const { t } = useTranslation();
  const { assessment, isFeedbackOpen } = useContext(RespondentDataReviewContext);
  const [assessmentStep, setAssessmentStep] = useState(0);
  const [activeTab, setActiveTab] = useState(FeedbackTabs.Notes);

  const methods = useForm<FeedbackForm>({
    defaultValues: getDefaultFormValues(assessment),
  });

  const tabs = useMemo(
    () => getTabs(selectedActivity, setActiveTab, assessment, assessmentStep, setAssessmentStep),
    [selectedActivity, assessment, assessmentStep],
  );

  useEffect(() => {
    setActiveTab(FeedbackTabs.Notes);
    setAssessmentStep(0);
    methods.reset(getDefaultFormValues(assessment));
  }, [assessment]);

  return (
    <StyledContainer sx={{ display: isFeedbackOpen ? 'flex' : 'none' }}>
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
      <FormProvider {...methods}>
        <Tabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tabs={tabs}
          uiType={UiType.Secondary}
        />
      </FormProvider>
    </StyledContainer>
  );
};
