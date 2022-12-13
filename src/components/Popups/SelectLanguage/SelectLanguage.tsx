import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import { Svg } from 'components/Svg';
import { Modal } from 'components/Popups';
import { StyledTitleMedium, StyledTitleSmall } from 'styles/styledComponents/Typography';
import { variables } from 'styles/variables';

import { SelectLanguageProps } from './SelectLanguage.types';
import {
  StyledList,
  StyledListItemButton,
  StyledItemContent,
  StyledBox,
  StyledSelect,
} from './SelectLanguage.styles';

export const SelectLanguage = ({
  onClose,
  open,
  currentLanguage,
  languages,
}: SelectLanguageProps) => {
  const { t } = useTranslation('app');

  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);

  return (
    <Modal
      open={open}
      onClose={() => onClose()}
      onSubmit={() => onClose(selectedLanguage)}
      title={t('chooseLanguage')}
      titleAlign="center"
      buttonText={t('ok')}
    >
      <StyledList>
        {languages.map((lang) => (
          <StyledListItemButton
            key={lang.value}
            selected={selectedLanguage.value === lang.value}
            onClick={() => setSelectedLanguage(lang)}
          >
            <StyledItemContent>
              <Box>{lang.component}</Box>
              <StyledBox>
                <StyledTitleMedium
                  fontWeight={'regular'}
                  color={variables.palette.on_secondary_container}
                >
                  {lang.label}
                </StyledTitleMedium>
                <StyledTitleSmall fontWeight={'regular'}>{lang.type}</StyledTitleSmall>
              </StyledBox>
            </StyledItemContent>
            {selectedLanguage.value === lang.value && (
              <StyledSelect>
                <Svg id="selected" />
              </StyledSelect>
            )}
          </StyledListItemButton>
        ))}
      </StyledList>
    </Modal>
  );
};
