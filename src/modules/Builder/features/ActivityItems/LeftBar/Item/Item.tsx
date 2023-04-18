import { useFormContext } from 'react-hook-form';

import { Actions, Svg } from 'shared/components';
import { itemsTypeIcons } from 'shared/consts';
import { StyledFlexTopCenter } from 'shared/styles/styledComponents';

import { getActions } from './Item.const';
import {
  StyledCol,
  StyledItem,
  StyledDescription,
  StyledTitle,
  StyledActionButton,
} from './Item.styles';
import { ItemProps } from './Item.types';
import { getItemKey } from '../../ActivityItems.utils';

export const Item = ({
  item,
  name,
  index,
  activeItemId,
  onSetActiveItem,
  onDuplicateItem,
  onRemoveItem,
}: ItemProps) => {
  const { setValue, watch, getFieldState } = useFormContext();

  const hidden = watch(`${name}.isHidden`);
  const hiddenProps = { sx: { opacity: hidden ? 0.38 : 1 } };

  const { invalid } = getFieldState(name);

  const onChangeVisibility = () => setValue(`${name}.isHidden`, !hidden);

  return (
    <StyledItem
      isActive={activeItemId === getItemKey(item)}
      hasError={invalid}
      hidden={hidden}
      onClick={() => onSetActiveItem(getItemKey(item) ?? '')}
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
          items={getActions({
            onRemoveItem,
            onDuplicateItem: () => onDuplicateItem(index),
            onChangeVisibility,
          })}
          context={getItemKey(item)}
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
