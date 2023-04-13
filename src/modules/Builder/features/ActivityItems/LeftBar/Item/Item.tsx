import { useFormContext, useFormState } from 'react-hook-form';

import { Actions, Svg } from 'shared/components';
import { itemsTypeIcons } from 'shared/consts';
import { StyledFlexTopCenter } from 'shared/styles/styledComponents';
import { variables } from 'shared/styles/variables';

import { getActions } from './Item.const';
import {
  StyledCol,
  StyledItem,
  StyledDescription,
  StyledTitle,
  StyledActionButton,
} from './Item.styles';
import { ItemProps } from './Item.types';

export const Item = ({ item, name, activeItemId, onSetActiveItem, onRemoveItem }: ItemProps) => {
  const { setValue, watch, getFieldState } = useFormContext();

  const hidden = watch(`${name}.isHidden`);
  const hiddenProps = { sx: { opacity: hidden ? 0.38 : 1 } };

  const { invalid, error } = getFieldState(name);

  const onChangeVisibility = () => setValue(`${name}.isHidden`, !hidden);

  console.log(name, invalid, error);

  return (
    <StyledItem
      sx={{
        backgroundColor: activeItemId === item.id ? variables.palette.secondary_container : '',
      }}
      onClick={() => onSetActiveItem(item.id ?? '')}
      hidden={hidden}
    >
      <StyledFlexTopCenter {...hiddenProps}>
        {item.responseType ? itemsTypeIcons[item.responseType] : ''}
      </StyledFlexTopCenter>
      <StyledCol {...hiddenProps}>
        <StyledTitle>{item.name}</StyledTitle>
        <StyledDescription>{item.question}</StyledDescription>
      </StyledCol>
      <div className="actions">
        <Actions
          items={getActions({ onRemoveItem, onChangeVisibility })}
          context={item.id}
          visibleByDefault
        />
      </div>
      {hidden && (
        <StyledActionButton onClick={onChangeVisibility}>
          <Svg id="visibility-off" />
        </StyledActionButton>
      )}
      <span className="dots">
        <Svg id="dots" />
      </span>
    </StyledItem>
  );
};
