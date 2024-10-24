import { ItemResponseType } from 'shared/consts';
import { SingleApplet } from 'redux/modules';

import { MixpanelPayload, MixpanelProps } from './mixpanel.types';
import { addFeatureToAnalyticsPayload, trackAppletSave } from './mixpanel.utils';
import { Mixpanel } from './mixpanel';

jest.mock('./mixpanel');

describe('addFeatureToAnalyticsPayload', () => {
  it('should add a feature to an empty payload', () => {
    const payload: MixpanelPayload = {};
    const feature = 'newFeature';

    addFeatureToAnalyticsPayload(payload, feature);

    expect(payload[MixpanelProps.Feature]).toEqual([feature]);
  });

  it('should add a feature to an existing payload', () => {
    const payload: MixpanelPayload = {
      [MixpanelProps.Feature]: ['existingFeature'],
    };
    const feature = 'newFeature';

    addFeatureToAnalyticsPayload(payload, feature);

    expect(payload[MixpanelProps.Feature]).toEqual(['existingFeature', 'newFeature']);
  });

  it('should handle undefined features array', () => {
    const payload: MixpanelPayload = {
      [MixpanelProps.Feature]: undefined,
    };
    const feature = 'newFeature';

    addFeatureToAnalyticsPayload(payload, feature);

    expect(payload[MixpanelProps.Feature]).toEqual([feature]);
  });
});

describe('trackAppletSave', () => {
  it('should not track if applet is not provided', () => {
    trackAppletSave({ action: 'save' });

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

    trackAppletSave({ action: 'save', applet });

    expect(Mixpanel.track).toHaveBeenCalledWith('save', {
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

    trackAppletSave({ action: 'save', applet });

    expect(Mixpanel.track).toHaveBeenCalledWith('save', {
      [MixpanelProps.AppletId]: 'applet1',
      [MixpanelProps.ItemTypes]: [ItemResponseType.PhrasalTemplate],
      [MixpanelProps.Feature]: ['SSI'],
    });
  });

  it('should merge additional payload properties', () => {
    const applet = {
      id: 'applet1',
      activities: [
        {
          items: [{ responseType: ItemResponseType.Text }],
        },
      ],
    } as SingleApplet;
    const additionalPayload: MixpanelPayload = { Via: 'customValue' };

    trackAppletSave({ action: 'save', applet, payload: additionalPayload });

    expect(Mixpanel.track).toHaveBeenCalledWith('save', {
      [MixpanelProps.AppletId]: 'applet1',
      [MixpanelProps.ItemTypes]: [ItemResponseType.Text],
      Via: 'customValue',
    });
  });
});
