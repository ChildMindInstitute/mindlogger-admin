import { useFormContext } from 'react-hook-form';
import { useTranslation, Trans } from 'react-i18next';

import { Actions as CommonActions } from 'shared/components';
import { StyledFlexTopCenter, StyledTitleMedium } from 'shared/styles';
import { getEntityKey } from 'shared/utils';
import { useCurrentActivity } from 'modules/Builder/hooks';
import { ItemFormValues } from 'modules/Builder';

import { ActionsProps } from './Actions.types';
import { getActions } from './Actions.utils';

export const Actions = ({ open, name, onAdd, onRemove, onToggle }: ActionsProps) => {
  const { t } = useTranslation('app');
  const { fieldName } = useCurrentActivity();
  const { watch } = useFormContext();

  const items = watch(`${fieldName}.items`);
  const selectedItem = watch(`${name}.itemKey`);
  const selectedMatch = watch(`${name}.match`);
  const currentItem = items?.find((item: ItemFormValues) => getEntityKey(item) === selectedItem);

  const isShowDescription = !open && selectedMatch && currentItem;

  const handleAdd = () => {
    onAdd();
    !open && onToggle();
  };

  return (
    <StyledFlexTopCenter sx={{ flex: '1', justifyContent: 'flex-end' }}>
      {isShowDescription && (
        <StyledTitleMedium sx={{ flex: '1' }}>
          <Trans i18nKey="conditionalLogicPanelTitle">
            If
            <strong>
              {' '}
              <>{{ match: t(selectedMatch) }}</>{' '}
            </strong>
            of the “if” rules below are
            <strong>
              {' '}
              true, show item: <>{{ name: currentItem.name }}</>
            </strong>
          </Trans>
        </StyledTitleMedium>
      )}
      <CommonActions
        items={getActions({ onAdd: handleAdd, onRemove })}
        context={name}
        visibleByDefault={open}
        sxProps={{ width: 'unset' }}
      />
    </StyledFlexTopCenter>
  );
};
