import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import get from 'lodash.get';

import { Svg } from 'shared/components';
import {
  theme,
  variables,
  StyledLabelBoldLarge,
  StyledClearedButton,
  StyledBodyLarge,
} from 'shared/styles';
import { ItemConfigurationSettings } from 'modules/Builder/features/ActivityItems/ItemConfiguration/ItemConfiguration.types';

import {
  StyledTextInputOptionContainer,
  StyledTextInputOptionHeader,
  StyledTextInputOptionDescription,
  StyledTextInputOptionHelpText,
} from './TextInputOption.styles';
import { TextInputOptionProps } from './TextInputOption.types';

export const TextInputOption = ({ name, onRemove }: TextInputOptionProps) => {
  const { t } = useTranslation('app');

  const { watch } = useFormContext();

  const settings = watch(`${name}.config`);

  const isTextInputOptionRequired = get(settings, ItemConfigurationSettings.IsTextInputRequired);

  const requiredContext = isTextInputOptionRequired ? { context: 'required' } : undefined;

  return (
    <StyledTextInputOptionContainer>
      <StyledTextInputOptionHeader>
        <StyledLabelBoldLarge>{t('textInputOptionLabel', requiredContext)}</StyledLabelBoldLarge>
        <StyledClearedButton
          sx={{ p: theme.spacing(1), mr: theme.spacing(0.2) }}
          onClick={onRemove}
        >
          <Svg id="trash" width="20" height="20" />
        </StyledClearedButton>
      </StyledTextInputOptionHeader>
      <StyledTextInputOptionDescription>
        <StyledBodyLarge sx={{ opacity: '0.38', color: variables.palette.outline }}>
          {t('textInputOptionDescription', requiredContext)}
        </StyledBodyLarge>
      </StyledTextInputOptionDescription>
      {isTextInputOptionRequired && (
        <StyledTextInputOptionHelpText>
          {t('textInputOptionHelpText')}
        </StyledTextInputOptionHelpText>
      )}
    </StyledTextInputOptionContainer>
  );
};
