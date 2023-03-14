import isPropValid from '@emotion/is-prop-valid';

export const shouldForwardProp = {
  shouldForwardProp: (prop: string) => {
    if (prop === 'TabIndicatorProps') return true;

    return typeof prop === 'string' && isPropValid(prop);
  },
};
