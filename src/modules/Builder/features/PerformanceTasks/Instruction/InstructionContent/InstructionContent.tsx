import { useFormContext } from 'react-hook-form';

import { StyledBodyLarge, theme } from 'shared/styles';
import { useCurrentActivity } from 'modules/Builder/hooks';
import { EditorController, EditorUiType } from 'shared/components/FormComponents';

import { InstructionContentType } from './InstructionContent.types';

export const InstructionContent = ({ description, name }: InstructionContentType) => {
  const { control } = useFormContext();
  const { fieldName } = useCurrentActivity();

  return (
    <>
      <StyledBodyLarge sx={{ mb: theme.spacing(2) }}>{description}</StyledBodyLarge>
      <EditorController
        uiType={EditorUiType.Secondary}
        name={name || `${fieldName}.general.instruction`}
        control={control}
      />
    </>
  );
};
