import { useTranslation } from 'react-i18next';

import { ToggleContainerUiType, ToggleItemContainer } from 'modules/Builder/components';

import { InstructionContent } from './InstructionContent';
import { InstructionProps } from './Instruction.types';

export const Instruction = ({
  description,
  name,
  title,
  hasError,
  instructionId,
  'data-testid': dataTestid,
}: InstructionProps) => {
  const { t } = useTranslation();

  return (
    <ToggleItemContainer
      uiType={ToggleContainerUiType.PerformanceTask}
      title={title || t('overviewInstruction')}
      isOpenByDefault={false}
      Content={InstructionContent}
      contentProps={{ description, name, hasError, instructionId, 'data-testid': dataTestid }}
      errorMessage={hasError ? 'blockIsNecessary' : null}
      headerToggling
      data-testid={dataTestid}
    />
  );
};
