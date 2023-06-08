import { useFormContext } from 'react-hook-form';

import { StyledBodyLarge, theme } from 'shared/styles';
import { useCurrentActivity } from 'modules/Builder/hooks';
import { EditorController, EditorUiType } from 'shared/components/FormComponents';

import { InstructionProps } from '../Instruction.types';

export const InstructionContent = ({ description, name }: Omit<InstructionProps, 'title'>) => {
  const { control } = useFormContext();
  const { perfTaskItemField } = useCurrentActivity();

  return (
    <>
      <StyledBodyLarge sx={{ mb: theme.spacing(2) }}>{description}</StyledBodyLarge>
      <EditorController
        uiType={EditorUiType.Secondary}
        name={name || `${perfTaskItemField}.general.instruction`}
        control={control}
      />
    </>
  );
};
