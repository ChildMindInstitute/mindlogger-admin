import { useTranslation } from 'react-i18next';
import { FieldValues, UseControllerProps } from 'react-hook-form';
import { Box } from '@mui/material';

import { Svg } from 'components';
import { CheckboxController } from 'components/FormComponents';
import { StyledLabelBoldLarge, StyledLabelLarge } from 'styles/styledComponents';
import { variables } from 'styles/variables';
import theme from 'styles/theme';

import {
  StyledTextInputOptionContainer,
  StyledTextInputOptionHeader,
  StyledTextInputOptionDescription,
} from './TextInputOption.styles';

export const TextInputOption = <T extends FieldValues>({
  name,
  control,
}: UseControllerProps<T>) => {
  const { t } = useTranslation('app');

  return (
    <StyledTextInputOptionContainer>
      <StyledTextInputOptionHeader>
        <StyledLabelBoldLarge>{t('textInputOptionLabel')}</StyledLabelBoldLarge>
        <Svg id="trash" width="20" height="20" />
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
