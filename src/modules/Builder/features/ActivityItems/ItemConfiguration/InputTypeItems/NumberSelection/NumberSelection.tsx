import { useTranslation } from 'react-i18next';
import { FieldValues } from 'react-hook-form';

import { InputController } from 'shared/components/FormComponents';
import { StyledFlexTopCenter, theme } from 'shared/styles';
import { ItemInputTypes } from 'shared/types/activityItems';

import { StyledInputWrapper } from './NumberSelection.styles';
import { NumberSelectionProps } from './NumberSelection.types';
import { ItemOptionContainer } from '../ItemOptionContainer';
import { useOptionalItemSetup } from '../../ItemConfiguration.hooks';
import { DEFAULT_MAX_NUMBER, DEFAULT_MIN_NUMBER } from '../../ItemConfiguration.const';

export const NumberSelection = <T extends FieldValues>({
  name,
  maxName,
}: NumberSelectionProps<T>) => {
  const { t } = useTranslation('app');

  const { control } = useOptionalItemSetup({
    itemType: ItemInputTypes.NumberSelection,
    name,
    defaultValue: DEFAULT_MIN_NUMBER,
  });

  useOptionalItemSetup({
    itemType: ItemInputTypes.NumberSelection,
    name: maxName,
    defaultValue: DEFAULT_MAX_NUMBER,
  });

  const commonProps = {
    control,
    type: 'number',
  };

  return (
    <ItemOptionContainer title={t('numberSelection')}>
      <StyledFlexTopCenter sx={{ justifyContent: 'space-between' }}>
        <StyledInputWrapper sx={{ mr: theme.spacing(1.25) }}>
          <InputController {...commonProps} name={name} label={t('minValue')} />
        </StyledInputWrapper>
        <StyledInputWrapper sx={{ ml: theme.spacing(1.25) }}>
          <InputController {...commonProps} name={maxName} label={t('maxValue')} />
        </StyledInputWrapper>
      </StyledFlexTopCenter>
    </ItemOptionContainer>
  );
};
