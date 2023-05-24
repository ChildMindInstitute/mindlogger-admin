import { useFormContext } from 'react-hook-form';

import { StyledBodyLarge, theme } from 'shared/styles';
import { useCurrentActivity } from 'modules/Builder/pages/BuilderApplet/BuilderApplet.hooks';
import { EditorController, EditorUiType } from 'shared/components/FormComponents';

import { OverviewInstructionProps } from '../OverviewInstruction.types';

export const InstructionContent = ({ description }: OverviewInstructionProps) => {
  const { control } = useFormContext();
  const { fieldName } = useCurrentActivity();

  return (
    <>
      <StyledBodyLarge sx={{ mb: theme.spacing(2) }}>{description}</StyledBodyLarge>
      <EditorController
        uiType={EditorUiType.Secondary}
        name={`${fieldName}.general.instruction`}
        control={control}
      />
    </>
  );
};
