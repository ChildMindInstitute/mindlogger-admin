import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import get from 'lodash.get';

import { ToggleContainerUiType, ToggleItemContainer } from 'modules/Builder/components';
import { useCurrentActivity } from 'modules/Builder/hooks';

import { InstructionContent } from './InstructionContent';
import { InstructionProps } from './Instruction.types';

export const Instruction = ({ description, name, title, type }: InstructionProps) => {
  const { t } = useTranslation();

  const {
    formState: { errors },
  } = useFormContext();
  const { perfTaskItemObjField } = useCurrentActivity();

  const hasError = !!get(errors, `${perfTaskItemObjField}.${type}.instruction`);

  return (
    <ToggleItemContainer
      uiType={ToggleContainerUiType.PerformanceTask}
      title={title || t('overviewInstruction')}
      isOpenByDefault={false}
      Content={InstructionContent}
      contentProps={{ description, name, hasError }}
      error={hasError ? 'blockIsNecessary' : null}
    />
  );
};
