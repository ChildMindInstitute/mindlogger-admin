import { useState, useMemo, useContext } from 'react';

import { useFormContext } from 'react-hook-form';
import { useParams, useSearchParams } from 'react-router-dom';

import { createAssessmentApi } from 'api';
import { RespondentDataReviewContext } from 'modules/Dashboard/features/RespondentData/RespondentDataReview/RespondentDataReview.context';
import { useEncryptedAnswers } from 'modules/Dashboard/hooks';
import { auth } from 'redux/modules';

import { AssessmentActivityItem } from '../../RespondentDataReview.types';
import { AssessmentFormItem, FeedbackForm } from '../Feedback.types';
import { getDefaultFormValues } from '../Feedback.utils';
import { ActivityCardItemList } from './ActivityCardItemList';
import { AssessmentBanner } from './AssessmentBanner';
import { FeedbackTabs } from './FeedbackAssessment.const';
import { StyledContainer } from './FeedbackAssessment.styles';
import { FeedbackAssessmentProps } from './FeedbackAssessment.types';
import { formatAssessmentAnswers, getAssessmentVersion } from './FeedbackAssessment.utils';
import { SubmitAssessmentPopup } from './SubmitAssessmentPopup';

export const FeedbackAssessment = ({ setActiveTab, assessmentStep, setAssessmentStep }: FeedbackAssessmentProps) => {
  const {
    assessment,
    setAssessment,
    lastAssessment,
    assessmentVersions,
    isLastVersion,
    setIsLastVersion,
    isBannerVisible,
    setIsBannerVisible,
    itemIds,
    setItemIds,
  } = useContext(RespondentDataReviewContext);
  const { appletId = '' } = useParams();
  const [searchParams] = useSearchParams();
  const answerId = searchParams.get('answerId');
  const userData = auth.useData();
  const getEncryptedAnswers = useEncryptedAnswers();

  const methods = useFormContext<FeedbackForm>();
  const {
    getValues,
    formState: { defaultValues },
  } = methods;

  const [submitAssessmentPopupVisible, setSubmitAssessmentPopupVisible] = useState(false);

  const { id: accountId = '' } = userData?.user || {};

  const toNextStep = () => {
    setAssessmentStep(assessmentStep + 1);
  };

  const toPrevStep = () => {
    setAssessmentStep(assessmentStep - 1);
  };

  const handleSubmitAssessment = async () => {
    try {
      const { assessmentItems } = getValues();
      const { answers, updatedItemIds } = formatAssessmentAnswers(
        defaultValues?.assessmentItems as AssessmentFormItem[],
        assessmentItems,
        itemIds,
      );

      const answersToEncrypt = answers.map(({ answer }) => answer);

      if (!getEncryptedAnswers) return;

      const answer = await getEncryptedAnswers(answersToEncrypt);

      if (!appletId || !answerId) return;

      setItemIds(updatedItemIds);

      await createAssessmentApi({
        appletId,
        answerId,
        answer,
        itemIds: updatedItemIds || [],
        reviewerPublicKey: accountId,
        assessmentVersionId: getAssessmentVersion(isLastVersion, assessmentVersions),
      });
      setSubmitAssessmentPopupVisible(false);
      methods.reset({
        newNote: '',
        assessmentItems: answers.map(({ answer, itemId }) => ({
          itemId,
          answers: answer.value,
          edited: answer.edited,
        })),
      });
      setActiveTab(FeedbackTabs.Reviewed);
      setAssessmentStep(0);
    } catch (error) {
      console.warn(error);
    }
  };

  const handleSelectLastVersion = () => {
    if (!lastAssessment?.length) return;

    setIsLastVersion(true);
    setIsBannerVisible(false);

    const updatedAssessment = lastAssessment.map((activityItem) => ({
      activityItem,
      answer: undefined,
    })) as AssessmentActivityItem[];
    setAssessment(updatedAssessment);
    setAssessmentStep(0);
    methods.reset(getDefaultFormValues(updatedAssessment));
  };

  const activityItems = useMemo(() => {
    if (!assessment?.length) return [];

    return assessment.slice(0, assessmentStep + 1).reverse();
  }, [assessment, assessmentStep]);

  const isSubmitVisible = assessmentStep === assessment!.length - 1;
  const isBackVisible = activityItems.length > 1;

  return (
    <StyledContainer>
      <AssessmentBanner isBannerVisible={isBannerVisible} onSelectLastVersion={handleSelectLastVersion} />
      <ActivityCardItemList
        step={assessmentStep}
        activityItems={activityItems}
        isBackVisible={isBackVisible}
        isSubmitVisible={isSubmitVisible}
        toNextStep={toNextStep}
        toPrevStep={toPrevStep}
        onSubmit={() => {
          setSubmitAssessmentPopupVisible(true);
        }}
      />
      {submitAssessmentPopupVisible && (
        <SubmitAssessmentPopup
          popupVisible={submitAssessmentPopupVisible}
          setPopupVisible={setSubmitAssessmentPopupVisible}
          submitAssessment={handleSubmitAssessment}
        />
      )}
    </StyledContainer>
  );
};
