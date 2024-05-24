import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import { generatePath, useNavigate, useParams } from 'react-router-dom';

import { Search, Svg } from 'shared/components';
import { theme, variables, StyledModalContent, StyledIconButton } from 'shared/styles';
import { page } from 'resources';
import { getRespondentName, getErrorMessage } from 'shared/utils';
import { useAsync } from 'shared/hooks/useAsync';
import { createIndividualEventsApi } from 'api';
import { applets, users } from 'modules/Dashboard/state';
import { useAppDispatch } from 'redux/store/hooks';
import { workspaces } from 'shared/state';

import { AddIndividualSchedulePopup } from '../../AddIndividualSchedulePopup';
import { SelectedRespondent } from '../Legend.types';
import { ScheduleOptions } from '../Legend.const';
import {
  StyledModal,
  StyledModalInner,
  StyledItemsContainer,
  StyledItem,
  StyledChecked,
} from './SearchPopup.styles';
import { SearchPopupProps } from './SearchPopup.types';
import { filterRows } from './SearchPopup.utils';

export const SearchPopup = ({
  open,
  setSearchPopupVisible,
  setSchedule,
  top,
  left,
  setSelectedRespondent,
  selectedRespondent,
  respondentsItems,
  'data-testid': dataTestid,
}: SearchPopupProps) => {
  const { t } = useTranslation('app');
  const navigate = useNavigate();
  const { appletId } = useParams();
  const dispatch = useAppDispatch();
  const { ownerId } = workspaces.useData() || {};
  const {
    execute: createIndividualEvents,
    error,
    isLoading,
  } = useAsync(createIndividualEventsApi, () => {
    if (!appletId) return;
    selectedRespondent &&
      dispatch(applets.thunk.getEvents({ appletId, respondentId: selectedRespondent.id }));
    ownerId &&
      dispatch(
        users.thunk.getAllWorkspaceRespondents({
          params: { ownerId, appletId },
        }),
      );
  });

  const [searchValue, setSearchValue] = useState('');
  const [addIndividualSchedulePopupVisible, setAddIndividualSchedulePopupVisible] = useState(false);

  const respondentName = getRespondentName(
    selectedRespondent?.secretId || '',
    selectedRespondent?.nickname,
  );

  const handleSearchPopupClose = () => {
    !selectedRespondent && setSchedule(ScheduleOptions.DefaultSchedule);
    setSearchPopupVisible(false);
  };

  const selectedRespondentHandler = (item: SelectedRespondent) => {
    const { id: respondentId, hasIndividualSchedule } = item || {};
    setSelectedRespondent(item);
    if (hasIndividualSchedule) {
      navigate(
        generatePath(page.appletScheduleIndividual, {
          appletId,
          respondentId,
        }),
      );
    } else {
      setAddIndividualSchedulePopupVisible(true);
    }
    setSearchPopupVisible(false);
  };

  const filteredRespondents = respondentsItems
    ?.filter(
      (item) => filterRows(item?.secretId, searchValue) || filterRows(item?.nickname, searchValue),
    )
    .sort((a, b) => (a?.secretId ?? '').localeCompare(b?.secretId ?? ''));

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  const handleAddIndividualScheduleSubmit = async () => {
    const { id: respondentId } = selectedRespondent || {};
    if (!appletId || !respondentId) return;

    await createIndividualEvents({ appletId, respondentId });
    navigate(
      generatePath(page.appletScheduleIndividual, {
        appletId,
        respondentId,
      }),
    );
    setAddIndividualSchedulePopupVisible(false);
  };

  const handleAddIndividualScheduleClose = () => {
    setAddIndividualSchedulePopupVisible(false);
    setSearchPopupVisible(true);
    setSelectedRespondent(null);
  };

  return (
    <>
      <StyledModal
        style={{ top, left }}
        open={open}
        onClose={handleSearchPopupClose}
        data-testid={dataTestid}
      >
        <StyledModalInner>
          <StyledModalContent>
            <Box>
              <Search
                height="6.4rem"
                width="100%"
                background={variables.palette.surface2}
                placeholder={t('searchOrSelectRespondent')}
                endAdornment={
                  <StyledIconButton
                    onClick={handleSearchPopupClose}
                    data-testid={`${dataTestid}-close-button`}
                  >
                    <Svg id="cross" width="4rem" />
                  </StyledIconButton>
                }
                onSearch={handleSearch}
                data-testid={`${dataTestid}-search`}
              />
            </Box>

            <StyledItemsContainer>
              {filteredRespondents?.map((item, index) => {
                const { id, secretId, nickname, icon } = item || {};
                const isSelected = id === selectedRespondent?.id;

                return (
                  <StyledItem
                    key={id}
                    background={isSelected ? variables.palette.surface_variant : undefined}
                    onClick={() => selectedRespondentHandler(item)}
                    data-testid={`${dataTestid}-respondent-${index}`}
                  >
                    {icon || <Box sx={{ width: '2.4rem' }} />}
                    <Box sx={{ ml: theme.spacing(1.8) }}>
                      <strong>{secretId}</strong>
                      {nickname ? ` (${nickname})` : ''}
                    </Box>
                    {isSelected && (
                      <StyledChecked>
                        <Svg id="check" />
                      </StyledChecked>
                    )}
                  </StyledItem>
                );
              })}
            </StyledItemsContainer>
          </StyledModalContent>
        </StyledModalInner>
      </StyledModal>
      {addIndividualSchedulePopupVisible && (
        <AddIndividualSchedulePopup
          open={addIndividualSchedulePopupVisible}
          onClose={handleAddIndividualScheduleClose}
          onSubmit={handleAddIndividualScheduleSubmit}
          respondentName={respondentName}
          error={error ? getErrorMessage(error) : null}
          isLoading={isLoading}
          data-testid={`${dataTestid}-add-inividual-schedule-popup`}
        />
      )}
    </>
  );
};
