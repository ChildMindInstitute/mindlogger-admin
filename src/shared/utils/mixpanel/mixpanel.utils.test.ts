import { ItemResponseType } from 'shared/consts';
import { SingleApplet } from 'redux/modules';

import { MixpanelEventType, MixpanelFeature, MixpanelProps, WithFeature } from './mixpanel.types';
import { addFeatureToEvent, trackAppletSave } from './mixpanel.utils';
import { Mixpanel } from './mixpanel';

jest.mock('./mixpanel');

describe('addFeatureToEvent', () => {
  it('should add a feature to an empty event', () => {
    const event: WithFeature = {};
    const feature = MixpanelFeature.MultiInformant;

    addFeatureToEvent(event, feature);

    expect(event[MixpanelProps.Feature]).toEqual([feature]);
  });

  it('should add a feature to an existing event', () => {
    const event: WithFeature = {
      [MixpanelProps.Feature]: [MixpanelFeature.SSI],
    };
    const feature = MixpanelFeature.MultiInformant;

    addFeatureToEvent(event, feature);

    expect(event[MixpanelProps.Feature]).toEqual([
      MixpanelFeature.SSI,
      MixpanelFeature.MultiInformant,
    ]);
  });

  it('should handle undefined features array', () => {
    const event: WithFeature = {
      [MixpanelProps.Feature]: undefined,
    };
    const feature = MixpanelFeature.MultiInformant;

    addFeatureToEvent(event, feature);

    expect(event[MixpanelProps.Feature]).toEqual([feature]);
  });
});

describe('trackAppletSave', () => {
  it('should not track if applet is not provided', () => {
    trackAppletSave({ action: MixpanelEventType.AppletSaveClick });

    expect(Mixpanel.track).not.toHaveBeenCalled();
  });

  it('should track with correct properties', () => {
    const applet = {
      id: 'applet1',
      activities: [
        {
          items: [{ responseType: ItemResponseType.Text }, { responseType: ItemResponseType.Date }],
        },
      ],
    } as SingleApplet;

    trackAppletSave({ action: MixpanelEventType.AppletSaveClick, applet });

    expect(Mixpanel.track).toHaveBeenCalledWith({
      action: MixpanelEventType.AppletSaveClick,
      [MixpanelProps.AppletId]: 'applet1',
      [MixpanelProps.ItemTypes]: [ItemResponseType.Text, ItemResponseType.Date],
    });
  });

  it('should add SSI feature if PhrasalTemplate is present', () => {
    const applet = {
      id: 'applet1',
      activities: [
        {
          items: [{ responseType: ItemResponseType.PhrasalTemplate }],
        },
      ],
    } as SingleApplet;

    trackAppletSave({ action: MixpanelEventType.AppletSaveClick, applet });

    expect(Mixpanel.track).toHaveBeenCalledWith({
      action: MixpanelEventType.AppletSaveClick,
      [MixpanelProps.AppletId]: 'applet1',
      [MixpanelProps.ItemTypes]: [ItemResponseType.PhrasalTemplate],
      [MixpanelProps.Feature]: ['SSI'],
    });
  });
});