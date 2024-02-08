import i18n from 'i18n';
import { StyledBodyLarge } from 'shared/styles/styledComponents/Typography';
import { variables } from 'shared/styles/variables';

import { GetTextAdornment } from './Input.types';

const { t } = i18n;

export const getTextAdornment = ({ value, textAdornment, disabled }: GetTextAdornment) => {
  if (!textAdornment || (!value && value !== 0)) return null;

  return (
    <StyledBodyLarge sx={{ color: disabled ? variables.palette.disabled : variables.palette.on_surface }}>
      {t(textAdornment, { count: value })}
    </StyledBodyLarge>
  );
};
