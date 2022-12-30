import { Controller, FieldValues } from 'react-hook-form';

import { Svg } from 'components/Svg';
import { Chip } from 'components/Chip';
import { StyledClearedButton } from 'styles/styledComponents/ClearedButton';
import { StyledChipsWrapper } from 'styles/styledComponents/ChipsWrapper';

import { TagsInputControllerProps } from './TagsController.types';
import { StyledTextField } from './TagsController.styles';

export const TagsController = <T extends FieldValues>({
  name,
  control,
  tags,
  onAddTagClick,
  onRemoveTagClick,
  ...props
}: TagsInputControllerProps<T>) => (
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
            endAdornment: (
              <StyledClearedButton onClick={() => onAddTagClick(value)}>
                <Svg id="check" />
              </StyledClearedButton>
            ),
          }}
        />
        {tags?.length > 0 && (
          <StyledChipsWrapper>
            {tags.map((tag, index) => (
              <Chip key={index} title={tag} onRemove={() => onRemoveTagClick(index)} />
            ))}
          </StyledChipsWrapper>
        )}
      </>
    )}
  />
);
