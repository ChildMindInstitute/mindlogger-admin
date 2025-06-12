import { useTranslation } from 'react-i18next';

import { useCustomFormContext } from 'modules/Builder/hooks';
import { EditorController, EditorUiType } from 'shared/components/FormComponents';
import { StyledBodyLarge, StyledBodyMedium, theme, variables } from 'shared/styles';

import { InstructionContentProps } from './InstructionContent.types';

export const InstructionContent = ({
  description,
  name,
  hasError,
  instructionId,
  'data-testid': dataTestid,
}: InstructionContentProps) => {
  const { t } = useTranslation('app');
  const { control } = useCustomFormContext();

  return (
    <>
      <StyledBodyLarge sx={{ mb: theme.spacing(2) }}>{description}</StyledBodyLarge>
      <EditorController
        uiType={EditorUiType.Secondary}
        name={name}
        control={control}
        editorId={instructionId}
        data-testid={`${dataTestid}-instruction`}
      />
      {hasError && (
        <StyledBodyMedium sx={{ pt: theme.spacing(0.5) }} color={variables.palette.error}>
          {t('fillInAllRequired')}
        </StyledBodyMedium>
      )}
    </>
  );
};
