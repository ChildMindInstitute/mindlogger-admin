import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import get from 'lodash.get';

import { StyledBodyMedium, StyledBodyLarge, theme, variables } from 'shared/styles';
import { EditorController, EditorUiType } from 'shared/components/FormComponents';
import { useCurrentActivity } from 'modules/Builder/hooks';

import { InstructionProps } from '../Instruction.types';

export const InstructionContent = ({
  description,
  name,
  type,
}: Omit<InstructionProps, 'title'>) => {
  const { control } = useFormContext();
  const { perfTaskItemField } = useCurrentActivity();
  const { t } = useTranslation();
  const {
    formState: { errors },
  } = useFormContext();
  const { perfTaskItemObjField } = useCurrentActivity();

  return (
    <>
      <StyledBodyLarge sx={{ mb: theme.spacing(2) }}>{description}</StyledBodyLarge>
      <EditorController
        uiType={EditorUiType.Secondary}
        name={name || `${perfTaskItemField}.general.instruction`}
        control={control}
      />
      {type && !!get(errors, `${perfTaskItemObjField}.${type}.instruction`) && (
        <StyledBodyMedium color={variables.palette.semantic.error}>
          {t('fillInAllRequired')}
        </StyledBodyMedium>
      )}
    </>
  );
};
