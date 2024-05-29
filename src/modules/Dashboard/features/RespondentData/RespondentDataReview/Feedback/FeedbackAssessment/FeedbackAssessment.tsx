import { useMemo, useContext } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useFormContext } from 'react-hook-form';

import { auth } from 'redux/modules';
import { useEncryptedAnswers } from 'modules/Dashboard/hooks';
import { createAssessmentApi, createFlowAssessmentApi } from 'api';
import { getErrorMessage } from 'shared/utils/errors';
import { StyledErrorText, StyledTitleBoldMedium, theme } from 'shared/styles';

import { RespondentDataReviewContext } from '../../RespondentDataReview.context';
import { AssessmentFormItem, FeedbackForm } from '../Feedback.types';
import { StyledContainer } from './FeedbackAssessment.styles';
import { FeedbackAssessmentProps } from './FeedbackAssessment.types';
import { formatAssessmentAnswers, getAssessmentVersion } from './FeedbackAssessment.utils';
import { ActivityCardItemList } from './ActivityCardItemList';

export const FeedbackAssessment = ({
  assessmentStep,
  setAssessmentStep,
  submitCallback,
  setIsLoading,
  setError,
  error,
  userName,
}: FeedbackAssessmentProps) => {
  const { assessment, assessmentVersions, isLastVersion, itemIds, setItemIds } = useContext(
    RespondentDataReviewContext,
  );
  const { appletId = '' } = useParams();
  const [searchParams] = useSearchParams();
  const answerId = searchParams.get('answerId') || null;
  const submitId = searchParams.get('submitId') || null;
  const userData = auth.useData();
  const getEncryptedAnswers = useEncryptedAnswers();

  const methods = useFormContext<FeedbackForm>();
  const {
    getValues,
    reset,
    formState: { defaultValues },
  } = methods;

  const { id: accountId = '' } = userData?.user || {};

  const toNextStep = () => {
    setAssessmentStep((prevAssessmentStep) => prevAssessmentStep + 1);
  };

  const toPrevStep = () => {
    setAssessmentStep((prevAssessmentStep) => prevAssessmentStep - 1);
  };

  const handleSubmitAssessment = async () => {
    try {
      setIsLoading(true);
      const { assessmentItems } = getValues();
      const { answers, updatedItemIds } = formatAssessmentAnswers(
        defaultValues?.assessmentItems as AssessmentFormItem[],
        assessmentItems,
        itemIds,
      );

      const answersToEncrypt = answers.map(({ answer }) => answer);

      if (!getEncryptedAnswers) return;

      const answer = await getEncryptedAnswers(answersToEncrypt);

      if (!appletId) return;

      setItemIds(updatedItemIds);

      if (answerId) {
        await createAssessmentApi({
          appletId,
          answerId,
          answer,
          itemIds: updatedItemIds || [],
          reviewerPublicKey: accountId,
          assessmentVersionId: getAssessmentVersion(isLastVersion, assessmentVersions),
        });
      } else if (submitId) {
        await createFlowAssessmentApi({
          appletId,
          submitId,
          answer,
          itemIds: updatedItemIds || [],
          reviewerPublicKey: accountId,
          assessmentVersionId: getAssessmentVersion(isLastVersion, assessmentVersions),
        });
      }

      reset({
        newNote: '',
        assessmentItems: answers.map(({ answer, itemId }) => ({
          itemId,
          answers: answer.value,
          edited: answer.edited,
        })),
      });
      setAssessmentStep(0);

      submitCallback();
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const activityItems = useMemo(() => {
    if (!assessment?.length) return [];

    return assessment.slice(0, assessmentStep + 1);
  }, [assessment, assessmentStep]);

  const isSubmitVisible = !!assessment && assessmentStep === assessment.length - 1;
  const isBackVisible = activityItems.length > 1;

  return (
    <StyledContainer data-testid="respondents-data-summary-feedback-assessment">
      <StyledTitleBoldMedium sx={{ pb: theme.spacing(1) }}>{userName}</StyledTitleBoldMedium>
      <ActivityCardItemList
        step={assessmentStep}
        activityItems={activityItems}
        isBackVisible={isBackVisible}
        isSubmitVisible={isSubmitVisible}
        toNextStep={toNextStep}
        toPrevStep={toPrevStep}
        onSubmit={handleSubmitAssessment}
      />
      {error && <StyledErrorText sx={{ m: theme.spacing(2, 0, 0) }}>{error}</StyledErrorText>}
    </StyledContainer>
  );
};
