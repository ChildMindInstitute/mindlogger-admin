import { Controller, FieldValues } from 'react-hook-form';

import { Svg } from 'components/Svg';
import { Chip } from 'components/Chip';
import { StyledClearedButton } from 'styles/styledComponents/ClearedButton';
import { StyledFlexWrap } from 'styles/styledComponents/Flex';

import { TagsInputControllerProps, UiType } from './TagsController.types';
import { StyledTextField } from './TagsController.styles';

export const TagsController = <T extends FieldValues>({
  name,
  control,
  tags,
  onAddTagClick,
  onRemoveTagClick,
  uiType = UiType.primary,
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
      render={({ field: { onChange, value } }) => (
        <>
          <StyledTextField
            {...props}
            onChange={onChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onAddTagClick(value);
              }
            }}
            value={value}
            InputProps={{
              startAdornment: uiType === UiType.secondary && chips,
              endAdornment: (
                <StyledClearedButton onClick={() => onAddTagClick(value)}>
                  <Svg id="check" />
                </StyledClearedButton>
              ),
            }}
          />
          {uiType === UiType.primary && <StyledFlexWrap>{chips}</StyledFlexWrap>}
        </>
      )}
    />
  );
};
