import i18n from 'i18n';
import { StyledBodyLarge } from 'shared/styles/styledComponents/Typography';

const { t } = i18n;

export const getTextAdornment = (value: number, textAdornment?: string) => {
  if (!textAdornment || (!value && value !== 0)) return null;

  return <StyledBodyLarge>{t(textAdornment, { count: value })} </StyledBodyLarge>;
};
