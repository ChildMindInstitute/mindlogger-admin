import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';

import { StyledBodyLarge, StyledBodyMedium, theme, variables } from 'shared/styles';
import { useCurrentActivity } from 'modules/Builder/hooks';
import { EditorController, EditorUiType } from 'shared/components/FormComponents';

import { InstructionContentProps } from './InstructionContent.types';

export const InstructionContent = ({ description, name, hasError }: InstructionContentProps) => {
  const { t } = useTranslation();
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
      {hasError && (
        <StyledBodyMedium sx={{ pt: theme.spacing(0.5) }} color={variables.palette.semantic.error}>
          {t('fillInAllRequired')}
        </StyledBodyMedium>
      )}
    </>
  );
};
