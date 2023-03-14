import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import 'md-editor-rt/lib/style.css';

import { Svg } from 'shared/components';
import { CheckboxController } from 'shared/components/FormComponents';

import {
  StyledItemContainer,
  StyledItemHeader,
  StyledNavigateSvg,
  StyledMdEditor,
  StyledItemContent,
} from './Item.styles';
import { ItemProps } from './Item.types';
import { renderItemContent } from './Item.utils';

export const Item = ({ item, appletId, activityId }: ItemProps) => {
  const { control } = useFormContext();
  const [itemVisible, setItemVisible] = useState(false);

  return (
    <StyledItemContainer>
      <CheckboxController
        name={`${appletId}.${activityId}.${item.id}`}
        control={control}
        label={<></>}
      />
      <StyledItemHeader onClick={() => setItemVisible((prevState) => !prevState)}>
        <StyledNavigateSvg>
          <Svg id={itemVisible ? 'navigate-up' : 'navigate-right'} />
        </StyledNavigateSvg>
        <StyledMdEditor modelValue={item.question} previewOnly />
      </StyledItemHeader>
      {itemVisible && <StyledItemContent>{renderItemContent(item)}</StyledItemContent>}
    </StyledItemContainer>
  );
};
