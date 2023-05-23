import { Controller, FieldValues } from 'react-hook-form';

import { Svg } from 'shared/components/Svg';
import { Chip } from 'shared/components/Chip';
import { StyledFlexWrap, StyledClearedButton } from 'shared/styles/styledComponents';

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
  ...props
}: TagsInputControllerProps<T>) => {
  const chips = tags?.length > 0 && (
    <>
      {tags.map((tag, index) => (
        <Chip color="secondary" key={index} title={tag} onRemove={() => onRemoveTagClick(index)} />
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
            onBlur={() => onAddTagClick(value)}
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
              startAdornment: uiType === UiType.Secondary && chips,
              endAdornment: (
                <StyledClearedButton onClick={() => onAddTagClick(value)}>
                  <Svg id="check" />
                </StyledClearedButton>
              ),
            }}
          />
          {uiType === UiType.Primary && <StyledFlexWrap>{chips}</StyledFlexWrap>}
        </>
      )}
    />
  );
};
