import { useEffect } from 'react';
import { useWatch } from 'react-hook-form';

import { useCustomFormContext } from 'modules/Builder/hooks';
import {
  StyledFlexColumn,
  StyledFlexTopCenter,
  StyledLabelBoldLarge,
  theme,
  variables,
} from 'shared/styles';

import { StyledMark } from './TitleComponent.styles';
import { TitleComponentProps } from './TitleComponent.types';
import { getErrorMessages } from './TitleComponent.utils';

export const TitleComponent = ({ title, name, open }: TitleComponentProps) => {
  const { getFieldState, trigger } = useCustomFormContext();
  const errorObject = getFieldState(name).error as Record<string, unknown>;
  const entitiesField = name.split('.').slice(0, -1).join('.');
  const entities = useWatch({ name: entitiesField }) ?? [];
  const hasErrors = !!errorObject;
  const errorMessages = hasErrors ? getErrorMessages(errorObject) : [];
  const isShowErrors = !open && errorMessages.length > 0;

  useEffect(() => {
    if (open) return;
    trigger(`${name}.name`);
  }, [entities.length, name, trigger, open]);

  return (
    <StyledFlexColumn sx={{ m: theme.spacing(0, 5, 0, 3), overflow: 'hidden' }}>
      <StyledFlexTopCenter>
        {hasErrors && <StyledMark />}
        {title}
      </StyledFlexTopCenter>
      {isShowErrors &&
        errorMessages.map(({ key, message }) => (
          <StyledLabelBoldLarge sx={{ color: variables.palette.error }} key={key}>
            {message}
          </StyledLabelBoldLarge>
        ))}
    </StyledFlexColumn>
  );
};
