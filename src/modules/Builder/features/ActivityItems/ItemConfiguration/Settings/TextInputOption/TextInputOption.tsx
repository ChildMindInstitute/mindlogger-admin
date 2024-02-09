import get from 'lodash.get';
import { useTranslation } from 'react-i18next';

import { ItemConfigurationSettings } from 'modules/Builder/features/ActivityItems/ItemConfiguration/ItemConfiguration.types';
import { useCustomFormContext } from 'modules/Builder/hooks';
import { Svg } from 'shared/components/Svg';
import {
  theme,
  variables,
  StyledLabelBoldLarge,
  StyledClearedButton,
  StyledBodyLarge,
  StyledContainerWithBg,
} from 'shared/styles';

import {
  StyledTextInputOptionHeader,
  StyledTextInputOptionDescription,
  StyledTextInputOptionHelpText,
} from './TextInputOption.styles';
import { TextInputOptionProps } from './TextInputOption.types';

export const TextInputOption = ({ name, onRemove }: TextInputOptionProps) => {
  const { t } = useTranslation('app');

  const { watch } = useCustomFormContext();

  const settings = watch(`${name}.config`);

  const isTextInputOptionRequired = get(settings, ItemConfigurationSettings.IsTextInputRequired);

  const requiredContext = isTextInputOptionRequired ? { context: 'required' } : undefined;

  return (
    <StyledContainerWithBg data-testid="builder-activity-items-item-configuration-text-input-option">
      <StyledTextInputOptionHeader>
        <StyledLabelBoldLarge data-testid="builder-activity-items-item-configuration-text-input-option-title">
          {t('textInputOptionLabel', requiredContext)}
        </StyledLabelBoldLarge>
        <StyledClearedButton
          sx={{ p: theme.spacing(1), mr: theme.spacing(0.2) }}
          onClick={onRemove}
          data-testid="builder-activity-items-item-configuration-text-input-option-remove"
        >
          <Svg id="trash" width="20" height="20" />
        </StyledClearedButton>
      </StyledTextInputOptionHeader>
      <StyledTextInputOptionDescription>
        <StyledBodyLarge
          sx={{ opacity: variables.opacity.disabled, color: variables.palette.outline }}
          data-testid="builder-activity-items-item-configuration-text-input-option-description"
        >
          {t('textInputOptionDescription', requiredContext)}
        </StyledBodyLarge>
      </StyledTextInputOptionDescription>
      {isTextInputOptionRequired && (
        <StyledTextInputOptionHelpText data-testid="builder-activity-items-item-configuration-text-input-option-description-required">
          {t('textInputOptionHelpText')}
        </StyledTextInputOptionHelpText>
      )}
    </StyledContainerWithBg>
  );
};
