import { useState } from 'react';

import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import { Modal } from 'shared/components/Modal';
import { Svg } from 'shared/components/Svg';
import { StyledTitleMedium, StyledTitleSmall } from 'shared/styles/styledComponents';
import { variables } from 'shared/styles/variables';

import { SelectLanguageProps } from './SelectLanguage.types';
import {
  StyledList,
  StyledListItemButton,
  StyledItemContent,
  StyledBox,
  StyledSelect,
} from './SelectLanguage.styles';
import { languages } from '../Language.const';

const dataTestid = 'select-language-popup';

export const SelectLanguage = ({ onClose, open, currentLanguage }: SelectLanguageProps) => {
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
      width="42"
      data-testid={dataTestid}
    >
      <StyledList>
        {languages.map((lang) => (
          <StyledListItemButton
            key={lang.value}
            selected={selectedLanguage.value === lang.value}
            onClick={() => setSelectedLanguage(lang)}
            data-testid={`${dataTestid}-${lang.value}`}
          >
            <StyledItemContent>
              <Box>{lang.component}</Box>
              <StyledBox>
                <StyledTitleMedium color={variables.palette.on_secondary_container}>
                  {lang.label}
                </StyledTitleMedium>
                <StyledTitleSmall>{lang.type}</StyledTitleSmall>
              </StyledBox>
            </StyledItemContent>
            {selectedLanguage.value === lang.value && (
              <StyledSelect data-testid={`${dataTestid}-selected`}>
                <Svg id="selected" />
              </StyledSelect>
            )}
          </StyledListItemButton>
        ))}
      </StyledList>
    </Modal>
  );
};
