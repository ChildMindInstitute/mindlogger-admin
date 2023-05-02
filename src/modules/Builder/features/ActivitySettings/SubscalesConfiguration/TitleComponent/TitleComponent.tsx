import { FieldError, useFormContext } from 'react-hook-form';

import {
  StyledFlexColumn,
  StyledFlexTopCenter,
  StyledLabelBoldLarge,
  theme,
  variables,
} from 'shared/styles';

import { TitleComponentProps } from './TitleComponent.types';
import { StyledMark } from './TitleComponent.styles';

export const TitleComponent = ({ title, name, open }: TitleComponentProps) => {
  const { getFieldState } = useFormContext();
  const errorObject = getFieldState(name).error as unknown as Record<string, FieldError>;
  const hasErrors = !!getFieldState(name).error;
  const errorMessages = errorObject
    ? Object.keys(errorObject).map((key) => ({
        message: errorObject[key].message,
        key,
      }))
    : [];
  const isShowErrors = !open && errorMessages.length > 0;

  return (
    <StyledFlexColumn sx={{ m: theme.spacing(0, 5, 0, 3) }}>
      <StyledFlexTopCenter sx={{ position: 'relative' }}>
        {hasErrors && <StyledMark />}
        <StyledLabelBoldLarge>{title}</StyledLabelBoldLarge>
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
