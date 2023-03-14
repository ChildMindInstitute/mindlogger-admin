import { useTranslation } from 'react-i18next';
import { FieldValues } from 'react-hook-form';

import { InputController } from 'shared/components/FormComponents';

import { ItemOptionContainer } from '../ItemOptionContainer';
import { TextResponseProps } from './TextResponse.types';
import { StyledMaxCharacters, StyledRow, StyledTextField } from './TextResponse.styles';
import { useOptionalItemSetup } from '../../ItemConfiguration.hooks';
import { ItemInputTypes } from '../../ItemConfiguration.types';
import { DEFAULT_MAX_CHARACTERS } from '../../ItemConfiguration.const';

export const TextResponse = <T extends FieldValues>({
  name,
  maxCharacters,
}: TextResponseProps<T>) => {
  const { t } = useTranslation('app');

  const { control } = useOptionalItemSetup({
    itemType: ItemInputTypes.Text,
    name,
    defaultValue: '',
  });

  useOptionalItemSetup({
    itemType: ItemInputTypes.Text,
    name: maxCharacters,
    defaultValue: DEFAULT_MAX_CHARACTERS,
  });

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
      <InputController name={name} control={control} label={t('correctAnswer')} />
    </ItemOptionContainer>
  );
};
