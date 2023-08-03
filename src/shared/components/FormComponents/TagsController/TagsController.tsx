import { useState } from 'react';
import { Controller, FieldValues } from 'react-hook-form';

import { Svg } from 'shared/components/Svg';
import { Chip, ChipShape } from 'shared/components/Chip';
import {
  StyledBodyLarge,
  StyledClearedButton,
  StyledFlexTopCenter,
  StyledFlexWrap,
  theme,
  variables,
} from 'shared/styles';

import { TagsInputControllerProps, UiType } from './TagsController.types';
import { StyledTextField } from './TagsController.styles';

export const TagsController = <T extends FieldValues>({
  name,
  control,
  error: providedError,
  helperText,
  tags,
  onAddTagClick,
  onRemoveTagClick,
  uiType = UiType.Primary,
  inputLabel,
  ...props
}: TagsInputControllerProps<T>) => {
  const [isFocused, setIsFocused] = useState(false);
  const isPrimaryUiType = uiType === UiType.Primary;
  const isSecondaryUiType = uiType === UiType.Secondary;
  const chips = tags?.length > 0 && (
    <>
      {tags.map((tag, index) => (
        <Chip
          shape={isPrimaryUiType ? ChipShape.Rectangular : ChipShape.Rounded}
          color={isPrimaryUiType ? 'secondary' : 'primary'}
          key={index}
          title={tag}
          onRemove={() => onRemoveTagClick(index)}
          sxProps={isSecondaryUiType ? { m: theme.spacing(0.2) } : null}
        />
      ))}
    </>
  );

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <>
          <StyledTextField
            {...props}
            isSecondaryUiType={isSecondaryUiType}
            onBlur={() => {
              onAddTagClick(value);
              setIsFocused(false);
            }}
            onFocus={() => setIsFocused(true)}
            onChange={onChange}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                onAddTagClick(value);
              }
            }}
            error={!!error || providedError}
            helperText={error?.message || helperText}
            value={value}
            InputProps={{
              startAdornment: isSecondaryUiType && (
                <>
                  <StyledFlexTopCenter className="email" sx={{ mr: theme.spacing(1) }}>
                    <Svg id="email-outlined" />
                  </StyledFlexTopCenter>
                  {inputLabel && !isFocused && !tags?.length && !value && (
                    <StyledBodyLarge color={variables.palette.outline}>
                      {inputLabel}
                    </StyledBodyLarge>
                  )}
                  {chips}
                </>
              ),
              endAdornment: isPrimaryUiType && (
                <StyledClearedButton onClick={() => onAddTagClick(value)}>
                  <Svg id="check" />
                </StyledClearedButton>
              ),
            }}
          />
          {isPrimaryUiType && <StyledFlexWrap>{chips}</StyledFlexWrap>}
        </>
      )}
    />
  );
};
