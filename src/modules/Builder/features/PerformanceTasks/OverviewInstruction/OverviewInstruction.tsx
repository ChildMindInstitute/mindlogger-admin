import { useTranslation } from 'react-i18next';

import { ToggleContainerUiType, ToggleItemContainer } from 'modules/Builder/components';

import { InstructionContent } from './InstructionContent';
import { OverviewInstructionProps } from './OverviewInstruction.types';

export const OverviewInstruction = ({ description }: OverviewInstructionProps) => {
  const { t } = useTranslation();

  return (
    <ToggleItemContainer
      uiType={ToggleContainerUiType.PerformanceTask}
      title={t('overviewInstruction')}
      Content={() => <InstructionContent description={description} />}
      isOpenByDefault={false}
    />
  );
};
