import { useState } from 'react';

import { StyledClearedButton, theme } from 'shared/styles';
import { Svg } from 'shared/components/Svg';
import { Switch } from 'shared/components/Switch';

import { StyledCollapseHeader } from './Collapse.styles';
import { CollapseProps, CollapseTypes } from './Collapse.types';
import { COLLAPSE_COMPONENT_BY_UI_TYPE } from './Collapse.const';

const commonCollapseProps = {
  timeout: 0,
  collapsedSize: '8rem',
  uiType: CollapseTypes.Default,
};

const commonButtonStyles = {
  p: theme.spacing(1),
  mr: theme.spacing(0.2),
};

export const Collapse = ({
  defaultOpen = true,
  HeaderContent,
  Content,
  uiType = CollapseTypes.Default,
  ...collapseProps
}: CollapseProps) => {
  const [open, setOpen] = useState(defaultOpen);

  const onArrowClick = () => setOpen((prevOpen) => !prevOpen);

  const ContainerComponent = COLLAPSE_COMPONENT_BY_UI_TYPE[uiType];

  const isDefault = uiType === CollapseTypes.Default;

  return (
    <ContainerComponent {...commonCollapseProps} in={open} {...collapseProps}>
      <StyledCollapseHeader isExpanded={open}>
        {isDefault ? (
          <StyledClearedButton onClick={onArrowClick} sx={commonButtonStyles}>
            <Svg id={open ? 'navigate-up' : 'navigate-down'} />
          </StyledClearedButton>
        ) : (
          <Switch checked={open} onChange={() => setOpen((prevOpen) => !prevOpen)} />
        )}
        {HeaderContent && <HeaderContent open={open} />}
      </StyledCollapseHeader>
      {Content && <Content open={open} />}
    </ContainerComponent>
  );
};
