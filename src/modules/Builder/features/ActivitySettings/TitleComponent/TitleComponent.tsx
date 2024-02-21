import { FieldError, useWatch } from 'react-hook-form';
import { useEffect } from 'react';

import {
  StyledFlexColumn,
  StyledFlexTopCenter,
  StyledLabelBoldLarge,
  theme,
  variables,
} from 'shared/styles';
import { useCustomFormContext } from 'modules/Builder/hooks';

import { TitleComponentProps } from './TitleComponent.types';
import { StyledMark } from './TitleComponent.styles';

export const TitleComponent = ({ title, name, open }: TitleComponentProps) => {
  const { getFieldState, trigger } = useCustomFormContext();
  const errorObject = getFieldState(name).error as unknown as Record<string, FieldError>;
  const entitiesField = name.split('.').slice(0, -1).join('.');
  const entities = useWatch({ name: entitiesField });
  const hasErrors = !!errorObject;
  const errorMessages = hasErrors
    ? Object.keys(errorObject).map((key) => ({
        message: errorObject[key].message,
        key,
      }))
    : [];
  const isShowErrors = !open && errorMessages.length > 0;

  useEffect(() => {
    trigger(name);
  }, [entities.length]);

  return (
    <StyledFlexColumn sx={{ m: theme.spacing(0, 5, 0, 3), overflow: 'hidden' }}>
      <StyledFlexTopCenter sx={{ position: 'relative' }}>
        {hasErrors && <StyledMark />}
        {title}
      </StyledFlexTopCenter>
      {isShowErrors &&
        errorMessages.map(({ key, message }) => (
          <StyledLabelBoldLarge sx={{ color: variables.palette.semantic.error }} key={key}>
            {message}
          </StyledLabelBoldLarge>
        ))}
    </StyledFlexColumn>
  );
};
