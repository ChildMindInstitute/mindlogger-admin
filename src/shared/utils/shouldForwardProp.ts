import isPropValid from '@emotion/is-prop-valid';

export const shouldForwardProp = {
  shouldForwardProp: (prop: string) => {
    if (
      prop === 'TabIndicatorProps' ||
      prop === 'InputProps' ||
      prop === 'error' ||
      prop === 'helperText' ||
      prop === 'anchorEl' ||
      prop === 'anchorOrigin' ||
      prop === 'transformOrigin' ||
      prop === 'MenuListProps'
    )
      return true;

    return typeof prop === 'string' && isPropValid(prop);
  },
};
