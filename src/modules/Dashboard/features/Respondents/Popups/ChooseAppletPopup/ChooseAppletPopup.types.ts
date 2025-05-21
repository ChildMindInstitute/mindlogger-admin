import { Dispatch, SetStateAction } from 'react';

import { ChosenAppletData } from 'modules/Dashboard/features/index';
import { ParticipantDetail } from 'modules/Dashboard/types';

export type ChooseAppletPopupProps = {
  /**
   * User ID of the respondent
   */
  respondentId: string;

  /**
   * User ID of the applet owner
   */
  appletOwnerId: string;

  /**
   * A subset of the list of applets this respondent has access to. Filter this list before
   * passing it in here.
   */
  appletAccesses: ParticipantDetail[];

  /**
   * Whether the modal should be shown
   */
  popupVisible: boolean;

  /**
   * A set state handler dispatch function to update the modal's visibility
   */
  setPopupVisible: Dispatch<SetStateAction<boolean>>;

  /**
   * This function will be called when the popup is closed, which can happen when the user exits the
   * flow by clicking the X button or when they select an applet. At this point the modal is no
   * longer visible, so you do not need to manually hide it.
   * @param chosenApplet The chosen applet data or null if the user closed the popup without
   * selecting an applet.
   */
  handleClose: (chosenApplet: ChosenAppletData | null) => void;

  /**
   * Test ID prefix for testing. Precedes the suffix `-choose-applet-popup`
   */
  dataTestid?: string;
};
