import { useTranslation } from 'react-i18next';
import { FieldValues } from 'react-hook-form';

import { InputController } from 'shared/components/FormComponents';
import { ItemInputTypes } from 'shared/types';

import { ItemOptionContainer } from '../ItemOptionContainer';
import { TextResponseProps } from './TextResponse.types';
import { StyledMaxCharacters, StyledRow, StyledTextField } from './TextResponse.styles';
import { useOptionalItemSetup } from '../../ItemConfiguration.hooks';
import { DEFAULT_MAX_CHARACTERS } from '../../ItemConfiguration.const';
import { ItemConfigurationSettings } from '../../ItemConfiguration.types';

export const TextResponse = <T extends FieldValues>({
  name,
  maxCharacters,
}: TextResponseProps<T>) => {
  const { t } = useTranslation('app');

  const { control, watch } = useOptionalItemSetup({
    itemType: ItemInputTypes.Text,
    name,
    defaultValue: '',
  });

  useOptionalItemSetup({
    itemType: ItemInputTypes.Text,
    name: maxCharacters,
    defaultValue: DEFAULT_MAX_CHARACTERS,
  });

  const settings = watch('settings');

  const isCorrectAnswerRequired = settings?.includes(
    ItemConfigurationSettings.IsCorrectAnswerRequired,
  );

  return (
    <ItemOptionContainer title={t('textResponseTitle')} description={t('textResponseDescription')}>
      <StyledRow>
        <StyledTextField disabled variant="outlined" value={t('text')} />
        <StyledMaxCharacters>
          <InputController
            name={maxCharacters}
            control={control}
            type="number"
            label={t('maxCharacters')}
          />
        </StyledMaxCharacters>
      </StyledRow>
      {isCorrectAnswerRequired && (
        <InputController name={name} control={control} label={t('correctAnswer')} />
      )}
    </ItemOptionContainer>
  );
};
