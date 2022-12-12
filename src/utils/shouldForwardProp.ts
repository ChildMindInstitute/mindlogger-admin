import isPropValid from '@emotion/is-prop-valid';

export const shouldForwardProp = {
  shouldForwardProp: (prop: string | PropertyKey) => typeof prop === 'string' && isPropValid(prop),
};
