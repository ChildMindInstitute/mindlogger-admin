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
          items: [
            { responseType: ItemResponseType.Text, name: 'text1' },
            { responseType: ItemResponseType.Date, name: 'date1' },
          ],
        },
      ],
    } as SingleApplet;

    trackAppletSave({ action: MixpanelEventType.AppletSaveClick, applet });

    expect(Mixpanel.track).toHaveBeenCalledWith({
      action: MixpanelEventType.AppletSaveClick,
      [MixpanelProps.AppletId]: 'applet1',
      [MixpanelProps.AutoAssignedActivityCount]: 0,
      [MixpanelProps.AutoAssignedFlowCount]: 0,
      [MixpanelProps.ManuallyAssignedActivityCount]: 1,
      [MixpanelProps.ManuallyAssignedFlowCount]: 0,
      [MixpanelProps.ItemTypes]: [ItemResponseType.Text, ItemResponseType.Date],
      [MixpanelProps.ItemCount]: 2,
      [MixpanelProps.PhraseBuilderItemCount]: 0,
      [MixpanelProps.ItemsIncludedInPhraseBuilders]: 0,
      [MixpanelProps.AverageItemsPerPhraseBuilder]: null,
    });
  });

  it('should add SSI feature if PhrasalTemplate is present', () => {
    const applet = {
      id: 'applet1',
      activities: [
        {
          items: [
            {
              responseType: ItemResponseType.PhrasalTemplate,
              name: 'phrase1',
              responseValues: { phrases: [] },
            },
          ],
        },
      ],
    } as unknown as SingleApplet;

    trackAppletSave({ action: MixpanelEventType.AppletSaveClick, applet });

    expect(Mixpanel.track).toHaveBeenCalledWith({
      action: MixpanelEventType.AppletSaveClick,
      [MixpanelProps.AppletId]: 'applet1',
      [MixpanelProps.AutoAssignedActivityCount]: 0,
      [MixpanelProps.AutoAssignedFlowCount]: 0,
      [MixpanelProps.ManuallyAssignedActivityCount]: 1,
      [MixpanelProps.ManuallyAssignedFlowCount]: 0,
      [MixpanelProps.ItemTypes]: [ItemResponseType.PhrasalTemplate],
      [MixpanelProps.ItemCount]: 1,
      [MixpanelProps.PhraseBuilderItemCount]: 1,
      [MixpanelProps.ItemsIncludedInPhraseBuilders]: 0,
      [MixpanelProps.AverageItemsPerPhraseBuilder]: 0,
      [MixpanelProps.Feature]: ['SSI'],
    });
  });

  it('should include correct item count stats related to phrase builders', () => {
    const applet = {
      id: 'applet1',
      activities: [
        {
          items: [
            { responseType: ItemResponseType.Text, name: 'text1' },
            { responseType: ItemResponseType.Date, name: 'date1' },
          ],
        },
        {
          items: [
            { responseType: ItemResponseType.Text, name: 'text1' },
            {
              responseType: ItemResponseType.PhrasalTemplate,
              name: 'phrase1',
              responseValues: {
                phrases: [{ fields: [{ type: 'item_response', itemName: 'text1' }] }],
              },
            },
            { responseType: ItemResponseType.Text, name: 'text2' },
            {
              responseType: ItemResponseType.PhrasalTemplate,
              name: 'phrase2',
              responseValues: {
                phrases: [
                  {
                    fields: [
                      { type: 'item_response', itemName: 'text1' },
                      { type: 'item_response', itemName: 'text1' },
                      { type: 'item_response', itemName: 'text2' },
                    ],
                  },
                ],
              },
            },
          ],
        },
      ],
    } as unknown as SingleApplet;

    trackAppletSave({ action: MixpanelEventType.AppletSaveClick, applet });

    expect(Mixpanel.track).toHaveBeenCalledWith({
      action: MixpanelEventType.AppletSaveClick,
      [MixpanelProps.AppletId]: 'applet1',
      [MixpanelProps.AutoAssignedActivityCount]: 0,
      [MixpanelProps.AutoAssignedFlowCount]: 0,
      [MixpanelProps.ManuallyAssignedActivityCount]: 2,
      [MixpanelProps.ManuallyAssignedFlowCount]: 0,
      [MixpanelProps.ItemTypes]: [
        ItemResponseType.Text,
        ItemResponseType.Date,
        ItemResponseType.PhrasalTemplate,
      ],
      [MixpanelProps.ItemCount]: 6,
      [MixpanelProps.PhraseBuilderItemCount]: 2,
      [MixpanelProps.ItemsIncludedInPhraseBuilders]: 3,
      [MixpanelProps.AverageItemsPerPhraseBuilder]: 1.5,
      [MixpanelProps.Feature]: ['SSI'],
    });
  });
});
