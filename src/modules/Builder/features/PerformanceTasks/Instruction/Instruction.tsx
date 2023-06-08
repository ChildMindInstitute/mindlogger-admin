import { useTranslation } from 'react-i18next';

import { ToggleContainerUiType, ToggleItemContainer } from 'modules/Builder/components';

import { InstructionContent } from './InstructionContent';
import { InstructionProps } from './Instruction.types';

export const Instruction = ({ description, name, title }: InstructionProps) => {
  const { t } = useTranslation();

  return (
    <ToggleItemContainer
      uiType={ToggleContainerUiType.PerformanceTask}
      title={title || t('overviewInstruction')}
      Content={() => <InstructionContent description={description} name={name} />}
      isOpenByDefault={false}
    />
  );
};
