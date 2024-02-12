import { useState } from 'react';

import { Controller, FieldValues } from 'react-hook-form';

import { Svg } from 'shared/components/Svg';
import { Chip, ChipShape } from 'shared/components/Chip';
import { StyledClearedButton, StyledFlexTopCenter, StyledFlexWrap, theme } from 'shared/styles';

import { TagsInputControllerProps, UiType } from './TagsController.types';
import { StyledInputLabel, StyledTextField } from './TagsController.styles';

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
  disabled,
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
          onRemove={disabled ? undefined : () => onRemoveTagClick(index)}
          sxProps={
            isSecondaryUiType
              ? { m: theme.spacing(0.2), ...(disabled && { pointerEvents: 'none' }) }
              : null
          }
        />
      ))}
    </>
  );

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const showInputLabel = !!(inputLabel && !isFocused && !tags?.length && !value);

        return (
          <>
            <StyledTextField
              {...props}
              disabled={disabled}
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
              showInputLabel={showInputLabel}
              setMinWidth={!!(isFocused || error)}
              InputProps={{
                startAdornment: isSecondaryUiType && (
                  <>
                    <StyledFlexTopCenter className="email" sx={{ mr: theme.spacing(1) }}>
                      <Svg id="email-outlined" />
                    </StyledFlexTopCenter>
                    {showInputLabel && (
                      <StyledInputLabel showInputLabel={showInputLabel}>
                        {inputLabel}
                      </StyledInputLabel>
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
        );
      }}
    />
  );
};
