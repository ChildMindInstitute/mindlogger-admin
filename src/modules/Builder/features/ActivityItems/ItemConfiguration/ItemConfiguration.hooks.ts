import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { useCurrentActivity } from 'modules/Builder/hooks';
import { doubleBrackets } from 'shared/utils';

import { checkIfQuestionIncludesVariables } from './ItemConfiguration.utils';

export const useCheckIfItemHasVariables = (itemField: string) => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const { watch, setValue, trigger } = useFormContext();
  const { fieldName } = useCurrentActivity();
  const activityItems = watch(`${fieldName}.items`) ?? [];
  const questionField = `${itemField}.question`;
  const isSkippable = watch(`${fieldName}.isSkippable`);
  const question = watch(questionField) ?? '';
  const isQuestionIncludesVariables =
    isSkippable && checkIfQuestionIncludesVariables(question, activityItems);
  const message = 'variablesWarning.isSkippable';

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
