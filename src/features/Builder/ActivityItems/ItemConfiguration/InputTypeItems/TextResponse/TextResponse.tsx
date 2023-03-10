import { useTranslation } from 'react-i18next';
import { FieldValues } from 'react-hook-form';

import { InputController } from 'components/FormComponents';

import { ItemOptionContainer } from '../ItemOptionContainer';
import { TextResponseProps } from './TextResponse.types';
import { StyledColumn } from '../InputTypeItems.styles';
import { StyledMaxCharacters, StyledRow, StyledTextField } from './TextResponse.styles';

export const TextResponse = <T extends FieldValues>({
  name,
  maxCharacters,
  control,
}: TextResponseProps<T>) => {
  const { t } = useTranslation('app');

  return (
    <ItemOptionContainer title={t('textResponseTitle')} description={t('textResponseDescription')}>
      <StyledColumn>
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
      </StyledColumn>
    </ItemOptionContainer>
  );
};
