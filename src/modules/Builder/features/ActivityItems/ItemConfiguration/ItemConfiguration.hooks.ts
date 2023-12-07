import { useEffect, useState } from 'react';

import { useCurrentActivity, useCustomFormContext } from 'modules/Builder/hooks';
import { doubleBrackets } from 'shared/utils';

import { checkIfQuestionIncludesVariables } from './ItemConfiguration.utils';

export const useCheckIfItemHasVariables = (itemField: string) => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const { watch, setValue, trigger } = useCustomFormContext();
  const { fieldName } = useCurrentActivity();
  const activityItems = watch(`${fieldName}.items`) ?? [];
  const questionField = `${itemField}.question`;
  const isSkippable = watch(`${fieldName}.isSkippable`);
  const isShowAllAtOnce = watch(`${fieldName}.showAllAtOnce`);
  const question = watch(questionField) ?? '';
  const isQuestionIncludesVariables =
    (isSkippable || isShowAllAtOnce) && checkIfQuestionIncludesVariables(question, activityItems);
  const message = isSkippable ? 'variablesWarning.isSkippable' : 'variablesWarning.showAllAtOnce';

  const onPopupConfirm = () => {
    setValue(questionField, question.replace(doubleBrackets, ''));
    trigger(questionField);
    setIsPopupVisible(false);
  };

  useEffect(() => {
    setIsPopupVisible(isQuestionIncludesVariables);
  }, [isQuestionIncludesVariables]);

  return { isPopupVisible, onPopupConfirm, message };
};
