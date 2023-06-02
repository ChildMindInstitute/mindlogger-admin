import { useFormContext } from 'react-hook-form';

import { StyledBodyLarge, theme } from 'shared/styles';
import { useCurrentActivity } from 'modules/Builder/hooks';
import { EditorController, EditorUiType } from 'shared/components/FormComponents';

import { OverviewInstructionProps } from '../OverviewInstruction.types';

export const InstructionContent = ({ instructionType, description }: OverviewInstructionProps) => {
  const { control } = useFormContext();
  const { perfTaskItemField } = useCurrentActivity();

  return (
    <>
      <StyledBodyLarge sx={{ mb: theme.spacing(2) }}>{description}</StyledBodyLarge>
      <EditorController
        uiType={EditorUiType.Secondary}
        name={`${perfTaskItemField}.${instructionType}.instruction`}
        control={control}
      />
    </>
  );
};
