import { useTranslation } from 'react-i18next';
import { FieldValues } from 'react-hook-form';
import { Box } from '@mui/material';

import { Svg } from 'components';
import { CheckboxController } from 'components/FormComponents';
import {
  StyledLabelBoldLarge,
  StyledLabelLarge,
  StyledClearedButton,
} from 'styles/styledComponents';
import { variables } from 'styles/variables';
import theme from 'styles/theme';

import {
  StyledTextInputOptionContainer,
  StyledTextInputOptionHeader,
  StyledTextInputOptionDescription,
} from './TextInputOption.styles';
import { TextInputOptionProps } from './TextInputOption.types';

export const TextInputOption = <T extends FieldValues>({
  name,
  control,
  onRemove,
}: TextInputOptionProps<T>) => {
  const { t } = useTranslation('app');

  return (
    <StyledTextInputOptionContainer>
      <StyledTextInputOptionHeader>
        <StyledLabelBoldLarge>{t('textInputOptionLabel')}</StyledLabelBoldLarge>
        <StyledClearedButton
          sx={{ p: theme.spacing(1), mr: theme.spacing(0.2) }}
          onClick={onRemove}
        >
          <Svg id="trash" width="20" height="20" />
        </StyledClearedButton>
      </StyledTextInputOptionHeader>
      <StyledTextInputOptionDescription>
        <StyledLabelLarge sx={{ opacity: '0.38', color: variables.palette.outline }}>
          {t('textInputOptionDescription')}
        </StyledLabelLarge>
      </StyledTextInputOptionDescription>
      <Box sx={{ marginTop: theme.spacing(0.7) }}>
        <CheckboxController
          name={name}
          control={control}
          label={<StyledLabelLarge>{t('textInputOptionRequired')}</StyledLabelLarge>}
        />
      </Box>
    </StyledTextInputOptionContainer>
  );
};
